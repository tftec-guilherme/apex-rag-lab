# CHANGES — apex-rag-lab

> Diff vs guia v5 original `Disciplina_06_*/01_Aulas/Lab_Intermediario_RAG_HelpSphere_Guia_Portal.md` + roadmap de versões.
>
> `version-anchor: Q2-2026`

---

## v0.2.0 (2026-05-09) — Wave 4 restored ★

### Status

**ATIVO.** Companion público restaurado após reversão da deprecation 2026-05-08. Conteúdo Wave 4 cravado: guia integral 9 partes (~2070 linhas), scripts Python copy-paste em `snippets/`, instruções dos 3 PDFs públicos Microsoft Learn em `sample-kb/`.

### Diff vs v0.1.0-init

- ❌ **Removido (arquivado em `archive/`):**
  - `docs/01-pre-requisitos.md` → `docs/10-cleanup.md` (10 capítulos da arquitetura Cognitive Search Skillset)
  - `docs/troubleshooting.md` (versão pre-Wave 4 — sucessor reescrito)
  - `snippets/data-source.json`, `indexer.json`, `index-schema.json`, `skillset.json`, `query-rag-sample.http`
  - `sample-kb/CONTEXT.md` (200 linhas de curadoria @analyst para 8 PDFs proprietários)
  - `sample-kb/source/01-faq_horario_atendimento.outline.md`
- ✅ **Adicionado:**
  - `docs/00-guia-completo.md` — guia integral Wave 4 (cópia ativa do canônico no monorepo `azure-retail`, ~2074 linhas)
  - `docs/parte-01.md` → `docs/parte-09.md` — thin wrappers para navegação parte-a-parte
  - `docs/troubleshooting.md` — erros comuns Wave 4 (RBAC 403, vector dim mismatch 3072, rate limit 429, OCR baixa qualidade, Translator detect falso, Function App cold start)
  - `snippets/index_pdfs.py` — chunking layout-aware via Document Intelligence
  - `snippets/create_search_index.py` — schema vector field 3072 dim
  - `snippets/index_to_search.py` — embeddings + populates index
  - `snippets/function_app.py` — orquestrador `/chat/rag`
  - `snippets/eval_rag.py` — precision@5 + latency + custo
  - `snippets/requirements.txt` — Python deps
  - `snippets/test_vision_ocr.sh`, `test_translator.sh`, `test_chat_rag.http` — testes
  - `sample-kb/README.md` — instruções Print-to-PDF dos 3 PDFs Microsoft Learn
  - `archive/` (raiz) — preservação histórica de pre-Wave 4 com `archive/README.md` explicando contexto
- 🔄 **Atualizado:**
  - `README.md` — remove banner DEPRECATED, status ATIVO Wave 4, arquitetura 4 services AI + Function App
  - `PARA-O-ALUNO.md` — Quick Start, 7 surpresas pedagógicas catalogadas, custo realista R$ 21-29 mesmo dia, regra de ouro `az group delete`
  - `DECISION-LOG.md` — Decisões #6 (reversão deprecation), #7 (Skillset → Python imperativo), #8 (3 PDFs públicos), #9 (Standard S1)
  - `CHANGELOG.md` — entrada v0.2.0
  - `CHANGES.md` — este arquivo

### Diff vs guia atual no monorepo (`azure-retail/.../Lab_Intermediario_RAG_HelpSphere_Guia_Portal.md`)

- ✅ **Mantido 1:1:** todos os 9 capítulos, comandos `az`, scripts Python, JSONs, screenshots-placeholders
- 🆕 **Adicionado neste repo (não existe no monorepo):**
  - Header companion-público no topo de `docs/00-guia-completo.md` (cross-links para snippets, sample-kb, apex-helpsphere)
  - Thin wrappers `parte-01.md` → `parte-09.md` para navegação rápida
  - Snippets isolados (no monorepo o código está inline no markdown)
  - `archive/` com referência histórica
- 🔄 **Source of truth:** o monorepo `azure-retail` é a fonte canônica do guia. Este repo público recebe sync downstream a cada bump v0.X.0.

### Política de sync com monorepo

Toda mudança no `Lab_Intermediario_RAG_HelpSphere_Guia_Portal.md` no monorepo deve gerar PR neste repo público dentro de 24-48h, com bump de patch (v0.2.0 → v0.2.1). Bumps minor (v0.2.x → v0.3.0) são para mudanças estruturais (nova Parte, mudança de modelo, mudança de tier).

---

## v0.1.0-init (2026-05-06)

### Status
**Bootstrap** — skeleton em construção. Conteúdo será adicionado em sessões dedicadas pela Story 06.7 do Epic Pendências v5 D06.

### Diff vs guia v5 original
- ✅ **Mantido:** estrutura pedagógica passo-a-passo Portal Azure
- ✅ **Mantido:** 8 PDFs sample-kb canônicos (lista exata especificada na v5 linhas 36-46)
- ✅ **Mantido:** filosofia anti-AI-slop em conteúdo editorial dos PDFs
- ✅ **Mantido:** princípio anti-obsolescência (`version-anchor: Q2-2026`, sem features beta)
- 🔄 **Reorganizado:** capítulos divididos em **10 arquivos sequenciais** (vs 1 markdown gigante de ~3.000 linhas)
- 🆕 **Adicionado:** `snippets/` JSON copy-paste extraídos do Bicep validado (zero ambiguidade — aluno só substitui keys)
- 🆕 **Adicionado:** `images/` screenshots Q2-2026 capturados da execução real (CI ou manual)
- 🆕 **Adicionado:** cross-link explícito com `apex-helpsphere v2.1.0` (capítulo 09 — integração SaaS)
- 🆕 **Adicionado:** `troubleshooting.md` com 15+ erros catalogados (401 RBAC, 429 rate limit, vector dimension mismatch, etc.)
- 🆕 **Adicionado:** Bicep harness em `azure-retail/.../lab-inter-bicep/` como ground truth técnico (CI valida)
- ❌ **Removido:** referências a `escalation.json` workflow n8n (movido pra futura **Story 06.9** — Lab Final, bloqueada por `aifhub-apex-prod`)

---

## Roadmap

### v0.2.0 — Sample-KB Curadoria
- [ ] 8 PDFs realistas pt-BR (~25MB, 161 páginas) cobrindo 5 categorias HelpSphere (Comercial 2, TI 2, Operacional 2, Financeiro 1, RH 1)
- [ ] `sample-kb/README.md` com mapeamento PDF → categoria → tipo de pergunta
- [ ] Smoke test Document Intelligence `prebuilt-layout` >95% extração em 1 PDF aleatório
- [ ] PDF/A-2b compliance em todos os 8 arquivos
- [ ] Tamanho <5MB por PDF
- [ ] **Owner:** @analyst (Alex) · **Estimativa:** 12-18h trabalho criativo

### v0.3.0 — Bicep Harness Validado (em `azure-retail`, não aqui)
- [ ] Bicep harness em `azure-retail/Disciplina_06_*/03_Aplicações/lab-inter-bicep/`
- [ ] CI workflow `azure-dev-lab-inter.yml` (validate em PR + provision em main + cleanup)
- [ ] Snippets JSON extraídos do Bicep cravado **neste repo** (`snippets/`)
- [ ] Smoke test E2E: 1 PDF indexado + query OK + cleanup, custo <R$ 5
- [ ] **Owner:** @dev · **Estimativa:** 4-8h

### v1.0.0 — 10 Capítulos Portal-first Completos
- [ ] Outline + write capítulos 01 → 10 sequencial:
  - 01 Pré-requisitos · 02 Resource Group · 03 Storage + Blob · 04 Upload PDFs · 05 Doc Intelligence · 06 AI Search · 07 Skillset+Indexer · 08 Test Search Explorer · 09 RAG Query Sample (com integração `apex-helpsphere`) · 10 Cleanup
- [ ] Screenshots Q2-2026 capturados da execução real
- [ ] `troubleshooting.md` com 15+ erros comuns + solução
- [ ] Cross-link com `apex-helpsphere v2.2.0+` no capítulo 09 (versão exata cravada)
- [ ] **Owner:** @analyst + @dev consultoria · **Estimativa:** 6-10h

### v1.1.0 — CI Workflows + Polish
- [ ] `.github/workflows/lint-docs.yml` (markdown + links + Portuguese spelling)
- [ ] `.github/workflows/snippets-test.yml` (JSON syntax validate)
- [ ] Branch protection rule em `main` (PR review obrigatório + status checks)

### v1.2.0+ — Sub-task transversal `apex-helpsphere` (descoberta durante dev)
Durante dev dos capítulos, identificar e implementar gaps no `apex-helpsphere`:
- [ ] Schema SQL precisa colunas adicionais para metadata RAG?
- [ ] Endpoint `/api/tickets/with-rag-context` é necessário?
- [ ] MI grants suficientes para `apex-helpsphere` ler do índice AI Search?
- [ ] Configs runtime expõem AI Search endpoint corretamente?
- Cada gap → Decisão #24+ no `apex-helpsphere/DECISION-LOG.md` + bump versão (v2.1.0 → v2.2.0)

### Política de revisão anual
- Re-rodar Bicep harness em conta limpa
- Comparar Portal screenshots vs UI atual (capturar novos se >30% mudou)
- Verificar se `prebuilt-layout` continua o modelo recomendado pela Microsoft
- Validar pricing AI Search Basic + Document Intelligence (mudam a cada ~6-12 meses)
- Bump v1.x → v1.(x+1) se >30% UI mudou ou pricing alterou significativamente

---

`version-anchor: Q2-2026`
