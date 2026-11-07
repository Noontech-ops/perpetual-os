import type {
  Constituent, ConstituentType, Transaction, RestrictionLevel,
  Outcome, Grant, GrantStatus,
} from './types';

export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function formatCurrency(amount: number, compact = false): string {
  if (compact && Math.abs(amount) >= 1_000_000) {
    return `$${(amount / 1_000_000).toFixed(1)}M`;
  }
  if (compact && Math.abs(amount) >= 1_000) {
    return `$${(amount / 1_000).toFixed(0)}K`;
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatCurrencyCents(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatDateShort(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

export function formatPercent(value: number, decimals = 0): string {
  return `${value.toFixed(decimals)}%`;
}

export function getConstituentsByType(constituents: Constituent[], type: ConstituentType): Constituent[] {
  return constituents.filter(c => c.type === type);
}

export function getTransactionsByRestriction(transactions: Transaction[], restriction: RestrictionLevel): Transaction[] {
  return transactions.filter(t => t.restriction === restriction);
}

export function getTransactionsByDirection(transactions: Transaction[], direction: 'inflow' | 'outflow'): Transaction[] {
  return transactions.filter(t => t.direction === direction);
}

export function calculateBurnRate(transactions: Transaction[], months = 3): number {
  const outflows = transactions.filter(t => t.direction === 'outflow');
  const total = outflows.reduce((sum, t) => sum + t.amount, 0);
  return total / months;
}

export function calculateRunway(cashOnHand: number, monthlyBurn: number): number {
  if (monthlyBurn <= 0) return Infinity;
  return Math.round((cashOnHand / monthlyBurn) * 10) / 10;
}

export function getOutcomesByProgram(outcomes: Outcome[], programId: string): Outcome[] {
  return outcomes.filter(o => o.programId === programId);
}

export function getGrantsByStatus(grants: Grant[], status: GrantStatus): Grant[] {
  return grants.filter(g => g.status === status);
}

export function getUpcomingDeadlines(grants: Grant[], withinDays = 30): { grant: Grant; deadline: Grant['deadlines'][0] }[] {
  const now = new Date();
  const cutoff = new Date(now.getTime() + withinDays * 86400000);
  const results: { grant: Grant; deadline: Grant['deadlines'][0] }[] = [];
  for (const grant of grants) {
    for (const d of grant.deadlines) {
      const date = new Date(d.date);
      if (!d.completed && date >= now && date <= cutoff) {
        results.push({ grant, deadline: d });
      }
    }
  }
  return results.sort((a, b) => new Date(a.deadline.date).getTime() - new Date(b.deadline.date).getTime());
}

export function daysUntil(dateStr: string): number {
  const now = new Date();
  const target = new Date(dateStr);
  return Math.ceil((target.getTime() - now.getTime()) / 86400000);
}

export function statusColor(status: string): string {
  const colors: Record<string, string> = {
    active: 'bg-emerald-100 text-emerald-800',
    awarded: 'bg-emerald-100 text-emerald-800',
    applied: 'bg-blue-100 text-blue-800',
    prospect: 'bg-amber-100 text-amber-800',
    reporting: 'bg-purple-100 text-purple-800',
    closed: 'bg-gray-100 text-gray-600',
    declined: 'bg-red-100 text-red-800',
    planned: 'bg-blue-100 text-blue-800',
    paused: 'bg-amber-100 text-amber-800',
    completed: 'bg-gray-100 text-gray-600',
    pending: 'bg-amber-100 text-amber-800',
    auto_approved: 'bg-emerald-100 text-emerald-800',
    approved: 'bg-emerald-100 text-emerald-800',
    rejected: 'bg-red-100 text-red-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-600';
}
