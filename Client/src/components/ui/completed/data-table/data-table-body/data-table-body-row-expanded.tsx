import { AnimatePresence, motion } from "framer-motion";
import { useContext } from "react";
import { Row } from "@tanstack/react-table";
import Backdrop from "../../dialogs/Backdrop";
import { DataTableContext } from "@/contexts/DataTableContext";

interface RowComponentProps<T> {
  row?: Row<T>;
  onBackdropClick?: () => void;
  isExpanded?: boolean;
}

function DataTableBodyRowExpanded<T>({
  row,
  onBackdropClick,
  isExpanded,
}: RowComponentProps<T>) {
  const {
    enhancedActions,
    columns,
    handleAdd,
    handleUpdate,
    renderExpandedContent,
    renderEditContent,
    toggleEditMode,
    idField,
    specialRow,
  } = useContext(DataTableContext);

  const colSpan = columns.length + (enhancedActions ? 1 : 0);
  const rowData = row?.original ?? ({} as T);
  // @ts-ignore
  const isEditMode = !!row?.original?.isEditMode;
  const rowId =
    idField && row?.original ? (row.original as any)[idField] : null;

  const handleClose = () => {
    row?.toggleExpanded();
    if (rowId && isEditMode) toggleEditMode(rowId);
    onBackdropClick?.();
  };

  const handleSave = async (newData: Partial<T>) => {
    if (handleAdd) await handleAdd(newData);
    if (rowId) toggleEditMode(rowId);
  };

  const renderContent = () => {
    const sharedProps = {
      rowData,
      handleSave,
      handleEdit: handleUpdate,
    };

    if (specialRow) {
      return renderEditContent
        ? renderEditContent(sharedProps)
        : renderExpandedContent?.({
            ...sharedProps,
            toggleEditMode: () => rowId && toggleEditMode(rowId),
          });
    }

    if (isEditMode && renderEditContent) return renderEditContent(sharedProps);
    if (!isEditMode && renderExpandedContent) {
      return renderExpandedContent({
        ...sharedProps,
        toggleEditMode: () => rowId && toggleEditMode(rowId),
      });
    }
    if (renderExpandedContent) return renderExpandedContent(sharedProps);
    if (renderEditContent) return renderEditContent(sharedProps);
    return null;
  };

  return (
    <>
      <AnimatePresence>
        {isExpanded && <Backdrop onClick={handleClose} />}
      </AnimatePresence>

      <AnimatePresence>
        {isExpanded && (
          <tr className="relative">
            <td colSpan={colSpan}>
              <motion.div
                key={`expanded-${row?.id ?? "custom"}`}
                className="absolute z-40 w-full bg-surface rounded-lg shadow-lg overflow-hidden"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15, ease: "easeInOut" }}
              >
                {renderContent()}
              </motion.div>
            </td>
          </tr>
        )}
      </AnimatePresence>
    </>
  );
}

export default DataTableBodyRowExpanded;
