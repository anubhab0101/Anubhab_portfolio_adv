"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createSupabaseServiceClient } from "@/lib/supabase/admin";

type DbValue = string | number | boolean | string[] | null;
type DbPayload = Record<string, DbValue>;
type UploadState = {
  message: string;
  url: string;
  ok: boolean;
};

const portfolioBucket = "portfolio-media";

function text(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function requiredText(formData: FormData, key: string, label: string) {
  const value = text(formData, key);

  if (!value) {
    throw new Error(`${label} is required.`);
  }

  return value;
}

function numberField(formData: FormData, key: string) {
  const value = Number(text(formData, key));
  return Number.isFinite(value) ? value : 0;
}

function listField(formData: FormData, key: string) {
  return text(formData, key)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function published(formData: FormData) {
  return formData.get("published") === "on";
}

function rowId(formData: FormData) {
  const id = text(formData, "id");
  return id || null;
}

function fileExtension(filename: string) {
  const extension = filename.split(".").pop()?.toLowerCase();
  return extension ? `.${extension.replace(/[^a-z0-9]/g, "")}` : "";
}

function safeFilename(filename: string) {
  const base = filename.replace(/\.[^.]+$/, "");
  const safeBase = base.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return `${safeBase || "asset"}${fileExtension(filename)}`;
}

async function refreshPortfolio() {
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/sitemap.xml");
}

function assertMutation(error: { message: string } | null) {
  if (error) {
    throw new Error(error.message);
  }
}

async function saveRow(table: string, formData: FormData, payload: DbPayload) {
  await requireAdmin();
  const supabase = createSupabaseServiceClient();
  const id = rowId(formData);

  const result = id
    ? await supabase.from(table).update(payload).eq("id", id)
    : await supabase.from(table).insert(payload);

  assertMutation(result.error);
  await refreshPortfolio();
}

async function deleteRow(table: string, formData: FormData) {
  await requireAdmin();
  const id = requiredText(formData, "id", "ID");
  const supabase = createSupabaseServiceClient();
  const result = await supabase.from(table).delete().eq("id", id);
  assertMutation(result.error);
  await refreshPortfolio();
}

export async function signOutAction() {
  const supabase = await createServerSupabaseClient();
  await supabase.auth.signOut();
  redirect("/admin");
}

export async function saveProfileAction(formData: FormData) {
  await requireAdmin();
  const supabase = createSupabaseServiceClient();
  const result = await supabase.from("site_profile").upsert(
    {
      id: "main",
      brand_name: requiredText(formData, "brand_name", "Brand name"),
      hero_headline: requiredText(formData, "hero_headline", "Hero headline"),
      summary_title: requiredText(formData, "summary_title", "Summary title"),
      summary: requiredText(formData, "summary", "Summary"),
      about_title: requiredText(formData, "about_title", "About title"),
      about: requiredText(formData, "about", "About"),
      profile_image_url: text(formData, "profile_image_url"),
      spline_url: text(formData, "spline_url")
    },
    { onConflict: "id" }
  );

  assertMutation(result.error);
  await refreshPortfolio();
}

export async function saveContactAction(formData: FormData) {
  await requireAdmin();
  const supabase = createSupabaseServiceClient();
  const result = await supabase.from("contact_settings").upsert(
    {
      id: "main",
      email: requiredText(formData, "email", "Email"),
      phone: text(formData, "phone"),
      availability_text: requiredText(formData, "availability_text", "Availability text")
    },
    { onConflict: "id" }
  );

  assertMutation(result.error);
  await refreshPortfolio();
}

export async function saveSeoAction(formData: FormData) {
  await requireAdmin();
  const supabase = createSupabaseServiceClient();
  const result = await supabase.from("seo_settings").upsert(
    {
      id: "main",
      title: requiredText(formData, "title", "SEO title"),
      description: requiredText(formData, "description", "SEO description"),
      keywords: listField(formData, "keywords"),
      canonical_url: requiredText(formData, "canonical_url", "Canonical URL"),
      og_image_url: text(formData, "og_image_url")
    },
    { onConflict: "id" }
  );

  assertMutation(result.error);
  await refreshPortfolio();
}

export async function saveSocialAction(formData: FormData) {
  await saveRow("social_links", formData, {
    label: requiredText(formData, "label", "Label"),
    platform: requiredText(formData, "platform", "Platform"),
    url: requiredText(formData, "url", "URL"),
    icon_image_url: text(formData, "icon_image_url"),
    sort_order: numberField(formData, "sort_order"),
    published: published(formData)
  });
}

export async function deleteSocialAction(formData: FormData) {
  await deleteRow("social_links", formData);
}

export async function saveEducationAction(formData: FormData) {
  await saveRow("education", formData, {
    degree: requiredText(formData, "degree", "Degree"),
    institution: requiredText(formData, "institution", "Institution"),
    location: text(formData, "location"),
    period: requiredText(formData, "period", "Period"),
    description: text(formData, "description"),
    sort_order: numberField(formData, "sort_order"),
    published: published(formData)
  });
}

export async function deleteEducationAction(formData: FormData) {
  await deleteRow("education", formData);
}

export async function saveSkillAction(formData: FormData) {
  await saveRow("skills", formData, {
    name: requiredText(formData, "name", "Skill name"),
    category: requiredText(formData, "category", "Category"),
    sort_order: numberField(formData, "sort_order"),
    published: published(formData)
  });
}

export async function deleteSkillAction(formData: FormData) {
  await deleteRow("skills", formData);
}

export async function saveProjectAction(formData: FormData) {
  await saveRow("projects", formData, {
    title: requiredText(formData, "title", "Project title"),
    description: requiredText(formData, "description", "Project description"),
    tech_stack: listField(formData, "tech_stack"),
    live_url: text(formData, "live_url"),
    repo_url: text(formData, "repo_url"),
    image_url: text(formData, "image_url"),
    image_alt: text(formData, "image_alt"),
    sort_order: numberField(formData, "sort_order"),
    published: published(formData)
  });
}

export async function deleteProjectAction(formData: FormData) {
  await deleteRow("projects", formData);
}

export async function saveCertificationAction(formData: FormData) {
  await saveRow("certifications", formData, {
    title: requiredText(formData, "title", "Certification title"),
    issuer: requiredText(formData, "issuer", "Issuer"),
    issue_date: text(formData, "issue_date") || null,
    credential_url: text(formData, "credential_url"),
    file_url: text(formData, "file_url"),
    file_type: text(formData, "file_type"),
    skills: listField(formData, "skills"),
    sort_order: numberField(formData, "sort_order"),
    published: published(formData)
  });
}

export async function deleteCertificationAction(formData: FormData) {
  await deleteRow("certifications", formData);
}

export async function saveTestimonialAction(formData: FormData) {
  await saveRow("testimonials", formData, {
    quote: requiredText(formData, "quote", "Quote"),
    author_name: requiredText(formData, "author_name", "Author name"),
    author_title: text(formData, "author_title"),
    initials: text(formData, "initials"),
    sort_order: numberField(formData, "sort_order"),
    published: published(formData)
  });
}

export async function deleteTestimonialAction(formData: FormData) {
  await deleteRow("testimonials", formData);
}

export async function uploadMediaAction(_previousState: UploadState, formData: FormData): Promise<UploadState> {
  try {
    const user = await requireAdmin();
    const file = formData.get("file");

    if (!(file instanceof File) || file.size === 0) {
      return { message: "Choose an image or PDF to upload.", url: "", ok: false };
    }

    const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "application/pdf"]);
    if (!allowedTypes.has(file.type)) {
      return { message: "Only JPG, PNG, WebP, GIF, or PDF files are allowed.", url: "", ok: false };
    }

    if (file.size > 8 * 1024 * 1024) {
      return { message: "File must be 8 MB or smaller.", url: "", ok: false };
    }

    const folder = text(formData, "folder") || "uploads";
    const safeFolder = folder.toLowerCase().replace(/[^a-z0-9-]/g, "-");
    const path = `${safeFolder}/${Date.now()}-${safeFilename(file.name)}`;
    const supabase = createSupabaseServiceClient();
    const uploadResult = await supabase.storage.from(portfolioBucket).upload(path, file, {
      contentType: file.type,
      upsert: false
    });

    assertMutation(uploadResult.error);

    const {
      data: { publicUrl }
    } = supabase.storage.from(portfolioBucket).getPublicUrl(path);

    await supabase.from("media_assets").insert({
      bucket: portfolioBucket,
      path,
      url: publicUrl,
      filename: file.name,
      content_type: file.type,
      size_bytes: file.size,
      created_by: user.id
    });

    await refreshPortfolio();
    return { message: "Upload complete. Use this URL in any image/file field.", url: publicUrl, ok: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed.";
    return { message, url: "", ok: false };
  }
}
