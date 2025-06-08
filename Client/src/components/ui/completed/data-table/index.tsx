import { useState, useEffect } from "react";
import {
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  PaginationState,
  Row,
} from "@tanstack/react-table";
import { Table } from "@/components/ui/table";
import DataTableBody from "./data-table-body/data-table-body";
import DataTableHeader from "./data-table-header";
import { DataTableSearch } from "./data-table-search";
import { DataTableAddButton } from "./data-table-add-button";
import { ApiQueryParams, DataTableProps } from "@/types/ui/data-table-types";
import { toast } from "sonner";
import { DataTableContext } from "@/contexts/DataTableContext";
import { Edit, Trash2 } from "lucide-react";
import { useDynamicSocket } from "@/hooks/useSocket";

export function DataTable<TData>({
  fetchData,
  addData,
  updateData,
  deleteData,
  columns = [],
  searchable = true,
  // @ts-ignore
  isPagination = true,
  showAddButton = false,
  actions = null,
  defaultPageSize = 10,
  renderExpandedContent,
  renderEditContent,
  idField,
  onRowClick,
  initialData,
  rightHeaderContent,
  websocketUrl,
}: DataTableProps<TData>) {
  const [hasMounted, setHasMounted] = useState(false);
  const [tableData, setTableData] = useState<TData[]>(
    (initialData || []).map((row) => ({ ...row, isEditMode: false }))
  );
  const [totalCount, setTotalCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: defaultPageSize,
  });
  const [specialRow, setSpecialRow] = useState<"add" | null>(null);
  const [now, setNow] = useState(Date.now());

  const { on, off } = useDynamicSocket();

  useEffect(() => {
    if (!websocketUrl) return;
    const handler = (msg: TData) => {
      if (idField && typeof idField === "string") {
        setTableData(
          (prev) =>
            prev.map((item) =>
              (item as any)[idField] === (msg as any)[idField] ? msg : item
            ) as TData[]
        );
      }
    };
    on("call:update", handler);

    return () => off("chat:message", handler);
  }, [on, off]);

  const handleAdd = async (newData: Partial<TData>) => {
    if (!addData || !idField) return;

    const tempId = `temp-${Date.now()}`;
    const optimisticData = { ...newData, [idField]: tempId } as TData;

    // Add optimistic row
    setTableData((prev) => [...prev, optimisticData]);
    setSpecialRow(null);

    try {
      const response = await addData(newData);

      if (!response || !response.data) {
        throw new Error("No response data");
      }

      const createdItem = response.data;

      // Replace optimistic row with actual created item
      setTableData(
        (prev) =>
          prev.map((item) =>
            (item as TData)[idField] === tempId ? createdItem : item
          ) as TData[]
      );

      toast.success("Event has been created");
      table.setPageIndex(0);
    } catch (error) {
      console.error("Failed to add data:", error);

      // Revert optimistic row
      setTableData((prev) =>
        prev.filter((item) => (item as TData)[idField] !== tempId)
      );

      toast.error("Failed to create event");
    }
  };

  const handleUpdateData = async (updatedData: Partial<TData>) => {
    if (!updateData || !idField) return;

    const id = updatedData[idField];
    if (!id) return;

    let originalItem: TData | undefined;
    setTableData((prev) => {
      originalItem = prev.find((item) => item[idField] === id);
      return prev.map((item) =>
        item[idField] === id ? { ...item, ...updatedData } : item
      ) as TData[];
    });

    table.getRowModel().rows.forEach((row) => {
      if (row.getIsExpanded()) row.toggleExpanded();
    });

    try {
      const response = await updateData(updatedData as TData);

      if (response && response.data) {
        setTableData(
          (prev) =>
            prev.map((item) =>
              // @ts-ignore
              item[idField] === response.data[idField] ? response.data : item
            ) as TData[]
        );
        toast.success("Event has been Edited");
      } else {
        throw new Error("No response data");
      }
    } catch (error) {
      console.error("Failed to update data:", error);
      toast.error("Failed to update event");

      // Roll back to original data
      if (originalItem) {
        setTableData(
          (prev) =>
            prev.map((item) =>
              item[idField] === originalItem![idField] ? originalItem! : item
            ) as TData[]
        );
      }
    }
  };

  const handleDeleteData = async (id: string | number) => {
    if (!deleteData || !idField) return;

    // Save the item for potential rollback
    const deletedItem = tableData.find((item) => item[idField] === id);
    if (!deletedItem) return;

    try {
      // Optimistically remove the item
      setTableData((prev) => prev.filter((item) => item[idField] !== id));

      // Try to delete from backend
      const response = await deleteData(Number(id));

      if (!response || !response.status || response.status !== 200)
        throw new Error("No response data");

      toast.success("Event has been deleted");
    } catch (error) {
      console.error("Failed to delete data:", error);

      // Rollback: restore the deleted item
      setTableData((prev) => [...prev, deletedItem]);
      toast.error("Failed to delete event");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleEditMode = (rowId: string | number) => {
    setTableData((prev) =>
      prev.map((row) =>
        idField && row[idField] === rowId
          // @ts-ignore
          ? { ...row, isEditMode: !row.isEditMode }
          : row
      )
    );
  };

  const table = useReactTable({
    data: tableData,
    columns,
    columnResizeMode: "onChange",
    state: {
      sorting,
      globalFilter,
      pagination,
    },
    pageCount: Math.ceil(totalCount / pagination.pageSize),
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),

    meta: {
      handleAdd,
      handleEdit: handleUpdateData,
      handleDelete: handleDeleteData,
      toggleEditMode,
    },
  });

  const loadData = async (skipInitialLoad = false) => {
    if (skipInitialLoad) setIsLoading(true);
    try {
      const params: ApiQueryParams = {
        page: pagination.pageIndex + 1,
        pageSize: pagination.pageSize,
        search: globalFilter || undefined,
      };

      if (sorting.length > 0) {
        const sortColumn = sorting[0];
        params.sortField = String(sortColumn.id);
        params.sortDirection = sortColumn.desc ? "desc" : "asc";
      }

      const response = await fetchData(params);
      const responseData = (response.data || []).map((row) => ({
        ...row,
        isEditMode: false,
      })) as TData[];
      if ("totalCount" in response) {
        setTableData(responseData);
        setTotalCount(response.totalCount || 0);
      } else {
        setTableData(responseData);
        setTotalCount(0);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const isInitialLoad = !hasMounted && !!initialData;

    loadData(!isInitialLoad);

    if (!hasMounted) setHasMounted(true);
  }, [pagination.pageIndex, pagination.pageSize, sorting, globalFilter]);

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 60000); // every minute
    return () => clearInterval(interval);
  }, []);

  const toggleAddRow = () => {
    setSpecialRow((prev) => (prev === "add" ? null : "add"));
  };

  const enhancedActions = actions
    ? actions.map((action) => {
        if (action?.type === "edit") {
          return {
            ...action,
            icon: Edit,
            onClick: async (row: Row<TData>) => {
              if (action.onClick) action.onClick(row);
              else if (idField) {
                toggleEditMode(row.original[idField] as string | number);
                row.toggleExpanded();
              }
            },
          };
        }
        if (action?.type === "delete") {
          return {
            ...action,
            icon: Trash2,
            onClick: async (row: Row<TData>) => {
              if (action.onClick) action.onClick(row);

              if (idField && deleteData) {
                const id = row.original[idField] as unknown as string | number;
                await handleDeleteData(id);
              }
            },
          };
        }
        return action;
      })
    : null;

  return (
    <DataTableContext.Provider
      value={{
        globalFilter,
        pagination,
        setPagination,
        setGlobalFilter,
        setSorting,
        sorting,
        columns,
        table,
        // @ts-ignore
        enhancedActions,
        renderExpandedContent,
        specialRow,
        handleAdd,
        handleUpdateData,
        onRowClick,
        isLoading,
        setSpecialRow,
        renderEditContent,
        toggleEditMode,
        // @ts-ignore
        idField,
      }}
    >
      <div className="space-y-4 ">
        <div
          className={`${
            searchable ? "justify-between" : "justify-end"
          } flex items-center`}
        >
          {searchable && (
            <div className="flex items-center gap-2">
              <DataTableSearch
                globalFilter={globalFilter}
                setGlobalFilter={setGlobalFilter}
              />
              {rightHeaderContent}
            </div>
          )}
          <DataTableAddButton
            showAddButton={showAddButton}
            onToggleAddRow={toggleAddRow}
          />
        </div>

        <div className="rounded-lg w-full ">
          <Table className="border-collapse border-spacing-2 text-right">
            <DataTableHeader />
            <DataTableBody<TData> />
            <span style={{ display: "none" }}>{now}</span>
          </Table>
        </div>
      </div>
    </DataTableContext.Provider>
  );
}

export default DataTable;
