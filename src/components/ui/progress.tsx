import { cn } from "@/lib/utils";

const colorStyles = {
  default: "bg-indigo-600",
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  danger: "bg-rose-500",
};

export function Progress({
  value,
  max = 100,
  color = "default",
  label,
  showValue = false,
  className,
}: {
  value: number;
  max?: number;
  color?: keyof typeof colorStyles;
  label?: string;
  showValue?: boolean;
  className?: string;
}) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className={cn("w-full", className)}>
      {(label || showValue) && (
        <div className="mb-1 flex items-center justify-between text-sm">
          {label && <span className="text-slate-600">{label}</span>}
          {showValue && <span className="font-medium text-slate-900">{Math.round(pct)}%</span>}
        </div>
      )}
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className={cn("h-full rounded-full transition-all duration-300", colorStyles[color])}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
