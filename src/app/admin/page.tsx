"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import AdminLogin from "@/components/AdminLogin";
import AdminDashboard from "@/components/AdminDashboard";
import { getSavedSession, UserSession } from "@/lib/auth";

export default function AdminPage() {
  const [session, setSession] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = getSavedSession();
    if (saved) {
      setSession(saved);
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080c14] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#00ff88] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col bg-[#080c14] text-slate-100 selection:bg-[#00ff88] selection:text-slate-950 overflow-x-hidden">
      
      {/* BACKGROUND FIXO DA VILA */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Image
          src="/images/village_banner_2.png"
          alt="Background Fixo da Vila"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-65 scale-105"
        />
        <div className="absolute inset-0 bg-[#080c14]/40 backdrop-blur-[2px]"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#080c14]/80 via-transparent to-[#080c14]/90"></div>
      </div>

      {/* CONTEÚDO DA PÁGINA (SESSÃO OU FORMULÁRIO DE LOGIN) */}
      <div className="relative z-10 flex-1 flex flex-col justify-center py-12">
        {session ? (
          <AdminDashboard session={session} onLogout={() => setSession(null)} />
        ) : (
          <AdminLogin onSuccess={(newSession) => setSession(newSession)} />
        )}
      </div>
    </div>
  );
}
