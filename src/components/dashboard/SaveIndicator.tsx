type Status = "idle" | "saving" | "saved" | "hidden";

type Props = {
  status: Status;
  className?: string;
};

const config: Record<Exclude<Status, "hidden">, { dot: string; text: string; label: string }> = {
  idle: { dot: "bg-amber-500", text: "text-amber-600", label: "Ulagrede endringer" },
  saving: { dot: "bg-muted-foreground animate-pulse", text: "text-muted-foreground", label: "Lagrer…" },
  saved: { dot: "bg-primary", text: "text-primary", label: "Lagret" },
};

export function SaveIndicator({ status, className = "" }: Props) {
  if (status === "hidden") return null;
  const c = config[status];
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs ${c.text} ${className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
}
