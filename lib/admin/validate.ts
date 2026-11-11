import type { SiteContent } from "config/content";
import { StoreError } from "lib/admin/store";

const isObj = (v: unknown): v is Record<string, unknown> => !!v && typeof v === "object" && !Array.isArray(v);

const ARRAY_KEYS = [
  "socialLinks",
  "skills",
  "skillGroups",
  "softSkills",
  "languages",
  "awards",
  "services",
  "education",
  "work",
  "works",
] as const;

const SAFE_URL = /^(https?:\/\/|mailto:|tel:|\/|#)/i;

/** Rejects anything that is not shaped like SiteContent and neutralises unsafe links. */
export const validateContent = (input: unknown): SiteContent => {
  if (!isObj(input) || !isObj(input.profile) || !isObj(input.seo)) {
    throw new StoreError("Content is missing profile/seo sections.", 400);
  }
  for (const k of ARRAY_KEYS) {
    if (!Array.isArray(input[k])) throw new StoreError(`"${k}" must be a list.`, 400);
  }
  const content = input as unknown as SiteContent;
  const p = content.profile;
  if (!p.name?.trim()) throw new StoreError("Name cannot be empty.", 400);
  if (!Array.isArray(p.mainJob) || !p.mainJob.length) throw new StoreError("Add at least one job title.", 400);
  p.yearsOfExperience = Math.max(0, Math.round(Number(p.yearsOfExperience) || 0));
  content.skills.forEach((s) => (s.value = Math.min(100, Math.max(0, Math.round(Number(s.value) || 0)))));

  const fixUrl = (url: string) => (url && !SAFE_URL.test(url.trim()) ? `https://${url.trim()}` : url?.trim() ?? "");
  content.socialLinks.forEach((l) => {
    const trimmed = (l.url || "").trim();
    // Allow "mailto: x" / "tel: x" with a space (legacy format) as well as normal URLs.
    if (!/^(mailto|tel):/i.test(trimmed)) l.url = fixUrl(trimmed);
  });
  content.works.forEach((w) => (w.href = w.href ? fixUrl(w.href) : "#"));
  content.work.forEach((j) => j.links?.forEach((l) => (l.href = fixUrl(l.href))));
  if (/^javascript:/i.test(p.cvFile)) p.cvFile = "";

  return content;
};
