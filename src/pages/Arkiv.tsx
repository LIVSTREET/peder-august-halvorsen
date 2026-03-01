import Layout from "@/components/layout/Layout";
import SeoHead from "@/components/SeoHead";
import TagPill from "@/components/TagPill";
import EmptyState from "@/components/EmptyState";
import { useArchiveItems } from "@/hooks/useArchiveItems";
import { useTags, useArchiveTags } from "@/hooks/useTags";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { useLocale } from "@/contexts/LocaleContext";
import { tKey, tField } from "@/lib/i18n";

export default function Arkiv() {
  const { locale } = useLocale();
  const { data: items } = useArchiveItems();
  const { data: tags } = useTags();
  const { data: archiveTags } = useArchiveTags();
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const tagMap = new Map(tags?.map((t) => [t.id, t]) || []);
  const itemTagMap = new Map<string, string[]>();
  archiveTags?.forEach((at) => {
    const list = itemTagMap.get(at.archive_id) || [];
    list.push(at.tag_id);
    itemTagMap.set(at.archive_id, list);
  });

  const filtered = activeTag
    ? items?.filter((item) => itemTagMap.get(item.id)?.includes(activeTag))
    : items;

  const usedTagIds = new Set(archiveTags?.map((at) => at.tag_id) || []);
  const availableTags = tags?.filter((t) => usedTagIds.has(t.id)) || [];

  return (
    <Layout>
      <SeoHead
        title={tKey("Arkiv | Alt jeg skaper", "Archive | Alt jeg skaper", locale)}
        description={tKey("Arkiv over notater, lenker, bilder og tanker.", "Archive of notes, links, images and thoughts.", locale)}
      />
      <section className="container pt-16 pb-24">
        <h1 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-4">
          {tKey("Arkiv", "Archive", locale)}
        </h1>
        <p className="text-muted-foreground mb-8">
          {tKey("Notater, lenker, bilder og tanker.", "Notes, links, images and thoughts.", locale)}
        </p>

        {availableTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-10">
            <TagPill
              label={tKey("Alle", "All", locale)}
              active={activeTag === null}
              onClick={() => setActiveTag(null)}
            />
            {availableTags.map((tag) => (
              <TagPill
                key={tag.id}
                label={tag.label}
                active={activeTag === tag.id}
                onClick={() => setActiveTag(activeTag === tag.id ? null : tag.id)}
              />
            ))}
          </div>
        )}

        {!filtered || filtered.length === 0 ? (
          <EmptyState
            message={tKey("Tomt her foreløpig", "Nothing here yet", locale)}
            sub={tKey("Innhold kommer snart.", "Content coming soon.", locale)}
          />
        ) : (
          <div className="divide-y divide-border">
            {filtered.map((item) => {
              const itemTags = (itemTagMap.get(item.id) || []).map((id) => tagMap.get(id)).filter(Boolean);
              const itemTitle = tField(item, "title", locale);
              const itemBody = tField(item, "body_md", locale);
              return (
                <div key={item.id} className="py-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-display text-lg font-semibold text-foreground">
                        {item.external_url ? (
                          <a href={item.external_url} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                            {itemTitle} ↗
                          </a>
                        ) : (
                          itemTitle
                        )}
                      </h3>
                      {itemBody && (
                        <div className="mt-2 prose-editorial text-sm text-foreground/70">
                          <ReactMarkdown>{itemBody}</ReactMarkdown>
                        </div>
                      )}
                      {itemTags.length > 0 && (
                        <div className="mt-3 flex gap-2">
                          {itemTags.map((t: any) => (
                            <TagPill key={t.id} label={t.label} />
                          ))}
                        </div>
                      )}
                    </div>
                    <span className="text-xs font-mono text-muted-foreground shrink-0">
                      {item.kind}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </Layout>
  );
}
