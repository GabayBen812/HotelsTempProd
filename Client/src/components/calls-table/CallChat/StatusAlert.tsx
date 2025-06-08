import { motion } from "framer-motion";
import { Clock, Play, CheckCircle, XCircle, UserPlus } from "lucide-react";
import { CallStatusHistory, CallStatus } from "@/types/api/calls";
import { formatDateTime } from "@/lib/dateUtils";
import { useTranslation } from "react-i18next";

interface StatusAlertProps {
  statusItem: CallStatusHistory & { type: "status"; displayText?: string };
  isFirst?: boolean; // new optional prop to indicate first history item
}

export const StatusAlert = ({
  statusItem,
  isFirst = false,
}: StatusAlertProps) => {
  const { t } = useTranslation();
  const getStatusConfig = (status: CallStatus) => {
    switch (status) {
      case "ON_HOLD":
        return {
          icon: Clock,
          color: "text-amber-600",
          label: t("status_on_hold"),
        };
      case "IN_PROGRESS":
        return {
          icon: Play,
          color: "text-blue-600",
          label: t("status_in_progress"),
        };
      case "COMPLETED":
        return {
          icon: CheckCircle,
          color: "text-green-600",
          label: t("status_completed"),
        };
      case "FAILED":
        return {
          icon: XCircle,
          color: "text-red-600",
          label: t("status_failed"),
        };
      default:
        return {
          icon: Clock,
          color: "text-gray-600",
          label: t("status_open") || "Open",
        };
    }
  };

  const changedByName =
    statusItem.changedBy?.name || statusItem.changedBy?.username || "System";

  const isAssignmentChange = statusItem.displayText?.startsWith("Assigned to");
  const assignmentName = statusItem.assignedTo?.name || "Unknown";

  const Icon = isAssignmentChange
    ? UserPlus
    : getStatusConfig(statusItem.toStatus).icon;
  const color = isAssignmentChange
    ? "text-purple-600"
    : getStatusConfig(statusItem.toStatus).color;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
      className="flex items-center justify-center my-6 relative"
    >
      {/* Left line */}
      <div className="flex-1 h-px bg-gray-200 max-w-16" />

      {/* Status content */}
      <div className="flex items-center gap-2 px-4 text-sm text-gray-600">
        <Icon size={12} className={color} />
        <span>
          {isFirst ? (
            <span>
              <span className="font-medium">{changedByName}</span>{" "}
              {t("opened_this_call")}
            </span>
          ) : isAssignmentChange ? (
            <span>
              <span className="font-medium">{changedByName}</span>{" "}
              {t("assigned_this_call_to")}{" "}
              <span className={`font-semibold ${color}`}>{assignmentName}</span>
            </span>
          ) : (
            <span>
              <span className="font-medium">{changedByName}</span>{" "}
              {t("changed_status_to")}{" "}
              <span className={`font-semibold ${color}`}>
                {getStatusConfig(statusItem.toStatus).label}
              </span>
            </span>
          )}
        </span>
        <span className="text-gray-400 text-xs ml-1">
          {formatDateTime(statusItem.changedAt.toString())}
        </span>
      </div>

      {/* Right line */}
      <div className="flex-1 h-px bg-gray-200 max-w-16" />
    </motion.div>
  );
};
