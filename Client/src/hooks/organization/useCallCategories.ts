import { useMutation, useQuery } from "@tanstack/react-query";
import { MutationResponse } from "@/types/api/auth";
import {
  fetchCallCategories,
  deleteCallCategory,
  createCallCategory,
} from "@/api/calls/categories";
import { CallCategory } from "@/types/api/calls";

export function useCallCategories(enable = true) {
  // Fetch call categories query
  const fetchCallCategoriesQuery = useQuery<
    MutationResponse<CallCategory[]>,
    Error
  >({
    queryKey: ["callCategories"],
    queryFn: fetchCallCategories,
    retry: false,
    enabled: enable,
  });

  // Delete call category mutation
  const deleteCallCategoryMutation = useMutation<
    MutationResponse<null>,
    Error,
    number
  >({
    mutationFn: deleteCallCategory,
  });

  // Create call category mutation
  const createNewCallCategoryMutation = useMutation<
    MutationResponse<CallCategory>,
    Error,
    CallCategory
  >({
    mutationFn: createCallCategory,
    onSuccess: () => fetchCallCategoriesQuery.refetch(),
  });

  return {
    // Queries
    callCategories: fetchCallCategoriesQuery.data?.data || [],
    fetchCallCategoriesStatus: fetchCallCategoriesQuery.status,
    refetchCallCategories: fetchCallCategoriesQuery.refetch,

    // Mutations
    createNewCallCategory: createNewCallCategoryMutation.mutateAsync,
    createNewCallCategoryStatus: createNewCallCategoryMutation.status,
    deleteCallCategory: deleteCallCategoryMutation.mutateAsync,
    deleteCallCategoryStatus: deleteCallCategoryMutation.status,
  };
}
