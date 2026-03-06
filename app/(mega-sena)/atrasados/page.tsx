import { Metadata } from "next";
import { getStats } from "@/lib/stats";
import { Clock } from "lucide-react";
import NumberBall from "@/components/NumberBall";

export const metadata: Metadata = {
  title: "Números Atrasados da Mega-Sena | Mega Sena Stats",
  description: "Quais números estão há mais tempo sem aparecer na Mega-Sena? Veja os 15 números mais atrasados e há quantos sorteios cada um está ausente.",
};

export default async function AtrasadosPage() {
  const stats = await getStats();
  const { atrasados } = stats;

  return (
    <section className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-[#1a1a2e] mb-2 flex items-center gap-2">
          <Clock size={18} className="text-[#005CA9]" /> Números mais atrasados
        </h2>
        <p className="text-slate-400 text-sm mb-6">
          Dezenas que estão há mais tempo sem aparecer nos sorteios da Mega-Sena.
        </p>
        <div className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm">
          <div className="flex flex-wrap gap-6">
            {atrasados.map((item: any) => (
              <div key={item.numero} className="text-center">
                <NumberBall number={item.numero} highlight size="lg" />
                <p className="text-xs text-slate-400 mt-2">{item.ausente_ha} sorteios</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Texto explicativo */}
      <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
        <h3 className="text-base font-bold text-[#1a1a2e]">O que são números atrasados e por que eles chamam atenção?</h3>
        <p>
          Um número &quot;atrasado&quot; é aquele que está há mais concursos seguidos sem aparecer. Em qualquer sorteio verdadeiramente aleatório, ausências longas acontecem — não porque o número &quot;está devendo&quot;, mas por pura aleatoriedade. Isso é conhecido como a <strong>Falácia do Apostador</strong>: acreditar que um evento que não ocorreu há muito tempo tem maior probabilidade de ocorrer em breve.
        </p>
        <p>
          Matematicamente, cada número tem exatamente 10% de chance de ser sorteado em cada concurso, independentemente de quantos sorteios ele esteve ausente. Um número ausente há 50 concursos não tem mais chance de sair do que um número que saiu semana passada.
        </p>
        <p>
          Dito isso, acompanhar os atrasados tem valor informativo: quando um número ultrapassa em muito o intervalo médio esperado entre aparições, chama a atenção de muitos apostadores. Use esse dado como referência histórica — não como previsão.
        </p>
        <p className="text-xs text-slate-400">
          💡 Quer incluir números atrasados na sua aposta? Acesse <a href="/sugerir-numeros" className="underline text-[#005CA9]">Sugerir números</a> e escolha o modo &quot;mais atrasados&quot;.
        </p>
      </div>
    </section>
  );
}
