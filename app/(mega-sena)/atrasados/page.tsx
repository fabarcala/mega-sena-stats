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
    <section>
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
    </section>
  );
}
