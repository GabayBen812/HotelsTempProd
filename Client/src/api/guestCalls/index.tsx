import { createApiService } from "@/api/utils/apiFactory";

const guestCallsApi = createApiService<any>("/guest", {
  includeOrgId: false,
});

export const createCallFromGuest = async (prompt: string) => {
  return await guestCallsApi.customRequest<{ message: string }>(
    "post",
    "/guest/create-call",
    {
      data: { prompt },
      rawDataOnly: true,
    }
  );
};
