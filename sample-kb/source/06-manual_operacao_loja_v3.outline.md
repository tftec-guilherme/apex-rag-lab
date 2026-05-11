# Outline — `manual_operacao_loja_v3.pdf` (PDF #6 de 8)

> **Categoria:** Operacional · **Páginas-alvo:** 47 (mais denso do conjunto — smoke test target) · **Tickets âncora alvo:** ≥3 (target real: 8 — TKT-24, TKT-21, TKT-26, TKT-7, TKT-22, TKT-23, TKT-28, TKT-19)
>
> Manual operacional consolidado das lojas Apex Group v3 — recebimento, estocagem, exposição, picking, expedição, atendimento, cleaning, SOPs, KPIs operacionais. Cravado por @analyst (Atlas) na curadoria Story 06.7 v2.0 Grand Finale.

---

## 🎯 Objetivo deste PDF

Manual operacional unificado para gerência e supervisão das lojas físicas Apex Group (12 marcas, 340 lojas) e do CD-Cajamar. Documento de referência usado por:
- Gerentes de loja e supervisores de turno
- Operadores de doca e WMS no CD-Cajamar
- Atendentes Tier 1 do HelpSphere (Diego) quando lojista pergunta procedimento operacional
- Auditoria interna trimestral

**Tom:** procedimental denso (texto corrido + tabelas + listas numeradas + cabeçalhos H1-H3 alternados). Estruturado em 9 capítulos cobrindo o ciclo operacional completo. Anti-pattern: evitar bullets de 3 linhas redundantes — preferir tabelas estruturadas.

---

## 📑 Estrutura sugerida (47 páginas · 9 capítulos)

### CAPÍTULO 1 — Visão geral operacional (3 pg · P1-P3)

#### P1 · 1.1 Apex Group operacional
- Holding: 12 marcas declaradas · 340 lojas físicas · 8.000 colaboradores · R$ 4.8B faturamento Q1-2026 anualizado
- 5 marcas seed: Apex Mercado, Apex Tech, Apex Moda, Apex Casa, Apex Logística (versus 7 contextuais: ApexFashion, ApexHogar, ApexBabe, ApexFood, ApexSports, ApexBeauty, ApexFarma)
- CDs: Cajamar (master, 47.000 m²) + 6 regionais
- Versão consolidada `v3 · revisão Q2-2026 · próxima revisão Q2-2027`

#### P2 · 1.2 Estrutura organizacional típica de loja
- Tabela: papéis × responsabilidade × alçada × reporta-a
  - Gerente de loja (alçada R$ 5.000) → Gerente regional
  - Supervisor de turno (alçada R$ 1.500) → Gerente de loja
  - Líder de setor (sem alçada R$, autoridade técnica) → Supervisor
  - Atendente / vendedor / repositor / fiscal de prevenção → Líder
- Headcount típico por porte: anchor shopping (45-65), loja de rua centro (18-28), loja de bairro (8-14)

#### P3 · 1.3 KPIs operacionais consolidados
- Tabela KPIs × meta × frequência × responsável:
  - NPS loja física (meta ≥72, mensal, gerente)
  - Conversão pisada→checkout (meta ≥18%, semanal, supervisor)
  - Ticket médio por marca (meta varia por marca, diário, supervisor)
  - Ruptura de gôndola (meta ≤2.5%, diário, líder)
  - Perda operacional (meta ≤0.8% do faturamento, mensal, gerente)
  - Aderência ao planograma (meta ≥95%, quinzenal, líder)
- Cross-ref `faq_pedidos_devolucao.pdf` (NPS pós-venda) e `politica_reembolso_lojista.pdf` (perda financeira)

---

### CAPÍTULO 2 — Recebimento de mercadorias (8 pg · P4-P11)

#### P4 · 2.1 Doca CD-Cajamar — janelas e cutoff
- Operação **Seg-Sáb 06h-22h** · domingo apenas emergências mediante prévio agendamento
- Janelas de 2h: 06h-08h, 08h-10h, 10h-12h, 12h-14h, 14h-16h, 16h-18h, 18h-20h, 20h-22h
- **Cutoff D-1 18h** para remarcação sem custo
- Capacidade simultânea: 12 docas (8 secas + 2 refrigeradas + 2 congeladas)
- TKT-24 âncora (caminhão Apex Casa atrasou 4h)

#### P5 · 2.2 Política de demurrage
- Cobrança de R$ 380/h após 2h de atraso (TKT-24)
- Tabela faixa atraso × cobrança × decisão de desembarque:
  - 0-2h: tolerância (sem cobrança)
  - 2h-4h: R$ 380/h · desembarque normal
  - 4h-6h: R$ 380/h · prioridade da doca cai (entra fila se outras chegam pontuais)
  - >6h: cobrança integral + recusa formal (carga volta ao fornecedor)
- Cláusula contratual padrão Apex Group: anexo I do contrato master de fornecedor

#### P6 · 2.3 Cold chain — limites ANVISA
- Tabela tipo de produto × limite legal × tolerância Apex × ação se excedido:
  - Hortifruti folhoso: 8°C (TKT-21 âncora — caminhão chegou a 14°C)
  - Hortifruti não-folhoso: 12°C
  - Laticínios refrigerados: 5°C
  - Carnes resfriadas: 4°C
  - Congelados: −18°C (tolerância pontual −15°C, registrada)
  - Vacinas/imunobiológicos (Apex Mercado farmácia interna): 2-8°C, sem tolerância
- Datalogger obrigatório · TKT-21 carga R$ 47.300 — protocolo: receber se for descartar ANTES da aceitação fiscal, ou recusar e CAT no transportador

#### P7 · 2.4 Conferência cega vs com romaneio
- **Conferência cega:** operador não vê o romaneio durante contagem · sistema confirma após sealed-input (padrão Apex Mercado e Apex Tech)
- **Conferência com romaneio:** operador vê quantidade esperada · usada apenas para cargas críticas (eletrodomésticos linha branca, cargas com lacre violado)
- Procedimento numerado P1-P8 da conferência cega standard

#### P8 · 2.5 Auditoria de avaria
- TKT-22 âncora (3 TVs Samsung QLED 75" com tampa de palete amassada)
- Tabela tipo de avaria × ação imediata × evidência × decisão final:
  - Embalagem externa íntegra + interna íntegra: aceita normal
  - Embalagem externa danificada + interna íntegra: aceita com nota fiscal de avaria (não recusa, apenas anota)
  - Embalagem externa danificada + interna comprometida: rejeição parcial (essas SKUs) ou total (se sistêmico)
  - Embalagem com sinais de violação (lacre rompido): rejeição imediata + acionar prevenção de perdas
- Rastreio RFID do palete (TKT-22 — Apex Tech rastreou histórico de manuseio)

#### P9 · 2.6 Rejeição parcial vs total
- Procedimento numerado para emissão de **NF de devolução** (CFOP 5202 dentro do estado, 6202 interestadual)
- Tabela quem decide × valor da decisão × prazo:
  - Operador de doca: rejeição até R$ 5.000 (registro no WMS basta)
  - Supervisor de doca: rejeição R$ 5.001 a R$ 25.000 (formulário + foto)
  - Coordenador CD-Cajamar: rejeição R$ 25.001 a R$ 100.000 (formulário + foto + ata + e-mail comercial)
  - Diretor de operações: rejeição >R$ 100.000 (escalação imediata para Lia + jurídico)

#### P10 · 2.7 Carga divergente (peças trocadas)
- TKT-7 âncora (loja Iguatemi recebeu caixa C-1247 com 30% das peças P em vez de M e G)
- Procedimento: 1) congelar a caixa fisicamente · 2) registrar foto SKU × romaneio · 3) abrir chamado HelpSphere categoria Operacional · 4) negociar cross-docking expresso com origem · 5) auditar separação no CD origem
- KPI de divergência ≤0.5% por carga · acima disso treinamento mandatório turma da tarde
- Cross-ref `faq_pedidos_devolucao.pdf` seção 4.2

#### P11 · 2.8 Romaneio digital + RFID + tag de palete
- Stack tecnológico:
  - WMS Manhattan Associates Active WM 2024.1 (TKT-30 — upgrade aplicado)
  - RFID UHF Zebra FX9600 (leitura em túnel de doca)
  - Etiqueta de palete: Code 128 + GS1-128 (SSCC)
- Tag RFID obrigatória em: linha branca Apex Tech (>R$ 800 unitário), perecíveis Apex Mercado (cold chain), itens Apex Casa >R$ 1.500
- Procedimento de leitura no túnel: 1 segundo por palete · taxa de leitura ≥99,4% (KPI mensal)

---

### CAPÍTULO 3 — Estocagem (5 pg · P12-P16)

#### P12 · 3.1 Endereçamento WMS — picking face
- Modelo de endereço: `[ZONA]-[CORREDOR]-[NÍVEL]-[POSIÇÃO]` (ex: A-12-03-04 = zona seca A, corredor 12, nível 03, posição 04)
- Picking face: 1 SKU = 1 endereço de altura ergonômica (níveis 01-02 · até 1.70m)
- Reposição automática quando picking face atinge ≤20% da capacidade · regra do WMS

#### P13 · 3.2 Reserve + slow-moving
- **Reserve:** níveis 03-08 (acima de 1.70m) · acessado via empilhadeira elétrica · transferido para picking face por ordem do WMS
- **Slow-moving:** zona Z (corredores 60-72 do CD-Cajamar) · giro <0.8/mês · revisão trimestral para descontinuação
- Tabela giro × zona × frequência de inventário cíclico:
  - Giro A (>4/mês): inventário semanal
  - Giro B (1.5-4/mês): inventário quinzenal
  - Giro C (0.8-1.5/mês): inventário mensal
  - Giro D (<0.8/mês): inventário trimestral

#### P14 · 3.3 FIFO/FEFO para perecíveis
- FIFO (First In, First Out): padrão geral
- **FEFO (First Expired, First Out)**: obrigatório para perecíveis Apex Mercado e medicamentos Apex Farma
- Procedimento numerado P1-P6 com etiqueta de validade visível à leitura do WMS
- Política de retirada antecipada: SKUs com ≤7 dias de validade vão para vitrine de oferta (-30% a -50%) · ≤3 dias para descarte controlado (com NF de quebra)

#### P15 · 3.4 Segregação de produtos químicos e inflamáveis
- Zona G (corredor 88-96 do CD-Cajamar) · piso impermeável · ralo de contenção
- Lista de SKUs sensíveis: acetona (NCM 2914.11.00), tinner (NCM 3814.00.00), álcool gel 70% (NCM 2207.10.10), aerossóis (NCM 3303.00.20)
- Distância mínima de 5m de fontes de ignição · extintor classe B + classe C a cada 8m
- Treinamento NR-20 obrigatório para operadores da zona G · 16h carga inicial + 4h reciclagem anual

#### P16 · 3.5 Inventário cíclico vs geral
- **Cíclico:** rotativo por giro (semanal/quinzenal/mensal/trimestral)
- **Geral:** anual obrigatório (encerra ano fiscal) · contagem dupla cega
- TKT-26 âncora (inventário do estoque seco com divergência 2,3% — limite 1%)
- Tabela divergência × ação:
  - 0-1%: tolerância (ajuste contábil silencioso)
  - 1-2%: alerta supervisor · análise por SKU
  - 2-3%: alerta coordenador · auditoria detalhada · suspeita de quebra/furto/erro de baixa
  - >3%: alerta gerência de operações · auditoria forense · acionar prevenção de perdas

---

### CAPÍTULO 4 — Exposição e PDV físico (6 pg · P17-P22)

#### P17 · 4.1 Layout planograma por categoria
- Categoria × marca × layout responsável:
  - Hortifruti Apex Mercado: planograma master corporativo (atualizado quinzenalmente · enviado pelo categórico de Cajamar)
  - Eletrônicos Apex Tech: planograma negociado fornecedor (Samsung, LG, Apple) revisado mensalmente
  - Fashion Apex Moda: planograma sazonal (4 coleções/ano + 2 campanhas especiais)
  - Casa Apex Casa: planograma temático (vitrines a cada 21 dias)
- KPI aderência planograma ≥95% (auditoria visual quinzenal pelo supervisor de loja + 1x/mês foto-auditoria corporativa)

#### P18-P19 · 4.2 Reposição
- TKT-19 âncora (impressora Zebra ZD230 com offset 3mm — paliativos enquanto técnico não chega)
- Stack reposição: ZD230 em ponta de gôndola + RF-gun Zebra TC52 nos repositores
- Procedimento numerado P1-P12 para reposição matinal (06h-09h):
  1. Conferir lista de ruptura do dia anterior (sistema)
  2. Imprimir etiquetas no ZD230 do setor
  3. Confirmar gap (sensor de marca preta)
  4. Validar cores (offset ≤1mm horizontal · ≤0.5mm vertical)
  5. Reposição por zona, começando alto-giro (zona A1)
  6. Bipar SKU no RF-gun antes de colocar na prateleira
  7. Confirmar planograma (foto comparativa quando aplicável)
  8. Lançar perdas/quebras encontradas (NF de quebra)
  9. Auditar primeira venda do SKU reposto (loja monitora primeiros 30 min)
  10. Encerrar lista no sistema
  11. Sinalizar gôndola crítica para o supervisor
  12. Encerrar ronda matinal · entregar relatório para o líder
- Quebra ZD230: troca em até 4h dentro do contrato Zebra Brasil · enquanto isso, etiquetagem manual com etiqueta-A (modelo de fallback impressa em laser)
- KPI ruptura ≤2.5% por loja · auditoria diária 14h e 19h

#### P20 · 4.3 Etiquetagem de preços
- TKT-23 âncora (8 pedidos da campanha Outubro Rosa com SKUs trocados — códigos terminam em 4747 vs 4774)
- Padrão de etiqueta:
  - Código de barras EAN-13 + leitura PLU + descrição abreviada (≤28 char) + preço grande + preço promocional riscado quando aplicável
  - QR Code de fidelidade (programa Apex+) opcional
- Auditoria PROCON: 1 visita/loja/trimestre · checagem de 50 SKUs aleatórios
- Validação pré-venda: 4-eyes principle em campanhas (Outubro Rosa, Black Friday, Natal) — duas leituras independentes do SKU antes de subir o preço para o sistema · CHECK obrigatório quando 2+ SKUs têm dígito-base parecido

#### P21 · 4.4 Política antifurto
- Stack prevenção:
  - Alarme acústico-magnético (EAS) por gôndola sensível (vinhos, perfumaria, eletroportáteis)
  - Lacre de alta valor (>R$ 800) com chip RFID
  - Monitoramento CFTV 24/7 com retenção 30 dias (LGPD compliance — ver `politica_dados_lgpd.pdf` seção 6.2)
  - Fiscal de prevenção em loja (não uniformizado · cobertura aleatória)
- TKT-27 (lote 60 iPhone 15 Pro com lacre violado · R$ 480k) → procedimento de incidente de violação: 1) congelar lote · 2) auditoria + foto · 3) acionar PF + jurídico · 4) registrar em sistema de incidentes
- KPI perda operacional ≤0.8% do faturamento mensal · valores acima escalam para Marina + Bruno (CTO sobre integridade do CFTV)

#### P22 · 4.5 Limpeza diária
- Cronograma fixo (horários por marca):
  - Apex Mercado: 05h-07h (antes da abertura) + ronda contínua 11h-14h + fechamento 22h-23h30
  - Apex Tech: 09h-09h30 (antes da abertura shopping) + ronda 14h-14h30 + fechamento
  - Apex Casa: 08h-09h + ronda 14h + fechamento
  - Apex Moda: 09h-10h + ronda 15h + fechamento
- Checklist 14 itens (banheiros 2x/dia · espelhos · piso · vitrines · provadores · caixa · gôndolas · ar condicionado · iluminação · sinalização · saída de emergência · estoque)
- Insumos por SKU + valor mensal médio: pano descartável R$ 380/loja/mês · álcool 70% R$ 240 · saco preto R$ 180 · papel higiênico R$ 420

---

### CAPÍTULO 5 — Atendimento ao cliente (5 pg · P23-P27)

#### P23 · 5.1 Saudação padrão + tom Apex
- Roteiro padrão de abordagem (≤8 segundos, sem pressão):
  - "Bem-vindo à Apex [Marca]. Posso ajudar a achar algo específico ou prefere olhar com calma?"
- Anti-padrão: NÃO seguir o cliente · NÃO repetir pergunta a cada gôndola
- Tom Apex: cordialidade + competência + assertividade · sem servilismo, sem familiaridade excessiva
- Treinamento de saudação: 4h no onboarding + reciclagem 2h/ano

#### P24 · 5.2 Operação POS NFC-e
- Stack POS: terminal Linx Big + impressora térmica Bematech MP-4200 + leitor Honeywell MS9540 + pinpad Cielo LIO
- Fluxo básico de venda:
  1. Bipar SKU(s)
  2. Aplicar fidelidade Apex+ (CPF ou telefone)
  3. Solicitar forma de pagamento
  4. Confirmar valor
  5. Processar adquirência (Cielo)
  6. Emitir NFC-e (transmissão SEFAZ ≤3s · TKT-11 ocorreu travamento 30-45s em PDV com >8 itens — ver `runbook_problemas_rede.pdf` seção 4)
  7. Imprimir cupom + entregar
  8. Encerrar
- Cross-ref `manual_pos_funcionamento.pdf` (manual completo POS) e `runbook_sap_fi_integracao.pdf` (integração POS→SAP FI)

#### P25 · 5.3 Fluxo de devolução em loja
- Tabela motivo × prazo × decisão × alçada:
  - Defeito de fabricação (visível): 0-90 dias · troca imediata · Diego (Tier 1)
  - Defeito de fabricação (oculto): 0-90 dias · troca após laudo técnico · Marina (Tier 2)
  - Arrependimento CDC art. 49 (compras online retirada loja): 7 dias · estorno integral · Diego
  - Tamanho/medida errado (fashion): 30 dias · troca ou estorno · Diego
  - Solicitação fora do prazo CDC: caso-a-caso · cortesia até R$ 5.000 · Marina · acima Lia
- Cross-ref `faq_pedidos_devolucao.pdf` (políticas comerciais completas) e `politica_reembolso_lojista.pdf` (alçadas financeiras)

#### P26 · 5.4 Programa fidelidade Apex+
- Pontuação: 1 ponto por R$ 1 gasto · 1 ponto = R$ 0.05 em desconto (efeito cashback ~5%)
- Tiers: Apex Basic (default) · Apex Plus (≥R$ 12k/ano, +30% pontos) · Apex Premium (≥R$ 40k/ano, +50% pontos + linha VIP + frete grátis ilimitado)
- Cupons da semana: enviados via push/SMS toda quinta às 11h
- Cross-ref política completa em portal interno · não documentada em PDF do sample-kb (escopo Apex Marketing)

#### P27 · 5.5 Reclamações in loco
- Tabela natureza × resolução 1ª linha × escalação:
  - Erro de preço (gôndola vs PDV): honrar preço de gôndola (CDC art. 30) · Diego decide até R$ 200 · acima Marina
  - Produto sem etiqueta: consultar PLU no terminal · cobrar valor confirmado pelo gerente · Diego
  - Atendimento ruim (queixa do cliente): pedir desculpa formal + cupom Apex+ 200 pts (R$ 10) cortesia · Marina decide acima
  - Suspeita de produto adulterado: NÃO vender · isolar o SKU · escalar para Marina + prevenção de perdas
- Política de não-confrontação: nunca alegar publicamente "cliente errado" · sempre "vamos verificar e voltamos com a resposta"

---

### CAPÍTULO 6 — Expedição B2B (5 pg · P28-P32)

#### P28 · 6.1 Picking B2B com lista do CD
- B2B = pedidos de lojistas, restaurantes, hotéis, escritórios · tipicamente >R$ 5.000 ticket médio
- Lista de picking gerada pelo WMS · ordenada por endereço (otimização de rota)
- TKT-28 âncora (loja Iguatemi pediu reposição expressa coleção masculina · 67% vendido em 4 dias)
- Procedimento cross-docking expresso: 1) WMS prioriza · 2) operador A faz picking · 3) operador B confere · 4) coordenador autoriza expedição · 5) carga sai mesmo dia (D0 antes 14h, D+1 se após 14h)

#### P29 · 6.2 Conferência cega de saída
- Operador de saída NÃO vê quantidade esperada · faz contagem sealed-input
- Divergência permitida: ±1 unidade em pedidos com ≥20 SKUs · 0 em pedidos críticos (linha branca, eletrônicos >R$ 5.000 unitário)
- TKT-7 vinculado (caso entrada · mesmo princípio na saída — divergência detectada na origem)

#### P30 · 6.3 Documentação fiscal
- Documentos obrigatórios em expedição B2B:
  - NF-e (CFOP 5102 venda dentro do estado · 6102 interestadual · 5403 ST · etc)
  - DANFE impresso
  - ROMANEIO digital (assinado no app do motorista)
  - MDF-e quando o transporte é próprio Apex Logística
  - CT-e quando transporte terceirizado
- Tempo de processamento NF-e ≤3s (SEFAZ-SP) · contingência offline em caso de queda SEFAZ (TKT-11 cenário) — emissão local com chave provisória, retransmissão automática quando SEFAZ volta
- Cross-ref `runbook_sap_fi_integracao.pdf` (integração SAP FI → SEFAZ)

#### P31 · 6.4 Carga consolidada vs fracionada
- **Consolidada:** 1 caminhão = 1 lojista (B2B grande, ≥10 paletes) · saída CD-Cajamar direta
- **Fracionada:** 1 caminhão = N lojistas (cross-docking regional) · saída CD-Cajamar → CD regional → entrega
- Tabela porte × tipo × SLA:
  - Anchor shopping (1 destino, ≥15 paletes): consolidada D+1
  - Loja de rua centro (1 destino, 5-14 paletes): consolidada D+1 SP · D+2 interior · D+3 outras UFs
  - Loja de bairro (5-10 paletes): fracionada via CD regional · D+2 a D+4
  - Lojistas terceiros B2B (1-30 paletes): fracionada · D+1 a D+5 conforme SLA contratual

#### P32 · 6.5 SLA de entrega por região
- Tabela região × SLA padrão × SLA expresso × custo expresso:
  - Grande SP (anel viário): D+1 · D0 mesmo dia · +R$ 240
  - Interior SP: D+2 · D+1 · +R$ 420
  - Demais Sudeste (RJ, MG, ES): D+3 · D+2 · +R$ 680
  - Sul (RS, SC, PR): D+4 · D+2 · +R$ 980
  - Centro-Oeste + Bahia: D+5 · D+3 · +R$ 1.240
  - Norte + Nordeste (exceto BA): D+7 · D+5 · +R$ 1.870
- Política de quebra de SLA: cliente recebe cupom Apex+ R$ 100 por dia de atraso a partir do dia D+1 acima do prometido

---

### CAPÍTULO 7 — Logística reversa (4 pg · P33-P36)

#### P33 · 7.1 Recebimento de devolução
- Tabela origem × estado × ação:
  - Cliente final B2C (em loja): triagem imediata pelo Diego · OK → estoque revenda · avaria → caminho 7.2
  - Cliente final B2C (via transportadora): conferência cega no CD-Cajamar · regra igual à acima
  - Lojista B2B (devolução por troca de coleção): conferência com romaneio · revenda como outlet
  - Lojista B2B (devolução por divergência de pedido, TKT-7 cenário): conferência com romaneio · ajuste de NF
- Procedimento numerado P1-P9 para devolução B2C em loja
- Cross-ref `faq_pedidos_devolucao.pdf` (políticas comerciais)

#### P34 · 7.2 Triagem para vitrine de outlet vs descarte
- Outlet Apex: rede paralela de 6 lojas (Vila Olímpia, Pinheiros, Tatuapé, Mooca, Penha, Vila Mariana) recebendo SKUs com pequena avaria estética + fim de coleção + amostras
- Tabela estado × destino × preço:
  - Defeito estético leve: outlet · -40% sobre tabela
  - Defeito estético médio: outlet · -55% sobre tabela
  - Defeito funcional reversível: oficina interna (reparo) · retorna outlet -40%
  - Defeito funcional irreversível: descarte controlado · NF de quebra
- Outlet recebe peças exclusivas + Apex+ Premium tem acesso prioritário (programa interno)

#### P35 · 7.3 Reverse fulfillment integrado com CD
- WMS suporta SKUs "reverse-tag" (códigos de barras diferenciados para marcar entrada de logística reversa)
- Reverse-tag obrigatória em: linha branca (Apex Tech), móveis (Apex Casa), eletrônicos >R$ 800
- Tempo médio de processamento reverso D+2 a D+5 (do recebimento à decisão de destino)
- KPI reverse fulfillment rate (% devoluções processadas no SLA): meta ≥92%

#### P36 · 7.4 Garantia técnica + chamado de assistência
- Garantia legal CDC: 90 dias para bens de consumo · 30 dias para serviços
- Garantia de fábrica: varia por categoria · 12 meses (eletrodomésticos linha branca, eletrônicos) · 6 meses (peças e acessórios)
- Garantia estendida Apex (produto financeiro, gestão Cardif): contratável 1 a 3 anos adicionais
- Procedimento numerado P1-P7 para abertura de chamado de assistência (cliente → app/0800 → técnico → laudo → decisão)
- Cross-ref `faq_pedidos_devolucao.pdf` seção 5 (garantia estendida)

---

### CAPÍTULO 8 — Performance e auditoria (6 pg · P37-P42)

#### P37 · 8.1 KPIs operacionais por loja (mensal)
- Painel consolidado entregue ao gerente de loja todo dia 5 do mês seguinte:
  - NPS loja · ticket médio · conversão · ruptura · perda · aderência planograma · giro médio · NPS pós-venda · cobertura escala · banco de horas saldo
- Comparativo vs loja peer (mesmo porte/região) · vs mês anterior · vs meta corporativa
- Reunião mensal de operação: gerente + supervisores · 2h fixas dia 10 · plano de ação 30 dias

#### P38 · 8.2 Auditoria interna trimestral
- Checklist 80 itens distribuídos em 8 blocos:
  1. Documentação (10 itens — alvarás, AVCB, ANVISA quando aplicável, contratos com fornecedores)
  2. Recebimento e doca (10 itens)
  3. Estocagem (10 itens)
  4. Exposição e PDV (10 itens)
  5. Atendimento e devolução (10 itens)
  6. Operação POS e fiscal (10 itens)
  7. RH e jornada (10 itens)
  8. Limpeza e EPI (10 itens)
- Critério de aprovação: ≥72/80 pontos (90%)
- Reprovação: plano de ação com prazo 30 dias + reauditoria
- Auditor responsável: rotativo entre lojas (nunca audita a própria loja)

#### P39 · 8.3 Auditoria externa ANVISA (lojas com fresh)
- Aplica-se a lojas Apex Mercado, Apex Farma, Apex Beauty (subset com fresh)
- Frequência: 1 visita/ano (varia conforme classificação de risco da loja)
- Pontos críticos:
  - Cold chain (cf. seção 2.3 deste manual)
  - Validade de produtos
  - Higienização de equipamentos
  - Controle de pragas (contrato Rentokil ou equivalente)
  - Capacitação de manipuladores (curso boas práticas, 8h carga inicial)
- TAC ANVISA quando notificado: prazo de 30 a 90 dias para regularização

#### P40 · 8.4 Auditoria externa Receita Federal SPED
- SPED Fiscal + SPED Contribuições + SPED Reinf + EFD-Reinf + ECD
- Transmissões mensais:
  - SPED Fiscal: dia 25 do mês seguinte
  - SPED Contribuições: dia 25 do mês seguinte
  - EFD-Reinf: dia 15 do mês seguinte
- Cross-ref `politica_reembolso_lojista.pdf` seção 7 (tratamento de tributos)
- Em caso de fiscalização: gerência financeira corporativa coordena resposta · loja apenas fornece documentação solicitada

#### P41 · 8.5 Treinamento obrigatório
- Admissão (40h primeiros 7 dias úteis):
  - Cultura Apex (4h)
  - Operação POS (8h)
  - Cold chain (4h, apenas Apex Mercado/Farma/Beauty fresh)
  - LGPD básico (4h) — ver `politica_dados_lgpd.pdf` seção 8
  - Atendimento Apex (4h)
  - Prevenção de perdas (4h)
  - Saúde e segurança (4h)
  - Avaliação prática supervisionada (8h)
- Reciclagem anual (16h):
  - Atualizações de procedimento (4h)
  - LGPD reciclagem (2h)
  - Cold chain reciclagem (2h, aplicável)
  - NR-20 reciclagem (4h, aplicável zona G)
  - Cultura Apex (2h)
  - Avaliação (2h)

#### P42 · 8.6 Saúde ocupacional
- Médico do trabalho terceirizado (parceiro Apex+Med): 4 exames/dia · Seg-Sex 08h-12h (TKT-40 âncora — 12 motoristas vencendo em 30 dias)
- Exames periódicos obrigatórios:
  - Admissional, periódico, demissional, retorno ao trabalho, mudança de função
  - Motoristas: toxicológico (Lei do Caminhoneiro · Lei 13.103/2015) + audiometria + clínico geral
  - Operadores de empilhadeira: clínico + ortopédico
  - Repositores com manuseio >25kg/dia: clínico + ortopédico
- CIPA: eleição anual · reuniões mensais · ata enviada ao eSocial S-2240

---

### CAPÍTULO 9 — Anexos e referências (5 pg · P43-P47)

#### P43 · 9.1 Tabela de feriados nacionais 2026
- Tabela feriado × data × lojas físicas × CD/logística:
  - Confraternização (01/01) · reduzido · NÃO opera
  - Carnaval (17/02 ter) · reduzido 12h-20h · reduzida
  - Sexta-Santa (03/04) · reduzido 10h-18h · NÃO opera
  - Tiradentes (21/04) · normal · normal
  - Trabalho (01/05) · reduzido 10h-18h · NÃO opera
  - Corpus Christi (04/06) · reduzido · reduzida
  - Independência (07/09) · normal · reduzida
  - Aparecida (12/10) · reduzido · NÃO opera
  - Finados (02/11) · reduzido · NÃO opera
  - Proclamação (15/11) · normal · normal
  - Consciência Negra (20/11, em SP) · normal · normal
  - Natal (25/12) · NÃO opera · NÃO opera

#### P44 · 9.2 Contatos de escalação
- Tabela cenário × quem chamar × SLA esperado · responde-a:
  - Operacional rotina · Diego (Tier 1 HelpSphere)
  - Operacional exceção / alçada >R$ 5.000 · Marina (Tier 2) · <2h
  - Operacional crítico / impacto >R$ 50.000 · Lia (Head Atendimento) · <30min
  - Infra/TI estrutural · Bruno (CTO) · 2h
  - Aprovação financeira >R$ 100.000 · Carla (CFO) · 4h
- Cross-ref `faq_horario_atendimento.pdf` seção 4.3

#### P45 · 9.3 Glossário operacional Apex
- 30 entradas de jargão operacional ordenadas alfabeticamente:
  - Anchor store · CD-Cajamar · Cold chain · Cross-docking · Datalogger · Demurrage · EAS · FEFO · FIFO · GS1-128 · NFC-e · NF-e · Palete fechado · Picking face · Planograma · PLU · Reverse-tag · RFID · Romaneio · SAC · SAP FI · SEFAZ · Sealed-input · Slow-moving · SSCC · TAC · Tier 1/2/3 · WMS · ZD230

#### P46 · 9.4 Cross-references com outros PDFs do sample-kb
- Tabela referência × seção × tópico:
  - `faq_pedidos_devolucao.pdf` § 4-5 · políticas comerciais de devolução e garantia
  - `runbook_sap_fi_integracao.pdf` § 2-3 · integração POS → SAP FI → SEFAZ
  - `manual_pos_funcionamento.pdf` § completo · operação detalhada do PDV
  - `runbook_problemas_rede.pdf` § 4 · TKT-11 timeout NFC-e SEFAZ
  - `politica_reembolso_lojista.pdf` § 3, 7 · alçadas financeiras + SPED
  - `faq_horario_atendimento.pdf` § 1, 3, 4 · horários e calendário operacional
  - `politica_dados_lgpd.pdf` § 6.2, 8 · CFTV LGPD e treinamento

#### P47 · 9.5 Footer + versão
- Versão `v3 · Q2-2026 · próxima revisão Q2-2027`
- Documento confidencial · uso interno Apex Group
- Aprovação: Lia (Head Atendimento) + Bruno (CTO) + Carla (CFO)
- Distribuição: gerentes de loja · supervisores · coordenadores de CD · auditoria interna
- Versões anteriores arquivadas: v1 (Q2-2024) · v2 (Q2-2025) · v3 (Q2-2026 — esta)
- Próxima major revisão: v4 Q2-2027 (planejada após rollout do WMS Manhattan 2025.1 + módulo de visão computacional na auditoria de doca)

---

## 🎯 8 perguntas-âncora validadas (excede o ≥3 do AC)

1. **TKT-24** (Apex Casa — caminhão atrasou 4h doca CD-Cajamar):
   > "Como aplicar demurrage quando fornecedor atrasa 4h na doca?"
   ➡️ **Resposta no PDF (CAP 2 / P4-P5):** janela 08h-10h, atraso configura cobrança após 2h (R$ 380/h). Para 4h de atraso: R$ 760 sobre demurrage + perda de prioridade na doca. Decisão de desembarque cabe ao coordenador CD-Cajamar.

2. **TKT-21** (Apex Mercado — hortifruti chegou a 14°C):
   > "Recebemos carga de hortifruti folhoso a 14°C — recebe ou recusa?"
   ➡️ **Resposta no PDF (CAP 2 / P6):** limite ANVISA 8°C para folhoso. 14°C viola legal. Carga de R$ 47.300 deve ser RECUSADA (acionar CAT no transportador) ou recebida só com objetivo de descarte controlado ANTES da aceitação fiscal. Vigilância sanitária notificada.

3. **TKT-26** (Apex Mercado — inventário com divergência 2,3% em estoque seco):
   > "Inventário cíclico apontou 2,3% de divergência (R$ 18.700). Qual procedimento?"
   ➡️ **Resposta no PDF (CAP 3 / P16):** acima do limite tolerável 1%. Faixa 2-3% = alerta coordenador + auditoria detalhada + suspeita de quebra/furto/erro de baixa. Concentração em premium (azeite/vinho/queijo) sugere prevenção de perdas atuante.

4. **TKT-7** (Apex Moda — coleção inverno com SKUs trocados PDV Iguatemi):
   > "Carga divergente com 30% peças trocadas. Como proceder?"
   ➡️ **Resposta no PDF (CAP 2 / P10):** procedimento 5 passos: congelar fisicamente, fotografar SKU × romaneio, abrir HelpSphere Operacional, negociar cross-docking expresso, auditar separação no CD origem. Treinamento obrigatório turma da tarde.

5. **TKT-22** (Apex Tech — 3 TVs Samsung 75" com tampa de palete amassada):
   > "Linha branca chegou com avaria de palete. Aceitar ou recusar?"
   ➡️ **Resposta no PDF (CAP 2 / P8):** embalagem externa danificada + interna íntegra → aceita com NF de avaria. Rastreio RFID do palete confirma histórico de manuseio. Decisão final: receber + monitoramento integridade nos primeiros 30 dias de garantia.

6. **TKT-23** (Apex Moda — 8 SKUs trocados na separação Outubro Rosa):
   > "Como prevenir troca de SKUs com código barras parecido (4747 vs 4774)?"
   ➡️ **Resposta no PDF (CAP 4 / P20):** 4-eyes principle obrigatório em campanhas. Quando 2+ SKUs têm dígito-base parecido (CHECK match): duas leituras independentes antes de subir preço no sistema. Treinamento turma da tarde se reincidir.

7. **TKT-28** (Apex Moda — loja Iguatemi pediu reposição expressa coleção masculina):
   > "Loja vendeu 67% em 4 dias. Como acionar cross-docking expresso?"
   ➡️ **Resposta no PDF (CAP 6 / P28):** procedimento 5 passos: WMS prioriza · operador A faz picking · operador B confere · coordenador autoriza · saída D0 antes 14h ou D+1 após. Custo expresso conforme tabela seção 6.5.

8. **TKT-19** (Apex Casa — impressora Zebra ZD230 desalinhada 3mm offset):
   > "ZD230 imprimindo etiquetas com offset 3mm. O que fazer enquanto o técnico não chega?"
   ➡️ **Resposta no PDF (CAP 4 / P18-P19):** validação visual (offset ≤1mm horizontal · ≤0.5mm vertical). Quebra → contrato Zebra Brasil garante troca em 4h. Fallback: etiquetagem manual com modelo A (impressão em laser). Não pausar reposição.

---

## ✅ Validação cruzada com regras editoriais (CONTEXT.md)

- [✅] Sem AI slop ("É importante notar...", "No mundo de hoje...") — não usado
- [✅] Marcas Apex* fictícias consistentes (12 marcas declaradas · 5 seed + 7 contextuais)
- [✅] Personas v5 (Diego, Marina, Lia, Bruno, Carla) — todas citadas com papel ativo
- [✅] Valores R$ realistas — R$ 47.300 (TKT-21), R$ 380/h (TKT-24), R$ 18.700 (TKT-26), R$ 480k (TKT-27), R$ 1.247 (TKT-5 demurrage histórico)
- [✅] Jargão BR real — CFOP 5102/5202/6102/6202, ANVISA, ANTT, NFC-e, NF-e, SEFAZ-SP, SPED Fiscal, SPED Contribuições, EFD-Reinf, CDC art. 30/49, NR-20, CIPA, CAT, eSocial S-2240, MDF-e, CT-e, SSCC, GS1-128, EAN-13
- [✅] Procedimentos numerados (P1-P12 reposição matinal, P1-P9 devolução B2C, etc)
- [✅] Tabelas estruturadas (20+ tabelas — porte/horário, demurrage, cold chain, KPIs, devolução, etc)
- [✅] Cross-references com 7 outros PDFs (todos os outros do sample-kb)
- [✅] Anti-obsolescência: revisão Q2-2027 declarada
- [✅] Datas relativas (Q2-2026)
- [✅] 8 tickets âncora vinculados (TKT-7, TKT-19, TKT-21, TKT-22, TKT-23, TKT-24, TKT-26, TKT-28) — total +5 ticket "vinculado" (TKT-11, TKT-27, TKT-30, TKT-40, TKT-5)
- [✅] 47 páginas distribuídas em 9 capítulos com densidade procedural
- [✅] Smoke test target — PDF mais denso do sample-kb (~47.000 palavras)

---

## 🔄 Próximo passo

1. Escrever o **Markdown source completo** desta PDF (`06-manual_operacao_loja_v3.source.md`) preenchendo cada página (~1.000 palavras) a partir deste outline
2. Conversão Pandoc → PDF/A-2b
3. Smoke test Document Intelligence `prebuilt-layout` (target threshold ≥95% extração textual)
4. Em caso de aprovação: commit no `apex-rag-lab` + handoff @dev para bump `apex-helpsphere v2.2.0` (substituição dos 11 `[KB]` antigos pelos 8 canônicos)
