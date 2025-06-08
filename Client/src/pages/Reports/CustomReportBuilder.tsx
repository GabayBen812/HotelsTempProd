import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { DatePicker } from "@/components/ui/date-picker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Save, Filter } from "lucide-react";

interface ReportField {
  id: string;
  name: string;
  type: "text" | "number" | "date" | "select" | "checkbox";
  options?: { label: string; value: string }[];
}

// interface CustomReport {
//   id: string;
//   name: string;
//   description: string;
//   fields: ReportField[];
//   filters: any;
//   dateRange: {
//     start: Date | undefined;
//     end: Date | undefined;
//   };
// }

export default function CustomReportBuilder() {
  const { t, i18n } = useTranslation();
  const dir = i18n.language === "he" ? "rtl" : "ltr";
  const [reportName, setReportName] = useState("");
  const [reportDescription, setReportDescription] = useState("");
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<{
    start: Date | undefined;
    end: Date | undefined;
  }>({
    start: undefined,
    end: undefined,
  });

  const availableFields: ReportField[] = [
    { id: "call_id", name: t("reports.fields.call_id"), type: "text" },
    { id: "title", name: t("reports.fields.title"), type: "text" },
    { id: "description", name: t("reports.fields.description"), type: "text" },
    {
      id: "status",
      name: t("reports.fields.status"),
      type: "select",
      options: [
        { label: t("status_open"), value: "OPENED" },
        { label: t("status_in_progress"), value: "IN_PROGRESS" },
        { label: t("status_completed"), value: "COMPLETED" },
        { label: t("status_failed"), value: "FAILED" },
        { label: t("status_on_hold"), value: "ON_HOLD" },
      ],
    },
    { id: "created_at", name: t("reports.fields.created_at"), type: "date" },
    { id: "closed_at", name: t("reports.fields.closed_at"), type: "date" },
    { id: "created_by", name: t("reports.fields.created_by"), type: "text" },
    { id: "assigned_to", name: t("reports.fields.assigned_to"), type: "text" },
    {
      id: "department",
      name: t("reports.fields.department"),
      type: "select",
      options: [],
    },
    {
      id: "category",
      name: t("reports.fields.category"),
      type: "select",
      options: [],
    },
    {
      id: "priority",
      name: t("reports.fields.priority"),
      type: "select",
      options: [
        { label: t("priority.high_priority"), value: "HIGH" },
        { label: t("priority.medium_priority"), value: "MEDIUM" },
        { label: t("priority.low_priority"), value: "LOW" },
      ],
    },
    {
      id: "resolution_time",
      name: t("reports.fields.resolution_time"),
      type: "number",
    },
    { id: "cost", name: t("reports.fields.cost"), type: "number" },
  ];

  const handleExport = (format: "pdf" | "excel" | "csv") => {
    // TODO: Implement export functionality
    console.log(`Exporting to ${format}`);
  };

  const handleSaveReport = () => {
    // TODO: Implement save functionality
    console.log("Saving report");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center" dir={dir}>
        <h1 className="text-3xl font-bold tracking-tight">
          {t("reports.custom_report.title")}
        </h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleExport("pdf")}>
            <Download className="mr-2 h-4 w-4" />
            {t("reports.export.pdf")}
          </Button>
          <Button variant="outline" onClick={() => handleExport("excel")}>
            <Download className="mr-2 h-4 w-4" />
            {t("reports.export.excel")}
          </Button>
          <Button variant="outline" onClick={() => handleExport("csv")}>
            <Download className="mr-2 h-4 w-4" />
            {t("reports.export.csv")}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="builder" className="space-y-4">
        <TabsList dir={dir}>
          <TabsTrigger value="builder">
            {t("reports.custom_report.create_new")}
          </TabsTrigger>
          <TabsTrigger value="saved">
            {t("reports.custom_report.saved_reports")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="builder">
          <Card>
            <CardHeader>
              <CardTitle>{t("reports.custom_report.title")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6" dir={dir}>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="reportName">
                      {t("reports.custom_report.name")}
                    </Label>
                    <Input
                      id="reportName"
                      value={reportName}
                      onChange={(e) => setReportName(e.target.value)}
                      placeholder={t("reports.custom_report.name")}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reportDescription">
                      {t("reports.custom_report.description")}
                    </Label>
                    <Input
                      id="reportDescription"
                      value={reportDescription}
                      onChange={(e) => setReportDescription(e.target.value)}
                      placeholder={t("reports.custom_report.description")}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>{t("reports.filters.date_range")}</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <DatePicker
                      date={dateRange.start}
                      onSelect={(date) =>
                        setDateRange({ ...dateRange, start: date })
                      }
                    />
                    <DatePicker
                      date={dateRange.end}
                      onSelect={(date) =>
                        setDateRange({ ...dateRange, end: date })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>{t("reports.custom_report.select_fields")}</Label>
                    <Button variant="ghost" size="sm" className="h-8">
                      <Filter className="mr-2 h-4 w-4" />
                      {t("reports.filters.apply")}
                    </Button>
                  </div>
                  <div className="grid grid-cols-3 gap-4 p-4 border rounded-lg">
                    {availableFields.map((field) => (
                      <div
                        key={field.id}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={field.id}
                          checked={selectedFields.includes(field.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedFields([...selectedFields, field.id]);
                            } else {
                              setSelectedFields(
                                selectedFields.filter((id) => id !== field.id)
                              );
                            }
                          }}
                        />
                        <Label
                          htmlFor={field.id}
                          className="text-sm font-medium"
                        >
                          {field.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSaveReport}>
                    <Save className="mr-2 h-4 w-4" />
                    {t("reports.custom_report.save_report")}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="saved">
          <Card>
            <CardHeader>
              <CardTitle>{t("reports.custom_report.saved_reports")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center text-muted-foreground py-8">
                {t("reports.custom_report.saved_reports")}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
