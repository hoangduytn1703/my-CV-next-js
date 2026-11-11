import {
  siAntdesign,
  siAppium,
  siAxios,
  siBootstrap,
  siChakraui,
  siCodeceptjs,
  siCss,
  siCypress,
  siDotnet,
  siFirebase,
  siGit,
  siGitlab,
  siGraphql,
  siHtml5,
  siJavascript,
  siJest,
  siJquery,
  siNestjs,
  siNetlify,
  siNextdotjs,
  siNodedotjs,
  siNuxt,
  siPlaycanvas,
  siReact,
  siReacthookform,
  siReactivex,
  siReactrouter,
  siRedux,
  siSass,
  siTailwindcss,
  siTestinglibrary,
  siTypescript,
  siVercel,
  siVite,
  siVitest,
  siVuedotjs,
  siVuetify,
} from "simple-icons";
import { cx } from "utils/common";

type SimpleIcon = typeof siReact;

// Order matters: more specific names first ("React Hook Form" before "React", "Vitest" before "Vite"…).
const RULES: [RegExp, SimpleIcon][] = [
  [/react hook form/i, siReacthookform],
  [/react router/i, siReactrouter],
  [/testing library|^rtl$/i, siTestinglibrary],
  [/redux/i, siRedux],
  [/next/i, siNextdotjs],
  [/react/i, siReact],
  [/nuxt/i, siNuxt],
  [/vuetify/i, siVuetify],
  [/vue/i, siVuedotjs],
  [/typescript/i, siTypescript],
  [/javascript/i, siJavascript],
  [/tailwind/i, siTailwindcss],
  [/scss|sass/i, siSass],
  [/bootstrap/i, siBootstrap],
  [/ant design/i, siAntdesign],
  [/chakra/i, siChakraui],
  [/jest/i, siJest],
  [/cypress/i, siCypress],
  [/vitest/i, siVitest],
  [/vite/i, siVite],
  [/appium/i, siAppium],
  [/codecept/i, siCodeceptjs],
  [/gitlab/i, siGitlab],
  [/^git$/i, siGit],
  [/firebase/i, siFirebase],
  [/vercel/i, siVercel],
  [/netlify/i, siNetlify],
  [/rxjs/i, siReactivex],
  [/axios/i, siAxios],
  [/graphql/i, siGraphql],
  [/html/i, siHtml5],
  [/^css/i, siCss],
  [/nest/i, siNestjs],
  [/asp\.net|\.net|c#/i, siDotnet],
  [/jquery/i, siJquery],
  [/node/i, siNodedotjs],
  [/playcanvas/i, siPlaycanvas],
];

const findIcon = (name: string) => RULES.find(([re]) => re.test(name))?.[1];

/** Brand colours that would vanish on a dark background (Next.js, Vercel…) fall back to currentColor. */
const isDark = (hex: string) => {
  const n = parseInt(hex, 16);

  return (0.299 * ((n >> 16) & 255) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255 < 0.25;
};

/** Brand logo for a technology name, or nothing if we don't know it. */
export const TechIcon = ({ name, mono, className }: { name: string; mono?: boolean; className?: string }) => {
  const icon = findIcon(name);
  if (!icon) return null;

  return (
    <svg
      viewBox="0 0 24 24"
      className={cx("tech-icon", className)}
      fill={mono || isDark(icon.hex) ? "currentColor" : `#${icon.hex}`}
      aria-hidden
    >
      <path d={icon.path} />
    </svg>
  );
};

/** Icon + name, for chips and tags. */
export const TechLabel = ({ name, mono }: { name: string; mono?: boolean }) => (
  <>
    <TechIcon name={name} mono={mono} />
    {name}
  </>
);
