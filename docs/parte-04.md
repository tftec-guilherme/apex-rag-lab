# Parte 4 — Azure AI Translator (multilíngue) (30min)

> Cria o Azure AI Translator e testa detect + translate. A Function App usa Translator quando o ticket vem em pt/es/fr — traduz para en para retrieval, depois traduz a resposta de volta para o idioma original.

📘 **Conteúdo completo:** [`00-guia-completo.md` — seção "Parte 4"](./00-guia-completo.md#parte-4--azure-ai-translator-multil%C3%ADngue--30min)

## Passos

1. **Criar** Azure AI Translator `translator-helpsphere-rag`
2. **Anotar credenciais** (`TRANSLATOR_ENDPOINT`, `TRANSLATOR_KEY`, `TRANSLATOR_REGION`)
3. **Atribuir RBAC** do Managed Identity
4. **Testar detect + translate** ([`snippets/test_translator.sh`](../snippets/test_translator.sh))

## Pré-requisitos

- ✅ Partes 1 + 2 + 3 completas

## Cenário pedagógico

Apex Group atende lojistas em pt-BR, es-AR (Argentina) e en-US (corporativo internacional). Os PDFs sample-kb estão em en-US. Sem Translator, ticket em pt-BR não bate com chunks em en-US (similaridade vetorial cai). Com Translator, query é normalizada para en antes do retrieval.

## ✅ Checkpoint Parte 4

- [ ] Translator service ativo
- [ ] Detect + translate funcionando para pt → en e es → en
- [ ] Translate-back en → pt funcionando

➡️ **Próximo:** [Parte 5 — AI Search vector index](./parte-05.md)
