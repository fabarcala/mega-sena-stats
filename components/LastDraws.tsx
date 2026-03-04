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
    <div className="space-y-3">
      {[...draws].reverse().map((draw) => (
        <div
          key={draw.concurso}
          className="flex flex-col sm:flex-row sm:items-center gap-3 bg-gray-800 rounded-xl px-4 py-3"
        >
          <div className="flex-shrink-0 w-24">
            <p className="text-xs text-gray-400">#{draw.concurso}</p>
            <p className="text-xs text-gray-500">{draw.data}</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            {draw.dezenas.map((n) => (
              <NumberBall key={n} number={parseInt(n)} size="sm" />
            ))}
          </div>
          <div className="sm:ml-auto text-right">
            {draw.acumulou ? (
              <span className="text-xs font-semibold text-yellow-400 bg-yellow-400/10 px-2 py-1 rounded-full">
                Acumulou
              </span>
            ) : (
              <div>
                <p className="text-xs text-gray-400">{draw.ganhadores_sena} ganhador(es)</p>
                <p className="text-sm font-semibold text-green-400">{formatMoney(draw.premio_sena)}</p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
