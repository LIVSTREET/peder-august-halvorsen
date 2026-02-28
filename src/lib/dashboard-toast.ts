import { toast } from "@/hooks/use-toast";

export function savedToast() {
  return toast({ title: "Lagret", description: "Endringene er lagret." });
}

export function errorToast(message?: string) {
  return toast({
    title: "Feil",
    description: message ?? "Noe gikk galt. Prøv igjen.",
    variant: "destructive",
  });
}

export function copiedToast(what?: string) {
  return toast({ title: "Kopiert", description: what ?? "Kopiert til utklippstavlen." });
}

export function deletedToast() {
  return toast({ title: "Slettet", description: "Elementet er fjernet." });
}

export function createdToast(message?: string) {
  return toast({
    title: message ?? "Opprettet",
    description: message ? undefined : "Elementet er opprettet.",
  });
}
