// CallChat/hooks/useCombinedItems.ts
import { useEffect, useMemo, useState } from "react";
import { CallStatusHistory } from "@/types/api/calls";
import { useSocket } from "./useSocket";
import { User } from "@/types/api/user";
import { Message } from "@/types/ui/chat.types";
export const useCombinedItems = (
  messages: Message[],
  callStatusHistory: CallStatusHistory[]
) => {
  return useMemo(() => {
    let lastAssignedToId: number | null = null;

    const statusItems = callStatusHistory.map((status) => {
      const isSameStatus = status.fromStatus === status.toStatus;
      const assignedChanged =
        isSameStatus &&
        status.assignedToId &&
        status.assignedToId !== lastAssignedToId;
      console.log(status);

      if (assignedChanged) {
        lastAssignedToId = status.assignedToId!;
        return {
          ...status,
          type: "status" as const,
          displayText: `Assigned to ${status.assignedTo?.name || "Unknown"}`,
        };
      }

      return {
        ...status,
        type: "status" as const,
        displayText: `Status changed from ${status.fromStatus} to ${status.toStatus}`,
      };
    });
    console.log(statusItems, "statusItems");

    const combined = [
      ...messages.map((msg) => ({ ...msg, type: "message" as const })),
      ...statusItems,
    ].sort((a, b) => {
      const dateA = new Date(a.type === "message" ? a.createdAt : a.changedAt);
      const dateB = new Date(b.type === "message" ? b.createdAt : b.changedAt);
      return dateA.getTime() - dateB.getTime();
    });

    return combined;
  }, [messages, callStatusHistory]);
};

export const useMessageHandling = (
  callId: number,
  user: User | null,
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
) => {
  const [newMessage, setNewMessage] = useState("");
  const { joinCallRoom, leaveCallRoom, sendMessage, onMessage } = useSocket();

  useEffect(() => {
    joinCallRoom(callId);

    const handleNewMessage = (message: Message) => {
      setMessages((prev) => [...prev, message]);
    };

    onMessage(handleNewMessage);

    return () => {
      leaveCallRoom(callId);
    };
  }, [callId, joinCallRoom, leaveCallRoom, onMessage, setMessages]);

  const handleSendMessage = (e: React.FormEvent | React.KeyboardEvent) => {
    e.preventDefault();
    if (newMessage.trim() && user) {
      sendMessage(callId, newMessage.trim());
      setNewMessage("");
    }
  };

  return {
    newMessage,
    setNewMessage,
    handleSendMessage,
  };
};

export const getInitials = (user: User) => {
  if (user.name) {
    const parts = user.name.trim().split(" ");
    if (parts.length === 1) {
      return parts[0].substring(0, 2).toUpperCase();
    }
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return user.username.substring(0, 2).toUpperCase();
};

export const getUserBadgeColor = (userType: string) => {
  return userType === "EMPLOYER"
    ? "bg-purple-100 text-purple-700"
    : "bg-blue-100 text-blue-700";
};

// CallChat/utils/messageUtils.ts
export const shouldGroupMessage = (currentItem: any, prevItem?: any) => {
  if (
    currentItem.type !== "message" ||
    !prevItem ||
    prevItem.type !== "message"
  ) {
    return false;
  }

  const currentTime = new Date(currentItem.createdAt).getTime();
  const prevTime = new Date(prevItem.createdAt).getTime();
  const timeDiff = (currentTime - prevTime) / (1000 * 60);

  return currentItem.user.id === prevItem.user.id && timeDiff < 5;
};
