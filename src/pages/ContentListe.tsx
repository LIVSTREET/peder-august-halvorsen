import Layout from "@/components/layout/Layout";
import SeoHead from "@/components/SeoHead";
import EmptyState from "@/components/EmptyState";
import { usePublishedContentByType } from "@/hooks/useContentItems";
import type { ContentType } from "@/lib/content-types";
import { CONTENT_TYPE_ROUTES, TYPE_LABEL } from "@/lib/content-types";
import { Link } from "react-router-dom";

interface Props {
  type: ContentType;
  title: string;
  description: string;
}

export default function ContentListe({ type, title, description }: Props) {
  const { data: items, isLoading } = usePublishedContentByType(type);
  const route = CONTENT_TYPE_ROUTES[type];

  return (
    <Layout>
      <SeoHead title={`${title} | Alt jeg skaper`} description={description} pathname={route.list} />
      <div className="container pt-16 pb-24 max-w-3xl mx-auto">
        <h1 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">{title}</h1>
        <p className="mt-3 text-muted-foreground">{description}</p>

        {isLoading ? (
          <p className="mt-8 text-muted-foreground text-sm">Laster…</p>
        ) : !items?.length ? (
          <EmptyState message="Ingenting her ennå" sub="Kommer snart." />
        ) : (
          <ul className="mt-10 divide-y divide-border">
            {items.map((row: any) => (
              <li key={row.id} className="py-4">
                <Link to={`${route.path}/${row.slug}`} className="group block">
                  <h2 className="font-display text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                    {row.title}
                  </h2>
                  {row.excerpt && <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{row.excerpt}</p>}
                  {row.published_at && (
                    <span className="mt-1 block text-xs font-mono text-muted-foreground">
                      {new Date(row.published_at).toLocaleDateString("nb-NO")}
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
