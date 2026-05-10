# Parte 8 — Plug no stack apex-helpsphere real (30min)

> Edita **19 marcadores** `[CRIAR-X]` em 4 arquivos críticos do fork `apex-rag-lab` (5 backend + 14 frontend), roda `azd up` reaproveitando o RG do Bloco 2 e valida 4 hosts saudáveis no Portal Azure (Function App + App Service + 2 Container Apps).

📘 **Conteúdo completo:** [`00-guia-completo.md` — seção "Parte 8"](./00-guia-completo.md#parte-8--plug-no-stack-apex-helpsphere-real-30min)

## Passos

1. **Pré-requisito:** Bloco 2 (`azd up`) já concluído — confirma RG via `azd env get-value AZURE_RESOURCE_GROUP`
2. **Tour dos 15 arquivos** do plug RAG no fork (4 críticos com markers `[CRIAR-X]`, 11 prontos)
3. **Editar `app/backend/blueprints/rag_chat.py`** — endpoint `POST /chat/rag` (5 markers: tenant JWT, gating `RAG_ENABLED`, upstream URL, `aiohttp` proxy)
4. **Editar `app/frontend/src/components/ChatPanel/ChatPanel.tsx`** — painel React flutuante (7 markers: import, validação, MSAL token, label loading, render)
5. **Editar `app/frontend/src/Shell.tsx` + `authConfig.ts`** — triple-gate `ragEnabled && enableChat && ?chat=1`
6. **Configurar env vars** do RAG no `azd env` (`RAG_FUNCTION_URL`, `RAG_FUNCTION_KEY`, `ENABLE_CHAT`, `RAG_ENABLED`)
7. **`azd up`** — deploy completo do fork (~6-10min, reaproveita RG do Bloco 2)
8. **Validação 4 hosts no Portal** + smoke teste end-to-end (`?chat=1` → "Sugerir resposta" → suggestion + citations em <3s)

## Pré-requisitos

- ✅ Partes 1-7 completas
- ✅ Bloco 2 completo (RG `rg-helpsphere-saas` existente, deployed via `azd up`)
- ✅ Function App de RAG da Parte 7 com URL e key anotadas

## ✅ Checkpoint Parte 8

- [ ] `azd env get-value AZURE_RESOURCE_GROUP` retorna o RG do Bloco 2
- [ ] 4 arquivos críticos editados (todos os markers `[CRIAR-X]` preenchidos)
- [ ] `azd up` concluiu com `SUCCESS` sem erros
- [ ] 4 abas no Portal mostram todos os hosts em estado **Healthy/Running**
- [ ] `?chat=1` exibe o `<ChatPanel />` no canto inferior direito
- [ ] Botão **"Sugerir resposta"** retorna sugestão + citações em <3s

➡️ **Próximo:** [Parte 9 — Medição + Cleanup](./parte-09.md)
