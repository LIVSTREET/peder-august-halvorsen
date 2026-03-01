import Layout from "@/components/layout/Layout";
import SeoHead from "@/components/SeoHead";
import TagPill from "@/components/TagPill";
import { usePost } from "@/hooks/usePosts";
import { usePostTags, useTags } from "@/hooks/useTags";
import { useAssets } from "@/hooks/useAssets";
import { getAssetUrl } from "@/lib/supabase-helpers";
import { truncate, stripMarkdown, PERSON_NAME } from "@/lib/seo";
import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { format } from "date-fns";
import { nb, enUS } from "date-fns/locale";
import { useLocale } from "@/contexts/LocaleContext";
import { tKey, tField } from "@/lib/i18n";

export default function PostDetalj() {
  const { slug } = useParams<{ slug: string }>();
  const { locale, withLocalePath } = useLocale();
  const { data: post, isLoading } = usePost(slug || "");
  const { data: postTags } = usePostTags();
  const { data: tags } = useTags();
  const { data: assets } = useAssets("post", post?.id ?? "");
  const dateLocale = locale === "en" ? enUS : nb;

  if (isLoading) {
    return (
      <Layout>
        <div className="container pt-16 pb-24 max-w-2xl mx-auto">
          <p className="text-muted-foreground">{tKey("Laster…", "Loading…", locale)}</p>
        </div>
      </Layout>
    );
  }

  if (!post) {
    return (
      <Layout>
        <div className="container pt-16 pb-24 max-w-2xl mx-auto">
          <p className="text-muted-foreground">{tKey("Innlegg ikke funnet.", "Post not found.", locale)}</p>
          <Link to={withLocalePath("/skriver")} className="text-primary text-sm mt-4 inline-block">
            ← {tKey("Tilbake", "Back", locale)}
          </Link>
        </div>
      </Layout>
    );
  }

  const title = tField(post, "title", locale);
  const excerpt = tField(post, "excerpt", locale);
  const contentMd = tField(post, "content_md", locale);

  const tagMap = new Map(tags?.map((t) => [t.id, t]) || []);
  const myTags = postTags?.filter((pt) => pt.post_id === post.id).map((pt) => tagMap.get(pt.tag_id)).filter(Boolean) || [];

  const ogAsset = assets?.find((a) => ["og", "image"].includes(a.kind));
  const ogImageUrl = ogAsset
    ? getAssetUrl(ogAsset.storage_bucket, ogAsset.storage_path)
    : null;

  const description = excerpt
    ? truncate(excerpt)
    : contentMd
      ? truncate(stripMarkdown(contentMd))
      : `${title} – ${tKey("innlegg av", "post by", locale)} ${PERSON_NAME}.`;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    datePublished: post.published_at || undefined,
    dateModified: post.updated_at || undefined,
    author: { "@type": "Person", name: PERSON_NAME },
  };

  return (
    <Layout>
      <SeoHead
        title={`${title} | ${tKey("Skriver", "Writing", locale)} | ${tKey("Alt jeg skaper", "What I create", locale)}`}
        description={description}
        pathname={`/skriver/${post.slug}`}
        ogImage={ogImageUrl}
        jsonLd={articleSchema}
      />
      <article className="container pt-16 pb-24 max-w-2xl mx-auto">
        <Link to={withLocalePath("/skriver")} className="text-xs font-mono text-muted-foreground hover:text-primary mb-6 inline-block">
          ← {tKey("Alle innlegg", "All posts", locale)}
        </Link>

        <h1 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
          {title}
        </h1>

        {post.published_at && (
          <p className="mt-3 text-sm font-mono text-muted-foreground">
            {format(new Date(post.published_at), "d. MMMM yyyy", { locale: dateLocale })}
          </p>
        )}

        {myTags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {myTags.map((t: any) => (
              <TagPill key={t.id} label={t.label} />
            ))}
          </div>
        )}

        {contentMd && (
          <div className="mt-10 prose-editorial">
            <ReactMarkdown>{contentMd}</ReactMarkdown>
          </div>
        )}
      </article>
    </Layout>
  );
}
