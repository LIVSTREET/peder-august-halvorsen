import { useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useFinanceMutations } from "@/lib/finance-core/hooks";
import { computeSettlement } from "@/lib/finance-core/mappers";
import { toast } from "sonner";
import type { InvoiceBasis } from "@/lib/finance-core/types";

function fmt(n: number) {
  return new Intl.NumberFormat("nb-NO").format(n);
}

export function PartnerSettlementDialog({
  open,
  onOpenChange,
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (args: { basis: InvoiceBasis; duplicate?: boolean }) => void;
}) {
  const [partnerName, setPartnerName] = useState("");
  const [eventName, setEventName] = useState("");
  const [eventSlug, setEventSlug] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [total, setTotal] = useState("");
  const [partnerPercent, setPartnerPercent] = useState("30");
  const [reportUrl, setReportUrl] = useState("");
  const [invoiceText, setInvoiceText] = useState("");
  const [notes, setNotes] = useState("");

  const { sendPartnerSettlement } = useFinanceMutations();

  const calc = useMemo(() => {
    const t = Number(total);
    const p = Number(partnerPercent);
    if (!Number.isFinite(t) || !Number.isFinite(p)) return null;
    return { total: t, partnerPercent: p, ...computeSettlement({ total: t, partnerPercent: p }) };
  }, [total, partnerPercent]);

  const submit = async () => {
    if (!partnerName || !eventName || !eventSlug || !date) {
      toast.error("Fyll ut påkrevde felter");
      return;
    }
    const t = Number(total);
    const p = Number(partnerPercent);
    if (!Number.isFinite(t) || t <= 0) { toast.error("Total omsetning må være over 0"); return; }
    if (!Number.isFinite(p) || p < 0 || p > 100) { toast.error("Partnerandel må være 0–100"); return; }
    if (reportUrl && !/^https:\/\//i.test(reportUrl)) { toast.error("Rapport-URL må starte med https://"); return; }

    try {
      const res = await sendPartnerSettlement.mutateAsync({
        partnerName, eventName, eventSlug, date,
        total: t, partnerPercent: p,
        reportUrl: reportUrl || null,
        invoiceText: invoiceText || null,
        notes: notes || null,
      });
      onOpenChange(false);
      onSuccess({ basis: res.invoiceBasis, duplicate: res.duplicate });
      if (res.duplicate) toast.info("Allerede bokført — viser fakturagrunnlag");
      else toast.success("Partneroppgjør bokført");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Kunne ikke bokføre");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Partneroppgjør</DialogTitle>
          <DialogDescription>
            Bokfør PAH ENKs andel av omsetning fra en partner.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Partnernavn *">
              <Input value={partnerName} onChange={(e) => setPartnerName(e.target.value)} placeholder="Klink" />
            </Field>
            <Field label="Eventnavn *">
              <Input value={eventName} onChange={(e) => setEventName(e.target.value)} placeholder="Gold of Sicily" />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Event slug *">
              <Input value={eventSlug} onChange={(e) => setEventSlug(e.target.value)} placeholder="gold-of-sicily-juni" />
            </Field>
            <Field label="Dato *">
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </Field>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Total omsetning (kr)">
              <Input type="number" inputMode="decimal" value={total} onChange={(e) => setTotal(e.target.value)} />
            </Field>
            <Field label="Partnerandel %">
              <Input type="number" min={0} max={100} value={partnerPercent} onChange={(e) => setPartnerPercent(e.target.value)} />
            </Field>
            <Field label="Min andel %">
              <Input readOnly value={calc ? String(calc.ourPercent) : ""} />
            </Field>
          </div>
          <Field label="Rapport-URL">
            <Input value={reportUrl} onChange={(e) => setReportUrl(e.target.value)} placeholder="https://…" />
          </Field>
          <Field label="Fakturatekst">
            <Input value={invoiceText} onChange={(e) => setInvoiceText(e.target.value)} />
          </Field>
          <Field label="Notater">
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} />
          </Field>

          {calc && Number.isFinite(calc.total) && calc.total > 0 && (
            <div className="text-sm bg-muted rounded-md p-3 font-mono space-y-1">
              <div>Total omsetning: {fmt(calc.total)} kr</div>
              <div>Partnerandel {calc.partnerPercent} %: {fmt(calc.partnerAmount)} kr</div>
              <div>Min andel {calc.ourPercent} %: {fmt(calc.ourAmount)} kr</div>
              <div className="text-foreground font-semibold">Beløp å fakturere: {fmt(calc.ourAmount)} kr</div>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={sendPartnerSettlement.isPending}>Avbryt</Button>
            <Button onClick={submit} disabled={sendPartnerSettlement.isPending}>
              {sendPartnerSettlement.isPending ? "Bokfører…" : "Bokfør og lag fakturagrunnlag"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}