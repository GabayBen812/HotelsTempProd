import { useState } from "react";
import { ArrowUp } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import Lottie from "lottie-react";
import assistantAnimation from "@/assets/animations/Animation - 1746366123961.json";

interface Props {
    token: string;
}

interface ChatMessage {
  text: string;
  sender: "user" | "bot";
}

export default function GuestChatWindow({ token }: Props) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const prompt = input.trim();
    setMessages((prev) => [...prev, { text: prompt, sender: "user" }]);
    setInput("");
    setIsLoading(true);

    const res = await fetch("http://localhost:3101/api/guest/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, token }),
    });

    const data = await res.json();
    const reply = data.response || "לא הצלחתי להבין.";

    setMessages((prev) => [...prev, { text: reply, sender: "bot" }]);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col w-full h-screen md:max-w-md md:h-[90vh] md:rounded-xl md:shadow-lg md:border bg-white overflow-hidden">
      <div className="flex items-center justify-center flex-col gap-1 bg-muted p-4 border-b">
        <div className="w-[60px] h-[60px] overflow-hidden rounded-full">
          <Lottie animationData={assistantAnimation} loop autoplay />
        </div>
        <div className="text-sm font-semibold">שירות חדרים</div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2 text-sm">
        <div className="text-gray-700 text-center text-sm mb-4">
          היי! אני כאן לעזור. מה תרצה?
        </div>

        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-2 rounded-lg w-fit max-w-[75%] ${
              msg.sender === "user"
                ? "ml-auto bg-accent text-white"
                : "bg-muted text-black"
            }`}
          >
            {msg.text}
          </div>
        ))}
        {isLoading && (
          <div className="text-gray-500 dark:text-gray-300 text-xs italic">
            ...כותבת
          </div>
        )}
      </div>

      <div className="p-3 border-t relative">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="כתוב הודעה..."
          className="pr-10"
        />
        <button
          onClick={handleSend}
          className="absolute bottom-4 left-4 bg-muted rounded-full p-1"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
