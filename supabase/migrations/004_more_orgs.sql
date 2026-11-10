-- Add slug column (idempotent)
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS slug text UNIQUE;
CREATE INDEX IF NOT EXISTS idx_organizations_slug ON organizations(slug);

-- Set slug for seed org
UPDATE organizations SET slug = 'bay-area-literacy-coalition' WHERE id = 'org-001';

-- ============================================================
-- Org 2: Stable Ground Housing (Denver, CO — housing)
-- ============================================================
INSERT INTO organizations (id, name, legal_name, ein, mission, vision, sector, founded, website, address, phone, email, leadership, financials, public_profile, slug)
VALUES (
  'org-002',
  'Stable Ground Housing',
  'Stable Ground Housing Inc.',
  '27-4518963',
  'Providing stable, affordable housing and wraparound support services to families experiencing homelessness in the Denver metro area.',
  'A Denver where every family has a safe and stable place to call home.',
  'housing',
  '2015-06-01',
  'https://stablegroundhousing.org',
  '{"street":"2100 Stout St, Suite 300","city":"Denver","state":"CO","zip":"80205"}',
  '(303) 555-0198',
  'info@stablegroundhousing.org',
  '[{"name":"Ana Gutierrez","title":"Executive Director","since":"2015-06-01","bio":"Former Denver Housing Authority policy director. 12 years in affordable housing."},{"name":"Michael Torres","title":"Board Chair","since":"2017-03-15","bio":"Managing Partner at Torres Capital. Focused on impact investing in housing."},{"name":"Rachel Adams","title":"Director of Programs","since":"2019-01-10","bio":"MSW from DU. Previously at Colorado Coalition for the Homeless."}]',
  '{"fiscalYearEnd":"2026-12-31","annualBudget":2100000,"totalRevenue":1850000,"totalExpenses":1720000,"netAssets":680000,"cashOnHand":310000,"monthsOfRunway":4}',
  true,
  'stable-ground-housing'
);

INSERT INTO programs (id, organization_id, name, description, sector, status, start_date, annual_budget, ytd_spend, staff_count, clients_served) VALUES
  ('prog-004', 'org-002', 'Family Housing First', 'Rapid rehousing program connecting families experiencing homelessness with stable, affordable housing and 12 months of wraparound support.', 'housing', 'active', '2016-01-01', 950000, 680000, 8, 156),
  ('prog-005', 'org-002', 'Housing Stability Support', 'Case management, employment coaching, and financial literacy services to help housed families maintain long-term stability.', 'housing', 'active', '2017-03-01', 750000, 520000, 6, 210),
  ('prog-006', 'org-002', 'Youth Transition Program', 'Supportive housing and life-skills training for young adults ages 18-24 aging out of the foster care system.', 'housing', 'active', '2020-01-01', 400000, 290000, 4, 45);

INSERT INTO outcomes (id, program_id, organization_id, sector, reporting_period, metrics, narrative) VALUES
  ('out-003', 'prog-004', 'org-002', 'housing', '2026 Annual', '[{"label":"Avg months housing stability","value":18.3,"unit":"months","target":24,"periodStart":"2026-01-01","periodEnd":"2026-12-31"},{"label":"Families maintaining housing 12mo","value":89,"unit":"percent","target":95,"periodStart":"2026-01-01","periodEnd":"2026-12-31"},{"label":"Families housed in 2026","value":156,"unit":"families","target":180,"periodStart":"2026-01-01","periodEnd":"2026-12-31"}]', 'Housing stability continues to improve year-over-year. The average family now maintains housing for 18.3 months, up 8% from 2025.'),
  ('out-004', 'prog-005', 'org-002', 'housing', '2026 Annual', '[{"label":"Families in case management","value":210,"unit":"families","target":250,"periodStart":"2026-01-01","periodEnd":"2026-12-31"},{"label":"Employment placement rate","value":72,"unit":"percent","target":80,"periodStart":"2026-01-01","periodEnd":"2026-12-31"}]', 'Employment outcomes remain strong with 72% of participants finding stable employment within 6 months of enrollment.');

INSERT INTO constituents (id, organization_id, type, first_name, last_name, email, phone, org_affiliation, title, tags, giving_history, engagement_score) VALUES
  ('con-010', 'org-002', 'funder', 'Robert', 'Chen', 'rchen@coloradotrust.org', '(303) 555-0301', 'The Colorado Trust', 'Program Officer', '{"housing","funder","colorado"}', '{"totalLifetime":150000,"lastGiftAmount":75000,"lastGiftDate":"2026-03-15","averageGift":75000,"giftCount":2,"firstGiftDate":"2025-02-01"}', 85),
  ('con-011', 'org-002', 'donor', 'Linda', 'Morales', 'linda.morales@gmail.com', '(303) 555-0422', NULL, NULL, '{"housing","individual","recurring"}', '{"totalLifetime":12500,"lastGiftAmount":2500,"lastGiftDate":"2026-08-01","averageGift":2500,"giftCount":5,"firstGiftDate":"2022-01-15"}', 72),
  ('con-012', 'org-002', 'funder', 'Patricia', 'Webb', 'pwebb@grantmakers.org', '(303) 555-0190', 'Colorado Housing Finance Authority', 'Grants Manager', '{"housing","government","funder"}', '{"totalLifetime":200000,"lastGiftAmount":100000,"lastGiftDate":"2026-01-10","averageGift":100000,"giftCount":2,"firstGiftDate":"2024-07-01"}', 90);

INSERT INTO grants (id, organization_id, funder_id, funder_name, program_id, name, status, amount_requested, amount_awarded, amount_spent, restriction, start_date, end_date, deadlines, requirements, probability, notes) VALUES
  ('grant-007', 'org-002', 'con-010', 'The Colorado Trust', 'prog-004', 'Family Housing Expansion 2026', 'active', 75000, 75000, 48000, 'temporarily_restricted', '2026-01-15', '2026-12-31', '[{"type":"report","date":"2026-12-01","description":"Year-end narrative and financial report","completed":false}]', '{"Quarterly housing placement data","Client satisfaction surveys"}', 100, 'Second year of funding. Strong relationship with program officer.'),
  ('grant-008', 'org-002', 'con-012', 'Colorado Housing Finance Authority', 'prog-006', 'Youth Transition Housing Support', 'applied', 120000, NULL, 0, 'temporarily_restricted', NULL, NULL, '[{"type":"application","date":"2026-12-15","description":"Full proposal deadline","completed":false}]', '{"Youth outcome tracking","Foster care system coordination"}', 60, 'New funder. Submitted LOI in September; invited to full proposal.'),
  ('grant-009', 'org-002', NULL, 'Denver Foundation', NULL, 'General Operating Support 2027', 'prospect', 50000, NULL, 0, 'unrestricted', NULL, NULL, '[{"type":"loi","date":"2027-02-15","description":"Letter of inquiry deadline","completed":false}]', '{}', 40, 'Board chair has connection to the foundation.');

INSERT INTO agent_configs (id, organization_id, type, name, description, scope, approval_threshold, enabled) VALUES
  ('ac-007', 'org-002', 'grants', 'Grants Agent', 'Discovers funders, drafts proposals, tracks deadlines, writes reports.', '{"grants","outcomes","programs","constituents:funders"}', 5000, true),
  ('ac-008', 'org-002', 'donor_relations', 'Donor Relations Agent', 'Segments donors, drafts stewardship, flags lapsed & upgrade-ready donors.', '{"constituents:donors","transactions:donations"}', 1000, true),
  ('ac-009', 'org-002', 'finance', 'Finance Agent', 'Restricted-fund tracking, grant burn, monthly close, cash forecast.', '{"transactions","grants:financials","programs:budgets"}', 10000, true),
  ('ac-010', 'org-002', 'compliance', 'Compliance Agent', 'Form 990, state registrations, acknowledgment rules, grant covenants.', '{"organization","transactions","grants:compliance"}', 0, true),
  ('ac-011', 'org-002', 'marketing', 'Marketing Agent', 'Drafts newsletters, social posts, annual report content.', '{"programs","outcomes","constituents"}', 500, true),
  ('ac-012', 'org-002', 'board', 'Board Agent', 'Prepares board packets, meeting agendas, governance calendar.', '{"organization","programs","grants","financials"}', 0, true);


-- ============================================================
-- Org 3: Community Health Partners (Atlanta, GA — health)
-- ============================================================
INSERT INTO organizations (id, name, legal_name, ein, mission, vision, sector, founded, website, address, phone, email, leadership, financials, public_profile, slug)
VALUES (
  'org-003',
  'Community Health Partners',
  'Community Health Partners Inc.',
  '58-7234561',
  'Delivering primary care, behavioral health, and preventive services to uninsured and underinsured communities across metro Atlanta.',
  'Health equity for every Atlanta resident, regardless of insurance status.',
  'health',
  '2012-09-15',
  'https://communityhealthatl.org',
  '{"street":"880 Martin Luther King Jr Dr SW","city":"Atlanta","state":"GA","zip":"30314"}',
  '(404) 555-0267',
  'info@communityhealthatl.org',
  '[{"name":"Dr. James Okafor","title":"CEO","since":"2012-09-15","bio":"Board-certified internist. Founded CHP after 10 years at Grady Memorial."},{"name":"Dr. Priya Mehta","title":"Medical Director","since":"2015-03-01","bio":"Psychiatrist specializing in integrated behavioral health in safety-net clinics."},{"name":"Lisa Washington","title":"COO","since":"2018-07-20","bio":"MBA from Emory. Previously VP of Operations at Piedmont Healthcare."}]',
  '{"fiscalYearEnd":"2026-12-31","annualBudget":4200000,"totalRevenue":3800000,"totalExpenses":3500000,"netAssets":1200000,"cashOnHand":520000,"monthsOfRunway":3}',
  true,
  'community-health-partners'
);

INSERT INTO programs (id, organization_id, name, description, sector, status, start_date, annual_budget, ytd_spend, staff_count, clients_served) VALUES
  ('prog-007', 'org-003', 'Community Health Centers', 'Three primary care locations across metro Atlanta providing comprehensive medical, dental, and behavioral health services to uninsured residents.', 'health', 'active', '2012-09-15', 2400000, 1800000, 32, 3214),
  ('prog-008', 'org-003', 'Mobile Health Van', 'Bringing primary care, screenings, and vaccinations directly to underserved neighborhoods via a fully-equipped mobile clinic.', 'health', 'active', '2019-06-01', 800000, 580000, 6, 1847),
  ('prog-009', 'org-003', 'Behavioral Health Integration', 'Embedding licensed counselors and psychiatrists into primary care settings for same-day mental health access.', 'health', 'active', '2021-01-01', 1000000, 720000, 8, 847);

INSERT INTO outcomes (id, program_id, organization_id, sector, reporting_period, metrics, narrative) VALUES
  ('out-005', 'prog-007', 'org-003', 'health', '2026 Annual', '[{"label":"Patients served with no prior access","value":3214,"unit":"patients","target":3500,"periodStart":"2026-01-01","periodEnd":"2026-12-31"},{"label":"Diabetes management compliance","value":92,"unit":"percent","target":95,"periodStart":"2026-01-01","periodEnd":"2026-12-31"},{"label":"Behavioral health visits","value":847,"unit":"visits","target":1000,"periodStart":"2026-01-01","periodEnd":"2026-12-31"}]', 'Patient volume grew 21% year-over-year, driven by expansion of the mobile health van to two additional neighborhoods.'),
  ('out-006', 'prog-009', 'org-003', 'health', '2026 Annual', '[{"label":"Patients screened for depression","value":2180,"unit":"patients","target":2500,"periodStart":"2026-01-01","periodEnd":"2026-12-31"},{"label":"Follow-up appointment adherence","value":78,"unit":"percent","target":85,"periodStart":"2026-01-01","periodEnd":"2026-12-31"}]', 'Behavioral health integration has reduced ER visits among enrolled patients by an estimated 34%.');

INSERT INTO constituents (id, organization_id, type, first_name, last_name, email, phone, org_affiliation, title, tags, giving_history, engagement_score) VALUES
  ('con-013', 'org-003', 'funder', 'William', 'Foster', 'wfoster@healthcarega.org', '(404) 555-0318', 'Healthcare Georgia Foundation', 'Senior Program Officer', '{"health","funder","foundation"}', '{"totalLifetime":350000,"lastGiftAmount":150000,"lastGiftDate":"2026-02-01","averageGift":116667,"giftCount":3,"firstGiftDate":"2021-06-15"}', 92),
  ('con-014', 'org-003', 'donor', 'Angela', 'Davis-Brown', 'angela.db@outlook.com', '(404) 555-0455', NULL, NULL, '{"health","individual","major-donor"}', '{"totalLifetime":25000,"lastGiftAmount":10000,"lastGiftDate":"2026-06-15","averageGift":5000,"giftCount":5,"firstGiftDate":"2022-12-01"}', 80),
  ('con-015', 'org-003', 'funder', 'Thomas', 'Wright', 'twright@rwjf.org', '(404) 555-0199', 'Robert Wood Johnson Foundation', 'Program Director', '{"health","funder","national"}', '{"totalLifetime":500000,"lastGiftAmount":250000,"lastGiftDate":"2026-04-01","averageGift":250000,"giftCount":2,"firstGiftDate":"2024-01-15"}', 95);

INSERT INTO grants (id, organization_id, funder_id, funder_name, program_id, name, status, amount_requested, amount_awarded, amount_spent, restriction, start_date, end_date, deadlines, requirements, probability, notes) VALUES
  ('grant-010', 'org-003', 'con-013', 'Healthcare Georgia Foundation', 'prog-007', 'Community Health Center Expansion', 'active', 150000, 150000, 95000, 'temporarily_restricted', '2026-01-01', '2026-12-31', '[{"type":"report","date":"2026-12-15","description":"Annual outcomes report with patient demographic data","completed":false}]', '{"Patient volume by site","Quality metrics dashboard"}', 100, 'Third year of a 3-year grant. Renewal conversation expected in Q4.'),
  ('grant-011', 'org-003', 'con-015', 'Robert Wood Johnson Foundation', 'prog-009', 'Integrated Behavioral Health Pilot', 'active', 250000, 250000, 180000, 'temporarily_restricted', '2025-07-01', '2027-06-30', '[{"type":"report","date":"2027-01-15","description":"Mid-grant evaluation report","completed":false}]', '{"Depression screening rates","ER diversion data","Cost-effectiveness analysis"}', 100, 'High-profile national grant. Program officer visiting in December.'),
  ('grant-012', 'org-003', NULL, 'Fulton County Government', 'prog-008', 'Mobile Health Van Operations 2027', 'applied', 200000, NULL, 0, 'temporarily_restricted', NULL, NULL, '[{"type":"application","date":"2026-11-30","description":"County RFP response deadline","completed":false}]', '{"Service area heat maps","Patient outcome data","Community need assessment"}', 70, 'Strong track record with county. New RFP format this year.');

INSERT INTO agent_configs (id, organization_id, type, name, description, scope, approval_threshold, enabled) VALUES
  ('ac-013', 'org-003', 'grants', 'Grants Agent', 'Discovers funders, drafts proposals, tracks deadlines, writes reports.', '{"grants","outcomes","programs","constituents:funders"}', 5000, true),
  ('ac-014', 'org-003', 'donor_relations', 'Donor Relations Agent', 'Segments donors, drafts stewardship, flags lapsed & upgrade-ready donors.', '{"constituents:donors","transactions:donations"}', 1000, true),
  ('ac-015', 'org-003', 'finance', 'Finance Agent', 'Restricted-fund tracking, grant burn, monthly close, cash forecast.', '{"transactions","grants:financials","programs:budgets"}', 10000, true),
  ('ac-016', 'org-003', 'compliance', 'Compliance Agent', 'Form 990, state registrations, acknowledgment rules, grant covenants.', '{"organization","transactions","grants:compliance"}', 0, true),
  ('ac-017', 'org-003', 'marketing', 'Marketing Agent', 'Drafts newsletters, social posts, annual report content.', '{"programs","outcomes","constituents"}', 500, true),
  ('ac-018', 'org-003', 'board', 'Board Agent', 'Prepares board packets, meeting agendas, governance calendar.', '{"organization","programs","grants","financials"}', 0, true);


-- ============================================================
-- Org 4: Pacific Arts Collective (Portland, OR — arts_culture)
-- ============================================================
INSERT INTO organizations (id, name, legal_name, ein, mission, vision, sector, founded, website, address, phone, email, leadership, financials, public_profile, slug)
VALUES (
  'org-004',
  'Pacific Arts Collective',
  'Pacific Arts Collective',
  '93-6127845',
  'Making arts education accessible to every young person in Portland through free after-school programs, public installations, and community studios.',
  'A Portland where every young person has access to creative expression and arts education.',
  'arts_culture',
  '2017-01-20',
  'https://pacificartscollective.org',
  '{"street":"714 NW Davis St","city":"Portland","state":"OR","zip":"97209"}',
  '(503) 555-0134',
  'hello@pacificartscollective.org',
  '[{"name":"Maya Chen","title":"Executive Director","since":"2017-01-20","bio":"MFA from PNCA. Former arts educator at Portland Public Schools."},{"name":"Carlos Rivera","title":"Artistic Director","since":"2018-05-01","bio":"Muralist and public artist. Work featured in 40+ cities worldwide."},{"name":"Sarah Kim","title":"Development Director","since":"2020-09-15","bio":"8 years in arts fundraising. Previously at Oregon Shakespeare Festival."}]',
  '{"fiscalYearEnd":"2026-12-31","annualBudget":890000,"totalRevenue":780000,"totalExpenses":720000,"netAssets":290000,"cashOnHand":145000,"monthsOfRunway":4}',
  true,
  'pacific-arts-collective'
);

INSERT INTO programs (id, organization_id, name, description, sector, status, start_date, annual_budget, ytd_spend, staff_count, clients_served) VALUES
  ('prog-010', 'org-004', 'Youth Arts Academy', 'Free after-school arts education for K-12 students across 8 Portland schools, covering visual arts, music, theater, and digital media.', 'arts_culture', 'active', '2017-09-01', 450000, 340000, 12, 1847),
  ('prog-011', 'org-004', 'Community Studio', 'Open-access studio space in the Pearl District providing free materials, tools, and mentorship to emerging artists of all ages.', 'arts_culture', 'active', '2019-03-01', 240000, 180000, 4, 520),
  ('prog-012', 'org-004', 'Public Art Initiative', 'Commissioning and installing public artworks throughout Portland neighborhoods, with a focus on underrepresented communities.', 'arts_culture', 'active', '2020-06-01', 200000, 150000, 3, 23);

INSERT INTO outcomes (id, program_id, organization_id, sector, reporting_period, metrics, narrative) VALUES
  ('out-007', 'prog-010', 'org-004', 'arts_culture', '2026 Annual', '[{"label":"Students enrolled","value":1847,"unit":"students","target":2000,"periodStart":"2026-01-01","periodEnd":"2026-12-31"},{"label":"Public installations completed","value":23,"unit":"installations","target":25,"periodStart":"2026-01-01","periodEnd":"2026-12-31"},{"label":"Students reporting creative confidence","value":94,"unit":"percent","target":95,"periodStart":"2026-01-01","periodEnd":"2026-12-31"}]', 'Student enrollment grew 15% year-over-year with the addition of two new school sites. Creative confidence surveys show consistently high results.'),
  ('out-008', 'prog-011', 'org-004', 'arts_culture', '2026 Annual', '[{"label":"Studio visitors","value":520,"unit":"visitors","target":600,"periodStart":"2026-01-01","periodEnd":"2026-12-31"},{"label":"Artist exhibitions hosted","value":12,"unit":"exhibitions","target":15,"periodStart":"2026-01-01","periodEnd":"2026-12-31"}]', 'Community Studio usage continues to grow. 12 exhibitions featuring 34 emerging artists from the program.');

INSERT INTO constituents (id, organization_id, type, first_name, last_name, email, phone, org_affiliation, title, tags, giving_history, engagement_score) VALUES
  ('con-016', 'org-004', 'funder', 'Emily', 'Nakamura', 'enakamura@meyerfund.org', '(503) 555-0276', 'Meyer Memorial Trust', 'Arts Program Officer', '{"arts","funder","oregon"}', '{"totalLifetime":80000,"lastGiftAmount":40000,"lastGiftDate":"2026-05-01","averageGift":40000,"giftCount":2,"firstGiftDate":"2024-05-15"}', 88),
  ('con-017', 'org-004', 'donor', 'Jason', 'Park', 'jpark.pdx@gmail.com', '(503) 555-0398', NULL, NULL, '{"arts","individual","recurring"}', '{"totalLifetime":6000,"lastGiftAmount":1000,"lastGiftDate":"2026-09-01","averageGift":1000,"giftCount":6,"firstGiftDate":"2021-03-01"}', 65);

INSERT INTO grants (id, organization_id, funder_id, funder_name, program_id, name, status, amount_requested, amount_awarded, amount_spent, restriction, start_date, end_date, deadlines, requirements, probability, notes) VALUES
  ('grant-013', 'org-004', 'con-016', 'Meyer Memorial Trust', 'prog-010', 'Youth Arts Expansion 2026', 'active', 40000, 40000, 28000, 'temporarily_restricted', '2026-01-01', '2026-12-31', '[{"type":"report","date":"2026-12-01","description":"Year-end narrative and financial report","completed":false}]', '{"Student enrollment data","Pre/post creative confidence surveys"}', 100, 'Strong relationship. Third consecutive year of funding.'),
  ('grant-014', 'org-004', NULL, 'Oregon Arts Commission', 'prog-012', 'Public Art Installation Grant', 'awarded', 25000, 25000, 0, 'temporarily_restricted', '2027-01-01', '2027-12-31', '[{"type":"application","date":"2026-12-15","description":"Grant agreement signing deadline","completed":false}]', '{"Community input documentation","Artist selection process"}', 100, 'Awarded in October. Paperwork pending.'),
  ('grant-015', 'org-004', NULL, 'Wieden+Kennedy Foundation', NULL, 'Creative Youth Initiative', 'prospect', 60000, NULL, 0, 'temporarily_restricted', NULL, NULL, '[{"type":"loi","date":"2027-03-01","description":"Letter of inquiry deadline","completed":false}]', '{}', 35, 'Development director has a warm introduction through a board member.');

INSERT INTO agent_configs (id, organization_id, type, name, description, scope, approval_threshold, enabled) VALUES
  ('ac-019', 'org-004', 'grants', 'Grants Agent', 'Discovers funders, drafts proposals, tracks deadlines, writes reports.', '{"grants","outcomes","programs","constituents:funders"}', 5000, true),
  ('ac-020', 'org-004', 'donor_relations', 'Donor Relations Agent', 'Segments donors, drafts stewardship, flags lapsed & upgrade-ready donors.', '{"constituents:donors","transactions:donations"}', 1000, true),
  ('ac-021', 'org-004', 'finance', 'Finance Agent', 'Restricted-fund tracking, grant burn, monthly close, cash forecast.', '{"transactions","grants:financials","programs:budgets"}', 10000, true),
  ('ac-022', 'org-004', 'compliance', 'Compliance Agent', 'Form 990, state registrations, acknowledgment rules, grant covenants.', '{"organization","transactions","grants:compliance"}', 0, true),
  ('ac-023', 'org-004', 'marketing', 'Marketing Agent', 'Drafts newsletters, social posts, annual report content.', '{"programs","outcomes","constituents"}', 500, true),
  ('ac-024', 'org-004', 'board', 'Board Agent', 'Prepares board packets, meeting agendas, governance calendar.', '{"organization","programs","grants","financials"}', 0, true);


-- ============================================================
-- Org 5: GreenRoots Environmental (Austin, TX — environment)
-- ============================================================
INSERT INTO organizations (id, name, legal_name, ein, mission, vision, sector, founded, website, address, phone, email, leadership, financials, public_profile, slug)
VALUES (
  'org-005',
  'GreenRoots Environmental',
  'GreenRoots Environmental Inc.',
  '74-8392156',
  'Restoring urban ecosystems and building climate resilience through community-led conservation, urban farming, and environmental education in Central Texas.',
  'A climate-resilient Central Texas where communities lead their own environmental future.',
  'environment',
  '2019-04-22',
  'https://greenrootsatx.org',
  '{"street":"1100 E 5th St, Suite 200","city":"Austin","state":"TX","zip":"78702"}',
  '(512) 555-0187',
  'info@greenrootsatx.org',
  '[{"name":"Marcus Johnson","title":"Executive Director","since":"2019-04-22","bio":"Environmental engineer turned activist. Led Austin''s first urban farming cooperative."},{"name":"Dr. Elena Vasquez","title":"Science Director","since":"2020-01-15","bio":"PhD in Ecology from UT Austin. Published researcher in urban ecosystem restoration."},{"name":"Tony Hernandez","title":"Farm Director","since":"2020-06-01","bio":"Third-generation farmer. Manages 12 urban farm sites across Central Texas."}]',
  '{"fiscalYearEnd":"2026-12-31","annualBudget":1400000,"totalRevenue":1200000,"totalExpenses":1100000,"netAssets":480000,"cashOnHand":210000,"monthsOfRunway":4}',
  true,
  'greenroots-environmental'
);

INSERT INTO programs (id, organization_id, name, description, sector, status, start_date, annual_budget, ytd_spend, staff_count, clients_served) VALUES
  ('prog-013', 'org-005', 'Urban Farm Network', 'Operating 12 community farm sites across Austin, producing fresh food for food deserts and providing agricultural education.', 'environment', 'active', '2019-04-22', 600000, 450000, 10, 2100),
  ('prog-014', 'org-005', 'Watershed Restoration', 'Restoring riparian buffers, removing invasive species, and improving water quality along Central Texas waterways.', 'environment', 'active', '2020-09-01', 500000, 380000, 6, 45),
  ('prog-015', 'org-005', 'Climate Education Corps', 'Training high school and college students as climate educators who lead workshops in schools and community centers.', 'environment', 'active', '2021-01-15', 300000, 220000, 5, 2100);

INSERT INTO outcomes (id, program_id, organization_id, sector, reporting_period, metrics, narrative) VALUES
  ('out-009', 'prog-013', 'org-005', 'environment', '2026 Annual', '[{"label":"Acres restored","value":45,"unit":"acres","target":60,"periodStart":"2026-01-01","periodEnd":"2026-12-31"},{"label":"Food produced","value":12000,"unit":"lbs","target":15000,"periodStart":"2026-01-01","periodEnd":"2026-12-31"},{"label":"Students in climate education","value":2100,"unit":"students","target":2500,"periodStart":"2026-01-01","periodEnd":"2026-12-31"}]', 'Restoration acreage grew 30% with the addition of 3 new sites along Waller Creek. Farm output exceeded expectations despite summer drought.'),
  ('out-010', 'prog-015', 'org-005', 'environment', '2026 Annual', '[{"label":"Climate educators trained","value":48,"unit":"educators","target":50,"periodStart":"2026-01-01","periodEnd":"2026-12-31"},{"label":"Community workshops delivered","value":156,"unit":"workshops","target":180,"periodStart":"2026-01-01","periodEnd":"2026-12-31"}]', 'Climate Education Corps nearly doubled in size. Educators reached 2,100 students across 18 schools.');

INSERT INTO constituents (id, organization_id, type, first_name, last_name, email, phone, org_affiliation, title, tags, giving_history, engagement_score) VALUES
  ('con-018', 'org-005', 'funder', 'Diane', 'Huang', 'dhuang@cynthiawoodsmitchell.org', '(512) 555-0233', 'Cynthia and George Mitchell Foundation', 'Environment Program Officer', '{"environment","funder","texas"}', '{"totalLifetime":120000,"lastGiftAmount":60000,"lastGiftDate":"2026-04-15","averageGift":60000,"giftCount":2,"firstGiftDate":"2024-10-01"}', 87),
  ('con-019', 'org-005', 'donor', 'Kevin', 'O''Brien', 'kob.austin@gmail.com', '(512) 555-0344', NULL, NULL, '{"environment","individual","major-donor"}', '{"totalLifetime":15000,"lastGiftAmount":5000,"lastGiftDate":"2026-07-22","averageGift":3750,"giftCount":4,"firstGiftDate":"2023-04-22"}', 75),
  ('con-020', 'org-005', 'funder', 'Stephanie', 'Gonzalez', 'sgonzalez@austincf.org', '(512) 555-0156', 'Austin Community Foundation', 'Grants Manager', '{"environment","funder","community-foundation"}', '{"totalLifetime":90000,"lastGiftAmount":45000,"lastGiftDate":"2026-03-01","averageGift":45000,"giftCount":2,"firstGiftDate":"2025-01-15"}', 82);

INSERT INTO grants (id, organization_id, funder_id, funder_name, program_id, name, status, amount_requested, amount_awarded, amount_spent, restriction, start_date, end_date, deadlines, requirements, probability, notes) VALUES
  ('grant-016', 'org-005', 'con-018', 'Cynthia and George Mitchell Foundation', 'prog-014', 'Watershed Restoration Initiative', 'active', 60000, 60000, 42000, 'temporarily_restricted', '2026-03-01', '2027-02-28', '[{"type":"report","date":"2027-01-15","description":"Year-end ecological impact report","completed":false}]', '{"Water quality testing data","Invasive species removal logs","Photo documentation"}', 100, 'Year 2 of a 3-year commitment. Strong outcomes data.'),
  ('grant-017', 'org-005', 'con-020', 'Austin Community Foundation', 'prog-013', 'Urban Farm Expansion 2027', 'applied', 50000, NULL, 0, 'temporarily_restricted', NULL, NULL, '[{"type":"application","date":"2026-12-01","description":"Full proposal with farm site plans","completed":false}]', '{"3-year farm production data","Community impact assessment"}', 65, 'Good relationship. Competitive cycle this year.'),
  ('grant-018', 'org-005', NULL, 'Patagonia Environmental Grants', NULL, 'Climate Education Scale-Up', 'prospect', 80000, NULL, 0, 'temporarily_restricted', NULL, NULL, '[{"type":"application","date":"2027-04-30","description":"Spring grant cycle deadline","completed":false}]', '{}', 30, 'Patagonia funds grassroots environmental education. Good fit but competitive.');

INSERT INTO agent_configs (id, organization_id, type, name, description, scope, approval_threshold, enabled) VALUES
  ('ac-025', 'org-005', 'grants', 'Grants Agent', 'Discovers funders, drafts proposals, tracks deadlines, writes reports.', '{"grants","outcomes","programs","constituents:funders"}', 5000, true),
  ('ac-026', 'org-005', 'donor_relations', 'Donor Relations Agent', 'Segments donors, drafts stewardship, flags lapsed & upgrade-ready donors.', '{"constituents:donors","transactions:donations"}', 1000, true),
  ('ac-027', 'org-005', 'finance', 'Finance Agent', 'Restricted-fund tracking, grant burn, monthly close, cash forecast.', '{"transactions","grants:financials","programs:budgets"}', 10000, true),
  ('ac-028', 'org-005', 'compliance', 'Compliance Agent', 'Form 990, state registrations, acknowledgment rules, grant covenants.', '{"organization","transactions","grants:compliance"}', 0, true),
  ('ac-029', 'org-005', 'marketing', 'Marketing Agent', 'Drafts newsletters, social posts, annual report content.', '{"programs","outcomes","constituents"}', 500, true),
  ('ac-030', 'org-005', 'board', 'Board Agent', 'Prepares board packets, meeting agendas, governance calendar.', '{"organization","programs","grants","financials"}', 0, true);


-- ============================================================
-- Org 6: Digital Rights Alliance (Washington, DC — essential_rights)
-- ============================================================
INSERT INTO organizations (id, name, legal_name, ein, mission, vision, sector, founded, website, address, phone, email, leadership, financials, public_profile, slug)
VALUES (
  'org-006',
  'Digital Rights Alliance',
  'Digital Rights Alliance Inc.',
  '52-9481273',
  'Defending digital privacy, free expression, and equitable access to technology through litigation, policy advocacy, and public education.',
  'A digital world where every person''s rights are protected and technology serves democracy.',
  'essential_rights',
  '2016-11-01',
  'https://digitalrightsalliance.org',
  '{"street":"1625 K St NW, Suite 800","city":"Washington","state":"DC","zip":"20006"}',
  '(202) 555-0243',
  'info@digitalrightsalliance.org',
  '[{"name":"Amara Washington","title":"Executive Director","since":"2016-11-01","bio":"Former ACLU technologist. Georgetown Law adjunct on digital civil liberties."},{"name":"David Park","title":"Legal Director","since":"2018-02-15","bio":"First Amendment litigator. Argued 3 cases before the Supreme Court."},{"name":"Jennifer Liu","title":"Policy Director","since":"2019-08-01","bio":"Former Senate Judiciary Committee staff. Expert in tech policy and AI governance."}]',
  '{"fiscalYearEnd":"2026-12-31","annualBudget":3600000,"totalRevenue":3200000,"totalExpenses":2900000,"netAssets":1800000,"cashOnHand":780000,"monthsOfRunway":6}',
  true,
  'digital-rights-alliance'
);

INSERT INTO programs (id, organization_id, name, description, sector, status, start_date, annual_budget, ytd_spend, staff_count, clients_served) VALUES
  ('prog-016', 'org-006', 'Legal Defense Fund', 'Impact litigation defending digital privacy, free expression, and technology access rights in federal and state courts.', 'essential_rights', 'active', '2017-01-15', 1800000, 1300000, 12, 7),
  ('prog-017', 'org-006', 'Policy Lab', 'Legislative research, policy briefs, and direct advocacy with lawmakers on technology regulation, AI governance, and digital privacy.', 'essential_rights', 'active', '2018-06-01', 1200000, 900000, 8, 3),
  ('prog-018', 'org-006', 'Digital Literacy for Democracy', 'Community workshops and online courses teaching digital rights, media literacy, and privacy protection to the public.', 'essential_rights', 'active', '2020-03-01', 600000, 450000, 6, 15000);

INSERT INTO outcomes (id, program_id, organization_id, sector, reporting_period, metrics, narrative) VALUES
  ('out-011', 'prog-016', 'org-006', 'essential_rights', '2026 Annual', '[{"label":"Landmark cases filed","value":7,"unit":"cases","target":10,"periodStart":"2026-01-01","periodEnd":"2026-12-31"},{"label":"State privacy laws influenced","value":3,"unit":"laws","target":5,"periodStart":"2026-01-01","periodEnd":"2026-12-31"},{"label":"People trained in digital rights","value":15000,"unit":"people","target":20000,"periodStart":"2026-01-01","periodEnd":"2026-12-31"}]', 'Landmark caseload grew 40% year-over-year. Three state legislatures cited our amicus briefs in passing new digital privacy protections.'),
  ('out-012', 'prog-018', 'org-006', 'essential_rights', '2026 Annual', '[{"label":"Workshop participants","value":8500,"unit":"participants","target":10000,"periodStart":"2026-01-01","periodEnd":"2026-12-31"},{"label":"Online course completions","value":6500,"unit":"completions","target":8000,"periodStart":"2026-01-01","periodEnd":"2026-12-31"}]', 'Digital Literacy program expanded to 12 new cities. Online course platform launched in Q2 with strong enrollment.');

INSERT INTO constituents (id, organization_id, type, first_name, last_name, email, phone, org_affiliation, title, tags, giving_history, engagement_score) VALUES
  ('con-021', 'org-006', 'funder', 'Margaret', 'Sullivan', 'msullivan@fordfoundation.org', '(202) 555-0377', 'Ford Foundation', 'Program Officer, Technology & Society', '{"rights","funder","national"}', '{"totalLifetime":500000,"lastGiftAmount":250000,"lastGiftDate":"2026-01-15","averageGift":250000,"giftCount":2,"firstGiftDate":"2024-06-01"}', 95),
  ('con-022', 'org-006', 'donor', 'Ryan', 'Nakamura', 'rnakamura@techexec.com', '(202) 555-0488', 'Nakamura Ventures', 'Founder', '{"rights","individual","tech","major-donor"}', '{"totalLifetime":50000,"lastGiftAmount":25000,"lastGiftDate":"2026-09-01","averageGift":16667,"giftCount":3,"firstGiftDate":"2023-05-15"}', 85),
  ('con-023', 'org-006', 'funder', 'Catherine', 'Brooks', 'cbrooks@knightfoundation.org', '(202) 555-0211', 'John S. and James L. Knight Foundation', 'Director of Technology Innovation', '{"rights","funder","journalism","tech"}', '{"totalLifetime":300000,"lastGiftAmount":150000,"lastGiftDate":"2026-03-01","averageGift":150000,"giftCount":2,"firstGiftDate":"2024-09-15"}', 90);

INSERT INTO grants (id, organization_id, funder_id, funder_name, program_id, name, status, amount_requested, amount_awarded, amount_spent, restriction, start_date, end_date, deadlines, requirements, probability, notes) VALUES
  ('grant-019', 'org-006', 'con-021', 'Ford Foundation', 'prog-016', 'Digital Rights Litigation 2026-2028', 'active', 250000, 250000, 145000, 'temporarily_restricted', '2026-01-01', '2028-12-31', '[{"type":"report","date":"2027-01-31","description":"Annual litigation impact report","completed":false}]', '{"Case outcome tracking","Policy change attribution","Media coverage log"}', 100, 'Marquee grant. Ford is deeply invested in our litigation strategy.'),
  ('grant-020', 'org-006', 'con-023', 'Knight Foundation', 'prog-017', 'AI Governance Policy Research', 'active', 150000, 150000, 110000, 'temporarily_restricted', '2026-04-01', '2027-03-31', '[{"type":"report","date":"2026-12-15","description":"Mid-year policy brief and impact assessment","completed":false}]', '{"Published policy briefs","Legislative testimony log","Congressional meeting tracker"}', 100, 'Year 1 of AI governance initiative. Strong engagement with Hill offices.'),
  ('grant-021', 'org-006', NULL, 'Open Society Foundations', 'prog-018', 'Digital Literacy National Expansion', 'applied', 200000, NULL, 0, 'temporarily_restricted', NULL, NULL, '[{"type":"application","date":"2026-12-20","description":"Full proposal with expansion plan","completed":false},{"type":"site_visit","date":"2027-01-15","description":"Virtual program demonstration","completed":false}]', '{"Curriculum outline","Geographic expansion plan","Partnership MOUs"}', 55, 'Competitive cycle. Our program model is a strong fit for their digital equity portfolio.');

INSERT INTO agent_configs (id, organization_id, type, name, description, scope, approval_threshold, enabled) VALUES
  ('ac-031', 'org-006', 'grants', 'Grants Agent', 'Discovers funders, drafts proposals, tracks deadlines, writes reports.', '{"grants","outcomes","programs","constituents:funders"}', 5000, true),
  ('ac-032', 'org-006', 'donor_relations', 'Donor Relations Agent', 'Segments donors, drafts stewardship, flags lapsed & upgrade-ready donors.', '{"constituents:donors","transactions:donations"}', 1000, true),
  ('ac-033', 'org-006', 'finance', 'Finance Agent', 'Restricted-fund tracking, grant burn, monthly close, cash forecast.', '{"transactions","grants:financials","programs:budgets"}', 10000, true),
  ('ac-034', 'org-006', 'compliance', 'Compliance Agent', 'Form 990, state registrations, acknowledgment rules, grant covenants.', '{"organization","transactions","grants:compliance"}', 0, true),
  ('ac-035', 'org-006', 'marketing', 'Marketing Agent', 'Drafts newsletters, social posts, annual report content.', '{"programs","outcomes","constituents"}', 500, true),
  ('ac-036', 'org-006', 'board', 'Board Agent', 'Prepares board packets, meeting agendas, governance calendar.', '{"organization","programs","grants","financials"}', 0, true);
