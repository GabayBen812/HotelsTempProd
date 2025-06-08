import React from "react";
import { useTranslation } from "react-i18next";

export default function AccessibilityStatement() {
  const { t } = useTranslation();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
        {t("accessibilityStatement.title")}
      </h1>

      <div className="space-y-6 text-gray-700 dark:text-gray-300">
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
            {t("accessibilityStatement.commitment")}
          </h2>
          <p className="mb-4">{t("accessibilityStatement.commitmentText")}</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
            {t("accessibilityStatement.conformance")}
          </h2>
          <p className="mb-4">{t("accessibilityStatement.conformanceText")}</p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>{t("accessibilityStatement.wcag")}</li>
            <li>{t("accessibilityStatement.aria")}</li>
            <li>{t("accessibilityStatement.keyboard")}</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
            {t("accessibilityStatement.features")}
          </h2>
          <p className="mb-4">{t("accessibilityStatement.featuresIntro")}</p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>{t("accessibilityStatement.featureTextSize")}</li>
            <li>{t("accessibilityStatement.featureContrast")}</li>
            <li>{t("accessibilityStatement.featureCursor")}</li>
            <li>{t("accessibilityStatement.featureLinks")}</li>
            <li>{t("accessibilityStatement.featureReadable")}</li>
            <li>{t("accessibilityStatement.featureAnimations")}</li>
            <li>{t("accessibilityStatement.featureKeyboard")}</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
            {t("accessibilityStatement.compatibility")}
          </h2>
          <p className="mb-4">
            {t("accessibilityStatement.compatibilityText")}
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>NVDA</li>
            <li>JAWS</li>
            <li>VoiceOver</li>
            <li>TalkBack</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
            {t("accessibilityStatement.contact")}
          </h2>
          <p className="mb-4">{t("accessibilityStatement.contactText")}</p>
          <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
            <p className="font-medium">
              {t("accessibilityStatement.email")}:{" "}
              <a
                href="mailto:accessibility@staysync.com"
                className="text-blue-600 dark:text-blue-300 hover:underline"
              >
                accessibility@staysync.com
              </a>
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
            {t("accessibilityStatement.updates")}
          </h2>
          <p>{t("accessibilityStatement.updatesText")}</p>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {t("accessibilityStatement.lastUpdated", { date: "2024-03-15" })}
          </p>
        </section>
      </div>
    </div>
  );
}
