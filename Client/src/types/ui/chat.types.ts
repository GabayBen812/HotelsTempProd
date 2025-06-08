// CallChat/types/index.ts
import { CallStatusHistory } from "@/types/api/calls";
import { User } from "../api/user";

export interface Message {
  id: number;
  content: string;
  createdAt: string;
  user: User;
}

export interface MessageWithType extends Message {
  type: "message";
}

export interface StatusWithType extends CallStatusHistory {
  type: "status";
}

export type CombinedItem = MessageWithType | StatusWithType;

export interface CallChatProps {
  callId: number;
  callStatusHistory: CallStatusHistory[];
}

// CallChat/types/status.ts

export interface StatusConfig {
  color: string;
  icon: React.ComponentType<any>;
  iconColor: string;
  label: string;
  description: string;
}
