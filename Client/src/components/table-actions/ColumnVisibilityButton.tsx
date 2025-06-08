import { Settings } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useContext, useState } from "react";
import { DataTableContext } from "@/contexts/DataTableContext";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export function ColumnVisibilityButton() {
  const { table } = useContext(DataTableContext);
  const [isHovered, setIsHovered] = useState(false);
  const { t } = useTranslation();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <motion.button
          type="button"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          initial={{ width: 44 }}
          animate={{ width: isHovered ? 160 : 44 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className={`overflow-hidden flex items-center gap-2 whitespace-nowrap border-none rounded-lg px-3 py-2 h-11 bg-indigo-600 hover:bg-indigo-700 text-white focus:outline-none transition-all cursor-pointer`}
          aria-label={t("column_visibility")}
          style={{ minWidth: 44 }}
        >
          <Settings className="w-5 h-5 shrink-0 text-white" />
          <span
            style={{
              opacity: isHovered ? 1 : 0,
              width: isHovered ? "auto" : 0,
              marginLeft: isHovered ? 8 : 0,
              transition: "opacity 0.2s, width 0.2s, margin-left 0.2s",
              overflow: "hidden",
              whiteSpace: "nowrap",
              display: "inline-block",
            }}
            className="text-white text-base font-medium"
          >
            {t("column_visibility")}
          </span>
        </motion.button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {table
          .getAllColumns()
          .filter((column) => column.getCanHide())
          .map((column) => {
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {t(`fields.${column.id}`, { defaultValue: column.id })}
              </DropdownMenuCheckboxItem>
            );
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 