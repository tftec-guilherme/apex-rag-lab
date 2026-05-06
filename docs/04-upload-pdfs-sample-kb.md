# Capítulo 04 — Upload dos 8 PDFs sample-kb

> **Objetivo:** subir os 8 PDFs corporativos curados pra `kb-source/` no Storage Account, validar que estão acessíveis via URL pública, e preparar o ground truth pro Indexer puxar no capítulo 07.

> **Tempo:** 5-10 minutos · **Custo:** R$ 0 (upload é grátis; storage 25 MB no Cool tier custa centavos)

---

## 1. Os 8 PDFs deste lab

Os PDFs vivem na pasta [`sample-kb/source/`](../sample-kb/source/) deste repositório. Eles foram curados a partir da base de conhecimento real do HelpSphere (62 PDFs no template `apex-helpsphere`) — selecionamos 8 que cobrem **diversidade de layout**, **diversidade de domínio**, e **diversidade de complexidade pedagógica**.

| # | Arquivo | Domínio | Layout | Por que escolhido |
|---|---------|---------|--------|-------------------|
| 1 | `manual_operacao_loja_v3.pdf` | Operação varejo | Texto + imagens | Manual extenso (~15 pp) — testa chunking layout-aware |
| 2 | `runbook_sap_fi_integracao.pdf` | Integração ERP | Tabelas técnicas | Tabelas com colunas — testa skill de table extraction |
| 3 | `faq_pedidos_devolucao.pdf` | Atendimento | Q&A estruturado | FAQ — testa retrieval semântico de perguntas |
| 4 | `politica_reembolso_lojista.pdf` | Compliance | Texto puro denso | Texto regulatório — testa precision com vocabulário formal |
| 5 | `manual_pos_funcionamento.pdf` | Operação POS | Mixed | Manual técnico — testa chunking misturando texto + bullets |
| 6 | `runbook_problemas_rede.pdf` | IT | Listas + comandos | Comandos + screenshots — testa preservação de monospace |
| 7 | `faq_horario_atendimento.pdf` | Atendimento | Q&A simples | FAQ curto — caso de teste com poucos chunks |
| 8 | `politica_dados_lgpd.pdf` | Compliance LGPD | Estruturado por seções | Documento longo seccionado — testa que metadata `page_number` funciona |

> **Tamanho total:** ~25 MB (~10 páginas média por PDF). Cabem em qualquer plano grátis de Storage.

> ⚠️ **Status v0.1.0-init:** os 8 PDFs em `sample-kb/source/` ainda estão sendo curados (Story 06.7 — sub-componente A). Acompanhe [CHANGES.md](../CHANGES.md) e [PARA-O-ALUNO.md](../PARA-O-ALUNO.md) pra release v0.2.0 com PDFs incluídos. Estrutura deste lab está pronta; só falta o conteúdo.

---

## 2. Três caminhos de upload

Escolha **um**:

| Caminho | Quando usar | Tempo |
|---|---|---|
| **A. Portal drag-and-drop** ⭐ recomendado pro lab | Aluno primeira vez, quer ver visualmente o que está acontecendo | 3-5 min |
| **B. AzCopy CLI** | Aluno que já tem AzCopy + quer reproduzir em script | 1-2 min |
| **C. Azure Storage Explorer** desktop | Aluno que prefere GUI desktop sobre Portal | 3-5 min |

---

## 3. Caminho A — Portal drag-and-drop

### 3.1 Baixar os 8 PDFs

```bash
# Clone o repo apex-rag-lab (se ainda não fez)
git clone https://github.com/tftec-guilherme/apex-rag-lab.git
cd apex-rag-lab/sample-kb/source/
ls -la *.pdf
```

Você deve ver os 8 PDFs listados.

### 3.2 Abrir o container kb-source

1. Portal Azure → Resource Group `rg-apex-rag-lab-{aluno}`
2. Clique no Storage Account `stapexraglab{aluno}`
3. Menu lateral → **Data storage** → **Containers**
4. Clique no container **`kb-source`** (criado no cap 03)

📸 *Screenshot: container kb-source aberto, vazio*

### 3.3 Upload via drag-and-drop

1. No topo do container, clique em **Upload**
2. Painel direito abre
3. **Arraste os 8 PDFs** da pasta `sample-kb/source/` do seu file explorer pra área de upload
4. Em **Advanced** (clique pra expandir):
   - **Blob type:** `Block blob` (default, deixe assim)
   - **Access tier:** `Cool` (herda do account default)
   - **Upload to folder (optional):** deixe vazio (upload direto na raiz do container)
5. Clique em **Upload**

📸 *Screenshot: 8 PDFs sendo arrastados pra área de upload*

⏳ **Tempo:** ~30 segundos para 25 MB em conexão broadband normal.

### 3.4 Confirmar upload

1. O painel direito fecha
2. A lista de blobs do container mostra os **8 arquivos PDF**
3. Cada arquivo aparece com:
   - **Name** (`manual_operacao_loja_v3.pdf`, etc.)
   - **Modified** (timestamp recente)
   - **Access tier** (`Cool (Inferred)`)
   - **Blob type** (`Block blob`)
   - **Size** (~3 MB cada em média)

📸 *Screenshot: 8 PDFs listados em kb-source*

---

## 4. Caminho B — AzCopy CLI

### 4.1 Instalar AzCopy (se ainda não tem)

```bash
# Linux/macOS
wget https://aka.ms/downloadazcopy-v10-linux -O azcopy.tar.gz
tar -xvf azcopy.tar.gz
sudo cp azcopy_linux_amd64_*/azcopy /usr/local/bin/

# Windows (PowerShell)
winget install --id Microsoft.AzureCLI.AzCopy
```

### 4.2 Login

```bash
azcopy login
```

Abre browser, autentica com Entra. Aceite o consent do AzCopy.

### 4.3 Upload em batch

```bash
RG_NAME="rg-apex-rag-lab-gpc"  # substitua gpc pelo seu {aluno}
SA_NAME="stapexraglabgpc"

# Sync de pasta inteira pra container
azcopy copy "./sample-kb/source/*.pdf" \
  "https://${SA_NAME}.blob.core.windows.net/kb-source/" \
  --overwrite=true \
  --put-md5
```

### 4.4 Validar

```bash
azcopy list "https://${SA_NAME}.blob.core.windows.net/kb-source/"
```

Deve listar os 8 PDFs.

> **Por que `--put-md5`?** AzCopy calcula MD5 e armazena como `Content-MD5` blob property. Isso permite o Indexer detectar incrementos (novos PDFs ou modificados) sem re-processar tudo no cap 07.

---

## 5. Caminho C — Azure Storage Explorer (desktop)

1. Baixe e instale: [Azure Storage Explorer](https://azure.microsoft.com/products/storage/storage-explorer)
2. Faça login com sua conta Entra
3. Expanda a árvore: **Subscription** → **Storage Accounts** → `stapexraglab{aluno}` → **Blob Containers** → `kb-source`
4. Clique em **Upload** → **Upload Files**
5. Selecione os 8 PDFs em `sample-kb/source/`
6. Clique em **Upload**

📸 *Screenshot: Storage Explorer com 8 PDFs prontos pra upload*

Vantagem do Storage Explorer: drag-and-drop direto da árvore + barra de progresso por arquivo + retentativa automática em falha.

---

## 6. Validação final (independente do caminho)

### 6.1 Via Portal

Em `Containers → kb-source`, confira:

- [ ] Lista mostra **8 arquivos PDF**
- [ ] Cada arquivo tem `Access tier: Cool (Inferred)` ou `Cool`
- [ ] Cada arquivo tem **Modified** recente (~minutos atrás)
- [ ] **Tamanho total** próximo de 25 MB (varia conforme PDFs reais)

### 6.2 Via Cloud Shell

```bash
SA_NAME="stapexraglabgpc"

# Listar blobs (via auth login)
az storage blob list \
  --account-name "$SA_NAME" \
  --container-name "kb-source" \
  --auth-mode login \
  --query "[].{name:name, size:properties.contentLength, tier:properties.blobTier}" \
  --output table
```

**Saída esperada:**

```
Name                              Size      Tier
--------------------------------  --------  ----
faq_horario_atendimento.pdf       2103840   Cool
faq_pedidos_devolucao.pdf         3145728   Cool
manual_operacao_loja_v3.pdf       4194304   Cool
manual_pos_funcionamento.pdf      3670016   Cool
politica_dados_lgpd.pdf           3145728   Cool
politica_reembolso_lojista.pdf    2621440   Cool
runbook_problemas_rede.pdf        2949120   Cool
runbook_sap_fi_integracao.pdf     3407872   Cool
```

> **Total esperado:** 8 blobs · ~25 MB

### 6.3 Teste de acesso público (anonymous Blob)

Pegue a URL pública de um blob:

```bash
echo "https://${SA_NAME}.blob.core.windows.net/kb-source/manual_operacao_loja_v3.pdf"
```

Cole essa URL no navegador (em aba anônima/incognito). O PDF deve **abrir/baixar** sem pedir autenticação. Isso valida que o anonymous access nivel `Blob` que configuramos no cap 03 funcionou.

> ⚠️ **Em produção real:** você não deixaria PDFs publicamente acessíveis. Essa exposição é **temporária + lab-only** porque facilita o setup do Indexer no cap 07. Vamos restringir nos labs futuros.

---

## 7. Troubleshooting comum

### ❌ "AuthorizationPermissionMismatch" durante upload via CLI

Sua conta não tem permissão `Storage Blob Data Contributor` no Storage Account. Solução:

```bash
SA_RESOURCE_ID=$(az storage account show --name "$SA_NAME" --resource-group "$RG_NAME" --query id --output tsv)
USER_PRINCIPAL=$(az ad signed-in-user show --query id --output tsv)

az role assignment create \
  --assignee "$USER_PRINCIPAL" \
  --role "Storage Blob Data Contributor" \
  --scope "$SA_RESOURCE_ID"
```

Aguarde 30-60s pra propagar e tente upload de novo.

### ❌ "Public access is not permitted on this storage account"

Você esqueceu de marcar "Allow enabling anonymous access on individual containers" no cap 03 §3.3. Solução: Storage Account → **Configuration** → marque o toggle → Save → re-criar container `kb-source` com level `Blob`.

### ❌ Drag-and-drop não funciona no Portal

Browsers em modo "strict tracking protection" às vezes bloqueiam o JS do upload-widget. Use Chrome/Edge default ou Storage Explorer desktop.

### ❌ PDF abre vazio ou corrompido após download via URL pública

Algum PDF do `sample-kb/source/` está corrompido. Confira `git status`/`git diff` no clone do repo — deve ser idêntico ao remote. Se estiver corrompido após `git clone`, tente re-clonar com `git lfs install && git lfs pull` (se v0.2.0+ usar Git LFS pra PDFs grandes).

### ❌ Indexer no cap 07 não vê os blobs

Causa típica: você uploadeou em pasta dentro do container (ex: `kb-source/pdfs/manual.pdf` em vez de `kb-source/manual.pdf`). Indexer default lê só a raiz. Solução: mova ou re-upload na raiz do container.

---

## 8. Próximo passo

8 PDFs subidos em `kb-source`, validados via Portal + Cloud Shell + URL pública?

→ **Avance para [Capítulo 05 — Provisionar Document Intelligence](./05-document-intelligence.md)**

> Capítulo 05 cria o recurso Document Intelligence S0, captura endpoint + key, e faz um smoke test contra o `prebuilt-layout` model com 1 dos PDFs uploadeados aqui.
