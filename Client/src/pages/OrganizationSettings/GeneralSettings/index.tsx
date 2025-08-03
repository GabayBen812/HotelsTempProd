import { useRef, useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Hotel } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { OrganizationsContext } from "@/contexts/OrganizationsContext";
import { useOrganization } from "@/hooks/organization/useOrganization";
import { handleLogoUpload } from "@/lib/formUtils";
import { getImage } from "@/lib/supabase";
import ThemePlaceholder from "./components/ThemePlaceholder";

export const orgSchema = z.object({
  name: z.string().min(1, "שדה חובה"),
  logo: z.any().optional(),
  theme: z.object({
    foreground: z.string().optional(),
    primary: z.string().optional(),
    "muted-foreground": z.string().optional(),
    accent: z.string().optional(),
    border: z.string().optional(),
    surface: z.string().optional(),
    background: z.string().optional(),
  }),
});

type FormValues = z.infer<typeof orgSchema>;

export default function GeneralSettings() {
  const { organization, setOrganizationLocally } =
    useContext(OrganizationsContext);
  const [originalTheme] = useState(organization?.customStyles);
  const { updateOrganization, refetchOrganization } = useOrganization();
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper to get CSS variable value by key
  const getCssVar = (key: string) => {
    return getComputedStyle(document.documentElement)
      .getPropertyValue(`--${key}`)
      .trim();
  };

  // Build default theme values from organization.customStyles or CSS vars
  const defaultTheme = {
    foreground:
      organization?.customStyles?.foreground || getCssVar("foreground"),
    primary: organization?.customStyles?.primary || getCssVar("primary"),
    "muted-foreground":
      organization?.customStyles?.["muted-foreground"] ||
      getCssVar("muted-foreground"),
    accent: organization?.customStyles?.accent || getCssVar("accent"),
    border: organization?.customStyles?.border || getCssVar("border"),
    background:
      organization?.customStyles?.background || getCssVar("background"),
    surface: organization?.customStyles?.surface || getCssVar("surface"),
  };

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(orgSchema),
    defaultValues: {
      name: organization?.name || "",
      logo: undefined,
      theme: defaultTheme,
    },
  });

  const logoPreview = watch("logo");

  const onSubmit = async (data: FormValues) => {
    if (!organization) return;

    let logoPath: string | undefined =
      typeof organization.logo === "string" ? organization.logo : undefined;

    if (data.logo && data.logo instanceof File) {
      logoPath = await handleLogoUpload(data.logo, `${organization.id}/logo`);
    }

    const fullImagePath = getImage(String(logoPath));

    const updated = await updateOrganization({
      organizationId: organization.id,
      name: data.name,
      logo: fullImagePath,
      customStyles: {
        ...data.theme,
      },
    });

    if (updated) {
      await refetchOrganization();
      reset({ ...data, logo: undefined });
    }
  };

  const onReset = () => {
    reset({
      name: organization?.name || "",
      theme: originalTheme,
      logo: undefined,
    });
    console.log({ originalTheme, org: organization?.customStyles });
    setOrganizationLocally({ customStyles: originalTheme });
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      {/* Name */}
      <div className="flex border-b pb-6 items-center gap-4">
        <div className="w-72">
          <h2 className="font-semibold">{t("organization_name")}</h2>
          <p className="text-sm text-muted-foreground">
            {t("choose_org_name")}
          </p>
        </div>
        <div className="flex flex-col gap-1 w-full max-w-sm">
          <Input placeholder="מלונות" {...register("name")} />
          {errors.name && (
            <span className="text-sm text-red-500">{errors.name.message}</span>
          )}
        </div>
      </div>

      {/* Theme */}
      <div className="flex border-b border-border pb-4 items-center gap-4">
        <div className="w-72">
          <h2 className="font-semibold">{t("theme")}</h2>
          <p className="text-sm text-muted-foreground">{t("select_theme")}</p>
        </div>
        <ThemePlaceholder setValue={setValue} watch={watch} />
      </div>

      {/* Image */}
      <div className="flex border-b border-border pb-4 items-center gap-4">
        <div className="w-72">
          <h2 className="font-semibold">{t("picture")}</h2>
          <p className="text-sm text-muted-foreground">
            {t("update_org_picture")}
          </p>
        </div>
        <div className="flex gap-4 items-center">
          <Avatar
            className="rounded-2xl size-16 cursor-pointer transition-transform transform hover:scale-110"
            onClick={triggerFileInput}
          >
            <AvatarImage
              src={
                logoPreview instanceof File
                  ? URL.createObjectURL(logoPreview)
                  : organization?.logo
              }
              alt={organization?.name}
            />
            <AvatarFallback className="flex justify-center items-center rounded-2xl text-surface bg-foreground size-16">
              <Hotel className="size-10" />
            </AvatarFallback>
          </Avatar>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setValue("logo", file, { shouldDirty: true });
              }
            }}
          />
        </div>
      </div>
      <div
        className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-surface rounded-2xl shadow-xl px-4 py-3 transition-all duration-300 ease-in-out w-fit border ${
          isDirty
            ? "translate-y-0 opacity-100"
            : "translate-y-4 opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex items-center gap-12">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">
              שים לב - יש לך שינויים לא שמורים!
            </span>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              className="text-accent"
              disabled={!isDirty}
              onClick={onReset}
              type="button"
            >
              {t("reset")}
            </Button>
            <Button loading={isSubmitting} disabled={!isDirty} type="submit">
              {t("save")}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
