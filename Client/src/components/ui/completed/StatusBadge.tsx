import React from "react";

interface StatusBadgeProps {
  option: { label: string; value: string };
}

const statusStyles: Record<string, string> = {
  OPENED: "bg-blue-100 text-blue-800",
  IN_PROGRESS: "bg-yellow-100 text-yellow-800",
  COMPLETED: "bg-green-100 text-green-800",
  FAILED: "bg-red-100 text-red-800",
  ON_HOLD: "bg-gray-100 text-gray-800",
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ option }) => {
  const style = statusStyles[option.value] || "bg-gray-100 text-gray-800";

  return (
    <span className={`px-3 py-1 rounded-md text-sm font-medium ${style}`}>
      {option.label}
    </span>
  );
};
