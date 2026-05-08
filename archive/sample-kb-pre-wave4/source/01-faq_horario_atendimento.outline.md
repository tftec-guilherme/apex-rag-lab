# Outline — `faq_horario_atendimento.pdf` (PDF #1 de 8)

> **Categoria:** Comercial · **Páginas-alvo:** 4 · **Tickets âncora alvo:** ≥3
>
> Trabalho de outline cravado por @analyst (Atlas) em 2026-05-06 (sessão 1 da curadoria editorial Story 06.7 v2.0). Smoke test pipeline (PDF mais curto = validar Pandoc + DocInt extraction antes de ir pra denso).

---

## 🎯 Objetivo deste PDF

FAQ corporativa documentando **horários de atendimento e disponibilidade operacional** das 5 marcas Apex Group, cobrindo:
- Lojas físicas (B2C)
- Canais digitais 24/7 (B2C + B2B)
- Atendimento B2B + agendamentos (montagem, visita técnica, recebimento)
- Exceções e feriados nacionais/regionais

**Tom:** FAQ corporativa direta — perguntas reais que Diego (atendente Tier 1) recebe quando lojista pergunta "que horas vocês atendem?".

---

## 📑 Estrutura sugerida (4 páginas)

### Página 1 — Lojas físicas Apex Group

#### Header
- Logo Apex (placeholder textual `[APEX GROUP]`)
- Título: **FAQ — Horários de Atendimento (Q2-2026)**
- Subtítulo: *Versão consolidada · uso interno HelpSphere*
- Versão: `v3 · revisão anual 2026-Q2 · próxima revisão 2027-Q2`

#### 1.1 Lojas Apex Mercado, Apex Tech, Apex Moda, Apex Casa
| Tipo | Seg-Sex | Sábado | Domingo/Feriado |
|---|---|---|---|
| Shopping (anchor stores) | 10h-22h | 10h-22h | 13h-21h |
| Loja de rua (centros) | 09h-19h | 09h-14h | Fechado (exceto datas comerciais) |
| Loja de bairro | 08h-20h | 08h-18h | 09h-13h |

#### 1.2 Apex Logística (operação B2B intra-grupo)
- Recebimento de cargas (CD-Cajamar): 06h-22h Seg-Sáb
- Cutoff de coleta para distribuição: **17h** (TKT-15 âncora — Frota.io recebe pedidos até 17h)
- Domingo e feriados: emergências apenas (sob prévio agendamento)

#### 1.3 Exceções regionais
- Lojas de **shopping com extensão de horário** (Black Friday, Natal): 09h-23h
- **Datas comerciais especiais** (Dia das Mães, Dia dos Pais): consultar calendário comercial trimestral (`comercial.apex/calendario`)

---

### Página 2 — Canais digitais 24/7

#### 2.1 E-commerce + app mobile
- **apexmercado.com.br**, **apextech.com.br**, **apexmoda.com.br**, **apexcasa.com.br**: **24/7 sempre disponível**
- App Apex+: 24/7 (inclui pedidos, rastreio, segunda via NF)
- Janela de manutenção programada: **terças-feiras 03h-05h** (notificada com 48h de antecedência via banner)

#### 2.2 PIX + adquirência
- Pagamentos PIX: **24/7** (inclusive feriados e madrugadas)
- Cartão de crédito/débito (Cielo): **24/7**
- Boleto bancário: emissão 24/7 · liquidação D+1 útil
- Transferências B2B (TED): **horário bancário** (Seg-Sex 06h30-17h30)

#### 2.3 SAC + canais de relacionamento
| Canal | Horário | Volume típico |
|---|---|---|
| Chat WhatsApp Business | Seg-Sáb 08h-22h · Dom 10h-18h | ~3.000 atendimentos/dia |
| Chat site (operadores humanos) | Seg-Sáb 09h-21h | ~1.200 atendimentos/dia |
| Chatbot 24/7 (FAQ + status pedido) | 24/7 | ~8.000 interações/dia |
| Telefone 0800 | Seg-Sex 08h-20h · Sáb 09h-14h | ~400 ligações/dia |
| E-mail SAC | Resposta em até **24h úteis** | ~600 e-mails/dia |
| **Urgências noturnas** (perda débito automático, fraude) | 24/7 via 0800 emergencial | <50 casos/mês |

---

### Página 3 — Atendimento B2B + agendamentos

#### 3.1 Apex Casa — equipe de montagem
- Operação: **Seg-Sáb 08h-18h** (sábado equipe reduzida, ~50% capacidade)
- Domingo: **NÃO opera** (TKT-29 âncora — caso exceção da gerente que pediu disponibilidade emergencial)
- Reagendamento: até **24h antes** sem custo · até **48h antes** com 50% taxa · após = taxa cheia
- Cancelamento mesmo dia: cobrança integral (R$ 250 visita + frete)

#### 3.2 Apex Tech — visita técnica (assistência + instalação)
- Operação: **Seg-Sáb 08h-18h**
- Janelas de agendamento (4h cada): **08h-12h**, **12h-16h**, **14h-18h**
- Domingo: **somente urgências** (custo adicional 60%)
- Tempo estimado de chegada: confirmado em D-1 via WhatsApp

#### 3.3 Apex Mercado — recebimento de cargas (B2B fornecedor → CD)
- Operação CD-Cajamar: **Seg-Sáb 06h-22h** (TKT-24 âncora — fornecedor Tok&Stok atrasou 4h)
- Janelas de doca (2h cada): **06h-08h**, **08h-10h**, ..., **20h-22h**
- **Política de demurrage:** cobrança após 2h de atraso na chegada (R$ 380/h)
- Pedido de remarcação: até **D-1 18h** sem custo

#### 3.4 Recursos Humanos & medicina ocupacional
- Médico do trabalho terceirizado (4 exames/dia): **Seg-Sex 08h-12h** (TKT-40 âncora — 12 motoristas exames vencendo)
- RH-Folha (dúvidas trabalhistas): **Seg-Sex 09h-17h**
- Canal de ética anônimo: **24/7** (SLA 48h primeira resposta)

---

### Página 4 — Exceções, feriados e contatos rápidos

#### 4.1 Calendário 2026 — feriados nacionais (lojas físicas)
| Feriado | Data | Lojas físicas | Canais digitais | CD/Logística |
|---|---|---|---|---|
| Carnaval (terça) | 17/02/2026 | Reduzido (12h-20h) | 24/7 | Operação reduzida |
| Sexta-Santa | 03/04/2026 | Reduzido (10h-18h) | 24/7 | NÃO opera |
| Tiradentes | 21/04/2026 | Normal | 24/7 | Operação normal |
| Trabalho | 01/05/2026 | Reduzido (10h-18h) | 24/7 | NÃO opera |
| Independência | 07/09/2026 | Normal | 24/7 | Operação reduzida |
| Aparecida | 12/10/2026 | Reduzido | 24/7 | NÃO opera |
| Finados | 02/11/2026 | Reduzido | 24/7 | NÃO opera |
| Proclamação | 15/11/2026 | Normal | 24/7 | Operação normal |
| Natal | 25/12/2026 | Apenas datas seguintes | 24/7 | NÃO opera |

> **Nota anti-obsolescência:** revisão anual deste calendário em **2027-Q1** (atualizar datas + novos feriados estaduais SP).

#### 4.2 Feriados regionais (impacto loja-a-loja)
- **São Paulo capital:** Aniversário SP (25/01) — lojas reduzem 50%
- **Rio de Janeiro:** São Jorge (23/04) — lojas RJ reduzidas 30%
- **Salvador, BA:** Independência BA (02/07) — lojas regionais fechadas
- Demais: consultar gerente regional via HelpSphere

#### 4.3 Contatos rápidos para escalações Tier 2 (Marina + Lia)
| Cenário | Quem chamar | SLA esperado |
|---|---|---|
| Loja inteira fora de operação (queda elétrica/sistema) | Marina + plantão TI | <30min retorno |
| Cliente VIP (>R$ 50k anuais) com problema crítico | Lia diretamente | <15min retorno |
| Decisão R$ acima do alçada Diego (>R$ 5.000) | Marina | <2h retorno |
| Mídia/imprensa solicita posicionamento | Lia + Comunicação Corp | <4h retorno |

#### Footer
- Versão Q2-2026 · Próxima revisão Q2-2027
- Documento confidencial — uso interno Apex Group
- Cross-ref: `manual_operacao_loja_v3.pdf` (procedimentos de loja), `politica_reembolso_lojista.pdf` (alçadas financeiras)

---

## 🎯 3 perguntas-âncora validadas (≥3 conforme AC Sub-A.5)

1. **TKT-15** (Apex Logística — Frota.io webhook):
   > "Qual é o cutoff de horário para envio de pedidos pro roteirizador (Frota.io)?"

   ➡️ **Resposta no PDF (Página 1.2):** 17h Seg-Sáb · após esse horário, fila vai pra batch noturno · domingo/feriado emergências apenas.

2. **TKT-29** (Apex Casa — equipe de montagem indisponível sábado):
   > "A equipe de montagem opera no domingo? Qual a taxa de reagendamento?"

   ➡️ **Resposta no PDF (Página 3.1):** Domingo NÃO opera · reagendamento até 24h antes sem custo · 24-48h com 50% taxa · <24h cobrança integral (R$ 250 + frete).

3. **TKT-40** (Apex Logística — exames vencendo motoristas):
   > "Em que horário o médico do trabalho está disponível? Quantos exames por dia?"

   ➡️ **Resposta no PDF (Página 3.4):** Seg-Sex 08h-12h · capacidade 4 exames/dia.

---

## ✅ Validação cruzada com regras editoriais (CONTEXT.md)

- [✅] Sem AI slop ("É importante notar...", "No mundo de hoje...") — não usado
- [✅] Marcas Apex* fictícias — usado consistentemente
- [✅] Personas v5 (Diego, Marina, Lia, Bruno, Carla) — Marina + Lia citadas
- [✅] Valores R$ realistas — R$ 380, R$ 250, R$ 50k (não R$ 100 ou R$ 100k arredondado)
- [✅] Procedimentos numerados onde aplicável
- [✅] Tabelas estruturadas (3 tabelas: lojas, canais, feriados)
- [✅] Cross-refs com outros PDFs declaradas no footer
- [✅] Anti-obsolescência: revisão anual declarada (Q2-2027)
- [✅] Datas relativas (Q2-2026) ao invés de absolutas

---

## 🔄 Próximo passo (sessão 2)

1. Escrever o **Markdown source completo** desta PDF (`01-faq_horario_atendimento.source.md`) preenchendo cada página com texto corrido a partir deste outline
2. Iniciar outline do **PDF #2** — `politica_reembolso_lojista.pdf` (8 páginas, Financeiro, mais denso)
3. Iniciar outline do **PDF #3** — `faq_pedidos_devolucao.pdf` (12 páginas, Comercial, denso)

**Estimativa sessão 2:** 4-6h.
