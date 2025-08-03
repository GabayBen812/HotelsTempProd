import { motion } from "framer-motion";
export const GuestChatSkeleton = () => (
  <motion.div
    className="h-full w-full mt-[10%] flex flex-col gap-6 px-6"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.3, ease: "easeOut" }}
  >
    {/* Avatar skeleton with shimmer effect */}
    <motion.div
      className="relative rounded-2xl size-32 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] mx-auto overflow-hidden"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.1, duration: 0.4, ease: "easeOut" }}
      style={{
        backgroundImage:
          "linear-gradient(90deg, #e5e7eb 0%, #d1d5db 50%, #e5e7eb 100%)",
        backgroundSize: "200% 100%",
        animation: "shimmer 1.5s ease-in-out infinite",
      }}
    >
      <div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
        style={{ animation: "shimmer 1.5s ease-in-out infinite 0.5s" }}
      />
    </motion.div>

    {/* Text skeletons with staggered animation */}
    <motion.div
      className="space-y-3"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.4 }}
    >
      <motion.div
        className="relative h-4 rounded-md w-3/4 overflow-hidden"
        initial={{ width: 0 }}
        animate={{ width: "75%" }}
        transition={{ delay: 0.3, duration: 0.5, ease: "easeOut" }}
        style={{
          backgroundImage:
            "linear-gradient(90deg, #e5e7eb 0%, #d1d5db 50%, #e5e7eb 100%)",
          backgroundSize: "200% 100%",
          animation: "shimmer 1.5s ease-in-out infinite",
        }}
      >
        <div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
          style={{ animation: "shimmer 1.5s ease-in-out infinite 0.3s" }}
        />
      </motion.div>
      <motion.div
        className="relative h-4 rounded-md w-5/6 overflow-hidden"
        initial={{ width: 0 }}
        animate={{ width: "83.333333%" }}
        transition={{ delay: 0.4, duration: 0.5, ease: "easeOut" }}
        style={{
          backgroundImage:
            "linear-gradient(90deg, #e5e7eb 0%, #d1d5db 50%, #e5e7eb 100%)",
          backgroundSize: "200% 100%",
          animation: "shimmer 1.5s ease-in-out infinite 0.2s",
        }}
      >
        <div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
          style={{ animation: "shimmer 1.5s ease-in-out infinite 0.5s" }}
        />
      </motion.div>
    </motion.div>

    {/* Recommendations skeleton with fade-in effect */}
    <motion.div
      className="flex flex-col gap-3"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.4 }}
    >
      <motion.div
        className="relative h-3 rounded-sm w-16 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.3 }}
        style={{
          backgroundImage:
            "linear-gradient(90deg, #e5e7eb 0%, #d1d5db 50%, #e5e7eb 100%)",
          backgroundSize: "200% 100%",
          animation: "shimmer 1.5s ease-in-out infinite 0.1s",
        }}
      >
        <div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
          style={{ animation: "shimmer 1.5s ease-in-out infinite 0.4s" }}
        />
      </motion.div>
      {[1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="relative h-12 rounded-lg overflow-hidden"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            delay: 0.6 + i * 0.1,
            duration: 0.4,
            ease: "easeOut",
          }}
          style={{
            backgroundImage:
              "linear-gradient(90deg, #e5e7eb 0%, #d1d5db 50%, #e5e7eb 100%)",
            backgroundSize: "200% 100%",
            animation: `shimmer 1.5s ease-in-out infinite ${0.3 + i * 0.1}s`,
          }}
        >
          <div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
            style={{
              animation: `shimmer 1.5s ease-in-out infinite ${0.6 + i * 0.1}s`,
            }}
          />
        </motion.div>
      ))}
    </motion.div>

    {/* <style jsx>{`
      @keyframes shimmer {
        0% {
          background-position: -200% 0;
        }
        100% {
          background-position: 200% 0;
        }
      }
    `}</style> */}
  </motion.div>
);
