import { content } from "config/content";

/** Site-wide settings. Editable parts (title, description, socials, location, footer) come from config/content.json. */
const config = {
  siteTitle: content.seo.siteTitle,
  siteDescription: content.seo.siteDescription,
  /** Canonical production URL (override with the PUBLIC_URL env var). */
  siteUrl: process.env.PUBLIC_URL || "https://hoangduy.info.vn",
  location: content.profile.location,
  siteRss: "/rss.xml",
  siteLang: "en",
  siteFBAppID: "2944501422238707",
  googleAnalyticsID: "UA-154318328-2",
  postDefaultCategoryID: "",
  adsClientId: "ca-pub-1932696824172910",
  userAvatar: "https://gravatar.com/avatar/cc508a89f5901e9f8e39a6ffee6f7319?size=300",
  socialLinks: content.socialLinks,
  copyright: content.seo.copyright,
};

export default config;
