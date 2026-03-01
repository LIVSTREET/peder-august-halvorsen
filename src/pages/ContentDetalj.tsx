import Layout from "@/components/layout/Layout";
import SeoHead from "@/components/SeoHead";
import { useParams, Link } from "react-router-dom";
import { useContentItemBySlug } from "@/hooks/useContentItems";
import { CONTENT_TYPE_ROUTES } from "@/lib/content-types";
import type { ContentType } from "@/lib/content-types";
import { truncate } from "@/lib/seo";
import ReactMarkdown from "react-markdown";
import { useLocale } from "@/contexts/LocaleContext";
import { tKey, tField } from "@/lib/i18n";

const TYPE_LABEL: Record<ContentType, { no: string; en: string }> = {
  work: { no: "Arbeid", en: "Work" },
  build: { no: "Nå bygger jeg", en: "Building now" },
  archive: { no: "Arkiv", en: "Archive" },
};

interface Props {
  type: ContentType;
}

export default function ContentDetalj({ type }: Props) {
  const { slug } = useParams<{ slug: string }>();
  const { locale, withLocalePath } = useLocale();
  const { data: item, isLoading } = useContentItemBySlug(slug, type);
  const route = CONTENT_TYPE_ROUTES[type];
  const typeLabel = TYPE_LABEL[type][locale];

  if (isLoading) {
    return (
      <Layout>
        <div className="container pt-16 pb-24">
          <p className="text-muted-foreground">{tKey("Laster…", "Loading…", locale)}</p>
        </div>
      </Layout>
    );
  }

  if (!item) {
    return (
      <Layout>
        <div className="container pt-16 pb-24">
          <p className="text-muted-foreground">{tKey("Ikke funnet.", "Not found.", locale)}</p>
          <Link to={withLocalePath(route.list)} className="text-primary text-sm mt-4 inline-block">
            ← {tKey("Tilbake", "Back", locale)}
          </Link>
        </div>
      </Layout>
    );
  }

  const title = tField(item, "title", locale);
  const excerpt = tField(item, "excerpt", locale);
  const body = tField(item, "body", locale);

  const metaDesc = excerpt ? truncate(excerpt) : `${title} – ${typeLabel}`;

  return (
    <Layout>
      <SeoHead
        title={`${title} | ${typeLabel} | Alt jeg skaper`}
        description={metaDesc}
        pathname={withLocalePath(`${route.path}/${item.slug}`)}
      />
      <article className="container pt-16 pb-24 max-w-3xl mx-auto">
        <Link to={withLocalePath(route.list)} className="text-xs font-mono text-muted-foreground hover:text-primary mb-6 inline-block">
          ← {typeLabel}
        </Link>
        <h1 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
          {title}
        </h1>
        {item.published_at && (
          <p className="mt-3 text-sm font-mono text-muted-foreground">
            {new Date(item.published_at).toLocaleDateString(locale === "en" ? "en-GB" : "nb-NO")}
          </p>
        )}
        {body && (
          <div className="mt-10 prose prose-neutral dark:prose-invert max-w-none">
            <ReactMarkdown>{body}</ReactMarkdown>
          </div>
        )}
      </article>
    </Layout>
  );
}
