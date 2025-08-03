// components/columns/callColumns.ts
import { ColumnDef } from "@tanstack/react-table";
import { i18n, TFunction } from "i18next";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DoorOpen } from "lucide-react";
export const getCallSettingsColumns = <T,>(
  t: TFunction,
  i18n: i18n
): ColumnDef<T>[] => [
  {
    accessorKey: "logo",
    header: t("picture"),
    cell: ({ row }) => (
      <Avatar className="rounded-md size-12">
        <AvatarImage className="object-cover" src={row.getValue("logo")} />
        <AvatarFallback className="bg-sidebar-primary text-surface rounded-md">
          <DoorOpen className="size-4" />
        </AvatarFallback>
      </Avatar>
    ),
    size: 100,
  },
  {
    accessorKey: "name",
    header: t("name"),
    cell: ({ row }) => {
      const name = row.getValue("name") as {
        he: string;
        en: string;
        ar: string;
      };
      return <div>{name[i18n.language as "he" | "en" | "ar"] || name.en}</div>;
    },
    size: 100,
  },
];
