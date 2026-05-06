# Capítulo 05 — Provisionar Document Intelligence

> **Objetivo:** criar o recurso Azure AI Document Intelligence (`prebuilt-layout`), capturar `endpoint` e `key`, e fazer um smoke test contra um dos PDFs uploadeados no cap 04 — provando que o serviço extrai layout estruturado antes de plugar no AI Search no cap 07.

> **Tempo:** 10-15 minutos · **Custo:** R$ 0 (free tier 500 páginas/mês primeira vez) ou ~R$ 0,80 (S0, ~80 páginas)

---

## 1. O que é Document Intelligence e por que `prebuilt-layout`?

**Document Intelligence** (antes "Form Recognizer", renomeado em 2024) é o serviço Azure que extrai **estrutura** de PDFs/imagens — não só OCR de texto bruto, mas:

- **Parágrafos** com posição (bounding box)
- **Tabelas** com linhas, colunas, cells
- **Headings hierárquicos** (h1, h2, h3)
- **Listas** estruturadas
- **Selection marks** (checkboxes, rádios)
- **Páginas** com width/height/rotation

### Modelos disponíveis

| Modelo | Quando usar | Custo |
|---|---|---|
| `prebuilt-read` | Só OCR puro de texto, sem estrutura | $1,50/1k pages |
| `prebuilt-layout` ⭐ deste lab | OCR + estrutura (paragrafos, tabelas, layout) | $10/1k pages |
| `prebuilt-document` | Layout + key-value pairs genéricos | $10/1k pages |
| `prebuilt-invoice` | Faturas (campos específicos) | $10/1k pages |
| `prebuilt-receipt` | Recibos | $10/1k pages |
| Custom models | Treinar pra documentos seus | $50/1k pages |

> **Por que `prebuilt-layout` neste lab?** Os 8 PDFs sample-kb tem mistura de texto + tabelas + listas. `prebuilt-layout` retorna estrutura suficiente pro Skillset de chunking saber "quebrar por parágrafo" em vez de "quebrar por X caracteres" — chunking layout-aware é o anti-padrão #1 de RAG (slide 23 do deck D06).

---

## 2. Free tier de Document Intelligence

A Microsoft oferece **500 páginas grátis por mês** na primeira vez que você cria um recurso Document Intelligence (não `prebuilt-receipt` ou `custom`, mas `prebuilt-layout`/`read`/`document` cabem).

**Calculação para este lab:**

| Item | Quantidade | Páginas |
|---|---|---|
| 8 PDFs com média 10 páginas | 8 | 80 |
| Re-runs do Indexer durante experimentação | 3-5x | 240-400 |
| **Total esperado do lab** | | **320-480** |

⚠️ Cabe no free tier **se for sua primeira vez**. Se você já criou Doc Intelligence antes nessa subscription, vai cobrar S0.

---

## 3. Passo a passo via Portal

### 3.1 Buscar Document Intelligence no Marketplace

1. Portal Azure → Resource Group `rg-apex-rag-lab-{aluno}`
2. Topo da aba: **+ Create**
3. Marketplace search: `Document Intelligence`
4. Card resultante: **Azure AI Document Intelligence** (Microsoft, ícone azul de documento)
5. Clique em **Create**

📸 *Screenshot: card Document Intelligence no Marketplace*

> ⚠️ **Não confunda com "Form Recognizer".** Em Q2-2026 o nome legado ainda aparece em alguns lugares (CLI, ARM templates), mas o card de Marketplace já está como "Document Intelligence". Ambos referenciam `Microsoft.CognitiveServices/accounts` com `kind: FormRecognizer`.

### 3.2 Aba "Basics"

| Campo | Valor | Por quê |
|---|---|---|
| **Subscription** | (do cap 01) | herdada |
| **Resource group** | `rg-apex-rag-lab-{aluno}` | herdada |
| **Region** | `East US 2` | mesma do RG |
| **Name** | `cog-docint-apex-{aluno}` | naming convention |
| **Pricing tier** | **Free F0** ⭐ se primeira vez nesta subscription · senão `Standard S0` | §2 |

> **Naming gotcha:** Cognitive Services names aceitam 2-64 chars, alfanumérico + hifen. Único global em `*.cognitiveservices.azure.com`. Se `cog-docint-apex-gpc` já está tomado, adicione sufixo numérico.

### 3.3 Aba "Network"

Clique em **Next: Network >**.

Mantenha tudo padrão (`All networks, including the internet, can access this resource.`).

> **Em produção:** Private endpoint + restringir só a VNet do AI Search. Tópico do Lab Avançado.

### 3.4 Aba "Identity"

Clique em **Next: Identity >**.

Mantenha desabilitado (`System assigned managed identity: Off`). Não vamos usar MI nesse lab — usaremos a key direto no Skillset do AI Search.

> **Em produção:** habilitaria System-Assigned MI + role `Cognitive Services User` no AI Search → eliminaria a key do skillset. Tópico do Lab Avançado.

### 3.5 Aba "Tags"

Replique as 3 tags:
- `course = D06-IA-Automacao-Azure`
- `lab = intermediario`
- `student = {aluno}`

### 3.6 Review + create

Clique em **Next: Review + create >**, aguarde validação ✅ , clique em **Create**.

⏳ **Tempo:** ~30-60 segundos.

---

## 4. Capturar endpoint + key

Após o deploy completar, clique em **Go to resource**.

### 4.1 Endpoint

No menu lateral esquerdo:
- **Resource Management** → **Keys and Endpoint**

Você vê:

```
Endpoint:  https://cog-docint-apex-{aluno}.cognitiveservices.azure.com/
KEY 1:     8a... (60 chars hex)
KEY 2:     6b... (60 chars hex)
Location:  eastus2
```

### 4.2 Copiar e armazenar com segurança

Cole no seu `secrets.txt` local (mesmo arquivo onde você guardou a connection string do Storage no cap 03):

```
# Capítulo 05
DOCINT_ENDPOINT=https://cog-docint-apex-gpc.cognitiveservices.azure.com/
DOCINT_KEY=8a1c4f...
```

> ⚠️ **NUNCA commite `secrets.txt` no git.** Adicione no `.gitignore` do seu fork. KEY 1 dá acesso TOTAL à API — qualquer um com a key consegue chamar `prebuilt-layout` na sua subscription até esgotar quota.

> ✅ **Por que duas keys (KEY 1 + KEY 2)?** Padrão da Cognitive Services: você pode rotacionar uma sem downtime — substitua nos consumers usando KEY 2, regenere KEY 1, depois substitua de volta usando KEY 1. Para lab descartável, basta usar KEY 1.

📸 *Screenshot: Keys and Endpoint com endpoint visível*

---

## 5. Smoke test — chamar `prebuilt-layout` direto

Antes de plugar no AI Search, vamos validar que o serviço funciona com 1 PDF.

### 5.1 Pegar a URL pública de 1 PDF

```bash
SA_NAME="stapexraglabgpc"  # do cap 03
PDF_URL="https://${SA_NAME}.blob.core.windows.net/kb-source/manual_operacao_loja_v3.pdf"
echo $PDF_URL
```

### 5.2 Chamar Document Intelligence (assíncrono — POST + GET)

Document Intelligence usa padrão **assíncrono** com 2 requests: POST inicia o job + retorna `Operation-Location` header → GET polla esse URL até `status: succeeded`.

```bash
DOCINT_ENDPOINT="https://cog-docint-apex-gpc.cognitiveservices.azure.com/"  # ← seu endpoint
DOCINT_KEY="8a1c4f..."  # ← sua key

# 1) POST iniciar análise
RESPONSE_HEADERS=$(curl -sS -i -X POST \
  "${DOCINT_ENDPOINT}documentintelligence/documentModels/prebuilt-layout:analyze?api-version=2024-11-30" \
  -H "Ocp-Apim-Subscription-Key: ${DOCINT_KEY}" \
  -H "Content-Type: application/json" \
  -d "{\"urlSource\": \"${PDF_URL}\"}" | head -20)

echo "$RESPONSE_HEADERS"
```

Você deve ver no header de resposta:

```
HTTP/1.1 202 Accepted
Operation-Location: https://cog-docint-apex-gpc.cognitiveservices.azure.com/documentintelligence/documentModels/prebuilt-layout/analyzeResults/{operation-id}?api-version=2024-11-30
apim-request-id: ...
```

Capture o `Operation-Location` URL.

### 5.3 GET polling do resultado

```bash
OPERATION_URL="..."  # cole aqui o Operation-Location do passo 5.2

# Polla a cada 2s
for i in {1..15}; do
  RESULT=$(curl -sS -X GET "$OPERATION_URL" -H "Ocp-Apim-Subscription-Key: ${DOCINT_KEY}")
  STATUS=$(echo "$RESULT" | jq -r '.status')
  echo "Tentativa $i: $STATUS"
  [ "$STATUS" = "succeeded" ] && break
  sleep 2
done

# Pretty-print do resultado
echo "$RESULT" | jq '.analyzeResult | {modelId, content: .content[:200], pages: (.pages | length), tables: (.tables | length), paragraphs: (.paragraphs | length)}'
```

### 5.4 Saída esperada

```json
{
  "modelId": "prebuilt-layout",
  "content": "MANUAL DE OPERAÇÃO DE LOJA\nVersão 3.0\n\n1. Introdução\n\nEste manual estabelece os procedimentos padrão...",
  "pages": 15,
  "tables": 3,
  "paragraphs": 87
}
```

✅ **Funcionou:**
- `pages: 15` → Document Intelligence leu todas as páginas
- `paragraphs: 87` → estrutura paragráfica preservada (vai virar chunks layout-aware no cap 07)
- `tables: 3` → tabelas detectadas como objetos estruturados
- `content` → texto limpo, com line breaks preservados

---

## 6. Validação

### 6.1 Checklist

- [ ] Recurso `cog-docint-apex-{aluno}` criado em `East US 2`, status **Succeeded**
- [ ] Pricing tier **F0** (free) ou **S0** (paid)
- [ ] Endpoint capturado no formato `https://*.cognitiveservices.azure.com/`
- [ ] KEY 1 capturada e salva em `secrets.txt` local
- [ ] Smoke test §5 retornou `status: succeeded` com `pages > 0` e `paragraphs > 0`
- [ ] Tags `course`, `lab`, `student` aplicadas

### 6.2 Verificar custo até agora

```bash
# Cloud Shell
az consumption usage list \
  --start-date $(date -d '7 days ago' '+%Y-%m-%d') \
  --end-date $(date '+%Y-%m-%d') \
  --query "[?contains(instanceName, 'cog-docint')].[instanceName, pretaxCost, currency]" \
  --output table
```

Se você está no F0, custo deve ser `$0.00`. Se S0, deve ser ~$0.01-0.05.

---

## 7. Troubleshooting comum

### ❌ "InvalidApiVersion" na chamada do `analyze`

Você está usando uma `api-version` antiga. Em Q2-2026 o estável é `2024-11-30`. Se mudar pra GA mais recente, atualize. Lista de versões: [docs](https://learn.microsoft.com/azure/ai-services/document-intelligence/concept-layout).

### ❌ "Quota exceeded for current subscription"

Free tier F0 tem 500 páginas/mês. Se você re-rodou o smoke test várias vezes, pode ter estourado. Soluções:
- Espere o reset mensal (1º dia do mês UTC)
- Mude pra S0 (vai cobrar ~$0,01/page)
- Use `prebuilt-read` (mais barato, mas perde estrutura — não recomendado pra este lab)

### ❌ "AccessDenied" ao buscar PDF da Storage

A URL do blob está retornando 403. Causas comuns:
1. Container `kb-source` não está com `anonymous access: Blob` (volte cap 03)
2. Storage Account não tem `Allow anonymous access` (volte cap 03)
3. Você usou URL com SAS expirado em vez da URL pública

Confirme abrindo a URL no browser anonimo — deve baixar o PDF sem login.

### ❌ Smoke test demora >2 minutos

PDF muito grande (>50 páginas) ou Doc Intelligence em throttling. Tente com PDF menor (`faq_horario_atendimento.pdf`) primeiro.

### ❌ Resposta sem `paragraphs`

Você está usando `prebuilt-read` em vez de `prebuilt-layout` na URL. `prebuilt-read` retorna só `content` e `pages`. Volte e use `prebuilt-layout:analyze` no POST.

---

## 8. Próximo passo

Document Intelligence provisionado, endpoint+key capturados, smoke test bem-sucedido?

→ **Avance para [Capítulo 06 — Provisionar AI Search](./06-ai-search-service.md)**

> Capítulo 06 cria o serviço AI Search Basic, captura admin-key e query-key, e prepara o terreno pro Skillset declarativo do cap 07 que vai ENCADEAR Document Intelligence + chunking + (opcional) embeddings.
