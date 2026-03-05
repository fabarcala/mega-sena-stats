"use client";

import { useState } from "react";
import { TrendingUp, TrendingDown, Clock, BarChart2, Sparkles, ChevronDown } from "lucide-react";
import FrequencyChart from "./FrequencyChart";
import LastDraws from "./LastDraws";
import NumberBall from "./NumberBall";

type Tab = "frequencia" | "mais_menos" | "atrasados" | "sorteios" | "recordes" | "sugerir";

const LOTERIAS = [
  { id: "mega", label: "Mega-Sena", active: true },
  { id: "lotofacil", label: "Lotofácil", active: false },
  { id: "quina", label: "Quina", active: false },
  { id: "timemania", label: "Timemania", active: false },
];

const TABS: { id: Tab; label: string; icon?: React.ReactNode; special?: boolean }[] = [
  { id: "frequencia", label: "Frequência", icon: <BarChart2 size={14} /> },
  { id: "mais_menos", label: "Mais & Menos sorteados", icon: <TrendingUp size={14} /> },
  { id: "atrasados", label: "Números atrasados", icon: <Clock size={14} /> },
  { id: "sorteios", label: "Sorteios", icon: <TrendingDown size={14} /> },
  { id: "recordes", label: "Recordes & Curiosidades", icon: <span>🏆</span> },
  { id: "sugerir", label: "Sugerir números", icon: <Sparkles size={14} />, special: true },
];

type SuggestMethod = "atrasados" | "frequentes" | "aleatorio";

function formatMoney(value: number) {
  if (value >= 1_000_000) return `R$ ${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `R$ ${(value / 1_000).toFixed(0)}K`;
  return `R$ ${value.toFixed(2)}`;
}

export default function StatsClient({ stats }: { stats: any }) {
  const [activeTab, setActiveTab] = useState<Tab>("frequencia");
  const [randomKey, setRandomKey] = useState(0);
  const [loteiraOpen, setLoteiraOpen] = useState(false);
  const [suggestMethod, setSuggestMethod] = useState<SuggestMethod>("atrasados");

  const { meta, mais_sorteados, menos_sorteados, atrasados, somatorio, recordes, ultimos_10, pares_impares, consecutivos, faixas, por_dia } = stats;

  const suggestedNumbers: number[] = (() => {
    if (suggestMethod === "atrasados") return atrasados.slice(0, 6).map((x: any) => x.numero).sort((a: number, b: number) => a - b);
    if (suggestMethod === "frequentes") return mais_sorteados.slice(0, 6).map((x: any) => x.numero).sort((a: number, b: number) => a - b);
    // aleatorio — randomKey força recalculo
    void randomKey;
    const pool = Array.from({ length: 60 }, (_, i) => i + 1);
    const picked: number[] = [];
    while (picked.length < 6) {
      const idx = Math.floor(Math.random() * pool.length);
      picked.push(pool.splice(idx, 1)[0]);
    }
    return picked.sort((a, b) => a - b);
  })();

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 flex gap-8 items-start">

      {/* Sidebar esquerda */}
      <aside className="w-56 flex-shrink-0 sticky top-8">

        {/* Seletor de loteria */}
        <div className="relative mb-6">
          <button
            onClick={() => setLoteiraOpen(!loteiraOpen)}
            className="w-full flex items-center justify-between gap-2 text-sm font-bold text-[#005CA9] border-2 border-[#005CA9] rounded-xl px-4 py-3 hover:bg-blue-50 transition-colors"
          >
            Mega-Sena <ChevronDown size={15} className={`transition-transform ${loteiraOpen ? "rotate-180" : ""}`} />
          </button>
          {loteiraOpen && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg py-1 w-full z-20">
              {LOTERIAS.map((l) => (
                <button
                  key={l.id}
                  onClick={() => l.active && setLoteiraOpen(false)}
                  className={`w-full text-left px-4 py-2.5 text-sm flex items-center justify-between gap-2 transition-colors
                    ${l.active ? "text-[#005CA9] font-semibold hover:bg-blue-50" : "text-slate-300 cursor-default"}`}
                >
                  {l.label}
                  {!l.active && <span className="text-xs bg-slate-100 text-slate-400 px-1.5 py-0.5 rounded-full">em breve</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Separador */}
        <div className="h-px bg-slate-100 mb-3" />

        {/* Nav buttons */}
        <nav className="flex flex-col gap-1">
          {TABS.filter(t => !t.special).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2.5 text-sm px-4 py-2.5 rounded-xl font-medium transition-colors text-left
                ${activeTab === tab.id
                  ? "bg-[#005CA9] text-white"
                  : "text-slate-500 hover:text-[#005CA9] hover:bg-blue-50"}`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}

          {/* Separador antes do Sugerir */}
          <div className="h-px bg-slate-100 my-2" />

          {TABS.filter(t => t.special).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2.5 text-sm px-4 py-2.5 rounded-xl font-medium transition-colors text-left
                ${activeTab === tab.id
                  ? "bg-[#5BB745] text-white"
                  : "text-[#5BB745] border border-[#5BB745] hover:bg-green-50"}`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Content */}
      <div className="flex-1 min-w-0 py-0">

        {/* Frequência */}
        {activeTab === "frequencia" && (
          <section>
            <h2 className="text-xl font-bold text-[#1a1a2e] mb-6">Frequência de cada número</h2>
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
              <FrequencyChart data={stats.frequencia} />
              <p className="text-xs text-slate-400 mt-3 text-center">
                Azul escuro = mais sorteado · Azul claro = menos sorteado
              </p>
            </div>
          </section>
        )}

        {/* Mais & Menos */}
        {activeTab === "mais_menos" && (
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
        )}

        {/* Atrasados */}
        {activeTab === "atrasados" && (
          <section>
            <h2 className="text-xl font-bold text-[#1a1a2e] mb-6 flex items-center gap-2">
              <Clock size={18} className="text-amber-500" /> Números mais atrasados
            </h2>
            <div className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm">
              <div className="flex flex-wrap gap-6">
                {atrasados.map((item: any) => (
                  <div key={item.numero} className="text-center">
                    <NumberBall number={item.numero} highlight size="lg" />
                    <p className="text-xs text-slate-400 mt-2">{item.ausente_ha} atrás</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Sorteios */}
        {activeTab === "sorteios" && (
          <section className="space-y-8">
            <div>
              <h2 className="text-xl font-bold text-[#1a1a2e] mb-6">Últimos 10 sorteios</h2>
              <LastDraws draws={ultimos_10} />
            </div>

            <div>
              <h2 className="text-xl font-bold text-[#1a1a2e] mb-4">Sorteios por dia da semana</h2>
              <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
                <div className="space-y-3">
                  {Object.entries(por_dia as Record<string, number>)
                    .filter(([, v]) => (v as number) > 0)
                    .sort((a, b) => (b[1] as number) - (a[1] as number))
                    .map(([dia, total]) => {
                      const max = Math.max(...Object.values(por_dia as Record<string, number>).filter(v => v > 0));
                      const pct = Math.round(((total as number) / (max as number)) * 100);
                      return (
                        <div key={dia} className="flex items-center gap-3">
                          <span className="text-sm text-slate-600 w-20 font-medium">{dia}</span>
                          <div className="flex-1 bg-slate-100 rounded-full h-2">
                            <div className="h-2 rounded-full bg-[#005CA9]" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-xs text-slate-400 w-16 text-right">{total as number} sorteios</span>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Recordes & Curiosidades */}
        {activeTab === "recordes" && (
          <section className="space-y-8">
            <div>
              <h2 className="text-xl font-bold text-[#1a1a2e] mb-4">Recordes</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <CuriCard title="🏆 Maior prêmio da história" value={`${formatMoney(recordes.maior_premio.valor)} · Concurso ${recordes.maior_premio.concurso}`} />
                <CuriCard title="👥 Mais ganhadores na sena" value={`${recordes.mais_ganhadores.ganhadores} ganhadores · Concurso ${recordes.mais_ganhadores.concurso}`} />
                <CuriCard title="📅 Primeiro sorteio" value={`${recordes.data_primeiro_sorteio} · Concurso ${recordes.concurso_mais_antigo}`} />
                <CuriCard title="🎲 Total de sorteios" value={`${meta.total_concursos} concursos realizados`} />
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-[#1a1a2e] mb-4">Frequência por faixa de dezenas</h2>
              <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
                <div className="space-y-3">
                  {Object.entries(faixas as Record<string, number>).map(([faixa, total]) => {
                    const max = Math.max(...Object.values(faixas as Record<string, number>));
                    const pct = Math.round(((total as number) / max) * 100);
                    return (
                      <div key={faixa} className="flex items-center gap-3">
                        <span className="text-sm text-slate-600 w-16 font-medium">{faixa}</span>
                        <div className="flex-1 bg-slate-100 rounded-full h-2">
                          <div className="h-2 rounded-full bg-[#5BB745]" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-xs text-slate-400 w-20 text-right">{total as number} dezenas</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-[#1a1a2e] mb-4">Curiosidades</h2>
              <div className="grid md:grid-cols-3 gap-4">
                <CuriCard title="Pares vs Ímpares" value={`Média de ${pares_impares.media_pares} pares por sorteio`} />
                <CuriCard title="Sem consecutivos" value={`${Math.round(consecutivos.nenhum / meta.total_concursos * 100)}% dos sorteios`} />
                <CuriCard title="Somatório" value={`Mín ${somatorio.minimo} · Máx ${somatorio.maximo} · Média ${somatorio.media}`} />
              </div>
            </div>
          </section>
        )}

        {/* Sugerir números */}
        {activeTab === "sugerir" && (
          <section className="max-w-2xl mx-auto">
            <h2 className="text-xl font-bold text-[#1a1a2e] mb-2">Sugerir números</h2>
            <p className="text-slate-400 text-sm mb-8">Escolha o critério e gere uma sugestão de 6 números.</p>

            {/* Método */}
            <div className="flex gap-3 flex-wrap mb-8">
              {([
                { id: "atrasados", label: "Mais atrasados" },
                { id: "frequentes", label: "Mais frequentes" },
                { id: "aleatorio", label: "Aleatório" },
              ] as { id: SuggestMethod; label: string }[]).map((m) => (
                <button
                  key={m.id}
                  onClick={() => setSuggestMethod(m.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border
                    ${suggestMethod === m.id
                      ? "bg-[#005CA9] text-white border-[#005CA9]"
                      : "text-slate-500 border-slate-200 hover:border-[#005CA9] hover:text-[#005CA9]"}`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            {/* Números sugeridos */}
            <div className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm text-center">
              <p className="text-xs text-slate-400 uppercase tracking-wide mb-6 font-medium">Sua aposta sugerida</p>
              <div className="flex justify-center gap-4 flex-wrap">
                {suggestedNumbers.map((n) => (
                  <NumberBall key={n} number={n} size="lg" />
                ))}
              </div>
              <p className="text-xs text-slate-300 mt-6">
                {suggestMethod === "atrasados" && "Baseado nos 6 números mais ausentes dos últimos sorteios"}
                {suggestMethod === "frequentes" && "Baseado nos 6 números histórica mais sorteados"}
                {suggestMethod === "aleatorio" && "Seleção completamente aleatória"}
              </p>
              {suggestMethod === "aleatorio" && (
                <button
                  onClick={() => setRandomKey(k => k + 1)}
                  className="mt-4 text-xs text-[#005CA9] hover:underline"
                >
                  Gerar novos números
                </button>
              )}
            </div>

            <p className="text-xs text-slate-300 text-center mt-6">
              ⚠️ Isso é apenas uma sugestão baseada em dados históricos. Loterias são jogos de azar.
            </p>
          </section>
        )}

        <footer className="text-center text-slate-300 text-xs pt-12 pb-4 border-t border-slate-100 mt-12">
          Dados da Caixa Econômica Federal · Atualizado automaticamente · Desenvolvido com ❤️
        </footer>
      </div>

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
