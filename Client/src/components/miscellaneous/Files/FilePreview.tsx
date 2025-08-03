// components/FilePreview.tsx
import { cn } from "@/lib/utils";
import {
  FileText,
  FileSpreadsheet,
  FileImage,
  File as FileIcon,
  X,
} from "lucide-react";

function getFileIcon(extension: string) {
  const ext = extension.toLowerCase();
  if (["pdf", "doc", "docx", "txt", "rtf"].includes(ext)) return FileText;
  if (["xls", "xlsx", "csv"].includes(ext)) return FileSpreadsheet;
  if (["jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(ext))
    return FileImage;
  return FileIcon;
}

interface FilePreviewProps {
  fileName: string;
  onRemove?: () => void;
  loading: boolean;
  readOnly?: boolean;
  className?: string;
}

export function FilePreview({
  fileName,
  onRemove,
  readOnly = false,
  className,
}: FilePreviewProps) {
  const extension = fileName.split(".").pop() || "";
  const Icon = getFileIcon(extension);

  return (
    <div
      className={cn(
        `flex items-center gap-2 py-2 relative px-2 bg-surface rounded-lg shadow-sm text-sm max-w-xs border-border border`,
        className
      )}
    >
      <div className="flex-shrink-0 bg-accent h-8 w-8 flex items-center justify-center rounded-md">
        <Icon className="w-4 h-4 text-surface" />
      </div>
      <span className="truncate text-xs">{fileName}</span>
      {!readOnly && (
        <button
          onClick={onRemove}
          className="ml-auto p-1 hover:bg-border text-muted-foreground absolute bg-surface -top-2 -left-2 rounded-full duration-150 border-border border"
          title="הסר קובץ"
        >
          <X className="w-2 h-2" />
        </button>
      )}
    </div>
  );
}
