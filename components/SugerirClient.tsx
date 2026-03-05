"use client";

import { useState } from "react";
import NumberBall from "./NumberBall";

type Method = "atrasados" | "frequentes" | "aleatorio";

export default function SugerirClient({ atrasados, mais_sorteados }: {
  atrasados: { numero: number }[];
  mais_sorteados: { numero: number }[];
}) {
  const [method, setMethod] = useState<Method>("atrasados");
  const [randomKey, setRandomKey] = useState(0);

  const numbers: number[] = (() => {
    if (method === "atrasados") return atrasados.slice(0, 6).map(x => x.numero).sort((a, b) => a - b);
    if (method === "frequentes") return mais_sorteados.slice(0, 6).map(x => x.numero).sort((a, b) => a - b);
    void randomKey;
    const pool = Array.from({ length: 60 }, (_, i) => i + 1);
    const picked: number[] = [];
    while (picked.length < 6) {
      const idx = Math.floor(Math.random() * pool.length);
      picked.push(pool.splice(idx, 1)[0]);
    }
    return picked.sort((a, b) => a - b);
  })();

  const METHODS = [
    { id: "atrasados" as Method, label: "Mais atrasados" },
    { id: "frequentes" as Method, label: "Mais frequentes" },
    { id: "aleatorio" as Method, label: "Aleatório" },
  ];

  const descriptions: Record<Method, string> = {
    atrasados: "Baseado nos 6 números mais ausentes dos últimos sorteios",
    frequentes: "Baseado nos 6 números historicamente mais sorteados",
    aleatorio: "Seleção completamente aleatória",
  };

  return (
    <>
      <div className="flex gap-3 flex-wrap mb-8">
        {METHODS.map((m) => (
          <button
            key={m.id}
            onClick={() => setMethod(m.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border
              ${method === m.id
                ? "bg-[#005CA9] text-white border-[#005CA9]"
                : "text-slate-500 border-slate-200 hover:border-[#005CA9] hover:text-[#005CA9]"}`}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm text-center">
        <p className="text-xs text-slate-400 uppercase tracking-wide mb-6 font-medium">Sua aposta sugerida</p>
        <div className="flex justify-center gap-4 flex-wrap">
          {numbers.map((n) => (
            <NumberBall key={n} number={n} size="lg" />
          ))}
        </div>
        <p className="text-xs text-slate-300 mt-6">{descriptions[method]}</p>
        {method === "aleatorio" && (
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
    </>
  );
}
