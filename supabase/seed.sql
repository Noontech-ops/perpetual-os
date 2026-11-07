-- Seed data matching src/lib/mock-data.ts
-- Run after 001_schema.sql

insert into organizations (id, name, legal_name, ein, mission, vision, sector, founded, website, address, phone, email, leadership, financials, public_profile, created_at, updated_at) values
('org-001', 'Bay Area Literacy Coalition', 'Bay Area Literacy Coalition Inc.', '84-3291057',
 'Empowering Bay Area communities through literacy — ensuring every adult and child has the reading skills to thrive.',
 'A Bay Area where literacy is universal and every person can fully participate in civic and economic life.',
 'education', '2018-03-15', 'https://bayarealiteracy.org',
 '{"street":"1440 Broadway, Suite 510","city":"Oakland","state":"CA","zip":"94612"}',
 '(510) 555-0142', 'info@bayarealiteracy.org',
 '[{"name":"Maria Santos","title":"Executive Director","since":"2018-03-15","bio":"Former Oakland Unified literacy coordinator. 15 years in adult education."},{"name":"David Kim","title":"Board Chair","since":"2019-01-10","bio":"Partner at Morrison & Foerster. Pro bono counsel to Bay Area nonprofits."},{"name":"Priya Patel","title":"Director of Programs","since":"2020-06-01","bio":"EdD in Literacy Studies from USF. Designed the Youth Reading model."},{"name":"James Thornton","title":"Development Director","since":"2022-09-01","bio":"10 years in nonprofit fundraising. Previously at Compass Family Services."}]',
 '{"fiscalYearEnd":"2026-12-31","annualBudget":820000,"totalRevenue":743000,"totalExpenses":698000,"netAssets":412000,"cashOnHand":195000,"monthsOfRunway":3.4}',
 true, '2024-01-15T00:00:00Z', '2026-11-01T00:00:00Z');

-- Programs
insert into programs (id, organization_id, name, description, sector, status, start_date, annual_budget, ytd_spend, staff_count, clients_served, created_at) values
('prog-001', 'org-001', 'Adult Literacy', 'One-on-one and small group instruction for adults reading below 8th-grade level. ESL pathway, GED preparation, and workplace literacy.', 'education', 'active', '2018-09-01', 380000, 315000, 4, 187, '2018-09-01T00:00:00Z'),
('prog-002', 'org-001', 'Youth Reading Corps', 'After-school and summer reading program for K–8 students in Title I schools. Trained volunteer tutors deliver evidence-based curriculum.', 'education', 'active', '2020-01-15', 295000, 248000, 3, 342, '2020-01-15T00:00:00Z'),
('prog-003', 'org-001', 'Digital Access Initiative', 'Chromebook lending library, digital literacy workshops, and community Wi-Fi hotspots. Bridge the digital divide for adult learners and families.', 'education', 'active', '2023-03-01', 145000, 108000, 1, 415, '2023-03-01T00:00:00Z');

-- Constituents (sample)
insert into constituents (id, organization_id, type, first_name, last_name, email, phone, org_affiliation, title, tags, giving_history, engagement_score, created_at, updated_at) values
('con-001', 'org-001', 'donor', 'Sarah', 'Chen', 'sarah.chen@gmail.com', '(415) 555-0198', 'Salesforce', 'VP Engineering', '{"major_donor","tech","annual_gala_attendee"}', '{"totalLifetime":47500,"lastGiftAmount":10000,"lastGiftDate":"2026-09-15","averageGift":7917,"giftCount":6,"firstGiftDate":"2021-03-22"}', 92, '2021-03-22T00:00:00Z', '2026-09-15T00:00:00Z'),
('con-003', 'org-001', 'funder', 'Angela', 'Whitmore', 'awhitmore@sffoundation.org', '(415) 555-0311', 'San Francisco Foundation', 'Program Officer, Education', '{"institutional_funder","education_focus"}', '{"totalLifetime":150000,"lastGiftAmount":75000,"lastGiftDate":"2026-01-15","averageGift":75000,"giftCount":2,"firstGiftDate":"2024-02-01"}', 85, '2023-09-10T00:00:00Z', '2026-01-15T00:00:00Z'),
('con-004', 'org-001', 'funder', 'Robert', 'Nakamura', 'rnakamura@hellmanfoundation.org', null, 'Hellman Foundation', 'Grants Manager', '{"institutional_funder","community_focus"}', '{"totalLifetime":50000,"lastGiftAmount":25000,"lastGiftDate":"2025-07-01","averageGift":25000,"giftCount":2,"firstGiftDate":"2024-06-15"}', 70, '2024-03-20T00:00:00Z', '2025-07-01T00:00:00Z'),
('con-005', 'org-001', 'board', 'David', 'Kim', 'dkim@mofo.com', '(415) 555-0187', 'Morrison & Foerster', 'Partner', '{"board_chair","legal","governance_committee"}', '{"totalLifetime":25000,"lastGiftAmount":5000,"lastGiftDate":"2026-06-01","averageGift":5000,"giftCount":5,"firstGiftDate":"2019-01-10"}', 95, '2019-01-10T00:00:00Z', '2026-06-01T00:00:00Z'),
('con-013', 'org-001', 'funder', 'Catherine', 'Bell', 'cbell@irvine.org', null, 'James Irvine Foundation', 'Senior Program Officer', '{"institutional_funder","workforce_focus","prospect"}', '{"totalLifetime":0,"lastGiftAmount":0,"lastGiftDate":"","averageGift":0,"giftCount":0,"firstGiftDate":""}', 40, '2026-06-15T00:00:00Z', '2026-10-30T00:00:00Z'),
('con-014', 'org-001', 'donor', 'Margaret', 'Cho', 'mcho@comcast.net', '(510) 555-0789', null, null, '{"major_donor","planned_giving","founding_donor"}', '{"totalLifetime":85000,"lastGiftAmount":15000,"lastGiftDate":"2026-03-01","averageGift":10625,"giftCount":8,"firstGiftDate":"2018-05-01"}', 97, '2018-05-01T00:00:00Z', '2026-03-01T00:00:00Z');

-- Grants
insert into grants (id, organization_id, funder_id, funder_name, program_id, name, status, amount_requested, amount_awarded, amount_spent, restriction, start_date, end_date, deadlines, requirements, probability, notes, created_at, updated_at) values
('grant-001', 'org-001', 'con-003', 'San Francisco Foundation', 'prog-001', 'Adult Literacy Expansion 2026–2027', 'active', 75000, 75000, 52500, 'temporarily_restricted', '2026-01-15', '2027-01-14', '[{"type":"report","date":"2026-12-15","description":"Mid-year narrative + financial report","completed":false},{"type":"renewal","date":"2027-01-01","description":"Renewal application for Year 3","completed":false}]', '{"Quarterly outcome data submission","Site visit by March 2027","Acknowledge in annual report"}', 100, null, '2025-10-01T00:00:00Z', '2026-10-01T00:00:00Z'),
('grant-004', 'org-001', 'con-013', 'James Irvine Foundation', 'prog-003', 'Digital Literacy & Workforce Readiness', 'applied', 100000, null, 0, 'temporarily_restricted', null, null, '[{"type":"application","date":"2026-10-15","description":"Full proposal submitted","completed":true},{"type":"site_visit","date":"2026-12-10","description":"Virtual site visit with program officer","completed":false}]', '{"Workforce outcome data","Digital assessment tool documentation","Collaboration with Alameda County WDB"}', 55, 'Strong LOI feedback. Catherine Bell excited about digital-workforce pipeline.', '2026-06-20T00:00:00Z', '2026-10-30T00:00:00Z');

-- Outcomes
insert into outcomes (id, program_id, organization_id, sector, reporting_period, metrics, narrative, verified_by, verified_at, created_at) values
('out-001', 'prog-001', 'org-001', 'education', '2026-Q3', '[{"label":"Average reading level gain","value":2.3,"unit":"grade levels","target":2.0,"periodStart":"2026-01-01","periodEnd":"2026-09-30"},{"label":"Learners completing 100+ hours","value":84,"unit":"learners","target":80,"periodStart":"2026-01-01","periodEnd":"2026-09-30"},{"label":"GED completions","value":22,"unit":"completions","target":25,"periodStart":"2026-01-01","periodEnd":"2026-09-30"}]', 'Strong cohort this year. ESL pathway showing particular gains among Spanish-speaking learners.', 'Priya Patel', '2026-10-15T00:00:00Z', '2026-10-15T00:00:00Z'),
('out-003', 'prog-002', 'org-001', 'education', '2026-Q3', '[{"label":"Students reading at grade level","value":68,"unit":"%","target":65,"periodStart":"2026-01-01","periodEnd":"2026-09-30"},{"label":"Average Lexile gain","value":145,"unit":"Lexile points","target":120,"periodStart":"2026-01-01","periodEnd":"2026-09-30"},{"label":"Students served","value":342,"unit":"students","target":300,"periodStart":"2026-01-01","periodEnd":"2026-09-30"}]', null, 'Priya Patel', '2026-10-20T00:00:00Z', '2026-10-20T00:00:00Z');

-- Agent configs
insert into agent_configs (organization_id, type, name, description, scope, approval_threshold, enabled, last_run_at, actions_today, actions_pending) values
('org-001', 'grants', 'Grants Agent', 'Discovers funders, drafts proposals, tracks deadlines, writes reports.', '{"grants","outcomes","programs","constituents:funders"}', 5000, true, '2026-11-07T08:00:00Z', 4, 2),
('org-001', 'donor_relations', 'Donor Relations Agent', 'Segments donors, drafts stewardship, flags lapsed & upgrade-ready donors.', '{"constituents:donors","transactions:donations"}', 1000, true, '2026-11-07T07:30:00Z', 6, 1),
('org-001', 'finance', 'Finance Agent', 'Restricted-fund tracking, grant burn, monthly close, cash forecast.', '{"transactions","grants:financials","programs:budgets"}', 10000, true, '2026-11-07T06:00:00Z', 12, 0),
('org-001', 'compliance', 'Compliance Agent', 'Form 990, state registrations, acknowledgment rules, grant covenants.', '{"organization","transactions","grants:compliance"}', 0, true, '2026-11-06T22:00:00Z', 1, 0),
('org-001', 'marketing', 'Marketing Agent', 'Public site, campaign pages, email & social from program data.', '{"programs","outcomes","organization:public"}', 500, false, null, 0, 0),
('org-001', 'board', 'Board Agent', 'Board packets, minutes, resolutions, governance dashboard.', '{"organization","financials:summary","programs:summary"}', 0, false, null, 0, 0);

-- Agent actions (sample)
insert into agent_actions (id, organization_id, agent_type, action, description, status, evidence, created_at) values
('aa-001', 'org-001', 'grants', 'deadline_reminder', 'SF Foundation mid-year report due Dec 15. Draft started from Q3 outcomes data.', 'auto_approved', 'Grant grant-001 requires narrative + financial report. 38 days remaining.', '2026-11-07T08:00:00Z'),
('aa-003', 'org-001', 'grants', 'proposal_draft', 'Draft LOI for Hellman Foundation General Operating Support ($40K) — ready for ED review.', 'pending', 'Grant grant-005 LOI due Feb 1, 2027. Draft incorporates workplace literacy outcomes and 2026 financials.', '2026-11-07T08:10:00Z'),
('aa-005', 'org-001', 'donor_relations', 'lapsed_donor_alert', 'Patricia Moreno lapsed — last gift Nov 2024. Drafted re-engagement email with program update.', 'pending', 'Constituent con-011 engagement score dropped to 25. 3 gifts totaling $1,500. Previously attended gala.', '2026-11-07T07:30:00Z'),
('aa-009', 'org-001', 'finance', 'reconciliation', 'October bank reconciliation completed — 2 unreconciled items flagged.', 'auto_approved', 'Bank balance $195,420. Book balance $195,370. Difference: $50 bank fee not yet recorded.', '2026-11-07T06:00:00Z');
