import Layout from "@/components/layout/Layout";
import SeoHead from "@/components/SeoHead";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useLocale } from "@/contexts/LocaleContext";
import { tKey } from "@/lib/i18n";

const goals = [
  { value: "website", labelNo: "Nettside", labelEn: "Website" },
  { value: "platform", labelNo: "Plattform", labelEn: "Platform" },
  { value: "booking", labelNo: "Booking / musikk", labelEn: "Booking / music" },
  { value: "event", labelNo: "Arrangement", labelEn: "Event" },
  { value: "sparring", labelNo: "Sparring", labelEn: "Sparring" },
  { value: "other", labelNo: "Annet", labelEn: "Other" },
];

const stages = [
  { value: "idea", labelNo: "Bare en idé", labelEn: "Just an idea" },
  { value: "improve", labelNo: "Har noe, vil forbedre", labelEn: "Have something, want to improve" },
  { value: "launch", labelNo: "Klar for lansering", labelEn: "Ready to launch" },
  { value: "scale", labelNo: "Vil skalere", labelEn: "Want to scale" },
];

const priorities = [
  { value: "customers", labelNo: "Få kunder / brukere", labelEn: "Get customers / users" },
  { value: "structure", labelNo: "Struktur og system", labelEn: "Structure and system" },
  { value: "time", labelNo: "Spare tid", labelEn: "Save time" },
  { value: "professional", labelNo: "Se profesjonell ut", labelEn: "Look professional" },
  { value: "execute", labelNo: "Komme i gang", labelEn: "Get started" },
];

const budgets = [
  { value: "lite", labelNo: "Lite (under 15k)", labelEn: "Small (under 15k)" },
  { value: "medium", labelNo: "Medium (15–50k)", labelEn: "Medium (15–50k)" },
  { value: "storre", labelNo: "Større (50k+)", labelEn: "Larger (50k+)" },
];

type BriefOption = { value: string; labelNo: string; labelEn: string };

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
  const { locale } = useLocale();
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

  const optLabel = (opt: BriefOption) =>
    locale === "en" ? opt.labelEn : opt.labelNo;

  const findLabel = (list: BriefOption[], val: string) => {
    const found = list.find((o) => o.value === val);
    return found ? optLabel(found) : val;
  };

  const steps = [
    { key: "goal" as const, title: tKey("Hva handler det om?", "What is it about?", locale), options: goals },
    { key: "stage" as const, title: tKey("Hvor er du nå?", "Where are you now?", locale), options: stages },
    { key: "priority" as const, title: tKey("Hva er viktigst?", "What matters most?", locale), options: priorities },
    { key: "budget_mode" as const, title: tKey("Omtrentlig budsjett?", "Rough budget?", locale), options: budgets },
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

  if (submitted) {
    return (
      <Layout>
        <SeoHead
          title={tKey("Takk! | Alt jeg skaper", "Thanks! | Alt jeg skaper", locale)}
          description={tKey("Briefen din er sendt.", "Your brief has been submitted.", locale)}
          pathname="/brief"
          noindex
        />
        <section className="container pt-16 pb-24 max-w-xl mx-auto">
          <h1 className="font-display text-3xl font-extrabold text-foreground mb-6">
            {tKey("Takk!", "Thanks!", locale)}
          </h1>
          <p className="text-muted-foreground mb-8">
            {tKey("Briefen din er sendt. Her er et sammendrag:", "Your brief has been submitted. Here's a summary:", locale)}
          </p>
          <div className="space-y-3 text-sm">
            {form.goal && <SummaryRow label={tKey("Mål", "Goal", locale)} value={findLabel(goals, form.goal)} />}
            {form.stage && <SummaryRow label={tKey("Fase", "Stage", locale)} value={findLabel(stages, form.stage)} />}
            {form.priority && <SummaryRow label={tKey("Prioritet", "Priority", locale)} value={findLabel(priorities, form.priority)} />}
            {form.budget_mode && <SummaryRow label={tKey("Budsjett", "Budget", locale)} value={findLabel(budgets, form.budget_mode)} />}
            {form.details && <SummaryRow label={tKey("Detaljer", "Details", locale)} value={form.details} />}
            {form.name && <SummaryRow label={tKey("Navn", "Name", locale)} value={form.name} />}
            {form.email && <SummaryRow label={tKey("E-post", "Email", locale)} value={form.email} />}
          </div>
          <div className="mt-10 border-t border-border pt-8">
            <p className="text-foreground text-sm">
              {tKey("Jeg tar kontakt innen 1–2 virkedager. Hvis det haster,", "I'll get back within 1–2 working days. If it's urgent,", locale)}{" "}
              <a href="mailto:kontaktpeder@gmail.com" className="text-primary hover:underline underline-offset-4">
                {tKey("send mail", "send email", locale)}
              </a>.
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
      <SeoHead
        title={tKey("Fortell meg hva du prøver å få til | Alt jeg skaper", "Tell me what you're trying to achieve | Alt jeg skaper", locale)}
        description={tKey("Fortell meg hva du prøver å få til – jeg hjelper deg videre.", "Tell me what you're trying to achieve – I'll help you forward.", locale)}
        pathname="/brief"
        noindex
      />
      <section className="container pt-16 pb-[calc(6rem+env(safe-area-inset-bottom))] max-w-xl mx-auto">
        <h1 className="font-display text-3xl md:text-4xl font-extrabold text-foreground mb-2">Brief</h1>
        <p className="text-muted-foreground text-sm mb-10">
          {tKey("Steg", "Step", locale)} {step + 1} {tKey("av", "of", locale)} {steps.length + 2}
        </p>

        <div className="min-h-[430px] md:min-h-[460px]">
          {isStepPhase && (
            <StepSelect
              title={steps[step].title}
              options={steps[step].options}
              value={form[steps[step].key]}
              onChange={(v) => {
                set(steps[step].key, v);
                setStep(step + 1);
              }}
              locale={locale}
            />
          )}

          {isDetailsStep && (
            <div>
              <h2 className="font-display text-xl font-bold text-foreground mb-4">
                {tKey("Fortell mer", "Tell me more", locale)}
              </h2>
              <textarea
                value={form.details}
                onChange={(e) => set("details", e.target.value)}
                placeholder={tKey("Beskriv prosjektet, utfordringen, eller ideen din…", "Describe your project, challenge, or idea…", locale)}
                className="w-full h-40 bg-transparent border border-border p-4 text-foreground text-sm font-body placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary resize-none"
                maxLength={2000}
              />
              <button
                onClick={() => setStep(step + 1)}
                className="mt-4 px-6 py-3 bg-primary text-primary-foreground text-sm font-medium uppercase tracking-wide border border-primary hover:brightness-110 transition-all"
              >
                {tKey("Neste", "Next", locale)}
              </button>
            </div>
          )}

          {isContactStep && (
            <div>
              <h2 className="font-display text-xl font-bold text-foreground mb-4">
                {tKey("Kontaktinfo", "Contact details", locale)}
              </h2>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder={tKey("Navn", "Name", locale)}
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  className="w-full bg-transparent border border-border p-3 text-foreground text-sm font-body placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary"
                  maxLength={100}
                />
                <input
                  type="email"
                  placeholder={tKey("E-post", "Email", locale)}
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  className="w-full bg-transparent border border-border p-3 text-foreground text-sm font-body placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary"
                  maxLength={255}
                />
                <input
                  type="tel"
                  placeholder={tKey("Telefon (valgfritt)", "Phone (optional)", locale)}
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
                {sending ? tKey("Sender…", "Sending…", locale) : tKey("Send brief", "Send brief", locale)}
              </button>
            </div>
          )}
        </div>

        <div className="h-10 mt-6">
          {step > 0 && (
            <button
              onClick={() => setStep(step - 1)}
              className="text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
            >
              ← {tKey("Tilbake", "Back", locale)}
            </button>
          )}
        </div>
      </section>
    </Layout>
  );
}

function StepSelect({
  title,
  options,
  value,
  onChange,
  locale,
}: {
  title: string;
  options: BriefOption[];
  value: string;
  onChange: (v: string) => void;
  locale: "no" | "en";
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
            {locale === "en" ? opt.labelEn : opt.labelNo}
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
