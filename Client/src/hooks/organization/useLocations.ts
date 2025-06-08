import { fetchLocations } from "@/api/locations";
import { MutationResponse } from "@/types/api/auth";
import { Location } from "@/types/api/locations";
import { useQuery } from "@tanstack/react-query";

export function useLocations() {
  const fetchLocationsQuery = useQuery<MutationResponse<Location[]>, Error>({
    queryKey: ["calls"],
    queryFn: fetchLocations,
    retry: false,
  });

  return {
    locations: fetchLocationsQuery.data?.data || [],
    isLocationsLoading: fetchLocationsQuery.isLoading,
    fetchCallsManually: fetchLocationsQuery.refetch,
  };
}
