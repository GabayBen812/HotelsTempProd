import { useTranslation } from "react-i18next";
export const GetDirection = () => {
  const { i18n } = useTranslation();
  return i18n.language === "he" || i18n.language === "ar";
  ;
};

export const GetTextDirection = (): "rtl" | "ltr" => {
  const { i18n } = useTranslation();
  return i18n.dir() as "rtl" | "ltr";
};
