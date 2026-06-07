export type FinanceEntryType = "income" | "expense";

export interface FinanceEntry {
  id: string;
  entry_type: FinanceEntryType;
  entry_date: string;
  description?: string | null;
  counterparty?: string | null;
  category?: string | null;
  category_group?: string | null;
  amount_gross: number;
  amount_net?: number | null;
  vat_rate?: number | null;
  payment_status?: string | null;
  invoice_status?: string | null;
  voucher_number?: string | null;
  source_app?: string | null;
  source_type?: string | null;
  source_ref?: string | null;
  external_url?: string | null;
  attachment_count?: number | null;
  has_attachment?: boolean | null;
  notes?: string | null;
  created_at?: string | null;
}

export interface FinanceAttachment {
  id: string;
  entry_id?: string | null;
  file_name?: string | null;
  mime_type?: string | null;
  size?: number | null;
  url?: string | null;
  signed_url?: string | null;
  created_at?: string | null;
}

export interface AccountingKpis {
  year: number;
  income: number;
  expense: number;
  result: number;
  unpaidCount: number;
  missingAttachmentCount: number;
  entryCount: number;
}

export interface AccountingStatus {
  entries: FinanceEntry[];
  summary: unknown;
  kpis: AccountingKpis;
}

export interface PartnerSettlementInput {
  partnerName: string;
  eventName: string;
  eventSlug: string;
  date: string;
  total: number;
  partnerPercent: number;
  reportUrl?: string | null;
  invoiceText?: string | null;
  notes?: string | null;
}

export interface InvoiceBasis {
  partnerName: string;
  eventName: string;
  eventSlug: string;
  date: string;
  total: number;
  partnerPercent: number;
  partnerAmount: number;
  ourPercent: number;
  ourAmount: number;
  invoiceText: string | null;
  notes: string | null;
  voucher: string | null;
}

export interface ManualEntryInput {
  entry_type: FinanceEntryType;
  entry_date: string;
  description: string;
  counterparty?: string;
  category?: string;
  amount_gross: number;
  vat_rate?: number;
  payment_status?: "paid" | "unpaid";
}