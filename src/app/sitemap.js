// src/app/sitemap.js
import { readFileSync } from "fs";
import path from "path";

export const dynamic = "force-static";

const BASE_URL = "https://microsave-consulting.github.io/use_cases_next";

export default function sitemap() {
  const data = JSON.parse(
    readFileSync(
      path.join(process.cwd(), "public/data/use_cases.json"),
      "utf-8",
    ),
  );
  return [
    { url: BASE_URL, priority: 1.0 },
    {
      url: `${BASE_URL}/library`,
      priority: 0.9,
      changeFrequency: "daily",
    },
    ...data.map((uc) => ({
      url: `${BASE_URL}/use-cases/${uc.ID ?? uc.Id}`,
      lastModified: new Date(uc.Modified ?? Date.now()),
      changeFrequency: "weekly",
      priority: 0.8,
    })),
  ];
}
