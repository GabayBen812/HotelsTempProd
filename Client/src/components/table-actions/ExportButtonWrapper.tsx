import { useContext } from "react";
import { DataTableContext } from "@/contexts/DataTableContext";
import { ExportButton } from "@/components/export/ExportButton";

interface ExportButtonWrapperProps {
  columns: any[];
  filename?: string;
}

export function ExportButtonWrapper({
  columns,
  filename = "export.csv",
}: ExportButtonWrapperProps) {
  const { table } = useContext(DataTableContext);
  return (
    <ExportButton
      data={table.getRowModel().rows.map((row: any) => row.original)}
      columns={columns.map((col: any) => ({
        id: col.accessorKey || col.id,
        label: typeof col.header === "string" ? col.header : undefined,
      }))}
      filename={filename}
    />
  );
}
