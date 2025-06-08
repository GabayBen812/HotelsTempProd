import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UpdateUserPayload, User } from "@/types/api/user";
import { fetchUsersParams, updateUser } from "@/api/users/index";
import { MutationResponse } from "@/types/api/auth";

export function useUser() {
  const queryClient = useQueryClient();
  const allUsersQuery = useQuery<MutationResponse<User[]>>({
    queryKey: ["users"],
    // @ts-ignore
    queryFn: fetchUsersParams,
    retry: false,
  });

  const updateUserMutation = useMutation<
    MutationResponse<User>,
    Error,
    UpdateUserPayload
  >({
    // @ts-ignore
    mutationFn: updateUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["user"] }),
  });

  return {
    // @ts-ignore
    allUsers: allUsersQuery.data?.data || [],
    isAllUsersLoading: allUsersQuery.isLoading,
    fetchUsersManually: allUsersQuery.refetch,
    updateUser: updateUserMutation.mutateAsync,
    isUpdateUserPending: updateUserMutation.isPending,
  };
}
