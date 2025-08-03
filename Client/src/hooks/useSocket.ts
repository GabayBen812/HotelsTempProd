import { useEffect, useRef, useCallback, useContext } from "react";
import { io, Socket } from "socket.io-client";
import { OrganizationsContext } from "@/contexts/OrganizationsContext";
import { useAuth } from "./useAuth";
import { CallMessageAttachment } from "@/types/api/calls";
interface UseSocketReturn {
  joinCallRoom: (callId: number) => void;
  leaveCallRoom: (callId: number) => void;
  sendMessage: (
    callId: number,
    content: string,
    attachments?: CallMessageAttachment[]
  ) => void;
  onMessage: (callback: (message: any) => void) => void;
}

export const useSocket = (): UseSocketReturn => {
  const socketRef = useRef<Socket | null>(null);
  const { organization } = useContext(OrganizationsContext);
  const { user } = useAuth();

  useEffect(() => {
    // Initialize socket connection
    socketRef.current = io(
      import.meta.env.VITE_API_URL || "http://localhost:3101",
      {
        withCredentials: true,
        auth: {
          organizationId: String(organization?.id),
        },
      }
    );

    // Cleanup on unmount
    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, []);

  const joinCallRoom = useCallback((callId: number) => {
    if (socketRef.current) socketRef.current.emit("joinCallRoom", callId);
  }, []);

  const leaveCallRoom = useCallback((callId: number) => {
    if (socketRef.current) socketRef.current.emit("leaveCallRoom", callId);
  }, []);

  const sendMessage = useCallback(
    (
      callId: number,
      content: string,
      attachments?: CallMessageAttachment[]
    ) => {
      console.log(attachments, "attachments");

      if (socketRef.current && user) {
        socketRef.current.emit("call:sendMessage", {
          callId,
          userId: user.id,
          organizationId: organization?.id,
          content,
          attachments,
        });
      }
    },
    [user]
  );

  const onMessage = useCallback((callback: (message: any) => void) => {
    if (socketRef.current) {
      socketRef.current.on("call:message", callback);
    }
  }, []);

  return {
    joinCallRoom,
    leaveCallRoom,
    sendMessage,
    onMessage,
  };
};

type EventCallback = (...args: any[]) => void;

interface UseDynamicSocketOptions {
  url?: string;
  auth?: Record<string, any>;
  options?: Partial<Parameters<typeof io>[1]>;
}

interface UseDynamicSocketReturn {
  emit: (event: string, ...args: any[]) => void;
  on: (event: string, callback: EventCallback) => void;
  off: (event: string, callback?: EventCallback) => void;
  disconnect: () => void;
  socket: Socket | null;
}

export const useDynamicSocket = ({
  url,
  auth,
  options,
}: UseDynamicSocketOptions = {}): UseDynamicSocketReturn => {
  const { organization } = useContext(OrganizationsContext);
  const { user } = useAuth();
  const socketRef = useRef<Socket | null>(null);

  // Build default auth using context, allow override
  const defaultAuth = {
    organizationId: organization?.id,
    userId: user?.id,
  };

  useEffect(() => {
    socketRef.current = io(
      url || import.meta.env.VITE_API_URL || "http://localhost:3101",
      {
        withCredentials: true,
        auth: {
          ...defaultAuth,
          ...auth,
        },
        ...options,
      }
    );

    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, [url, auth, options, defaultAuth.organizationId, defaultAuth.userId]);

  const emit = useCallback((event: string, ...args: any[]) => {
    socketRef.current?.emit(event, ...args);
  }, []);

  const on = useCallback((event: string, callback: EventCallback) => {
    socketRef.current?.on(event, callback);
  }, []);

  const off = useCallback((event: string, callback?: EventCallback) => {
    if (callback) {
      socketRef.current?.off(event, callback);
    } else {
      socketRef.current?.removeAllListeners(event);
    }
  }, []);

  const disconnect = useCallback(() => {
    socketRef.current?.disconnect();
    socketRef.current = null;
  }, []);

  return {
    emit,
    on,
    off,
    disconnect,
    socket: socketRef.current,
  };
};
