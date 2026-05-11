# Outline — `runbook_sap_fi_integracao.pdf` (PDF #5 de 8)

> **Categoria:** TI · **Páginas-alvo:** 22 · **Tickets âncora alvo:** TKT-3, TKT-12, TKT-15 (+ `arquitetura-integracao`, `nfe-rejeicoes-comuns`)
>
> Outline cravado por @analyst (Atlas) — runbook técnico de integração SAP FI ↔ TOTVS Protheus ↔ Magento ↔ SEFAZ NF-e. Voz operacional Tier 1/2/3, jargão pesado, comandos shell/SQL/SAP T-codes embutidos. Destinado a Diego (Tier 1), Marina (Tier 2) e Bruno (CTO Tier 3).

---

## 🎯 Objetivo deste PDF

Runbook técnico **production-grade** que documenta a arquitetura de integração financeira/fiscal do Apex Group: o fluxo de pedido B2B desde o e-commerce Magento até o SAP FI passando por TOTVS Protheus, com NF-e SEFAZ-SP no caminho. Cobre:

- **Arquitetura lógica** dos 7 hops (Magento → Service Bus → Adapter → TOTVS → Bridge → SAP FI → SEFAZ).
- **Tecnologias do stack** (SAP FI 4.7 EHP8, TOTVS Protheus 12.1.33, RabbitMQ 3.11, Azure Service Bus Premium, Magento 2.4.6, SEFAZ NF-e 4.0).
- **Troubleshooting estruturado** das 3 falhas-âncora reais (TKT-3 Rejeição 539, TKT-12 sync ERP↔Magento 18%, TKT-15 Frota.io token webhook).
- **Monitoring + escalação** Tier 1 (Diego) → Tier 2 (Marina) → Tier 3 (Bruno CTO) → fornecedor SAP/TOTVS.

**Voz:** operacional, densa, sem hedging. Diego abre o runbook quando o ticket chega; Marina escala para reprocessamento manual; Bruno só entra em DR/failover.

---

## 📑 Estrutura sugerida (22 páginas)

### Página 1 — Capa + visão arquitetural (parte 1/2)

#### Header
- Identificador interno: **RBK-FIN-001 · runbook_sap_fi_integracao**
- Subtítulo: *Apex Group · Integração SAP FI ↔ TOTVS Protheus ↔ Magento ↔ SEFAZ NF-e*
- Versão: `v3.4 · Q2-2026 · próxima revisão Q3-2026`
- Owner: **Bruno (CTO)** · Reviewer: **Marina (Tier 2 Integração)** · Vigência contínua

#### 1.1 Escopo do runbook
- Aplicável às **5 marcas seed**: Apex Mercado, Apex Tech, Apex Moda, Apex Casa, Apex Logística.
- Cobre o **fluxo financeiro/fiscal**: pedido B2B → faturamento → NF-e → liquidação ERP → posting SAP FI.
- **Fora de escopo:** pedidos B2C cash-and-carry (caem direto no NFC-e POS — ver `manual_pos_funcionamento.pdf`), folha de pagamento (SAP HR), MM/SD puro.

#### 1.2 Diagrama lógico (descrição textual)
- Bloco 1: **Magento 2.4.6** (Azure VM Standard_D8s_v5, eastus2)
- Bloco 2: **Azure Service Bus Premium** (1 messaging unit, topic `pedidos-b2b`)
- Bloco 3: **Apex Integration Adapter** (.NET 8 Worker Service, AKS)
- Bloco 4: **TOTVS Protheus 12.1.33** (servidor on-prem Cajamar, MSSQL 2019)
- Bloco 5: **TOTVS-SAP Bridge** (RabbitMQ 3.11 cluster 3 nodes)
- Bloco 6: **SAP FI 4.7 EHP8** (servidor on-prem Cajamar, Oracle 19c)
- Bloco 7: **SEFAZ-SP NF-e 4.0** (webservice externo)

Fluxo de mensagem: 1→2→3→4→5→6→7→ack→6→5→4→3 (callback de status de NF-e volta atualizando o pedido).

---

### Página 2 — Visão arquitetural (parte 2/2)

#### 2.1 Padrões de mensageria
- **Padrão dominante:** Publish-Subscribe com filtro por `tenant_id` + `messageType`.
- **Idempotência:** chave de deduplicação = `pedido_id + sequence_number` (TTL 7 dias no Service Bus, 24h no RabbitMQ).
- **Ordering:** Sessions habilitadas no Service Bus por `tenant_id` (garante ordem cronológica por marca).
- **DLQ:** 3 retries com backoff exponencial (1s, 5s, 25s) antes de cair em Dead Letter.

#### 2.2 Contratos de payload
- **Pedido B2B:** JSON Schema `pedido-b2b-v3.json` (publicado em `apex-integration-schemas` no Azure Container Registry).
- **NF-e gerada:** XML padrão SEFAZ 4.00 com assinatura digital A1 (certificado emitido pela Certisign, válido até 2027-11-14).
- **Posting SAP FI:** IDoc `ACC_DOCUMENT03` via RFC chamada pelo TOTVS-SAP Bridge.

#### 2.3 Resiliência cross-component
- Circuit breaker no Adapter: 5 falhas consecutivas em 30s → open por 60s → half-open com 1 probe.
- Saga compensatória: se NF-e falha após posting no SAP FI, dispara `FB08` (estorno) automático.
- Outbox pattern no Magento (tabela `apex_outbox_orders`) — garante que pedido nunca é perdido entre commit do checkout e publicação no Service Bus.

---

### Página 3 — Tecnologias envolvidas (parte 1/2)

Tabela detalhada com versão, owner, ambiente, suporte:

| Componente | Versão | Hosting | Owner | Suporte |
|---|---|---|---|---|
| SAP FI | 4.7 EHP8 SP18 | On-prem Cajamar (Oracle 19c) | Marina | Fornecedor SAP (contrato SuperCare) |
| TOTVS Protheus | 12.1.33 build 7.00.231003 | On-prem Cajamar (MSSQL 2019 STD) | Marina | Fornecedor TOTVS (TOTVS Mais) |
| Magento Commerce | 2.4.6-p4 | Azure VM Standard_D8s_v5 | Diego (operação) | Adobe + parceiro Vtex Implementer |
| RabbitMQ | 3.11.18 (cluster 3 nodes) | Azure VMs Standard_E4s_v5 | Bruno | Open-source + Pivotal Tanzu (consultoria sob demanda) |
| Azure Service Bus | Premium · 1 MU | PaaS managed | Bruno | Microsoft (Premium Support) |

#### 3.1 SAP FI 4.7 EHP8 — pontos críticos
- Instância single-stack ABAP (sem Java Stack).
- Database Oracle 19c com Data Guard configurado para standby site (Tamboré).
- Backup full diário 03h00 (BR/MS_SAP_BACKUP runbook).
- Patch level: SP18 + 14 SAP Notes manuais aplicadas (lista em `/sap/notes-applied-q2-2026.txt`).

---

### Página 4 — Tecnologias envolvidas (parte 2/2)

#### 4.1 TOTVS Protheus 12.1.33
- 4 servidores AppServer (Cajamar): `protheus-app01..04.apex.local`.
- LibServer único: `protheus-lib.apex.local:7890`.
- DBAccess: `protheus-db.apex.local:7890` → MSSQL 2019 STD em cluster Always-On.
- Customizações Apex: 47 fontes ADVPL em `/totvs/customizacoes/apex/` (versionado em GitHub `apex-protheus-custom`).

#### 4.2 Magento 2.4.6
- PHP 8.2 + nginx + Elasticsearch 8.7 + Redis 7.0.
- Plugin de integração custom: `Apex_OrderSync` (Composer package `apex/order-sync`, v3.2.1).
- Publish para Service Bus via biblioteca `azure/azure-sdk-for-php` v1.16.

#### 4.3 RabbitMQ cluster
- 3 nodes em Availability Set Azure.
- Quorum queues habilitadas (replicação síncrona, RF=3).
- Management UI: `http://rabbitmq.apex.local:15672` (acesso restrito a Marina + Bruno).
- Plugins: `rabbitmq_management`, `rabbitmq_shovel`, `rabbitmq_federation`, `rabbitmq_prometheus`.

#### 4.4 Azure Service Bus Premium
- Namespace: `sb-apex-prod-eastus2.servicebus.windows.net`.
- 1 messaging unit (MU) — escalável até 16 sob demanda.
- Geo-replication: passive replica em westus3.
- TLS 1.2 mínimo, autenticação Managed Identity (sem SAS keys em produção desde Q4-2025).

---

### Página 5 — Fluxo de pedido B2B (7 hops com latência média)

Diagrama de sequência textual + tabela de latências p50/p95/p99 medidos em Q1-2026:

| Hop | Componente origem | Componente destino | Operação | p50 | p95 | p99 | SLO |
|---|---|---|---|---|---|---|---|
| 1 | Magento (checkout commit) | Outbox `apex_outbox_orders` | INSERT transacional | 12ms | 38ms | 110ms | <200ms |
| 2 | Outbox poller | Service Bus topic `pedidos-b2b` | Publish | 45ms | 140ms | 380ms | <500ms |
| 3 | Service Bus | Adapter (.NET 8 AKS pod) | Receive (PeekLock) | 80ms | 220ms | 510ms | <800ms |
| 4 | Adapter | TOTVS Protheus (REST `/api/pedidos`) | POST | 320ms | 890ms | 1.8s | <2s |
| 5 | TOTVS Protheus | RabbitMQ exchange `totvs.sap.posting` | Publish | 60ms | 180ms | 420ms | <500ms |
| 6 | RabbitMQ | SAP FI Bridge (Java SAP JCo) | Consume + RFC `BAPI_ACC_DOCUMENT_POST` | 1.2s | 3.4s | 7.1s | <8s |
| 7 | SAP FI Bridge | SEFAZ-SP NF-e webservice | POST `NfeAutorizacao4` | 2.8s | 6.7s | 14s | <30s (SEFAZ SLA) |

**Latência total p95 end-to-end:** ~12s. SLO interno: <20s para 99% dos pedidos.

#### Observabilidade do fluxo
- TraceId propagado via header `apex-trace-id` (W3C TraceContext compliant).
- Cada hop emite span no Azure Application Insights (workspace `appi-apex-prod`).
- Query KQL padrão de troubleshooting está documentada na Página 14.

---

### Página 6 — Tabela de filas RabbitMQ

Inventário completo das filas (vhost `/apex`) com regras de retention e DLQ:

| Fila | Tipo | Tamanho médio | Pico observado Q1 | Retention | DLQ | Owner |
|---|---|---|---|---|---|---|
| `totvs.sap.posting` | Quorum | 12 msgs | 4.700 (TKT-12) | 7 dias | `totvs.sap.posting.dlq` | Marina |
| `sap.fi.nfe.autorizacao` | Quorum | 8 msgs | 2.100 | 7 dias | `sap.fi.nfe.autorizacao.dlq` | Marina |
| `sap.fi.nfe.callback` | Classic | 3 msgs | 380 | 24h | `sap.fi.nfe.callback.dlq` | Marina |
| `magento.outbox.sync` | Quorum | 22 msgs | 8.900 | 7 dias | `magento.outbox.sync.dlq` | Diego |
| `frota.io.webhook.dispatch` | Classic | 1 msg | 240 (TKT-15) | 24h | `frota.io.webhook.dispatch.dlq` | Diego |
| `apex.audit.events` | Classic | 60 msgs | 12.000 | 30 dias | sem DLQ (best-effort) | Bruno |
| `apex.notification.email` | Classic | 18 msgs | 5.400 | 48h | `apex.notification.email.dlq` | Diego |
| `sped.fiscal.batch` | Quorum | 0 (batch mensal) | 47.000 (fechamento mês) | 90 dias | `sped.fiscal.batch.dlq` | Marina |

#### Política de DLQ
- Mensagens em DLQ por mais de **72h** disparam alerta P3 no Slack `#apex-integracao-alerts`.
- Reprocessamento: shovel manual via `rabbitmqctl shovel` ou via UI (Marina autorizada).

---

### Página 7 — Limites e thresholds críticos

Tabela única, ordenada por criticidade. Cada limite tem **referência de incidente** e **ação ao atingir 80% do limite**.

| Componente | Limite | Threshold alerta | Causa-raiz histórica | Ação Tier 1 |
|---|---|---|---|---|
| RabbitMQ payload | 256KB por mensagem | 200KB warning, 240KB crit | **TKT-12** — 18% pedidos rejeitados | Compactar payload (remover campos opcionais) + escalar Marina |
| SEFAZ NF-e timeout | 30s por POST | 25s warning | Webservice SEFAZ-SP lento Q1 (dia 14/01) | Aguardar 5min + retry manual; se persistir 15min escalar Marina |
| Service Bus message size | 1MB | 800KB warning | Nunca atingido | Investigar payload — provavelmente attachment indevido |
| SAP RFC concurrent calls | 50 por user `RFC_APEX` | 40 warning | Pico fechamento mensal (último dia útil) | Aumentar `LOGON_GROUP` ou esperar 10min |
| TOTVS AppServer connections | 800 por server (3.200 total) | 640 por server | TKT-18 BlackFriday 2025 (cross-ref `runbook_problemas_rede.pdf`) | Verificar `WSCONFIG` + balancear hosts |
| Magento Outbox lag | 60s | 30s warning, 120s crit | Job cron `apex:outbox:flush` parou | `php bin/magento queue:consumers:start apex.outbox.flush` |
| Frota.io webhook auth | Token JWT 24h TTL | 21h warning | **TKT-15** — token expirou sem renovação | Renovar via `curl POST /frota/auth/refresh` (procedimento P13) |
| Oracle 19c tablespace SAP | 85% (autoextend off) | 75% warning | Q4-2025 (`PSAPUNDO` 92%) | Marina executa `ALTER TABLESPACE ... ADD DATAFILE` |
| MSSQL TOTVS tempdb | 70GB (de 100GB) | 60GB warning | Reprocessamento massivo SPED | Restart `SQL Server` em janela (terça 03h-05h) |
| Application Insights ingestion | 50GB/dia | 40GB warning | Loop de log durante incidente | Throttle via sampling rate 50% |

---

### Página 8 — NF-e rejeições mais frequentes (top 10 SEFAZ-SP)

Tabela das rejeições reais que Diego/Marina vêem nas filas DLQ:

| Código | Descrição (SEFAZ Manual) | Frequência Q1-2026 | Causa-raiz típica Apex | Severidade |
|---|---|---|---|---|
| **539** | Duplicidade de NF-e ou CFOP incompatível com operação | **47%** | **TKT-3** — CFOP B2B (5102) usado em operação interestadual (correto seria 6102) | Alta |
| **240** | Duplicidade de NF (chave de acesso já autorizada) | 18% | Retry indevido após timeout SEFAZ (procedimento P9 cobre) | Média |
| **778** | Sigla da UF do emitente diverge da UF autorizadora | 9% | Cadastro Pessoa Jurídica desatualizado no TOTVS após mudança de filial | Média |
| **226** | Código da UF do emitente diverge da UF do remetente | 7% | Mesmo cenário que 778 (correlacionado) | Média |
| **694** | NCM informado inválido ou inexistente na tabela TIPI | 6% | Cadastro produto com NCM expirado (TIPI 2024.1 → 2025.1) | Baixa |
| **563** | Já existe pedido de cancelamento para a Nota Fiscal | 4% | Reprocessamento de pedido já cancelado por SAC | Baixa |
| **228** | Data de emissão atrasada superior a 30 dias | 3% | Mensagem retida em DLQ por mais de 30 dias (refazer pedido) | Média |
| **404** | Uso de prefixo `CDATA` em campo que não permite | 2% | Bug ADVPL custom em descrição de produto com `<` ou `&` | Baixa |
| **610** | Total da NF difere do somatório dos itens | 2% | Arredondamento incompatível Magento vs TOTVS (3ª casa decimal) | Média |
| **999** | Erro não catalogado SEFAZ (manutenção/ambiente) | 2% | Webservice SEFAZ em manutenção (consultar `https://www.nfe.fazenda.gov.br`) | Variável |

**Total cobertura:** 100% das rejeições Q1 caem em uma destas 10 categorias. Outliers são tratados ad-hoc por Marina.

---

### Página 9 — Procedimento P9: troubleshooting Rejeição 539 (parte 1/2)

**Contexto:** TKT-3 (Apex Mercado, restaurante CNPJ 12.345.678/0001-90, pedido B2B R$ 18.430). Cenário recorrente — 47% das rejeições.

#### P9.1 Identificação inicial (Diego, Tier 1)
1. Diego recebe ticket no HelpSphere com tag `nfe-rejeitada`.
2. Acessar Application Insights: query KQL abaixo retorna a NF-e e o erro SEFAZ.

```kusto
traces
| where timestamp > ago(2h)
| where customDimensions.apex_trace_id == "{trace-id-do-ticket}"
| where message contains "SEFAZ" or message contains "Rejeicao"
| project timestamp, message, customDimensions.cfop, customDimensions.pedido_id
| order by timestamp asc
```

3. Anotar **chave de acesso NF-e** (44 dígitos) + **CFOP usado** + **UF destino** do log.
4. Validar CFOP no manual interno (`https://wiki.apex.local/cfop-table` ou Anexo II Página 22).

#### P9.2 Diagnóstico do CFOP incorreto
- **Pedido intra-estadual SP→SP:** CFOP 5xxx (ex: 5102 venda mercadoria, 5403 substituição tributária).
- **Pedido interestadual SP→outra UF:** CFOP 6xxx (ex: 6102, 6403).
- **TKT-3 caso real:** sistema usou 5102 mas restaurante está em Campinas-SP comprando para filial em Rio Claro-RJ → deveria ser 6102.

#### P9.3 Verificação no TOTVS
Acessar TOTVS Protheus → módulo SIGAFAT → consultar pedido pelo número:

```
SmartClient.exe -e=Apex-Producao -P=8081
> SIGAFAT > Consultas > Pedido de Venda (MATA410)
> Pedido: 00045821 → F4 detalha → Aba "Notas Fiscais"
```

Confirmar que o **estado de destino** está correto. Se incorreto, **NÃO ALTERAR** — escalar para Marina.

---

### Página 10 — Procedimento P9: troubleshooting Rejeição 539 (parte 2/2)

#### P9.4 Resolução (Marina, Tier 2)
1. Estornar NF-e rejeitada no SAP FI:
   ```
   SAP GUI → tx FB08 → exercício: 2026 → empresa: AP01 → doc: {numero-doc} → enter → marcar "stornieren" → save
   ```
2. Cancelar pedido no TOTVS (não pode ficar "pending sync"):
   ```
   SIGAFAT → MATA410 → marcar pedido → F12 "cancelar" → motivo: "CFOP incompatível — refazer"
   ```
3. Recriar pedido com CFOP correto via TOTVS-SAP Bridge:
   - Publicar mensagem manual no RabbitMQ:
     ```bash
     rabbitmqadmin -V /apex publish \
       exchange=totvs.sap.posting \
       routing_key=pedido.criar \
       payload='{"pedido_id":"00045822","cfop":"6102","tenant_id":"11111111-...","cliente_cnpj":"12.345.678/0001-90","total":18430.00}'
     ```
4. Aguardar callback de NF-e autorizada na fila `sap.fi.nfe.callback` (~12s p95).
5. Atualizar ticket HelpSphere com a nova chave de acesso (44 dígitos).

#### P9.5 Prevenção (Bruno, decisão técnica)
- Validar regra na trigger TOTVS `MAT410GRV` (ADVPL custom `apex_validate_cfop.prw`).
- Adicionar teste unitário no pipeline CI do `apex-protheus-custom`.
- Cross-ref `arquitetura-integracao` — diagrama da regra fica em `docs/integracao/cfop-validation.md`.

#### P9.6 Métrica de sucesso
- **MTTR alvo:** 25min (Diego identifica + escala) + 15min (Marina executa) = **40min total**.
- **Q1-2026 MTTR real:** 38min (mediana, 22 incidentes).

---

### Página 11 — Procedimento P11: troubleshooting ERP↔Magento sync (parte 1/2 — TKT-12)

**Contexto TKT-12 (Apex Tech, CRÍTICO):** 18% pedidos travados em `pending sync` desde 03h00. Causa-raiz: RabbitMQ rejeitando payloads >256KB. Pedidos com muitas variações de produto (cores + tamanhos + voltagem) inflam o payload acima do limite.

#### P11.1 Detecção (Diego)
1. Alerta dispara no Slack `#apex-integracao-alerts` quando taxa de erro na fila `magento.outbox.sync` excede 5% por 10min.
2. Diego confirma sintoma:
   ```bash
   # Check % de mensagens em DLQ
   rabbitmqctl list_queues -p /apex name messages | grep -E "(magento\.outbox|dlq)"
   ```
3. Se DLQ tem >100 mensagens em <30min → **escalar Marina imediatamente**.

#### P11.2 Diagnóstico (Marina, Tier 2)
1. Acessar RabbitMQ Management UI: `http://rabbitmq.apex.local:15672` → fila `magento.outbox.sync.dlq` → "Get messages".
2. Inspecionar mensagem em DLQ:
   - **Headers:** `x-first-death-reason` → deve mostrar `expired` ou `rejected`.
   - **Payload size:** se >256KB confirma a hipótese TKT-12.
3. Query SQL no MSSQL TOTVS para listar pedidos travados:

```sql
SELECT pedido_id, tenant_id, total, item_count,
       DATALENGTH(payload_json) AS payload_bytes,
       created_at
FROM apex_integration.dbo.tbl_outbox_pending
WHERE status = 'pending_sync'
  AND created_at < DATEADD(MINUTE, -30, SYSUTCDATETIME())
ORDER BY payload_bytes DESC;
```

4. Se >50 pedidos com `payload_bytes > 200000` → **escalar Bruno (CTO Tier 3)** — pode ser necessário hotfix urgente no Adapter.

---

### Página 12 — Procedimento P11: troubleshooting ERP↔Magento sync (parte 2/2)

#### P11.3 Mitigação imediata (Marina)
1. **Aumentar temporariamente limite de payload no RabbitMQ:**
   ```bash
   # NÃO recomendado em produção sem aval Bruno; opção de último recurso
   rabbitmqctl set_policy -p /apex max-payload \
     "^magento\." '{"max-length-bytes":524288}' --apply-to queues
   ```
2. **Comprimir payload no Adapter (hotfix temporário):** ativar flag `APEX_ADAPTER_COMPRESS_PAYLOAD=true` no Deployment AKS:
   ```bash
   kubectl set env deployment/apex-integration-adapter \
     APEX_ADAPTER_COMPRESS_PAYLOAD=true \
     -n apex-prod
   kubectl rollout restart deployment/apex-integration-adapter -n apex-prod
   ```
3. **Reprocessar pedidos em DLQ:**
   ```bash
   # Shovel temporário DLQ → fila original (validar payload antes)
   rabbitmqctl set_parameter shovel reprocess-magento-outbox \
     '{"src-uri":"amqp://","src-queue":"magento.outbox.sync.dlq",
       "dest-uri":"amqp://","dest-queue":"magento.outbox.sync"}'
   ```

#### P11.4 Resolução definitiva (Bruno, Tier 3)
- **Causa-raiz arquitetural:** payload contém `product_attributes` completos quando deveria conter apenas `sku + qty + price`. Variações de produto são re-buscadas no Adapter via cache Redis.
- **Fix permanente:** PR em `apex/order-sync` v3.2.2 — remove `product_attributes` do payload Magento.
- **Validação:** smoke test em staging (`apex-stg-eastus2`) com 1.000 pedidos sintéticos antes de release prod.
- **Window de deploy:** terça 03h-05h (janela de manutenção autorizada — ver Página 18).

#### P11.5 Postmortem TKT-12
- Documento: `postmortems/2026-Q2/TKT-12-erp-magento-sync.md` (acesso restrito Engenharia).
- **GMV perdido durante 4h11min de degradação:** R$ 287.400.
- **Lessons learned:** adicionar guardrails de payload size no CI pipeline + load test obrigatório para mudanças em `apex/order-sync`.
- **Cross-ref:** `arquitetura-integracao` (mantido — TKT-12 confirma necessidade da Outbox + DLQ + circuit breaker).

---

### Página 13 — Procedimento P13: renovação token Frota.io webhook (TKT-15)

**Contexto TKT-15 (Apex Logística):** webhook do roteirizador Frota.io parou de receber pedidos do TMS desde ontem 17h. Sintoma: HTTP 200 OK no callback mas pedidos não aparecem na fila do Frota. Causa-raiz: token JWT expirado, renovação automática falhou.

#### P13.1 Validação rápida (Diego)
1. Verificar status do webhook:
   ```bash
   curl -i https://api.frota.io/v2/webhooks/health \
     -H "Authorization: Bearer ${FROTA_TOKEN_ATUAL}"
   ```
   - **200 OK + payload `{"status":"ok"}`:** token válido → investigar outra causa.
   - **401 Unauthorized:** token expirado → seguir P13.2.
   - **403 Forbidden:** permissão revogada → escalar Marina (chamado fornecedor).

2. Decodificar token JWT atual:
   ```bash
   echo $FROTA_TOKEN_ATUAL | cut -d. -f2 | base64 -d | jq .exp
   # exp: epoch — converter com: date -d @{exp}
   ```

#### P13.2 Renovação manual (Diego, autorizado)
1. Renovar token via endpoint `refresh`:
   ```bash
   curl -X POST https://api.frota.io/v2/auth/refresh \
     -H "Content-Type: application/json" \
     -d '{
       "client_id":"apex-logistica-prod",
       "client_secret":"'"${FROTA_CLIENT_SECRET}"'",
       "grant_type":"refresh_token",
       "refresh_token":"'"${FROTA_REFRESH_TOKEN}"'"
     }'
   ```
2. Atualizar Key Vault Azure (sem persistir em log):
   ```bash
   az keyvault secret set \
     --vault-name kv-apex-prod-eastus2 \
     --name frota-io-access-token \
     --value "${NOVO_TOKEN}"
   ```
3. Reiniciar pod do TMS para recarregar o secret:
   ```bash
   kubectl rollout restart deployment/apex-tms-frota-bridge -n apex-prod
   ```

#### P13.3 Reprocessamento pendente
Pedidos travados desde a expiração ficam na fila `frota.io.webhook.dispatch.dlq`. Reprocessar com shovel:
```bash
rabbitmqctl set_parameter shovel replay-frota-webhook \
  '{"src-uri":"amqp://","src-queue":"frota.io.webhook.dispatch.dlq",
    "dest-uri":"amqp://","dest-queue":"frota.io.webhook.dispatch"}'
```

#### P13.4 Prevenção
- **Job de renovação proativa:** cronjob Kubernetes `frota-token-refresh` rodando a cada 18h (margem de 6h antes do expiração de 24h).
- **Alerta proativo:** Application Insights regra "Token Frota TTL < 4h" → notifica Slack `#apex-integracao-alerts`.
- **Cross-ref:** `faq_horario_atendimento.pdf` Página 1.2 (cutoff Frota.io 17h) — incidente TKT-15 reforça a importância do horário.

---

### Página 14 — Monitoring & observabilidade

#### 14.1 Stack de observabilidade
- **Métricas:** Azure Monitor + Prometheus (RabbitMQ + AKS).
- **Logs:** Azure Application Insights + Log Analytics workspace `log-apex-prod-eastus2`.
- **Traces:** OpenTelemetry → Application Insights (workspace `appi-apex-prod`).
- **Dashboards:** Grafana 10.4 (Azure VM Standard_D2s_v5).

#### 14.2 Dashboards principais
| Dashboard | URL | Owner | Visualizações |
|---|---|---|---|
| `Apex Integration Overview` | `https://grafana.apex.local/d/apex-int-overview` | Marina | Throughput por fila, taxa erro, p50/p95/p99 |
| `SAP FI Health` | `https://grafana.apex.local/d/sap-fi-health` | Marina | RFC concurrent calls, tablespace usage, dialog response time |
| `Magento E-commerce` | `https://grafana.apex.local/d/magento-ecom` | Diego | Pedidos/min, checkout abandon, Outbox lag |
| `RabbitMQ Cluster` | `https://grafana.apex.local/d/rabbitmq-cluster` | Bruno | Memory, disk, queue depth, network partition events |
| `SEFAZ NF-e Status` | `https://grafana.apex.local/d/sefaz-nfe` | Marina | Taxa rejeição por código, tempo resposta SEFAZ, NF-e/h |

#### 14.3 Alertas Slack (3 canais)
- **#apex-integracao-alerts:** P1/P2 — Marina + Bruno on-call.
- **#apex-tier1-ops:** P3/P4 — Diego (horário comercial).
- **#apex-postmortems:** documentação de incidentes resolvidos (Bruno modera).

#### 14.4 SLI/SLO definidos
- **SLI 1:** Disponibilidade do fluxo de pedido B2B end-to-end. **SLO:** 99.5% em janela 30 dias.
- **SLI 2:** Taxa de NF-e autorizadas no primeiro envio. **SLO:** ≥95% (atualmente 91% Q1-2026, debt aberto).
- **SLI 3:** MTTR para incidentes P1. **SLO:** ≤45min p95.

---

### Página 15 — Onde olhar os logs (cheatsheet por componente)

| Componente | Local de log | Comando/acesso | Retenção |
|---|---|---|---|
| TOTVS Protheus | `\\protheus-app01\logs\appserver_2026MM.log` (rotação mensal) | `Get-Content -Wait -Tail 100` (PowerShell) | 12 meses on-disk + glacier |
| SAP FI dumps | tx **ST22** (runtime errors) | SAP GUI → ST22 → filtrar por data | 14 dias on-server |
| SAP FI background jobs | tx **SM37** | SAP GUI → SM37 → user RFC_APEX | 30 dias |
| SAP FI RFC trace | tx **SM59** + trace flag | SAP GUI → SM59 → "Test connection" → "Trace" | sob demanda |
| RabbitMQ broker | `/var/log/rabbitmq/rabbit@node{1,2,3}.log` | `tail -F` via SSH | 7 dias rotacionado |
| RabbitMQ management | UI `http://rabbitmq.apex.local:15672` → "Logs" tab | browser | 24h em memória |
| Magento | `/var/www/magento/var/log/{system,exception,debug}.log` | `tail -F` via SSH | 30 dias |
| Magento Outbox | tabela `apex_outbox_orders` (status `failed` + `last_error`) | SQL: `SELECT * FROM apex_outbox_orders WHERE status='failed'` | 90 dias |
| Adapter (.NET AKS) | `kubectl logs deployment/apex-integration-adapter -n apex-prod --tail=500 -f` | kubectl + Application Insights | 30 dias logs, 90 dias Application Insights |
| Service Bus | Azure Portal → namespace → "Metrics" + diagnostic settings → Log Analytics | KQL no `log-apex-prod-eastus2` | 90 dias |
| Frota.io webhook | Azure Functions log stream `func-apex-frota-bridge` | Portal Azure → Function App → Log stream | 30 dias |

#### Query KQL universal de troubleshooting
```kusto
union traces, requests, exceptions, dependencies
| where timestamp > ago(1h)
| where customDimensions.apex_trace_id == "{trace-id}"
   or operation_Id == "{operation-id}"
| project timestamp, itemType, name, message, resultCode, duration, customDimensions
| order by timestamp asc
```

---

### Página 16 — Reprocessamento manual (T-codes SAP)

#### 16.1 Inspeção de documentos contábeis
- **FBL3N — Display G/L Account Line Items:** consulta linhas de razão por conta.
  ```
  SAP GUI → /n → FBL3N → conta: 11201001 (Clientes B2B) → empresa: AP01 → range data → execute
  ```
- **FB03 — Display Document:** detalhe de um documento contábil específico.
- **FBL5N — Display Customer Line Items:** consulta extrato cliente.

#### 16.2 Lançamento manual / correção
- **FB60 — Enter Incoming Invoice:** lançar nota fiscal de entrada manualmente (uso restrito Marina).
  ```
  /n FB60 → fornecedor → data NF → conta de despesa → segmentação → save
  ```
- **MIRO — Logistics Invoice Verification:** verificação de NF de fornecedor com PO (compras MM).
- **F-02 — Enter G/L Account Posting:** lançamento G/L direto (último recurso, requer dupla aprovação Marina + Bruno).

#### 16.3 Estorno
- **FB08 — Reverse Document:** estorno de documento postado.
  ```
  /n FB08 → empresa: AP01 → documento → exercício → motivo estorno (cód 01) → save
  ```
- **MR8M — Cancel Invoice Document:** estorno específico de nota de entrada MM.

#### 16.4 Reprocessamento de IDoc
- **WE19 — IDoc Test Tool:** simular ou reenviar IDoc.
- **BD87 — Status Monitor for ALE Messages:** lista IDocs com erro (status 51, 64, 69).
  ```
  /n BD87 → message type: ACC_DOCUMENT → data → status 51 (Error) → marcar → "Process" (F7)
  ```

#### 16.5 Política de uso
- **Diego (Tier 1):** acesso somente consulta (FBL3N, FB03, FBL5N, BD87 read-only).
- **Marina (Tier 2):** acesso lançamento + estorno (FB60, MIRO, FB08, MR8M, WE19, BD87 full).
- **Bruno (Tier 3):** acesso F-02 + customizing (SPRO) + transport request management.

Auditoria de todas as ações ficam em `SM19/SM20` (Security Audit Log) — retenção 90 dias.

---

### Página 17 — Escalonamento (matriz Tier 1 → Tier 2 → Tier 3 → Fornecedor)

| Cenário | Tier 1 (Diego) | Tier 2 (Marina) | Tier 3 (Bruno CTO) | Fornecedor |
|---|---|---|---|---|
| NF-e rejeição 539 isolada | Identifica + escala Marina | Reprocessa com CFOP correto | — | — |
| ERP↔Magento sync >5% erro | Detecta + escala Marina | Diagnostica + mitiga | Hotfix se necessário | — |
| Frota.io token expirado | Renova manualmente (P13.2) | Apenas se P13.2 falhar | — | Frota.io support (`support@frota.io`) |
| RabbitMQ node down | Detecta + escala Marina | Failover automático verifica | Decisão de adicionar node | — |
| SAP FI dump em ST22 (frequência alta) | Apenas observa | Investiga + abre chamado SAP | Decisão patch/SAP Note | **SAP SuperCare** (#chamado via launchpad) |
| TOTVS performance degradada | Apenas observa | Investiga config WSCONFIG | Decisão upgrade | **TOTVS Mais** (chamado via portal) |
| Service Bus throttling | Detecta + escala Marina | Aumenta MU temporariamente | Decisão MU permanente | **Microsoft Premium Support** |
| SEFAZ-SP indisponível | Aguarda + comunica Marina | Comunica área comercial + ativa modo contingência (SCAN) | — | **SEFAZ-SP** (consultar `https://www.nfe.fazenda.gov.br`) |
| Disaster recovery (RTO 4h) | Notifica Marina + Bruno | Coordena failover | Comando + comunicação executiva | Todos fornecedores notificados |
| Auditoria SAP/PCI-DSS | — | — | Coordena diretamente | Auditor externo (KPMG via contrato) |

#### Limites de alçada
- **Diego:** ações reversíveis sem impacto financeiro (renovação token, restart de pod, query de log).
- **Marina:** ações com impacto financeiro até R$ 50.000 (lançamentos FB60, estornos FB08).
- **Bruno:** decisões arquiteturais, deploy fora de janela, lançamentos >R$ 50.000.

#### Contatos Slack
- Diego: `@diego.silva` (Slack DM aceito 24/7 horário comercial)
- Marina: `@marina.oliveira` (DM apenas P1/P2 fora horário)
- Bruno: `@bruno.santos` (DM apenas P1 fora horário + e-mail backup)

---

### Página 18 — Janelas de manutenção autorizadas

#### 18.1 Janela primária semanal
- **Terça-feira 03h00-05h00 BRT** — janela canônica para:
  - Deploy de hotfixes não-críticos do Adapter (.NET AKS).
  - Restart programado de RabbitMQ nodes (1 por terça, rotativo).
  - Manutenção de índices MSSQL TOTVS (`UPDATE STATISTICS`, `ALTER INDEX REBUILD`).
  - Aplicação de SAP Notes não-emergenciais (com aval Bruno).
- **Comunicação:** banner no Magento 48h antes ("Manutenção programada terça 03h-05h, e-commerce permanece operacional, demais operações podem ter latência elevada").

#### 18.2 Janela estendida mensal
- **Terceiro domingo do mês 02h00-06h00 BRT** — janela ampla para:
  - Upgrades major (SAP support packs, TOTVS major releases).
  - Migração de versão Magento.
  - Reorganização de tablespace Oracle (`ALTER TABLESPACE ... COALESCE`).
  - Patches no RabbitMQ cluster (rolling upgrade).
- **Comunicação:** banner Magento 7 dias antes + e-mail para lojistas B2B.

#### 18.3 Janela emergencial
- Aprovação **Bruno + Lia (Head Atendimento)** obrigatória.
- Comunicação imediata em `#apex-integracao-alerts` + e-mail para gerentes regionais.
- Documentação no postmortem ao final.

#### 18.4 Período de freeze
- **Black Friday week (4ª semana novembro):** **FREEZE TOTAL** — apenas hotfixes P1 com aval explícito Bruno + Lia + Carla.
- **Fechamento fiscal (últimos 3 dias úteis do mês):** sem deploys de mudança em SAP FI ou SPED.
- **Dia 25 do mês (transmissão SPED Fiscal):** sem deploys em TOTVS módulo SIGAFIS.

#### 18.5 Cross-references
- Janela manutenção do e-commerce está documentada também em `faq_horario_atendimento.pdf` Página 2.1.
- Histórico de janelas executadas: `https://wiki.apex.local/maintenance-history`.

---

### Página 19 — Disaster recovery (RTO 4h · RPO 15min)

#### 19.1 Componentes com DR ativo
| Componente | Estratégia | RTO | RPO | Site secundário |
|---|---|---|---|---|
| Oracle 19c SAP FI | Data Guard sync | 2h | 0min (sync) | Tamboré (50km da sede) |
| MSSQL TOTVS | Always-On + log shipping | 1h | 5min | Tamboré |
| RabbitMQ cluster | 3 nodes em AZ diferentes + federation para westus3 | 30min | 15min | Azure westus3 |
| Magento + Adapter AKS | Azure Site Recovery + Bicep IaC | 3h | 30min | Azure westus3 |
| Service Bus | Geo-disaster recovery alias | 5min | <1min | Azure westus3 |
| Application Insights | Continuous Export → Storage westus3 | N/A | 0min | Azure westus3 |

#### 19.2 Runbook de failover RabbitMQ
1. **Detecção:** Bruno é notificado via PagerDuty quando 2 de 3 nodes do cluster ficam unhealthy >5min.
2. **Validação manual:**
   ```bash
   ssh rabbitmq-node1.apex.local 'rabbitmqctl cluster_status'
   ssh rabbitmq-node2.apex.local 'rabbitmqctl cluster_status'
   ssh rabbitmq-node3.apex.local 'rabbitmqctl cluster_status'
   ```
3. **Failover para federation passive:**
   ```bash
   az network private-dns record-set a update \
     --zone-name apex.local \
     --resource-group rg-apex-prod-eastus2 \
     --name rabbitmq \
     --set aRecords[0].ipv4Address=10.20.30.40
   ```
   (IP do load balancer apontando para cluster westus3)
4. **Validação pós-failover:**
   - Throughput em `magento.outbox.sync` deve normalizar em <10min.
   - Latência p95 do hop 5 (RabbitMQ) deve voltar a <500ms.
5. **Comunicação:** Marina notifica Lia (Head Atendimento) para comunicar lojistas se DR durar >30min.

#### 19.3 Runbook de failover SAP FI (Oracle Data Guard)
- **Owner exclusivo:** Bruno + Equipe Basis (terceirizada SAP).
- **Comando:** `dgmgrl> switchover to 'sap_standby_tamboré';` (executado pelo Basis).
- **Validação:** primeiro lançamento contábil teste em FB60 deve completar em <5s.
- **Comunicação corporativa:** Bruno comunica Carla (CFO) — DR de FI afeta fechamento fiscal.

#### 19.4 Testes anuais
- **Q1 (março):** failover RabbitMQ + Adapter (executado).
- **Q2 (junho):** failover Magento (planejado 2026-06-21).
- **Q3 (setembro):** failover SAP FI (com Basis presencial).
- **Q4 (dezembro):** simulação completa multi-componente (sem disparar produção).

---

### Página 20 — Histórico de incidentes Q1-2026 (top 5)

Tabela detalhada de incidentes Q1, com root cause + ação corretiva. Material de referência durante onboarding de novos Tier 2.

| # | Data | Ticket | Sev | Componente | Sintoma | RCA | Ação | MTTR |
|---|---|---|---|---|---|---|---|---|
| 1 | 2026-01-14 | TKT-12 | P1 Critical | RabbitMQ + Magento Outbox | 18% pedidos `pending sync` por 4h11min, GMV perdido R$ 287.400 | Payload Magento >256KB com `product_attributes` desnecessário | Hotfix v3.2.2 em `apex/order-sync` + guardrail CI | 4h11min |
| 2 | 2026-02-03 | TKT-3 (recorrente) | P2 High | SAP FI + TOTVS | NF-e 539 em 47% dos pedidos B2B interestaduais | CFOP intra-estadual (5102) aplicado em pedido interestadual | Trigger ADVPL `apex_validate_cfop` + Anexo II atualizado | 38min (mediana) |
| 3 | 2026-02-19 | TKT-18 (relacionado) | P1 Critical | Azure App Service Magento | Site fora do ar 47min Black Friday (postmortem Q4-2025, ainda referenciado) | Auto-scaling configurado max 10, pico exigiu 17 | Max 30 + warm pool 5 instances | 47min |
| 4 | 2026-03-04 | TKT-15 | P2 High | Frota.io webhook | Pedidos não chegam ao Frota desde 17h | Token JWT expirado, refresh job em estado `Failed` no Kubernetes | Cronjob `frota-token-refresh` corrigido (memory limit estava baixo, OOMKilled) + alerta proativo 4h TTL | 1h47min |
| 5 | 2026-03-22 | Interno (sem ticket) | P3 Medium | SAP FI Oracle | Tablespace `PSAPSR3` em 87% (alerta 80%) | Crescimento orgânico não previsto + auditoria fiscal Q4-2025 indexou tabelas | `ALTER TABLESPACE PSAPSR3 ADD DATAFILE` (+200GB) + revisão anual de capacidade | 2h15min (planejado) |

#### Observações cross-incidente
- **Padrão emergente:** 3 dos 5 incidentes top Q1 envolvem **limite atingido sem alerta proativo**. Plano Q2: revisar todos os thresholds da Página 7 e adicionar alerta em 75% do limite (não só 80%).
- **MTTR p95 Q1:** 2h47min (acima do SLO de 45min) — distorcido pelo TKT-12. Excluindo P1 críticos, p95 = 1h12min.

---

### Página 21 — Checklist semanal de health check (segundas 09h)

Marina executa toda segunda-feira 09h00 BRT. Tempo médio: 35min. Resultado vai para `#apex-tier1-ops` (Slack) + planilha `weekly-health-check.xlsx` em SharePoint.

#### 21.1 Verificações de plataforma (10 itens)
- [ ] **RabbitMQ cluster status:** `rabbitmqctl cluster_status` em 1 dos 3 nodes — todos `running`.
- [ ] **RabbitMQ memory:** todos nodes <70% memory_used.
- [ ] **RabbitMQ disk:** todos nodes <60% disk_free_alarm threshold.
- [ ] **Service Bus throttling events:** Azure Portal → Metrics → `ServerErrors` últimos 7 dias = 0.
- [ ] **AKS pod health:** `kubectl get pods -n apex-prod` — todos `Running`, restart count <5.
- [ ] **SAP FI tablespace usage:** SAP GUI → tx DB02 → todos tablespaces <80%.
- [ ] **TOTVS AppServer connections:** todos 4 servers <500 connections (limite 800).
- [ ] **MSSQL TOTVS tempdb:** <60GB (de 100GB).
- [ ] **Oracle SAP FI Data Guard lag:** dgmgrl → `show database` → lag <10s.
- [ ] **Application Insights ingestion:** últimos 7 dias <40GB/dia.

#### 21.2 Verificações de fluxo de negócio (8 itens)
- [ ] **Taxa NF-e autorizada 1ª tentativa últimos 7 dias:** ≥93% (SLO 95%).
- [ ] **Filas DLQ:** todas com <50 mensagens, sem mensagem >72h.
- [ ] **Magento Outbox lag p95:** <120s últimos 7 dias.
- [ ] **Frota.io token TTL atual:** >12h (renovação cronjob OK).
- [ ] **Service Bus session draining:** 0 sessions com idade >1h.
- [ ] **SAP IDocs em status 51:** tx BD87 → <10 IDocs no backlog.
- [ ] **TOTVS jobs falhados últimos 7 dias:** <5 (consulta tabela `SIGAFIS_JOBS_LOG`).
- [ ] **PIX recebimentos sem identificação:** TKT-47 padrão — <3 PIX órfãos pendentes.

#### 21.3 Verificações de segurança (5 itens)
- [ ] **Key Vault secrets expiring 30d:** `az keyvault secret list ... | jq '.[] | select(.attributes.expires < now+30d)'` — lista vazia.
- [ ] **Certificado A1 NF-e validade:** consulta no SAP tx `STRUSTSSO2` → >90 dias para expiração.
- [ ] **SAP Security Audit Log (SM20):** revisar tentativas de login falhadas usuário `RFC_APEX` últimos 7 dias.
- [ ] **AKS RBAC anomalias:** `kubectl get rolebindings -A` últimos 7 dias sem novos bindings não-aprovados.
- [ ] **Magento admin login anomalies:** revisar `admin_user_log` em MSSQL Magento — logins de IP fora do range corporativo.

#### 21.4 Output
- Marca cada item ✅ ou ❌ na planilha.
- ❌ vira ticket no HelpSphere com tag `health-check-segunda`.
- Resumo em texto livre postado em `#apex-tier1-ops` (formato: 3 highlights + 3 lowlights da semana anterior).

---

### Página 22 — Anexos + contatos + footer

#### 22.1 Anexo I — Contatos de fornecedores

| Fornecedor | Produto | Contato | SLA contratual |
|---|---|---|---|
| **SAP Brasil** | SAP FI 4.7 EHP8 (SuperCare) | `https://launchpad.support.sap.com` · contrato `SAP-APEX-2024-001` | P1 30min · P2 4h · P3 1 dia útil |
| **TOTVS** | Protheus 12.1.33 (TOTVS Mais) | `https://suporte.totvs.com.br` · contrato `TVS-AP-2024-PRO` | P1 1h · P2 4h · P3 1 dia útil |
| **Adobe Magento** | Magento Commerce 2.4 | `https://support.magento.com` · contrato `MGT-PREMIER-2024` | P1 1h · P2 4h |
| **Microsoft Azure** | Service Bus, AKS, App Insights (Premium Support) | `https://portal.azure.com/#blade/Microsoft_Azure_Support` · contrato `AZ-EA-2024` | P1 15min · P2 2h · P3 8h |
| **Frota.io** | Roteirizador TMS | `support@frota.io` · `+55 11 4000-0000` | Best effort (sem SLA contratual) |
| **Certisign** | Certificado A1 NF-e | `https://www.certisign.com.br/atendimento` | Renovação programada com 60 dias antecedência |
| **Vtex Implementer** | Implementação Magento (parceiro) | DM Marina via Slack #partner-vtex | 1 dia útil |

#### 22.2 Anexo II — Tabela CFOP rápida (top 15 Apex)

| CFOP | Descrição | Uso típico Apex |
|---|---|---|
| 5102 | Venda mercadoria de terceiros, **intra-estadual** | B2B SP→SP (Apex Mercado, Apex Tech) |
| 5403 | Venda c/ ST, **intra-estadual** | Bebidas, eletrônicos |
| 5405 | Venda c/ ST varejo, **intra-estadual** | Apex Tech (smart TVs) |
| 5910 | Remessa de bonificação | Marketing/amostra grátis |
| 5949 | Outra saída não especificada | Brinde, mostruário |
| 6102 | Venda mercadoria de terceiros, **interestadual** | TKT-3 caso real (deveria ter sido aqui) |
| 6403 | Venda c/ ST, **interestadual** | Eletro p/ outros estados |
| 5202 | Devolução de compra | Devolução fornecedor |
| 5915 | Remessa para conserto | Apex Tech garantia |
| 1101 | Compra para industrialização (entrada) | Apex Casa (matéria-prima móveis) |
| 1102 | Compra para comercialização (entrada) | Apex Mercado (hortifruti) |
| 1411 | Devolução de venda mercadoria | Apex Moda (devoluções) |
| 5910 | Transferência entre filiais (saída) | CD-Cajamar → Lojas |
| 1910 | Transferência entre filiais (entrada) | Lojas ← CD-Cajamar |
| 5933 | Prestação de serviço tributado pelo ISS | Apex Casa montagem |

#### 22.3 Anexo III — Glossário rápido

- **AKS:** Azure Kubernetes Service.
- **BAPI:** Business Application Programming Interface (SAP).
- **CFOP:** Código Fiscal de Operações e Prestações.
- **DLQ:** Dead Letter Queue.
- **IDoc:** Intermediate Document (SAP).
- **MTTR:** Mean Time To Recovery.
- **NCM:** Nomenclatura Comum do Mercosul.
- **NF-e:** Nota Fiscal Eletrônica (modelo 55).
- **NFC-e:** Nota Fiscal de Consumidor Eletrônica (modelo 65) — cobertura no `manual_pos_funcionamento.pdf`.
- **RFC:** Remote Function Call (SAP).
- **SCAN:** Sistema de Contingência do Ambiente Nacional (NF-e).
- **SEFAZ:** Secretaria de Fazenda.
- **SPED:** Sistema Público de Escrituração Digital.
- **TMS:** Transportation Management System.

#### 22.4 Footer
- **Documento:** RBK-FIN-001 · `runbook_sap_fi_integracao.pdf`
- **Versão:** v3.4 · **Vigência:** Q2-2026 · **Próxima revisão:** Q3-2026
- **Owner:** Bruno (CTO) · **Revisores:** Marina (Tier 2), Diego (Tier 1)
- **Classificação:** Confidencial — uso interno Apex Group · não distribuir externamente sem aval Compliance
- **Cross-refs:** `manual_pos_funcionamento.pdf` (NFC-e POS), `faq_horario_atendimento.pdf` (cutoff Frota.io e janelas manutenção), `runbook_problemas_rede.pdf` (TKT-18 BlackFriday postmortem)

---

## 🎯 3 tickets-âncora validados

1. **TKT-3** (Apex Mercado — NF-e Rejeição 539 CFOP incompatível):
   > "NFe de pedido B2B rejeitada — Rejeição 539 (CFOP incompatível)"
   ➡️ **Cobertura no PDF:** Página 8 (top 10 rejeições, código 539 detalhado) + Páginas 9-10 (procedimento P9 completo de troubleshooting + resolução).

2. **TKT-12** (Apex Tech CRITICAL — Integração ERP↔Magento falhando 18%):
   > "CRÍTICO: Integração ERP↔Magento falhando em 18% dos pedidos"
   ➡️ **Cobertura no PDF:** Página 7 (limite payload RabbitMQ 256KB) + Páginas 11-12 (procedimento P11 completo) + Página 20 (histórico incidente #1).

3. **TKT-15** (Apex Logística — Frota.io webhook token expirado):
   > "Roteirizador (Frota.io) parou de receber pedidos do TMS"
   ➡️ **Cobertura no PDF:** Página 7 (threshold token JWT 24h) + Página 13 (procedimento P13 completo) + Página 20 (histórico incidente #4).

#### Cobertura adicional dos `[KB]` antigos do seed
- **`arquitetura-integracao`** → Páginas 1-2 (diagrama lógico), Páginas 3-4 (tecnologias), Página 5 (fluxo 7 hops), Página 6 (filas), Página 19 (DR).
- **`nfe-rejeicoes-comuns`** → Página 8 (top 10) + Páginas 9-10 (procedimento P9 Rejeição 539 detalhado, exemplos extensivos).

---

## ✅ Validação cruzada com regras editoriais (CONTEXT.md)

- [✅] Sem AI slop — sem "é importante notar", "no mundo de hoje", "em conclusão"
- [✅] Marcas Apex* fictícias — usadas consistentemente (Apex Mercado/Tech/Moda/Casa/Logística)
- [✅] Fornecedores reais SAP/TOTVS/Magento/RabbitMQ/Azure — permitido (tecnologias do stack)
- [✅] Personas v5 — Diego (Tier 1), Marina (Tier 2), Bruno (CTO Tier 3), Lia (Head Atendimento), Carla (CFO) — todas usadas
- [✅] Jargão TI real — SAP FI, EHP, IDoc, BAPI, RFC, T-codes (ST22, SM37, FBL3N, FB60, FB08, MIRO, BD87, WE19, DB02), CFOP, NCM, SPED, NF-e 4.0
- [✅] Códigos NF-e reais — 539, 240, 778, 226, 694, 563, 228, 404, 610, 999
- [✅] Valores R$ realistas — R$ 18.430, R$ 287.400, R$ 47.300, R$ 280k (não R$ 1.000 redondo)
- [✅] CNPJ fictício válido — 12.345.678/0001-90
- [✅] Procedimentos numerados — P9 (Rejeição 539), P11 (sync ERP↔Magento), P13 (Frota.io token)
- [✅] Tabelas estruturadas — múltiplas (latências hops, filas RabbitMQ, thresholds, rejeições, incidentes, contatos)
- [✅] Cross-refs com outros PDFs — manual_pos_funcionamento, faq_horario_atendimento, runbook_problemas_rede
- [✅] Anti-obsolescência — versão Q2-2026 + próxima revisão Q3-2026 + version-anchor declarado
- [✅] Datas relativas — Q1-2026, Q2-2026, terça 03h-05h, terceiro domingo do mês
- [✅] Comandos shell/SQL/SAP embutidos onde fazem sentido

---

## 🔄 Próximo passo

1. Escrever `05-runbook_sap_fi_integracao.source.md` (~25.000 palavras, ~1.200 palavras/página).
2. Smoke test Document Intelligence em rascunho PDF.
3. Conversão Pandoc → PDF/A-2b final.
