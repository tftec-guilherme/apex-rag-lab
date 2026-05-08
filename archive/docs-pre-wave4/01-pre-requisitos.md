# Capítulo 01 — Pré-requisitos

> **Objetivo:** garantir que sua subscription Azure, suas permissões, sua quota regional e seu laptop estão prontos para os 9 capítulos seguintes. Investir 10 minutos aqui economiza 1 hora de troubleshooting depois.

> **Tempo:** 10-15 minutos · **Custo:** R$ 0 (só validação)

---

## 1. O que você vai ter no final do lab

Um pipeline RAG funcional rodando no Portal Azure que responde perguntas sobre 8 PDFs corporativos da Apex Group em pt-BR — sem escrever código, sem CLI obrigatório, só clicando no Portal.

**Stack final (provisionada por você manualmente):**

| Recurso Azure | Função | Tier |
|---|---|---|
| Resource Group `rg-apex-rag-lab-{aluno}` | Contêiner lógico de tudo | — |
| Storage Account | Hospedar os 8 PDFs | Standard LRS |
| Document Intelligence | OCR + layout-aware chunking | S0 (pay-as-you-go) |
| AI Search | Index vetorial + semantic ranker | Basic |
| Skillset | Pipeline declarativo Doc Intel → embeddings | grátis (parte do AI Search) |
| Indexer | Conector Storage → Skillset → Index | grátis (parte do AI Search) |

**O que vai funcionar quando o lab terminar:**
- Você abre o **Search Explorer** dentro do AI Search no Portal
- Digita uma pergunta tipo `"qual o prazo de devolução de produto perecível?"`
- Recebe os trechos relevantes dos 8 PDFs com score de relevância e highlight

---

## 2. Permissões e Subscription

### 2.1 Tipo de subscription

Qualquer um destes funciona:

- **Pay-As-You-Go (PAYG)** pessoal ou corporativa
- **Visual Studio Enterprise** (subscription do MSDN)
- **Free trial** ($200 USD por 30 dias) — atenção: AI Search Basic consome quota de free credit rapidamente
- **Azure for Students** ($100 USD) — funciona, mas Document Intelligence pode estar restrito; valide no passo 2.4

### 2.2 Role mínimo necessário

Você precisa de **uma destas combinações** na subscription (ou no resource group `rg-apex-rag-lab-{aluno}` se ele já existir):

- ✅ **Owner** (mais simples)
- ✅ **Contributor + User Access Administrator** (mais granular)
- ❌ Contributor sozinho **não basta** — você não conseguirá conceder Managed Identity grants no capítulo 07

### 2.3 Quota regional

Document Intelligence S0 e AI Search Basic não estão disponíveis em todas as regiões. **Use uma destas regiões para garantir disponibilidade total Q2-2026:**

| Região | Doc Intelligence | AI Search Basic | Latência BR |
|---|---|---|---|
| **East US 2** ⭐ recomendado | ✅ | ✅ | ~110ms |
| **West US 3** | ✅ | ✅ | ~150ms |
| **Brazil South** | ⚠️ Doc Intel limitado a `prebuilt-read` | ✅ | ~10ms |

> **Decisão pedagógica:** este lab usa **East US 2** como default. Brazil South tem quota completa de AI Search mas Document Intelligence ainda não suporta `prebuilt-layout` no ano de 2026 — o que é justamente o modelo que vamos usar para chunking layout-aware.

### 2.4 Validação rápida da subscription

Abra o [Cloud Shell](https://shell.azure.com) (botão `>_` no topo do Portal Azure) e cole:

```bash
# 1) Listar suas subscriptions
az account list --output table

# 2) Confirmar a subscription ativa
az account show --query "{name:name, id:id, state:state}" --output table

# 3) Validar permissão na subscription
az role assignment list --assignee $(az account show --query user.name -o tsv) --query "[].{role:roleDefinitionName, scope:scope}" --output table

# 4) Validar quota Doc Intelligence em East US 2
az cognitiveservices account list-skus --location eastus2 --query "[?kind=='FormRecognizer'].{name:name, tier:tier}" --output table
```

**O que você deve ver:**

- Subscription `state: Enabled`
- Role `Owner` ou `Contributor` + `User Access Administrator`
- SKU `S0` listado para FormRecognizer (Document Intelligence)

Se algum dos 4 comandos der erro de permissão, **pare aqui** — fale com seu admin de subscription antes de prosseguir.

---

## 3. Laptop e ferramentas

### 3.1 Hardware mínimo

- **2 GB RAM livre** (Portal Azure + abas paralelas + opcionalmente Cloud Shell)
- **Conexão de internet estável** (você vai fazer upload de ~25 MB de PDFs no cap 04)
- **Resolução mínima 1366x768** (Portal tem layout responsivo, mas screenshots foram capturados em 1920x1080)

### 3.2 Software

| Ferramenta | Necessária? | Versão |
|---|---|---|
| **Navegador moderno** (Edge / Chrome / Firefox) | ✅ obrigatória | últimas 2 versões |
| **Cloud Shell** (no Portal) | ✅ embutida | — |
| **Editor de texto** (VS Code recomendado) | 🟡 opcional | — |
| **Postman / Insomnia / REST Client** | 🟡 opcional (cap 09) | — |
| **Azure Storage Explorer** desktop | 🟡 opcional (cap 04 alternativo) | — |

### 3.3 Logado no Portal

Acesse [portal.azure.com](https://portal.azure.com) e confirme:

- [ ] Login com a conta correta (canto superior direito mostra o tenant)
- [ ] Subscription correta selecionada (filtro no topo)
- [ ] Você consegue ver a aba **Resource groups** sem erro de RBAC

---

## 4. Custo real esperado

Tabela de **custo total estimado** para uma execução completa do lab (provisionar → testar → cleanup imediato):

| Item | Custo unitário | Quantidade | Subtotal |
|---|---|---|---|
| Document Intelligence (`prebuilt-layout`) | ~$0,01 USD/página | ~80 páginas (8 PDFs ~10 pp cada) | ~$0,80 USD |
| AI Search Basic (idle) | ~$0,30 USD/hora | 2 horas (lab + buffer) | ~$0,60 USD |
| Storage Account (LRS, 25 MB) | ~$0,02 USD/GB-mês | irrelevante por 1 dia | <$0,01 USD |
| Egress de dados | grátis até 100 GB/mês | irrelevante | $0 |
| **Total em USD** | | | **~$1,40 USD** |
| **Total em BRL** (cotação Q2-2026) | | | **~R$ 7-10** |

> ⚠️ **AI Search é cobrado por hora ATÉ você deletar.** Se você esquecer de deletar o RG no cap 10, o custo cresce ~R$ 7/dia. **Cleanup é obrigatório.**

> ✅ **Document Intelligence free tier:** você tem 500 páginas/mês grátis na primeira vez que cria o recurso. 8 PDFs com ~10 páginas cada = 80 páginas, então este lab cabe inteiro no free tier se for sua primeira vez.

---

## 5. Convenções do tutorial

Para você não se perder ao ler comandos com placeholders:

| Placeholder | Substitua por | Exemplo |
|---|---|---|
| `{aluno}` | seu nome curto, sem espaço/acento | `gpc`, `joaosilva`, `mariaa` |
| `{region}` | região Azure escolhida no §2.3 | `eastus2` (default deste lab) |
| `{rg-name}` | nome do resource group | `rg-apex-rag-lab-gpc` |
| `{storage-name}` | nome do storage account (3-24 chars, lowercase, único global) | `stapexraglabgpc` |
| `{search-name}` | nome do AI Search service (2-60 chars, único global) | `srch-apex-rag-lab-gpc` |
| `{docint-name}` | nome do Doc Intelligence (2-64 chars) | `cog-docint-apex-gpc` |

**Regra de naming:** todos os recursos seguem `<tipo>-apex-rag-lab-{aluno}` para você identificar rapidamente no Cost Management.

**Regra de tags:** vamos aplicar 3 tags em todos os recursos no cap 02:
- `course = D06-IA-Automacao-Azure`
- `lab = intermediario`
- `student = {aluno}`

---

## 6. Pre-flight checklist

Antes de avançar para o capítulo 02, confirme **todos** estes itens:

- [ ] Subscription Azure ativa (estado `Enabled`)
- [ ] Role `Owner` (ou `Contributor` + `User Access Administrator`) na subscription
- [ ] Acesso confirmado a `eastus2` (validado via Cloud Shell no §2.4)
- [ ] Document Intelligence S0 disponível na região
- [ ] Login no Portal Azure funcionando ([portal.azure.com](https://portal.azure.com))
- [ ] 2 GB RAM livre no laptop
- [ ] Navegador atualizado (últimas 2 versões)
- [ ] Cartão de crédito vinculado à subscription **ou** free trial ativo com saldo
- [ ] Você leu até o fim a tabela de custo na §4 e está OK gastar ~R$ 10
- [ ] (Opcional) Você tem o `apex-helpsphere` provisionado para o cap 09 — **não obrigatório, este lab é standalone**

---

## 7. Arquitetura completa do que você vai construir

```
┌──────────────────────────────────────────────────────────────────────┐
│  Subscription Azure ({aluno})                                          │
│                                                                        │
│  Resource Group: rg-apex-rag-lab-{aluno} (eastus2)                    │
│                                                                        │
│  ┌─────────────────────────┐                                          │
│  │  Storage Account        │     8 PDFs corporativos pt-BR (~25MB)   │
│  │  st-apex-rag-lab-{aluno}│ ──▶ Container "kb-source"               │
│  │  (Standard LRS)         │                                          │
│  └─────────────────────────┘                                          │
│              │                                                          │
│              │ Indexer puxa blobs (cap 07)                             │
│              ▼                                                          │
│  ┌─────────────────────────────────────────────────────────────┐      │
│  │  AI Search Service (Basic)                                   │      │
│  │  srch-apex-rag-lab-{aluno}                                   │      │
│  │                                                                │      │
│  │  ├── Skillset:                                                │      │
│  │  │     └── DocumentIntelligenceLayoutSkill                    │      │
│  │  │           (chama Doc Intelligence prebuilt-layout)         │      │
│  │  │     └── SplitSkill (chunks 512 tokens, overlap 64)         │      │
│  │  │     └── (opcional cap 09) AzureOpenAIEmbeddingSkill        │      │
│  │  │                                                              │      │
│  │  ├── Index: kb-apex-index                                      │      │
│  │  │     ├── content (chunked text)                             │      │
│  │  │     ├── source_pdf, page_number, chunk_id (metadata)       │      │
│  │  │     └── content_vector (3072-dim, opcional cap 09)         │      │
│  │  │                                                              │      │
│  │  └── Indexer: kb-apex-indexer (schedule on-demand)            │      │
│  └─────────────────────────────────────────────────────────────┘      │
│              │                                                          │
│              │ chama via Skillset                                      │
│              ▼                                                          │
│  ┌─────────────────────────┐                                          │
│  │  Document Intelligence  │     prebuilt-layout (OCR + layout)      │
│  │  cog-docint-apex-{aluno}│                                          │
│  │  (S0)                   │                                          │
│  └─────────────────────────┘                                          │
│                                                                        │
│  Resultado final: queries no Search Explorer retornam chunks         │
│  relevantes dos PDFs com score, highlight e source attribution       │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 8. O que NÃO vai aparecer neste lab (e por quê)

Este é o **Lab Intermediário**. Para manter foco e custo baixo, deixamos de fora:

- ❌ **Azure OpenAI embeddings** (cap 09 mostra como adicionar opcionalmente; sem isso, vamos usar BM25 + semantic ranker)
- ❌ **Vector search dedicado** (idem cap 09)
- ❌ **APIM gateway** (Lab Avançado)
- ❌ **Foundry agents + ferramentas** (Lab Final)
- ❌ **Content Safety / prompt shields** (Lab Avançado)
- ❌ **Service Bus / Event Grid eventos** (Lab Final)

> **Filosofia pedagógica:** cada lab adiciona um conceito novo. Se você sair daqui dominando **skillset declarativo + indexer + Search Explorer**, já está pronto pro Lab Avançado.

---

## 9. Próximo passo

Quando você marcar todos os itens do pre-flight checklist do §6:

→ **Avance para [Capítulo 02 — Criar o Resource Group](./02-criar-resource-group.md)**

> Se algum item do checklist falhou, vá direto para [troubleshooting.md](./troubleshooting.md#capítulo-01) antes de prosseguir.

---

**📚 Companion repos:**
- [`apex-helpsphere`](https://github.com/tftec-guilherme/apex-helpsphere) — SaaS HelpSphere base (tickets seed que o RAG resolve no cap 09)
- [`azure-retail`](https://github.com/tftec-guilherme/azure-retail) — Bicep automation equivalente (`Disciplina_06_*/03_Aplicações/lab-inter-bicep/` · ground truth técnico)
