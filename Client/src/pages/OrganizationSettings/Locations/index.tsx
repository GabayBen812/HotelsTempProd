import LocationsTable from "./LocationsTable";
import Areas from "./Areas";
import { useState } from "react";
import { Area } from "@/types/api/areas.type";

function Locations() {
  const [selectedArea, setSelectedArea] = useState<Area | null>(null);
  return (
    <div className="w-full h-full min-h-fit flex-col md:flex-row flex-1 flex gap-4">
      <Areas selectedArea={selectedArea} setSelectedArea={setSelectedArea} />
      <div className="flex-1  h-full w-full min-h-36">
        {selectedArea && (
          <LocationsTable key={selectedArea.id} areaId={selectedArea.id} />
        )}
      </div>
    </div>
  );
}

export default Locations;
