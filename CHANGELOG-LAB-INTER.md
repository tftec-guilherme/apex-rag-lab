# Changelog — apex-rag-lab

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

> **Note:** Architectural decisions are catalogued separately in [`DECISION-LOG.md`](./DECISION-LOG.md). Diff vs guia v5 original is in [`CHANGES.md`](./CHANGES.md). Pedagogical surprises are in [`PARA-O-ALUNO.md`](./PARA-O-ALUNO.md).

---

## [Unreleased] — Story 06.26 (Frontend Host Separado)

### Added
- **App Service `app-helpsphere-{env}` Linux Node 22 (B1)** — frontend Vite agora roda em host próprio (Story 06.26). Bicep cria `Microsoft.Web/sites` + `Microsoft.Web/serverfarms`. Output `FRONTEND_URI` populado no `.env` do azd.
- **`app/frontend/server.js`** — Express simples (estático + SPA fallback) para rodar Vite build em App Service.
- **CORS reflectente totalmente aberto no backend** — `@app.before_request` (preflight OPTIONS → 204) + `@app.after_request` (devolve `Origin` do request como `Access-Control-Allow-Origin`). SEM whitelist (que sempre dava galho quando `FRONTEND_URI` mudava). Compatível com Bearer JWT (`Allow-Credentials: true`). Substitui middleware upstream baseado em `ALLOWED_ORIGIN`. Import `quart_cors` removido (não mais usado).
- **Easy Auth do backend → AllowAnonymous** — param `enableUnauthenticatedAccess` default agora `true`. Auth real via LoginGate frontend (MSAL) + `@authenticated` decorator Python em endpoints sensíveis (tickets, /chat, /chat/stream). /chat/rag tem bypass DEMO via `DEMO_TENANT_ID` (Story 06.27 deferred — tech debt aceito).

### Changed
- **`vite.config.ts`** — `outDir: "dist"` (era `../backend/static`). Vite build agora gera bundle local ao frontend.
- **`api/api.ts` + `api/rag.ts` + `authConfig.ts`** — `BACKEND_URI` vem de `import.meta.env.VITE_BACKEND_URI` (injetado pelo App Service appSettings). Em dev permanece `""` (Vite proxy cobre).
- **`azure.yaml`** — adicionado service `frontend` (host: appservice, language: js). Hook `prebuild` (build Vite) removido do service `backend`.
- **`Dockerfile backend`** — comentário explicativo sobre `static/` vazia pós-06.26.

### Migration notes (aluno)
- `azd up` agora provisiona **3 hosts**: App Service (frontend) + 2 Container Apps (backend Python + tickets-service .NET).
- URL final do app: `https://app-helpsphere-{env}.azurewebsites.net` (não mais Container App backend).
- ChatPanel: `https://app-helpsphere-{env}.azurewebsites.net/?chat=1`.
- Recursos provisionados: +1 App Service Plan B1 (~R$ 50/mês). Downgrade para F1 idle se quiser economizar.

### Known issues (tech debt aceito)
- **7 fetch hardcoded em `api.ts`** (/speech, /upload, /delete_uploaded, /list_uploaded, /chat_history×3) que ignoram `BACKEND_URI`. NÃO usadas no fluxo Lab Inter (TicketDetail + ChatPanel). Em prod App Service Linux frontend retornarão 404. Fix em iter futura quando alguma feature opcional for ativada.
- **`/chat/rag` bypass auth via `DEMO_TENANT_ID`** (Story 06.27 deferred) — lab é avaliado por processo RAG, não segurança.

### See also
- `docs/qa/gates/lab-inter-passos-8-9-10-pre-gravacao.yml` (gate pré-gravação)
- Story 06.26 spec: `azure-retail/docs/stories/06.26.lab-inter-frontend-host-separado.md`

---

## [v0.3.0] — 2026-05-XX ★ Wave 4 ACTIVE pedagogical rewrite (Story 06.13)

### Added

- **Parte 8 reescrita 4 → 8 Passos** (`docs/00-guia-completo.md`): aluno agora edita ~19 marcadores `[CRIAR-X]` em 4 arquivos críticos do fork (`rag_chat.py`, `ChatPanel.tsx`, `Shell.tsx`, `authConfig.ts`) + `azd up` + valida 4 hosts no Portal Azure. Cumpre a promessa do `README-LAB-INTER.md` linha 32 ("aluno cria 15 arquivos do zero" — agora ACTIVE).
- **`[CRIAR-X]` markers nos 4 arquivos críticos** — 19 marcadores total (5 em `rag_chat.py` + 7 em `ChatPanel.tsx` + 4 em `Shell.tsx` + 3 em `authConfig.ts`). Cada marker tem descrição + WHY + Hint inline para guiar a edição ao vivo.
- **Subgraph `DEV` no diagrama mermaid** com setas `azd up` ligando o fork local aos 4 hosts deployados — explicita o conceito "fork-funcional único, deploy único".

### Changed

- **Diagrama de arquitetura corrigido** (linha ~132 do guia): substituiu `func-helpsphere-prod` (Function App, errado) por 3 caixas reais (App Service `app-helpsphere-{env}` + Container App `capps-backend-{env}` + Container App `capps-tickets-{env}`). Endpoint corrigido: `GET /api/tickets/{id}/suggest` → `POST /chat/rag`.
- **Tabela "Estrutura do lab"** (linha ~201 do guia): célula da Parte 7 atualiza nome correto da Function App; célula da Parte 8 reflete novo workflow ("8 Passos: edita markers + `azd up` + valida 4 hosts").
- **Parte 7 refinos**: nome correto `func-helpsphere-rag` em todas as menções; callout no topo: "ao final você verá esta Function App lado a lado com os 3 hosts do `apex-helpsphere` no Portal Azure".
- **`docs/parte-08.md` (navegação)**: simplificada — removido pré-requisito condicional sobre template ≥v2.2.0 (obsoleto; apex-rag-lab é fork-funcional único agora).
- **`PARA-O-ALUNO-LAB-INTER.md`**: nova seção "Workflow Parte 8 (clone único)" descrevendo `git clone apex-rag-lab` → edita markers → `azd up`. Surpresa #7 atualizada.

### Removed

- **Referência a "PR #20 mergeado em main do apex-helpsphere"** — esse PR foi REVERTIDO (Story 06.10) e o RAG vive agora canonicamente em `apex-rag-lab`.
- **Tempos individuais por Passo** (proibidos per memory `feedback_no_per_passo_times_presumptuous`) — mantidos apenas `(1h)` no header da Parte 7 e `(30min)` no header da Parte 8.
- **Pré-requisito condicional sobre template `apex-helpsphere` ≥v2.2.0** — não se aplica mais (fork-funcional único).

### Audit (informativo)

- `archive/docs-pre-wave4/09-rag-query-sample.md` e `archive/docs-pre-wave4/troubleshooting.md` (Cap 09) marcados com banner `⚠️ Wave 4` (HIGH priority recommendation do audit). Outros caps de `archive/` permanecem como referência histórica sem conflito com o guia Wave 4 ACTIVE.

### Pedagogical impact

- ✅ Lab Inter agora é **ACTIVE pedagogical** — aluno faz edições reais em 4 arquivos do fork (não apenas ativa flags em código pré-existente)
- ✅ Promessa do `README-LAB-INTER.md` linha 32 cumprida (passive → active)
- ✅ Workflow "clone único" reforça filosofia "fork-funcional, deploy único, 4 hosts visíveis Portal"

### References

- Story: `docs/stories/06.13.lab-inter-active-rewrite-partes-7-8.md` (azure-retail monorepo)
- Audit report: `docs/stories/06.13/audit-archive-conflicts.md`
- Implementation plan: `docs/stories/06.13/plan/implementation.yaml`
- Memory feedback: `feedback_lab_inter_active_vs_passive.md`

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
