export const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/pdf",
];
export const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".pdf"];
export const MAX_FILE_BYTES = 8 * 1024 * 1024; // 8 MB

export function getExtension(filename: string): string {
  const i = filename.lastIndexOf(".");
  return i < 0 ? "" : filename.slice(i).toLowerCase();
}

export function validateFile(
  file: File
): { ok: true } | { ok: false; message: string } {
  if (
    !ALLOWED_TYPES.includes(file.type) &&
    !ALLOWED_EXTENSIONS.includes(getExtension(file.name))
  ) {
    return {
      ok: false,
      message: "Kun bilder (JPEG, PNG, WebP, GIF) og PDF er tillatt.",
    };
  }
  if (file.size > MAX_FILE_BYTES) {
    return {
      ok: false,
      message: `Maks filstørrelse er ${MAX_FILE_BYTES / 1024 / 1024} MB.`,
    };
  }
  return { ok: true };
}

export function buildStoragePath(
  entityType: "project" | "post",
  entityId: string,
  file: File
): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const ext = getExtension(file.name) || ".bin";
  const uuid = crypto.randomUUID();
  return `${entityType}s/${entityId}/${y}/${m}/${uuid}${ext}`;
}
