"use client";

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine
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
  const avg = Math.round(data.reduce((a, d) => a + d.vezes, 0) / data.length);
  // Y axis começa em 80% do mínimo para destacar as diferenças
  const yMin = Math.floor(min * 0.88);

  const getColor = (vezes: number) => {
    const ratio = (vezes - min) / (max - min);
    if (ratio > 0.75) return "#005CA9";
    if (ratio > 0.5) return "#4D9DC8";
    if (ratio > 0.25) return "#7BBFE0";
    return "#B8D9EF";
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 8, right: 4, bottom: 4, left: -10 }}>
        <XAxis
          dataKey="numero"
          tick={{ fill: "#94a3b8", fontSize: 10 }}
          interval={4}
        />
        <YAxis
          tick={{ fill: "#94a3b8", fontSize: 10 }}
          domain={[yMin, "auto"]}
          tickFormatter={(v) => String(v)}
        />
        <Tooltip
          contentStyle={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 8, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
          labelStyle={{ color: "#1a1a2e", fontWeight: 600 }}
          formatter={(value: number | undefined) => [`${value ?? 0}x`, "Sorteios"]}
          labelFormatter={(label) => `Número ${label}`}
        />
        <ReferenceLine y={avg} stroke="#94a3b8" strokeDasharray="3 3" label={{ value: `média ${avg}`, fill: "#94a3b8", fontSize: 10, position: "insideTopRight" }} />
        <Bar dataKey="vezes" radius={[3, 3, 0, 0]}>
          {data.map((entry) => (
            <Cell key={entry.numero} fill={getColor(entry.vezes)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
