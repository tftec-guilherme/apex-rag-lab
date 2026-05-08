# Parte 2 — Document Intelligence (1.5h)

> Cria o Azure AI Document Intelligence (S0), atribui RBAC do Managed Identity, e roda o script Python de chunking layout-aware nos 3 PDFs.

📘 **Conteúdo completo:** [`00-guia-completo.md` — seção "Parte 2"](./00-guia-completo.md#parte-2--document-intelligence-15h)

## Passos

1. **Criar** Azure AI Document Intelligence `di-helpsphere-rag` (S0)
2. **Atribuir RBAC** do Managed Identity (`Cognitive Services User`)
3. **Script Python** de indexação chunking layout-aware ([`snippets/index_pdfs.py`](../snippets/index_pdfs.py))
4. **Instalar dependências** (`pip install -r ../snippets/requirements.txt`)
5. **Setar env vars + rodar** o script
6. **Verificar saída** — chunks gerados em `chunks/` ou no Storage `eval/`

## Pré-requisitos

- ✅ Parte 1 completa
- ✅ Python 3.11+ disponível localmente

## Modelo Document Intelligence

- **`prebuilt-layout`** (não custom) — extrai texto + tabelas + listas com posicionamento
- Custo: pago por uso · ~R$ 8 para os 3 PDFs deste lab

## ✅ Checkpoint Parte 2

- [ ] DI service `di-helpsphere-rag` ativo
- [ ] Script `index_pdfs.py` rodou sem erro 401/403
- [ ] Chunks JSON gerados (1 arquivo por PDF) com `chunk_id`, `text`, `page`, `bbox`
- [ ] Volume de chunks razoável: ~30-50 chunks total para os 3 PDFs Microsoft Learn (~3MB)

➡️ **Próximo:** [Parte 3 — AI Vision (OCR)](./parte-03.md)
