import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn("bg-slate-200 animate-pulse rounded", className)} />
  );
}
