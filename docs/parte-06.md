# Parte 6 — Azure OpenAI deployments (1h)

> Cria o Project Foundry dedicado ao lab, faz deploy dos 2 modelos (`text-embedding-3-large` + `gpt-4.1-mini`), anota credenciais e testa no Playground.

📘 **Conteúdo completo:** [`00-guia-completo.md` — seção "Parte 6"](./00-guia-completo.md#parte-6--azure-openai-deployments-1h)

## Passos

1. **Confirmar Foundry Project** já existe — Hub `aifhub-apex-prod` (Bloco 2)
2. **+ New project** dentro do Hub: `aifproj-helpsphere-rag`
3. **Deploy** `text-embedding-3-large` v1 — Standard, 30K TPM, DefaultV2 filter
4. **Deploy** `gpt-4.1-mini` v2025-04-14 — Standard, 30K TPM, DefaultV2 filter
5. **Anotar credenciais** (`AOAI_ENDPOINT`, `AOAI_API_KEY`, `EMBEDDING_DEPLOYMENT`, `CHAT_DEPLOYMENT`)
6. **Teste Playground** — system message Apex tom + user "Olá, qual seu nome?"

## Pré-requisitos

- ✅ Partes 1-4 completas
- ✅ Parte 5 Bloco 1 completo (índice criado, esperando indexação)
- ✅ Bloco 2 da Disciplina concluído (Hub `aifhub-apex-prod` existe na sub PAYG)
- ✅ Quota Azure OpenAI ≥30K TPM em cada modelo na region escolhida

## Credenciais a anotar

| Env var | Valor |
|---------|-------|
| `AOAI_ENDPOINT` | `https://aifproj-helpsphere-rag.openai.azure.com/` |
| `AOAI_API_KEY` | Key 1 (Keys and Endpoint do Project) |
| `EMBEDDING_DEPLOYMENT` | `text-embedding-3-large` |
| `CHAT_DEPLOYMENT` | `gpt-4.1-mini` |

## ⚠️ Custo

- `text-embedding-3-large`: ~$0.13 por 1M tokens input · lab usa ~50k tokens (~R$ 0,03)
- `gpt-4.1-mini`: ~$0.40 input + $1.60 output por 1M tokens · lab Playground+chat ~15k tokens (~R$ 0,05)
- Total deployments durante o lab: **~R$ 0,10** (custo desprezível dos modelos; o pesado é AI Search)

## ✅ Checkpoint Parte 6

- [ ] Project `aifproj-helpsphere-rag` criado dentro do Hub `aifhub-apex-prod`
- [ ] Deployment `text-embedding-3-large` ativo (status Succeeded)
- [ ] Deployment `gpt-4.1-mini` ativo (status Succeeded)
- [ ] AOAI endpoint e key anotados
- [ ] Playground respondeu com tom Apex

➡️ **Próximo:** [Parte 5 (continuação) — Indexar embeddings](./parte-05.md#bloco-2-depois-da-parte-6) — volte para a Parte 5 e termine

📌 **Após Parte 5 continuação:** [Parte 7 — Function App orquestração](./parte-07.md)
