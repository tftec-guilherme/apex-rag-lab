# Capítulo 08 — Test queries via Search Explorer

> **Objetivo:** validar o índice `kb-apex-index` com 5 cenários de query reais — keyword search puro, semantic ranker on/off, filter por `source_file`, ordenação por relevância — usando a UI do Portal Azure (Search Explorer) que serve como playground antes de integrar via REST no cap 09.

> **Tempo:** 15-20 minutos · **Custo:** R$ 0 (Search Explorer é incluído no Basic)

---

## 1. Onde fica o Search Explorer

1. Portal Azure → recurso `srch-apex-rag-lab-{aluno}`
2. Menu lateral esquerdo: **Search management** → **Indexes**
3. Clique em `kb-apex-index`
4. Topo da tela: aba **Search explorer**

📸 *Screenshot: Search Explorer aberto com índice kb-apex-index*

---

## 2. Anatomia da UI

| Componente | Função |
|---|---|
| **Query string** | Texto da query (acima do botão Search) |
| **Request preview** | URL REST equivalente da query (botão `< >`) |
| **JSON view / Table view** | Toggle entre representações |
| **Query options** | Painel direito com filters, top, skip, etc. |
| **API version** | Default `2024-07-01` |

> **Dica:** mude pra **Table view** pra ver `@search.score` e ler results rapidamente. JSON view é melhor pra inspeção de campos completos.

---

## 3. Cenário 1 — Keyword search puro

### Query

```
devolução
```

Clique em **Search**.

### O que esperar

Lista de chunks com:
- `@search.score` decrescente (BM25 score)
- Top resultado provável: chunk de `faq_pedidos_devolucao.pdf` ou `politica_reembolso_lojista.pdf`
- ~5-15 results

### O que isso significa

BM25 (TF-IDF + length normalization) está funcionando. Termo "devolução" foi encontrado, tokenized via `pt-Lucene` analyzer, e scored.

📸 *Screenshot: results com score visível*

---

## 4. Cenário 2 — Stemming português em ação

### Query

```
horários
```

(plural com acento)

### O que esperar

Results ainda incluem chunks com **"horário"** singular (mesmo radical morfológico).

### O que isso significa

`pt-Lucene` analyzer está fazendo stemming corretamente. Sem stemming, "horários" só matchearia exato — perderia chunks com "horário" singular ou "horária" feminino.

> **Anti-padrão:** usar `standard` analyzer pra documento em português. Resultado: precision artificialmente alto (só matches exatos) mas recall péssimo (perde variantes).

---

## 5. Cenário 3 — Filter por source_file

### Query

```
prazo
```

### Query options (painel direito)

```
$filter: source_file eq 'politica_reembolso_lojista.pdf'
```

### O que esperar

Results SÓ do `politica_reembolso_lojista.pdf`. Outros PDFs com a palavra "prazo" são excluídos.

### O que isso significa

`filterable: true` no campo `source_file` (cap 07 §5.2) está funcionando. Em produção, esse filter habilita "buscar só nos manuais", "só nas FAQs", "só do tenant X" (multi-tenant RAG).

📸 *Screenshot: Search Explorer com filter aplicado, results filtrados*

---

## 6. Cenário 4 — Habilitar Semantic ranker

### 6.1 Configurar query

No painel direito, clique em **+ Add a query option** → escolha **queryType**.

```
queryType: semantic
semanticConfiguration: kb-apex-semantic
```

> Você criou `kb-apex-semantic` no index schema do cap 07 §5.

### 6.2 Query

```
quanto tempo eu tenho pra devolver um produto?
```

(query natural em português, não keyword puro)

### 6.3 O que esperar

| Sem semantic ranker (cenário 1) | Com semantic ranker |
|---|---|
| Top 1: chunk com palavra "devolver" exata | Top 1: chunk que **responde** à pergunta com prazo de devolução em dias |
| `@search.score` (BM25) | `@search.rerankerScore` adicional |
| Results mistos relevância | Top 3 muito mais focados na intenção |

### 6.4 O que isso significa

Semantic ranker é um **modelo neural** Microsoft-treinado que re-ordena os top-50 do BM25 com base na **relevância semântica** da query, não só do match lexical.

Para uma query natural em português ("quanto tempo eu tenho pra devolver um produto?"), o ranker entende a intenção e prioriza chunks que **respondem** em vez de só **conter palavras**.

> **Custo:** semantic ranker é **incluído no tier Basic** (até 1k queries/mês grátis). Em S1+, custa $0,02/1k queries adicional.

📸 *Screenshot: comparação BM25 vs semantic ranker*

---

## 7. Cenário 5 — Highlight + captions

### Query options

```
queryType: semantic
semanticConfiguration: kb-apex-semantic
captions: extractive|highlight-true
answers: extractive|count-3
highlight: chunk
```

### Query

```
posso devolver produto perecível?
```

### O que esperar

Resposta JSON enriquecida com:

```json
{
  "@search.answers": [
    {
      "key": "...",
      "text": "Produtos perecíveis devem ser devolvidos em até 24 horas...",
      "highlights": "<em>Produtos perecíveis</em> devem ser <em>devolvidos</em>...",
      "score": 0.92
    }
  ],
  "value": [
    {
      "@search.captions": [
        {
          "text": "Pergunta: Qual o prazo de devolução para produtos perecíveis? Resposta: Produtos perecíveis devem ser devolvidos em até 24 horas após a compra...",
          "highlights": "<em>perecíveis</em>...<em>devolvidos</em>..."
        }
      ],
      "@search.rerankerScore": 3.85,
      "chunk": "...",
      "source_file": "faq_pedidos_devolucao.pdf"
    }
  ]
}
```

### O que isso significa

| Campo | Função |
|---|---|
| `@search.answers` | Top-N "respostas extraídas" com highlights — pra UI mostrar resposta destacada antes da lista |
| `@search.captions` | Snippet contextual com highlights — pra UI mostrar trecho relevante de cada result |
| `@search.rerankerScore` | Score do semantic ranker (escala 0-4 tipicamente) |
| `highlight: chunk` | Highlights tradicionais BM25 nas tags `<em>...</em>` |

Cap 09 vai usar esses campos pra montar UI de citation rendering profissional.

---

## 8. Comparativo de modos de query (resumo)

| Modo | Quando usar | Latência | Custo | Qualidade |
|---|---|---|---|---|
| **Simple BM25** | Buscas exatas, autocomplete | <50ms | grátis | OK pra match exato |
| **Full Lucene** | Boolean queries, wildcards, regex | <50ms | grátis | Power user |
| **Semantic ranker** ⭐ | Perguntas naturais, RAG | 100-300ms | grátis até 1k/mês | Excelente |
| **Vector search** | Cross-lingual, sem keywords | 50-100ms | embedding gen | Excelente |
| **Hybrid (BM25 + Vector + Semantic)** | Best of all worlds (Lab Avançado) | 200-400ms | embedding gen + ranker | Production-grade |

> Cap 09 vai expandir pra **hybrid** se você optar por adicionar embeddings (opcional cap 09).

---

## 9. Validação

### 9.1 Checklist

- [ ] Cenário 1 (keyword "devolução") retornou ≥3 results
- [ ] Cenário 2 (stemming "horários") matched chunks com "horário" singular
- [ ] Cenário 3 (filter) retornou só `politica_reembolso_lojista.pdf`
- [ ] Cenário 4 (semantic ranker) tem `@search.rerankerScore` no JSON
- [ ] Cenário 5 (highlight + captions) retornou `@search.answers` e `@search.captions`

### 9.2 Capturar 1 query REST equivalente

No Search Explorer, clique no botão **`< >`** (Request preview). Você vê o REST equivalente:

```http
POST https://srch-apex-rag-lab-gpc.search.windows.net/indexes/kb-apex-index/docs/search?api-version=2024-07-01
Content-Type: application/json
api-key: <admin-or-query-key>

{
  "search": "posso devolver produto perecível?",
  "queryType": "semantic",
  "semanticConfiguration": "kb-apex-semantic",
  "captions": "extractive|highlight-true",
  "answers": "extractive|count-3",
  "highlight": "chunk",
  "top": 5
}
```

Salve esse snippet — vamos reusar no cap 09.

---

## 10. Troubleshooting comum

### ❌ "Semantic configuration not found"

Você não criou `kb-apex-semantic` no index schema do cap 07. Solução: PATCH index schema com bloco `semantic.configurations`.

### ❌ Semantic ranker retorna `null` em `@search.rerankerScore`

Tier Free **não suporta** semantic ranker. Você está usando Free em vez de Basic? Cap 06 §1.

### ❌ Stemming português não está funcionando

Você usou `analyzer: "standard"` em vez de `pt-Lucene`. Solução: re-criar campo (não dá pra mudar analyzer post-creation) → re-rodar indexer.

### ❌ `@search.answers` vazio mesmo com semantic ranker

A query é muito ambígua ou o conteúdo não tem resposta direta. Tente queries mais focadas. Answers só aparecem quando o modelo identifica trecho extractive.

### ❌ Search Explorer demora 30+ segundos

Tier Basic pode ter cold-start no primeiro query do dia (~5-10s). Daí em diante, queries em <300ms.

---

## 11. Próximo passo

5 cenários validados? Você entende a diferença entre BM25, semantic ranker, filter, highlight e captions?

→ **Avance para [Capítulo 09 — Query RAG via REST + integração HelpSphere](./09-rag-query-sample.md)**

> Cap 09 mostra como consumir o `kb-apex-index` via REST/SDK do `apex-helpsphere` backend, opcionalmente adiciona embeddings vetoriais, e renderiza citations no frontend React.
