import { motion } from "framer-motion"; // Import framer-motion
import { TableCell } from "@/components/ui/table";
import { GetDirection } from "@/lib/i18n";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Row, flexRender, CellContext } from "@tanstack/react-table";
import { MoreVertical } from "lucide-react";
import React, { useContext } from "react";
import { Button } from "@/components/ui/button";
import DataTableBodyRowExpanded from "./data-table-body-row-expanded";
import { DataTableContext } from "@/contexts/DataTableContext";
import { useTranslation } from "react-i18next";

interface RowComponentProps<T> {
  row: Row<T>;
}

export const RowComponent = React.memo(function RowComponent<T>({
  row,
}: RowComponentProps<T>) {
  const isExpanded = row.getIsExpanded();
  const { t } = useTranslation();
  const {
    enhancedActions: actions,
    onRowClick,
    renderExpandedContent,
    renderEditContent,
  } = useContext(DataTableContext);
  const direction = GetDirection();
  const firstColumnRounding = direction
    ? "rounded-r-lg px-8"
    : "rounded-l-lg px-8";
  const lastColumnRounding = direction ? "rounded-l-lg" : "rounded-r-lg";

  const handleRowClick = () => {
    if (onRowClick) onRowClick(row);
    else row.toggleExpanded();
  };

  return (
    <>
      <motion.tr
        key={row.id}
        id={row.id}
        className={`${
          isExpanded ? "relative z-[50] pointer-events-none" : ""
        } border-b-4 border-background group cursor-pointer transition-colors h-[3.75rem]`}
        onClick={handleRowClick}
        data-state={row.getIsSelected() ? "selected" : undefined}
        initial={{ opacity: 0, y: 10 }} // Initial animation state
        animate={{ opacity: 1, y: 0 }} // Animation when the row appears
        exit={{ opacity: 0, y: -10 }} // Animation when the row is removed
        transition={{ duration: 0.2, ease: "easeInOut" }} // Smooth transition
      >
        {row.getVisibleCells().map((cell, index) => (
          <TableCell
            className={`bg-white text-primary text-base font-normal border-b-4 border-background w-auto whitespace-nowrap transition-colors group-hover:bg-muted ${
              index === 0 ? firstColumnRounding : "rounded-b-[1px]"
            }`}
            key={cell.id}
          >
            {flexRender(
              cell.column.columnDef.cell,
              cell.getContext() as CellContext<T, unknown>
            )}
          </TableCell>
        ))}
        {actions && (
          <TableCell
            className={`bg-white transition-colors group-hover:bg-muted ${lastColumnRounding} border-b-4 border-background text-left whitespace-nowrap rtl:text-left ltr:text-right actions-menu`}
          >
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-8 w-8 p-0"
                  aria-label="Open menu"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{t("actions.index")}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {actions.map((action, index) => (
                  <DropdownMenuItem
                    key={index}
                    onClick={(e: React.MouseEvent) => {
                      e.stopPropagation();
                      if (action.onClick) action.onClick(row);
                    }}
                  >
                    {action.icon && <action.icon className="mr-2 h-4 w-4" />}
                    {t(action.label.toLowerCase())}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </TableCell>
        )}
      </motion.tr>

      {(renderExpandedContent || renderEditContent) && (
        <DataTableBodyRowExpanded isExpanded={isExpanded} row={row} />
      )}
    </>
  );
}) as <T>(props: RowComponentProps<T>) => React.ReactElement;
