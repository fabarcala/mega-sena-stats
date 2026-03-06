import { Metadata } from "next";
import { getStats } from "@/lib/stats";
import { TrendingUp, TrendingDown } from "lucide-react";
import RankRow from "@/components/RankRow";

export const metadata: Metadata = {
  title: "Números Mais e Menos Sorteados | Mega Sena Stats",
  description: "Descubra quais números aparecem mais e menos na Mega-Sena. Ranking dos 10 mais sorteados e dos 10 menos frequentes em toda a história do concurso.",
};

export default async function MaisSorteadosPage() {
  const stats = await getStats();
  const { mais_sorteados, menos_sorteados } = stats;

  return (
    <div className="space-y-8">
      <div className="grid md:grid-cols-2 gap-6">
        <section>
          <h2 className="text-xl font-bold text-[#1a1a2e] mb-4 flex items-center gap-2">
            <TrendingUp size={18} className="text-[#5BB745]" /> Top 10 mais sorteados
          </h2>
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-3">
            {mais_sorteados.map((item: any, i: number) => (
              <RankRow key={item.numero} rank={i + 1} number={item.numero} value={item.vezes} max={mais_sorteados[0].vezes} color="#5BB745" />
            ))}
          </div>
        </section>
        <section>
          <h2 className="text-xl font-bold text-[#1a1a2e] mb-4 flex items-center gap-2">
            <TrendingDown size={18} className="text-rose-500" /> Top 10 menos sorteados
          </h2>
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-3">
            {menos_sorteados.map((item: any, i: number) => (
              <RankRow key={item.numero} rank={i + 1} number={item.numero} value={item.vezes} max={mais_sorteados[0].vezes} color="#ef4444" />
            ))}
          </div>
        </section>
      </div>

      {/* Texto explicativo */}
      <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
        <h3 className="text-base font-bold text-[#1a1a2e]">Números &quot;quentes&quot; e &quot;frios&quot; — o que dizem as estatísticas?</h3>
        <p>
          Os rankings acima mostram os 10 números que mais e menos apareceram em toda a história da Mega-Sena. É natural perguntar: os mais sorteados têm mais chance de sair de novo? A resposta estatística é não — cada sorteio é um evento independente. O passado não influencia o futuro em um sorteio aleatório.
        </p>
        <p>
          Na prática, a diferença absoluta entre o mais e o menos sorteado costuma ser pequena em relação ao número total de concursos. Isso significa que, ao longo do tempo, todos os números convergem para a mesma frequência esperada — efeito que os estatísticos chamam de <strong>regressão à média</strong>.
        </p>
        <p>
          Ainda assim, muitos apostadores usam esse ranking para escolher números com base no histórico — seja apostando nos &quot;quentes&quot; (pressupondo que continuarão saindo) ou nos &quot;frios&quot; (esperando que se equilibrem). Nenhuma estratégia tem embasamento matemático para aumentar as chances de ganhar na sena, mas tornam a escolha dos números mais informada e divertida.
        </p>
      </div>
    </div>
  );
}
