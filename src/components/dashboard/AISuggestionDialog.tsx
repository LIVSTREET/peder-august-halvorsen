import { useMemo, useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const FIELD_LABELS: Record<string, string> = {
  title: "Tittel (NO)",
  title_en: "Tittel (EN)",
  subtitle: "Undertittel (NO)",
  subtitle_en: "Undertittel (EN)",
  description: "Beskrivelse (NO)",
  description_en: "Beskrivelse (EN)",
  problem_text: "Problem (NO)",
  problem_text_en: "Problem (EN)",
  solution_text: "Løsning (NO)",
  solution_text_en: "Løsning (EN)",
  result_text: "Resultat (NO)",
  result_text_en: "Resultat (EN)",
  role: "Rolle (NO)",
  role_en: "Rolle (EN)",
};

export type AISuggestion = {
  action: string;
  fields: Record<string, string>;
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  suggestion: AISuggestion | null;
  currentValues: Record<string, string>;
  onApply: (fields: Record<string, string>) => void;
};

const ACTION_TITLES: Record<string, string> = {
  translate_en: "Forslag: engelske oversettelser",
  improve_no: "Forslag: forbedret norsk",
  seo_case: "Forslag: case study (NO)",
  fill_missing: "Forslag: fyll manglende felter",
};

export function AISuggestionDialog({
  open,
  onOpenChange,
  suggestion,
  currentValues,
  onApply,
}: Props) {
  const fieldKeys = useMemo(
    () => (suggestion ? Object.keys(suggestion.fields) : []),
    [suggestion],
  );
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!suggestion) return;
    const init: Record<string, boolean> = {};
    for (const k of Object.keys(suggestion.fields)) init[k] = true;
    setSelected(init);
  }, [suggestion]);

  if (!suggestion) return null;

  const hasFields = fieldKeys.length > 0;
  const selectedCount = fieldKeys.filter((k) => selected[k]).length;

  function applySelected() {
    if (!suggestion) return;
    const out: Record<string, string> = {};
    for (const k of fieldKeys) {
      if (selected[k]) out[k] = suggestion.fields[k];
    }
    onApply(out);
    onOpenChange(false);
  }

  function applyAll() {
    if (!suggestion) return;
    onApply({ ...suggestion.fields });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display">
            {ACTION_TITLES[suggestion.action] ?? "AI-forslag"}
          </DialogTitle>
          <DialogDescription>
            Gå gjennom forslagene under. Ingenting blir lagret før du trykker
            «Lagre» i prosjektet.
          </DialogDescription>
        </DialogHeader>

        {!hasFields ? (
          <div className="py-6 text-sm text-muted-foreground">
            AI ga ingen forslag for disse feltene. Prøv en annen handling, eller
            fyll inn mer kildetekst først.
          </div>
        ) : (
          <div className="space-y-4">
            {fieldKeys.map((key) => {
              const current = currentValues[key] ?? "";
              const next = suggestion.fields[key];
              return (
                <label
                  key={key}
                  className="block border border-border rounded-md p-3 cursor-pointer hover:border-foreground/40 transition-colors"
                >
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <span className="font-display text-sm font-bold text-foreground">
                      {FIELD_LABELS[key] ?? key}
                    </span>
                    <input
                      type="checkbox"
                      checked={!!selected[key]}
                      onChange={(e) =>
                        setSelected((s) => ({ ...s, [key]: e.target.checked }))
                      }
                    />
                  </div>
                  {current && (
                    <div className="text-xs text-muted-foreground mb-2 whitespace-pre-line">
                      <span className="font-mono uppercase tracking-wide mr-1">
                        Nå:
                      </span>
                      {current}
                    </div>
                  )}
                  <div className="text-sm text-foreground whitespace-pre-line">
                    <span className="font-mono uppercase tracking-wide mr-1 text-primary">
                      Forslag:
                    </span>
                    {next}
                  </div>
                </label>
              );
            })}
          </div>
        )}

        <DialogFooter className="gap-2">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Avvis
          </Button>
          {hasFields && (
            <>
              <Button
                variant="outline"
                onClick={applySelected}
                disabled={selectedCount === 0}
              >
                Bruk valgte ({selectedCount})
              </Button>
              <Button onClick={applyAll}>Bruk alle</Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}