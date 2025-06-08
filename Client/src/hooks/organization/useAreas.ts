import { createAreas, fetchAreas, upsertAreas } from "@/api/areas";
import { Area } from "@/types/api/areas.type";
import { MutationResponse } from "@/types/api/auth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useAreas(enable = true) {
  const queryClient = useQueryClient();
  const fetchAreasQuery = useQuery<MutationResponse<Area[]>, Error>({
    queryKey: ["areas"],
    queryFn: fetchAreas,
    retry: false,
    enabled: enable,
  });

  // Create area mutation
  const createNewAreaMutation = useMutation<
    MutationResponse<Area>,
    Error,
    Area
  >({
    mutationFn: createAreas,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["areas"] }),
  });

  // upsert area mutation
  const upsertAreaMutation = useMutation<
    MutationResponse<Area[]>,
    Error,
    Area[]
  >({
    mutationFn: upsertAreas,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["areas"] }),
  });

  return {
    // Queries
    areas: fetchAreasQuery.data?.data || [],
    areasisLoading: fetchAreasQuery.isLoading,

    // Mutations
    createNewArea: createNewAreaMutation.mutate,
    createNewAreaStatus: createNewAreaMutation.status,
    createNewAreaError: createNewAreaMutation.error,
    upsertArea: upsertAreaMutation.mutate,
    upsertAreaStatus: upsertAreaMutation.status,
    upsertAreaError: upsertAreaMutation.error,
  };
}
