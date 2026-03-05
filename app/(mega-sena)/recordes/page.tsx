import { Metadata } from "next";
import { getStats, formatMoney } from "@/lib/stats";
import CuriCard from "@/components/CuriCard";

export const metadata: Metadata = {
  title: "Recordes e Curiosidades da Mega-Sena | Mega Sena Stats",
  description: "O maior prêmio da história da Mega-Sena, o concurso com mais ganhadores, frequência por faixa de dezenas e outras curiosidades estatísticas.",
};

export default async function RecordesPage() {
  const stats = await getStats();
  const { recordes, meta, faixas, pares_impares, consecutivos, somatorio } = stats;

  const maxFaixa = Math.max(...Object.values(faixas as Record<string, number>));

  return (
    <section className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-[#1a1a2e] mb-4">🏆 Recordes históricos</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <CuriCard
            title="Maior prêmio da história"
            value={`${formatMoney(recordes.maior_premio.valor)} · Concurso ${recordes.maior_premio.concurso}`}
          />
          <CuriCard
            title="Mais ganhadores na sena"
            value={`${recordes.mais_ganhadores.ganhadores} ganhadores · Concurso ${recordes.mais_ganhadores.concurso}`}
          />
          <CuriCard
            title="Primeiro sorteio"
            value={`${recordes.data_primeiro_sorteio} · Concurso ${recordes.concurso_mais_antigo}`}
          />
          <CuriCard
            title="Total de sorteios realizados"
            value={`${meta.total_concursos} concursos`}
          />
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold text-[#1a1a2e] mb-2">Frequência por faixa de dezenas</h2>
        <p className="text-slate-400 text-sm mb-4">Quais dezenas (1–10, 11–20...) aparecem mais nos resultados.</p>
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
          <div className="space-y-3">
            {Object.entries(faixas as Record<string, number>).map(([faixa, total]) => {
              const pct = Math.round((total / maxFaixa) * 100);
              return (
                <div key={faixa} className="flex items-center gap-3">
                  <span className="text-sm text-slate-600 w-16 font-medium">{faixa}</span>
                  <div className="flex-1 bg-slate-100 rounded-full h-2">
                    <div className="h-2 rounded-full bg-[#5BB745]" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-xs text-slate-400 w-24 text-right">{total} dezenas</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold text-[#1a1a2e] mb-4">Curiosidades</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <CuriCard
            title="Pares vs Ímpares"
            value={`Média de ${pares_impares.media_pares} pares por sorteio`}
          />
          <CuriCard
            title="Sem consecutivos"
            value={`${Math.round(consecutivos.nenhum / meta.total_concursos * 100)}% dos sorteios`}
          />
          <CuriCard
            title="Somatório das dezenas"
            value={`Mín ${somatorio.minimo} · Máx ${somatorio.maximo} · Média ${somatorio.media}`}
          />
        </div>
      </div>
    </section>
  );
}
