"""Monta aos poucos o contorno do mar (água/terra) da Grande Florianópolis, em ~850 m.

Usa a altitude do terreno da Open-Meteo (Copernicus DEM). Altitude <= 1 m conta como água.
A Open-Meteo limita consultas por minuto, então cada rodada do robô busca só um pedaço
e guarda o progresso em mascara_parcial.json até completar mascara.json.
"""
import json
import os
import shutil
import sys
import time
import urllib.error
import urllib.request

old_dir, out_dir = sys.argv[1], sys.argv[2]
G = {"la0": -28.10, "lo0": -48.90, "st": 0.008, "nla": 107, "nlo": 82}
N = G["nla"] * G["nlo"]
POR_RODADA = 2000

pronto = os.path.join(old_dir, "mascara.json")
if os.path.exists(pronto):
    with open(pronto) as f:
        m = json.load(f)
    if all(m.get(k) == v for k, v in G.items()) and len(m.get("b", "")) == N:
        shutil.copy(pronto, out_dir)
        sys.exit(0)

b = ["?"] * N
parcial = os.path.join(old_dir, "mascara_parcial.json")
if os.path.exists(parcial):
    with open(parcial) as f:
        p = json.load(f)
    if all(p.get(k) == v for k, v in G.items()) and len(p.get("b", "")) == N:
        b = list(p["b"])

faltam = [i for i, c in enumerate(b) if c == "?"][:POR_RODADA]
for s in range(0, len(faltam), 100):
    lote = faltam[s:s + 100]
    la = ",".join(f"{G['la0'] + (i // G['nlo']) * G['st']:.4f}" for i in lote)
    lo = ",".join(f"{G['lo0'] + (i % G['nlo']) * G['st']:.4f}" for i in lote)
    try:
        with urllib.request.urlopen(f"https://api.open-meteo.com/v1/elevation?latitude={la}&longitude={lo}", timeout=30) as r:
            el = json.load(r)["elevation"]
    except (urllib.error.URLError, KeyError, ValueError) as e:
        print("parei:", e)
        break
    for i, e in zip(lote, el):
        b[i] = "1" if e is not None and e <= 1 else "0"
    time.sleep(8)

txt = "".join(b)
feito = txt.count("?") == 0
with open(os.path.join(out_dir, "mascara.json" if feito else "mascara_parcial.json"), "w") as f:
    json.dump({**G, "b": txt}, f, separators=(",", ":"))
print(f"contorno do mar: {N - txt.count('?')}/{N} pontos")
