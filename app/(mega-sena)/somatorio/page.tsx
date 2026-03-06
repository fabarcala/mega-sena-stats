import { Metadata } from "next";
import Link from "next/link";
import { getStats } from "@/lib/stats";

export const metadata: Metadata = {
  title: "Somatório das Dezenas da Mega-Sena — Qual Faixa Sai Mais? | Mega Sena Stats",
  description: "Qual é a soma mais comum das 6 dezenas sorteadas na Mega-Sena? Histograma completo do somatório em todos os concursos. Descubra a faixa ideal para sua aposta.",
};

export default async function SomatorioPage() {
  const stats = await getStats();
  const { somatorio, meta } = stats;

  const dist = somatorio.distribuicao as { faixa: string; count: number }[];
  const max = Math.max(...dist.map(d => d.count));
  const total = meta.total_concursos;

  return (
    <section>
      {/* Banner CTA */}
      <Link
        href="/sugerir-numeros"
        className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl p-4 mb-6 hover:bg-green-100 transition"
      >
        <span className="text-2xl">🎯</span>
        <div>
          <p className="font-semibold text-green-800">Monte sua aposta baseada em estatísticas</p>
          <p className="text-sm text-green-600">Filtre pelo somatório ideal e gere uma combinação inédita →</p>
        </div>
      </Link>

      <h2 className="text-xl font-bold text-[#1a1a2e] mb-2">Somatório das dezenas sorteadas</h2>
      <p className="text-slate-400 text-sm mb-8">
        A soma das 6 dezenas varia de <strong className="text-[#1a1a2e]">{somatorio.minimo}</strong> a{" "}
        <strong className="text-[#1a1a2e]">{somatorio.maximo}</strong>, com média de{" "}
        <strong className="text-[#005CA9]">{somatorio.media}</strong>. A distribuição forma uma curva em sino.
      </p>

      {/* Histograma */}
      <div className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm">
        <div className="flex items-end justify-center gap-2 h-48">
          {dist.map((item) => {
            const heightPct = max > 0 ? (item.count / max) * 100 : 0;
            const isMode = item.count === max;
            return (
              <div key={item.faixa} className="flex flex-col items-center gap-1 flex-1 min-w-0">
                <span className="text-xs font-semibold text-slate-600 text-center" style={{ fontSize: "10px" }}>
                  {item.count > 0 ? item.count.toLocaleString("pt-BR") : ""}
                </span>
                <div className="w-full flex items-end justify-center" style={{ height: "140px" }}>
                  <div
                    className={`w-full rounded-t-lg transition-all ${isMode ? "bg-[#005CA9]" : "bg-[#7BBFE0]"}`}
                    style={{ height: `${heightPct}%` }}
                  />
                </div>
                <span className="text-center text-slate-500 font-medium" style={{ fontSize: "9px", lineHeight: "1.2" }}>
                  {item.faixa.replace("-", "–")}
                </span>
              </div>
            );
          })}
        </div>
        <p className="text-xs text-slate-400 mt-4 text-center">Azul escuro = faixa de somatório mais frequente</p>
      </div>

      {/* Cards de destaque */}
      <div className="mt-6 grid md:grid-cols-3 gap-4">
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
          <p className="text-xs text-slate-400 uppercase font-medium mb-1">Faixa mais comum</p>
          <p className="font-bold text-[#005CA9]">{dist.reduce((a, b) => b.count > a.count ? b : a).faixa.replace("-", "–")}</p>
          <p className="text-xs text-slate-400 mt-1">{((max / total) * 100).toFixed(1)}% dos sorteios</p>
        </div>
        <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
          <p className="text-xs text-slate-400 uppercase font-medium mb-1">Média histórica</p>
          <p className="font-bold text-[#1a1a2e]">{somatorio.media}</p>
          <p className="text-xs text-slate-400 mt-1">Soma das 6 dezenas por sorteio</p>
        </div>
        <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
          <p className="text-xs text-slate-400 uppercase font-medium mb-1">Amplitude</p>
          <p className="font-bold text-[#1a1a2e]">{somatorio.minimo} – {somatorio.maximo}</p>
          <p className="text-xs text-slate-400 mt-1">Mínimo e máximo histórico</p>
        </div>
      </div>

      {/* Texto explicativo */}
      <div className="mt-6 space-y-4 text-sm text-slate-600 leading-relaxed">
        <h3 className="text-base font-bold text-[#1a1a2e]">Por que o somatório segue uma curva em sino?</h3>
        <p>
          A menor soma possível na Mega-Sena seria 1+2+3+4+5+6 = <strong>21</strong>, e a maior seria 55+56+57+58+59+60 = <strong>345</strong>. Na prática, sorteios com somas extremas são raríssimos porque exigiriam que todas as dezenas viessem de um único extremo da tabela.
        </p>
        <p>
          O <strong>Teorema Central do Limite</strong> explica a curva em sino: ao somar várias variáveis aleatórias independentes (as 6 dezenas), o resultado tende a se concentrar em torno da média. Com 60 números de 1 a 60, a média esperada é 30,5 por dezena — ou seja, aproximadamente 183 para a soma de 6 dezenas. O histograma confirma esse padrão com precisão.
        </p>
        <p>
          <strong>Aplicação prática:</strong> apostas com somatório muito baixo (abaixo de 120) ou muito alto (acima de 240) ocorrem em uma minoria dos sorteios históricos. Se você quer que sua aposta reflita os padrões mais comuns, escolha dezenas cuja soma total fique na faixa central do histograma. O <a href="/sugerir-numeros" className="underline text-[#005CA9]">gerador de apostas</a> permite filtrar exatamente por isso.
        </p>
      </div>
    </section>
  );
}
