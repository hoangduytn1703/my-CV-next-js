import { DocumentHeadTags, DocumentHeadTagsProps, documentGetInitialProps } from "@mui/material-nextjs/v14-pagesRouter";
import { THEME_MODE_STORAGE_KEY } from "constants/app";
import { Head, Html, Main, NextScript } from "next/document";

// Runs before first paint so the saved theme never flashes. Dark is the default.
const themeScript = `(function(){try{var t=localStorage.getItem("${THEME_MODE_STORAGE_KEY}");if(t&&t.charAt(0)==='"')t=JSON.parse(t);document.documentElement.setAttribute("data-theme",t==="light"?"light":"dark")}catch(e){}})();`;

export default function MyDocument(props: DocumentHeadTagsProps) {
  return (
    <Html lang="en" data-theme="dark">
      <Head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <meta name="theme-color" content="#07080d" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/logo192.png" />

        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/android-chrome-192x192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/android-chrome-512x512.png" />
        <link rel="icon" href="/favicon.ico" />
        <DocumentHeadTags {...props} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

MyDocument.getInitialProps = documentGetInitialProps;
