"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import { isSupabaseConfigured } from "@/lib/supabase";

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  slug: string;
  date: string;
  readTime: string;
  category: string;
  isFeatured: boolean;
  content?: string;
  seo_title?: string;
  seo_description?: string;
  image_url?: string;
}

function NoticiasContent() {
  const searchParams = useSearchParams();
  const activeSlug = searchParams.get("slug");

  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [articleDetail, setArticleDetail] = useState<NewsItem | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // Carrega a lista completa de notícias
  useEffect(() => {
    const fetchNews = async () => {
      try {
        if (isSupabaseConfigured) {
          const { supabase } = await import("@/lib/supabase");
          const { data, error } = await supabase
            .from("articles")
            .select("*")
            .eq("type", "noticia")
            .eq("status", "public")
            .order("created_at", { ascending: false });

          if (data) {
            const published = data.filter((item: any) =>
              !item.scheduled_at || new Date(item.scheduled_at).getTime() <= Date.now()
            );

            setNews(
              published.map((item: any) => ({
                id: item.id,
                title: item.title,
                summary: item.summary,
                slug: item.slug,
                date: new Date(item.created_at).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                }),
                readTime: `${Math.max(2, Math.ceil(item.content.length / 800))} min de leitura`,
                category: item.category || "Atualizações",
                isFeatured: item.is_featured || false,
                content: item.content,
                seo_title: item.seo_title,
                seo_description: item.seo_description,
                image_url: item.image_url,
              }))
            );
          }
        } else {
          // Fallback Local Storage
          const stored = localStorage.getItem("local_articles");
          if (stored) {
            const list = JSON.parse(stored) as any[];
            const published = list.filter(
              (item) =>
                item.type === "noticia" &&
                item.status === "public" &&
                (!item.scheduled_at || new Date(item.scheduled_at).getTime() <= Date.now())
            );
            setNews(
              published.map((item) => ({
                id: item.id || Math.random().toString(),
                title: item.title,
                summary: item.summary,
                slug: item.slug,
                date: "Hoje",
                readTime: "3 min de leitura",
                category: item.category || "Atualizações",
                isFeatured: item.is_featured || false,
                content: item.content,
                seo_title: item.seo_title,
                seo_description: item.seo_description,
                image_url: item.image_url,
              }))
            );
          }
        }
      } catch (err) {
        console.error("Erro ao carregar notícias:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [activeSlug]);

  // Carrega o artigo específico caso um slug esteja ativo
  useEffect(() => {
    if (!activeSlug) {
      setArticleDetail(null);
      return;
    }

    const fetchDetail = async () => {
      setDetailLoading(true);
      try {
        if (isSupabaseConfigured) {
          const { supabase } = await import("@/lib/supabase");
          const { data, error } = await supabase
            .from("articles")
            .select("*")
            .eq("slug", activeSlug)
            .eq("type", "noticia")
            .single();

          if (data) {
            setArticleDetail({
              id: data.id,
              title: data.title,
              summary: data.summary,
              slug: data.slug,
              date: new Date(data.created_at).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              }),
              readTime: `${Math.max(2, Math.ceil(data.content.length / 800))} min de leitura`,
              category: data.category || "Atualizações",
              isFeatured: data.is_featured || false,
              content: data.content,
              seo_title: data.seo_title,
              seo_description: data.seo_description,
              image_url: data.image_url,
            });
            if (data.seo_title || data.title) {
              document.title = `${data.seo_title || data.title} - Last Asylum BR`;
            }
          }
        } else {
          // Fallback Local Storage
          const stored = localStorage.getItem("local_articles");
          if (stored) {
            const list = JSON.parse(stored) as any[];
            const found = list.find((a) => a.slug === activeSlug && a.type === "noticia");
            if (found) {
              setArticleDetail({
                id: found.id || "local",
                title: found.title,
                summary: found.summary,
                slug: found.slug,
                date: "Recentemente",
                readTime: "3 min de leitura",
                category: found.category || "Atualizações",
                isFeatured: found.is_featured || false,
                content: found.content,
                seo_title: found.seo_title,
                seo_description: found.seo_description,
                image_url: found.image_url,
              });
              document.title = `${found.seo_title || found.title} - Last Asylum BR`;
            }
          }
        }
      } catch (err) {
        console.error("Erro ao carregar detalhes da notícia:", err);
      } finally {
        setDetailLoading(false);
      }
    };

    fetchDetail();
  }, [activeSlug]);

  return (
    <>
      {/* MODO DE LEITURA DA NOTÍCIA ESPECÍFICA */}
      {activeSlug ? (
        <div className="max-w-4xl mx-auto">
          {detailLoading ? (
            <div className="flex justify-center items-center py-24">
              <div className="w-12 h-12 border-4 border-[#00ff88] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : !articleDetail ? (
            <div className="bg-[#101623]/95 border border-slate-800 rounded-3xl p-12 text-center space-y-4 shadow-2xl backdrop-blur-xl">
              <span className="text-4xl block">🔍</span>
              <h3 className="text-xl font-bold text-white">Notícia Não Encontrada</h3>
              <p className="text-sm text-slate-400 max-w-md mx-auto">
                O artigo solicitado não existe ou foi removido.
              </p>
              <div className="pt-2">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white"
                >
                  ← Voltar para Início
                </Link>
              </div>
            </div>
          ) : (
            <article className="bg-[#101623]/95 border border-slate-800 rounded-3xl p-6 sm:p-10 backdrop-blur-xl shadow-2xl space-y-8">
              
              {/* Breadcrumb e Badge */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
                <Link
                  href="/"
                  className="text-xs font-mono font-bold text-[#00ff88] hover:text-[#15ff96] transition-colors flex items-center gap-1.5"
                >
                  <span>←</span> <span>Página Inicial</span>
                </Link>

                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#00ff88]/10 text-[#00ff88] border border-[#00ff88]/20">
                    {articleDetail.category}
                  </span>
                  <span className="text-xs font-mono text-slate-400">{articleDetail.date}</span>
                </div>
              </div>

              {/* Título & Resumo */}
              <div className="space-y-4">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                  {articleDetail.title}
                </h1>
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed border-l-4 border-[#00ff88] pl-4 italic">
                  {articleDetail.summary}
                </p>
              </div>

              {/* Capa da Notícia */}
              {articleDetail.image_url && (
                <div className="w-full aspect-[21/9] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl relative">
                  <img src={articleDetail.image_url} alt={articleDetail.title} className="w-full h-full object-cover" />
                </div>
              )}

              {/* Conteúdo Renderizado */}
              <div 
                dangerouslySetInnerHTML={{ __html: articleDetail.content || "" }} 
                className="prose prose-invert max-w-none text-slate-200 leading-relaxed text-sm sm:text-base border-t border-slate-800/80 pt-6
                  [&_h2]:text-2xl [&_h2]:font-extrabold [&_h2]:text-white [&_h2]:mt-8 [&_h2]:mb-4
                  [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-slate-200 [&_h3]:mt-6 [&_h3]:mb-3
                  [&_p]:mb-4 [&_p]:leading-relaxed
                  [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4
                  [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4
                  [&_a]:text-[#00ff88] [&_a]:underline [&_a]:font-bold [&_a]:hover:text-[#15ff96]
                  [&_img]:max-w-full [&_img]:rounded-2xl [&_img]:shadow-xl [&_img]:my-6 [&_img]:mx-auto [&_img]:block"
              />
            </article>
          )}
        </div>
      ) : (
        /* LISTAGEM DE NOTÍCIAS COMPLEMENTAR */
        <>
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-[#00ff88]/30 text-xs font-semibold text-[#00ff88] mb-4">
              <span>📰 Central de Notícias</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white drop-shadow-md">
              Últimas <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00ff88] to-[#00e5ff]">Matérias</span>
            </h1>
            <p className="mt-3 text-slate-300 drop-shadow-sm font-medium">
              Confira todos os patch notes, comunicados oficiais e notas da desenvolvedora.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-12 h-12 border-4 border-[#00ff88] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : news.length === 0 ? (
            <div className="bg-[#101623]/95 border border-slate-800 rounded-3xl p-8 backdrop-blur-xl text-center space-y-4 shadow-2xl">
              <span className="text-4xl block">📰</span>
              <h3 className="text-xl font-bold text-white">Central de Notícias Vazia</h3>
              <p className="text-sm text-slate-400 max-w-md mx-auto">
                Nenhuma notícia publicada.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {news.map((item) => (
                <article
                  key={item.id}
                  className="flex flex-col justify-between p-6 rounded-2xl bg-[#101623]/80 border border-slate-800 hover:border-[#00ff88]/30 transition-all duration-300 group hover:-translate-y-1 shadow-lg backdrop-blur-md overflow-hidden"
                >
                  <div className="space-y-3">
                    {item.image_url && (
                      <div className="aspect-[16/9] rounded-xl overflow-hidden mb-3 border border-slate-850">
                        <img src={item.image_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-350" />
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-[#00ff88]/10 text-[#00ff88] border border-[#00ff88]/20">
                        {item.category}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">{item.date}</span>
                    </div>

                    <h3 className="text-lg font-bold text-white group-hover:text-[#00ff88] transition-colors leading-snug">
                      {item.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-400 line-clamp-3 leading-relaxed">
                      {item.summary}
                    </p>
                  </div>

                  <div className="pt-6 border-t border-slate-800/80 mt-6 flex items-center justify-between">
                    <span className="text-xs font-mono text-slate-500">{item.readTime}</span>
                    <Link
                      href={`/noticias?slug=${item.slug}`}
                      className="text-xs font-bold text-[#00ff88] group-hover:translate-x-1 transition-transform flex items-center gap-1"
                    >
                      <span>Ler matéria</span>
                      <span>→</span>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </>
      )}
    </>
  );
}

export default function NoticiasPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#080c14] flex items-center justify-center"><div className="w-12 h-12 border-4 border-[#00ff88] border-t-transparent rounded-full animate-spin"></div></div>}>
      <div className="relative min-h-screen flex flex-col bg-[#080c14] text-slate-100 selection:bg-[#00ff88] selection:text-slate-950 overflow-x-hidden">
        
        {/* BACKGROUND FIXO */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <Image
            src="/images/village_banner_2.png"
            alt="Background Vila"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center opacity-85 scale-105"
          />
          <div className="absolute inset-0 bg-[#080c14]/30 backdrop-blur-[1px]"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-[#080c14]/75 via-transparent to-[#080c14]/85"></div>
        </div>

        <div className="relative z-10 flex flex-col min-h-screen">
          <Header />
          <main className="flex-1 py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <NoticiasContent />
          </main>
        </div>
      </div>
    </Suspense>
  );
}
