# Parte 10 — Grand Finale: RAG com KB Apex real (8 PDFs corporativos) (~1h)

> **Objetivo:** substituir os 3 PDFs Microsoft Learn (técnicos genéricos) pelos **8 PDFs corporativos Apex** (NF-e, SPED, SAP FI, CDC, LGPD) e demonstrar o impacto qualitativo na resposta do RAG. Mesma arquitetura, conteúdo brasileiro real.

> ⚠️ **Pré-requisito:** Lab Inter completo até a Parte 9 (índice `helpsphere-kb` populado, Function App rodando, RG `rg-lab-intermediario` AINDA NÃO deletado).

## 🎯 O que muda nesta Parte

| Aspecto | Partes 1-9 | Parte 10 (Grand Finale) |
|---|---|---|
| KB | 3 PDFs Microsoft Learn (en-US, técnicos) | 8 PDFs Apex (pt-BR, corporativos) |
| Volume | ~3MB · ~30 chunks | ~7.8MB · ~600 chunks estimados |
| Queries que respondem bem | Azure OpenAI overview, AI Search basics | "Qual o cutoff de envio de pedido pro Frota.io?" · "Cliente comprou geladeira fora dos 7 dias do CDC, o que faço?" · "Rejeição 539 da SEFAZ — como tratar?" |
| Custo de embeddings | ~R$ 0,03 | ~R$ 0,40 (text-embedding-3-large) |
| Persona pedagógica | Genérica | Diego (Tier 1), Marina (Tier 2), Lia (Head), Bruno (CTO), Carla (CFO) |

## Passo 10.1 — Clonar os PDFs Apex localmente (~5min)

Os 8 PDFs já estão versionados em `apex-rag-lab/sample-kb/`. Se já fez `git clone`, eles estão na sua máquina:

```powershell
cd C:\Projetos\apex-rag-lab\sample-kb
dir *.pdf
```

Esperado: 8 arquivos PDF totalizando ~7.8MB.

| # | PDF | Tamanho aprox | Categoria |
|---|-----|---------------|-----------|
| 1 | `faq_horario_atendimento.pdf` | 227KB | Comercial |
| 2 | `politica_reembolso_lojista.pdf` | 422KB | Financeiro |
| 3 | `faq_pedidos_devolucao.pdf` | 477KB | Comercial |
| 4 | `politica_dados_lgpd.pdf` | 737KB | RH/Compliance |
| 5 | `runbook_sap_fi_integracao.pdf` | 1.9MB | TI |
| 6 | `manual_operacao_loja_v3.pdf` | 1.1MB | Operacional |
| 7 | `manual_pos_funcionamento.pdf` | 1.9MB | Operacional/TI |
| 8 | `runbook_problemas_rede.pdf` | 1008KB | TI |

## Passo 10.2 — Limpar container `kbai` e processed (~5min)

Vamos reaproveitar o mesmo container `kbai` do Lab Inter, removendo os 3 PDFs antigos:

```powershell
# Apagar os 3 PDFs Microsoft Learn antigos do container kbai
az storage blob delete-batch `
  --source kbai `
  --account-name $env:STORAGE_NAME `
  --account-key $env:STORAGE_KEY

# Apagar os JSONs em processed/ (vamos re-processar com novos PDFs)
az storage blob delete-batch `
  --source processed `
  --account-name $env:STORAGE_NAME `
  --account-key $env:STORAGE_KEY
```

Validação:

```powershell
az storage blob list `
  --container-name kbai `
  --account-name $env:STORAGE_NAME `
  --account-key $env:STORAGE_KEY `
  --output table
```

Esperado: container vazio.

## Passo 10.3 — Upload dos 8 PDFs Apex (~5min)

```powershell
az storage blob upload-batch `
  --destination kbai `
  --source C:\Projetos\apex-rag-lab\sample-kb `
  --pattern "*.pdf" `
  --account-name $env:STORAGE_NAME `
  --account-key $env:STORAGE_KEY
```

Confirme:

```powershell
az storage blob list `
  --container-name kbai `
  --account-name $env:STORAGE_NAME `
  --account-key $env:STORAGE_KEY `
  --output table | Select-Object -First 12
```

Esperado: 8 arquivos `.pdf` listados.

## Passo 10.4 — Re-rodar Document Intelligence + chunking (~15min)

O snippet `index_pdfs.py` já está apontando para o container `kbai`. Basta re-executar:

```powershell
cd C:\Projetos\apex-rag-lab\snippets
python index_pdfs.py
```

Esperado:

```
[i] 8 PDFs encontrados
[+] Processing faq_horario_atendimento.pdf...
    42 chunks gerados → processed/faq_horario_atendimento.chunks.json
[+] Processing politica_reembolso_lojista.pdf...
    78 chunks gerados → processed/politica_reembolso_lojista.chunks.json
...
[+] Total de chunks gerados: ~600
[+] Próximo passo: rodar index_to_search.py
```

**Tempo estimado:** ~8-12 min (Document Intelligence prebuilt-layout em 8 PDFs paralelos = ~1-1.5 min/PDF).

## Passo 10.5 — Recriar Index e re-popular embeddings (~15min)

O índice `helpsphere-kb` já existe com schema correto. Vamos limpar os documentos antigos e re-popular:

```powershell
# Limpar todos os docs do índice (mas mantém o schema)
$INDEX = "helpsphere-kb"
curl.exe -X POST `
  "https://$($env:SEARCH_NAME).search.windows.net/indexes/$INDEX/docs/index?api-version=2024-07-01" `
  -H "Content-Type: application/json" `
  -H "api-key: $($env:SEARCH_ADMIN_KEY)" `
  --data-binary '@delete-all.json'
```

(Ou simplesmente recrie o index — `create_search_index.py` é idempotente.)

Agora re-rode o populator:

```powershell
python index_to_search.py
```

Esperado:

```
[i] Lendo chunks de processed/...
[i] 8 arquivos .chunks.json detectados, ~600 chunks total
[i] Gerando embeddings com text-embedding-3-large (3072 dims)...
[+] 600 embeddings gerados em 4m23s
[+] Upload em batches de 100 docs → helpsphere-kb
[+] 600 documentos indexados com sucesso
```

## Passo 10.6 — Queries comparativas (~10min)

Aqui é onde o **Grand Finale brilha**. Queries que retornavam respostas vagas ou "não sei" com PDFs Microsoft Learn agora retornam **respostas corporativas precisas em pt-BR**.

### Query 1 — Devolução fora do prazo CDC

**Pergunta para o agente:**
> "Um cliente comprou geladeira em 12/03 e quer devolver em 25/03 alegando desistência. Já passou dos 7 dias do CDC. O que faço?"

| KB | Resposta esperada |
|---|---|
| **Antes (MS Learn)** | "Document Intelligence é um serviço de extração de dados de documentos..." (irrelevante) |
| **Depois (Apex)** | Resposta cita o PDF `faq_pedidos_devolucao.pdf`, Página 7 ("Exceções CDC"), explica que **Diego escala para Marina (alçada R$ 2-5k)** com justificativa de fidelização, opções de política comercial flexível (crédito em loja, troca de modelo, devolução com 20% taxa de restocagem). Cross-ref com `politica_reembolso_lojista.pdf`. |

### Query 2 — NF-e Rejeição 539

**Pergunta:**
> "SEFAZ-SP retornou Rejeição 539 num pedido B2B de R$ 18.430. Pedido travado há 4h. Como resolvo?"

| KB | Resposta esperada |
|---|---|
| **Antes** | Respostas sobre Azure AI Search (irrelevante) |
| **Depois** | Resposta do `runbook_sap_fi_integracao.pdf` (Página 8-9): Rejeição 539 = CFOP incompatível para B2B. Procedimento passo a passo: validar CFOP 5102 (operação interestadual venda) vs 6102 (intra-estadual), conferir CST, re-emitir NF-e. Tempo médio de resolução por Tier 1: 15min. Escalar para Marina se persistir após 30min. |

### Query 3 — POS NFC-e travando

**Pergunta:**
> "Caixa 03 da loja Pinheiros: POS trava ao emitir NFC-e em vendas com mais de 8 itens. Aconteceu 3x hoje. O que pode ser?"

| KB | Resposta esperada |
|---|---|
| **Antes** | "Azure OpenAI is a service that provides..." (irrelevante) |
| **Depois** | Resposta do `manual_pos_funcionamento.pdf` (Capítulo 6, Página 28-29) cita o caso TKT-11 como referência. Causa raiz: timeout SEFAZ-SP em 30s default + thread pool subdimensionado no LINX BIGiPOS 12.5. Solução: upgrade do thread pool no `BIGiPOS.config.xml` (de 4 para 16 threads). Escalação Tier 2: Marina valida config; Tier 3: Bruno (CTO) abre chamado LINX. |

### Query 4 — VPN Loggi caindo após renew cert

**Pergunta:**
> "VPN site-to-site Apex Logística↔Loggi caiu após renovação de certificado. IPsec phase-2 retorna 'no proposal chosen'. Como resolvo?"

| KB | Resposta esperada |
|---|---|
| **Antes** | Resposta vaga sobre redes |
| **Depois** | Resposta do `runbook_problemas_rede.pdf` (Capítulo 3, Página 9): caso TKT-20 documentado. Causa: divergência SHA1 vs SHA256 no DH group após renew. Solução: alinhar DH-group-14 + SHA256 dos dois lados do IPsec. Escalado para fornecedor Fortinet. |

## Passo 10.7 — Métricas de qualidade comparativas

Re-rode o eval script (`evaluate.py`) com 5 queries do `tbl_tickets`:

| Métrica | KB Antes (3 PDFs MS Learn) | KB Depois (8 PDFs Apex) |
|---|---|---|
| precision@5 | 0.2-0.4 (queries Apex caem em conteúdo irrelevante) | 0.7-0.9 (queries Apex caem em PDFs Apex relevantes) |
| MRR | 0.15-0.3 | 0.6-0.8 |
| Citações úteis nas respostas | ~10% | ~85% |
| Latência p50 | 1.2s | 1.4s (mais chunks → leve aumento) |
| Custo por query | R$ 0,03 | R$ 0,04 |

A diferença qualitativa não é incremental — é categórica. **Mesmo pipeline, conteúdo certo = produto utilizável.**

## ✅ Checkpoint Parte 10

- [ ] 8 PDFs Apex enviados ao container `kbai`
- [ ] `index_pdfs.py` processou os 8 PDFs com sucesso (~600 chunks)
- [ ] `index_to_search.py` populou embeddings no índice `helpsphere-kb`
- [ ] Pelo menos 1 das 4 queries comparativas executada
- [ ] Diferença qualitativa entre Antes/Depois observada

## ⚠️ Cleanup final (obrigatório)

Agora sim, encerre o lab:

```powershell
az group delete --name rg-lab-intermediario --yes --no-wait
```

🎯 **Você acabou de demonstrar:** o valor real de uma KB curada para RAG corporativo brasileiro — onde NF-e, SPED, CDC, LGPD e gírias do varejo (PIX, Cielo, ANTT) fazem o agente útil ao invés de "Wikipédia genérica".

➡️ **Próximo lab:** [Lab Final — Agente + Workflow](https://github.com/tftec-guilherme/apex-helpsphere-agente-lab) (Foundry Agent SDK + n8n + MCP server) — agora você integra esse RAG dentro de um agente conversacional B2B.
