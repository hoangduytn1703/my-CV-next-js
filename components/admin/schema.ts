/* Describes every editable part of config/content.json. The editor renders forms from this. */

/* eslint-disable @typescript-eslint/no-explicit-any */
export type Field =
  | {
      type: "text";
      key: string;
      label: string;
      help?: string;
      multiline?: boolean;
      rows?: number;
      placeholder?: string;
    }
  | { type: "number"; key: string; label: string; help?: string; min?: number; max?: number }
  | { type: "bool"; key: string; label: string; help?: string }
  | { type: "select"; key: string; label: string; help?: string; options: { value: string; label: string }[] }
  | { type: "color"; key: string; label: string; help?: string }
  | { type: "file"; key: string; label: string; help?: string; accept: "image" | "pdf" }
  /** string[] edited as chips */
  | { type: "tags"; key: string; label: string; help?: string }
  /** "a, b, c" string edited as chips */
  | { type: "csv"; key: string; label: string; help?: string }
  /** string[] of sentences, one text box each */
  | { type: "lines"; key: string; label: string; help?: string; addLabel?: string }
  | { type: "group"; key: string; label: string; fields: Field[] }
  | {
      type: "list";
      key: string;
      label: string;
      help?: string;
      item: Field[];
      title: (item: any, index: number) => string;
      subtitle?: (item: any) => string;
      create: () => any;
      addLabel?: string;
    };

export interface Section {
  id: string;
  title: string;
  description: string;
  fields: Field[];
}

const SOCIAL_ICONS = [
  ["icon-phone", "Phone"],
  ["icon-envelope", "Email"],
  ["icon-social-facebook", "Facebook"],
  ["icon-social-linkedin", "LinkedIn"],
  ["icon-social-github", "GitHub"],
  ["icon-social-twitter", "Twitter / X"],
  ["icon-social-instagram", "Instagram"],
  ["icon-social-youtube", "YouTube"],
  ["icon-globe", "Website"],
].map(([value, label]) => ({ value, label }));

export const SECTIONS: Section[] = [
  {
    id: "profile",
    title: "Profile",
    description: "Name, headline and the introduction shown in the hero and About sections.",
    fields: [
      {
        type: "group",
        key: "profile",
        label: "Profile",
        fields: [
          { type: "text", key: "name", label: "Full name" },
          { type: "text", key: "headline", label: "Headline", help: "Short professional title, e.g. used for SEO." },
          {
            type: "tags",
            key: "mainJob",
            label: "Typewriter titles",
            help: "Rotating words in the hero. The first one is also used as your job title.",
          },
          { type: "number", key: "yearsOfExperience", label: "Years of experience", min: 0, max: 60 },
          { type: "text", key: "location", label: "Location" },
          { type: "text", key: "heroLead", label: "Hero introduction", multiline: true, rows: 3 },
          {
            type: "text",
            key: "about",
            label: "About me",
            multiline: true,
            rows: 5,
            help: "Shown in the About section (lights up word by word while scrolling).",
          },
          {
            type: "text",
            key: "description",
            label: "Short description",
            multiline: true,
            rows: 3,
            help: "Used for link previews (Facebook, LinkedIn…) and search engines.",
          },
          {
            type: "file",
            key: "avatar",
            label: "Avatar photo",
            accept: "image",
            help: "Leave empty to keep the current photo.",
          },
          {
            type: "file",
            key: "cvFile",
            label: "CV file (PDF)",
            accept: "pdf",
            help: "The “Download CV” buttons link here.",
          },
        ],
      },
    ],
  },
  {
    id: "skills",
    title: "Skills",
    description: "Level meters, the grouped toolbox, soft skills and languages.",
    fields: [
      {
        type: "list",
        key: "skills",
        label: "Skill meters",
        help: "Value is a self-assessed percentage (0–100).",
        item: [
          { type: "text", key: "name", label: "Skill" },
          { type: "number", key: "value", label: "Level (%)", min: 0, max: 100 },
        ],
        title: (s) => s.name || "New skill",
        subtitle: (s) => `${s.value ?? 0}%`,
        create: () => ({ name: "", value: 80 }),
        addLabel: "Add skill",
      },
      {
        type: "list",
        key: "skillGroups",
        label: "Toolbox groups",
        item: [
          { type: "text", key: "title", label: "Group title" },
          {
            type: "tags",
            key: "items",
            label: "Technologies",
            help: "Known technologies get their logo automatically.",
          },
        ],
        title: (g) => g.title || "New group",
        subtitle: (g) => `${g.items?.length ?? 0} items`,
        create: () => ({ title: "", items: [] }),
        addLabel: "Add group",
      },
      { type: "tags", key: "softSkills", label: "Soft skills" },
      {
        type: "list",
        key: "languages",
        label: "Languages",
        item: [
          { type: "text", key: "name", label: "Language" },
          { type: "text", key: "level", label: "Level" },
        ],
        title: (l) => l.name || "New language",
        subtitle: (l) => l.level,
        create: () => ({ name: "", level: "" }),
        addLabel: "Add language",
      },
    ],
  },
  {
    id: "experience",
    title: "Experience",
    description: "Work history timeline and education.",
    fields: [
      {
        type: "list",
        key: "work",
        label: "Work history",
        help: "Newest first. A period containing “Present” or “Now” is marked as current.",
        item: [
          { type: "text", key: "title", label: "Position" },
          { type: "text", key: "company", label: "Company" },
          { type: "text", key: "time", label: "Period", placeholder: "Jun 2019 – Present" },
          { type: "text", key: "description", label: "Summary", multiline: true, rows: 3 },
          { type: "tags", key: "clients", label: "Clients" },
          { type: "lines", key: "highlights", label: "Highlights", addLabel: "Add highlight" },
          { type: "tags", key: "tags", label: "Tech tags" },
          {
            type: "list",
            key: "links",
            label: "Project links",
            item: [
              { type: "text", key: "label", label: "Label" },
              { type: "text", key: "href", label: "URL" },
              { type: "text", key: "note", label: "Note" },
            ],
            title: (l) => l.label || "New link",
            create: () => ({ label: "", href: "", note: "" }),
            addLabel: "Add link",
          },
        ],
        title: (j) => j.title || "New position",
        subtitle: (j) => [j.company, j.time].filter(Boolean).join(" · "),
        create: () => ({ time: "", title: "", company: "", description: "", clients: [], highlights: [], tags: [] }),
        addLabel: "Add position",
      },
      {
        type: "list",
        key: "education",
        label: "Education",
        item: [
          { type: "text", key: "title", label: "School" },
          { type: "text", key: "description", label: "Degree / major" },
          { type: "text", key: "time", label: "Period" },
          { type: "text", key: "location", label: "Location" },
        ],
        title: (e) => e.title || "New school",
        subtitle: (e) => e.time,
        create: () => ({ time: "", title: "", description: "", location: "" }),
        addLabel: "Add education",
      },
    ],
  },
  {
    id: "works",
    title: "Projects",
    description: "Portfolio items. The first “featured” project is shown as the large card.",
    fields: [
      {
        type: "list",
        key: "works",
        label: "Projects",
        help: "The company field also creates the portfolio filter buttons.",
        item: [
          { type: "text", key: "title", label: "Project name" },
          { type: "text", key: "company", label: "Company (filter)" },
          { type: "text", key: "client", label: "Client" },
          { type: "text", key: "role", label: "Role" },
          { type: "text", key: "period", label: "Period" },
          {
            type: "text",
            key: "badge",
            label: "Award badge",
            help: "e.g. “Best Project 2023” — leave empty for none.",
          },
          { type: "bool", key: "featured", label: "Featured (pinned first, large card)" },
          { type: "text", key: "description", label: "Description", multiline: true, rows: 3 },
          { type: "lines", key: "highlights", label: "Highlights", addLabel: "Add highlight" },
          { type: "csv", key: "term", label: "Tech stack" },
          { type: "file", key: "thumbnail", label: "Screenshot", accept: "image", help: "Empty = generated cover." },
          { type: "text", key: "href", label: "Website URL", help: "Leave empty if the project is not public." },
        ],
        title: (w) => w.title || "New project",
        subtitle: (w) => [w.company, w.period].filter(Boolean).join(" · "),
        create: () => ({
          title: "",
          company: "",
          role: "Front-end Developer",
          description: "",
          highlights: [],
          term: "",
          thumbnail: "",
          href: "",
        }),
        addLabel: "Add project",
      },
    ],
  },
  {
    id: "services",
    title: "Services",
    description: "The “What I can do for you” cards.",
    fields: [
      {
        type: "list",
        key: "services",
        label: "Services",
        item: [
          { type: "text", key: "name", label: "Title" },
          { type: "text", key: "description", label: "Description", multiline: true, rows: 3 },
          {
            type: "select",
            key: "icon",
            label: "Icon",
            options: [
              { value: "code", label: "Code" },
              { value: "layout", label: "Layout" },
              { value: "speed", label: "Speed" },
              { value: "shield", label: "Shield" },
            ],
          },
          { type: "color", key: "color", label: "Accent colour" },
        ],
        title: (s) => s.name || "New service",
        create: () => ({ icon: "code", color: "#34d399", name: "", description: "" }),
        addLabel: "Add service",
      },
    ],
  },
  {
    id: "awards",
    title: "Awards",
    description: "Honors shown in the About section.",
    fields: [
      {
        type: "list",
        key: "awards",
        label: "Awards",
        item: [
          { type: "text", key: "year", label: "Year" },
          { type: "text", key: "title", label: "Title" },
          { type: "text", key: "company", label: "Organisation" },
        ],
        title: (a) => a.title || "New award",
        subtitle: (a) => a.year,
        create: () => ({ year: String(new Date().getFullYear()), title: "", company: "" }),
        addLabel: "Add award",
      },
    ],
  },
  {
    id: "contact",
    title: "Contact & social",
    description: "Phone, email and social links (hero, contact card, footer).",
    fields: [
      {
        type: "list",
        key: "socialLinks",
        label: "Links",
        help: "Use “tel: 0123…” for phone and “mailto: you@mail.com” for email.",
        item: [
          { type: "text", key: "label", label: "Label" },
          { type: "text", key: "url", label: "URL" },
          { type: "select", key: "iconClassName", label: "Icon", options: SOCIAL_ICONS },
        ],
        title: (l) => l.label || "New link",
        subtitle: (l) => l.url,
        create: () => ({ label: "", url: "", iconClassName: "icon-globe" }),
        addLabel: "Add link",
      },
    ],
  },
  {
    id: "seo",
    title: "SEO & footer",
    description: "Browser tab title, search description and footer text.",
    fields: [
      {
        type: "group",
        key: "seo",
        label: "SEO",
        fields: [
          { type: "text", key: "siteTitle", label: "Site title", help: "Shown after your name in the browser tab." },
          { type: "text", key: "siteDescription", label: "Search description", multiline: true, rows: 3 },
          { type: "text", key: "copyright", label: "Footer copyright" },
        ],
      },
    ],
  },
];
