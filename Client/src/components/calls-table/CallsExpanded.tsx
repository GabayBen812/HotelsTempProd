import { Call } from "@/types/api/calls";
import { DetailsPanel } from "./DetailsPanel";
import { ChatPanel } from "./ChatPanel";

export default function CallsExpanded({ call }: { call: Call }) {
  const isRTL = false;

  return (
    <div className="bg-gradient-to-br from-slate-50 via-surface to-slate-50 border border-slate-200/60 rounded-xl overflow-hidden">
      <div
        className={`flex flex-col lg:flex-row ${
          isRTL ? "lg:flex-row-reverse" : ""
        }`}
      >
        <DetailsPanel call={call} />
        <ChatPanel call={call} />
      </div>
    </div>
  );
}
