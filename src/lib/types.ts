export type SiteProfile = {
  id: string;
  brandName: string;
  heroHeadline: string;
  summaryTitle: string;
  summary: string;
  aboutTitle: string;
  about: string;
  profileImageUrl: string;
  splineUrl: string;
};

export type SocialLink = {
  id: string;
  label: string;
  platform: string;
  url: string;
  iconImageUrl: string;
  sortOrder: number;
  published: boolean;
};

export type EducationItem = {
  id: string;
  degree: string;
  institution: string;
  location: string;
  period: string;
  description: string;
  sortOrder: number;
  published: boolean;
};

export type Skill = {
  id: string;
  name: string;
  category: string;
  sortOrder: number;
  published: boolean;
};

export type Project = {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  liveUrl: string;
  repoUrl: string;
  imageUrl: string;
  imageAlt: string;
  sortOrder: number;
  published: boolean;
};

export type Certification = {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  credentialUrl: string;
  fileUrl: string;
  fileType: string;
  skills: string[];
  sortOrder: number;
  published: boolean;
};

export type Testimonial = {
  id: string;
  quote: string;
  authorName: string;
  authorTitle: string;
  initials: string;
  sortOrder: number;
  published: boolean;
};

export type ContactSettings = {
  id: string;
  email: string;
  phone: string;
  availabilityText: string;
};

export type SeoSettings = {
  id: string;
  title: string;
  description: string;
  keywords: string[];
  canonicalUrl: string;
  ogImageUrl: string;
};

export type MediaAsset = {
  id: string;
  filename: string;
  url: string;
  path: string;
  contentType: string;
  sizeBytes: number;
  createdAt: string;
};

export type PortfolioData = {
  profile: SiteProfile;
  socials: SocialLink[];
  education: EducationItem[];
  skills: Skill[];
  projects: Project[];
  certifications: Certification[];
  testimonials: Testimonial[];
  contact: ContactSettings;
  seo: SeoSettings;
};
