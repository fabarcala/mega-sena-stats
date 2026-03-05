import { Metadata } from "next";
import { getStats } from "@/lib/stats";
import FrequencyChart from "@/components/FrequencyChart";

export const metadata: Metadata = {
  title: "Frequência dos Números | Mega Sena Stats",
  description: "Veja quantas vezes cada número (1 a 60) foi sorteado na Mega-Sena. Análise completa da frequência de cada dezena com mais de 2.900 concursos.",
};

export default async function FrequenciaPage() {
  const stats = await getStats();

  return (
    <section>
      <h2 className="text-xl font-bold text-[#1a1a2e] mb-2">Frequência de cada número</h2>
      <p className="text-slate-400 text-sm mb-6">
        Quantas vezes cada dezena foi sorteada ao longo de {stats.meta.total_concursos} concursos.
      </p>
      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
        <FrequencyChart data={stats.frequencia} />
        <p className="text-xs text-slate-400 mt-3 text-center">
          Azul escuro = mais sorteado · Azul claro = menos sorteado
        </p>
      </div>
    </section>
  );
}
