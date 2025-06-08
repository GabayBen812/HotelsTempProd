import { ColumnDef } from "@tanstack/react-table";
import { Call } from "@/types/api/calls";
import { i18n, TFunction } from "i18next";
import { formatDateTime } from "@/lib/dateUtils";
import { StatusBadge } from "@/components/ui/completed/StatusBadge";
import { CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { AssignWorkerDialog } from "./AssignWorkerDialog";

// Create a separate component for the action cell
function ActionCell({
  call,
  onCloseCall,
  onAssignWorker,
  users,
  t,
}: {
  call: Call;
  onCloseCall?: (callId: string | number) => void;
  onAssignWorker?: (callId: string | number, workerId: string) => void;
  users?: Array<{ value: string; label: string }>;
  t: TFunction;
}) {
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);

  if (call.status === "IN_PROGRESS") {
    return (
      <div className="flex items-center justify-center h-full">
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (onCloseCall) onCloseCall(call.id);
          }}
          className="group flex items-center gap-1 p-2 rounded-full text-green-600 hover:text-green-800 transition-colors focus:outline-none focus:ring-2 focus:ring-green-400"
          style={{ background: "none", border: "none" }}
        >
          <CheckCircle2 size={20} className="inline-block" />
          <span className="text-xs font-medium">{t("close_call")}</span>
        </button>
      </div>
    );
  }

  if (call.status === "OPENED") {
    return (
      <div className="flex items-center justify-center h-full">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsAssignDialogOpen(true);
          }}
          className="group flex items-center gap-1 p-2 rounded-full text-blue-600 hover:text-green-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
          style={{ background: "none", border: "none" }}
        >
          <CheckCircle2 size={20} className="inline-block" />
          <span className="text-xs font-medium">{t("assign_to_worker")}</span>
        </button>
        {users && onAssignWorker && (
          <AssignWorkerDialog
            isOpen={isAssignDialogOpen}
            onOpenChange={setIsAssignDialogOpen}
            onAssign={(workerId) => onAssignWorker(call.id, workerId)}
            users={users}
          />
        )}
      </div>
    );
  }

  return null;
}

export const getCallColumns = (
  t: TFunction,
  i18n: i18n,
  statusOptions: { label: string; value: string }[],
  onCloseCall?: (callId: string | number) => void,
  onAssignWorker?: (callId: string | number, workerId: string) => void,
  users?: Array<{ value: string; label: string }>
): ColumnDef<Call>[] => [
  {
    accessorKey: "callCategoryId",
    header: t("call_category"),
    cell: ({ row }) =>
      //@ts-ignore
      row.original.callCategory?.name?.[i18n.language as "he" | "en" | "ar"] || "-",
  },
  {
    id: "actions",
    header: t("actions.index"),
    cell: ({ row }) => (
      <ActionCell
        call={row.original}
        onCloseCall={onCloseCall}
        onAssignWorker={onAssignWorker}
        users={users}
        t={t}
      />
    ),
  },
  {
    accessorKey: "description",
    header: t("description"),
  },
  {
    accessorKey: "locationId",
    header: t("location"),
    cell: ({ row }) =>
      //@ts-ignore
      row.original.location?.name?.[i18n.language as "he" | "en" | "ar"] || "-",
  },
  {
    accessorKey: "departmentId",
    header: t("department"),
    cell: ({ row }) => (
      <div className="bg-background w-fit px-3 rounded-md">
        {/* @ts-ignore */}
        {row.original.Department?.name?.[i18n.language as "he" | "en" | "ar"] || "-"}
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: t("created_at"),
    // @ts-ignore
    cell: ({ row }) => formatDateTime(row.original.createdAt),
  },
  {
    accessorKey: "status",
    header: t("status"),
    cell: ({ row }) => {
      const option = statusOptions.find(
        (s) => s.value === row.original.status
      ) || { label: "-", value: "" };
      return <StatusBadge option={option} />;
    },
  },
  {
    id: "timeStatus",
    header: t("time_status"),
    cell: ({ row }) => {
      const call = row.original;
      //@ts-ignore
      if (!call.callCategory?.expectedTime || !call.createdAt) return null;

      // @ts-ignore
      const createdAt = new Date(call.createdAt);
      //@ts-ignore
      const expectedTime = call.callCategory.expectedTime;
      const now = new Date();

      let elapsed, percent, text;

      // Calculate elapsed time
      // @ts-ignore
      if (call.status === "COMPLETED" && call.closedAt) {
        elapsed = Math.floor(
          // @ts-ignore
          (new Date(call.closedAt).getTime() - createdAt.getTime()) /
            (1000 * 60)
        );
      } else {
        elapsed = Math.floor(
          (now.getTime() - createdAt.getTime()) / (1000 * 60)
        );
      }

      // Calculate progress percentage (0-100%)
      const progressPercent = (elapsed / expectedTime) * 100;
      const isFinished =
        call.status === "COMPLETED" || call.status === "FAILED";
      const isOverdue = elapsed > expectedTime;
      const isNearLimit = progressPercent > 85 && !isOverdue;

      // Determine colors based on time progress (like the half circle)
      let colorConfig;
      if (isFinished) {
        colorConfig = isOverdue
          ? {
              barColor: "bg-red-500",
              dotColor: "bg-red-600",
              textColor: "text-red-700",
            }
          : {
              barColor: "bg-emerald-500",
              dotColor: "bg-emerald-600",
              textColor: "text-emerald-700",
            };
      } else if (isOverdue) {
        colorConfig = {
          barColor: "bg-red-500",
          dotColor: "bg-red-600",
          textColor: "text-red-700",
        };
      } else if (isNearLimit) {
        colorConfig = {
          barColor: "bg-amber-500",
          dotColor: "bg-amber-600",
          textColor: "text-amber-700",
        };
      } else {
        colorConfig = {
          barColor: "bg-blue-500",
          dotColor: "bg-blue-600",
          textColor: "text-blue-700",
        };
      }

      // Determine text based on status and time
      if (call.status === "COMPLETED") {
        const diff = elapsed - expectedTime;
        text = `${t("time_took")}: ${elapsed} ${t("minutes")}`;
        if (diff > 0) {
          text = `${diff} ${t("minutes_over_expected")}`;
        }
      } else if (call.status === "ON_HOLD") {
        text = `${t("call_on_hold_after")}: ${elapsed} ${t("minutes")}`;
      } else if (call.status === "FAILED") {
        const diff = elapsed - expectedTime;
        text = `${t("call_failed_after")}: ${elapsed} ${t("minutes")}`;
        if (diff > 0) {
          text += ` (+${diff} ${t("minutes_over_expected")})`;
        }
      } else {
        // Active calls
        if (elapsed <= expectedTime) {
          const remaining = expectedTime - elapsed;
          text =
            remaining > 0
              ? `${remaining} ${t("minutes")} ${t("left")}`
              : `${elapsed} ${t("minutes")}`;
        } else {
          const overtime = elapsed - expectedTime;
          text = `${t("time_exceeded")}: +${overtime} ${t("minutes")}`;
        }
      }

      // Set progress bar percentage
      if (isFinished) {
        percent = 100;
      } else {
        percent = Math.min(progressPercent, 100);
      }

      return (
        <div className="flex flex-col min-w-[120px]">
          <div className="flex items-center gap-2 mb-1">
            <span className={`w-2 h-2 rounded-full ${colorConfig.dotColor}`} />
            <span className={`text-xs font-medium ${colorConfig.textColor}`}>
              {text}
            </span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded">
            <div
              className={`h-2 rounded ${colorConfig.barColor}`}
              style={{ width: `${percent}%`, transition: "width 0.5s" }}
            />
          </div>
        </div>
      );
    },
  },
];
