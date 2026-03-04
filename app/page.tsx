import { promises as fs } from "fs";
import path from "path";
import NumberBall from "@/components/NumberBall";
import StatsClient from "@/components/StatsClient";

async function getStats() {
  const file = path.join(process.cwd(), "public", "data", "stats.json");
  const data = await fs.readFile(file, "utf-8");
  return JSON.parse(data);
}

export default async function Home() {
  const stats = await getStats();
  const { meta } = stats;

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
              <p className="text-blue-200 text-xs font-medium uppercase tracking-wide">
                Último sorteio · #{meta.ultimo_concurso}
              </p>
              <div className="flex gap-2 flex-wrap">
                {meta.ultimas_dezenas.map((n: string) => (
                  <NumberBall key={n} number={parseInt(n)} size="lg" variant="white" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Nav + conteúdo dinâmico */}
      <StatsClient stats={stats} />

    </main>
  );
}
