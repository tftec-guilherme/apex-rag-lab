# Troubleshooting — Lab Intermediário D06 RAG (Wave 4)

> Erros comuns + diagnóstico sequencial. Baseado em [`00-guia-completo.md`](./00-guia-completo.md) seção "Troubleshooting".

---

## Diagnóstico sequencial (rode na ordem se algo quebrar)

```bash
# 1. Login OK?
az account show

# 2. RGs corretos existem?
az group show --name rg-lab-intermediario
az group show --name rg-helpsphere-ia

# 3. Storage acessível?
az storage container list --account-name stlabinter{rand} --auth-mode login

# 4. Document Intelligence ativo?
az cognitiveservices account show --name di-helpsphere-rag --resource-group rg-lab-intermediario

# 5. Search service responde?
az search service show --name srch-helpsphere-rag --resource-group rg-lab-intermediario

# 6. Foundry Project existe?
az ml workspace show --name aifproj-helpsphere-rag --resource-group rg-helpsphere-ia 2>/dev/null || echo "use Foundry portal ai.azure.com"

# 7. Function App rodando?
az functionapp show --name func-helpsphere-rag --resource-group rg-lab-intermediario --query "state"

# 8. Postman → /chat/rag retorna 200?
curl -X POST "https://func-helpsphere-rag.azurewebsites.net/api/chat/rag" \
     -H "Content-Type: application/json" \
     -H "x-functions-key: <FUNCTION_KEY>" \
     -d '{"userMessage":"teste"}'

# 9. Application Insights mostra erros?
# Portal → func-helpsphere-rag → Application Insights → Failures (últimas 24h)
```

---

## Erros catalogados

### `403 Forbidden` ao chamar Storage / Document Intelligence / Search

**Causa:** RBAC não propagou ainda OU role errada atribuída.

**Fix:**
1. Confirmar role atribuída: `az role assignment list --assignee <MI_PRINCIPAL_ID> --all --query "[].{Role:roleDefinitionName, Scope:scope}"`
2. Aguardar 30-60s após o `az role assignment create`
3. Roles necessárias por service:
   - Storage: `Storage Blob Data Contributor` (Reader é insuficiente para upload)
   - Document Intelligence: `Cognitive Services User`
   - Search: `Search Index Data Contributor` + `Search Service Contributor`
   - Vision: `Cognitive Services User`
   - Translator: `Cognitive Services User`

---

### `400 Bad Request: dimension mismatch` em `index_to_search.py`

**Causa:** índice AI Search criado com `dimensions=1536` (default `ada-002`), mas `text-embedding-3-large` retorna 3072 dim.

**Fix:**
1. Drop e recria o índice com `dimensions=3072` em [`snippets/create_search_index.py`](../snippets/create_search_index.py)
2. **NÃO** mude o modelo de embedding — `text-embedding-3-large` é o cravado para o lab (recall melhor que `ada-002`)

---

### `429 Too Many Requests` em Azure OpenAI

**Causa:** TPM (tokens-per-minute) acima do limite do deployment.

**Fix:**
1. Aumentar TPM para 50K ou 100K no deployment (Foundry portal → Models + endpoints → seu deployment → Edit)
2. Ou implementar exponential backoff no script Python (`tenacity` ou `azure-core` retry policy)
3. Verificar quota disponível: `az cognitiveservices usage list --location <REGION>`

---

### `Hub aifhub-apex-prod not found`

**Causa:** Bloco 2 da Disciplina não foi executado OU foi executado em sub diferente.

**Fix:**
1. `az account show` — confirme que está na sub correta
2. `az group show --name rg-helpsphere-ia` — confirme que o RG existe
3. Se não existe, volte e execute o Bloco 2 inteiro antes de continuar com Lab Inter

---

### Document Intelligence chunks vazios ou com texto corrompido

**Causa:** PDF baixado com `wkhtmltopdf` ou ferramenta similar quebrou o layout.

**Fix:**
1. Re-baixe o PDF usando **Print to PDF do navegador** (Edge/Chrome) — geralmente preserva melhor o layout
2. Se persistir, abra o PDF no Adobe Reader e use `File > Save As > PDF/A` para sanitizar
3. Modelo recomendado é `prebuilt-layout` — não tente mudar para `prebuilt-document` ou custom (latência maior, mesmo resultado para Microsoft Learn)

---

### AI Vision OCR retorna texto baixa qualidade em screenshots

**Causa:** screenshot tem texto pequeno (<14px no PDF) OU baixa resolução (<150 DPI).

**Fix:**
1. Para screenshots de POS/erros, capture em pelo menos 1080p
2. Se PDF foi gerado por scan, garantir resolução mínima 300 DPI
3. Considere usar `prebuilt-read` em vez de Vision para PDFs textuais (Document Intelligence cobre isso, Vision é só para imagens isoladas)

---

### Translator detect retorna idioma errado

**Causa:** texto curto (<10 caracteres) ou misto de idiomas (code-switching pt/en).

**Fix:**
1. Concatene contexto antes de detectar: ticket completo (subject + body), não só o título curto
2. Para text mixing, force `from=pt` em vez de detectar automaticamente
3. Confidence threshold: aceite `score ≥ 0.7`, fallback para "en" caso contrário

---

### Function App `cold start` de 5-10s no primeiro request

**Causa:** Consumption tier hiberna após 5-20min sem requests.

**Fix:**
- Para o lab: aceitável. Aguarde 5-10s no primeiro request, depois fica rápido
- Para produção: migrar para **Premium tier** (`AlwaysOn = true`) ou usar **App Service Plan dedicado**
- Health-check warmer ping a cada 4min é uma alternativa custo-zero (timer trigger interno)

---

### Function App `503 Service Unavailable`

**Causa:** Managed Identity sem role suficiente OU env var faltando.

**Fix:**
1. Application Insights → Failures → veja stacktrace
2. Confirme env vars (Function App → Configuration): `SEARCH_ENDPOINT`, `SEARCH_INDEX`, `AOAI_ENDPOINT`, `AOAI_API_KEY`, `EMBEDDING_DEPLOYMENT`, `CHAT_DEPLOYMENT`, `VISION_ENDPOINT`, `VISION_KEY`, `TRANSLATOR_ENDPOINT`, `TRANSLATOR_KEY`, `TRANSLATOR_REGION`
3. Confirme MI roles na Function App: `az role assignment list --assignee <FUNC_MI_PRINCIPAL>`

---

### Custo aparece muito acima do esperado

**Causa esperada:** AI Search Standard S1 ligado por dias.

**Fix:**
1. `az cost-management query --type Usage --timeframe MonthToDate --scope /subscriptions/<SUB_ID>`
2. Se `rg-lab-intermediario` ainda existe e não está em uso, **delete agora**: `az group delete --name rg-lab-intermediario --yes --no-wait`
3. Anotar lição: configurar **budget alert** próxima vez (`az consumption budget create`)

---

## Pre-Wave 4 troubleshooting

Conteúdo de erros catalogados na arquitetura Cognitive Search Skillset (v0.1.0-init) preservado em [`../archive/docs-pre-wave4/troubleshooting.md`](../archive/docs-pre-wave4/troubleshooting.md). Útil se você está adaptando esta arquitetura para um lab futuro com Skillset declarativo.

---

`version-anchor: Q2-2026`
