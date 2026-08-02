"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import { isSupabaseConfigured } from "@/lib/supabase";

interface GuideItem {
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

const ITEMS_PER_PAGE = 20;

function GuiasContent() {
  const searchParams = useSearchParams();
  const activeSlug = searchParams.get("slug");

  const [guides, setGuides] = useState<GuideItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [articleDetail, setArticleDetail] = useState<GuideItem | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // Estados do Carrossel de Destaques
  const [carouselIndex, setCarouselIndex] = useState(0);

  // Estados de Paginação
  const [currentPage, setCurrentPage] = useState(1);

  // Carrega a lista completa de guias
  useEffect(() => {
    const fetchGuides = async () => {
      try {
        if (isSupabaseConfigured) {
          const { supabase } = await import("@/lib/supabase");
          const { data, error } = await supabase
            .from("articles")
            .select("*")
            .eq("type", "guia")
            .eq("status", "public")
            .order("created_at", { ascending: false });

          if (data) {
            const published = data.filter((item: any) =>
              !item.scheduled_at || new Date(item.scheduled_at).getTime() <= Date.now()
            );

            setGuides(
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
                category: item.category || "Guias",
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
                item.type === "guia" &&
                item.status === "public" &&
                (!item.scheduled_at || new Date(item.scheduled_at).getTime() <= Date.now())
            );
            setGuides(
              published.map((item) => ({
                id: item.id || Math.random().toString(),
                title: item.title,
                summary: item.summary,
                slug: item.slug,
                date: "Hoje",
                readTime: "5 min de leitura",
                category: item.category || "Guias",
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
        console.error("Erro ao carregar guias:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGuides();
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
            .eq("type", "guia")
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
              category: data.category || "Guias",
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
            const found = list.find((a) => a.slug === activeSlug && a.type === "guia");
            if (found) {
              setArticleDetail({
                id: found.id || "local",
                title: found.title,
                summary: found.summary,
                slug: found.slug,
                date: "Recentemente",
                readTime: "5 min de leitura",
                category: found.category || "Guias",
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
        console.error("Erro ao carregar detalhes do guia:", err);
      } finally {
        setDetailLoading(false);
      }
    };

    fetchDetail();
  }, [activeSlug]);

  // Artigos em destaque
  const featuredGuides = guides.filter((g) => g.isFeatured);

  // Paginação dos guias (ordenada por ordem decrescente, incluindo os em destaque também na lista!)
  const totalPages = Math.max(1, Math.ceil(guides.length / ITEMS_PER_PAGE));
  const currentGuidesList = guides.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* MODO DE LEITURA DO GUIA ESPECÍFICO */}
      {activeSlug ? (
        <div className="max-w-4xl mx-auto">
          {detailLoading ? (
            <div className="flex justify-center items-center py-24">
              <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : !articleDetail ? (
            <div className="bg-[#101623]/95 border border-slate-800 rounded-3xl p-12 text-center space-y-4 shadow-2xl backdrop-blur-xl">
              <span className="text-4xl block">🔍</span>
              <h3 className="text-xl font-bold text-white">Guia Não Encontrado</h3>
              <p className="text-sm text-slate-400 max-w-md mx-auto">
                O artigo solicitado não existe ou foi removido.
              </p>
              <div className="pt-2">
                <Link
                  href="/guias"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white"
                >
                  ← Voltar para Guias
                </Link>
              </div>
            </div>
          ) : (
            <article className="bg-[#101623]/95 border border-slate-800 rounded-3xl p-6 sm:p-10 backdrop-blur-xl shadow-2xl space-y-8">
              
              {/* Breadcrumb e Badge */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
                <Link
                  href="/guias"
                  className="text-xs font-mono font-bold text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1.5"
                >
                  <span>←</span> <span>Base de Guias</span>
                </Link>

                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
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
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed border-l-4 border-cyan-400 pl-4 italic">
                  {articleDetail.summary}
                </p>
              </div>

              {/* Imagem de Capa do Artigo */}
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
                  [&_a]:text-cyan-400 [&_a]:underline [&_a]:font-bold [&_a]:hover:text-cyan-300
                  [&_img]:max-w-full [&_img]:rounded-2xl [&_img]:shadow-xl [&_img]:my-6 [&_img]:mx-auto [&_img]:block"
              />
            </article>
          )}
        </div>
      ) : (
        /* LISTAGEM DE TODOS OS GUIAS */
        <>
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/30 text-xs font-semibold text-cyan-400 mb-4">
              <span>📚 Base de Conhecimento</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white drop-shadow-md">
              Guias & <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-cyan-200">Tutoriais</span>
            </h1>
            <p className="mt-3 text-slate-300 drop-shadow-sm font-medium">
              Aprenda estratégias de evolução rápida, defesa de base e otimização de recursos no Last Asylum.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : guides.length === 0 ? (
            <div className="bg-[#101623]/95 border border-slate-800 rounded-3xl p-8 backdrop-blur-xl text-center space-y-4 shadow-2xl">
              <span className="text-4xl block">📖</span>
              <h3 className="text-xl font-bold text-white">Central de Guias em Breve</h3>
              <p className="text-sm text-slate-400 max-w-md mx-auto">
                Nenhum guia foi publicado no momento. Fique atento às atualizações do painel!
              </p>
            </div>
          ) : (
            <div className="space-y-12">
              
              {/* CARROSSEL DE DESTAQUES */}
              {featuredGuides.length > 0 && (
                <div className="group relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#101623]/90 via-[#101623]/75 to-slate-950/90 border border-cyan-500/20 shadow-2xl backdrop-blur-xl hover:border-cyan-400/40 transition-all duration-300">
                  
                  {featuredGuides.map((guide, idx) => {
                    if (idx !== carouselIndex) return null;
                    return (
                      <div key={guide.id} className="p-8 sm:p-12 flex flex-col md:flex-row gap-8 items-center">
                        
                        <div className="w-full md:w-1/2 aspect-[16/10] rounded-2xl bg-slate-900 border border-slate-850 relative overflow-hidden flex items-center justify-center">
                          {guide.image_url ? (
                            <img src={guide.image_url} alt={guide.title} className="w-full h-full object-cover" />
                          ) : (
                            <>
                              <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 via-transparent to-[#00ff88]/5"></div>
                              <div className="relative z-10 text-center">
                                <span className="text-5xl block mb-2">⭐</span>
                                <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold">
                                  Guia Recomendado
                                </span>
                                <h4 className="text-md font-bold text-white mt-1 leading-snug px-4">
                                  {guide.title}
                                </h4>
                              </div>
                            </>
                          )}
                        </div>

                        <div className="w-full md:w-1/2 space-y-4">
                          <div className="flex items-center gap-3">
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                              {guide.category}
                            </span>
                            <span className="text-xs font-mono text-slate-400">{guide.date}</span>
                            <span className="text-xs font-mono text-slate-500">• {guide.readTime}</span>
                          </div>

                          <h3 className="text-2xl sm:text-3xl font-extrabold text-white group-hover:text-cyan-400 transition-colors leading-tight">
                            {guide.title}
                          </h3>

                          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                            {guide.summary}
                          </p>

                          <div className="pt-2">
                            <Link
                              href={`/guias?slug=${guide.slug}`}
                              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-400 text-slate-950 font-bold text-sm shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:bg-cyan-300 transition-all transform hover:-translate-y-0.5"
                            >
                              <span>Ler Guia Completo</span>
                              <span>→</span>
                            </Link>
                          </div>
                        </div>

                      </div>
                    );
                  })}

                  {/* SETAS E DOTS DO CARROSSEL */}
                  {featuredGuides.length > 1 && (
                    <>
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-1.5 z-20">
                        {featuredGuides.map((_, dIdx) => (
                          <button
                            key={dIdx}
                            onClick={() => setCarouselIndex(dIdx)}
                            className={`w-2.5 h-2.5 rounded-full transition-all ${
                              carouselIndex === dIdx ? "bg-cyan-400 scale-110" : "bg-slate-700 hover:bg-slate-600"
                            }`}
                          />
                        ))}
                      </div>

                      <button
                        onClick={() => setCarouselIndex((prev) => (prev - 1 + featuredGuides.length) % featuredGuides.length)}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 w-9 h-9 rounded-full bg-slate-900/80 hover:bg-cyan-400 hover:text-slate-950 border border-slate-800 flex items-center justify-center text-white text-sm transition-all opacity-0 group-hover:opacity-100 z-20"
                      >
                        ◀
                      </button>

                      <button
                        onClick={() => setCarouselIndex((prev) => (prev + 1) % featuredGuides.length)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 w-9 h-9 rounded-full bg-slate-900/80 hover:bg-cyan-400 hover:text-slate-950 border border-slate-800 flex items-center justify-center text-white text-sm transition-all opacity-0 group-hover:opacity-100 z-20"
                      >
                        ▶
                      </button>
                    </>
                  )}

                </div>
              )}

              {/* LISTA GERAL DE GUIAS (PAGINADA) */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-white border-l-4 border-cyan-400 pl-3">Todos os Guias & Tutoriais</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {currentGuidesList.map((guide) => (
                    <article
                      key={guide.id}
                      className="flex flex-col justify-between rounded-2xl bg-[#101623]/80 border border-slate-800 hover:border-cyan-400/30 transition-all duration-300 group hover:-translate-y-1 shadow-lg backdrop-blur-md overflow-hidden"
                    >
                      {/* Imagem no topo do card fora dos destaques */}
                      {guide.image_url && (
                        <div className="aspect-[16/9] w-full overflow-hidden border-b border-slate-850">
                          <img src={guide.image_url} alt={guide.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                      )}

                      <div className="p-6 flex flex-col justify-between flex-1">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                              {guide.category}
                            </span>
                            <span className="text-[11px] font-mono text-slate-400">{guide.date}</span>
                          </div>

                          <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors leading-snug">
                            {guide.title}
                          </h3>

                          <p className="text-xs sm:text-sm text-slate-400 line-clamp-3 leading-relaxed">
                            {guide.summary}
                          </p>
                        </div>

                        <div className="pt-6 border-t border-slate-800/80 mt-6 flex items-center justify-between">
                          <span className="text-xs font-mono text-slate-500">{guide.readTime}</span>
                          <Link
                            href={`/guias?slug=${guide.slug}`}
                            className="text-xs font-bold text-cyan-400 group-hover:translate-x-1 transition-transform flex items-center gap-1"
                          >
                            <span>Estudar guia</span>
                            <span>→</span>
                          </Link>
                        </div>
                      </div>

                    </article>
                  ))}
                </div>

                {/* CONTROLES DE PAGINAÇÃO */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 pt-8 border-t border-slate-900/60 mt-10">
                    <button
                      onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 text-slate-400 hover:text-white border border-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      ◀ Anterior
                    </button>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`w-9 h-9 rounded-xl text-xs font-bold border transition-all ${
                          currentPage === page
                            ? "bg-cyan-400 text-slate-950 border-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.3)]"
                            : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white"
                        }`}
                      >
                        {page}
                      </button>
                    ))}

                    <button
                      onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 text-slate-400 hover:text-white border border-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Próxima ▶
                    </button>
                  </div>
                )}

              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}

export default function GuiasPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#080c14] flex items-center justify-center"><div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div></div>}>
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
            <GuiasContent />
          </main>
        </div>
      </div>
    </Suspense>
  );
}
