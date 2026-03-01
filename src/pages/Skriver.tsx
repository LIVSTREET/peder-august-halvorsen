import Layout from "@/components/layout/Layout";
import SeoHead from "@/components/SeoHead";
import EmptyState from "@/components/EmptyState";
import { usePosts } from "@/hooks/usePosts";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { enUS } from "date-fns/locale";
import { useLocale } from "@/contexts/LocaleContext";
import { tKey, tField } from "@/lib/i18n";

export default function Skriver() {
  const { locale, withLocalePath } = useLocale();
  const { data: posts, isLoading } = usePosts();
  const dateLocale = locale === "en" ? enUS : nb;

  return (
    <Layout>
      <SeoHead
        title={tKey("Skriver | Alt jeg skaper", "Writing | Alt jeg skaper", locale)}
        description={tKey("Innlegg og tanker om det jeg bygger og lager.", "Posts and thoughts about what I build and create.", locale)}
      />
      <section className="container pt-16 pb-24 max-w-2xl mx-auto">
        <h1 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-16">
          {tKey("Skriver", "Writing", locale)}
        </h1>

        {isLoading ? (
          <p className="text-muted-foreground text-sm">{tKey("Laster…", "Loading…", locale)}</p>
        ) : !posts || posts.length === 0 ? (
          <EmptyState
            message={tKey("Ingen innlegg ennå", "No posts yet", locale)}
            sub={tKey("Skriver snart mer.", "Writing more soon.", locale)}
          />
        ) : (
          <div className="divide-y divide-border">
            {posts.map((post: any) => (
              <Link
                key={post.id}
                to={withLocalePath(`/skriver/${post.slug}`)}
                className="block py-6 group"
              >
                <div className="flex items-baseline justify-between gap-4">
                  <h2 className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                    {tField(post, "title", locale)}
                  </h2>
                  {post.published_at && (
                    <span className="text-xs font-mono text-muted-foreground shrink-0">
                      {format(new Date(post.published_at), "d. MMM yyyy", { locale: dateLocale })}
                    </span>
                  )}
                </div>
                {(post.excerpt || post.excerpt_en) && (
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                    {tField(post, "excerpt", locale)}
                  </p>
                )}
              </Link>
            ))}
          </div>
        )}
      </section>
    </Layout>
  );
}
