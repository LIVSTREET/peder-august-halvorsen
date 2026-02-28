import { getBaseUrl } from "@/lib/seo";
import { isSlugValid } from "@/lib/slug";
import { copiedToast } from "@/lib/dashboard-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type Props = {
  title: string;
  slug: string;
  excerpt?: string | null;
  coverUrl?: string | null;
  status: string;
  publicPath: string;
};

export function ProjectPreviewCard({
  title,
  slug,
  excerpt,
  coverUrl,
  status,
  publicPath,
}: Props) {
  const publicUrl = getBaseUrl() + publicPath;
  const slugValid = isSlugValid(slug);
  const canOpen = slugValid && status === "published";

  function handleCopy() {
    navigator.clipboard.writeText(publicUrl);
    copiedToast("Lenke kopiert");
  }

  if (!slug.trim() || !slugValid) {
    return (
      <div className="border border-border rounded-md p-4">
        <p className="text-xs text-muted-foreground">
          Legg inn gyldig slug for public preview.
        </p>
      </div>
    );
  }

  return (
    <div className="border border-border rounded-md overflow-hidden">
      {coverUrl && (
        <img
          src={coverUrl}
          alt={title}
          className="w-full h-40 object-cover"
          loading="lazy"
        />
      )}
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <p className="font-display font-bold text-foreground text-sm truncate">
            {title || "Uten tittel"}
          </p>
          <Badge variant="outline" className="text-xs shrink-0">
            {status}
          </Badge>
        </div>
        {excerpt && (
          <p className="text-xs text-muted-foreground line-clamp-2">{excerpt}</p>
        )}
        <p className="text-xs text-muted-foreground font-mono truncate">
          {publicUrl}
        </p>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            disabled={!canOpen}
            onClick={() => window.open(publicUrl, "_blank", "noopener,noreferrer")}
          >
            Åpne public
          </Button>
          <Button size="sm" variant="ghost" onClick={handleCopy}>
            Kopier lenke
          </Button>
        </div>
      </div>
    </div>
  );
}
