import { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { upsert, fetch } from "@/api/microservice/ai";
import { uploadImage, deleteImage, getImage } from "@/lib/supabase";
import { Loader2, FilePlus } from "lucide-react";
import { toast } from "sonner";
import { FilePreview } from "@/components/miscellaneous/Files/FilePreview";

function AiChatSettings() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";

  const [contextText, setContextText] = useState("");
  const [fileUrls, setFileUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    fetch().then((res) => {
      const context = res.data;
      if (context) {
        setContextText(context.contextText);
        setFileUrls(context.fileUrls || []);
      }
    });
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const fileArray = Array.from(e.target.files);

    for (const file of fileArray) {
      const path = `ai-context/${Date.now()}-${file.name}`;
      setUploadingFiles((prev) => [...prev, path]);
      try {
        const uploadedPath = await uploadImage(file, path);
        const publicUrl = getImage(uploadedPath!);
        setFileUrls((prev) => [...prev, publicUrl]);
      } catch (err) {
        console.error(err);
        toast.error(t("uploadError", { file: file.name }));
      } finally {
        setUploadingFiles((prev) => prev.filter((p) => p !== path));
      }
    }

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFileRemove = async (url: string) => {
    try {
      await deleteImage(url);
      setFileUrls((prev) => prev.filter((f) => f !== url));
    } catch (err) {
      console.error(err);
      toast.error(t("deleteError"));
    }
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      await upsert({
        id: 0,
        organizationId: 0,
        contextText,
        fileUrls,
      });
      toast.success(t("saveSuccess"));
    } catch (err) {
      console.error(err);
      toast.error(t("saveError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-10 px-4 pb-12">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">
          {t("aiChatSettings.title")}
        </h1>
        <p className="text-muted-foreground text-sm">
          {t("aiChatSettings.description")}
        </p>
      </div>

      {/* Instructions Section */}
      <section className="bg-muted/50 border border-muted rounded-2xl p-6 space-y-4 shadow-sm">
        <div className="space-y-1">
          <Label className="text-base font-semibold">
            {t("aiChatSettings.instructionsLabel")}
          </Label>
          <p className="text-sm text-muted-foreground">
            {t("aiChatSettings.instructionsHint")}
          </p>
        </div>
        <Textarea
          value={contextText}
          onChange={(e) => setContextText(e.target.value)}
          placeholder={t("aiChatSettings.textareaPlaceholder")}
          className="w-full h-40 resize-none text-sm rounded-xl"
        />
      </section>

      {/* Upload Section */}
      <section className="bg-muted/50 border border-muted rounded-2xl p-6 space-y-4 shadow-sm">
        <div className="space-y-1">
          <Label className="text-base font-semibold">
            {t("aiChatSettings.uploadLabel")}
          </Label>
          <p className="text-sm text-muted-foreground">
            {t("aiChatSettings.uploadHint")}
          </p>
        </div>

        <div className={"rlt:text-right lrt:text-left"}>
          <Button
            variant="outline"
            className="flex gap-2 items-center"
            onClick={() => fileInputRef.current?.click()}
          >
            <FilePlus size={16} />
            {t("aiChatSettings.uploadButton")}
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {fileUrls.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {fileUrls.map((url) => {
              const fileName = decodeURIComponent(url.split("/").pop() || "");
              return (
                <FilePreview
                  key={url}
                  fileName={fileName}
                  onRemove={() => handleFileRemove(url)}
                  loading={uploadingFiles.includes(url)}
                />
              );
            })}
          </div>
        )}
      </section>

      {/* Save Button */}
      <div className={isRTL ? "flex justify-start" : "flex justify-end"}>
        <Button
          onClick={handleSave}
          variant={"default"}
          disabled={isSubmitting}
          className="px-6 py-2 text-sm rounded-xl"
        >
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {t("aiChatSettings.saveButton")}
        </Button>
      </div>
    </div>
  );
}

export default AiChatSettings;
