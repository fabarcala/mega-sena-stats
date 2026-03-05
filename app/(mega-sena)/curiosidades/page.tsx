import { Metadata } from "next";
import { getStats, formatMoney } from "@/lib/stats";
import CuriCard from "@/components/CuriCard";

export const metadata: Metadata = {
  title: "Curiosidades e Recordes da Mega-Sena | Mega Sena Stats",
  description: "Probabilidades de ganhar a Mega-Sena com 6, 7 e 8 números. Maior prêmio da história, primeiro sorteio, recordes e fatos curiosos.",
};

// C(n, k) — combinações
function comb(n: number, k: number): number {
  if (k > n) return 0;
  let result = 1;
  for (let i = 0; i < k; i++) {
    result = result * (n - i) / (i + 1);
  }
  return Math.round(result);
}

export default async function CuriosidadesPage() {
  const stats = await getStats();
  const { recordes, meta } = stats;

  // Probabilidades
  const totalCombinations = comb(60, 6); // 50.063.860
  const prob6 = totalCombinations;
  const prob7 = Math.round(totalCombinations / comb(7, 6)); // aposta de 7 = 7 combinações de 6
  const prob8 = Math.round(totalCombinations / comb(8, 6)); // aposta de 8 = 28 combinações de 6
  const prob9 = Math.round(totalCombinations / comb(9, 6)); // aposta de 9 = 84 combinações de 6

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
            value={`${meta.total_concursos.toLocaleString("pt-BR")} concursos`}
          />
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold text-[#1a1a2e] mb-4">🎲 Probabilidades de ganhar</h2>
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-4">
          {[
            { jogo: "Jogo simples (6 números)", prob: prob6, combinacoes: 1 },
            { jogo: "Jogo com 7 números", prob: prob7, combinacoes: comb(7, 6) },
            { jogo: "Jogo com 8 números", prob: prob8, combinacoes: comb(8, 6) },
            { jogo: "Jogo com 9 números", prob: prob9, combinacoes: comb(9, 6) },
          ].map(({ jogo, prob, combinacoes }) => (
            <div key={jogo} className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
              <div>
                <p className="text-sm font-semibold text-[#1a1a2e]">{jogo}</p>
                <p className="text-xs text-slate-400">{combinacoes.toLocaleString("pt-BR")} combinação{combinacoes > 1 ? "ões" : ""} de 6 dezenas</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-[#005CA9]">1 em {prob.toLocaleString("pt-BR")}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold text-[#1a1a2e] mb-4">🤯 Fatos curiosos</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <CuriCard
            title="Combinação única"
            value="Nenhuma combinação de 6 dezenas foi sorteada mais de uma vez em toda a história"
          />
          <CuriCard
            title="Total de combinações possíveis"
            value={`${totalCombinations.toLocaleString("pt-BR")} combinações distintas de 60 números`}
          />
          <CuriCard
            title="Probabilidade de ganhar duas vezes"
            value={`1 em ${(prob6 * prob6).toLocaleString("pt-BR")} — praticamente impossível`}
          />
          <CuriCard
            title="Anos para cobrir tudo"
            value={`${Math.round(totalCombinations / (meta.total_concursos / (new Date().getFullYear() - 1996))).toLocaleString("pt-BR")} anos sorteando toda semana`}
          />
        </div>
      </div>
    </section>
  );
}
