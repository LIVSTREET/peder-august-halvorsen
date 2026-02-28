import imageCompression from "browser-image-compression";

const MAX_SIZE_MB = 1.2;
const MAX_WIDTH_OR_HEIGHT = 2400;
const INITIAL_QUALITY = 0.95;

export async function compressImageForUpload(file: File): Promise<File> {
  const type = file.type;
  if (!type.startsWith("image/") || type === "image/gif") {
    return file;
  }

  try {
    const out = await imageCompression(file, {
      maxSizeMB: MAX_SIZE_MB,
      maxWidthOrHeight: MAX_WIDTH_OR_HEIGHT,
      initialQuality: INITIAL_QUALITY,
      useWebWorker: true,
    });
    return new File([out], file.name, { type: out.type });
  } catch {
    return file;
  }
}
