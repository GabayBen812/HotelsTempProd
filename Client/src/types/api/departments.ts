import { Name } from "./api.types";

export interface Department {
  id: number;
  name: Name;
  logo: string;
  organizationId: number;
  _count: { OrganizationRole: number };
}

export interface NewDepartmentPayload {
  name: Name;
  logo: string;
  organizationId: number;
}
