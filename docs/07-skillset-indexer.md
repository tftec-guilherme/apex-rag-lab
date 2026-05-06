# Capítulo 07 — Skillset declarativo + Index + Indexer

> **Objetivo:** montar o pipeline de indexação completo via JSON declarativo: **Data Source** (aponta para `kb-source/`) → **Skillset** (Document Intelligence layout + chunking 512 tokens) → **Index schema** (campos searchable + filterable) → **Indexer** (orquestra tudo, on-demand).

> **Tempo:** 25-35 minutos · **Custo:** ~R$ 0,80 (Doc Intelligence vai processar ~80 páginas)

---

## 1. Visão arquitetural — os 4 artefatos

AI Search opera com **4 artefatos** que formam o pipeline:

```
┌────────────────┐  ┌─────────────────┐  ┌──────────────┐  ┌──────────────┐
│ Data Source    │─▶│ Skillset        │─▶│ Index schema │  │ Indexer      │
│ (cap 03 blobs) │  │ (declarativo)   │  │ (campos)     │  │ (orquestra)  │
└────────────────┘  └─────────────────┘  └──────────────┘  └──────────────┘
                          │                                       │
                          │ chama via MI (cap 06)                 │
                          ▼                                       ▼
                    ┌──────────────────┐                ┌──────────────────┐
                    │ Document         │                │ Schedule:        │
                    │ Intelligence     │                │ on-demand        │
                    │ (cap 05)         │                │ (manual run)     │
                    └──────────────────┘                └──────────────────┘
```

**Por que declarativo (JSON) vs imperativo (código Python/C#)?** Skillset declarativo:

- ✅ Versionável em git (snippets neste repo)
- ✅ Re-rodável idempotente
- ✅ Não precisa hospedar/deployar código (AI Search executa)
- ✅ Tem retry e checkpointing nativos

> **Anti-pattern:** processar PDFs em código Python customizado e indexar manualmente. Trabalho desnecessário pra layout standard. Use Skillset.

---

## 2. Pré-requisitos consolidados

Confira cap 06 §6 antes de prosseguir:

- [x] AI Search Basic provisionado
- [x] System-assigned MI habilitada
- [x] MI tem role `Cognitive Services User` no Doc Intelligence
- [x] MI tem role `Storage Blob Data Reader` no Storage Account
- [x] Variáveis exportadas no shell:

```bash
export SEARCH_ENDPOINT="https://srch-apex-rag-lab-gpc.search.windows.net"
export SEARCH_ADMIN_KEY="ACENTRY..."
export SA_NAME="stapexraglabgpc"
export DOCINT_ENDPOINT="https://cog-docint-apex-gpc.cognitiveservices.azure.com/"
export RG_NAME="rg-apex-rag-lab-gpc"
```

---

## 3. Criar o Data Source (aponta pra Storage)

Data Source é a **referência** que o Indexer usa pra saber **onde** estão os documentos.

### 3.1 JSON do Data Source

Arquivo: [`snippets/data-source.json`](../snippets/data-source.json) (será adicionado em v0.2.0)

```json
{
  "name": "kb-apex-datasource",
  "type": "azureblob",
  "credentials": {
    "connectionString": "ResourceId=/subscriptions/{subId}/resourceGroups/{rgName}/providers/Microsoft.Storage/storageAccounts/{saName};"
  },
  "container": {
    "name": "kb-source",
    "query": null
  },
  "dataChangeDetectionPolicy": {
    "@odata.type": "#Microsoft.Azure.Search.HighWaterMarkChangeDetectionPolicy",
    "highWaterMarkColumnName": "metadata_storage_last_modified"
  },
  "dataDeletionDetectionPolicy": {
    "@odata.type": "#Microsoft.Azure.Search.NativeBlobSoftDeleteDeletionDetectionPolicy"
  }
}
```

> **Por que `ResourceId=...` no `connectionString`?** Este formato instrui o Indexer a usar **MI do AI Search** pra autenticar (em vez de account key). Mais seguro, validável (cap 06 §5.3 deu role `Storage Blob Data Reader`).

> **`dataChangeDetectionPolicy`:** Indexer rastreia `metadata_storage_last_modified` em re-runs. Só processa blobs **modificados desde último run**. Economiza páginas de Doc Intelligence.

### 3.2 Criar via REST

Você precisa preencher `{subId}`, `{rgName}` e `{saName}` no JSON.

```bash
SUB_ID=$(az account show --query id --output tsv)

# Substituir placeholders
sed -e "s|{subId}|${SUB_ID}|g" \
    -e "s|{rgName}|${RG_NAME}|g" \
    -e "s|{saName}|${SA_NAME}|g" \
    snippets/data-source.json > /tmp/data-source-rendered.json

# POST
curl -sS -X POST \
  "${SEARCH_ENDPOINT}/datasources?api-version=2024-07-01" \
  -H "Content-Type: application/json" \
  -H "api-key: ${SEARCH_ADMIN_KEY}" \
  --data @/tmp/data-source-rendered.json \
  | jq '.name'
```

Saída esperada: `"kb-apex-datasource"`.

### 3.3 Validar via Portal

1. AI Search service no Portal
2. **Search management** (menu lateral) → **Data sources**
3. Você deve ver `kb-apex-datasource` listado

📸 *Screenshot: Data sources com kb-apex-datasource criado*

---

## 4. Criar o Skillset (pipeline de transformação)

Skillset é a **lista ordenada de transformações** aplicadas a cada blob durante a indexação.

### 4.1 JSON do Skillset

Arquivo: [`snippets/skillset.json`](../snippets/skillset.json) (será adicionado em v0.2.0)

```json
{
  "name": "kb-apex-skillset",
  "description": "Pipeline RAG: Document Intelligence layout + chunking layout-aware",
  "skills": [
    {
      "@odata.type": "#Microsoft.Skills.Util.DocumentIntelligenceLayoutSkill",
      "name": "doc-intel-layout",
      "description": "Extrai paragrafos, tabelas, headings via Doc Intelligence prebuilt-layout",
      "context": "/document",
      "outputMode": "oneToMany",
      "markdownHeaderDepth": "h3",
      "inputs": [
        {
          "name": "file_data",
          "source": "/document/file_data"
        }
      ],
      "outputs": [
        {
          "name": "markdown_document",
          "targetName": "markdown_doc"
        }
      ]
    },
    {
      "@odata.type": "#Microsoft.Skills.Text.SplitSkill",
      "name": "split-chunks",
      "description": "Quebra markdown em chunks de 512 tokens com overlap 64",
      "context": "/document/markdown_doc/sections/*",
      "textSplitMode": "pages",
      "maximumPageLength": 2048,
      "pageOverlapLength": 256,
      "unit": "characters",
      "inputs": [
        {
          "name": "text",
          "source": "/document/markdown_doc/sections/*/content"
        }
      ],
      "outputs": [
        {
          "name": "textItems",
          "targetName": "chunks"
        }
      ]
    }
  ],
  "indexProjections": {
    "selectors": [
      {
        "targetIndexName": "kb-apex-index",
        "parentKeyFieldName": "parent_id",
        "sourceContext": "/document/markdown_doc/sections/*/chunks/*",
        "mappings": [
          { "name": "chunk", "source": "/document/markdown_doc/sections/*/chunks/*" },
          { "name": "title", "source": "/document/markdown_doc/sections/*/title" },
          { "name": "source_file", "source": "/document/metadata_storage_name" },
          { "name": "source_url", "source": "/document/metadata_storage_path" }
        ]
      }
    ],
    "parameters": {
      "projectionMode": "skipIndexingParentDocuments"
    }
  },
  "cognitiveServices": null
}
```

### 4.2 Pontos chave do JSON

| Bloco | Função |
|---|---|
| `DocumentIntelligenceLayoutSkill` | Substitui o velho "DocumentExtractionSkill" + "OcrSkill". Output `markdown_document` é estruturado por seções com headings detectados |
| `SplitSkill` aplicado em `sections/*/content` | Chunking layout-aware: **respeita seções** detectadas pelo Doc Intelligence em vez de cortar pelo meio de parágrafo |
| `indexProjections` | **Anti-pattern:** indexar 1 documento por PDF. **Correto:** indexar 1 documento por **chunk** com `parent_id` = nome do PDF original |
| `projectionMode: skipIndexingParentDocuments` | NÃO duplicar — só persistir os chunks, não o blob inteiro |
| `cognitiveServices: null` | Vamos usar MI do AI Search → não precisa attach key |

### 4.3 Criar via REST

```bash
curl -sS -X PUT \
  "${SEARCH_ENDPOINT}/skillsets/kb-apex-skillset?api-version=2024-07-01" \
  -H "Content-Type: application/json" \
  -H "api-key: ${SEARCH_ADMIN_KEY}" \
  --data @snippets/skillset.json \
  | jq '.name'
```

Saída esperada: `"kb-apex-skillset"`.

### 4.4 Configurar Doc Intelligence access via MI

O `DocumentIntelligenceLayoutSkill` precisa saber qual recurso Doc Intelligence usar. Em vez de passar key, vamos referenciar via Resource ID + MI auth.

Adicione ao Skillset (PATCH):

```bash
DOCINT_NAME="cog-docint-apex-gpc"
DOCINT_RESOURCE_ID="/subscriptions/${SUB_ID}/resourceGroups/${RG_NAME}/providers/Microsoft.CognitiveServices/accounts/${DOCINT_NAME}"

# Patch o skillset
curl -sS -X PUT \
  "${SEARCH_ENDPOINT}/skillsets/kb-apex-skillset?api-version=2024-07-01" \
  -H "Content-Type: application/json" \
  -H "api-key: ${SEARCH_ADMIN_KEY}" \
  --data "$(jq --arg rid "$DOCINT_RESOURCE_ID" \
    '. + {cognitiveServices: {"@odata.type": "#Microsoft.Azure.Search.AIServicesByIdentity", subdomainUrl: "'${DOCINT_ENDPOINT}'", identity: null}}' \
    snippets/skillset.json)"
```

> **Por que `identity: null`?** Significa "use a System-Assigned MI do próprio AI Search". Cap 06 §5 já deu o role.

---

## 5. Criar o Index schema

Index schema define **quais campos vão ser persistidos** e **como cada campo se comporta** (searchable, filterable, sortable, etc.).

### 5.1 JSON do Index

Arquivo: [`snippets/index-schema.json`](../snippets/index-schema.json) (será adicionado em v0.2.0)

```json
{
  "name": "kb-apex-index",
  "fields": [
    {
      "name": "id",
      "type": "Edm.String",
      "key": true,
      "searchable": false,
      "filterable": false,
      "retrievable": true,
      "sortable": false,
      "facetable": false,
      "analyzer": "keyword"
    },
    {
      "name": "parent_id",
      "type": "Edm.String",
      "searchable": false,
      "filterable": true,
      "retrievable": true,
      "sortable": true,
      "facetable": false
    },
    {
      "name": "chunk",
      "type": "Edm.String",
      "searchable": true,
      "filterable": false,
      "retrievable": true,
      "sortable": false,
      "facetable": false,
      "analyzer": "pt-Lucene"
    },
    {
      "name": "title",
      "type": "Edm.String",
      "searchable": true,
      "filterable": false,
      "retrievable": true,
      "sortable": false,
      "facetable": false,
      "analyzer": "pt-Lucene"
    },
    {
      "name": "source_file",
      "type": "Edm.String",
      "searchable": false,
      "filterable": true,
      "retrievable": true,
      "sortable": true,
      "facetable": true
    },
    {
      "name": "source_url",
      "type": "Edm.String",
      "searchable": false,
      "filterable": false,
      "retrievable": true,
      "sortable": false,
      "facetable": false
    }
  ],
  "semantic": {
    "configurations": [
      {
        "name": "kb-apex-semantic",
        "prioritizedFields": {
          "titleField": { "fieldName": "title" },
          "prioritizedContentFields": [{ "fieldName": "chunk" }],
          "prioritizedKeywordsFields": []
        }
      }
    ]
  }
}
```

### 5.2 Análise dos campos

| Campo | Tipo | Searchable? | Filterable? | Por quê |
|---|---|---|---|---|
| `id` | string | ❌ | ❌ | Chave primária (gerada pelo indexProjections) |
| `parent_id` | string | ❌ | ✅ | "Mostrar todos os chunks deste PDF" |
| `chunk` | string | ✅ pt-Lucene | ❌ | Conteúdo principal — usa analyzer português pra stemming |
| `title` | string | ✅ pt-Lucene | ❌ | Heading da seção (Doc Intel detectou) |
| `source_file` | string | ❌ | ✅ filter + facet | "Mostrar resultados só do politica_lgpd.pdf" |
| `source_url` | string | ❌ | ❌ | Pra exibir link no UI sem indexar |

> **`pt-Lucene` analyzer:** stemming português (mapeia "operações" → "operação"). Sem isso, queries em português perdem variantes morfológicas.

> **Semantic config `kb-apex-semantic`:** o re-ranking neural precisa saber qual campo é "title" e qual é "content principal". Cap 09 vai ativar isso.

### 5.3 Criar via REST

```bash
curl -sS -X PUT \
  "${SEARCH_ENDPOINT}/indexes/kb-apex-index?api-version=2024-07-01" \
  -H "Content-Type: application/json" \
  -H "api-key: ${SEARCH_ADMIN_KEY}" \
  --data @snippets/index-schema.json \
  | jq '.name'
```

---

## 6. Criar o Indexer (orquestra tudo)

Indexer é o "trabalhador" que:
1. Lê data source (kb-source blobs)
2. Aplica skillset (Doc Intel + chunking)
3. Persiste em index (kb-apex-index) via projections

### 6.1 JSON do Indexer

Arquivo: [`snippets/indexer.json`](../snippets/indexer.json) (será adicionado em v0.2.0)

```json
{
  "name": "kb-apex-indexer",
  "dataSourceName": "kb-apex-datasource",
  "skillsetName": "kb-apex-skillset",
  "targetIndexName": "kb-apex-index",
  "schedule": null,
  "parameters": {
    "configuration": {
      "dataToExtract": "contentAndMetadata",
      "parsingMode": "default",
      "allowSkillsetToReadFileData": true,
      "indexStorageMetadataOnlyForOversizedDocuments": true
    }
  },
  "fieldMappings": [
    {
      "sourceFieldName": "metadata_storage_path",
      "targetFieldName": "source_url",
      "mappingFunction": null
    }
  ]
}
```

> **`schedule: null`** = on-demand. Você roda manualmente. Em produção, configure `schedule: { interval: "PT1H" }` (a cada hora).

> **`allowSkillsetToReadFileData: true`** = essencial para `DocumentIntelligenceLayoutSkill` ler o blob raw.

### 6.2 Criar via REST

```bash
curl -sS -X PUT \
  "${SEARCH_ENDPOINT}/indexers/kb-apex-indexer?api-version=2024-07-01" \
  -H "Content-Type: application/json" \
  -H "api-key: ${SEARCH_ADMIN_KEY}" \
  --data @snippets/indexer.json \
  | jq '.name'
```

### 6.3 Trigger manual run

```bash
curl -sS -X POST \
  "${SEARCH_ENDPOINT}/indexers/kb-apex-indexer/run?api-version=2024-07-01" \
  -H "api-key: ${SEARCH_ADMIN_KEY}"

echo "Indexer started"
```

⏳ **Tempo:** 5-12 minutos (8 PDFs × Doc Intelligence prebuilt-layout × ~80 páginas total).

### 6.4 Acompanhar progresso

```bash
# Polling a cada 30s
while true; do
  STATUS=$(curl -sS \
    "${SEARCH_ENDPOINT}/indexers/kb-apex-indexer/status?api-version=2024-07-01" \
    -H "api-key: ${SEARCH_ADMIN_KEY}")

  CURRENT=$(echo "$STATUS" | jq -r '.lastResult.status')
  PROCESSED=$(echo "$STATUS" | jq -r '.lastResult.itemsProcessed')

  echo "Status: $CURRENT · Items: $PROCESSED / 8"

  [ "$CURRENT" = "success" ] && break
  [ "$CURRENT" = "transientFailure" ] && echo "Falha temporária, indexer vai retentar"
  [ "$CURRENT" = "persistentFailure" ] && echo "ERRO PERSISTENTE — veja errors abaixo" && break

  sleep 30
done

# Em caso de falha, ver erros detalhados:
echo "$STATUS" | jq '.lastResult.errors'
```

---

## 7. Validação final

### 7.1 Confirmar documentos no índice

```bash
curl -sS -X GET \
  "${SEARCH_ENDPOINT}/indexes/kb-apex-index/stats?api-version=2024-07-01" \
  -H "api-key: ${SEARCH_ADMIN_KEY}" \
  | jq '{ documentCount, storageSize }'
```

Saída esperada (após indexer terminar):

```json
{
  "documentCount": 240,
  "storageSize": 12582912
}
```

> **Por que ~240 chunks?** 8 PDFs × ~30 chunks médios por PDF (depende do tamanho de cada). Pode variar 150-400.

### 7.2 Search de smoke test

```bash
curl -sS -X POST \
  "${SEARCH_ENDPOINT}/indexes/kb-apex-index/docs/search?api-version=2024-07-01" \
  -H "Content-Type: application/json" \
  -H "api-key: ${SEARCH_ADMIN_KEY}" \
  -d '{"search": "devolução", "top": 3, "select": "chunk,source_file"}' \
  | jq '.value[] | {file: .source_file, snippet: (.chunk | .[0:120])}'
```

Saída esperada (3 trechos de FAQ devolução com chunks contendo "devolução"):

```json
{
  "file": "faq_pedidos_devolucao.pdf",
  "snippet": "Pergunta: Qual o prazo de devolução para produtos perecíveis?\nResposta: Produtos perecíveis devem ser devolvidos..."
}
```

✅ **RAG funcionou.** A partir daqui o cap 08 explora via Search Explorer e cap 09 plega no apex-helpsphere via REST.

---

## 8. Troubleshooting comum

### ❌ Indexer status = `persistentFailure` com `Forbidden`

MI do AI Search não tem role no Storage ou Doc Intelligence. Volte cap 06 §5 e re-execute role assignments. Aguarde 5min de propagação, re-trigger indexer.

### ❌ Indexer terminou `success` mas `itemsProcessed: 0`

Container `kb-source` está vazio (cap 04 não rodou) OU naming convention errado (Indexer espera blobs na raiz, não em subfolder). Volte cap 04 §6.

### ❌ `documentCount: 0` mas indexer disse `success`

Skillset rodou mas `indexProjections` falhou (selectors mapeados errado). Confira no Portal: AI Search → **Search management** → **Skillsets** → `kb-apex-skillset` → aba **Errors and warnings**.

### ❌ Erro 429 Too Many Requests

Doc Intelligence F0 (free tier) tem rate limit baixo (20 transactions/min). Indexer 8 PDFs × ~10 calls cada = 80 transactions disparadas em paralelo. Soluções:
- Mude pra S0 (sem rate limit relevante)
- OU adicione `batchSize: 1` no indexer parameters

### ❌ Caracteres acentuados quebrados nos chunks

Você não está usando `pt-Lucene` analyzer. Volte index schema §5 e confirme `analyzer: "pt-Lucene"` nos campos `chunk` e `title`.

---

## 9. Próximo passo

Indexer status `success`, `documentCount > 0`, smoke search retornou results?

→ **Avance para [Capítulo 08 — Search Explorer + queries via Portal](./08-test-search-explorer.md)**

> Cap 08 testa o índice via Search Explorer (UI do Portal) com queries em português, verifica scoring profile, vê highlight, e prepara o terreno pra integração no cap 09.
