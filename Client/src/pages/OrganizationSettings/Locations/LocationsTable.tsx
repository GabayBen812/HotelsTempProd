import DataTable from "@/components/ui/completed/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import { ApiQueryParams, TableAction } from "@/types/ui/data-table-types";
import { z } from "zod";
import DynamicForm, { FieldConfig } from "@/components/forms/DynamicForm";
import {
  deleteLocation,
  updateLocation,
  createLocation,
  fetchLocationById,
} from "@/api/locations/index";
import { Location } from "@/types/api/locations";
import i18n from "@/i18n";
import { useCallback, useState } from "react";
import TableHeaderActions from "@/components/table-actions/TableHeaderActions";
import ChatBotLinkButtons from "@/components/tables/location/actions/ChatBotLinkButtons";

interface LocationsTableProps {
  areaId: number;
}

const LocationsTable = ({ areaId }: LocationsTableProps) => {
  const { t } = useTranslation();
  const columns: ColumnDef<Location>[] = [
    {
      accessorKey: "name",
      header: t("name"),
      cell: ({ row }) => (
        <div>{row.original.name[i18n.language as "he" | "en" | "ar"]}</div>
      ),
      size: 100,
    },
    {
      accessorKey: "roomNumber",
      header: t("room_number"),
      cell: ({ row }) => <div>{row.original.roomNumber ?? "-"}</div>,
      size: 100,
    },
  ];

  const actions: TableAction<Location>[] = [
    { type: "edit", label: t("edit") },
    { type: "delete", label: t("delete") },
    {
      placement: "external",
      component: (row) => <ChatBotLinkButtons location={row.original} />,
    },
  ];

  const locationFormFields: FieldConfig[] = [
    { name: "name", label: t("name"), type: "language" },
    {
      name: "roomNumber",
      label: t("room_number"),
      type: "text",
    },
  ];

  const locationSchema = z.object({
    name: z.object({
      he: z.string().min(2),
      en: z.string().min(2),
      ar: z.string().min(2).optional(),
    }),
    roomNumber: z.coerce.number().optional(),
  });
  const fetchData = useCallback(
    (params: ApiQueryParams) => fetchLocationById(areaId, params),
    [areaId]
  );
  const [advancedFilters, setAdvancedFilters] = useState({});

  // Build advancedFields for advanced search
  const allowedTypes = ["select", "date", "text", "number", "checkbox"];
  const advancedFields = locationFormFields
    .filter((f) => allowedTypes.includes(f.type))
    .map((f) => ({
      name: f.name,
      label: f.label,
      type: f.type,
      options: f.options,
      placeholder: f.label,
    }));

  return (
    <DataTable<Location>
      fetchData={fetchData}
      addData={createLocation}
      deleteData={deleteLocation}
      updateData={updateLocation}
      columns={columns}
      actions={actions}
      searchable={true}
      showAddButton={true}
      isPagination={true}
      defaultPageSize={10}
      idField="id"
      advancedFilters={advancedFilters}
      setAdvancedFilters={setAdvancedFilters}
      rightHeaderContent={
        <TableHeaderActions
          columns={columns}
          filename="locations.csv"
          advancedFields={advancedFields}
          setAdvancedFilters={setAdvancedFilters}
        />
      }
      renderExpandedContent={({ handleSave, rowData, handleEdit }) => {
        const mode = rowData?.id ? "edit" : "create";
        return (
          <DynamicForm
            mode={mode}
            headerKey="location"
            fields={locationFormFields}
            validationSchema={locationSchema}
            defaultValues={rowData}
            onSubmit={async (data: z.infer<typeof locationSchema>) => {
              if (handleSave && mode === "create")
                //@ts-ignore
                await handleSave({ ...data, areaId });
              else if (handleEdit && mode === "edit")
                await handleEdit({ id: rowData?.id, ...data });
            }}
          />
        );
      }}
    />
  );
};

export default LocationsTable;
