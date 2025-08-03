import { getGuestOrganizationInformation } from "@/api/guestCalls";
import { useQuery } from "@tanstack/react-query";

export function useGuest() {
  const organizationQuery = useQuery({
    queryKey: ["guest-organization"],
    queryFn: getGuestOrganizationInformation,
    retry: false,
  });

  return {
    organization: (organizationQuery.data as any)?.data || {},
    isOrganizationLoading: organizationQuery.isLoading,
  };
}
