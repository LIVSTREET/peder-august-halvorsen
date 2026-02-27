import Layout from "@/components/layout/Layout";
import SeoHead from "@/components/SeoHead";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const goals = [
  { value: "website", label: "Nettside" },
  { value: "platform", label: "Plattform" },
  { value: "booking", label: "Booking / musikk" },
  { value: "event", label: "Arrangement" },
  { value: "sparring", label: "Sparring" },
  { value: "other", label: "Annet" },
];

const stages = [
  { value: "idea", label: "Bare en idé" },
  { value: "improve", label: "Har noe, vil forbedre" },
  { value: "launch", label: "Klar for lansering" },
  { value: "scale", label: "Vil skalere" },
];

const priorities = [
  { value: "customers", label: "Få kunder / brukere" },
  { value: "structure", label: "Struktur og system" },
  { value: "time", label: "Spare tid" },
  { value: "professional", label: "Se profesjonell ut" },
  { value: "execute", label: "Komme i gang" },
];

const budgets = [
  { value: "lite", label: "Lite (under 15k)" },
  { value: "medium", label: "Medium (15–50k)" },
  { value: "storre", label: "Større (50k+)" },
];

type FormData = {
  goal: string;
  stage: string;
  priority: string;
  budget_mode: string;
  details: string;
  name: string;
  email: string;
  phone: string;
};

export default function Brief() {
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState<FormData>({
    goal: searchParams.get("goal") || "",
    stage: "",
    priority: "",
    budget_mode: "",
    details: "",
    name: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    const g = searchParams.get("goal");
    if (g) setForm((f) => ({ ...f, goal: g }));
  }, [searchParams]);

  const set = (key: keyof FormData, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const steps = [
    { key: "goal" as const, title: "Hva handler det om?", options: goals },
    { key: "stage" as const, title: "Hvor er du nå?", options: stages },
    { key: "priority" as const, title: "Hva er viktigst?", options: priorities },
    { key: "budget_mode" as const, title: "Omtrentlig budsjett?", options: budgets },
  ];

  async function handleSubmit() {
    setSending(true);
    const { error } = await supabase.from("brief_submissions").insert({
      goal: form.goal || null,
      stage: form.stage || null,
      priority: form.priority || null,
      budget_mode: form.budget_mode || null,
      details: form.details || null,
      name: form.name || null,
      email: form.email || null,
      phone: form.phone || null,
    });
    setSending(false);
    if (!error) setSubmitted(true);
  }

  // Placeholder for future AI summary
  // async function getAiSummary(submissionId: string) {
  //   await supabase.functions.invoke('brief-summary', { body: { id: submissionId } });
  // }

  if (submitted) {
    return (
      <Layout>
        <SeoHead title="Takk! | Alt jeg skaper" description="Briefen din er sendt." pathname="/brief" noindex />
        <section className="container pt-16 pb-24 max-w-xl mx-auto">
          <h1 className="font-display text-3xl font-extrabold text-foreground mb-6">Takk!</h1>
          <p className="text-muted-foreground mb-8">Briefen din er sendt. Her er et sammendrag:</p>
          <div className="space-y-3 text-sm">
            {form.goal && <SummaryRow label="Mål" value={goals.find((g) => g.value === form.goal)?.label || form.goal} />}
            {form.stage && <SummaryRow label="Fase" value={stages.find((s) => s.value === form.stage)?.label || form.stage} />}
            {form.priority && <SummaryRow label="Prioritet" value={priorities.find((p) => p.value === form.priority)?.label || form.priority} />}
            {form.budget_mode && <SummaryRow label="Budsjett" value={budgets.find((b) => b.value === form.budget_mode)?.label || form.budget_mode} />}
            {form.details && <SummaryRow label="Detaljer" value={form.details} />}
            {form.name && <SummaryRow label="Navn" value={form.name} />}
            {form.email && <SummaryRow label="E-post" value={form.email} />}
          </div>
          <div className="mt-10 border-t border-border pt-8">
            <p className="text-foreground text-sm">
              Jeg tar kontakt innen 1–2 virkedager. Hvis det haster, send en melding til hei@altjegskaper.no.
            </p>
          </div>
        </section>
      </Layout>
    );
  }

  const isStepPhase = step < steps.length;
  const isDetailsStep = step === steps.length;
  const isContactStep = step === steps.length + 1;

  return (
    <Layout>
      <SeoHead title="Fortell meg hva du prøver å få til | Alt jeg skaper" description="Fortell meg hva du prøver å få til – jeg hjelper deg videre." pathname="/brief" noindex />
      <section className="container pt-16 pb-24 max-w-xl mx-auto">
        <h1 className="font-display text-3xl md:text-4xl font-extrabold text-foreground mb-2">
          Brief
        </h1>
        <p className="text-muted-foreground text-sm mb-10">
          Steg {step + 1} av {steps.length + 2}
        </p>

        {isStepPhase && (
          <StepSelect
            title={steps[step].title}
            options={steps[step].options}
            value={form[steps[step].key]}
            onChange={(v) => {
              set(steps[step].key, v);
              setStep(step + 1);
            }}
          />
        )}

        {isDetailsStep && (
          <div>
            <h2 className="font-display text-xl font-bold text-foreground mb-4">Fortell mer</h2>
            <textarea
              value={form.details}
              onChange={(e) => set("details", e.target.value)}
              placeholder="Beskriv prosjektet, utfordringen, eller ideen din…"
              className="w-full h-40 bg-transparent border border-border p-4 text-foreground text-sm font-body placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary resize-none"
              maxLength={2000}
            />
            <button
              onClick={() => setStep(step + 1)}
              className="mt-4 px-6 py-3 bg-primary text-primary-foreground text-sm font-medium uppercase tracking-wide border border-primary hover:brightness-110 transition-all"
            >
              Neste
            </button>
          </div>
        )}

        {isContactStep && (
          <div>
            <h2 className="font-display text-xl font-bold text-foreground mb-4">Kontaktinfo</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Navn"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                className="w-full bg-transparent border border-border p-3 text-foreground text-sm font-body placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary"
                maxLength={100}
              />
              <input
                type="email"
                placeholder="E-post"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                className="w-full bg-transparent border border-border p-3 text-foreground text-sm font-body placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary"
                maxLength={255}
              />
              <input
                type="tel"
                placeholder="Telefon (valgfritt)"
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
                className="w-full bg-transparent border border-border p-3 text-foreground text-sm font-body placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary"
                maxLength={20}
              />
            </div>
            <button
              onClick={handleSubmit}
              disabled={sending || !form.email}
              className="mt-6 px-6 py-3 bg-primary text-primary-foreground text-sm font-medium uppercase tracking-wide border border-primary hover:brightness-110 transition-all disabled:opacity-50"
            >
              {sending ? "Sender…" : "Send brief"}
            </button>
          </div>
        )}

        {step > 0 && (
          <button
            onClick={() => setStep(step - 1)}
            className="mt-6 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Tilbake
          </button>
        )}
      </section>
    </Layout>
  );
}

function StepSelect({
  title,
  options,
  value,
  onChange,
}: {
  title: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <h2 className="font-display text-xl font-bold text-foreground mb-6">{title}</h2>
      <div className="space-y-2">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`block w-full text-left px-4 py-3 border text-sm font-body transition-colors ${
              value === opt.value
                ? "border-primary text-primary"
                : "border-border text-foreground hover:border-foreground/40"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-4 py-2 border-b border-border">
      <span className="font-mono text-xs text-muted-foreground uppercase w-20 shrink-0">{label}</span>
      <span className="text-foreground">{value}</span>
    </div>
  );
}
