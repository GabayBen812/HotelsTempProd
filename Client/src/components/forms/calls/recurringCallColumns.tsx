import { ColumnDef } from "@tanstack/react-table";
import { RecurringCall } from "@/types/api/calls";
import { TFunction } from "i18next";

export const getRecurringCallColumns = (
  t: TFunction,
  categoriesMap: Record<string, string>,
  departmentsMap: Record<string, string>,
  locationsMap: Record<string, string>
): ColumnDef<RecurringCall>[] => [
  { accessorKey: "title", header: t("title") },
  { accessorKey: "description", header: t("description") },
  {
    accessorKey: "callCategoryId",
    header: t("call_category"),
    cell: ({ row }) => categoriesMap[row.original.callCategoryId] || "-",
  },
  {
    accessorKey: "locationId",
    header: t("location"),
    cell: ({ row }) => locationsMap[row.original.locationId] || "-",
  },
  {
    accessorKey: "departmentId",
    header: t("department"),

    cell: ({ row }) => (
      <div className="bg-background w-fit px-3 rounded-md">
        {departmentsMap[row.original.departmentId] || "-"}
      </div>
    ),
  },
];
