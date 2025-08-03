import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { createApiService } from "@/api/utils/apiFactory";
import { Call } from "@/types/api/calls";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Clock,
  Calendar,
  MapPin,
  User,
  CheckCircle2,
  AlertCircle,
  Timer,
  MessageSquare,
  Building2,
} from "lucide-react";
import i18n from "@/i18n";
import { CallChat } from "@/components/calls-table/CallChat/CallChat";
import CallProgress from "./CallProgress";

const callsApi = createApiService<Call>("/calls", { includeOrgId: true });

export default function CallDetails() {
  const { id } = useParams();
  const { t } = useTranslation();
  const [call, setCall] = useState<Call | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCall = async () => {
      try {
        if (!id) return;
        const response = await callsApi.fetchById(id);

        let callData: Call | null = null;

        // Handle MutationResponse
        if ("status" in response && response.data) {
          callData = Array.isArray(response.data)
            ? response.data[0]
            : response.data;
        }
        // Handle ApiResponse
        else if (
          "data" in response &&
          Array.isArray(response.data) &&
          response.data.length > 0
        ) {
          // @ts-ignore
          callData = response.data[0];
        }

        if (callData) {
          setCall(callData);
        } else {
          console.error("Error fetching call: Invalid response", response);
        }
      } catch (error) {
        console.error("Error fetching call:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCall();
  }, [id]);

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

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString(i18n.language, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const calculateTimeElapsed = (startDate: string, endDate?: string) => {
    const start = new Date(startDate).getTime();
    const end = endDate ? new Date(endDate).getTime() : Date.now();
    const diffInMinutes = Math.round((end - start) / (1000 * 60));

    if (diffInMinutes >= 1440) {
      const days = Math.floor(diffInMinutes / 1440);
      return `${days} ${t(days === 1 ? "day" : "days")}`;
    }
    if (diffInMinutes >= 60) {
      const hours = Math.floor(diffInMinutes / 60);
      const remaining = diffInMinutes % 60;
      return remaining
        ? `${hours} ${t(hours === 1 ? "hour" : "hours")} ${remaining} ${t(
            "minutes"
          )}`
        : `${hours} ${t(hours === 1 ? "hour" : "hours")}`;
    }
    return `${diffInMinutes} ${t(diffInMinutes === 1 ? "minute" : "minutes")}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!call) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <h2 className="text-xl font-semibold">{t("call_not_found")}</h2>
      </div>
    );
  }

  const isOverdue =
    // @ts-ignore
    call.callCategory?.expectedTime &&
    // @ts-ignore
    (new Date().getTime() - new Date(call.createdAt).getTime()) / (1000 * 60) >
      // @ts-ignore
      call.callCategory.expectedTime;

  return (
    <div className="container mx-auto py-6 space-y-6 bg-black">
      {/* Header Section */}

      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            {
              call.callCategory?.name[
                i18n.language as keyof typeof call.callCategory.name
              ]
            }
            <Badge className={getStatusColor(call.status)}>
              {t(call.status?.toLowerCase() || "unknown_status")}
            </Badge>
          </h1>
          <p className="text-muted-foreground mt-2">{call.description}</p>
        </div>
        {call.status !== "COMPLETED" && (
          <Button variant="default" className="gap-2">
            <CheckCircle2 className="h-4 w-4" />
            {t("close_call")}
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info Section */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("call_details")}</CardTitle>
              <CardDescription>{t("call_information")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Created Info */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {t("created_at")}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      {/* @ts-ignore */}
                      <AvatarImage src={call.createdById || ""} />
                      <AvatarFallback>{call.createdById}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{call.createdById}</p>
                      <p className="text-sm text-muted-foreground">
                        {/* @ts-ignore */}
                        {formatDate(call.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Location Info */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {t("location")}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Building2 className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">
                        {
                          call.location?.name[
                            i18n.language as keyof typeof call.location.name
                          ]
                        }
                      </p>
                      {call.location?.roomNumber && (
                        <p className="text-sm text-muted-foreground">
                          {t("room")} {call.location.roomNumber}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Department Info */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {t("department")}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Building2 className="h-4 w-4 text-primary" />
                    </div>
                    <p className="font-medium">
                      {
                        call.Department?.name[
                          i18n.language as keyof typeof call.Department.name
                        ]
                      }
                    </p>
                  </div>
                </div>

                {/* Time Info */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {t("time_elapsed")}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Timer className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p
                        className={`font-medium ${
                          isOverdue ? "text-destructive" : ""
                        }`}
                      >
                        {calculateTimeElapsed(
                          // @ts-ignore
                          call.createdAt,
                          // @ts-ignore
                          call.closedAt || ""
                        )}
                      </p>
                      {/* @ts-ignore */}
                      {call.callCategory?.expectedTime && (
                        <p className="text-sm text-muted-foreground">
                          {/* @ts-ignore */}
                          {t("expected")}: {call.callCategory.expectedTime}{" "}
                          {t("minutes")}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Assignment Info */}
              {call.assignedToId && (
                <>
                  <Separator />
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {t("assigned_to")}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        {/* @ts-ignore */}
                        <AvatarImage src={call.assignedToId || ""} />
                        <AvatarFallback>{call.assignedToId}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{call.assignedToId}</p>
                        <p className="text-sm text-muted-foreground">
                          {call.assignedToId}
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Chat Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                {t("chat")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* @ts-ignore */}
              <CallChat callId={Number(id)} />
            </CardContent>
          </Card>
        </div>

        {/* Timeline Section */}
        <Card>
          <CardHeader>
            <CardTitle>{t("timeline")}</CardTitle>
            <CardDescription>{t("call_timeline")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Created */}
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                    <Calendar className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <div className="flex-1 w-[2px] bg-border mt-2" />
                </div>
                <div>
                  <p className="font-medium">{t("call_created")}</p>
                  <p className="text-sm text-muted-foreground">
                    {t("by")} {call.createdById}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {/* @ts-ignore */}
                    {formatDate(call.createdAt)}
                  </p>
                </div>
              </div>

              {/* Assignment */}
              {call.assignedToId && (
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                      <User className="h-4 w-4 text-primary-foreground" />
                    </div>
                    <div className="flex-1 w-[2px] bg-border mt-2" />
                  </div>
                  <div>
                    <p className="font-medium">{t("call_assigned")}</p>
                    <p className="text-sm text-muted-foreground">
                      {t("to")} {call.assignedToId}
                    </p>
                  </div>
                </div>
              )}

              {/* Completion */}
              {/* @ts-ignore */}
              {call.closedAt && call.closedById && (
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                      <CheckCircle2 className="h-4 w-4 text-primary-foreground" />
                    </div>
                  </div>
                  <div>
                    <p className="font-medium">{t("call_closed")}</p>
                    <p className="text-sm text-muted-foreground">
                      {t("by")} {call.closedById}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {/* @ts-ignore */}
                      {formatDate(call.closedAt)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
