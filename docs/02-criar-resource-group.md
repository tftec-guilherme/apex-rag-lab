# Capítulo 02 — Criar o Resource Group

> **Objetivo:** criar o contêiner lógico que vai abrigar Storage, Document Intelligence e AI Search com naming convention, region e tags consistentes — para que `Cost Management` e `Resource Graph` consigam rastrear o lab inteiro com 1 filtro.

> **Tempo:** 5 minutos · **Custo:** R$ 0 (Resource Groups são grátis)

---

## 1. Por que começar pelo Resource Group?

No Azure, todo recurso vive **dentro de um Resource Group (RG)**. Tratar o RG como "primeira coisa" tem 4 vantagens práticas:

1. **Cleanup atômico:** ao final do lab, deletar o RG remove TUDO em uma operação (sem deixar recurso órfão cobrando)
2. **Custo isolado:** `Cost Management` filtrado por RG mostra exatamente o que este lab gastou
3. **RBAC focado:** se você quiser conceder acesso só a este lab para um colega, basta um `Reader` no RG
4. **Tags em cascata:** tags aplicadas no RG **NÃO** descem automaticamente, mas o RG fica como ponto de auditoria pra confirmar coerência depois

> **Anti-padrão comum:** criar Storage Account "primeiro" pra "ver no que dá" — depois você nunca consegue limpar 100%, e sempre fica algum recurso solto cobrando R$ 7/dia.

---

## 2. Naming convention deste lab

| Resource Group | Região | Convenção |
|---|---|---|
| `rg-apex-rag-lab-{aluno}` | `East US 2` | `<tipo>-<projeto>-<feature>-<owner>` |

Exemplo concreto (substitua `{aluno}` pelo seu identificador escolhido no cap 01 §5):

- `rg-apex-rag-lab-gpc`
- `rg-apex-rag-lab-joaosilva`
- `rg-apex-rag-lab-mariaa`

> **Regra de naming Azure:** RG aceita 1-90 caracteres, alfanumérico + hifens + underscores + parênteses. Não use espaço, ponto, ou acento.

---

## 3. Passo a passo via Portal

### 3.1 Abrir a aba Resource groups

1. Acesse [portal.azure.com](https://portal.azure.com)
2. Confirme no canto superior direito que você está no tenant correto (avatar do usuário)
3. Confirme no filtro de subscription do topo que a subscription correta está selecionada
4. No menu lateral esquerdo (☰ ícone hambúrguer), clique em **Resource groups**
5. Se você não vê **Resource groups** no menu, busque pelo nome no campo de busca do topo do Portal: `Resource groups`

📸 *Screenshot: Portal Azure com menu Resource groups em destaque (será adicionado em sessão de captura)*

### 3.2 Clicar em "+ Create"

No topo da lista de Resource groups, clique no botão **+ Create**.

📸 *Screenshot: botão Create destacado*

### 3.3 Preencher a aba "Basics"

| Campo | Valor | Por quê |
|---|---|---|
| **Subscription** | (a subscription validada no cap 01) | Confirme se for múltiplas |
| **Resource group** | `rg-apex-rag-lab-{aluno}` | Naming convention deste lab |
| **Region** | `East US 2` | Região com Doc Intelligence S0 + AI Search Basic disponíveis |

> ⚠️ **Atenção:** a região do RG é "região de metadados", **não** define onde os recursos dentro dele moram. Mas vamos manter coerência: tudo neste lab fica em `East US 2`.

### 3.4 Aba "Tags"

Clique em **Next: Tags >** (não em Review + create direto).

Adicione **3 tags** que vão se propagar manualmente aos recursos nos próximos capítulos:

| Name | Value |
|---|---|
| `course` | `D06-IA-Automacao-Azure` |
| `lab` | `intermediario` |
| `student` | `{aluno}` |

> **Por que 3 tags e não 1?** Isso permite filtros de Cost Management como "todos os recursos da pós-graduação", "todos os labs intermediários da turma X", "tudo do aluno Y". Cada tag responde a uma pergunta de negócio diferente.

📸 *Screenshot: aba Tags com 3 entradas preenchidas*

### 3.5 Aba "Review + create"

Clique em **Next: Review + create >**.

Aguarde a validação (canto superior esquerdo deve mostrar ✅ **Validation passed** em ~2 segundos).

Clique em **Create**.

> **Tempo de provisionamento:** RG é metadado puro — provisiona em ~3-5 segundos. Se demorar >30s, atualize a página de Resource groups.

---

## 4. Validação

### 4.1 Via Portal

1. Volte para a aba **Resource groups** (use o breadcrumb superior ou o menu lateral)
2. Você deve ver `rg-apex-rag-lab-{aluno}` na lista, status **Succeeded**
3. Clique no nome do RG para abrir o overview
4. Em **Tags** (no painel esquerdo), confirme que as 3 tags estão presentes

### 4.2 Via Cloud Shell (opcional)

Cole no Cloud Shell:

```bash
RG_NAME="rg-apex-rag-lab-gpc"  # substitua gpc pelo seu {aluno}

# Confirmar criação
az group show --name "$RG_NAME" --query "{name:name, location:location, state:properties.provisioningState, tags:tags}" --output yaml
```

**Saída esperada:**

```yaml
location: eastus2
name: rg-apex-rag-lab-gpc
state: Succeeded
tags:
  course: D06-IA-Automacao-Azure
  lab: intermediario
  student: gpc
```

---

## 5. O que NÃO faz neste capítulo

- ❌ **Não conceder permissões adicionais** — você já é Owner; não há outros usuários acessando
- ❌ **Não habilitar policies / locks** — em produção sim, mas pra lab descartável fica overhead
- ❌ **Não criar deployment lock** — vamos deletar isso no cap 10, lock atrapalha
- ❌ **Não criar Resource Group secondary "para temporários"** — todos os recursos deste lab cabem em um RG só

---

## 6. Troubleshooting comum

### ❌ "The subscription is not registered to use namespace 'Microsoft.Resources'"

Subscription nova nunca usada antes. No Cloud Shell:

```bash
az provider register --namespace Microsoft.Resources
az provider register --namespace Microsoft.CognitiveServices
az provider register --namespace Microsoft.Search
az provider register --namespace Microsoft.Storage
```

Aguarde ~2 minutos e tente criar o RG de novo.

### ❌ "Resource group name 'rg-apex-rag-lab-{aluno}' is invalid"

Você deixou `{aluno}` literal sem substituir, OU usou espaço/acento/ponto. Use só letras minúsculas + hífen + números.

### ❌ "Subscription does not have access to location 'eastus2'"

Subscription tem políticas de location restritas. Tente `westus3` (segunda opção do cap 01 §2.3) e siga o resto do lab usando essa região.

---

## 7. Próximo passo

Resource Group criado, validado, com tags corretas?

→ **Avance para [Capítulo 03 — Storage Account + container Blob](./03-storage-account-blob.md)**

> Capítulo 03 cria o Storage Account onde os 8 PDFs serão hospedados, com configuração de soft-delete e access tier otimizada para lab descartável.
