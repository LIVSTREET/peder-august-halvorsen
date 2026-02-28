import Layout from "@/components/layout/Layout";
import SeoHead from "@/components/SeoHead";
import { useParams, Link } from "react-router-dom";
import { useContentItemBySlug } from "@/hooks/useContentItems";
import { CONTENT_TYPE_ROUTES, TYPE_LABEL } from "@/lib/content-types";
import type { ContentType } from "@/lib/content-types";
import { truncate } from "@/lib/seo";
import ReactMarkdown from "react-markdown";

interface Props {
  type: ContentType;
}

export default function ContentDetalj({ type }: Props) {
  const { slug } = useParams<{ slug: string }>();
  const { data: item, isLoading } = useContentItemBySlug(slug, type);
  const route = CONTENT_TYPE_ROUTES[type];

  if (isLoading) {
    return <Layout><div className="container pt-16 pb-24"><p className="text-muted-foreground">Laster…</p></div></Layout>;
  }

  if (!item) {
    return (
      <Layout>
        <div className="container pt-16 pb-24">
          <p className="text-muted-foreground">Ikke funnet.</p>
          <Link to={route.list} className="text-primary text-sm mt-4 inline-block">← Tilbake</Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SeoHead
        title={`${item.title} | ${TYPE_LABEL[type]} | Alt jeg skaper`}
        description={item.excerpt ? truncate(item.excerpt) : `${item.title} – ${TYPE_LABEL[type]}`}
        pathname={`${route.path}/${item.slug}`}
      />
      <article className="container pt-16 pb-24 max-w-3xl mx-auto">
        <Link to={route.list} className="text-xs font-mono text-muted-foreground hover:text-primary mb-6 inline-block">
          ← {TYPE_LABEL[type]}
        </Link>
        <h1 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
          {item.title}
        </h1>
        {item.published_at && (
          <p className="mt-3 text-sm font-mono text-muted-foreground">
            {new Date(item.published_at).toLocaleDateString("nb-NO")}
          </p>
        )}
        {(item as any).body && (
          <div className="mt-10 prose prose-neutral dark:prose-invert max-w-none">
            <ReactMarkdown>{(item as any).body}</ReactMarkdown>
          </div>
        )}
      </article>
    </Layout>
  );
}
