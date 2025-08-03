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
import { ExportButtonWrapper } from "@/components/table-actions/ExportButtonWrapper";
import { ColumnVisibilityButton } from "@/components/table-actions/ColumnVisibilityButton";
import CallsExpanded from "@/components/calls-table/CallsExpanded";
import { User } from "@/types/api/user";
import { ActionCell } from "@/components/calls-table/Actions/ActionCell";

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
  const [advancedFilters, setAdvancedFilters] = useState<
    Record<string, unknown>
  >({});

  const handleCloseCall = async (callId: string | number) => {
    await updateCall({ id: String(callId), status: "COMPLETED" });
    setRefreshKey((k) => k + 1);
  };

  const handleAssignWorker = async (
    callId: string | number,
    workerId: string
  ) => {
    await updateCall({
      id: String(callId),
      assignedToId: Number(workerId),
      status: "IN_PROGRESS",
    });
    setRefreshKey((k) => k + 1);
  };

  const columns = getCallColumns(t, i18n, statusOptions);
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
    {
      label: "Actions",
      placement: "external",
      component: (row: any) => (
        <ActionCell
          call={row.original}
          onCloseCall={handleCloseCall}
          onAssignWorker={handleAssignWorker}
          users={allUsers.map((user: User) => ({
            value: user.id,
            label: user.name || user.email || user.id,
          }))}
        />
      ),
    },
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
  const fetchData = async (params: Record<string, unknown>) => {
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
        //@ts-expect-error fix later
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
        advancedFilters={advancedFilters}
        setAdvancedFilters={setAdvancedFilters}
        rightHeaderContent={
          <div className="flex items-center gap-2">
            <ColumnVisibilityButton />
            <ExportButtonWrapper columns={columns} filename="calls.csv" />
            <AdvancedSearchModal
              fields={advancedFields}
              onApply={setAdvancedFilters}
            />
          </div>
        }
        renderExpandedContent={({ rowData }) => {
          return <CallsExpanded call={rowData} />;
        }}
        renderEditContent={({ rowData, handleSave, handleEdit }) => {
          const mode = rowData?.id ? "edit" : "create";
          const filteredFields = fields.filter((f) => f.name !== "status");
          return (
            <DynamicForm
              mode={mode}
              headerKey="call"
              fields={filteredFields}
              validationSchema={callFormSchema.omit({ status: true })}
              defaultValues={rowData}
              onSubmit={async (data: z.infer<typeof callFormSchema>) => {
                const department = callCategories.find(
                  (category) => Number(category.id) === data.callCategoryId
                )?.departmentId;
                const status = data.assignedToId ? "IN_PROGRESS" : "OPENED";
                const payload = {
                  ...data,
                  departmentId: department,
                  status,
                  id: rowData?.id,
                } as Partial<Call>;
                if (handleSave && mode === "create") await handleSave(payload);
                if (handleEdit && mode === "edit") await handleEdit(payload);
              }}
            />
          );
        }}
      />
    </>
  );
}
