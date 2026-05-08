# Parte 9 — Medição (precision@5, latency, custo) + Cleanup (1h)

> Avalia o RAG com dataset de validação (precision@5, MRR, latency p50/p95) e roda o cleanup obrigatório.

📘 **Conteúdo completo:** [`00-guia-completo.md` — seção "Parte 9"](./00-guia-completo.md#parte-9--medi%C3%A7%C3%A3o-precision5-latency-custo--cleanup-1h)

## Passos

### Avaliação

1. **Dataset de avaliação** — 10 perguntas com gabaritos (chunks esperados no top-5)
2. **Script de avaliação** ([`snippets/eval_rag.py`](../snippets/eval_rag.py)) — calcula precision@5, MRR, latency p50/p95, custo por query
3. **Análise dos resultados** — interpretar metrics em contexto Apex (target: precision@5 ≥ 0.6, latency p95 < 2s, custo < R$ 0,05/query)

### Cleanup obrigatório

4. **Anotar custos** consumidos (Cost Management → últimas 24h, filtrar por RG)
5. **Delete RG** `rg-lab-intermediario` — remove TUDO de uma vez:

```bash
az group delete --name rg-lab-intermediario --yes --no-wait
```

6. **Confirmar** que `rg-lab-intermediario` sumiu (`az group list --query "[?name=='rg-lab-intermediario']"`)
7. **Manter** `rg-helpsphere-ia` (do Bloco 2) — outros 2 labs (Final + Avançado) também usam

## Pré-requisitos

- ✅ Partes 1-7 completas (Parte 8 opcional)

## Métricas-alvo

| Métrica | Target | Real medido |
|---------|--------|-------------|
| precision@5 | ≥ 0.6 | a anotar |
| MRR | ≥ 0.5 | a anotar |
| latency p50 | < 1.5s | a anotar |
| latency p95 | < 3s | a anotar |
| custo por query | < R$ 0,05 | a anotar |

## ⚠️ Cleanup é OBRIGATÓRIO

Se você esquecer de deletar o RG, AI Search Standard S1 cobra **R$ 8,30/dia, R$ 250/mês**. Não é opcional.

## ✅ Checkpoint Parte 9

- [ ] Eval script rodou e printou metrics
- [ ] Resultados anotados (mesmo que abaixo dos targets — útil para iterar futuramente)
- [ ] **`az group delete --name rg-lab-intermediario --yes --no-wait` executado**
- [ ] Confirmação que o RG sumiu

🎉 **Lab Intermediário concluído!**

➡️ **Próximo lab:** [Lab Final — Agente + Workflow](https://github.com/tftec-guilherme/apex-helpsphere-agente-lab) (Foundry Agent SDK + n8n + MCP server)
