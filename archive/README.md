# Archive — Conteúdo pré-Wave 4 (referência histórica)

> Este diretório preserva o trabalho de bootstrap do `apex-rag-lab` (v0.1.0-init, Story 06.7 v2.0) antes da reestruturação Wave 4 cravada em 2026-05.

## Por que arquivado

A arquitetura RAG do Lab Intermediário D06 mudou na Wave 4:

| Aspecto | Pré-Wave 4 (este archive) | Wave 4 (atual, raiz do repo) |
|---------|---------------------------|------------------------------|
| Pipeline RAG | Skillset declarativo + Indexer (Cognitive Search) | Python imperativo + Function App |
| AI Search tier | Basic | Standard S1 (vector hybrid) |
| Sample-KB | 8 PDFs proprietários pt-BR (Apex Group, ~25MB) | 3 PDFs públicos Microsoft Learn (~3MB) |
| Capítulos | 10 (`01-pre-requisitos` → `10-cleanup`) | 9 partes (parte-01 → parte-09) |
| Tempo | 90-120min | 8h |
| Modelos OpenAI | `gpt-4o-mini` + `ada-002`/`text-embedding-3-large` | `gpt-4.1-mini` + `text-embedding-3-large` (3072 dim) |
| Services AI | Doc Intelligence + AI Search | Doc Intelligence + AI Vision (OCR) + Translator + AI Search + Function App |

A versão Wave 4 é mais didaticamente rica (4 services AI vs 2), mais realista de produção (orquestração imperativa via Function App vs Skillset opaca), e usa PDFs públicos Microsoft Learn que qualquer aluno consegue baixar (vs 8 PDFs proprietários que demandariam curadoria editorial de 18-24h).

## Conteúdo arquivado

- `docs-pre-wave4/` — 10 capítulos passo-a-passo + troubleshooting consolidado (Cognitive Search Skillset)
- `snippets-pre-wave4/` — 5 snippets JSON copy-paste (data-source, indexer, index-schema, skillset, query-rag-sample.http) — REST API Cognitive Search
- `sample-kb-pre-wave4/CONTEXT.md` — 200 linhas de curadoria editorial @analyst (Atlas) com personas Diego/Marina/Lia, marcas Apex, mapeamento 11→8 KB
- `sample-kb-pre-wave4/source/01-faq_horario_atendimento.outline.md` — outline do PDF #1 de 8 (único entregue antes do pivot Wave 4)

## Reaproveitamento futuro

Se um Lab "Cognitive Search Skillset" surgir em alguma disciplina futura (D07, D08+), este archive serve como ponto de partida — ~80% do conteúdo permanece tecnicamente válido. Atualizar apenas:
- Pricing (Search Basic, Document Intelligence S0)
- Versões SDK Azure (`azure-search-documents`, `azure-ai-formrecognizer`)
- Datas absolutas (`Q2-2026` → trimestre vigente)
- Screenshots Portal Azure (UI atualizada)

## Cross-references

- Decisão deprecation 2026-05-08 (depois revertida) — ver `../DECISION-LOG.md`
- Story 06.7 v2.0 original (azure-retail privado, acessível ao prof)
- Memory: `feedback_aluno_nunca_acessa_azure_retail.md` (causa raiz da reversão)

---

`version-anchor: Q2-2026 (archive frozen)`
