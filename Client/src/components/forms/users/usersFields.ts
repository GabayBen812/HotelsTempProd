import { TFunction } from "i18next";
import { FieldConfig } from "../DynamicForm";
import { Role } from "@/types/api/roles";
import { formatOptions } from "@/utils/data-table/formatOptions";
import { Department } from "@/types/api/departments";

export function getUserFormFields(
  mode: "create" | "edit",
  editPasswordMode: boolean,
  roles: Role[],
  departments: Department[],
  t: TFunction,
  language: "he" | "en" | "ar"
): FieldConfig[] {
  const roleOptions = formatOptions(roles, language);
  const departmentOptions = formatOptions(departments, language);
  return [
    { name: "logo", label: t("picture"), type: "image" },
    { name: "email", label: t("email"), type: "email" },
    { name: "name", label: t("name"), type: "text" },
    { name: "username", label: t("username"), type: "text" },

    {
      name: "role",
      label: t("role"),
      type: "autocomplete",
      options: roleOptions,
    },
    {
      name: "departmentId",
      label: t("department"),
      type: "autocomplete",
      options: departmentOptions,
    },
    {
      name: "password",
      label: t("password"),
      type: mode === "create" || editPasswordMode ? "text" : "readonly",
      props:
        mode === "create" || editPasswordMode
          ? {}
          : {
              placeholder: "******",
              readOnly: true,
            },
    },
  ];
}
