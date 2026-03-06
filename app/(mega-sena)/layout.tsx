import Script from "next/script";
import { getStats } from "@/lib/stats";
import NumberBall from "@/components/NumberBall";
import Sidebar from "@/components/Sidebar";
import AdUnit from "@/components/AdUnit";

export default async function MegaSenaLayout({ children }: { children: React.ReactNode }) {
  const stats = await getStats();
  const { meta } = stats;

  return (
    <main className="min-h-screen bg-white text-[#1a1a2e]">
      {/* AdSense — carrega apenas em páginas com conteúdo */}
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2041860930876012"
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />
      {/* Header */}
      <header className="bg-[#005CA9] text-white">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Mega Sena</h1>
              <p className="text-blue-200 mt-1 text-sm">
                Analise {meta.total_concursos} sorteios e monte sua aposta com inteligência
              </p>
              <p className="text-blue-300 mt-0.5 text-xs">
                Atualizado em {meta.ultima_data}
              </p>
            </div>
            <div className="flex flex-col items-start md:items-end gap-1">
              <p className="text-blue-200 text-xs font-medium uppercase tracking-wide">
                Último sorteio · #{meta.ultimo_concurso}
              </p>
              {/* Mobile: bolinhas menores */}
              <div className="flex gap-1.5 md:hidden">
                {meta.ultimas_dezenas.map((n: string) => (
                  <NumberBall key={n} number={parseInt(n)} size="sm" />
                ))}
              </div>
              {/* Desktop: bolinhas grandes */}
              <div className="hidden md:flex gap-2">
                {meta.ultimas_dezenas.map((n: string) => (
                  <NumberBall key={n} number={parseInt(n)} size="lg" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Spot 1 — Entre header e conteúdo (maior RPM) */}
      <div className="max-w-6xl mx-auto px-4 pt-4">
        <AdUnit slot="9934893126" />
      </div>

      {/* Layout: Sidebar + Conteúdo */}
      <div className="max-w-6xl mx-auto px-4 py-6 md:py-8 flex flex-col md:flex-row gap-6 md:gap-8 items-start">
        <Sidebar />
        <div className="flex-1 min-w-0">
          {children}

          {/* Spot 3 — Antes do footer */}
          <AdUnit slot="1342087234" />

          <footer className="text-center text-slate-300 text-xs pt-6 pb-4 border-t border-slate-100 mt-4">
            Dados da Caixa Econômica Federal · Atualizado automaticamente · Desenvolvido com ❤️
          </footer>
        </div>
      </div>
    </main>
  );
}
