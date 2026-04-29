"use client";

import { useActionState, useState } from "react";
import {
  deleteCertificationAction,
  deleteEducationAction,
  deleteProjectAction,
  deleteSkillAction,
  deleteSocialAction,
  deleteTestimonialAction,
  saveCertificationAction,
  saveContactAction,
  saveEducationAction,
  saveProfileAction,
  saveProjectAction,
  saveSeoAction,
  saveSkillAction,
  saveSocialAction,
  saveTestimonialAction,
  signOutAction,
  uploadMediaAction
} from "@/app/admin/actions";
import type {
  Certification,
  EducationItem,
  PortfolioData,
  Project,
  Skill,
  SocialLink,
  Testimonial
} from "@/lib/types";

type Props = {
  data: PortfolioData;
  adminEmail: string;
  signedInEmail: string;
};

const tabs = ["site", "socials", "education", "skills", "projects", "certifications", "testimonials", "media"] as const;
type Tab = (typeof tabs)[number];

const emptyUpload = { message: "", url: "", ok: false };

function Field({
  label,
  name,
  defaultValue = "",
  required = false,
  type = "text"
}: {
  label: string;
  name: string;
  defaultValue?: string | number;
  required?: boolean;
  type?: string;
}) {
  return (
    <div className="field">
      <label htmlFor={name}>{label}</label>
      <input id={name} name={name} type={type} defaultValue={defaultValue} required={required} />
    </div>
  );
}

function TextArea({
  label,
  name,
  defaultValue = "",
  required = false
}: {
  label: string;
  name: string;
  defaultValue?: string;
  required?: boolean;
}) {
  return (
    <div className="field">
      <label htmlFor={name}>{label}</label>
      <textarea id={name} name={name} defaultValue={defaultValue} required={required} />
    </div>
  );
}

function FileField({
  label,
  name,
  accept
}: {
  label: string;
  name: string;
  accept: string;
}) {
  return (
    <div className="field">
      <label htmlFor={name}>{label}</label>
      <input id={name} name={name} type="file" accept={accept} />
      <p className="field-help">Optional. Choosing a file uploads it to Supabase and replaces the URL on save.</p>
    </div>
  );
}

function Published({ defaultChecked = true }: { defaultChecked?: boolean }) {
  return (
    <label className="check-field">
      <input name="published" type="checkbox" defaultChecked={defaultChecked} />
      Published
    </label>
  );
}

function DeleteForm({ id, action }: { id: string; action: (formData: FormData) => void }) {
  return (
    <form action={action}>
      <input type="hidden" name="id" value={id} />
      <button className="danger-button" type="submit">
        Delete
      </button>
    </form>
  );
}

function SaveButton({ label = "Save" }: { label?: string }) {
  return (
    <button className="admin-button primary" type="submit">
      {label}
    </button>
  );
}

function SitePanel({ data }: { data: PortfolioData }) {
  return (
    <div className="admin-grid">
      <form className="admin-form" action={saveProfileAction}>
        <h3>Profile Content</h3>
        <Field label="Brand name" name="brand_name" defaultValue={data.profile.brandName} required />
        <TextArea label="Hero headline" name="hero_headline" defaultValue={data.profile.heroHeadline} required />
        <Field label="Summary title" name="summary_title" defaultValue={data.profile.summaryTitle} required />
        <TextArea label="Summary" name="summary" defaultValue={data.profile.summary} required />
        <Field label="About title" name="about_title" defaultValue={data.profile.aboutTitle} required />
        <TextArea label="About" name="about" defaultValue={data.profile.about} required />
        <Field label="Profile image URL" name="profile_image_url" defaultValue={data.profile.profileImageUrl} />
        <Field label="Spline URL" name="spline_url" defaultValue={data.profile.splineUrl} />
        <SaveButton />
      </form>

      <div className="admin-form">
        <form className="admin-form nested-form" action={saveContactAction}>
          <h3>Contact</h3>
          <Field label="Email" name="email" type="email" defaultValue={data.contact.email} required />
          <Field label="Phone" name="phone" defaultValue={data.contact.phone} />
          <TextArea
            label="Availability text"
            name="availability_text"
            defaultValue={data.contact.availabilityText}
            required
          />
          <SaveButton />
        </form>
        <form className="admin-form nested-form" action={saveSeoAction}>
          <h3>SEO</h3>
          <Field label="Title" name="title" defaultValue={data.seo.title} required />
          <TextArea label="Description" name="description" defaultValue={data.seo.description} required />
          <Field label="Keywords, comma separated" name="keywords" defaultValue={data.seo.keywords.join(", ")} />
          <Field label="Canonical URL" name="canonical_url" defaultValue={data.seo.canonicalUrl} required />
          <Field label="Open Graph image URL" name="og_image_url" defaultValue={data.seo.ogImageUrl} />
          <SaveButton />
        </form>
      </div>
    </div>
  );
}

function SocialForm({ item }: { item?: SocialLink }) {
  return (
    <div className="admin-item">
      <form className="admin-item-form" action={saveSocialAction}>
        {item ? <input type="hidden" name="id" value={item.id} /> : null}
        <div className="form-row">
          <Field label="Label" name="label" defaultValue={item?.label} required />
          <Field label="Platform" name="platform" defaultValue={item?.platform} required />
        </div>
        <Field label="URL" name="url" defaultValue={item?.url} required />
        <Field label="Icon image URL" name="icon_image_url" defaultValue={item?.iconImageUrl} />
        <div className="form-row">
          <Field label="Sort order" name="sort_order" type="number" defaultValue={item?.sortOrder ?? 0} />
          <Published defaultChecked={item?.published ?? true} />
        </div>
        <SaveButton label={item ? "Update social" : "Add social"} />
      </form>
      {item ? <DeleteForm id={item.id} action={deleteSocialAction} /> : null}
    </div>
  );
}

function EducationForm({ item }: { item?: EducationItem }) {
  return (
    <div className="admin-item">
      <form className="admin-item-form" action={saveEducationAction}>
        {item ? <input type="hidden" name="id" value={item.id} /> : null}
        <div className="form-row">
          <Field label="Degree" name="degree" defaultValue={item?.degree} required />
          <Field label="Institution" name="institution" defaultValue={item?.institution} required />
        </div>
        <div className="form-row">
          <Field label="Location" name="location" defaultValue={item?.location} />
          <Field label="Period" name="period" defaultValue={item?.period} required />
        </div>
        <TextArea label="Description" name="description" defaultValue={item?.description} />
        <div className="form-row">
          <Field label="Sort order" name="sort_order" type="number" defaultValue={item?.sortOrder ?? 0} />
          <Published defaultChecked={item?.published ?? true} />
        </div>
        <SaveButton label={item ? "Update education" : "Add education"} />
      </form>
      {item ? <DeleteForm id={item.id} action={deleteEducationAction} /> : null}
    </div>
  );
}

function SkillForm({ item }: { item?: Skill }) {
  return (
    <div className="admin-item">
      <form className="admin-item-form" action={saveSkillAction}>
        {item ? <input type="hidden" name="id" value={item.id} /> : null}
        <div className="form-row">
          <Field label="Name" name="name" defaultValue={item?.name} required />
          <Field label="Category" name="category" defaultValue={item?.category} required />
        </div>
        <div className="form-row">
          <Field label="Sort order" name="sort_order" type="number" defaultValue={item?.sortOrder ?? 0} />
          <Published defaultChecked={item?.published ?? true} />
        </div>
        <SaveButton label={item ? "Update skill" : "Add skill"} />
      </form>
      {item ? <DeleteForm id={item.id} action={deleteSkillAction} /> : null}
    </div>
  );
}

function ProjectForm({ item }: { item?: Project }) {
  return (
    <div className="admin-item">
      <form className="admin-item-form" action={saveProjectAction} encType="multipart/form-data">
        {item ? <input type="hidden" name="id" value={item.id} /> : null}
        <Field label="Title" name="title" defaultValue={item?.title} required />
        <TextArea label="Description" name="description" defaultValue={item?.description} required />
        <Field label="Tech stack, comma separated" name="tech_stack" defaultValue={item?.techStack.join(", ")} />
        <div className="form-row">
          <Field label="Live URL" name="live_url" defaultValue={item?.liveUrl} />
          <Field label="Repository URL" name="repo_url" defaultValue={item?.repoUrl} />
        </div>
        <Field label="Image URL" name="image_url" defaultValue={item?.imageUrl} />
        <FileField label="Upload project image to Supabase" name="project_image_file" accept="image/*" />
        <Field label="Image alt text" name="image_alt" defaultValue={item?.imageAlt} />
        <div className="form-row">
          <Field label="Sort order" name="sort_order" type="number" defaultValue={item?.sortOrder ?? 0} />
          <Published defaultChecked={item?.published ?? true} />
        </div>
        <SaveButton label={item ? "Update project" : "Add project"} />
      </form>
      {item ? <DeleteForm id={item.id} action={deleteProjectAction} /> : null}
    </div>
  );
}

function CertificationForm({ item }: { item?: Certification }) {
  return (
    <div className="admin-item">
      <form className="admin-item-form" action={saveCertificationAction} encType="multipart/form-data">
        {item ? <input type="hidden" name="id" value={item.id} /> : null}
        <div className="form-row">
          <Field label="Title" name="title" defaultValue={item?.title} required />
          <Field label="Issuer" name="issuer" defaultValue={item?.issuer} required />
        </div>
        <div className="form-row">
          <Field label="Issue date" name="issue_date" type="date" defaultValue={item?.issueDate} />
          <Field label="Credential URL" name="credential_url" defaultValue={item?.credentialUrl} />
        </div>
        <Field label="Certificate image/PDF URL" name="file_url" defaultValue={item?.fileUrl} />
        <FileField label="Upload certificate image/PDF to Supabase" name="certificate_file" accept="image/*,application/pdf" />
        <Field label="File type" name="file_type" defaultValue={item?.fileType} />
        <Field label="Skills, comma separated" name="skills" defaultValue={item?.skills.join(", ")} />
        <div className="form-row">
          <Field label="Sort order" name="sort_order" type="number" defaultValue={item?.sortOrder ?? 0} />
          <Published defaultChecked={item?.published ?? true} />
        </div>
        <SaveButton label={item ? "Update certification" : "Add certification"} />
      </form>
      {item ? <DeleteForm id={item.id} action={deleteCertificationAction} /> : null}
    </div>
  );
}

function TestimonialForm({ item }: { item?: Testimonial }) {
  return (
    <div className="admin-item">
      <form className="admin-item-form" action={saveTestimonialAction}>
        {item ? <input type="hidden" name="id" value={item.id} /> : null}
        <TextArea label="Quote" name="quote" defaultValue={item?.quote} required />
        <div className="form-row">
          <Field label="Author name" name="author_name" defaultValue={item?.authorName} required />
          <Field label="Author title" name="author_title" defaultValue={item?.authorTitle} />
        </div>
        <div className="form-row">
          <Field label="Initials" name="initials" defaultValue={item?.initials} />
          <Field label="Sort order" name="sort_order" type="number" defaultValue={item?.sortOrder ?? 0} />
        </div>
        <Published defaultChecked={item?.published ?? true} />
        <SaveButton label={item ? "Update testimonial" : "Add testimonial"} />
      </form>
      {item ? <DeleteForm id={item.id} action={deleteTestimonialAction} /> : null}
    </div>
  );
}

function ListPanel<T>({
  title,
  items,
  render
}: {
  title: string;
  items: T[];
  render: (item?: T) => React.ReactNode;
}) {
  return (
    <section className="admin-card">
      <h2>{title}</h2>
      <p className="admin-muted">Edit existing rows or use the blank form at the end to add a new one.</p>
      <div className="admin-grid">
        {items.map((item, index) => (
          <div key={index}>{render(item)}</div>
        ))}
        <div>{render(undefined)}</div>
      </div>
    </section>
  );
}

function MediaPanel() {
  const [state, formAction, pending] = useActionState(uploadMediaAction, emptyUpload);

  return (
    <section className="admin-card">
      <h2>Media Uploads</h2>
      <p className="admin-muted">
        Upload project screenshots, profile images, and certificate files to Supabase Storage. Copy the returned URL into
        the matching content field.
      </p>
      <form className="admin-form" action={formAction}>
        <div className="form-row">
          <div className="field">
            <label htmlFor="folder">Folder</label>
            <select id="folder" name="folder" defaultValue="uploads">
              <option value="profile">Profile</option>
              <option value="projects">Projects</option>
              <option value="certifications">Certifications</option>
              <option value="uploads">Uploads</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="file">File</label>
            <input id="file" name="file" type="file" accept="image/*,application/pdf" required />
          </div>
        </div>
        <button className="admin-button primary" type="submit" disabled={pending}>
          {pending ? "Uploading..." : "Upload file"}
        </button>
      </form>
      {state.message ? (
        <div className={state.ok ? "upload-result success" : "upload-result"}>
          <p>{state.message}</p>
          {state.url ? <input readOnly value={state.url} /> : null}
          {state.url && !state.url.endsWith(".pdf") ? <img src={state.url} alt="Uploaded asset preview" /> : null}
        </div>
      ) : null}
    </section>
  );
}

export function AdminDashboard({ data, adminEmail, signedInEmail }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("site");

  return (
    <main className="admin-shell">
      <header className="admin-header">
        <div>
          <h1>Portfolio Admin</h1>
          <p>
            Signed in as {signedInEmail}. Admin access is locked to {adminEmail}.
          </p>
        </div>
        <form action={signOutAction}>
          <button className="admin-button" type="submit">
            Sign out
          </button>
        </form>
      </header>

      <div className="admin-tabs" aria-label="Admin sections">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={activeTab === tab ? "active" : ""}
            type="button"
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "site" ? (
        <section className="admin-card">
          <h2>Site Settings</h2>
          <p className="admin-muted">Controls hero, summary, about, contact, and SEO metadata.</p>
          <SitePanel data={data} />
        </section>
      ) : null}
      {activeTab === "socials" ? (
        <ListPanel title="Social Links" items={data.socials} render={(item) => <SocialForm item={item} />} />
      ) : null}
      {activeTab === "education" ? (
        <ListPanel title="Education" items={data.education} render={(item) => <EducationForm item={item} />} />
      ) : null}
      {activeTab === "skills" ? (
        <ListPanel title="Skills" items={data.skills} render={(item) => <SkillForm item={item} />} />
      ) : null}
      {activeTab === "projects" ? (
        <ListPanel title="Projects" items={data.projects} render={(item) => <ProjectForm item={item} />} />
      ) : null}
      {activeTab === "certifications" ? (
        <ListPanel
          title="Certifications"
          items={data.certifications}
          render={(item) => <CertificationForm item={item} />}
        />
      ) : null}
      {activeTab === "testimonials" ? (
        <ListPanel
          title="Testimonials"
          items={data.testimonials}
          render={(item) => <TestimonialForm item={item} />}
        />
      ) : null}
      {activeTab === "media" ? <MediaPanel /> : null}
    </main>
  );
}
