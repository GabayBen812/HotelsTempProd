import { MutationResponse } from "@/types/api/auth";
import { ApiQueryParams } from "@/types/ui/data-table-types";
import { getSelectedOrganization } from "@/utils/hooks/UseOrganizationUtils";
import axios from "axios";

/**
 * Builds query parameters object from API params
 */
export const buildQueryParams = (
  params: ApiQueryParams
): Record<string, string> => {
  if (!params) return {};
  const organizationId = String(getSelectedOrganization());

  const queryParams: Record<string, string> = {
    organizationId,
    page: params?.page?.toString() || "",
    pageSize: params?.pageSize?.toString() || "",
  };

  Object.entries(params).forEach(([key, value]) => {
    if (
      value !== undefined &&
      value !== null &&
      value !== "" &&
      !["page", "pageSize"].includes(key)
    ) {
      queryParams[key] = String(value);
    }
  });

  return queryParams;
};

/**
 * Handles API errors and formats them consistently
 */
export const handleApiError = (error: unknown): MutationResponse<never> => {
  console.error("Error fetching departments:", error);

  if (axios.isAxiosError(error)) {
    return {
      status: error.response?.status || 500,
      error: error.response?.data?.message || error.message || "Unknown error",
    };
  }

  return {
    status: 500,
    error: "Unknown error",
  };
};
