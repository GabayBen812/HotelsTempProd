import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CustomReportBuilder from "./CustomReportBuilder";
import GeneralData from "./GeneralData";
import AIReccomendations from "./AIReccomendations";

export default function Reports() {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState("overview");
  const dir = i18n.language === "he" ? "rtl" : "rtl";

  // const handleExport = (format: "pdf" | "excel" | "csv") => {
  //   // TODO: Implement export functionality
  //   console.log(`Exporting to ${format}...`);
  // };

  return (
    <div
      className="container mx-auto py-6 space-y-6"
      dir={dir}
      style={{ direction: dir, alignItems: "center", justifyContent: "center" }}
    >
      <h1
        className={`text-3xl font-bold tracking-tight ${
          dir === "rtl" ? "text-right" : ""
        }`}
        style={{ direction: dir }}
      >
        {t("reports.custom_report.title")}
      </h1>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList
          className={`grid w-full grid-cols-5 ${
            dir === "rtl" ? "flex-row-reverse" : ""
          }`}
          style={{ direction: dir, marginBottom: "20px" }}
        >
          <TabsTrigger value="overview">{t("overview")}</TabsTrigger>
          <TabsTrigger value="custom">{t("custom_reports")}</TabsTrigger>
          <TabsTrigger value="ai">{t("ai_recommendations")}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <GeneralData />
        </TabsContent>

        <TabsContent value="custom">
          <CustomReportBuilder />
        </TabsContent>

        <TabsContent value="ai">
          <AIReccomendations />
        </TabsContent>
      </Tabs>
    </div>
  );
}
