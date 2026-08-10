import React from "react";
import { EventStatus, BookingStatus } from "@/types";

type BadgeType = EventStatus | BookingStatus | "ADMIN" | "USER" | string;

interface BadgeProps {
  status: BadgeType;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ status, className = "" }) => {
  let colorClasses = "bg-gray-500/10 text-gray-400 border-gray-500/20";

  switch (status) {
    case "UPCOMING":
    case "CONFIRMED":
      colorClasses =
        "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30";
      break;
    case "ONGOING":
      colorClasses =
        "bg-[#D97A3D]/15 text-[#D97A3D] border-[#D97A3D]/30";
      break;
    case "COMPLETED":
      colorClasses =
        "bg-teal-500/15 text-teal-600 dark:text-teal-400 border-teal-500/30";
      break;
    case "CANCELLED":
      colorClasses =
        "bg-rose-500/15 text-rose-500 border-rose-500/30";
      break;
    case "ADMIN":
      colorClasses =
        "bg-[#D97A3D]/20 text-[#D97A3D] border-[#D97A3D]/40 font-bold";
      break;
    case "USER":
      colorClasses =
        "bg-emerald-500/15 text-emerald-500 border-emerald-500/30";
      break;
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full border backdrop-blur-md ${colorClasses} ${className}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          status === "UPCOMING" || status === "CONFIRMED"
            ? "bg-emerald-500"
            : status === "CANCELLED"
            ? "bg-rose-500"
            : status === "ONGOING" || status === "ADMIN"
            ? "bg-[#D97A3D] animate-pulse"
            : "bg-gray-400"
        }`}
      />
      {status}
    </span>
  );
};
