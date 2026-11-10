import type {
  Organization, Constituent, Transaction, Program, Outcome,
  Grant, AgentConfig, AgentAction, DashboardStats, DonorProfile, GivingTransaction,
} from './types';
import * as mock from './mock-data';

function snakeToCamel(s: string): string {
  return s.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
}

function camelizeKeys(obj: unknown): unknown {
  if (Array.isArray(obj)) return obj.map(camelizeKeys);
  if (obj !== null && typeof obj === 'object' && !(obj instanceof Date)) {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
      out[snakeToCamel(k)] = camelizeKeys(v);
    }
    return out;
  }
  return obj;
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T | null> {
  try {
    const res = await fetch(path, init);
    if (!res.ok) return null;
    const json = await res.json();
    return camelizeKeys(json) as T;
  } catch {
    return null;
  }
}

export async function getOrganization(): Promise<Organization> {
  const data = await apiFetch<Organization>('/api/organizations');
  if (data) return data;
  return mock.organization;
}

export async function getConstituents(type?: string): Promise<Constituent[]> {
  const params = type ? `?type=${type}` : '';
  const data = await apiFetch<Constituent[]>(`/api/constituents${params}`);
  if (data) return data;
  return type ? mock.constituents.filter(c => c.type === type) : mock.constituents;
}

export async function getTransactions(direction?: string): Promise<Transaction[]> {
  const params = direction ? `?direction=${direction}` : '';
  const data = await apiFetch<Transaction[]>(`/api/transactions${params}`);
  if (data) return data;
  return direction ? mock.transactions.filter(t => t.direction === direction) : mock.transactions;
}

export async function getPrograms(): Promise<Program[]> {
  const data = await apiFetch<Program[]>('/api/programs');
  if (data) return data;
  return mock.programs;
}

export async function getOutcomes(): Promise<Outcome[]> {
  const data = await apiFetch<Outcome[]>('/api/outcomes');
  if (data) return data;
  return mock.outcomes;
}

export async function getGrants(status?: string): Promise<Grant[]> {
  const params = status ? `?status=${status}` : '';
  const data = await apiFetch<Grant[]>(`/api/grants${params}`);
  if (data) return data;
  return status ? mock.grants.filter(g => g.status === status) : mock.grants;
}

export async function getAgentActions(status?: string): Promise<AgentAction[]> {
  const params = status ? `?status=${status}` : '';
  const data = await apiFetch<AgentAction[]>(`/api/agent-actions${params}`);
  if (data) return data;
  return status ? mock.agentActions.filter(a => a.status === status) : mock.agentActions;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const data = await apiFetch<DashboardStats>('/api/dashboard-stats');
  if (data) return data;
  return mock.dashboardStats;
}

export async function getAgentConfigs(): Promise<AgentConfig[]> {
  return mock.agentConfigs;
}

export async function getDonorProfiles(): Promise<DonorProfile[]> {
  const data = await apiFetch<DonorProfile[]>('/api/donor-profiles');
  if (data) return data;
  return mock.donorProfiles;
}

export async function getGivingTransactions(): Promise<GivingTransaction[]> {
  const data = await apiFetch<GivingTransaction[]>('/api/donations');
  if (data) return data;
  return mock.givingTransactions;
}

export async function updateAgentAction(id: string, status: 'approved' | 'rejected'): Promise<boolean> {
  try {
    const res = await fetch('/api/agent-actions', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function runAgent(agentType: string, task: string): Promise<string> {
  const res = await apiFetch<{ response: string }>('/api/agents/run', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ agentType, task }),
  });
  return res?.response ?? 'Agent unavailable. Check API key configuration.';
}

export async function createDonation(data: {
  organization_id: string;
  amount: number;
  method: string;
  designation?: string;
  status?: string;
}): Promise<GivingTransaction | null> {
  return apiFetch<GivingTransaction>('/api/donations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

export async function searchOrganizations(q?: string, sector?: string): Promise<Organization[]> {
  const params = new URLSearchParams();
  if (q) params.set('q', q);
  if (sector) params.set('sector', sector);
  const qs = params.toString();
  const data = await apiFetch<Organization[]>(`/api/search${qs ? `?${qs}` : ''}`);
  return data ?? [];
}
