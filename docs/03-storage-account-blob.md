# Capítulo 03 — Storage Account + container Blob

> **Objetivo:** criar o Storage Account `Standard LRS` com um container Blob público-leitura chamado `kb-source` que vai hospedar os 8 PDFs corporativos. Indexer do AI Search vai puxar os blobs daqui no capítulo 07.

> **Tempo:** 8 minutos · **Custo:** ~R$ 0,01/dia (irrelevante)

---

## 1. Por que Standard LRS e não outro tier?

| Tier | Preço relativo | Quando usar |
|---|---|---|
| **Standard LRS** ⭐ deste lab | 1x (baseline) | Lab descartável, 1 região, dados não-críticos |
| Standard ZRS | 1.25x | Produção em 1 região com tolerância a falha de zona |
| Standard GRS | 2x | Produção multi-região, DR cross-region |
| Premium SSD (Block Blob) | 4-5x | Latência sub-10ms (não é o caso aqui) |

> **Decisão pedagógica:** LRS economiza custo + tempo de provisionamento (~30s mais rápido que GRS), e perda de dados não tem impacto (lab descartável + PDFs estão no repo GitHub).

---

## 2. Por que **Cool** access tier?

Os 8 PDFs vão ser:
- Lidos pelo Indexer **uma única vez** (cap 07)
- Re-lidos só se você re-rodar o indexer manualmente
- Apagados no cap 10

Para esse padrão, **Cool** é mais barato que **Hot**:

| Access Tier | Storage cost | Read cost | Quando usar |
|---|---|---|---|
| Hot | $0,021/GB-mês | $0,004/10k transactions | Acesso frequente (>1x/dia) |
| **Cool** ⭐ | $0,011/GB-mês | $0,01/10k transactions | Acesso ocasional (<1x/mês) |
| Cold | $0,0036/GB-mês | $0,03/10k transactions | Backup raro |
| Archive | $0,002/GB-mês | $0,022/10k transactions + retrieval delay | Compliance long-term |

Para 25 MB de PDFs em 2 dias de lab, o custo absoluto é negligível (centavos), mas **Cool é o "default mental" certo** para arquivos de conhecimento.

---

## 3. Passo a passo via Portal

### 3.1 Abrir o RG e clicar em "+ Create"

1. Abra o Resource Group `rg-apex-rag-lab-{aluno}` criado no cap 02
2. No topo, clique em **+ Create**
3. Na barra de busca do Marketplace, digite `Storage account`
4. Clique no card **Storage account** (Microsoft, ícone azul de balde)
5. Clique em **Create**

📸 *Screenshot: Marketplace com Storage account selecionado*

### 3.2 Aba "Basics"

| Campo | Valor | Por quê |
|---|---|---|
| **Subscription** | (a do cap 01) | herdada |
| **Resource group** | `rg-apex-rag-lab-{aluno}` | herdada do cap 02 |
| **Storage account name** | `stapexraglab{aluno}` | 3-24 chars, lowercase, único global |
| **Region** | `(US) East US 2` | mesma do RG |
| **Performance** | `Standard` | não precisamos Premium SSD |
| **Redundancy** | `Locally-redundant storage (LRS)` | tier mais barato (§1) |

> **Naming gotcha:** Storage Account name **não aceita hifens nem underscores nem maiúsculas**. Por isso `stapexraglabgpc` em vez de `st-apex-rag-lab-gpc`.

> **Nome único global:** se `stapexraglabgpc` já existe (alguém usou), o Portal mostra erro vermelho. Adicione 2-3 dígitos: `stapexraglabgpc01`.

### 3.3 Aba "Advanced"

Clique em **Next: Advanced >**.

Mude estes campos:

| Campo | Valor padrão | Mude para | Por quê |
|---|---|---|---|
| **Allow enabling anonymous access on individual containers** | ❌ desmarcado | ✅ marcado | vamos precisar pra Indexer ler sem credencial complexa neste lab |
| **Access tier (default)** | Hot | **Cool** | §2 |

Deixe os outros campos (Secure transfer required, TLS 1.2, etc.) com valores padrão.

> ⚠️ **Em produção real você NÃO marcaria "anonymous access"** — usaria Managed Identity com role `Storage Blob Data Reader` no Indexer. Para o **Lab Avançado** vamos refatorar para esse padrão; aqui mantemos simples para foco no RAG.

### 3.4 Aba "Networking"

Clique em **Next: Networking >**.

Mantenha tudo padrão (`Enable public access from all networks`). 

> **Em produção:** Private endpoint + VNet integration com AI Search. Esse é tópico do Lab Avançado.

### 3.5 Aba "Data protection"

Clique em **Next: Data protection >**.

Para reduzir custo do lab, **desmarque** os 4 toggles de soft-delete:

- ❌ Enable soft delete for blobs
- ❌ Enable soft delete for containers
- ❌ Enable soft delete for file shares
- ❌ Enable versioning for blobs

> **Por quê desmarcar:** soft-delete cobra storage por dados deletados durante o retention period. Para lab descartável é ruído de custo. Em produção: **deixe ativo**.

### 3.6 Aba "Encryption"

Clique em **Next: Encryption >** e mantenha tudo padrão (Microsoft-managed keys). Customer-managed keys (CMK) é cenário Lab Avançado.

### 3.7 Aba "Tags"

Replique as 3 tags do RG:

| Name | Value |
|---|---|
| `course` | `D06-IA-Automacao-Azure` |
| `lab` | `intermediario` |
| `student` | `{aluno}` |

> **Por que repetir tags?** Tags do RG **não descem em cascata** automaticamente para recursos filhos. Você precisa replicar manualmente (ou usar Azure Policy + initiative — fora do escopo deste lab).

### 3.8 Aba "Review"

Clique em **Next: Review >**.

Aguarde validação (~2-5 segundos). Clique em **Create**.

⏳ **Tempo de provisionamento:** ~30-60 segundos.

---

## 4. Criar o container `kb-source`

### 4.1 Abrir o Storage Account criado

Após o deploy completar, clique em **Go to resource** (ou navegue: Resource Group → `stapexraglab{aluno}`).

### 4.2 Navegar para Containers

No menu lateral esquerdo do Storage Account:
- **Data storage** → **Containers**

### 4.3 Criar novo container

1. Clique em **+ Container** (topo da lista)
2. Painel direito abre

| Campo | Valor |
|---|---|
| **Name** | `kb-source` |
| **Anonymous access level** | `Blob (anonymous read access for blobs only)` |

> **"Blob" vs "Container":**
> - **Blob:** anyone com URL do blob específico consegue ler. **Não** consegue listar todos os blobs do container.
> - **Container:** anyone consegue listar + ler todos os blobs.
>
> Para nosso lab, "Blob" é suficiente — o Indexer recebe a connection string e lista por API key, não anônimo.

3. Clique em **Create**

📸 *Screenshot: container kb-source criado, level Blob*

---

## 5. Validação

### 5.1 Via Portal

1. Em **Containers**, você deve ver `kb-source` listado
2. Clique no container — deve abrir vazio (zero blobs ainda)
3. Volte para overview do Storage Account: **Diagnose and solve problems** deve mostrar status saudável

### 5.2 Via Cloud Shell

```bash
RG_NAME="rg-apex-rag-lab-gpc"
SA_NAME="stapexraglabgpc"

# Confirmar Storage Account
az storage account show --name "$SA_NAME" --resource-group "$RG_NAME" --query "{name:name, sku:sku.name, accessTier:accessTier, location:location}" --output yaml

# Listar containers (precisa --auth-mode login se você é o owner)
az storage container list --account-name "$SA_NAME" --auth-mode login --query "[].{name:name, publicAccess:properties.publicAccess}" --output table
```

**Saída esperada:**

```yaml
accessTier: Cool
location: eastus2
name: stapexraglabgpc
sku: Standard_LRS
```

```
Name       PublicAccess
---------  --------------
kb-source  blob
```

### 5.3 Capturar a connection string (para o cap 07)

Você vai precisar da connection string no capítulo 07 (configuração do Indexer). **Capture agora e cole num lugar seguro:**

Portal:
- Storage Account → **Security + networking** → **Access keys**
- Clique em **Show** ao lado de `key1` → **Connection string**
- Cole em um arquivo local `secrets.txt` (não commite no git!)

Cloud Shell:
```bash
az storage account show-connection-string --name "$SA_NAME" --resource-group "$RG_NAME" --output tsv
```

> ⚠️ **Tratamento da connection string:** ela contém uma chave que dá acesso TOTAL ao Storage Account (read + write + delete). Não compartilhe, não commite, não cole em chat público. No cap 10 vamos rotacionar a chave ao deletar o RG (automático).

---

## 6. Troubleshooting comum

### ❌ "The storage account name 'stapexraglab{aluno}' is already taken"

Esse nome é único globalmente em todo o Azure. Adicione um sufixo numérico (`stapexraglabgpc01`).

### ❌ "Anonymous access not allowed at storage account level"

Você esqueceu de marcar **"Allow enabling anonymous access on individual containers"** na aba Advanced (§3.3). Solução: vá em Storage Account → **Configuration** → marque o toggle → Save → tente criar o container de novo.

### ❌ Não encontro a aba "Containers"

Você pode estar na aba antiga do Portal ou em um Storage Account v1 (legado). Confirme que criou Storage Account v2 (default no Portal moderno). Se for v1, delete e recrie.

### ❌ Cobrança apareceu logo após criar

Storage Account não cobra antes do primeiro byte armazenado. Se você ver R$ 1+ no primeiro dia, é provável que (a) há outro recurso cobrando ou (b) você está em região com pricing premium. Confirme no **Cost Management** filtrando por `lab=intermediario`.

---

## 7. Próximo passo

Storage Account `Standard LRS` em `Cool` tier criado, container `kb-source` com acesso `Blob`, connection string capturada?

→ **Avance para [Capítulo 04 — Upload dos 8 PDFs sample-kb](./04-upload-pdfs-sample-kb.md)**

> Capítulo 04 baixa os 8 PDFs da pasta [`sample-kb/`](../sample-kb/) deste repo e faz upload para o container `kb-source` (3 caminhos alternativos: drag-and-drop, AzCopy, Azure Storage Explorer).
