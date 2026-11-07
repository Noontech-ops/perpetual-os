// Perpetual — Core Data Model

// --- Enums ---

export type ConstituentType = 'donor' | 'funder' | 'client' | 'volunteer' | 'board' | 'staff';

export type RestrictionLevel = 'unrestricted' | 'temporarily_restricted' | 'permanently_restricted';

export type TransactionDirection = 'inflow' | 'outflow';

export type TransactionCategory =
  | 'individual_donation' | 'foundation_grant' | 'corporate_gift' | 'government_grant'
  | 'earned_revenue' | 'event_revenue' | 'investment_income'
  | 'salary' | 'benefits' | 'rent' | 'supplies' | 'professional_services'
  | 'program_expense' | 'travel' | 'technology' | 'insurance' | 'depreciation'
  | 'fundraising_expense' | 'management_general' | 'other';

export type ProgramStatus = 'active' | 'planned' | 'paused' | 'completed';

export type GrantStatus = 'prospect' | 'applied' | 'awarded' | 'active' | 'reporting' | 'closed' | 'declined';

export type GivingMethod = 'card' | 'ach' | 'daf' | 'stock' | 'crypto' | 'qcd' | 'wire' | 'check' | 'bequest_intent';

export type AgentType = 'grants' | 'donor_relations' | 'finance' | 'compliance' | 'marketing' | 'board';

export type AgentActionStatus = 'auto_approved' | 'pending' | 'approved' | 'rejected';

export type Sector =
  | 'education' | 'health' | 'housing' | 'workforce' | 'environment'
  | 'arts_culture' | 'community' | 'human_services' | 'science' | 'essential_rights';

// --- Core Objects ---

export interface Constituent {
  id: string;
  type: ConstituentType;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  organization?: string;
  title?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  tags: string[];
  givingHistory: {
    totalLifetime: number;
    lastGiftAmount: number;
    lastGiftDate: string;
    averageGift: number;
    giftCount: number;
    firstGiftDate: string;
  };
  engagementScore: number; // 0–100
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  date: string;
  direction: TransactionDirection;
  amount: number;
  category: TransactionCategory;
  restriction: RestrictionLevel;
  description: string;
  constituentId?: string;
  grantId?: string;
  programId?: string;
  accountCode: string;
  memo?: string;
  reconciled: boolean;
  createdAt: string;
}

export interface Program {
  id: string;
  name: string;
  description: string;
  sector: Sector;
  status: ProgramStatus;
  startDate: string;
  endDate?: string;
  annualBudget: number;
  ytdSpend: number;
  staffCount: number;
  clientsServed: number;
  outcomeIds: string[];
  grantIds: string[];
  createdAt: string;
}

export interface OutcomeMetric {
  label: string;
  value: number;
  unit: string;
  target: number;
  periodStart: string;
  periodEnd: string;
}

export interface Outcome {
  id: string;
  programId: string;
  sector: Sector;
  reportingPeriod: string;
  metrics: OutcomeMetric[];
  narrative?: string;
  verifiedBy?: string;
  verifiedAt?: string;
  createdAt: string;
}

// --- Organization ---

export interface LeadershipMember {
  name: string;
  title: string;
  since: string;
  bio?: string;
}

export interface Organization {
  id: string;
  name: string;
  legalName: string;
  ein: string;
  mission: string;
  vision?: string;
  sector: Sector;
  founded: string;
  website?: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  phone: string;
  email: string;
  leadership: LeadershipMember[];
  financials: {
    fiscalYearEnd: string;
    annualBudget: number;
    totalRevenue: number;
    totalExpenses: number;
    netAssets: number;
    cashOnHand: number;
    monthsOfRunway: number;
  };
  programIds: string[];
  publicProfile: boolean;
  createdAt: string;
  updatedAt: string;
}

// --- Grants ---

export interface GrantDeadline {
  type: 'loi' | 'application' | 'report' | 'renewal' | 'site_visit';
  date: string;
  description: string;
  completed: boolean;
}

export interface Grant {
  id: string;
  funderId: string;
  funderName: string;
  programId?: string;
  name: string;
  status: GrantStatus;
  amountRequested: number;
  amountAwarded?: number;
  amountSpent: number;
  restriction: RestrictionLevel;
  startDate?: string;
  endDate?: string;
  deadlines: GrantDeadline[];
  requirements: string[];
  notes?: string;
  probability?: number; // 0–100 for prospect/applied
  createdAt: string;
  updatedAt: string;
}

// --- Donor Marketplace (Perpetual Outcomes) ---

export interface DonorProfile {
  id: string;
  constituentId?: string;
  displayName: string;
  interests: Sector[];
  geographicFocus: ('local' | 'regional' | 'national' | 'international')[];
  givingBudget?: { annual: number; currency: string };
  portfolio: DonorPortfolioEntry[];
  totalGiven: number;
  joinedAt: string;
}

export interface DonorPortfolioEntry {
  organizationId: string;
  organizationName: string;
  totalGiven: number;
  lastGiftDate: string;
  giftCount: number;
}

export interface GivingTransaction {
  id: string;
  donorProfileId: string;
  organizationId: string;
  amount: number;
  method: GivingMethod;
  fee: number;
  feePercent: number;
  netToOrg: number;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  acknowledgmentSent: boolean;
  taxReceiptIssued: boolean;
  designation?: string;
  createdAt: string;
}

// --- Agents ---

export interface AgentAction {
  id: string;
  agentType: AgentType;
  action: string;
  description: string;
  status: AgentActionStatus;
  evidence?: string;
  approvedBy?: string;
  approvedAt?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface AgentConfig {
  type: AgentType;
  name: string;
  description: string;
  scope: string[];
  approvalThreshold: number; // dollar amount above which human approval needed
  enabled: boolean;
  lastRunAt?: string;
  actionsToday: number;
  actionsPending: number;
}

// --- Dashboard ---

export interface DashboardStats {
  totalRevenue: number;
  totalExpenses: number;
  netIncome: number;
  cashOnHand: number;
  monthsRunway: number;
  totalDonors: number;
  activeDonors: number;
  lapsedDonors: number;
  activeGrants: number;
  grantsPipeline: number;
  grantsAwaitingDecision: number;
  clientsServed: number;
  programsActive: number;
  pendingAgentActions: number;
  revenueByMonth: { month: string; amount: number }[];
  expensesByCategory: { category: string; amount: number }[];
}
