import { Clock, MapPin, User, Clipboard, UserCheck, Flag } from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import { Call } from "@/types/api/calls";
import { useRTL } from "@/hooks/useRtl";
import { useTranslation } from "react-i18next";
import CallProgress from "@/pages/Calls/CallProgress";
import CallBI from "./CallBI";
interface DetailsPanelProps {
  call: Call; // Replace with actual type
}

export function DetailsPanel({ call }: DetailsPanelProps) {
  const { t } = useTranslation();
  const { getNameByLanguage, textAlign, flexDirection, formatDate } = useRTL();

  const sampleData = {
    startedAt: Date.now() - 3 * 60 * 60 * 1000, // 3 hours ago
    completeEstimation: 300, // 5 hours
    assignedTo: {
      name: "John Doe",
      profilePicture:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face&auto=format",
      timestamp: Date.now() - 2 * 60 * 60 * 1000, // 2 hours ago (after startedAt)
    },
    events: [
      {
        timestamp: Date.now() - 1.5 * 60 * 60 * 1000, // 1.5 hours ago
        description: "Changed status to 'In Progress'",
      },
      {
        timestamp: Date.now() - 1 * 60 * 60 * 1000, // 1 hour ago
        description: "Added code review comments",
      },
      {
        timestamp: Date.now() - 30 * 60 * 1000, // 30 minutes ago
        description: "Resolved merge conflicts",
      },
    ],
  };

  return (
    <div
      className={`flex-1 p-6 ${
        flexDirection.includes("reverse") ? "lg:border-l" : "lg:border-r"
      } border-slate-200/60`}
    >
      <div className="flex flex-col gap-7">
        <div>
          <h1 className="font-semibold text-primary text-xl">
            {getNameByLanguage(call.callCategory.name)}
          </h1>
        </div>
        <CallProgress {...sampleData} />
        <CallBI
          startedAt={new Date(sampleData.startedAt)}
          assignedTo={{
            name: sampleData.assignedTo.name,
            profilePicture: sampleData.assignedTo.profilePicture,
            assignedAt: new Date(sampleData.assignedTo.timestamp),
          }}
          timeLeft={8}
        />

        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-7 mt-7">
          <InfoRow
            label={t("fields.createdAt")}
            icon={<Clock />}
            // @ts-ignore
            value={formatDate(call.createdAt)}
            {...{ textAlign }}
          />
          <InfoRow
            label={t("reports.fields.created_by")}
            icon={<User />}
            value={call?.createdBy?.name || t("guest")}
            {...{ textAlign }}
          />
          <InfoRow
            label={t("departments")}
            icon={<Clipboard />}
            value={
              <p className="bg-background px-2 py-px rounded-md">
                {getNameByLanguage(call.Department.name) || t("no_department")}
              </p>
            }
            {...{ textAlign }}
          />
          <InfoRow
            label={t("reports.fields.status")}
            icon={<Flag />}
            // @ts-ignore
            value={<StatusBadge status={call.status} t={t} />}
            {...{ textAlign }}
          />
          <InfoRow
            label={t("assigned_to")}
            icon={<UserCheck />}
            value={call?.assignedTo?.name || t("no_user")}
            {...{ textAlign }}
          />
          <InfoRow
            label={t("location")}
            icon={<MapPin />}
            value={
              <p
                style={{ backgroundColor: call.location?.area?.color }}
                className="px-2 py-px rounded-md"
              >
                {getNameByLanguage(call.location.name) || t("no_location")}
              </p>
            }
            {...{ textAlign }}
          />
        </div>
      </div>
    </div>
  );
}

interface InfoRowProps {
  label: string;
  icon: React.ReactNode;
  value: string | React.ReactNode;
  textAlign: string;
}

function InfoRow({ label, icon, value, textAlign }: InfoRowProps) {
  return (
    <div className={`flex gap-4 min-w-[200px]`}>
      <div className="bg-background border rounded-lg size-12 flex items-center justify-center child:size-5 child:text-muted-foreground">
        {icon}
      </div>
      <div className="h-full flex flex-col justify-between">
        <h4 className={`text-sm text-muted-foreground ${textAlign}`}>
          {label}
        </h4>
        <p className={`${textAlign}`}>{value}</p>
      </div>
    </div>
  );
}
