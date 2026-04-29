import type { Metadata } from "next";
import { PortfolioPage } from "@/components/portfolio/PortfolioPage";
import { getPortfolioData } from "@/lib/portfolio-data";
import { absoluteUrl } from "@/lib/url";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getPortfolioData();

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    alternates: {
      canonical: seo.canonicalUrl
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: seo.canonicalUrl,
      siteName: "Anubhab's Portfolio",
      type: "website",
      images: seo.ogImageUrl ? [{ url: absoluteUrl(seo.ogImageUrl) }] : []
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      images: seo.ogImageUrl ? [absoluteUrl(seo.ogImageUrl)] : []
    }
  };
}

export default async function Home() {
  const data = await getPortfolioData();
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Anubhab Mohapatra",
    jobTitle: "Computer Science Student & Python Developer",
    description: data.seo.description,
    url: data.seo.canonicalUrl,
    image: absoluteUrl(data.profile.profileImageUrl),
    email: data.contact.email,
    telephone: data.contact.phone,
    alumniOf: {
      "@type": "EducationalOrganization",
      name: "CV Raman Global University"
    },
    knowsAbout: data.skills.map((skill) => skill.name),
    sameAs: data.socials.map((social) => social.url)
  };

  return (
    <>
      <PortfolioPage data={data} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData)
        }}
      />
    </>
  );
}
