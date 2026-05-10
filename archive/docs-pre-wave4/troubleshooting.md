# Troubleshooting — Lab Intermediário Apex RAG

> Sintomas comuns + diagnóstico rápido + fix. Organizado por capítulo onde o problema costuma aparecer. Procure por **mensagem de erro literal** com Ctrl+F.

---

## Capítulo 01 — Pré-requisitos

### "AuthorizationFailed" ao listar role assignments

**Causa:** seu user não tem `User Access Administrator` na subscription.
**Fix:** Subscription owner precisa atribuir Owner OU (Contributor + User Access Administrator) ao seu user.

### "ResourceGroupNotFound" intermitente entre comandos `az`

**Causa:** `az account set --subscription` se perde entre janelas PowerShell.
**Fix:** sempre rodar `az account set --subscription <SUB_ID>` no início de cada nova sessão.

### Free Trial $200 USD bloqueia provisioning

**Causa:** Free Trial tem políticas restritivas que impedem alguns recursos paid (Document Intelligence S0).
**Fix:** upgrade pra Pay-As-You-Go OU use F0 free tier do Doc Intelligence (deste lab funciona).

---

## Capítulo 02 — Resource Group

### "Subscription is not registered to use namespace"

**Causa:** Subscription nova nunca usou esses providers.
**Fix:**

```bash
az provider register --namespace Microsoft.Resources
az provider register --namespace Microsoft.CognitiveServices
az provider register --namespace Microsoft.Search
az provider register --namespace Microsoft.Storage
```

Aguarde 2 minutos.

### "Resource group name 'rg-apex-rag-lab-{aluno}' is invalid"

**Causa:** placeholder `{aluno}` literal sem substituir, OU caractere proibido (espaço, acento, ponto).
**Fix:** use só letras minúsculas + hífen + números.

### "Subscription does not have access to location 'eastus2'"

**Causa:** subscription tem políticas de location restritas.
**Fix:** usar `westus3` (mantenha consistência: TODOS os recursos na mesma região).

---

## Capítulo 03 — Storage Account

### "The storage account name is already taken"

**Causa:** nomes de Storage são únicos globais.
**Fix:** adicione sufixo numérico → `stapexraglabgpc01`.

### "Anonymous access not allowed at storage account level"

**Causa:** esqueceu de marcar "Allow enabling anonymous access on individual containers" na aba Advanced.
**Fix:** Storage Account → **Configuration** → marque toggle → Save → re-criar container.

### Cobrança aparece com R$ 1+ no primeiro dia

**Causa:** outro recurso anterior cobrando, OU região com pricing premium.
**Fix:** Cost Management → filtrar por `lab=intermediario` pra ver real.

---

## Capítulo 04 — Upload de PDFs

### "AuthorizationPermissionMismatch" durante upload via CLI

**Causa:** usuário não tem `Storage Blob Data Contributor`.
**Fix:**

```bash
az role assignment create \
  --assignee "$(az ad signed-in-user show --query id -o tsv)" \
  --role "Storage Blob Data Contributor" \
  --scope "$(az storage account show --name $SA_NAME --resource-group $RG_NAME --query id -o tsv)"
```

Aguarde 30-60s.

### Drag-and-drop não funciona no Portal

**Causa:** browser em "strict tracking protection" bloqueia widget de upload.
**Fix:** use Chrome/Edge default OU Storage Explorer desktop OU AzCopy CLI.

### PDF abre vazio após download

**Causa:** PDF corrompido em `sample-kb/source/`.
**Fix:** re-clonar repo apex-rag-lab (verifique `git status` limpo).

### Indexer (cap 07) não vê os blobs

**Causa:** uploadeou em subfolder (`kb-source/pdfs/manual.pdf`) em vez da raiz.
**Fix:** mova ou re-upload na raiz do container.

---

## Capítulo 05 — Document Intelligence

### "InvalidApiVersion" no `analyze`

**Causa:** versão antiga de api-version.
**Fix:** use `api-version=2024-11-30` (estável Q2-2026).

### "Quota exceeded"

**Causa:** Free tier F0 tem 500 páginas/mês — você re-rodou smoke test várias vezes.
**Fix:** espere reset mensal OU mude pra S0 OU use `prebuilt-read` (perde estrutura).

### "AccessDenied" buscando PDF da Storage

**Causa:** URL do blob retornando 403.
**Fixes:**
1. Container `kb-source` sem `anonymous access: Blob` (volte cap 03 §4.3)
2. Storage sem `Allow anonymous access` (volte cap 03 §3.3)
3. URL com SAS expirado (use URL pública canônica)

### Smoke test demora >2 minutos

**Causa:** PDF muito grande (>50 páginas) ou throttling.
**Fix:** teste com `faq_horario_atendimento.pdf` (PDF pequeno).

### Resposta sem `paragraphs`

**Causa:** está usando `prebuilt-read` em vez de `prebuilt-layout`.
**Fix:** confirme URL `prebuilt-layout:analyze`.

---

## Capítulo 06 — AI Search

### "The location is not available for SKU 'basic'"

**Causa:** quota regional Basic cheia.
**Fix:** mude TODOS os recursos pra `westus3` (mantenha consistência region).

### Provisionamento >10 minutos

**Causa:** AI Search às vezes lento alocando cluster Basic.
**Fix:** cancele e tente região alternativa.

### "AuthorizationFailed" criando role assignment

**Causa:** sem `User Access Administrator`.
**Fix:** volte cap 01 §2.2.

### MI não aparece em "Managed identity" picker

**Causa:** System-Assigned MI não habilitada.
**Fix:** AI Search → **Settings** → **Identity** → toggle **System assigned: On** → Save → aguarde 30s.

### `servicestats` retorna 403

**Causa:** usou Query key em vez de Admin key.
**Fix:** confira `secrets.txt` e use `SEARCH_ADMIN_KEY`.

---

## Capítulo 07 — Skillset + Indexer

### Indexer status `persistentFailure` com `Forbidden`

**Causa:** MI sem role no Storage ou Doc Intelligence.
**Fix:** volte cap 06 §5, re-execute role assignments, aguarde 5min, re-trigger indexer.

### Indexer `success` mas `itemsProcessed: 0`

**Causa:** container vazio OU naming convention errado.
**Fix:** confira cap 04 (PDFs uploadados na raiz).

### `documentCount: 0` mesmo com indexer success

**Causa:** `indexProjections` mal configurado (selectors errados).
**Fix:** AI Search → **Search management** → **Skillsets** → `kb-apex-skillset` → **Errors and warnings**.

### Erro 429 Too Many Requests

**Causa:** Doc Intelligence F0 rate limit (20 transactions/min) saturado por 8 PDFs paralelos.
**Fixes:**
- Mude pra S0
- OU adicione `batchSize: 1` no indexer parameters

### Caracteres acentuados quebrados

**Causa:** analyzer `standard` em vez de `pt-Lucene`.
**Fix:** PUT no index schema com `analyzer: "pt-Lucene"` em `chunk` e `title`.

⚠️ **Limitação:** mudar analyzer requer **re-criar campo** (não dá pra alterar). Você pode precisar deletar+recriar o index inteiro + re-rodar indexer.

---

## Capítulo 08 — Search Explorer

### "Semantic configuration not found"

**Causa:** `kb-apex-semantic` não criado no index schema.
**Fix:** PATCH index schema com bloco `semantic.configurations`.

### Semantic ranker retorna `null` em `@search.rerankerScore`

**Causa:** tier Free **não suporta** semantic ranker.
**Fix:** confirme cap 06 que está em **Basic**, não Free.

### Stemming português não funciona

**Causa:** analyzer `standard`.
**Fix:** ver cap 07 troubleshooting.

### `@search.answers` vazio

**Causa:** query muito ambígua OU conteúdo sem resposta direta.
**Fix:** queries mais focadas tipo "qual o prazo de X?".

### Search Explorer demora 30+ segundos

**Causa:** cold-start do tier Basic no primeiro query do dia.
**Fix:** aguarde — daí em diante <300ms.

---

> ⚠️ **Capítulo 09 (Q1) — referências pré-Wave 4 obsoletas**
>
> A seção abaixo (Cap 09) contém referências a arquitetura obsoleta: backend Function App monolítico + endpoint `/chat` + componente `Answer.tsx`. A arquitetura Wave 4 atual usa Container App `capps-backend-{env}` + endpoint `POST /chat/rag` + componente `ChatPanel`.
>
> Para troubleshooting do Lab Inter Wave 4 atual, consulte `docs/troubleshooting.md` na raiz do `docs/`. Os caps 01-08 e 10 abaixo permanecem aplicáveis (não tocam diretamente em apex-helpsphere).

## Capítulo 09 — RAG Query

### CORS error no caminho B (HTML)

**Causa:** AI Search bloqueia origens não permitidas.
**Fix:** **Index → CORS** → adicione `*` (lab) ou `http://localhost`.

### Backend Python crashloop após adicionar AZURE_SEARCH_*

**Causa:** env vars não exportadas no Container App.
**Fix:**

```bash
az containerapp show -n {backend-name} -g {rg} --query properties.template.containers[0].env
```

Re-deploya com `azd deploy backend`.

### Citations duplicadas (mesmo PDF 3x)

**Causa:** chunks redundantes pelo overlap.
**Fix:** ajustar `pageOverlapLength` no SplitSkill (cap 07 §4.1) de 256 → 128.

### `@search.answers` retorna `[]` constantemente

**Causa:** queries muito amplas.
**Fix:** refraseie como pergunta: "qual o prazo de devolução?" em vez de "prazo".

---

## Capítulo 10 — Cleanup

### Cost Management ainda mostra cobrança 1 dia depois

**Causa:** dados de billing têm latência de 8-24h.
**Fix:** confira de novo no dia seguinte. Se persistir >48h, abra ticket Microsoft.

### Não consegue criar `cog-docint-apex-{aluno}` de novo (em <90 dias)

**Causa:** soft-delete de Cognitive Services dura 90 dias.
**Fix:** purgar com `az cognitiveservices account purge` (cap 10 §4.1).

---

## Diagnóstico geral — checklist sequencial

Se o lab está com problema mas você não sabe onde, rode este checklist em ordem:

```bash
# 1. Subscription correta
az account show --query "{name:name, id:id}"

# 2. RG existe
az group exists --name "$RG_NAME"

# 3. Storage existe + container kb-source com Blob anon access
az storage container show --name kb-source --account-name "$SA_NAME" --auth-mode login

# 4. 8 PDFs no container
az storage blob list --account-name "$SA_NAME" --container-name kb-source --auth-mode login --query "length(@)"

# 5. Doc Intelligence existe
az cognitiveservices account show --name "$DOCINT_NAME" --resource-group "$RG_NAME" --query "properties.provisioningState"

# 6. AI Search existe + MI habilitada
az search service show --name "$SEARCH_NAME" --resource-group "$RG_NAME" --query "{state: provisioningState, miEnabled: identity.principalId}"

# 7. MI roles
az role assignment list --assignee "$(az search service show -n $SEARCH_NAME -g $RG_NAME --query identity.principalId -o tsv)" --query "[].{role:roleDefinitionName, scope:scope}" --output table

# 8. Indexer status
curl -sS -H "api-key: $SEARCH_ADMIN_KEY" \
  "${SEARCH_ENDPOINT}/indexers/kb-apex-indexer/status?api-version=2024-07-01" | jq '.lastResult.{status, itemsProcessed, errors}'

# 9. Index document count
curl -sS -H "api-key: $SEARCH_ADMIN_KEY" \
  "${SEARCH_ENDPOINT}/indexes/kb-apex-index/stats?api-version=2024-07-01" | jq
```

Se algum desses comandos retornar erro ou valor inesperado, vá no capítulo correspondente do troubleshooting acima.

---

## Suporte

- **Issues neste repo:** [github.com/tftec-guilherme/apex-rag-lab/issues](https://github.com/tftec-guilherme/apex-rag-lab/issues)
- **Disciplina 06 fórum:** AVA da pós-graduação
- **Microsoft Learn (Document Intelligence):** [docs](https://learn.microsoft.com/azure/ai-services/document-intelligence/)
- **Microsoft Learn (AI Search):** [docs](https://learn.microsoft.com/azure/search/)

> Se identificar bug ou inconsistência neste lab que não está documentada aqui, abra issue. Ajuda os próximos alunos.
