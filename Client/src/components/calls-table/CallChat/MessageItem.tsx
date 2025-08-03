// CallChat/MessageItem.tsx
import { motion } from "framer-motion";
import { formatDateTime } from "@/lib/dateUtils";
import { getInitials, getUserBadgeColor } from "@/hooks/useChat";
import { Message } from "@/types/ui/chat.types";
import { FilePreview } from "@/components/miscellaneous/Files/FilePreview";
import { CallMessageAttachment } from "@/types/api/calls";

interface MessageItemProps {
  message: Message;
  isOwn: boolean;
  isGrouped: boolean;
}

export const MessageItem = ({
  message,
  isOwn,
  isGrouped,
}: MessageItemProps) => {
  if (!message.user) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className={`group hover:bg-gray-100/50 px-4 rounded-lg transition-colors ${
        isGrouped ? "py-0.5" : "py-2 mt-4"
      }`}
    >
      <div className="flex gap-3">
        {/* Avatar Column */}
        <div className="flex-shrink-0 w-10">
          {!isGrouped ? (
            <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-surface shadow-sm">
              {message.user.logo ? (
                <img
                  src={message.user.logo}
                  alt={message.user.name || message.user.username}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 text-surface flex items-center justify-center font-semibold text-sm">
                  {getInitials(message.user)}
                </div>
              )}
            </div>
          ) : (
            <div className="w-10 flex items-center justify-start">
              <span className="text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                {formatDateTime(message.createdAt)}
              </span>
            </div>
          )}
        </div>

        {/* Message Content */}
        <div className="flex-1 min-w-0">
          {!isGrouped && (
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-gray-900 text-sm">
                {message.user.name || message.user.username}
              </span>
              {isOwn && (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                  You
                </span>
              )}
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-medium ${getUserBadgeColor(
                  message.user.userType
                )}`}
              >
                {message.user.userType.toLowerCase()}
              </span>
              <span className="text-xs text-gray-500">
                {formatDateTime(message.createdAt)}
              </span>
            </div>
          )}

          {/* Attachments */}
          {message.CallMessageAttachment &&
            message.CallMessageAttachment.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-1 pt-2">
                <RenderFiles attachments={message.CallMessageAttachment} />
              </div>
            )}

          {/* Message Text */}
          {message.content && (
            <div className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap break-words">
              {message.content}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const isImage = (fileType: string, fileName: string) => {
  const ext = fileName.split(".").pop()?.toLowerCase();
  return (
    fileType.startsWith("image/") ||
    ["jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(ext || "")
  );
};

const RenderFiles = ({
  attachments,
}: {
  attachments: CallMessageAttachment[];
}) => {
  return (
    <div className="flex flex-wrap gap-2 mb-1 pt-2">
      {attachments.map((file, i) => {
        const showImage = isImage(file.fileType, file.fileName);

        return (
          <a
            key={i}
            href={file.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-90 transition-all"
          >
            {showImage ? (
              <img
                src={file.fileUrl}
                alt={file.fileName}
                className="max-w-[200px] max-h-[200px] rounded-lg shadow-sm border border-border object-cover"
              />
            ) : (
              <FilePreview fileName={file.fileName} loading={false} readOnly />
            )}
          </a>
        );
      })}
    </div>
  );
};
