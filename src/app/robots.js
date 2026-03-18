// src/app/robots.js
export const dynamic = "force-static";

export default function robots() {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://microsave-consulting.github.io/use_cases_next/sitemap.xml",
  };
}
