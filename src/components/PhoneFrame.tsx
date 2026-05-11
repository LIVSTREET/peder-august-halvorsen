interface PhoneFrameProps {
  url?: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * Minimal phone-style frame for portrait/mobile project mockups.
 * Shares the same visual family as BrowserFrame (border, muted bg, font-mono url chip).
 */
export default function PhoneFrame({ url, children, className = "" }: PhoneFrameProps) {
  return (
    <div
      className={`relative border border-border overflow-hidden rounded-[28px] bg-muted/10 ${className}`}
    >
      {/* Top bar with notch/island */}
      <div className="relative flex items-center justify-center px-3 py-2 border-b border-border/50 bg-muted/20">
        <div className="absolute left-1/2 -translate-x-1/2 top-1.5 h-4 w-16 rounded-full bg-foreground/20" />
        {url && (
          <div className="ml-auto text-[10px] font-mono text-muted-foreground truncate max-w-[60%] px-2 py-0.5 bg-muted/40 rounded-sm">
            {url}
          </div>
        )}
      </div>
      <div className="bg-muted/10 grain-excluded">{children}</div>
    </div>
  );
}