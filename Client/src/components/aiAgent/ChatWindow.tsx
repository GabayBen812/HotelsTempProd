import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { createLog } from "@/api/microservice";
import { motion } from "framer-motion";
import { Textarea } from "../ui/textarea";
import { z } from "zod";
import { deleteImage, getImage, uploadImage } from "@/lib/supabase";
import { ChatHeader } from "./ChatHeader";
import { FileInputSection, InputControls } from "./InputControls";
import { MessagesList } from "./MessagesList";
import { v4 as uuidv4 } from "uuid";

// Zod Schema
const FormSchema = z.object({
  input: z.string().min(1, "שדה זה לא יכול להיות ריק").trim(),
  resource: z.string().optional(),
  files: z.array(z.string()).optional(), // Store paths instead of File objects
});

type FormState = z.infer<typeof FormSchema>;

interface ChatWindowProps {
  onClose: () => void;
}

export interface ChatMessage {
  text: string;
  files?: UploadedFile[]; // Optional files per message
  sender: "user" | "bot";
}

interface UploadedFile {
  name: string;
  path: string;
}

export default function ChatWindow({ onClose }: ChatWindowProps) {
  const auth = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string>(() => uuidv4());

  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const [form, setForm] = useState<FormState>({
    input: "",
    resource: "all",
    files: [],
  });

  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [loadingFiles, setLoadingFiles] = useState<string[]>([]);

  useEffect(() => {
    return () => {
      setConversationId(uuidv4());
    };
  }, []);

  // Handlers
  const handleSend = async () => {
    const parsed = FormSchema.safeParse(form);
    if (!parsed.success) return;

    const userMsg = parsed.data.input;

    // Add message with files
    setMessages((prev) => [
      ...prev,
      {
        text: userMsg,
        sender: "user",
        files: [...uploadedFiles], // Attach uploaded file metadata
      },
    ]);

    setForm((prev) => ({ ...prev, input: "" }));
    setIsLoading(true);

    try {
      setUploadedFiles([]);
      const response = await createLog({
        prompt: userMsg,
        additionalContext: { files: form.files, resource: form.resource },
        conversationId: conversationId,
      });

      const botReply =
        response?.data?.gemini_response ?? "מצטערת, לא הצלחתי להבין. נסה שוב.";

      setMessages((prev) => [
        ...prev,
        {
          text: botReply,
          sender: "bot",
        },
      ]);
      setForm({ input: "", resource: "all", files: [] });
    } catch (error) {
      console.error("Error getting response:", error);
      setMessages((prev) => [
        ...prev,
        { text: "אירעה שגיאה. נסה שוב מאוחר יותר.", sender: "bot" },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const path = `chats/files/${Date.now()}-${file.name}`;
    setLoadingFiles((prev) => [...prev, file.name]);

    try {
      const uploadedPath = await uploadImage(file, path);

      if (uploadedPath) {
        const imagePath = getImage(uploadedPath);
        setForm((prev) => ({
          ...prev,
          files: [...(prev.files || []), imagePath],
        }));
        setUploadedFiles((prev) => [
          ...prev,
          { name: file.name, path: imagePath },
        ]);
      }
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setLoadingFiles((prev) => prev.filter((name) => name !== file.name));
    }
  };

  const handleFileRemove = async (index: number, path: string) => {
    try {
      await deleteImage(path);

      setUploadedFiles([]);
      setForm((prev) => ({
        ...prev,
        files: prev.files?.filter((_, i) => i !== index),
      }));
    } catch (error) {
      console.error("Error removing file:", error);
    }
  };

  const canSubmit = FormSchema.shape.input.safeParse(form.input).success;
  const isRTL =
    document.dir === "rtl" || document.documentElement.dir === "rtl";
  return (
    <motion.div
      initial={{ scale: 0, originX: isRTL ? 0 : 1, originY: 1, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ duration: 0.075, ease: "linear" }}
      className={`${
        isFullScreen
          ? "fixed inset-0 w-full h-full"
          : "fixed bottom-6 rtl:left-6 ltr:right-6 w-[28rem] min-h-[28rem] max-h-[90vh]"
      } bg-white rounded-2xl shadow-lg z-50 border flex flex-col overflow-hidden transition-all duration-300`}
    >
      <ChatHeader
        isFullScreen={isFullScreen}
        setIsFullScreen={setIsFullScreen}
        onClose={onClose}
      />

      <MessagesList
        messages={messages}
        isLoading={isLoading}
        userName={auth.user!.name}
      />

      <div className="p-2 border-t flex flex-col gap-2 bg-white relative">
        <FileInputSection
          uploadedFiles={uploadedFiles}
          loadingFiles={loadingFiles}
          onFileUpload={handleFileUpload}
          onFileRemove={handleFileRemove}
        />

        <Textarea
          value={form.input}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, input: e.target.value }))
          }
          key={uploadedFiles.length}
          onKeyDown={handleKeyDown}
          placeholder="שאל כל דבר..."
          className={`w-full px-3 pb-8 text-sm border rounded-lg focus:outline-none ${
            uploadedFiles.length > 0 ? "pt-20" : "pt-4"
          } duration-150 ease-in-out`}
          autoExpand
          ref={textAreaRef}
        />

        <InputControls
          form={form}
          setForm={setForm}
          canSubmit={canSubmit}
          handleSend={handleSend}
        />
      </div>
    </motion.div>
  );
}
