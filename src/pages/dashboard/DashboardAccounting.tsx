import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAccountingStatus, useFinanceMutations } from "@/lib/finance-core/hooks";
import { PartnerSettlementDialog } from "@/components/accounting/PartnerSettlementDialog";
import { InvoiceBasisDialog } from "@/components/accounting/InvoiceBasisDialog";
import { ManualEntryDialog } from "@/components/accounting/ManualEntryDialog";
import { AttachmentSection } from "@/components/accounting/AttachmentSection";
import type { FinanceEntry, InvoiceBasis } from "@/lib/finance-core/types";
import { ExternalLink, RefreshCw, Paperclip, Trash2, ChevronDown } from "lucide-react";
import { toast } from "sonner";

const FC_BASE = import.meta.env.VITE_FINANCE_CORE_BASE_URL as string | undefined;
const FC_ORG = import.meta.env.VITE_FINANCE_CORE_ORGANIZATION_ID as string | undefined;

function fmtKr(n: number) {
  return new Intl.NumberFormat("nb-NO").format(Math.round(n)) + " kr";
}
function fmtDate(s?: string | null) {
  if (!s) return "";
  try { return new Date(s).toLocaleDateString("nb-NO"); } catch { return s; }
}

export default function DashboardAccounting() {
  const year = new Date().getUTCFullYear();
  const { data, isLoading, isFetching, refetch, error } = useAccountingStatus(year);
  const { deleteEntry, uploadAttachment } = useFinanceMutations();

  const [settlementOpen, setSettlementOpen] = useState(false);
  const [manualOpen, setManualOpen] = useState<"income" | "expense" | null>(null);
  const [basis, setBasis] = useState<{ basis: InvoiceBasis; duplicate?: boolean } | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const fcUrl = FC_BASE && FC_ORG ? `${FC_BASE}/orgs/${FC_ORG}` : null;

  const handleGenericUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      await uploadAttachment.mutateAsync({ file });
      toast.success("Bilag lastet opp");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Opplasting feilet");
    } finally {
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const removeEntry = async (entry: FinanceEntry) => {
    if (!confirm(`Slette post ${entry.voucher_number ?? entry.id}? Bilag slettes også.`)) return;
    try {
      await deleteEntry.mutateAsync(entry.id);
      toast.success("Post slettet");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Sletting feilet");
    }
  };

  const kpis = data?.kpis;
  const entries = (data?.entries ?? []).slice(0, 50);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-foreground">Regnskap</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Peder August Halvorsen ENK · Finance Core {year}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {fcUrl && (
            <Button asChild variant="outline" size="sm">
              <a href={fcUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-3 h-3 mr-1" /> Åpne i Finance Core
              </a>
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching}>
            <RefreshCw className={`w-3 h-3 mr-1 ${isFetching ? "animate-spin" : ""}`} /> Oppdater
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button size="sm" onClick={() => setSettlementOpen(true)}>Partneroppgjør</Button>
        <Button size="sm" variant="outline" onClick={() => setManualOpen("income")}>Manuell inntekt</Button>
        <Button size="sm" variant="outline" onClick={() => setManualOpen("expense")}>Manuell utgift</Button>
        <Button size="sm" variant="outline" onClick={() => fileRef.current?.click()} disabled={uploadAttachment.isPending}>
          <Paperclip className="w-3 h-3 mr-1" />
          {uploadAttachment.isPending ? "Laster opp…" : "Last opp bilag"}
        </Button>
        <input ref={fileRef} type="file" className="hidden" onChange={handleGenericUpload} />
      </div>

      {error ? (
        <div className="border border-destructive/40 bg-destructive/10 text-destructive p-3 rounded-md text-sm">
          Kunne ikke laste data fra Finance Core: {(error as Error).message}
        </div>
      ) : null}

      <section className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
        <Kpi label="Inntekter" value={kpis ? fmtKr(kpis.income) : "—"} loading={isLoading} />
        <Kpi label="Utgifter" value={kpis ? fmtKr(kpis.expense) : "—"} loading={isLoading} />
        <Kpi label="Resultat" value={kpis ? fmtKr(kpis.result) : "—"} loading={isLoading} />
        <Kpi label="Ubetalt" value={kpis ? String(kpis.unpaidCount) : "—"} loading={isLoading} />
        <Kpi label="Mangler bilag" value={kpis ? String(kpis.missingAttachmentCount) : "—"} loading={isLoading} />
      </section>

      <section className="space-y-2">
        <h2 className="font-display text-base md:text-lg font-semibold text-foreground">Siste poster</h2>
        {isLoading ? (
          <p className="text-muted-foreground text-sm">Laster…</p>
        ) : entries.length === 0 ? (
          <p className="text-muted-foreground text-sm">Ingen poster ennå.</p>
        ) : (
          <div className="border border-border rounded-md divide-y divide-border">
            {entries.map((e) => {
              const isOpen = expanded === e.id;
              const hasAtt = e.has_attachment === true || (e.attachment_count ?? 0) > 0;
              const amt = Number(e.amount_gross ?? 0);
              return (
                <div key={e.id}>
                  <button
                    onClick={() => setExpanded(isOpen ? null : e.id)}
                    className="w-full text-left grid grid-cols-12 gap-2 items-center px-3 py-2 text-sm hover:bg-muted/40"
                  >
                    <span className="col-span-3 sm:col-span-2 text-muted-foreground text-xs">{fmtDate(e.entry_date)}</span>
                    <span className="col-span-9 sm:col-span-5 truncate">{e.description ?? "—"}</span>
                    <span className="hidden sm:inline col-span-2 text-muted-foreground text-xs truncate">{e.counterparty ?? ""}</span>
                    <span className={`col-span-8 sm:col-span-2 text-right font-mono text-xs ${e.entry_type === "income" ? "text-foreground" : "text-muted-foreground"}`}>
                      {e.entry_type === "income" ? "+" : "−"}{fmtKr(amt)}
                    </span>
                    <span className="col-span-4 sm:col-span-1 flex items-center justify-end gap-1 text-xs">
                      {hasAtt && <Paperclip className="w-3 h-3 text-muted-foreground" />}
                      {e.payment_status === "unpaid" && (
                        <span className="text-[10px] uppercase font-mono text-amber-600">ubetalt</span>
                      )}
                      <ChevronDown className={`w-3 h-3 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`} />
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-3 py-3 bg-muted/20 space-y-3 text-xs">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        <Meta label="Bilag" value={e.voucher_number ?? "—"} />
                        <Meta label="Kategori" value={e.category ?? "—"} />
                        <Meta label="MVA" value={`${e.vat_rate ?? 0} %`} />
                        <Meta label="Status" value={e.invoice_status ?? "—"} />
                        <Meta label="Source" value={`${e.source_app ?? "—"} / ${e.source_type ?? "—"}`} />
                        <Meta label="Ref" value={e.source_ref ?? "—"} />
                      </div>
                      {e.notes && <p className="whitespace-pre-wrap text-muted-foreground">{e.notes}</p>}
                      <AttachmentSection entryId={e.id} />
                      <div className="flex justify-end">
                        <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => removeEntry(e)}>
                          <Trash2 className="w-3 h-3 mr-1" /> Slett post
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      <PartnerSettlementDialog
        open={settlementOpen}
        onOpenChange={setSettlementOpen}
        onSuccess={(args) => setBasis(args)}
      />
      <InvoiceBasisDialog
        open={!!basis}
        onOpenChange={(o) => { if (!o) setBasis(null); }}
        basis={basis?.basis ?? null}
        duplicate={basis?.duplicate}
      />
      {manualOpen && (
        <ManualEntryDialog
          open={!!manualOpen}
          onOpenChange={(o) => { if (!o) setManualOpen(null); }}
          entryType={manualOpen}
        />
      )}
    </div>
  );
}

function Kpi({ label, value, loading }: { label: string; value: string; loading?: boolean }) {
  return (
    <div className="border border-border rounded-md p-3 md:p-4">
      <p className="text-muted-foreground text-xs font-mono uppercase">{label}</p>
      <p className="font-display text-lg md:text-xl font-bold text-foreground mt-1">
        {loading ? "…" : value}
      </p>
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-mono uppercase text-muted-foreground">{label}</p>
      <p className="text-foreground truncate">{value}</p>
    </div>
  );
}