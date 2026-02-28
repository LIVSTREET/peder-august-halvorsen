export function formatApiError(error: unknown): string {
  if (error == null) return "Ukjent feil";
  if (typeof error === "string") return error;
  if (error instanceof Error) return error.message;
  if (typeof error === "object" && "message" in error)
    return String((error as { message: unknown }).message);
  return "Ukjent feil";
}

export function getApiErrorDetails(error: unknown): string {
  const msg = formatApiError(error);
  const extra =
    typeof error === "object" &&
    error !== null &&
    "details" in error
      ? JSON.stringify((error as { details: unknown }).details)
      : "";
  return extra ? `${msg}\n\n${extra}` : msg;
}
