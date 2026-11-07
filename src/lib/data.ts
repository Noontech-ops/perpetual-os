import type {
  Organization, Constituent, Transaction, Program, Outcome,
  Grant, AgentConfig, AgentAction, DashboardStats, DonorProfile, GivingTransaction,
} from './types';
import * as mock from './mock-data';

const hasSupabase = typeof window !== 'undefined'
  && !!process.env.NEXT_PUBLIC_SUPABASE_URL
  && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function apiFetch<T>(path: string): Promise<T | null> {
  if (!hasSupabase) return null;
  try {
    const res = await fetch(path);
    if (!res.ok) return null;
    return await res.json();
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
  return mock.dashboardStats;
}

export async function getAgentConfigs(): Promise<AgentConfig[]> {
  return mock.agentConfigs;
}

export async function getDonorProfiles(): Promise<DonorProfile[]> {
  return mock.donorProfiles;
}

export async function getGivingTransactions(): Promise<GivingTransaction[]> {
  return mock.givingTransactions;
}

export async function updateAgentAction(id: string, status: 'approved' | 'rejected'): Promise<boolean> {
  if (!hasSupabase) return true;
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
