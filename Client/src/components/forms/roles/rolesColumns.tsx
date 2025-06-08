// components/columns/callColumns.ts
import { ColumnDef } from "@tanstack/react-table";
import { i18n, TFunction } from "i18next";
import { Role } from "@/types/api/roles";
import PeopleIcon from "@/assets/icons/PeopleIcon";
export const getRolesColumns = (
  t: TFunction,
  i18n: i18n
): ColumnDef<Role>[] => [
  {
    accessorKey: "name",
    header: t("name"),
    cell: ({ row }) => (
      <div>{row?.original?.name[i18n.language as "he" | "en" | "ar"] || row?.original?.name.en}</div>
    ),
    size: 100,
  },
  {
    accessorKey: "userCount",
    header: t("users_count"),
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <PeopleIcon />
        {row?.original?.userCount || 0}
        <h1>אנשים</h1>
      </div>
    ),
    size: 100,
  },
];
