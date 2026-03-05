import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const BASE_URL = "https://mega-sena-stats.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Mega Sena Stats — Estatísticas e análises dos sorteios da Mega-Sena",
    template: "%s | Mega Sena Stats",
  },
  description:
    "Análise completa dos sorteios da Mega-Sena: números mais e menos sorteados, atrasados, frequência histórica, pares/ímpares, somatório e muito mais. Dados atualizados automaticamente após cada sorteio.",
  keywords: [
    "mega sena",
    "mega sena estatísticas",
    "números mais sorteados mega sena",
    "mega sena análise",
    "mega sena frequência",
    "dezenas atrasadas mega sena",
    "mega sena histórico",
    "loteria estatísticas",
    "mega sena resultado",
    "mega sena sugerir números",
  ],
  authors: [{ name: "Mega Sena Stats" }],
  creator: "Mega Sena Stats",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: BASE_URL,
    siteName: "Mega Sena Stats",
    title: "Mega Sena Stats — Estatísticas e análises dos sorteios da Mega-Sena",
    description:
      "Análise completa dos sorteios da Mega-Sena: números mais sorteados, atrasados, frequência histórica e muito mais. Dados atualizados automaticamente.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Mega Sena Stats — Estatísticas e análises dos sorteios",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mega Sena Stats — Estatísticas dos sorteios da Mega-Sena",
    description:
      "Análise completa dos sorteios da Mega-Sena: números mais sorteados, atrasados, frequência histórica e muito mais.",
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-9FQDZ100W3"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-9FQDZ100W3');
          `}
        </Script>
        <Script
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2041860930876012"
          crossOrigin="anonymous"
          strategy="beforeInteractive"
        />
      </head>
      <body className={`${geistSans.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
