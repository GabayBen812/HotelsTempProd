import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import React from "react";

interface AdvancedSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  children: React.ReactNode;
}

export const AdvancedSearchDialog: React.FC<AdvancedSearchDialogProps> = ({ open, onOpenChange, title, children }) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent
      className="max-w-3xl w-full bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-700 p-8"
      style={{ maxHeight: '70vh', minWidth: 600, overflowY: 'auto' }}
    >
      {title && (
        <DialogHeader>
          <DialogTitle className="text-xl font-bold mb-4 text-right">{title}</DialogTitle>
        </DialogHeader>
      )}
      <div className="pt-2 pb-2 px-1">{children}</div>
    </DialogContent>
  </Dialog>
); 