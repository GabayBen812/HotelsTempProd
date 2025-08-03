import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

export type StatCardProps = {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ComponentType<{ className?: string }>;
  trend?: "up" | "down";
  trendValue?: string;
  color?: "blue" | "green" | "purple" | "orange" | "red";
};

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendValue,
  color = "blue",
}: StatCardProps) {
  const colorClasses = {
    blue: "from-blue-500 to-blue-600 text-blue-600",
    green: "from-emerald-500 to-emerald-600 text-emerald-600",
    purple: "from-purple-500 to-purple-600 text-purple-600",
    orange: "from-orange-500 to-orange-600 text-orange-600",
    red: "from-red-500 to-red-600 text-red-600",
  };

  return (
    <Card className="bg-surface/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium mb-1">{title}</p>
            <p className="text-3xl font-bold mb-1">{value}</p>
            {trend && (
              <div className="flex items-center gap-2 my-2">
                {trend === "up" ? (
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500" />
                )}
                <span
                  className={`text-sm font-medium ${
                    trend === "up" ? "text-emerald-600" : "text-red-600"
                  }`}
                >
                  {trendValue}
                </span>
              </div>
            )}
            {subtitle && (
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            )}
          </div>
          <div
            className={`w-12 h-12 bg-gradient-to-br ${
              colorClasses[color].split(" ")[0]
            } ${
              colorClasses[color].split(" ")[1]
            } rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-200`}
          >
            <Icon className="w-6 h-6 text-surface" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
