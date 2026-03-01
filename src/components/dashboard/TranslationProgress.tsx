type TranslationProgressProps = {
  filled: number;
  total: number;
};

export function TranslationProgress({ filled, total }: TranslationProgressProps) {
  if (total === 0) return null;
  const allFilled = filled >= total;

  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-mono">
      <span className="text-muted-foreground">Engelsk:</span>
      <span className={allFilled ? "text-emerald-500" : "text-amber-500"}>
        {filled}/{total} felt fylt
      </span>
    </span>
  );
}
