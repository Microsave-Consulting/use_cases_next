// src/app/page.js
import { readFileSync } from "fs";
import path from "path";
import MapPageClient from "@/components/MapPageClient";

export const metadata = {
  title: "Digital ID Use Cases | MSC",
  description:
    "Explore sectoral Digital ID use cases across countries of the world.",
};

function getData() {
  const useCases = JSON.parse(
    readFileSync(
      path.join(process.cwd(), "public/data/use_cases.json"),
      "utf-8",
    ),
  );
  const hackathons = JSON.parse(
    readFileSync(
      path.join(process.cwd(), "public/data/hackathons.json"),
      "utf-8",
    ),
  );
  return { useCases, hackathons };
}

export default function HomePage() {
  const { useCases, hackathons } = getData();
  return (
    <MapPageClient initialUseCases={useCases} initialHackathons={hackathons} />
  );
}
