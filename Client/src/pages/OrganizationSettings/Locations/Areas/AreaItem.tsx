import { Brush } from "lucide-react";

import { Area } from "@/types/api/areas.type";
import i18n from "@/i18n";
import { t } from "i18next";
interface AreaItemProps {
  area: Area;
  editMode: boolean;
  isSelected: boolean;
  handelAreaSelect: (area: Area) => void;
  onEditArea?: (area: Area) => void;
}

function AreaItem({
  area,
  editMode,
  isSelected,
  handelAreaSelect,
  onEditArea,
}: AreaItemProps) {
  const areaName = area.name[i18n.language as "he" | "en" | "ar"];
  return (
    <div
      onClick={() => {
        if (editMode && onEditArea) onEditArea(area);
        else if (!editMode) handelAreaSelect(area);
      }}
      className={`border-[2px] py-3 px-4 rounded-lg flex gap-4 items-center relative cursor-pointer ${
        isSelected && !editMode ? "border-primary bg-primary/10" : ""
      }`}
    >
      <div className="relative">
        <div
          className="rounded-lg size-6 cursor-pointer flex items-center justify-center"
          style={{ backgroundColor: area.color || "#A6A6A6" }}
        >
          {editMode && <Brush className="size-3 text-black/60" />}
        </div>
      </div>

      <div>
        <div className="group relative">
          {/* <input
            className={`${
              editMode
                ? "border border-secondary border-dashed rounded-sm px-2 hover:cursor-text"
                : ""
            }`}
            dir="auto"
            value={areaName}
          ></input>
          {editMode && (
            <div className="hidden group-focus:flex absolute top-8 z-50 p-6 rounded-md right-0 border w-60 items-center justify-center bg-surface">
              <LanguageInput label=" " onLanguageValuesChange={() => {}} />
            </div>
          )} */}
          <p className="text-sm">{areaName}</p>
        </div>

        <p className="text-xs text-muted-foreground">
          {area._count.Location} {t("rooms")}
        </p>
      </div>
    </div>
  );
}

export default AreaItem;
