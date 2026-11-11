module.exports = {
  siteUrl: process.env.PUBLIC_URL || "https://hoangduy.info.vn",
  generateRobotsTxt: true,
  sitemapSize: 1000,
  changefreq: "daily",
  priority: 0.7,
  exclude: ["/admin", "/admin/*"],
  robotsTxtOptions: { policies: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/api/"] }] },
};
