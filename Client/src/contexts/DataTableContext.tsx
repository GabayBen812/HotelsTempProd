import { DataTableContextProps } from "@/types/ui/data-table-types";
import { createContext } from "react";

export const DataTableContext = createContext<DataTableContextProps>(
  {} as DataTableContextProps
);
