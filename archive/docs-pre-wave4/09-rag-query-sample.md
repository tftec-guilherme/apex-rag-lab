> ⚠️ **Conteúdo pré-Wave 4 — INCOMPATÍVEL com arquitetura atual do Lab Inter**
>
> Este capítulo descreve uma arquitetura **OBSOLETA** (Function App backend monolítico + endpoint `/chat` + edita `Answer.tsx`) usando o template `apex-helpsphere` antigo. **Não siga este capítulo se você está fazendo o Lab Intermediário Wave 4.**
>
> A arquitetura canônica atual usa:
> - Backend Container App `capps-backend-{env}` (não Function App monolítico)
> - Endpoint `POST /chat/rag` (não `/chat`)
> - Componente `ChatPanel` (não `Answer.tsx`)
> - Workflow: `git clone apex-rag-lab` + edita `[CRIAR-X]` markers + `azd up` (não fork separado de `apex-helpsphere`)
>
> ➡️ **Para o Lab Inter atual, siga `docs/00-guia-completo.md` (Parte 8) ou `docs/parte-08.md`.**
>
> Este conteúdo permanece em `archive/` apenas como referência histórica para futuros labs sobre Cognitive Search Skillset declarativo.

---

# Capítulo 09 — Query RAG via REST + integração HelpSphere

> **Objetivo:** consumir o `kb-apex-index` via REST de fora do Portal — primeiro com `curl`, depois com um sample HTML/JS standalone, e finalmente integrando no backend Python do `apex-helpsphere` para responder dúvidas dos atendentes durante criação/edição de tickets.

> **Tempo:** 25-35 minutos · **Custo:** R$ 0 (queries em Basic com semantic ranker são grátis até 1k/mês)

---

## 1. Os 3 caminhos de consumo neste cap

| Caminho | Quem usa | O que ganha |
|---|---|---|
| **A. cURL** (§3) | Validar contrato REST + scripts CI | Comprovar que index está acessível com query-key |
| **B. HTML/JS standalone** (§4) | UI mock pra ver citations no browser | Frontend MVP em 1 arquivo |
| **C. Backend Python apex-helpsphere** (§5) | Integração real com app | RAG plugado no fluxo de tickets |

Você pode fazer só A pra validar, ou ir até C pra ver o lab "completo".

---

## 2. Variáveis necessárias

```bash
export SEARCH_ENDPOINT="https://srch-apex-rag-lab-gpc.search.windows.net"
export SEARCH_QUERY_KEY="GUEST..."  # cap 06 §4.3 (não use admin key — least privilege)
export INDEX_NAME="kb-apex-index"
```

> **Por que query-key e não admin?** Apps que SÓ fazem search jamais devem ter privilégio de mutação. Vazamento de query-key é apenas DoS leve; vazamento de admin-key permite reescrever index.

---

## 3. Caminho A — cURL puro

### 3.1 Query simples (BM25)

```bash
curl -sS -X POST \
  "${SEARCH_ENDPOINT}/indexes/${INDEX_NAME}/docs/search?api-version=2024-07-01" \
  -H "Content-Type: application/json" \
  -H "api-key: ${SEARCH_QUERY_KEY}" \
  -d '{
    "search": "como devolver produto perecível",
    "top": 3,
    "select": "chunk,source_file,title"
  }' | jq '.value[] | {file: .source_file, snippet: (.chunk | .[0:150])}'
```

### 3.2 Query com semantic ranker + answers

```bash
curl -sS -X POST \
  "${SEARCH_ENDPOINT}/indexes/${INDEX_NAME}/docs/search?api-version=2024-07-01" \
  -H "Content-Type: application/json" \
  -H "api-key: ${SEARCH_QUERY_KEY}" \
  -d '{
    "search": "qual o prazo para reembolso ao lojista?",
    "queryType": "semantic",
    "semanticConfiguration": "kb-apex-semantic",
    "captions": "extractive|highlight-true",
    "answers": "extractive|count-3",
    "highlight": "chunk",
    "top": 5,
    "select": "chunk,source_file,title"
  }' | jq '{
    answers: .["@search.answers"][] | {text, score},
    results: [.value[] | {
      score: ."@search.rerankerScore",
      file: .source_file,
      caption: ."@search.captions"[0].text
    }]
  }'
```

### 3.3 Saída esperada (extrato)

```json
{
  "answers": [
    {
      "text": "O reembolso ao lojista deve ser processado em até 7 dias úteis após confirmação...",
      "score": 0.91
    }
  ],
  "results": [
    {
      "score": 3.7,
      "file": "politica_reembolso_lojista.pdf",
      "caption": "...prazo para <em>reembolso</em> ao <em>lojista</em> é de até 7 dias úteis..."
    }
  ]
}
```

---

## 4. Caminho B — HTML/JS standalone

Crie arquivo local `rag-demo.html` (1 arquivo, sem build):

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Apex RAG Demo</title>
  <style>
    body { font-family: 'Inter Tight', system-ui; max-width: 800px; margin: 2rem auto; padding: 1rem; }
    h1 { color: #0c1834; }
    .query-box { display: flex; gap: 0.5rem; margin: 1rem 0; }
    input { flex: 1; padding: 0.75rem; font-size: 1rem; border: 1px solid #ccc; border-radius: 4px; }
    button { padding: 0.75rem 1.5rem; background: #a87b3f; color: white; border: 0; border-radius: 4px; cursor: pointer; }
    .answer { background: #fafaf7; border-left: 4px solid #a87b3f; padding: 1rem; margin: 1rem 0; }
    .citation { font-size: 0.9rem; color: #555; margin-top: 0.5rem; }
    em { background: #fff3cd; font-style: normal; padding: 0 2px; }
  </style>
</head>
<body>
  <h1>Apex RAG · Lab Intermediário</h1>
  <p>Pergunte algo sobre as 8 políticas/manuais da Apex Group:</p>

  <div class="query-box">
    <input id="q" placeholder="Ex: qual o prazo para devolver produto perecível?" />
    <button onclick="search()">Buscar</button>
  </div>

  <div id="results"></div>

  <script>
    const ENDPOINT = "https://srch-apex-rag-lab-gpc.search.windows.net";
    const QUERY_KEY = "GUEST...";  // ← cole sua query key aqui
    const INDEX = "kb-apex-index";

    async function search() {
      const q = document.getElementById('q').value;
      const results = document.getElementById('results');
      results.innerHTML = '<p>Buscando...</p>';

      const response = await fetch(
        `${ENDPOINT}/indexes/${INDEX}/docs/search?api-version=2024-07-01`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'api-key': QUERY_KEY
          },
          body: JSON.stringify({
            search: q,
            queryType: 'semantic',
            semanticConfiguration: 'kb-apex-semantic',
            captions: 'extractive|highlight-true',
            answers: 'extractive|count-1',
            highlight: 'chunk',
            top: 5,
            select: 'chunk,source_file,title'
          })
        }
      );

      const data = await response.json();
      renderResults(data, results);
    }

    function renderResults(data, container) {
      container.innerHTML = '';

      // Answer destacada
      const answer = data['@search.answers']?.[0];
      if (answer) {
        const div = document.createElement('div');
        div.className = 'answer';
        div.innerHTML = `<strong>Resposta:</strong> ${answer.highlights || answer.text}`;
        container.appendChild(div);
      }

      // Citations
      data.value.forEach((doc, i) => {
        const caption = doc['@search.captions']?.[0]?.highlights || doc.chunk.slice(0, 200);
        const div = document.createElement('div');
        div.className = 'citation';
        div.innerHTML = `
          <strong>[${i+1}] ${doc.source_file}</strong> · ${doc.title || ''}
          <p>${caption}</p>
        `;
        container.appendChild(div);
      });
    }

    // Enter key
    document.getElementById('q').addEventListener('keypress', e => {
      if (e.key === 'Enter') search();
    });
  </script>
</body>
</html>
```

### 4.1 Rodar local

Abra `rag-demo.html` no navegador (duplo-clique ou `Open File`). Teste com queries:

- "qual o prazo para devolver produto perecível"
- "quanto tempo demora reembolso ao lojista"
- "como configurar SAP FI integração"
- "quais os horários de atendimento"

📸 *Screenshot: HTML demo com query "prazo devolver perecível" + answer destacada + 3 citations*

### 4.2 CORS

Se o browser bloquear com CORS error: **Settings** do AI Search → **Indexes** → `kb-apex-index` → **CORS** → adicione `*` (lab) ou `http://localhost` (mais restrito).

---

## 5. Caminho C — Integração apex-helpsphere backend

Esta é a integração que justifica o lab inteiro. O backend Python do `apex-helpsphere` (rota `/chat` dormente em v2.1.0) vai ser **acordado** com o pipeline RAG do nosso `kb-apex-index`.

### 5.1 Pré-requisito

`apex-helpsphere` provisionado e rodando (cap 01 §6 opcional). Se não fez, pule para §5.5 que mostra como ativar via env var sem deploy completo.

### 5.2 Variáveis de ambiente novas

No seu fork do `apex-helpsphere`, adicione ao `azd env set`:

```bash
azd env set ENABLE_CHAT true
azd env set AZURE_SEARCH_ENDPOINT https://srch-apex-rag-lab-gpc.search.windows.net
azd env set AZURE_SEARCH_INDEX kb-apex-index
azd env set AZURE_SEARCH_KEY "GUEST..."  # query key
```

### 5.3 Editar `app/backend/app.py` no fork

Localize a rota `/chat` e substitua o bloco de search:

```python
import requests
import os

@app.route("/chat", methods=["POST"])
async def chat():
    body = await request.get_json()
    user_query = body.get("message", "")

    # 1) Search no kb-apex-index
    search_response = requests.post(
        f"{os.environ['AZURE_SEARCH_ENDPOINT']}/indexes/{os.environ['AZURE_SEARCH_INDEX']}/docs/search",
        params={"api-version": "2024-07-01"},
        headers={
            "Content-Type": "application/json",
            "api-key": os.environ["AZURE_SEARCH_KEY"],
        },
        json={
            "search": user_query,
            "queryType": "semantic",
            "semanticConfiguration": "kb-apex-semantic",
            "captions": "extractive|highlight-true",
            "answers": "extractive|count-3",
            "top": 5,
            "select": "chunk,source_file,title",
        },
    ).json()

    # 2) Construir contexto pra LLM (opcional — se Azure OpenAI provisionado)
    chunks = [doc["chunk"] for doc in search_response.get("value", [])]
    sources = [{"file": doc["source_file"], "title": doc.get("title", "")} for doc in search_response.get("value", [])]

    # 3) Retornar payload com resposta + citations
    return {
        "answer": search_response.get("@search.answers", [{}])[0].get("text", "Sem resposta direta."),
        "sources": sources,
        "context": chunks[:3],
    }
```

### 5.4 Frontend citation rendering

No seu fork, edite `app/frontend/src/components/Answer/Answer.tsx`:

```tsx
{message.sources?.map((src, i) => (
  <span className="citation-chip" key={i}>
    [{i+1}] {src.file}{src.title && ` · ${src.title}`}
  </span>
))}
```

### 5.5 Deploy + smoke test

```bash
cd apex-helpsphere
azd deploy backend  # só re-deploya backend Python (não re-provisiona infra)
```

Acesse o app no browser, vá em `/chat` (que agora vai aparecer na nav lateral por causa do `ENABLE_CHAT=true`), e teste:

> "qual o prazo de devolução de produto perecível?"

Você deve ver resposta + chips de citation com source files.

📸 *Screenshot: chat HelpSphere com pergunta + resposta + citations*

---

## 6. Métricas a observar

Em produção, instrumentar:

| Métrica | Onde | Alvo |
|---|---|---|
| **Latency p95** chat → response | Application Insights `requests` | < 3s |
| **Doc Intelligence pages/dia** | Cost Management | Saber consumo real |
| **AI Search QPS** | AI Search → Monitoring | Avaliar tier (Basic suporta ~15 QPS) |
| **Sem `@search.answers`** % | App custom metric | Indica queries fora do domínio |
| **Top-3 source_file diversity** | App custom metric | Confirma que citações vêm de PDFs variados |

---

## 7. Próximos passos opcionais (não fazem parte do lab básico)

### 7.1 Adicionar embeddings vetoriais (hybrid search)

Cap 09 fica em "BM25 + semantic ranker" pra simplicidade. Para hybrid (BM25 + vector + semantic):

1. Provisionar Azure OpenAI (não cabe no free tier)
2. Adicionar `AzureOpenAIEmbeddingSkill` no skillset (cap 07)
3. Adicionar campo `chunk_vector` (Edm.Single Collection, 3072-dim) no index schema
4. Re-rodar indexer
5. Mudar query body: adicionar `vectorQueries: [{"text": "...", "fields": "chunk_vector", "kind": "text"}]`

### 7.2 Multi-tenant filtering

Adicionar campo `tenant_id` no index, popular via skillset com tag dos blobs, e filtrar queries por `tenant_id eq '<id>'`.

### 7.3 Re-ranking customizado com scoring profile

Boost por `source_file` (priorizar políticas oficiais sobre FAQs):

```json
{
  "scoringProfiles": [{
    "name": "boost-policies",
    "text": {
      "weights": { "title": 2.0, "chunk": 1.0 }
    }
  }]
}
```

---

## 8. Troubleshooting comum

### ❌ CORS erro no caminho B

Adicione origens permitidas em **Index → CORS** no AI Search.

### ❌ Backend Python crashloop após adicionar AZURE_SEARCH_*

Confirme que as 3 env vars foram exportadas no Container App:

```bash
az containerapp show -n {backend-name} -g {rg} --query properties.template.containers[0].env
```

### ❌ Citations duplicadas (mesmo PDF aparecendo 3x)

Indexer fez chunking muito agressivo, criando chunks redundantes. Solução: ajustar `pageOverlapLength` no SplitSkill (cap 07 §4.1) de 256 → 128.

### ❌ `@search.answers` retorna `[]` constantemente

Queries muito amplas. Refraseie em forma de pergunta direta: "qual o prazo..." em vez de "prazo devolução".

---

## 9. Próximo passo

Cap 09 funcional — você consegue fazer queries via cURL, HTML demo, e (opcional) integração apex-helpsphere?

→ **Avance para [Capítulo 10 — Cleanup obrigatório](./10-cleanup.md)**

> ⚠️ **CLEANUP NÃO É OPCIONAL.** Se você não rodar o cap 10, AI Search Basic continua cobrando ~R$ 7/dia em background. R$ 210/mês escondido. Cap 10 são 3 minutos pra deletar tudo.
