import { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
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
    <div className="flex flex-col gap-4">
      {/* Instructions Section */}
      <section className="flex flex-col gap-4 border-b pb-6">
        <div>
          <h2 className="font-semibold">
            {t("aiChatSettings.instructionsLabel")}
          </h2>
          <p className="text-sm text-muted-foreground">
            {t("aiChatSettings.instructionsHint")}
          </p>
        </div>

        <Textarea
          value={contextText}
          onChange={(e) => setContextText(e.target.value)}
          placeholder={t("aiChatSettings.textareaPlaceholder")}
          className="w-full h-52 resize-none text-sm bg-surface max-w-4xl"
        />
      </section>

      {/* Upload Section */}
      <section className="flex flex-col gap-4 border-b pb-6">
        <div>
          <h2 className="font-semibold">{t("aiChatSettings.uploadLabel")}</h2>
          <p className="text-sm text-muted-foreground">
            {t("aiChatSettings.uploadHint")}
          </p>
        </div>

        {fileUrls.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl">
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
        <div className={"rlt:text-right lrt:text-left"}>
          <Button
            variant="secondary"
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
      </section>

      {/* Save Button */}
      <div className={isRTL ? "flex justify-end" : "flex justify-start"}>
        <Button
          onClick={handleSave}
          variant={"default"}
          disabled={isSubmitting}
        >
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {t("save")}
        </Button>
      </div>
    </div>
  );
}

export default AiChatSettings;
