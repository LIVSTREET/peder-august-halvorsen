import Layout from "@/components/layout/Layout";
import SeoHead from "@/components/SeoHead";
import EmptyState from "@/components/EmptyState";
import { usePublishedContentByType } from "@/hooks/useContentItems";
import type { ContentType } from "@/lib/content-types";
import { CONTENT_TYPE_ROUTES } from "@/lib/content-types";
import { Link } from "react-router-dom";
import { useLocale } from "@/contexts/LocaleContext";
import { tKey, tField } from "@/lib/i18n";

const LIST_COPY: Record<ContentType, { titleNo: string; titleEn: string; descNo: string; descEn: string }> = {
  work: {
    titleNo: "Arbeid", titleEn: "Work",
    descNo: "Utvalgte arbeider og oppdateringer.", descEn: "Selected work and updates.",
  },
  build: {
    titleNo: "Nå bygger jeg", titleEn: "Building now",
    descNo: "Det jeg jobber med akkurat nå.", descEn: "What I'm working on right now.",
  },
  archive: {
    titleNo: "Arkiv", titleEn: "Archive",
    descNo: "Arkiv over innhold.", descEn: "Content archive.",
  },
};

interface Props {
  type: ContentType;
  title: string;
  description: string;
}

export default function ContentListe({ type }: Props) {
  const { locale, withLocalePath } = useLocale();
  const { data: items, isLoading } = usePublishedContentByType(type);
  const route = CONTENT_TYPE_ROUTES[type];
  const copy = LIST_COPY[type];
  const titleText = locale === "en" ? copy.titleEn : copy.titleNo;
  const descText = locale === "en" ? copy.descEn : copy.descNo;

  return (
    <Layout>
      <SeoHead title={`${titleText} | Alt jeg skaper`} description={descText} pathname={withLocalePath(route.list)} />
      <div className="container pt-16 pb-24 max-w-3xl mx-auto">
        <h1 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">{titleText}</h1>
        <p className="mt-3 text-muted-foreground">{descText}</p>

        {isLoading ? (
          <p className="mt-8 text-muted-foreground text-sm">{tKey("Laster…", "Loading…", locale)}</p>
        ) : !items?.length ? (
          <EmptyState
            message={tKey("Ingenting her ennå", "Nothing here yet", locale)}
            sub={tKey("Kommer snart.", "Coming soon.", locale)}
          />
        ) : (
          <ul className="mt-10 divide-y divide-border">
            {items.map((row: any) => (
              <li key={row.id} className="py-4">
                <Link to={withLocalePath(`${route.path}/${row.slug}`)} className="group block">
                  <h2 className="font-display text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                    {tField(row, "title", locale)}
                  </h2>
                  {(row.excerpt || row.excerpt_en) && (
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                      {tField(row, "excerpt", locale)}
                    </p>
                  )}
                  {row.published_at && (
                    <span className="mt-1 block text-xs font-mono text-muted-foreground">
                      {new Date(row.published_at).toLocaleDateString(locale === "en" ? "en-GB" : "nb-NO")}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Layout>
  );
}
