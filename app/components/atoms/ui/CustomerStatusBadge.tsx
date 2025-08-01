import React from "react";
import { getStatusColor, formatStatus } from "../utils/statusUtils";

interface CustomerStatusBadgeProps {
  status: string;
  size?: "sm" | "md";
}

export const CustomerStatusBadge: React.FC<CustomerStatusBadgeProps> = ({
  status,
  size = "sm",
}) => {
  const sizeClasses = size === "sm" ? "text-xs px-2 py-1" : "text-sm px-3 py-1";

  return (
    <span
      className={`font-semibold rounded-full ${sizeClasses} ${getStatusColor(
        status
      )}`}
    >
      {formatStatus(status)}
    </span>
  );
};
