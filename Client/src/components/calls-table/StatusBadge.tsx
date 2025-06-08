import { Call } from "@/types/api/calls";
import { CheckCircle2, AlertCircle, Pause, Play } from "lucide-react";
export const StatusBadge = ({
  status,
  t,
}: {
  status: Call["status"];
  t: any;
}) => {
  const statusConfig = {
    OPENED: {
      color: "bg-blue-50 text-blue-700 border-blue-200",
      icon: AlertCircle,
    },
    IN_PROGRESS: {
      color: "bg-amber-50 text-amber-700 border-amber-200",
      icon: Play,
    },
    COMPLETED: {
      color: "bg-emerald-50 text-emerald-700 border-emerald-200",
      icon: CheckCircle2,
    },
    FAILED: {
      color: "bg-red-50 text-red-700 border-red-200",
      icon: AlertCircle,
    },
    ON_HOLD: {
      color: "bg-gray-50 text-gray-700 border-gray-200",
      icon: Pause,
    },
  };

  // @ts-ignore
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full  font-normal text-base border ${config.color} backdrop-blur-sm`}
    >
      <Icon size={12} />
      {t(`status_${status.toLowerCase()}`)}
    </div>
  );
};
