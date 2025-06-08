import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Hotel,
  PhoneCall,
  Clock,
  AlertCircle,
  ArrowRight,
  Ghost,
  Timer,
} from "lucide-react";
import { createApiService } from "@/api/utils/apiFactory";
import { Call } from "@/types/api/calls";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import i18n from "@/i18n";

const callsApi = createApiService<Call>("/calls", { includeOrgId: true });
const usersApi = createApiService("/users", { includeOrgId: true });

export default function Home() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [activeCalls, setActiveCalls] = useState<number>(0);
  const [recentCalls, setRecentCalls] = useState<Call[]>([]);
  const [urgentCalls, setUrgentCalls] = useState<number>(0);
  const [employeesCount, setEmployeesCount] = useState<number>(0);
  const [employees, setEmployees] = useState<any[]>([]);
  const [avgResponseTime, setAvgResponseTime] = useState<number>(0);
  const [slaComplianceRate, setSlaComplianceRate] = useState<number>(0);

  const formatResponseTime = (mins: number) => {
    if (mins >= 1440) {
      const days = Math.floor(mins / 1440);
      return `${days} ${t(days === 1 ? "day" : "days")}`;
    }
    if (mins >= 60) {
      const hours = Math.floor(mins / 60);
      const remaining = mins % 60;
      return remaining
        ? `${hours} ${t(hours === 1 ? "hour" : "hours")} ${remaining} ${t(
            "minutes"
          )}`
        : `${hours} ${t(hours === 1 ? "hour" : "hours")}`;
    }
    return `${mins} ${t(mins === 1 ? "minute" : "minutes")}`;
  };

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await usersApi.fetchAll({});
        // @ts-ignore
        const employeesData = response.data?.data || [];
        setEmployees(employeesData);
        setEmployeesCount(employeesData.length);
      } catch (err) {
        console.error("Error fetching employees", err);
      }
    };
    fetchEmployees();
  }, []);

  useEffect(() => {
    const fetchCalls = async () => {
      try {
        const response = await callsApi.fetchAll({});
        // @ts-ignore
        const calls = response.data?.data || [];

        console.log("API Response:", response);
        console.log("Calls data:", calls);

        if (calls.length > 0) {
          // Active calls (OPENED or IN_PROGRESS)
          const active = calls.filter(
            // @ts-ignore
            (c) => c.status === "OPENED" || c.status === "IN_PROGRESS"
          );
          console.log("Active calls:", active);
          setActiveCalls(active.length);

          // Urgent calls (those exceeding their expected time)
          // @ts-ignore
          const urgent = active.filter((call) => {
            if (!call.callCategory?.expectedTime) return false;
            const createdAt = new Date(call.createdAt).getTime();
            const now = new Date().getTime();
            const timeElapsed = (now - createdAt) / (1000 * 60); // in minutes
            return timeElapsed > call.callCategory.expectedTime;
          });
          setUrgentCalls(urgent.length);

          // Calculate average response time for completed calls
          const completedCalls = calls.filter(
            // @ts-ignore
            (c) => c.status === "COMPLETED" && c.createdAt && c.closedAt
          );
          if (completedCalls.length > 0) {
            // @ts-ignore
            const totalResponseTime = completedCalls.reduce((sum, call) => {
              const start = new Date(call.createdAt).getTime();
              const end = new Date(call.closedAt!).getTime();
              return sum + (end - start);
            }, 0);
            setAvgResponseTime(
              Math.round(totalResponseTime / (completedCalls.length * 60000))
            );
          }

          // Calculate SLA compliance rate
          const callsWithCategory = calls.filter(
            // @ts-ignore
            (call) => call.callCategory?.expectedTime
          );
          if (callsWithCategory.length > 0) {
            // @ts-ignore
            const compliantCalls = callsWithCategory.filter((call) => {
              if (call.status !== "COMPLETED" || !call.closedAt) return false;
              const responseTime =
                (new Date(call.closedAt).getTime() -
                  new Date(call.createdAt).getTime()) /
                (1000 * 60);
              return responseTime <= call.callCategory!.expectedTime;
            });
            setSlaComplianceRate(
              Math.round(
                (compliantCalls.length / callsWithCategory.length) * 100
              )
            );
          }

          // Set recent calls
          setRecentCalls(calls.slice(0, 3));
        }
      } catch (err) {
        console.error("Error fetching calls", err);
      }
    };
    fetchCalls();
  }, []);

  const getStatusColor = (status?: Call["status"]) => {
    switch (status) {
      case "OPENED":
        return "bg-green-500";
      case "IN_PROGRESS":
        return "bg-yellow-400";
      case "COMPLETED":
        return "bg-gray-400";
      case "FAILED":
        return "bg-red-500";
      case "ON_HOLD":
        return "bg-orange-500";
      default:
        return "bg-muted-foreground";
    }
  };

  return (
    <div className="mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary">{t("welcome_back")}</h1>
        <div
          className="h-1 w-20 rounded-full mt-1"
          style={{ backgroundColor: "var(--accent)" }}
        />
        <p className="text-muted-foreground">{t("dashboard_summary")}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <Card
          onClick={() => navigate("/calls")}
          className="border-[var(--accent)] shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-200 cursor-pointer"
        >
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t("active_calls")}
              </CardTitle>
              <PhoneCall className="h-5 w-5 text-[var(--accent)]" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCalls}</div>
            <p className="text-xs text-muted-foreground">
              {t("needs_attention")}
            </p>
          </CardContent>
        </Card>

        <Card
          onClick={() => navigate("/calls")}
          className="border-[var(--accent)] shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-200 cursor-pointer"
        >
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t("urgent_calls")}
              </CardTitle>
              <AlertCircle className="h-5 w-5 text-red-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${
                urgentCalls > 0 ? "text-red-500" : "text-green-600"
              }`}
            >
              {urgentCalls}
            </div>
            <p className="text-xs text-muted-foreground">
              {t("exceeding_sla")}
            </p>
          </CardContent>
        </Card>

        <Card className="border-[var(--accent)] shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-200 cursor-pointer">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t("avg_response_time")}
              </CardTitle>
              <Clock className="h-5 w-5 text-[var(--accent)]" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatResponseTime(avgResponseTime)}
            </div>
            <p className="text-xs text-muted-foreground">
              {t("resolution_time")}
            </p>
          </CardContent>
        </Card>

        <Card className="border-[var(--accent)] shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-200 cursor-pointer">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t("sla_compliance")}
              </CardTitle>
              <Timer className="h-5 w-5 text-[var(--accent)]" />
            </div>
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${
                slaComplianceRate >= 90
                  ? "text-green-600"
                  : slaComplianceRate >= 75
                  ? "text-yellow-500"
                  : "text-red-500"
              }`}
            >
              {slaComplianceRate}%
            </div>
            <p className="text-xs text-muted-foreground">
              {t("within_expected_time")}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="flex justify-between items-center pb-2">
            <CardTitle>{t("recent_calls")}</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/calls")}
              className="text-[var(--accent)]"
            >
              {t("view_all")} <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentCalls.length > 0 ? (
              recentCalls.map((call) => (
                <div
                  key={call.id}
                  className="p-3 border rounded-md hover:bg-muted/50 transition"
                >
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="font-semibold text-sm">
                      {
                        call.callCategory.name[
                          i18n.language as keyof typeof call.callCategory.name
                        ]
                      }
                    </h4>
                    <Badge className={getStatusColor(call.status)}>
                      {call.status
                        ? t(call.status.toLowerCase())
                        : t("unknown_status")}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                    {call.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">
                      {new Date(call.createdAt).toLocaleDateString("he-IL")}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/calls/${call.id}`)}
                    >
                      {t("details")}
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground gap-3">
                <Ghost className="w-10 h-10 text-secondary" />
                <p className="font-medium">{t("no_results_title")}</p>
                <p className="text-sm">{t("no_results_calls")}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex justify-between items-center pb-2">
            <CardTitle>{t("recent_employees")}</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/employees")}
              className="text-[var(--accent)]"
            >
              {t("view_all")} <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {employees.length > 0 ? (
              employees.slice(0, 3).map((emp) => (
                <div
                  key={emp.id}
                  className="p-3 border rounded-md hover:bg-muted/50 transition flex items-center gap-3"
                >
                  <Avatar className="h-8 w-8">
                    {emp.avatarUrl ? (
                      <AvatarImage src={emp.avatarUrl} />
                    ) : (
                      <AvatarFallback>
                        <Hotel className="h-4 w-4" />
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{emp.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {t("new_employee")}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/employees/${emp.id}`)}
                  >
                    {t("details")}
                  </Button>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground gap-3">
                <Ghost className="w-10 h-10 text-secondary" />
                <p className="font-medium">{t("no_results_title")}</p>
                <p className="text-sm">{t("no_results_employees")}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
