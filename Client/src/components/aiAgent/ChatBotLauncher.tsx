import UserLogo from "@/assets/icons/chatbotIcon.png";
import { useState } from "react";
import ChatWindow from "./ChatWindow";
import { AnimatePresence } from "framer-motion";

export default function ChatbotLauncher() {
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className="fixed bottom-6 rtl:left-6 ltr:right-6 z-50">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="w-10 h-10 shadow-lg rounded-full flex items-center justify-center"
      >
        <img src={UserLogo} alt="Chatbot" className="w-10 h-10" />
      </button>

      <AnimatePresence mode="wait">
        {open && <ChatWindow key="chat-window" onClose={handleClose} />}
      </AnimatePresence>
    </div>
  );
}
