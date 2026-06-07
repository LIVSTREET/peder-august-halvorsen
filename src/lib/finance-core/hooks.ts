import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createEntry,
  deleteAttachment,
  deleteEntry,
  fetchAccountingStatus,
  listAttachments,
  sendPartnerSettlement,
  uploadAttachment,
} from "./api";

const KEY = ["finance-core", "status"] as const;

export function useAccountingStatus(year?: number) {
  return useQuery({
    queryKey: [...KEY, year ?? "current"],
    queryFn: () => fetchAccountingStatus(year),
    staleTime: 30_000,
  });
}

export function useEntryAttachments(entryId: string | null) {
  return useQuery({
    queryKey: ["finance-core", "attachments", entryId],
    queryFn: () => listAttachments(entryId as string),
    enabled: !!entryId,
  });
}

export function useFinanceMutations() {
  const qc = useQueryClient();
  const invalidate = () => {
    qc.invalidateQueries({ queryKey: KEY });
  };

  return {
    createEntry: useMutation({ mutationFn: createEntry, onSuccess: invalidate }),
    deleteEntry: useMutation({ mutationFn: deleteEntry, onSuccess: invalidate }),
    uploadAttachment: useMutation({
      mutationFn: (vars: { file: File; entryId?: string }) => uploadAttachment(vars.file, vars.entryId),
      onSuccess: (_d, vars) => {
        invalidate();
        if (vars.entryId) qc.invalidateQueries({ queryKey: ["finance-core", "attachments", vars.entryId] });
      },
    }),
    deleteAttachment: useMutation({
      mutationFn: (vars: { id: string; entryId?: string }) => deleteAttachment(vars.id),
      onSuccess: (_d, vars) => {
        invalidate();
        if (vars.entryId) qc.invalidateQueries({ queryKey: ["finance-core", "attachments", vars.entryId] });
      },
    }),
    sendPartnerSettlement: useMutation({ mutationFn: sendPartnerSettlement, onSuccess: invalidate }),
  };
}