import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { fetchCalls } from "@/api/calls";
import { fetchCallCategories } from "@/api/calls/categories";
import { Call, CallCategory } from "@/types/api/calls";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Loader2 } from "lucide-react";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

export default function GeneralData() {
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [calls, setCalls] = useState<Call[]>([]);
  const [categories, setCategories] = useState<CallCategory[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [callsResponse, categoriesResponse] = await Promise.all([
          fetchCalls(),
          fetchCallCategories(),
        ]);
        // @ts-ignore
        setCalls(callsResponse.data.data || []);
        setCategories(categoriesResponse.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate SLA metrics
  const calculateSLAMetrics = () => {
    // const total = calls.length;
    const completed = calls.filter(
      (call) => call.status === "COMPLETED"
    ).length;
    const inProgress = calls.filter(
      (call) => call.status === "IN_PROGRESS"
    ).length;
    const failed = calls.filter((call) => call.status === "FAILED").length;

    return [
      { name: t("completed"), value: completed },
      { name: t("in_progress"), value: inProgress },
      { name: t("failed"), value: failed },
    ];
  };

  // Calculate call volumes by category
  const calculateCallVolumes = () => {
    const volumesByCategory = categories.map((category) => {
      const count = calls.filter(
        // @ts-ignore
        (call) => call.callCategoryId === category.id
      ).length;
      return {
        name: category.name[i18n.language as "he" | "en" | "ar"] || category.name.en || category.name.he,
        calls: count,
      };
    });

    return volumesByCategory;
  };

  // Calculate average response times
  const calculateResponseTimes = () => {
    const timesByDepartment = new Map();

    calls.forEach((call) => {
      // @ts-ignore
      if (call.createdAt && call.closedAt && call.departmentId) {
        const responseTime =
          // @ts-ignore
          new Date(call.closedAt).getTime() -
          // @ts-ignore
          new Date(call.createdAt).getTime();
        const department =
          call.Department?.name[i18n.language as "he" | "en" | "ar"] || call.Department?.name.en || call.Department?.name.he || "Unknown";

        if (!timesByDepartment.has(department)) {
          timesByDepartment.set(department, { total: 0, count: 0 });
        }

        const current = timesByDepartment.get(department);
        timesByDepartment.set(department, {
          total: current.total + responseTime,
          count: current.count + 1,
        });
      }
    });

    return Array.from(timesByDepartment.entries()).map(([dept, data]) => ({
      department: dept,
      averageTime: Math.round(data.total / (data.count * 60000)), // Convert to minutes
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>{t("sla_compliance")}</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={calculateSLAMetrics()}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {/* @ts-ignore */}
                  {calculateSLAMetrics().map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("call_volumes")}</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={calculateCallVolumes()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="calls" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>{t("response_times")}</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={calculateResponseTimes()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="department" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="averageTime" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("efficiency_metrics")}</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">{t("completion_rate")}</h3>
                <p className="text-3xl font-bold">
                  {Math.round(
                    (calls.filter((c) => c.status === "COMPLETED").length /
                      calls.length) *
                      100
                  )}
                  %
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium">
                  {t("avg_resolution_time")}
                </h3>
                <p className="text-3xl font-bold">
                  {Math.round(
                    calls.reduce((acc, call) => {
                      // @ts-ignore
                      if (call.createdAt && call.closedAt) {
                        return (
                          acc +
                          // @ts-ignore
                          (new Date(call.closedAt).getTime() -
                            // @ts-ignore
                            new Date(call.createdAt).getTime())
                        );
                      }
                      return acc;
                    }, 0) /
                    // @ts-ignore
                      (calls.filter((c) => c.closedAt).length * 60000)
                  )}{" "}
                  {t("minutes")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
