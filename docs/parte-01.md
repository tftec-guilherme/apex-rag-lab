# Parte 1 — Provisionar fundação (30min)

> Cria o Resource Group, Storage Account com containers, faz upload dos 3 PDFs sample, valida Managed Identity e atribui RBAC.

📘 **Conteúdo completo:** [`00-guia-completo.md` — seção "Parte 1"](./00-guia-completo.md#parte-1--provisionar-funda%C3%A7%C3%A3o-30min)

## Passos

1. **Login e contexto Azure** (`az login` → `az account set`)
2. **Criar Resource Group** `rg-lab-intermediario`
3. **Criar Storage Account** `stlabinter{rand}` com containers `kb/` e `eval/`
4. **Upload dos 3 PDFs Microsoft Learn** ([baixe primeiro](../sample-kb/README.md))
5. **Validar Managed Identity** (já criado no Bloco 2)
6. **Atribuir RBAC** do Managed Identity ao Storage

## Pré-requisitos

- ✅ Bloco 2 concluído (`rg-helpsphere-ia` + Foundry Hub `aifhub-apex-prod`)
- ✅ Subscription PAYG · Azure CLI 2.x · 3 PDFs sample baixados em `~/Downloads/sample-kb/`

## ✅ Checkpoint Parte 1

- [ ] RG `rg-lab-intermediario` existe
- [ ] Storage com containers `kb/` (3 PDFs) e `eval/` (vazio)
- [ ] Managed Identity `mi-helpsphere-ia` (do Bloco 2) com role `Storage Blob Data Contributor` no novo Storage

➡️ **Próximo:** [Parte 2 — Document Intelligence](./parte-02.md)
