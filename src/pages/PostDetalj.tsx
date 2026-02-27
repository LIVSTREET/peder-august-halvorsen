import Layout from "@/components/layout/Layout";
import SeoHead from "@/components/SeoHead";
import TagPill from "@/components/TagPill";
import { usePost } from "@/hooks/usePosts";
import { usePostTags, useTags } from "@/hooks/useTags";
import { truncate, stripMarkdown, PERSON_NAME } from "@/lib/seo";
import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { format } from "date-fns";
import { nb } from "date-fns/locale";

export default function PostDetalj() {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isLoading } = usePost(slug || "");
  const { data: postTags } = usePostTags();
  const { data: tags } = useTags();

  if (isLoading) {
    return (
      <Layout>
        <div className="container pt-16 pb-24 max-w-2xl mx-auto">
          <p className="text-muted-foreground">Laster…</p>
        </div>
      </Layout>
    );
  }

  if (!post) {
    return (
      <Layout>
        <div className="container pt-16 pb-24 max-w-2xl mx-auto">
          <p className="text-muted-foreground">Innlegg ikke funnet.</p>
          <Link to="/skriver" className="text-primary text-sm mt-4 inline-block">← Tilbake</Link>
        </div>
      </Layout>
    );
  }

  const tagMap = new Map(tags?.map((t) => [t.id, t]) || []);
  const myTags = postTags?.filter((pt) => pt.post_id === post.id).map((pt) => tagMap.get(pt.tag_id)).filter(Boolean) || [];

  const description = post.excerpt
    ? truncate(post.excerpt)
    : post.content_md
      ? truncate(stripMarkdown(post.content_md))
      : `${post.title} – innlegg av ${PERSON_NAME}.`;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description,
    datePublished: post.published_at || undefined,
    dateModified: post.updated_at || undefined,
    author: { "@type": "Person", name: PERSON_NAME },
  };

  return (
    <Layout>
      <SeoHead
        title={`${post.title} | Alt jeg skaper`}
        description={description}
        pathname={`/skriver/${post.slug}`}
        jsonLd={articleSchema}
      />
      <article className="container pt-16 pb-24 max-w-2xl mx-auto">
        <Link to="/skriver" className="text-xs font-mono text-muted-foreground hover:text-primary mb-6 inline-block">
          ← Alle innlegg
        </Link>

        <h1 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
          {post.title}
        </h1>

        {post.published_at && (
          <p className="mt-3 text-sm font-mono text-muted-foreground">
            {format(new Date(post.published_at), "d. MMMM yyyy", { locale: nb })}
          </p>
        )}

        {myTags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {myTags.map((t: any) => (
              <TagPill key={t.id} label={t.label} />
            ))}
          </div>
        )}

        {post.content_md && (
          <div className="mt-10 prose-editorial">
            <ReactMarkdown>{post.content_md}</ReactMarkdown>
          </div>
        )}
      </article>
    </Layout>
  );
}
