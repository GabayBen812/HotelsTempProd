import { Filter } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "../ui/button";

interface AdvancedSearchButtonProps {
  onClick: () => void;
}

export const AdvancedSearchButton: React.FC<AdvancedSearchButtonProps> = ({
  onClick,
}) => {
  const { t } = useTranslation();

  return (
    <Button
      type="button"
      tooltip={t("reports.filters.apply")}
      variant={"tableButton"}
      onClick={onClick}
      className="border-l"
      aria-label={t("reports.filters.apply")}
    >
      <Filter className="size-5" />
    </Button>
  );
};
