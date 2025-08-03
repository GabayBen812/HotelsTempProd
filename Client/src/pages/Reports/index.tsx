import { useState, useContext } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  Calendar,
  Building2,
  Settings,
  Brain,
  Download,
  Users,
  Clock,
  Target,
  Eye,
  CheckCircle,
  Zap,
  RefreshCw,
} from "lucide-react";
import { OrganizationsContext } from "@/contexts/OrganizationsContext";
import { useReportsData } from "@/hooks/useReportsData";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import CustomReportBuilder from "./CustomReportBuilder";
import GeneralData from "./GeneralData";
import AIReccomendations from "./AIReccomendations";
import ByDayReport from "./ByDayReport";
import ByDepartmentReport from "./ByDepartmentReport";
import StatCard from "../Home/components/StatCard";

export default function Reports() {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState("overview");
  const dir = i18n.language === "he" || i18n.language === "ar" ? "rtl" : "ltr";
  const { organization } = useContext(OrganizationsContext);

  const {
    dashboardStats,
    urgentIssues,
    departmentPerformance,
    loading,
    refetch,
  } = useReportsData(organization?.id);

  const handleExport = async (format: "pdf" | "excel" | "csv") => {
    if (
      !dashboardStats &&
      !urgentIssues.length &&
      !departmentPerformance.length
    ) {
      alert(t("no_data_to_export") || "No data available to export");
      return;
    }



    try {
      if (format === "csv") {
        exportToCSV();
      } else if (format === "excel") {
        exportToExcel();
      } else if (format === "pdf") {
        await exportToPDF();
      }
    } catch (error) {
      console.error(`Error exporting to ${format}:`, error);
      alert(t("export_error") || `Error exporting to ${format.toUpperCase()}`);
    }
  };

  const exportToCSV = () => {
    const csvData = [];

    // Add header
    csvData.push([
      t("reports_title"),
      organization?.name || "",
      new Date().toLocaleDateString(),
    ]);
    csvData.push([]);

    // Dashboard Stats
    if (dashboardStats) {
      csvData.push([t("dashboard_stats")]);
      csvData.push([
        t("total_calls_today"),
        dashboardStats.totalCallsToday,
        dashboardStats.changes.totalCallsToday,
      ]);
      csvData.push([
        t("avg_resolution_time"),
        dashboardStats.avgResolutionTime,
        dashboardStats.changes.avgResolutionTime,
      ]);
      csvData.push([
        t("staff_response_rate"),
        `${dashboardStats.staffResponseRate}%`,
        dashboardStats.changes.staffResponseRate,
      ]);
      csvData.push([
        t("guest_satisfaction"),
        dashboardStats.guestSatisfaction,
        dashboardStats.changes.guestSatisfaction,
      ]);
      csvData.push([]);
    }

    // Urgent Issues
    if (urgentIssues.length > 0) {
      csvData.push([t("urgent_issues")]);
      csvData.push([t("title"), t("location"), t("time"), t("priority")]);
      urgentIssues.forEach((issue) => {
        csvData.push([
          issue.title,
          issue.location,
          issue.timeAgo,
          issue.priority,
        ]);
      });
      csvData.push([]);
    }

    // Department Performance
    if (departmentPerformance.length > 0) {
      csvData.push([t("top_departments")]);
      csvData.push([t("department"), t("completion_rate")]);
      departmentPerformance.forEach((dept) => {
        csvData.push([dept.name, `${dept.completionRate}%`]);
      });
    }

    const csvContent = csvData
      .map((row) => row.map((field) => `"${field}"`).join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${organization?.name || "reports"}_${
      new Date().toISOString().split("T")[0]
    }.csv`;
    link.click();
  };

  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();

    // Dashboard Stats Sheet
    if (dashboardStats) {
      const statsData = [
        [t("dashboard_stats")],
        [],
        [t("metric"), t("value"), t("change")],
        [
          t("total_calls_today"),
          dashboardStats.totalCallsToday,
          dashboardStats.changes.totalCallsToday,
        ],
        [
          t("avg_resolution_time"),
          dashboardStats.avgResolutionTime,
          dashboardStats.changes.avgResolutionTime,
        ],
        [
          t("staff_response_rate"),
          `${dashboardStats.staffResponseRate}%`,
          dashboardStats.changes.staffResponseRate,
        ],
        [
          t("guest_satisfaction"),
          dashboardStats.guestSatisfaction,
          dashboardStats.changes.guestSatisfaction,
        ],
      ];
      const statsWS = XLSX.utils.aoa_to_sheet(statsData);
      XLSX.utils.book_append_sheet(wb, statsWS, t("dashboard_stats"));
    }

    // Urgent Issues Sheet
    if (urgentIssues.length > 0) {
      const issuesData = [
        [t("urgent_issues")],
        [],
        [t("title"), t("location"), t("time"), t("priority")],
        ...urgentIssues.map((issue) => [
          issue.title,
          issue.location,
          issue.timeAgo,
          issue.priority,
        ]),
      ];
      const issuesWS = XLSX.utils.aoa_to_sheet(issuesData);
      XLSX.utils.book_append_sheet(wb, issuesWS, t("urgent_issues"));
    }

    // Department Performance Sheet
    if (departmentPerformance.length > 0) {
      const deptData = [
        [t("top_departments")],
        [],
        [t("department"), t("completion_rate")],
        ...departmentPerformance.map((dept) => [
          dept.name,
          `${dept.completionRate}%`,
        ]),
      ];
      const deptWS = XLSX.utils.aoa_to_sheet(deptData);
      XLSX.utils.book_append_sheet(wb, deptWS, t("departments"));
    }

    XLSX.writeFile(
      wb,
      `${organization?.name || "reports"}_${
        new Date().toISOString().split("T")[0]
      }.xlsx`
    );
  };

  const exportToPDF = async () => {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    let yPosition = 20;

    // Header
    pdf.setFontSize(20);
    pdf.setFont("helvetica", "bold");
    pdf.text(t("reports_title"), pageWidth / 2, yPosition, { align: "center" });
    yPosition += 10;

    pdf.setFontSize(12);
    pdf.setFont("helvetica", "normal");
    pdf.text(
      `${
        organization?.name || "Organization"
      } | ${new Date().toLocaleDateString()}`,
      pageWidth / 2,
      yPosition,
      { align: "center" }
    );
    yPosition += 20;

    // Dashboard Stats
    if (dashboardStats) {
      pdf.setFontSize(16);
      pdf.setFont("helvetica", "bold");
      pdf.text(t("dashboard_stats"), 20, yPosition);
      yPosition += 15;

      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");

      const stats = [
        [
          t("total_calls_today"),
          dashboardStats.totalCallsToday.toString(),
          dashboardStats.changes.totalCallsToday,
        ],
        [
          t("avg_resolution_time"),
          dashboardStats.avgResolutionTime,
          dashboardStats.changes.avgResolutionTime,
        ],
        [
          t("staff_response_rate"),
          `${dashboardStats.staffResponseRate}%`,
          dashboardStats.changes.staffResponseRate,
        ],
        [
          t("guest_satisfaction"),
          dashboardStats.guestSatisfaction.toString(),
          dashboardStats.changes.guestSatisfaction,
        ],
      ];

      stats.forEach(([metric, value, change]) => {
        pdf.text(`${metric}: ${value} (${change})`, 25, yPosition);
        yPosition += 8;
      });
      yPosition += 10;
    }

    // Urgent Issues
    if (urgentIssues.length > 0) {
      if (yPosition > pageHeight - 60) {
        pdf.addPage();
        yPosition = 20;
      }

      pdf.setFontSize(16);
      pdf.setFont("helvetica", "bold");
      pdf.text(t("urgent_issues"), 20, yPosition);
      yPosition += 15;

      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");

      urgentIssues.forEach((issue) => {
        if (yPosition > pageHeight - 20) {
          pdf.addPage();
          yPosition = 20;
        }
        pdf.text(
          `• ${issue.title} (${issue.location}) - ${issue.priority}`,
          25,
          yPosition
        );
        yPosition += 8;
      });
      yPosition += 10;
    }

    // Department Performance
    if (departmentPerformance.length > 0) {
      if (yPosition > pageHeight - 60) {
        pdf.addPage();
        yPosition = 20;
      }

      pdf.setFontSize(16);
      pdf.setFont("helvetica", "bold");
      pdf.text(t("top_departments"), 20, yPosition);
      yPosition += 15;

      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");

      departmentPerformance.forEach((dept) => {
        if (yPosition > pageHeight - 20) {
          pdf.addPage();
          yPosition = 20;
        }
        pdf.text(`• ${dept.name}: ${dept.completionRate}%`, 25, yPosition);
        yPosition += 8;
      });
    }

    pdf.save(
      `${organization?.name || "reports"}_${
        new Date().toISOString().split("T")[0]
      }.pdf`
    );
  };

  const tabsConfig = [
    {
      value: "ai",
      label: t("ai_recommendations"),
      icon: Brain,
      gradient: "from-cyan-500 to-teal-600",
      description: t("ai_recommendations_desc"),
    },
    {
      value: "by_day",
      label: t("calls_by_day"),
      icon: Calendar,
      gradient: "from-green-500 to-emerald-600",
      description: t("calls_by_day_desc"),
    },
    {
      value: "by_department",
      label: t("calls_by_department"),
      icon: Building2,
      gradient: "from-purple-500 to-violet-600",
      description: t("calls_by_department_desc"),
    },
    {
      value: "custom",
      label: t("custom_reports"),
      icon: Settings,
      gradient: "from-orange-500 to-red-600",
      description: t("custom_reports_desc"),
    },
    {
      value: "overview",
      label: t("overview"),
      icon: Eye,
      gradient: "from-blue-500 to-indigo-600",
      description: t("overview_desc"),
    },
  ];

  const quickStats = [
    {
      title: t("total_calls_today"),
      value: loading
        ? "..."
        : dashboardStats?.totalCallsToday?.toString() || "0",
      trendValue: loading
        ? "..."
        : dashboardStats?.changes.totalCallsToday || "+0%",
      trend: "up",
      icon: BarChart3,
      subtitle: t("vs_yesterday"),
    },
    {
      title: t("avg_resolution_time"),
      value: loading ? "..." : dashboardStats?.avgResolutionTime || "0m",
      trendValue: loading
        ? "..."
        : dashboardStats?.changes.avgResolutionTime || "-5m",
      trend: "up",
      icon: Clock,
      subtitle: t("faster_than_target"),
    },
    {
      title: t("staff_response_rate"),
      value: loading ? "..." : `${dashboardStats?.staffResponseRate || 0}%`,
      trendValue: loading
        ? "..."
        : dashboardStats?.changes.staffResponseRate || "+2%",
      trend: "up",
      icon: Users,
      subtitle: t("calls_answered_promptly"),
    },
    {
      title: t("guest_satisfaction"),
      value: loading
        ? "..."
        : dashboardStats?.guestSatisfaction?.toString() || "4.5",
      trendValue: loading
        ? "..."
        : dashboardStats?.changes.guestSatisfaction || "+0.2",
      trend: "up",
      icon: Target,
      subtitle: t("out_of_5_stars"),
    },
  ];
  // const quickStats = [
  //   {
  //     title: t("total_calls_today"),
  //     value: loading
  //       ? "..."
  //       : dashboardStats?.totalCallsToday?.toString() || "0",
  //     change: loading
  //       ? "..."
  //       : dashboardStats?.changes.totalCallsToday || "+0%",
  //     changeType: "positive",
  //     icon: BarChart3,
  //     description: t("vs_yesterday"),
  //   },
  //   {
  //     title: t("avg_resolution_time"),
  //     value: loading ? "..." : dashboardStats?.avgResolutionTime || "0m",
  //     change: loading
  //       ? "..."
  //       : dashboardStats?.changes.avgResolutionTime || "-5m",
  //     changeType: "positive",
  //     icon: Clock,
  //     description: t("faster_than_target"),
  //   },
  //   {
  //     title: t("staff_response_rate"),
  //     value: loading ? "..." : `${dashboardStats?.staffResponseRate || 0}%`,
  //     change: loading
  //       ? "..."
  //       : dashboardStats?.changes.staffResponseRate || "+2%",
  //     changeType: "positive",
  //     icon: Users,
  //     description: t("calls_answered_promptly"),
  //   },
  //   {
  //     title: t("guest_satisfaction"),
  //     value: loading
  //       ? "..."
  //       : dashboardStats?.guestSatisfaction?.toString() || "4.5",
  //     change: loading
  //       ? "..."
  //       : dashboardStats?.changes.guestSatisfaction || "+0.2",
  //     changeType: "positive",
  //     icon: Target,
  //     description: t("out_of_5_stars"),
  //   },
  // ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      dir={dir}
    >
      <div className="flex flex-col gap-8 ">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6"
        >
          <div className="space-y-2">
            <h1 className="heading">{t("reports_title")}</h1>
            {/* <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              {t("reports_title")}
            </h1> */}
            <p className="text-lg text-foreground/70">
              {t("reports_subtitle")}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="lg"
              onClick={refetch}
              disabled={loading}
              className="bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-white hover:shadow-md transition-all duration-200"
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
              />
              {t("refresh")}
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => handleExport("pdf")}
              className="bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-white hover:shadow-md transition-all duration-200"
            >
              <Download className="w-4 h-4 mr-2" />
              {t("export_pdf")}
            </Button>
            <Button
              size="lg"
              onClick={() => handleExport("excel")}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-blue-500/25 transition-all duration-200"
            >
              <Download className="w-4 h-4 mr-2" />
              {t("export_excel")}
            </Button>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {quickStats.map((stat) => (
            // <Card
            //   key={stat.title}
            //   className="bg-surface/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            // >
            //   <CardContent className="p-6">
            //     <div className="flex items-center justify-between">
            //       <div className="space-y-2">
            //         <p className="text-sm font-medium text-gray-600">
            //           {stat.title}
            //         </p>
            //         <p className="text-3xl font-bold text-gray-900">
            //           {stat.value}
            //         </p>
            //         <div className="flex items-center gap-1">
            //           <TrendingUp className="w-4 h-4 text-green-500" />
            //           <span className="text-sm font-medium text-green-600">
            //             {stat.change}
            //           </span>
            //         </div>
            //         <p className="text-xs text-gray-500">{stat.subtitle}</p>
            //       </div>
            //       <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
            //         <stat.icon className="w-6 h-6 text-white" />
            //       </div>
            //     </div>
            //   </CardContent>
            // </Card>
            <StatCard {...stat} trend="up" />
          ))}
        </motion.div>

        {/* Real-time Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {/* Active Issues */}
          <Card className="bg-surface/90 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                {t("urgent_issues")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-16 bg-background/80 rounded-lg"></div>
                    </div>
                  ))}
                </div>
              ) : urgentIssues.length > 0 ? (
                urgentIssues.map((issue) => (
                  <div
                    key={issue.id}
                    className={`flex justify-between items-center p-3 rounded-lg ${
                      issue.priority === "high"
                        ? "bg-red-50"
                        : issue.priority === "medium"
                        ? "bg-orange-50"
                        : "bg-yellow-50"
                    }`}
                  >
                    <div>
                      <p
                        className={`font-medium ${
                          issue.priority === "high"
                            ? "text-red-800"
                            : issue.priority === "medium"
                            ? "text-orange-800"
                            : "text-yellow-800"
                        }`}
                      >
                        {issue.title}
                      </p>
                      <p
                        className={`text-sm ${
                          issue.priority === "high"
                            ? "text-red-600"
                            : issue.priority === "medium"
                            ? "text-orange-600"
                            : "text-yellow-600"
                        }`}
                      >
                        {issue.location} • {issue.timeAgo}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        issue.priority === "high"
                          ? "bg-red-100 text-red-700"
                          : issue.priority === "medium"
                          ? "bg-orange-100 text-orange-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {issue.priority === "high"
                        ? t("high_priority")
                        : issue.priority === "medium"
                        ? t("medium_priority")
                        : t("low_priority")}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <CheckCircle className="w-12 h-12 mb-2 text-green-500" />
                  <p>{t("no_urgent_issues")}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Top Performing Departments */}
          <Card className="bg-surface/90 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                {t("top_departments")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-background/80 rounded-full"></div>
                          <div className="space-y-1">
                            <div className="h-4 bg-gray-200 rounded w-20"></div>
                            <div className="h-3 bg-gray-200 rounded w-16"></div>
                          </div>
                        </div>
                        <div className="h-6 bg-gray-200 rounded w-12"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : departmentPerformance.length > 0 ? (
                departmentPerformance.map((dept, index) => (
                  <div
                    key={dept.name}
                    className="flex justify-between items-center"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          dept.color === "green"
                            ? "bg-green-100"
                            : dept.color === "blue"
                            ? "bg-blue-100"
                            : "bg-purple-100"
                        }`}
                      >
                        {index === 0 ? (
                          <CheckCircle
                            className={`w-4 h-4 ${
                              dept.color === "green"
                                ? "text-green-600"
                                : dept.color === "blue"
                                ? "text-blue-600"
                                : "text-purple-600"
                            }`}
                          />
                        ) : index === 1 ? (
                          <Zap
                            className={`w-4 h-4 ${
                              dept.color === "green"
                                ? "text-green-600"
                                : dept.color === "blue"
                                ? "text-blue-600"
                                : "text-purple-600"
                            }`}
                          />
                        ) : (
                          <Users
                            className={`w-4 h-4 ${
                              dept.color === "green"
                                ? "text-green-600"
                                : dept.color === "blue"
                                ? "text-blue-600"
                                : "text-purple-600"
                            }`}
                          />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{dept.name}</p>
                        <p className="text-sm text-gray-500">
                          {dept.completionRate}% {t("completion_rate")}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-2xl font-bold ${
                        dept.color === "green"
                          ? "text-green-600"
                          : dept.color === "blue"
                          ? "text-blue-600"
                          : "text-purple-600"
                      }`}
                    >
                      {dept.completionRate}%
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Building2 className="w-12 h-12 mb-2" />
                  <p>{t("no_department_data")}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Peak Hours Analysis */}
          {/* <Card className="bg-surface/90 backdrop-blur-sm border-0 shadow-lg">
             <CardHeader className="pb-3">
               <CardTitle className="flex items-center gap-2 text-lg">
                 <Clock className="w-5 h-5 text-blue-500" />
                 {t("peak_hours_today")}
               </CardTitle>
             </CardHeader>
                           <CardContent className="space-y-4">
                {loading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="animate-pulse">
                        <div className="flex justify-between text-sm mb-2">
                          <div className="h-4 bg-gray-200 rounded w-24"></div>
                          <div className="h-4 bg-gray-200 rounded w-16"></div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2"></div>
                      </div>
                    ))}
                  </div>
                ) : peakHours.length > 0 ? (
                  <>
                    {peakHours.filter(hour => hour.callCount > 0).map((hour, index) => (
                      <div key={hour.timeRange} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{hour.timeRange}</span>
                          <span className="font-medium">{hour.callCount} {t("calls")}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              index === 0 ? 'bg-gradient-to-r from-blue-500 to-indigo-600' :
                              index === 1 ? 'bg-gradient-to-r from-green-500 to-emerald-600' :
                              'bg-gradient-to-r from-purple-500 to-violet-600'
                            }`}
                            style={{width: `${hour.percentage}%`}}
                          ></div>
                        </div>
                      </div>
                    ))}
                    {peakHours.some(hour => hour.callCount > 0) && (
                      <div className="pt-2 border-t">
                        <p className="text-xs text-gray-500">
                          {t("busiest_time")}: {peakHours.reduce((max, hour) => 
                            hour.callCount > max.callCount ? hour : max
                          ).timeRange}
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Clock className="w-12 h-12 mx-auto mb-2" />
                    <p>{t("no_peak_hours_data")}</p>
                  </div>
                )}
              </CardContent>
           </Card> */}
        </motion.div>

        {/* Enhanced Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6"
          >
            {/* Custom Tab Navigation */}
            <div className="bg-surface/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg border-0">
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {tabsConfig.map((tab) => {
                  const isActive = activeTab === tab.value;
                  return (
                    <motion.button
                      key={tab.value}
                      onClick={() => setActiveTab(tab.value)}
                      className={`relative p-4 rounded-xl transition-all duration-300 group ${
                        dir === "rtl" ? "text-right" : "text-left"
                      } ${
                        isActive
                          ? "bg-white shadow-lg scale-105"
                          : "hover:bg-background/70 hover:shadow-md"
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div
                        className={`flex items-center gap-3 mb-2 justify-between ${
                          dir === "rtl" ? "" : "flex-row-reverse"
                        }`}
                      >
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${
                            isActive
                              ? `bg-gradient-to-r ${tab.gradient}`
                              : "bg-gray-100 group-hover:bg-gray-200"
                          }`}
                        >
                          <tab.icon
                            className={`w-5 h-5 ${
                              isActive ? "text-white" : "text-gray-600"
                            }`}
                          />
                        </div>
                        {isActive && (
                          <Badge
                            variant="secondary"
                            className="bg-blue-100 text-blue-700 text-xs"
                          >
                            {t("active")}
                          </Badge>
                        )}
                      </div>
                      <h3
                        className={`font-semibold mb-1 transition-colors duration-300 ${
                          isActive
                            ? "text-gray-900"
                            : "text-gray-700 group-hover:text-gray-900"
                        }`}
                      >
                        {tab.label}
                      </h3>
                      <p className="text-sm text-gray-500 line-clamp-2">
                        {tab.description}
                      </p>

                      {isActive && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-xl"
                          transition={{
                            type: "spring",
                            bounce: 0.2,
                            duration: 0.6,
                          }}
                        />
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Tab Content */}
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: dir === "rtl" ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-surface/90 backdrop-blur-sm rounded-2xl shadow-lg border-0 p-6"
            >
              <TabsContent value="overview" className="mt-0 space-y-6">
                <GeneralData />
              </TabsContent>

              <TabsContent value="custom" className="mt-0">
                <CustomReportBuilder />
              </TabsContent>

              <TabsContent value="ai" className="mt-0">
                <AIReccomendations />
              </TabsContent>

              <TabsContent value="by_day" className="mt-0">
                <ByDayReport />
              </TabsContent>

              <TabsContent value="by_department" className="mt-0">
                <ByDepartmentReport />
              </TabsContent>
            </motion.div>
          </Tabs>
        </motion.div>
      </div>
    </motion.div>
  );
}
