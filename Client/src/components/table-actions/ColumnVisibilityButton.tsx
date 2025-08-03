import { Settings } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useContext, useState } from "react";
import { DataTableContext } from "@/contexts/DataTableContext";
import { useTranslation } from "react-i18next";
import { Button } from "../ui/button";

export function ColumnVisibilityButton() {
  const { table } = useContext(DataTableContext);
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          tooltip={t("column_visibility")}
          variant={"tableButton"}
          type="button"
          className="border-r"
          aria-label={t("column_visibility")}
        >
          <Settings className="size-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {table
          .getAllColumns()
          .filter((column) => column.getCanHide())
          .map((column) => {
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {t(`fields.${column.id}`, { defaultValue: column.id })}
              </DropdownMenuCheckboxItem>
            );
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
