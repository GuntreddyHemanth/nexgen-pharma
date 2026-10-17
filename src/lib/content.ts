import "server-only";
import { one, q, safe, getSetting } from "./db";
import { categories as staticCategories, type Category } from "./catalog";
import { services as staticServices, type Service } from "./services";
import { seedPosts } from "./seed-posts";

export async function getServices(): Promise<Service[]> {
  return safe(async () => {
    const rows = await q<{ data: Service }>(`select data from services order by sort, slug`);
    return rows.length ? rows.map((r) => r.data) : staticServices;
  }, staticServices);
}

export async function getService(slug: string) {
  return (await getServices()).find((s) => s.slug === slug);
}

export async function getCategories(): Promise<Category[]> {
  return safe(async () => {
    const cats = await q<{ slug: string; title: string; icon: Category["icon"]; summary: string }>(
      `select slug, title, icon, summary from categories order by sort, title`,
    );
    if (!cats.length) return staticCategories;
    const items = await q<{ id: string; category_slug: string; name: string; spec: string }>(
      `select id, category_slug, name, spec from items order by sort, name`,
    );
    return cats.map((c) => ({
      ...c,
      items: items.filter((i) => i.category_slug === c.slug).map(({ id, name, spec }) => ({ id, name, spec })),
    }));
  }, staticCategories);
}

export async function getCategory(slug: string) {
  return (await getCategories()).find((c) => c.slug === slug);
}

export type Post = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  published: boolean;
  published_at: string | null;
};

const staticPosts: Post[] = seedPosts.map((p, i) => ({
  ...p,
  id: i + 1,
  published: true,
  published_at: null,
}));

export async function getPosts(): Promise<Post[]> {
  return safe(
    () =>
      q<Post>(
        `select id, slug, title, excerpt, body, published, published_at from posts where published order by published_at desc nulls last, id desc`,
      ),
    staticPosts,
  );
}

export async function getPost(slug: string): Promise<Post | undefined> {
  return safe(
    () =>
      one<Post>(`select id, slug, title, excerpt, body, published, published_at from posts where slug = $1 and published`, [
        slug,
      ]),
    staticPosts.find((p) => p.slug === slug),
  );
}

export type MediaItem = { id: number; file_id: number; caption: string; category: string };

export async function getMedia(kind: "gallery" | "logo"): Promise<MediaItem[]> {
  return safe(
    () =>
      q<MediaItem>(`select id, file_id, caption, category from media where kind = $1 order by sort, id desc`, [kind]),
    [],
  );
}

export type Testimonial = { id: number; quote: string; name: string; role: string; company: string };

export async function getTestimonials(): Promise<Testimonial[]> {
  return safe(
    () =>
      q<Testimonial>(`select id, quote, name, role, company from testimonials where published order by sort, id desc`),
    [],
  );
}

export async function hasCatalogue() {
  return safe(async () => !!(await getSetting("catalogue_file_id")), false);
}
