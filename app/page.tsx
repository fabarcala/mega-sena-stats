import { promises as fs } from "fs";
import path from "path";
import { Trophy, TrendingUp, TrendingDown, Clock, BarChart2, Zap } from "lucide-react";
import FrequencyChart from "@/components/FrequencyChart";
import LastDraws from "@/components/LastDraws";
import NumberBall from "@/components/NumberBall";

async function getStats() {
  const file = path.join(process.cwd(), "public", "data", "stats.json");
  const data = await fs.readFile(file, "utf-8");
  return JSON.parse(data);
}

function formatMoney(value: number) {
  if (value >= 1_000_000) return `R$ ${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `R$ ${(value / 1_000).toFixed(0)}K`;
  return `R$ ${value.toFixed(2)}`;
}

export default async function Home() {
  const stats = await getStats();
  const { meta, mais_sorteados, menos_sorteados, atrasados, somatorio, recordes, ultimos_10, pares_impares, consecutivos } = stats;

  return (
    <main className="min-h-screen bg-white text-[#1a1a2e]">

      {/* Header */}
      <header className="bg-[#005CA9] text-white">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Mega Sena Stats</h1>
              <p className="text-blue-200 mt-1 text-sm">
                {meta.total_concursos} concursos analisados · Atualizado em {meta.ultima_data}
              </p>
            </div>
            <div className="flex flex-col items-start md:items-end gap-1">
              <p className="text-blue-200 text-xs font-medium uppercase tracking-wide">Último sorteio · #{meta.ultimo_concurso}</p>
              <div className="flex gap-2 flex-wrap">
                {meta.ultimas_dezenas.map((n: string) => (
                  <NumberBall key={n} number={parseInt(n)} size="lg" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-10 space-y-10">

        {/* Cards de destaque */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            icon={<Trophy size={18} className="text-[#005CA9]" />}
            label="Maior Prêmio"
            value={formatMoney(recordes.maior_premio.valor)}
            sub={`Concurso ${recordes.maior_premio.concurso}`}
          />
          <StatCard
            icon={<Zap size={18} className="text-[#005CA9]" />}
            label="Somatório Médio"
            value={somatorio.media.toString()}
            sub="por sorteio"
          />
          <StatCard
            icon={<BarChart2 size={18} className="text-[#5BB745]" />}
            label="Mais Sorteado"
            value={`Nº ${mais_sorteados[0].numero}`}
            sub={`${mais_sorteados[0].vezes}x sorteado`}
          />
          <StatCard
            icon={<Clock size={18} className="text-amber-500" />}
            label="Mais Atrasado"
            value={`Nº ${atrasados[0].numero}`}
            sub={`${atrasados[0].ausente_ha} sorteios atrás`}
          />
        </section>

        {/* Gráfico de frequência */}
        <section>
          <SectionHeader icon={<BarChart2 size={18} />} title="Frequência de cada número" />
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm mt-4">
            <FrequencyChart data={stats.frequencia} />
            <p className="text-xs text-slate-400 mt-3 text-center">
              Azul escuro = mais sorteado · Azul claro = menos sorteado
            </p>
          </div>
        </section>

        {/* Mais e menos sorteados */}
        <div className="grid md:grid-cols-2 gap-6">
          <section>
            <SectionHeader icon={<TrendingUp size={18} className="text-[#5BB745]" />} title="Top 10 mais sorteados" />
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm mt-4 space-y-3">
              {mais_sorteados.map((item: { numero: number; vezes: number }, i: number) => (
                <RankRow key={item.numero} rank={i + 1} number={item.numero} value={item.vezes} max={mais_sorteados[0].vezes} color="#5BB745" />
              ))}
            </div>
          </section>

          <section>
            <SectionHeader icon={<TrendingDown size={18} className="text-rose-500" />} title="Top 10 menos sorteados" />
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm mt-4 space-y-3">
              {menos_sorteados.map((item: { numero: number; vezes: number }, i: number) => (
                <RankRow key={item.numero} rank={i + 1} number={item.numero} value={item.vezes} max={mais_sorteados[0].vezes} color="#ef4444" />
              ))}
            </div>
          </section>
        </div>

        {/* Atrasados */}
        <section>
          <SectionHeader icon={<Clock size={18} className="text-amber-500" />} title="Números mais atrasados" />
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm mt-4">
            <div className="flex flex-wrap gap-4">
              {atrasados.map((item: { numero: number; ausente_ha: number }) => (
                <div key={item.numero} className="text-center">
                  <NumberBall number={item.numero} highlight />
                  <p className="text-xs text-slate-400 mt-1">{item.ausente_ha} atrás</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Últimos sorteios */}
        <section>
          <SectionHeader icon={<span className="text-base">📋</span>} title="Últimos 10 sorteios" />
          <div className="mt-4">
            <LastDraws draws={ultimos_10} />
          </div>
        </section>

        {/* Curiosidades */}
        <section>
          <SectionHeader icon={<span className="text-base">💡</span>} title="Curiosidades" />
          <div className="grid md:grid-cols-3 gap-4 mt-4">
            <CuriCard title="Pares vs Ímpares" value={`Média de ${pares_impares.media_pares} pares por sorteio`} />
            <CuriCard title="Consecutivos" value={`${Math.round(consecutivos.nenhum / meta.total_concursos * 100)}% dos sorteios sem números consecutivos`} />
            <CuriCard title="Somatório" value={`Mínimo ${somatorio.minimo} · Máximo ${somatorio.maximo}`} />
          </div>
        </section>

        <footer className="text-center text-slate-400 text-xs pt-4 pb-10 border-t border-slate-100">
          Dados da Caixa Econômica Federal · Atualizado automaticamente · Desenvolvido com ❤️
        </footer>
      </div>
    </main>
  );
}

function SectionHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2 text-[#1a1a2e]">
      <span className="text-[#005CA9]">{icon}</span>
      <h2 className="text-lg font-bold">{title}</h2>
    </div>
  );
}

function StatCard({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: string; sub: string }) {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex flex-col gap-1 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">{icon}{label}</div>
      <p className="text-xl font-bold text-[#1a1a2e] leading-tight">{value}</p>
      <p className="text-xs text-slate-400">{sub}</p>
    </div>
  );
}

function RankRow({ rank, number, value, max, color }: { rank: number; number: number; value: number; max: number; color: string }) {
  const bar = Math.round((value / max) * 100);
  return (
    <div className="flex items-center gap-3">
      <span className="text-slate-400 text-xs w-4 text-right">{rank}</span>
      <NumberBall number={number} size="sm" />
      <div className="flex-1 bg-slate-100 rounded-full h-1.5">
        <div className="h-1.5 rounded-full" style={{ width: `${bar}%`, backgroundColor: color }} />
      </div>
      <span className="text-xs text-slate-400 w-12 text-right">{value}x</span>
    </div>
  );
}

function CuriCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
      <p className="text-xs text-slate-400 font-medium uppercase tracking-wide mb-1">{title}</p>
      <p className="font-semibold text-sm text-[#1a1a2e]">{value}</p>
    </div>
  );
}
