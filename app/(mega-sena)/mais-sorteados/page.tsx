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
  );
}
