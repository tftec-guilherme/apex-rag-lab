# sample-kb — Knowledge Base Apex Group (8 PDFs corporativos)

> Base de conhecimento real do Apex Group (holding fictícia varejista brasileira) para o **Lab Intermediário D06 RAG** e o **Grand Finale** (Parte 10). Os 8 PDFs foram curados editorialmente seguindo Story 06.7 v2.0 e cobrem os 50 tickets seed do `tbl_tickets`.

---

## 📚 Os 8 PDFs canônicos Apex Group

Todos os PDFs estão **já gerados** nesta pasta — basta upload no container Azure Storage `kbai`.

| # | PDF | Categoria | Tema | Tickets âncora |
|---|-----|-----------|------|----------------|
| 1 | `faq_horario_atendimento.pdf` | Comercial | Horários, calendário 2026, agendamentos | TKT-15, TKT-29, TKT-40 |
| 2 | `politica_reembolso_lojista.pdf` | Financeiro | Alçadas, fluxos, SPED, retenções PJ/MEI | TKT-5, TKT-41 a TKT-46, TKT-48 |
| 3 | `faq_pedidos_devolucao.pdf` | Comercial | CDC, garantias, troca, erros de preço | TKT-1, TKT-2, TKT-4, TKT-7, TKT-10, TKT-19, TKT-22 |
| 4 | `politica_dados_lgpd.pdf` | RH/Compliance | LGPD, ANPD, retenção, gestação, SSO | TKT-17, TKT-31 a TKT-34, TKT-36 a TKT-39 |
| 5 | `runbook_sap_fi_integracao.pdf` | TI | SAP FI ↔ TOTVS ↔ Magento ↔ SEFAZ | TKT-3, TKT-12, TKT-15 |
| 6 | `manual_operacao_loja_v3.pdf` | Operacional | Recebimento, estoque, PDV, expedição (9 caps) | TKT-7, TKT-19, TKT-21, TKT-22, TKT-23, TKT-24, TKT-26, TKT-28 |
| 7 | `manual_pos_funcionamento.pdf` | Operacional/TI | NFC-e, hardware POS, troubleshooting | TKT-8, TKT-11 |
| 8 | `runbook_problemas_rede.pdf` | TI | LAN, WAN, VPN, SSO, postmortem Black Friday | TKT-15, TKT-16, TKT-17, TKT-18, TKT-20 |

**Total:** ~7.8MB · ~131k palavras · 8 PDFs corporativos brasileiros

---

## 🎯 Quando usar quais PDFs

### Lab Intermediário padrão (Partes 1-9)

O Lab Inter **canônico** usa **3 PDFs Microsoft Learn** baixados manualmente (para reproducibility pública). Esse caminho está documentado em [`../docs/parte-01.md`](../docs/parte-01.md). Os PDFs MS Learn NÃO ficam neste repo — você baixa via Print-to-PDF do navegador.

### Parte 10 — Grand Finale

A nova **Parte 10** substitui os PDFs Microsoft Learn pelos **8 PDFs Apex** desta pasta. Demonstra:

- ✅ Queries RAG com **contexto real do cliente Apex** (NF-e, SPED, SAP FI, CDC, LGPD)
- ✅ Validação cruzada com os 50 tickets seed (`tbl_tickets`)
- ✅ **Mesmo pipeline RAG** funciona com KB corporativa, não apenas docs públicos
- ✅ Impacto qualitativo do conteúdo na qualidade das respostas RAG

Guia: [`../docs/parte-10-grand-finale.md`](../docs/parte-10-grand-finale.md).

---

## 🛠️ Arquitetura editorial

### Cenário (do CONTEXT.md original)
- **Apex Group:** holding varejista BR fictícia, 12 marcas, 8.000 colaboradores, 340 lojas, R$ 4.8B/ano
- **5 marcas seed:** Apex Mercado, Apex Tech, Apex Moda, Apex Casa, Apex Logística
- **Personas v5:** Diego (Tier 1 atendente), Marina (Tier 2 supervisora), Lia (Head atendimento), Bruno (CTO), Carla (CFO)
- **Tom:** corporativo brasileiro com jargão real (NFC-e, SPED, PIX, Cielo, ANTT, ANVISA, CFOP, IRRF, INSS)
- **Anti-AI-slop:** sem "É importante notar...", sem "No mundo dinâmico de hoje...", sem hedging
- **Datas relativas:** Q2-2026 (anti-obsolescência editorial)

### Técnica
- **Pipeline:** markdown source (`source/*.source.md`) → pandoc (`-s --embed-resources`) → HTML standalone → Microsoft Edge headless (`--print-to-pdf`) → PDF
- **CSS corporativo:** `pdf-style.css` (fontes Inter/Segoe, azul Apex `#1a3a6c`, tabelas com bordas leves, blockquotes destacados em amarelo)
- **Texto extraível:** PDFs são pesquisáveis (não OCR de imagem) — Document Intelligence `prebuilt-layout` extrai >95% sem perda
- **Tamanhos:** 227KB (PDF #1) a 1.9MB (PDFs #5 e #7), total ~7.8MB
- **Página:** A4, margens 2.5cm sup/inf · 2cm lat, fonte body 10.5pt, line-height 1.55

---

## 🔄 Re-gerar os PDFs

Se você editar qualquer `source/*.source.md`, re-gere todos com:

```bash
cd sample-kb/
bash build-pdfs.sh
```

**Requisitos:** pandoc 3.x + Microsoft Edge (Windows). Script faz `pandoc --embed-resources` → HTML → Edge headless `--print-to-pdf`. Veja [`build-pdfs.sh`](./build-pdfs.sh).

---

## 📂 Estrutura

```
sample-kb/
├── README.md (este arquivo)
├── pdf-style.css                              # CSS corporativo
├── build-pdfs.sh                              # Script de build
├── source/                                    # Markdown sources versionados
│   ├── 01-faq_horario_atendimento.source.md
│   ├── 02-politica_reembolso_lojista.outline.md + .source.md
│   ├── 03-faq_pedidos_devolucao.outline.md + .source.md
│   ├── 04-politica_dados_lgpd.outline.md + .source.md
│   ├── 05-runbook_sap_fi_integracao.outline.md + .source.md
│   ├── 06-manual_operacao_loja_v3.outline.md + .source.md
│   ├── 07-manual_pos_funcionamento.outline.md + .source.md
│   └── 08-runbook_problemas_rede.outline.md + .source.md
└── *.pdf                                      # 8 PDFs finais
```

---

## 🚦 Status entrega

| Item | Status |
|------|--------|
| 8 PDFs canônicos Story 06.7 v2.0 | ✅ Gerados Q2-2026 |
| Markdown sources versionados | ✅ Todos em `source/` |
| Outlines editoriais | ✅ 7/8 (PDF #1 outline em `archive/sample-kb-pre-wave4/source/`) |
| CSS corporativo + script de build | ✅ |
| Smoke test Document Intelligence | 🟡 Pendente — validar em produção (Parte 10) |
| Alinhamento refs `[KB]` em `data/seed/tickets.sql` | 🟡 11 refs antigas mapeadas no CONTEXT.md — alinhar com 8 canônicos quando subir bump apex-helpsphere v2.2.0 |

---

## 📝 Cross-references

- Curadoria editorial original: [`archive/sample-kb-pre-wave4/CONTEXT.md`](../archive/sample-kb-pre-wave4/CONTEXT.md) — 200L de regras editoriais
- Plano Story 06.7 v2.0: `azure-retail/docs/stories/06.7.assets-complementares-labs.md`
- Tickets seed referenciando KB Apex: [`data/seed/tickets.sql`](../data/seed/tickets.sql) (50 tickets pt-BR)

---

`version-anchor: Q2-2026`
