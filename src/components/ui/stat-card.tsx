import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  change,
  changeLabel,
  icon,
  className,
}: {
  label: string;
  value: string;
  change?: number;
  changeLabel?: string;
  icon?: React.ReactNode;
  className?: string;
}) {
  const isPositive = change !== undefined && change >= 0;
  return (
    <div className={cn("rounded-lg border border-slate-200 bg-white p-6 shadow-sm", className)}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-500">{label}</span>
        {icon && <span className="text-slate-400">{icon}</span>}
      </div>
      <div className="mt-2 text-2xl font-bold text-slate-900">{value}</div>
      {change !== undefined && (
        <div className="mt-1 flex items-center gap-1 text-sm">
          <span className={isPositive ? "text-emerald-600" : "text-rose-600"}>
            {isPositive ? "↑" : "↓"} {Math.abs(change)}%
          </span>
          {changeLabel && <span className="text-slate-400">{changeLabel}</span>}
        </div>
      )}
    </div>
  );
}
