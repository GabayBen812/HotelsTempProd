import { createApiService } from "@/api/utils/apiFactory";

const guestCallsApi = createApiService<unknown>("/guest", {
  includeOrgId: false,
});

export const getGuestOrganizationInformation = async () => {
  return await guestCallsApi.customRequest<{ message: string }>(
    "get",
    "/guest/organization"
  );
};
