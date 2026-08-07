import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Notícias, Atualizações e Patch Notes - Last Asylum BR",
  description: "Fique por dentro das últimas atualizações, patch notes oficiais, manutenções e eventos semanais de Last Asylum Plague.",
};

export default function NoticiasLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
