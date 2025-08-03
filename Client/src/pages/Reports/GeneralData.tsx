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
  Legend,
  Sector,
} from "recharts";
import { Loader2 } from "lucide-react";

// Modern color palette
const COLORS = {
  primary: "#2563eb",
  secondary: "#7c3aed",
  success: "#059669",
  warning: "#d97706",
  danger: "#dc2626",
  background: "#f8fafc",
  text: "#1e293b",
};

const chartColors = [
  COLORS.primary,
  COLORS.secondary,
  COLORS.success,
  COLORS.warning,
  COLORS.danger,
];

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-surface p-3 rounded-lg shadow-lg border border-gray-200">
        <p className="font-medium text-gray-900">{label}</p>
        <p className="text-sm text-gray-600">
          {payload[0].name}: {payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

// Custom Pie active shape for better hover effect
const renderActiveShape = (props: any) => {
  // const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    // midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    // value,
  } = props;
  // const sin = Math.sin(-RADIAN * midAngle);
  // const cos = Math.cos(-RADIAN * midAngle);
  // const sx = cx + (outerRadius + 10) * cos;
  // const sy = cy + (outerRadius + 10) * sin;
  // const mx = cx + (outerRadius + 30) * cos;
  // const my = cy + (outerRadius + 30) * sin;
  // const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  // const ey = my;
  // const textAnchor = cos >= 0 ? "start" : "end";

  return (
    <g>
      <text
        x={cx}
        y={cy - 10}
        dy={8}
        textAnchor="middle"
        fill={COLORS.text}
        fontSize={22}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
      <text
        x={cx}
        y={cy + 18}
        textAnchor="middle"
        fill={COLORS.text}
        fontSize={14}
        fontWeight="500"
      >
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 6}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        stroke="#fff"
        strokeWidth={3}
      />
    </g>
  );
};

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
        name:
          category.name[i18n.language as "he" | "en" | "ar"] ||
          category.name.en ||
          category.name.he,
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
          call.Department?.name[i18n.language as "he" | "en" | "ar"] ||
          call.Department?.name.en ||
          call.Department?.name.he ||
          "Unknown";

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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-800">
              {t("sla_compliance")}
            </CardTitle>
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
                  outerRadius={90}
                  innerRadius={60}
                  labelLine={false}
                  activeIndex={0}
                  activeShape={renderActiveShape}
                  animationDuration={1500}
                  isAnimationActive={true}
                >
                  {/* @ts-ignore */}
                  {calculateSLAMetrics().map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={chartColors[index % chartColors.length]}
                      stroke="white"
                      strokeWidth={2}
                      cursor="pointer"
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value) => (
                    <span className="text-sm text-gray-600">{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-800">
              {t("call_volumes")}
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={calculateCallVolumes()}
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  height={60}
                  tick={{ fill: COLORS.text, fontSize: 12 }}
                />
                <YAxis tick={{ fill: COLORS.text, fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="calls"
                  fill={COLORS.primary}
                  radius={[4, 4, 0, 0]}
                  animationDuration={1500}
                  isAnimationActive={true}
                  onMouseOver={(e: any) =>
                    e.target.setAttribute("fill", COLORS.secondary)
                  }
                  onMouseOut={(e: any) =>
                    e.target.setAttribute("fill", COLORS.primary)
                  }
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-800">
              {t("response_times")}
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={calculateResponseTimes()}
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="department"
                  angle={-45}
                  textAnchor="end"
                  height={60}
                  tick={{ fill: COLORS.text, fontSize: 12 }}
                />
                <YAxis tick={{ fill: COLORS.text, fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="averageTime"
                  fill={COLORS.secondary}
                  radius={[4, 4, 0, 0]}
                  animationDuration={1500}
                  isAnimationActive={true}
                  onMouseOver={(e: any) =>
                    e.target.setAttribute("fill", COLORS.primary)
                  }
                  onMouseOut={(e: any) =>
                    e.target.setAttribute("fill", COLORS.secondary)
                  }
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-800">
              {t("efficiency_metrics")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-700">
                  {t("completion_rate")}
                </h3>
                <p className="text-4xl font-bold text-primary mt-2">
                  {Math.round(
                    (calls.filter((c) => c.status === "COMPLETED").length /
                      calls.length) *
                      100
                  )}
                  <span className="text-2xl text-gray-500">%</span>
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-700">
                  {t("avg_resolution_time")}
                </h3>
                <p className="text-4xl font-bold text-muted-foreground mt-2">
                  {Math.round(
                    calls.reduce((acc, call) => {
                      // @ts-ignore
                      if (call.createdAt && call.closedAt) {
                        return (
                          acc +
                          // @ts-ignore
                          (new Date(call.closedAt).getTime() -
                            new Date(call.createdAt).getTime())
                        );
                      }
                      return acc;
                      // @ts-ignore
                    }, 0) /
                      // @ts-ignore
                      (calls.filter((c) => c.closedAt).length * 60000)
                  )}
                  <span className="text-2xl text-gray-500">
                    {" "}
                    {t("minutes")}
                  </span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
