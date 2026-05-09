<div align="center">

# apex-rag-lab — Lab Intermediário D06 (RAG)

**Pipeline RAG production-grade passo-a-passo no Portal Azure**
Disciplina 06: IA e Automação no Azure · Pós-Graduação Arquitetura Cloud Azure · TFTEC + Anhanguera

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

</div>

---

## 🎯 O que você constrói

Um pipeline **RAG (Retrieval-Augmented Generation) production-grade** sobre 3 PDFs públicos da Microsoft Learn, construído manualmente via Portal Azure usando 6 services AI integrados (Document Intelligence layout-aware, AI Vision OCR, AI Translator multilíngue, AI Search Standard S1 vector hybrid, Azure OpenAI `text-embedding-3-large` + `gpt-4.1-mini`, Function App orquestrador). Você termina o lab com **um endpoint RAG funcional** plugado ao [`apex-helpsphere`](https://github.com/tftec-guilherme/apex-helpsphere) que sugere resposta em <2s para tickets dos atendentes tier 1 da Apex Group.

## 🚀 Quick start

```bash
git clone https://github.com/tftec-guilherme/apex-rag-lab.git
cd apex-rag-lab

# 1. Leia o entrypoint pedagógico (5 min)
# Abra PARA-O-ALUNO-LAB-INTER.md

# 2. Baixe os 3 PDFs sample (5 min)
# Siga sample-kb/README.md

# 3. Execute o lab (~8h em sessão dedicada)
# Abra docs/00-guia-completo.md OU navegue por partes em docs/parte-01.md → parte-09.md

# 4. CLEANUP CRÍTICO ao final (~1 min)
az group delete --name rg-lab-intermediario --yes --no-wait
```

## 📚 Estrutura do lab (9 partes · 8 horas)

| Parte | Duração | Atividade |
|---|---|---|
| Parte 1 | 30min | Provisionar fundação (RG, Storage, identidades) |
| Parte 2 | 1.5h | Document Intelligence (indexação dos 3 PDFs) |
| Parte 3 | 30min | Azure AI Vision (OCR de screenshots — sub-feature) |
| Parte 4 | 30min | Azure AI Translator (multilíngue — sub-feature) |
| Parte 5 | 1.5h | Azure AI Search (vector index + hybrid) |
| Parte 6 | 1h | Azure OpenAI deployments (embeddings + chat) |
| Parte 7 | 1h | Function App (endpoint `/api/tickets/{id}/suggest`) |
| Parte 8 | 30min | Plug no stack apex-helpsphere real (Container Apps) |
| Parte 9 | 1h | Medição (precision@5, latency, custo) + cleanup |

## 💰 Custo realista

| Cenário | Custo |
|---------|-------|
| Lab completo provisionado e deletado no mesmo dia (~8h) | **R$ 21-29** saindo do bolso |
| Recursos esquecidos ligados 1 mês | R$ 280-320 |
| Free Trial USD 200 | ❌ **NÃO funciona** — Azure OpenAI exige Pay-As-You-Go |

**Recurso mais caro:** AI Search Standard S1 (R$ 8,30/dia, R$ 250/mês se ficar ligado). **Regra de ouro:** ao final, `az group delete --name rg-lab-intermediario --yes --no-wait`.

## 🧱 Stack provisionado

- **Azure AI Document Intelligence** — chunking layout-aware (`prebuilt-layout`)
- **Azure AI Vision** — OCR de screenshots de tickets
- **Azure AI Translator** — atendimento multilíngue (detect + translate)
- **Azure AI Search Standard S1** — índice vector hybrid (3072 dim)
- **Azure OpenAI** — `text-embedding-3-large` + `gpt-4.1-mini`
- **Azure Function App (Python)** — orquestrador `/chat/rag` plugado no HelpSphere

> Detalhes profundos da stack, pré-requisitos, quotas, e os 15 arquivos do plug RAG no `apex-helpsphere`: ver [`README-LAB-INTER.md`](./README-LAB-INTER.md).

## 📖 Documentação

| Doc | Quando ler |
|---|---|
| [`PARA-O-ALUNO-LAB-INTER.md`](./PARA-O-ALUNO-LAB-INTER.md) | Entrypoint — pré-requisitos, gotchas (7 surpresas reais), ordem de execução |
| [`README-LAB-INTER.md`](./README-LAB-INTER.md) | Detalhes profundos: objetivos pedagógicos, 15 arquivos do plug RAG, estrutura repo, arquitetura high-level |
| [`docs/00-guia-completo.md`](./docs/00-guia-completo.md) | Guia integral 9 partes (~2120 linhas) |
| [`docs/troubleshooting.md`](./docs/troubleshooting.md) | Erros comuns + diagnóstico (RBAC 403, dimension mismatch, rate limit 429, etc.) |
| [`DECISION-LOG.md`](./DECISION-LOG.md) | Decisões pedagógicas + arquiteturais cravadas |
| [`CHANGELOG.md`](./CHANGELOG.md) | Histórico de releases |

## 🔗 Companion repos

- [`apex-helpsphere`](https://github.com/tftec-guilherme/apex-helpsphere) — template SaaS base (Bloco 2, sem IA stack); a Parte 8 plugga o RAG aqui
- [`apex-helpsphere-agente-lab`](https://github.com/tftec-guilherme/apex-helpsphere-agente-lab) — Lab Final D06 (Agentes Foundry + Speech)
- [`apex-helpsphere-prod-lab`](https://github.com/tftec-guilherme/apex-helpsphere-prod-lab) — Lab Avançado D06 (production patterns)

## 📦 Sobre o template base apex-helpsphere

Este repo herdou o código do template `apex-helpsphere` (snapshot do commit `98ce579`) com o plug RAG aplicado por cima (PR #20 — `RAG_ENABLED` + `<ChatPanel />` + `?chat=1` + endpoint `/chat/rag`). Para detalhes técnicos do template SaaS base (auth two-app, Bicep, tickets-service .NET, frontend React), consulte o [README do `apex-helpsphere`](https://github.com/tftec-guilherme/apex-helpsphere/blob/main/README.md).

## 📜 License

[MIT](./LICENSE) · TFTEC Educational Use · Q2-2026

---

<div align="center">

**Prof. Guilherme Campos** · Pós-Graduação Avançada de Cloud com Azure · TFTEC + Anhanguera

</div>
