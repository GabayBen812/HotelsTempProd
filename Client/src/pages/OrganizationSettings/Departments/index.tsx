import { useContext } from "react";
import DataTable from "@/components/ui/completed/data-table";
import { useTranslation } from "react-i18next";
import { TableAction } from "@/types/ui/data-table-types";
import { fetchDepartmentsParams } from "@/api/departments";
import { Department } from "@/types/api/departments";
import i18n from "@/i18n";
import DynamicForm, {
  FieldConfig,
} from "../../../components/forms/DynamicForm";
import { z } from "zod";
import { OrganizationsContext } from "@/contexts/OrganizationsContext";
import { handleImageChange } from "@/lib/formUtils";
import { DataTableBodyDetailedView } from "@/components/ui/completed/data-table/data-table-body/data-table-body-detailed-view";
import { getDepartmentsColumns } from "@/components/forms/departments/departmentsColumns";

const DepartmentsTable = () => {
  const { t } = useTranslation();
  const {
    organization,
    createNewDepartment,
    deleteDepartment,
    updateDepartment,
    departments,
  } = useContext(OrganizationsContext);
  const columns = getDepartmentsColumns(t, i18n);

  const actions: TableAction<Department>[] = [
    { label: "Edit", type: "edit" },
    { type: "delete", label: "Delete" },
  ];
  const fields: FieldConfig[] = [
    { name: "logo", label: t("picture"), type: "image" },
    { name: "name", label: t("name"), type: "language" },
  ];

  const schema = z.object({
    name: z.object({
      he: z.string().min(2),
      en: z.string().min(2),
      ar: z.string().min(2),
    }),
    logo: z.any().optional(),
  });
  return (
    <DataTable<Department>
      initialData={departments}
      fetchData={fetchDepartmentsParams}
      addData={createNewDepartment}
      deleteData={deleteDepartment}
      updateData={updateDepartment}
      columns={columns}
      actions={actions}
      searchable={true}
      showAddButton={true}
      isPagination={true}
      defaultPageSize={10}
      idField="id"
      renderEditContent={({ handleSave, rowData, handleEdit }) => {
        const mode = rowData?.id ? "edit" : "create";
        return (
          <DynamicForm
            mode={mode}
            defaultValues={rowData}
            headerKey="department"
            fields={fields}
            validationSchema={schema}
            onSubmit={async (data: z.infer<typeof schema>) => {
              const isCreateMode = mode === "create";

              const logoPath = await handleImageChange({
                newImage: data.logo,
                oldImage: rowData?.logo,
                isCreateMode,
                path: `${organization?.id}/departments`,
              });

              const departmentData: Partial<Department> = {
                ...data,
                logo: logoPath,
              };

              if (!isCreateMode) departmentData.id = rowData?.id;

              if (isCreateMode && handleSave) {
                handleSave(departmentData);
              } else if (!isCreateMode && handleEdit) {
                handleEdit(departmentData);
              }
            }}
          />
        );
      }}
    />
  );
};

export default DepartmentsTable;
