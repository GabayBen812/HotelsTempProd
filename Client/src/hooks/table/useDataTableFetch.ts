import { useCallback, useState } from "react";
import { ApiQueryParams, ApiResponse } from "@/types/ui/data-table-types";
import { SortingState, PaginationState } from "@tanstack/react-table";
import { MutationResponse } from "@/types/api/auth";

// Utility to clean empty/null fields
function cleanParams(params: Record<string, any>): Record<string, any> {
  return Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== "" && value !== null && value !== undefined
    )
  );
}

interface UseDataTableFetchProps<TData> {
  fetchData: (
    params: ApiQueryParams
  ) => Promise<ApiResponse<TData> | MutationResponse<TData[]>>;
  pagination: PaginationState;
  sorting: SortingState;
  globalFilter: string;
  advancedFilters?: Record<string, any>;
  setTableData: (data: TData[]) => void;
  setTotalCount: (count: number) => void;
}

export function useDataTableFetch<TData>({
  fetchData,
  pagination,
  sorting,
  globalFilter,
  advancedFilters = {},
  setTableData,
  setTotalCount,
}: UseDataTableFetchProps<TData>) {
  const [isLoading, setIsLoading] = useState(false);

  const loadData = useCallback(
    async (skipInitialLoad = false) => {
      if (skipInitialLoad) setIsLoading(true);

      try {
        const params: ApiQueryParams = {
          page: pagination.pageIndex + 1,
          pageSize: pagination.pageSize,
          search: globalFilter || undefined,
        };

        if (sorting.length > 0) {
          const sort = sorting[0];
          params.sortField = String(sort.id);
          params.sortDirection = sort.desc ? "desc" : "asc";
        }

        const mergedParams = cleanParams({
          ...params,
          ...advancedFilters,
        });

        const response = await fetchData(mergedParams);
        const responseData = (response.data || []).map((row) => ({
          ...row,
          isEditMode: false,
        })) as TData[];

        setTableData(responseData);
        setTotalCount(response.totalCount || 0);
      } catch (error) {
        console.error("Failed to fetch table data:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [fetchData, pagination, sorting, globalFilter, advancedFilters]
  );

  return {
    loadData,
    isLoading,
  };
}
