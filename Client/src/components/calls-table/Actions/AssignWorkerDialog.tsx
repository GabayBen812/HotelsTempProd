import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { useState } from "react";

interface AssignWorkerDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAssign: (workerId: string) => void;
  users: Array<{ value: string; label: string }>;
}

export function AssignWorkerDialog({
  isOpen,
  onOpenChange,
  onAssign,
  users,
}: AssignWorkerDialogProps) {
  const { t } = useTranslation();
  const [selectedWorker, setSelectedWorker] = useState<string>("");

  const handleAssign = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedWorker) {
      onAssign(selectedWorker);
      onOpenChange(false);
    }
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    onOpenChange(false);
  };

  const handleSelect = (value: string) => {
    setSelectedWorker(value);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[425px]"
        style={{ padding: "10px" }}
        onClick={(e) => e.stopPropagation()}
      >
        <DialogHeader>
          <DialogTitle>{t("assign_to_worker")}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="assigned_to">{t("assigned_to")}</Label>
            <Select value={selectedWorker} onValueChange={handleSelect}>
              <SelectTrigger>
                <SelectValue placeholder={t("select_option")} />
              </SelectTrigger>
              <SelectContent>
                {users.map((u) => (
                  <SelectItem key={u.value} value={u.value}>
                    {u.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={handleCancel}>
            {t("cancel")}
          </Button>
          <Button onClick={handleAssign} disabled={!selectedWorker}>
            {t("assign")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
