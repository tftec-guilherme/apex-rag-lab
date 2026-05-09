# apex-rag-lab

> **Lab Intermediário — Disciplina 06: IA e Automação no Azure** · Pós-Graduação Arquitetura Cloud Azure · TFTEC + Anhanguera
>
> Pipeline RAG production-grade passo-a-passo no Portal Azure · companion público do [`apex-helpsphere`](https://github.com/tftec-guilherme/apex-helpsphere) · `version-anchor: Q2-2026` · `status: v0.2.0 ATIVO Wave 4`

---

## Status

✅ **Companion público ATIVO do Lab Intermediário D06.** Todo o material que o aluno precisa para reproduzir o lab (guia completo, scripts Python copy-paste, instruções de download dos PDFs sample, snippets HTTP de teste) vive aqui.

> **Histórico:** este repo foi marcado DEPRECATED em 2026-05-08 sob a hipótese de que o conteúdo viveria apenas no monorepo `azure-retail`. A reversão foi cravada porque o monorepo é privado da TFTEC e o aluno não tem acesso. Detalhes em [`DECISION-LOG.md`](./DECISION-LOG.md). Conteúdo da arquitetura RAG anterior (Cognitive Search Skillset declarativo) preservado em [`archive/`](./archive/).

## 🎯 Objetivo pedagógico

Construir, **manualmente via Portal Azure**, um pipeline RAG (Retrieval-Augmented Generation) production-grade sobre 3 PDFs públicos da Microsoft Learn, usando 4 services AI integrados:

- **Azure AI Document Intelligence** (`prebuilt-layout`) — chunking layout-aware
- **Azure AI Vision** (OCR) — extração de texto de screenshots de tickets
- **Azure AI Translator** — atendimento multilíngue (detect + translate)
- **Azure AI Search Standard S1** (vector hybrid) — índice com embeddings 3072 dim
- **Azure OpenAI** (`text-embedding-3-large` + `gpt-4.1-mini`) — embeddings + chat
- **Azure Function App** (Python) — orquestrador `/chat/rag` plugado no HelpSphere

Aluno termina o lab com **um endpoint RAG funcional** plugado ao [`apex-helpsphere`](https://github.com/tftec-guilherme/apex-helpsphere) que sugere resposta em <2s para tickets dos atendentes tier 1 da Apex Group.

## 🔌 Estado final do plug no `apex-helpsphere` (referência didática)

A **Parte 8** deste guia ensina como **plugar** o RAG no template `apex-helpsphere` (env vars + ChatPanel React + endpoint backend `/chat/rag` proxy + flag `?chat=1`). Você implementa esse plug do zero seguindo o passo-a-passo do guia, no seu fork.

Se quiser consultar como fica o **estado final implementado** dos 15 arquivos modificados pelo plug (Bicep + backend Python + frontend React + testes Pytest), a referência canônica está na branch [`demo/rag-lab-inter`](https://github.com/tftec-guilherme/apex-helpsphere/tree/demo/rag-lab-inter) do `apex-helpsphere`:

| Arquivo | Tipo | O que faz |
|---|---|---|
| `infra/main.bicep` + `infra/main.parameters.json` | Bicep | Params `ragEnabled`, `ragFunctionUrl`, `ragFunctionKey` (secure) → env vars Container App |
| `app/backend/blueprints/rag_chat.py` | Python | Endpoint `POST /chat/rag` com JWT validation (`app_tenant_id`) + proxy para Function App |
| `app/backend/app.py` + `blueprints/__init__.py` | Python | Registro do blueprint + flag `ragEnabled` em `/auth_setup` |
| `app/frontend/src/components/ChatPanel/{ChatPanel.tsx,module.css,index.ts}` | React | Painel flutuante bottom-right com form (ticket + descrição) + result (suggestion + confidence + citations) + minimize/close |
| `app/frontend/src/api/rag.ts` + `api/index.ts` | TypeScript | Cliente HTTP do `/chat/rag` |
| `app/frontend/src/Shell.tsx` | React | Hook `useChatQueryFlag` + triple-gate `ragEnabled && enableChat && ?chat=1` |
| `app/frontend/src/authConfig.ts` | TypeScript | Propaga flag `ragEnabled` ao frontend via `/auth_setup` |
| `tests/test_rag_chat.py` | Pytest | 256 linhas testando endpoint proxy (200/401/502/503) |
| `CHANGELOG.md` + `PARA-O-ALUNO.md` | Docs | Notas pedagógicas da feature |

> ⚠️ **A branch `main` do `apex-helpsphere` NÃO contém esse código** — para fins pedagógicos, você implementa do zero seguindo este guia (`apex-rag-lab`). A branch `demo/rag-lab-inter` é apenas referência para consulta caso fique travado em algum passo da Parte 8 — **não dê fork dela como ponto de partida do lab**, dê fork de `main` e siga o guia.

## 📦 Estrutura do repo

```
apex-rag-lab/
├── README.md                          # ← você está aqui
├── PARA-O-ALUNO.md                    # entrypoint pedagógico (gotchas + custo + quick start)
├── DECISION-LOG.md                    # decisões pedagógicas + arquiteturais
├── CHANGES.md                         # diff vs guia v5 + roadmap de versões
├── CHANGELOG.md                       # changelog técnico
├── docs/
│   ├── 00-guia-completo.md            # ★ guia integral 9 partes (~2070 linhas)
│   ├── parte-01.md                    # navegação rápida — Provisionar fundação
│   ├── parte-02.md                    # Document Intelligence
│   ├── parte-03.md                    # AI Vision (OCR)
│   ├── parte-04.md                    # AI Translator
│   ├── parte-05.md                    # AI Search vector index
│   ├── parte-06.md                    # Azure OpenAI deployments
│   ├── parte-07.md                    # Function App orquestração
│   ├── parte-08.md                    # Plug no apex-helpsphere
│   ├── parte-09.md                    # Medição + Cleanup
│   └── troubleshooting.md             # erros comuns + diagnóstico
├── snippets/                          # scripts Python + HTTP copy-paste extraídos do guia
│   ├── README.md
│   ├── index_pdfs.py
│   ├── create_search_index.py
│   ├── index_to_search.py
│   ├── function_app.py
│   ├── eval_rag.py
│   ├── requirements.txt
│   ├── test_vision_ocr.sh
│   ├── test_translator.sh
│   └── test_chat_rag.http
├── sample-kb/
│   └── README.md                      # instruções para baixar 3 PDFs Microsoft Learn (~3MB)
├── archive/                           # conteúdo pré-Wave 4 preservado para referência
│   ├── README.md
│   ├── docs-pre-wave4/                # 10 capítulos da arquitetura Cognitive Search Skillset
│   ├── snippets-pre-wave4/            # 5 snippets JSON REST API
│   └── sample-kb-pre-wave4/           # CONTEXT.md + outline do PDF #1
├── images/                            # screenshots Portal Q2-2026 (capturados ao executar)
├── LICENSE                            # MIT
├── SECURITY.md
└── CONTRIBUTING.md
```

## 🚀 Como começar

```bash
git clone https://github.com/tftec-guilherme/apex-rag-lab.git
cd apex-rag-lab

# 1. Leia o entrypoint pedagógico (5 min)
# Abra PARA-O-ALUNO.md

# 2. Baixe os 3 PDFs sample (5 min)
# Siga as instruções em sample-kb/README.md

# 3. Execute o lab seguindo o guia (~8h em 1 sessão dedicada)
# Abra docs/00-guia-completo.md OU navegue por partes em docs/parte-01.md → parte-09.md

# 4. NÃO ESQUEÇA o cleanup (1 min, crítico para custo)
az group delete --name rg-lab-intermediario --yes --no-wait
```

## 💰 Custo realista

| Cenário | Custo |
|---------|-------|
| Lab completo provisionado e deletado no mesmo dia (~8h) | **R$ 21-29** saindo do bolso |
| Recursos esquecidos ligados 1 mês | R$ 280-320 |
| Free Trial USD 200 | ❌ **NÃO funciona** — Azure OpenAI exige Pay-As-You-Go |

**Recurso mais caro:** AI Search Standard S1 (R$ 8,30/dia, R$ 250/mês se ficar ligado). **Regra de ouro:** ao final, `az group delete --name rg-lab-intermediario --yes --no-wait`.

## 🧱 Pré-requisitos

- Subscription Azure **Pay-As-You-Go** (Free Trial não serve)
- Cartão de crédito internacional vinculado
- **Bloco 2 da Disciplina 06 concluído** — `rg-helpsphere-ia` provisionado com Foundry Hub `aifhub-apex-prod` + Project base `aifproj-helpsphere-base`
- Quota Azure OpenAI aprovada na subscription com **≥30K TPM** para `text-embedding-3-large` e **≥30K TPM** para `gpt-4.1-mini` (peça via support request 1-3 dias antes — Pré-aula 0)
- Azure CLI 2.x · Azure Developer CLI (`azd`) · VS Code com extensão Azure Functions
- Python 3.11+ (para scripts de indexação)
- Postman ou similar (para testes REST da Function App)
- Owner ou (Contributor + User Access Administrator) no escopo da subscription

## 🏗️ Arquitetura (high-level)

```
PDFs (3 públicos Microsoft Learn)
   │
   ▼
Document Intelligence (prebuilt-layout) ─── chunks layout-aware
   │
   ▼
text-embedding-3-large (3072 dim) ─── embeddings
   │
   ▼
AI Search Standard S1 ─── índice vector hybrid
   │
   ▼
Function App `/chat/rag` ─── orquestrador (Python)
   │   ├─ retrieval (top-5 chunks)
   │   ├─ gpt-4.1-mini (chat completion grounded)
   │   ├─ AI Vision (OCR de screenshots opcional)
   │   └─ AI Translator (multilíngue opcional)
   ▼
apex-helpsphere frontend ─── botão "Sugerir resposta"
```

## 📚 Cross-references

- [`apex-helpsphere`](https://github.com/tftec-guilherme/apex-helpsphere) — SaaS host HelpSphere (Parte 8 plugga o RAG aqui)
- [`apex-helpsphere-agente-lab`](https://github.com/tftec-guilherme/apex-helpsphere-agente-lab) — companion do Lab **Final** D06 (Agente Foundry + n8n)
- [`apex-helpsphere-prod-lab`](https://github.com/tftec-guilherme/apex-helpsphere-prod-lab) — companion do Lab **Avançado** D06 (production-grade pipeline)
- Microsoft Learn — [Azure AI Search vector index](https://learn.microsoft.com/azure/search/vector-search-overview)
- Microsoft Learn — [Document Intelligence prebuilt-layout](https://learn.microsoft.com/azure/ai-services/document-intelligence/concept-layout)
- Microsoft Learn — [Azure OpenAI text-embedding-3-large](https://learn.microsoft.com/azure/ai-services/openai/concepts/models#embeddings-models)

## 🔖 Versão

`v0.2.0` (Wave 4 restored) · `version-anchor: Q2-2026`

### Política de revisão anual

- Comparar Portal screenshots vs UI atual (capturar novos se >30% mudou)
- Verificar disponibilidade dos modelos `text-embedding-3-large` e `gpt-4.1-mini` (Microsoft pode bumparr versão default)
- Validar pricing AI Search Standard S1 + Document Intelligence S0 (mudam a cada ~6-12 meses)
- Verificar URLs dos 3 PDFs Microsoft Learn (caso movam de path)

## 📜 License

[MIT](./LICENSE) · TFTEC Educational Use · Q2-2026
