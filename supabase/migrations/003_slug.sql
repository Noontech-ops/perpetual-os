-- Add slug column for public org pages
alter table organizations add column if not exists slug text unique;
create index if not exists idx_organizations_slug on organizations(slug);

-- Set slug for the seed org
update organizations set slug = 'bay-area-literacy-coalition' where id = 'org-001';
