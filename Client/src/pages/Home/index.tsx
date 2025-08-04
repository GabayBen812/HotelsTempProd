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
import { useEffect, useState } from "react";
import StatCard, { StatCardProps } from "./components/StatCard";
import RecentCalls from "./components/RecentCalls";
import CallsHeatmap from "./components/CallsHeatmap";

const callsApi = createApiService<Call>("/calls", { includeOrgId: true });
const usersApi = createApiService("/users", { includeOrgId: true });

export default function Home() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [activeCalls, setActiveCalls] = useState<number>(0);
  const [recentCalls, setRecentCalls] = useState<Call[]>([]);
  const [urgentCalls, setUrgentCalls] = useState<number>(0);
  const [_, setEmployeesCount] = useState<number>(0);
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

  const statCards: StatCardProps[] = [
    {
      icon: PhoneCall,
      title: t("active_calls"),
      value: activeCalls,
      subtitle: t("needs_attention"),
    },

    {
      icon: Clock,
      title: t("avg_response_time"),
      value: formatResponseTime(avgResponseTime),
      subtitle: t("resolution_time"),
    },
    {
      icon: AlertCircle,
      title: t("urgent_calls"),
      value: urgentCalls,
      subtitle: t("exceeding_sla"),
      color: urgentCalls > 0 ? "red" : "green",
    },
    {
      icon: Timer,
      title: t("sla_compliance"),
      value: `${slaComplianceRate}%`,
      subtitle: t("within_expected_time"),
      color:
        slaComplianceRate >= 90
          ? "green"
          : slaComplianceRate >= 75
          ? "orange"
          : "red",
    },
  ];

  return (
    <div className="mx-auto space-y-6">
      <div>
        <h1 className="heading">{t("welcome_back")}</h1>
        <div
          className="h-[3px] w-20 rounded-full mt-1"
          style={{ backgroundColor: "var(--accent)" }}
        />
        <p className="text-lg text-foreground/70">{t("dashboard_summary")}</p>
      </div>

      {/* All stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((card, index) => (
          <StatCard
            key={index}
            icon={card.icon}
            title={card.title}
            value={card.value}
            subtitle={card.subtitle}
            color={card.color}
          />
        ))}
      </div>

      {/* Recent calls section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RecentCalls calls={recentCalls} />
        <CallsHeatmap />
        {/* Recent employees section - need to change */}
        {/* <Card>
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
                <Ghost className="w-10 h-10 text-muted-foreground" />
                <p className="font-medium">{t("no_results_title")}</p>
                <p className="text-sm">{t("no_results_employees")}</p>
              </div>
            )}
          </CardContent>
        </Card> */}
      </div>
    </div>
  );
}
