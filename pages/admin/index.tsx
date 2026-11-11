import { createTheme, ThemeProvider } from "@mui/material/styles";
import AdminApp from "components/admin/AdminApp";
import Head from "next/head";
import { useEffect } from "react";

const adminTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#34d399", contrastText: "#03130c" },
    secondary: { main: "#a78bfa" },
    background: { default: "#07080d", paper: "#0f121c" },
    divider: "rgba(255,255,255,0.09)",
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: "var(--font-body), system-ui, sans-serif",
    button: { textTransform: "none", fontWeight: 600 },
  },
  components: {
    MuiPaper: { styleOverrides: { root: { backgroundImage: "none" } } },
    MuiAccordion: {
      styleOverrides: {
        root: {
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 12,
          "&:before": { display: "none" },
        },
      },
    },
    MuiChip: { styleOverrides: { icon: { marginLeft: 8 } } },
  },
});

/** /admin — content manager (sign in, edit config/content.json, upload files, change password). */
const AdminPage = () => {
  // The panel is always dark, whatever theme the visitor picked on the site.
  useEffect(() => {
    document.documentElement.dataset.theme = "dark";
  }, []);

  return (
    <>
      <Head>
        <title>Content manager</title>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <ThemeProvider theme={adminTheme}>
        <AdminApp />
      </ThemeProvider>
    </>
  );
};

export default AdminPage;
