/* ==================================================================
   Editable website content.
   The data lives in config/content.json — edit it from the admin panel
   (/admin) or by hand. This file only describes its shape.
   ================================================================== */
import raw from "./content.json";

export interface Work {
  title: string;
  /** Employer — drives the portfolio filters. */
  company: string;
  client?: string;
  role?: string;
  period?: string;
  /** Short award/recognition label shown on the card. */
  badge?: string;
  /** Pinned first (and shown as the large card) in the portfolio. */
  featured?: boolean;
  description: string;
  highlights?: string[];
  /** Comma separated tech stack. */
  term: string;
  /** Screenshot path, or a "placeholder" path to get a generated cover. */
  thumbnail: string;
  href: string;
}

export interface Job {
  time: string;
  title: string;
  company: string;
  description: string;
  clients?: string[];
  highlights?: string[];
  links?: { label: string; href: string; note?: string }[];
  tags?: string[];
}

export interface SocialLink {
  label: string;
  url: string;
  iconClassName: string;
}

export interface SiteContent {
  profile: {
    name: string;
    headline: string;
    /** Rotating words in the hero typewriter (the first one is also used as the job title). */
    mainJob: string[];
    yearsOfExperience: number;
    location: string;
    description: string;
    about: string;
    heroLead: string;
    /** Path of the downloadable CV (PDF). */
    cvFile: string;
    /** Optional uploaded avatar path; empty = the bundled photo. */
    avatar?: string;
  };
  socialLinks: SocialLink[];
  skills: { name: string; value: number }[];
  skillGroups: { title: string; items: string[] }[];
  softSkills: string[];
  languages: { name: string; level: string }[];
  awards: { year: string; title: string; company: string }[];
  services: { icon: string; color: string; name: string; description: string }[];
  education: { time: string; title: string; description: string; location: string }[];
  work: Job[];
  works: Work[];
  seo: { siteTitle: string; siteDescription: string; copyright: string };
}

export const content = raw as SiteContent;
