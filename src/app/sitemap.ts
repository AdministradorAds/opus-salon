import type { MetadataRoute } from "next";
import { readDb } from "@/lib/store";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const db = await readDb();
  const staticPages = [
    "",
    "/servicos",
    "/equipe",
    "/o-salao",
    "/galeria",
    "/contato",
    "/agendar",
    "/politica-de-privacidade",
    "/termos-de-uso",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
  }));

  const services = db.services
    .filter((s) => s.active)
    .map((s) => ({
      url: `${base}/servicos/${s.slug}`,
      lastModified: new Date(),
    }));

  return [...staticPages, ...services];
}
