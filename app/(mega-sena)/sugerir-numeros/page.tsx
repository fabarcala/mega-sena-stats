import { Metadata } from "next";
import { getStats } from "@/lib/stats";
import SugerirClient from "@/components/SugerirClient";
import AdUnit from "@/components/AdUnit";

export const metadata: Metadata = {
  title: "Gerador de Apostas da Mega-Sena — Monte com Estatísticas | Mega Sena Stats",
  description: "Gere apostas para a Mega-Sena usando estatísticas reais. Filtre por pares/ímpares, somatório, consecutivos e mais. Verificamos se a combinação já foi sorteada.",
};

export default async function SugerirPage() {
  const stats = await getStats();

  return (
    <section className="max-w-2xl">
      <h2 className="text-xl font-bold text-[#1a1a2e] mb-2">Sugerir números</h2>
      <p className="text-slate-400 text-sm mb-6">
        Configure os filtros baseados nas estatísticas e gere uma aposta inédita — verificamos se a combinação já foi sorteada em todos os {stats.meta.total_concursos} concursos da história.
      </p>

      {/* Spot 4 — /sugerir-numeros, acima dos filtros */}
      <AdUnit slot="9029005565" />

      <SugerirClient
        atrasados={stats.atrasados}
        mais_sorteados={stats.mais_sorteados}
        somatorio_dist={stats.somatorio.distribuicao}
        todos_sorteios={stats.todos_sorteios ?? []}
      />
    </section>
  );
}
