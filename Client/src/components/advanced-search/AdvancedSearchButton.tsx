import { Filter } from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface AdvancedSearchButtonProps {
  onClick: () => void;
}

export const AdvancedSearchButton: React.FC<AdvancedSearchButtonProps> = ({
  onClick,
}) => {
  const { t } = useTranslation();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ width: 40 }}
      animate={{ width: isHovered ? 140 : 40 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="overflow-hidden flex items-center gap-2 whitespace-nowrap border border-gray-300 rounded-md px-2 py-2 bg-surface hover:bg-gray-100 text-black focus:outline-none"
      aria-label={t("reports.filters.apply")}
    >
      <Filter className="w-5 h-5 shrink-0 text-black" />
      <AnimatePresence>
        {isHovered && (
          <motion.span
            key="text"
            initial={{ opacity: 0, width: 0, marginLeft: 0 }}
            animate={{ opacity: 1, width: "auto", marginLeft: 8 }}
            exit={{ opacity: 0, width: 0, marginLeft: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden whitespace-nowrap text-black"
          >
            {t("reports.filters.apply")}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
};
