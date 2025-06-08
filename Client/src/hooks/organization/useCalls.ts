import { fetchCalls } from "@/api/calls";
import { MutationResponse } from "@/types/api/auth";
import { Call } from "@/types/api/calls";
import { useQuery } from "@tanstack/react-query";

export function useCalls() {
  const fetchCallQuery = useQuery<MutationResponse<Call[]>, Error>({
    queryKey: ["calls"],
    queryFn: fetchCalls,
    retry: false,
  });

  return {
    calls: fetchCallQuery.data?.data || [],
    isCallsLoading: fetchCallQuery.isLoading,
    fetchCallsManually: fetchCallQuery.refetch,
  };
}
