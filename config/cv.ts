/* ==================================================================
   CV data used by the website, derived from config/content.json.
   To change the content use the admin panel (/admin) or edit the JSON.
   ================================================================== */
import { content } from "config/content";

export type { Job, Work } from "config/content";

const { profile, works, awards } = content;

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

/** Portfolio filters: "Everything" + every employer, in order of first appearance. */
export const CompanyType: { [key: string]: string } = {
  Everything: "*",
  ...Object.fromEntries(Array.from(new Set(works.map((w) => w.company))).map((c) => [c, slugify(c)])),
};

export const cvConfig = {
  title: profile.name,
  name: profile.name,
  headline: profile.headline,
  description: profile.description,
  about: profile.about,
  heroLead: profile.heroLead,
  mainJob: profile.mainJob,
  cvDownloadLink: profile.cvFile,
  avatar: profile.avatar || "",
  skills: content.skills,
  skillGroups: content.skillGroups,
  softSkills: content.softSkills,
  languages: content.languages,
  facts: [
    { icon: "icon-fire", name: "Years of experience", count: profile.yearsOfExperience, suffix: "+" },
    { icon: "icon-badge", name: "Awards & honors", count: awards.length, suffix: "" },
    { icon: "icon-layers", name: "Projects delivered", count: works.length, suffix: "" },
  ],
  awards,
  menu: [
    { label: "Home", href: "home", className: "icon-home" },
    { label: "About", href: "about", className: "icon-user-following" },
    { label: "Services", href: "services", className: "icon-briefcase" },
    { label: "Experience", href: "experience", className: "icon-graduation" },
    { label: "Works", href: "works", className: "icon-layers" },
    { label: "Blog", href: "blog", className: "icon-note", disabled: true },
    { label: "Contact", href: "contact", className: "icon-bubbles" },
  ],
  services: content.services,
  experience: {
    education: content.education,
    work: content.work,
  },
  works,
};
