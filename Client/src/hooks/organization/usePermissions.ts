import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchPermissions, upsertPermissions } from "@/api/permissions";
import { Permission } from "@/types/api/roles";

export function usePermissions(id: string | null) {
  const queryClient = useQueryClient();

  const {
    data = [],
    isLoading,
    isError,
  } = useQuery<Permission[], Error>({
    queryKey: ["permissions", id],
    queryFn: () => fetchPermissions(Number(id)).then((res) => res.data ?? []),
    enabled: !!id,
  });

  const { mutate: savePermissions, isPending: isSaving } = useMutation({
    mutationFn: (data: Permission[]) => upsertPermissions(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["permissions", id] });
    },
  });

  return {
    permissions: data,
    isLoading,
    isError,
    savePermissions,
    isSaving,
  };
}
