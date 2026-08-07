import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Guias e Dicas de Sobrevivência - Last Asylum BR",
  description: "Encontre guias estratégicos, tutoriais de heróis, dicas de desenvolvimento de vilas e táticas de combate para Last Asylum Plague.",
};

export default function GuiasLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
