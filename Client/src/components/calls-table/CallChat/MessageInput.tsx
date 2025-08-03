import { Button } from "@/components/ui/button";
import { Paperclip, Send, Smile } from "lucide-react";
import { useContext, useRef, useState } from "react";
import { FilePreview } from "@/components/miscellaneous/Files/FilePreview";
import { OrganizationsContext } from "@/contexts/OrganizationsContext";
import { deleteImage, getImage, uploadImage } from "@/lib/supabase";
import { CallMessageAttachment } from "@/types/api/calls";
import { useMessageHandling } from "@/hooks/useChat";
import { useAuth } from "@/hooks/useAuth";
import { Message } from "@/types/ui/chat.types";
import { Input } from "@/components/ui/Input";

interface MessageInputProps {
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  callId: number;
}

export const MessageInput = ({ callId, setMessages }: MessageInputProps) => {
  const { organization } = useContext(OrganizationsContext);
  const { user } = useAuth();
  const { newMessage, setNewMessage, handleSendMessage } = useMessageHandling(
    callId,
    user,
    setMessages
  );
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [attachments, setAttachments] = useState<CallMessageAttachment[]>([]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !organization) return;

    const newAttachments: CallMessageAttachment[] = [];

    for (const file of Array.from(files)) {
      const path = `${organization.id}/calls/${callId}/chat/${Date.now()}-${
        file.name
      }`;
      const uploadedPath = await uploadImage(file, path);

      if (!uploadedPath) continue;

      newAttachments.push({
        fileUrl: getImage(uploadedPath),
        fileType: file.type,
        fileName: file.name,
      });
    }

    setAttachments((prev) => [...prev, ...newAttachments]);
  };

  const onRemoveFile = async (index: number) => {
    await deleteImage(attachments[index].fileUrl);
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSend = (e: React.FormEvent | React.KeyboardEvent) => {
    handleSendMessage(e, attachments);
    setAttachments([]);
  };

  return (
    <div className="px-6 py-4 bg-surface border-t border-gray-200">
      <div className="flex flex-col gap-2">
        {/* Attachments Preview */}
        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {attachments.map((url, index) => {
              const fileName = url.fileName.split("/").pop() || "";
              return (
                <FilePreview
                  key={index}
                  fileName={fileName}
                  onRemove={() =>
                    onRemoveFile(index).catch((err) => console.error(err))
                  }
                  loading={false}
                />
              );
            })}
          </div>
        )}

        <div className="flex items-start gap-3">
          {/* Input Box */}
          <div className="flex-1 relative">
            <div className="flex items-end bg-gray-100 rounded-lg border border-gray-200 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
              {/* Attach Button */}
              <button
                type="button"
                className="text-gray-500 hover:text-blue-600 transition-colors p-3 rounded-l-lg hover:bg-gray-200"
                onClick={() => fileInputRef.current?.click()}
              >
                <Paperclip size={20} />
              </button>

              <Input
                type="file"
                multiple
                hidden
                ref={fileInputRef}
                onChange={handleFileSelect}
              />

              {/* Text Area */}
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend(e);
                  }
                }}
                placeholder="Type a message..."
                className="flex-1 resize-none bg-transparent border-none outline-none px-2 py-3 text-sm placeholder-gray-500 max-h-32 min-h-[44px]"
                rows={1}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = "auto";
                  target.style.height =
                    Math.min(target.scrollHeight, 128) + "px";
                }}
              />

              {/* Emoji Button */}
              <button
                type="button"
                className="text-gray-500 hover:text-blue-600 transition-colors p-3 hover:bg-gray-200"
              >
                <Smile size={20} />
              </button>
            </div>

            <div className="text-xs text-gray-400 mt-1 px-1">
              Press Enter to send, Shift+Enter for new line
            </div>
          </div>

          {/* Send Button */}
          <div className="h-full flex items-start ">
            <Button
              type="submit"
              disabled={!newMessage.trim() && attachments.length === 0}
              className={`h-11 w-11 rounded-lg transition-all flex items-center justify-center ${
                newMessage.trim() || attachments.length
                  ? "bg-blue-600 hover:bg-blue-700 text-surface shadow-sm hover:shadow-md transform hover:scale-105"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
              onClick={handleSend}
            >
              <Send size={18} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
