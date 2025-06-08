import React, { useContext } from "react";
import AreaItem from "./AreaItem";
import { OrganizationsContext } from "@/contexts/OrganizationsContext";
import { Area } from "@/types/api/areas.type";

interface AreasListProps {
  editMode: boolean;
  selectedArea?: Area | null;
  handelAreaSelect: (area: Area) => void;
}

function AreasList({
  editMode,
  selectedArea,
  handelAreaSelect,
}: AreasListProps) {
  const { areas } = useContext(OrganizationsContext); // Assuming you have a context to get areas
  return (
    <div className="flex flex-col gap-2">
      {areas.map((area) => (
        <AreaItem
          key={area.id}
          area={area}
          isSelected={area.id === selectedArea?.id}
          editMode={editMode}
          handelAreaSelect={handelAreaSelect}
        />
      ))}
    </div>
  );
}

export default AreasList;
