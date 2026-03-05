"use client";

import { useState, useCallback } from "react";
import NumberBall from "./NumberBall";

interface Props {
  atrasados: { numero: number }[];
  mais_sorteados: { numero: number }[];
  somatorio_dist: { faixa: string; count: number }[];
  todos_sorteios: string[];
}

type Method = "filtros" | "atrasados" | "frequentes" | "aleatorio";
type Consecutivo = "sem" | "com" | "qualquer";

function parseFaixa(faixa: string): [number, number] {
  const [a, b] = faixa.split("-").map(Number);
  return [a, b];
}

function gerarComFiltros(
  pares: number | null,
  somaFaixa: string | null,
  consecutivo: Consecutivo,
  historico: Set<string>,
  maxTentativas = 10000
): { nums: number[]; nova: boolean } {
  for (let t = 0; t < maxTentativas; t++) {
    const pool = Array.from({ length: 60 }, (_, i) => i + 1);
    const picked: number[] = [];
    while (picked.length < 6) {
      const idx = Math.floor(Math.random() * pool.length);
      picked.push(pool.splice(idx, 1)[0]);
    }
    const sorted = picked.sort((a, b) => a - b);

    // Filtro pares
    if (pares !== null) {
      const evenCount = sorted.filter(n => n % 2 === 0).length;
      if (evenCount !== pares) continue;
    }

    // Filtro somatório
    if (somaFaixa) {
      const soma = sorted.reduce((a, b) => a + b, 0);
      const [lo, hi] = parseFaixa(somaFaixa);
      if (soma < lo || soma > hi) continue;
    }

    // Filtro consecutivos
    if (consecutivo !== "qualquer") {
      const temConsec = sorted.some((n, i) => i > 0 && n - sorted[i - 1] === 1);
      if (consecutivo === "sem" && temConsec) continue;
      if (consecutivo === "com" && !temConsec) continue;
    }

    const key = sorted.join(",");
    const nova = !historico.has(key);
    return { nums: sorted, nova };
  }
  // fallback sem restrições
  const pool = Array.from({ length: 60 }, (_, i) => i + 1);
  const picked: number[] = [];
  while (picked.length < 6) {
    const idx = Math.floor(Math.random() * pool.length);
    picked.push(pool.splice(idx, 1)[0]);
  }
  return { nums: picked.sort((a, b) => a - b), nova: false };
}

export default function SugerirClient({ atrasados, mais_sorteados, somatorio_dist, todos_sorteios }: Props) {
  const [method, setMethod] = useState<Method>("filtros");

  // Filtros avançados
  const [pares, setPares] = useState<number | null>(3);
  const [somaFaixa, setSomaFaixa] = useState<string | null>(null);
  const [consecutivo, setConsecutivo] = useState<Consecutivo>("qualquer");

  const [result, setResult] = useState<{ nums: number[]; nova: boolean } | null>(null);
  const [generating, setGenerating] = useState(false);

  const historico = new Set(todos_sorteios);

  const generate = useCallback(() => {
    setGenerating(true);
    setTimeout(() => {
      let nums: number[];
      let nova = false;

      if (method === "atrasados") {
        nums = atrasados.slice(0, 6).map(x => x.numero).sort((a, b) => a - b);
        nova = !historico.has(nums.join(","));
      } else if (method === "frequentes") {
        nums = mais_sorteados.slice(0, 6).map(x => x.numero).sort((a, b) => a - b);
        nova = !historico.has(nums.join(","));
      } else if (method === "aleatorio") {
        const r = gerarComFiltros(null, null, "qualquer", historico);
        nums = r.nums; nova = r.nova;
      } else {
        const r = gerarComFiltros(pares, somaFaixa, consecutivo, historico);
        nums = r.nums; nova = r.nova;
      }

      setResult({ nums, nova });
      setGenerating(false);
    }, 100);
  }, [method, pares, somaFaixa, consecutivo, atrasados, mais_sorteados, historico]);

  const METHODS: { id: Method; label: string; desc: string }[] = [
    { id: "filtros", label: "🎯 Com filtros", desc: "Escolha os critérios" },
    { id: "atrasados", label: "⏳ Mais atrasados", desc: "Ausentes há mais tempo" },
    { id: "frequentes", label: "🔥 Mais frequentes", desc: "Historicamente mais sorteados" },
    { id: "aleatorio", label: "🎲 Aleatório", desc: "Completamente ao acaso" },
  ];

  return (
    <div>
      {/* Seleção de método */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        {METHODS.map(m => (
          <button
            key={m.id}
            onClick={() => { setMethod(m.id); setResult(null); }}
            className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors border text-left
              ${method === m.id
                ? "bg-[#005CA9] text-white border-[#005CA9]"
                : "text-slate-600 border-slate-200 hover:border-[#005CA9] hover:text-[#005CA9]"}`}
          >
            <div className="font-semibold">{m.label}</div>
            <div className={`text-xs mt-0.5 ${method === m.id ? "text-blue-200" : "text-slate-400"}`}>{m.desc}</div>
          </button>
        ))}
      </div>

      {/* Painel de filtros */}
      {method === "filtros" && (
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 mb-6 space-y-5">
          <h3 className="font-semibold text-[#1a1a2e] text-sm">Configure sua aposta</h3>

          {/* Pares */}
          <div>
            <label className="text-xs text-slate-500 font-medium uppercase tracking-wide block mb-2">Quantidade de pares</label>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => setPares(null)} className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${pares === null ? "bg-[#005CA9] text-white border-[#005CA9]" : "text-slate-500 border-slate-200 hover:border-[#005CA9]"}`}>Qualquer</button>
              {[0, 1, 2, 3, 4, 5, 6].map(n => (
                <button key={n} onClick={() => setPares(n)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${pares === n ? "bg-[#005CA9] text-white border-[#005CA9]" : "text-slate-500 border-slate-200 hover:border-[#005CA9]"}`}>
                  {n}P {6 - n}I
                </button>
              ))}
            </div>
          </div>

          {/* Somatório */}
          <div>
            <label className="text-xs text-slate-500 font-medium uppercase tracking-wide block mb-2">Faixa de somatório</label>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => setSomaFaixa(null)} className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${somaFaixa === null ? "bg-[#005CA9] text-white border-[#005CA9]" : "text-slate-500 border-slate-200 hover:border-[#005CA9]"}`}>Qualquer</button>
              {somatorio_dist.map(d => (
                <button key={d.faixa} onClick={() => setSomaFaixa(d.faixa)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${somaFaixa === d.faixa ? "bg-[#005CA9] text-white border-[#005CA9]" : "text-slate-500 border-slate-200 hover:border-[#005CA9]"}`}>
                  {d.faixa.replace("-", "–")}
                </button>
              ))}
            </div>
          </div>

          {/* Consecutivos */}
          <div>
            <label className="text-xs text-slate-500 font-medium uppercase tracking-wide block mb-2">Números consecutivos</label>
            <div className="flex gap-2">
              {([
                { id: "qualquer", label: "Qualquer" },
                { id: "sem", label: "Sem consecutivos" },
                { id: "com", label: "Com consecutivos" },
              ] as { id: Consecutivo; label: string }[]).map(o => (
                <button key={o.id} onClick={() => setConsecutivo(o.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${consecutivo === o.id ? "bg-[#005CA9] text-white border-[#005CA9]" : "text-slate-500 border-slate-200 hover:border-[#005CA9]"}`}>
                  {o.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Botão gerar */}
      <button
        onClick={generate}
        disabled={generating}
        className="w-full py-4 rounded-2xl bg-[#5BB745] text-white font-bold text-base hover:bg-green-600 transition-colors disabled:opacity-60 mb-6"
      >
        {generating ? "Gerando..." : "✨ Gerar aposta"}
      </button>

      {/* Resultado */}
      {result && (
        <div className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm text-center">
          <p className="text-xs text-slate-400 uppercase tracking-wide mb-6 font-medium">Sua aposta sugerida</p>
          <div className="flex justify-center gap-4 flex-wrap mb-6">
            {result.nums.map(n => <NumberBall key={n} number={n} size="lg" />)}
          </div>

          {/* Check histórico */}
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${result.nova ? "bg-green-50 text-[#5BB745] border border-green-200" : "bg-amber-50 text-amber-600 border border-amber-200"}`}>
            {result.nova ? "✅ Nunca foi sorteada antes!" : "⚠️ Já foi sorteada anteriormente"}
          </div>

          {/* Resumo dos filtros aplicados */}
          {method === "filtros" && (
            <div className="mt-4 text-xs text-slate-400 space-y-0.5">
              {(() => {
                const soma = result.nums.reduce((a, b) => a + b, 0);
                const paresCount = result.nums.filter(n => n % 2 === 0).length;
                const temConsec = result.nums.some((n, i) => i > 0 && n - result.nums[i - 1] === 1);
                return (
                  <>
                    <p>{paresCount} par{paresCount !== 1 ? "es" : ""} + {6 - paresCount} ímpar{6 - paresCount !== 1 ? "es" : ""} · Somatório: {soma} · {temConsec ? "Com consecutivos" : "Sem consecutivos"}</p>
                  </>
                );
              })()}
            </div>
          )}

          <button onClick={generate} className="mt-4 text-xs text-[#005CA9] hover:underline block mx-auto">
            Gerar outra aposta
          </button>
        </div>
      )}

      <p className="text-xs text-slate-300 text-center mt-6">
        ⚠️ Sugestão baseada em dados históricos. Loterias são jogos de azar — nenhum método garante ganhos.
      </p>
    </div>
  );
}
