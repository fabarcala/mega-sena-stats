import { Metadata } from "next";
import Link from "next/link";
import { getStats, formatMoney } from "@/lib/stats";
import CuriCard from "@/components/CuriCard";

export const metadata: Metadata = {
  title: "Curiosidades e Recordes da Mega-Sena — Fatos Surpreendentes | Mega Sena Stats",
  description: "Qual a probabilidade de ganhar a Mega-Sena? Maior prêmio da história, primeiro sorteio, recordes e curiosidades que você não sabia sobre a loteria.",
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
      {/* Banner CTA */}
      <Link
        href="/sugerir-numeros"
        className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl p-4 hover:bg-green-100 transition"
      >
        <span className="text-2xl">🎯</span>
        <div>
          <p className="font-semibold text-green-800">Monte sua aposta baseada em estatísticas</p>
          <p className="text-sm text-green-600">Use filtros inteligentes e gere uma combinação inédita →</p>
        </div>
      </Link>

      {/* Destaque — gancho visual */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
        <p className="text-xs text-amber-600 font-semibold uppercase tracking-wide mb-1">🎲 Você sabia?</p>
        <p className="text-2xl font-bold text-amber-700">1 em 50.063.860</p>
        <p className="text-sm text-amber-800 mt-1">
          São suas chances de ganhar na sena com um jogo simples. Se você jogasse um bilhete diferente toda semana, levaria <strong>~500.000 anos</strong> para cobrir todas as combinações.
        </p>
      </div>

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

      {/* Texto explicativo */}
      <div className="mt-6 space-y-4 text-sm text-slate-600 leading-relaxed">
        <h3 className="text-base font-bold text-[#1a1a2e]">Entendendo as probabilidades da Mega-Sena</h3>
        <p>
          A Mega-Sena possui <strong>50.063.860 combinações possíveis</strong> de 6 dezenas entre 1 e 60. Isso significa que, com um jogo simples, você tem 1 chance em mais de 50 milhões de acertar a sena. Para ter uma noção da escala: se uma pessoa jogasse um bilhete diferente por semana, levaria cerca de <strong>500.000 anos</strong> para cobrir todas as combinações.
        </p>
        <p>
          Jogar com mais números aumenta as chances porque cobre mais combinações de uma vez. Um jogo de 9 dezenas, por exemplo, contém 84 combinações de 6 — reduzindo a chance de 1 em 50 milhões para aproximadamente 1 em 600 mil. O preço, porém, também aumenta proporcionalmente.
        </p>
        <p>
          O fato de nenhuma combinação ter se repetido em todos os sorteios da história não é surpreendente: com 50 milhões de possibilidades e pouco mais de 2.900 concursos realizados, a chance de repetição seria extremamente baixa mesmo sem nenhum controle. É pura matemática combinatória.
        </p>
        <p className="text-xs text-slate-400">
          💡 Curioso sobre como montar uma aposta baseada em estatísticas? Acesse <a href="/sugerir-numeros" className="underline text-[#005CA9]">Sugerir números</a>.
        </p>
      </div>
    </section>
  );
}
