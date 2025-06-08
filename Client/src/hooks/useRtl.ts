import { useMemo } from "react";
import { useTranslation } from "react-i18next";

export function useRTL() {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === "he";
  const textAlign = isRtl ? "text-right" : "text-left";
  const flexDirection = isRtl ? "flex-row-reverse" : "flex-row";
  const rtlStyles = isRtl
    ? "flex-row-reverse text-right"
    : "flex-row text-left";

  const getNameByLanguage = (name: { he: string; en: string }) => {
    return i18n.language === "he" ? name.he : name.en;
  };

  const formatDate = useMemo(() => {
    return (dateString: string) => {
      const locale = i18n.language === "he" ? "he-IL" : "en-US";
      return new Intl.DateTimeFormat(locale, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: i18n.language !== "he",
      }).format(new Date(dateString));
    };
  }, [i18n.language]);
  return {
    isRtl: isRtl,
    toggleLanguage: () => {
      const newLang = i18n.language === "he" ? "en" : "he";
      i18n.changeLanguage(newLang);
    },
    textAlign: textAlign,
    flexDirection: flexDirection,
    rtlStyles: rtlStyles,
    getNameByLanguage: getNameByLanguage,
    formatDate,
  };
}
