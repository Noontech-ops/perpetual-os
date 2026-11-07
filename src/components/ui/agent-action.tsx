"use client";

import { cn } from "@/lib/utils";
import { Badge } from "./badge";
import { Button } from "./button";

const agentIcons: Record<string, string> = {
  grants: "📋",
  "donor-relations": "🤝",
  finance: "💰",
  compliance: "⚖️",
  marketing: "📢",
  board: "🏛️",
};

const statusVariant: Record<string, "success" | "warning" | "danger" | "info"> = {
  "auto-approved": "success",
  pending: "warning",
  approved: "success",
  rejected: "danger",
};

export function AgentAction({
  agentName,
  agentType,
  action,
  evidence,
  status,
  timestamp,
  onApprove,
  onReject,
  className,
}: {
  agentName: string;
  agentType: string;
  action: string;
  evidence?: string;
  status: "auto-approved" | "pending" | "approved" | "rejected";
  timestamp: string;
  onApprove?: () => void;
  onReject?: () => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-lg border bg-white p-4",
        status === "pending" ? "border-amber-200 bg-amber-50/30" : "border-slate-200",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 text-xl">{agentIcons[agentType] || "🤖"}</span>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-900">{agentName}</span>
              <Badge variant={statusVariant[status]}>{status.replace("-", " ")}</Badge>
            </div>
            <p className="mt-1 text-sm text-slate-700">{action}</p>
            {evidence && (
              <p className="mt-1.5 text-xs text-slate-500 italic">
                Evidence: {evidence}
              </p>
            )}
          </div>
        </div>
        <span className="flex-shrink-0 text-xs text-slate-400">{timestamp}</span>
      </div>
      {status === "pending" && (onApprove || onReject) && (
        <div className="mt-3 flex gap-2 pl-10">
          {onApprove && (
            <Button variant="primary" size="sm" onClick={onApprove}>
              Approve
            </Button>
          )}
          {onReject && (
            <Button variant="outline" size="sm" onClick={onReject}>
              Reject
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
