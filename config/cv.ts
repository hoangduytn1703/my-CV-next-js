/* ==================================================================
   All CV content lives here — edit this file to update the website.
   Source of truth: public/Nguyen-Hoang-Duy.pdf
   ================================================================== */

export interface Work {
  title: string;
  /** Employer — drives the portfolio filters (see CompanyType). */
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

export const CompanyType: { [key: string]: string } = {
  Everything: "*",
  "GMO-Z.com Runsystem": "gmo",
  "TQ Design": "tqdesign",
  "BSD SOLUTION": "bsd",
  "FPT Shop": "fptshop",
};

const GMO = "GMO-Z.com Runsystem";
const PLACEHOLDER = "/images/works/default-placeholder.svg";

const works: Work[] = [
  {
    title: "Drill — Online Exam Platform",
    company: GMO,
    role: "Front-end Developer",
    period: "2022 – Present",
    badge: "Best Project 2023",
    featured: true,
    description:
      "An online examination system designed for Japanese students, with interactive quizzes, test-taking flows and real-time scoring.",
    highlights: [
      "Built interactive quiz and test-taking interfaces using Vue 3",
      "Integrated the front-end with the backend via RESTful API",
      "Implemented features for real-time feedback and scoring",
    ],
    term: "Nuxt 3, Vue 3, Tailwind CSS, RESTful API",
    thumbnail: "/images/works/drill.png",
    href: "https://digistudy.sing.jp/login",
  },
  {
    title: "NBA Docomo — Basketball Content Platform",
    company: GMO,
    client: "Brewus Group",
    role: "Front-end Developer",
    period: "Feb 2026 – Present",
    description:
      "A high-performance basketball content platform for the Japanese market, built with Next.js for scalability and a smooth user experience.",
    highlights: [
      "Built a high-performance basketball content platform using Next.js, improving scalability and user experience",
      "Collaborated with cross-functional teams to ship production-ready features and enhance UI/UX",
      "Core Frontend Developer for a company-recognized “Best Project of the Year” initiative",
    ],
    term: "Next.js, React",
    thumbnail: PLACEHOLDER,
    href: "#",
  },
  {
    title: "Chicaro — Interactive Education Platform",
    company: GMO,
    client: "Brewus Group",
    role: "Front-end Developer",
    period: "Feb 2026 – Present",
    description:
      "An interactive educational platform for the Japanese market: a Vue 3 admin dashboard for operators and a React web app for learners.",
    highlights: [
      "Implemented the admin dashboard using Vue 3",
      "Built the user-facing web application using React",
      "Collaborated with cross-functional teams to ship production-ready features and enhance UI/UX",
    ],
    term: "Vue 3, React",
    thumbnail: PLACEHOLDER,
    href: "#",
  },
  {
    title: "Paydar — Fintech Web Platform",
    company: GMO,
    role: "Front-end Developer",
    period: "Apr 2025 – Dec 2025",
    description:
      "Web platform development for a Fintech product — modern, pixel-perfect UI on top of a NestJS backend.",
    highlights: [
      "Engineered complex features and UI components using TypeScript, enhancing code quality and maintainability",
      "Implemented responsive, pixel-perfect designs using SCSS and Tailwind CSS",
      "Integrated dynamic data from the backend API (NestJS) using Axios",
      "Optimized page load performance and user interaction speeds",
    ],
    term: "TypeScript, SCSS, Tailwind CSS, Axios, NestJS",
    thumbnail: "/images/works/chikipay.png",
    href: "https://paydar.com/",
  },
  {
    title: "SUMIKA — Loan Application Management",
    company: GMO,
    role: "Front-end Developer",
    period: "May 2023 – Nov 2024",
    description:
      "A web application that digitizes the traditional lending process — users self-register and submit loan applications online, completely replacing handwritten paper forms.",
    highlights: [
      "Delivered new features by translating business requirements and Figma designs into functional code",
      "Managed complex application state and asynchronous data streams with Redux Toolkit and RxJS",
      "Built dynamic, multi-step forms with heavy validation logic using React Hook Form",
    ],
    term: "React, TypeScript, Redux Toolkit, RxJS, React Hook Form, Chakra UI, React Router, RESTful API",
    thumbnail: PLACEHOLDER,
    href: "#",
  },
  {
    title: "Chikiipay — E-wallet",
    company: GMO,
    role: "Sub-lead · team of 5",
    description:
      "A payment solution application developed for the Japanese market, including automated front-end testing.",
    highlights: ["Sub-led a team of 5 front-end developers", "Automated front-end testing using Appium and CodeceptJS"],
    term: "Vue 3, TypeScript, Appium, CodeceptJS, Tailwind CSS, GitLab CI/CD",
    thumbnail: "/images/works/chikipay.png",
    href: "https://web.chikipay-kyousou.jp/",
  },
  {
    title: "Metauranai — Fortune Telling Platform",
    company: GMO,
    role: "Team Leader · team of 4",
    description: "A web app for fortune-telling content and user interaction.",
    highlights: [
      "Led a team of 4 developers",
      "Built features using React (Next.js) and integrated them with backend APIs",
    ],
    term: "Next.js, React, JavaScript, Firebase, PlayCanvas, AI",
    thumbnail: "/images/works/metaurai.png",
    href: "#",
  },
  {
    title: "RKKCS — Management System",
    company: GMO,
    role: "Front-end Developer",
    description: "A management platform for internal use by a Japanese client.",
    highlights: [
      "Developed and maintained front-end features using Vue.js and Nuxt.js",
      "Wrote unit tests with Jest following TDD principles",
    ],
    term: "Vue 2, Nuxt.js, JavaScript, SCSS, Axios, Jest",
    thumbnail: "/images/works/chintai.png",
    href: "#",
  },
  {
    title: "NHK School CMS & NHK Archives",
    company: GMO,
    client: "NHK",
    role: "Front-end Developer",
    description: "Content management systems for NHK's educational platforms.",
    highlights: [
      "Implemented admin dashboards and dynamic content modules",
      "Collaborated with UI/UX designers to ensure pixel-perfect interfaces",
    ],
    term: "Vue 2, Nuxt.js, Tailwind CSS, Vuex, GitLab CI/CD",
    thumbnail: "/images/works/nhk.jpg",
    href: "https://www.nhk.or.jp/school",
  },
  {
    title: "RemoteWork Cloud",
    company: GMO,
    role: "Front-end Developer",
    description: "A cloud-based remote work management platform.",
    highlights: [
      "Developed UI features using Nuxt 3 and Tailwind CSS",
      "Optimized components for performance and mobile responsiveness",
    ],
    term: "Nuxt 3, Vue 3, Tailwind CSS, RESTful API",
    thumbnail: "/images/works/chintai.png",
    href: "https://remotework-cloud.com/",
  },
  {
    title: "ChintaiDX — Hotel Management",
    company: GMO,
    client: "Chintai",
    role: "Front-end Developer",
    description: "A hotel management platform for real estate services.",
    highlights: [
      "Built responsive front-end pages using Vue.js",
      "Integrated interactive features with real-time data updates",
    ],
    term: "Vue 2, JavaScript, GraphQL, GitLab CI/CD",
    thumbnail: "/images/works/chintai.png",
    href: "http://admin.chintaidx.com/#/auth/login",
  },
  {
    title: "Thanh Pho Caphe",
    company: "TQ Design",
    role: "Front-end & Back-end Developer",
    description:
      "Responsive website development. Converted PSD designs into high-quality HTML/CSS templates ensuring pixel-perfect accuracy.",
    term: "ASP.NET MVC, HTML5/CSS3, jQuery, C#",
    thumbnail: "/images/works/tqdesign.jpg",
    href: "https://thanhphocaphe.com",
  },
  {
    title: "Dragon Village",
    company: "TQ Design",
    role: "Front-end & Back-end Developer",
    description:
      "Website for an apartment complex development. Converted PSD designs into high-quality HTML/CSS templates ensuring pixel-perfect accuracy.",
    term: "ASP.NET MVC, HTML5/CSS3, jQuery, C#",
    thumbnail: "/images/works/dragonvillage.png",
    href: "https://dragonvillage.com.vn/",
  },
  {
    title: "TQ Design",
    company: "TQ Design",
    role: "Front-end & Back-end Developer",
    description: "Maintained and developed responsive websites using HTML5, CSS3, Bootstrap 4, and jQuery.",
    term: "ASP.NET MVC, HTML5/CSS3, jQuery, C#",
    thumbnail: "/images/works/tqdesign.jpg",
    href: "https://tqdesign.vn",
  },
  {
    title: "The Max",
    company: "TQ Design",
    role: "Front-end & Back-end Developer",
    description: "Responsive website development. Converted PSD designs into high-quality HTML/CSS templates.",
    term: "ASP.NET MVC, HTML5/CSS3, jQuery, C#",
    thumbnail: "/images/works/tqdesign.jpg",
    href: "https://themax.vn",
  },
  {
    title: "Kingdom 101",
    company: "TQ Design",
    role: "Front-end & Back-end Developer",
    description: "Responsive website development. Converted PSD designs into high-quality HTML/CSS templates.",
    term: "ASP.NET MVC, HTML5/CSS3, jQuery, C#",
    thumbnail: "/images/works/tqdesign.jpg",
    href: "https://kingdom101.tqdesign.vn",
  },
  {
    title: "AKARI City",
    company: "TQ Design",
    role: "Front-end & Back-end Developer",
    description: "Responsive website development. Converted PSD designs into high-quality HTML/CSS templates.",
    term: "ASP.NET MVC, HTML5/CSS3, jQuery, C#",
    thumbnail: "/images/works/AKARI-nha.jpg",
    href: "https://akaricity.vn/",
  },
  {
    title: "Sugar Cane House Manager",
    company: "BSD SOLUTION",
    client: "TTC Group",
    role: "Back-end Developer (ASP.NET)",
    period: "Jan 2017 – May 2017",
    description: "A management product for TTC Group's sugar cane houses, built with ASP.NET and SQL Server.",
    term: "ASP.NET, C#, SQL Server",
    thumbnail: PLACEHOLDER,
    href: "#",
  },
  {
    title: "Viec Lam FPT Shop",
    company: "FPT Shop",
    role: "Back-end Developer (ASP.NET)",
    description: "Revamped the recruitment website and developed a new landing page.",
    term: "ASP.NET MVC, HTML5/CSS3, jQuery, Bootstrap, SQL Server",
    thumbnail: PLACEHOLDER,
    href: "https://vieclam.fptshop.com.vn",
  },
  {
    title: "Inside FPT Shop",
    company: "FPT Shop",
    role: "Back-end Developer (ASP.NET)",
    description:
      "Internal web portal built with ASP.NET MVC / WebForms and SQL Server, with a responsive Bootstrap & jQuery front-end.",
    term: "ASP.NET MVC, HTML5/CSS3, jQuery, Bootstrap, SQL Server",
    thumbnail: PLACEHOLDER,
    href: "https://inside.fptshop.com.vn",
  },
];

const awards = [
  {
    year: "2022",
    title: "Employee of the Year (Front end)",
    company: "GMO-Z.com Runsystem",
  },
  {
    year: "2023",
    title: "Key Frontend Developer on a “Best Project of the Year”",
    company: "GMO-Z.com Runsystem",
  },
];

const YEARS_OF_EXPERIENCE = 5;

export const cvConfig = {
  title: "Nguyen Hoang Duy",
  name: "Nguyen Hoang Duy",
  headline: "Frontend Developer | React / Next.js / Vue",
  description:
    "Frontend Engineer with 5+ years of experience building scalable, high-performance web applications for Japanese clients. Specialized in React, Next.js and Vue.",
  about:
    "Frontend Engineer with 5+ years of experience building scalable, high-performance web applications for Japanese clients. Specialized in React, Next.js, and Vue ecosystems, with a strong focus on performance optimization, reusable architecture, and pixel-perfect UI/UX. Proven track record in delivering production-grade systems and contributing to award-winning projects.",
  /** Short intro under the name in the hero. */
  heroLead:
    "I build scalable, high-performance web applications for Japanese clients — with a strong focus on performance, reusable architecture and pixel-perfect UI/UX.",
  /** Rotating words in the hero typewriter (the first one is also used as the job title). */
  mainJob: ["Frontend Developer", "React · Next.js · Vue Engineer", "Pixel-perfect UI/UX builder"],
  cvDownloadLink: "/Nguyen-Hoang-Duy.pdf",
  /** Self-assessed proficiency, shown as level meters. */
  skills: [
    { name: "JavaScript (ES6+) / TypeScript", value: 95 },
    { name: "React / Next.js", value: 85 },
    { name: "Vue.js / Nuxt.js", value: 95 },
    { name: "HTML5 / CSS3 / SCSS", value: 95 },
    { name: "Tailwind CSS / UI libraries", value: 90 },
    { name: "Testing (Jest, RTL, Cypress, Vitest)", value: 80 },
  ],
  /** Full toolbox, grouped like the CV. */
  skillGroups: [
    { title: "Languages & Core", items: ["JavaScript (ES6+)", "TypeScript", "HTML5", "CSS3"] },
    { title: "Frameworks & Libraries", items: ["React", "Next.js", "Vue.js", "Nuxt.js", "Node.js (basic)"] },
    {
      title: "State & Data",
      items: ["Redux Toolkit", "RxJS", "Vuex", "React Hook Form", "Axios", "RESTful API", "GraphQL"],
    },
    {
      title: "UI / Styling",
      items: ["Tailwind CSS", "SCSS / SASS", "Bootstrap", "Vuetify", "Ant Design", "Chakra UI"],
    },
    { title: "Testing", items: ["Jest", "React Testing Library", "Cypress", "Vitest", "Appium", "CodeceptJS"] },
    { title: "Tools & Platforms", items: ["Git", "Vite", "Firebase", "Vercel", "Netlify", "GitLab CI/CD"] },
  ],
  softSkills: ["Teamwork", "Problem-solving", "Time management", "Agile / Scrum"],
  languages: [
    { name: "Vietnamese", level: "Native" },
    { name: "English", level: "Intermediate — working proficiency" },
  ],
  facts: [
    { icon: "icon-fire", name: "Years of experience", count: YEARS_OF_EXPERIENCE, suffix: "+" },
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
  services: [
    {
      icon: "code",
      color: "#34d399",
      name: "Web App Development",
      description:
        "Scalable, production-grade web applications with React, Next.js, Vue and Nuxt — built on a reusable, maintainable component architecture.",
    },
    {
      icon: "layout",
      color: "#22d3ee",
      name: "Pixel-perfect UI/UX",
      description:
        "Turning Figma designs into responsive, polished interfaces with Tailwind CSS, SCSS and UI libraries such as Vuetify, Ant Design and Chakra UI.",
    },
    {
      icon: "speed",
      color: "#a78bfa",
      name: "Performance Optimization",
      description:
        "Improving page-load and interaction speed across large-scale production apps for a smoother, faster user experience.",
    },
    {
      icon: "shield",
      color: "#f472b6",
      name: "Testing & Teamwork",
      description:
        "Reliable releases with Jest, React Testing Library, Cypress and Vitest — working closely with backend, QA and designers in Agile/Scrum teams.",
    },
  ],
  experience: {
    education: [
      {
        time: "Sep 2013 – Nov 2017",
        title: "Ho Chi Minh University of Science — Vietnam National University",
        description: "Software Engineer",
        location: "Ho Chi Minh City, Vietnam",
      },
    ],
    work: [
      {
        time: "Jun 2019 – Present",
        title: "Front-end Developer",
        company: GMO,
        description:
          "Working with Japanese enterprise clients to deliver scalable frontend solutions across media, real estate, fintech and education.",
        clients: ["NHK", "Chintai", "Fintech", "Brewus Group"],
        highlights: [
          "Developed and maintained high-quality web applications using React, Next.js and Vue ecosystems",
          "Collaborated with cross-functional teams (backend, QA, designers) in Agile environments",
          "Optimized application performance and improved user experience across multiple large-scale projects",
          "Employee of the Year 2022 (Front end) and key developer on a “Best Project of the Year” (2023)",
        ],
        tags: ["React", "Next.js", "Vue 3", "Nuxt", "TypeScript", "Tailwind CSS"],
      },
      {
        time: "Jun 2017 – Apr 2019",
        title: "Front-end & Back-end Developer",
        company: "TQ Design",
        description: "Maintained and developed responsive websites for real estate and hospitality brands.",
        highlights: [
          "Built responsive websites using HTML5, CSS3, Bootstrap 4 and jQuery",
          "Converted PSD designs into high-quality HTML/CSS templates ensuring pixel-perfect accuracy",
          "Supported backend development with C# (ASP.NET) and CMS management",
        ],
        tags: ["HTML5", "CSS3", "Bootstrap 4", "jQuery", "ASP.NET", "C#"],
      },
      {
        time: "Jan 2017 – May 2017",
        title: "Back-end Developer (ASP.NET)",
        company: "BSD SOLUTION",
        description: "Developed the Sugar Cane House Manager product for TTC Group.",
        tags: ["ASP.NET", "C#", "SQL Server"],
      },
      {
        time: "Mar 2016 – Jan 2017",
        title: "Back-end Developer (ASP.NET)",
        company: "FPT Shop",
        description:
          "Developed MVC / WebForms web applications backed by SQL Server, with responsive front-ends built on Bootstrap, HTML5/CSS3 and jQuery.",
        links: [
          {
            label: "vieclam.fptshop.com.vn",
            href: "https://vieclam.fptshop.com.vn",
            note: "revamped website & new landing page",
          },
          { label: "inside.fptshop.com.vn", href: "https://inside.fptshop.com.vn" },
        ],
        tags: ["ASP.NET MVC", "SQL Server", "Bootstrap", "jQuery"],
      },
    ] as Job[],
  },
  works,
};
