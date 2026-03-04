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

  const lastDraw = ultimos_10[ultimos_10.length - 1];

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-900 to-green-700 py-8 px-4 text-center shadow-lg">
        <h1 className="text-4xl font-bold tracking-tight">🍀 Mega Sena Stats</h1>
        <p className="text-green-200 mt-2 text-sm">
          {meta.total_concursos} concursos analisados · Último: #{meta.ultimo_concurso} em {meta.ultima_data}
        </p>
        <div className="flex justify-center gap-2 mt-4 flex-wrap">
          {meta.ultimas_dezenas.map((n: string) => (
            <NumberBall key={n} number={parseInt(n)} size="lg" />
          ))}
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">

        {/* Cards de destaque */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            icon={<Trophy className="text-yellow-400" />}
            label="Maior Prêmio"
            value={formatMoney(recordes.maior_premio.valor)}
            sub={`Concurso ${recordes.maior_premio.concurso}`}
          />
          <StatCard
            icon={<Zap className="text-blue-400" />}
            label="Somatório Médio"
            value={somatorio.media.toString()}
            sub="por sorteio"
          />
          <StatCard
            icon={<BarChart2 className="text-purple-400" />}
            label="Mais Sorteado"
            value={`Número ${mais_sorteados[0].numero}`}
            sub={`${mais_sorteados[0].vezes}x`}
          />
          <StatCard
            icon={<Clock className="text-red-400" />}
            label="Mais Atrasado"
            value={`Número ${atrasados[0].numero}`}
            sub={`${atrasados[0].ausente_ha} sorteios`}
          />
        </section>

        {/* Gráfico de frequência */}
        <section className="bg-gray-900 rounded-2xl p-6 shadow">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <BarChart2 size={20} className="text-green-400" /> Frequência de cada número
          </h2>
          <FrequencyChart data={stats.frequencia} />
        </section>

        {/* Mais e menos sorteados */}
        <div className="grid md:grid-cols-2 gap-6">
          <section className="bg-gray-900 rounded-2xl p-6 shadow">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <TrendingUp size={18} className="text-green-400" /> Top 10 mais sorteados
            </h2>
            <div className="space-y-2">
              {mais_sorteados.map((item: { numero: number; vezes: number }, i: number) => (
                <RankRow key={item.numero} rank={i + 1} number={item.numero} value={item.vezes} label="vezes" color="green" />
              ))}
            </div>
          </section>

          <section className="bg-gray-900 rounded-2xl p-6 shadow">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <TrendingDown size={18} className="text-red-400" /> Top 10 menos sorteados
            </h2>
            <div className="space-y-2">
              {menos_sorteados.map((item: { numero: number; vezes: number }, i: number) => (
                <RankRow key={item.numero} rank={i + 1} number={item.numero} value={item.vezes} label="vezes" color="red" />
              ))}
            </div>
          </section>
        </div>

        {/* Atrasados */}
        <section className="bg-gray-900 rounded-2xl p-6 shadow">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Clock size={20} className="text-orange-400" /> Números mais atrasados
          </h2>
          <div className="flex flex-wrap gap-3">
            {atrasados.map((item: { numero: number; ausente_ha: number }) => (
              <div key={item.numero} className="text-center">
                <NumberBall number={item.numero} highlight />
                <p className="text-xs text-gray-400 mt-1">{item.ausente_ha} atrás</p>
              </div>
            ))}
          </div>
        </section>

        {/* Últimos sorteios */}
        <section className="bg-gray-900 rounded-2xl p-6 shadow">
          <h2 className="text-xl font-semibold mb-4">📋 Últimos 10 sorteios</h2>
          <LastDraws draws={ultimos_10} />
        </section>

        {/* Curiosidades */}
        <section className="grid md:grid-cols-3 gap-4">
          <CuriCard title="Pares vs Ímpares" value={`Média de ${pares_impares.media_pares} pares por sorteio`} />
          <CuriCard title="Consecutivos" value={`${Math.round(consecutivos.nenhum / meta.total_concursos * 100)}% dos sorteios sem números consecutivos`} />
          <CuriCard title="Somatório" value={`Mínimo: ${somatorio.minimo} · Máximo: ${somatorio.maximo}`} />
        </section>

        <footer className="text-center text-gray-600 text-xs pb-8">
          Dados da Caixa Econômica Federal · Atualizado em {meta.ultima_data} · Desenvolvido com ❤️
        </footer>
      </div>
    </main>
  );
}

function StatCard({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: string; sub: string }) {
  return (
    <div className="bg-gray-900 rounded-2xl p-4 shadow flex flex-col gap-1">
      <div className="flex items-center gap-2 text-sm text-gray-400">{icon}{label}</div>
      <p className="text-xl font-bold">{value}</p>
      <p className="text-xs text-gray-500">{sub}</p>
    </div>
  );
}

function RankRow({ rank, number, value, label, color }: { rank: number; number: number; value: number; label: string; color: string }) {
  const bar = Math.round((value / 400) * 100);
  return (
    <div className="flex items-center gap-3">
      <span className="text-gray-500 text-xs w-4">{rank}</span>
      <NumberBall number={number} size="sm" />
      <div className="flex-1 bg-gray-800 rounded-full h-2">
        <div className={`h-2 rounded-full bg-${color}-500`} style={{ width: `${bar}%` }} />
      </div>
      <span className="text-xs text-gray-400 w-16 text-right">{value}x</span>
    </div>
  );
}

function CuriCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="bg-gray-900 rounded-2xl p-5 shadow">
      <p className="text-sm text-gray-400 mb-1">{title}</p>
      <p className="font-semibold text-sm">{value}</p>
    </div>
  );
}
