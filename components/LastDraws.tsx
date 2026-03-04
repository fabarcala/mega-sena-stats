"use client";

import NumberBall from "./NumberBall";

interface Draw {
  concurso: number;
  data: string;
  dezenas: string[];
  acumulou: boolean;
  ganhadores_sena: number;
  premio_sena: number;
}

interface Props {
  draws: Draw[];
}

function formatMoney(value: number) {
  if (value >= 1_000_000) return `R$ ${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `R$ ${(value / 1_000).toFixed(0)}K`;
  if (value > 0) return `R$ ${value.toFixed(2)}`;
  return "Acumulou";
}

export default function LastDraws({ draws }: Props) {
  return (
    <div className="space-y-2">
      {[...draws].reverse().map((draw) => (
        <div
          key={draw.concurso}
          className="flex flex-col sm:flex-row sm:items-center gap-3 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3"
        >
          <div className="flex-shrink-0 w-24">
            <p className="text-xs font-semibold text-[#005CA9]">#{draw.concurso}</p>
            <p className="text-xs text-slate-400">{draw.data}</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            {draw.dezenas.map((n) => (
              <NumberBall key={n} number={parseInt(n)} size="sm" />
            ))}
          </div>
          <div className="sm:ml-auto text-right">
            {draw.acumulou ? (
              <span className="text-xs font-semibold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-1 rounded-full">
                Acumulou
              </span>
            ) : (
              <div>
                <p className="text-xs text-slate-400">{draw.ganhadores_sena} ganhador(es)</p>
                <p className="text-sm font-bold text-[#5BB745]">{formatMoney(draw.premio_sena)}</p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
