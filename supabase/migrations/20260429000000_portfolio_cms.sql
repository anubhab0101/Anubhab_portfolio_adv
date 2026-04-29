create extension if not exists pgcrypto;

create or replace function public.is_portfolio_admin()
returns boolean
language sql
stable
as $$
  select lower(coalesce(auth.jwt() ->> 'email', '')) = 'anubhabmohapatra.01@gmail.com';
$$;

create table if not exists public.site_profile (
  id text primary key default 'main',
  brand_name text not null,
  hero_headline text not null,
  summary_title text not null,
  summary text not null,
  about_title text not null,
  about text not null,
  profile_image_url text default '',
  spline_url text default '',
  updated_at timestamptz not null default now()
);

create table if not exists public.social_links (
  id text primary key default gen_random_uuid()::text,
  label text not null,
  platform text not null,
  url text not null,
  icon_image_url text default '',
  sort_order integer not null default 0,
  published boolean not null default true,
  updated_at timestamptz not null default now()
);

create table if not exists public.education (
  id text primary key default gen_random_uuid()::text,
  degree text not null,
  institution text not null,
  location text default '',
  period text not null,
  description text default '',
  sort_order integer not null default 0,
  published boolean not null default true,
  updated_at timestamptz not null default now()
);

create table if not exists public.skills (
  id text primary key default gen_random_uuid()::text,
  name text not null,
  category text not null,
  sort_order integer not null default 0,
  published boolean not null default true,
  updated_at timestamptz not null default now()
);

create table if not exists public.projects (
  id text primary key default gen_random_uuid()::text,
  title text not null,
  description text not null,
  tech_stack text[] not null default '{}',
  live_url text default '',
  repo_url text default '',
  image_url text default '',
  image_alt text default '',
  sort_order integer not null default 0,
  published boolean not null default true,
  updated_at timestamptz not null default now()
);

create table if not exists public.certifications (
  id text primary key default gen_random_uuid()::text,
  title text not null,
  issuer text not null,
  issue_date date,
  credential_url text default '',
  file_url text default '',
  file_type text default '',
  skills text[] not null default '{}',
  sort_order integer not null default 0,
  published boolean not null default true,
  updated_at timestamptz not null default now()
);

create table if not exists public.testimonials (
  id text primary key default gen_random_uuid()::text,
  quote text not null,
  author_name text not null,
  author_title text default '',
  initials text default '',
  sort_order integer not null default 0,
  published boolean not null default true,
  updated_at timestamptz not null default now()
);

create table if not exists public.contact_settings (
  id text primary key default 'main',
  email text not null,
  phone text default '',
  availability_text text not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.seo_settings (
  id text primary key default 'main',
  title text not null,
  description text not null,
  keywords text[] not null default '{}',
  canonical_url text not null,
  og_image_url text default '',
  updated_at timestamptz not null default now()
);

create table if not exists public.media_assets (
  id uuid primary key default gen_random_uuid(),
  bucket text not null,
  path text not null,
  url text not null,
  filename text not null,
  content_type text not null,
  size_bytes bigint not null default 0,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists touch_site_profile on public.site_profile;
create trigger touch_site_profile before update on public.site_profile
for each row execute function public.touch_updated_at();

drop trigger if exists touch_social_links on public.social_links;
create trigger touch_social_links before update on public.social_links
for each row execute function public.touch_updated_at();

drop trigger if exists touch_education on public.education;
create trigger touch_education before update on public.education
for each row execute function public.touch_updated_at();

drop trigger if exists touch_skills on public.skills;
create trigger touch_skills before update on public.skills
for each row execute function public.touch_updated_at();

drop trigger if exists touch_projects on public.projects;
create trigger touch_projects before update on public.projects
for each row execute function public.touch_updated_at();

drop trigger if exists touch_certifications on public.certifications;
create trigger touch_certifications before update on public.certifications
for each row execute function public.touch_updated_at();

drop trigger if exists touch_testimonials on public.testimonials;
create trigger touch_testimonials before update on public.testimonials
for each row execute function public.touch_updated_at();

drop trigger if exists touch_contact_settings on public.contact_settings;
create trigger touch_contact_settings before update on public.contact_settings
for each row execute function public.touch_updated_at();

drop trigger if exists touch_seo_settings on public.seo_settings;
create trigger touch_seo_settings before update on public.seo_settings
for each row execute function public.touch_updated_at();

alter table public.site_profile enable row level security;
alter table public.social_links enable row level security;
alter table public.education enable row level security;
alter table public.skills enable row level security;
alter table public.projects enable row level security;
alter table public.certifications enable row level security;
alter table public.testimonials enable row level security;
alter table public.contact_settings enable row level security;
alter table public.seo_settings enable row level security;
alter table public.media_assets enable row level security;

create policy "Public can read site profile"
on public.site_profile for select
to anon, authenticated
using (true);

create policy "Admin can manage site profile"
on public.site_profile for all
to authenticated
using (public.is_portfolio_admin())
with check (public.is_portfolio_admin());

create policy "Public can read published socials"
on public.social_links for select
to anon, authenticated
using (published);

create policy "Admin can manage socials"
on public.social_links for all
to authenticated
using (public.is_portfolio_admin())
with check (public.is_portfolio_admin());

create policy "Public can read published education"
on public.education for select
to anon, authenticated
using (published);

create policy "Admin can manage education"
on public.education for all
to authenticated
using (public.is_portfolio_admin())
with check (public.is_portfolio_admin());

create policy "Public can read published skills"
on public.skills for select
to anon, authenticated
using (published);

create policy "Admin can manage skills"
on public.skills for all
to authenticated
using (public.is_portfolio_admin())
with check (public.is_portfolio_admin());

create policy "Public can read published projects"
on public.projects for select
to anon, authenticated
using (published);

create policy "Admin can manage projects"
on public.projects for all
to authenticated
using (public.is_portfolio_admin())
with check (public.is_portfolio_admin());

create policy "Public can read published certifications"
on public.certifications for select
to anon, authenticated
using (published);

create policy "Admin can manage certifications"
on public.certifications for all
to authenticated
using (public.is_portfolio_admin())
with check (public.is_portfolio_admin());

create policy "Public can read published testimonials"
on public.testimonials for select
to anon, authenticated
using (published);

create policy "Admin can manage testimonials"
on public.testimonials for all
to authenticated
using (public.is_portfolio_admin())
with check (public.is_portfolio_admin());

create policy "Public can read contact settings"
on public.contact_settings for select
to anon, authenticated
using (true);

create policy "Admin can manage contact settings"
on public.contact_settings for all
to authenticated
using (public.is_portfolio_admin())
with check (public.is_portfolio_admin());

create policy "Public can read seo settings"
on public.seo_settings for select
to anon, authenticated
using (true);

create policy "Admin can manage seo settings"
on public.seo_settings for all
to authenticated
using (public.is_portfolio_admin())
with check (public.is_portfolio_admin());

create policy "Public can read media assets"
on public.media_assets for select
to anon, authenticated
using (true);

create policy "Admin can manage media assets"
on public.media_assets for all
to authenticated
using (public.is_portfolio_admin())
with check (public.is_portfolio_admin());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'portfolio-media',
  'portfolio-media',
  true,
  8388608,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "Public can read portfolio media"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'portfolio-media');

create policy "Admin can upload portfolio media"
on storage.objects for insert
to authenticated
with check (bucket_id = 'portfolio-media' and public.is_portfolio_admin());

create policy "Admin can update portfolio media"
on storage.objects for update
to authenticated
using (bucket_id = 'portfolio-media' and public.is_portfolio_admin())
with check (bucket_id = 'portfolio-media' and public.is_portfolio_admin());

create policy "Admin can delete portfolio media"
on storage.objects for delete
to authenticated
using (bucket_id = 'portfolio-media' and public.is_portfolio_admin());

insert into public.site_profile (
  id,
  brand_name,
  hero_headline,
  summary_title,
  summary,
  about_title,
  about,
  profile_image_url,
  spline_url
)
values (
  'main',
  'Anubhab',
  'I am a Developer specializing in Python, frontend design, and crafting clean, impactful digital solutions.',
  'Professional Summary',
  'Computer Science student focused on AI and Data Science, experienced in Python development, full-stack applications, and cybersecurity projects. Good at delivering results, like improving process efficiency and achieving high model accuracy. Looking for chances to use technical skills and solve problems in AI and software development.',
  'About Me',
  'Hi, I''m Anubhab, a final-year student at CV Raman Global University who''s really into Python, front-end development, and game design. I enjoy turning ideas into clean, functional code and designing user experiences that make sense.',
  '/assets/Anubhab.png',
  'https://prod.spline.design/3fDaqfwGCnwy4ncn/scene.splinecode'
)
on conflict (id) do update set
  brand_name = excluded.brand_name,
  hero_headline = excluded.hero_headline,
  summary_title = excluded.summary_title,
  summary = excluded.summary,
  about_title = excluded.about_title,
  about = excluded.about,
  profile_image_url = excluded.profile_image_url,
  spline_url = excluded.spline_url;

insert into public.social_links (id, label, platform, url, icon_image_url, sort_order, published)
values
  ('linkedin', 'LinkedIn', 'linkedin', 'https://www.linkedin.com/in/anubhab-mohapatra-01-/', '/assets/linkedin_image.jpeg', 1, true),
  ('github', 'GitHub', 'github', 'https://github.com/anubhab0101', '/assets/Github_Image.jpeg', 2, true),
  ('hackerrank', 'HackerRank', 'hackerrank', 'https://www.hackerrank.com/profile/www_anubhabmaha1', '/assets/HackerRank_Image.png', 3, true)
on conflict (id) do update set
  label = excluded.label,
  platform = excluded.platform,
  url = excluded.url,
  icon_image_url = excluded.icon_image_url,
  sort_order = excluded.sort_order,
  published = excluded.published;

insert into public.education (id, degree, institution, location, period, description, sort_order, published)
values
  ('bachelor', 'Bachelor''s Degree', 'CV Raman Global University', 'Bhubaneswar', '2022 - 2026', 'Computer Science with a focus on AI, Data Science, and full-stack development.', 1, true),
  ('higher-secondary', 'Higher Secondary Education', 'Sakti Higher Secondary School', 'Cuttack', '2020 - 2022', '', 2, true)
on conflict (id) do update set
  degree = excluded.degree,
  institution = excluded.institution,
  location = excluded.location,
  period = excluded.period,
  description = excluded.description,
  sort_order = excluded.sort_order,
  published = excluded.published;

insert into public.skills (id, name, category, sort_order, published)
values
  ('python', 'Python', 'Programming', 1, true),
  ('ai', 'Artificial Intelligence', 'AI/ML', 2, true),
  ('data-science', 'Data Science', 'AI/ML', 3, true),
  ('machine-learning', 'Machine Learning', 'AI/ML', 4, true),
  ('frontend', 'Frontend Development', 'Web', 5, true),
  ('cybersecurity', 'Cybersecurity', 'Security', 6, true),
  ('computer-vision', 'Computer Vision', 'AI/ML', 7, true),
  ('nlp', 'Natural Language Processing', 'AI/ML', 8, true)
on conflict (id) do update set
  name = excluded.name,
  category = excluded.category,
  sort_order = excluded.sort_order,
  published = excluded.published;

insert into public.projects (
  id,
  title,
  description,
  tech_stack,
  live_url,
  repo_url,
  image_url,
  image_alt,
  sort_order,
  published
)
values
  ('nlp-ml-analysis', 'NLP/ML Analysis Platform', 'Advanced text analysis platform powered by Gemini AI.', array['Python', 'Streamlit', 'NLP', 'Gemini AI'], 'https://geminiintigration.streamlit.app', '', '/assets/ml_analysis.png', 'NLP/ML Analysis Platform dashboard powered by Gemini AI', 1, true),
  ('pneumonia-detection', 'Pneumonia Detection', 'AI-powered medical imaging system that analyzes chest X-rays.', array['Python', 'TensorFlow', 'Computer Vision'], 'https://anubhab0101-pneumonia-detection-from-chest-x-ray-pp-qdevtn.streamlit.app/', '', '/assets/chest-x-ray.png', 'Pneumonia Detection AI chest X-ray analysis interface', 2, true),
  ('blackeye', 'Blackeye', 'A comprehensive phishing awareness and testing tool.', array['Shell Script', 'Automation', 'Cybersecurity'], '', 'https://github.com/anubhab0101/blackeye.git', '/assets/blackeye.png', 'Blackeye cybersecurity testing platform interface', 3, true),
  ('class-sensi', 'Class-sensi', 'Educational platform that automates classroom management.', array['Python', 'Automation', 'Education Tech'], '', 'https://github.com/anubhab0101/Class-sensi.git', '/assets/class-sensi.png', 'Class-sensi classroom management dashboard', 4, true),
  ('software-reliability', 'Software Reliability Prediction Model for Imbalanced Datasets', 'A full-stack machine learning system for predicting software reliability on highly imbalanced datasets. Includes data preprocessing, model training, and evaluation.', array['React', 'TypeScript', 'Node.js', 'Express', 'Python', 'Tailwind CSS'], '', 'https://github.com/anubhab0101/Software-Realibility-Prediction-model-for-imbalance-dataset.git', '/assets/imbalance-dataset.png', 'Software reliability prediction dashboard for imbalanced dataset analysis', 5, true)
on conflict (id) do update set
  title = excluded.title,
  description = excluded.description,
  tech_stack = excluded.tech_stack,
  live_url = excluded.live_url,
  repo_url = excluded.repo_url,
  image_url = excluded.image_url,
  image_alt = excluded.image_alt,
  sort_order = excluded.sort_order,
  published = excluded.published;

insert into public.testimonials (id, quote, author_name, author_title, initials, sort_order, published)
values
  ('dss', 'Anubhab''s work on the pneumonia detection system was exceptional. His attention to detail is impressive.', 'Dr. Sarah Singh', 'Lead Data Scientist', 'DSS', 1, true),
  ('pjrs', 'One of the most dedicated students I''ve worked with. Anubhab consistently delivers high-quality projects.', 'Prof. Jyoti Ranjan Swain', 'Professor of CS', 'PJRS', 2, true),
  ('ap', 'His code quality and problem-solving approach are remarkable. Definitely someone to watch.', 'Amit Patel', 'Senior Software Engineer', 'AP', 3, true)
on conflict (id) do update set
  quote = excluded.quote,
  author_name = excluded.author_name,
  author_title = excluded.author_title,
  initials = excluded.initials,
  sort_order = excluded.sort_order,
  published = excluded.published;

insert into public.contact_settings (id, email, phone, availability_text)
values (
  'main',
  'anubhabmohapatra.01@gmail.com',
  '+91 82605 86748',
  'I''m always open to discussing new projects, creative ideas, or opportunities to be part of your vision.'
)
on conflict (id) do update set
  email = excluded.email,
  phone = excluded.phone,
  availability_text = excluded.availability_text;

insert into public.seo_settings (id, title, description, keywords, canonical_url, og_image_url)
values (
  'main',
  'Anubhab Mohapatra - Python Developer & AI Specialist | Portfolio',
  'Anubhab Mohapatra - Computer Science student specializing in Python development, AI, Data Science, and full-stack applications.',
  array['Anubhab Mohapatra', 'Python Developer', 'AI Developer', 'Data Science', 'Machine Learning', 'Portfolio', 'CV Raman Global University'],
  'https://anubhabmohapatra.in/',
  'https://anubhabmohapatra.in/assets/Anubhab.png'
)
on conflict (id) do update set
  title = excluded.title,
  description = excluded.description,
  keywords = excluded.keywords,
  canonical_url = excluded.canonical_url,
  og_image_url = excluded.og_image_url;

create index if not exists social_links_sort_order_idx on public.social_links (sort_order);
create index if not exists education_sort_order_idx on public.education (sort_order);
create index if not exists skills_sort_order_idx on public.skills (sort_order);
create index if not exists projects_sort_order_idx on public.projects (sort_order);
create index if not exists certifications_sort_order_idx on public.certifications (sort_order);
create index if not exists testimonials_sort_order_idx on public.testimonials (sort_order);
