import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Paperclip, Trash2 } from "lucide-react";
import { useEntryAttachments, useFinanceMutations } from "@/lib/finance-core/hooks";
import { toast } from "sonner";

export function AttachmentSection({ entryId }: { entryId: string }) {
  const { data, isLoading } = useEntryAttachments(entryId);
  const { uploadAttachment, deleteAttachment } = useFinanceMutations();
  const fileRef = useRef<HTMLInputElement>(null);

  const onPick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      await uploadAttachment.mutateAsync({ file, entryId });
      toast.success("Bilag lastet opp");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Opplasting feilet");
    } finally {
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Slette bilag?")) return;
    try {
      await deleteAttachment.mutateAsync({ id, entryId });
      toast.success("Bilag slettet");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Sletting feilet");
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono uppercase text-muted-foreground">Bilag</span>
        <Button size="sm" variant="outline" onClick={() => fileRef.current?.click()} disabled={uploadAttachment.isPending}>
          <Paperclip className="w-3 h-3 mr-1" />
          {uploadAttachment.isPending ? "Laster opp…" : "Last opp"}
        </Button>
        <input ref={fileRef} type="file" className="hidden" onChange={onPick} />
      </div>
      {isLoading ? (
        <p className="text-xs text-muted-foreground">Laster…</p>
      ) : data?.attachments && data.attachments.length > 0 ? (
        <ul className="space-y-1">
          {data.attachments.map((a) => (
            <li key={a.id} className="flex items-center justify-between text-xs gap-2">
              {a.signed_url || a.url ? (
                <a href={(a.signed_url ?? a.url)!} target="_blank" rel="noopener noreferrer" className="truncate underline">
                  {a.file_name ?? a.id}
                </a>
              ) : (
                <span className="truncate">{a.file_name ?? a.id}</span>
              )}
              <button onClick={() => remove(a.id)} className="text-muted-foreground hover:text-destructive shrink-0">
                <Trash2 className="w-3 h-3" />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-xs text-muted-foreground">Ingen bilag.</p>
      )}
    </div>
  );
}