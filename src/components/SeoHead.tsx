import { useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { getCanonicalUrl, getBaseUrl, getLocaleCanonical, SITE_NAME } from "@/lib/seo";
import { getPathWithoutLocale, type Locale } from "@/lib/i18n";

interface SeoHeadProps {
  title: string;
  description: string;
  /** Hvis utelatt: brukes location.pathname (anbefalt). Overstyr kun i spesialtilfeller. */
  pathname?: string;
  locale?: Locale;
  noindex?: boolean;
  ogImage?: string | null;
  ogTitle?: string;
  jsonLd?: object | object[];
}

export default function SeoHead({
  title,
  description,
  pathname: pathnameProp,
  locale: localeProp,
  noindex = false,
  ogImage,
  ogTitle,
  jsonLd,
}: SeoHeadProps) {
  const location = useLocation();
  const pathname = pathnameProp ?? location.pathname;

  const pathWithoutLocale = getPathWithoutLocale(pathname);
  const locale: Locale = localeProp ?? (pathname.startsWith("/en") ? "en" : "no");

  const canonical = getCanonicalUrl(pathname);
  const baseUrl = getBaseUrl();
  const imageUrl = ogImage
    ? ogImage.startsWith("http")
      ? ogImage
      : `${baseUrl.replace(/\/$/, "")}${ogImage.startsWith("/") ? "" : "/"}${ogImage}`
    : `${baseUrl}/og-default.png`;

  const canonicalNo = getLocaleCanonical(pathWithoutLocale, "no");
  const canonicalEn = getLocaleCanonical(pathWithoutLocale, "en");

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      <link rel="alternate" hrefLang="no" href={canonicalNo} />
      <link rel="alternate" hrefLang="en" href={canonicalEn} />
      <link rel="alternate" hrefLang="x-default" href={canonicalNo} />
      {noindex && <meta name="robots" content="noindex,nofollow" />}
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={ogTitle ?? title.replace(/\s*\|\s*Alt jeg skaper$/, "")} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={ogTitle ?? title} />
      <meta name="twitter:description" content={description} />
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(Array.isArray(jsonLd) ? jsonLd : [jsonLd])}
        </script>
      )}
    </Helmet>
  );
}
