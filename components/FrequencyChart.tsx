"use client";

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell
} from "recharts";

interface FreqItem {
  numero: number;
  vezes: number;
  percentual: number;
}

interface Props {
  data: FreqItem[];
}

export default function FrequencyChart({ data }: Props) {
  const max = Math.max(...data.map(d => d.vezes));
  const min = Math.min(...data.map(d => d.vezes));

  const getColor = (vezes: number) => {
    const ratio = (vezes - min) / (max - min);
    if (ratio > 0.75) return "#22c55e"; // verde
    if (ratio > 0.5) return "#84cc16";  // verde claro
    if (ratio > 0.25) return "#eab308"; // amarelo
    return "#ef4444";                   // vermelho
  };

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 4, right: 4, bottom: 4, left: -20 }}>
        <XAxis
          dataKey="numero"
          tick={{ fill: "#9ca3af", fontSize: 10 }}
          interval={4}
        />
        <YAxis tick={{ fill: "#9ca3af", fontSize: 10 }} />
        <Tooltip
          contentStyle={{ background: "#111827", border: "1px solid #374151", borderRadius: 8 }}
          labelStyle={{ color: "#f9fafb" }}
          formatter={(value: number | undefined) => [`${value ?? 0}x`, "Sorteios"]}
          labelFormatter={(label) => `Número ${label}`}
        />
        <Bar dataKey="vezes" radius={[3, 3, 0, 0]}>
          {data.map((entry) => (
            <Cell key={entry.numero} fill={getColor(entry.vezes)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
