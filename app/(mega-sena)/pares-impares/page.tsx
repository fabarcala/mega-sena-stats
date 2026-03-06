import { Metadata } from "next";
import Link from "next/link";
import { getStats } from "@/lib/stats";

export const metadata: Metadata = {
  title: "Pares e Ímpares na Mega-Sena — Qual Combinação Sai Mais? | Mega Sena Stats",
  description: "Quantos números pares e ímpares saem em cada sorteio da Mega-Sena? Distribuição completa em mais de 2.900 sorteios. Descubra qual combinação é a mais comum.",
};

export default async function ParesImparesPage() {
  const stats = await getStats();
  const { pares_impares, meta } = stats;

  const dist = pares_impares.distribuicao as Record<string, number>;
  const entries = Array.from({ length: 7 }, (_, i) => [String(i), dist[String(i)] ?? 0] as [string, number]);
  const max = Math.max(...entries.map(([, v]) => v));
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
          <p className="text-sm text-green-600">Filtre por pares e ímpares e gere uma combinação inédita →</p>
        </div>
      </Link>

      <h2 className="text-xl font-bold text-[#1a1a2e] mb-2">Distribuição de pares e ímpares</h2>
      <p className="text-slate-400 text-sm mb-8">
        Em quantos sorteios saíram 0, 1, 2 ... 6 números pares? Média histórica: <strong className="text-[#005CA9]">{pares_impares.media_pares} pares</strong> por sorteio.
      </p>

      {/* Gráfico de barras tipo curva em sino */}
      <div className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm">
        <div className="flex items-end justify-center gap-4 h-48">
          {entries.map(([pares, count]) => {
            const heightPct = max > 0 ? (count / max) * 100 : 0;
            const pctTotal = total > 0 ? ((count / total) * 100).toFixed(1) : "0.0";
            const isMode = count === max;
            return (
              <div key={pares} className="flex flex-col items-center gap-1 flex-1">
                <span className="text-xs font-semibold text-slate-600">{count > 0 ? count.toLocaleString("pt-BR") : ""}</span>
                <div className="w-full flex items-end justify-center" style={{ height: "140px" }}>
                  <div
                    className={`w-full rounded-t-lg transition-all ${isMode ? "bg-[#005CA9]" : "bg-[#7BBFE0]"}`}
                    style={{ height: `${heightPct}%` }}
                  />
                </div>
                <span className={`text-xs font-bold ${isMode ? "text-[#005CA9]" : "text-slate-500"}`}>{pares}P</span>
                <span className="text-xs text-slate-300">{pctTotal}%</span>
              </div>
            );
          })}
        </div>
        <p className="text-xs text-slate-400 mt-4 text-center">P = número de pares na combinação · Azul escuro = combinação mais frequente</p>
      </div>

      <div className="mt-6 grid md:grid-cols-2 gap-4">
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
          <p className="text-xs text-slate-400 uppercase font-medium mb-1">Combinação mais comum</p>
          <p className="font-bold text-[#005CA9]">
            {entries.reduce((a, b) => b[1] > a[1] ? b : a)[0]} pares + {6 - parseInt(entries.reduce((a, b) => b[1] > a[1] ? b : a)[0])} ímpares
          </p>
          <p className="text-xs text-slate-400 mt-1">{((max / total) * 100).toFixed(1)}% dos sorteios</p>
        </div>
        <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
          <p className="text-xs text-slate-400 uppercase font-medium mb-1">Extremos (6 pares ou 6 ímpares)</p>
          <p className="font-bold text-slate-600">
            {((((dist["0"] ?? 0) + (dist["6"] ?? 0)) / total) * 100).toFixed(1)}% dos sorteios
          </p>
          <p className="text-xs text-slate-400 mt-1">Raros — ocorrem em menos de 3% dos casos</p>
        </div>
      </div>

      {/* Texto explicativo */}
      <div className="mt-6 space-y-4 text-sm text-slate-600 leading-relaxed">
        <h3 className="text-base font-bold text-[#1a1a2e]">Por que a distribuição forma uma curva em sino?</h3>
        <p>
          Dos 60 números da Mega-Sena, exatamente 30 são pares e 30 são ímpares. Ao sortear 6 dezenas aleatoriamente, a probabilidade de cada possível combinação de pares/ímpares segue uma <strong>distribuição binomial</strong> — que, visualmente, forma exatamente a curva em sino que você vê no gráfico.
        </p>
        <p>
          A combinação mais provável matematicamente é 3 pares + 3 ímpares, e os dados históricos confirmam: ela é a mais frequente. Combinações extremas como 6 pares ou 6 ímpares são raras porque exigem que todas as dezenas sorteadas venham de um único grupo — e há muito menos combinações possíveis dessa forma.
        </p>
        <p>
          <strong>Para apostadores:</strong> apostas com uma distribuição equilibrada (2-4 ou 3-3 pares/ímpares) refletem o padrão histórico mais comum. Isso não aumenta as chances de ganhar na sena — toda combinação válida tem a mesma probabilidade — mas alinha sua aposta com o comportamento estatístico dos sorteios.
        </p>
      </div>
    </section>
  );
}
