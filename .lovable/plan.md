## Mål

Gjør 3D-stagen tydeligere cinematisk så det leses som dybde — ikke et skjevt hode oppå logoen.

## Endringer i `MobileHeroStack` (src/pages/Index.tsx)

**Startposisjon:**
- Logo: foran, **til venstre**, med liten innovervending mot midten (~ -8° rotateY, translateX ~ -4%).
- Portrett: bak, **til høyre**, full størrelse (fyller stagen), tydelig skrå (~ -22° rotateY så det vender innover mot midten fra høyre), skjøvet `translateX(+18%)` og litt nedover, skalert ~0.92 (ikke krympet til lite kort).

**Bakre lag (cinematisk dybde):**
- Opasitet ned til ~0.35.
- Mørk gradient-overlay fra bunn (`linear-gradient(to top, hsl(var(--background)) 0%, hsl(var(--background)/0.85) 25%, transparent 70%)`) for romfølelse / "han står dypt inne i scenen".
- Ekstra `bg-background/40` flat-overlay for å dempe konkurranse med logoen.
- Stor myk skygge under (`drop-shadow` 30px / 60px svart).
- Filter: `blur(1.5px) brightness(0.55) saturate(0.85)` så det glir bakover optisk.

**Fremre lag:**
- Full opasitet, ingen blur, beholder drop-shadow for løft.
- Klikk på bakre lag bytter fortsatt; sveip uendret.

**Når portrett er foran:** speilvendt — portrett sentrert/litt høyre i full klarhet, logo glir til venstre med samme bakre-behandling (dempet, blurret, mørk gradient).

## Visuell oppskrift (oppsummert transform)

| Lag | Foran | Bak |
|-----|-------|-----|
| translateX | -4% (logo) / +6% (portrett) | -22% (logo) / +22% (portrett) |
| rotateY | -8° (logo, inn mot midten) / +8° (portrett) | +28° (logo, vendt inn fra venstre) / -28° (portrett, vendt inn fra høyre) |
| scale | 1.0 | 0.92 |
| opacity | 1 | 0.35 |
| filter | none | blur(1.5px) brightness(0.55) |
| overlay | ingen | bunn-gradient + flat dim |

## Filer

- `src/pages/Index.tsx` — kun `MobileHeroStack`-komponent og dens style-objekter.

Ingen andre endringer.