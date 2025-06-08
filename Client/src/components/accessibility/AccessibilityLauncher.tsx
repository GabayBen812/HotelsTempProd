import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import AccessibilityIcon from "@/assets/icons/AccessibilityIcon";
import AccessibilityMenu from "./AccessibilityMenu";

export default function AccessibilityLauncher() {
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className="fixed bottom-20 rtl:left-6 ltr:right-6 z-50">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="w-10 h-10 shadow-lg rounded-full flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white"
        aria-label="Open accessibility menu"
      >
        <AccessibilityIcon className="w-6 h-6" />
      </button>

      <AnimatePresence mode="wait">
        {open && (
          <AccessibilityMenu key="accessibility-menu" onClose={handleClose} />
        )}
      </AnimatePresence>
    </div>
  );
}
