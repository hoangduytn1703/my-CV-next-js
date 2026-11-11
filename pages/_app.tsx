import { AppCacheProvider } from "@mui/material-nextjs/v14-pagesRouter";
import { StyledEngineProvider, ThemeProvider } from "@mui/material/styles";
import "assets/styles/app.scss";
import theme from "config/theme";
import { MotionConfig } from "framer-motion";
import type { AppProps } from "next/app";
import { Inter, JetBrains_Mono, Syne } from "next/font/google";

const displayFont = Syne({ subsets: ["latin"], weight: ["500", "600", "700", "800"], display: "swap" });
const bodyFont = Inter({ subsets: ["latin"], display: "swap" });
const monoFont = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"], display: "swap" });

function MyApp(props: AppProps) {
  return (
    <AppCacheProvider {...props}>
      <style jsx global>{`
        :root {
          --font-display: ${displayFont.style.fontFamily};
          --font-body: ${bodyFont.style.fontFamily};
          --font-mono: ${monoFont.style.fontFamily};
        }
      `}</style>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          {/* Respect the OS "reduce motion" setting for every framer-motion animation */}
          <MotionConfig reducedMotion="user">
            <props.Component {...props.pageProps} />
          </MotionConfig>
        </ThemeProvider>
      </StyledEngineProvider>
    </AppCacheProvider>
  );
}

export default MyApp;
