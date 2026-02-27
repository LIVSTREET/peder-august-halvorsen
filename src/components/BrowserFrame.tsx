interface BrowserFrameProps {
  url?: string;
  children: React.ReactNode;
  className?: string;
}

export default function BrowserFrame({ url, children, className = "" }: BrowserFrameProps) {
  return (
    <div className={`border border-border overflow-hidden ${className}`}>
      <div className="flex items-center gap-2 px-3 py-2 border-b border-border bg-muted/30">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-foreground/10" />
          <div className="w-2.5 h-2.5 rounded-full bg-foreground/10" />
          <div className="w-2.5 h-2.5 rounded-full bg-foreground/10" />
        </div>
        {url && (
          <div className="flex-1 text-xs font-mono text-muted-foreground truncate px-2 py-0.5 bg-muted/40">
            {url}
          </div>
        )}
      </div>
      <div className="bg-muted/10">
        {children}
      </div>
    </div>
  );
}
