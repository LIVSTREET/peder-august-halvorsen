import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFinanceMutations } from "@/lib/finance-core/hooks";
import { mapManualEntry } from "@/lib/finance-core/mappers";
import { toast } from "sonner";
import type { FinanceEntryType } from "@/lib/finance-core/types";

export function ManualEntryDialog({
  open,
  onOpenChange,
  entryType,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entryType: FinanceEntryType;
}) {
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [description, setDescription] = useState("");
  const [counterparty, setCounterparty] = useState("");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [paid, setPaid] = useState(false);
  const { createEntry } = useFinanceMutations();

  const reset = () => {
    setDescription(""); setCounterparty(""); setCategory(""); setAmount(""); setPaid(false);
    setDate(new Date().toISOString().slice(0, 10));
  };

  const submit = async () => {
    const amt = Number(amount);
    if (!description.trim()) { toast.error("Beskrivelse er påkrevd"); return; }
    if (!Number.isFinite(amt) || amt <= 0) { toast.error("Beløp må være over 0"); return; }
    try {
      await createEntry.mutateAsync(mapManualEntry({
        entry_type: entryType,
        entry_date: date,
        description: description.trim(),
        counterparty: counterparty.trim() || undefined,
        category: category.trim() || undefined,
        amount_gross: amt,
        vat_rate: 0,
        payment_status: paid ? "paid" : "unpaid",
      }));
      toast.success(entryType === "income" ? "Inntekt bokført" : "Utgift bokført");
      reset();
      onOpenChange(false);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Kunne ikke bokføre");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{entryType === "income" ? "Manuell inntekt" : "Manuell utgift"}</DialogTitle>
          <DialogDescription>Bokfør en enkelt post i Finance Core.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <Row label="Dato"><Input type="date" value={date} onChange={(e) => setDate(e.target.value)} /></Row>
          <Row label="Beskrivelse *"><Input value={description} onChange={(e) => setDescription(e.target.value)} /></Row>
          <Row label="Motpart"><Input value={counterparty} onChange={(e) => setCounterparty(e.target.value)} /></Row>
          <Row label="Kategori"><Input value={category} onChange={(e) => setCategory(e.target.value)} /></Row>
          <Row label="Beløp (kr)"><Input type="number" inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} /></Row>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={paid} onChange={(e) => setPaid(e.target.checked)} />
            Betalt
          </label>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={createEntry.isPending}>Avbryt</Button>
            <Button onClick={submit} disabled={createEntry.isPending}>
              {createEntry.isPending ? "Bokfører…" : "Bokfør"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}