import { ApiQueryParams, ApiResponse } from "@/types/ui/data-table-types";
import { createApiService } from "../utils/apiFactory";
import { Location } from "@/types/api/locations";
import { MutationResponse } from "@/types/api/auth";
const locationsApi = createApiService<Location>("/locations", {
  includeOrgId: true,
  customRoutes: {},
});

export const fetchLocations = async (): Promise<MutationResponse<Location[]>> =>
  locationsApi.fetchAll({}, true) as Promise<MutationResponse<Location[]>>;

export const fetchLocationsParams = async (
  params: ApiQueryParams
): Promise<ApiResponse<Location>> =>
  locationsApi.fetchAll(params, true) as Promise<ApiResponse<Location>>;

export const fetchLocationById = async (
  id: number,
  params?: ApiQueryParams
): Promise<ApiResponse<Location>> =>
  (await locationsApi.fetchById(id, params))
    .data as unknown as ApiResponse<Location>;

export const createLocation = locationsApi.create;
export const updateLocation = locationsApi.update;
export const deleteLocation = locationsApi.delete;
