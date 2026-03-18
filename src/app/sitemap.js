// src/app/sitemap.js
import { readFileSync } from "fs";
import path from "path";

export default function sitemap() {
  const data = JSON.parse(
    readFileSync(
      path.join(process.cwd(), "public/data/use_cases.json"),
      "utf-8",
    ),
  );
  return [
    { url: "https://yoursite.com", priority: 1.0 },
    {
      url: "https://yoursite.com/library",
      priority: 0.9,
      changeFrequency: "daily",
    },
    ...data.map((uc) => ({
      url: `https://yoursite.com/use-cases/${uc.ID ?? uc.Id}`,
      lastModified: new Date(uc.Modified ?? Date.now()),
      changeFrequency: "weekly",
      priority: 0.8,
    })),
  ];
}
