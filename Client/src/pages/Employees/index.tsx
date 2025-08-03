import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import DataTable from "@/components/ui/completed/data-table";
import DynamicForm from "@/components/forms/DynamicForm";
import { OrganizationsContext } from "@/contexts/OrganizationsContext";
import { TableAction } from "@/types/ui/data-table-types";
import { User } from "@/types/api/user";
import {
  createUser,
  deleteUser,
  fetchUsersParams,
  adminUpdateUser,
} from "@/api/users";
import { handleImageChange } from "@/lib/formUtils";
import { Button } from "@/components/ui/button";
import { getUserFormFields } from "@/components/forms/users/usersFields";
import { getUsersColumns } from "@/components/forms/users/usersColumns";
import { useLocalizedMap } from "@/hooks/useLocalizedMap";
import TableHeaderActions from "@/components/table-actions/TableHeaderActions";

function Employees() {
  const { t, i18n } = useTranslation();
  const { organization, roles, departments } = useContext(OrganizationsContext);

  const [editPasswordMode, setEditPasswordMode] = useState(false);
  const departmentsMap = useLocalizedMap(departments);
  const columns = getUsersColumns(t, i18n, departmentsMap);

  const actions: TableAction<User>[] = [
    { label: t("edit"), type: "edit" },
    { label: t("delete"), type: "delete" },
  ];

  const userSchema = z.object({
    email: z.string().email(),
    username: z.string().min(2),
    name: z.string().min(2),
    role: z.number(),
    logo: z.any().optional(),
    password: z.string().min(6).optional(),
    departmentId: z.number().optional(),
  });

  const [advancedFilters, setAdvancedFilters] = useState({});

  // Build advancedFields for advanced search
  const allowedTypes = ["select", "date", "text", "number", "checkbox"];
  const fields = getUserFormFields(
    "create",
    false,
    roles,
    departments,
    t,
    i18n.language as "he" | "en" | "ar"
  );
  const advancedFields = fields
    .filter((f) => allowedTypes.includes(f.type))
    .map((f) => ({
      name: f.name,
      label: f.label,
      type: f.type,
      options: f.options,
      placeholder: f.label,
    }));

  return (
    <div className="space-y-6">
      <h1 className="heading">{t("employees")}</h1>

      <DataTable<User>
        fetchData={fetchUsersParams}
        addData={createUser}
        deleteData={deleteUser}
        updateData={adminUpdateUser}
        columns={columns}
        actions={actions}
        searchable
        showAddButton
        isPagination
        defaultPageSize={10}
        idField="id"
        advancedFilters={advancedFilters}
        setAdvancedFilters={setAdvancedFilters}
        rightHeaderContent={
          <TableHeaderActions
            columns={columns}
            filename="employees.csv"
            advancedFields={advancedFields}
            setAdvancedFilters={setAdvancedFilters}
          />
        }
        renderExpandedContent={({ handleSave, rowData, handleEdit }) => {
          const mode = rowData?.id ? "edit" : "create";
          const role = rowData?.organizationRoles?.[0]?.role.id;
          const department = rowData?.organizationRoles?.[0]?.departmentId;
          const defaultValues = {
            ...rowData,
            role: role,
            departmentId: department,
          };
          const fields = getUserFormFields(
            mode,
            editPasswordMode,
            roles,
            departments,
            t,
            i18n.language as "he" | "en" | "ar"
          );
          return (
            <div style={{ zIndex: 50, position: "relative" }}>
              <DynamicForm
                mode={mode}
                headerKey="user"
                fields={fields}
                validationSchema={userSchema}
                defaultValues={defaultValues}
                onSubmit={async (data: z.infer<typeof userSchema>) => {
                  const isCreateMode = mode === "create";
                  const isLogoChanged = data.logo instanceof File;

                  const logoPath = isLogoChanged
                    ? await handleImageChange({
                        newImage: data.logo,
                        oldImage: rowData?.logo,
                        isCreateMode,
                        path: `${organization?.id}/users`,
                      })
                    : rowData?.logo;

                  const userData = {
                    ...data,
                    logo: logoPath,
                    id: rowData?.id,
                    role: data.role,
                  };

                  try {
                    if (isCreateMode && handleSave) await handleSave(userData);
                    else if (!isCreateMode && handleEdit)
                      await handleEdit(userData);

                    setEditPasswordMode(false);
                  } catch (error) {
                    setEditPasswordMode(false);
                    console.error("Error submitting form:", error);
                  }
                }}
                extraButtons={
                  mode === "edit" ? (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setEditPasswordMode((prev) => !prev)}
                      className="self-start mb-4"
                    >
                      {t("change_password")}
                    </Button>
                  ) : undefined
                }
              />
            </div>
          );
        }}
      />
    </div>
  );
}

export default Employees;
