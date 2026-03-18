// src/app/use-cases/[id]/page.js
import { readFileSync } from "fs";
import path from "path";
import { notFound } from "next/navigation";
import UseCaseDetailClient from "@/components/UseCaseDetailClient";

function getData() {
  return JSON.parse(
    readFileSync(
      path.join(process.cwd(), "public/data/use_cases.json"),
      "utf-8",
    ),
  );
}

export async function generateStaticParams() {
  return getData().map((uc) => ({ id: String(uc.ID ?? uc.Id) }));
}

export async function generateMetadata({ params }) {
  const { id } = await params; // ✅ Next.js 15: params is a Promise
  const uc = getData().find((item) => String(item.ID ?? item.Id) === id);
  if (!uc) return {};
  return {
    title: uc.Title,
    description: uc.Remarks?.slice(0, 160) ?? uc.Title,
    keywords: uc.KeyTerms ?? "",
    openGraph: {
      title: uc.Title,
      description: uc.Remarks?.slice(0, 160) ?? "",
      type: "article",
    },
  };
}

export default async function UseCasePage({ params }) {
  const { id } = await params; // ✅ Next.js 15: params is a Promise
  const uc = getData().find((item) => String(item.ID ?? item.Id) === id);
  if (!uc) notFound();
  return <UseCaseDetailClient useCase={uc} />;
}
