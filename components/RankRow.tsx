import NumberBall from "./NumberBall";

export default function RankRow({ rank, number, value, max, color }: {
  rank: number; number: number; value: number; max: number; color: string;
}) {
  const bar = Math.round((value / max) * 100);
  return (
    <div className="flex items-center gap-3">
      <span className="text-slate-400 text-xs w-4 text-right">{rank}</span>
      <NumberBall number={number} size="sm" />
      <div className="flex-1 bg-slate-100 rounded-full h-1.5">
        <div className="h-1.5 rounded-full" style={{ width: `${bar}%`, backgroundColor: color }} />
      </div>
      <span className="text-xs text-slate-400 w-12 text-right">{value}x</span>
    </div>
  );
}
