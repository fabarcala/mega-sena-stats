import { Metadata } from "next";
import Link from "next/link";
import { getStats } from "@/lib/stats";

export const metadata: Metadata = {
  title: "Frequência por Faixa de Dezenas na Mega-Sena | Mega Sena Stats",
  description: "Quais faixas de números (1–10, 11–20...) saem mais na Mega-Sena? Veja a distribuição completa das dezenas por intervalo em todos os sorteios da história.",
};

export default async function FaixasPage() {
  const stats = await getStats();
  const { faixas, meta } = stats;

  const entries = Object.entries(faixas as Record<string, number>);
  const max = Math.max(...entries.map(([, v]) => v));
  const total = entries.reduce((acc, [, v]) => acc + v, 0);
  const faixaMaisFrequente = entries.reduce((a, b) => b[1] > a[1] ? b : a);
  const faixaMaisFrequentePct = ((faixaMaisFrequente[1] / total) * 100).toFixed(1);

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
          <p className="text-sm text-green-600">Distribua suas dezenas por faixas e gere uma combinação inédita →</p>
        </div>
      </Link>

      {/* Destaque — gancho visual */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-6">
        <p className="text-xs text-amber-600 font-semibold uppercase tracking-wide mb-1">📊 Destaque histórico</p>
        <p className="text-2xl font-bold text-amber-700">Faixa {faixaMaisFrequente[0]}</p>
        <p className="text-sm text-amber-800 mt-1">
          é a mais frequente: aparece em <strong>{faixaMaisFrequentePct}%</strong> das dezenas sorteadas em toda a história. Veja se isso influencia sua aposta.
        </p>
      </div>

      <h2 className="text-xl font-bold text-[#1a1a2e] mb-2">Frequência por faixa de dezenas</h2>
      <p className="text-slate-400 text-sm mb-8">
        Distribuição das dezenas sorteadas por intervalo ao longo de {meta.total_concursos} concursos (6 dezenas por sorteio = {total.toLocaleString("pt-BR")} ocorrências no total).
      </p>

      <div className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm space-y-5">
        {entries.map(([faixa, count]) => {
          const pct = Math.round((count / max) * 100);
          const pctTotal = ((count / total) * 100).toFixed(1);
          return (
            <div key={faixa}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-semibold text-[#1a1a2e]">{faixa}</span>
                <span className="text-sm text-slate-500">{count.toLocaleString("pt-BR")} dezenas <span className="text-slate-300">({pctTotal}%)</span></span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3">
                <div className="h-3 rounded-full bg-[#5BB745] transition-all" style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 bg-blue-50 border border-blue-100 rounded-xl p-4">
        <p className="text-sm text-[#005CA9]">
          💡 A distribuição é bastante equilibrada entre as faixas, como esperado num sorteio aleatório — nenhuma faixa favorece significativamente as outras.
        </p>
      </div>

      {/* Texto explicativo */}
      <div className="mt-6 space-y-4 text-sm text-slate-600 leading-relaxed">
        <h3 className="text-base font-bold text-[#1a1a2e]">O que as faixas revelam sobre a aleatoriedade do sorteio?</h3>
        <p>
          Os 60 números da Mega-Sena são divididos em 6 faixas de 10 dezenas cada (1–10, 11–20... 51–60). Como o sorteio é aleatório, cada faixa deveria ter, no longo prazo, exatamente a mesma participação: aproximadamente 1/6 do total de dezenas sorteadas. O gráfico acima mostra se isso se confirma na prática.
        </p>
        <p>
          Pequenas variações entre as faixas são esperadas e naturais — elas não indicam tendência ou viés. Quanto mais concursos acumulados, mais as frequências tendem a se igualar. É o mesmo princípio de jogar uma moeda muitas vezes: no longo prazo, cara e coroa se equilibram.
        </p>
        <p>
          <strong>Dica de aposta:</strong> muitos apostadores distribuem suas 6 dezenas entre diferentes faixas para cobrir toda a tabela numeral. Essa estratégia não altera matematicamente a probabilidade de ganhar, mas evita apostas concentradas em um único intervalo — o que, historicamente, é menos comum nos sorteios.
        </p>
      </div>
    </section>
  );
}
