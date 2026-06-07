import type { InvoiceBasis, PartnerSettlementInput } from "./types";
import { computeSettlement } from "./mappers";
import { SELLER } from "./seller";

export function buildInvoiceBasis(input: PartnerSettlementInput, voucher?: string | null): InvoiceBasis {
  const { partnerAmount, ourAmount, ourPercent } = computeSettlement(input);
  return {
    partnerName: input.partnerName,
    eventName: input.eventName,
    eventSlug: input.eventSlug,
    date: input.date,
    total: input.total,
    partnerPercent: input.partnerPercent,
    partnerAmount,
    ourPercent,
    ourAmount,
    invoiceText: input.invoiceText ?? null,
    notes: input.notes ?? null,
    voucher: voucher ?? null,
  };
}

function fmt(n: number) {
  return new Intl.NumberFormat("nb-NO").format(n);
}

export function formatInvoiceBasis(basis: InvoiceBasis): string {
  const description = basis.invoiceText?.trim()
    || `Andel av popup-omsetning – ${basis.eventName}`;

  const lines = [
    `FAKTURAGRUNNLAG — ${SELLER.legalName}`,
    `Org.nr: ${SELLER.orgNumber}`,
    `Adresse: ${SELLER.address}`,
    "",
    `Fakturamottaker:        ${basis.partnerName}`,
    `Beskrivelse:            ${description}`,
    "",
    `Total omsetning:        ${fmt(basis.total)} kr`,
    `Partnerandel (${basis.partnerPercent} %):   ${fmt(basis.partnerAmount)} kr`,
    `Min andel (${basis.ourPercent} %):         ${fmt(basis.ourAmount)} kr`,
    `Beløp å fakturere:      ${fmt(basis.ourAmount)} kr`,
    "",
    `Dato:                   ${basis.date}`,
    `Referanse:              ${basis.eventSlug}`,
    basis.voucher ? `Finance Core:           ${basis.voucher}` : null,
    "",
    "Beløp er eks. MVA (Peder ENK er ikke MVA-registrert).",
  ].filter(Boolean);

  return lines.join("\n");
}