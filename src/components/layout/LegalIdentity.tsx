import { LEGAL_NAME, formatLegalOrgLine } from "@/lib/seo";

interface LegalIdentityProps {
  locale?: "no" | "en";
}

export default function LegalIdentity({ locale = "no" }: LegalIdentityProps) {
  return (
    <div className="text-xs text-muted-foreground leading-relaxed">
      <p>{LEGAL_NAME}</p>
      <p>{formatLegalOrgLine(locale)}</p>
    </div>
  );
}
