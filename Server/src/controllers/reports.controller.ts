import { Request, Response } from "express";
import { prismaClient } from "../prisma";
import { ExtendedRequest } from "../types/users/usersRequests";

export const getAverageCloseTime = async (req: ExtendedRequest, res: Response): Promise<void> => {
  const { organizationId } = req.query;

  if (!organizationId) 
  {
    res.status(400).json({ message: "Missing organizationId" });
    return
  }


  try {
    const calls = await prismaClient.call.findMany({
      where: {
        organizationId: Number(organizationId),
        closedAt: { not: null },
      },
      select: {
        createdAt: true,
        closedAt: true,
      },
    });

    const diffsInMinutes = calls
      .map((c) =>
        c.closedAt && c.createdAt
          ? (new Date(c.closedAt).getTime() - new Date(c.createdAt).getTime()) / 60000
          : null
      )
      .filter((v): v is number => v !== null);

    const avg = diffsInMinutes.length
      ? diffsInMinutes.reduce((sum, v) => sum + v, 0) / diffsInMinutes.length
      : 0;

    res.status(200).json(avg.toFixed(1));
    return
  } catch (error) {
    console.error("Error in getAverageCloseTime:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getTopClosers = async (req: ExtendedRequest, res: Response): Promise<void> => {
  const { organizationId } = req.query;

  if (!organizationId) {
    res.status(400).json({ message: "Missing organizationId" });
    return;
  }

  try {
    const data = await prismaClient.call.groupBy({
      by: ["closedById"],
      where: {
        organizationId: Number(organizationId),
        closedById: { not: null },
      },
      _count: true,
      orderBy: {
        _count: {
          closedById: "desc",
        },
      },
      take: 5,
    });

    const users = await prismaClient.user.findMany({
      where: { id: { in: data.map((d) => d.closedById!) } },
    });

    const result = data.map((entry) => {
      const user = users.find((u) => u.id === entry.closedById);
      return {
        name: user?.name || "Unknown",
        value: Number(entry._count.toString()) || 0,
      };
    });

    res.status(200).json(result);
  } catch (error) {
    console.error("Error in getTopClosers:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getCallsByCategory = async (req: ExtendedRequest, res: Response): Promise<void> => {
  const { organizationId } = req.query;

  if (!organizationId) {
    res.status(400).json({ message: "Missing organizationId" });
    return
  }
     

  try {
    const categories = await prismaClient.callCategory.findMany({
      where: { organizationId: Number(organizationId) },
    });

    const data = await Promise.all(
      categories.map(async (cat) => {
        const count = await prismaClient.call.count({
          where: { callCategoryId: cat.id },
        });

        const name = typeof cat.name === "object"
        //@ts-ignore
          ? (cat.name.he || cat.name.en || cat.name.ar || "Unknown")
          : "Unknown";

        return {
          name,
          value: count,
        };
      })
    );

    res.status(200).json(data);
  } catch (error) {
    console.error("Error in getCallsByCategory:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const getStatusPie = async (req: ExtendedRequest, res: Response): Promise<void> => {
  const { organizationId } = req.query;

  if (!organizationId) {
     res.status(400).json({ message: "Missing organizationId" });
     return
  }


  try {
    const statuses = ["OPENED", "IN_PROGRESS", "COMPLETED", "FAILED", "ON_HOLD"];
    const data = await Promise.all(
      statuses.map(async (status) => {
        const count = await prismaClient.call.count({
          where: {
            organizationId: Number(organizationId),
            status: status as any,
          },
        });
        return { name: status, value: count };
      })
    );

    res.status(200).json(data);
  } catch (error) {
    console.error("Error in getStatusPie:", error);
    res.status(500).json({ message: "Server error" });
  }
};
