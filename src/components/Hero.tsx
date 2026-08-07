"use client";

import Image from "next/image";
import FloatingNavbar from "@/components/FloatingNavbar";

export default function Hero() {
  return (
    <section className="relative w-full overflow-hidden bg-[#080c14]">
      {/* FULL WIDTH HEADER BANNER CONTAINER */}
      <div className="relative w-full min-h-[480px] sm:min-h-[580px] lg:min-h-[660px] flex flex-col justify-between pt-8">
        
        {/* VILA BACKGROUND IMAGE FULL WIDTH */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/village_banner_2.webp"
            alt="Visão Ilustrada Oficial da Vila de Last Asylum Plague"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center scale-105"
          />

          {/* GRADIENT MASK BLENDING SEAMLESSLY INTO SITE BACKGROUND */}
          <div className="absolute top-0 inset-x-0 h-28 bg-gradient-to-b from-[#080c14]/80 via-[#080c14]/20 to-transparent z-10 pointer-events-none"></div>
          <div className="absolute inset-y-0 left-0 w-24 sm:w-48 bg-gradient-to-r from-[#080c14] to-transparent z-10 pointer-events-none"></div>
          <div className="absolute inset-y-0 right-0 w-24 sm:w-48 bg-gradient-to-l from-[#080c14] to-transparent z-10 pointer-events-none"></div>
          <div className="absolute bottom-0 inset-x-0 h-64 bg-gradient-to-t from-[#080c14] via-[#080c14]/85 to-transparent z-10 pointer-events-none"></div>
        </div>

        {/* TÍTULO NO BANNER COM LOGO 'LAST ASYLUM BR' (BR ELEVADO) */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 text-center w-full">
          <h1 className="flex justify-center mb-4">
            <Image 
              src="/images/last-asylum-br-logo.webp" 
              alt="Last Asylum BR - Portal de Calculadoras e Guias de Last Asylum Plague" 
              width={400}
              height={250}
              priority
              className="h-[150px] md:h-[250px] w-auto object-contain drop-shadow-[0_4px_25px_rgba(0,255,136,0.25)] animate-in zoom-in duration-300"
            />
          </h1>

          <p className="mt-3 text-base sm:text-lg text-slate-300 font-medium max-w-2xl mx-auto drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
            O hub definitivo de calculadoras, eventos e guias estratégicos para a comunidade brasileira.
          </p>
        </div>

        {/* BARRA FLUTUANTE DE NAVEGAÇÃO NO FINAL DO BANNER */}
        <div className="pb-6 sm:pb-8 w-full">
          <FloatingNavbar />
        </div>
      </div>
    </section>
  );
}

