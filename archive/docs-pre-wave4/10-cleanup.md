# Capítulo 10 — Cleanup obrigatório

> ⚠️ **NÃO PULE ESTE CAPÍTULO.** AI Search Basic cobra ~R$ 7/dia (~R$ 210/mês) ENQUANTO o serviço existir, mesmo idle. Esquecer ligado 1 mês = R$ 210 de surpresa na fatura. Cleanup completo são 3 minutos.

> **Tempo:** 3 minutos · **Custo evitado:** R$ 210/mês

---

## 1. O que vamos deletar

Tudo que criamos nos caps 02-06:

| Recurso | Custo enquanto ligado |
|---|---|
| Resource Group `rg-apex-rag-lab-{aluno}` | (contêiner — grátis) |
| Storage Account `stapexraglab{aluno}` | ~R$ 0,01/dia |
| Document Intelligence `cog-docint-apex-{aluno}` | grátis (free tier) ou ~R$ 0,03/page processada |
| AI Search `srch-apex-rag-lab-{aluno}` | **~R$ 7/dia** ⚠️ |

**Total cobrança em background se esquecer:** ~R$ 7-8/dia.

---

## 2. Caminho rápido — deletar o RG inteiro (RECOMENDADO)

Como tudo está em `rg-apex-rag-lab-{aluno}`, deletar o RG remove **todos os 4 recursos** atomicamente.

### 2.1 Via Portal

1. Portal Azure → **Resource groups**
2. Clique em `rg-apex-rag-lab-{aluno}`
3. Topo do RG: **Delete resource group**
4. Painel direito abre pedindo confirmação
5. **Type the resource group name to confirm**: digite `rg-apex-rag-lab-gpc` (ou seu nome real)
6. Clique em **Delete**

📸 *Screenshot: confirmação de delete do RG*

⏳ **Tempo:** 30-60 segundos.

### 2.2 Via Cloud Shell (alternativa)

```bash
RG_NAME="rg-apex-rag-lab-gpc"  # seu nome

az group delete \
  --name "$RG_NAME" \
  --yes \
  --no-wait
```

> **`--no-wait`** retorna imediatamente. O delete continua em background. Verifique conclusão depois com `az group exists --name $RG_NAME` (deve retornar `false`).

---

## 3. Validar que sumiu

### 3.1 Portal

Volte para **Resource groups**. `rg-apex-rag-lab-{aluno}` não deve aparecer mais.

### 3.2 Cloud Shell

```bash
az group exists --name "$RG_NAME"
```

Saída esperada: `false`.

### 3.3 Confirmar Cost Management ZERO

```bash
az consumption usage list \
  --start-date $(date -d '1 day ago' '+%Y-%m-%d') \
  --end-date $(date '+%Y-%m-%d') \
  --query "[?contains(instanceId, 'apex-rag-lab')].[instanceName, pretaxCost]" \
  --output table
```

Deve retornar lista vazia ou pequenos resíduos do dia. Confira de novo amanhã: Cost Management → Filtro `Tag: lab=intermediario` deve mostrar custo congelado.

---

## 4. Soft-delete e cuidados especiais

### 4.1 Document Intelligence — soft-delete 90 dias

Recursos Cognitive Services entram em **soft-deleted state** por 90 dias após delete. Durante esse tempo:

- ✅ **Custo zero** — você não é cobrado pelo soft-deleted
- ❌ **Nome ocupado** — você não pode criar `cog-docint-apex-{aluno}` de novo até purga ou restore

Se quiser purgar imediatamente (libera o nome):

```bash
DOCINT_NAME="cog-docint-apex-gpc"

az cognitiveservices account purge \
  --name "$DOCINT_NAME" \
  --resource-group "$RG_NAME" \
  --location eastus2
```

> ⚠️ **Em lab, isso geralmente não é necessário.** Use só se quiser re-rodar o lab com o mesmo nome em <90 dias.

### 4.2 Storage Account — sem soft-delete (se desabilitou no cap 03)

Você desabilitou soft-delete no cap 03 §3.5. Storage some imediatamente. Sem cuidado adicional.

### 4.3 AI Search — sem soft-delete

AI Search não tem soft-delete. Some imediatamente. Sem cuidado adicional.

---

## 5. Cleanup de `secrets.txt` local

Lembra do arquivo onde você guardou keys ao longo do lab? Hora de apagar:

```bash
# Linux/macOS/WSL
shred -u secrets.txt

# Windows (PowerShell)
Remove-Item -Path .\secrets.txt -Force
```

> **Por que `shred`/`Remove-Item -Force`?** Garantia que não fica resquício recuperável em disco. Keys são credenciais — tratam-se com paranoia.

---

## 6. Checklist final

- [ ] Resource Group `rg-apex-rag-lab-{aluno}` deletado
- [ ] `az group exists` retorna `false`
- [ ] Cost Management mostra cobrança congelada
- [ ] (Opcional) Document Intelligence purgado se quiser reuse imediato do nome
- [ ] `secrets.txt` apagado do disco local

---

## 7. O que você aprendeu neste lab

Reflexão pedagógica final — você percorreu **todo o pipeline RAG canônico** em ~2 horas:

| # | Estágio | Capítulo | Tecnologia |
|---|---|---|---|
| 1 | Ingestão | 04 | Storage Account + Blob upload |
| 2 | Layout extraction | 05, 07 | Document Intelligence `prebuilt-layout` |
| 3 | Chunking | 07 | SplitSkill com layout-aware |
| 4 | Indexação | 07 | AI Search Indexer + indexProjections |
| 5 | Retrieve | 08, 09 | BM25 + filter + analyzer pt-Lucene |
| 6 | Re-rank | 08, 09 | Semantic ranker |
| 7 | Augmented prompt | 09 | Backend integration via REST |

**O que NÃO fizemos** (escopo do Lab Avançado):

- ❌ Embeddings vetoriais (text-embedding-3-large) e hybrid search
- ❌ Azure OpenAI integration full (chat completion)
- ❌ Multi-tenant filtering
- ❌ Content Safety / prompt shields
- ❌ APIM gateway com rate limiting
- ❌ Application Insights instrumentation completa
- ❌ Bicep automation (companion `lab-inter-bicep/` no [`azure-retail`](https://github.com/tftec-guilherme/azure-retail))

Você está pronto para o **Lab Avançado** (`Lab_Avancado_IA_Producao_Guia_Portal.md` no `azure-retail`).

---

## 8. Re-rodando o lab no futuro

Se quiser repetir o exercício (revisão pré-prova, re-deploy em conta limpa):

1. Confirme que os 8 PDFs ainda estão em `sample-kb/source/` no clone do repo (`git pull` se necessário)
2. Refaça caps 02-09 (~2h)
3. Cap 10 cleanup obrigatório

A política de revisão anual (do README) verifica:
- Portal screenshots ainda válidos?
- `prebuilt-layout` ainda recomendado?
- Pricing AI Search Basic mudou?
- Bicep harness em `lab-inter-bicep/` ainda passa em CI?

---

## 9. Encerramento

Parabéns por completar o **Lab Intermediário da Disciplina 06**. Compartilhe seu fork com link do `kb-apex-index` rodando **enquanto estiver ativo** — bom material pra portfólio.

Voltando pro deck D06: você está agora pronto pra entrar no **Bloco 4 (Agentes + MCP)** do material. Lab Final adiciona Foundry agents + canal de voz Speech sobre essa mesma base RAG.

> **Bom lab.**
> — equipe TFTEC + Apex Group
