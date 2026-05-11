INSERT INTO projects (slug, title, subtitle, role, tech, description, status, sort_order, published_at)
VALUES (
  'kurs-kragero',
  'Kurs Kragerø',
  'Nettside, SEO og administrasjon',
  'Nettside, SEO og administrasjon',
  'React, Vite, Supabase, Tailwind',
  E'**Problem:**\n\nKurs Kragerø trengte en tydeligere nettside som gjorde det enklere for kunder å forstå kursene, kontakte bedriften og finne riktig opplæring via Google.\n\n**Løsning:**\n\nJeg bygget en mer strukturert nettside med tydelige kurslandingssider, SEO-oppsett, metadata, schema, sitemap, sticky mobil-CTA, bedre kontaktflyt og admin for innhold.\n\n**Resultat:**\n\nSiden er enklere å forstå, mer søkbar lokalt og bedre rigget for konvertering fra mobil og Google.',
  'published',
  -10,
  now()
)
ON CONFLICT (slug) DO NOTHING;