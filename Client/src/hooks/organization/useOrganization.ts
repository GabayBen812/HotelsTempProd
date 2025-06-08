import { useOrganizationCore } from "./useOrganizationCore";
import { useDepartments } from "./useDepartments";
import { useCallCategories } from "./useCallCategories";
import { useAreas } from "./useAreas";
import { useRoles } from "./useRoles";

/**
 * Main hook that composes all organization-related functionality
 * This provides a unified API for organization, departments, and call categories
 */
export function useOrganization() {
  const organizationCore = useOrganizationCore();
  const organizationLoaded = !!organizationCore?.organization?.id;

  const departments = useDepartments(organizationLoaded);
  const callCategories = useCallCategories(organizationLoaded);
  const areas = useAreas(organizationLoaded);
  const roles = useRoles(organizationLoaded);
  return {
    // Re-export everything from the core organization hook
    ...organizationCore,

    // Re-export everything from the departments hook
    ...departments,

    // Re-export everything from the call categories hook
    ...callCategories,

    // Re-export everything from the areas hook
    ...areas,

    // Re-export everything from the roles hook
    ...roles,
  };
}
