import { AnimatePresence } from "framer-motion";
import React from "react";

interface BackdropProps {
  onClick?: () => void;
}

function Backdrop({ onClick }: BackdropProps) {
  return (
    <AnimatePresence>
      <div
        key={`backdrop-custom`}
        className="absolute inset-0 bg-background/60 z-40"
        onClick={onClick}
      />
    </AnimatePresence>
  );
}

export default Backdrop;
