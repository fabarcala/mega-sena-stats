import { Metadata } from "next";
import { getStats } from "@/lib/stats";

export const metadata: Metadata = {
  title: "Frequência por Faixa de Dezenas | Mega Sena Stats",
  description: "Quais faixas de números (1–10, 11–20...) aparecem mais nos sorteios da Mega-Sena? Análise da distribuição das dezenas por intervalo.",
};

export default async function FaixasPage() {
  const stats = await getStats();
  const { faixas, meta } = stats;

  const entries = Object.entries(faixas as Record<string, number>);
  const max = Math.max(...entries.map(([, v]) => v));
  const total = entries.reduce((acc, [, v]) => acc + v, 0);

  return (
    <section>
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
    </section>
  );
}
