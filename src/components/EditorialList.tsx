interface EditorialListItem {
  label: string;
  meta?: string;
  href?: string;
  onClick?: () => void;
}

interface EditorialListProps {
  items: EditorialListItem[];
  className?: string;
}

export default function EditorialList({ items, className = "" }: EditorialListProps) {
  return (
    <ul className={`divide-y divide-border ${className}`}>
      {items.map((item, i) => (
        <li key={i} className="py-3 flex items-baseline justify-between gap-4">
          {item.href ? (
            <a
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-body text-foreground hover:text-primary transition-colors"
            >
              {item.label}
            </a>
          ) : (
            <span className="font-body text-foreground">{item.label}</span>
          )}
          {item.meta && (
            <span className="text-xs font-mono text-muted-foreground shrink-0">{item.meta}</span>
          )}
        </li>
      ))}
    </ul>
  );
}
