import { supabase } from "@/integrations/supabase/client";
import type {
  AccountingStatus,
  FinanceAttachment,
  FinanceEntry,
  InvoiceBasis,
  ManualEntryInput,
  PartnerSettlementInput,
} from "./types";

async function invoke<T>(action: string, payload?: unknown): Promise<T> {
  const { data, error } = await supabase.functions.invoke("finance-core", {
    body: { action, payload: payload ?? {} },
  });
  if (error) throw new Error(error.message || "Finance Core kall feilet");
  if (data && typeof data === "object" && "error" in (data as any) && (data as any).error) {
    throw new Error(String((data as any).error));
  }
  return data as T;
}

export function fetchAccountingStatus(year?: number): Promise<AccountingStatus> {
  return invoke<AccountingStatus>("getAccountingStatus", { year, limit: 200 });
}

export function createEntry(entry: ManualEntryInput & Record<string, unknown>): Promise<{ entry: FinanceEntry }> {
  return invoke<{ entry: FinanceEntry }>("createEntry", { entry });
}

export function deleteEntry(id: string): Promise<{ ok: true }> {
  return invoke<{ ok: true }>("deleteEntry", { id });
}

export function listAttachments(entryId: string): Promise<{ attachments: FinanceAttachment[] }> {
  return invoke<{ attachments: FinanceAttachment[] }>("listAttachments", { id: entryId });
}

export function deleteAttachment(id: string): Promise<{ ok: true }> {
  return invoke<{ ok: true }>("deleteAttachment", { id });
}

async function fileToBase64(file: File): Promise<string> {
  const buf = await file.arrayBuffer();
  const bytes = new Uint8Array(buf);
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

export async function uploadAttachment(
  file: File,
  entryId?: string,
): Promise<{ attachment: FinanceAttachment }> {
  const fileBase64 = await fileToBase64(file);
  return invoke<{ attachment: FinanceAttachment }>("uploadAttachment", {
    fileName: file.name,
    mimeType: file.type || "application/octet-stream",
    fileBase64,
    entryId,
  });
}

export function sendPartnerSettlement(
  input: PartnerSettlementInput,
): Promise<{ entry?: FinanceEntry; invoiceBasis: InvoiceBasis; duplicate?: boolean }> {
  return invoke("sendPartnerSettlement", input);
}