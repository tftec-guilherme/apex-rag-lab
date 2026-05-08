# Parte 8 — Plug no stack apex-helpsphere real (30min)

> Pluga o RAG no apex-helpsphere SaaS host: configura `RAG_ENABLED=true` no Container App backend, testa endpoint `/chat/rag`, valida no frontend (botão "Sugerir resposta" / chat dormente).

📘 **Conteúdo completo:** [`00-guia-completo.md` — seção "Parte 8"](./00-guia-completo.md#parte-8--plug-no-stack-apex-helpsphere-real-30min)

## ⚠️ Pré-requisito CRÍTICO em [Q2-2026]

Esta Parte assume que o template `apex-helpsphere` já tem **3 elementos implementados:**

| # | Elemento | Onde |
|---|----------|------|
| 1 | Env var `RAG_ENABLED=true` consumida | Backend Container App |
| 2 | Endpoint `/chat/rag` proxy para Function App | Backend Container App |
| 3 | Componente `ChatPanel` ativável via flag `?chat=1` | Frontend SPA |

**Em [Q2-2026] esses 3 elementos podem ainda estar pendentes** no template `apex-helpsphere` (release ≤v2.1.0). Se o aluno chega aqui antes do bump v2.2.0 do template:

- ✅ **Funciona:** testes via curl/Postman direto na Function App (Parte 7 cobre)
- ❌ **Não funciona:** integração end-to-end no frontend (botão "Sugerir resposta")

**Como verificar:** acesse `https://github.com/tftec-guilherme/apex-helpsphere/blob/main/CHANGELOG.md` e procure entrada `v2.2.0` mencionando `RAG`. Se não tem, prossiga com testes via curl.

## Passos

1. **Descobrir URLs reais** do seu deployment `apex-helpsphere` (`azd show`)
2. **Configurar env var** `RAG_ENABLED=true` + `RAG_FUNCTION_URL=...` + `RAG_FUNCTION_KEY=...` no Container App backend
3. **Testar** endpoint `/chat/rag` no backend Container App via curl
4. **Validar** no frontend (botão "Sugerir resposta" / chat dormente com `?chat=1`)

## Pré-requisitos

- ✅ Partes 1-7 completas
- ✅ `apex-helpsphere` deployado na sua subscription via `azd up` (ver [`apex-helpsphere/PARA-O-ALUNO.md`](https://github.com/tftec-guilherme/apex-helpsphere/blob/main/PARA-O-ALUNO.md))
- ✅ Template `apex-helpsphere` ≥v2.2.0 (para integração frontend completa)

## ✅ Checkpoint Parte 8

- [ ] Backend Container App ouviu `RAG_ENABLED=true` (logs Application Insights)
- [ ] curl no `/chat/rag` do backend retornou 200 + answer
- [ ] Frontend com `?chat=1` exibe `ChatPanel` (se v2.2.0+)
- [ ] Botão "Sugerir resposta" no detalhe de ticket invoca o RAG e mostra resultado (se v2.2.0+)

➡️ **Próximo:** [Parte 9 — Medição + Cleanup](./parte-09.md)
