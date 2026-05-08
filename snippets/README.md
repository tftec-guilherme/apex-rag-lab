# Snippets — Lab Intermediário D06 (RAG Wave 4)

Scripts e snippets copy-paste para acompanhar o guia em [`../docs/00-guia-completo.md`](../docs/00-guia-completo.md).

## Conteúdo

| Arquivo | Quando usar | Parte do guia |
|---------|-------------|---------------|
| `index_pdfs.py` | Indexar PDFs via Document Intelligence (chunking layout-aware) | Parte 2 — passo 2.3 |
| `create_search_index.py` | Criar índice AI Search com vector field (3072 dim) | Parte 5 — passo 5.4 |
| `index_to_search.py` | Gerar embeddings e popular índice AI Search | Parte 5 continuação — passo 5.5 |
| `function_app.py` | Function App orquestrador `/chat/rag` | Parte 7 — passo 7.5 |
| `eval_rag.py` | Avaliação precision@5 + latency + custo | Parte 9 — passo 9.2 |
| `requirements.txt` | Dependências Python (Document Intel + Search + OpenAI) | Parte 2.4 / 5.5 / 7.5 |
| `test_vision_ocr.sh` | Teste OCR de screenshot (AI Vision) | Parte 3 — passo 3.4 |
| `test_translator.sh` | Teste detect + translate (AI Translator) | Parte 4 — passo 4.4 |
| `test_chat_rag.http` | Teste do endpoint `/chat/rag` da Function App | Parte 7 — passo 7.7 |

## Como usar

1. Clone este repo
2. Abra o guia [`docs/00-guia-completo.md`](../docs/00-guia-completo.md)
3. Em cada passo Python, copie o conteúdo do snippet correspondente em vez de digitar do zero
4. **Não esqueça de configurar as env vars** que cada script consome (descritas no próprio guia)
5. **Não esqueça do cleanup ao final** (`az group delete --name rg-lab-intermediario --yes --no-wait`)

## Arquitetura RAG (Wave 4)

```
PDFs → Document Intelligence (prebuilt-layout) → chunks
       ↓
       text-embedding-3-large (3072 dim)
       ↓
       AI Search Standard S1 (vector hybrid)
       ↓
       Function App `/chat/rag` (gpt-4.1-mini)
       ↓
       apex-helpsphere frontend (botão "Sugerir resposta")
```

`version-anchor: Q2-2026`
