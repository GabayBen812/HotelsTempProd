import { Row } from "@tanstack/react-table";
import { Edit, Trash2 } from "lucide-react";
import { ReactNode, useMemo } from "react";

type ActionType = "edit" | "delete" | "custom";
type ActionPlacement = "dropdown" | "external";

export interface TableAction<TData> {
  type?: ActionType;
  label?: string;
  icon?: React.ComponentType<{ size?: number }>;
  onClick?: (row: Row<TData>) => void;
  component?: ReactNode | ((row: Row<TData>) => ReactNode);
  placement?: ActionPlacement; // New property to control placement
  [key: string]: any;
}

interface UseDataTableActionsProps<TData> {
  idField?: keyof TData;
  actions?: TableAction<TData>[] | [];
  handleDelete: (id: string | number) => Promise<void>;
  toggleEditMode: (id: string | number) => void;
}

export function useDataTableActions<TData>({
  idField,
  actions = [],
  handleDelete,
  toggleEditMode,
}: UseDataTableActionsProps<TData>) {
  const enhancedActions = useMemo(() => {
    return actions.map((action) => {
      // Set default placement to dropdown if not specified
      const actionWithPlacement = {
        ...action,
        placement: action.placement || ("dropdown" as ActionPlacement),
      };

      // If it's a custom React component, pass through
      if (action.type === "custom") return actionWithPlacement;

      if (action.type === "edit") {
        return {
          ...actionWithPlacement,
          icon: Edit,
          onClick: (row: Row<TData>) => {
            if (action.onClick) action.onClick(row);
            else if (idField) {
              const id = row.original[idField] as string | number;
              toggleEditMode(id);
              row.toggleExpanded?.();
            }
          },
        };
      }

      if (action.type === "delete") {
        return {
          ...actionWithPlacement,
          icon: Trash2,
          onClick: async (row: Row<TData>) => {
            if (action.onClick) return action.onClick(row);
            if (idField) {
              const id = row.original[idField] as string | number;
              await handleDelete(id);
            }
          },
        };
      }

      return actionWithPlacement;
    });
  }, [actions, idField, handleDelete, toggleEditMode]);

  // Separate actions by placement
  const dropdownActions = enhancedActions.filter(
    (action) => action.placement === "dropdown"
  );

  const externalActions = enhancedActions.filter(
    (action) => action.placement === "external"
  );

  return {
    enhancedActions,
    dropdownActions,
    externalActions,
  };
}
