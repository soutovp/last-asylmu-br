import { createClient } from "@supabase/supabase-js";

// CHAVES DE CONFIGURAÇÃO DO SUPABASE OBTIDAS DAS VARIÁVEIS DE AMBIENTE
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-project.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

// VERIFICAÇÃO SE O SUPABASE REAL ESTÁ CONFIGURADO
export const isSupabaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// CLIENTE SUPABASE
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
