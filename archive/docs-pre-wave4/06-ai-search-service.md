# Capítulo 06 — Provisionar AI Search

> **Objetivo:** criar o serviço Azure AI Search no tier Basic, capturar admin-key (read+write) e query-key (read-only), e validar via Cloud Shell antes de configurar Skillset + Indexer no cap 07.

> **Tempo:** 10-15 minutos · **Custo:** ~R$ 7/dia enquanto provisionado (cobrança por hora)

---

## 1. Tier choice — por que Basic?

Azure AI Search tem 4 tiers principais:

| Tier | Storage | Replicas | Quando usar | Custo/mês |
|---|---|---|---|---|
| **Free** | 50 MB | 1 | Smoke test apenas (sem semantic ranker) | $0 |
| **Basic** ⭐ deste lab | 2 GB | 1-3 | Lab + projetos pequenos com semantic ranker | ~$210/mês ($0,30/h) |
| **Standard S1** | 25 GB | 1-12 | Produção pequena/média | ~$885/mês |
| **Standard S2** | 100 GB | 1-12 | Produção média/grande | ~$2.340/mês |

> **Por que não Free?** Free tier **NÃO tem semantic ranker** (re-ranking neural pós-retrieve). Cap 09 vai mostrar como semantic ranker melhora top-K significativamente. Sem ele, o lab perde o "wow effect" do RAG canônico.

> **Custo do lab:** Basic cobra ~$0,30/hora ENQUANTO existe. Lab de 2h = ~$0,60. Esquecer ligado 1 mês = $210. **Cleanup obrigatório no cap 10.**

---

## 2. Capacidades semantic ranker e vector search

Azure AI Search é um **híbrido** de:

1. **BM25** (Information Retrieval clássico — TF-IDF com normalização de length)
2. **Vector search** (HNSW, embeddings text-embedding-3-large 3072-dim) — opcional cap 09
3. **Semantic ranker** (modelo neural Microsoft-treinado pra re-ranking dos top-50 do BM25/vector) — disponível em Basic+

Cap 09 explora as 3 modalidades + a combinação (`hybrid`). Por ora, basta saber que Basic já desbloqueia tudo.

---

## 3. Passo a passo via Portal

### 3.1 Buscar AI Search no Marketplace

1. Portal Azure → Resource Group `rg-apex-rag-lab-{aluno}`
2. Topo da aba: **+ Create**
3. Marketplace search: `Azure AI Search`
4. Card: **Azure AI Search** (Microsoft, ícone de lupa azul)
5. Clique em **Create**

📸 *Screenshot: card Azure AI Search no Marketplace*

### 3.2 Aba "Basics"

| Campo | Valor | Por quê |
|---|---|---|
| **Subscription** | (do cap 01) | herdada |
| **Resource group** | `rg-apex-rag-lab-{aluno}` | herdada |
| **Service name** | `srch-apex-rag-lab-{aluno}` | naming convention |
| **Location** | `East US 2` | mesma do RG |
| **Pricing tier** | **Basic** | §1 |

> **Naming gotcha:** Service name aceita 2-60 chars, lowercase + hifens. Único global em `*.search.windows.net`.

### 3.3 Aba "Scale"

Clique em **Next: Scale >**.

Mantenha **Replicas: 1** e **Partitions: 1** (mínimo do tier Basic). Nenhum benefício em escalar pra lab descartável.

### 3.4 Aba "Networking"

Clique em **Next: Networking >**.

Mantenha **Endpoint connectivity: Public**.

### 3.5 Aba "Identity"

Clique em **Next: Identity >**.

**HABILITE System-assigned managed identity:**

| Campo | Valor |
|---|---|
| **System assigned managed identity** | ✅ **On** |

> **Por que MI no AI Search?** No cap 07 vamos usar o Skillset com `DocumentIntelligenceLayoutSkill`. Pode autenticar de 2 formas:
> 1. **Key direto no skillset** (simples, mas key vaza nos logs e versionamento)
> 2. **Managed Identity** do AI Search → role `Cognitive Services User` no Document Intelligence ⭐ recomendado
>
> Vamos seguir o caminho #2 no cap 07. Habilitar MI agora evita ter que voltar depois.

### 3.6 Aba "Tags"

3 tags habituais:
- `course = D06-IA-Automacao-Azure`
- `lab = intermediario`
- `student = {aluno}`

### 3.7 Review + create

Clique em **Next: Review + create >**, aguarde validação ✅, clique em **Create**.

⏳ **Tempo:** **2-5 minutos** (mais lento que outros recursos — AI Search inicializa cluster).

---

## 4. Capturar keys e endpoint

Após deploy, **Go to resource**.

### 4.1 Endpoint (URL do serviço)

A URL do AI Search é deterministicamente:

```
https://srch-apex-rag-lab-{aluno}.search.windows.net
```

Você verifica no overview do recurso → campo **URL**.

### 4.2 Admin keys e Query keys

Menu lateral esquerdo:
- **Settings** → **Keys**

Você vê 2 seções:

**Manage admin keys** (acesso TOTAL — read + write index/skillset/indexer):
- `Primary admin key`
- `Secondary admin key`

**Manage query keys** (acesso READ-ONLY — só search):
- 1 query key default chamada `default`
- Botão "+ Add query key" pra criar mais

### 4.3 Salvar em `secrets.txt`

```
# Capítulo 06
SEARCH_ENDPOINT=https://srch-apex-rag-lab-gpc.search.windows.net
SEARCH_ADMIN_KEY=ACENTRY...
SEARCH_QUERY_KEY=GUEST...
```

### 4.4 Quando usar cada key

| Operação | Key correta |
|---|---|
| Criar/atualizar index, skillset, indexer (cap 07) | Admin key |
| Re-rodar indexer manualmente | Admin key |
| Search Explorer no Portal (cap 08) | Admin key (Portal usa por baixo) |
| App ou frontend que SÓ faz queries (cap 09) | **Query key** ⭐ |

> **Princípio least privilege:** apps de produção que só fazem search não devem ter admin key. Query key bloqueia mutações por design.

📸 *Screenshot: aba Keys com admin keys + query keys visíveis*

---

## 5. Conceder MI do AI Search acesso a Document Intelligence

Para o Skillset do cap 07 funcionar com MI (em vez de key), precisamos dar role.

### 5.1 Via Portal

1. Vá pro recurso **Document Intelligence** (`cog-docint-apex-{aluno}`)
2. Menu lateral → **Access control (IAM)**
3. **+ Add** → **Add role assignment**
4. **Role:** `Cognitive Services User`
5. **Members:** **Managed identity** → `+ Select members`
6. **Subscription:** sua subscription
7. **Managed identity:** `Search Service` (filtro de tipo)
8. Selecione `srch-apex-rag-lab-{aluno}`
9. **Review + assign** → **Assign**

📸 *Screenshot: role assignment com Managed Identity selecionado*

### 5.2 Via Cloud Shell

```bash
RG_NAME="rg-apex-rag-lab-gpc"
SEARCH_NAME="srch-apex-rag-lab-gpc"
DOCINT_NAME="cog-docint-apex-gpc"

# Pegar principal ID do MI do AI Search
SEARCH_MI_PRINCIPAL=$(az search service show \
  --name "$SEARCH_NAME" \
  --resource-group "$RG_NAME" \
  --query identity.principalId \
  --output tsv)

# Pegar resource ID do Doc Intelligence
DOCINT_ID=$(az cognitiveservices account show \
  --name "$DOCINT_NAME" \
  --resource-group "$RG_NAME" \
  --query id \
  --output tsv)

# Atribuir role
az role assignment create \
  --assignee-object-id "$SEARCH_MI_PRINCIPAL" \
  --assignee-principal-type ServicePrincipal \
  --role "Cognitive Services User" \
  --scope "$DOCINT_ID"
```

⏳ **Tempo de propagação:** 30-90 segundos.

### 5.3 Conceder MI também no Storage Account

O Indexer do cap 07 precisa **ler blobs** do `kb-source` via MI.

```bash
SA_NAME="stapexraglabgpc"
SA_ID=$(az storage account show \
  --name "$SA_NAME" \
  --resource-group "$RG_NAME" \
  --query id \
  --output tsv)

az role assignment create \
  --assignee-object-id "$SEARCH_MI_PRINCIPAL" \
  --assignee-principal-type ServicePrincipal \
  --role "Storage Blob Data Reader" \
  --scope "$SA_ID"
```

> **Por que `Reader` e não `Contributor`?** Indexer só **lê** os blobs (puxa pra processar). Não escreve nada de volta. Least privilege.

---

## 6. Validação

### 6.1 Smoke test via REST direto

```bash
SEARCH_ENDPOINT="https://srch-apex-rag-lab-gpc.search.windows.net"
SEARCH_ADMIN_KEY="ACENTRY..."

# List indexes (deve retornar lista vazia — não criamos nada ainda)
curl -sS -X GET \
  "${SEARCH_ENDPOINT}/indexes?api-version=2024-07-01" \
  -H "api-key: ${SEARCH_ADMIN_KEY}" | jq '.value | length'
```

Saída esperada: `0` (zero indexes existem).

```bash
# Service stats
curl -sS -X GET \
  "${SEARCH_ENDPOINT}/servicestats?api-version=2024-07-01" \
  -H "api-key: ${SEARCH_ADMIN_KEY}" | jq '.counters'
```

Saída esperada (algo similar):

```json
{
  "documentCount": { "usage": 0, "quota": null },
  "indexesCount": { "usage": 0, "quota": 15 },
  "indexersCount": { "usage": 0, "quota": 15 },
  "dataSourcesCount": { "usage": 0, "quota": 15 },
  "storageSize": { "usage": 0, "quota": 2147483648 },
  "synonymMaps": { "usage": 0, "quota": 3 },
  "skillsetCount": { "usage": 0, "quota": 15 }
}
```

✅ Service vivo, quota Basic confirmada (15 indexes max, 2 GB storage, etc.).

### 6.2 Checklist

- [ ] Recurso `srch-apex-rag-lab-{aluno}` criado, status **Succeeded**
- [ ] Pricing tier **Basic**
- [ ] System-assigned MI **habilitada**
- [ ] Endpoint HTTPS no formato `https://*.search.windows.net`
- [ ] Admin key e Query key capturadas em `secrets.txt`
- [ ] MI tem role `Cognitive Services User` no Doc Intelligence
- [ ] MI tem role `Storage Blob Data Reader` no Storage Account
- [ ] `servicestats` retorna 200 OK com quota Basic visível

---

## 7. Troubleshooting comum

### ❌ "The location 'eastus2' is not available for SKU 'basic'"

Quota regional cheia em `East US 2` para Basic tier. Tente `westus3` (mas mantenha consistência: TODOS os recursos precisam estar na mesma região para Skillset/Indexer funcionarem com MI).

### ❌ Provisionamento demora >10 minutos

AI Search às vezes leva tempo pra alocar cluster compartilhado em Basic. Se passar de 10min, cancele e tente região alternativa.

### ❌ "AuthorizationFailed" ao criar role assignment

Você não tem `User Access Administrator` na subscription. Volte cap 01 §2.2 — você precisa de Owner OU (Contributor + User Access Administrator).

### ❌ MI não aparece em "Managed identity" picker

Esqueceu de habilitar System-Assigned MI no §3.5. Solução: AI Search → **Settings** → **Identity** → toggle **System assigned** → **On** → Save → aguarde 30s → tente role assignment de novo.

### ❌ `servicestats` retorna 403 Forbidden

Você usou Query key em vez de Admin key. Confira `secrets.txt` e re-tente com `SEARCH_ADMIN_KEY`.

---

## 8. Próximo passo

AI Search Basic provisionado, MI habilitada, role assignments aplicados, smoke test 200 OK?

→ **Avance para [Capítulo 07 — Skillset declarativo + Indexer](./07-skillset-indexer.md)**

> Capítulo 07 é o coração do lab: monta o Skillset declarativo (Doc Intelligence layout → split chunking) + Index schema + Indexer que puxa blobs e popula o índice. Depois disso, o lab tá funcional — caps 08-09 são consumo + queries.
