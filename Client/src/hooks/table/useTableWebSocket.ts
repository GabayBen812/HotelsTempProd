import { useEffect } from "react";
import { useDynamicSocket } from "../useSocket";

export function useTableWebSocket<TData>(
  idField: keyof TData | undefined,
  setTableData: React.Dispatch<React.SetStateAction<TData[]>>,
  websocketUrl?: string
) {
  const { on, off } = useDynamicSocket();
  useEffect(() => {
    if (!websocketUrl || !idField) return;
    const handler = (msg: TData) => {
      setTableData((prev) => {
        const exists = prev.some(
          (item) => (item as any)[idField] === (msg as any)[idField]
        );
        return exists
          ? prev.map((item) =>
              (item as any)[idField] === (msg as any)[idField] ? msg : item
            )
          : [...prev, msg];
      });
    };
    on("call:update", handler);
    return () => off("call:update", handler);
  }, [websocketUrl, idField, on, off]);
}
