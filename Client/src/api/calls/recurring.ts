import { RecurringCall } from "@/types/api/calls";
import { createApiService } from "../utils/apiFactory";
import { MutationResponse } from "@/types/api/auth";
import { ApiQueryParams, ApiResponse } from "@/types/ui/data-table-types";

export const recurringCallsApi = createApiService<RecurringCall>(
  "/calls/recurring",
  {
    includeOrgId: true,
  }
);

export const fetchRecurringCalls = async (): Promise<
  MutationResponse<RecurringCall[]>
> => recurringCallsApi.fetchAll() as Promise<MutationResponse<RecurringCall[]>>;

export const fetchRecurringCallsParams = async (
  params: ApiQueryParams
): Promise<ApiResponse<RecurringCall>> =>
  recurringCallsApi.fetchAll(params, true) as Promise<
    ApiResponse<RecurringCall>
  >;

export const createRecurringCall = recurringCallsApi.create;

export const deleteRecurringCall = recurringCallsApi.delete;

export const updateRecurringCall = recurringCallsApi.update;
