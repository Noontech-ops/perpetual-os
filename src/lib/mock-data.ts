import type {
  Organization, Constituent, Transaction, Program, Outcome,
  Grant, AgentConfig, AgentAction, DashboardStats, DonorProfile, GivingTransaction,
} from './types';

// --- Organization ---

export const organization: Organization = {
  id: 'org-001',
  name: 'Bay Area Literacy Coalition',
  legalName: 'Bay Area Literacy Coalition Inc.',
  ein: '84-3291057',
  mission: 'Empowering Bay Area communities through literacy — ensuring every adult and child has the reading skills to thrive.',
  vision: 'A Bay Area where literacy is universal and every person can fully participate in civic and economic life.',
  sector: 'education',
  founded: '2018-03-15',
  website: 'https://bayarealiteracy.org',
  address: { street: '1440 Broadway, Suite 510', city: 'Oakland', state: 'CA', zip: '94612' },
  phone: '(510) 555-0142',
  email: 'info@bayarealiteracy.org',
  leadership: [
    { name: 'Maria Santos', title: 'Executive Director', since: '2018-03-15', bio: 'Former Oakland Unified literacy coordinator. 15 years in adult education.' },
    { name: 'David Kim', title: 'Board Chair', since: '2019-01-10', bio: 'Partner at Morrison & Foerster. Pro bono counsel to Bay Area nonprofits.' },
    { name: 'Priya Patel', title: 'Director of Programs', since: '2020-06-01', bio: 'EdD in Literacy Studies from USF. Designed the Youth Reading model.' },
    { name: 'James Thornton', title: 'Development Director', since: '2022-09-01', bio: '10 years in nonprofit fundraising. Previously at Compass Family Services.' },
  ],
  financials: {
    fiscalYearEnd: '2026-12-31',
    annualBudget: 820000,
    totalRevenue: 743000,
    totalExpenses: 698000,
    netAssets: 412000,
    cashOnHand: 195000,
    monthsOfRunway: 3.4,
  },
  programIds: ['prog-001', 'prog-002', 'prog-003'],
  publicProfile: true,
  createdAt: '2024-01-15T00:00:00Z',
  updatedAt: '2026-11-01T00:00:00Z',
};

// --- Constituents ---

export const constituents: Constituent[] = [
  {
    id: 'con-001', type: 'donor', firstName: 'Sarah', lastName: 'Chen', email: 'sarah.chen@gmail.com', phone: '(415) 555-0198',
    organization: 'Salesforce', title: 'VP Engineering',
    address: { street: '88 Kearny St, Apt 12C', city: 'San Francisco', state: 'CA', zip: '94108' },
    tags: ['major_donor', 'tech', 'annual_gala_attendee'],
    givingHistory: { totalLifetime: 47500, lastGiftAmount: 10000, lastGiftDate: '2026-09-15', averageGift: 7917, giftCount: 6, firstGiftDate: '2021-03-22' },
    engagementScore: 92, createdAt: '2021-03-22T00:00:00Z', updatedAt: '2026-09-15T00:00:00Z',
  },
  {
    id: 'con-002', type: 'donor', firstName: 'Michael', lastName: 'Torres', email: 'mtorres@outlook.com', phone: '(510) 555-0234',
    address: { street: '2200 Telegraph Ave', city: 'Oakland', state: 'CA', zip: '94612' },
    tags: ['monthly_donor', 'volunteer_alum'],
    givingHistory: { totalLifetime: 3600, lastGiftAmount: 100, lastGiftDate: '2026-10-01', averageGift: 100, giftCount: 36, firstGiftDate: '2023-11-01' },
    engagementScore: 78, createdAt: '2023-11-01T00:00:00Z', updatedAt: '2026-10-01T00:00:00Z',
  },
  {
    id: 'con-003', type: 'funder', firstName: 'Angela', lastName: 'Whitmore', email: 'awhitmore@sffoundation.org', phone: '(415) 555-0311',
    organization: 'San Francisco Foundation', title: 'Program Officer, Education',
    tags: ['institutional_funder', 'education_focus'],
    givingHistory: { totalLifetime: 150000, lastGiftAmount: 75000, lastGiftDate: '2026-01-15', averageGift: 75000, giftCount: 2, firstGiftDate: '2024-02-01' },
    engagementScore: 85, createdAt: '2023-09-10T00:00:00Z', updatedAt: '2026-01-15T00:00:00Z',
  },
  {
    id: 'con-004', type: 'funder', firstName: 'Robert', lastName: 'Nakamura', email: 'rnakamura@hellmanfoundation.org',
    organization: 'Hellman Foundation', title: 'Grants Manager',
    tags: ['institutional_funder', 'community_focus'],
    givingHistory: { totalLifetime: 50000, lastGiftAmount: 25000, lastGiftDate: '2025-07-01', averageGift: 25000, giftCount: 2, firstGiftDate: '2024-06-15' },
    engagementScore: 70, createdAt: '2024-03-20T00:00:00Z', updatedAt: '2025-07-01T00:00:00Z',
  },
  {
    id: 'con-005', type: 'board', firstName: 'David', lastName: 'Kim', email: 'dkim@mofo.com', phone: '(415) 555-0187',
    organization: 'Morrison & Foerster', title: 'Partner',
    tags: ['board_chair', 'legal', 'governance_committee'],
    givingHistory: { totalLifetime: 25000, lastGiftAmount: 5000, lastGiftDate: '2026-06-01', averageGift: 5000, giftCount: 5, firstGiftDate: '2019-01-10' },
    engagementScore: 95, createdAt: '2019-01-10T00:00:00Z', updatedAt: '2026-06-01T00:00:00Z',
  },
  {
    id: 'con-006', type: 'board', firstName: 'Lisa', lastName: 'Washington', email: 'lwashington@kqed.org',
    organization: 'KQED', title: 'Director of Community Partnerships',
    tags: ['board_member', 'media', 'fundraising_committee'],
    givingHistory: { totalLifetime: 12000, lastGiftAmount: 3000, lastGiftDate: '2026-04-15', averageGift: 3000, giftCount: 4, firstGiftDate: '2022-04-15' },
    engagementScore: 88, createdAt: '2022-04-15T00:00:00Z', updatedAt: '2026-04-15T00:00:00Z',
  },
  {
    id: 'con-007', type: 'volunteer', firstName: 'Amara', lastName: 'Johnson', email: 'amara.j@berkeley.edu',
    tags: ['tutor', 'cal_student', 'youth_program'],
    givingHistory: { totalLifetime: 0, lastGiftAmount: 0, lastGiftDate: '', averageGift: 0, giftCount: 0, firstGiftDate: '' },
    engagementScore: 82, notes: 'UC Berkeley Education major. Tutors Tuesdays & Thursdays.', createdAt: '2025-09-05T00:00:00Z', updatedAt: '2026-10-20T00:00:00Z',
  },
  {
    id: 'con-008', type: 'volunteer', firstName: 'Kevin', lastName: 'O\'Brien', email: 'kobrien.tutor@gmail.com', phone: '(510) 555-0456',
    tags: ['tutor', 'adult_program', 'retired_teacher'],
    givingHistory: { totalLifetime: 500, lastGiftAmount: 250, lastGiftDate: '2026-01-01', averageGift: 250, giftCount: 2, firstGiftDate: '2025-01-01' },
    engagementScore: 75, createdAt: '2024-06-01T00:00:00Z', updatedAt: '2026-10-15T00:00:00Z',
  },
  {
    id: 'con-009', type: 'client', firstName: 'Rosa', lastName: 'Hernandez', email: 'rosa.h@yahoo.com',
    tags: ['adult_learner', 'esl', 'active'],
    givingHistory: { totalLifetime: 0, lastGiftAmount: 0, lastGiftDate: '', averageGift: 0, giftCount: 0, firstGiftDate: '' },
    engagementScore: 65, notes: 'Adult Literacy Program. Started at 4th grade reading level, now at 8th grade.', createdAt: '2025-02-10T00:00:00Z', updatedAt: '2026-10-28T00:00:00Z',
  },
  {
    id: 'con-010', type: 'client', firstName: 'Ahmed', lastName: 'Hassan', email: 'ahmed.hassan@gmail.com',
    tags: ['adult_learner', 'esl', 'active', 'digital_literacy'],
    givingHistory: { totalLifetime: 0, lastGiftAmount: 0, lastGiftDate: '', averageGift: 0, giftCount: 0, firstGiftDate: '' },
    engagementScore: 70, createdAt: '2025-05-15T00:00:00Z', updatedAt: '2026-11-01T00:00:00Z',
  },
  {
    id: 'con-011', type: 'donor', firstName: 'Patricia', lastName: 'Moreno', email: 'pmoreno@gmail.com',
    tags: ['lapsed', 'event_donor'],
    givingHistory: { totalLifetime: 1500, lastGiftAmount: 500, lastGiftDate: '2024-11-15', averageGift: 500, giftCount: 3, firstGiftDate: '2022-11-10' },
    engagementScore: 25, createdAt: '2022-11-10T00:00:00Z', updatedAt: '2024-11-15T00:00:00Z',
  },
  {
    id: 'con-012', type: 'donor', firstName: 'Jonathan', lastName: 'Liu', email: 'jliu@stripe.com',
    organization: 'Stripe', title: 'Software Engineer',
    tags: ['mid_level_donor', 'tech', 'upgrade_ready'],
    givingHistory: { totalLifetime: 5000, lastGiftAmount: 2500, lastGiftDate: '2026-08-20', averageGift: 1250, giftCount: 4, firstGiftDate: '2023-12-01' },
    engagementScore: 68, createdAt: '2023-12-01T00:00:00Z', updatedAt: '2026-08-20T00:00:00Z',
  },
  {
    id: 'con-013', type: 'funder', firstName: 'Catherine', lastName: 'Bell', email: 'cbell@irvine.org',
    organization: 'James Irvine Foundation', title: 'Senior Program Officer',
    tags: ['institutional_funder', 'workforce_focus', 'prospect'],
    givingHistory: { totalLifetime: 0, lastGiftAmount: 0, lastGiftDate: '', averageGift: 0, giftCount: 0, firstGiftDate: '' },
    engagementScore: 40, notes: 'Met at NorCal Grantmakers conference. Interested in workforce-literacy overlap.', createdAt: '2026-06-15T00:00:00Z', updatedAt: '2026-10-30T00:00:00Z',
  },
  {
    id: 'con-014', type: 'donor', firstName: 'Margaret', lastName: 'Cho', email: 'mcho@comcast.net', phone: '(510) 555-0789',
    tags: ['major_donor', 'planned_giving', 'founding_donor'],
    givingHistory: { totalLifetime: 85000, lastGiftAmount: 15000, lastGiftDate: '2026-03-01', averageGift: 10625, giftCount: 8, firstGiftDate: '2018-05-01' },
    engagementScore: 97, notes: 'Founding donor. Has BALC in her estate plan. Annual spring gift.', createdAt: '2018-05-01T00:00:00Z', updatedAt: '2026-03-01T00:00:00Z',
  },
  {
    id: 'con-015', type: 'staff', firstName: 'Maria', lastName: 'Santos', email: 'maria@bayarealiteracy.org', phone: '(510) 555-0142',
    title: 'Executive Director',
    tags: ['leadership', 'founder'],
    givingHistory: { totalLifetime: 2400, lastGiftAmount: 600, lastGiftDate: '2026-07-01', averageGift: 300, giftCount: 8, firstGiftDate: '2019-01-01' },
    engagementScore: 100, createdAt: '2018-03-15T00:00:00Z', updatedAt: '2026-11-01T00:00:00Z',
  },
  {
    id: 'con-016', type: 'donor', firstName: 'Raj', lastName: 'Mehta', email: 'raj.mehta@gmail.com',
    organization: 'Google', title: 'Product Manager',
    tags: ['mid_level_donor', 'tech', 'matching_gift'],
    givingHistory: { totalLifetime: 8000, lastGiftAmount: 2000, lastGiftDate: '2026-07-15', averageGift: 2000, giftCount: 4, firstGiftDate: '2023-07-15' },
    engagementScore: 72, createdAt: '2023-07-15T00:00:00Z', updatedAt: '2026-07-15T00:00:00Z',
  },
];

// --- Programs ---

export const programs: Program[] = [
  {
    id: 'prog-001', name: 'Adult Literacy', description: 'One-on-one and small group instruction for adults reading below 8th-grade level. ESL pathway, GED preparation, and workplace literacy.', sector: 'education', status: 'active',
    startDate: '2018-09-01', annualBudget: 380000, ytdSpend: 315000, staffCount: 4, clientsServed: 187,
    outcomeIds: ['out-001', 'out-002'], grantIds: ['grant-001', 'grant-002'], createdAt: '2018-09-01T00:00:00Z',
  },
  {
    id: 'prog-002', name: 'Youth Reading Corps', description: 'After-school and summer reading program for K–8 students in Title I schools. Trained volunteer tutors deliver evidence-based curriculum.', sector: 'education', status: 'active',
    startDate: '2020-01-15', annualBudget: 295000, ytdSpend: 248000, staffCount: 3, clientsServed: 342,
    outcomeIds: ['out-003', 'out-004'], grantIds: ['grant-003'], createdAt: '2020-01-15T00:00:00Z',
  },
  {
    id: 'prog-003', name: 'Digital Access Initiative', description: 'Chromebook lending library, digital literacy workshops, and community Wi-Fi hotspots. Bridge the digital divide for adult learners and families.', sector: 'education', status: 'active',
    startDate: '2023-03-01', annualBudget: 145000, ytdSpend: 108000, staffCount: 1, clientsServed: 415,
    outcomeIds: ['out-005'], grantIds: ['grant-004'], createdAt: '2023-03-01T00:00:00Z',
  },
];

// --- Outcomes ---

export const outcomes: Outcome[] = [
  {
    id: 'out-001', programId: 'prog-001', sector: 'education', reportingPeriod: '2026-Q3',
    metrics: [
      { label: 'Average reading level gain', value: 2.3, unit: 'grade levels', target: 2.0, periodStart: '2026-01-01', periodEnd: '2026-09-30' },
      { label: 'Learners completing 100+ hours', value: 84, unit: 'learners', target: 80, periodStart: '2026-01-01', periodEnd: '2026-09-30' },
      { label: 'GED completions', value: 22, unit: 'completions', target: 25, periodStart: '2026-01-01', periodEnd: '2026-09-30' },
    ],
    narrative: 'Strong cohort this year. ESL pathway showing particular gains among Spanish-speaking learners.',
    verifiedBy: 'Priya Patel', verifiedAt: '2026-10-15T00:00:00Z', createdAt: '2026-10-15T00:00:00Z',
  },
  {
    id: 'out-002', programId: 'prog-001', sector: 'education', reportingPeriod: '2026-Q3',
    metrics: [
      { label: 'Employment gained/retained', value: 38, unit: 'learners', target: 35, periodStart: '2026-01-01', periodEnd: '2026-09-30' },
      { label: 'Job placements at 90 days', value: 29, unit: 'placements', target: 25, periodStart: '2026-01-01', periodEnd: '2026-09-30' },
    ],
    createdAt: '2026-10-15T00:00:00Z',
  },
  {
    id: 'out-003', programId: 'prog-002', sector: 'education', reportingPeriod: '2026-Q3',
    metrics: [
      { label: 'Students reading at grade level', value: 68, unit: '%', target: 65, periodStart: '2026-01-01', periodEnd: '2026-09-30' },
      { label: 'Average Lexile gain', value: 145, unit: 'Lexile points', target: 120, periodStart: '2026-01-01', periodEnd: '2026-09-30' },
      { label: 'Students served', value: 342, unit: 'students', target: 300, periodStart: '2026-01-01', periodEnd: '2026-09-30' },
    ],
    verifiedBy: 'Priya Patel', verifiedAt: '2026-10-20T00:00:00Z', createdAt: '2026-10-20T00:00:00Z',
  },
  {
    id: 'out-004', programId: 'prog-002', sector: 'education', reportingPeriod: '2026-Q3',
    metrics: [
      { label: 'Volunteer tutor hours', value: 4820, unit: 'hours', target: 4500, periodStart: '2026-01-01', periodEnd: '2026-09-30' },
      { label: 'Active volunteer tutors', value: 67, unit: 'volunteers', target: 60, periodStart: '2026-01-01', periodEnd: '2026-09-30' },
      { label: 'Tutor retention rate', value: 78, unit: '%', target: 75, periodStart: '2026-01-01', periodEnd: '2026-09-30' },
    ],
    createdAt: '2026-10-20T00:00:00Z',
  },
  {
    id: 'out-005', programId: 'prog-003', sector: 'education', reportingPeriod: '2026-Q3',
    metrics: [
      { label: 'Devices lent', value: 189, unit: 'Chromebooks', target: 175, periodStart: '2026-01-01', periodEnd: '2026-09-30' },
      { label: 'Workshop completions', value: 312, unit: 'completions', target: 250, periodStart: '2026-01-01', periodEnd: '2026-09-30' },
      { label: 'Digital skill assessment pass rate', value: 74, unit: '%', target: 70, periodStart: '2026-01-01', periodEnd: '2026-09-30' },
    ],
    createdAt: '2026-10-22T00:00:00Z',
  },
];

// --- Grants ---

export const grants: Grant[] = [
  {
    id: 'grant-001', funderId: 'con-003', funderName: 'San Francisco Foundation', programId: 'prog-001',
    name: 'Adult Literacy Expansion 2026–2027', status: 'active',
    amountRequested: 75000, amountAwarded: 75000, amountSpent: 52500, restriction: 'temporarily_restricted',
    startDate: '2026-01-15', endDate: '2027-01-14',
    deadlines: [
      { type: 'report', date: '2026-12-15', description: 'Mid-year narrative + financial report', completed: false },
      { type: 'renewal', date: '2027-01-01', description: 'Renewal application for Year 3', completed: false },
    ],
    requirements: ['Quarterly outcome data submission', 'Site visit by March 2027', 'Acknowledge in annual report'],
    probability: 100, createdAt: '2025-10-01T00:00:00Z', updatedAt: '2026-10-01T00:00:00Z',
  },
  {
    id: 'grant-002', funderId: 'con-004', funderName: 'Hellman Foundation', programId: 'prog-001',
    name: 'Workplace Literacy Pilot', status: 'active',
    amountRequested: 25000, amountAwarded: 25000, amountSpent: 18750, restriction: 'temporarily_restricted',
    startDate: '2026-04-01', endDate: '2027-03-31',
    deadlines: [
      { type: 'report', date: '2026-12-31', description: 'Year-end progress report', completed: false },
    ],
    requirements: ['Employment outcome tracking for 12 months post-completion'],
    probability: 100, createdAt: '2026-02-15T00:00:00Z', updatedAt: '2026-09-15T00:00:00Z',
  },
  {
    id: 'grant-003', funderId: 'con-003', funderName: 'San Francisco Foundation', programId: 'prog-002',
    name: 'Youth Reading Corps Summer Expansion', status: 'awarded',
    amountRequested: 50000, amountAwarded: 50000, amountSpent: 0, restriction: 'temporarily_restricted',
    startDate: '2027-05-01', endDate: '2027-08-31',
    deadlines: [
      { type: 'application', date: '2026-11-30', description: 'Final grant agreement signing', completed: false },
    ],
    requirements: ['Pre/post Lexile assessments', 'Parent survey', 'Photo release forms'],
    probability: 100, createdAt: '2026-08-01T00:00:00Z', updatedAt: '2026-10-20T00:00:00Z',
  },
  {
    id: 'grant-004', funderId: 'con-013', funderName: 'James Irvine Foundation', programId: 'prog-003',
    name: 'Digital Literacy & Workforce Readiness', status: 'applied',
    amountRequested: 100000, amountAwarded: undefined, amountSpent: 0, restriction: 'temporarily_restricted',
    startDate: undefined, endDate: undefined,
    deadlines: [
      { type: 'application', date: '2026-10-15', description: 'Full proposal submitted', completed: true },
      { type: 'site_visit', date: '2026-12-10', description: 'Virtual site visit with program officer', completed: false },
    ],
    requirements: ['Workforce outcome data', 'Digital assessment tool documentation', 'Collaboration with Alameda County WDB'],
    probability: 55, notes: 'Strong LOI feedback. Catherine Bell excited about digital-workforce pipeline.',
    createdAt: '2026-06-20T00:00:00Z', updatedAt: '2026-10-30T00:00:00Z',
  },
  {
    id: 'grant-005', funderId: 'con-004', funderName: 'Hellman Foundation',
    name: 'General Operating Support 2027', status: 'prospect',
    amountRequested: 40000, amountSpent: 0, restriction: 'unrestricted',
    deadlines: [
      { type: 'loi', date: '2027-02-01', description: 'Letter of inquiry deadline', completed: false },
    ],
    requirements: [],
    probability: 35, notes: 'Robert suggested we apply for GOS after workplace literacy outcomes come in.',
    createdAt: '2026-10-15T00:00:00Z', updatedAt: '2026-10-15T00:00:00Z',
  },
  {
    id: 'grant-006', funderId: 'con-003', funderName: 'San Francisco Foundation', programId: 'prog-001',
    name: 'Adult Literacy Year 1 (2024–2025)', status: 'closed',
    amountRequested: 75000, amountAwarded: 75000, amountSpent: 75000, restriction: 'temporarily_restricted',
    startDate: '2024-02-01', endDate: '2025-01-31',
    deadlines: [],
    requirements: ['Final report submitted 2/28/2025'],
    probability: 100, createdAt: '2023-09-10T00:00:00Z', updatedAt: '2025-03-01T00:00:00Z',
  },
];

// --- Transactions (representative sample — 25 entries) ---

export const transactions: Transaction[] = [
  // Inflows
  { id: 'txn-001', date: '2026-01-15', direction: 'inflow', amount: 75000, category: 'foundation_grant', restriction: 'temporarily_restricted', description: 'SF Foundation — Adult Literacy Year 2', constituentId: 'con-003', grantId: 'grant-001', programId: 'prog-001', accountCode: '4100', reconciled: true, createdAt: '2026-01-15T00:00:00Z' },
  { id: 'txn-002', date: '2026-03-01', direction: 'inflow', amount: 15000, category: 'individual_donation', restriction: 'unrestricted', description: 'Margaret Cho — Annual spring gift', constituentId: 'con-014', accountCode: '4010', reconciled: true, createdAt: '2026-03-01T00:00:00Z' },
  { id: 'txn-003', date: '2026-04-01', direction: 'inflow', amount: 25000, category: 'foundation_grant', restriction: 'temporarily_restricted', description: 'Hellman Foundation — Workplace Literacy Pilot', constituentId: 'con-004', grantId: 'grant-002', programId: 'prog-001', accountCode: '4100', reconciled: true, createdAt: '2026-04-01T00:00:00Z' },
  { id: 'txn-004', date: '2026-04-15', direction: 'inflow', amount: 3000, category: 'individual_donation', restriction: 'unrestricted', description: 'Lisa Washington — Board annual gift', constituentId: 'con-006', accountCode: '4010', reconciled: true, createdAt: '2026-04-15T00:00:00Z' },
  { id: 'txn-005', date: '2026-05-20', direction: 'inflow', amount: 45000, category: 'event_revenue', restriction: 'unrestricted', description: 'Annual Gala net proceeds', accountCode: '4300', reconciled: true, createdAt: '2026-05-20T00:00:00Z' },
  { id: 'txn-006', date: '2026-06-01', direction: 'inflow', amount: 5000, category: 'individual_donation', restriction: 'unrestricted', description: 'David Kim — Board annual gift', constituentId: 'con-005', accountCode: '4010', reconciled: true, createdAt: '2026-06-01T00:00:00Z' },
  { id: 'txn-007', date: '2026-07-15', direction: 'inflow', amount: 2000, category: 'individual_donation', restriction: 'unrestricted', description: 'Raj Mehta — Annual gift + Google match', constituentId: 'con-016', accountCode: '4010', reconciled: true, createdAt: '2026-07-15T00:00:00Z' },
  { id: 'txn-008', date: '2026-07-15', direction: 'inflow', amount: 2000, category: 'corporate_gift', restriction: 'unrestricted', description: 'Google Matching Gift — Raj Mehta', accountCode: '4020', reconciled: true, createdAt: '2026-07-15T00:00:00Z' },
  { id: 'txn-009', date: '2026-08-20', direction: 'inflow', amount: 2500, category: 'individual_donation', restriction: 'unrestricted', description: 'Jonathan Liu — Mid-year gift', constituentId: 'con-012', accountCode: '4010', reconciled: true, createdAt: '2026-08-20T00:00:00Z' },
  { id: 'txn-010', date: '2026-09-15', direction: 'inflow', amount: 10000, category: 'individual_donation', restriction: 'unrestricted', description: 'Sarah Chen — Annual major gift', constituentId: 'con-001', accountCode: '4010', reconciled: true, createdAt: '2026-09-15T00:00:00Z' },
  { id: 'txn-025', date: '2026-10-01', direction: 'inflow', amount: 100, category: 'individual_donation', restriction: 'unrestricted', description: 'Michael Torres — Monthly recurring', constituentId: 'con-002', accountCode: '4010', reconciled: true, createdAt: '2026-10-01T00:00:00Z' },
  { id: 'txn-026', date: '2026-10-15', direction: 'inflow', amount: 18500, category: 'earned_revenue', restriction: 'unrestricted', description: 'Workplace literacy contracts — Q3 invoices', accountCode: '4400', reconciled: false, createdAt: '2026-10-15T00:00:00Z' },

  // Outflows
  { id: 'txn-011', date: '2026-01-31', direction: 'outflow', amount: 42000, category: 'salary', restriction: 'unrestricted', description: 'January payroll — all staff', accountCode: '6100', reconciled: true, createdAt: '2026-01-31T00:00:00Z' },
  { id: 'txn-012', date: '2026-01-31', direction: 'outflow', amount: 8400, category: 'benefits', restriction: 'unrestricted', description: 'January benefits — health, dental, 401k', accountCode: '6110', reconciled: true, createdAt: '2026-01-31T00:00:00Z' },
  { id: 'txn-013', date: '2026-02-01', direction: 'outflow', amount: 4800, category: 'rent', restriction: 'unrestricted', description: 'February office rent — 1440 Broadway', accountCode: '6200', reconciled: true, createdAt: '2026-02-01T00:00:00Z' },
  { id: 'txn-014', date: '2026-03-15', direction: 'outflow', amount: 12000, category: 'program_expense', restriction: 'temporarily_restricted', description: 'Curriculum materials — Adult Literacy (SF Foundation grant)', grantId: 'grant-001', programId: 'prog-001', accountCode: '7100', reconciled: true, createdAt: '2026-03-15T00:00:00Z' },
  { id: 'txn-015', date: '2026-04-10', direction: 'outflow', amount: 8500, category: 'technology', restriction: 'unrestricted', description: 'Chromebook purchase — 25 units for lending library', programId: 'prog-003', accountCode: '6500', reconciled: true, createdAt: '2026-04-10T00:00:00Z' },
  { id: 'txn-016', date: '2026-05-01', direction: 'outflow', amount: 3200, category: 'professional_services', restriction: 'unrestricted', description: 'Annual audit — Marcum LLP deposit', accountCode: '6300', reconciled: true, createdAt: '2026-05-01T00:00:00Z' },
  { id: 'txn-017', date: '2026-06-30', direction: 'outflow', amount: 42000, category: 'salary', restriction: 'unrestricted', description: 'June payroll — all staff', accountCode: '6100', reconciled: true, createdAt: '2026-06-30T00:00:00Z' },
  { id: 'txn-018', date: '2026-07-01', direction: 'outflow', amount: 4800, category: 'rent', restriction: 'unrestricted', description: 'July office rent', accountCode: '6200', reconciled: true, createdAt: '2026-07-01T00:00:00Z' },
  { id: 'txn-019', date: '2026-08-15', direction: 'outflow', amount: 6500, category: 'program_expense', restriction: 'temporarily_restricted', description: 'Summer reading materials + snacks — Youth Reading Corps', programId: 'prog-002', accountCode: '7100', reconciled: true, createdAt: '2026-08-15T00:00:00Z' },
  { id: 'txn-020', date: '2026-09-01', direction: 'outflow', amount: 1800, category: 'insurance', restriction: 'unrestricted', description: 'D&O + general liability — quarterly', accountCode: '6400', reconciled: true, createdAt: '2026-09-01T00:00:00Z' },
  { id: 'txn-021', date: '2026-09-30', direction: 'outflow', amount: 42000, category: 'salary', restriction: 'unrestricted', description: 'September payroll — all staff', accountCode: '6100', reconciled: true, createdAt: '2026-09-30T00:00:00Z' },
  { id: 'txn-022', date: '2026-10-15', direction: 'outflow', amount: 2400, category: 'fundraising_expense', restriction: 'unrestricted', description: 'Year-end appeal printing + postage', accountCode: '6600', reconciled: false, createdAt: '2026-10-15T00:00:00Z' },
  { id: 'txn-023', date: '2026-10-20', direction: 'outflow', amount: 950, category: 'travel', restriction: 'unrestricted', description: 'Maria Santos — NorCal Grantmakers conference', accountCode: '6350', reconciled: false, createdAt: '2026-10-20T00:00:00Z' },
];

// --- Agent Configs ---

export const agentConfigs: AgentConfig[] = [
  { type: 'grants', name: 'Grants Agent', description: 'Discovers funders, drafts proposals, tracks deadlines, writes reports.', scope: ['grants', 'outcomes', 'programs', 'constituents:funders'], approvalThreshold: 5000, enabled: true, lastRunAt: '2026-11-07T08:00:00Z', actionsToday: 4, actionsPending: 2 },
  { type: 'donor_relations', name: 'Donor Relations Agent', description: 'Segments donors, drafts stewardship, flags lapsed & upgrade-ready donors.', scope: ['constituents:donors', 'transactions:donations'], approvalThreshold: 1000, enabled: true, lastRunAt: '2026-11-07T07:30:00Z', actionsToday: 6, actionsPending: 1 },
  { type: 'finance', name: 'Finance Agent', description: 'Restricted-fund tracking, grant burn, monthly close, cash forecast.', scope: ['transactions', 'grants:financials', 'programs:budgets'], approvalThreshold: 10000, enabled: true, lastRunAt: '2026-11-07T06:00:00Z', actionsToday: 12, actionsPending: 0 },
  { type: 'compliance', name: 'Compliance Agent', description: 'Form 990, state registrations, acknowledgment rules, grant covenants.', scope: ['organization', 'transactions', 'grants:compliance'], approvalThreshold: 0, enabled: true, lastRunAt: '2026-11-06T22:00:00Z', actionsToday: 1, actionsPending: 0 },
  { type: 'marketing', name: 'Marketing Agent', description: 'Public site, campaign pages, email & social from program data.', scope: ['programs', 'outcomes', 'organization:public'], approvalThreshold: 500, enabled: false, lastRunAt: undefined, actionsToday: 0, actionsPending: 0 },
  { type: 'board', name: 'Board Agent', description: 'Board packets, minutes, resolutions, governance dashboard.', scope: ['organization', 'financials:summary', 'programs:summary'], approvalThreshold: 0, enabled: false, lastRunAt: undefined, actionsToday: 0, actionsPending: 0 },
];

// --- Agent Actions ---

export const agentActions: AgentAction[] = [
  {
    id: 'aa-001', agentType: 'grants', action: 'deadline_reminder', description: 'SF Foundation mid-year report due Dec 15. Draft started from Q3 outcomes data.',
    status: 'auto_approved', evidence: 'Grant grant-001 requires narrative + financial report. 38 days remaining.', createdAt: '2026-11-07T08:00:00Z',
  },
  {
    id: 'aa-002', agentType: 'grants', action: 'site_visit_prep', description: 'Prepared briefing doc for James Irvine Foundation virtual site visit (Dec 10).',
    status: 'auto_approved', evidence: 'Grant grant-004 site visit scheduled. Compiled program data, outcomes, and budget vs. actuals.', createdAt: '2026-11-07T08:05:00Z',
  },
  {
    id: 'aa-003', agentType: 'grants', action: 'proposal_draft', description: 'Draft LOI for Hellman Foundation General Operating Support ($40K) — ready for ED review.',
    status: 'pending', evidence: 'Grant grant-005 LOI due Feb 1, 2027. Draft incorporates workplace literacy outcomes and 2026 financials.', createdAt: '2026-11-07T08:10:00Z',
  },
  {
    id: 'aa-004', agentType: 'grants', action: 'funder_match', description: 'Identified Silicon Valley Community Foundation as potential match — education portfolio, $25K–$75K range.',
    status: 'pending', evidence: 'SVCF funded 12 literacy programs in 2025. Application window opens Jan 15, 2027.', createdAt: '2026-11-07T08:15:00Z',
  },
  {
    id: 'aa-005', agentType: 'donor_relations', action: 'lapsed_donor_alert', description: 'Patricia Moreno lapsed — last gift Nov 2024. Drafted re-engagement email with program update.',
    status: 'pending', evidence: 'Constituent con-011 engagement score dropped to 25. 3 gifts totaling $1,500. Previously attended gala.', createdAt: '2026-11-07T07:30:00Z',
  },
  {
    id: 'aa-006', agentType: 'donor_relations', action: 'upgrade_recommendation', description: 'Jonathan Liu flagged for upgrade ask — $2,500 last gift, consistent growth pattern, Stripe engineer.',
    status: 'auto_approved', evidence: 'con-012: 4 gifts, $1K → $1.5K → $2K → $2.5K. Engagement score 68. Recommend $5K ask with impact report.', createdAt: '2026-11-07T07:35:00Z',
  },
  {
    id: 'aa-007', agentType: 'donor_relations', action: 'stewardship_email', description: 'Sent Q3 impact update to all donors who gave $1K+ in 2026.',
    status: 'auto_approved', evidence: 'Segmented 8 donors. Email includes reading level gains, job placements, and digital access metrics.', createdAt: '2026-11-06T14:00:00Z',
  },
  {
    id: 'aa-008', agentType: 'donor_relations', action: 'major_gift_brief', description: 'Prepared major gift brief for Sarah Chen — $10K donor, 6-year history, $47.5K lifetime.',
    status: 'auto_approved', evidence: 'con-001. Salesforce VP. Gala attendee. Suggest year-end conversation for multi-year commitment.', createdAt: '2026-11-07T07:40:00Z',
  },
  {
    id: 'aa-009', agentType: 'finance', action: 'reconciliation', description: 'October bank reconciliation completed — 2 unreconciled items flagged.',
    status: 'auto_approved', evidence: 'Bank balance $195,420. Book balance $195,370. Difference: $50 bank fee not yet recorded. txn-022 and txn-023 unreconciled.', createdAt: '2026-11-07T06:00:00Z',
  },
  {
    id: 'aa-010', agentType: 'finance', action: 'cash_forecast', description: 'Updated 6-month cash forecast. Runway: 3.4 months at current burn. Year-end appeal critical.',
    status: 'auto_approved', evidence: 'Monthly burn $57K. Cash $195K. Expected inflows: $50K SF Foundation (awarded), $40K year-end appeal (est). Tight through Q1 2027 without Irvine grant.', createdAt: '2026-11-07T06:15:00Z',
  },
  {
    id: 'aa-011', agentType: 'finance', action: 'grant_burn_alert', description: 'SF Foundation grant-001: 70% spent with 45 days remaining. On track.',
    status: 'auto_approved', evidence: 'grant-001: $75K awarded, $52.5K spent. Remaining $22.5K allocated for Nov–Dec program expenses.', createdAt: '2026-11-07T06:20:00Z',
  },
  {
    id: 'aa-012', agentType: 'compliance', action: 'acknowledgment_check', description: 'All 2026 gifts $250+ have acknowledgment letters on file. 100% compliant.',
    status: 'auto_approved', evidence: 'Checked 14 qualifying gifts against IRS acknowledgment rules. All letters sent within 30 days.', createdAt: '2026-11-06T22:00:00Z',
  },
];

// --- Dashboard Stats ---

export const dashboardStats: DashboardStats = {
  totalRevenue: 743000,
  totalExpenses: 698000,
  netIncome: 45000,
  cashOnHand: 195000,
  monthsRunway: 3.4,
  totalDonors: 48,
  activeDonors: 35,
  lapsedDonors: 13,
  activeGrants: 2,
  grantsPipeline: 3,
  grantsAwaitingDecision: 1,
  clientsServed: 944,
  programsActive: 3,
  pendingAgentActions: 3,
  revenueByMonth: [
    { month: 'Jan', amount: 76200 },
    { month: 'Feb', amount: 12400 },
    { month: 'Mar', amount: 18500 },
    { month: 'Apr', amount: 31800 },
    { month: 'May', amount: 52300 },
    { month: 'Jun', amount: 9200 },
    { month: 'Jul', amount: 8400 },
    { month: 'Aug', amount: 5100 },
    { month: 'Sep', amount: 14800 },
    { month: 'Oct', amount: 21600 },
    { month: 'Nov', amount: 0 },
    { month: 'Dec', amount: 0 },
  ],
  expensesByCategory: [
    { category: 'Personnel', amount: 403200 },
    { category: 'Program', amount: 142000 },
    { category: 'Occupancy', amount: 48000 },
    { category: 'Technology', amount: 28500 },
    { category: 'Professional Services', amount: 22000 },
    { category: 'Fundraising', amount: 18400 },
    { category: 'Insurance', amount: 7200 },
    { category: 'Travel', amount: 6800 },
    { category: 'Other', amount: 21900 },
  ],
};

// --- Donor Marketplace Data ---

export const donorProfiles: DonorProfile[] = [
  {
    id: 'dp-001', constituentId: 'con-001', displayName: 'Sarah C.',
    interests: ['education'], geographicFocus: ['local', 'regional'],
    givingBudget: { annual: 25000, currency: 'USD' },
    portfolio: [
      { organizationId: 'org-001', organizationName: 'Bay Area Literacy Coalition', totalGiven: 47500, lastGiftDate: '2026-09-15', giftCount: 6 },
    ],
    totalGiven: 47500, joinedAt: '2025-01-15T00:00:00Z',
  },
  {
    id: 'dp-002', displayName: 'Anonymous Donor',
    interests: ['education', 'workforce', 'community'],
    geographicFocus: ['national'],
    givingBudget: { annual: 100000, currency: 'USD' },
    portfolio: [
      { organizationId: 'org-001', organizationName: 'Bay Area Literacy Coalition', totalGiven: 5000, lastGiftDate: '2026-06-01', giftCount: 1 },
    ],
    totalGiven: 82000, joinedAt: '2025-06-01T00:00:00Z',
  },
];

export const givingTransactions: GivingTransaction[] = [
  {
    id: 'gt-001', donorProfileId: 'dp-001', organizationId: 'org-001',
    amount: 10000, method: 'daf', fee: 0, feePercent: 0, netToOrg: 10000,
    status: 'completed', acknowledgmentSent: true, taxReceiptIssued: false,
    designation: 'Unrestricted', createdAt: '2026-09-15T00:00:00Z',
  },
  {
    id: 'gt-002', donorProfileId: 'dp-002', organizationId: 'org-001',
    amount: 5000, method: 'card', fee: 100, feePercent: 2, netToOrg: 4900,
    status: 'completed', acknowledgmentSent: true, taxReceiptIssued: true,
    designation: 'Youth Reading Corps', createdAt: '2026-06-01T00:00:00Z',
  },
];
