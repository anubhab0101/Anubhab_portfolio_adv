import { seedPortfolioData } from "@/lib/seed-data";
import { hasServiceSupabaseEnv } from "@/lib/env";
import { createSupabaseServiceClient } from "@/lib/supabase/admin";
import { createPublicSupabaseClient } from "@/lib/supabase/public";
import type {
  Certification,
  ContactSettings,
  EducationItem,
  PortfolioData,
  Project,
  SeoSettings,
  SiteProfile,
  Skill,
  SocialLink,
  Testimonial
} from "@/lib/types";

type Row = Record<string, unknown>;
type SupabaseReader = NonNullable<ReturnType<typeof createPublicSupabaseClient>>;

function isRow(value: unknown): value is Row {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function rows(value: unknown): Row[] {
  return Array.isArray(value) ? value.filter(isRow) : [];
}

function text(row: Row, key: string, fallback = "") {
  const value = row[key];
  return typeof value === "string" ? value : fallback;
}

function numberValue(row: Row, key: string, fallback = 0) {
  const value = row[key];
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function bool(row: Row, key: string, fallback = true) {
  const value = row[key];
  return typeof value === "boolean" ? value : fallback;
}

function stringArray(row: Row, key: string, fallback: string[] = []) {
  const value = row[key];
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : fallback;
}

function rowOrSeed(value: unknown, fallback: Row) {
  return isRow(value) ? value : fallback;
}

function sortByOrder<T extends { sortOrder: number }>(items: T[]) {
  return [...items].sort((a, b) => a.sortOrder - b.sortOrder);
}

function mapProfile(value: unknown): SiteProfile {
  const seed = seedPortfolioData.profile;
  const row = rowOrSeed(value, {
    id: seed.id,
    brand_name: seed.brandName,
    hero_headline: seed.heroHeadline,
    summary_title: seed.summaryTitle,
    summary: seed.summary,
    about_title: seed.aboutTitle,
    about: seed.about,
    profile_image_url: seed.profileImageUrl,
    spline_url: seed.splineUrl
  });

  return {
    id: text(row, "id", seed.id),
    brandName: text(row, "brand_name", seed.brandName),
    heroHeadline: text(row, "hero_headline", seed.heroHeadline),
    summaryTitle: text(row, "summary_title", seed.summaryTitle),
    summary: text(row, "summary", seed.summary),
    aboutTitle: text(row, "about_title", seed.aboutTitle),
    about: text(row, "about", seed.about),
    profileImageUrl: text(row, "profile_image_url", seed.profileImageUrl),
    splineUrl: text(row, "spline_url", seed.splineUrl)
  };
}

function mapSocial(row: Row): SocialLink {
  return {
    id: text(row, "id"),
    label: text(row, "label"),
    platform: text(row, "platform"),
    url: text(row, "url"),
    iconImageUrl: text(row, "icon_image_url"),
    sortOrder: numberValue(row, "sort_order"),
    published: bool(row, "published")
  };
}

function mapEducation(row: Row): EducationItem {
  return {
    id: text(row, "id"),
    degree: text(row, "degree"),
    institution: text(row, "institution"),
    location: text(row, "location"),
    period: text(row, "period"),
    description: text(row, "description"),
    sortOrder: numberValue(row, "sort_order"),
    published: bool(row, "published")
  };
}

function mapSkill(row: Row): Skill {
  return {
    id: text(row, "id"),
    name: text(row, "name"),
    category: text(row, "category"),
    sortOrder: numberValue(row, "sort_order"),
    published: bool(row, "published")
  };
}

function mapProject(row: Row): Project {
  return {
    id: text(row, "id"),
    title: text(row, "title"),
    description: text(row, "description"),
    techStack: stringArray(row, "tech_stack"),
    liveUrl: text(row, "live_url"),
    repoUrl: text(row, "repo_url"),
    imageUrl: text(row, "image_url"),
    imageAlt: text(row, "image_alt"),
    sortOrder: numberValue(row, "sort_order"),
    published: bool(row, "published")
  };
}

function mapCertification(row: Row): Certification {
  return {
    id: text(row, "id"),
    title: text(row, "title"),
    issuer: text(row, "issuer"),
    issueDate: text(row, "issue_date"),
    credentialUrl: text(row, "credential_url"),
    fileUrl: text(row, "file_url"),
    fileType: text(row, "file_type"),
    skills: stringArray(row, "skills"),
    sortOrder: numberValue(row, "sort_order"),
    published: bool(row, "published")
  };
}

function mapTestimonial(row: Row): Testimonial {
  return {
    id: text(row, "id"),
    quote: text(row, "quote"),
    authorName: text(row, "author_name"),
    authorTitle: text(row, "author_title"),
    initials: text(row, "initials"),
    sortOrder: numberValue(row, "sort_order"),
    published: bool(row, "published")
  };
}

function mapContact(value: unknown): ContactSettings {
  const seed = seedPortfolioData.contact;
  const row = rowOrSeed(value, {
    id: seed.id,
    email: seed.email,
    phone: seed.phone,
    availability_text: seed.availabilityText
  });

  return {
    id: text(row, "id", seed.id),
    email: text(row, "email", seed.email),
    phone: text(row, "phone", seed.phone),
    availabilityText: text(row, "availability_text", seed.availabilityText)
  };
}

function mapSeo(value: unknown): SeoSettings {
  const seed = seedPortfolioData.seo;
  const row = rowOrSeed(value, {
    id: seed.id,
    title: seed.title,
    description: seed.description,
    keywords: seed.keywords,
    canonical_url: seed.canonicalUrl,
    og_image_url: seed.ogImageUrl
  });

  return {
    id: text(row, "id", seed.id),
    title: text(row, "title", seed.title),
    description: text(row, "description", seed.description),
    keywords: stringArray(row, "keywords", seed.keywords),
    canonicalUrl: text(row, "canonical_url", seed.canonicalUrl),
    ogImageUrl: text(row, "og_image_url", seed.ogImageUrl)
  };
}

async function readPortfolioData(
  supabase: SupabaseReader,
  options: { includeDrafts?: boolean } = {}
): Promise<PortfolioData> {
  const onlyPublished = !options.includeDrafts;
  const publishedFilter = <T>(query: T) => {
    if (!onlyPublished) {
      return query;
    }

    return (query as { eq: (column: string, value: boolean) => T }).eq("published", true);
  };

  const [profile, socials, education, skills, projects, certifications, testimonials, contact, seo] =
    await Promise.all([
      supabase.from("site_profile").select("*").eq("id", "main").maybeSingle(),
      publishedFilter(supabase.from("social_links").select("*")).order("sort_order"),
      publishedFilter(supabase.from("education").select("*")).order("sort_order"),
      publishedFilter(supabase.from("skills").select("*")).order("sort_order"),
      publishedFilter(supabase.from("projects").select("*")).order("sort_order"),
      publishedFilter(supabase.from("certifications").select("*")).order("sort_order"),
      publishedFilter(supabase.from("testimonials").select("*")).order("sort_order"),
      supabase.from("contact_settings").select("*").eq("id", "main").maybeSingle(),
      supabase.from("seo_settings").select("*").eq("id", "main").maybeSingle()
    ]);

  return {
    profile: mapProfile(profile.data),
    socials: rows(socials.data).map(mapSocial),
    education: rows(education.data).map(mapEducation),
    skills: rows(skills.data).map(mapSkill),
    projects: rows(projects.data).map(mapProject),
    certifications: rows(certifications.data).map(mapCertification),
    testimonials: rows(testimonials.data).map(mapTestimonial),
    contact: mapContact(contact.data),
    seo: mapSeo(seo.data)
  };
}

export async function getPortfolioData(options: { includeDrafts?: boolean } = {}): Promise<PortfolioData> {
  const supabase = hasServiceSupabaseEnv()
    ? createSupabaseServiceClient()
    : createPublicSupabaseClient();

  if (!supabase) {
    return seedPortfolioData;
  }

  try {
    return await readPortfolioData(supabase, options);
  } catch (error) {
    console.error("Falling back to seed portfolio data.", error);
    return seedPortfolioData;
  }
}

export async function getAdminPortfolioData(): Promise<PortfolioData> {
  const data = await readPortfolioData(createSupabaseServiceClient(), { includeDrafts: true });

  return {
    ...data,
    socials: sortByOrder(data.socials),
    education: sortByOrder(data.education),
    skills: sortByOrder(data.skills),
    projects: sortByOrder(data.projects),
    certifications: sortByOrder(data.certifications),
    testimonials: sortByOrder(data.testimonials)
  };
}
