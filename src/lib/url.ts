import { siteUrl } from "@/lib/env";

export function absoluteUrl(pathOrUrl: string) {
  if (!pathOrUrl) {
    return siteUrl;
  }

  if (/^https?:\/\//i.test(pathOrUrl)) {
    return pathOrUrl;
  }

  return `${siteUrl}${pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`}`;
}
