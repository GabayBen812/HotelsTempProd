import { Server, Socket } from "socket.io";
import { prismaClient } from "../prisma";

export const setupSocketHandlers = (io: Server, socket: Socket) => {
  socket.on("joinCallRoom", (callId) => {
    console.log(`Socket ${socket.id} joining call room:`, callId);
    socket.join(`call-${callId}`);
  });

  socket.on("leaveCallRoom", (callId) => {
    console.log(`Socket ${socket.id} leaving call room:`, callId);
    socket.leave(`call-${callId}`);
  });

  socket.on("call:update", (updatedCall) => {
    console.log("Received call update Server WebSockets");
    // attachPermissionScopesSocket("call", "update")(socket);

    console.log("Emitted call update to authorized clients");
  });

  socket.on(
    "call:sendMessage",
    async ({ callId, userId, organizationId, content }) => {
      if (!callId || !userId || !organizationId) {
        console.error("Missing callId, userId, or organizationId", {
          callId,
          userId,
          organizationId,
        });
        return;
      }

      try {
        const message = await prismaClient.callMessage.create({
          data: {
            content,
            call: { connect: { id: callId } },
            user: { connect: { id: userId } },
            organization: { connect: { id: organizationId } },
          },
          include: { user: true },
        });
        io.to(`call-${callId}`).emit("call:message", message);
      } catch (err) {
        console.error("Error creating message:", err);
      }
    }
  );

  socket.on("sendMessage", (data) => {
    console.log("Received message:", data);
    // You can also use emitToAuthorizedSockets here if needed
  });
};
