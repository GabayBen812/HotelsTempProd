import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, X, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import LanguageInput from "@/components/miscellaneous/LanguageInput";

import AreYouSureDialog from "@/components/ui/completed/dialogs/AreYouSureDialog";

interface AddAreaProps {
  editMode: boolean;
  isAddingNew: boolean;
  setIsAddingNew: (value: boolean) => void;
  onAdd: (areaData: { name: Record<string, string>; color: string }) => void;
  onCancel?: () => void;
  initialName?: Record<string, string>;
  initialColor?: string;
  isEditMode?: boolean;
  onDeleteArea?: () => void;
}

function AddArea({
  editMode,
  isAddingNew,
  setIsAddingNew,
  onAdd,
  onCancel,
  initialName,
  initialColor,
  isEditMode,
  onDeleteArea,
}: AddAreaProps) {
  const { t } = useTranslation();
  const [selectedColor, setSelectedColor] = useState(initialColor || "#3B82F6");
  const [isValid, setIsValid] = useState(false);
  const [areaName, setAreaName] = useState<Record<string, string>>(
    initialName || { he: "" }
  );

  useEffect(() => {
    if (isEditMode) {
      setAreaName(initialName || { he: "" });
      setSelectedColor(initialColor || "#3B82F6");
      setIsValid(Boolean(initialName?.he && initialName.he.trim().length > 0));
    } else {
      setAreaName({ he: "" });
      setSelectedColor("#3B82F6");
      setIsValid(false);
    }
  }, [initialName, initialColor, isEditMode]);

  const colorOptions = [
    "#3B82F6",
    "#EF4444",
    "#10B981",
    "#F59E0B",
    "#8B5CF6",
    "#06B6D4",
    "#F97316",
    "#84CC16",
    "#EC4899",
    "#6366F1",
  ];

  const handleNameChange = (values: Record<string, string>) => {
    setAreaName(values);
    setIsValid(Boolean(values.he && values.he.trim().length > 0));
  };

  const handleSubmit = () => {
    if (!isValid) return;
    onAdd({
      name: areaName,
      color: selectedColor,
    });
    if (!isEditMode) {
      setAreaName({ he: "" });
      setSelectedColor("#3B82F6");
      setIsValid(false);
      setIsAddingNew(false);
    }
  };

  const handleCancel = () => {
    setAreaName({ he: "" });
    setSelectedColor("#3B82F6");
    setIsValid(false);
    setIsAddingNew(false);
    onCancel?.();
  };

  if (!editMode) return null;

  if (isAddingNew || isEditMode) {
    return (
      <div className="border border-dashed p-4 rounded-lg bg-surface/50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-primary">
            {isEditMode ? t("edit_wing") : t("add_new_wing")}
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCancel}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-4">
          {/* Color Picker */}
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              {t("color")}
            </label>
            <div className="flex flex-wrap gap-2">
              {colorOptions.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    selectedColor === color
                      ? "border-primary scale-110"
                      : "border-border hover:scale-105"
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setSelectedColor(color)}
                />
              ))}
            </div>
          </div>

          {/* Language Input */}
          <div>
            <LanguageInput
              key={isEditMode ? JSON.stringify(initialName) : "add"}
              label={t("wing_name")}
              onLanguageValuesChange={handleNameChange}
              defaultValue={isEditMode ? initialName : undefined}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2 items-center">
            {isEditMode && onDeleteArea && (
              <AreYouSureDialog
                title={t("are_you_sure_delete_area")}
                description={t("this_action_cannot_be_undone")}
                confirmText={t("delete")}
                cancelText={t("cancel")}
                isDangerous
                onConfirm={onDeleteArea}
              >
                <Button
                  variant="destructive"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <Trash2 className="h-4 w-4" /> {t("delete")}
                </Button>
              </AreYouSureDialog>
            )}
            <Button
              onClick={handleSubmit}
              disabled={!isValid}
              className="flex-1"
              size="sm"
            >
              {isEditMode ? t("save") : t("add")}
            </Button>
            <Button onClick={handleCancel} variant="outline" size="sm">
              {t("cancel")}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="border border-dashed p-3 rounded-lg flex gap-3 items-center cursor-pointer hover:bg-surface/50 transition-colors"
      onClick={() => setIsAddingNew(true)}
    >
      <Avatar className="rounded-md size-6">
        <AvatarImage />
        <AvatarFallback className="size-6 bg-gray-600 rounded-lg">
          <Plus className="size-3 text-surface" />
        </AvatarFallback>
      </Avatar>

      <span className="text-muted-foreground text-sm">{t("add_new_wing")}</span>
    </div>
  );
}

export default AddArea;
