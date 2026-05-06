# CONTEXT — Curadoria editorial sample-kb (Story 06.7 v2.0)

> Worksheet de referência cravado por **@analyst (Atlas)** em 2026-05-06 para servir como fonte de verdade durante toda a curadoria dos 8 PDFs.
>
> `version-anchor: Q2-2026` · Vinculado a `apex-helpsphere v2.1.0` seeds (50 tickets pt-BR, 5 tenants Apex)

---

## 🎯 Cenário guarda-chuva — Apex Group

**Holding varejista brasileira fictícia** que serve como cenário pedagógico de toda a Disciplina 06. Persona arquetipal: arquiteto sênior pós-graduação que reconhece e respeita realismo brasileiro (NF-e, SPED, eSocial, PIX, ANVISA, ANTT, Cielo, Bacen).

| Atributo | Valor |
|---|---|
| Nome holding | **Apex Group** |
| Setor | Varejo multi-vertical (B2B + B2C) |
| Tamanho | 12 marcas declaradas · 8.000 colaboradores · 340 lojas físicas |
| Faturamento anual | R$ 4.8B |
| Sede | São Paulo capital + CDs em Cajamar e regional |
| HelpSphere | Central B2B operacional — atende lojistas das marcas, NÃO consumidores finais |

### 5 marcas seed (subset das 12 declaradas — em produção `apex-helpsphere v2.1.0`)

| Tenant ID | Marca | Vertical | Cor pedagógica |
|---|---|---|---|
| `11111111-1111-...` | **Apex Mercado** | Supermercado · alta rotatividade · perecíveis | NF-e B2B, SPED, hortifruti, ANVISA cold chain |
| `22222222-2222-...` | **Apex Tech** | Eletrônicos + linha branca | Garantia, instalação, integração ERP↔E-commerce |
| `33333333-3333-...` | **Apex Moda** | Fashion (sazonal) | Devoluções, tamanhos, coleções, campanhas |
| `44444444-4444-...` | **Apex Casa** | Móveis e decor (logística pesada) | Montagem, contrato corporativo, leasing frota |
| `55555555-5555-...` | **Apex Logística** | Operação B2B intra-grupo | SLA, doca, motoristas, ANTT |

### 7 marcas restantes (para curadoria pode mencionar contextualmente)
ApexFashion, ApexHogar, ApexBabe, ApexFood, ApexSports, ApexBeauty, ApexFarma (NÃO usar marcas reais como Magalu, Americanas, Renner — sempre `Apex*` fictício).

---

## 👥 Personas v5 (consolidadas pelo prof)

| Persona | Papel | Use em conteúdo |
|---|---|---|
| **Diego** | Atendente Tier 1 (HelpSphere) | Recebe ticket, executa procedimento padrão |
| **Marina** | Supervisora Tier 2 | Recebe escalações, decide casos exceção |
| **Lia** | Head de Atendimento | Define políticas, valida exceções de alto valor |
| **Bruno** | CTO | Decisões técnicas estruturais |
| **Carla** | CFO/CTO (varia por contexto) | Aprovações financeiras, programa Apex IA |

**Regras de uso:**
- Sempre nome próprio + papel (ex: "Marina (supervisora) decide...")
- Não inventar novos personagens — reciclar os 5
- Não usar pronomes ambíguos ("ele/ela") quando o nome resolve

---

## 📚 Mapeamento 11→8 (course-correction Opção C confirmada 2026-05-06)

**Sub-task transversal cravada:** vai gerar **bump `apex-helpsphere v2.1.0 → v2.2.0` com Decisão #24** (substituir 11 referências `[KB]` antigas pelos 8 canônicos da Story 06.7). Trabalho do **@dev** após esta curadoria entregar os 8 PDFs.

### Os 8 PDFs canônicos (Story 06.7 v2.0)

| # | PDF | Páginas | Categoria | Tickets âncora (target ≥3) |
|---|---|---|---|---|
| 1 | `manual_operacao_loja_v3.pdf` | 47 | Operacional | TKT-24, TKT-21, TKT-26, TKT-7, TKT-22, TKT-23, TKT-28, TKT-19 |
| 2 | `runbook_sap_fi_integracao.pdf` | 22 | TI | TKT-3, TKT-12, TKT-15 |
| 3 | `faq_pedidos_devolucao.pdf` | 12 | Comercial | TKT-1, TKT-2, TKT-4, TKT-7, TKT-10, TKT-19, TKT-22 |
| 4 | `politica_reembolso_lojista.pdf` | 8 | Financeiro | TKT-5, TKT-41, TKT-42, TKT-43, TKT-44, TKT-45, TKT-46, TKT-48 |
| 5 | `manual_pos_funcionamento.pdf` | 35 | Operacional | TKT-11 (POS NFC-e congelando), procedimentos POS gerais |
| 6 | `runbook_problemas_rede.pdf` | 18 | TI | TKT-15, TKT-16, TKT-17, TKT-18, TKT-20 |
| 7 | `faq_horario_atendimento.pdf` | 4 | Comercial | TKT-29 (montagem sábado), TKT-40 (exames médicos), TKT-15 (cutoff Frota) |
| 8 | `politica_dados_lgpd.pdf` | 15 | RH/compliance | TKT-31, TKT-32, TKT-33, TKT-34, TKT-36, TKT-37, TKT-38, TKT-39 |

**Total páginas:** 161 (alvo Story 06.7 ≤25MB total)

### Mapeamento conceitual 11 PDFs antigos → 8 canônicos

| `[KB]` antigo no seed | Migra para |
|---|---|
| `politica-devolucoes` | `faq_pedidos_devolucao` (Comercial) + parcialmente `politica_reembolso_lojista` (Financeiro) |
| `nfe-rejeicoes-comuns` | `runbook_sap_fi_integracao` (TI — integração ERP↔SEFAZ) |
| `garantias-estendidas` | `faq_pedidos_devolucao` (Comercial — FAQ pedidos) |
| `troubleshooting-pdv` | `manual_pos_funcionamento` (Operacional — POS) |
| `arquitetura-integracao` | `runbook_sap_fi_integracao` (TI — integração corp) |
| `sped-fiscal-troubleshooting` | `politica_reembolso_lojista` (Financeiro — fiscal) |
| `postmortem-blackfriday-2025` | `runbook_problemas_rede` (TI — escalonamento app) |
| `politica-doca-recebimento` | `manual_operacao_loja_v3` (Operacional — recebimento) |
| `politicas-rh-gestacao` | `politica_dados_lgpd` (RH — políticas + LGPD em atendimento RH) |
| `retencoes-tributarias-pj` | `politica_reembolso_lojista` (Financeiro — tributos) |
| `sped-contribuicoes-erros` | `politica_reembolso_lojista` (Financeiro — fiscal) |

---

## ✏️ Regras editoriais não-negociáveis

### Tom + qualidade

- **Linguagem corporativa varejista BR** — coerente com Apex Group production-grade
- **Jargão real:** NFC-e, NF-e, SAP FI, SPED, PIX, eSocial, ANTT, ANVISA, CFOP, IRRF, INSS, MEI, CCT, ECF, CTPS, FGTS, CDC, LGPD, etc.
- **Sem hedging vazio:** corte "talvez", "pode-se", "em alguns casos pode" — afirmar com confiança
- **Estrutura visual:** texto corrido + tabelas estruturadas + listas numeradas + cabeçalhos H1-H3 (variar pra OCR-friendly)

### ❌ Anti-padrões EDITORIAIS (zero tolerância)

- ❌ "É importante notar que…"
- ❌ "É importante destacar que…"
- ❌ "No mundo dinâmico do varejo de hoje…"
- ❌ "Em última análise…"
- ❌ "Em conclusão…"
- ❌ "Conforme mencionado anteriormente…"
- ❌ Listas com 3+ bullets dizendo a mesma coisa de jeito diferente
- ❌ Marcas reais (Magalu, Americanas, Casas Bahia, Renner, Riachuelo) — sempre `Apex*`
- ❌ Datas absolutas que envelhecem ("em janeiro de 2026...") — usar `Q2-2026` ou "trimestre vigente"
- ❌ Nomes de pessoas reais — sempre Diego/Marina/Lia/Bruno/Carla
- ❌ Pronomes ambíguos ("ele/ela") — repetir nome próprio

### ✅ Padrões editoriais positivos

- ✅ Citação de **valores R$ realistas** (R$ 47.300, R$ 1.870, NÃO R$ 1.000 ou R$ 100.000)
- ✅ Citação de **CNPJ fictícios brasileiros válidos** (formato `XX.XXX.XXX/0001-XX`)
- ✅ Citação de **CFOP, CST, NCM** com códigos reais (ex: CFOP 5102, NCM 2204.21.00)
- ✅ **Procedimentos passo-a-passo numerados** quando descrever fluxo operacional
- ✅ **Tabelas de exceções** com linha-coluna estruturadas
- ✅ **Cross-reference entre PDFs** (ex: "ver Manual Operação Loja seção 3.4")

---

## 📐 Especificações técnicas (PDF/A-2b OCR-friendly)

### Layout
- Margens: 2.5cm sup/inf, 2cm lat (impressão limpa)
- Fonte corpo: **Inter** ou **Source Sans Pro** (sans-serif clássica)
- Fonte código/dados: **JetBrains Mono** ou **IBM Plex Mono**
- Sem watermarks pesados, sem imagens decorativas
- Tabelas: bordas leves (#ccc), alternar fundo linhas (#f7f7f7) pra leitura

### PDF compliance
- **PDF/A-2b** (compatibilidade arquivamento)
- Tamanho máximo: **5MB por PDF**
- Total ~25MB (8 PDFs)
- Fontes embedded (sem dependência fonte do sistema)

### Smoke test obrigatório
- Document Intelligence `prebuilt-layout` em **1 PDF aleatório** (recomendo `manual_operacao_loja_v3.pdf` 47 pgs como mais denso)
- **Threshold:** extração ≥95% do conteúdo textual sem perda
- **Falha:** voltar pra edição (provavelmente fonte exótica, layout em colunas mal formatadas, imagens com texto)

---

## 🧱 Workflow de execução por PDF

Cada PDF segue este pipeline padrão:

```
1. Outline detalhado .md  →  2. Markdown source completo .md  →  3. Smoke test (DocInt em rascunho)  →  4. PDF/A-2b final via Pandoc  →  5. Smoke test (DocInt em final)  →  6. Commit no apex-rag-lab
```

### Output estrutura no repo

```
apex-rag-lab/
├── sample-kb/
│   ├── CONTEXT.md (este arquivo)
│   ├── README.md (mapping → PDF → categoria → tipo de pergunta)
│   ├── source/                          # ← Markdown sources committed
│   │   ├── 01-faq_horario_atendimento.outline.md
│   │   ├── 01-faq_horario_atendimento.source.md
│   │   ├── 02-politica_reembolso_lojista.outline.md
│   │   ├── ...
│   │   └── 08-runbook_problemas_rede.source.md
│   └── (PDFs finais como artefatos)     # ← gerados via Pandoc, committed também
│       ├── manual_operacao_loja_v3.pdf
│       ├── ...
│       └── politica_dados_lgpd.pdf
```

---

## 🚦 Status & roadmap

| Sessão | Entregável | Status |
|---|---|---|
| **Sessão atual (2026-05-06 ~2h)** | CONTEXT.md + outline PDF #1 (`faq_horario_atendimento`) + bootstrap pasta | 🔄 em curso |
| Sessão 2 (~4-6h) | Source MD `faq_horario_atendimento` completo + outline PDFs #2 (`politica_reembolso_lojista`) e #3 (`faq_pedidos_devolucao`) | ⏳ pendente |
| Sessão 3 (~4-6h) | Source MD #2 e #3 + outline #4 (`politica_dados_lgpd`) e #5 (`runbook_sap_fi_integracao`) | ⏳ pendente |
| Sessão 4 (~6-8h) | Source MD #4-#8 + setup Pandoc + conversão dos 8 → PDF | ⏳ pendente |
| Sessão 5 (~2h) | Smoke tests Document Intelligence + PDF/A-2b validation + commit final + handoff @dev pra bump apex-helpsphere v2.2.0 | ⏳ pendente |

**Estimativa total:** 18-24h trabalho criativo distribuído em 5 sessões dedicadas.

---

## 📝 Cross-references

- Story 06.7 v2.0: `azure-retail/docs/stories/06.7.assets-complementares-labs.md`
- Epic Pendências v5 v3.1: `azure-retail/docs/stories/epics/epic-disciplina-06-pendencias/epic.md`
- Tickets seed: `apex-helpsphere/data/seed/tickets.sql` (50 tickets, 11 `[KB]` references — a substituir em v2.2.0)
- Tenants seed: `apex-helpsphere/data/seed/tenants.sql` (5 tenants Apex)
- Schema: `apex-helpsphere/data/migrations/001_initial_schema.sql`
- Pattern arquitetural: `feedback_bicep_validates_portal_mirrors.md` (memory)
- Filosofia macro: `feedback_dont_reinvent_d06_labs_ready.md` (memory)
- Decisão estrutural: `feedback_validate_apex_improvements_during_dependent_labs.md` (sub-task transversal)
