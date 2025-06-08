import { MutationResponse } from "@/types/api/auth";
import { createApiService } from "../utils/apiFactory";
import { Permission } from "@/types/api/roles";

const permissionsApi = createApiService<Permission[]>("/permissions", {
  includeOrgId: true,
  customRoutes: {
    fetch: (roleId: number) => ({ url: "/permissions", params: { roleId } }),
  },
});

export const fetchPermissions = async (
  id: number
): Promise<MutationResponse<Permission[]>> => permissionsApi.fetch(id);

export const updatePermissions = (data: Permission[]) => {
  // @ts-ignore
  return permissionsApi.update(data);
};
export const upsertPermissions = (data: Permission[]) => {
  return permissionsApi.customRequest("put", "/permissions/upsert", {
    data,
  }) as Promise<MutationResponse<Permission[]>>;
};
export const deletePermission = permissionsApi.delete;
