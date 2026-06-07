import type { ManualEntryInput, PartnerSettlementInput } from "./types";

export const SOURCE_APP = "pah-studios";

export function mapManualEntry(input: ManualEntryInput) {
  return {
    ...input,
    amount_net: input.amount_gross,
    source_app: SOURCE_APP,
    source_type: "manual",
    source_ref: `manual-${Date.now()}`,
    category_group: input.entry_type === "income" ? "Inntekter" : "Utgifter",
  };
}

export function computeSettlement(input: Pick<PartnerSettlementInput, "total" | "partnerPercent">) {
  const partnerAmount = Math.round(input.total * input.partnerPercent / 100);
  const ourAmount = input.total - partnerAmount;
  const ourPercent = 100 - input.partnerPercent;
  return { partnerAmount, ourAmount, ourPercent };
}

export function mapPartnerSettlement(input: PartnerSettlementInput) {
  const { ourAmount } = computeSettlement(input);
  const notes = [
    input.notes ?? null,
    input.invoiceText ? `Fakturatekst: ${input.invoiceText}` : null,
  ].filter(Boolean).join("\n\n") || null;

  return {
    entry_type: "income" as const,
    entry_date: input.date,
    description: `Andel av omsetning fra ${input.partnerName} – ${input.eventName}`,
    counterparty: input.partnerName,
    category: "Popup-salg",
    category_group: "Inntekter",
    amount_gross: ourAmount,
    amount_net: ourAmount,
    vat_rate: 0,
    payment_status: "unpaid",
    invoice_status: "draft",
    source_app: SOURCE_APP,
    source_type: "partner_settlement",
    source_ref: input.eventSlug,
    external_url: input.reportUrl ?? null,
    notes,
  };
}