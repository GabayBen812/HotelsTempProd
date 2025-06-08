// components/FilePreview.tsx
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
}

export function FilePreview({
  fileName,
  onRemove,
  // @ts-ignore
  loading,
  readOnly = false,
}: FilePreviewProps) {
  const extension = fileName.split(".").pop() || "";
  const Icon = getFileIcon(extension);

  return (
    <div className="flex items-center gap-2 py-2 relative px-2 bg-muted rounded-lg shadow-sm text-sm max-w-xs border-border border">
      <div className="flex-shrink-0 bg-accent h-8 w-8 flex items-center justify-center rounded-md">
        <Icon className="w-4 h-4 text-light" />
      </div>
      <span className="truncate text-xs">{fileName}</span>
      {!readOnly && (
        <button
          onClick={onRemove}
          className="ml-auto p-1 hover:bg-muted text-muted-foreground absolute bg-background -top-2 -left-2 rounded-full border-border border"
          title="הסר קובץ"
        >
          <X className="w-2 h-2" />
        </button>
      )}
    </div>
  );
}
