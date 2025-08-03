import { ColumnVisibilityButton } from "./ColumnVisibilityButton";
import { ExportButtonWrapper } from "./ExportButtonWrapper";
import { AdvancedSearchModal } from "../advanced-search/AdvancedSearchModal";

interface TableHeaderActionsProps {
  columns: any;
  filename: string;
  advancedFields: any[];
  setAdvancedFilters: (filters: Record<string, any>) => void;
}

export default function TableHeaderActions({ columns, filename, advancedFields, setAdvancedFilters }: TableHeaderActionsProps) {
  return (
    <div className="flex items-center gap-2">
      <ColumnVisibilityButton />
      <ExportButtonWrapper columns={columns} filename={filename} />
      <AdvancedSearchModal fields={advancedFields} onApply={setAdvancedFilters} />
    </div>
  );
} 