import { useState, useEffect, useContext } from "react";
import { useTranslation } from "react-i18next";
import Backdrop from "@/components/ui/completed/dialogs/Backdrop";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { OrganizationsContext } from "@/contexts/OrganizationsContext";
import { Area } from "@/types/api/areas.type";
import { useSearchParams } from "react-router-dom";
import AreasList from "./Areas/AreasList";

interface AreasProps {
  selectedArea: Area | null;
  setSelectedArea: (area: Area) => void;
}

function Areas({ selectedArea, setSelectedArea }: AreasProps) {
  const { t } = useTranslation();
  const { areas } = useContext(OrganizationsContext);
  const [editMode, setEditMode] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const handleCancel = () => {
    setEditMode(false);
  };
  const handelAreaSelect = (area: Area) => {
    setSelectedArea(area);
    const currentParams = Object.fromEntries(searchParams.entries());
    setSearchParams({
      ...currentParams,
      areaId: area.id.toString(),
    });
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
      <div className="flex flex-col gap-4 w-full h-full md:w-64 lg:w-72 z-50 bg-white p-4 rounded-md relative">
        <div className="w-full flex justify-between items-center">
          <h1 className="font-semibold text-primary">
            {t("select_x", { x: t("wing") })}
          </h1>
          <Button
            className="bg-background text-secondary text-sm rounded-full h-6 w-14"
            variant={"ghost"}
            onClick={() => setEditMode((prev) => !prev)}
          >
            {t(editMode ? "cancel" : "edit")}
          </Button>
        </div>
        <Input
          iconSize="child:size-4"
          placeholder={t("search") + "..."}
          icon={<Search className="text-secondary" />}
          className="h-9 w-full text-sm"
        />
        <AreasList
          editMode={editMode}
          selectedArea={selectedArea}
          handelAreaSelect={handelAreaSelect}
        />
        {/* {editMode && (
          <AnimatedWrapper isVisible={editMode} animationType="fade">
            <AddArea
              editMode={editMode}
              isAddingNew={isAddingNew}
              setIsAddingNew={setIsAddingNew}
              newWingName={newWingName}
              setNewWingName={setNewWingName}
              onAdd={handleAddWing}
              addInputRef={addInputRef}
            />
          </AnimatedWrapper>
        )} */}
      </div>
    </>
  );
}

export default Areas;
