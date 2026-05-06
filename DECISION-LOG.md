# DECISION-LOG — apex-rag-lab

> Decisões pedagógicas + arquiteturais cravadas no Lab Intermediário D06. Cada decisão tem contexto, alternativas avaliadas, anti-padrões evitados, status, e impacto pedagógico.
>
> `version-anchor: Q2-2026`

---

## #1 — Repo público dedicado pra Lab Intermediário (não inline em azure-retail)

**Data:** 2026-05-06
**Status:** Cravada
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
