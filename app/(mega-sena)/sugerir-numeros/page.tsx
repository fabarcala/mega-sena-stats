import { Metadata } from "next";
import { getStats } from "@/lib/stats";
import SugerirClient from "@/components/SugerirClient";

export const metadata: Metadata = {
  title: "Sugerir Números para a Mega-Sena | Mega Sena Stats",
  description: "Gere sugestões de 6 números para jogar na Mega-Sena com base nos números mais atrasados, mais frequentes ou de forma aleatória.",
};

export default async function SugerirPage() {
  const stats = await getStats();
  const { atrasados, mais_sorteados } = stats;

  return (
    <section className="max-w-2xl">
      <h2 className="text-xl font-bold text-[#1a1a2e] mb-2">Sugerir números</h2>
      <p className="text-slate-400 text-sm mb-8">Escolha o critério e gere uma sugestão de 6 números para jogar.</p>
      <SugerirClient atrasados={atrasados} mais_sorteados={mais_sorteados} />
    </section>
  );
}
