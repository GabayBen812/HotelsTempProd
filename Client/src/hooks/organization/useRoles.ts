import { createRole, deleteRole, fetchRoles, updateRole } from "@/api/roles";
import { MutationResponse } from "@/types/api/auth";
import { Role } from "@/types/api/roles";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useRoles(enable = true) {
  const queryClient = useQueryClient();

  // Fetch roles query
  const fetchRolesQuery = useQuery<MutationResponse<Role[]>, Error>({
    queryKey: ["roles"],
    queryFn: fetchRoles,
    retry: false,
    enabled: enable,
  });

  const createNewRoleMutation = useMutation<
    MutationResponse<Role>,
    Error,
    Partial<Role>
  >({
    mutationFn: createRole,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["roles"] }),
  });

  const updateRoleMutation = useMutation<MutationResponse<Role>, Error, Role>({
    mutationFn: updateRole,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["roles"] }),
  });

  const deleteRoleMutation = useMutation<MutationResponse<null>, Error, number>(
    {
      mutationFn: deleteRole,
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ["roles"] }),
    }
  );

  return {
    // Queries
    roles: fetchRolesQuery.data?.data || [],
    rolesStatus: fetchRolesQuery.status,

    // Mutations
    createNewRole: createNewRoleMutation.mutateAsync,
    createNewRoleStatus: createNewRoleMutation.status,
    updateRole: updateRoleMutation.mutateAsync,
    updateRoleStatus: updateRoleMutation.status,
    deleteRole: deleteRoleMutation.mutateAsync,
    deleteRoleStatus: deleteRoleMutation.status,
  };
}
