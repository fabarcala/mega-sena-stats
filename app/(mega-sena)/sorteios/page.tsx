import { Metadata } from "next";
import Link from "next/link";
import { getStats } from "@/lib/stats";
import LastDraws from "@/components/LastDraws";

export const metadata: Metadata = {
  title: "Resultado dos Últimos Sorteios da Mega-Sena | Mega Sena Stats",
  description: "Veja os resultados dos últimos sorteios da Mega-Sena com dezenas, prêmio e ganhadores. Histórico atualizado automaticamente após cada concurso.",
};

export default async function SorteiosPage() {
  const stats = await getStats();
  const { ultimos_10, por_dia, meta } = stats;

  const maxDia = Math.max(...Object.values(por_dia as Record<string, number>).filter(v => v > 0));

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
          <p className="text-sm text-green-600">Use os dados históricos e gere uma combinação inédita →</p>
        </div>
      </Link>

      {/* Destaque — gancho visual */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
        <p className="text-xs text-amber-600 font-semibold uppercase tracking-wide mb-1">🗓️ Próximo sorteio</p>
        <p className="text-2xl font-bold text-amber-700">Quarta e Sábado</p>
        <p className="text-sm text-amber-800 mt-1">
          A Mega-Sena sorteia sempre às <strong>20h</strong> (horário de Brasília). Veja abaixo os últimos resultados atualizados automaticamente.
        </p>
      </div>

      <div>
        <h2 className="text-xl font-bold text-[#1a1a2e] mb-2">Últimos 10 sorteios</h2>
        <p className="text-slate-400 text-sm mb-6">Resultados mais recentes da Mega-Sena.</p>
        <LastDraws draws={ultimos_10} />
      </div>

      <div>
        <h2 className="text-xl font-bold text-[#1a1a2e] mb-2">Sorteios por dia da semana</h2>
        <p className="text-slate-400 text-sm mb-6">
          Distribuição dos {meta.total_concursos} concursos pelos dias da semana.
        </p>
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
          <div className="space-y-3">
            {Object.entries(por_dia as Record<string, number>)
              .filter(([, v]) => v > 0)
              .sort((a, b) => b[1] - a[1])
              .map(([dia, total]) => {
                const pct = Math.round((total / maxDia) * 100);
                return (
                  <div key={dia} className="flex items-center gap-3">
                    <span className="text-sm text-slate-600 w-20 font-medium">{dia}</span>
                    <div className="flex-1 bg-slate-100 rounded-full h-2">
                      <div className="h-2 rounded-full bg-[#005CA9]" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-xs text-slate-400 w-20 text-right">{total} sorteios</span>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
      {/* Texto explicativo */}
      <div className="mt-4 space-y-4 text-sm text-slate-600 leading-relaxed">
        <h3 className="text-base font-bold text-[#1a1a2e]">Quando a Mega-Sena é sorteada?</h3>
        <p>
          A Mega-Sena realiza sorteios às <strong>quartas-feiras e sábados</strong>, sempre às 20h (horário de Brasília), transmitidos ao vivo pela TV Caixa e pelo canal oficial da Caixa no YouTube. Em datas especiais — como a Mega da Virada no dia 31 de dezembro — podem ocorrer sorteios extraordinários fora do calendário regular.
        </p>
        <p>
          O gráfico de distribuição por dia da semana reflete o histórico completo desde 1996. Nos primeiros anos, a Mega-Sena sorteava apenas às quartas e sábados, o que explica por que esses dois dias concentram a grande maioria dos concursos. Sorteios em outros dias correspondem a edições especiais ao longo da história do jogo.
        </p>
        <p>
          Os resultados são oficiais e publicados no site da <a href="https://loterias.caixa.gov.br" target="_blank" rel="noopener noreferrer" className="underline text-[#005CA9]">Caixa Econômica Federal</a>. Este site atualiza os dados automaticamente após cada sorteio.
        </p>
      </div>
    </section>
  );
}
