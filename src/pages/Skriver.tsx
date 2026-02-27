import Layout from "@/components/layout/Layout";
import SeoHead from "@/components/SeoHead";
import EmptyState from "@/components/EmptyState";
import { usePosts } from "@/hooks/usePosts";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { nb } from "date-fns/locale";

export default function Skriver() {
  const { data: posts, isLoading } = usePosts();

  return (
    <Layout>
      <SeoHead title="Skriver | Alt jeg skaper" description="Innlegg og tanker om det jeg bygger og lager." pathname="/skriver" />
      <section className="container pt-16 pb-24 max-w-2xl mx-auto">
        <h1 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-16">
          Skriver
        </h1>

        {isLoading ? (
          <p className="text-muted-foreground text-sm">Laster…</p>
        ) : !posts || posts.length === 0 ? (
          <EmptyState message="Ingen innlegg ennå" sub="Skriver snart mer." />
        ) : (
          <div className="divide-y divide-border">
            {posts.map((post) => (
              <Link
                key={post.id}
                to={`/skriver/${post.slug}`}
                className="block py-6 group"
              >
                <div className="flex items-baseline justify-between gap-4">
                  <h2 className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                    {post.title}
                  </h2>
                  {post.published_at && (
                    <span className="text-xs font-mono text-muted-foreground shrink-0">
                      {format(new Date(post.published_at), "d. MMM yyyy", { locale: nb })}
                    </span>
                  )}
                </div>
                {post.excerpt && (
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
                )}
              </Link>
            ))}
          </div>
        )}
      </section>
    </Layout>
  );
}
