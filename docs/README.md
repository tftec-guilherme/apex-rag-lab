# docs — Lab Intermediário D06 RAG

Navegação do conteúdo do lab. Source of truth: [`00-guia-completo.md`](./00-guia-completo.md) (~2074 linhas, cópia ativa do canônico no monorepo `azure-retail`).

## Estrutura

| Arquivo | Tipo | Conteúdo |
|---------|------|----------|
| **`00-guia-completo.md`** | ★ Canônico | Guia integral 9 partes + checkpoints + troubleshooting inline. **Use este se quer ler tudo de uma vez.** |
| `parte-01.md` → `parte-09.md` | Wrappers | Sumário por parte + link âncora para o guia integral. **Use estes se quer navegar parte-a-parte** ou retomar de onde parou. |
| `troubleshooting.md` | Referência | Erros comuns Wave 4 + diagnóstico sequencial + scripts de fix |

## Mapa rápido das 9 partes

| # | Parte | Tempo | Recurso principal |
|---|-------|-------|-------------------|
| 1 | [Provisionar fundação](./parte-01.md) | 30min | RG `rg-lab-intermediario` + Storage + Managed Identity + RBAC |
| 2 | [Document Intelligence](./parte-02.md) | 1.5h | DI S0 + chunking layout-aware (Python) |
| 3 | [AI Vision (OCR)](./parte-03.md) | 30min | OCR de screenshots de tickets |
| 4 | [AI Translator](./parte-04.md) | 30min | Multilíngue detect + translate |
| 5 | [AI Search](./parte-05.md) | 1.5h + 50min | Vector index hybrid Standard S1 + indexação com embeddings |
| 6 | [Azure OpenAI deployments](./parte-06.md) | 1h | `text-embedding-3-large` + `gpt-4.1-mini` no Foundry Project |
| 7 | [Function App orquestração](./parte-07.md) | 1h | API REST `/chat/rag` Python |
| 8 | [Plug no apex-helpsphere](./parte-08.md) | 30min | `RAG_ENABLED=true` + ChatPanel + smoke test |
| 9 | [Medição + Cleanup](./parte-09.md) | 1h | precision@5 + latency + custo + `az group delete` |

**Total:** ~8h em 1 sessão dedicada.

## Convenções

- **Custo R$ 21-29** se provisionar e deletar no mesmo dia (Standard S1 pesa)
- **Free Trial USD 200 não funciona** — Azure OpenAI exige PAYG
- **Regra de ouro:** `az group delete --name rg-lab-intermediario --yes --no-wait` ao final
- **Pré-requisito hard:** Bloco 2 já executado (`rg-lab-intermediario` com Foundry Hub `aifhub-apex-prod` + Project `aifproj-helpsphere-base`)

`version-anchor: Q2-2026`
