import React from "react";
import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  shimmer?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  shimmer = true,
  ...props
}) => {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "relative overflow-hidden rounded-xl bg-surface-container-high/75",
        shimmer &&
          "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.6s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent",
        !shimmer && "animate-pulse",
        className
      )}
      {...props}
    />
  );
};

export const LoginSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#f8fbff] flex flex-col justify-between px-6 lg:px-12 py-5">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Skeleton className="h-10 w-10 rounded-xl" />
          <Skeleton className="h-5 w-20 rounded-lg" />
        </div>
        <div className="flex items-center space-x-3">
          <Skeleton className="hidden md:block h-8 w-52 rounded-full" />
          <Skeleton className="h-4 w-24 rounded-lg" />
        </div>
      </div>

      {/* Main Split Skeleton */}
      <div className="max-w-7xl mx-auto w-full py-8 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        <div className="lg:col-span-7 flex flex-col space-y-5">
          <Skeleton className="h-7 w-40 rounded-full" />
          <Skeleton className="h-12 w-full max-w-xl rounded-2xl" />
          <Skeleton className="h-12 w-4/5 max-w-lg rounded-2xl" />
          <Skeleton className="h-5 w-full max-w-md rounded-lg" />
          <Skeleton className="h-64 w-full rounded-3xl mt-2" />
        </div>

        <div className="lg:col-span-5 w-full max-w-md mx-auto">
          <div className="glass-card rounded-[2rem] p-7 sm:p-9 space-y-5 border border-white/90">
            <div className="flex flex-col items-center space-y-2">
              <Skeleton className="h-7 w-40 rounded-xl" />
              <Skeleton className="h-4 w-56 rounded-lg" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Skeleton className="h-10 rounded-xl" />
              <Skeleton className="h-10 rounded-xl" />
            </div>
            <Skeleton className="h-11 w-full rounded-xl" />
            <Skeleton className="h-11 w-full rounded-xl" />
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
        </div>
      </div>

      {/* Footer Skeleton */}
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between py-3">
        <Skeleton className="h-4 w-48 rounded-lg" />
        <Skeleton className="h-4 w-24 rounded-lg" />
      </div>
    </div>
  );
};

export const PageSkeleton: React.FC = () => {
  return (
    <div className="w-full min-h-[70vh] p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Top Header Bar Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-7 w-56 rounded-xl" />
          <Skeleton className="h-4 w-72 rounded-lg" />
        </div>
        <div className="flex items-center gap-2.5">
          <Skeleton className="h-10 w-32 rounded-xl" />
          <Skeleton className="h-10 w-36 rounded-xl" />
        </div>
      </div>

      {/* KPI Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div
            key={idx}
            className="rounded-2xl bg-glass-fill backdrop-blur-xl border border-white/80 p-5 space-y-3 shadow-xs"
          >
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-24 rounded-md" />
              <Skeleton className="h-9 w-9 rounded-xl" />
            </div>
            <Skeleton className="h-8 w-28 rounded-lg" />
            <Skeleton className="h-3 w-36 rounded-md" />
          </div>
        ))}
      </div>

      {/* Main Content Card Skeleton */}
      <div className="rounded-2xl bg-glass-fill backdrop-blur-xl border border-white/80 p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-44 rounded-lg" />
          <Skeleton className="h-9 w-52 rounded-xl" />
        </div>
        <div className="space-y-3 pt-2">
          {Array.from({ length: 5 }).map((_, idx) => (
            <Skeleton key={idx} className="h-12 w-full rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
};
