import { MutationResponse } from "@/types/api/auth";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

type Id = string | number;

interface Props<TData> {
  idField?: keyof TData;
  addData: (data: Partial<TData>) => Promise<MutationResponse<TData>>;
  updateData: (data: TData) => Promise<MutationResponse<TData>>;
  deleteData?: (id: number) => Promise<MutationResponse<null>>;
  setTableData: React.Dispatch<React.SetStateAction<TData[]>>;
}

export function useTableCRUD<TData>({
  idField,
  addData,
  updateData,
  deleteData,
  setTableData,
}: Props<TData>) {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);

  const handleAdd = async (newData: Partial<TData>) => {
    if (!addData || !idField) return;

    const tempId = `temp-${Date.now()}`;
    const optimisticData = { ...newData, [idField]: tempId } as TData;

    setTableData((prev) => [...prev, optimisticData]);

    try {
      const response = await addData(newData);
      if (!response || !response.data) throw new Error("No response data");

      const createdItem = response.data;

      setTableData((prev) =>
        prev.map((item) =>
          (item as any)[idField] === tempId ? createdItem : item
        )
      );

      toast.success(t("tost_alerts.create"));
    } catch (error) {
      console.error("Add failed:", error);
      setTableData((prev) =>
        prev.filter((item) => (item as any)[idField] !== tempId)
      );
      toast.error("Failed to create item");
    }
  };

  const handleUpdate = async (updatedData: Partial<TData>) => {
    if (!updateData || !idField) return;

    const id = updatedData[idField];
    if (!id) return;

    let originalItem: TData | undefined;

    setTableData((prev) => {
      originalItem = prev.find((item) => (item as any)[idField] === id);
      return prev.map((item) =>
        (item as any)[idField] === id ? { ...item, ...updatedData } : item
      );
    });

    try {
      const response = await updateData(updatedData as TData);
      if (!response || !response.data) throw new Error("No response data");

      setTableData((prev) =>
        prev.map((item) =>
          (item as any)[idField] === id ? response.data : item
        )
      );
      toast.success(t("tost_alerts.update"));
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("Failed to update item");

      if (originalItem) {
        setTableData((prev) =>
          prev.map((item) =>
            (item as any)[idField] === id ? originalItem! : item
          )
        );
      }
    }
  };

  const handleDelete = async (id: Id) => {
    if (!deleteData || !idField) return;

    const deletedItem = (prevData: TData[]) =>
      prevData.find((item) => (item as any)[idField] === id);

    setIsLoading(true);
    let backup: TData | undefined;

    setTableData((prev) => {
      backup = deletedItem(prev);
      return prev.filter((item) => (item as any)[idField] !== id);
    });

    try {
      const response = await deleteData(Number(id));
      if (!response || response.status !== 200)
        throw new Error("Delete failed");

      toast.success(t("tost_alerts.delete"));
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Failed to delete item");

      if (backup) {
        setTableData((prev) => [...prev, backup!]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggleEditMode = (rowId: Id) => {
    if (!idField) return;
    setTableData((prev) =>
      prev.map((row) =>
        (row as any)[idField] === rowId
          ? { ...row, isEditMode: !(row as any).isEditMode }
          : row
      )
    );
  };

  return {
    handleAdd,
    handleUpdate,
    handleDelete,
    toggleEditMode,
    isLoading,
  };
}
