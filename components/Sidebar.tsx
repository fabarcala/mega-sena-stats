"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { BarChart2, TrendingUp, Clock, CalendarDays, Trophy, Sparkles, ChevronDown, Layers, SigmaSquare, GitMerge } from "lucide-react";

const LOTERIAS = [
  { id: "mega", label: "Mega-Sena", active: true },
  { id: "lotofacil", label: "Lotofácil", active: false },
  { id: "quina", label: "Quina", active: false },
  { id: "lotomania", label: "Lotomania", active: false },
  { id: "timemania", label: "Timemania", active: false },
  { id: "duplasena", label: "Dupla Sena", active: false },
  { id: "federal", label: "Federal", active: false },
  { id: "loteca", label: "Loteca", active: false },
  { id: "diasorte", label: "Dia de Sorte", active: false },
  { id: "supersete", label: "Super Sete", active: false },
  { id: "milionaria", label: "+Milionária", active: false },
];

const NAV = [
  { href: "/frequencia", label: "Frequência dos números", icon: <BarChart2 size={15} /> },
  { href: "/mais-sorteados", label: "Mais e menos sorteados", icon: <TrendingUp size={15} /> },
  { href: "/atrasados", label: "Números atrasados", icon: <Clock size={15} /> },
  { href: "/faixas", label: "Faixas de dezenas", icon: <Layers size={15} /> },
  { href: "/pares-impares", label: "Pares e ímpares", icon: <GitMerge size={15} /> },
  { href: "/somatorio", label: "Somatório", icon: <SigmaSquare size={15} /> },
  { href: "/consecutivos", label: "Consecutivos", icon: <CalendarDays size={15} /> },
  { href: "/sorteios", label: "Sorteios", icon: <CalendarDays size={15} /> },
  { href: "/curiosidades", label: "Curiosidades", icon: <Trophy size={15} /> },
];

const SPECIAL = { href: "/sugerir-numeros", label: "Sugerir números", icon: <Sparkles size={15} /> };

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <aside className="w-full md:w-56 md:flex-shrink-0 md:sticky md:top-8">
      {/* Seletor de loteria */}
      <div className="relative mb-6">
        <button
          onClick={() => setOpen(!open)}
          className="w-full flex items-center justify-between gap-2 text-sm font-bold text-[#005CA9] border-2 border-[#005CA9] rounded-xl px-4 py-3 hover:bg-blue-50 transition-colors"
        >
          Mega-Sena <ChevronDown size={15} className={`transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
        {open && (
          <div className="absolute top-full left-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg py-1 w-full z-20">
            {LOTERIAS.map((l) => (
              <button
                key={l.id}
                onClick={() => l.active && setOpen(false)}
                className={`w-full text-left px-4 py-2.5 text-sm flex items-center justify-between gap-2 transition-colors
                  ${l.active ? "text-[#005CA9] font-semibold hover:bg-blue-50" : "text-slate-300 cursor-default"}`}
              >
                {l.label}
                {!l.active && <span className="text-xs bg-slate-100 text-slate-400 px-1.5 py-0.5 rounded-full">em breve</span>}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="h-px bg-slate-100 mb-3" />

      <nav className="flex flex-col gap-1">
        {NAV.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 text-sm px-4 py-2.5 rounded-xl font-medium transition-colors
                ${active ? "bg-[#005CA9] text-white" : "text-slate-500 hover:text-[#005CA9] hover:bg-blue-50"}`}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}

        <div className="h-px bg-slate-100 my-2" />

        <Link
          href={SPECIAL.href}
          className={`flex items-center gap-2.5 text-sm px-4 py-2.5 rounded-xl font-medium transition-colors
            ${pathname === SPECIAL.href
              ? "bg-[#5BB745] text-white"
              : "text-[#5BB745] border border-[#5BB745] hover:bg-green-50"}`}
        >
          {SPECIAL.icon}
          {SPECIAL.label}
        </Link>
      </nav>
    </aside>
  );
}
