import { COMPANY_PROFILES, type CompanyProfileId } from './constants';

/** Aliases used to match free-text company names to built-in profiles. */
export const PROFILE_ALIASES: Record<CompanyProfileId, string[]> = {
  amped: [
    'amped',
    'amped energy',
    'amped energy solutions',
    'amped energy solution',
  ],
  liberty: ['liberty', 'liberty energy'],
  default: ['default', 'none', 'no company'],
};

function normalizeCompany(s: string): string {
  return String(s || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ');
}

/**
 * Match a company name to a built-in profile, or null if custom branding.
 * Returns 'default' only when the user explicitly typed a Default alias.
 */
export function matchCompanyToProfile(
  companyName: string,
): CompanyProfileId | null {
  const q = normalizeCompany(companyName);
  if (!q) return null;

  const order: CompanyProfileId[] = ['amped', 'liberty', 'default'];
  for (const id of order) {
    const names = [
      normalizeCompany(COMPANY_PROFILES[id].name),
      ...PROFILE_ALIASES[id].map(normalizeCompany),
    ];
    for (const alias of names) {
      if (!alias) continue;
      // Exact match
      if (q === alias) return id;
      // Company contains full alias (e.g. "amped energy solutions llc")
      if (alias.length >= 4 && q.includes(alias)) return id;
      // Short typed alias matches start of profile name (e.g. "amped")
      if (q.length >= 3 && alias.startsWith(q) && q.length >= Math.min(5, alias.length)) {
        return id;
      }
      // Typed value is a significant word of alias
      if (q.length >= 5 && alias.includes(q)) return id;
    }
  }
  return null;
}

export function matchLabel(id: CompanyProfileId): string {
  return COMPANY_PROFILES[id]?.name ?? id;
}
