import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import type { InvoiceBasis } from "@/lib/finance-core/types";
import { formatInvoiceBasis } from "@/lib/finance-core/invoice-basis";

export function InvoiceBasisDialog({
  basis,
  duplicate,
  open,
  onOpenChange,
}: {
  basis: InvoiceBasis | null;
  duplicate?: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [copied, setCopied] = useState(false);
  if (!basis) return null;
  const text = formatInvoiceBasis(basis);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Fakturagrunnlag</DialogTitle>
          <DialogDescription>
            {duplicate
              ? "Allerede bokført i Finance Core. Grunnlaget kan fortsatt kopieres."
              : "Bokført i Finance Core. Kopier teksten og bruk i faktura."}
          </DialogDescription>
        </DialogHeader>
        <pre className="font-mono text-xs bg-muted p-4 rounded-md whitespace-pre-wrap overflow-x-auto max-h-[50vh]">
{text}
        </pre>
        <div className="flex justify-end">
          <Button onClick={copy} variant="default">
            {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
            {copied ? "Kopiert" : "Kopier"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}