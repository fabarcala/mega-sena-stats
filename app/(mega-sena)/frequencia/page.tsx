import { Metadata } from "next";
import Link from "next/link";
import { getStats } from "@/lib/stats";
import FrequencyChart from "@/components/FrequencyChart";
import AdUnit from "@/components/AdUnit";

export const metadata: Metadata = {
  title: "Quais números mais saem na Mega-Sena? | Mega Sena Stats",
  description: "Veja a frequência de todos os números da Mega-Sena em mais de 2.900 sorteios. Estatísticas atualizadas para você montar sua aposta com mais inteligência.",
};

export default async function FrequenciaPage() {
  const stats = await getStats();

  return (
    <section>
      {/* Onboarding para visitante novo */}
      <section className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6 text-sm text-blue-800">
        <strong>O que é esse site?</strong> Analisamos todos os sorteios da Mega-Sena desde o início e transformamos em gráficos e estatísticas. Use o menu para explorar — ou vá direto para{" "}
        <Link href="/sugerir-numeros" className="underline font-medium">
          Sugerir números
        </Link>{" "}
        se quiser uma aposta pronta.
      </section>

      <h2 className="text-xl font-bold text-[#1a1a2e] mb-2">Quais números mais saem na Mega-Sena?</h2>
      <p className="text-slate-400 text-sm mb-6">
        Veja a frequência de todos os 60 números em {stats.meta.total_concursos} sorteios oficiais da Caixa.
      </p>
      {/* Banner CTA — Sugerir números */}
      <Link
        href="/sugerir-numeros"
        className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl p-4 mb-6 hover:bg-green-100 transition"
      >
        <span className="text-2xl">🎯</span>
        <div>
          <p className="font-semibold text-green-800">Monte sua aposta baseada em estatísticas</p>
          <p className="text-sm text-green-600">Use filtros inteligentes e gere uma combinação inédita →</p>
        </div>
      </Link>

      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
        <div style={{ width: "100%", height: 360 }}>
          <FrequencyChart data={stats.frequencia} />
        </div>
        <p className="text-xs text-slate-400 mt-3 text-center">
          Azul escuro = mais sorteado · Azul claro = menos sorteado
        </p>
      </div>

      {/* Spot 2 — Após o gráfico */}
      <AdUnit slot="9300468307" />
    </section>
  );
}
