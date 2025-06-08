import { Call } from "@/types/api/calls";
import { createApiService } from "../utils/apiFactory";
import { MutationResponse } from "@/types/api/auth";
import { ApiQueryParams, ApiResponse } from "@/types/ui/data-table-types";

export const callsApi = createApiService<Call>("/calls", {
  includeOrgId: true,
});

export const fetchCalls = async (): Promise<MutationResponse<Call[]>> =>
  callsApi.fetchAll({ include: { callCategory: true } }) as Promise<MutationResponse<Call[]>>;

export const fetchCallsParams = async (
  params: ApiQueryParams
): Promise<ApiResponse<Call>> =>
  callsApi.fetchAll({ ...params, include: { callCategory: true } }, true) as Promise<ApiResponse<Call>>;

export const createCall = callsApi.create;

export const deleteCall = callsApi.delete;

export const updateCall = callsApi.update;
