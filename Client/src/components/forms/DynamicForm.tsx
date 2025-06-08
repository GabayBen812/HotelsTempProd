import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { UploadCloud } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ZodEffects, ZodObject } from "zod";
import LanguageInput from "@/components/miscellaneous/LanguageInput";
import { Input } from "@/components/ui/Input";
import { Combobox } from "@/components/ui/combobox";
import { DatePicker } from "@/components/ui/date-picker";
import { MultiSelect } from "@/components/ui/completed/multi-select";

type LanguageValue = { [lang: string]: string };

type FieldType =
  | "text"
  | "email"
  | "language"
  | "image"
  | "select"
  | "autocomplete"
  | "checkbox"
  | "readonly"
  | "custom"
  | "multi-time"
  | "date"
  | "number"
  | "multi-checkbox";

export interface FieldConfig {
  name: string;
  label: string;
  type: FieldType;
  options?: { label: string; value: string | number }[];
  customRender?: (fieldProps: any) => React.ReactNode;
  defaultValue?: string | number | boolean;
  props?: Record<string, any>;
  onChange?: (value: string) => void;
}

interface DynamicFormProps {
  mode: "create" | "edit";
  fields: FieldConfig[];
  defaultValues?: any;
  validationSchema: ZodObject<any> | ZodEffects<ZodObject<any>>;
  onSubmit: (data: any) => void;
  headerKey?: string;
  extraButtons?: React.ReactNode;
}

const DynamicForm: React.FC<DynamicFormProps> = ({
  mode,
  fields,
  defaultValues,
  validationSchema,
  onSubmit,
  headerKey = "",
  extraButtons,
}) => {
  const { t } = useTranslation();
  const [preview, setPreview] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(validationSchema),
    defaultValues,
    mode: "onChange",
    shouldUnregister: false,
  });

  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues, { keepDefaultValues: true });
    }
  }, [defaultValues, reset]);

  const imageField = fields.find((f) => f.type === "image");
  const imageFieldName = imageField?.name;
  const watchedImageFile = watch(imageFieldName || "");

  useEffect(() => {
    if (watchedImageFile instanceof File) {
      const url = URL.createObjectURL(watchedImageFile);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    } else if (typeof watchedImageFile === "string") {
      setPreview(watchedImageFile);
    }
  }, [watchedImageFile]);

  const renderField = (field: FieldConfig) => {
    const error = errors[field.name];
    const requiredFields = [
      "description",
      "location",
      "departmentId",
      "status",
      "callCategoryId",
    ];

    switch (field.type) {
      case "text":
      case "email":
        return (
          <div key={field.name} className="flex flex-col gap-1 w-40">
            <label>
              {t(field.label)}
              {requiredFields.includes(field.name) && (
                <span className="text-red-500 ml-1">
                  {t("form.required_field")}
                </span>
              )}
            </label>
            <Input type={field.type} {...register(field.name)} />
            {error && (
              <span className="text-red-500 text-sm">
                {t("form.error_message")}: {error.message as string}
              </span>
            )}
          </div>
        );

      case "checkbox":
        return (
          <div key={field.name} className="flex items-center gap-2 w-40">
            <input
              type="checkbox"
              {...register(field.name)}
              defaultChecked={defaultValues?.[field.name]}
              className="w-4 h-4"
            />
            <label>
              {t(field.label)}
              {requiredFields.includes(field.name) && (
                <span className="text-red-500 ml-1">
                  {t("form.required_field")}
                </span>
              )}
            </label>
            {error && (
              <span className="text-red-500 text-sm">
                {t("form.error_message")}: {error.message as string}
              </span>
            )}
          </div>
        );

      case "language":
        return (
          <div key={field.name} className="flex flex-col gap-1 w-40">
            <LanguageInput
              label={field.label}
              defaultValue={defaultValues?.[field.name]}
              onLanguageValuesChange={(val: LanguageValue) => {
                setValue(field.name, val);
              }}
            />
            {error && (
              <span className="text-red-500 text-sm">
                {t("form.error_message")}: {error.message as string}
              </span>
            )}
          </div>
        );

      case "image":
        return (
          <div
            key={field.name}
            className="flex flex-col items-start gap-2 h-full"
          >
            <label>{t(field.label)}</label>
            <label
              htmlFor="picture-upload"
              className="w-32 h-32 flex items-center justify-center border-2 border-dashed rounded-lg cursor-pointer relative overflow-hidden bg-white"
            >
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="h-full object-cover rounded-lg"
                />
              ) : (
                <UploadCloud className="w-10 h-10 text-gray-500" />
              )}
            </label>
            <input
              id="picture-upload"
              type="file"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  setValue(field.name, e.target.files[0]);
                }
              }}
            />
            {error && (
              <span className="text-red-500 text-sm">
                {t("form.error_message")}: {error.message as string}
              </span>
            )}
          </div>
        );

      case "autocomplete":
        return (
          <div key={field.name} className="flex flex-col gap-1 w-40">
            <label>
              {t(field.label)}
              {requiredFields.includes(field.name) && (
                <span className="text-red-500 ml-1">
                  {t("form.required_field")}
                </span>
              )}
            </label>
            <Controller
              name={field.name}
              control={control}
              defaultValue={defaultValues?.[field.name] || ""}
              render={({ field: controllerField }) => (
                <Combobox
                  value={controllerField.value}
                  onChange={controllerField.onChange}
                  options={field.options ?? []}
                  label={t("select_option")}
                  className="h-[38px]"
                />
              )}
            />
            {error && (
              <span className="text-red-500 text-sm">
                {t("form.error_message")}: {error.message as string}
              </span>
            )}
          </div>
        );

      case "date":
        return (
          <div key={field.name} className="flex flex-col gap-1 w-40">
            <label>
              {t(field.label)}
              {requiredFields.includes(field.name) && (
                <span className="text-red-500 ml-1">
                  {t("form.required_field")}
                </span>
              )}
            </label>
            <Controller
              name={field.name}
              control={control}
              defaultValue={defaultValues?.[field.name] || undefined}
              render={({ field: controllerField }) => (
                <DatePicker
                  date={
                    controllerField.value
                      ? new Date(controllerField.value)
                      : undefined
                  }
                  onSelect={(date) =>
                    controllerField.onChange(date?.toISOString())
                  }
                />
              )}
            />
            {error && (
              <span className="text-red-500 text-sm">
                {t("form.error_message")}: {error.message as string}
              </span>
            )}
          </div>
        );
      case "multi-time":
        return (
          <div key={field.name} className="flex flex-col gap-1 w-40">
            <label>
              {t(field.label)}
              {requiredFields.includes(field.name) && (
                <span className="text-red-500 ml-1">
                  {t("form.required_field")}
                </span>
              )}
            </label>
            <Controller
              name={field.name}
              control={control}
              render={({ field: controllerField }) => (
                <div className="flex flex-col gap-2">
                  {(controllerField?.value || []).map(
                    (time: string, idx: number) => (
                      <div key={idx} className="flex items-center gap-2">
                        <Input
                          type="time"
                          value={time}
                          onChange={(e) => {
                            const newTimes = [...controllerField.value];
                            newTimes[idx] = e.target.value;
                            controllerField.onChange(newTimes);
                          }}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => {
                            const newTimes = [...controllerField.value];
                            newTimes.splice(idx, 1);
                            controllerField.onChange(newTimes);
                          }}
                        >
                          ×
                        </Button>
                      </div>
                    )
                  )}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      controllerField.onChange([
                        ...(controllerField.value ?? []),
                        "",
                      ])
                    }
                  >
                    {t("add_time")}
                  </Button>
                </div>
              )}
            />
            {error && (
              <span className="text-red-500 text-sm">
                {t("form.error_message")}: {error.message as string}
              </span>
            )}
          </div>
        );

      case "multi-checkbox":
        return (
          <div key={field.name} className="flex flex-col gap-1 w-40">
            <label>
              {t(field.label)}
              {requiredFields.includes(field.name) && (
                <span className="text-red-500 ml-1">
                  {t("form.required_field")}
                </span>
              )}
            </label>
            <Controller
              name={field.name}
              control={control}
              defaultValue={defaultValues?.[field.name] || []} // Ensure default value is an array
              render={({ field: controllerField }) => (
                <MultiSelect
                  // @ts-ignore
                  options={field.options || []} // Pass the options to MultiSelect
                  selected={controllerField.value} // Bind selected values
                  onChange={(selected) => controllerField.onChange(selected)} // Update form state
                  placeholder={t("select_option")} // Placeholder text
                  emptyText={t("no_options_found")} // Text when no options are available
                />
              )}
            />
            {error && (
              <span className="text-red-500 text-sm">
                {t("form.error_message")}: {error.message as string}
              </span>
            )}
          </div>
        );
      case "custom":
        return field.customRender ? (
          <div key={field.name} className="">
            {field.customRender({ register, setValue, error })}
          </div>
        ) : null;

      case "number":
        return (
          <div key={field.name} className="flex flex-col gap-1 w-40">
            <label>
              {t(field.label)}
              {requiredFields.includes(field.name) && (
                <span className="text-red-500 ml-1">
                  {t("form.required_field")}
                </span>
              )}
            </label>
            <Input
              type="number"
              min={1}
              {...register(field.name)}
              onChange={(e) => setValue(field.name, Number(e.target.value))}
            />
            {error && (
              <span className="text-red-500 text-sm">
                {t("form.error_message")}: {error.message as string}
              </span>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 bg-white px-8 py-6 rounded-lg"
    >
      <h2 className="text-base font-semibold text-accent rtl:text-right ltr:text-left">
        {mode === "edit"
          ? t("editing_x", { x: t(headerKey) })
          : t("add_x", { x: t(headerKey) })}
      </h2>

      <div className="flex gap-6 flex-wrap">
        {/* Image Section */}
        {fields.find((f) => f.type === "image") && (
          <div className="h-full">
            {renderField(fields.find((f) => f.type === "image")!)}
          </div>
        )}
        {fields.find((f) => f.type === "language") && (
          <div className="h-full">
            {renderField(fields.find((f) => f.type === "language")!)}
          </div>
        )}

        {/* Other Fields */}
        <div className="flex gap-6 flex-wrap flex-1">
          {fields
            .filter((f) => f.type !== "image" && f.type !== "language")
            .map(renderField)}
        </div>
      </div>

      <div className="flex gap-4 justify-end mt-4">
        {extraButtons}
        <Button
          variant={"default"}
          type="submit"
          disabled={isSubmitting}
          className="w-fit px-8 text-white hover:text-white"
        >
          {t(mode === "create" ? "create" : "save")}
        </Button>
      </div>
    </form>
  );
};

export default DynamicForm;
