import { MetadataRoute } from "next";
import { supabase } from "@/lib/supabase";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Substituir pelo domínio final do portal em produção
  const baseUrl = "https://lastasylum.com.br";

  // 1. Páginas estáticas estruturais
  const staticRoutes = [
    "",
    "/calculadoras",
    "/eventos",
    "/herois",
    "/guias",
    "/noticias",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  // 2. Artigos de Guias e Notícias gerados via banco
  let dynamicRoutes: any[] = [];
  try {
    const { data: articles } = await supabase
      .from("articles")
      .select("slug, type, created_at")
      .eq("status", "public");

    if (articles) {
      dynamicRoutes = articles.map((article) => {
        const folder = article.type === "guia" ? "guias" : "noticias";
        return {
          url: `${baseUrl}/${folder}/${article.slug}`,
          lastModified: new Date(article.created_at),
          changeFrequency: "weekly" as const,
          priority: 0.6,
        };
      });
    }
  } catch (err) {
    console.error("Erro ao gerar sitemap dinâmico:", err);
  }

  return [...staticRoutes, ...dynamicRoutes];
}
