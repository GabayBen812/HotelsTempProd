import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "he",
    debug: true,
    load: "all",
    backend: {
      loadPath:
        "https://qipcgolampmdkhplcnbk.supabase.co/storage/v1/object/public/Images/Translations/{{lng}}.json",
    },
    detection: {
      // 👇 Add this block
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
