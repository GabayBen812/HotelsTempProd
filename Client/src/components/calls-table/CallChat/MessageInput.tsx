import { Paperclip, Send, Smile } from "lucide-react";

interface MessageInputProps {
  newMessage: string;
  setNewMessage: (message: string) => void;
  onSendMessage: (e: React.FormEvent | React.KeyboardEvent) => void;
}

export const MessageInput = ({
  newMessage,
  setNewMessage,
  onSendMessage,
}: MessageInputProps) => {
  return (
    <div className="px-6 py-4 bg-white border-t border-gray-200">
      <div className="flex items-end gap-3 h-full">
        {/* Message Input Container */}
        <div className="flex-1 relative">
          <div className="flex items-end bg-gray-100 rounded-lg border border-gray-200 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
            {/* Attach Button */}
            <button
              type="button"
              className="text-gray-500 hover:text-blue-600 transition-colors p-3 rounded-l-lg hover:bg-gray-200"
              title="Attach file"
            >
              <Paperclip size={20} />
            </button>

            {/* Message Input */}
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  onSendMessage(e);
                }
              }}
              placeholder="Type a message..."
              className="flex-1 resize-none bg-transparent border-none outline-none px-2 py-3 text-sm placeholder-gray-500 max-h-32 min-h-[44px]"
              rows={1}
              style={{
                height: "auto",
                minHeight: "44px",
              }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = "auto";
                target.style.height = Math.min(target.scrollHeight, 128) + "px";
              }}
            />

            {/* Emoji Button */}
            <button
              type="button"
              className="text-gray-500 hover:text-blue-600 transition-colors p-3 hover:bg-gray-200"
              title="Add emoji"
            >
              <Smile size={20} />
            </button>
          </div>

          {/* Hint text */}
          <div className="text-xs text-gray-400 mt-1 px-1">
            Press Enter to send, Shift+Enter for new line
          </div>
        </div>

        {/* Send Button */}
        <div className="h-full flex items-start">
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className={`h-11 w-11 rounded-lg transition-all flex items-center justify-center ${
              newMessage.trim()
                ? "bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md transform hover:scale-105"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            onClick={onSendMessage}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
