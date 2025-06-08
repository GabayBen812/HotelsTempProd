import { useContext, useEffect, useState } from "react";
import { TableBody } from "@/components/ui/table";
import DataTableBodyRowExpanded from "./data-table-body-row-expanded";
import { DataTableLoading } from "../data-table-loading";
import { RowComponent } from "./data-table-body-row-component";
import { NoResultsRow } from "./data-table-body-empty";
import { DataTableContext } from "@/contexts/DataTableContext";

function DataTableBody<T>() {
  const {
    table,
    enhancedActions: actions,
    specialRow,
    setSpecialRow,
    columns,
    isLoading,
  } = useContext(DataTableContext);
  const rows = table.getRowModel().rows;
  const hasData = rows.length > 0;
  const showAddRow = specialRow === "add";

  const [loadingFinished, setLoadingFinished] = useState(false);

  useEffect(() => {
    if (!isLoading) setLoadingFinished(true);
    else setLoadingFinished(false);
  }, [isLoading]);

  return (
    <TableBody className="before:content-['@'] before:block before:h-[10px] before:invisible">
      {showAddRow && (
        <DataTableBodyRowExpanded
          isExpanded={true}
          onBackdropClick={() => setSpecialRow(null)}
        />
      )}
      {isLoading ? (
        <DataTableLoading colSpan={columns.length + (actions ? 1 : 0)} />
      ) : loadingFinished && !hasData ? (
        <NoResultsRow colSpan={columns.length + (actions ? 1 : 0)} />
      ) : (
        table
          .getRowModel()
          .rows.map((row) => <RowComponent<T> key={row.id} row={row} />)
      )}
    </TableBody>
  );
}

export default DataTableBody;
