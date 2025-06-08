import { useTranslation } from "react-i18next";

// const reportsAiApi = createApiService<any>("/reports/ai", {
//   includeOrgId: true,
// });

export default function AIReccomendations() {
  const { t, i18n } = useTranslation();
  const dir = i18n.language === "he" ? "rtl" : "ltr";

  return (
    <div className="space-y-6" dir={dir} style={{ direction: dir }}>
      <h1 className={`text-2xl font-bold ${dir === "rtl" ? "text-right" : ""}`}>
        {t("ai_recommendations")}
      </h1>
      <div
        className={`flex items-center justify-center h-48 border-2 border-dashed border-gray-300 bg-gray-50 rounded-lg ${
          dir === "rtl" ? "text-right" : "text-left"
        }`}
      >
        <div>
          <svg
            className="mx-auto mb-4 h-8 w-8 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m2-4h.01M12 3a9 9 0 110 18 9 9 0 010-18z"
            />
          </svg>
          <p className="text-xl font-medium text-gray-600">
            {t("ai_recommendations.placeholder")}
          </p>
        </div>
      </div>
    </div>
  );
}
