// components/forms/callFields.ts
import React from "react";
import { FieldConfig } from "@/components/forms/DynamicForm";
import { Department } from "@/types/api/departments";
import { formatOptions } from "@/utils/data-table/formatOptions";
import { TFunction } from "i18next";
import { FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/Input";
import { UseFormReturn } from "react-hook-form";

import LanguageInput from "@/components/miscellaneous/LanguageInput";
import { ImageUpload } from "../ImageUpload";
import { SelectField } from "../SelectField";

export function getCallSettingsFields(
  t: TFunction,
  language: "he" | "en" | "ar",
  departments: Department[]
): FieldConfig[] {
  const formattedDepartments = formatOptions(
    departments,
    language,
    //@ts-ignore
    (key) => key
  );
  return [
    { name: "logo", label: t("picture"), type: "image" },
    { name: "name", label: t("name"), type: "language" },
    {
      name: "departmentId",
      label: t("department"),
      type: "autocomplete",
      options: formattedDepartments,
    },
    {
      name: "expectedTime",
      label: t("expected_time"),
      type: "number",
    },
  ];
}

export const callSettingsFields = (
  form: UseFormReturn<any>,
  departments: any[],
  t: any
): { name: string; component: React.ReactNode }[] => [
  {
    name: "name",
    component: (
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <LanguageInput
            label={t("name")}
            defaultValue={field.value}
            onLanguageValuesChange={(val) => {
              form.setValue("name", val);
            }}
          />
        )}
      />
    ),
  },
  {
    name: "logo",
    component: (
      <FormField
        control={form.control}
        name="logo"
        render={({ field }) => (
          <ImageUpload
            label={t("picture")}
            defaultValue={field.value}
            onImageChange={(val) => {
              form.setValue("logo", val);
            }}
          />
        )}
      />
    ),
  },
  {
    name: "departmentId",
    component: (
      <FormField
        control={form.control}
        name="departmentId"
        render={({ field }) => (
          <SelectField
            label={t("department")}
            options={departments}
            value={field.value}
            onChange={(val) => {
              form.setValue("departmentId", val);
            }}
          />
        )}
      />
    ),
  },
  {
    name: "expectedTime",
    component: (
      <FormField
        control={form.control}
        name="expectedTime"
        render={({ field }) => (
          <div className="flex flex-col gap-1">
            <label>{t("expected_time")}</label>
            <Input
              type="number"
              min={1}
              {...field}
              onChange={(e) => field.onChange(Number(e.target.value))}
            />
          </div>
        )}
      />
    ),
  },
];
