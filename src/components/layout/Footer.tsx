export default function Footer() {
  return (
    <footer className="border-t border-border mt-auto pb-[env(safe-area-inset-bottom)]">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <p className="font-display font-bold text-lg text-foreground">
              PAH<span className="text-primary">.</span>
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Bygger fleksible plattformer og nettsteder.
            </p>
          </div>
          <div>
            <p className="text-sm font-mono text-muted-foreground uppercase tracking-wider mb-3">Kontakt</p>
            <p className="text-sm text-foreground">hei@altjegskaper.no</p>
          </div>
          <div className="flex flex-col justify-end">
            <p className="text-xs text-muted-foreground/50 italic leading-relaxed">
              «I walk by faith, not by sight.»
            </p>
          </div>
        </div>
        <div className="mt-8 pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground/40">
            © {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  );
}
