// CallChat/index.tsx
import { useEffect, useState, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { Hash } from "lucide-react";
import { api } from "@/api";
import { useAuth } from "@/hooks/useAuth";
import { CallStatusHistory } from "@/types/api/calls";
import { MessageItem } from "./MessageItem";
import { StatusAlert } from "./StatusAlert";
import { MessageInput } from "./MessageInput";
import {
  useMessageHandling,
  useCombinedItems,
  shouldGroupMessage,
} from "@/hooks/useChat";
import { Message } from "@/types/ui/chat.types";

interface CallChatProps {
  callId: number;
  callStatusHistory: CallStatusHistory[];
}

export const CallChat = ({ callId, callStatusHistory }: CallChatProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  const combinedItems = useCombinedItems(messages, callStatusHistory);
  const { newMessage, setNewMessage, handleSendMessage } = useMessageHandling(
    callId,
    user,
    setMessages
  );

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await api.get(`/calls/${callId}/messages`);
        setMessages(response.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };
    fetchMessages();
  }, [callId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [combinedItems]);

  return (
    <div className="flex flex-col h-[700px] bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-slate-50 to-gray-50">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Hash size={20} className="text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Call Discussion
            </h3>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className="text-sm text-gray-500">Call #{callId}</span>
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span className="text-sm text-gray-500">Active</span>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto bg-gray-50">
        <div className="px-4 py-4">
          <AnimatePresence initial={false}>
            {combinedItems.map((item, index) => {
              if (item.type === "status") {
                return (
                  <StatusAlert
                    key={`status-${item.id}`}
                    statusItem={item}
                    isFirst={index === 0}
                  />
                );
              }

              return (
                <MessageItem
                  key={item.id}
                  message={item}
                  isOwn={item.user.id === user?.id}
                  isGrouped={shouldGroupMessage(item, combinedItems[index - 1])}
                />
              );
            })}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <MessageInput
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
};
