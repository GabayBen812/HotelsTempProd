import { Name } from "./api.types";
import { Area } from "./areas.type";

export interface Location {
  id: number;
  name: Name;
  roomNumber?: number | null;
  organizationId: number;
  area: Area;
}
