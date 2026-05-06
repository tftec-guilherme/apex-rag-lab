# apex-rag-lab

> **Lab Intermediário — Disciplina 06: IA e Automação no Azure (Pós-Graduação Arquitetura Cloud Azure · TFTEC + Anhanguera)**
>
> Pipeline RAG production-grade passo-a-passo no Portal Azure · companion didático do [`apex-helpsphere`](https://github.com/tftec-guilherme/apex-helpsphere) · `version-anchor: Q2-2026`

> ⚠️ **Status:** `v0.1.0-init` — skeleton em construção. Conteúdo (8 PDFs sample-kb + 10 capítulos passo-a-passo + snippets + screenshots) será adicionado em sessões dedicadas. Veja [CHANGES.md](./CHANGES.md) para roadmap.

## 🎯 Objetivo pedagógico

Construir, **manualmente via Portal Azure**, um pipeline RAG (Retrieval-Augmented Generation) sobre 8 PDFs corporativos realistas em pt-BR usando:

- **Azure Storage Account** (Blob)
- **Azure AI Document Intelligence** (`prebuilt-layout`)
- **Azure AI Search** (Basic tier)
- **Skillset declarativo** (encadeamento Doc Intelligence → splitter → embedding)
- **Indexer** (consumindo blobs do Storage e populando o índice)
- **Search Explorer** + sample HTML/JS de query

Aluno termina o lab com **um índice RAG funcional** que responde perguntas dos tickets seed do `apex-helpsphere`.

## 🛣️ Caminhos de execução

| Caminho | Para quem | Tempo |
|---|---|---|
| **Portal step-by-step** (este repo) | Aluno aprendendo, primeira vez no Azure | 90-120min |
| **Bicep automation** ([`azure-retail/.../lab-inter-bicep/`](https://github.com/tftec-guilherme/azure-retail)) | Aluno revisitando, verificando Bicep equivalente | 10-15min |

> **Anti-drift garantido:** o Bicep em `azure-retail` é o **ground truth técnico** validado em CI (GitHub Actions). Se o Portal Azure mudar UI, só atualizamos screenshots — o Bicep continua válido.

## 📦 O que está neste repo (quando completo)

```
apex-rag-lab/
├── README.md                          # ← você está aqui
├── DECISION-LOG.md                    # decisões pedagógicas + arquiteturais
├── CHANGES.md                         # diff vs guia v5 original + roadmap de versões
├── PARA-O-ALUNO.md                    # gotchas + custo real + dicas
├── docs/                              # 10 capítulos passo-a-passo Portal
│   ├── 01-pre-requisitos.md
│   ├── 02-criar-resource-group.md
│   ├── 03-storage-account-blob.md
│   ├── 04-upload-pdfs-sample-kb.md
│   ├── 05-document-intelligence.md
│   ├── 06-ai-search-service.md
│   ├── 07-skillset-indexer.md
│   ├── 08-test-search-explorer.md
│   ├── 09-rag-query-sample.md
│   ├── 10-cleanup.md
│   └── troubleshooting.md
├── sample-kb/                         # 8 PDFs corporativos realistas pt-BR (~25MB)
│   ├── manual_operacao_loja_v3.pdf
│   ├── runbook_sap_fi_integracao.pdf
│   ├── faq_pedidos_devolucao.pdf
│   ├── politica_reembolso_lojista.pdf
│   ├── manual_pos_funcionamento.pdf
│   ├── runbook_problemas_rede.pdf
│   ├── faq_horario_atendimento.pdf
│   ├── politica_dados_lgpd.pdf
│   └── README.md
├── snippets/                          # JSON/REST copy-paste extraídos do Bicep validado
│   ├── skillset.json
│   ├── index-schema.json
│   ├── indexer.json
│   └── query-rag-sample.http
└── images/                            # Screenshots Portal Q2-2026 (capturados da execução real)
```

## 🚀 Como começar (quando v1.0 sair)

```bash
git clone https://github.com/tftec-guilherme/apex-rag-lab.git
cd apex-rag-lab
# Abrir docs/01-pre-requisitos.md no editor de markdown
```

## 💰 Custo estimado

- **Document Intelligence** (free tier inicial · S0 após): ~R$ 0 - R$ 5
- **AI Search Basic**: ~R$ 7/dia (~R$ 0,30/h)
- **Storage Account** (8 PDFs ~25MB): ~R$ 0,01/mês
- **Lab completo (1-2h de execução manual)**: **<R$ 10**
- **Cleanup obrigatório:** `docs/10-cleanup.md` (delete RG = ~R$ 0/mês)

## 🧱 Pré-requisitos

- Subscription Azure ativa com permissão de criar recursos (Owner ou Contributor + User Access Administrator)
- ~2GB RAM livre no laptop
- Navegador moderno (Edge/Chrome/Firefox)
- (Opcional) Postman, Insomnia ou similar para testar queries REST

## 🏗️ Arquitetura (high-level)

```
┌──────────────────────────────────────────────────────────────┐
│  Azure Subscription (aluno)                                   │
│                                                                │
│  Resource Group: rg-apex-rag-lab-{aluno}                      │
│                                                                │
│  ┌──────────────┐    ┌─────────────────────┐                 │
│  │   Storage    │───▶│  Document           │                 │
│  │   Account    │    │  Intelligence       │                 │
│  │  (8 PDFs)    │    │  (prebuilt-layout)  │                 │
│  └──────────────┘    └─────────────────────┘                 │
│         │                      │                               │
│         │                      ▼                               │
│         │              ┌─────────────────┐                    │
│         └─────────────▶│  AI Search      │                    │
│                        │  (Basic tier)   │                    │
│                        │  + Skillset     │                    │
│                        │  + Indexer      │                    │
│                        └─────────────────┘                    │
│                                │                               │
│                                ▼                               │
│                        Search Explorer                         │
│                        (queries RAG)                           │
└──────────────────────────────────────────────────────────────┘
```

> Diagrama detalhado virá em `docs/01-pre-requisitos.md`.

## 📚 Referências

- [`apex-helpsphere`](https://github.com/tftec-guilherme/apex-helpsphere) — SaaS HelpSphere base (tickets seed que o RAG resolve)
- [`azure-retail`](https://github.com/tftec-guilherme/azure-retail) — monorepo da Pós-Graduação · Bicep validation harness em `Disciplina_06_*/03_Aplicações/lab-inter-bicep/`
- Microsoft Learn — Azure AI Search [skillsets](https://learn.microsoft.com/azure/search/cognitive-search-working-with-skillsets)
- Microsoft Learn — Document Intelligence [`prebuilt-layout`](https://learn.microsoft.com/azure/ai-services/document-intelligence/concept-layout)

## 🔖 Versão

`v0.1.0-init` · `version-anchor: Q2-2026` · MCP spec irrelevante (lab não usa MCP — isso fica pro Lab Final)

**Política de revisão anual:**
- Comparar Portal screenshots vs UI atual (capturar novos se >30% mudou)
- Verificar se `prebuilt-layout` continua o modelo recomendado pela Microsoft
- Validar pricing AI Search Basic + Document Intelligence (mudam a cada ~6-12 meses)
- Re-rodar Bicep harness em `azure-retail/.../lab-inter-bicep/` em conta limpa

## 📜 License

[MIT](./LICENSE) · TFTEC Educational Use · Conteúdo fictício corporativo Apex Group · Q2-2026
