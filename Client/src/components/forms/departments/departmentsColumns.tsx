// components/columns/callColumns.ts
import { ColumnDef } from "@tanstack/react-table";
import { i18n, TFunction } from "i18next";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Building } from "lucide-react";
import { Department } from "@/types/api/departments";
export const getDepartmentsColumns = (
  t: TFunction,
  i18n: i18n
): ColumnDef<Department>[] => [
  {
    accessorKey: "logo",
    header: t("picture"),
    cell: ({ row }) => (
      <div>
        {
          <Avatar className="rounded-md size-12">
            <AvatarImage
              className="object-cover rounded-full"
              src={row.getValue("logo")}
            />
            <AvatarFallback className="rounded-md text-surface bg-foreground">
              <Building className="size-4" />
            </AvatarFallback>
          </Avatar>
        }
      </div>
    ),
    size: 100,
  },
  {
    accessorKey: "name",
    header: t("name"),
    cell: ({ row }) => (
      <div>
        {row.original.name[i18n.language as "he" | "en" | "ar"] ||
          row.original.name.en}
      </div>
    ),
    size: 100,
  },
];
