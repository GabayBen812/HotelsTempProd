export type AdvancedSearchFieldType = "select" | "date" | "text" | "number" | "checkbox";

export interface AdvancedSearchFieldOption {
  label: string;
  value: string | number | boolean;
}

export interface AdvancedSearchFieldConfig {
  name: string;
  label: string;
  type: AdvancedSearchFieldType;
  options?: AdvancedSearchFieldOption[];
  placeholder?: string;
  multiple?: boolean;
} 