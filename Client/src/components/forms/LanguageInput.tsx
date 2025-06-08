import React from "react";
import { Input } from "@/components/ui/Input";
import { useTranslation } from "react-i18next";

interface LanguageInputProps {
  label: string;
  defaultValue?: { he: string; en: string; ar: string };
  onLanguageValuesChange: (values: { he: string; en: string; ar: string }) => void;
}

const LanguageInput: React.FC<LanguageInputProps> = ({
  label,
  defaultValue = { he: "", en: "", ar: "" },
  onLanguageValuesChange,
}) => {
  const { t } = useTranslation();
  const [values, setValues] = React.useState(defaultValue);

  const handleChange = (lang: "he" | "en" | "ar", value: string) => {
    const newValues = { ...values, [lang]: value };
    setValues(newValues);
    onLanguageValuesChange(newValues);
  };

  return (
    <div className="flex flex-col gap-2">
      <label>{label}</label>
      <Input
        placeholder={t("hebrew")}
        value={values.he}
        onChange={(e) => handleChange("he", e.target.value)}
      />
      <Input
        placeholder={t("english")}
        value={values.en}
        onChange={(e) => handleChange("en", e.target.value)}
      />
      <Input
        placeholder={t("arabic")}
        value={values.ar}
        onChange={(e) => handleChange("ar", e.target.value)}
      />
    </div>
  );
};

export default LanguageInput; 