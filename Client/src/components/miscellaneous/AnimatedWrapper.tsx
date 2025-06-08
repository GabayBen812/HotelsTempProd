import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AnimatedWrapperProps {
  isVisible: boolean;
  children: React.ReactNode;
  className?: string;
  animationType?: "fade" | "slide"; // Optional animation types
}

const AnimatedWrapper: React.FC<AnimatedWrapperProps> = ({
  isVisible,
  children,
  className,
  animationType = "fade",
}) => {
  const animations = {
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    },
    slide: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: 20 },
    },
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={className}
          initial={animations[animationType].initial}
          animate={animations[animationType].animate}
          exit={animations[animationType].exit}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AnimatedWrapper;
