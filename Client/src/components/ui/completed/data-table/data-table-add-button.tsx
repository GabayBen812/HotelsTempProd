// components/data-table/data-table-add-button.tsx
import { PlusCircle } from "lucide-react";
import { Button } from "../../button";
import { useTranslation } from "react-i18next";

interface DataTableAddButtonProps {
  onToggleAddRow: () => void;
  showAddButton?: boolean;
}

export const DataTableAddButton = ({
  onToggleAddRow,
  showAddButton,
}: DataTableAddButtonProps) => {
  const { t } = useTranslation();
  return showAddButton ? (
    <Button variant={"accentGhost"} onClick={onToggleAddRow}>
      <PlusCircle className="ml-2 size-5" />
      {t("add")}
    </Button>
  ) : null;
};
