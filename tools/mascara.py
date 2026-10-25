"""Monta aos poucos o relevo (altitude do terreno) da Grande Florianópolis, em ~850 m.

Fonte: altitude da Open-Meteo (Copernicus DEM). Serve para:
- o contorno do mar no mapa (altitude <= 1 m conta como água);
- calcular o abrigo de um pin novo direto no celular, sem consultar nada lá fora.
A Open-Meteo limita consultas por minuto, então cada rodada do robô busca só um pedaço
e guarda o progresso em relevo_parcial.json até completar relevo.json.
"""
import json
import os
import shutil
import sys
import time
import urllib.error
import urllib.request

old_dir, out_dir = sys.argv[1], sys.argv[2]
G = {"la0": -28.35, "lo0": -49.15, "st": 0.008, "nla": 170, "nlo": 126}
N = G["nla"] * G["nlo"]
POR_RODADA = 2000


def ok(m):
    return m and all(m.get(k) == v for k, v in G.items()) and len(m.get("h", [])) == N


def ler(nome):
    try:
        with open(os.path.join(old_dir, nome)) as f:
            return json.load(f)
    except Exception:
        return None


pronto = ler("relevo.json")
if ok(pronto):
    shutil.copy(os.path.join(old_dir, "relevo.json"), out_dir)
    sys.exit(0)

p = ler("relevo_parcial.json")
h = list(p["h"]) if ok(p) else [None] * N
faltam = [i for i, v in enumerate(h) if v is None][:POR_RODADA]
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
        h[i] = 0 if e is None else max(0, int(round(e)))
    time.sleep(8)

feito = all(v is not None for v in h)
with open(os.path.join(out_dir, "relevo.json" if feito else "relevo_parcial.json"), "w") as f:
    json.dump({**G, "h": h}, f, separators=(",", ":"))
print(f"relevo: {sum(v is not None for v in h)}/{N} pontos")
