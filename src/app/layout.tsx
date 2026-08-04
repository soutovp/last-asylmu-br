import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://lastasylum.com.br"),
  title: "Last Asylum BR - Guias, Calculadoras e Novidades",
  description: "Comunidade brasileira de Last Asylum. Guias de sobrevivência, calculadoras de recursos, patch notes e atualizações oficiais.",
  icons: {
    icon: "/images/icon-last-asylum-br.png",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* Google Tag (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-264NWJWX1W"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-264NWJWX1W');
          `}
        </Script>
        {children}
      </body>
    </html>
  );
}
