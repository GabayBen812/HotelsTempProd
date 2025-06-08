// components/forms/callFields.ts
import { FieldConfig } from "@/components/forms/DynamicForm";
import { CallCategory } from "@/types/api/calls";
import { Location } from "@/types/api/locations";
import { formatOptions } from "@/utils/data-table/formatOptions";
import { TFunction } from "i18next";

export function getRecurringCallFields(
  t: TFunction,
  language: "he" | "en" | "ar",
  locations: Location[],
  callCategories: CallCategory[]
): FieldConfig[] {
  // @ts-ignore
  const formattedLocations = formatOptions(locations, language, t);
  // @ts-ignore
  const formattedCategories = formatOptions(callCategories, language, t);

  return [
    { name: "title", type: "text", label: t("title") },
    { name: "description", type: "text", label: t("description") },
    {
      name: "locationId",
      type: "autocomplete",
      label: t("location"),
      options: formattedLocations,
    },
    {
      name: "callCategoryId",
      type: "autocomplete",
      label: t("call_category"),
      options: formattedCategories,
    },
    { name: "startDate", label: t("start_date"), type: "date" },
    { name: "endDate", label: t("end_date"), type: "date" },
    {
      name: "frequency",
      type: "autocomplete",
      label: t("frequency"),
      options: [
        { label: t("DAILY"), value: "DAILY" },
        { label: t("WEEKLY"), value: "WEEKLY" },
        { label: t("MONTHLY"), value: "MONTHLY" },
      ],
    },
    {
      name: "daysOfWeek",
      label: t("days_of_week"),
      type: "multi-checkbox" as const,
      options: [
        { label: t("sunday"), value: "0" },
        { label: t("monday"), value: "1" },
        { label: t("tuesday"), value: "2" },
        { label: t("wednesday"), value: "3" },
        { label: t("thursday"), value: "4" },
        { label: t("friday"), value: "5" },
        { label: t("saturday"), value: "6" },
      ],
    },
    { name: "times", label: t("times"), type: "multi-time" },
  ];
}
