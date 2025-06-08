import { Filter } from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface AdvancedSearchButtonProps {
  onClick: () => void;
}

export const AdvancedSearchButton: React.FC<AdvancedSearchButtonProps> = ({ onClick }) => {
  const { t } = useTranslation();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ width: 44 }}
      animate={{ width: isHovered ? 160 : 44 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className={`overflow-hidden flex items-center gap-2 whitespace-nowrap border-none rounded-lg px-3 py-2 h-11 bg-violet-600 hover:bg-violet-700 text-white focus:outline-none transition-all cursor-pointer`}
      aria-label={t("reports.filters.apply")}
      style={{ minWidth: 44 }}
    >
      <Filter className="w-5 h-5 shrink-0 text-white" />
      <AnimatePresence>
        {isHovered && (
          <motion.span
            key="text"
            initial={{ opacity: 0, width: 0, marginLeft: 0 }}
            animate={{ opacity: 1, width: "auto", marginLeft: 8 }}
            exit={{ opacity: 0, width: 0, marginLeft: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden whitespace-nowrap text-white text-base font-medium"
          >
            {t("reports.filters.apply")}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}; 