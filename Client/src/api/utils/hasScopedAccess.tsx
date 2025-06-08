import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import { Permission } from "@/types/api/roles";

type HasScopedAccessParams = {
  resource: string;
  action: string;
};

export function useHasScopedAccess({
  resource,
  action,
}: HasScopedAccessParams): boolean {
  const { user } = useContext(AuthContext);

  const permissions: Permission[] | undefined =
    user?.organizationRoles?.[0]?.role?.permissions;

  if (!permissions) return false;

  const matched = permissions.find(
    (p) => p.resource === resource && p.action === action
  );

  return matched?.scope !== "none";
}
