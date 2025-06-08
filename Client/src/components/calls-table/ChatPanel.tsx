import { CallChat } from "./CallChat/CallChat";
import { Call } from "@/types/api/calls";

export function ChatPanel({ call }: { call: Call }) {
  return (
    <div className="flex-1 flex flex-col min-h-[500px]">
      <div className="flex-1 p-6">
        <CallChat
          callId={Number(call.id)}
          callStatusHistory={call.CallStatusHistory || []}
        />
      </div>
    </div>
  );
}
