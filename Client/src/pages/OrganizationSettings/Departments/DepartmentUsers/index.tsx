import { useContext } from "react";
import DataTable from "@/components/ui/completed/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import { TableAction } from "@/types/ui/data-table-types";
import { fetchDepartmentsParams } from "@/api/departments/index";
import { Department } from "@/types/api/departments";
import { createNewDepartment } from "@/api/departments/index";
import i18n from "@/i18n";
import { deleteDepartment } from "@/api/departments/index";
import { z } from "zod";
import { OrganizationsContext } from "@/contexts/OrganizationsContext";
import { handleLogoUpload } from "@/lib/formUtils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Building } from "lucide-react";
import { updateDepartment } from "@/api/departments/index";
import { deleteImage, getImage } from "@/lib/supabase";
import DepartmentsSideMenu from "../DepartmentsSideMenu";
import DynamicForm, {
  FieldConfig,
} from "../../../../components/forms/DynamicForm";

export default function DepartmentUsers() {
  const { t } = useTranslation();
  const { organization } = useContext(OrganizationsContext);
  const columns: ColumnDef<Department>[] = [
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
              <AvatarFallback className="rounded-md text-surface bg-sidebar-primary">
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
        <div>{row.original.name[i18n.language as "he" | "en" | "ar"]}</div>
      ),
      size: 100,
    },
  ];

  const actions: TableAction<Department>[] = [
    { type: "edit", label: "Edit" },
    { type: "delete", label: "Delete" },
  ];
  const userFormFields: FieldConfig[] = [
    { name: "logo", label: t("picture"), type: "image" },
    { name: "name", label: t("name"), type: "language" },
  ];

  const userSchema = z.object({
    name: z.object({
      he: z.string().min(2),
      en: z.string().min(2),
      ar: z.string().min(2),
    }),
    logo: z.any().optional(),
  });
  return (
    <div className="flex gap-4 w-full">
      <DepartmentsSideMenu />

      <DataTable<Department>
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
        renderExpandedContent={({ handleSave, rowData, handleEdit }) => {
          const mode = rowData?.id ? "edit" : "create";
          return (
            <DynamicForm
              mode={mode}
              defaultValues={rowData}
              headerKey="department"
              fields={userFormFields}
              validationSchema={userSchema}
              onSubmit={async (data: z.infer<typeof userSchema>) => {
                const isCreateMode = mode === "create";
                let logoPath = data?.logo;

                const handleLogoOperation = async () => {
                  if (
                    data.logo &&
                    (isCreateMode || data.logo !== rowData?.logo)
                  ) {
                    const newLogoPath = await handleLogoUpload(
                      data.logo,
                      `${organization?.id}/departments`
                    );

                    if (!isCreateMode && rowData?.logo) {
                      await deleteImage(rowData.logo);
                    }
                    return getImage(newLogoPath);
                  } else if (!isCreateMode && data.logo === rowData?.logo) {
                    return rowData?.logo;
                  }
                  return data.logo;
                };

                logoPath = await handleLogoOperation();

                const departmentData: Partial<Department> = {
                  ...data,
                  logo: logoPath,
                };

                if (!isCreateMode) departmentData.id = rowData?.id;

                if (isCreateMode && handleSave)
                  await handleSave(departmentData);
                else if (!isCreateMode && handleEdit)
                  await handleEdit(departmentData);
              }}
            />
          );
        }}
      />
    </div>
  );
}
