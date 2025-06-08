import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UpdateUserPayload, User } from "@/types/api/user";
import { fetchUsers, fetchUsersParams, updateUser } from "@/api/users/index";
import { MutationResponse } from "@/types/api/auth";

export function useUser() {
  const queryClient = useQueryClient();
  const allUsersQuery = useQuery<MutationResponse<User[]>>({
    queryKey: ["users"],
    queryFn: fetchUsersParams,
    retry: false,
  });

  const updateUserMutation = useMutation<
    MutationResponse<User>,
    Error,
    UpdateUserPayload
  >({
    mutationFn: updateUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["user"] }),
  });

  return {
    allUsers: allUsersQuery.data?.data || [],
    isAllUsersLoading: allUsersQuery.isLoading,
    fetchUsersManually: allUsersQuery.refetch,
    updateUser: updateUserMutation.mutateAsync,
    isUpdateUserPending: updateUserMutation.isPending,
  };
}
