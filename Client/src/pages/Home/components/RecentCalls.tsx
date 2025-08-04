import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Clock,
  User,
  MapPin,
  ArrowRight,
  Ghost,
  AlertTriangle,
  Phone,
} from "lucide-react";
import { format } from "date-fns";
import { Call, CallStatus } from "@/types/api/calls";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export default function RecentCalls({ calls }: { calls: Call[] }) {
  const { i18n, t } = useTranslation();
  const navigate = useNavigate();

  const getStatusColor = (status: CallStatus) => {
    switch (status) {
      case "OPENED":
        return "bg-red-100 text-red-700";
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-700";
      case "COMPLETED":
        return "bg-green-100 text-green-700";
      case "ON_HOLD":
        return "bg-slate-100 text-slate-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <Card className="bg-surface/90 backdrop-blur-sm shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="flex items-center gap-4 text-lg">
          {t("recent_calls")}
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={() => navigate("/calls")}>
          {t("view_all")}
          <ArrowRight className="w-4 h-4 ml-1 rtl:rotate-180" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {calls.map((call) => (
          <div
            key={call.id}
            className="p-1 px-2 border-b last:border-none hover:cursor-pointer pb-3"
            onClick={() => navigate(`/calls/${call.id}`)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="size-12 bg-border flex items-center justify-center rounded-full">
                  <Phone size={20} className="text-primary" />
                </div>
                <div className="min-w-[125px]">
                  <h4 className="font-medium mb-1">
                    {
                      call.callCategory.name[
                        i18n.language as keyof typeof call.callCategory.name
                      ]
                    }
                  </h4>

                  <p className="text-sm text-muted-foreground">
                    {format(new Date(call.createdAt), "MMM d, h:mm a")}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex gap-3">
                  <p className="px-2 py-px rounded-md bg-background text-foreground text-sm">
                    {
                      call.Department.name[
                        i18n.language as keyof typeof call.Department.name
                      ]
                    }
                  </p>
                  <p
                    style={{ backgroundColor: call.location.area.color }}
                    className="px-2 py-px rounded-md bg-background text-foreground text-sm"
                  >
                    {
                      call.location.name[
                        i18n.language as keyof typeof call.location.name
                      ]
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}

        {calls.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Ghost className="w-8 h-8 mx-auto mb-2" />
            <p className="text-sm">{t("no_results_title")}</p>
            <p className="text-sm">{t("no_results_calls")}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
  // return (
  //   <Card className="bg-surface/90 backdrop-blur-sm shadow-lg">
  //     <CardHeader className="flex flex-row items-center justify-between pb-4">
  //       <CardTitle className="flex items-center gap-4 text-lg">
  //         <AlertTriangle className="w-5 h-5 text-orange-500" />
  //         {t("recent_calls")}
  //       </CardTitle>
  //       <Button
  //         variant="outline"
  //         size="sm"
  //         className="text-slate-600 hover:text-slate-900"
  //         onClick={() => navigate("/calls")}
  //       >
  //         {t("view_all")}
  //         <ArrowRight className="w-4 h-4 ml-1 rtl:rotate-180" />
  //       </Button>
  //     </CardHeader>
  //     <CardContent className="space-y-3">
  //       {calls.map((call) => (
  //         <div
  //           key={call.id}
  //           className="bg-background/30 rounded-lg p-4 border hover:shadow-sm transition-all duration-200"
  //         >
  //           <div className="flex items-start justify-between mb-3">
  //             <div className="flex-1">
  //               <h4 className="font-semibold text-sm mb-1">
  //                 {
  //                   call.callCategory.name[
  //                     i18n.language as keyof typeof call.callCategory.name
  //                   ]
  //                 }
  //               </h4>
  //               <div className="flex items-center gap-2 text-xs text-muted-foreground">
  //                 <MapPin className="w-3 h-3" />
  //                 <span>
  //                   {
  //                     call.location.name[
  //                       i18n.language as keyof typeof call.location.name
  //                     ]
  //                   }
  //                 </span>
  //                 <span>•</span>
  //                 <User className="w-3 h-3" />
  //                 <span>
  //                   {
  //                     call.Department.name[
  //                       i18n.language as keyof typeof call.Department.name
  //                     ]
  //                   }
  //                 </span>
  //               </div>
  //             </div>
  //             <div className="flex flex-col items-end gap-1">
  //               <Badge
  //                 variant="secondary"
  //                 className={`text-xs ${getStatusColor(
  //                   call.status as CallStatus
  //                 )}`}
  //               >
  //                 {call.status
  //                   ? t(call.status.toLowerCase())
  //                   : t("unknown_status")}
  //               </Badge>
  //             </div>
  //           </div>

  //           <div className="flex items-center justify-between">
  //             <div className="flex items-center gap-1 text-xs text-muted-foreground">
  //               <Clock className="w-3 h-3" />
  //               <span>{format(new Date(call.createdAt), "MMM d, h:mm a")}</span>
  //             </div>
  //             <Button
  //               variant="ghost"
  //               size="sm"
  //               className="text-blue-600 hover:text-blue-700 text-xs px-2 py-1"
  //               onClick={() => navigate(`/calls/${call.id}`)}
  //             >
  //               {t("details")}
  //             </Button>
  //           </div>
  //         </div>
  //       ))}

  //       {calls.length === 0 && (
  //         <div className="text-center py-8 text-muted-foreground">
  //           <Ghost className="w-8 h-8 mx-auto mb-2" />
  //           <p className="text-sm">{t("no_results_title")}</p>
  //           <p className="text-sm">{t("no_results_calls")}</p>
  //         </div>
  //       )}
  //     </CardContent>
  //   </Card>
  // );
}
