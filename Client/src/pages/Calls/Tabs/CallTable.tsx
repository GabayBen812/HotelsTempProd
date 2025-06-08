import {
  createCall,
  deleteCall,
  updateCall,
  fetchCallsParams,
} from "@/api/calls";
import DataTable from "@/components/ui/completed/data-table";
import { useContext, useState } from "react";
import { OrganizationsContext } from "@/contexts/OrganizationsContext";
import { useTranslation } from "react-i18next";
import { Call } from "@/types/api/calls";
import { TableAction } from "@/types/ui/data-table-types";
import { getCallColumns } from "@/components/forms/calls/callColumns";
import { useLocations } from "@/hooks/organization/useLocations";
import { getCallFields } from "@/components/forms/calls/callFields";
import { callFormSchema } from "@/components/forms/calls/callFormSchema";
import DynamicForm from "@/components/forms/DynamicForm";
import { z } from "zod";
import { useUser } from "@/hooks/useUser";
import { AdvancedSearchModal } from "@/components/advanced-search/AdvancedSearchModal";
import { AdvancedSearchFieldConfig } from "@/types/advanced-search";
import { ExportButton } from "@/components/table-actions/ExportButton";
import { DataTableContext } from "@/contexts/DataTableContext";
import { ColumnVisibilityButton } from "@/components/table-actions/ColumnVisibilityButton";
import CallsExpanded from "@/components/calls-table/CallsExpanded";

export default function CallTable() {
  const { departments, callCategories } = useContext(OrganizationsContext);
  const { locations } = useLocations();
  const { allUsers } = useUser();
  const { t, i18n } = useTranslation();

  const statusOptions = Object.entries({
    OPENED: t("status_open"),
    IN_PROGRESS: t("status_in_progress"),
    COMPLETED: t("status_completed"),
    FAILED: t("status_failed"),
    ON_HOLD: t("status_on_hold"),
  }).map(([value, label]) => ({ value, label }));

  const [refreshKey, setRefreshKey] = useState(0);
  const [sorting, setSorting] = useState([{ id: "status", desc: false }]);
  const [advancedFilters, setAdvancedFilters] = useState<Record<string, any>>(
    {}
  );

  const handleCloseCall = async (callId: string | number) => {
    const now = new Date().toISOString();
    //@ts-ignore
    await updateCall({ id: callId, status: "COMPLETED", closedAt: now });
    setRefreshKey((k) => k + 1);
  };

  const handleAssignWorker = async (
    callId: string | number,
    workerId: string
  ) => {
    await updateCall({
      //@ts-ignore
      id: callId,
      //@ts-ignore
      assignedToId: workerId,
      status: "IN_PROGRESS",
    });
    setRefreshKey((k) => k + 1);
  };

  const columns = getCallColumns(
    t,
    i18n,
    statusOptions,
    handleCloseCall,
    handleAssignWorker,
    //@ts-ignore
    allUsers.map((user) => ({
      value: user.id,
      label: user.name || user.email || user.id,
    }))
  );
  const fields = getCallFields(
    t,
    i18n.language as "he" | "en" | "ar",
    locations,
    callCategories,
    allUsers,
    statusOptions
  );

  const actions: TableAction<Call>[] = [
    { label: "Edit", type: "edit" },
    { type: "delete", label: "Delete" },
  ];

  // Advanced search config for Calls
  const advancedFields: AdvancedSearchFieldConfig[] = [
    {
      name: "status",
      label: t("status"),
      type: "select",
      options: statusOptions,
      placeholder: t("select_status"),
    },
    {
      name: "callCategoryId",
      label: t("call_category"),
      type: "select",
      options: callCategories.map((cat) => ({
        value: cat.id,
        label:
          typeof cat.name === "object"
            ? cat.name[i18n.language as "he" | "en" | "ar"] || cat.name.en || ""
            : cat.name || "",
      })),
      placeholder: t("select_category"),
    },
    {
      name: "departmentId",
      label: t("department"),
      type: "select",
      options: departments.map((dep) => ({
        value: dep.id,
        label:
          typeof dep.name === "object"
            ? dep.name[i18n.language as "he" | "en" | "ar"] || dep.name.en || ""
            : dep.name || "",
      })),
      placeholder: t("select_department"),
    },
    {
      name: "locationId",
      label: t("location"),
      type: "select",
      options: locations.map((loc) => ({
        value: loc.id,
        label:
          typeof loc.name === "object"
            ? loc.name[i18n.language as "he" | "en" | "ar"] || loc.name.en || ""
            : loc.name || "",
      })),
      placeholder: t("select_location"),
    },
    {
      name: "createdAtFrom",
      label: t("created_at_from"),
      type: "date",
    },
    {
      name: "createdAtTo",
      label: t("created_at_to"),
      type: "date",
    },
    {
      name: "description",
      label: t("description"),
      type: "text",
      placeholder: t("search_description"),
    },
  ];

  // Modify fetchData to update tableData
  const fetchData = async (params: any) => {
    const mergedParams = { ...params, ...advancedFilters };
    Object.keys(mergedParams).forEach(
      (key) =>
        (mergedParams[key] === "" || mergedParams[key] == null) &&
        delete mergedParams[key]
    );
    const response = await fetchCallsParams(mergedParams);
    if (Array.isArray(response)) {
      return { data: response };
    }
    return response;
  };

  return (
    <>
      <DataTable<Call>
        columns={columns}
        websocketUrl="/ws/calls"
        //@ts-ignore
        fetchData={fetchData}
        addData={createCall}
        updateData={updateCall}
        deleteData={deleteCall}
        actions={actions}
        idField="id"
        showAddButton
        key={refreshKey}
        sorting={sorting}
        onSortingChange={setSorting}
        rightHeaderContent={
          <div className="flex items-center gap-2">
            <ColumnVisibilityButton />
            <ExportButtonWrapper columns={columns} />
            <AdvancedSearchModal
              fields={advancedFields}
              onApply={setAdvancedFilters}
            />
          </div>
        }
        renderExpandedContent={({ rowData, toggleEditMode }) => {
          return <CallsExpanded call={rowData} />;
        }}
        renderEditContent={({ rowData, handleSave, handleEdit }) => {
          const mode = rowData?.id ? "edit" : "create";
          return (
            <DynamicForm
              mode={mode}
              headerKey="call"
              fields={fields}
              validationSchema={callFormSchema}
              defaultValues={rowData}
              onSubmit={(data: z.infer<typeof callFormSchema>) => {
                const department = callCategories.find(
                  //@ts-ignore
                  (category) => category.id === data.callCategoryId
                )?.departmentId;
                const payload = {
                  ...data,
                  departmentId: department,
                  id: rowData?.id,
                } as Partial<Call>;
                if (handleSave && mode === "create") handleSave(payload);
                if (handleEdit && mode === "edit") handleEdit(payload);
              }}
            />
          );
        }}
      />
    </>
  );
}

// Helper wrapper to get table instance from context and pass to ExportButton
function ExportButtonWrapper({ columns }: { columns: any[] }) {
  const { table } = useContext(DataTableContext);
  return (
    <ExportButton
      data={table.getRowModel().rows.map((row: any) => row.original)}
      columns={columns.map((col: any) => ({
        id: col.accessorKey || col.id,
        label: typeof col.header === "string" ? col.header : undefined,
      }))}
      filename="calls.csv"
    />
  );
}
