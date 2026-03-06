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

      {/* Texto explicativo */}
      <div className="mt-8 space-y-4 text-sm text-slate-600 leading-relaxed">
        <h3 className="text-base font-bold text-[#1a1a2e]">O que significa a frequência de cada número?</h3>
        <p>
          A Mega-Sena sorteia 6 dezenas entre 1 e 60 em cada concurso. Como são 60 números disponíveis, cada um tem, em teoria, exatamente a mesma chance de ser sorteado: aproximadamente 10% por concurso (6 ÷ 60). Ao longo de milhares de sorteios, essa probabilidade tende a se equilibrar — é o que estatísticos chamam de <strong>Lei dos Grandes Números</strong>.
        </p>
        <p>
          O gráfico acima mostra quantas vezes cada número foi sorteado desde o primeiro concurso da Mega-Sena, em 1996. Pequenas variações entre os números são completamente normais e esperadas — elas não indicam que certos números são "sortudos" ou têm mais chance de sair no próximo sorteio.
        </p>
        <p>
          A diferença entre o número mais e o menos sorteado tende a ser pequena em relação ao total de concursos. Isso confirma que o sorteio é aleatório e equilibrado. Ainda assim, acompanhar a frequência histórica é uma forma legítima de entender o comportamento passado dos números — e é por isso que essa é a estatística mais consultada do site.
        </p>
        <p className="text-xs text-slate-400">
          💡 Quer usar a frequência para montar sua aposta? Acesse <a href="/sugerir-numeros" className="underline text-[#005CA9]">Sugerir números</a> e filtre por mais frequentes, atrasados ou de forma aleatória.
        </p>
      </div>
    </section>
  );
}
