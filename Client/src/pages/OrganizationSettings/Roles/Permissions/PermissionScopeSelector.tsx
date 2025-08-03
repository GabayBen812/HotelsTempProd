import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Action, Permission, Resource, Scope } from "@/types/api/roles";
import { TFunction } from "i18next";

interface Props {
  resource: Resource;
  action: Action;
  current: Permission;
  allowedScopes: Scope[];
  scopes: {
    label: string;
    value: Scope;
  }[];
  t: TFunction;
  handleScopeChange: (
    resource: Resource,
    action: Action,
    newScope: Scope
  ) => void;
}

function PermissionScopeSelector({
  action,
  current,
  allowedScopes,
  scopes,
  t,
  handleScopeChange,
  resource,
}: Props) {
  return (
    <div className="space-y-4">
      <div className="w-full bg-border/40 border-b py-1 px-4">
        <Label className="text-sm font-medium capitalize">
          {t(`actions.${action}`) ?? action}
        </Label>
      </div>

      <RadioGroup
        value={current.scope}
        onValueChange={(val: Scope) => handleScopeChange(resource, action, val)}
        className="flex flex-col space-y-3 rtl:items-end ltr:items-start px-4"
      >
        {allowedScopes.map((value: string) => {
          const label =
            scopes.find(
              (s: { label: string; value: Scope }) => s.value === value
            )?.label ?? value;
          return (
            <div
              key={value}
              className="flex items-center gap-2 rtl:flex-row-reverse ltr:flex-row"
            >
              <RadioGroupItem
                value={value}
                id={`${resource}-${action}-${value}`}
              />
              <Label
                htmlFor={`${resource}-${action}-${value}`}
                className="capitalize font-normal"
              >
                {t(`scopes.${label.toLowerCase()}`) ?? label}
              </Label>
            </div>
          );
        })}
      </RadioGroup>
    </div>
  );
}

export default PermissionScopeSelector;
