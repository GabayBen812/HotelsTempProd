import { prismaClient } from "../../prisma";
import { Request, Response, RequestHandler } from "express";
import { getDynamicData, getUpdatedFields } from "../../utils/dynamicData";
import { ExtendedRequest } from "../../types/users/usersRequests";
import { emitToAuthorizedSockets } from "../../utils/controllerUtils";
import { notifyMultipleUsers } from "../../utils/expo";

export const getCalls: RequestHandler = async (req, res): Promise<any> => {
  return getDynamicData(req as ExtendedRequest, res, {
    model: "call",
    searchFields: [
      { path: "$.he", field: "callCategory.name" },
      { path: "$.en", field: "callCategory.name" },
      { path: "$.he", field: "description" },
      { path: "$.en", field: "description" },
    ],
    include: {
      callCategory: { select: { name: true, id: true, expectedTime: true } },
      assignedTo: { select: { id: true, name: true } },
      createdBy: { select: { id: true, name: true } },
      Department: { select: { name: true, id: true } },
      CallStatusHistory: {
        include: {
          changedBy: { select: { name: true, id: true } },
          assignedTo: { select: { id: true, name: true } },
        },
      },
      closedBy: { select: { id: true, name: true } },
      location: {
        select: {
          name: true,
          id: true,
          area: true,
        },
      },
    },
    defaultSortField: "createdAt",
    filters: [
      "status",
      "callCategoryId",
      "departmentId",
      "locationId",
      "description",
    ],
    departmentWhereClause: (departmentIds) => ({
      departmentId: { in: departmentIds },
    }),
    whereClause: (() => {
      const { createdAtFrom, createdAtTo } = req.query;
      const where: any = {};
      if (createdAtFrom || createdAtTo) {
        where.createdAt = {};
        if (createdAtFrom)
          where.createdAt.gte = new Date(createdAtFrom as string);
        if (createdAtTo) where.createdAt.lte = new Date(createdAtTo as string);
      }
      return where;
    })(),
  });
};

export const createNewCall = async (
  req: ExtendedRequest,
  res: Response
): Promise<any> => {
  try {
    const {
      description,
      locationId,
      assignedToId,
      callCategoryId,
      organizationId,
      departmentId,
    } = req.body;

    // userId comes from auth middleware (e.g., req.user set after auth)
    const userId = req.user?.id;

    // Validate required fields including userId from auth context
    const requiredFields = [
      "description",
      "locationId",
      "callCategoryId",
      "organizationId",
      "departmentId",
    ];

    const missing = requiredFields.filter((field) => !req.body[field]);
    if (!userId) missing.push("userId"); // from req.user

    if (missing.length > 0) {
      return res.status(400).json({
        message: "Missing required parameters",
        missing,
      });
    }

    // Build call data for creation
    const callData: any = {
      description,
      location: { connect: { id: Number(locationId) } },
      callCategory: { connect: { id: Number(callCategoryId) } },
      organizationId: Number(organizationId),
      createdBy: { connect: { id: Number(userId) } },
      status: "OPENED",
      Department: { connect: { id: Number(departmentId) } },
    };

    if (assignedToId) {
      callData.assignedTo = { connect: { id: Number(assignedToId) } };
    }

    // Create call with Prisma
    const call = await prismaClient.call.create({
      data: {
        ...callData,
        // Create initial CallStatusHistory entry
        CallStatusHistory: {
          create: {
            fromStatus: null,
            toStatus: "OPENED",
            changedAt: new Date(),
            changedById: Number(userId),
          },
        },
      },
      include: {
        callCategory: { select: { name: true, id: true, expectedTime: true } },
        assignedTo: { select: { id: true, name: true } },
        createdBy: { select: { id: true, name: true } },
        Department: { select: { name: true, id: true } },
        CallStatusHistory: {
          include: {
            changedBy: { select: { name: true, id: true } },
            assignedTo: { select: { id: true, name: true } },
          },
        },
        closedBy: { select: { id: true, name: true } },
        location: {
          select: {
            name: true,
            id: true,
            area: true,
          },
        },
      },
    });

    // Notify all users in the department
    const usersInDepartment = await prismaClient.user.findMany({
      where: {
        organizationRoles: { some: { departmentId: Number(departmentId) } },
      },
      select: { id: true },
    });

    const userIds = usersInDepartment.map((u) => u.id);

    await notifyMultipleUsers(userIds, {
      title: "New Department Call",
      body: "A new call has been added to your department.",
      data: { departmentId },
    });

    res.status(200).json(call);
  } catch (error) {
    console.error("Error in createNewCall:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateCall = async (
  req: ExtendedRequest,
  res: Response
): Promise<any> => {
  const { id } = req.params;
  const {
    description,
    locationId,
    departmentId,
    createdById,
    assignedToId,
    closedById,
    status,
    callCategoryId,
    organizationId,
  } = req.body;

  try {
    const existingCall = await prismaClient.call.findUnique({
      where: { id: parseInt(id) },
      include: {
        callCategory: true,
        location: true,
        Department: true,
        createdBy: true,
        assignedTo: true,
        closedBy: true,
      },
    });

    if (!existingCall) {
      return res.status(404).json({ message: "Call not found" });
    }

    const updatedFields = getUpdatedFields(existingCall, {
      description,
      locationId,
      departmentId,
      createdById,
      assignedToId,
      closedById,
      status,
      callCategoryId,
      organizationId,
    });

    const statusChanged = status && status !== existingCall.status;

    // Automatically set closedAt if status changed to COMPLETED
    if (status === "COMPLETED" && !existingCall.closedAt) {
      updatedFields.closedAt = new Date().toISOString();
    }

    if (Object.keys(updatedFields).length === 0) {
      return res.status(200).json({ message: "No changes detected" });
    }

    // Update the call
    const updatedCall = await prismaClient.call.update({
      where: { id: parseInt(id) },
      data: updatedFields,
    });

    // If status changed, log the change
    if (statusChanged) {
      await prismaClient.callStatusHistory.create({
        data: {
          callId: updatedCall.id,
          fromStatus: existingCall.status,
          toStatus: updatedCall.status,
          changedAt: new Date(),
          changedById: req?.user!.id,
        },
      });
    }

    // Log assignment change
    const assignedChanged =
      assignedToId !== undefined && assignedToId !== existingCall.assignedToId;

    if (assignedChanged && assignedToId) {
      await prismaClient.callStatusHistory.create({
        data: {
          callId: updatedCall.id,
          fromStatus: updatedCall.status,
          toStatus: updatedCall.status,
          changedAt: new Date(),
          changedById: req?.user!.id,
          assignedToId: Number(assignedToId),
        },
      });
    }

    // Refetch the full call data with latest CallStatusHistory included
    const finalCall = await prismaClient.call.findUnique({
      where: { id: updatedCall.id },
      include: {
        callCategory: { select: { name: true, id: true, expectedTime: true } },
        assignedTo: { select: { id: true, name: true } },
        createdBy: { select: { id: true, name: true } },
        Department: { select: { name: true, id: true } },
        CallStatusHistory: {
          orderBy: { changedAt: "desc" }, // Newest first
          include: {
            changedBy: { select: { name: true, id: true } },
            assignedTo: { select: { id: true, name: true } },
          },
        },
        closedBy: { select: { id: true, name: true } },
        location: {
          select: {
            name: true,
            id: true,
            area: true,
          },
        },
      },
    });

    // Notify users if call is assigned
    if (finalCall?.assignedToId) {
      const userIds = await prismaClient.user.findMany({
        where: {
          organizationRoles: {
            some: { departmentId: finalCall.departmentId },
          },
        },
        select: { id: true },
      });

      const userIdsTransformed = userIds.map((user) => user.id);

      await notifyMultipleUsers(userIdsTransformed, {
        title: "Call assigned to you has been updated",
        //@ts-ignore
        body: `Update in call ${finalCall.callCategory?.name.en}`,
        data: { callId: finalCall.id },
      });
    }

    // Emit the update via sockets
    const io = req.app.get("io");
    await emitToAuthorizedSockets(
      io,
      "call:update",
      finalCall,
      "calls",
      "view"
    );

    res.status(200).json(finalCall);
  } catch (error) {
    console.error("Error in updateCall:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteCall = async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params;

  const parsedId = parseInt(id);
  if (isNaN(parsedId)) return res.status(400).json({ message: "Invalid ID" });

  try {
    const call = await prismaClient.call.findUnique({
      where: { id: parseInt(id) },
    });

    if (!call) return res.status(404).json({ message: "Call not found" });
    await prismaClient.callMessage.deleteMany({
      where: { callId: parseInt(id) },
    });
    await prismaClient.callStatusHistory.deleteMany({
      where: { callId: parseInt(id) },
    });
    await prismaClient.call.delete({
      where: { id: parseInt(id) },
    });

    return res.status(200).json({ message: "Call deleted successfully" });
  } catch (error) {
    console.error("Error in deleteCall:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getCallMessages: RequestHandler = async (req, res) => {
  const { callId } = req.params;
  const messages = await prismaClient.callMessage.findMany({
    where: { callId: Number(callId) },
    include: {
      user: {
        select: {
          name: true,
          id: true,
          logo: true,
          email: true,
          phoneNumber: true,
          userType: true,
        },
      },
    }, // to show sender info
    orderBy: { createdAt: "asc" },
  });
  res.json(messages);
};
