# Changelog — apex-rag-lab

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

> **Note:** Architectural decisions are catalogued separately in [`DECISION-LOG.md`](./DECISION-LOG.md). Diff vs guia v5 original is in [`CHANGES.md`](./CHANGES.md). Pedagogical surprises are in [`PARA-O-ALUNO.md`](./PARA-O-ALUNO.md).

---

## [v0.2.0] — 2026-05-09 ★ Wave 4 restored

### Reverted

- **Deprecation 2026-05-08** revertida. Repo restaurado como **companion público ATIVO** do Lab Intermediário D06. Causa raiz: alunos não têm acesso ao monorepo privado `azure-retail` (memory: `feedback_aluno_nunca_acessa_azure_retail.md`). Padrão "3 Labs = 3 companions públicos" restaurado.

### Added

- **`docs/00-guia-completo.md`** — guia integral Wave 4 (~2074 linhas, cópia ativa do canônico no monorepo)
- **`docs/parte-01.md` → `docs/parte-09.md`** — 9 thin wrappers para navegação parte-a-parte
- **`docs/troubleshooting.md`** — erros catalogados Wave 4 (Python imperativo + Function App + 4 services AI)
- **`snippets/{index_pdfs,create_search_index,index_to_search,function_app,eval_rag}.py`** + **`requirements.txt`** + **`test_*.sh`** + **`test_chat_rag.http`** — copy-paste extraídos do guia
- **`sample-kb/README.md`** — instruções Print-to-PDF dos 3 PDFs públicos Microsoft Learn (~3MB)
- **`archive/`** — preservação histórica de v0.1.0-init (10 capítulos pre-Wave 4 + 5 snippets JSON Skillset + CONTEXT.md editorial 8 PDFs proprietários) com `archive/README.md` explicando o contexto
- **DECISION-LOG #6, #7, #8, #9** — Reversão deprecation, Skillset → Python imperativo, 3 PDFs públicos, AI Search Standard S1

### Changed

- **`README.md`** — remove banner DEPRECATED, status `ATIVO Wave 4`, arquitetura atualizada (4 services AI + Function App), estrutura de pastas atualizada, custo R$ 21-29
- **`PARA-O-ALUNO.md`** — Quick Start em 6 passos, 7 surpresas pedagógicas catalogadas, regra de ouro `az group delete`, links companion publishers
- **`DECISION-LOG.md` #1** — status atualizado para `Cravada → DEPRECATED 2026-05-08 → Restaurada 2026-05-09`
- **`CHANGES.md`** — v0.2.0 entry com diff completo vs v0.1.0-init e política de sync com monorepo

### Removed (moved to `archive/`)

- 10 capítulos pre-Wave 4 (`docs/01-pre-requisitos.md` → `docs/10-cleanup.md` + `troubleshooting.md`)
- 5 snippets JSON Cognitive Search (`snippets/data-source.json`, `indexer.json`, `index-schema.json`, `skillset.json`, `query-rag-sample.http`)
- Curadoria editorial 8 PDFs proprietários (`sample-kb/CONTEXT.md` 200 linhas + `sample-kb/source/01-faq_horario_atendimento.outline.md`)

### Architecture migration

- **Pipeline RAG:** Cognitive Search Skillset declarativo → Python imperativo + Function App `/chat/rag`
- **Sample-KB:** 8 PDFs proprietários pt-BR (~25MB) → 3 PDFs públicos Microsoft Learn (~3MB)
- **AI Search tier:** Basic → **Standard S1** (vector hybrid)
- **Capítulos:** 10 sequenciais → 9 partes (adicionou AI Vision OCR + AI Translator)
- **Tempo estimado:** 90-120min → **8h** (escopo aumentou com 4 services AI integrados)
- **Modelos OpenAI:** `gpt-4o-mini` + `ada-002` → `gpt-4.1-mini` + `text-embedding-3-large` (3072 dim)

### Pedagogical impact

- ✅ Companion público restaurado — aluno tem caminho único de clone para reproduzir lab inteiro
- ✅ Padrão 3 Labs = 3 companions públicos restaurado (Inter + Final + Avançado simétricos)
- ✅ Source of truth canônica no monorepo `azure-retail` com sync downstream automático

### Cross-references

- Memory feedback: `feedback_aluno_nunca_acessa_azure_retail.md`
- Source of truth: `azure-retail/Disciplina_06_*/01_Aulas/Lab_Intermediario_RAG_HelpSphere_Guia_Portal.md`
- Sister labs: [`apex-helpsphere-agente-lab`](https://github.com/tftec-guilherme/apex-helpsphere-agente-lab) · [`apex-helpsphere-prod-lab`](https://github.com/tftec-guilherme/apex-helpsphere-prod-lab)

---

## [v0.1.0-init] — 2026-05-06

### Bootstrap

Skeleton inicial criado por @devops conforme Story 06.7 v2.0 do Epic Pendências v5 D06 (course-correction master cravado pelo prof 2026-05-05 noite). Conteúdo (8 PDFs sample-kb + 10 capítulos passo-a-passo + snippets + screenshots) será adicionado em sessões dedicadas.

### Added

- **`README.md`** — production-grade mirror do padrão `apex-helpsphere`, descreve objetivo pedagógico, caminhos de execução (Portal step-by-step vs Bicep automation), arquitetura high-level, custo estimado (<R$ 10), pré-requisitos, política de revisão anual
- **`DECISION-LOG.md`** — Decisão #1 (repo público dedicado dual-repo) cravada com contexto + alternativas + anti-padrões + impacto pedagógico + cross-link a memory feedbacks · 7 decisões TODO mapeadas
- **`CHANGES.md`** — diff vs guia v5 original (`Lab_Intermediario_RAG_HelpSphere_Guia_Portal.md`) + roadmap de versões (v0.2 sample-kb → v0.3 Bicep → v1.0 capítulos → v1.1 CI → v1.2 sub-task transversal apex-helpsphere)
- **`PARA-O-ALUNO.md`** — entrypoint pedagógico com tom enterprise mirror `apex-helpsphere`
- **`CHANGELOG.md`** — este arquivo
- **`SECURITY.md`** — política de segurança educacional (não Microsoft boilerplate — adaptada pra contexto TFTEC)
- **`CONTRIBUTING.md`** — convenções de commits + PR workflow + branch protection
- **`.gitignore`** + **`.gitattributes`**
- **Estrutura de pastas:** `docs/`, `sample-kb/`, `snippets/`, `images/` (todas com `.gitkeep`)
- **`LICENSE` MIT** (gerado por `gh repo create`)

### Configured (via @devops Gage)

- Repo público em `tftec-guilherme/apex-rag-lab`
- License: MIT
- Default branch: `main`
- Topics: `azure`, `rag`, `azure-search`, `document-intelligence`, `portuguese`, `tutorial`, `tftec`, `apex`
- Description: "Lab Intermediário D06 — RAG production-grade passo-a-passo Portal Azure (HelpSphere companion · Q2-2026)"

### Pedagogical impact

- **0% conteúdo do lab pronto** — esperado nesta versão (bootstrap)
- Anti-drift garantido pelo design dual-repo (Bicep no `azure-retail`, Portal aqui)
- Aluno tem caminho claro pra contribuir issues/PRs quando v1.0.0 sair
- Skeletons enterprise (5 docs) servem de boilerplate pra futuras stories de Lab Final + Lab Avançado

### Cross-references

- Story 06.7 v2.0: `azure-retail/docs/stories/06.7.assets-complementares-labs.md`
- Epic Pendências v5 v3.1: `azure-retail/docs/stories/epics/epic-disciplina-06-pendencias/epic.md` linha 124
- Memory recovery session: `~/.claude/.../memory/session-2026-05-06-recovery-course-correction-06.7.md`
- Pattern arquitetural: `feedback_bicep_validates_portal_mirrors.md`
- Filosofia macro: `feedback_dont_reinvent_d06_labs_ready.md`

---

`version-anchor: Q2-2026`
