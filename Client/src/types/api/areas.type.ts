import { Name } from "./api.types";

export interface Area {
  id: number;
  name: Name;
  organizationId: number;
  color: string;
  _count: { Location: number };
}
