#!/usr/bin/env python3
"""
Coleta dados históricos da Mega Sena e gera JSONs de estatísticas.
Fonte: loteriascaixa-api.herokuapp.com
"""

import json
import time
import requests
from pathlib import Path
from collections import Counter
from datetime import datetime

API_BASE = "https://loteriascaixa-api.herokuapp.com/api/megasena"
OUT_DIR = Path(__file__).parent.parent / "public" / "data"
OUT_DIR.mkdir(parents=True, exist_ok=True)


def fetch_all_results() -> list[dict]:
    """Baixa todos os concursos de uma vez e ordena do mais antigo ao mais recente."""
    print("Baixando histórico completo...")
    r = requests.get(API_BASE, timeout=60)
    r.raise_for_status()
    results = r.json()
    results.sort(key=lambda x: x["concurso"])
    print(f"  {len(results)} concursos baixados.")
    return results


def get_latest_concurso() -> int:
    r = requests.get(f"{API_BASE}/latest", timeout=10)
    r.raise_for_status()
    return r.json()["concurso"]


def parse_date(date_str: str) -> datetime:
    return datetime.strptime(date_str, "%d/%m/%Y")


def compute_stats(results: list[dict]) -> dict:
    all_numbers = []
    by_weekday = {"Segunda": [], "Terça": [], "Quarta": [], "Quinta": [],
                  "Sexta": [], "Sábado": [], "Domingo": []}
    weekday_names = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"]

    sums = []
    consecutive_counts = []
    even_odd = []
    ranges = {f"{10*i+1}-{10*(i+1)}": 0 for i in range(6)}  # 1-10, 11-20, ..., 51-60
    ranges["1-10"] = 0  # fix primeiro intervalo

    last_10 = []

    for draw in results:
        nums = sorted([int(n) for n in draw["dezenas"]])
        all_numbers.extend(nums)

        # Dia da semana
        try:
            dt = parse_date(draw["data"])
            wd = weekday_names[dt.weekday()]
            by_weekday[wd].extend(nums)
        except Exception:
            pass

        # Somatório
        sums.append(sum(nums))

        # Consecutivos
        consec = sum(1 for a, b in zip(nums, nums[1:]) if b - a == 1)
        consecutive_counts.append(consec)

        # Pares e ímpares
        evens = sum(1 for n in nums if n % 2 == 0)
        even_odd.append(evens)

        # Faixas
        for n in nums:
            bucket = ((n - 1) // 10) * 10 + 1
            key = f"{bucket}-{bucket + 9}"
            if key in ranges:
                ranges[key] += 1

    # Últimos 10 sorteios
    last_10 = results[-10:]

    freq = Counter(all_numbers)
    total = len(results)

    return {
        "meta": {
            "total_concursos": total,
            "ultimo_concurso": results[-1]["concurso"],
            "ultima_data": results[-1]["data"],
            "ultimas_dezenas": results[-1]["dezenas"],
            "gerado_em": datetime.now().isoformat(),
        },
        "frequencia": [
            {"numero": n, "vezes": freq.get(n, 0), "percentual": round(freq.get(n, 0) / total * 100, 1)}
            for n in range(1, 61)
        ],
        "mais_sorteados": sorted(
            [{"numero": n, "vezes": v} for n, v in freq.items()],
            key=lambda x: -x["vezes"]
        )[:10],
        "menos_sorteados": sorted(
            [{"numero": n, "vezes": v} for n, v in freq.items()],
            key=lambda x: x["vezes"]
        )[:10],
        "atrasados": _calc_atrasados(results),
        "somatorio": {
            "media": round(sum(sums) / len(sums), 1),
            "minimo": min(sums),
            "maximo": max(sums),
            "distribuicao": _histogram(sums, bins=10),
        },
        "pares_impares": {
            "distribuicao": dict(Counter(even_odd)),
            "media_pares": round(sum(even_odd) / len(even_odd), 2),
        },
        "faixas": ranges,
        "consecutivos": {
            "nenhum": consecutive_counts.count(0),
            "um_par": consecutive_counts.count(1),
            "dois_pares": consecutive_counts.count(2),
            "tres_ou_mais": sum(1 for x in consecutive_counts if x >= 3),
        },
        "por_dia": {
            day: dict(Counter(nums).most_common(5))
            for day, nums in by_weekday.items() if nums
        },
        "ultimos_10": [
            {
                "concurso": d["concurso"],
                "data": d["data"],
                "dezenas": d["dezenas"],
                "acumulou": d.get("acumulou", False),
                "ganhadores_sena": d.get("premiacoes", [{}])[0].get("ganhadores", 0) if d.get("premiacoes") else 0,
                "premio_sena": d.get("premiacoes", [{}])[0].get("valorPremio", 0) if d.get("premiacoes") else 0,
            }
            for d in last_10
        ],
        "recordes": _calc_recordes(results),
    }


def _calc_atrasados(results: list[dict]) -> list[dict]:
    """Quantos sorteios desde a última aparição de cada número."""
    last_seen = {}
    for i, draw in enumerate(results):
        for n in draw["dezenas"]:
            last_seen[int(n)] = i
    total = len(results)
    return sorted(
        [{"numero": n, "ausente_ha": total - 1 - last_seen.get(n, -1)} for n in range(1, 61)],
        key=lambda x: -x["ausente_ha"]
    )[:15]


def _histogram(values: list, bins: int = 10) -> list[dict]:
    mn, mx = min(values), max(values)
    step = (mx - mn) / bins
    buckets = []
    for i in range(bins):
        lo = round(mn + i * step)
        hi = round(mn + (i + 1) * step)
        count = sum(1 for v in values if lo <= v < hi)
        buckets.append({"faixa": f"{lo}-{hi}", "count": count})
    return buckets


def _calc_recordes(results: list[dict]) -> dict:
    """Maior prêmio, mais ganhadores, etc."""
    maior_premio = {"valor": 0, "concurso": 0, "data": ""}
    mais_ganhadores = {"ganhadores": 0, "concurso": 0, "data": ""}

    for draw in results:
        prem = draw.get("premiacoes", [])
        if prem:
            sena = prem[0]
            valor = sena.get("valorPremio", 0) or 0
            ganhadores = sena.get("ganhadores", 0) or 0
            if valor > maior_premio["valor"]:
                maior_premio = {"valor": valor, "concurso": draw["concurso"], "data": draw["data"]}
            if ganhadores > mais_ganhadores["ganhadores"]:
                mais_ganhadores = {"ganhadores": ganhadores, "concurso": draw["concurso"], "data": draw["data"]}

    return {
        "maior_premio": maior_premio,
        "mais_ganhadores": mais_ganhadores,
        "concurso_mais_antigo": results[0]["concurso"],
        "data_primeiro_sorteio": results[0]["data"],
    }


def main():
    latest = get_latest_concurso()
    print(f"Último concurso: {latest}")

    # Tenta carregar cache local pra não rebaixar tudo
    cache_file = OUT_DIR / "raw.json"
    if cache_file.exists():
        with open(cache_file) as f:
            cached = json.load(f)
        cached_latest = cached[-1]["concurso"] if cached else 0
        print(f"Cache local: {cached_latest} concursos")

        if cached_latest < latest:
            print(f"Atualizando {latest - cached_latest} concurso(s) novo(s)...")
            for i in range(cached_latest + 1, latest + 1):
                r = requests.get(f"{API_BASE}/{i}", timeout=10)
                r.raise_for_status()
                cached.append(r.json())
                print(f"  Adicionado concurso {i}")
            results = cached
        else:
            print("Cache atualizado, nada a baixar.")
            results = cached
    else:
        print("Sem cache. Baixando histórico completo...")
        results = fetch_all_results()

    # Salva cache
    with open(cache_file, "w") as f:
        json.dump(results, f)
    print(f"Cache salvo: {len(results)} concursos")

    # Gera estatísticas
    print("Calculando estatísticas...")
    stats = compute_stats(results)

    out_file = OUT_DIR / "stats.json"
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(stats, f, ensure_ascii=False, indent=2)

    print(f"✅ stats.json gerado em {out_file}")
    print(f"   Total de concursos: {stats['meta']['total_concursos']}")
    print(f"   Último: #{stats['meta']['ultimo_concurso']} em {stats['meta']['ultima_data']}")
    print(f"   Dezenas: {', '.join(stats['meta']['ultimas_dezenas'])}")


if __name__ == "__main__":
    main()
