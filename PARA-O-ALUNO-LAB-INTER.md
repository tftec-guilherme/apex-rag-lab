# PARA-O-ALUNO — apex-rag-lab

> Bem-vindo. Este é o **entrypoint pedagógico** do Lab Intermediário (RAG production-grade) da Disciplina 06. Vai te guiar pelo Portal Azure passo-a-passo construindo um pipeline RAG sobre 3 PDFs públicos da Microsoft Learn que sugere resposta em <2s para tickets do HelpSphere.
>
> `version-anchor: Q2-2026` · `status: v0.2.0 ATIVO Wave 4`

---

## ⏱️ Orçamento de tempo + dinheiro

| Item | Valor |
|------|-------|
| Tempo total do lab | **~8 horas** (1 sessão dedicada — não tente espalhar) |
| Custo provisionar e deletar no mesmo dia | **R$ 21-29** saindo do bolso |
| Custo esquecer ligado 1 mês | R$ 280-320 (AI Search Standard S1 dói: R$ 8,30/dia) |
| Free Trial USD 200 funciona? | ❌ **NÃO** — Azure OpenAI exige Pay-As-You-Go |

**Regra de ouro inegociável:** ao terminar a sessão, rode:

```bash
az group delete --name rg-lab-intermediario --yes --no-wait
```

Lembrar uma semana depois custa R$ 50+. Lembrar um mês depois custa R$ 250+.

---

## ✅ Pré-requisitos checklist (5 min)

Antes de começar, confirme em ordem:

- [ ] Subscription Azure **Pay-As-You-Go** (Free Trial não serve para este lab)
- [ ] Cartão de crédito internacional vinculado e ativo
- [ ] **Bloco 2 da Disciplina 06 já executado** — RG `rg-helpsphere-ia` existe na sua subscription com Foundry Hub `aifhub-apex-prod` + Project base `aifproj-helpsphere-base`
- [ ] Quota Azure OpenAI aprovada na sua region (≥30K TPM em `text-embedding-3-large` e `gpt-4.1-mini`) — peça via support request **1-3 dias antes** (Pré-aula 0 cobre isso)
- [ ] Azure CLI 2.x instalado (`az --version`)
- [ ] Azure Developer CLI instalado (`azd version`)
- [ ] VS Code com extensão Azure Functions
- [ ] Python 3.11+ (`python --version`)
- [ ] Postman, Insomnia ou similar (testes REST da Function App)
- [ ] Você é Owner ou (Contributor + User Access Administrator) no escopo da subscription
- [ ] **3 PDFs sample baixados** localmente (~3MB) — ver [`sample-kb/README.md`](./sample-kb/README.md)

Se algum item está vermelho, pare aqui — execute primeiro a Pré-aula 0 + Bloco 2.

---

## 🚀 Quick Start (depois dos pré-requisitos)

1. Clone este repo: `git clone https://github.com/tftec-guilherme/apex-rag-lab.git && cd apex-rag-lab`
2. Baixe os 3 PDFs sample seguindo [`sample-kb/README.md`](./sample-kb/README.md)
3. Abra [`docs/00-guia-completo.md`](./docs/00-guia-completo.md) (guia integral) **OU** navegue por parte em [`docs/parte-01.md`](./docs/parte-01.md) → [`parte-09.md`](./docs/parte-09.md)
4. Em cada passo Python, copie do [`snippets/`](./snippets/) — não digite do zero (zero ambiguidade, evita typos)
5. Conforme avança, atualize as env vars que cada script consome (anote endpoints + keys quando o Portal te der)
6. Ao final, **rode o cleanup** (`az group delete --name rg-lab-intermediario --yes --no-wait`)

---

## 🔧 Workflow Parte 8 (clone único)

A Parte 8 do guia segue um workflow simplificado: **um único `git clone` deste repo (`apex-rag-lab`)** + edição de ~19 marcadores `[CRIAR-X]` em 4 arquivos críticos + `azd up` reaproveitando o RG do Bloco 2.

```bash
# 1. Clone único do fork-funcional canônico
git clone https://github.com/<seu-fork>/apex-rag-lab.git
cd apex-rag-lab

# 2. Edita 4 arquivos críticos (siga as instruções dos Passos 8.3-8.5 do guia)
#    - app/backend/blueprints/rag_chat.py        (5 markers)
#    - app/frontend/src/components/ChatPanel/ChatPanel.tsx  (7 markers)
#    - app/frontend/src/Shell.tsx                (4 markers)
#    - app/frontend/src/authConfig.ts            (3 markers)

# 3. Apontar para a Function App de RAG da Parte 7
azd env set RAG_FUNCTION_URL "<URL-da-Parte-7>"
azd env set RAG_FUNCTION_KEY "<key-da-Parte-7>"
azd env set RAG_ENABLED true
azd env set ENABLE_CHAT true

# 4. Deploy completo (reaproveita RG do Bloco 2)
azd up

# 5. Validar 4 hosts no Portal + smoke teste em ?chat=1
```

**Por que clone único?** Esta disciplina é de IA, não DevOps. Workflows com fork separado de `apex-helpsphere`, branches `feature/`, PR pra main, sync upstream — atrapalham o foco em Azure AI services. O `apex-rag-lab` é o fork-funcional canônico que já contém o template `apex-helpsphere` completo + Function App de RAG + os 15 arquivos do plug.

**Por que `azd up` reaproveita o RG?** O `azd env` deste fork já está apontado para o RG `rg-helpsphere-{env}` provisionado no Bloco 2. O `azd up` faz upgrade in-place dos recursos (Bicep deltas) sem criar RG novo. Custo zero adicional além dos R$ 21-29 do RG já provisionado.

---

## ⚠️ 7 surpresas pedagógicas (gotchas reais do lab)

### #1 — Free Trial não funciona

Azure OpenAI exige PAYG. Tentar provisionar com Free Trial dá `BadRequest: Subscription does not have access to this product` na criação do deployment. Solução: converter para PAYG **antes** da Parte 6.

### #2 — Quota OpenAI é por region, não por subscription

Sua subscription pode ter 240K TPM em "East US" mas 0 TPM em "Brazil South". Cada region tem cota separada. Peça explicitamente para a region onde você vai criar o deployment (recomendo East US 2 — maior disponibilidade).

### #3 — Vector dimension mismatch (Parte 5)

`text-embedding-3-large` retorna vetores de **3072 dimensões**. Se você criar o índice AI Search com `dimensions=1536` (default antigo de `ada-002`), o `index_to_search.py` falha com `400 Bad Request: dimension mismatch`. Fixe `dimensions=3072` no schema do índice.

### #4 — Foundry Hub é pré-existente, Project é novo

A Parte 6 espera que `aifhub-apex-prod` JÁ EXISTA (criado no Bloco 2 dentro do `rg-helpsphere-ia`). Você só cria o **Project** novo `aifproj-helpsphere-rag` dentro do Hub. Se tentar criar Hub novo, terá custo duplicado e quebra do contrato pedagógico.

### #5 — RBAC propaga lentamente

Após `az role assignment create`, espere 30-60s antes de testar. Se rodar o script Python imediatamente, recebe `403 Forbidden` mesmo com a role atribuída.

### #6 — AI Search Standard S1 é caro se esquecer ligado

R$ 250/mês (R$ 8,30/dia). Se esquecer ligado o fim de semana, são R$ 16. Se esquecer um mês, são R$ 250. Por isso a regra de ouro é deletar o RG inteiro ao final.

### #7 — Parte 8 reaproveita o template completo (sem fork separado)

Anteriormente a Parte 8 dependia do template `apex-helpsphere` ter PR #20 mergeado em main (com env vars `RAG_ENABLED`, endpoint `/chat/rag`, ChatPanel React). Esse PR foi **revertido** em 2026-05-08 — o `apex-helpsphere/main` não tem mais código RAG.

A nova realidade: **o `apex-rag-lab` é fork-funcional único** que contém TUDO (template `apex-helpsphere` espelhado + Function App de RAG da Parte 7 + 15 arquivos do plug com `[CRIAR-X]` markers nos 4 arquivos críticos). Você faz UM clone deste repo, edita ~19 linhas marcadas, e roda `azd up`. Sem fork separado de `apex-helpsphere`, sem branches, sem PRs.

---

## 📞 Suporte

- **Issues técnicos:** https://github.com/tftec-guilherme/apex-rag-lab/issues
- **Erros catalogados:** [`docs/troubleshooting.md`](./docs/troubleshooting.md) — RBAC 403, dimension mismatch, rate limit 429, OCR baixa qualidade, Translator detect falso, etc.
- **Prof Guilherme Campos** (Coordenador da Disciplina) — disponível via TFTEC

---

## 🔗 Repos companion da Disciplina 06

| Lab | Companion público | Foco |
|-----|-------------------|------|
| Inter (RAG) | **este repo** | Pipeline RAG passo-a-passo Portal-first |
| Final (Agente) | [`apex-helpsphere-agente-lab`](https://github.com/tftec-guilherme/apex-helpsphere-agente-lab) | Foundry Agent SDK + n8n + MCP server |
| Avançado (Prod) | [`apex-helpsphere-prod-lab`](https://github.com/tftec-guilherme/apex-helpsphere-prod-lab) | Production pipeline (CI/CD + APIM + observability) |

E o SaaS host comum aos 3 labs: [`apex-helpsphere`](https://github.com/tftec-guilherme/apex-helpsphere)
