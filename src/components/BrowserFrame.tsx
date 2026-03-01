interface BrowserFrameProps {
  url?: string;
  children: React.ReactNode;
  className?: string;
}

export default function BrowserFrame({ url, children, className = "" }: BrowserFrameProps) {
  return (
    <div className={`border border-border overflow-hidden ${className}`}>
      <div className="flex items-center gap-2 px-3 py-1.5 border-b border-border/50 bg-muted/20">
        <div className="flex gap-1.5">
          <div className="w-2 h-2 rounded-full bg-foreground/8" />
          <div className="w-2 h-2 rounded-full bg-foreground/8" />
          <div className="w-2 h-2 rounded-full bg-foreground/8" />
        </div>
        {url && (
          <div className="flex-1 text-xs font-mono text-muted-foreground truncate px-2 py-0.5 bg-muted/40">
            {url}
          </div>
        )}
      </div>
      <div className="bg-muted/10 grain-excluded">
        {children}
      </div>
    </div>
  );
}
