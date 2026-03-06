import { Metadata } from "next";
import { getStats } from "@/lib/stats";
import LastDraws from "@/components/LastDraws";

export const metadata: Metadata = {
  title: "Últimos Sorteios da Mega-Sena | Mega Sena Stats",
  description: "Resultados dos últimos 10 sorteios da Mega-Sena com dezenas, prêmio e número de ganhadores. Veja também em quais dias da semana mais há sorteios.",
};

export default async function SorteiosPage() {
  const stats = await getStats();
  const { ultimos_10, por_dia, meta } = stats;

  const maxDia = Math.max(...Object.values(por_dia as Record<string, number>).filter(v => v > 0));

  return (
    <section className="space-y-8">
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
