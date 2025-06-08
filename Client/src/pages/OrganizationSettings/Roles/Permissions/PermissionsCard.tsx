import PermissionScopeSelector from "./PermissionScopeSelector";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Action, Permission, Resource, Scope } from "@/types/api/roles";
import { TFunction } from "i18next";

interface Props {
  resource: Resource;
  perms: Permission[];
  actions: Action[];
  scopes: {
    label: string;
    value: Scope;
  }[];
  t: TFunction;
  isSaving: boolean;
  resourceChanged: boolean;
  handleResourceSave: (resource: Resource) => Promise<void>;
  handleScopeChange: (
    resource: Resource,
    action: Action,
    newScope: Scope
  ) => void;
  getAllowedScopes: (resource: Resource, action: Action) => Scope[];
}

function PermissionsCard({
  resource,
  perms,
  actions,
  scopes,
  t,
  isSaving,
  resourceChanged,
  handleResourceSave,
  handleScopeChange,
  getAllowedScopes,
}: Props) {
  return (
    <Card className="border-muted shadow-sm w-full">
      <CardContent className="p-6 space-y-4">
        <h2 className="text-xl font-semibold capitalize border-b pb-2">
          {t(`resources.${resource}`) ?? resource}
        </h2>
        <div className={`flex child:flex-1 gap-4 flex-wrap`}>
          {actions.map((action: Action) => {
            const current = perms.find((p: Permission) => p.action === action);
            if (!current) return null;
            const allowedScopes = getAllowedScopes(resource, action);
            return (
              <PermissionScopeSelector
                key={action}
                action={action}
                current={current}
                allowedScopes={allowedScopes}
                scopes={scopes}
                t={t}
                handleScopeChange={handleScopeChange}
                resource={resource}
              />
            );
          })}
        </div>
        <div className="flex justify-end pt-4">
          <Button
            disabled={!resourceChanged || isSaving}
            onClick={() => handleResourceSave(resource)}
            className="rounded-xl px-5 py-2 text-sm font-medium shadow-md transition-all text-light"
          >
            {isSaving && resourceChanged
              ? t("saving", "שומר...")
              : t("save", "שמור")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default PermissionsCard;
