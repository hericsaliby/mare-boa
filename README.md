# Maré Boa

Previsão de pesca para a Grande Florianópolis: junta vento (GFS, ECMWF ou ICON), ondas, maré, sol e lua, e aplica regras de abrigo por ponto. Exemplo: com vento sul, o Ribeirão da Ilha, Jurerê e Ingleses ficam abrigados, enquanto Pântano do Sul e Naufragados recebem o vento de frente.

## Como usar

É um único arquivo, `index.html`, sem servidor nem chave de API. Os dados vêm direto da Open-Meteo, que é gratuita e aceita chamadas do navegador.

- **No computador:** abra o `index.html` no navegador.
- **No celular:** hospede de graça no GitHub Pages ou no Netlify Drop (arraste a pasta) e salve na tela inicial.
- Sem internet, o app mostra a última previsão salva (até 36 h). Se não houver nenhuma, mostra dados de exemplo com um aviso.

## O que tem

O app é dividido em telas, com menu lateral no computador e abas embaixo no celular: **Resumo**, **Maré**, **Vento**, **Lua**, **Mapa** e **Mais**. No topo ficam o ponto e o dia escolhidos, que valem para todas as telas. O Resumo responde as três perguntas principais: a que horas a maré vira, como vai estar o vento no ponto e se a lua deixa a maré correr mais (cheia/nova) ou menos (quarto), mais uma linha do tempo do dia com tudo junto.

| Parte | Como funciona |
|---|---|
| **Mapa** | Mapa (ruas ou satélite) com todos os pontos e a nota do horário escolhido. Toque em qualquer lugar para soltar um pin: o app busca a previsão daquele local e calcula o abrigo sozinho. Depois é só dar um nome e salvar como "meu ponto". |
| **Abrigo automático do pin** | Para 16 direções, o app consulta a altitude do terreno (Copernicus DEM pela Open-Meteo) de 0,4 a 25 km de distância. Terra perto e morro alto naquela direção significam abrigo; água aberta por mais de 25 km significa ondulação de mar aberto. O tipo (costão, praia, baía) é sugerido e pode ser trocado. |
| **Meus pontos (privados)** | Pins salvos ficam só no aparelho de quem marcou; quem recebe o link não vê. Backup com "Exportar/Importar meus pontos" e importação do Google Maps: KML do Meus Mapas, "Saved Places.json" ou CSV de listas do Google Takeout, ou coordenadas coladas. |
| **Peixe alvo** | Seletor no topo (Robalo, Linguado, Tainha, Corvina, Anchova, Garoupa). Muda a nota, o ranking, o mapa, as janelas e a linha do tempo. Robalo: água abaixo de ~14 °C derruba a nota (para de comer, estudo da NOAA); noite e lusco-fusco pesam mais (Dantas & Barletta 2016); canais, pontes e mangue pontuam mais que praia; maré em movimento, principalmente nas primeiras horas após a virada; estofo cai; lua nova/cheia (maré forte; agregação de desova, PLoS ONE 2014); água turva depois de chuva ajuda em canais e baías. |
| **Frente fria** | Detectada na previsão (vento virando de norte para sul com força, pressão no mínimo e subindo depois), conferida nos 3 modelos. Alerta no Resumo com dia, hora e força; a véspera (até 36 h antes, pressão caindo) ganha pontos na nota, a passagem perde; tainha e anchova ganham no pós-frente. O dia aparece marcado na barra de dias. |
| **Pressão** | Card no Resumo com o valor, a tendência em 3 h e 24 h, o que significa para a pesca e um gráfico dos últimos 3 dias e de toda a previsão, com a frente marcada e o valor de cada hora ao tocar. |
| **Lua e solunar** | Fase com o desenho da lua como se vê do hemisfério sul, iluminação, idade, nascer, pôr e passagem da lua, períodos principais (~2 h em torno da lua no meridiano) e secundários (~1 h em torno do nascer e do pôr), nota de atividade de 1 a 4 para cada dia, curva de atividade hora a hora e as próximas fases com data. A fase da lua também entra na nota de pesca. |
| **Unidade do vento** | km/h por padrão, com opção de nós ou m/s no topo. |
| **Onde ir** | Ranking dos 18 pontos para o horário escolhido, com o motivo de cada nota (abrigado/exposto, maré, mar, lua). |
| **Abrigo** | Cada ponto tem uma rosa de exposição em 8 setores para vento e outra para ondulação. O vento "no ponto" é o vento aberto reduzido pelo abrigo. |
| **Modelos** | GFS, ECMWF IFS 0.25 e ICON. A faixa no gráfico mostra o quanto os modelos discordam: faixa larga significa previsão incerta. |
| **Painel de maré** | Para o ponto escolhido: se está enchendo ou vazando, a que horas é a próxima preamar ou baixamar, quanto ainda sobe ou desce, a velocidade em cm/h, as próximas 12 horas hora a hora e a tábua dos próximos dias ("enche 0,62 m até 09:40, 6h28"), com fase da lua e indicação de maré grande ou pequena. |
| **Marégrafo EPAGRI** | O app lê sozinho os marégrafos de Florianópolis e Imbituba do CIRAM (a cada 15 min) e a tábua oficial anual (CSV 2026–2030). Maré mostrada: medido até a última leitura → previsão MohidSC da EPAGRI ajustada ao medido → tábua oficial da EPAGRI com a maré meteorológica diminuindo aos poucos. Se o site da EPAGRI não responder, usa a cópia feita pelo robô do GitHub (branch `dados`, a cada 15 min). |
| **Maré** | Nível do mar do modelo marinho da Open-Meteo, com atraso e amplitude ajustados por ponto (a Lagoa, por exemplo, tem maré fraca e atrasada ~3 h). Dá para colar a tábua da Marinha para mais precisão. |
| **Nota 0–10** | Soma ponderada de vento no ponto, mar, movimento de maré, períodos de sol e lua (solunar), tendência de pressão e chuva. Os pesos mudam por tipo de ponto: em baía e canal a maré pesa mais, em costão o mar pesa mais. Mar grosso no costão ou rajada acima de 60 km/h limita a nota a 2 e marca como Perigoso. |
| **Histórico por ponto** | Em Resumo → "Registrar pescaria": espécie, quantidade, maior tamanho, isca, resultado e observações. Maré (enchendo/vazando e quanto tempo depois da virada), vento no ponto, lua e temperatura da água daquela hora são guardados sozinhos. O card "Histórico deste ponto" mostra as iscas que funcionaram, a maré, o horário, a lua e o vento das saídas boas, o que já saiu ali e avisa quando as condições de agora parecem com saídas boas suas. |
| **Diário + ML** | Cada registro guarda as condições daquela hora. Com 8 ou mais registros (com saídas boas e fracas), uma regressão logística aprende o que funciona para você e entra na nota (até 50% do peso). |
| **EPAGRI** | Importe o CSV horário de uma estação do CIRAM. O app compara com o modelo nas mesmas horas e corrige o vento por setor (MOS). |

## Scripts de ML (`ml/`)

```bash
pip install -r ml/requirements.txt

# Calibra o GFS com uma estação EPAGRI (meses de dados horários)
python ml/calibrar_gfs_epagri.py --csv estacao.csv --lat -27.60 --lon -48.55 \
    --unidade ms --modelo gfs_seamless --ponto ribeirao --saida calib.json
# depois importe calib.json no app: Dados > JSON de calibração

# Analisa o diário exportado do app
python ml/analisar_diario.py diario-pesca.json
```

O script de calibração usa a API de previsões históricas da Open-Meteo (o que o GFS previu de fato em cada hora), valida no período final dos dados para não superestimar o ganho e compara com um GradientBoosting.

O vento vem em km/h por padrão (dá para trocar para nós ou m/s no topo do app).

## Ajustar os pontos

Os pontos ficam na lista `SPOTS` no topo do script do `index.html`. Para cada um:

- `wx`: exposição ao vento vindo de `[N, NE, L, SE, S, SO, O, NO]`, de 0 (abrigado) a 1 (aberto)
- `sx`: o mesmo para a ondulação
- `t`: `costao`, `praia`, `baia`, `canal` ou `lagoa`
- `lag` / `amp`: atraso da maré em minutos e fator de amplitude
- `m`: ponto de mar usado para ondas e maré, quando o ponto fica dentro da baía

Os valores de exposição foram estimados pela geografia. Quem pesca nos pontos deve ajustá-los: é a parte que mais melhora a nota.

## Limitações

- A maré do modelo global é aproximada dentro das baías. Use a tábua da Marinha quando precisar do horário exato.
- Vento sul forte e prolongado pode subir a maré 20 a 40 cm acima da prevista (maré meteorológica).
- A EPAGRI não tem uma API pública estável, por isso a integração é por arquivo CSV.
- A nota é uma estimativa. Confira as condições no local antes de sair.
