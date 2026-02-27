import { Helmet } from "react-helmet-async";
import { getCanonicalUrl, getBaseUrl, SITE_NAME } from "@/lib/seo";

interface SeoHeadProps {
  title: string;
  description: string;
  pathname: string;
  noindex?: boolean;
  ogImage?: string | null;
  ogTitle?: string;
  jsonLd?: object | object[];
}

export default function SeoHead({
  title,
  description,
  pathname,
  noindex = false,
  ogImage,
  ogTitle,
  jsonLd,
}: SeoHeadProps) {
  const canonical = getCanonicalUrl(pathname);
  const baseUrl = getBaseUrl();
  const imageUrl = ogImage
    ? ogImage.startsWith("http")
      ? ogImage
      : `${baseUrl.replace(/\/$/, "")}${ogImage.startsWith("/") ? "" : "/"}${ogImage}`
    : `${baseUrl}/og-default.png`;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      {noindex && <meta name="robots" content="noindex,nofollow" />}
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:type" content="website" />
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
