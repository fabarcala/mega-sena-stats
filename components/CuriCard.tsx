export default function CuriCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
      <p className="text-xs text-slate-400 font-medium uppercase tracking-wide mb-1">{title}</p>
      <p className="font-semibold text-sm text-[#1a1a2e]">{value}</p>
    </div>
  );
}
