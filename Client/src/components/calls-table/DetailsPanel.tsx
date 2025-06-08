import { Clock, MapPin, Circle, User, Clipboard, Users } from "lucide-react";
import { CleanTimer } from "./ExpectedTimer";
import { StatusBadge } from "./StatusBadge";
import { Call } from "@/types/api/calls";
import { useRTL } from "@/hooks/useRtl";
import { useTranslation } from "react-i18next";
interface DetailsPanelProps {
  call: Call; // Replace with actual type
}

export function DetailsPanel({ call }: DetailsPanelProps) {
  const { t } = useTranslation();
  const { getNameByLanguage, textAlign, flexDirection, formatDate } = useRTL();

  return (
    <div
      className={`flex-1 p-6 ${
        flexDirection.includes("reverse") ? "lg:border-l" : "lg:border-r"
      } border-slate-200/60`}
    >
      <div className="space-y-4">
        <div>
          <h1 className="font-bold text-slate-800 text-xl">
            {getNameByLanguage(call.callCategory.name)}
          </h1>
          {call.description && (
            <p className="text-gray-600 text-sm mt-1">{call.description}</p>
          )}
        </div>

        {/* @ts-ignore */}
        {call.callCategory?.expectedTime && (
          <div className="w-full">
            <div className="flex flex-col gap-2 items-start">
              <div className="flex gap-2 items-center  justify-center w-full">
                <CleanTimer
                  // @ts-ignore
                  expectedTime={call.callCategory.expectedTime}
                  // @ts-ignore
                  createdAt={call.createdAt}
                  // @ts-ignore
                  closedAt={call.closedAt}
                  status={call.status}
                />
              </div>
              {/* <CallTimelineDisplay
                call={call}
                callStatusHistory={call.CallStatusHistory || []}
                closedAt={call.closedAt}
                expectedTime={call.callCategory.expectedTime}
                createdAt={call.createdAt}
              /> */}
            </div>
          </div>
        )}

        <div className="h-20 w-full flex gap-2">
          <div className="w-full h-fit flex gap-4 flex-col">
            <InfoRow
              label={t("fields.createdAt")}
              icon={<Clock size={16} />}
              // @ts-ignore
              value={formatDate(call.createdAt)}
              {...{ textAlign, flexDirection }}
            />
            <InfoRow
              label={t("reports.fields.created_by")}
              icon={<User size={16} />}
              value={call.createdBy.name || t("no_user")}
              {...{ textAlign, flexDirection }}
            />
            <InfoRow
              label={t("reports.fields.status")}
              icon={<Circle size={16} />}
              // @ts-ignore
              value={<StatusBadge status={call.status} t={t} />}
              {...{ textAlign, flexDirection }}
            />
          </div>

          <div className="w-full h-fit flex gap-4 flex-col">
            <InfoRow
              label={t("location")}
              icon={<MapPin size={16} />}
              value={getNameByLanguage(call.location.name) || t("no_location")}
              bgColor={call.location?.area?.color}
              {...{ textAlign, flexDirection }}
            />
            <InfoRow
              label={t("departments")}
              icon={<Clipboard size={16} />}
              value={
                getNameByLanguage(call.Department.name) || t("no_department")
              }
              {...{ textAlign, flexDirection }}
            />
            <InfoRow
              label={t("assigned_to")}
              icon={<Users size={16} />}
              value={call?.assignedTo?.name || t("no_user")}
              {...{ textAlign, flexDirection }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

interface InfoRowProps {
  label: string;
  icon: React.ReactNode;
  value: string;
  textAlign: string;
  flexDirection: string;
  bgColor?: string;
}

function InfoRow({
  label,
  icon,
  value,
  textAlign,
  flexDirection,
  bgColor,
}: InfoRowProps) {
  return (
    <div className="flex gap-2 items-center text-gray-400 h-6">
      <div
        className={`flex text-base gap-2 items-center justify-end w-32 font-normal ${flexDirection}`}
      >
        {label} {icon}
      </div>
      <p
        className={`text-base text-primary font-normal px-3 py-0.5 rounded-full ${textAlign}`}
        style={{ backgroundColor: bgColor || "transparent" }}
      >
        {value}
      </p>
    </div>
  );
}
