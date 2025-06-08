import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MutationResponse } from "@/types/api/auth";
import { Department } from "@/types/api/departments";
import {
  fetchDepartments,
  createNewDepartment,
  deleteDepartment,
  updateDepartment,
} from "@/api/departments/index";

export function useDepartments(enable = true) {
  const queryClient = useQueryClient();

  // Fetch departments query
  const fetchDepartmentsQuery = useQuery<MutationResponse<Department[]>, Error>(
    {
      queryKey: ["departments"],
      queryFn: fetchDepartments,
      retry: false,
      enabled: enable,
    }
  );

  // Create department mutation
  const createNewDepartmentMutation = useMutation<
    MutationResponse<Department>,
    Error,
    Department
  >({
    retry: false,
    mutationFn: createNewDepartment,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["departments"] }),
  });

  // Delete department mutation
  const deleteDepartmentMutation = useMutation<
    MutationResponse<null>,
    Error,
    number
  >({
    mutationFn: deleteDepartment,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["departments"] }),
  });

  // Update department mutation
  const updateDepartmentMutation = useMutation<
    MutationResponse<Department>,
    Error,
    Department
  >({
    mutationFn: updateDepartment,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["departments"] }),
  });

  return {
    // Queries
    departmentsQueryFunction: fetchDepartments,
    departments: fetchDepartmentsQuery.data?.data || [],
    departmentsStatus: fetchDepartmentsQuery.status,

    // Mutations
    createNewDepartment: createNewDepartmentMutation.mutateAsync,
    createNewDepartmentStatus: createNewDepartmentMutation.status,
    deleteDepartment: deleteDepartmentMutation.mutateAsync,
    updateDepartment: updateDepartmentMutation.mutateAsync,
  };
}
