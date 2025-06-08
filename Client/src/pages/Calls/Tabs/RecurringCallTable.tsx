import {
  createRecurringCall,
  deleteRecurringCall,
  fetchRecurringCallsParams,
  updateRecurringCall,
} from "@/api/calls/recurring";
import { getRecurringCallColumns } from "@/components/forms/calls/recurringCallColumns";
import { getRecurringCallFields } from "@/components/forms/recurringCalls/recurringCallFields";
import { recurringCallFormSchema } from "@/components/forms/recurringCalls/recurringCallFormSchema";
import DataTable from "@/components/ui/completed/data-table";
import { OrganizationsContext } from "@/contexts/OrganizationsContext";
import { useLocations } from "@/hooks/organization/useLocations";
import { useLocalizedMap } from "@/hooks/useLocalizedMap";
import DynamicForm from "@/components/forms/DynamicForm";
import { RecurringCall } from "@/types/api/calls";
import { TableAction } from "@/types/ui/data-table-types";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { z } from "zod";

export default function RecurringCallTable() {
  const { departments, callCategories } = useContext(OrganizationsContext);
  const { locations } = useLocations();
  const { t, i18n } = useTranslation();

  const departmentsMap = useLocalizedMap(departments);
  const categoriesMap = useLocalizedMap(callCategories);
  const locationsMap = useLocalizedMap(locations);
  const columns = getRecurringCallColumns(
    t,
    categoriesMap,
    departmentsMap,
    locationsMap
  );
  const fields = getRecurringCallFields(
    t,
    i18n.language as "he" | "en" | "ar",
    locations,
    callCategories
  );
  const actions: TableAction<RecurringCall>[] = [
    { label: "Edit", type: "edit" },
    { type: "delete", label: "Delete" },
  ];
  return (
    <DataTable
      fetchData={fetchRecurringCallsParams}
      addData={createRecurringCall}
      updateData={updateRecurringCall}
      deleteData={deleteRecurringCall}
      idField="id"
      columns={columns}
      actions={actions}
      showAddButton
      renderExpandedContent={({ rowData, handleEdit, handleSave }) => {
        const mode = rowData?.id ? "edit" : "create";
        return (
          <DynamicForm
            mode={mode}
            fields={fields}
            validationSchema={recurringCallFormSchema}
            defaultValues={rowData}
            onSubmit={(data: z.infer<typeof recurringCallFormSchema>) => {
              const department = callCategories.find(
                (category) => category.id === data.callCategoryId
              )?.departmentId;
              const payload = {
                ...data,
                departmentId: department,
                id: rowData?.id,
              } as any;
              if (mode === "create" && handleSave) return handleSave(payload);
              else if (mode === "edit" && handleEdit)
                return handleEdit(payload);
            }}
          />
        );
      }}
    />
  );
}
