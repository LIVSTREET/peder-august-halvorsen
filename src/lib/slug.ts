export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[æå]/g, "a")
    .replace(/ø/g, "o")
    .replace(/[^a-z0-9-]/g, "");
}

const VALID_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function isSlugValid(slug: string): boolean {
  if (!slug || slug.length < 2 || slug.length > 100) return false;
  return VALID_SLUG.test(slug);
}

export function getSlugError(slug: string): string | null {
  if (!slug) return "Slug mangler.";
  if (slug.length < 2) return "Slug må være minst 2 tegn.";
  if (/\s/.test(slug)) return "Slug kan ikke inneholde mellomrom.";
  if (!VALID_SLUG.test(slug)) return "Kun små bokstaver, tall og bindestrek.";
  if (slug.length > 100) return "Slug er for lang.";
  return null;
}
