"use client";

import { useEffect } from "react";
import { isSupabaseConfigured } from "@/lib/supabase";

export default function ViewCounterTrigger({ articleId }: { articleId: string }) {
  useEffect(() => {
    if (!articleId) return;

    const key = "la_viewed_articles";
    let viewed: string[] = [];
    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        viewed = JSON.parse(stored);
      }
    } catch (e) {
      console.error(e);
    }

    // Se o artigo ID já estiver na lista, impede nova chamada para evitar duplicidade
    if (viewed.includes(articleId)) {
      return;
    }

    const increment = async () => {
      try {
        if (isSupabaseConfigured) {
          const { supabase } = await import("@/lib/supabase");
          
          // Chama a RPC atômica criada no banco
          await supabase.rpc("increment_views", { article_id: articleId });
          
          // Adiciona no LocalStorage
          viewed.push(articleId);
          localStorage.setItem(key, JSON.stringify(viewed));
        }
      } catch (err) {
        console.error("Erro ao registrar visualização:", err);
      }
    };

    increment();
  }, [articleId]);

  return null;
}
