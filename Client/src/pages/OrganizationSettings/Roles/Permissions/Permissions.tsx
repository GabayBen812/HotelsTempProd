import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import PermissionsCard from "./PermissionsCard";
import { Permission, Action, Resource, Scope } from "@/types/api/roles";
import { usePermissions } from "@/hooks/organization/usePermissions";
import { toast } from "sonner";
const actions: Action[] = ["view", "update", "create", "delete"];
const scopes: { label: string; value: Scope }[] = [
  { label: "Any", value: "any" },
  { label: "Own", value: "own" },
  { label: "None", value: "none" },
];

const scopeOptionsMap: Partial<
  Record<Resource, Partial<Record<Action, Scope[]>>>
> = {
  site: { view: ["any", "none"] },
  app: { view: ["any", "none"] },
  roles: {
    view: ["any", "none"],
    update: ["any", "none"],
    create: ["any", "none"],
    delete: ["any", "none"],
  },
  departments: {
    view: ["any", "own", "none"],
    create: ["any", "none"],
    update: ["any", "own", "none"],
    delete: ["any", "own", "none"],
  },
};

function Permissions({ id }: { id: string | null }) {
  const { t } = useTranslation();
  const {
    permissions: originalPermissions,
    isLoading,
    isError,
    savePermissions,
    isSaving,
  } = usePermissions(id);
  const [permissions, setPermissions] = useState<Permission[]>([]);

  useEffect(() => {
    if (permissions.length === 0 && originalPermissions.length > 0)
      setPermissions(originalPermissions);
  }, [originalPermissions]);

  // Group permissions by resource
  const grouped = useMemo(
    () =>
      permissions.reduce<Record<Resource, Permission[]>>((acc, curr) => {
        if (!acc[curr.resource]) acc[curr.resource] = [];
        acc[curr.resource].push(curr);
        return acc;
      }, {} as Record<Resource, Permission[]>),
    [permissions]
  );

  // Get allowed scopes for a resource/action
  const getAllowedScopes = (resource: Resource, action: Action): Scope[] => {
    return scopeOptionsMap?.[resource]?.[action] ?? scopes.map((s) => s.value);
  };

  // Detect if a resource's permissions have changed
  const hasResourceChanged = (resource: Resource) => {
    const current = permissions.filter((p) => p.resource === resource);
    const original = originalPermissions.filter((p) => p.resource === resource);
    return current.some((p, i) => p.scope !== original[i]?.scope);
  };

  // Handle scope change for a permission
  const handleScopeChange = (
    resource: Resource,
    action: Action,
    newScope: Scope
  ) => {
    setPermissions((prev) =>
      prev.map((perm) =>
        perm.resource === resource && perm.action === action
          ? { ...perm, scope: newScope }
          : perm
      )
    );
  };

  // Save permissions for a resource
  const handleResourceSave = async (resource: Resource) => {
    const updated = permissions.filter((p) => p.resource === resource);
    await savePermissions(updated);
    toast.success("Event has been Edited");
  };

  if (isLoading)
    return (
      <div className="text-center py-8">
        {t("loading_permissions", "טוען הרשאות...")}
      </div>
    );
  if (isError)
    return (
      <div className="text-center text-red-500 py-8">
        {t("error_loading_permissions", "שגיאה בטעינת ההרשאות.")}
      </div>
    );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {Object.entries(grouped).map(([resource, perms]) => (
        <PermissionsCard
          key={resource}
          resource={resource as Resource}
          perms={perms}
          actions={actions}
          scopes={scopes}
          t={t}
          isSaving={isSaving}
          resourceChanged={hasResourceChanged(resource as Resource)}
          handleResourceSave={handleResourceSave}
          handleScopeChange={handleScopeChange}
          getAllowedScopes={getAllowedScopes}
        />
      ))}
    </div>
  );
}

export default Permissions;
