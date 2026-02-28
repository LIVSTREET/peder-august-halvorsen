import { useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useProjectAssets } from "@/hooks/useAssets";
import { useProjectAssetsMutations } from "@/hooks/useProjectAssetsMutations";
import { getAssetUrl } from "@/lib/supabase-helpers";
import { getImageDimensions } from "@/lib/image-utils";
import { validateFile, buildStoragePath, MAX_FILE_BYTES } from "@/lib/upload-utils";
import { compressImageForUpload } from "@/lib/compress-image";
import { useDeleteWithUndo } from "@/hooks/useDeleteWithUndo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

const BUCKET = "public-assets";

type Props = {
  projectId: string;
};

export function ProjectAssetsSection({ projectId }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [alt, setAlt] = useState("");
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<{ current: number; total: number } | null>(null);
  const showDeletedToast = useDeleteWithUndo();

  const { data: assets = [] } = useProjectAssets(projectId);
  const {
    insertAsset,
    softDeleteAsset,
    undoDeleteAsset,
    reorderAsset,
  } = useProjectAssetsMutations(projectId);

  const sortedAssets = [...assets].sort((a, b) => a.sort_order - b.sort_order);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length === 0 || !projectId) return;
    setUploadError(null);
    setUploadProgress({ current: 0, total: files.length });

    let nextOrder =
      sortedAssets.length > 0
        ? Math.max(...sortedAssets.map((a) => a.sort_order), 0) + 1
        : 0;

    for (let i = 0; i < files.length; i++) {
      let fileToUpload = files[i];
      if (fileToUpload.type.startsWith("image/") && fileToUpload.type !== "image/gif") {
        fileToUpload = await compressImageForUpload(fileToUpload);
      }
      const validation = validateFile(fileToUpload);
      if (!validation.ok) {
        setUploadError((validation as { ok: false; message: string }).message);
        break;
      }
      const storagePath = buildStoragePath("project", projectId, fileToUpload);
      const { error: uploadErr } = await supabase.storage
        .from(BUCKET)
        .upload(storagePath, fileToUpload, {
          upsert: false,
          cacheControl: "public, max-age=31536000, immutable",
        });
      if (uploadErr) {
        setUploadError(uploadErr.message);
        break;
      }
      const publicUrl = getAssetUrl(BUCKET, storagePath);
      const dims = await getImageDimensions(publicUrl);
      await insertAsset({
        storagePath,
        alt: alt || null,
        width: dims?.width ?? null,
        height: dims?.height ?? null,
        sortOrder: nextOrder,
      });
      nextOrder += 1;
      setUploadProgress((p) => (p ? { ...p, current: i + 1 } : null));
    }

    setUploadProgress(null);
    setAlt("");
    e.target.value = "";
  }

  async function handleDelete(asset: { id: string }) {
    await softDeleteAsset({ id: asset.id });
    showDeletedToast(() => {
      undoDeleteAsset({ id: asset.id });
    });
  }

  async function handleMove(asset: { id: string; sort_order: number }, direction: "up" | "down") {
    const idx = sortedAssets.findIndex((a) => a.id === asset.id);
    if (idx < 0) return;
    const nextIdx = direction === "up" ? idx - 1 : idx + 1;
    if (nextIdx < 0 || nextIdx >= sortedAssets.length) return;
    const other = sortedAssets[nextIdx];
    await reorderAsset({ id: asset.id, sort_order: other.sort_order });
    await reorderAsset({ id: other.id, sort_order: asset.sort_order });
  }

  async function handleSetAsCover(asset: { id: string; sort_order: number }) {
    const idx = sortedAssets.findIndex((a) => a.id === asset.id);
    if (idx <= 0) return;
    for (let i = idx; i > 0; i--) {
      const current = sortedAssets[i];
      const prev = sortedAssets[i - 1];
      await reorderAsset({ id: current.id, sort_order: prev.sort_order });
      await reorderAsset({ id: prev.id, sort_order: current.sort_order });
    }
  }

  return (
    <section className="space-y-4">
      <h2 className="font-display text-lg font-semibold text-foreground">
        Assets
      </h2>

      <div className="space-y-2">
        <Label>Alt-tekst (valgfri)</Label>
        <Input
          value={alt}
          onChange={(e) => setAlt(e.target.value)}
          placeholder="Beskrivelse for skjermlesere"
        />
      </div>

      <div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*,.pdf"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />
        <Button
          type="button"
          variant="outline"
          disabled={!!uploadProgress}
          onClick={() => inputRef.current?.click()}
        >
          {uploadProgress
            ? `Laster opp ${uploadProgress.current} av ${uploadProgress.total}…`
            : "Last opp bilder"}
        </Button>
        <p className="text-xs text-muted-foreground mt-1">
          Bilder og PDF, maks {MAX_FILE_BYTES / 1024 / 1024} MB per fil.
        </p>
      </div>

      {uploadError && (
        <p className="text-sm text-destructive">{uploadError}</p>
      )}

      {sortedAssets.length > 0 && (
        <ul className="space-y-3">
          {sortedAssets.map((a, idx) => (
            <li key={a.id} className="flex items-center gap-3 border border-border p-3">
              <img
                src={getAssetUrl(a.storage_bucket, a.storage_path)}
                alt={a.alt || ""}
                className="w-20 h-14 object-cover bg-muted"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-muted-foreground">
                    {a.kind}
                    {a.width != null && a.height != null && ` · ${a.width}×${a.height}`}
                  </span>
                  {idx === 0 && (
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                      Hovedbilde
                    </Badge>
                  )}
                </div>
                {a.alt && (
                  <p className="text-sm text-muted-foreground truncate">{a.alt}</p>
                )}
              </div>
              <div className="flex items-center gap-1">
                {idx !== 0 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSetAsCover(a)}
                    title="Bruk som hovedbilde"
                  >
                    ★
                  </Button>
                )}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={idx === 0}
                  onClick={() => handleMove(a, "up")}
                  aria-label="Flytt opp"
                >
                  ↑
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={idx === sortedAssets.length - 1}
                  onClick={() => handleMove(a, "down")}
                  aria-label="Flytt ned"
                >
                  ↓
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                  onClick={() => handleDelete(a)}
                >
                  Slett
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
