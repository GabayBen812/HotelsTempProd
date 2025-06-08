import { Download } from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export interface ExportColumn {
  id: string;
  label?: string;
}

interface ExportButtonProps<T extends Record<string, any> = any> {
  data: T[];
  columns?: ExportColumn[];
  filename?: string;
}

function toCsv<T extends Record<string, any>>(data: T[], columns?: ExportColumn[]): string {
  if (!data || data.length === 0) return '';
  const keys = columns ? columns.map(col => col.id) : Object.keys(data[0]);
  const header = columns
    ? columns.map(col => '"' + (col.label || col.id) + '"').join(',')
    : keys.map(k => '"' + k + '"').join(',');
  const rows = data.map(row =>
    keys.map(key => {
      let cell = row[key];
      if (cell === null || cell === undefined) cell = '';
      // Escape quotes
      return '"' + String(cell).replace(/"/g, '""') + '"';
    }).join(',')
  );
  return [header, ...rows].join('\r\n');
}

export const ExportButton = <T extends Record<string, any>>({ data, columns, filename = "export.csv" }: ExportButtonProps<T>) => {
  const { t } = useTranslation();
  const [isHovered, setIsHovered] = useState(false);
  const isDisabled = !data || data.length === 0;

  return (
    <motion.button
      type="button"
      onClick={() => {
        if (isDisabled) return;
        const csv = toCsv(data, columns);
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ width: 44 }}
      animate={{ width: isHovered ? 160 : 44 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className={`overflow-hidden flex items-center gap-2 whitespace-nowrap border-none rounded-lg px-3 py-2 h-11 bg-emerald-600 hover:bg-emerald-700 text-white focus:outline-none transition-all ${isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      aria-label={t("reports.export.csv")}
      tabIndex={isDisabled ? -1 : 0}
      disabled={false}
      style={{ minWidth: 44 }}
    >
      <Download className="w-5 h-5 shrink-0 text-white" />
      <AnimatePresence>
        {isHovered && !isDisabled && (
          <motion.span
            key="text"
            initial={{ opacity: 0, width: 0, marginLeft: 0 }}
            animate={{ opacity: 1, width: "auto", marginLeft: 8 }}
            exit={{ opacity: 0, width: 0, marginLeft: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden whitespace-nowrap text-white text-base font-medium"
          >
            {t("reports.export.csv")}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}; 