import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { fetchCalls } from "@/api/calls"; // Adjust path if needed

// Modern color palette (same as GeneralData)
const COLORS = {
  primary: "#2563eb",
  secondary: "#7c3aed",
  success: "#059669",
  warning: "#d97706",
  danger: "#dc2626",
  background: "#f8fafc",
  text: "#1e293b",
};

// Custom tooltip (same as GeneralData)
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-surface p-3 rounded-lg shadow-lg border border-gray-200">
        <p className="font-medium text-gray-900">{label}</p>
        <p className="text-sm text-gray-600">
          {payload[0].name || payload[0].payload.hour}: {payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function getDayName(dateString: string) {
  const date = new Date(dateString);
  return daysOfWeek[date.getDay()];
}

function getHour(dateString: string) {
  const date = new Date(dateString);
  return `${date.getHours().toString().padStart(2, "0")}:00`;
}

export default function ByDayReport() {
  const [selectedDay, setSelectedDay] = useState("Sunday");
  const [dataByDay, setDataByDay] = useState({});
  const { t } = useTranslation();

  useEffect(() => {
    const getData = async () => {
      const response = await fetchCalls();
      // @ts-ignore
      const calls = response.data.data || [];
      const grouped = {};
      // @ts-ignore
      daysOfWeek.forEach((day) => (grouped[day] = {}));
      calls.forEach((call: any) => {
        const day = getDayName(call.createdAt);
        const hour = getHour(call.createdAt);
        // @ts-ignore
        if (!grouped[day][hour]) grouped[day][hour] = 0;
        // @ts-ignore
        grouped[day][hour]++;
      });
      // Convert to chart format
      const chartData = {};
      Object.keys(grouped).forEach((day) => {
        // @ts-ignore
        chartData[day] = Object.entries(grouped[day]).map(([hour, calls]) => ({
          hour,
          calls,
        }));
      });
      setDataByDay(chartData);
    };
    getData();
  }, []);

  const handlePrevDay = () => {
    const idx = daysOfWeek.indexOf(selectedDay);
    setSelectedDay(
      daysOfWeek[(idx - 1 + daysOfWeek.length) % daysOfWeek.length]
    );
  };
  const handleNextDay = () => {
    const idx = daysOfWeek.indexOf(selectedDay);
    setSelectedDay(daysOfWeek[(idx + 1) % daysOfWeek.length]);
  };

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-bold text-gray-800">
          {t("calls_by_hour")} - {t(`week_days.${selectedDay}`)}
        </CardTitle>
        <div className="flex items-center gap-2">
          <button
            className="px-2 py-1 rounded bg-gray-200 hover:bg-gray-300"
            onClick={handlePrevDay}
            aria-label={t("previous_day") || "Previous Day"}
          >
            &#8592;
          </button>
          <select
            className="px-2 py-1 rounded border border-gray-300"
            value={selectedDay}
            onChange={(e) => setSelectedDay(e.target.value)}
          >
            {daysOfWeek.map((day) => (
              <option key={day} value={day}>
                {t(`week_days.${day}`)}
              </option>
            ))}
          </select>
          <button
            className="px-2 py-1 rounded bg-gray-200 hover:bg-gray-300"
            onClick={handleNextDay}
            aria-label={t("next_day") || "Next Day"}
          >
            &#8594;
          </button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            {/* @ts-ignore */}
            <BarChart
              // @ts-ignore
              data={dataByDay[selectedDay] || []}
              margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="hour"
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
                onMouseOver={(e) =>
                  e &&
                  e.target &&
                  e.target.setAttribute("fill", COLORS.secondary)
                }
                onMouseOut={(e) =>
                  e && e.target && e.target.setAttribute("fill", COLORS.primary)
                }
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
