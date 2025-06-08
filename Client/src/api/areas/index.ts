import { MutationResponse } from "@/types/api/auth";
import { createApiService } from "../utils/apiFactory";
import { Area } from "@/types/api/areas.type";
import { ApiQueryParams, ApiResponse } from "@/types/ui/data-table-types";
const areaApi = createApiService<Area>("/areas", {
  includeOrgId: true,
  customRoutes: {},
});

export const fetchAreas = async (): Promise<MutationResponse<Area[]>> =>
  areaApi.fetchAll({}, true) as Promise<MutationResponse<Area[]>>;

export const fetchAreasParams = async (
  params: ApiQueryParams
): Promise<ApiResponse<Area>> =>
  areaApi.fetchAll(params, true) as Promise<ApiResponse<Area>>;

export const createAreas = areaApi.create;

export const deleteAreas = areaApi.delete;

export const updateAreas = areaApi.update;

export const upsertAreas = async (
  areas: Area[]
): Promise<MutationResponse<Area[]>> => {
  const response = await areaApi.customRequest<Area[]>("post", "/upsert", {
    data: areas,
  });
  return response as MutationResponse<Area[]>;
};
