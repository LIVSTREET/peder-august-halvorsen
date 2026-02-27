interface EmptyStateProps {
  message?: string;
  sub?: string;
}

export default function EmptyState({ message = "Bygger nå", sub = "Kommer mer snart." }: EmptyStateProps) {
  return (
    <div className="py-16 text-center">
      <p className="font-display text-lg text-muted-foreground">{message}</p>
      <p className="mt-1 text-sm text-muted-foreground/60">{sub}</p>
    </div>
  );
}
