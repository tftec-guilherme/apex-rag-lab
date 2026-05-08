# Parte 5 — Azure AI Search (vector index + hybrid) (1.5h + 50min)

> Cria o Azure AI Search Standard S1, atribui RBAC, cria o índice com vector field (3072 dim), e indexa os chunks gerados na Parte 2 com embeddings do Azure OpenAI (Parte 6 deve estar pronta).
>
> ⚠️ **Esta Parte é dividida** — a Parte 5 propriamente dita (passos 5.1-5.4) é executada antes da Parte 6 (criar índice). A Parte 5 continuação (passo 5.5) é executada **depois** da Parte 6 (precisa do deployment de embeddings).

📘 **Conteúdo completo:** [`00-guia-completo.md` — seção "Parte 5"](./00-guia-completo.md#parte-5--azure-ai-search-vector-index--hybrid--15h) e [Parte 5 (continuação)](./00-guia-completo.md#parte-5-continua%C3%A7%C3%A3o--indexar-chunks-com-embeddings-50min)

## Passos

### Bloco 1 (antes da Parte 6)

1. **Criar** Azure AI Search `srch-helpsphere-rag` (**Standard S1** — não Basic)
2. **Anotar credenciais** (`SEARCH_ENDPOINT`, `SEARCH_KEY`)
3. **Atribuir RBAC** do Managed Identity
4. **Criar index** com vector field 3072 dim ([`snippets/create_search_index.py`](../snippets/create_search_index.py))

### Bloco 2 (depois da Parte 6)

5. **Indexar chunks com embeddings** ([`snippets/index_to_search.py`](../snippets/index_to_search.py))
6. **Validar index** pelo Search Explorer no Portal

## Pré-requisitos

- ✅ Partes 1 + 2 + 3 + 4 completas
- ✅ Bloco 1 desta Parte (índice criado) **antes** da Parte 6
- ✅ Parte 6 (deployments OpenAI) **antes** do Bloco 2 desta Parte

## ⚠️ Vector dimension mismatch

`text-embedding-3-large` retorna 3072 dim. Se o índice for criado com `dimensions=1536` (default antigo), `index_to_search.py` falha com `400 dimension mismatch`. Use `dimensions=3072` em [`create_search_index.py`](../snippets/create_search_index.py).

## ✅ Checkpoint Parte 5 (completa)

- [ ] Search service `srch-helpsphere-rag` ativo (Standard S1)
- [ ] Index `helpsphere-rag-idx` criado com vector field 3072 dim
- [ ] Chunks indexados com embeddings (count > 30)
- [ ] Search Explorer retorna resultados em uma query teste

➡️ **Próximo:** [Parte 6 — Azure OpenAI deployments](./parte-06.md) (volte aqui depois para fazer o Bloco 2)
