import { Button } from "@/components/ui/button";
import { Call } from "@/types/api/calls";
import { CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { AssignWorkerDialog } from "./AssignWorkerDialog";

export function ActionCell({
  call,
  onCloseCall,
  onAssignWorker,
  users,
}: {
  call: Call;
  onCloseCall?: (callId: string | number) => void;
  onAssignWorker?: (callId: string | number, workerId: string) => void;
  users?: Array<{ value: string; label: string }>;
}) {
  const { t } = useTranslation();
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);

  if (call.status === "IN_PROGRESS") {
    return (
      <div className="flex items-center justify-center h-full">
        <Button
          onClick={(e) => {
            e.stopPropagation();
            if (onCloseCall) onCloseCall(call.id);
          }}
          className="group flex items-center gap-1 p-2 rounded-full text-green-600 hover:text-green-800 transition-colors focus:outline-none focus:ring-2 focus:ring-green-400"
          style={{ background: "none", border: "none" }}
        >
          <CheckCircle2 size={20} className="inline-block" />
          <span className="text-xs font-medium">{t("close_call")}</span>
        </Button>
      </div>
    );
  }

  if (call.status === "OPENED") {
    return (
      <div className="flex items-center justify-center h-full">
        <Button
          onClick={(e) => {
            e.stopPropagation();
            setIsAssignDialogOpen(true);
          }}
          className="group flex items-center gap-1 p-2 rounded-full text-accent hover:text-accent/80 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
          style={{ background: "none", border: "none" }}
        >
          <CheckCircle2 size={20} className="inline-block" />
          <span className="text-xs font-medium">{t("assign_to_worker")}</span>
        </Button>
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
