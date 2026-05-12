## Mål

Erstatt mobilens nåværende logo-blokk i `Hero` (src/pages/Index.tsx) med et 3D-galleri på to lag:

- **Lag 1 (foran ved start):** logoen (`logo-pah.png`) — sentrert, full opasitet.
- **Lag 2 (bak ved start):** portrettet (`hero-portrait.jpg`) — skalert ned, rotert ~22° innover mot midten, dempet med skygge/mørk gradient så det «glimter» fram bak logoen.

Horisontal sveip bytter plass på lagene med en myk 3D-overgang: det aktive elementet glir til venstre med subtil innovervending mens det bakre kommer fram til midten i full opasitet.

## Interaksjon

- **Sveip venstre/høyre** på hele hero-stagen for å bytte aktivt lag (kun mobil; desktop-hero rør vi ikke).
- Ingen prikker, piler eller hint — det bakre lagets kant skal være synlig nok til å invitere.
- Sveip-terskel ~40px. Tap på det bakre laget bytter også (bonus, billig å legge til).
- Vertikal scroll må fortsatt fungere: vi bruker `touchstart`/`touchend` og lar bare horisontal dominans utløse bytte (`Math.abs(dx) > Math.abs(dy)`).
- Respekterer `prefers-reduced-motion`: kutt 3D-rotasjon, behold krysstoning.

## Visuell oppskrift

Container:
- `relative w-screen aspect-[16/7]` (litt høyere enn dagens 16/6 for å gi rom til 3D-kantene)
- `[perspective:1200px]` på wrapperen
- `overflow-visible` så det bakre lagets kant kan stikke ut

Hvert lag (logo/portrett) er et absolutt-posisjonert kort med felles transform-template:
- **Foran:** `translate-x-0 rotate-y-0 scale-100 opacity-100 z-20`
- **Bak:** `-translate-x-[18%] [transform:rotateY(22deg)] scale-[0.78] opacity-65 z-10` + skygge `drop-shadow-[0_20px_40px_rgba(0,0,0,0.55)]` + svak mørk gradient-overlay
- Når aktiv bytter: foran glir mot `translate-x-[18%] rotateY(-22deg) scale-[0.78]` mens bak går mot fronten.
- Transition: `transition-[transform,opacity] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]`
- `transform-style: preserve-3d`, `backface-visibility: hidden`

Portrett-laget: gjenbruk samme dempnings-overlay som desktop (`radial-gradient` + `bg-background/10`) for å holde det editorial-mørkt.

## Implementering (kun frontend, kun `src/pages/Index.tsx`)

1. Importer `useState` (allerede tilgjengelig via React).
2. Lag en liten intern komponent `MobileHeroStack` med:
   - `const [front, setFront] = useState<"logo" | "portrait">("logo")`
   - `touchStartX/Y` refs, `onTouchStart/onTouchEnd` handlers som setter `front` ved horisontalt sveip > 40px.
   - To absolutte `<div>`-kort for logo og portrett. Hvert kort får klassesett basert på `front === "logo"`.
3. Erstatt dagens `<Reveal delay={80}> ... <h1>logo</h1></Reveal>`-blokk i mobil-greinen med `<MobileHeroStack />` (pakket i `<Reveal>` for samme inn-fade).
4. La alt annet (eyebrow, h1-tekst-rolle for SEO via `aria-label`/`sr-only`, undertittel, CTAer) stå urørt. Vi beholder en `<h1 className="sr-only">Studio P.A. Halvorsen</h1>` for SEO siden logoen ikke lenger er det primære h1-elementet.
5. Desktop-hero: ingen endringer.

## Tekniske detaljer

- Tailwind støtter ikke `rotate-y` direkte — bruk inline `style={{ transform: ... }}` eller arbitrary `[transform:...]`-klasser.
- `touchAction: 'pan-y'` på swipe-stagen så vertikal scroll forblir flytende mens horisontale gester fanges.
- `will-change: transform, opacity` på lagene for jevn animasjon på iOS Safari.
- Filstørrelsene på `hero-portrait.jpg` og `logo-pah.png` er allerede lastet — ingen nye assets.

## Filer som endres

- `src/pages/Index.tsx` — ny `MobileHeroStack`-komponent + bruk i mobil-greinen i `Hero`.

Ingen backend-, schema- eller routing-endringer.