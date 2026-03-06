import { Metadata } from "next";
import { getStats } from "@/lib/stats";

export const metadata: Metadata = {
  title: "Números Consecutivos na Mega-Sena | Mega Sena Stats",
  description: "Com que frequência aparecem números consecutivos nos sorteios da Mega-Sena? Veja a distribuição completa de pares consecutivos por sorteio.",
};

export default async function ConsecutivosPage() {
  const stats = await getStats();
  const { consecutivos, meta } = stats;

  const total = meta.total_concursos;

  const items = [
    { label: "Nenhum consecutivo", count: consecutivos.nenhum, desc: "Ex: 5, 12, 23, 34, 47, 58" },
    { label: "1 par consecutivo", count: consecutivos.um_par, desc: "Ex: 5, 12, 23, 24, 47, 58" },
    { label: "2 pares consecutivos", count: consecutivos.dois_pares, desc: "Ex: 4, 5, 14, 15, 47, 58" },
    { label: "3 ou mais pares", count: consecutivos.tres_ou_mais, desc: "Ex: 4, 5, 6, 14, 15, 58" },
  ];

  const max = Math.max(...items.map(i => i.count));

  return (
    <section>
      <h2 className="text-xl font-bold text-[#1a1a2e] mb-2">Números consecutivos por sorteio</h2>
      <p className="text-slate-400 text-sm mb-8">
        Com que frequência saem pares de números consecutivos (ex: 23 e 24) nos sorteios da Mega-Sena.
      </p>

      {/* Barras horizontais */}
      <div className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm space-y-6">
        {items.map((item) => {
          const pct = max > 0 ? (item.count / max) * 100 : 0;
          const pctTotal = ((item.count / total) * 100).toFixed(1);
          const isMode = item.count === max;
          return (
            <div key={item.label}>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className={`text-sm font-semibold ${isMode ? "text-[#005CA9]" : "text-[#1a1a2e]"}`}>{item.label}</span>
                  <span className="text-xs text-slate-300 ml-2">{item.desc}</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-[#1a1a2e]">{item.count.toLocaleString("pt-BR")}</span>
                  <span className="text-xs text-slate-400 ml-1">sorteios</span>
                  <span className="text-xs text-slate-300 ml-1">({pctTotal}%)</span>
                </div>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all ${isMode ? "bg-[#005CA9]" : "bg-[#7BBFE0]"}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 bg-blue-50 border border-blue-100 rounded-xl p-4">
        <p className="text-sm text-[#005CA9]">
          💡 <strong>{((consecutivos.um_par / total) * 100).toFixed(0)}%</strong> dos sorteios têm pelo menos 1 par de consecutivos — é mais comum do que parece, por isso não necessariamente deve ser evitado.
        </p>
      </div>

      {/* Texto explicativo */}
      <div className="mt-6 space-y-4 text-sm text-slate-600 leading-relaxed">
        <h3 className="text-base font-bold text-[#1a1a2e]">Por que consecutivos aparecem com tanta frequência?</h3>
        <p>
          Muitos apostadores evitam números consecutivos achando que são "improváveis". Mas a matemática diz o contrário: ao sortear 6 números aleatórios entre 1 e 60, a probabilidade de que <em>nenhum</em> par seja consecutivo é na verdade menor do que a de ter pelo menos um par. Isso acontece porque existem muito mais combinações possíveis com consecutivos do que sem.
        </p>
        <p>
          Pense assim: há 60 números e 59 pares consecutivos possíveis (1-2, 2-3, ..., 59-60). Com 6 dezenas sorteadas, é estatisticamente mais provável acertar pelo menos um desses pares do que evitar todos. Os dados históricos da Mega-Sena confirmam isso com precisão.
        </p>
        <p>
          <strong>Conclusão prática:</strong> não há razão para evitar consecutivos na sua aposta. Uma combinação com um par consecutivo tem exatamente a mesma probabilidade de ganhar na sena do que qualquer outra combinação — incluindo as que não têm nenhum consecutivo.
        </p>
      </div>
    </section>
  );
}
