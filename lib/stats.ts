import { promises as fs } from "fs";
import path from "path";

export async function getStats() {
  const file = path.join(process.cwd(), "public", "data", "stats.json");
  const data = await fs.readFile(file, "utf-8");
  return JSON.parse(data);
}

export function formatMoney(value: number) {
  if (value >= 1_000_000_000) return `R$ ${(value / 1_000_000_000).toFixed(1)} bilhão`;
  if (value >= 1_000_000) return `R$ ${(value / 1_000_000).toFixed(1)} milhões`;
  if (value >= 1_000) return `R$ ${(value / 1_000).toFixed(0)} mil`;
  return `R$ ${value.toFixed(2)}`;
}
