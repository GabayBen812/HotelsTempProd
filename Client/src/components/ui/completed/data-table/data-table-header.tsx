import { flexRender } from "@tanstack/react-table";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronDown, ChevronUp } from "lucide-react";
import { GetDirection } from "@/lib/i18n";
import Pagination from "./Pagination";
import { useContext } from "react";
import { DataTableContext } from "@/contexts/DataTableContext";

function DataTableHeader() {
  const direction = GetDirection();
  const { table, enhancedActions: actions } = useContext(DataTableContext);
  const firstColumnRounding = direction ? "rounded-r-lg" : "rounded-l-lg";
  const lastColumnRounding = direction ? "rounded-l-lg" : "rounded-r-lg";
  return (
    <TableHeader>
      {table.getHeaderGroups().map((headerGroup) => (
        <TableRow key={headerGroup.id} className="border-none h-11">
          {headerGroup.headers.map((header, index) => {
            const isFirst = index === 0;
            return (
              <TableHead
                key={header.id}
                className={`bg-foreground text-surface whitespace-nowrap ${
                  isFirst && firstColumnRounding
                }`}
                style={{
                  width: header.getSize(),
                }}
              >
                {!header.isPlaceholder && (
                  <div
                    className={`flex items-center gap-1 ${
                      header.column.getCanSort() && "cursor-pointer select-none"
                    } ${isFirst && "px-8"}`}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    {header.column.getCanSort() &&
                      (header.column.getIsSorted() === "asc" ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : header.column.getIsSorted() === "desc" ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : null)}
                  </div>
                )}
              </TableHead>
            );
          })}
          {actions && (
            <TableHead
              className={`text-surface bg-foreground ${lastColumnRounding}`}
            >
              <div className="flex w-full justify-end">
                <Pagination table={table} />
              </div>
            </TableHead>
          )}
        </TableRow>
      ))}
    </TableHeader>
  );
}

export default DataTableHeader;
