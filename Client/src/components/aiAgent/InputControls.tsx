import { ArrowUp, Paperclip } from "lucide-react";
import { Button } from "../ui/button";
import { Combobox } from "../ui/combobox";
import { FilePreview } from "../miscellaneous/Files/FilePreview";

interface Props {
  form: any;
  setForm: any;
  canSubmit: boolean;
  handleSend: () => void;
}
const RESOURCE_OPTIONS = [
  { label: "כל המשאבים", value: "all" },
  { label: "משתמשים", value: "users" },
  { label: "הזמנות", value: "orders" },
  { label: "מוצרים", value: "products" },
];

export const InputControls = ({
  form,
  setForm,
  canSubmit,
  handleSend,
}: Props) => (
  <div className="w-full h-7 absolute bottom-2 left-0 p-5">
    <div className="w-full h-full flex items-center justify-between">
      <div className="flex gap-0">
        <Combobox
          value={form.resource}
          // @ts-ignore
          onChange={(val) => setForm((prev) => ({ ...prev, resource: val }))}
          options={RESOURCE_OPTIONS}
          label="בחר משאב"
          className="w-fit py-1 px-2 bg-transparent text-[11px] h-full border-none shadow-none hover:bg-background duration-150 ease-in-out"
        />
        {form.files.length === 0 && (
          <label
            htmlFor="file-input"
            className="cursor-pointer p-1 hover:bg-background transition flex items-center justify-center rounded-md"
            title="הוסף קבצים"
          >
            <Paperclip className="w-4 h-4" />
          </label>
        )}
      </div>
      <div>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleSend}
          disabled={!canSubmit}
          className={`transition-opacity p-1 bg-background rounded-full w-fit h-fit ${
            canSubmit
              ? "bg-accent text-light"
              : "bg-background pointer-events-none"
          }`}
        >
          <ArrowUp className="w-3 h-3" />
        </Button>
      </div>
    </div>
  </div>
);

interface FileInputSectionProps {
  uploadedFiles: any[];
  loadingFiles: string[];
  onFileUpload: (e: any) => void;
  onFileRemove: (idx: number, path: string) => void;
}

export const FileInputSection = ({
  uploadedFiles,
  loadingFiles,
  onFileUpload,
  onFileRemove,
}: FileInputSectionProps) => (
  <div className="px-4 flex gap-2 flex-wrap absolute top-4 right-0">
    {uploadedFiles.map((file, idx) => (
      <FilePreview
        key={idx}
        fileName={file.name}
        loading={loadingFiles.includes(file.name)}
        onRemove={() => onFileRemove(idx, file.path)}
      />
    ))}
    <input
      id="file-input"
      type="file"
      onChange={onFileUpload}
      className="hidden"
    />
  </div>
);
