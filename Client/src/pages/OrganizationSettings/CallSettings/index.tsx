import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import DataTable from "@/components/ui/completed/data-table";
import DynamicForm from "../../../components/forms/DynamicForm";
import { OrganizationsContext } from "@/contexts/OrganizationsContext";
import { handleImageChange } from "@/lib/formUtils";
import { CallCategory } from "@/types/api/calls";
import { TableAction } from "@/types/ui/data-table-types";
import {
  deleteCallCategory,
  createCallCategory,
  updateCallCategory,
  fetchCallCategoriesParams,
} from "@/api/calls/categories";

import i18n from "@/i18n";
import { callSettingsFormSchema } from "@/components/forms/callCategories/callSettingsSchema";
import { getCallSettingsFields } from "@/components/forms/callCategories/callSettingsFields";
import { getCallSettingsColumns } from "@/components/forms/callCategories/callSettingsColumns";

const CallSettingsTable = () => {
  const { t } = useTranslation();
  const { organization, departments, callCategories } =
    useContext(OrganizationsContext);

  const columns = getCallSettingsColumns<CallCategory>(t, i18n);

  const actions: TableAction<CallCategory>[] = [
    { label: t("edit"), type: "edit" },
    { type: "delete", label: t("delete") },
  ];

  const fields = getCallSettingsFields(
    t,
    i18n.language as "he" | "en" | "ar",
    departments
  );

  const [advancedFilters, setAdvancedFilters] = useState({});

  return (
    <DataTable<CallCategory>
      initialData={callCategories}
      idField="id"
      columns={columns}
      actions={actions}
      searchable
      showAddButton
      isPagination
      defaultPageSize={10}
      fetchData={fetchCallCategoriesParams}
      addData={createCallCategory}
      deleteData={deleteCallCategory}
      updateData={updateCallCategory}
      advancedFilters={advancedFilters}
      setAdvancedFilters={setAdvancedFilters}
      renderExpandedContent={({ handleSave, rowData, handleEdit }) => {
        const mode = rowData?.id ? "edit" : "create";
        return (
          <DynamicForm
            mode={mode}
            headerKey="call_category"
            fields={fields}
            defaultValues={rowData}
            validationSchema={callSettingsFormSchema}
            onSubmit={async (formData) => {
              const isCreateMode = mode === "create";
              const logoPath = await handleImageChange({
                newImage: formData.logo,
                oldImage: rowData?.logo,
                isCreateMode,
                path: `${organization?.id}/callCategories`,
              });
              const payload: Partial<CallCategory> = {
                ...formData,
                logo: typeof logoPath === "string" ? logoPath : undefined,
                organizationId: organization!.id,
                id: rowData?.id,
              };

              if (isCreateMode && handleSave) await handleSave(payload);
              else if (!isCreateMode && handleEdit) await handleEdit(payload);
            }}
          />
        );
      }}
    />
  );
};

export default CallSettingsTable;
