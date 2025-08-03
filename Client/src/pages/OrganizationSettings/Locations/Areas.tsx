import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Backdrop from "@/components/ui/completed/dialogs/Backdrop";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/Input";

import { Area } from "@/types/api/areas.type";
import { useSearchParams } from "react-router-dom";
import AreasList from "./Areas/AreasList";
import AddArea from "./Areas/AddArea";
import { useAreas } from "@/hooks/organization/useAreas";
import { useOrganization } from "@/hooks/organization/useOrganization";
import i18n from "@/i18n";
import { toast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { updateAreas, deleteAreas } from "@/api/areas";

interface AreasProps {
  selectedArea: Area | null;
  setSelectedArea: (area: Area) => void;
}

function Areas({ selectedArea, setSelectedArea }: AreasProps) {
  const { t } = useTranslation();
  const { organization } = useOrganization();
  const { areas, createNewArea } = useAreas();
  const [editMode, setEditMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [editingArea, setEditingArea] = useState<Area | null>(null);
  const queryClient = useQueryClient();
  
  // Filter areas based on search query
  const filteredAreas = areas.filter((area) => {
    if (!searchQuery.trim()) return true;
    const areaName = area.name[i18n.language as "he" | "en" | "ar"] || "";
    return areaName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleCancel = () => {
    setEditMode(false);
    setIsAddingNew(false);
  };
  
  const handelAreaSelect = (area: Area) => {
    setSelectedArea(area);
    const currentParams = Object.fromEntries(searchParams.entries());
    setSearchParams({
      ...currentParams,
      areaId: area.id.toString(),
    });
  };

  const handleAddArea = async (areaData: { name: Record<string, string>; color: string }) => {
    if (!organization?.id) {
      toast({
        title: t("error"),
        description: t("organization_not_found"),
        variant: "destructive",
      });
      return;
    }

    try {
      await createNewArea({
        name: {
          he: areaData.name.he || "",
          en: areaData.name.en || "",
          ar: areaData.name.ar || "",
        },
        color: areaData.color,
        organizationId: organization.id,
      } as Area);
      await queryClient.refetchQueries({ queryKey: ["areas"] });
      toast({
        title: t("success"),
        description: t("area_created_successfully"),
      });
    } catch (error) {
      console.error("Error creating area:", error);
      toast({
        title: t("error"),
        description: t("failed_to_create_area"),
        variant: "destructive",
      });
    }
  };

  const handleEditArea = (area: Area) => {
    if (editMode) setEditingArea(area);
  };

  const handleUpdateArea = async (areaData: { name: Record<string, string>; color: string }) => {
    if (!editingArea) return;
    try {
      await updateAreas({
        id: editingArea.id,
        name: {
          he: areaData.name.he || "",
          en: areaData.name.en || "",
          ar: areaData.name.ar || "",
        },
        color: areaData.color,
        organizationId: editingArea.organizationId,
      });
      await queryClient.refetchQueries({ queryKey: ["areas"] });
      toast({
        title: t("success"),
        description: t("area_updated_successfully"),
      });
      setEditingArea(null);
    } catch (error) {
      toast({
        title: t("error"),
        description: t("failed_to_update_area"),
        variant: "destructive",
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingArea(null);
  };

  const handleDeleteArea = async () => {
    if (!editingArea) return;
    if (!window.confirm(t("are_you_sure_delete_area"))) return;
    try {
      await deleteAreas(editingArea.id);
      await queryClient.refetchQueries({ queryKey: ["areas"] });
      toast({
        title: t("success"),
        description: t("area_deleted_successfully"),
      });
      setEditingArea(null);
    } catch (error) {
      toast({
        title: t("error"),
        description: t("failed_to_delete_area"),
        variant: "destructive",
      });
    }
  };
  
  useEffect(() => {
    if (areas.length == 0) return;
    const currentParams = Object.fromEntries(searchParams.entries());
    const areaId = currentParams.areaId;
    if (areaId) {
      const area = areas.find((area) => area.id.toString() === areaId);
      if (area) setSelectedArea(area);
    } else {
      const area = areas[0];
      setSelectedArea(area);
      setSearchParams({
        ...currentParams,
        areaId: area.id.toString(),
      });
    }
  }, [areas]);
  
  return (
    <>
      {editMode && <Backdrop onClick={handleCancel} />}
      <div className="flex flex-col gap-4 w-full min-h-[10px]h-full md:w-64 lg:w-72 z-50 bg-surface p-4 rounded-md relative">
        <div className="w-full flex justify-between items-center">
          <h1 className="font-semibold text-primary">
            {t("select_x", { x: t("wing") })}
          </h1>
          <Button
            className="bg-background text-muted-foreground text-sm rounded-full h-6 w-14"
            variant={"ghost"}
            onClick={() => setEditMode((prev) => !prev)}
          >
            {t(editMode ? "cancel" : "edit")}
          </Button>
        </div>
        <Input
          iconSize="child:size-4"
          placeholder={t("search") + "..."}
          icon={<Search className="text-muted-foreground" />}
          className="h-9 w-full text-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {editingArea ? (
          <AddArea
            editMode={editMode}
            isAddingNew={true}
            setIsAddingNew={() => setEditingArea(null)}
            onAdd={handleUpdateArea}
            onCancel={handleCancelEdit}
            initialName={editingArea.name}
            initialColor={editingArea.color}
            isEditMode={true}
            onDeleteArea={handleDeleteArea}
          />
        ) : (
          <AreasList
            editMode={editMode}
            selectedArea={selectedArea}
            handelAreaSelect={handelAreaSelect}
            areas={filteredAreas}
            onEditArea={handleEditArea}
          />
        )}
        {editMode && !editingArea && (
          <AddArea
            editMode={editMode}
            isAddingNew={isAddingNew}
            setIsAddingNew={setIsAddingNew}
            onAdd={handleAddArea}
            onCancel={handleCancel}
          />
        )}
      </div>
    </>
  );
}

export default Areas;
