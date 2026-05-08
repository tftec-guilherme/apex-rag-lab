# sample-kb — 3 PDFs públicos Microsoft Learn

> Base de conhecimento sample para o Lab Intermediário D06 RAG. Em vez de PDFs proprietários, usamos 3 documentos públicos da Microsoft Learn — qualquer aluno consegue reproduzir o lab sem dependência de assets internos da TFTEC.

---

## 📥 Os 3 PDFs canônicos

Baixe estes 3 PDFs (use **Print to PDF** do navegador OU `wget`/`curl`) e salve nesta pasta `sample-kb/` como nomes canônicos:

| # | Documento Microsoft Learn | Salvar como |
|---|---------------------------|-------------|
| 1 | [Azure OpenAI Service overview](https://learn.microsoft.com/azure/ai-services/openai/overview) | `azure-openai-overview.pdf` |
| 2 | [Azure AI Search basics](https://learn.microsoft.com/azure/search/search-what-is-azure-search) | `ai-search-basics.pdf` |
| 3 | [Document Intelligence intro](https://learn.microsoft.com/azure/ai-services/document-intelligence/overview) | `doc-intelligence-intro.pdf` |

**Tamanho total esperado:** ~3MB (cada PDF ~1MB com Print to PDF do Edge/Chrome).

---

## 🏃 Quick start (Edge/Chrome → Print to PDF)

1. Abrir cada URL no navegador
2. Aguardar carregar completo (incluindo navegação lateral e exemplos de código)
3. `Ctrl+P` → Destino: **Salvar como PDF** → Layout: Retrato → Padrão → **Salvar**
4. Salvar com o nome canônico exato da tabela acima
5. Confirmar que os 3 arquivos `.pdf` estão nesta pasta `sample-kb/`

> **Atenção:** os nomes precisam bater exatamente — os scripts em `snippets/index_pdfs.py` iteram sobre `*.pdf` mas as queries de validação assumem esses 3 nomes específicos.

---

## 🔁 Alternativa via curl (Linux/macOS/WSL)

Se você quer evitar o Print-to-PDF manual, use uma extensão de captura como `wkhtmltopdf` ou `chromium --headless`:

```bash
# Linux/WSL com chromium-browser headless
chromium-browser --headless --no-sandbox \
  --print-to-pdf=azure-openai-overview.pdf \
  https://learn.microsoft.com/azure/ai-services/openai/overview

chromium-browser --headless --no-sandbox \
  --print-to-pdf=ai-search-basics.pdf \
  https://learn.microsoft.com/azure/search/search-what-is-azure-search

chromium-browser --headless --no-sandbox \
  --print-to-pdf=doc-intelligence-intro.pdf \
  https://learn.microsoft.com/azure/ai-services/document-intelligence/overview
```

> **Observação:** o Print-to-PDF do navegador típicamente rende mais legível para Document Intelligence do que `wkhtmltopdf` (que pode quebrar layout). Em caso de dúvida, use o navegador.

---

## 🎯 Por que esses 3 PDFs?

- **Cobrem os 3 services AI principais do lab** — você verá conteúdo descritivo sobre AI Search, Document Intelligence e Azure OpenAI nos resultados das queries do RAG (Parte 8)
- **Idioma uniforme (en-US)** — evita complicação de chunking multilíngue na Parte 2; o Translator (Parte 4) é testado separado em texto pt/es/fr
- **Layout misto (texto + listas + tabelas + código)** — exercita `prebuilt-layout` em diversos elementos
- **Volume pequeno (~3MB)** — indexação completa em <2min, custo de embeddings desprezível (~R$ 0,03)
- **Públicos e estáveis** — Microsoft Learn tem URL persistente; nada de breaking links no semestre da disciplina

---

## 🆚 Em produção real

A Apex Group (cenário pedagógico do HelpSphere) teria **62 PDFs corporativos** (~340MB) cobrindo manuais de operação, runbooks SAP, políticas LGPD, FAQs de devolução, etc. Para o lab usamos 3 PDFs públicos para reduzir tempo e custo de indexação e evitar dependência de assets proprietários. O pipeline é **idêntico** — só muda o volume e o conteúdo das queries de teste.

---

## 📁 Histórico

A v0.1.0-init deste repo planejava **8 PDFs proprietários pt-BR** com curadoria editorial detalhada (manual_operacao_loja_v3, runbook_sap_fi_integracao, etc.). Esse trabalho está preservado em [`../archive/sample-kb-pre-wave4/CONTEXT.md`](../archive/sample-kb-pre-wave4/CONTEXT.md) — referência editorial valiosa caso a disciplina volte a usar PDFs proprietários no futuro.

---

`version-anchor: Q2-2026`
