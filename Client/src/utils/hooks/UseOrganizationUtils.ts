import { resolveTheme } from "@/lib/themeUtils";
import { Organization } from "@/types/api/organization";

/**
 * Gets the currently selected organization ID from localStorage
 */
export const getSelectedOrganization = (): number =>
  Number(localStorage.getItem("selectedOrganization"));

/**
 * Sets the selected organization ID in localStorage
 */
export const setSelectedOrganization = (id: number): void => {
  localStorage.setItem("selectedOrganization", id.toString());
};

/**
 * Applies the organization's theme to the document
 */
export const applyOrganizationTheme = (organization?: Organization): void => {
  if (!organization?.customStyles?.accentColor) return;

  const accentColor = organization.customStyles.accentColor;
  const resolvedColor = resolveTheme(accentColor).accent;
  const resolvedTablesColor = resolveTheme(accentColor).datatableHeader;
  const resolveColorPrimary = resolveTheme(accentColor).primary;
  const resolvedBackgroundColor = resolveTheme(accentColor).background;
  const resolvedTabsBg = resolveTheme(accentColor).tabsBg;

  document.documentElement.style.setProperty("--accent", resolvedColor);
  document.documentElement.style.setProperty("--sidebar-accent", resolvedColor);
  document.documentElement.style.setProperty(
    "--datatable-header",
    resolvedTablesColor
  );
  document.documentElement.style.setProperty("--primary", resolveColorPrimary);
  document.documentElement.style.setProperty(
    "--background",
    resolvedBackgroundColor
  );
  document.documentElement.style.setProperty("--border", resolvedTabsBg);
};
