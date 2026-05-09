# DECISION-LOG — apex-rag-lab

> Decisões pedagógicas + arquiteturais cravadas no Lab Intermediário D06. Cada decisão tem contexto, alternativas avaliadas, anti-padrões evitados, status, e impacto pedagógico.
>
> `version-anchor: Q2-2026`

---

## #1 — Repo público dedicado pra Lab Intermediário (não inline em azure-retail)

**Data:** 2026-05-06
**Status:** Cravada → DEPRECATED 2026-05-08 → **Restaurada 2026-05-09** (ver Decisão #6 abaixo)
**Cravada por:** prof Guilherme + @aiox-master (course-correction Story 06.7 v2.0 conforme Epic Pendências v5 versão 3.1)

### Contexto

Lab Intermediário (RAG production-grade) precisa ser passo-a-passo Portal Azure pro aluno seguir. Tem 2 abordagens possíveis para entrega:

1. **Inline em `azure-retail/Disciplina_06_*/01_Aulas/Lab_Intermediario_RAG_HelpSphere_Guia_Portal.md`** — tudo num único markdown longo do monorepo da disciplina (`azure-retail` é privado pro prof)
2. **Repo público dedicado** `tftec-guilherme/apex-rag-lab` com 10 capítulos sequenciais + snippets + screenshots, MAS Bicep harness fica no `azure-retail/Disciplina_06_*/03_Aplicações/lab-inter-bicep/` (CI valida)

### Decisão

Adotar **opção 2 (dual-repo)** seguindo o pattern arquitetural cravado em `apex-helpsphere v2.1.0`:

- **Repo público dedicado** pra didática Portal-first (aluno forka, tem permissão `git push` pra trabalhar)
- **Bicep harness no monorepo privado** pra ground truth técnico (CI valida em conta do prof)

### Alternativas avaliadas

- ❌ **Opção 1 (inline)**: aluno não tem GitHub público pra forkar; markdown gigante difícil de navegar; screenshots ficam misturados com guia textual
- ❌ **Opção 3 (Bicep aqui no `apex-rag-lab`)**: contradiz filosofia "Bicep validates, Portal mirrors" — Bicep precisa estar onde CI roda (azure-retail do prof, com subscription `helpsphere-actions`)

### Anti-padrões evitados

- ❌ Reescrever `Lab_Intermediario_*.md` original — filosofia "não reinventar a roda" (cravada 2026-05-05 noite)
- ❌ Fazer aluno copiar 8 PDFs sample-kb manualmente — entregar no repo público com clone único
- ❌ Forçar aluno a ler markdown gigante de uma vez — quebrar em 10 capítulos sequenciais por etapa Portal

### Impacto pedagógico

- Aluno tem **2 caminhos sincronizados**:
  - Forka `apex-rag-lab` (didático Portal step-by-step ~90-120min)
  - Clona `azure-retail` e roda Bicep harness (rápido ~10-15min via `azd up`)
- **Anti-drift garantido:** se Portal Azure mudar UI no futuro, atualiza só screenshots — Bicep continua válido
- ROI duplo: skeletons enterprise (`README` + `DECISION-LOG` + `CHANGES` + `PARA-O-ALUNO` + `CHANGELOG`) seguem padrão já validado pelo aluno em `apex-helpsphere`

### Cross-link

- Pattern cravado em memory: `feedback_bicep_validates_portal_mirrors.md`
- Filosofia macro: `feedback_dont_reinvent_d06_labs_ready.md`
- Story 06.7 v2.0 do Epic Pendências v5 D06 detalha sub-componentes A (sample-kb), B (Bicep harness), C (este repo)
- Repo companion: [apex-helpsphere v2.1.0](https://github.com/tftec-guilherme/apex-helpsphere)

---

## #2 — Document Intelligence `prebuilt-layout` vs custom model

**Status:** TODO (cravar durante dev de Sub-componente A)

[A documentar quando @analyst executar smoke test em 1 PDF de `sample-kb/` e validar extração >95%. Hipótese: `prebuilt-layout` cobre os 8 PDFs sem necessidade de custom model porque layouts são corporativos padrão (texto + tabelas + listas, sem formulários estruturados).]

---

## #3 — AI Search tier Standard vs Basic

**Status:** TODO (cravar durante Sub-componente B Bicep harness)

[A documentar baseado em smoke test de custos. README atual indica Basic (~R$ 7/dia). Se vector search performance ficar abaixo de Precision@5 ≥ 0.6 com Basic, escalar pra Standard.]

---

## #4 — OpenAI deployment region (eastus2 default vs proximidade)

**Status:** TODO (cravar durante Sub-componente C capítulo 06)

[A documentar baseado em quota disponibilidade pro aluno. eastus2 tem maior disponibilidade de gpt-4o-mini + text-embedding-3-large. Latência adicional aceitável pra contexto educacional.]

---

## #5 — Embedding dimension `text-embedding-3-large` 3072 vs `ada-002` 1536

**Status:** TODO (cravar durante Sub-componente C capítulo 06)

[A documentar trade-off custo vs recall. `text-embedding-3-large` tem MTEB melhor mas 2x storage. Decisão dependerá de Recall@10 ≥ 0.85 com `ada-002` antes de escalar.]

---

## #6 — Reversão da deprecation 2026-05-08 (restaurar companion público)

**Data:** 2026-05-09
**Status:** Cravada
**Cravada por:** prof Guilherme + @aiox-master

### Contexto

Em 2026-05-08 (mega-sessão Wave 4) este repo foi marcado DEPRECATED com a hipótese de que o Lab Intermediário viveria **direto no monorepo** `azure-retail` (`Disciplina_06_*/01_Aulas/Lab_Intermediario_RAG_HelpSphere_Guia_Portal.md`, ~2060 linhas). A decisão era reduzir manutenção paralela.

Em 2026-05-09 o prof identificou que **alunos não têm acesso ao monorepo `azure-retail`** (privado da TFTEC, contém speaker notes, banco de questões, gabaritos, plano de recording — propriedade intelectual do curso). A deprecation criou um gap: Lab Final tem `apex-helpsphere-agente-lab` companion, Lab Avançado tem `apex-helpsphere-prod-lab` companion, mas Lab Inter ficou órfão.

### Decisão

**Reverter a deprecation.** Restaurar `apex-rag-lab` como **companion público ATIVO** seguindo o mesmo padrão dos outros 2 Labs D06 (3 Labs = 3 companions públicos).

### Anti-padrões evitados

- ❌ Deixar aluno sem caminho de acesso ao guia do Lab Inter
- ❌ Quebrar simetria do padrão "1 Lab = 1 companion público"
- ❌ Forçar prof a entregar `.docx`/`.pdf` exportado por canal externo (Drive/email) em vez de URL pública navegável no GitHub

### Impacto pedagógico

- Aluno clona um único repo público para reproduzir o lab inteiro
- Discoverability via GitHub search ("azure rag tutorial portuguese")
- Issues + PRs habilitados — feedback contínuo do aluno melhora o lab

### Cross-link

- Memory feedback: `feedback_aluno_nunca_acessa_azure_retail.md` (causa raiz)
- Companions ativos: [`apex-helpsphere-agente-lab`](https://github.com/tftec-guilherme/apex-helpsphere-agente-lab) · [`apex-helpsphere-prod-lab`](https://github.com/tftec-guilherme/apex-helpsphere-prod-lab)

---

## #7 — Mudança de arquitetura: Skillset declarativo → Python imperativo + Function App

**Data:** 2026-05-09 (cravada na restauração Wave 4)
**Status:** Cravada
**Cravada por:** prof Guilherme (durante construção do guia do monorepo na mega-sessão Wave 4)

### Contexto

A v0.1.0-init deste repo (2026-05-06 bootstrap) propunha pipeline RAG via **Cognitive Search Skillset declarativo + Indexer**:
- Documentos no Blob → Indexer → Skillset (Doc Intelligence + split + embedding) → Index AI Search
- 5 snippets JSON: data-source, indexer, index-schema, skillset, query-rag-sample.http
- 10 capítulos passo-a-passo

A versão Wave 4 (entregue no monorepo, agora canônica) propõe pipeline RAG via **scripts Python imperativos + Function App orquestradora**:
- 1 script Python para chunking (`index_pdfs.py` consome Document Intelligence direto)
- 1 script Python para criação de índice (`create_search_index.py`)
- 1 script Python para indexação com embeddings (`index_to_search.py`)
- Function App `function_app.py` para orquestração `/chat/rag` com retrieval + Vision + Translator + chat
- 9 partes (vs 10 capítulos) — adicionou Vision (OCR) e Translator como services AI integrados

### Decisão

Adotar arquitetura Wave 4 (Python imperativo). v0.1.0-init preservada em `archive/`.

### Alternativas avaliadas

- ❌ **Manter Skillset declarativo:** mais idiomático Cognitive Search, MAS opaco pedagogicamente (aluno não vê o pipeline acontecendo), MAS limita customização (não dá pra plugar Vision/Translator na orquestração), MAS não estende para o Lab Avançado (que precisa de Function App custom)
- ✅ **Python imperativo + Function App:** mais código pra escrever (curva de aprendizado), MAS pedagogicamente rico (aluno vê chunks sendo gerados, embeddings sendo computados), MAS extensível para Vision/Translator/Multi-modal, MAS converte naturalmente para arquitetura production do Lab Avançado

### Impacto pedagógico

- Aluno termina o lab sabendo escrever um pipeline RAG production-grade do zero, não apenas configurar um Skillset
- Function App `/chat/rag` serve diretamente como artefato plugável no apex-helpsphere (Parte 8) — Skillset não tinha esse contrato

### Cross-link

- Archive: [`archive/snippets-pre-wave4/skillset.json`](./archive/snippets-pre-wave4/skillset.json) — esquema Skillset declarativo preservado para referência
- Memory: `feedback_dont_reinvent_d06_labs_ready.md` (filosofia macro, atualizada para Wave 4)

---

## #8 — Sample-KB: 3 PDFs públicos Microsoft Learn (vs 8 PDFs proprietários pt-BR)

**Data:** 2026-05-09 (cravada na restauração Wave 4)
**Status:** Cravada
**Cravada por:** prof Guilherme

### Contexto

A v0.1.0-init projetava **8 PDFs proprietários pt-BR** (~25MB) com curadoria editorial corporativa (Apex Group fictícia: manual_operacao_loja_v3, runbook_sap_fi_integracao, faq_pedidos_devolucao, etc.). Estimativa: **18-24h de trabalho criativo @analyst** distribuído em 5 sessões dedicadas. Apenas o outline do PDF #1 foi entregue antes do pivot Wave 4.

A versão Wave 4 usa **3 PDFs públicos Microsoft Learn** (~3MB) baixados via Print-to-PDF do navegador.

### Decisão

Adotar 3 PDFs públicos. Outline editorial preservado em `archive/sample-kb-pre-wave4/`.

### Alternativas avaliadas

- ❌ **Manter 8 PDFs proprietários:** mais imersivo no cenário Apex Group, MAS dependência de 18-24h de trabalho editorial @analyst (caminho crítico), MAS PDFs precisariam ser hospedados em algum lugar público (CDN custosa, Drive sem URL persistente), MAS aluno demora mais para ter o lab funcional
- ✅ **3 PDFs públicos Microsoft Learn:** menos imersivo (em-en, conteúdo Azure docs), MAS aluno baixa em 5min com Print-to-PDF, MAS URLs Microsoft Learn são persistentes, MAS pipeline é idêntico — só muda volume

### Impacto pedagógico

- Caminho crítico para Lab Inter funcional reduzido de "18-24h editorial + 8h lab" para "5min download + 8h lab"
- Aluno foca no que importa (pipeline RAG técnico) em vez de no conteúdo dos PDFs
- Bonus: cobre 3 services do Azure (OpenAI, Search, Doc Intelligence) — meta-pedagogicamente fechado

### Cross-link

- Archive: [`archive/sample-kb-pre-wave4/CONTEXT.md`](./archive/sample-kb-pre-wave4/CONTEXT.md) — 200 linhas de curadoria editorial preservadas para futura disciplina que precise PDFs proprietários
- Sample atual: [`sample-kb/README.md`](./sample-kb/README.md)

---

## #9 — AI Search tier: Standard S1 (vs Basic da v0.1.0-init)

**Data:** 2026-05-09 (cravada na restauração Wave 4)
**Status:** Cravada
**Cravada por:** prof Guilherme

### Contexto

v0.1.0-init projetava **Basic tier** (~R$ 7/dia, R$ 210/mês) para reduzir custo. Wave 4 cravou **Standard S1** (R$ 8,30/dia, R$ 250/mês).

### Decisão

Standard S1. Justificativa: vector search hybrid (precisa filtrar por metadata + similarity score em uma só query) tem performance significativamente melhor em S1 vs Basic, especialmente quando volume cresce em produção. Para o lab (~50 chunks de 3 PDFs) Basic funcionaria, MAS o gap pedagógico vs realidade de produção seria grande.

Custo extra para o aluno: **R$ 1-2/dia adicionais** (desprezível dado que regra de ouro é deletar RG no fim do dia).

### Cross-link

- Archive: [`archive/docs-pre-wave4/06-ai-search-service.md`](./archive/docs-pre-wave4/06-ai-search-service.md) — passo-a-passo Basic preservado

---

## Roadmap de decisões pendentes

| # | Tema | Quando cravar | Owner |
|---|---|---|---|
| 2 | Doc Intelligence prebuilt vs custom | Smoke test Sub-comp A | @analyst |
| 3 | AI Search tier Basic vs Standard | Smoke test Sub-comp B | @dev |
| 4 | OpenAI region eastus2 | Sub-comp C cap 06 | @analyst+@dev |
| 5 | Embedding dimension 3072 vs 1536 | Sub-comp C cap 06 | @analyst+@dev |
| 6 | Skillset declarativo vs Indexer custom | Sub-comp C cap 07 | @dev |
| 7 | Vector vs Hybrid vs Semantic search | Sub-comp C cap 08 | @analyst+@dev |
| 8 | Cleanup capítulo (último vs primeiro) | Sub-comp C cap 10 | @analyst |

---

`version-anchor: Q2-2026`
