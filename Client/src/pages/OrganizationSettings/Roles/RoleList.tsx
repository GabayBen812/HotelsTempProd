import type { Role } from "@/types/api/roles";
import { TableAction } from "@/types/ui/data-table-types";
import { Row } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import DynamicForm, {
  FieldConfig,
} from "../../../components/forms/DynamicForm";
import { z } from "zod";
import DataTable from "@/components/ui/completed/data-table";
import { fetchRolesParams } from "@/api/roles/index";
import { useContext } from "react";
import { OrganizationsContext } from "@/contexts/OrganizationsContext";
import { getRolesColumns } from "@/components/forms/roles/rolesColumns";

interface Props {
  setSearchParams: (
    params: URLSearchParams,
    options?: { replace?: boolean }
  ) => void;
}
function RoleList({ setSearchParams }: Props) {
  const { t, i18n } = useTranslation();
  const { roles, createNewRole, updateRole, deleteRole } =
    useContext(OrganizationsContext);
  const onRowClick = (row: Row<Role>) => {
    setSearchParams(
      new URLSearchParams({
        tab: "roles",
        subtab: "permissions",
        id: String(row.original.id),
      }),
      { replace: true }
    );
  };
  const columns = getRolesColumns(t, i18n);
  const actions: TableAction<Role>[] = [
    { label: "Edit", type: "edit" },
    { type: "delete", label: "Delete" },
  ];
  const FormFields: FieldConfig[] = [
    { name: "name", label: t("name"), type: "language" },
  ];
  const schema = z.object({
    name: z.object({
      he: z.string().min(2),
      en: z.string().min(2),
      ar: z.string().min(2),
    }),
  });
  return (
    <DataTable<Role>
      initialData={roles}
      fetchData={fetchRolesParams}
      addData={createNewRole}
      updateData={updateRole}
      deleteData={deleteRole}
      columns={columns}
      actions={actions}
      searchable={true}
      showAddButton={true}
      isPagination={true}
      onRowClick={(row) => onRowClick(row)}
      defaultPageSize={10}
      idField="id"
      renderEditContent={({ handleSave, rowData, handleEdit }) => {
        const mode = rowData?.id ? "edit" : "create";
        return (
          <DynamicForm
            mode={mode}
            defaultValues={rowData}
            headerKey="department"
            fields={FormFields}
            validationSchema={schema}
            onSubmit={(data: z.infer<typeof schema>) => {
              if (handleSave && mode === "create") handleSave(data);
              else if (handleEdit && mode === "edit")
                handleEdit({ id: rowData?.id, ...data });
            }}
          />
        );
      }}
    />
  );
}

export default RoleList;
