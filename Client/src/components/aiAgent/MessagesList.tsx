import { FilePreview } from "../miscellaneous/Files/FilePreview";
import { ChatMessage } from "./ChatWindow";

interface Props {
  messages: ChatMessage[];
  isLoading: boolean;
  userName: string;
}

export const MessagesList = ({ messages, isLoading, userName }: Props) => (
  <div className="p-4 flex flex-col flex-1 overflow-y-auto text-sm gap-2 text-right bg-surface items-start">
    <div className="bg-background p-2 rounded-xl w-fit">
      היי {userName || "משתמש"}! איך אני יכולה לעזור?
    </div>
    {messages.map((msg, idx) => (
      <div
        key={idx}
        className={`flex flex-col gap-1 max-w-[75%] ${
          msg.sender === "user" ? "self-end items-end" : "items-start"
        }`}
      >
        <div
          className={`rounded-xl w-fit whitespace-pre-line ${
            msg.sender === "user"
              ? "text-surface bg-gradient-to-br from-[#7F55FF] to-accent"
              : "bg-background"
          } p-2`}
        >
          {msg.text}
        </div>

        {(msg?.files?.length ?? 0) > 0 && (
          <div className="flex flex-col gap-1">
            {msg?.files?.map((file, i) => (
              <FilePreview
                key={i}
                fileName={file.name}
                onRemove={() => {}}
                loading={false}
                readOnly
              />
            ))}
          </div>
        )}
      </div>
    ))}

    {isLoading && (
      <span className="animate-pulse py-2 text-muted-foreground">כותבת...</span>
    )}
  </div>
);
