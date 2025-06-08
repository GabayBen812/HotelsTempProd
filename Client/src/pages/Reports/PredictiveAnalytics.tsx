import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createApiService } from "@/api/utils/apiFactory";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Area,
  AreaChart,
} from "recharts";

interface ForecastData {
  historical: {
    date: string;
    volume: number;
  }[];
  predicted: {
    date: string;
    volume: number;
    lowerBound: number;
    upperBound: number;
  }[];
  patterns: {
    type: string;
    confidence: number;
    description: string;
  }[];
}

const predictiveApi = createApiService<any>("/reports/predictive", { includeOrgId: true });

export default function PredictiveAnalytics() {
  const { t } = useTranslation();
  const [data, setData] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchForecastData = async () => {
      try {
        const { data } = await predictiveApi.customRequest("get", "/forecast");
        setData(data);
      } catch (error) {
        console.error("Error fetching forecast data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchForecastData();
  }, []);

  if (loading) {
    return <div>{t("reports.loading")}</div>;
  }

  if (!data) {
    return <div>{t("reports.no_data")}</div>;
  }

  // Combine historical and predicted data for the chart
  const chartData = [
    ...data.historical.map(item => ({
      date: item.date,
      actual: item.volume,
      predicted: null,
      lowerBound: null,
      upperBound: null,
    })),
    ...data.predicted.map(item => ({
      date: item.date,
      actual: null,
      predicted: item.volume,
      lowerBound: item.lowerBound,
      upperBound: item.upperBound,
    })),
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t("volume_forecast")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="actual"
                  stroke="#8884d8"
                  fill="#8884d8"
                  name={t("actual")}
                />
                <Area
                  type="monotone"
                  dataKey="predicted"
                  stroke="#82ca9d"
                  fill="#82ca9d"
                  name={t("predicted")}
                />
                <Area
                  type="monotone"
                  dataKey="lowerBound"
                  stroke="none"
                  fill="#82ca9d"
                  fillOpacity={0.1}
                  name={t("confidence_interval")}
                />
                <Area
                  type="monotone"
                  dataKey="upperBound"
                  stroke="none"
                  fill="#82ca9d"
                  fillOpacity={0.1}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.patterns.map((pattern, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{t(pattern.type)}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  {pattern.description}
                </p>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">
                    {t("confidence")}:
                  </span>
                  <span className="text-sm">
                    {(pattern.confidence * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 