import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { MutationResponse } from "@/types/api/auth";
import {
  NewOrganizationPayload,
  Organization,
  UpdateOrganizationPayload,
} from "@/types/api/organization";
import {
  fetchOrganizations,
  fetchOrganization,
  createNewOrganization,
  updateOrganization,
} from "@/api/organizations/index";
import { applyOrganizationTheme } from "@/utils/hooks/UseOrganizationUtils";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

export function useOrganizationCore() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  // Fetch organizations list
  const fetchOrganizationsQuery = useQuery<
    MutationResponse,
    Error,
    MutationResponse<Organization[]>
  >({
    queryKey: ["organizations"],
    queryFn: fetchOrganizations,
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Fetch single organization
  const fetchOrganizationQuery = useQuery<
    MutationResponse,
    Error,
    MutationResponse<Organization>
  >({
    queryKey: ["organization"],
    queryFn: fetchOrganization,
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Create organization mutation
  const createNewOrganizationMutation = useMutation<
    MutationResponse<Organization>,
    Error,
    NewOrganizationPayload
  >({
    mutationFn: createNewOrganization,
  });

  // Update organization mutation
  const updateOrganizationMutation = useMutation<
    MutationResponse<Organization>,
    Error,
    UpdateOrganizationPayload
  >({
    mutationFn: updateOrganization,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["organizations"] }),
    onError: () => toast.error(t("error_updating_organization")),
  });

  // Select organization
  const selectOrganization = (id: number) => {
    localStorage.setItem("selectedOrganization", id.toString());
    queryClient.invalidateQueries({
      queryKey: ["departments"],
    });
    queryClient.invalidateQueries({
      queryKey: ["organization"],
    });
  };

  // Apply theme based on organization settings
  const organization = fetchOrganizationQuery.data?.data;
  useEffect(() => {
    applyOrganizationTheme(organization);
  }, [organization]);

  return {
    // Organizations list
    organizations: fetchOrganizationsQuery.data,
    organizationsStatus: fetchOrganizationsQuery.status,
    refetchOrganizations: fetchOrganizationsQuery.refetch,

    // Single organization
    organization,
    isOrganizationFetching: fetchOrganizationQuery.isFetching,
    refetchOrganization: fetchOrganizationQuery.refetch,

    // Mutations
    createNewOrganization: createNewOrganizationMutation.mutateAsync,
    updateOrganization: updateOrganizationMutation.mutateAsync,
    isCreateNewOrganizationLoading:
      createNewOrganizationMutation.status === "pending",

    // Utilities
    selectOrganization,
  };
}
