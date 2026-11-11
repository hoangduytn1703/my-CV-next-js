import Background from "components/fx/Background";
import { IntroProvider } from "components/fx/Intro";
import TechMarquee from "components/fx/Marquee";
import { BackToTop, ScrollProgress } from "components/fx/ScrollProgress";
import { SmoothScroll } from "components/fx/SmoothScroll";
import Footer from "components/layout/Footer";
import Navbar from "components/layout/Navbar";
import About from "components/sections/About";
import Contact from "components/sections/Contact";
import Experience from "components/sections/Experience";
import Hero from "components/sections/Hero";
import Services from "components/sections/Services";
import Works from "components/sections/Works";
import { cvConfig } from "config/cv";
import config from "config/site";
import dynamic from "next/dynamic";
import Head from "next/head";

// Pointer-only effect, nothing to render on the server.
const Cursor = dynamic(() => import("components/fx/Cursor"), { ssr: false });

const pageTitle = `${cvConfig.name} — ${config.siteTitle}`;
const ogImage = `${config.siteUrl}/images/cv-thumbnail.jpg`;

// Structured data so search engines understand who this page is about.
const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: cvConfig.name,
  jobTitle: cvConfig.mainJob[0],
  description: cvConfig.description,
  url: config.siteUrl,
  image: ogImage,
  email: "mailto:hoangduytn1703@gmail.com",
  address: { "@type": "PostalAddress", addressLocality: "Ho Chi Minh City", addressCountry: "VN" },
  alumniOf: cvConfig.experience.education.map((e) => e.title),
  worksFor: { "@type": "Organization", name: cvConfig.experience.work[0].company },
  knowsAbout: cvConfig.skillGroups.flatMap((g) => g.items),
  sameAs: config.socialLinks.filter((l) => l.url.startsWith("http")).map((l) => l.url),
};

const CV = () => (
  <>
    <Head>
      <title>{pageTitle}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <meta name="description" content={config.siteDescription} />
      <link rel="canonical" href={config.siteUrl} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={cvConfig.description} />
      <meta property="og:type" content="profile" />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={config.siteUrl} />
      <meta property="fb:app_id" content={config.siteFBAppID} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={cvConfig.description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="image" content={ogImage} />
      <meta name="author" content={cvConfig.name} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }} />
    </Head>

    <SmoothScroll>
      <IntroProvider>
        <Background />
        <ScrollProgress />
        <Cursor />
        <Navbar />
        <main>
          <Hero />
          <TechMarquee />
          <About />
          <Services />
          <Experience />
          <Works />
          <Contact />
        </main>
        <Footer />
        <BackToTop />
      </IntroProvider>
    </SmoothScroll>
  </>
);

export default CV;
