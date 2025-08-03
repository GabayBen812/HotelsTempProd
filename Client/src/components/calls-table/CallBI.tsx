import { Clock, Pin, Target } from "lucide-react";

export default function CallBI({
  startedAt,
  assignedTo,
  timeLeft,
}: {
  startedAt: Date;
  assignedTo: { name: string; profilePicture: string; assignedAt: Date };
  timeLeft: number;
}) {
  return (
    <div className="flex gap-3">
      {/* StartedAt */}
      <div className="bg-[#ECFCFF] p-4 rounded-lg border border-[#DBEAFE] w-full">
        <h1 className="font-medium text-[#3C4792] mb-3 flex items-center gap-2">
          <Clock size={16} color="#2563EB" />
          התחיל בתאריך
        </h1>
        <p className="text-[#2563EB]">
          {new Date(startedAt).toLocaleString("he-IL", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
      {/* AssignedTo */}
      <div className="bg-[#FFF7ED] p-4 rounded-lg border border-[#FEF3C7] w-full">
        <h1 className="font-medium text-[#7F3F1A] mb-3 flex items-center gap-2">
          <Pin size={16} color="#DB7D11" />
          שויך ל{assignedTo.name}
        </h1>
        <p className="text-[#DB7D11]">
          {new Date(assignedTo.assignedAt).toLocaleString("he-IL", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
      {/* StartedAt */}
      <div className="bg-[#EFFDF4] p-4 rounded-lg border border-[#D1FAE5] w-full">
        <h1 className="font-medium text-[#266655] mb-3 flex items-center gap-2">
          <Target size={16} color="#1CA177" />
          {timeLeft > 0 ? "עומד בזמנים" : "מאחר"}
        </h1>
        <p className="text-[#1CA177]">
          {timeLeft} דקות {timeLeft > 0 ? "לסיום" : "איחור"}
        </p>
      </div>
    </div>
  );
}
