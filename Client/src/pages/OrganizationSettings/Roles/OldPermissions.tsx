import { fetchPermissions, updatePermissions } from "@/api/permissions";
import { Checkbox } from "@/components/ui/checkbox";
import DataTable from "@/components/ui/completed/data-table";
import type { Permission } from "@/types//api/roles";
import { TableAction } from "@/types/ui/data-table-types";
import { ColumnDef, Row, Table } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";

interface Props {
  id: string | null;
}

function Permissions({ id }: Props) {
  const { t } = useTranslation();
  const onPermissionUpdate = async (
    row: Row<Permission>,
    table: Table<Permission>,
    action: "canView" | "canCreate" | "canUpdate" | "canDelete"
  ) => {
    // @ts-ignore
    if (!table?.options?.meta?.handleEdit) return;
    // @ts-ignore
    table.options.meta.handleEdit({
      ...row.original,
      // @ts-ignore
      [action]: !row.original[action],
    });
  };
  const columns: ColumnDef<Permission>[] = [
    {
      accessorKey: "resource",
      header: t("resource"),
      size: 100,
      cell: ({ row }) => (
        <div className="w-full flex justify-center">
          {t(row.original.resource)}
        </div>
      ),
    },
    {
      accessorKey: "canCreate",
      header: t("can_create"),
      size: 100,
      cell: ({ row, table }) => (
        <div className="w-full flex justify-center">
          <Checkbox
            className="w-6 h-6 rounded-md"
            onClick={() => {
              onPermissionUpdate(row, table, "canCreate");
            }}
            // @ts-ignore
            checked={row.original.canCreate}
          />
        </div>
      ),
    },
    {
      accessorKey: "canView",
      header: t("can_view"),
      size: 100,
      cell: ({ row, table }) => (
        <div className="w-full flex justify-center">
          <Checkbox
            className="w-6 h-6 rounded-md"
            onClick={() => {
              onPermissionUpdate(row, table, "canView");
            }}
            // @ts-ignore
            checked={row.original.canView}
          />
        </div>
      ),
    },
    {
      accessorKey: "canUpdate",
      header: t("can_update"),
      size: 100,
      cell: ({ row, table }) => (
        <div className="w-full flex justify-center">
          <Checkbox
            className="w-6 h-6 rounded-md"
            onClick={() => {
              onPermissionUpdate(row, table, "canUpdate");
            }}
            // @ts-ignore
            checked={row.original.canUpdate}
          />
        </div>
      ),
    },
  ];

  const actions: TableAction<Permission>[] = [];
  return (
    <div>
      <div>
        <DataTable<Permission>
          // @ts-ignore
          fetchData={() => fetchPermissions(id)}
          // @ts-ignore
          idField={"id"}
          // @ts-ignore
          updateData={updatePermissions}
          columns={columns}
          actions={actions}
          onRowClick={() => {}}
          searchable={false}
        />
      </div>
    </div>
  );
}

export default Permissions;
