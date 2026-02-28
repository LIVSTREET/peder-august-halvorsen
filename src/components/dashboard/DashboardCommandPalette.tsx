import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

const COMMANDS = [
  { label: "Oversikt", to: "/dashboard" },
  { label: "Prosjekter", to: "/dashboard/projects" },
  { label: "Skriver", to: "/dashboard/posts" },
  { label: "Ny post", to: "/dashboard/posts/new" },
  { label: "Innhold", to: "/dashboard/content" },
  { label: "Nytt innhold", to: "/dashboard/content/new" },
  { label: "Arkiv", to: "/dashboard/archive" },
  { label: "Leads", to: "/dashboard/leads" },
];

export function DashboardCommandPalette() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  function run(to: string) {
    navigate(to);
    setOpen(false);
  }

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Søk eller gå til…" />
      <CommandList>
        <CommandEmpty>Ingen treff.</CommandEmpty>
        <CommandGroup heading="Navigasjon">
          {COMMANDS.map((c) => (
            <CommandItem key={c.to} onSelect={() => run(c.to)}>
              {c.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
