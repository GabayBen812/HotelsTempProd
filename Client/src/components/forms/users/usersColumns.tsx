import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@/types/api/user";
import { ColumnDef } from "@tanstack/react-table";
import { i18n, TFunction } from "i18next";
import { Hotel } from "lucide-react";

export const getUsersColumns = (
  t: TFunction,
  i18n: i18n,
  departmentsMap: Record<string, string>
) => {
  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "logo",
      header: t("picture"),
      cell: ({ row }) => (
        <Avatar className="h-8 w-8">
          {row.original.logo ? (
            <AvatarImage src={row.original.logo} />
          ) : (
            <AvatarFallback>
              <Hotel className="h-4 w-4" />
            </AvatarFallback>
          )}
        </Avatar>
      ),
      size: 100,
    },
    {
      accessorKey: "name",
      header: t("name"),
      cell: ({ row }) => <div>{row.original.name}</div>,
      size: 100,
    },
    {
      accessorKey: "email",
      header: t("email"),
      cell: ({ row }) => <div>{row.original.email}</div>,
      size: 100,
    },

    {
      accessorKey: "role",
      header: t("role"),
      cell: ({ row }) => {
        const firstRole = row.original.organizationRoles?.[0]?.role;
        if (!firstRole) return "-";
        return (
          <div>
            {firstRole.name[i18n.language as "he" | "en" | "ar"] || firstRole.name.en}
          </div>
        );
      },
      size: 100,
    },
    {
      accessorKey: "departmentId",
      header: t("department"),

      cell: ({ row }) => (
        <div className="bg-background w-fit px-3 rounded-md">
          {row.original.organizationRoles?.[0]?.departmentId
            ? departmentsMap[row.original.organizationRoles[0].departmentId] ||
              "-"
            : "-"}
        </div>
      ),
    },
  ];
  return columns;
};
