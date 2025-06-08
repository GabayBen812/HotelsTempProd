import { useEffect, useMemo, useState, memo } from "react";
import { useTranslation } from "react-i18next";

const getDurationInSeconds = (from, to) =>
  Math.max(
    0,
    Math.floor((new Date(to).getTime() - new Date(from).getTime()) / 1000)
  );

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
};

const PremiumClock = memo(
  ({
    progress,
    isOverdue,
    isNearLimit,
    durationSeconds,
    expectedSeconds,
    isFinished,
  }) => {
    const { t } = useTranslation();
    const circumference = Math.PI * 50;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    const colorConfig = useMemo(() => {
      if (isFinished) {
        return isOverdue
          ? {
              primary: "#dc2626",
              secondary: "#f87171",
              accent: "#fef2f2",
              text: "text-red-700",
              shadow: "shadow-red-100",
              glow: "drop-shadow-sm",
              gradientId: "finishedOverdueGradient",
              shadowId: "finishedOverdueShadow",
            }
          : {
              primary: "#059669",
              secondary: "#34d399",
              accent: "#f0fdf4",
              text: "text-emerald-700",
              shadow: "shadow-emerald-100",
              glow: "drop-shadow-sm",
              gradientId: "finishedSuccessGradient",
              shadowId: "finishedSuccessShadow",
            };
      }

      if (isOverdue) {
        return {
          primary: "#dc2626",
          secondary: "#f87171",
          accent: "#fef2f2",
          text: "text-red-700",
          shadow: "shadow-red-100",
          glow: "drop-shadow-sm",
          gradientId: "overdueGradient",
          shadowId: "overdueShadow",
        };
      }

      if (isNearLimit) {
        return {
          primary: "#d97706",
          secondary: "#fbbf24",
          accent: "#fffbeb",
          text: "text-amber-700",
          shadow: "shadow-amber-100",
          glow: "drop-shadow-sm",
          gradientId: "nearLimitGradient",
          shadowId: "nearLimitShadow",
        };
      }

      return {
        primary: "#2563eb",
        secondary: "#60a5fa",
        accent: "#f8fafc",
        text: "text-blue-700",
        shadow: "shadow-blue-100",
        glow: "drop-shadow-sm",
        gradientId: "normalGradient",
        shadowId: "normalShadow",
      };
    }, [isFinished, isOverdue, isNearLimit]);

    return (
      <div className="flex items-center justify-center p-4">
        <div className="relative">
          {/* Main clock container */}
          <div className="relative w-48 h-28">
            {/* SVG Clock - Half Circle */}
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 120 70"
              style={{ overflow: "visible" }}
            >
              <defs>
                {/* Shadow filters for different states */}
                <filter
                  id="normalShadow"
                  x="-50%"
                  y="-50%"
                  width="200%"
                  height="200%"
                >
                  <feDropShadow
                    dx="0"
                    dy="2"
                    stdDeviation="3"
                    floodColor="#2563eb"
                    floodOpacity="0.3"
                  />
                  <feDropShadow
                    dx="0"
                    dy="1"
                    stdDeviation="1"
                    floodColor="#2563eb"
                    floodOpacity="0.2"
                  />
                </filter>

                <filter
                  id="nearLimitShadow"
                  x="-50%"
                  y="-50%"
                  width="200%"
                  height="200%"
                >
                  <feDropShadow
                    dx="0"
                    dy="2"
                    stdDeviation="3"
                    floodColor="#d97706"
                    floodOpacity="0.4"
                  />
                  <feDropShadow
                    dx="0"
                    dy="1"
                    stdDeviation="1"
                    floodColor="#d97706"
                    floodOpacity="0.3"
                  />
                </filter>

                <filter
                  id="overdueShadow"
                  x="-50%"
                  y="-50%"
                  width="200%"
                  height="200%"
                >
                  <feDropShadow
                    dx="0"
                    dy="2"
                    stdDeviation="4"
                    floodColor="#dc2626"
                    floodOpacity="0.4"
                  />
                  <feDropShadow
                    dx="0"
                    dy="1"
                    stdDeviation="2"
                    floodColor="#dc2626"
                    floodOpacity="0.3"
                  />
                  <feGaussianBlur stdDeviation="0.5" result="coloredBlur" />
                </filter>

                <filter
                  id="finishedSuccessShadow"
                  x="-50%"
                  y="-50%"
                  width="200%"
                  height="200%"
                >
                  <feDropShadow
                    dx="0"
                    dy="2"
                    stdDeviation="3"
                    floodColor="#059669"
                    floodOpacity="0.4"
                  />
                  <feDropShadow
                    dx="0"
                    dy="1"
                    stdDeviation="1"
                    floodColor="#059669"
                    floodOpacity="0.2"
                  />
                </filter>

                <filter
                  id="finishedOverdueShadow"
                  x="-50%"
                  y="-50%"
                  width="200%"
                  height="200%"
                >
                  <feDropShadow
                    dx="0"
                    dy="2"
                    stdDeviation="4"
                    floodColor="#dc2626"
                    floodOpacity="0.4"
                  />
                  <feDropShadow
                    dx="0"
                    dy="1"
                    stdDeviation="2"
                    floodColor="#dc2626"
                    floodOpacity="0.3"
                  />
                </filter>

                {/* Gradient definitions for different states */}
                <linearGradient
                  id="normalGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#2563eb" />
                  <stop offset="50%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#60a5fa" />
                </linearGradient>

                <linearGradient
                  id="nearLimitGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#d97706" />
                  <stop offset="50%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#fbbf24" />
                </linearGradient>

                <linearGradient
                  id="overdueGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#dc2626" />
                  <stop offset="50%" stopColor="#ef4444" />
                  <stop offset="100%" stopColor="#f87171" />
                </linearGradient>

                <linearGradient
                  id="finishedSuccessGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#059669" />
                  <stop offset="50%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#34d399" />
                </linearGradient>

                <linearGradient
                  id="finishedOverdueGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#dc2626" />
                  <stop offset="50%" stopColor="#ef4444" />
                  <stop offset="100%" stopColor="#f87171" />
                </linearGradient>
              </defs>

              {/* Background track - half circle (visible) */}
              <path
                d="M 10 60 A 50 50 0 0 1 110 60"
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="6"
                strokeLinecap="round"
              />

              {/* Progress arc - half circle with gradient and shadow */}
              <path
                d="M 10 60 A 50 50 0 0 1 110 60"
                fill="none"
                stroke={`url(#${colorConfig.gradientId})`}
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-700 ease-out"
                filter={`url(#${colorConfig.shadowId})`}
              />
            </svg>

            {/* Center display */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pt-6">
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {formatTime(durationSeconds)}
              </div>
              <div className="text-sm text-gray-500 font-medium">
                of {Math.floor(expectedSeconds / 60)}min
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

export const CleanTimer = ({
  expectedTime = 5,
  createdAt = new Date(Date.now() - 3 * 60 * 1000).toISOString(), // 3 minutes ago
  closedAt = null,
  status = "ACTIVE",
}) => {
  const isFinished = status === "COMPLETED" || status === "FAILED";
  const [now, setNow] = useState(() => new Date().toISOString());

  // Timer update
  useEffect(() => {
    if (isFinished) return;

    const interval = setInterval(() => {
      setNow(new Date().toISOString());
    }, 1000);

    return () => clearInterval(interval);
  }, [isFinished]);

  const timerData = useMemo(() => {
    const durationSecs =
      isFinished && closedAt
        ? getDurationInSeconds(createdAt, closedAt)
        : getDurationInSeconds(createdAt, now);

    const expectedSecs = expectedTime * 60;
    const progressPercent = (durationSecs / expectedSecs) * 100;
    const overdue = durationSecs > expectedSecs;
    const nearLimit = progressPercent > 85 && !overdue;

    return {
      durationSeconds: durationSecs,
      expectedSeconds: expectedSecs,
      progress: Math.min(progressPercent, 100),
      isOverdue: overdue,
      isNearLimit: nearLimit,
    };
  }, [createdAt, closedAt, now, isFinished, expectedTime]);

  return (
    <div className="flex items-center justify-center">
      <div className="text-center">
        <PremiumClock {...timerData} isFinished={isFinished} />
      </div>
    </div>
  );
};

export default CleanTimer;
