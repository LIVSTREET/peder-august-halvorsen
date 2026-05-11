import BrowserFrame from "@/components/BrowserFrame";
import PhoneFrame from "@/components/PhoneFrame";
import { isPortraitPresentation } from "@/lib/project-presentation";

type Variant = "featured" | "card" | "detail";

interface ProjectCoverMediaProps {
  presentation?: string | null;
  frameUrl?: string;
  src?: string | null;
  alt?: string;
  width?: number | null;
  height?: number | null;
  fallbackLabel?: string;
  variant?: Variant;
  className?: string;
  loading?: "lazy" | "eager";
}

const PORTRAIT_WRAPPER: Record<Variant, string> = {
  featured: "max-w-[260px] md:max-w-[300px] mx-auto",
  card: "max-w-[200px] mx-auto",
  detail: "max-w-[320px] mx-auto",
};

export default function ProjectCoverMedia({
  presentation,
  frameUrl,
  src,
  alt = "",
  width,
  height,
  fallbackLabel,
  variant = "card",
  className = "",
  loading = "lazy",
}: ProjectCoverMediaProps) {
  const portrait = isPortraitPresentation(presentation);

  if (portrait) {
    return (
      <div className={`${PORTRAIT_WRAPPER[variant]} ${className}`}>
        <PhoneFrame url={frameUrl}>
          {src ? (
            <img
              src={src}
              alt={alt}
              width={width ?? undefined}
              height={height ?? undefined}
              className="w-full aspect-[10/19] object-contain object-top bg-background"
              loading={loading}
            />
          ) : (
            <div className="w-full aspect-[10/19] bg-muted flex items-center justify-center">
              <span className="text-muted-foreground font-mono text-xs">
                {fallbackLabel}
              </span>
            </div>
          )}
        </PhoneFrame>
      </div>
    );
  }

  return (
    <BrowserFrame url={frameUrl} className={`rounded-t-2xl border-border/60 ${className}`}>
      {src ? (
        <img
          src={src}
          alt={alt}
          width={width ?? undefined}
          height={height ?? undefined}
          className="w-full aspect-video object-cover"
          loading={loading}
        />
      ) : (
        <div className="w-full aspect-video bg-muted flex items-center justify-center">
          <span className="text-muted-foreground font-mono text-sm">
            {fallbackLabel}
          </span>
        </div>
      )}
    </BrowserFrame>
  );
}