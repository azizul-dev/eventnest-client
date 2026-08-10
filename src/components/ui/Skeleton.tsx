import React from "react";

export const Skeleton: React.FC<{ className?: string }> = ({
  className = "",
}) => {
  return <div className={`skeleton-shimmer rounded-xl ${className}`} />;
};

export const EventCardSkeleton: React.FC = () => {
  return (
    <div className="rounded-3xl border border-gray-200 dark:border-emerald-500/10 p-6 bg-white dark:bg-[#0F1A14] flex flex-col gap-4 shadow-sm">
      <Skeleton className="h-44 w-full rounded-2xl" />
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <Skeleton className="h-5 w-24 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        <Skeleton className="h-6 w-3/4 rounded-lg" />
        <Skeleton className="h-4 w-full rounded-lg" />
      </div>
      <div className="pt-4 border-t border-gray-100 dark:border-emerald-500/10 flex items-center justify-between">
        <Skeleton className="h-7 w-24 rounded-lg" />
        <Skeleton className="h-10 w-28 rounded-full" />
      </div>
    </div>
  );
};

export const TableRowSkeleton: React.FC<{ cols?: number }> = ({ cols = 5 }) => {
  return (
    <tr className="border-b border-gray-100 dark:border-emerald-500/10">
      {[...Array(cols)].map((_, i) => (
        <td key={i} className="p-4">
          <Skeleton className="h-5 w-full rounded-md" />
        </td>
      ))}
    </tr>
  );
};
