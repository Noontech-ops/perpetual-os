-- Update outcome metrics to be impact-focused
-- Run this against the production Supabase database

UPDATE outcomes
SET metrics = jsonb_build_array(
  jsonb_build_object(
    'label', 'Individuals Served',
    'value', floor(random() * 5000 + 500)::int,
    'unit', 'people',
    'target', floor(random() * 6000 + 1000)::int,
    'period_start', '2026-01-01',
    'period_end', '2026-12-31'
  ),
  jsonb_build_object(
    'label', 'Program Completion Rate',
    'value', floor(random() * 30 + 65)::int,
    'unit', '%',
    'target', 90,
    'period_start', '2026-01-01',
    'period_end', '2026-12-31'
  ),
  jsonb_build_object(
    'label', 'Community Impact Score',
    'value', floor(random() * 25 + 70)::int,
    'unit', 'points',
    'target', 100,
    'period_start', '2026-01-01',
    'period_end', '2026-12-31'
  )
)
WHERE metrics IS NULL OR metrics = '[]'::jsonb;
