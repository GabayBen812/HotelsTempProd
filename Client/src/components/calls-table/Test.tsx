import { useMemo, useState, useEffect } from "react";
import {
  Play,
  Pause,
  CheckCircle,
  AlertCircle,
  User,
  Circle,
  X,
  AlertTriangle,
} from "lucide-react";

// Constants
const CALL_STATUSES = {
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
  CANCELLED: "CANCELLED",
  IN_PROGRESS: "IN_PROGRESS",
  ON_HOLD: "ON_HOLD",
  OPENED: "OPENED",
};

const COLORS = {
  blue: {
    bg: "bg-blue-50",
    border: "border-blue-200",
    text: "text-blue-700",
    accent: "bg-blue-400",
  },
  purple: {
    bg: "bg-purple-50",
    border: "border-purple-200",
    text: "text-purple-700",
    accent: "bg-purple-400",
  },
  green: {
    bg: "bg-green-50",
    border: "border-green-200",
    text: "text-green-700",
    accent: "bg-green-400",
  },
  yellow: {
    bg: "bg-yellow-50",
    border: "border-yellow-200",
    text: "text-yellow-700",
    accent: "bg-yellow-400",
  },
  red: {
    bg: "bg-red-50",
    border: "border-red-200",
    text: "text-red-700",
    accent: "bg-red-400",
  },
};

const FINISHED_STATUSES = [
  CALL_STATUSES.COMPLETED,
  CALL_STATUSES.FAILED,
  CALL_STATUSES.CANCELLED,
];

// Utility functions
// @ts-ignore
const formatTime = (seconds) => {
  if (seconds < 60) return `${seconds}s`;

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  if (mins < 60) {
    return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
  }

  const hours = Math.floor(mins / 60);
  const remainingMins = mins % 60;
  return `${hours}h ${remainingMins}m`;
};

// @ts-ignore
const getDurationInSeconds = (from, to) => {
  // @ts-ignore
  return Math.max(0, Math.floor((new Date(to) - new Date(from)) / 1000));
};

// @ts-ignore
const isCallActive = (status) => !FINISHED_STATUSES.includes(status);

// Hooks
// @ts-ignore
const useCurrentTime = (isActive) => {
  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive]);

  return currentTime;
};

// Components
const TimelineStep = ({
  // @ts-ignore
  icon: Icon,
  // @ts-ignore
  label,
  // @ts-ignore
  time,
  // @ts-ignore
  isActive,
  // @ts-ignore
  isCompleted,
  // @ts-ignore
  isCancelled,
  // @ts-ignore
  color,
  // @ts-ignore
  position,
  // @ts-ignore
  totalSteps,
}) => {
  const isFirst = position === 0;
  const isLast = position === totalSteps - 1;

  const getStepStyles = () => {
    if (isCancelled) {
      return "bg-red-500 border-red-500 text-surface shadow-lg shadow-red-200";
    }
    if (isCompleted) {
      return "bg-green-500 border-green-500 text-surface shadow-lg shadow-green-200";
    }
    if (isActive) {
      return `bg-surface ${color.border} ${color.text} shadow-lg animate-pulse`;
    }
    return "bg-gray-100 border-gray-300 text-gray-400";
  };

  const getTextStyles = () => {
    if (isCancelled) return "text-red-700";
    if (isCompleted) return "text-green-700";
    if (isActive) return "text-gray-900";
    return "text-gray-500";
  };

  const getTimeStyles = () => {
    if (isCancelled) return "text-red-600";
    if (isCompleted) return "text-green-600";
    if (isActive) return "text-gray-700";
    return "text-gray-400";
  };

  const connectorColor =
    isCompleted || isCancelled ? "bg-green-400" : "bg-gray-200";

  return (
    <div className="flex flex-col items-center relative flex-1">
      {/* Connector Lines */}
      {!isLast && (
        <div
          className={`absolute left-0 top-6 w-1/2 h-0.5 ${connectorColor}`}
        />
      )}
      {!isFirst && (
        <div
          className={`absolute right-0 top-6 w-1/2 h-0.5 ${connectorColor}`}
        />
      )}

      {/* Step Circle */}
      <div className="z-10 px-1 bg-surface">
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center border-3 transition-all duration-300 z-10 ${getStepStyles()}`}
        >
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {/* Step Info */}
      <div className="mt-3 text-center min-w-0 max-w-24">
        <p className={`text-sm font-semibold truncate ${getTextStyles()}`}>
          {label}
        </p>
        <p className={`text-xs mt-1 ${getTimeStyles()}`}>
          {time !== null ? formatTime(time) : "--"}
        </p>
      </div>
    </div>
  );
};

// @ts-ignore
const StatusBadge = ({ status, isOverExpected }) => {
  if (status === CALL_STATUSES.CANCELLED) {
    return (
      <div className="flex items-center gap-2 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
        <X className="w-4 h-4" />
        Call Cancelled
      </div>
    );
  }

  if (isOverExpected) {
    return (
      <div className="flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">
        <AlertTriangle className="w-4 h-4" />
        Over Expected Time
      </div>
    );
  }

  return null;
};

// Timeline calculation hook
const useTimelineCalculation = (
  // @ts-ignore
  call,
  // @ts-ignore
  callStatusHistory,
  // @ts-ignore
  currentTime,
  // @ts-ignore
  expectedTime,
  // @ts-ignore
  createdAt,
  // @ts-ignore
  closedAt
) => {
  return useMemo(() => {
    if (!call || !callStatusHistory.length) return null;

    const sortedHistory = [...callStatusHistory].sort(
      // @ts-ignore
      (a, b) => new Date(a.changedAt) - new Date(b.changedAt)
    );

    const now = new Date(currentTime);
    const isFinished = FINISHED_STATUSES.includes(call.status);
    const isCancelled = call.status === CALL_STATUSES.CANCELLED;

    // Find key events
    const firstInProgress = sortedHistory.find(
      (h) => h.toStatus === CALL_STATUSES.IN_PROGRESS
    );

    // Calculate assignment time
    const assignmentTime = firstInProgress
      ? getDurationInSeconds(
          createdAt || call.createdAt,
          firstInProgress.changedAt
        )
      : null;

    // Calculate time spent in each status
    let totalHoldTime = 0;
    let activeWorkTime = 0;
    let currentPeriodStart = null;
    let currentStatus = CALL_STATUSES.OPENED;

    for (const entry of sortedHistory) {
      if (currentPeriodStart) {
        const periodDuration = getDurationInSeconds(
          currentPeriodStart,
          entry.changedAt
        );

        if (currentStatus === CALL_STATUSES.ON_HOLD) {
          totalHoldTime += periodDuration;
        } else if (currentStatus === CALL_STATUSES.IN_PROGRESS) {
          activeWorkTime += periodDuration;
        }
      }

      currentPeriodStart = entry.changedAt;
      currentStatus = entry.toStatus;
    }

    // Calculate ongoing period
    if (currentPeriodStart && !isFinished) {
      const periodDuration = getDurationInSeconds(
        currentPeriodStart,
        now.toISOString()
      );

      if (currentStatus === CALL_STATUSES.ON_HOLD) {
        totalHoldTime += periodDuration;
      } else if (currentStatus === CALL_STATUSES.IN_PROGRESS) {
        activeWorkTime += periodDuration;
      }
    }

    // Calculate total time
    const totalTime =
      isFinished && (closedAt || call.closedAt)
        ? getDurationInSeconds(
            createdAt || call.createdAt,
            closedAt || call.closedAt
          )
        : getDurationInSeconds(createdAt || call.createdAt, now.toISOString());

    return {
      assignmentTime,
      activeWorkTime,
      totalHoldTime,
      totalTime,
      isFinished,
      isCancelled,
      currentStatus: call.status,
      holdCount: sortedHistory.filter(
        (h) => h.toStatus === CALL_STATUSES.ON_HOLD
      ).length,
      isOverExpected: expectedTime && totalTime > expectedTime,
      expectedTime,
    };
  }, [call, callStatusHistory, currentTime, expectedTime, createdAt, closedAt]);
};

// Steps generation hook
// @ts-ignore
const useTimelineSteps = (timelineData) => {
  return useMemo(() => {
    if (!timelineData) return [];

    const {
      assignmentTime,
      activeWorkTime,
      totalHoldTime,
      totalTime,
      isFinished,
      isCancelled,
      currentStatus,
    } = timelineData;

    const stepsArray = [
      {
        icon: AlertCircle,
        label: "Opened",
        time: 0,
        isCompleted: true,
        isCancelled: false,
        color: COLORS.blue,
      },
      {
        icon: User,
        label: "Assigned",
        time: assignmentTime,
        isCompleted: !!assignmentTime && !isCancelled,
        isCancelled: isCancelled && !assignmentTime,
        isActive:
          !assignmentTime &&
          currentStatus === CALL_STATUSES.OPENED &&
          !isCancelled,
        color: COLORS.purple,
      },
    ];

    if (assignmentTime || isCancelled) {
      stepsArray.push({
        icon: isCancelled ? X : Play,
        label: isCancelled ? "Cancelled" : "In Progress",
        time: isCancelled ? totalTime : activeWorkTime,
        isCompleted: isFinished && !isCancelled,
        isCancelled: isCancelled,
        isActive: currentStatus === CALL_STATUSES.IN_PROGRESS && !isCancelled,
        color: isCancelled ? COLORS.red : COLORS.green,
      });
    }

    if (
      (totalHoldTime > 0 || currentStatus === CALL_STATUSES.ON_HOLD) &&
      !isCancelled
    ) {
      stepsArray.push({
        icon: Pause,
        label: "On Hold",
        time: totalHoldTime,
        isCompleted: currentStatus !== CALL_STATUSES.ON_HOLD,
        isCancelled: false,
        isActive: currentStatus === CALL_STATUSES.ON_HOLD,
        color: COLORS.yellow,
      });
    }

    if (isFinished && !isCancelled) {
      stepsArray.push({
        icon: CheckCircle,
        label: "Completed",
        time: totalTime,
        isCompleted: true,
        isCancelled: false,
        color: COLORS.green,
      });
    }

    return stepsArray;
  }, [timelineData]);
};

// Main component
export const CallTimelineDisplay = ({
  // @ts-ignore
  call,
  // @ts-ignore
  callStatusHistory = [],
  // @ts-ignore
  expectedTime,
  // @ts-ignore
  createdAt,
  // @ts-ignore
  closedAt,
}) => {
  const isActive = call && isCallActive(call.status);
  const currentTime = useCurrentTime(isActive);

  const timelineData = useTimelineCalculation(
    call,
    callStatusHistory,
    currentTime,
    expectedTime,
    createdAt,
    closedAt
  );

  const steps = useTimelineSteps(timelineData);

  if (!timelineData) return null;

  // @ts-ignore
  const { isCancelled, isOverExpected, expectedTime: expTime } = timelineData;

  return (
    <div className="w-full space-y-6">
      {/* Status Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          {isActive && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Circle className="w-2 h-2 text-green-500 animate-pulse" />
              Live Updates
            </div>
          )}
          <StatusBadge status={call.status} isOverExpected={isOverExpected} />
        </div>
        {expTime && (
          <div className="text-sm text-gray-500">
            Expected: {formatTime(expTime)}
          </div>
        )}
      </div>

      {/* Horizontal Timeline */}
      <div className="w-full">
        <div className="flex items-start justify-between gap-4 overflow-x-auto pb-4 bg-surface rounded-xl border border-gray-100 p-6 shadow-sm">
          {steps.map((step, index) => (
            // @ts-ignore
            <TimelineStep
              key={`${step.label}-${index}`}
              {...step}
              position={index}
              totalSteps={steps.length}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
