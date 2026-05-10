# Parte 7 — Function App de orquestração (1h)

> Cria a Function App Python, configura Application Insights + Managed Identity + env vars, faz deploy do código `function_app.py` e testa o endpoint `/chat/rag` com Postman. Ao final você verá esta Function App lado a lado com os 3 hosts do `apex-helpsphere` (App Service + 2 Container Apps) no Portal Azure.

📘 **Conteúdo completo:** [`00-guia-completo.md` — seção "Parte 7"](./00-guia-completo.md#parte-7--function-app-de-orquestra%C3%A7%C3%A3o-1h)

## Passos

1. **Criar Function App** `func-helpsphere-rag` (Python 3.11, Linux, Consumption ou Premium)
2. **Configurar Application Insights** (telemetria + traces)
3. **Atribuir Managed Identity** + roles (Search User, Cognitive Services User, Storage Blob Reader)
4. **Configurar env vars** (Endpoint Search + AOAI + Vision + Translator + nomes de deployments)
5. **Código** `function_app.py` ([`snippets/function_app.py`](../snippets/function_app.py))
6. **Deploy** via Azure CLI (`az functionapp deployment source config-zip` ou VS Code Functions extension)
7. **Testar com Postman** ([`snippets/test_chat_rag.http`](../snippets/test_chat_rag.http))

## Pré-requisitos

- ✅ Partes 1-6 completas (todas as credenciais anotadas)
- ✅ Parte 5 continuação completa (índice populado com embeddings)

## Endpoint criado

```
POST https://func-helpsphere-rag.azurewebsites.net/api/chat/rag
Content-Type: application/json

{
  "tenantId": "11111111-1111-1111-1111-111111111111",
  "ticketId": "TKT-42",
  "userMessage": "Como faço para resetar a NF-e quando o ERP rejeita?",
  "screenshot": "<base64 opcional>"
}
```

## Cold start

Function App em Consumption tier tem cold start de 2-5s no primeiro request. Para o lab é aceitável. Para produção, usar Premium tier (always-on).

## ✅ Checkpoint Parte 7

- [ ] Function App `func-helpsphere-rag` ativa
- [ ] Application Insights ligado e mostrando requests
- [ ] Managed Identity com 3 roles (Search User, Cognitive Services User, Storage Blob Reader)
- [ ] Env vars configuradas (8+ vars)
- [ ] Deploy de `function_app.py` succeeded
- [ ] Postman retornou 200 OK em <3s com `answer` + `sources` (top-5 chunks)

➡️ **Próximo:** [Parte 8 — Plug no apex-helpsphere](./parte-08.md)
