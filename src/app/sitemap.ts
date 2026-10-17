import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { getCategories, getPosts, getServices } from "@/lib/content";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [services, categories, posts] = await Promise.all([getServices(), getCategories(), getPosts()]);
  const now = new Date();
  const paths = [
    "",
    "/services",
    "/materials",
    "/capabilities",
    "/gallery",
    "/insights",
    "/about",
    "/contact",
    "/privacy",
    ...services.map((s) => `/services/${s.slug}`),
    ...categories.map((c) => `/materials/${c.slug}`),
    ...posts.map((p) => `/insights/${p.slug}`),
  ];
  return paths.map((p) => ({
    url: `${site.url}${p}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: p === "" ? 1 : p.split("/").length === 2 ? 0.8 : 0.6,
  }));
}
