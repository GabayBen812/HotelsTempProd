import { useContext } from "react";
import AreaItem from "./AreaItem";
import { OrganizationsContext } from "@/contexts/OrganizationsContext";
import { Area } from "@/types/api/areas.type";

interface AreasListProps {
  editMode: boolean;
  selectedArea?: Area | null;
  handelAreaSelect: (area: Area) => void;
  areas?: Area[];
  onEditArea?: (area: Area) => void;
}

function AreasList({
  editMode,
  selectedArea,
  handelAreaSelect,
  areas,
  onEditArea,
}: AreasListProps) {
  const { areas: contextAreas } = useContext(OrganizationsContext);
  const displayAreas = areas || contextAreas;
  
  return (
    <div className="flex flex-col gap-2">
      {displayAreas.map((area) => (
        <AreaItem
          key={area.id}
          area={area}
          isSelected={area.id === selectedArea?.id}
          editMode={editMode}
          handelAreaSelect={handelAreaSelect}
          onEditArea={onEditArea}
        />
      ))}
    </div>
  );
}

export default AreasList;
