# Runbook — Integração SAP FI ↔ TOTVS Protheus ↔ Magento ↔ SEFAZ NF-e

> **Documento:** RBK-FIN-001 · `runbook_sap_fi_integracao.pdf`
> **Versão:** v3.4 · **Vigência:** Q2-2026 · **Próxima revisão:** Q3-2026
> **Owner:** Bruno (CTO) · **Revisores:** Marina (Tier 2), Diego (Tier 1)
> **Classificação:** Confidencial · uso interno Apex Group

---

## Página 1 — Capa e visão arquitetural (parte 1/2)

**Distribuição:** Slack `#apex-runbooks-feedback` para feedback, GitHub `apex-runbooks/RBK-FIN-001` para PRs.

### 1.1 Escopo do runbook

Este runbook documenta o fluxo financeiro e fiscal que conecta o e-commerce Magento à plataforma SAP FI 4.7 EHP8, passando obrigatoriamente pelo TOTVS Protheus 12.1.33 como sistema-mestre de pedidos e cadastro fiscal. O documento é aplicável às cinco marcas operacionais do Apex Group: Apex Mercado (supermercado, alta rotatividade de perecíveis), Apex Tech (eletrônicos e linha branca), Apex Moda (fashion sazonal), Apex Casa (móveis e decor com montagem) e Apex Logística (operação intra-grupo).

Estão cobertos os procedimentos de troubleshooting, monitoring, escalação e disaster recovery do fluxo "pedido B2B → faturamento → NF-e → liquidação ERP → posting SAP FI". Pedidos B2C cash-and-carry, que caem diretamente no NFC-e do POS, ficam fora deste escopo e são tratados no `manual_pos_funcionamento.pdf`. Folha de pagamento (SAP HR) e o módulo MM/SD puro também não pertencem a este documento — são endereçados em runbooks específicos de Marina (operações fiscais) e Bruno (arquitetura técnica corporativa).

O runbook é mantido pela equipe de Integração sob coordenação direta de Bruno (CTO). Marina (Tier 2) é a revisora primária, responsável por validar atualizações trimestrais e incorporar lições aprendidas dos postmortems. Diego (Tier 1) consulta o documento diariamente durante atendimento de tickets HelpSphere — sua perspectiva de "checklist operacional" guia a estrutura dos procedimentos P9, P11 e P13.

A audiência primária é interna: equipe TI Apex, fornecedores contratados (Basis SAP, TOTVS, Vtex Implementer) sob NDA, e auditoria KPMG durante revisões anuais. O documento não é distribuído externamente sem aval explícito de Compliance.

O documento substitui dois artefatos legacy: o "Guia de Operação SAP-TOTVS v2.x" (descontinuado em Q4-2024 após reescrita completa) e o "Manual de Integração E-commerce" (mesclado neste runbook em Q1-2025). A consolidação reduziu redundância e eliminou conflitos editoriais entre os dois documentos antigos.

Versões anteriores estão preservadas no Git history para referência histórica. Marina recomenda consultá-las apenas para questões de "por que decidimos X" — para operação atual, sempre usar a versão vigente Q2-2026.

### 1.2 Diagrama lógico — visão de alto nível

A arquitetura de integração é composta por sete blocos lógicos encadeados, com dois caminhos de callback (acknowledgement de NF-e autorizada e atualização do pedido). A descrição textual abaixo substitui o diagrama visual.

**Bloco 1 — Magento Commerce 2.4.6:** hospedado em Azure VM Standard_D8s_v5 na região `eastus2`, dentro do resource group `rg-apex-magento-prod-eastus2`. Plugin custom `Apex_OrderSync` v3.2.1 (Composer package `apex/order-sync`) intercepta o evento `sales_order_place_after` e grava o pedido na tabela `apex_outbox_orders` em transação atômica com o commit do checkout.

**Bloco 2 — Azure Service Bus Premium:** namespace `sb-apex-prod-eastus2.servicebus.windows.net`, 1 messaging unit, topic `pedidos-b2b` com sessions habilitadas por `tenant_id`. Mensagens viajam encrypted-at-rest (TLS 1.2 mínimo, certificado Microsoft) e a autenticação é por Managed Identity desde Q4-2025 — SAS keys foram extintas em produção após auditoria interna.

**Bloco 3 — Apex Integration Adapter:** Worker Service em .NET 8 deployado no AKS `aks-apex-prod-eastus2`, namespace `apex-prod`. Faz `PeekLock` no Service Bus, valida o payload contra o JSON Schema `pedido-b2b-v3.json`, aplica idempotência por `pedido_id + sequence_number` e encaminha via REST POST para o TOTVS Protheus.

**Bloco 4 — TOTVS Protheus 12.1.33:** servidor on-prem no datacenter de Cajamar, banco MSSQL 2019 Standard em cluster Always-On. Quatro AppServers balanceados (`protheus-app01..04.apex.local`) recebem requests REST do Adapter via endpoint custom `/api/pedidos` implementado em ADVPL (`apex_api_pedidos.prw`).

**Bloco 5 — TOTVS-SAP Bridge (RabbitMQ 3.11):** após o pedido ser gravado no TOTVS, o sistema publica uma mensagem no exchange `totvs.sap.posting` (tipo `topic`, routing key `pedido.criar`). O cluster RabbitMQ tem três nodes em Availability Set Azure com quorum queues replicadas em RF=3.

**Bloco 6 — SAP FI 4.7 EHP8:** servidor on-prem Cajamar, banco Oracle 19c com Data Guard sincronizando para o site secundário em Tamboré. Um conector Java SAP JCo consome do RabbitMQ e dispara a BAPI `BAPI_ACC_DOCUMENT_POST`, que gera o documento contábil correspondente ao pedido.

**Bloco 7 — SEFAZ-SP NF-e 4.0:** webservice externo da Secretaria de Fazenda do Estado de São Paulo. O posting no SAP FI dispara automaticamente a emissão da NF-e (XML SEFAZ 4.00 com assinatura digital A1 emitida pela Certisign, válida até 2027-11-14). A resposta autorizada (chave de acesso 44 dígitos) volta pelos blocos 6 → 5 → 4 → 3 → atualiza o `apex_outbox_orders` no Magento.

Os endpoints SEFAZ-SP utilizados (versão 4.00):

- **NfeAutorizacao4** — autorização de NF-e em modo síncrono ou assíncrono. Endpoint: `https://nfe.fazenda.sp.gov.br/ws/nfeautorizacao4.asmx`.
- **NfeRetAutorizacao4** — consulta de recibo (quando o modo é assíncrono). Endpoint: `https://nfe.fazenda.sp.gov.br/ws/nferetautorizacao4.asmx`.
- **NfeStatusServico4** — verifica disponibilidade do webservice. Endpoint: `https://nfe.fazenda.sp.gov.br/ws/nfestatusservico4.asmx`. Marina pinga a cada 5 minutos.
- **NfeConsultaProtocolo4** — consulta de status de uma NF-e específica. Endpoint: `https://nfe.fazenda.sp.gov.br/ws/nfeconsultaprotocolo4.asmx`.
- **NfeInutilizacao4** — inutilização de numeração não utilizada. Endpoint: `https://nfe.fazenda.sp.gov.br/ws/nfeinutilizacao4.asmx`. Usado raramente.
- **RecepcaoEvento4** — eventos da NF-e (cancelamento, CC-e, manifestação). Endpoint: `https://nfe.fazenda.sp.gov.br/ws/nferecepcaoevento4.asmx`.

Em modo de contingência SCAN, os endpoints mudam para o ambiente nacional: `https://hom.nfe.fazenda.gov.br/SCAN/...`. Ativação manual em SPRO transação `J_1B_NFE_CONFIG`.

O fluxo total tem latência p95 de aproximadamente 12 segundos end-to-end. O SLO interno é de até 20 segundos para 99% dos pedidos. Mensagens fora desse envelope disparam alerta P3 e entram em investigação.

### 1.3 Stakeholders e ownership

Cada bloco lógico tem ownership claro definido. Quando algo quebra, esta tabela diz imediatamente quem é o responsável primário:

| Bloco | Owner técnico primário | Owner de negócio |
|---|---|---|
| Magento Commerce | Diego (operação) + Vtex Implementer (mudanças) | Lia (Head Atendimento) |
| Service Bus | Bruno (CTO) | Bruno (responde por arquitetura cloud) |
| Apex Integration Adapter | Bruno + Engenharia interna | Bruno |
| TOTVS Protheus | Marina (operação) + TOTVS Mais (mudanças) | Marina + Carla (CFO) |
| RabbitMQ cluster | Bruno + Pivotal Tanzu (consultoria) | Bruno |
| SAP FI | Marina (operação) + Basis terceirizada (técnico) | Carla (CFO) — impacto fiscal |
| SEFAZ NF-e | externo (fora do escopo Apex) | Marina coordena com SAC tributário se necessário |

A definição clara de ownership é fundamental durante incidentes. Diego nunca fica em dúvida sobre quem ligar — a tabela tem mais autoridade que opinião pessoal.

### 1.4 Histórico do documento

Este runbook nasceu em agosto de 2024 após dois incidentes consecutivos de NF-e rejeitada que escalonaram até o CEO. Naquele momento ficou evidente que o conhecimento operacional estava distribuído em "head knowledge" de poucas pessoas — e quando essas pessoas estavam de férias ou doentes, a empresa parava.

A primeira versão (v1.0) tinha 8 páginas e cobria apenas o procedimento de troubleshooting de NF-e. Evoluções subsequentes adicionaram:

- v1.5 (Q4-2024): integração de TOTVS + SAP, escalação Tier 1/2/3.
- v2.0 (Q1-2025): reescrita completa após implementação Outbox pattern.
- v2.5 (Q2-2025): adição de RabbitMQ cluster, modelo Sub-Sub.
- v3.0 (Q3-2025): introdução de procedimentos P9, P11, P13.
- v3.1 (Q4-2025): hardening de monitoring após Black Friday.
- v3.2-v3.4 (Q1-Q2-2026): incorporação de aprendizados TKT-3, TKT-12, TKT-15.

A próxima evolução significativa (v4.0) está prevista para Q4-2026 e incluirá:
- Cobertura de SAP S/4HANA Cloud (em planejamento).
- Refactor do Magento para arquitetura headless commerce.
- Integração com Azure OpenAI para "incident assistant" (chatbot baseado neste runbook).

---

## Página 2 — Visão arquitetural (parte 2/2)

### 2.1 Padrões de mensageria

O padrão dominante é Publish-Subscribe com filtragem por `tenant_id` e `messageType`. Cada uma das cinco marcas Apex tem subscriptions independentes no Service Bus, permitindo que Diego (Tier 1) faça troubleshooting isolado de uma marca sem impactar as demais. As subscriptions são nomeadas `apex-mercado-sub`, `apex-tech-sub`, `apex-moda-sub`, `apex-casa-sub`, `apex-logistica-sub` no topic `pedidos-b2b`. A filtragem usa SQL Filter do Service Bus: `tenant_id = '11111111-1111-1111-1111-111111111111'` para Apex Mercado, e equivalente para as demais. A correlação cross-bloco é garantida pela propagação do header `apex-trace-id` (compliant com W3C TraceContext) — Marina usa esse identificador como chave primária ao consolidar logs no Application Insights.

Além do padrão Pub-Sub, dois padrões secundários estão em uso:

- **Request-Reply com correlação assíncrona:** o callback de NF-e autorizada é gerenciado pela fila `sap.fi.nfe.callback`. O Adapter usa `MessageId` original como `CorrelationId` no callback, permitindo que o consumidor relacione a resposta ao pedido original. Timeout de correlação: 60 segundos. Após isso, considera-se "callback perdido" e Diego inicia procedimento de reconciliação manual.
- **Outbox Pattern (descrito na seção 2.3):** garantia transacional entre commit de checkout no Magento e publicação no Service Bus. Sem esse padrão, falhas no Service Bus durante o checkout causariam perda de pedido — cenário inaceitável para B2B.

A idempotência é tratada em duas camadas. No Service Bus, a deduplicação nativa usa a janela TTL de 7 dias com chave `pedido_id + sequence_number`. No RabbitMQ, a deduplicação é implementada via header `x-deduplication-id` validado pelo consumer (TTL 24h). Essa segunda camada existe porque o Adapter pode reenviar mensagens em cenários de falha do hop 4 (TOTVS) e queremos garantir que o SAP FI nunca veja a mesma operação duas vezes.

A ordenação cronológica por marca é mantida com Sessions habilitadas no Service Bus — cada `tenant_id` tem sua própria session, e o Adapter consome sequencialmente dentro de cada session. Sem essa garantia, um pedido tardio poderia ser processado antes de um pedido anterior, gerando inconsistência no estoque do TOTVS.

A Dead Letter Queue é a última linha de defesa. Após três tentativas com backoff exponencial (1 segundo, 5 segundos, 25 segundos), a mensagem é descartada para a DLQ correspondente. Marina recebe alerta P3 no Slack `#apex-integracao-alerts` se qualquer DLQ acumular mais de 72 horas de mensagens sem reprocessamento.

### 2.2 Contratos de payload

Três contratos formais são versionados no Azure Container Registry `acrapexprodeastus2.azurecr.io/schemas/`:

O **contrato pedido-b2b-v3.json** descreve o pedido publicado pelo Magento. Define campos obrigatórios `pedido_id` (UUID), `tenant_id` (UUID da marca), `cliente_cnpj` (formato regex BR), `itens` (array com SKU, quantidade, preço unitário), `cfop_sugerido` (calculado pelo Magento baseado em UF origem/destino) e `total` (decimal com 2 casas). Campos opcionais incluem `desconto_aplicado`, `frete`, `observacoes` (string até 1000 chars) e `customizacoes` (objeto livre — historicamente onde inflava o payload, ver Página 11).

O **contrato NF-e XML** segue o padrão SEFAZ 4.00 sem extensões customizadas. A assinatura digital A1 é aplicada pelo SAP FI antes da submissão, usando o certificado armazenado no SAP Trust Center (tx STRUSTSSO2). O certificado tem validade até 2027-11-14 e o processo de renovação está documentado no Anexo I da Página 22 (contato Certisign).

O **contrato IDoc ACC_DOCUMENT03** é o padrão SAP para posting contábil via RFC. O TOTVS-SAP Bridge monta esse IDoc a partir da mensagem RabbitMQ e dispara via SAP JCo. Campos críticos: `BUKRS` (empresa AP01 para holding, AP02..06 para subsidiárias), `BLART` (tipo de documento — DR para Cliente, KR para Fornecedor), `BUDAT` (data de lançamento contábil) e `WAERS` (moeda BRL).

### 2.3 Resiliência cross-component

Quatro mecanismos garantem a resiliência do fluxo end-to-end.

**Circuit breaker no Adapter:** quando o TOTVS retorna cinco falhas consecutivas em uma janela de 30 segundos, o circuit breaker abre por 60 segundos. Durante esse intervalo, mensagens não são entregues — ficam acumuladas no Service Bus aguardando. Após os 60 segundos, o estado passa a half-open e um probe é enviado; se sucesso, o circuit fecha; se falha, abre por mais 60 segundos. Esse padrão evita cascata de falhas e dá tempo para Marina diagnosticar o TOTVS sem ser bombardeada por retries.

**Saga compensatória NF-e:** se a emissão da NF-e falha após o posting já ter sido confirmado no SAP FI, o sistema dispara automaticamente um estorno via transação `FB08`. Isso evita inconsistência financeira (lançamento contábil sem NF-e correspondente). O log do estorno é registrado em `apex_compensation_log` (MSSQL TOTVS) com referência cruzada para o documento original.

**Outbox pattern no Magento:** o pedido nunca é publicado diretamente no Service Bus durante o checkout. Em vez disso, é gravado na tabela `apex_outbox_orders` na mesma transação SQL do commit do checkout (todo-ou-nada). Um job assíncrono (`apex:outbox:flush`, executado a cada 5 segundos) lê pedidos com status `pending` e publica no Service Bus. Esse padrão garante que nunca haverá pedido "perdido" entre o checkout e a integração, mesmo se o Service Bus estiver temporariamente indisponível.

**Geo-disaster recovery do Service Bus:** o namespace de produção tem um alias para o namespace passivo em `westus3` (`sb-apex-prod-dr-westus3.servicebus.windows.net`). Em caso de falha regional `eastus2`, Bruno aciona o failover via Azure CLI (`az servicebus georecovery-alias fail-over`). O RTO desse componente é inferior a 5 minutos.

### 2.4 Modelo de consistência

A consistência de dados entre os 5 componentes principais (Magento, Service Bus, TOTVS, RabbitMQ, SAP FI) é eventual — não é uma transação ACID atômica end-to-end. Esse é um trade-off arquitetural consciente, documentado em ADR-07 (`apex-architecture-decisions/ADR-07-eventual-consistency.md`).

A janela de inconsistência aceita é de **30 segundos** entre o commit do pedido no Magento e a aparição do mesmo pedido como documento contábil no SAP FI. Durante essa janela, o pedido está em estado intermediário: confirmado para o cliente, mas ainda não totalmente integrado. Para mitigar visibilidade dessa inconsistência para o cliente final:

- O estoque é decrementado no Magento de forma otimista no commit do checkout (não aguarda confirmação do SAP).
- A confirmação por e-mail é disparada apenas após o callback do hop 7 (NF-e autorizada).
- O pedido só fica disponível para rastreamento via app/site após o callback completo.

Casos extremos de inconsistência (>30 segundos) são detectados por job de reconciliação que roda a cada 5 minutos. O job compara `apex_outbox_orders` (Magento) com `tbl_pedidos_b2b` (TOTVS) e gera alerta se houver divergência. Histórico Q1-2026: 0,07% dos pedidos disparam alerta (3.400 em ~4,9 milhões processados) — esses são reconciliados manualmente por Diego com base no runbook P11.

---

## Página 3 — Tecnologias envolvidas (parte 1/2)

### 3.1 Inventário completo

A tabela abaixo consolida versões, hosting e ownership de cada componente do stack. Sempre consultar essa tabela antes de abrir chamado com fornecedor — versão exata e contrato de suporte são pré-requisitos.

| Componente | Versão | Hosting | Owner | Suporte |
|---|---|---|---|---|
| SAP FI | 4.7 EHP8 SP18 | On-prem Cajamar (Oracle 19c) | Marina | Fornecedor SAP (contrato SuperCare) |
| TOTVS Protheus | 12.1.33 build 7.00.231003 | On-prem Cajamar (MSSQL 2019 STD) | Marina | Fornecedor TOTVS (TOTVS Mais) |
| Magento Commerce | 2.4.6-p4 | Azure VM Standard_D8s_v5 | Diego (operação) | Adobe + parceiro Vtex Implementer |
| RabbitMQ | 3.11.18 (cluster 3 nodes) | Azure VMs Standard_E4s_v5 | Bruno | Open-source + Pivotal Tanzu (consultoria sob demanda) |
| Azure Service Bus | Premium · 1 MU | PaaS managed | Bruno | Microsoft (Premium Support) |
| Apex Integration Adapter | .NET 8.0 · v3.2.1 | AKS `aks-apex-prod-eastus2` | Bruno | Interno (PR via apex/order-sync) |
| Frota.io webhook bridge | Azure Functions Premium · runtime v4 | `func-apex-frota-bridge` | Diego (operação) | Frota.io (best effort) |

### 3.2 SAP FI 4.7 EHP8 — pontos críticos

A instância SAP é single-stack ABAP (sem Java Stack adicional). Essa decisão arquitetural foi tomada por Bruno em Q1-2024 com a justificativa de reduzir surface de patch e simplificar o procedimento de DR. Funcionalidades que tradicionalmente exigem Java Stack (como Adobe Document Services para formulários PDF) foram externalizadas para o Magento ou para o Adapter via REST.

O banco Oracle 19c é versão Enterprise Edition com licença SAP-OEM (licença Oracle paga via contrato SAP, não diretamente). Tem Data Guard configurado para standby físico no site secundário de Tamboré, 50 quilômetros da sede principal. O lag de replicação é monitorado continuamente — alertamos se passar de 10 segundos por mais de 5 minutos.

O backup full diário roda às 03h00 BRT via runbook `BR/MS_SAP_BACKUP` (responsável: equipe Basis terceirizada). Backups incrementais a cada hora. Retenção: 14 dias on-disk, 90 dias em Azure Blob Storage cool tier, 7 anos em archive tier (compliance fiscal).

O patch level atual é Support Package 18, com 14 SAP Notes manuais aplicadas além do support pack. A lista completa de Notes está em `/sap/notes-applied-q2-2026.txt` (acesso restrito Marina + Bruno + Basis). Toda Note adicional passa por aprovação dual — Marina valida impacto funcional, Bruno valida impacto técnico.

### 3.3 Customizações ABAP em produção

Apesar de a estratégia ser "manter SAP standard onde possível", existem 23 customizações ABAP em produção. As mais relevantes para este runbook:

- **ZAPEX_NFE_VALIDATE:** valida CFOP antes da emissão da NF-e. Executado como user exit no BAPI `BAPI_ACC_DOCUMENT_POST`. Foi a primeira linha de defesa contra a Rejeição 539 (TKT-3), mas a validação completa só funcionou após o complemento ADVPL no TOTVS — ver Página 9.
- **ZAPEX_AUDIT_LOG:** grava em tabela Z toda alteração em documentos contábeis críticos (campos `BUKRS`, `BELNR`, `BLART`, `WAERS`). Auditado pela KPMG anualmente.
- **ZAPEX_CFG_DASHBOARD:** dashboard SAP GUI custom (tx `ZAPEX_DASH`) que mostra IDocs em status 51 + filas RabbitMQ + dump count em ST22. Marina abre essa transação como primeira ação ao receber escalação.
- **ZAPEX_RECON_OUTBOX:** job batch que reconcilia tabela `apex_outbox_orders` (Magento) com `BKPF` (SAP FI). Roda diariamente às 04h00 e gera relatório em `/sap/reports/recon-outbox-{data}.csv`. Cobre os 0,07% de pedidos divergentes mencionados na seção 2.4.
- **ZAPEX_PIX_RECONCILE:** processa retornos PIX da adquirência. Recebe arquivo CNAB 240 e gera lançamentos contábeis automáticos. Crítica para TKT-47 (PIX órfãos sem identificação).
- **ZAPEX_SPED_VALIDATE:** valida arquivos SPED antes da transmissão para o fisco. Detecta inconsistências de CFOP/CST/NCM antes que o PVA-SPED rejeite. Reduziu rejeições SPED em 78% após implantação Q3-2025.

Toda customização ABAP segue o ciclo de vida formal: development → staging (`apex-stg-sap`) → quality (transport request) → production. Cada transport requer aprovação dual em Solution Manager (Marina técnica + Bruno arquitetural). Auditoria KPMG revisa anualmente o `Z_*` namespace inteiro.

---

## Página 4 — Tecnologias envolvidas (parte 2/2)

### 4.1 TOTVS Protheus 12.1.33

A versão atual é build 7.00.231003 (release de outubro de 2023, ainda sob suporte estendido TOTVS Mais até Q4-2027). Quatro AppServers balanceados via DNS round-robin formam a camada de aplicação. Cada AppServer é configurado para suportar até 800 conexões simultâneas — totalizando 3.200 conexões na capacidade nominal.

O LibServer é único (`protheus-lib.apex.local:7890`), o que cria um ponto único de falha conhecido. Mitigação: o LibServer está em VM virtualizada com snapshot horário; em caso de falha, restore demora cerca de 15 minutos. Plano Q3-2026: avaliar TOTVS Hybrid Cloud para mover LibServer para alta disponibilidade gerenciada pela TOTVS.

O DBAccess (`protheus-db.apex.local:7890`) faz a ponte ABL-MSSQL. Pool de conexões configurado em 200 por AppServer (800 no total). O cluster MSSQL Always-On tem três réplicas: primária em Cajamar, secundária síncrona em Cajamar (rack diferente), secundária assíncrona em Tamboré.

As 47 customizações ADVPL Apex estão versionadas no GitHub no repositório privado `apex-protheus-custom`. Deploys passam por pipeline CI que executa testes unitários ADVPL (via framework `apex-tlpp-tests`) e smoke test contra ambiente de staging Protheus (`apex-stg-totvs`). Marina aprova manualmente toda PR antes do merge para `main`. Releases para produção sempre na janela terça 03h-05h.

### 4.2 Magento 2.4.6

A versão `2.4.6-p4` é a patch level mais recente da release branch 2.4.6 (publicada em 2024-04-09). Stack adjacente: PHP 8.2, nginx 1.24, Elasticsearch 8.7 (indexação de catálogo), Redis 7.0 (cache + sessions). O Magento roda em modo de produção (`bin/magento deploy:mode:set production`) com cache habilitado em todos os níveis.

O plugin custom `Apex_OrderSync` v3.2.1 implementa a Outbox pattern descrita na Página 2. Os hooks principais:

- `Apex\OrderSync\Plugin\Order\SaveAfter` — intercepta `sales_order_place_after` e grava na Outbox.
- `Apex\OrderSync\Cron\FlushOutbox` — job a cada 5 segundos que publica pendentes no Service Bus.
- `Apex\OrderSync\Observer\StockSync` — recebe callbacks do Adapter para atualizar estoque local.

A publicação para o Service Bus usa a biblioteca oficial `azure/azure-sdk-for-php` v1.16. A autenticação é via Managed Identity através do Azure Identity Broker — sem credenciais em arquivo de configuração.

### 4.3 RabbitMQ cluster

O cluster de três nodes (`rabbitmq-node{01,02,03}.apex.local`) está distribuído em Availability Set Azure, garantindo que pelo menos dois nodes nunca compartilham o mesmo fault domain. As VMs são Standard_E4s_v5 (4 vCPU, 32GB RAM, premium SSD).

Quorum queues estão habilitadas para todas as filas críticas, com fator de replicação 3. Isso significa que uma mensagem só é considerada persistida após confirmação em maioria dos nodes. Filas best-effort (auditoria, notificações) usam Classic queues simples (não-replicadas) por economia de I/O.

Plugins habilitados: `rabbitmq_management` (UI em `http://rabbitmq.apex.local:15672`), `rabbitmq_shovel` (transferência de mensagens entre filas/clusters), `rabbitmq_federation` (replicação para cluster westus3 em DR), `rabbitmq_prometheus` (métricas para Grafana).

O acesso à Management UI é restrito por NSG Azure ao range corporativo e exige autenticação via Entra ID (federated com o RabbitMQ via plugin OAuth2). Apenas Marina e Bruno têm acesso administrativo. Diego tem acesso somente-leitura para troubleshooting de filas e DLQs.

### 4.4 Azure Service Bus Premium

O namespace `sb-apex-prod-eastus2.servicebus.windows.net` está configurado em tier Premium com 1 messaging unit, escalável até 16 sob demanda. Geo-replication ativa para `sb-apex-prod-dr-westus3.servicebus.windows.net` (passive replica).

Configurações de segurança:

- TLS 1.2 mínimo (TLS 1.0 e 1.1 desabilitados).
- Autenticação por Managed Identity exclusiva — SAS keys foram extintas em produção em Q4-2025 após auditoria PCI-DSS.
- Network rules permitem apenas range corporativo + IPs do AKS (gerenciado via Bicep IaC em `apex-infra-prod`).

Quotas relevantes para troubleshooting:

- Tamanho máximo de mensagem: 1MB (limit do tier Premium). Atingir 800KB dispara alerta P3.
- Quantidade máxima de mensagens em fila: 80GB.
- TTL default: 7 dias (configurável por subscription).
- Lock duration: 60 segundos (PeekLock no Adapter renova automaticamente via `RenewLockAsync`).
- Sessions concorrentes por subscription: 1.000 (suficiente para 5 marcas × 200 pedidos simultâneos).
- Auto-forwarding profundidade máxima: 4 hops (Apex usa 1 hop — sem cascateamento).
- Throttling: 1.000 mensagens/segundo por messaging unit (escalável até 16 MU = 16.000 msgs/s).

### 4.4.1 Configurações específicas do Service Bus Premium

Configurações que Marina e Bruno revisam mensalmente:

```bash
# Listar todos os topics e subscriptions do namespace
az servicebus topic list \
  --namespace-name sb-apex-prod-eastus2 \
  --resource-group rg-apex-messaging-prod-eastus2 \
  --output table

# Detalhe das mensagens em uma subscription específica
az servicebus topic subscription show \
  --namespace-name sb-apex-prod-eastus2 \
  --resource-group rg-apex-messaging-prod-eastus2 \
  --topic-name pedidos-b2b \
  --name apex-mercado-sub \
  --output table

# Métricas em tempo real
az monitor metrics list \
  --resource /subscriptions/{sub-id}/resourceGroups/rg-apex-messaging-prod-eastus2/providers/Microsoft.ServiceBus/namespaces/sb-apex-prod-eastus2 \
  --metric ActiveMessages,DeadletteredMessages,ScheduledMessages \
  --interval PT5M \
  --aggregation Total \
  --output table
```

Marina executa esses comandos antes de qualquer ação em Service Bus, especialmente durante incidentes.

### 4.5 Apex Integration Adapter (.NET 8 Worker Service)

O Adapter é o ponto central de orquestração entre Service Bus, Adapter e TOTVS. Desenvolvido em .NET 8 como Worker Service, deployado no AKS com 3 réplicas mínimas em produção (HPA escala até 10 com base em CPU + queue depth do Service Bus).

Componentes internos:

- **Service Bus Receiver:** consome mensagens do topic `pedidos-b2b` em PeekLock mode. Configurado com `PrefetchCount=10` e `MaxConcurrentCalls=20` para balancear throughput e backpressure.
- **JSON Schema Validator:** valida cada payload contra `pedido-b2b-v3.json` via library `NJsonSchema`. Falhas de schema vão para DLQ imediatamente com header `x-failure-reason=schema-validation-failed`.
- **Idempotency Cache:** usa Azure Cache for Redis (`apex-redis-prod-eastus2`) para deduplicar por chave `pedido_id + sequence_number` (TTL 7 dias).
- **TOTVS HTTP Client:** `HttpClientFactory` com Polly resilience policies (retry 3x backoff exponencial, circuit breaker 5-em-30s, timeout 5s).
- **OpenTelemetry Instrumentation:** spans automáticos para Service Bus, HTTP, Redis. Span manual para validação custom.
- **Health Check endpoint:** `/health` retorna status dos downstream dependencies (Service Bus, TOTVS, Redis). AKS usa para readiness probe.

A configuração é via `appsettings.json` + Azure Key Vault (secrets) + Environment Variables (feature flags). Imutável após deploy — qualquer mudança requer rollout.

Snippet de configuração resiliente (`Program.cs` simplificado):

```csharp
builder.Services.AddHttpClient<TotvsApiClient>(client =>
{
    client.BaseAddress = new Uri(config["Totvs:BaseUrl"]);
    client.DefaultRequestHeaders.Add("X-Apex-Source", "integration-adapter");
    client.Timeout = TimeSpan.FromSeconds(5);
})
.AddPolicyHandler(GetRetryPolicy())
.AddPolicyHandler(GetCircuitBreakerPolicy());

static IAsyncPolicy<HttpResponseMessage> GetRetryPolicy() =>
    HttpPolicyExtensions
        .HandleTransientHttpError()
        .WaitAndRetryAsync(3, retryAttempt =>
            TimeSpan.FromSeconds(Math.Pow(2, retryAttempt)));

static IAsyncPolicy<HttpResponseMessage> GetCircuitBreakerPolicy() =>
    HttpPolicyExtensions
        .HandleTransientHttpError()
        .CircuitBreakerAsync(5, TimeSpan.FromSeconds(60));
```

Deploys do Adapter seguem GitOps via Argo CD. Manifest no repositório `apex-infra-prod/argocd/apex-integration-adapter.yaml`. Rollback automático se readiness probe falhar por mais de 5 minutos pós-deploy.

---

## Página 5 — Fluxo de pedido B2B (7 hops com latência média)

A tabela abaixo é o coração operacional deste runbook. Latências p50/p95/p99 medidas em produção em Q1-2026 (janela de 90 dias, ~2.4M pedidos). Marina recalcula trimestralmente e atualiza o documento.

| Hop | Componente origem | Componente destino | Operação | p50 | p95 | p99 | SLO |
|---|---|---|---|---|---|---|---|
| 1 | Magento (checkout commit) | Outbox `apex_outbox_orders` | INSERT transacional | 12ms | 38ms | 110ms | <200ms |
| 2 | Outbox poller | Service Bus topic `pedidos-b2b` | Publish | 45ms | 140ms | 380ms | <500ms |
| 3 | Service Bus | Adapter (.NET 8 AKS pod) | Receive (PeekLock) | 80ms | 220ms | 510ms | <800ms |
| 4 | Adapter | TOTVS Protheus (REST `/api/pedidos`) | POST | 320ms | 890ms | 1.8s | <2s |
| 5 | TOTVS Protheus | RabbitMQ exchange `totvs.sap.posting` | Publish | 60ms | 180ms | 420ms | <500ms |
| 6 | RabbitMQ | SAP FI Bridge (Java SAP JCo) | Consume + RFC `BAPI_ACC_DOCUMENT_POST` | 1.2s | 3.4s | 7.1s | <8s |
| 7 | SAP FI Bridge | SEFAZ-SP NF-e webservice | POST `NfeAutorizacao4` | 2.8s | 6.7s | 14s | <30s (SEFAZ SLA) |

**Latência total p95 end-to-end:** aproximadamente 12 segundos. SLO interno: até 20 segundos para 99% dos pedidos. Pedidos que excedem 30 segundos sem completar disparam alerta P2 e Marina é notificada via PagerDuty.

### 5.1 Análise dos gargalos

O hop 6 (SAP FI BAPI) é historicamente o mais lento e o mais variável. A p95 de 3,4 segundos esconde uma cauda longa em horários de pico (final do mês, fechamento contábil) onde o p99 chega a passar de 7 segundos. Esse comportamento é esperado — o SAP serializa lançamentos por documento contábil, e a contenção em lock de tabela `BKPF` aumenta linearmente com o volume.

O hop 7 (SEFAZ) é externo e fora do nosso controle. O SLA contratual da SEFAZ-SP é de 30 segundos, mas em casos de manutenção ou pico nacional (ex: véspera de feriado) pode chegar a 45 segundos. Quando a SEFAZ-SP fica indisponível por mais de 15 minutos, ativamos o modo de contingência SCAN (Sistema de Contingência do Ambiente Nacional) automaticamente — ver Página 17 (escalação SEFAZ).

Hops 1 e 2 são consistentemente rápidos (<200ms p95) e raramente causam incidentes. Diego pode descartar esses hops como hipótese inicial quando triagear um ticket de "pedido demorando".

### 5.2 Observabilidade do fluxo

O TraceId é propagado via header `apex-trace-id` (compliant com W3C TraceContext) através de todos os hops. Cada hop emite um span no Azure Application Insights (workspace `appi-apex-prod`), permitindo que Marina visualize o fluxo end-to-end como um único gráfico de Gantt.

Query KQL universal de troubleshooting (cópia documentada também na Página 15):

```kusto
union traces, requests, exceptions, dependencies
| where timestamp > ago(1h)
| where customDimensions.apex_trace_id == "{trace-id-do-ticket}"
| project timestamp, itemType, name, message, resultCode, duration, customDimensions
| order by timestamp asc
```

Diego deve coletar o `apex-trace-id` do ticket HelpSphere antes de qualquer ação. Esse identificador é a chave que destrava todo o resto do troubleshooting.

### 5.3 Métricas agregadas em Grafana

O dashboard `Apex Integration Overview` (`https://grafana.apex.local/d/apex-int-overview`) consolida throughput, taxa de erro e latência por hop em painéis dedicados. Marina mantém esse dashboard como tela primária de monitoring durante incidentes. Alertas Grafana disparam automaticamente em `#apex-integracao-alerts` quando p95 de qualquer hop excede o SLO por mais de 5 minutos.

### 5.4 Volume de tráfego por marca

Distribuição típica do volume de pedidos B2B em dia útil normal (medição Q1-2026):

| Marca | Pedidos/dia (média) | Pico/hora | Sazonalidade |
|---|---|---|---|
| Apex Mercado | 2.800 | 480 (12h-13h) | Estável diária; pico fim de mês (recompra B2B) |
| Apex Tech | 1.400 | 320 (15h-17h) | Black Friday +480%, Natal +220% |
| Apex Moda | 850 | 180 (10h-11h, 19h-20h) | Sazonal por coleção (campanhas) |
| Apex Casa | 240 | 60 (14h-16h) | Estável; pico em datas comerciais (Mães, Pais) |
| Apex Logística | 4.200 | 980 (06h-08h, cutoff Frota 17h) | Estável diária; sem sazonalidade significativa |

Apex Logística domina volume porque consolida pedidos intra-grupo (transferências entre lojas e CDs). Apex Casa é a marca de menor volume mas maior ticket médio (R$ 4.700 vs R$ 480 da Apex Mercado).

### 5.5 Comportamento sob carga

Testes de carga executados em staging (`apex-stg-eastus2`) trimestralmente:

- **Linha de base (1× tráfego médio):** ~10.000 pedidos/hora distribuídos pelas 5 marcas. Latência p95 end-to-end: 12s.
- **Pico previsível (3× tráfego médio — Black Friday):** 30.000 pedidos/hora. Latência p95: 18s. Aceitável (abaixo do SLO 20s).
- **Pico extremo (5× tráfego médio — simulação de viralização):** 50.000 pedidos/hora. Latência p95: 31s. Acima do SLO; ação de mitigação requerida (scale-up do Service Bus para 4 MU + AKS HPA para 30 réplicas).

A capacidade nominal sustentada é de 25.000 pedidos/hora sem degradação. Capacidade burst (1 hora) é 50.000 pedidos/hora. Acima disso, throttling automático ativa no Service Bus.

---

## Página 6 — Tabela de filas RabbitMQ

O inventário completo das filas em produção, no vhost `/apex`, está abaixo. Esta tabela é atualizada por Marina sempre que uma nova fila é criada (revisão trimestral confirmando que filas obsoletas foram retiradas).

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

### 6.1 Detalhamento das filas críticas

A fila `totvs.sap.posting` é a artéria principal do fluxo. Tudo que precisa virar lançamento contábil no SAP passa por ela. Em condições normais, tem profundidade média de 12 mensagens — qualquer valor acima de 200 mensagens estáveis indica que o consumer SAP FI Bridge está travado ou degradado. O pico histórico (4.700 mensagens) foi registrado durante TKT-12 (4 horas e 11 minutos de degradação).

A fila `sap.fi.nfe.callback` recebe a confirmação de autorização da NF-e e dispara a atualização do pedido no Magento (via outro hop assíncrono). Por ser fluxo de callback, opera em best-effort com TTL curto (24h) — se o callback for perdido, o pedido fica em status "NF-e autorizada, sync pendente" e o Diego consegue reconciliar manualmente via comando admin do Magento.

A fila `sped.fiscal.batch` é dormente durante o mês e explode no fechamento. O pico de 47.000 mensagens é normal — todo o livro fiscal eletrônico do mês é processado em batch durante o último dia útil do mês. Marina monitora especialmente essa fila no penúltimo dia útil para garantir que o consumer está rodando.

### 6.2 Política de DLQ

Mensagens em DLQ por mais de 72 horas disparam alerta P3 automático no Slack `#apex-integracao-alerts`. A política é deliberadamente conservadora: muitas DLQs são casos legítimos (CNPJ inválido, pedido cancelado pelo cliente, produto fora de catálogo) que não precisam de reprocessamento. Marina revisa semanalmente o conteúdo de cada DLQ e decide caso-a-caso entre reprocessar, descartar ou abrir ticket.

Reprocessamento é feito via shovel manual:

```bash
rabbitmqctl set_parameter shovel reprocess-{nome-shovel} \
  '{"src-uri":"amqp://","src-queue":"{nome.fila.dlq}",
    "dest-uri":"amqp://","dest-queue":"{nome.fila}"}'
```

Após o reprocessamento, o shovel é deletado para evitar loops:

```bash
rabbitmqctl clear_parameter shovel reprocess-{nome-shovel}
```

Marina é a única autorizada a executar shovels em produção. Diego pode preparar a sintaxe e enviar para revisão via Slack DM — Marina aprova e executa.

### 6.3 Federation cross-region

Todas as filas Quorum estão federadas para o cluster RabbitMQ passivo em westus3. A federação opera em modo "upstream" — mensagens chegam ao cluster primário, são processadas localmente, e uma cópia é enviada para o cluster passivo. Em caso de DR (Página 19), o cluster passivo já tem todo o estado necessário para retomar operações.

Configuração da federation upstream (mantida em `apex-infra-prod/rabbitmq/federation.yaml`):

```yaml
upstream:
  - name: westus3-passive
    uri: amqp://passive-cluster.apex-westus3.local
    expires: 86400000
    message-ttl: 604800000
    prefetch-count: 1000
    reconnect-delay: 5
    ack-mode: on-confirm
    trust-user-id: false
    queue: ""  # federate all queues with matching policy
    exchange: ""
```

A política `federate-all-quorum` é aplicada via:

```bash
rabbitmqctl set_policy federate-quorum-queues \
  '^(totvs|sap|magento|sped)\.' \
  '{"federation-upstream-set":"westus3-passive"}' \
  --apply-to queues \
  --priority 10
```

O lag de federation é monitorado em Grafana (painel `RabbitMQ Federation Lag`). Lag esperado: <15 segundos p95. Lag >60 segundos dispara alerta P3 — Marina investiga conectividade cross-region.

### 6.4 Política de retenção e TTL

Cada fila tem TTL configurado de acordo com a criticidade do conteúdo:

- **Filas Quorum críticas (totvs.sap.posting, sap.fi.nfe.autorizacao, magento.outbox.sync):** TTL 7 dias. Margem ampla para troubleshooting fim de semana + análise post-mortem.
- **Filas Classic operacionais (callbacks, webhooks, notifications):** TTL 24-48h. Mensagens perdidas são tratadas com reconciliação manual ou ignoradas se obsoletas.
- **Fila Quorum SPED (sped.fiscal.batch):** TTL 90 dias. Necessário porque o fechamento SPED tem janela mensal — mensagens podem precisar ser reprocessadas até o último dia útil do mês seguinte.

Mensagens em DLQ não têm TTL específico — são mantidas até intervenção manual (Marina decide reprocessar ou descartar). Marina executa "limpeza de DLQ" trimestralmente (alinhada com fechamento de trimestre) para evitar acúmulo desnecessário.

### 6.5 Quorum queues vs Classic queues (decisão arquitetural)

A escolha entre quorum e classic queues é deliberada e segue regra:

- **Quorum queue** quando: perda de mensagem é inaceitável (lançamento contábil, fiscal, fluxo financeiro). Mensagem só é considerada persistida após replicação síncrona em maioria dos nodes.
- **Classic queue** quando: perda eventual de mensagem é aceitável e o throughput é prioridade. Mensagens são persistidas no node master apenas (replicação assíncrona se configurada).

Trade-off: quorum queues têm ~30% menos throughput que classic queues equivalentes. Mas a garantia de durabilidade compensa para fluxos críticos. Decisão documentada em ADR-09 (`apex-architecture-decisions/ADR-09-quorum-vs-classic-queues.md`).

---

## Página 7 — Limites e thresholds críticos

A tabela abaixo é o "mapa de minas" do runbook. Cada limite tem referência de incidente histórico (quando aplicável) e ação prescritiva para Diego executar ao atingir 80% do limite.

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

### 7.1 Interpretação dos thresholds

Os limites são deliberadamente alinhados em três níveis: limite duro (rígido, imposto pela plataforma), warning (75-80% do limite duro, dispara alerta P3), critical (90% do limite duro, dispara alerta P2 e Marina é notificada via PagerDuty). Diego só toma ação direta nos limites listados na coluna "Ação Tier 1" — fora desses, escala para Marina sem hesitar.

O limite de 256KB de payload no RabbitMQ é o threshold mais frequentemente acionado. Está documentado no procedimento P11 (Página 11-12) com toda a sequência de mitigação. Diego deve saber esse procedimento de cor — TKT-12 foi um incidente de 4 horas e 11 minutos com R$ 287.400 de GMV perdido.

O timeout SEFAZ de 30 segundos é definido pela SEFAZ-SP, não pela Apex. Quando atinge 25 segundos, suspeitamos de degradação no webservice deles. Diego aguarda 5 minutos e tenta novamente; se a degradação persistir, Marina ativa o modo SCAN. O monitoramento do status SEFAZ pode ser feito em tempo real no portal oficial: `https://www.nfe.fazenda.gov.br/portal/disponibilidade.aspx`.

### 7.2 Procedimento ao atingir threshold de warning

Quando qualquer warning dispara em `#apex-integracao-alerts`, Diego executa esta sequência em até 5 minutos:

1. Identifica o componente afetado e abre o dashboard Grafana correspondente.
2. Valida se o alerta é genuíno (não falso positivo de métrica). Falsos positivos típicos: spike de 5 segundos durante deploy programado.
3. Se genuíno, executa a "Ação Tier 1" da tabela acima.
4. Documenta a ação em thread do Slack (mesmo que a ação tenha resolvido — gera histórico para análise).
5. Se a ação não resolveu em 10 minutos, escala para Marina.

### 7.3 Procedimento ao atingir threshold critical

Critical é P2 ou superior. Marina é notificada via PagerDuty automaticamente. Diego deve:

1. Confirmar que Marina foi notificada (PagerDuty às vezes falha em entregar push).
2. Iniciar coleta de evidência (screenshots dashboard, traceIds, logs relevantes) para acelerar diagnóstico de Marina.
3. Comunicar áreas impactadas se houver impacto cliente final visível (Lia para B2B/B2C, comercial para B2B premium).
4. Manter thread Slack aberta com atualizações a cada 15 minutos até resolução.

### 7.4 Thresholds derivados (calculados em runtime)

Além dos limites estáticos, alguns thresholds são derivados em runtime para detectar anomalias relativas à baseline:

- **Throughput de pedidos:** alerta se queda >40% comparado à mediana das últimas 4 semanas no mesmo dia da semana e mesma hora. Detecta apagões silenciosos onde nada quebra mas o volume some.
- **Latência p95 hop-a-hop:** alerta se aumento >100% comparado à baseline. Detecta degradação progressiva.
- **Taxa de erro por componente:** alerta se aumento >300% comparado à baseline. Detecta novos modos de falha.
- **Disk IOPS Oracle:** alerta se p95 >5.000 IOPS por mais de 10 minutos (vs baseline 1.500 IOPS). Detecta query mal-otimizada em produção.

Esses thresholds são implementados via Azure Monitor "Dynamic Thresholds" feature. A vantagem é evitar tunning manual constante — o monitor aprende sazonalidade.

### 7.5 Falsos positivos conhecidos

Padrões de falsos positivos que Diego deve reconhecer e ignorar:

1. **Spike de 5-10 segundos durante deploy AKS programado:** rollout pode causar brief drop em throughput. Aguardar 5 minutos antes de escalar.
2. **Latência alta às 03h-04h:** janela de backup Oracle SAP pode causar lentidão temporária. Não é sintoma de problema.
3. **DLQ acumulada após reprocessamento massivo:** quando Marina executa shovel, mensagens podem retornar à DLQ em batch (failure rate aumentado). Ignorar se decorrente de ação manual conhecida.
4. **CPU AKS alta após HPA scale-up:** novas réplicas demoram ~60s para entrar em rotação. Métrica temporariamente alta. Aguardar.
5. **TOTVS connection count alto em fechamento mensal:** Job ZAPEX_RECON_OUTBOX abre múltiplas conexões. Esperado nos primeiros 2 dias úteis do mês.

A planilha `false-positives-catalog.xlsx` no SharePoint mantém o catálogo atualizado. Marina revisa trimestralmente.

---

## Página 8 — NF-e rejeições mais frequentes (top 10 SEFAZ-SP)

Cobertura: 100% das rejeições Q1-2026 caíram em uma destas 10 categorias. A tabela abaixo é o resultado de análise consolidada feita por Marina no fechamento do trimestre.

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

### 8.1 Tratamento por severidade

Rejeições de severidade **Alta** (código 539) representam quase metade dos incidentes e exigem treinamento contínuo. Diego está autorizado a fazer triagem mas não resolução — escalação para Marina é imediata após identificação. O procedimento P9 (Páginas 9-10) cobre o passo-a-passo completo.

Rejeições de severidade **Média** (240, 778, 226, 228, 610) representam o "long tail" e geralmente são resolvidas por correção de cadastro mestre. Marina mantém uma planilha trimestral de SKUs/clientes com cadastro problemático e prioriza correções proativas.

Rejeições de severidade **Baixa** (694, 563, 404) são geralmente isoladas (um único SKU ou cliente). Diego pode resolver sozinho em casos triviais (ex: NCM expirado — atualizar para TIPI vigente), mas sempre documenta a ação em ticket HelpSphere para Marina auditar posteriormente.

A rejeição **999** ("Erro não catalogado") é tratada como variável — pode ser desde uma manutenção rotineira da SEFAZ (sem ação necessária, esperar 15 minutos) até um erro novo que ainda não documentamos. Diego sempre consulta o portal SEFAZ antes de escalar.

### 8.2 Tendências Q1-2026

A frequência da Rejeição 539 (47%) está acima da média histórica (35% Q4-2025, 32% Q3-2025). Marina investiga a hipótese de que pedidos B2B interestaduais cresceram em volume após expansão da Apex Logística para a região Sudeste em janeiro de 2026 — e o cadastro de CFOP no Magento ainda não foi totalmente atualizado para refletir esse cenário.

Plano corretivo Q2: revisar todas as regras de CFOP no plugin `Apex_OrderSync` e adicionar validação proativa no checkout (alertar o operador comercial quando o pedido provavelmente vai rejeitar antes mesmo de submeter para o ERP).

A Rejeição 240 (duplicidade) ficou estável em 18% — é praticamente todo resultado de retry após timeout SEFAZ. Mitigação proativa: implementar idempotência mais robusta no hop 7 com chave `chNFe + nProt`.

### 8.3 Onde consultar o manual SEFAZ completo

O manual oficial das rejeições é a "Tabela de Mensagens de Retorno" publicada pela SEFAZ nacional, disponível em `https://www.nfe.fazenda.gov.br/portal/listaConteudo.aspx?tipoConteudo=tW+YMyk/50s=`. A versão usada como referência neste runbook é a 7.00 (vigente Q2-2026).

Para troubleshooting específico de SEFAZ-SP (que tem algumas regras particulares acima do padrão nacional), consultar `https://www.fazenda.sp.gov.br/sefaz/eletronica/`. Marina mantém uma cópia local impressa da tabela mais frequente colada no monitor — vale a pena para Diego ter também.

### 8.4 Códigos SEFAZ não listados no top 10 (cauda longa)

Há outras 12 rejeições que aparecem ocasionalmente. Diego deve reconhecer mesmo sem ter procedimento dedicado:

- **204:** Duplicidade de NF (mesma chave já emitida). Variante de 240. Causa típica: retry sem deduplicação.
- **531:** Total tributos não informado quando obrigatório. Causa: bug em produto recém-cadastrado sem regras tributárias.
- **663:** Alíquota ICMS incompatível com a operação. Causa: alíquota interestadual aplicada em operação intra-estadual ou vice-versa.
- **697:** Tipo de NF inválido para a operação. Causa: NF-e 4.0 emitida quando deveria ser NFC-e 65 (cliente final).
- **748:** Documento referenciado inexistente. Causa: tentativa de complementar NF que ainda não foi autorizada.
- **766:** Tipo de assinatura digital inválido. Causa: certificado A3 sendo usado quando deveria ser A1 (raro).
- **791:** Erro no serviço SEFAZ. Causa: problema interno da SEFAZ, sem ação Apex.
- **806:** Município destino não pertence à UF informada. Causa: cadastro IBGE desatualizado no TOTVS.
- **855:** Forma de pagamento inválida. Causa: pagamento PIX em NF-e antiga (formatos pré-2021).
- **897:** Indicador presença consumidor inválido. Causa: e-commerce sem indicador correto de "operação não presencial".
- **905:** Total ICMS-ST inválido. Causa: cálculo de substituição tributária divergente entre Magento e TOTVS.
- **999:** Erro não catalogado SEFAZ. Já mencionado no top 10.

Para cada um desses códigos, Marina mantém uma "ficha técnica" interna com diagnóstico esperado. O acesso é via `apex-runbook-attachments/sefaz-codes-cauda-longa.md`.

### 8.5 Análise mensal de rejeições

Marina executa análise mensal nas rejeições Q-a-Q. O relatório inclui:

1. **Top 5 códigos do mês:** identificação de tendências emergentes.
2. **Marca mais afetada:** Apex Mercado domina em volume, mas Apex Tech tem maior taxa por pedido.
3. **Horários de pico de rejeição:** geralmente correlacionado com horário de pico SEFAZ (final do mês fiscal).
4. **Tempo médio de resolução por código:** identificar gargalos de processo.
5. **Custos associados:** estimativa de impacto (pedidos perdidos, retrabalho).

O relatório é enviado para Bruno + Carla mensalmente. Padrões anômalos disparam ação corretiva imediata.

---

## Página 9 — Procedimento P9: troubleshooting Rejeição 539 (parte 1/2)

**Contexto-âncora:** TKT-3 do HelpSphere — Apex Mercado, restaurante PJ com CNPJ 12.345.678/0001-90, pedido B2B de R$ 18.430 em hortifruti e bebidas. NF-e rejeitada pela SEFAZ-SP com código 539 (CFOP incompatível). Pedido travado na expedição há 4 horas, com cliente cobrando entrega para o almoço do dia seguinte.

Cenário recorrente: 47% das rejeições Q1-2026.

### 9.1 Identificação inicial (Diego, Tier 1)

1. Diego recebe o ticket no HelpSphere com tag `nfe-rejeitada`. Tempo desde abertura: anota como `T+0`.

2. Coleta o `apex-trace-id` do ticket. Esse identificador é gerado pelo Magento no momento do checkout e propagado por todos os hops. Está visível na descrição do ticket ou nos metadados HelpSphere (campo `trace_id`).

3. Acessa o Application Insights:
   - URL: `https://portal.azure.com → Application Insights → appi-apex-prod`
   - Query KQL para identificar o erro SEFAZ:

```kusto
traces
| where timestamp > ago(2h)
| where customDimensions.apex_trace_id == "{trace-id-do-ticket}"
| where message contains "SEFAZ" or message contains "Rejeicao"
| project timestamp, message, customDimensions.cfop, customDimensions.pedido_id, customDimensions.uf_origem, customDimensions.uf_destino
| order by timestamp asc
```

4. Da query, anota três valores críticos:
   - **Chave de acesso NF-e:** 44 dígitos, formato `35260512345678000190550010000000451123456789`.
   - **CFOP usado:** ex `5102`.
   - **UF origem → UF destino:** ex `SP → RJ`.

5. Validação básica do CFOP: se a UF de destino é diferente da UF de origem, o CFOP **deve** começar com `6` (interestadual). Se começa com `5` (intra-estadual), está incorreto. Esse é o cenário TKT-3.

### 9.2 Diagnóstico do CFOP incorreto

A tabela CFOP rápida do Anexo II (Página 22) cobre os 15 códigos mais usados pelo Apex. A regra geral:

- **Operações dentro do mesmo estado (SP→SP, RJ→RJ, etc.):** CFOP `5xxx` (5102 venda mercadoria de terceiros, 5403 venda com substituição tributária, 5405 venda com ST varejo, 5910 remessa para bonificação, etc.).
- **Operações entre estados diferentes (SP→RJ, MG→PR, etc.):** CFOP `6xxx` (6102, 6403, 6405, etc.).
- **Operações de devolução/entrada:** CFOP `1xxx` ou `2xxx`.

No caso TKT-3, o sistema usou CFOP 5102 mas o restaurante está em Campinas-SP comprando para uma filial em Rio Claro-RJ. O endereço de entrega no pedido foi RJ, portanto deveria ser CFOP 6102. O cadastro da matriz em SP confundiu o motor de cálculo do Magento, que não validou o endereço de entrega como gatilho de CFOP interestadual.

### 9.3 Verificação no TOTVS Protheus

Para confirmar que o cadastro do cliente está consistente e que a inconsistência é só de CFOP:

1. Acessar TOTVS Protheus via SmartClient:
   ```
   SmartClient.exe -e=Apex-Producao -P=8081
   Usuario: diego.silva
   Senha: ********
   ```

2. Navegar até o módulo SIGAFAT (Faturamento):
   ```
   SIGAFAT → Consultas → Pedido de Venda (MATA410)
   ```

3. Inserir o número do pedido (ex `00045821`) e pressionar F4 para detalhar.

4. Na aba "Cadastro do Cliente", confirmar:
   - **Razão social** consistente com o pedido.
   - **CNPJ** consistente.
   - **Endereço de entrega** — este é o campo crítico. Se a UF aqui for diferente da UF da matriz, o CFOP deveria ser interestadual.

5. Na aba "Notas Fiscais", verificar:
   - **CFOP por item** — todos têm o mesmo CFOP ou há mistura?
   - **Status NF-e** — `Rejeitada` com código 539.
   - **Protocolo SEFAZ** — anotar para auditoria.

**REGRA INVIOLÁVEL:** Diego **não altera** nada no TOTVS. A correção do CFOP é responsabilidade exclusiva de Marina, pois envolve estorno SAP FI + cancelamento de pedido TOTVS + reemissão de NF-e. Qualquer alteração feita por Diego pode causar inconsistência irreversível em registros já enviados ao fisco.

### 9.3.1 Verificação no Magento (origem do pedido)

Em paralelo à verificação no TOTVS, Diego pode consultar o Magento para confirmar o que o e-commerce enviou originalmente:

```sql
-- Conexão MSSQL Magento (instância apex-magento-mssql-prod)
SELECT
    o.entity_id AS magento_order_id,
    o.increment_id AS pedido_humano,
    o.status,
    o.customer_email,
    osa.region AS uf_origem,
    osa_ship.region AS uf_destino,
    o.subtotal,
    o.tax_amount,
    o.grand_total,
    aox.cfop_calculado,
    aox.status AS outbox_status,
    aox.last_error
FROM sales_order o
JOIN sales_order_address osa ON o.entity_id = osa.parent_id AND osa.address_type = 'billing'
JOIN sales_order_address osa_ship ON o.entity_id = osa_ship.parent_id AND osa_ship.address_type = 'shipping'
LEFT JOIN apex_outbox_orders aox ON o.entity_id = aox.magento_order_id
WHERE o.increment_id = '000045821';
```

Resultado esperado: tabela mostrando UF origem, UF destino, CFOP calculado pelo Magento. Se a UF de billing for SP mas a UF de shipping for RJ, e o CFOP for 5102, confirma o problema.

### 9.4 Escalação para Marina

Após confirmar o diagnóstico, Diego escala para Marina via Slack DM:

```
@marina.oliveira
TKT-3 (HelpSphere ticket-id 3) — NF-e rejeitada 539
trace-id: 8f3a9b2c-...
pedido TOTVS: 00045821
CFOP usado: 5102 (intra-estadual)
UF destino: RJ (deveria ser CFOP 6102 interestadual)
cliente CNPJ: 12.345.678/0001-90
total: R$ 18.430
urgência: cliente cobra entrega almoço amanhã
```

Tempo desde abertura: `T+25min` (objetivo: <30 minutos para escalar).

---

## Página 10 — Procedimento P9: troubleshooting Rejeição 539 (parte 2/2)

### 10.1 Resolução pela Marina (Tier 2)

Marina executa o procedimento de correção em quatro passos, sempre nessa ordem (a ordem importa — estornar antes de cancelar evita inconsistência fiscal).

**Passo 1: Estornar o documento contábil no SAP FI**

```
SAP GUI → /n → FB08
  Empresa: AP01
  Exercício: 2026
  Número documento: {numero-doc-financeiro-do-pedido}
  Enter
  Marcar "stornieren" (estornar)
  Motivo do estorno: 01 (Erro de lançamento)
  Save (F11)
```

O estorno gera um documento de compensação no SAP FI com referência cruzada para o original. Marina confirma a contabilização na transação FB03 (display de documento).

**Passo 2: Cancelar o pedido no TOTVS Protheus**

```
SmartClient → SIGAFAT → MATA410 (Pedido de Venda)
  Filtrar pelo número 00045821
  F12 ("Cancelar")
  Motivo: CFOP incompatível — refazer
  Confirmar
```

O cancelamento dispara automaticamente uma mensagem de "pedido cancelado" para a fila `apex.audit.events` no RabbitMQ, que vai para o histórico no Application Insights.

**Passo 3: Recriar o pedido com CFOP correto**

Marina publica manualmente uma mensagem no exchange `totvs.sap.posting` com o CFOP corrigido. Pode fazer via Management UI do RabbitMQ (interface gráfica) ou via CLI:

```bash
rabbitmqadmin -V /apex publish \
  exchange=totvs.sap.posting \
  routing_key=pedido.criar \
  payload='{
    "pedido_id":"00045822",
    "tenant_id":"11111111-1111-1111-1111-111111111111",
    "cliente_cnpj":"12.345.678/0001-90",
    "cfop":"6102",
    "uf_origem":"SP",
    "uf_destino":"RJ",
    "total":18430.00,
    "itens":[...]
  }'
```

O Adapter consome essa mensagem e dispara o fluxo normal a partir do hop 5 (RabbitMQ → SAP FI Bridge).

**Passo 4: Validar e atualizar o ticket**

Marina aguarda o callback de NF-e autorizada na fila `sap.fi.nfe.callback` (latência típica ~12 segundos p95). O callback contém a nova chave de acesso (44 dígitos). Marina:

- Atualiza o ticket HelpSphere com a nova chave + protocolo SEFAZ.
- Marca o status como "Resolvido" e move para Diego dar follow-up com o cliente.
- Documenta no comentário interno do ticket: "Rejeição 539 — CFOP corrigido de 5102 para 6102 (operação interestadual SP→RJ)".

### 10.2 Prevenção (Bruno, decisão técnica)

A causa-raiz da Rejeição 539 é o motor de cálculo do CFOP no plugin Magento não considerar o endereço de entrega como gatilho de interestadualidade. Bruno priorizou correção arquitetural em Q2-2026:

- **Trigger ADVPL `apex_validate_cfop.prw`:** adicionada no TOTVS. Valida antes do INSERT na tabela `SC5010` (cabeçalho pedido) e rejeita se UF entrega != UF origem com CFOP `5xxx`.
- **Teste unitário no pipeline CI:** `tests/cfop_validation_test.tlpp` cobre 12 cenários (SP→SP, SP→RJ, SP→MG, etc.) com CFOPs intra/interestaduais.
- **Cross-reference para arquitetura:** o diagrama da regra está em `docs/integracao/cfop-validation.md` no repositório `apex-protheus-custom`.

Plano Q3-2026: refatorar o plugin Magento `Apex_OrderSync` para calcular o CFOP usando o endereço de entrega como fator primário, eliminando a dependência do trigger ADVPL como segunda linha de defesa.

### 10.3 Métrica de sucesso (Q1-2026)

- **MTTR alvo (Diego identifica + escala + Marina executa):** 40 minutos.
- **MTTR real medido em Q1:** 38 minutos (mediana, 22 incidentes).
- **MTTR p95:** 52 minutos.

Outliers (>1 hora) são geralmente casos em que Marina não está disponível imediatamente (almoço, reunião). Plano: ampliar pool de Tier 2 com mais um analista para cobertura redundante.

### 10.4 Casos especiais não cobertos por P9

Algumas variantes da Rejeição 539 não são CFOP intra/interestadual — são cenários menos comuns:

- **CFOP correto mas natureza da operação errada:** ex CFOP 5949 ("outra saída não especificada") usado em venda regular. Marina diagnostica via consulta cruzada da natureza da operação no SAP (tx `OBA7`).
- **Operação extrazona (SUFRAMA, ZFM):** CFOPs especiais para Zona Franca de Manaus. Apex não opera em ZFM — se aparecer, Marina escala para fornecedor SAP para investigar cadastro estranho.
- **Substituição tributária errada:** CFOP `xx03` quando deveria ser `xx02`. Resolução é a mesma sequência de 4 passos, mas o pedido pode precisar ser reprecificado (ICMS-ST afeta o total).

Para esses casos, Marina pode escalar para Bruno (Tier 3) e/ou para o fornecedor SAP via launchpad de suporte. Histórico Q1-2026: 3 casos especiais, todos resolvidos em até 4 horas.

### 10.5 Comunicação com cliente final (Diego pós-resolução)

Após Marina resolver tecnicamente o caso, Diego retoma o ticket no HelpSphere e comunica o cliente. Template padrão para Rejeição 539 resolvida:

```
Prezado(a) {nome-cliente},

Identificamos uma divergência no código fiscal (CFOP) aplicado à NF-e do seu
pedido #{numero-pedido}. A nota fiscal original foi cancelada e uma nova foi
emitida com a classificação correta para operação interestadual.

Detalhes da nova NF-e:
- Chave de acesso: {chave-44-digitos}
- Protocolo SEFAZ: {protocolo}
- Data de autorização: {data-hora}

A entrega permanece programada para a janela original. Em caso de dúvidas,
estamos à disposição.

Atenciosamente,
Diego — Atendimento Apex Mercado
```

O template é mantido em `apex-helpsphere-templates/resolucoes/rejeicao-539-resolvida.txt`. Diego personaliza variáveis e envia via interface HelpSphere (canal preferencial do cliente: e-mail ou WhatsApp).

### 10.6 Casos onde escalar para Lia (Head Atendimento)

Em três cenários, Diego escala adicionalmente para Lia mesmo após resolução técnica:

1. **Cliente VIP (>R$ 50k/ano em compras):** Lia faz contato direto após Diego para reforçar relacionamento e oferecer crédito promocional como cortesia.
2. **Cliente menciona rede social ou imprensa:** Lia + Comunicação Corporativa avaliam risco reputacional e definem se há necessidade de comunicação proativa.
3. **Incidente afeta >5 clientes simultaneamente:** Lia + Comercial preparam comunicado padrão para alinhamento.

Em Q1-2026, 4 casos da Rejeição 539 envolveram clientes VIP. Todos resolvidos com escalação Lia + crédito promocional de R$ 200 a R$ 800 (alçada de Lia).

---

## Página 11 — Procedimento P11: troubleshooting ERP↔Magento sync (parte 1/2 — TKT-12)

**Contexto-âncora:** TKT-12 do HelpSphere — Apex Tech, severidade **CRÍTICA**. Desde 03h00 BRT da madrugada de ontem, 18% dos pedidos do e-commerce não estão sendo gravados no ERP TOTVS. Pedidos ficam com status `pending_sync` e o estoque não é baixado. Risco real de **overselling** em produtos com baixo estoque (TVs Samsung 75" QLED, smartphones iPhone 15 Pro). Causa-raiz identificada pelo time de TI: o RabbitMQ está rejeitando mensagens com payload acima de 256KB. Engenharia trabalhando em fix.

Esse incidente foi o pior do Q1-2026: 4 horas e 11 minutos de degradação, R$ 287.400 de GMV perdido.

### 11.1 Detecção (Diego)

A detecção típica acontece de duas formas:

**Forma 1 — Alerta automatizado.** O monitor do Application Insights dispara alerta quando a taxa de erro na fila `magento.outbox.sync` excede 5% em uma janela móvel de 10 minutos. O alerta vai para `#apex-integracao-alerts` e Diego recebe push notification do Slack.

**Forma 2 — Reclamação de operação comercial.** Vendedores reportam que o estoque do app/site não está zerando após vendas confirmadas. Esse sinal chega via tickets HelpSphere de categoria "Comercial" com tag `estoque-divergente`.

Diego confirma o sintoma com dois comandos:

1. Listar profundidade das filas relevantes:
```bash
rabbitmqctl list_queues -p /apex name messages messages_ready messages_unacknowledged | grep -E "(magento\.outbox|dlq)"
```

Saída esperada em incidente:
```
magento.outbox.sync                  3247  3247  0
magento.outbox.sync.dlq              412   412   0
```

Em condições normais, `magento.outbox.sync` tem profundidade <50 e DLQ tem <5 mensagens.

2. Consultar a tabela Outbox no MSSQL Magento:
```sql
SELECT COUNT(*) AS pending_count,
       MIN(created_at) AS oldest_pending,
       MAX(DATALENGTH(payload_json)) AS max_payload_bytes
FROM apex_integration.dbo.tbl_outbox_pending
WHERE status = 'pending_sync';
```

Se `pending_count > 500` e `max_payload_bytes > 200000` → confirmado o sintoma TKT-12.

Decisão de escalação: se DLQ tem mais de 100 mensagens em janela <30 minutos, escalar Marina **imediatamente**. Esse é o gatilho objetivo.

### 11.2 Diagnóstico (Marina, Tier 2)

Após recebida a escalação, Marina executa um diagnóstico estruturado em quatro passos.

**Passo 0 (paralelo): coletar evidência inicial.**

Marina abre 3 telas simultaneamente para acelerar diagnóstico:

1. Grafana dashboard `Apex Integration Overview` no monitor principal.
2. RabbitMQ Management UI (`http://rabbitmq.apex.local:15672`) no monitor secundário.
3. Application Insights workspace `appi-apex-prod` no laptop.

A query KQL "Q03 — Payload large orders" (Página 14.7) é executada imediatamente para confirmar o sintoma de payload size.

**Passo 1: Inspecionar mensagem em DLQ.**

```
RabbitMQ Management UI → http://rabbitmq.apex.local:15672
  Login: marina.oliveira@apex.local (federado Entra ID)
  Queues → magento.outbox.sync.dlq
  "Get Messages" → Requeue: No → Get Message
```

A mensagem retornada traz headers úteis:
- `x-first-death-reason`: deve mostrar `expired` (TTL atingido) ou `rejected` (consumer rejeitou explicitamente).
- `x-first-death-exchange`: confirma que a mensagem veio da fila esperada.
- `x-death`: lista todas as morte/reencaminhamentos da mensagem.

O **payload size** é o dado crítico. Se a mensagem em DLQ tem payload >256KB, confirma a hipótese TKT-12. Se está abaixo de 256KB, é outro problema (provavelmente erro de schema ou bug no Adapter).

**Passo 2: Quantificar o impacto.**

```sql
SELECT pedido_id, tenant_id, total, item_count,
       DATALENGTH(payload_json) AS payload_bytes,
       created_at,
       DATEDIFF(MINUTE, created_at, SYSUTCDATETIME()) AS minutes_pending
FROM apex_integration.dbo.tbl_outbox_pending
WHERE status = 'pending_sync'
  AND created_at < DATEADD(MINUTE, -30, SYSUTCDATETIME())
ORDER BY payload_bytes DESC;
```

A query retorna a lista de pedidos travados, ordenada por tamanho do payload (maiores primeiro). Marina analisa:
- Quantos pedidos estão travados? (>50 = crítico).
- Qual o tamanho médio do payload? Se >200KB, hipótese confirmada.
- Qual o tempo médio de bloqueio? (>30 minutos = impacto cliente final visível).

**Passo 3: Identificar padrão nos pedidos travados.**

Marina cruza a lista de pedidos com a tabela de produtos para entender o padrão. No incidente real TKT-12:
- 87% dos pedidos travados eram da Apex Tech.
- Todos continham SKUs com 3+ variantes (cor + tamanho + voltagem ou similar).
- O campo `customizacoes` no payload tinha em média 180KB sozinho (texto técnico de produto, descrições longas).

**Passo 4: Decisão de escalação Tier 3.**

Se mais de 50 pedidos travam com payload >200KB simultaneamente, o cenário deixa de ser operacional (resolução por reprocessamento) e passa a ser arquitetural (correção do código que gera payload inflado). Marina escala para Bruno (CTO Tier 3) — pode ser necessário hotfix urgente no Adapter ou no plugin Magento.

---

## Página 12 — Procedimento P11: troubleshooting ERP↔Magento sync (parte 2/2)

### 12.1 Mitigação imediata (Marina, autorizada por Bruno)

Em paralelo ao diagnóstico, Marina pode aplicar três mitigações de curto prazo para reduzir o impacto enquanto Bruno trabalha na correção definitiva.

**Mitigação 1: Aumentar temporariamente o limite de payload no RabbitMQ.**

```bash
# NÃO recomendado em produção sem aval de Bruno. Opção de último recurso.
# Aumenta limite para 512KB por mensagem (de 256KB padrão).
rabbitmqctl set_policy -p /apex max-payload \
  "^magento\." '{"max-length-bytes":524288}' \
  --apply-to queues
```

Essa mitigação resolve o sintoma imediato mas piora a saúde global do cluster — mensagens maiores degradam throughput de todas as filas. Só usar se Bruno autorizar explicitamente.

**Mitigação 2: Compactar payload no Adapter (hotfix temporário).**

O Adapter tem uma feature flag `APEX_ADAPTER_COMPRESS_PAYLOAD` que, quando ativada, comprime o JSON via Gzip antes de publicar no RabbitMQ:

```bash
kubectl set env deployment/apex-integration-adapter \
  APEX_ADAPTER_COMPRESS_PAYLOAD=true \
  -n apex-prod

kubectl rollout restart deployment/apex-integration-adapter -n apex-prod

# Validar que o rollout completou
kubectl rollout status deployment/apex-integration-adapter -n apex-prod
```

Compressão reduz payload em ~70% em payloads com texto repetitivo (descrições de produto, customizações). Isso traz a maior parte das mensagens para baixo de 256KB. O consumer SAP FI Bridge tem suporte transparente a payload comprimido desde v3.0.0 (verifica header `Content-Encoding: gzip`).

**Mitigação 3: Reprocessar pedidos em DLQ.**

Após aplicar uma das mitigações 1 ou 2, Marina move as mensagens da DLQ de volta para a fila principal via shovel:

```bash
rabbitmqctl set_parameter shovel reprocess-magento-outbox-tkt12 \
  '{"src-uri":"amqp://","src-queue":"magento.outbox.sync.dlq",
    "src-prefetch-count":50,
    "dest-uri":"amqp://","dest-queue":"magento.outbox.sync",
    "ack-mode":"on-confirm",
    "delete-after":"queue-length"}'
```

O `prefetch-count` baixo (50) evita reabrir o problema — processa em lotes pequenos para que o RabbitMQ não fique sobrecarregado. Após o shovel completar, Marina deleta o parâmetro:

```bash
rabbitmqctl clear_parameter shovel reprocess-magento-outbox-tkt12
```

### 12.2 Resolução definitiva (Bruno, Tier 3)

O fix arquitetural permanente foi entregue em PR no repositório `apex/order-sync` v3.2.2:

- **Diagnóstico de causa-raiz:** o payload publicado pelo Magento continha o objeto `product_attributes` completo para cada item do pedido (nome, descrição, marca, modelo, especificações técnicas, tags, categorias, preço de lista, preço promocional, histórico de preços). Esse objeto inflava o payload em ~70% para pedidos com produtos técnicos.
- **Solução:** remover `product_attributes` do payload Magento. O Adapter passa a re-buscar os atributos no momento do processamento via cache Redis (`apex-redis-prod-eastus2.redis.cache.windows.net`), reduzindo a carga na rede e mantendo os atributos sempre atualizados.
- **Validação:** smoke test em staging (`apex-stg-eastus2`) com 1.000 pedidos sintéticos cobrindo produtos com 1, 3, 5, 10 e 20 variantes. Resultado: payload p95 caiu de 240KB para 38KB.
- **Window de deploy:** terça 03h-05h (janela de manutenção autorizada — Página 18). Deploy executado em 2026-01-21 sem incidente.

### 12.3 Postmortem TKT-12

O documento completo está em `postmortems/2026-Q2/TKT-12-erp-magento-sync.md` (acesso restrito Engenharia + Liderança).

Resumo executivo:
- **Duração:** 4 horas e 11 minutos (03h00 a 07h11 BRT de 2026-01-14).
- **Impacto:** 18% dos pedidos do e-commerce travados em `pending_sync`. 412 pedidos afetados durante o pico.
- **GMV perdido:** R$ 287.400 (estimado por análise de pedidos cancelados pelos clientes que desistiram após espera).
- **Pedidos recuperados após mitigação:** 384 dos 412 (93%).
- **Pedidos perdidos definitivamente:** 28 (cliente cancelou antes da mitigação).

Lições aprendidas:
1. **Adicionar guardrails de payload size no CI pipeline.** Toda PR em `apex/order-sync` agora roda um teste que cria 100 pedidos sintéticos com vários níveis de complexidade e mede o payload resultante. Se p95 > 200KB, o build falha.
2. **Load test obrigatório para mudanças em `apex/order-sync`.** Antes do release, executar teste de carga em staging com 10.000 pedidos/minuto.
3. **Alerta proativo de payload size.** Application Insights agora monitora `payload_size_bytes` p95 e alerta quando passa de 150KB (warning) ou 200KB (critical).
4. **Documentar threshold de 256KB em todos os runbooks.** Está agora na Página 7.

Cross-reference: o documento `arquitetura-integracao.md` foi mantido inalterado (TKT-12 confirmou a necessidade do Outbox pattern + DLQ + circuit breaker — sem essas três defesas, o impacto teria sido catastrófico).

### 12.4 Procedimento de rollback (se hotfix falhar)

Se o hotfix v3.2.2 introduzir regressão (ex: produtos sem variantes começam a falhar), Marina executa rollback imediato:

1. Reverter deploy AKS para a versão anterior:
   ```bash
   kubectl rollout undo deployment/apex-integration-adapter -n apex-prod
   kubectl rollout status deployment/apex-integration-adapter -n apex-prod
   ```

2. Reverter o plugin Magento via Composer:
   ```bash
   ssh apex-magento-prod-01.apex.local
   cd /var/www/magento
   composer require apex/order-sync:3.2.1 --no-update
   composer update apex/order-sync
   bin/magento setup:upgrade
   bin/magento cache:flush
   ```

3. Validar que pedidos voltam a fluir normalmente (esperado em <5 minutos).

4. Documentar a regressão em ticket P1 e notificar Bruno + engenharia.

Rollback foi exercitado em staging mas nunca acionado em produção. Plano: incluir rollback no script de deploy para reduzir MTTR caso necessário.

### 12.4.1 Comunicação durante o incidente

Durante TKT-12 (4h11min de degradação), a comunicação foi crítica. Marina manteve uma thread Slack viva em `#apex-integracao-alerts` com atualizações a cada 15 minutos. Os principais marcos comunicados:

- **T+0min:** "Detectado: 18% pedidos `pending_sync`. Investigando."
- **T+15min:** "Causa-raiz identificada: payload >256KB rejeitado por RabbitMQ. Diego coletando evidência. Marina escalando para Bruno."
- **T+45min:** "Mitigação 2 (compressão) aplicada em staging. Validando antes de promover."
- **T+1h30min:** "Mitigação aplicada em produção. Throughput voltando ao normal. Iniciando reprocessamento DLQ."
- **T+2h15min:** "Reprocessamento DLQ em progresso. 280 de 412 pedidos recuperados."
- **T+3h45min:** "Reprocessamento concluído. 384 pedidos recuperados, 28 perdidos (cliente cancelou). Bruno preparando hotfix permanente."
- **T+4h11min:** "Incidente encerrado. Postmortem agendado para amanhã. Obrigado pela paciência."

Lia foi notificada às T+30min e coordenou comunicação para clientes B2B premium. Carla foi notificada às T+2h quando o impacto financeiro ficou claro (>R$ 200k de GMV perdido).

A thread Slack do incidente é referência interna usada em treinamentos. Marina compartilha com novos analistas Tier 2 como exemplo de comunicação durante incidente P1.

### 12.5 Métricas de saúde pós-hotfix (Q2-2026 esperado)

Após hotfix v3.2.2, as métricas-alvo são:

- Taxa de erro `magento.outbox.sync`: <0,5% (atualmente 0,3% Q1-2026 pós-hotfix).
- Payload size p95: <50KB (atualmente 38KB).
- Latência hop 5 (Magento → Service Bus): <100ms p95 (atualmente 78ms).
- Sem incidentes recorrentes do mesmo padrão.

Marina monitora essas métricas semanalmente. Se houver degradação, abre RCA proativo antes que vire incidente.

### 12.6 Cenários alternativos de falha no sync ERP↔Magento

Nem toda falha de sync é por payload size. Outros padrões observados:

**Cenário A — Magento gerando pedidos com SKU inexistente no TOTVS:**
- Sintoma: pedidos rejeitados pelo TOTVS com HTTP 400 "SKU não cadastrado".
- Causa: sincronização de catálogo Magento → TOTVS atrasada.
- Mitigação: forçar resync manual via comando `php bin/magento apex:catalog:sync-to-totvs`.
- Procedimento: Diego executa após confirmar com gerente comercial que o SKU realmente foi cadastrado recentemente.

**Cenário B — Pedido com estoque negativo:**
- Sintoma: TOTVS rejeita por "estoque insuficiente" mas Magento mostra disponível.
- Causa: divergência de cache de estoque (Redis Magento desatualizado).
- Mitigação: flush manual do cache Redis: `redis-cli -h apex-redis-prod-eastus2.redis.cache.windows.net FLUSHDB`.
- Procedimento: Marina coordena com comercial para decidir overselling (raro) vs cancelamento.

**Cenário C — Cliente PF (CPF) em pedido B2B:**
- Sintoma: TOTVS rejeita por "cliente não cadastrado como B2B".
- Causa: cliente PF tentando fazer compra em store B2B (raro, geralmente fraude).
- Mitigação: comercial valida intenção. Se legítimo, criar cadastro B2B; se fraude, bloquear.
- Procedimento: Diego escala para comercial + segurança.

**Cenário D — TOTVS LibServer indisponível:**
- Sintoma: HTTP 503 do TOTVS por mais de 1 minuto.
- Causa: LibServer caiu (single point of failure conhecido).
- Mitigação: equipe de infra restaura LibServer (snapshot horário disponível).
- Procedimento: Marina + infra coordenam; Diego comunica clientes se demora >15min.

**Cenário E — Pedido com valor zero (R$ 0,00):**
- Sintoma: TOTVS rejeita ou aceita com warning.
- Causa: brinde ou amostra grátis em catálogo paga.
- Mitigação: confirmar com comercial se é intencional. Se sim, usar CFOP 5910 (remessa de bonificação).
- Procedimento: caso raro; geralmente é erro de cadastro.

Cada cenário tem ticket-âncora histórico documentado em `apex-runbook-attachments/sync-failure-scenarios.md`.

---

## Página 13 — Procedimento P13: renovação token Frota.io webhook (TKT-15)

**Contexto-âncora:** TKT-15 do HelpSphere — Apex Logística. Desde ontem 17h00, o webhook do roteirizador Frota.io parou de receber pedidos do TMS Apex. Sintoma confuso: o callback retorna HTTP 200 OK mas os pedidos não aparecem na fila do Frota. Suspeita inicial (correta): token de API expirou e a renovação automática falhou silenciosamente.

Esse incidente impactou diretamente a operação de roteirização — o CD-Cajamar precisou reiniciar o processo manual de roteirização para garantir as entregas do dia seguinte, atrasando o cutoff diário em 90 minutos.

### 13.0 Visão geral do fluxo Frota.io

O Frota.io é o roteirizador externo contratado pela Apex Logística para otimização de entregas last-mile. Não é parte do stack principal mas tem integração via webhook crítica para a operação diária do CD-Cajamar.

O fluxo de integração TMS Apex → Frota.io tem 4 passos:

1. TMS Apex (Azure Functions `func-apex-tms-frota-bridge`) consolida pedidos pendentes de entrega ao final de cada turno.
2. Para cada pedido, dispara POST autenticado para `https://api.frota.io/v2/orders` com payload de origem, destino, peso, dimensões, janela de entrega.
3. Frota.io processa a roteirização (algoritmo proprietário) e retorna sugestão de rota + motorista alocado.
4. Resposta volta via webhook callback para `https://api.apex.local/webhooks/frota-io/route-confirmed`.

Esse fluxo opera em batch a cada 30 minutos durante operação normal, com cutoff fixo às 17h00 BRT para pedidos do dia seguinte. Fora do horário comercial, opera em modo on-demand para entregas urgentes.

### 13.1 Validação rápida (Diego)

A renovação de token JWT do Frota.io é uma operação rotineira que Diego está autorizado a executar sozinho (até três tentativas antes de escalar). O procedimento começa com validação do estado atual.

**Passo 1: Verificar status do webhook.**

```bash
curl -i https://api.frota.io/v2/webhooks/health \
  -H "Authorization: Bearer ${FROTA_TOKEN_ATUAL}"
```

Interpretação das respostas:
- **HTTP 200 + `{"status":"ok"}`:** token válido. Sintoma não é por expiração de token — investigar outras causas (firewall, rota, rate-limit).
- **HTTP 401 Unauthorized:** token expirado ou inválido. Seguir Passo 2 (renovação manual).
- **HTTP 403 Forbidden:** permissão revogada. Escalar Marina imediatamente — pode ser que o cliente Frota.io tenha bloqueado nossa integração (escalação fornecedor necessária).
- **HTTP 429 Too Many Requests:** rate-limit. Aguardar 5 minutos e tentar novamente.
- **HTTP 5xx:** problema na Frota.io. Aguardar 15 minutos; se persistir, escalar Marina + abrir chamado Frota.io.

**Passo 2: Decodificar o token JWT atual** para confirmar expiração.

```bash
# Extrai o payload do JWT (segunda parte separada por ponto)
echo $FROTA_TOKEN_ATUAL | cut -d. -f2 | base64 -d 2>/dev/null | jq '{exp, iat, sub}'
```

Saída esperada:
```json
{
  "exp": 1715515200,
  "iat": 1715428800,
  "sub": "apex-logistica-prod"
}
```

O campo `exp` é o timestamp Unix de expiração. Converter com:
```bash
date -d @1715515200
# Saída: Mon May 13 03:00:00 BRT 2026
```

Se a data já passou, confirma a expiração. Seguir para renovação manual.

### 13.2 Renovação manual (Diego, autorizado)

**Passo 1: Renovar token via endpoint refresh.**

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

Resposta esperada (HTTP 200):
```json
{
  "access_token": "eyJhbGciOi...",
  "token_type": "Bearer",
  "expires_in": 86400,
  "refresh_token": "rt_..."
}
```

O `expires_in` de 86400 segundos confirma que o novo token tem 24 horas de validade.

**Passo 2: Atualizar o secret no Azure Key Vault.**

```bash
# Atualiza o secret sem persistir no histórico Bash (uso de variável)
NOVO_TOKEN="eyJhbGciOi..."

az keyvault secret set \
  --vault-name kv-apex-prod-eastus2 \
  --name frota-io-access-token \
  --value "${NOVO_TOKEN}" \
  --expires "$(date -u -d '+24 hours' '+%Y-%m-%dT%H:%M:%SZ')" \
  --output none
```

O parâmetro `--expires` define a data de expiração no Key Vault para sinalização proativa (o secret entra em estado `nearExpiry` 7 dias antes).

**Passo 3: Reiniciar o pod do TMS para recarregar o secret.**

O pod usa Azure Key Vault CSI Driver, que monta o secret como arquivo. O restart força reload:

```bash
kubectl rollout restart deployment/apex-tms-frota-bridge -n apex-prod

# Validar rollout
kubectl rollout status deployment/apex-tms-frota-bridge -n apex-prod --timeout=120s
```

**Passo 4: Validar fluxo end-to-end.**

```bash
# Disparar um pedido sintético via API admin
curl -X POST http://apex-tms-frota-bridge.apex-prod.svc.cluster.local/admin/test-webhook \
  -H "X-Admin-Token: ${ADMIN_TOKEN}" \
  -d '{"test":true}'

# Verificar que apareceu na fila do Frota.io
curl https://api.frota.io/v2/orders/queue \
  -H "Authorization: Bearer ${NOVO_TOKEN}"
```

### 13.3 Reprocessamento de pedidos pendentes

Pedidos travados desde a expiração do token ficaram na fila `frota.io.webhook.dispatch.dlq` (TTL 24h, dentro do prazo de recuperação). Diego reprocessa com shovel temporário:

```bash
rabbitmqctl set_parameter shovel replay-frota-webhook \
  '{"src-uri":"amqp://","src-queue":"frota.io.webhook.dispatch.dlq",
    "src-prefetch-count":20,
    "dest-uri":"amqp://","dest-queue":"frota.io.webhook.dispatch",
    "ack-mode":"on-confirm",
    "delete-after":"queue-length"}'
```

Após reprocessamento completo, limpar o shovel:
```bash
rabbitmqctl clear_parameter shovel replay-frota-webhook
```

### 13.4 Prevenção definitiva (medidas Q1-2026 após TKT-15)

**Medida 1: Job de renovação proativa.**

Cronjob Kubernetes `frota-token-refresh` rodando a cada 18 horas (margem de 6 horas antes da expiração de 24h). Manifest em `apex-infra-prod/k8s/cronjobs/frota-token-refresh.yaml`. O CronJob falhou silenciosamente em TKT-15 por estar com memory limit baixo (`OOMKilled`). Após o postmortem, memory limit foi aumentado para 256Mi e adicionado alerta `CronJobFailed` para Diego.

**Medida 2: Alerta proativo.**

Application Insights monitora continuamente o TTL do token armazenado no Key Vault. Regra: "Frota Token TTL < 4h" → notifica `#apex-integracao-alerts` (P3) e tag Diego automaticamente. Esse alerta é a última linha de defesa antes da expiração efetiva.

**Medida 3: Failsafe no TMS.**

Caso o webhook falhe por mais de 30 minutos, o TMS automaticamente troca para fallback mode: grava os pedidos em arquivo CSV no Azure Blob Storage (container `apex-tms-fallback`) e envia notificação por e-mail para o time de logística do CD-Cajamar. Esse fallback evita perda de pedidos mesmo em cenário de DR.

**Cross-reference:** `faq_horario_atendimento.pdf` Página 1.2 (cutoff Frota.io 17h) — o incidente TKT-15 reforçou a importância do horário cutoff. A política atual proíbe deploys do TMS após as 15h00 BRT para evitar regressão durante o pico de roteirização.

### 13.5 Troubleshooting de webhooks similares

O padrão "token JWT expirado em webhook" se repete para outros 3 fornecedores Apex. Cada um tem renovação automática implementada, mas o procedimento de fallback manual segue o mesmo padrão P13:

**Webhook Cielo (adquirência):**
- Endpoint: `https://api.cielo.com.br/oauth2/token`
- TTL token: 1 hora (mais curto que Frota.io).
- Cronjob: `cielo-token-refresh` a cada 45 minutos.
- Em caso de falha: Diego executa renovação manual usando credenciais em `kv-apex-prod-eastus2/cielo-client-credentials`.

**Webhook Bacen PIX (recebimentos):**
- Endpoint: PSP do banco parceiro (varia por banco).
- TTL token: 24 horas.
- Cronjob: `pix-bacen-refresh` a cada 18 horas.
- Em caso de falha: Marina escala para tesouraria — PIX órfãos acumulam rapidamente.

**Webhook Senior (folha de pagamento):**
- Endpoint: `https://api.senior.com.br/auth`.
- TTL token: 8 horas.
- Cronjob: `senior-refresh` a cada 6 horas.
- Em caso de falha: Marina + RH alinham — eventos eSocial podem atrasar.

A documentação consolidada de webhooks externos está em `apex-runbooks/webhooks-catalog.md`. Diego consulta antes de executar P13 para confirmar qual webhook está afetado.

### 13.6 Lições aprendidas TKT-15

Quatro lições incorporadas após o postmortem:

1. **Memory limit de cronjobs deve ser dimensionado com margem.** O OOMKilled silencioso foi a raiz do incidente. Política atual: memory limit = 2× memory usage observado em load test.
2. **Alerta de cronjob failed deve ser P3 imediato, não diário.** Antes do incidente, alerta de cronjob failure só era reportado no relatório diário 09h00. Agora dispara real-time.
3. **TTL monitoring é mandatório para secrets críticos.** Application Insights monitora todos secrets com TTL <24h e alerta proativamente.
4. **Failsafe para serviços externos sem SLA é diferencial competitivo.** O fallback CSV para Frota.io evitou perda de pedidos. Plano: replicar padrão para Cielo, Bacen e Senior.

---

## Página 14 — Monitoring e observabilidade

### 14.1 Stack de observabilidade

O Apex Group adota uma stack híbrida de observabilidade, combinando ferramentas Azure-native com componentes open-source para flexibilidade e custo.

**Métricas:** Azure Monitor para componentes PaaS (Service Bus, AKS, App Service) e Prometheus para componentes self-managed (RabbitMQ via plugin `rabbitmq_prometheus`, SAP FI via exporters custom, TOTVS Protheus via scrapers ADVPL custom). As métricas Prometheus são federadas para o Azure Monitor via Azure Monitor managed service for Prometheus, permitindo consulta unificada via PromQL.

**Logs:** Azure Application Insights centraliza traces da camada de aplicação (.NET Adapter, Magento PHP, Java SAP JCo). Log Analytics workspace `log-apex-prod-eastus2` armazena logs estruturados de infraestrutura (Kubernetes audit logs, Azure activity logs, NSG flow logs). Logs de SAP FI (transações ST22, SM21) permanecem no banco SAP, com export diário para Storage Blob (compliance fiscal — 7 anos).

**Traces:** OpenTelemetry é o padrão. Todos os componentes do stack emitem spans para Application Insights (workspace `appi-apex-prod`). O TraceId propaga via header `apex-trace-id` que é compliant com W3C TraceContext. Marina usa o explorador de traces do Application Insights diariamente.

**Dashboards:** Grafana 10.4 (Azure VM Standard_D2s_v5, hospedada na rede corporativa). Datasources: Azure Monitor, Prometheus, Log Analytics, Application Insights. Provisionamento via IaC (Grafana provisioning files em `apex-infra-prod/grafana/`).

### 14.2 Dashboards principais

| Dashboard | URL | Owner | Visualizações |
|---|---|---|---|
| `Apex Integration Overview` | `https://grafana.apex.local/d/apex-int-overview` | Marina | Throughput por fila, taxa erro, p50/p95/p99 |
| `SAP FI Health` | `https://grafana.apex.local/d/sap-fi-health` | Marina | RFC concurrent calls, tablespace usage, dialog response time |
| `Magento E-commerce` | `https://grafana.apex.local/d/magento-ecom` | Diego | Pedidos/min, checkout abandon, Outbox lag |
| `RabbitMQ Cluster` | `https://grafana.apex.local/d/rabbitmq-cluster` | Bruno | Memory, disk, queue depth, network partition events |
| `SEFAZ NF-e Status` | `https://grafana.apex.local/d/sefaz-nfe` | Marina | Taxa rejeição por código, tempo resposta SEFAZ, NF-e/h |

O dashboard `Apex Integration Overview` é a tela primária durante incidentes. Marina mantém aberta em monitor secundário durante o expediente. Os painéis estão organizados em três linhas: (1) saúde global do fluxo, (2) detalhamento por componente, (3) histórico de incidentes recentes.

O dashboard `RabbitMQ Cluster` tem painéis específicos que ajudaram a diagnosticar TKT-12 rapidamente: gráfico de payload size distribuição por percentil, taxa de mensagens rejeitadas por motivo, ocupação de memória por queue.

### 14.3 Alertas Slack

Três canais Slack recebem alertas com priorização e ownership clara:

- **`#apex-integracao-alerts`:** P1 e P2. Marina e Bruno on-call (rotação semanal). PagerDuty integration ativa para escalação automática se alerta não for acknowledged em 5 minutos.
- **`#apex-tier1-ops`:** P3 e P4. Diego é tagueado automaticamente em horário comercial (08h-20h BRT). Fora desse horário, alertas P3/P4 ficam acumulados para revisão na manhã seguinte.
- **`#apex-postmortems`:** documentação consolidada de incidentes resolvidos. Bruno modera. Marina escreve o postmortem dentro de 48 horas após a resolução de qualquer P1 ou P2.

Cada alerta inclui no corpo:
- TraceId (clicável, abre Application Insights diretamente).
- Dashboard Grafana relevante (link direto).
- Procedimento (P9/P11/P13/etc.) sugerido baseado no padrão do alerta.
- Histórico de últimos 5 incidentes similares (link para Slack threads anteriores).

### 14.4 SLI e SLO definidos

Três SLIs principais são monitorados continuamente. O cumprimento é reportado mensalmente a Bruno e trimestralmente ao C-level (Carla, CFO/CTO).

**SLI 1 — Disponibilidade do fluxo de pedido B2B end-to-end.** Definição: porcentagem de pedidos B2B que completam do hop 1 ao hop 7 em menos de 30 segundos sem erro. **SLO:** 99,5% em janela de 30 dias. **Q1-2026 medido:** 99,2% (abaixo do SLO — distorcido por TKT-12).

**SLI 2 — Taxa de NF-e autorizadas no primeiro envio.** Definição: porcentagem de NF-e que não retornam rejeição da SEFAZ no primeiro POST. **SLO:** ≥95%. **Q1-2026 medido:** 91% (abaixo do SLO — distorcido pela Rejeição 539 frequente; debt aberto em Bruno).

**SLI 3 — MTTR para incidentes P1.** Definição: tempo entre abertura do incidente e resolução completa (não apenas mitigação). **SLO:** ≤45 minutos p95. **Q1-2026 medido:** 2h47min p95 (muito acima do SLO — TKT-12 puxou para cima). Excluindo TKT-12, p95 fica em 1h12min, ainda acima do SLO.

Plano Q2-2026: revisar o SLO 3 para 90 minutos p95 (mais realista para escopo TI atual) e investir em treinamento de Marina para reduzir MTTR através de runbooks mais granulares.

### 14.5 Sampling e custo

O Application Insights tem custo proporcional ao volume de telemetria ingerida. Em condições normais, o workspace `appi-apex-prod` consome ~30GB/dia (custo ~R$ 4.500/mês). Configurações de sampling estão calibradas para balancear visibilidade e custo:

- **Traces de sucesso (resultCode 200, 201, 204):** sampling adaptativo via `ApplicationInsights.AdaptiveSampling`. Reduz volume em ~80% sem perder representatividade.
- **Traces de erro (resultCode 4xx, 5xx):** sem sampling, 100% capturados. Decisão: erros são raros e fundamentais para troubleshooting.
- **Dependencies (chamadas HTTP, SQL, Redis):** sampling 50%. Suficiente para reconstruir fluxo end-to-end.
- **Custom events (eventos de negócio):** sampling 100%. Volume baixo, valor alto para análise.

Durante incidentes, sampling é desabilitado temporariamente (via feature flag `APEX_AI_SAMPLING_DISABLED=true`) para capturar 100% de eventos. Custo aumenta proporcionalmente — geralmente ~3-5× durante incidente P1. Decisão é de Bruno.

### 14.6 Retention e compliance

Diferentes tipos de log têm retenção diferente baseado em compliance:

- **Logs operacionais (Application Insights, Log Analytics):** 90 dias hot tier + 12 meses archive tier. Acesso via KQL.
- **Logs de segurança (Microsoft Defender, NSG flow logs):** 12 meses hot tier. Acesso restrito Bruno + Compliance.
- **Logs SAP (SM20 audit log):** 7 anos archive tier (Storage Blob com immutable policy). Compliance fiscal + auditoria KPMG.
- **Logs PIX (LGPD-sensitive):** 5 anos archive tier com encryption at rest. Acesso somente Compliance.
- **Logs de transação fiscal (NF-e, SPED):** 7 anos por exigência legal Receita Federal. Mantidos em SAP archive + backup paralelo Azure.

Política de retenção configurada via Azure Lifecycle Management. Bruno revisa anualmente para alinhar com mudanças regulatórias.

### 14.7 Custom Application Insights queries (KQL biblioteca)

Marina mantém biblioteca de queries KQL salvas no Application Insights workspace. As 10 mais usadas em troubleshooting:

```kusto
// Q01: Latência p95 hop-a-hop nas últimas 24h
dependencies
| where timestamp > ago(24h)
| where customDimensions.apex_component != ""
| summarize p95 = percentile(duration, 95) by customDimensions.apex_component, bin(timestamp, 1h)
| render timechart

// Q02: Taxa de erro por marca (tenant) últimas 4h
requests
| where timestamp > ago(4h)
| where customDimensions.tenant_id != ""
| summarize success = countif(success == true), failure = countif(success == false) by tostring(customDimensions.tenant_id)
| extend error_rate = todouble(failure) / (success + failure) * 100
| order by error_rate desc

// Q03: Pedidos com payload >200KB últimas 12h (gatilho TKT-12)
customEvents
| where timestamp > ago(12h)
| where name == "ApexOrderPublish"
| where todouble(customDimensions.payload_bytes) > 200000
| project timestamp, pedido_id = customDimensions.pedido_id, payload_bytes = customDimensions.payload_bytes, tenant_id = customDimensions.tenant_id
| order by payload_bytes desc

// Q04: NF-e rejeitadas por código nas últimas 24h
traces
| where timestamp > ago(24h)
| where message contains "Rejeicao"
| extend rejeicao_code = extract(@"Rejeicao (\d+)", 1, message)
| summarize count() by rejeicao_code
| order by count_ desc

// Q05: DLQ events últimas 6h
traces
| where timestamp > ago(6h)
| where message contains "DLQ" or message contains "deadlettering"
| project timestamp, queue = customDimensions.queue_name, reason = customDimensions.deadletter_reason
| order by timestamp desc
```

A biblioteca completa (47 queries) está em `apex-runbook-attachments/ai-queries.md`. Marina compartilha com Diego em sessões de pair-debugging para acelerar onboarding.

---

## Página 15 — Onde olhar os logs (cheatsheet por componente)

Esta página é um quick-reference para Diego durante triagem. Marina e Bruno têm acesso completo a todos os logs; Diego tem acesso somente-leitura à maioria.

### 15.1 Tabela mestra de logs

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

### 15.2 Detalhamento dos logs SAP

A transação **ST22** ("ABAP Runtime Errors") é o primeiro lugar onde Marina olha quando recebe escalação de "SAP FI travado" ou "BAPI falhando". Filtros úteis:
- Por data: últimas 24h.
- Por usuário: `RFC_APEX` (usuário técnico do TOTVS-SAP Bridge).
- Por programa: `SAPLF150` (RFC de posting contábil).

A transação **SM37** ("Job Overview") mostra todos os jobs em background. O job mais relevante é `BR_APEX_NFE_PROCESSAMENTO` (processa NF-e em lote durante fechamento). Verificar se o job tem cancelamentos ou abends frequentes.

A transação **SM21** ("System Log") consolida eventos de sistema (login falhado, conexão TOTVS-SAP perdida, locks demorados). Útil para forense pós-incidente.

A transação **SM59** ("RFC Destinations") permite testar conexões RFC. Quando o Adapter reclama que o TOTVS não responde, Marina usa SM59 para testar a conexão `TOTVS_APEX_PROD` e confirmar se o problema é de rede ou de aplicação.

### 15.3 Detalhamento dos logs RabbitMQ

Os logs do broker (`/var/log/rabbitmq/`) têm formato estruturado. Linhas relevantes para troubleshooting:

```
2026-05-11 14:23:45.123 [warning] <0.12345.0> Discarding message in queue 'magento.outbox.sync' because it is too large (300000 bytes; max-message-size is 262144 bytes)
2026-05-11 14:23:46.456 [error] <0.12346.0> Channel 'magento-publisher-pod-7c4f' shut down. Reason: {amqp_error,precondition_failed,"frame size exceeded",none}
```

A primeira linha confirma o cenário TKT-12 (payload >256KB rejeitado). A segunda linha mostra o efeito downstream: o channel é fechado e o publisher precisa reabrir.

A Management UI (`http://rabbitmq.apex.local:15672`) tem aba "Logs" útil para visualização rápida sem SSH. Limitação: só 24h de retenção em memória.

### 15.4 Detalhamento dos logs Magento

Magento separa logs por finalidade:
- `system.log`: eventos gerais do sistema.
- `exception.log`: exceções não capturadas.
- `debug.log`: logs em modo developer (deve estar **desabilitado** em produção; ativar apenas para debug específico).
- `apex/order-sync.log`: log custom do plugin Apex_OrderSync (rastreia Outbox + publish para Service Bus).

A tabela `apex_outbox_orders` mantém histórico de pedidos publicados, com colunas `status` (`pending`, `published`, `failed`), `last_error` (mensagem do último erro) e `retry_count`. Query útil para troubleshooting:

```sql
SELECT pedido_id, status, retry_count, last_error, created_at, updated_at
FROM apex_outbox_orders
WHERE created_at > DATE_SUB(NOW(), INTERVAL 24 HOUR)
  AND (status = 'failed' OR retry_count > 0)
ORDER BY created_at DESC
LIMIT 100;
```

### 15.5 Query KQL universal de troubleshooting

Esta query é o ponto de partida para qualquer investigação que envolva multiple components:

```kusto
union traces, requests, exceptions, dependencies
| where timestamp > ago(1h)
| where customDimensions.apex_trace_id == "{trace-id}"
   or operation_Id == "{operation-id}"
| project timestamp, itemType, name, message, resultCode, duration, customDimensions
| order by timestamp asc
```

Substituir `{trace-id}` pelo valor coletado do ticket HelpSphere. Resultado: cronograma completo de todos os spans envolvidos no fluxo, em ordem temporal. Diego salva essa query como favorita no Application Insights e usa em ~80% das triagens.

### 15.6 PowerShell snippets para Windows-based troubleshooting

A equipe Apex opera majoritariamente em Windows. Os snippets abaixo são úteis para coleta de logs em servidores TOTVS e Magento via PowerShell remoto.

**Conectar via PSRemoting ao servidor Protheus:**
```powershell
$cred = Get-Credential -Message "Credencial AD para protheus-app01"
Enter-PSSession -ComputerName protheus-app01.apex.local -Credential $cred -Authentication Kerberos
```

**Tail de log TOTVS via PowerShell:**
```powershell
Get-Content -Path "\\protheus-app01\logs\appserver_202605.log" -Wait -Tail 100 |
  Where-Object { $_ -match "ERROR|FATAL|TKT-3|TKT-12" }
```

**Coletar eventos SAP via PowerShell SAP client:**
```powershell
Import-Module SAPPowerShell
Connect-SapSystem -SystemId "APEX-PROD" -Client 100 -User "diego.silva" -Language EN
$dumps = Get-SapAbapDump -DateRange (Get-Date).AddHours(-2)
$dumps | Format-Table -AutoSize ShortText, Timestamp, User, Program
```

**Inspecionar tabela MSSQL Magento Outbox:**
```powershell
$sqlcmd = @"
SELECT TOP 100 pedido_id, status, retry_count, last_error, created_at
FROM apex_integration.dbo.tbl_outbox_pending
WHERE status='failed'
ORDER BY created_at DESC
"@
Invoke-Sqlcmd -ServerInstance "mssql-magento-prod.apex.local" -Database "apex_integration" -Query $sqlcmd -Credential $cred
```

**Disparar coleta de health check via PowerShell agendado:**
```powershell
$webhookSlack = $env:SLACK_HEALTHCHECK_WEBHOOK
$results = @{
  RabbitMQ = (Invoke-RestMethod -Uri "http://rabbitmq.apex.local:15672/api/healthchecks/node" -Credential $cred).status
  TOTVS = (Invoke-RestMethod -Uri "http://protheus-app01.apex.local:8081/health").status
  Magento = (Invoke-RestMethod -Uri "https://apexmercado.com.br/health/integration").status
}
$payload = @{ text = "Health check $(Get-Date -Format 'yyyy-MM-dd HH:mm'): $($results | ConvertTo-Json -Compress)" } | ConvertTo-Json
Invoke-RestMethod -Uri $webhookSlack -Method Post -Body $payload -ContentType 'application/json'
```

Diego usa esses snippets em scripts agendados no Windows Task Scheduler (`apex-healthcheck-scheduled-task.xml` no repositório `apex-runbook-attachments/scripts/`).

---

## Página 16 — Reprocessamento manual (T-codes SAP)

Esta página documenta os T-codes SAP mais usados para reprocessamento. A política de acesso (quem pode usar o quê) está na Seção 16.5.

### 16.1 Inspeção de documentos contábeis (read-only)

A **FBL3N** ("Display G/L Account Line Items") é a transação mais frequente. Consulta linhas de razão por conta. Diego usa para verificar se um lançamento foi efetivamente postado.

```
SAP GUI → /n → FBL3N
  Conta de razão (G/L): 11201001 (Clientes B2B Apex)
  Empresa (Company Code): AP01
  Range de data postagem: 01.05.2026 a 31.05.2026
  Status: All items
  Execute (F8)
```

A FBL3N retorna linha-a-linha com data, documento, valor débito/crédito, descrição. Marina exporta para Excel quando precisa fazer reconciliação massiva.

A **FB03** ("Display Document") detalha um documento específico. Útil quando Diego tem o número de documento (BELNR) e precisa ver os itens individuais.

```
SAP GUI → /n → FB03
  Empresa: AP01
  Documento (BELNR): 4900012345
  Exercício (GJAHR): 2026
  Enter
```

A **FBL5N** ("Display Customer Line Items") é equivalente à FBL3N mas para conta cliente. Consulta extrato de um cliente específico (CNPJ).

### 16.2 Lançamento manual e correção (Marina+)

A **FB60** ("Enter Incoming Invoice") permite lançar uma nota fiscal de entrada manualmente. Uso restrito a Marina — só em casos onde o fluxo automático falhou e há urgência fiscal.

```
SAP GUI → /n → FB60
  Empresa: AP01
  Data documento: dd.mm.aaaa
  Fornecedor: 100012345 (código SAP)
  Data NF: dd.mm.aaaa
  Total NF: R$ 18.430,00
  Linha 1: Conta despesa 31100100 (Mercadorias adquiridas)
  Valor: R$ 18.430,00
  Segmentação: SEG01 (Apex Mercado)
  Save (F11)
```

A **MIRO** ("Logistics Invoice Verification") é equivalente à FB60 mas para NFs com Purchase Order (MM/SD) já referenciado. Usada quando o pedido de compra existe no SAP MM e a NF precisa ser pareada.

A **F-02** ("Enter G/L Account Posting") é lançamento contábil direto. Último recurso, requer dupla aprovação Marina + Bruno via workflow SAP. Auditoria KPMG revisa todos os F-02 anualmente.

### 16.3 Estorno

A **FB08** ("Reverse Document") faz estorno de documento postado. Crítica para resolução TKT-3 (P9.4 Passo 1).

```
SAP GUI → /n → FB08
  Empresa: AP01
  Documento: 4900012345
  Exercício: 2026
  Motivo do estorno: 01 (Erro de lançamento) ou 02 (Estorno em mês de fechamento)
  Data de postagem: data atual
  Save (F11)
```

O estorno gera um documento "irmão" com sinal contrário. A referência cruzada fica em `BKPF-STBLG` (estorno) e `BKPF-STGRD` (motivo).

A **MR8M** ("Cancel Invoice Document") é o estorno equivalente para documentos lançados via MIRO. Diferença: cancela em vez de estornar (impacto MM diferente).

### 16.4 Reprocessamento de IDoc

A **WE19** ("IDoc Test Tool") permite simular ou reenviar IDocs. Útil para reprocessar IDocs em erro sem precisar refazer todo o fluxo desde o TOTVS.

```
SAP GUI → /n → WE19
  Existing IDoc number: 0000000123456
  "Standard inbound" (F8)
  Confirmar parametros
  "Test" (F7) — simula
  "Inbound function module" — executa de verdade
```

A **BD87** ("Status Monitor for ALE Messages") lista IDocs com erro. Status 51 ("Application document not posted") é o mais comum — indica que o IDoc chegou ao SAP mas o lançamento contábil falhou.

```
SAP GUI → /n → BD87
  Message type: ACC_DOCUMENT
  Date range: D-7 a D
  Direction: Inbound
  Status: 51 (Error)
  Execute (F8)
  Marcar IDoc(s) → "Process" (F7)
```

### 16.5 Política de uso (matriz RACI)

| Transação | Diego (Tier 1) | Marina (Tier 2) | Bruno (Tier 3) |
|---|---|---|---|
| FBL3N (consulta razão) | Read only | Full | Full |
| FB03 (consulta documento) | Read only | Full | Full |
| FBL5N (consulta cliente) | Read only | Full | Full |
| BD87 (monitor IDoc) | Read only | Full | Full |
| FB60 (lançar NF entrada) | — | Full | Full |
| MIRO (lançar NF c/ PO) | — | Full | Full |
| FB08 (estornar) | — | Full | Full |
| MR8M (cancelar) | — | Full | Full |
| F-02 (G/L direto) | — | Dupla aprovação | Aprovador |
| WE19 (reenviar IDoc) | — | Full | Full |
| SPRO (customizing) | — | — | Full |
| Transport requests (STMS) | — | — | Full |

Toda ação em transações de escrita é registrada em **SM19/SM20** (Security Audit Log) com user, timestamp, transação, dados antes/depois. Retenção: 90 dias online + 7 anos em archive (compliance fiscal). Auditoria KPMG revisa SM20 anualmente.

### 16.6 T-codes adicionais úteis em troubleshooting

Lista complementar de T-codes que Marina e Bruno usam em cenários menos frequentes:

- **DB02 — Database Performance:** verifica uso de tablespace Oracle. Marina usa no checklist semanal (Página 21).
- **ST02 — Tune Summary:** monitora uso de memória, buffers, swaps. Útil quando SAP está lento sem causa óbvia.
- **ST05 — SQL Trace:** captura SQL gerado pelo SAP. Bruno usa para investigar queries lentas em customizações.
- **ST06 — Operating System Monitor:** CPU, memória, IO do servidor SAP. Identifica problemas de infraestrutura.
- **SU01 — User Maintenance:** gerenciamento de usuários SAP. Marina mantém o cadastro do usuário técnico `RFC_APEX` (rotação trimestral de senha).
- **SU53 — Authorization Check:** quando uma transação falha por falta de autorização, SU53 mostra qual objeto de autorização estava ausente. Diego executa SU53 imediatamente após qualquer "no authorization" para coletar evidência.
- **SE38 — ABAP Editor:** visualização de código ABAP. Restrito a Bruno (editar) + Marina (display only).
- **SE16N — General Table Display:** browse de tabelas SAP. Diego usa para verificar registros em tabelas Z (Z_APEX_AUDIT_LOG, etc).
- **SXMB_MONI — Message Monitor (PI/PO):** monitora mensagens de integração (não relevante para Apex atualmente, mas listado para futuras integrações via SAP PI).
- **WE05 — IDoc List:** lista todos os IDocs por filtro. Complementa BD87 (que mostra apenas IDocs com erro).
- **WE02 — IDoc Display:** detalhe completo de um IDoc específico.
- **SE11 — Data Dictionary:** estrutura das tabelas SAP. Bruno usa quando precisa entender campos para query custom.

### 16.7 Acesso de emergência (break-glass)

Em cenário de DR ou indisponibilidade severa, há um usuário SAP `EMERGENCY_APEX` com permissões SAP_ALL temporárias. Procedimento de uso:

1. Bruno solicita ativação via Compliance (e-mail formal + justificativa).
2. Compliance ativa a conta no SAP (válida por 24 horas).
3. Bruno acessa com 2FA (Yubikey corporativa).
4. Toda ação é capturada em SM20 com tag especial `EMERGENCY-{ticket-id}`.
5. Após uso, Bruno escreve relatório justificando cada ação executada.

Acesso EMERGENCY foi usado 1 vez em 2025 (DR test) e 0 vezes em 2026. A existência do procedimento é parte do requisito de auditoria interna anual.

---

## Página 17 — Escalonamento Tier 1 → Tier 2 → Tier 3 → Fornecedor

A matriz abaixo é a fonte de verdade para decisões de escalação. Diego consulta antes de qualquer ação não-trivial. Marina valida antes de envolver fornecedor.

| Cenário | Tier 1 (Diego) | Tier 2 (Marina) | Tier 3 (Bruno CTO) | Fornecedor |
|---|---|---|---|---|
| NF-e rejeição 539 isolada | Identifica + escala Marina | Reprocessa com CFOP correto | — | — |
| ERP↔Magento sync >5% erro | Detecta + escala Marina | Diagnostica + mitiga | Hotfix se necessário | — |
| Frota.io token expirado | Renova manualmente (P13.2) | Apenas se P13.2 falhar | — | Frota.io support |
| RabbitMQ node down | Detecta + escala Marina | Failover automático verifica | Decisão de adicionar node | — |
| SAP FI dump em ST22 (frequência alta) | Apenas observa | Investiga + abre chamado SAP | Decisão patch/SAP Note | **SAP SuperCare** |
| TOTVS performance degradada | Apenas observa | Investiga config WSCONFIG | Decisão upgrade | **TOTVS Mais** |
| Service Bus throttling | Detecta + escala Marina | Aumenta MU temporariamente | Decisão MU permanente | **Microsoft Premium Support** |
| SEFAZ-SP indisponível | Aguarda + comunica Marina | Comunica área comercial + ativa modo contingência (SCAN) | — | **SEFAZ-SP** (portal oficial) |
| Disaster recovery (RTO 4h) | Notifica Marina + Bruno | Coordena failover | Comando + comunicação executiva | Todos fornecedores notificados |
| Auditoria SAP/PCI-DSS | — | — | Coordena diretamente | Auditor externo (KPMG via contrato) |

### 17.1 Limites de alçada financeira

Para tomada de decisão que envolve impacto financeiro:

- **Diego (Tier 1):** ações reversíveis sem impacto financeiro direto (renovação token, restart de pod, query de log, consulta SAP read-only).
- **Marina (Tier 2):** ações com impacto financeiro até R$ 50.000 (lançamentos FB60, estornos FB08, reprocessamento de pedidos em DLQ).
- **Bruno (Tier 3):** decisões arquiteturais, deploy fora de janela autorizada, lançamentos >R$ 50.000, mudanças que afetem múltiplas marcas simultaneamente.

Casos acima de R$ 500.000 (ex: estorno de fechamento mensal, cancelamento de contrato fornecedor) requerem aprovação adicional de Carla (CFO/CTO). Esse limite é raríssimo em troubleshooting operacional — geralmente aparece só em DR ou auditoria.

### 17.2 SLA contratuais de fornecedores

| Fornecedor | Contrato | SLA P1 | SLA P2 | SLA P3 | Como abrir chamado |
|---|---|---|---|---|---|
| SAP Brasil (SuperCare) | SAP-APEX-2024-001 | 30min | 4h | 1 dia útil | `https://launchpad.support.sap.com` |
| TOTVS Mais | TVS-AP-2024-PRO | 1h | 4h | 1 dia útil | `https://suporte.totvs.com.br` |
| Microsoft Premium Support | AZ-EA-2024 | 15min | 2h | 8h | Portal Azure |
| Adobe Magento Premier | MGT-PREMIER-2024 | 1h | 4h | — | `https://support.magento.com` |
| Frota.io | sem SLA contratual | best effort | best effort | best effort | `support@frota.io` |
| Certisign | renovação programada | — | — | — | `https://www.certisign.com.br/atendimento` |

Os números de contrato são fundamentais ao abrir chamado — sem eles, o fornecedor não consegue localizar o cliente no CRM deles e atrasa o atendimento.

### 17.3 Contatos por Slack

A comunicação interna é via Slack. Cada membro do time tem expectativa clara de disponibilidade:

- **Diego (`@diego.silva`):** DM aceito 24/7 em horário comercial (08h-20h BRT). Fora desse horário, mensagens entram no backlog e são tratadas no início do próximo turno.
- **Marina (`@marina.oliveira`):** DM apenas para P1/P2 fora do horário comercial. Marina tem PagerDuty integrado — alertas críticos disparam push notification.
- **Bruno (`@bruno.santos`):** DM apenas P1 fora do horário comercial. E-mail (`bruno.santos@apex.local`) como backup. Bruno raramente é acordado fora do expediente — só em DR real.

### 17.4 Processo de escalação para fornecedor SAP

Antes de abrir chamado SAP, Marina coleta:

1. **Versão exata:** "SAP FI 4.7 EHP8 SP18" (extrair de tx SPAM ou `/nse38` SAP_SAPPL).
2. **SAP Notes aplicadas:** lista `/sap/notes-applied-q2-2026.txt`.
3. **Reprodução:** passos exatos para reproduzir o erro.
4. **Dump ABAP:** ID do dump em ST22 (campo "Short text" e "Stack trace" completos).
5. **TraceId Apex:** `apex-trace-id` correlato no Application Insights.

O chamado é aberto no SAP Launchpad em `https://launchpad.support.sap.com`. Marina seleciona prioridade baseado no impacto:
- **Very High:** sistema produtivo parado afetando >100 usuários.
- **High:** sistema produtivo funcional mas funcionalidade crítica indisponível.
- **Medium:** problema que não afeta produção imediata mas tem prazo.
- **Low:** dúvida ou solicitação não-urgente.

O SLA da SAP é cumprido geralmente — em Q1-2026, ticket aberto como Very High teve primeira resposta em 22 minutos (alvo: 30 minutos).

### 17.4.1 Critérios de quando abrir chamado com fornecedor

Marina segue critérios estritos antes de abrir chamado SAP/TOTVS/Magento/Azure — abrir chamado prematuramente desgasta a relação com o fornecedor e atrasa atendimento de casos legítimos.

**Critérios para abrir chamado SAP (SuperCare):**

1. Problema é reproduzível em ambiente isolado (não é caso de uma vez).
2. Marina já tentou aplicar SAP Notes relevantes ou validou que não há Note correspondente.
3. Há evidência clara de dump ABAP em ST22 ou erro de RFC.
4. Impacto é operacional (não apenas teórico).

**Critérios para abrir chamado TOTVS (TOTVS Mais):**

1. Comportamento diverge da documentação oficial Protheus.
2. Não é causado por customização ADVPL Apex (verificar primeiro removendo customização em staging).
3. Ocorre em versão de release suportada (build 7.00.231003 ou posterior).

**Critérios para abrir chamado Microsoft Azure (Premium Support):**

1. Métrica ou comportamento diverge do SLA contratual.
2. Erro retornado pelo SDK Azure é claramente do lado Azure (não cliente).
3. Logs do Azure Activity Log e Resource Health confirmam o problema.

**Critérios para abrir chamado Adobe Magento (Premier):**

1. Bug em código core do Magento (não em plugin custom).
2. Problema reproduzível em instalação Magento limpa (sem customizações Apex).
3. Versão patch level está atual.

Em todos os casos, Marina inclui no chamado: TraceId Apex correlato, logs relevantes (último 1h em formato consolidado), passos exatos de reprodução, impacto medido em métricas. Histórico Q1-2026: 12 chamados abertos, 11 resolvidos pelo fornecedor, 1 escalado internamente (era bug em customização Apex, não no fornecedor).

### 17.5 Comunicação executiva

Para incidentes que impactam negócio visível (cliente final, mídia, perda financeira >R$ 100.000), Bruno tem responsabilidade de comunicar:

- **Lia (Head Atendimento):** comunicação interna para alinhamento com SAC, comercial, marketing.
- **Carla (CFO/CTO):** comunicação financeira (perda esperada, plano de recuperação).
- **Diretoria:** apenas se incidente exceder 8h ou tiver implicação fiscal/legal séria.

Template de comunicação executiva está em `docs/templates/incident-exec-comm.md`. Bruno preenche e envia em até 60 minutos após decisão de comunicar.

### 17.6 Treinamento e onboarding

Novos analistas Tier 2 passam por treinamento estruturado antes de assumir responsabilidades operacionais. Curriculum atual (12 horas distribuídas em 2 semanas):

**Módulo 1 — Visão arquitetural (2h):**
- Diagrama lógico do fluxo de 7 hops.
- Tecnologias do stack (SAP, TOTVS, Magento, RabbitMQ, Azure).
- Padrões de mensageria (Pub-Sub, Outbox, Circuit Breaker).

**Módulo 2 — Procedimentos P9/P11/P13 (4h):**
- Walkthrough hands-on de cada procedimento em ambiente staging.
- Simulação de incidente (chaos engineering controlado).
- Pair-debugging com Marina.

**Módulo 3 — Ferramentas (3h):**
- SAP GUI + T-codes essenciais (FBL3N, FB03, FB08, BD87, ST22).
- RabbitMQ Management UI.
- Application Insights KQL.
- Grafana dashboards.

**Módulo 4 — Comunicação e escalação (1h):**
- Matriz de escalação.
- Templates de comunicação cliente final.
- Critérios para envolver Lia/Bruno/Carla.

**Módulo 5 — Postmortem e melhoria contínua (2h):**
- Análise de postmortems Q1-2026.
- Identificação de padrões.
- Como contribuir para evolução dos runbooks.

A certificação interna é renovada anualmente. Marina conduz o treinamento. Bruno valida módulos arquiteturais. Diego, embora seja Tier 1, é convidado para alguns módulos para entender o contexto mais amplo.

### 17.7 Rotação de plantão (on-call)

Marina e Bruno fazem rotação semanal de plantão fora do horário comercial. A escala é mantida no PagerDuty:

- **Semana ímpar:** Marina primary, Bruno backup.
- **Semana par:** Bruno primary, Marina backup.

Em períodos de freeze (Black Friday week, fechamento mensal), ambos ficam disponíveis simultaneamente. Em férias planejadas, terceirizamos plantão para o parceiro `apex-soc-vendor` (contrato `SOC-APEX-2024`).

Compensação por plantão acionado fora do horário: banco de horas + adicional de noturno conforme CCT. Plantão sem acionamento: bônus mensal fixo de R$ 800.

### 17.8 Procedimento de hand-off entre turnos

Para garantir continuidade entre Marina (horário comercial) e plantão (fora horário), há hand-off estruturado:

**Hand-off de saída (final do expediente Marina):**

1. Atualizar planilha `daily-handoff.xlsx` no SharePoint com:
   - Tickets abertos em progresso.
   - Mudanças deploiadas no dia.
   - Filas com profundidade anormal.
   - Quaisquer warnings ou alertas pendentes.
2. Postar resumo em `#apex-integracao-alerts`: "Hand-off para plantão: [tickets/alertas pendentes]".
3. Confirmar com plantão via DM Slack ("plantão recebido, ciente").

**Hand-off de entrada (manhã seguinte):**

1. Plantão escreve relatório de noite em `daily-handoff.xlsx` com:
   - Alertas disparados durante a noite.
   - Ações executadas (ou ignoradas, com justificativa).
   - Recomendações para o dia.
2. Marina inicia dia revisando esse relatório antes de qualquer outra ação.
3. Casos críticos pendentes vão imediatamente para Bruno se não resolvidos.

Esse procedimento foi formalizado em Q1-2026 após observar que ~15% dos incidentes tinham contexto perdido no hand-off informal anterior. Após formalização, perda de contexto caiu para <2%.

---

## Página 18 — Janelas de manutenção autorizadas

### 18.1 Janela primária semanal

A janela canônica é **terça-feira das 03h00 às 05h00 BRT**. Essa janela é usada para:

- Deploy de hotfixes não-críticos do Adapter (.NET AKS).
- Restart programado de RabbitMQ nodes (rotativo: 1 node por terça, ciclo completo a cada 3 semanas).
- Manutenção de índices MSSQL TOTVS (`UPDATE STATISTICS`, `ALTER INDEX REBUILD` em tabelas críticas como `SC5010` pedidos, `SF1010` notas fiscais).
- Aplicação de SAP Notes não-emergenciais (com aval Bruno e Basis presencial).
- Renovação de certificados (NF-e A1, TLS).
- Upgrades de patch level do Magento.

**Comunicação:** banner no Magento informa "Manutenção programada terça 03h-05h. E-commerce permanece operacional. Demais operações podem ter latência elevada." 48 horas antes da janela. Comercial recebe e-mail com 7 dias de antecedência.

A janela é deliberadamente curta (2 horas) para minimizar exposição. Operações maiores são reservadas para a janela estendida mensal.

### 18.2 Janela estendida mensal

A janela ampla é o **terceiro domingo do mês, das 02h00 às 06h00 BRT**. 4 horas de janela permitem operações maiores:

- Upgrades major (SAP support packs, TOTVS major releases).
- Migração de versão Magento.
- Reorganização de tablespace Oracle (`ALTER TABLESPACE ... COALESCE`).
- Patches no RabbitMQ cluster (rolling upgrade dos 3 nodes em sequência).
- Substituição de hardware on-prem (Cajamar) — se planejado.

**Comunicação:** banner Magento com 7 dias de antecedência. E-mail customizado para lojistas B2B (anexo PDF descrevendo escopo da janela). Comercial regional comunica gerentes de loja.

### 18.3 Janela emergencial

Há cenários onde a janela autorizada não pode esperar (vulnerabilidade zero-day, bug crítico em produção causando perda financeira). Nesse caso:

- **Aprovação obrigatória:** Bruno + Lia (Head Atendimento). Carla é notificada mas não aprova.
- **Comunicação imediata:** post em `#apex-integracao-alerts` no Slack. E-mail para gerentes regionais e supervisores de loja.
- **Documentação:** postmortem ao final justificando a quebra de janela e demonstrando que o impacto evitado era maior que o impacto da janela.

Histórico Q1-2026: 1 janela emergencial (TKT-12 hotfix v3.2.2 aplicado em janela emergencial autorizada em 2026-01-15 03h30 — fora da janela padrão por urgência de evitar repetição do incidente).

### 18.4 Período de freeze

Há períodos em que **nenhum deploy** é permitido, exceto hotfix P1 com aval explícito de Bruno + Lia + Carla:

- **Black Friday week (4ª semana de novembro):** FREEZE TOTAL. Apenas hotfixes P1 com aval triplo. Esse período é crítico para faturamento — Q4-2025 representou 23% do GMV anual concentrado em 7 dias.
- **Fechamento fiscal (últimos 3 dias úteis do mês):** sem deploys de mudança em SAP FI ou SPED. Isso protege a integridade do fechamento contábil mensal.
- **Dia 25 do mês (transmissão SPED Fiscal):** sem deploys em TOTVS módulo SIGAFIS. O dia 25 é o prazo legal para transmissão do SPED do mês anterior — qualquer mudança pode invalidar o arquivo.

Períodos de freeze são publicados no calendário corporativo Apex e replicados no `#apex-integracao-alerts` no primeiro dia útil do mês.

### 18.5 Cross-references

A janela de manutenção do e-commerce está documentada também em `faq_horario_atendimento.pdf` Página 2.1. Histórico de janelas executadas (passadas) está disponível em `https://wiki.apex.local/maintenance-history` — Marina mantém o registro atualizado.

### 18.6 Pré-checklist de qualquer janela

Antes de cada janela (qualquer tipo), Marina executa o checklist:

- [ ] Banner publicado no Magento >= 48h antes.
- [ ] Comercial e Lia comunicados.
- [ ] Backups validados (último backup full <24h).
- [ ] Plano de rollback escrito e revisado.
- [ ] Diego ou outro Tier 1 de plantão durante a janela.
- [ ] Fornecedor relevante notificado (se aplicável — ex: TOTVS para upgrade Protheus).
- [ ] DR site (Tamboré ou westus3) confirmado healthy.

O checklist é arquivado em `apex-runbook-attachments/janelas/{ano-mes-dd}-checklist.md` para auditoria.

### 18.7 Comunicação pré-janela (templates)

Marina dispara comunicações em três momentos antes de cada janela.

**T-7 dias (e-mail para Comercial + Gerentes regionais):**

```
Assunto: [JANELA MANUTENÇÃO] Domingo 19/05/2026 02h-06h — Apex Integração

Equipe,

Comunicamos janela de manutenção programada nos sistemas de integração
financeira (SAP FI / TOTVS / Magento) no terceiro domingo do mês.

Data/hora: 19/05/2026 (domingo), 02h00 às 06h00 BRT.
Escopo: upgrade RabbitMQ cluster + patches SAP Notes Q2.
Impacto esperado: e-commerce funcional, mas latência elevada em
sincronização ERP. Pedidos B2B confirmados ficarão em status
"pending sync" durante a janela e serão processados após o término.

Comunicação para clientes B2B foi disparada via comunicado oficial.

Em caso de dúvidas, contatar Marina (DM Slack ou e-mail).

Atenciosamente,
Apex Integração
```

**T-48 horas (banner Magento):**

Banner discreto no topo do site: "Manutenção programada domingo 19/05 02h-06h. E-commerce permanece operacional. Saiba mais."

**T-1 hora (post Slack `#apex-integracao-alerts`):**

"@channel Iniciando janela de manutenção em 1 hora. Checklist pré-janela completo (link). Diego on-call para Tier 1. Marina coordenando. Bruno disponível para emergência."

### 18.8 Procedimento de pós-janela

Após cada janela, Marina executa procedimento de validação:

1. Smoke test do fluxo de pedido B2B (pedido sintético via API admin).
2. Verificação de filas RabbitMQ (sem mensagens órfãs).
3. Verificação de IDocs SAP (status normal).
4. Confirmação de scaling AKS de volta ao baseline.
5. Post de "janela concluída" em `#apex-integracao-alerts`.

Em caso de falha pós-janela, Marina executa rollback usando o plano documentado pré-janela. Histórico Q1-2026: 4 janelas executadas, 0 rollbacks acionados.

### 18.9 Mudanças não passíveis de janela padrão

Algumas mudanças exigem coordenação além da janela técnica:

**Mudanças fiscais (SAP customizing FI):**
- Coordenação com Compliance + Carla (CFO).
- Não pode ocorrer durante mês fiscal aberto se afetar lançamento.
- Plano de teste em ambiente staging com simulação de fechamento.

**Mudanças no plano de contas SAP (COA):**
- Aprovação formal da contabilidade.
- Atualização correlata no TOTVS DE-PARA contábil.
- Comunicação para auditoria externa (KPMG).
- Histórico: 2 mudanças em 2025, ambas em janela estendida + reunião prévia com Carla.

**Mudanças em CFOPs default:**
- Requer aprovação de Marina (operação) + Compliance.
- Atualização Anexo II deste runbook + sample-kb se aplicável.
- Comunicação para comercial via Lia.

**Upgrades de versão Magento (major):**
- Vtex Implementer conduz, Apex valida.
- Geralmente janela estendida + extensão de horário (até 8h).
- Plano de rollback completo + smoke test extensivo pós-deploy.
- Histórico: 1 upgrade em 2025 (2.4.5 → 2.4.6), executado em janeiro 2026.

### 18.10 Coordenação com calendário comercial

A equipe de operação fiscal/contábil tem calendário próprio que afeta janelas técnicas:

- **Fechamento mensal Apex Mercado:** dias 1-3 de cada mês. Sem deploys SAP FI.
- **Fechamento mensal Apex Tech/Moda/Casa:** dias 5-7. Sem mudanças em customizações ABAP fiscais.
- **Fechamento Apex Logística:** dias 10-15 (mais flexível por ciclo de faturamento B2B).
- **Transmissão SPED Fiscal:** dia 25 do mês para o mês anterior. Sem deploys em SIGAFIS.
- **Transmissão SPED Contribuições:** dia 25 também.
- **Transmissão eSocial:** dia 7 do mês para folha do mês anterior.
- **Apuração ICMS:** mensal, dias 20-22.

Marina cruza esses calendários com o calendário de janelas técnicas via planilha `calendario-fiscal-tecnico.xlsx`. Conflitos são identificados com antecedência e resolvidos por replanejamento.

---

## Página 19 — Disaster recovery (RTO 4h · RPO 15min)

### 19.1 Componentes com DR ativo

A estratégia de DR é multi-camada: componentes Tier 1 (transacionais críticos) têm DR síncrono ou near-real-time; componentes Tier 2 (operacionais) têm DR assíncrono; componentes Tier 3 (analíticos) têm backup convencional.

| Componente | Estratégia | RTO | RPO | Site secundário |
|---|---|---|---|---|
| Oracle 19c SAP FI | Data Guard sync | 2h | 0min (sync) | Tamboré (50km da sede) |
| MSSQL TOTVS | Always-On + log shipping | 1h | 5min | Tamboré |
| RabbitMQ cluster | 3 nodes em AZ diferentes + federation para westus3 | 30min | 15min | Azure westus3 |
| Magento + Adapter AKS | Azure Site Recovery + Bicep IaC | 3h | 30min | Azure westus3 |
| Service Bus | Geo-disaster recovery alias | 5min | <1min | Azure westus3 |
| Application Insights | Continuous Export → Storage westus3 | N/A | 0min | Azure westus3 |

O **RTO global** declarado para "fluxo de pedido B2B end-to-end" é de **4 horas**. Esse é o tempo máximo aceito para retomar 100% de funcionalidade após um disaster regional eastus2. O **RPO global** é de **15 minutos**, limitado pelo componente menos rápido (RabbitMQ federation passive).

### 19.2 Runbook de failover RabbitMQ

Cenário: 2 dos 3 nodes do cluster RabbitMQ ficam unhealthy por mais de 5 minutos. Bruno é notificado via PagerDuty.

**Passo 1: Detecção.**

```bash
# Validar status do cluster
ssh rabbitmq-node1.apex.local 'rabbitmqctl cluster_status'
ssh rabbitmq-node2.apex.local 'rabbitmqctl cluster_status'
ssh rabbitmq-node3.apex.local 'rabbitmqctl cluster_status'

# Confirmar partição de rede (se aplicável)
ssh rabbitmq-node1.apex.local 'rabbitmqctl list_node_partitions'
```

Se 2 de 3 nodes não respondem ou retornam `unreachable`, prosseguir para failover.

**Passo 2: Failover DNS para federation passive em westus3.**

```bash
az network private-dns record-set a update \
  --zone-name apex.local \
  --resource-group rg-apex-dns-prod \
  --name rabbitmq \
  --set aRecords[0].ipv4Address=10.20.30.40 \
  --output table
```

O IP `10.20.30.40` é o load balancer apontando para o cluster `rabbitmq-{01,02,03}.apex-westus3.local` (passive em westus3).

**Passo 3: Validação pós-failover.**

```bash
# Throughput deve normalizar em <10min
watch 'rabbitmqctl list_queues -p /apex name messages | grep magento'

# Latência hop 5 (RabbitMQ) deve voltar a <500ms
# Verificar dashboard Grafana RabbitMQ Cluster
```

**Passo 4: Comunicação.**

Marina notifica Lia (Head Atendimento). Lia comunica lojistas B2B se DR durar >30 minutos. Bruno notifica Carla se durar >2 horas (impacto financeiro provável).

### 19.3 Runbook de failover SAP FI (Oracle Data Guard)

Esse runbook é de responsabilidade **exclusiva** de Bruno + equipe Basis terceirizada. Marina não executa SAP failover sem supervisão Basis.

**Trigger:** site primário Cajamar inacessível (queda elétrica >2h, perda de conectividade, desastre físico). Bruno é acionado via PagerDuty.

**Comando de switchover** (executado pelo Basis no servidor standby):
```
dgmgrl /
> connect sys/********@SAP_STANDBY
> show configuration
> switchover to 'sap_standby_tambore';
```

O comando promove o standby de Tamboré para primary, e o ex-primary de Cajamar (quando voltar) se torna o novo standby. RTO esperado: 2 horas (inclui validações pós-switchover + smoke test em FB60).

**Validação pós-switchover:**
1. Primeiro lançamento contábil teste em FB60 deve completar em <5 segundos.
2. RFC `BAPI_ACC_DOCUMENT_POST` deve responder em latência normal (medir via SM59).
3. Job background `BR_APEX_NFE_PROCESSAMENTO` deve estar reagendado e rodando.
4. Aplicação client (TOTVS-SAP Bridge) deve reconectar automaticamente (timeout default 30s).

**Comunicação corporativa:** Bruno comunica Carla (CFO). DR de FI afeta diretamente fechamento fiscal e auditoria — comunicação para diretoria pode ser necessária se DR durar >24h.

### 19.4 Testes anuais de DR

Testes formais executados em janela controlada todo trimestre:

- **Q1 (março 2026):** failover RabbitMQ + Adapter — executado em 2026-03-19, sucesso. RTO real: 38 minutos (alvo 30 minutos — acima por delay manual de DNS propagation).
- **Q2 (junho 2026 planejado):** failover Magento + Adapter via Azure Site Recovery. Data: 2026-06-21 sábado 02h-08h.
- **Q3 (setembro 2026):** failover SAP FI Oracle Data Guard (com equipe Basis presencial). Operação mais sensível — só executada com Basis on-site.
- **Q4 (dezembro 2026):** simulação completa multi-componente, sem disparar produção real (game day).

Cada teste gera relatório arquivado em `docs/dr-tests/{ano-trimestre}.md`. Bruno apresenta resultados consolidados a Carla anualmente.

### 19.5 Lições aprendidas dos testes DR

Q1-2026 (failover RabbitMQ) trouxe três aprendizados:

1. **DNS propagation é gargalo:** TTL de 300 segundos no DNS interno é alto demais para failover. Plano: reduzir para 30 segundos nas zonas críticas (custo: aumenta queries DNS mas vale a pena).
2. **Adapter circuit breaker abriu durante failover:** configurado com 5 falhas em 30s, abriu durante a janela de propagação DNS. Reduzir threshold de detecção falha para evitar abertura desnecessária.
3. **Federation lag estava em 18 segundos no momento do teste:** acima do RPO declarado (15 minutos). Investigado: pico de tráfego batch causava lag temporário. Ajuste: rate-limiting na federation para suavizar.

### 19.5 Estratégia de backup detalhada

Além da replicação síncrona/assíncrona dos componentes Tier 1, há backups de longo prazo para compliance e recuperação de cenários extremos (corrupção lógica, ransomware, erro humano).

**Backup do SAP FI (Oracle 19c):**
- Full diário 03h00 BRT (orquestrado via runbook `BR/MS_SAP_BACKUP`).
- Incremental a cada hora (level 1).
- Archive logs continuamente.
- Retenção: 14 dias on-disk Cajamar, 90 dias Azure Blob cool tier (`stapexbackupprodeastus2`), 7 anos archive tier (compliance fiscal).
- Validação: restore test trimestral em ambiente isolado.

**Backup do TOTVS Protheus (MSSQL 2019):**
- Full diário 02h00 BRT.
- Differential a cada 6 horas.
- Transaction log a cada 15 minutos.
- Retenção: 30 dias on-disk, 90 dias Azure Blob, 7 anos archive.
- Validação: restore test mensal em ambiente staging.

**Backup do Magento (MSSQL Azure SQL Database):**
- Backup automático pelo Azure (gerenciado).
- PITR (Point-In-Time Restore) até 35 dias.
- Long-term retention: semanal por 12 semanas + mensal por 12 meses + anual por 7 anos.
- Validação: restore test trimestral em subscription paralela.

**Backup do RabbitMQ:**
- Definitions backup diário (queues, exchanges, bindings, policies) para Azure Blob.
- Mensagens em quorum queues são replicadas síncronamente em RF=3 — esse é o "backup" implícito.
- Para mensagens em DLQ, snapshot manual antes de operações de limpeza.

**Backup de secrets (Key Vault):**
- Soft delete habilitado (retention 90 dias).
- Purge protection habilitado (impede deleção definitiva).
- Backup periódico de secrets críticos via `az keyvault secret backup`.

### 19.6 Procedimento de failback (após DR)

Após o site primário se recuperar (geralmente algumas horas a dias depois), Bruno coordena o failback. Esse procedimento é deliberadamente conservador — preferimos manter operação no DR site por mais tempo do que arriscar inconsistência durante o failback.

**Pré-requisitos para iniciar failback:**

- Site primário 100% recuperado e validado.
- Janela de manutenção autorizada (failback nunca é executado em horário de pico).
- Lag de replicação inverso (DR → primary) <30 segundos.
- Checklist pós-DR completo (incluindo análise da causa-raiz da queda inicial).

**Procedimento de failback (sequência):**

1. **Quiesce de tráfego no DR site:** habilita modo somente-leitura no DR site para drenar transações pendentes.
2. **Sincronização final:** aguarda lag de replicação chegar a 0.
3. **Switchover Oracle (se aplicável):** equipe Basis executa switchover reverso via dgmgrl.
4. **Atualização de DNS:** reverte registros A apontando para IPs do primário.
5. **Validação de smoke test:** pedido sintético end-to-end.
6. **Habilitação completa do primário:** modo leitura+escrita.
7. **Comunicação:** Bruno notifica Carla e demais stakeholders.

Tempo médio de failback: 2-4 horas. Esse é tempo de janela controlada, não tempo de recuperação (operação está rodando no DR durante todo o failback).

### 19.7 Documentação do BCP (Business Continuity Plan)

O DR técnico é parte de um plano maior de continuidade de negócios (BCP) corporativo. O BCP documenta cenários não-técnicos: incêndio na sede, pandemia, ataque cibernético, perda de fornecedor crítico, etc.

A integração Apex aparece no BCP em:

- **Cenário 3 (Datacenter Cajamar indisponível):** ativar DR Azure westus3 conforme runbook.
- **Cenário 7 (Ataque ransomware):** isolar componentes, restaurar de backups, comunicar autoridades.
- **Cenário 12 (Fornecedor SAP descontinua suporte):** plano de migração para SAP S/4HANA Cloud (Q4-2027 alvo).

O BCP é mantido por Compliance + Bruno. Revisão anual com simulações tabletop.

---

## Página 20 — Histórico de incidentes Q1-2026 (top 5)

Esta página é referência consolidada de incidentes Q1, usada durante onboarding de novos analistas Tier 2 e como histórico para análise de tendências.

### 20.1 Top 5 incidentes Q1-2026

| # | Data | Ticket | Sev | Componente | Sintoma | RCA | Ação | MTTR |
|---|---|---|---|---|---|---|---|---|
| 1 | 2026-01-14 | TKT-12 | P1 Critical | RabbitMQ + Magento Outbox | 18% pedidos `pending sync` por 4h11min, GMV perdido R$ 287.400 | Payload Magento >256KB com `product_attributes` desnecessário | Hotfix v3.2.2 em `apex/order-sync` + guardrail CI | 4h11min |
| 2 | 2026-02-03 | TKT-3 (recorrente) | P2 High | SAP FI + TOTVS | NF-e 539 em 47% dos pedidos B2B interestaduais | CFOP intra-estadual (5102) aplicado em pedido interestadual | Trigger ADVPL `apex_validate_cfop` + Anexo II atualizado | 38min (mediana) |
| 3 | 2026-02-19 | TKT-18 (relacionado) | P1 Critical | Azure App Service Magento | Site fora do ar 47min Black Friday | Auto-scaling configurado max 10, pico exigiu 17 | Max 30 + warm pool 5 instances | 47min |
| 4 | 2026-03-04 | TKT-15 | P2 High | Frota.io webhook | Pedidos não chegam ao Frota desde 17h | Token JWT expirado, refresh job em estado `Failed` (OOMKilled) | Cronjob `frota-token-refresh` memory limit aumentado + alerta proativo 4h TTL | 1h47min |
| 5 | 2026-03-22 | Interno (sem ticket) | P3 Medium | SAP FI Oracle | Tablespace `PSAPSR3` em 87% (alerta 80%) | Crescimento orgânico não previsto + auditoria fiscal Q4-2025 indexou tabelas | `ALTER TABLESPACE PSAPSR3 ADD DATAFILE` (+200GB) + revisão anual de capacidade | 2h15min (planejado) |

### 20.2 Análise cross-incidente

Três dos cinco incidentes top Q1 têm padrão comum: **limite atingido sem alerta proativo**. Em todos os três casos, o threshold de warning (75-80%) não disparou alerta efetivo a tempo de prevenção. O incidente já se manifestou como degradação visível antes que o monitoring detectasse.

Plano corretivo Q2-2026:
1. Revisar todos os thresholds da Página 7.
2. Adicionar alerta proativo em 75% do limite (não apenas 80%).
3. Diferenciar entre warning (P3, Diego avisa Marina) e critical (P2, PagerDuty Marina).
4. Adicionar testes sintéticos de threshold em pre-prod mensalmente.

### 20.3 Tendência de MTTR

**MTTR p95 Q1-2026:** 2h47min — muito acima do SLO de 45 minutos.

A análise do outlier mostra que TKT-12 puxou a média para cima. Excluindo TKT-12 (única P1 verdadeira do trimestre), p95 fica em 1h12min — ainda acima do SLO mas significativamente melhor.

A causa do MTTR alto em TKT-12 foi a **demora em identificar a causa-raiz** (payload size). Os primeiros 2 horas foram gastos investigando hipóteses falsas (deadlock no SAP, sobrecarga no TOTVS, problema de rede). Plano: adicionar runbook P11 (já entregue em Q2) e treinar Diego para detectar a hipótese "payload size" mais cedo.

### 20.4 Tendência de incidentes por componente

Distribuição Q1-2026 (15 incidentes totais, P1-P3):

- **RabbitMQ + filas:** 5 incidentes (33%). Causas: payload size, node down, DLQ acumulada.
- **NF-e SEFAZ:** 4 incidentes (27%). Causas: rejeição 539, indisponibilidade SEFAZ.
- **Magento:** 3 incidentes (20%). Causas: Outbox lag, performance, deploy regression.
- **SAP FI:** 2 incidentes (13%). Causas: tablespace, dump ABAP em customização.
- **TOTVS Protheus:** 1 incidente (7%). Causa: WSCONFIG mal-balanceado.

A concentração em RabbitMQ + filas sugere que esse é o componente mais frágil do stack. Plano Q2-2026: investir em hardening RabbitMQ (upgrade para 3.13 LTS, revisar policies, adicionar shadow cluster para teste de mudanças).

### 20.5 Custos associados

Estimativa de custo total dos incidentes Q1-2026:

- **GMV perdido (TKT-12 + TKT-18):** R$ 287.400 + R$ 1.800.000 (Q4-2025, referência) — bem acima do orçamento de "perdas operacionais aceitáveis" de R$ 200.000/trimestre.
- **Horas-pessoa em troubleshooting + postmortem:** ~280 horas (Marina + Bruno + Diego + engenharia).
- **Custos de mitigação aplicada:** ~R$ 12.000 (mudanças de Service Bus tier temporários, RabbitMQ payload policy ajustes).

A diretoria foi comunicada e aprovou orçamento adicional Q2 para melhorias estruturais: R$ 480.000 alocados para hardening de integração (treinamento, ferramentas, novo analista Tier 2, upgrade RabbitMQ).

### 20.6 Lições agregadas

Sumário das principais lições de Q1-2026, agora incorporadas neste runbook:

1. **Payload size monitoring é mandatório.** Threshold 200KB warning + 240KB critical.
2. **CFOP validation precisa de dupla camada.** Magento (proativa) + TOTVS trigger (defensiva).
3. **Token expiration precisa de alerta proativo.** Não confiar em cronjob silencioso — adicionar TTL monitoring no Application Insights.
4. **Auto-scaling precisa de stress test trimestral.** Configurações esquecidas envelhecem mal (caso TKT-18 BlackFriday).
5. **Tablespace growth precisa de revisão semestral.** Auditorias fiscais geram crescimento atípico — antecipar com revisão de capacidade.

### 20.7 Análise comparativa com trimestres anteriores

A tendência geral é positiva: o número total de incidentes tem caído trimestre a trimestre, mas a severidade média subiu por concentração em TKT-12.

| Trimestre | Total incidentes | P1 | P2 | P3 | MTTR p95 |
|---|---|---|---|---|---|
| Q3-2025 | 32 | 0 | 6 | 26 | 1h40min |
| Q4-2025 | 28 | 2 (Black Friday) | 8 | 18 | 2h10min |
| Q1-2026 | 15 | 1 (TKT-12) | 4 | 10 | 2h47min |

A redução de Q4 para Q1 (28 → 15) reflete maturidade dos runbooks e treinamento de Diego. Plano Q2-2026: manter cadência de 15-20 incidentes/trimestre, reduzir P1 para 0 (preventivo).

### 20.8 Plano de melhoria contínua Q2-2026

Iniciativas aprovadas com base em análise Q1-2026:

**Iniciativa 1 — Hardening RabbitMQ:**
- Upgrade para versão 3.13 LTS (de 3.11.18).
- Adicionar shadow cluster para teste de mudanças.
- Implementar message replay automatizado via API admin.
- Owner: Bruno · Prazo: Q2-2026 fim.

**Iniciativa 2 — Refactor plugin Magento:**
- Reescrever cálculo de CFOP no `Apex_OrderSync`.
- Eliminar dependência do trigger ADVPL como segunda linha.
- Adicionar testes unitários cobrindo 95% dos cenários CFOP.
- Owner: Vtex Implementer + Marina · Prazo: Q3-2026.

**Iniciativa 3 — Observabilidade aprimorada:**
- Adicionar tracing de queries Oracle no SAP FI.
- Dashboards Grafana por marca (separar visão consolidada).
- Alertas baseados em ML (Azure Monitor Smart Detection).
- Owner: Bruno · Prazo: Q4-2026.

**Iniciativa 4 — Treinamento de equipe:**
- Onboarding de 1 analista Tier 2 adicional (cobertura férias).
- Pair-debugging entre Diego e Marina semanal.
- Workshops trimestrais sobre novos cenários.
- Owner: Marina + RH · Prazo: contínuo.

Investimento total Q2: R$ 480.000 (aprovado pela diretoria).

### 20.9 Anatomia de um postmortem (template usado)

Todos os incidentes P1 e P2 geram postmortem formal em até 48 horas após resolução. O template usado é estruturado em 7 seções:

**Seção 1 — Resumo executivo (1 parágrafo):**
- O que aconteceu, quando, quanto tempo durou, quem foi afetado.

**Seção 2 — Timeline detalhada:**
- Linha por linha com timestamp, ação executada, responsável, resultado.
- TKT-12 timeline tem 47 entradas — referência para granularidade esperada.

**Seção 3 — Causa-raiz:**
- Análise "5 Whys" para chegar à causa fundamental.
- Distinção entre trigger (o que disparou) e causa-raiz (o que permitiu o trigger ter impacto).

**Seção 4 — Impacto:**
- Métricas quantitativas: pedidos afetados, GMV perdido, MTTR, etc.
- Impacto qualitativo: percepção do cliente, mídia social, comunicação interna.

**Seção 5 — Lições aprendidas:**
- O que funcionou bem (não tudo é negativo).
- O que poderia ter sido melhor.
- O que era impossível prever.

**Seção 6 — Ações corretivas:**
- Lista numerada com owner, prazo, status, link para PR/ticket.
- Diferenciar correções imediatas (curto prazo) de melhorias estruturais (longo prazo).

**Seção 7 — Apêndices:**
- Logs relevantes, screenshots de dashboards, threads Slack, evidências técnicas.

Postmortems são revisados em reunião quinzenal pelo time inteiro (Marina + Diego + Bruno + ocasionalmente Lia). O objetivo não é culpa — é aprendizado coletivo. "Blameless postmortem culture" é princípio fundamental.

### 20.10 Casos não-incidentes (near misses)

Além dos incidentes formalmente declarados, Marina cataloga "near misses" — situações onde quase houve incidente mas foi evitado por sorte ou intervenção rápida. Q1-2026 teve 7 near misses catalogados:

1. Tablespace `PSAPSR3` atingiu 84% (1pp abaixo do critical) antes de auditoria fiscal.
2. RabbitMQ node `rabbitmq-node02` ficou unhealthy por 4min58s (timeout era 5min para failover).
3. Certificado A1 NF-e renovado 12 dias antes da expiração (margem aceitável é 90 dias).
4. Magento Outbox lag chegou a 115s p95 (limite warning 60s, critical 120s).
5. Frota.io token TTL ficou em 3h12min antes de renovação (alerta dispara em 4h).
6. SAP FI dump em ST22 com mensagem desconhecida (resolvido com SAP Note encontrada).
7. RabbitMQ memory atingiu 68% (limite warning 70%) durante pico de fechamento.

Catalogar near misses tem valor preventivo: identifica thresholds que estão "perto demais" do limite real e justifica ajustes proativos.

---

## Página 21 — Checklist semanal de health check (segundas 09h)

Marina executa este checklist toda segunda-feira às 09h00 BRT. Tempo médio: 35 minutos. Resultado vai para `#apex-tier1-ops` no Slack + planilha consolidada `weekly-health-check.xlsx` no SharePoint corporativo.

### 21.1 Verificações de plataforma (10 itens)

- [ ] **RabbitMQ cluster status:** `rabbitmqctl cluster_status` em 1 dos 3 nodes — todos `running`, sem network partitions.
- [ ] **RabbitMQ memory:** todos os 3 nodes <70% de `memory_used`. Verificar no dashboard ou via `rabbitmqctl status | grep memory`.
- [ ] **RabbitMQ disk:** todos nodes <60% de uso do disco. Threshold `disk_free_alarm` configurado em 40%.
- [ ] **Service Bus throttling events:** Azure Portal → namespace → Metrics → `ServerErrors` últimos 7 dias = 0.
- [ ] **AKS pod health:** `kubectl get pods -n apex-prod` — todos em status `Running`, restart count <5 nas últimas 168h.
- [ ] **SAP FI tablespace usage:** SAP GUI → tx **DB02** → todos os tablespaces críticos (`PSAPSR3`, `PSAPUNDO`, `PSAPTEMP`) <80%.
- [ ] **TOTVS AppServer connections:** todos 4 servers (`protheus-app01..04`) <500 conexões ativas (limite 800).
- [ ] **MSSQL TOTVS tempdb:** <60GB (de 100GB alocados).
- [ ] **Oracle SAP FI Data Guard lag:** Marina ou Basis executa `dgmgrl > show database 'SAP_STANDBY'` → lag <10 segundos.
- [ ] **Application Insights ingestion:** últimos 7 dias <40GB/dia. Threshold 50GB/dia gera throttling.

### 21.2 Verificações de fluxo de negócio (8 itens)

- [ ] **Taxa NF-e autorizada 1ª tentativa últimos 7 dias:** ≥93% (SLO de longo prazo é 95%, debt aberto).
- [ ] **Filas DLQ:** todas com <50 mensagens. Nenhuma mensagem em DLQ >72h.
- [ ] **Magento Outbox lag p95:** <120 segundos últimos 7 dias. Painel Grafana `Magento E-commerce`.
- [ ] **Frota.io token TTL atual:** >12 horas até expiração (renovação cronjob funcionando).
- [ ] **Service Bus session draining:** 0 sessions com idade >1 hora.
- [ ] **SAP IDocs em status 51:** tx BD87 → menos de 10 IDocs no backlog. Mais que isso, investigar BAPI failing.
- [ ] **TOTVS jobs falhados últimos 7 dias:** <5 jobs falhados (consulta tabela `SIGAFIS_JOBS_LOG` ou tx `SM37` equivalente no Protheus).
- [ ] **PIX recebimentos sem identificação:** TKT-47 padrão recorrente — <3 PIX órfãos pendentes na conciliação.

### 21.3 Verificações de segurança (5 itens)

- [ ] **Key Vault secrets expiring 30d:** 
  ```bash
  az keyvault secret list --vault-name kv-apex-prod-eastus2 | \
    jq '.[] | select(.attributes.expires < (now+2592000)) | .name'
  ```
  Lista vazia = OK. Qualquer item lista exige ação de renovação.

- [ ] **Certificado A1 NF-e validade:** consulta no SAP tx **STRUSTSSO2** → >90 dias para expiração. Validade atual: até 2027-11-14.

- [ ] **SAP Security Audit Log (SM20):** revisar tentativas de login falhadas usuário `RFC_APEX` últimos 7 dias. Mais de 5 = possível ataque brute force, escalar Bruno.

- [ ] **AKS RBAC anomalias:** `kubectl get rolebindings -A` últimos 7 dias sem novos bindings não aprovados. Comparar com baseline em `apex-infra-prod/security/aks-rbac-baseline.yaml`.

- [ ] **Magento admin login anomalies:** revisar tabela `admin_user_log` em MSSQL Magento → logins de IP fora do range corporativo (10.0.0.0/8, 172.16.0.0/12).

### 21.4 Output e follow-up

Marina marca cada item ✅ ou ❌ na planilha SharePoint. ❌ vira ticket no HelpSphere com tag `health-check-segunda` e categoria correspondente.

O resumo em texto livre é postado em `#apex-tier1-ops` em formato padronizado:

```
Weekly Health Check - {data}
==========================
✅ 22/23 itens OK
❌ 1 item degradado

Highlights da semana:
- Throughput médio +12% vs semana anterior
- Zero incidentes P1/P2
- Failover RabbitMQ Q1 test concluído com sucesso

Lowlights / atenção:
- Tablespace PSAPSR3 em 76% (subindo 2pp/semana)
- Aguardando renewal contrato TOTVS Mais (vence em Q3-2026)
- Marina ausente próxima quarta — Bruno cobre escalações
```

### 21.5 Métrica de aderência ao checklist

Marina é avaliada trimestralmente pela aderência ao checklist:
- **Q1-2026:** 12 de 13 semanas executadas (uma semana cancelada por ausência justificada).
- **Itens não-conformes detectados:** 18 em 12 semanas (1.5 por semana média) — todos endereçados.
- **Itens críticos detectados:** 2 (tablespace `PSAPUNDO` em 92% que virou ação corretiva Q4-2025, certificado de NF-e expirando em 60 dias que foi renovado proativamente).

### 21.6 Evolução do checklist

O checklist é vivo — Marina adiciona itens conforme aprendizados de postmortems. Adicionado em Q1-2026:
- Verificação de Frota.io TTL (após TKT-15).
- Monitoramento de payload size p95 (após TKT-12).
- Auditoria de `apex_outbox_orders` com status `failed` >24h.

Plano Q2-2026: adicionar verificação de capacidade Azure (cores reserved vs usado) para evitar surpresas no scale-up.

### 21.7 Health check de SAP FI específico (Marina + Basis quinzenal)

Além do checklist semanal, há um health check específico de SAP FI executado quinzenalmente em conjunto com a equipe Basis terceirizada. Cobre aspectos mais profundos que Marina sozinha não tem tempo de verificar.

**Verificações Basis (quinzenal):**

- [ ] Tx **SM21** (System Log): revisar últimas 2 semanas, identificar padrões anormais.
- [ ] Tx **ST22** (Runtime Errors): contar dumps por usuário, programa e tipo. Dumps recorrentes >5/semana investigam causa.
- [ ] Tx **SM12** (Lock Entries): identificar locks órfãos. Aceitável: <3 locks órfãos. Acima disso, equipe Basis libera com confirmação Marina.
- [ ] Tx **SM13** (Update Records): records em status `terminated`. Indicam updates que falharam. Aceitável: 0.
- [ ] Tx **DB02** (Database Performance): tablespace usage trends + indices fragmentados.
- [ ] Tx **AL11** (SAP directories): espaço em disco SAP work directory (alerta 80%).
- [ ] Tx **RZ20** (CCMS Monitor): alertas amarelos/vermelhos no monitor central.
- [ ] Tx **SARA** (Archive Administration): jobs de arquivamento pendentes.
- [ ] Tx **SLG1** (Application Log): logs com mensagens de erro críticas.

**Verificações Marina (quinzenal):**

- [ ] Tx **ZAPEX_AUDIT_LOG**: revisar últimas alterações em documentos contábeis.
- [ ] Tx **ZAPEX_RECON_OUTBOX**: verificar relatório de reconciliação Magento × SAP.
- [ ] Tx **ZAPEX_SPED_VALIDATE**: validações pré-SPED do mês corrente.

A planilha consolidada do health check Basis é `sap-basis-bi-weekly-{ano-mes-dd}.xlsx` no SharePoint. Aprovação dual: Marina + responsável Basis.

### 21.8 Métricas de saúde longitudinais

Marina apresenta trimestralmente a Bruno + Carla o "Health Report" com tendências longitudinais. Métricas-chave acompanhadas:

- **Uptime do fluxo de pedido B2B (mês a mês):** alvo 99,5%. Q1-2026: 99,2% (debt aberto).
- **MTTR p95 dos incidentes:** alvo 45min. Q1-2026: 2h47min (debt aberto).
- **Taxa de NF-e autorizada 1ª tentativa:** alvo 95%. Q1-2026: 91% (debt aberto).
- **Lag médio Outbox Magento:** alvo <60s. Q1-2026: 32s (saudável).
- **Lag médio federation RabbitMQ:** alvo <15s. Q1-2026: 9s (saudável).
- **Aderência ao checklist semanal:** alvo 95%. Q1-2026: 92% (uma semana cancelada).
- **Aderência ao health check quinzenal Basis:** alvo 95%. Q1-2026: 100%.

Os três debts abertos (uptime, MTTR, taxa NF-e) são endereçados pelas iniciativas listadas na Página 20.8.

### 21.9 Reporting executivo trimestral

Marina apresenta para Bruno + Carla um deck trimestral consolidando saúde da integração. Slides padrão:

1. **Resumo executivo (1 slide):** 3 highlights, 3 lowlights, 1 ação requerida.
2. **Métricas-chave (2 slides):** uptime, MTTR, taxa NF-e, custos.
3. **Incidentes top 5 (2 slides):** com root cause e ações tomadas.
4. **Roadmap atualizado (1 slide):** iniciativas em andamento e próximas.
5. **Riscos identificados (1 slide):** dependências críticas, gaps de capacidade, vendor risks.
6. **Investimentos solicitados (1 slide):** budget request para próximo trimestre.

A apresentação é seguida por sessão de Q&A. Decisões importantes (mudanças de SLO, investimentos >R$ 100k, contratação) saem dessa reunião.

### 21.10 Auditoria interna trimestral

Compliance interno faz auditoria trimestral focada na aderência ao runbook. Pontos auditados:

- **Aderência ao checklist semanal:** evidência de execução nas 12-13 semanas do trimestre.
- **Postmortems entregues no prazo:** 48h após resolução de P1/P2.
- **Acesso SAP via SM20:** revisar últimas alterações sensíveis (FB08, F-02, customizing).
- **Documentação de janelas de manutenção:** checklist pré-janela arquivado.
- **Renovação de secrets:** Key Vault audit log.
- **Treinamento de equipe:** registros de horas de treinamento por analista.

Resultado é compilado em relatório formal e enviado para CTO + Compliance interno. Q1-2026 audit teve 92% de aderência (alvo 90%).

---

## Página 22 — Anexos e contatos

### 22.1 Anexo I — Contatos de fornecedores

| Fornecedor | Produto | Contato | SLA contratual |
|---|---|---|---|
| **SAP Brasil** | SAP FI 4.7 EHP8 (SuperCare) | `https://launchpad.support.sap.com` · contrato `SAP-APEX-2024-001` | P1 30min · P2 4h · P3 1 dia útil |
| **TOTVS** | Protheus 12.1.33 (TOTVS Mais) | `https://suporte.totvs.com.br` · contrato `TVS-AP-2024-PRO` | P1 1h · P2 4h · P3 1 dia útil |
| **Adobe Magento** | Magento Commerce 2.4 (Premier) | `https://support.magento.com` · contrato `MGT-PREMIER-2024` | P1 1h · P2 4h |
| **Microsoft Azure** | Service Bus, AKS, App Insights (Premium Support) | Portal Azure → Help + Support · contrato `AZ-EA-2024` | P1 15min · P2 2h · P3 8h |
| **Frota.io** | Roteirizador TMS | `support@frota.io` · `+55 11 4000-0000` | Best effort (sem SLA contratual) |
| **Certisign** | Certificado A1 NF-e | `https://www.certisign.com.br/atendimento` | Renovação programada com 60 dias antecedência |
| **Vtex Implementer** | Implementação Magento (parceiro) | DM Marina via Slack `#partner-vtex` | 1 dia útil |
| **Pivotal Tanzu** | RabbitMQ consultoria | `support@pivotal.io` · sob demanda | Bilhetes pré-pagos (50h/ano) |
| **KPMG (auditoria)** | Auditoria SAP/PCI-DSS | contato direto via Compliance interno | Trimestral planejado |
| **Equipe Basis terceirizada** | SAP operação técnica | `basis-apex@partner-basis.com` · `+55 11 3000-0000` | 24/7 P1 via WhatsApp business |

### 22.2 Anexo II — Tabela CFOP rápida (top 15 Apex)

| CFOP | Descrição | Uso típico Apex |
|---|---|---|
| 5102 | Venda mercadoria de terceiros, **intra-estadual** | B2B SP→SP (Apex Mercado, Apex Tech) |
| 5403 | Venda c/ ST, **intra-estadual** | Bebidas, eletrônicos com substituição tributária |
| 5405 | Venda c/ ST varejo, **intra-estadual** | Apex Tech (smart TVs intra-SP) |
| 5910 | Remessa de bonificação | Marketing/amostra grátis |
| 5949 | Outra saída não especificada | Brinde, mostruário, demonstração |
| 6102 | Venda mercadoria de terceiros, **interestadual** | TKT-3 caso real (deveria ter sido aqui) |
| 6403 | Venda c/ ST, **interestadual** | Eletro p/ outros estados |
| 5202 | Devolução de compra (saída) | Devolução para fornecedor |
| 5915 | Remessa para conserto | Apex Tech garantia + reparo |
| 1101 | Compra para industrialização (entrada) | Apex Casa (matéria-prima móveis) |
| 1102 | Compra para comercialização (entrada) | Apex Mercado (hortifruti) |
| 1411 | Devolução de venda mercadoria (entrada) | Apex Moda (devoluções cliente) |
| 5910 | Transferência entre filiais (saída) | CD-Cajamar → Lojas |
| 1910 | Transferência entre filiais (entrada) | Lojas ← CD-Cajamar |
| 5933 | Prestação de serviço tributado pelo ISS | Apex Casa montagem em endereço cliente |

### 22.3 Anexo III — Glossário rápido

- **AKS:** Azure Kubernetes Service.
- **BAPI:** Business Application Programming Interface (SAP).
- **BUKRS:** Código da empresa no SAP (Apex usa AP01..AP06).
- **CFOP:** Código Fiscal de Operações e Prestações.
- **DLQ:** Dead Letter Queue.
- **IDoc:** Intermediate Document (SAP).
- **MTTR:** Mean Time To Recovery.
- **MU:** Messaging Unit (Azure Service Bus Premium).
- **NCM:** Nomenclatura Comum do Mercosul.
- **NF-e:** Nota Fiscal Eletrônica (modelo 55).
- **NFC-e:** Nota Fiscal de Consumidor Eletrônica (modelo 65) — cobertura no `manual_pos_funcionamento.pdf`.
- **OOMKilled:** Out-Of-Memory Killed (Kubernetes).
- **PaaS:** Platform as a Service.
- **PeekLock:** modo de consumo do Azure Service Bus (lock + ack manual).
- **RFC:** Remote Function Call (SAP).
- **RPO:** Recovery Point Objective.
- **RTO:** Recovery Time Objective.
- **SAS:** Shared Access Signature (Azure).
- **SCAN:** Sistema de Contingência do Ambiente Nacional (NF-e).
- **SEFAZ:** Secretaria de Fazenda.
- **SLO:** Service Level Objective.
- **SPED:** Sistema Público de Escrituração Digital.
- **TMS:** Transportation Management System.

### 22.4 Anexo IV — Histórico de versões deste runbook

| Versão | Data | Autor | Mudanças principais |
|---|---|---|---|
| v3.4 | 2026-05-11 | Marina | Adicionado P11 (TKT-12), atualização thresholds, novo Anexo II CFOP |
| v3.3 | 2026-02-20 | Marina | Adicionado P9 (Rejeição 539), tabela top 10 SEFAZ |
| v3.2 | 2026-01-22 | Bruno | Postmortem TKT-12 incorporado, guardrails CI |
| v3.1 | 2025-11-15 | Marina | Atualização stack RabbitMQ 3.11, quorum queues |
| v3.0 | 2025-09-01 | Bruno | Reescrita completa após implementação Outbox pattern |
| v2.x | até 2025-08 | — | Versões legadas, sem rastreamento granular |

### 22.5 Footer

**Documento:** RBK-FIN-001 · `runbook_sap_fi_integracao.pdf`
**Versão:** v3.4 · **Vigência:** Q2-2026 · **Próxima revisão:** Q3-2026
**Owner:** Bruno (CTO) · **Revisores:** Marina (Tier 2), Diego (Tier 1)
**Classificação:** Confidencial · uso interno Apex Group · não distribuir externamente sem aval Compliance

**Cross-references:**
- `manual_pos_funcionamento.pdf` (NFC-e POS e cenário consumidor final)
- `faq_horario_atendimento.pdf` (cutoff Frota.io 17h e janelas de manutenção)
- `runbook_problemas_rede.pdf` (TKT-18 BlackFriday 2025 postmortem)
- `politica_reembolso_lojista.pdf` (alçadas financeiras e fluxo de estorno)
- `arquitetura-integracao.md` (diagramas detalhados em wiki interno)

**Para sugerir alteração:** abrir PR em `apex-runbooks/RBK-FIN-001-source.md` com label `runbook-update`. Revisão por Marina obrigatória. Aprovação por Bruno para mudanças estruturais.

**Suporte interno deste runbook:** Slack `#apex-runbooks-feedback` (Marina modera). Sugestões anônimas via formulário corporativo `https://wiki.apex.local/feedback`.

### 22.6 Anexo V — Mapeamento de regiões e UFs (para CFOP)

Tabela auxiliar para determinação rápida de CFOP intra/interestadual quando o operador não tem certeza:

| Loja Apex | Localização | UF | CFOP saída intra | CFOP saída interestadual |
|---|---|---|---|---|
| Apex Mercado matriz | São Paulo capital | SP | 5102 | 6102 |
| Apex Mercado CD-Cajamar | Cajamar | SP | 5102 | 6102 |
| Apex Tech Berrini | São Paulo capital | SP | 5102 | 6102 |
| Apex Tech filial Curitiba | Curitiba | PR | 5102 (PR→PR) | 6102 (PR→outros) |
| Apex Moda Iguatemi | São Paulo capital | SP | 5102 | 6102 |
| Apex Casa Pinheiros | São Paulo capital | SP | 5102 | 6102 |
| Apex Logística matriz | Cajamar | SP | 5102 | 6102 |
| Apex Logística CD-Rio | Duque de Caxias | RJ | 5102 (RJ→RJ) | 6102 (RJ→outros) |
| Apex Logística CD-MG | Contagem | MG | 5102 (MG→MG) | 6102 (MG→outros) |

A determinação correta exige:
1. Identificar a UF de origem (UF do estabelecimento que emite a NF-e).
2. Identificar a UF de destino (UF do estabelecimento que recebe a mercadoria, **não** o endereço de cobrança).
3. Se origem = destino → CFOP 5xxx (intra-estadual).
4. Se origem ≠ destino → CFOP 6xxx (interestadual).

Casos especiais (consultar Marina ou contabilidade):

- **Exportação:** CFOP 7xxx (não usado pelo Apex atualmente).
- **Substituição tributária com destinatário consumidor final:** CFOP 5405 (varejo intra) ou 6405 (varejo inter).
- **Operações entre filiais da mesma empresa:** CFOP 5910 (saída transferência) e 1910 (entrada transferência).

### 22.7 Anexo VI — Códigos de empresa SAP (BUKRS) e mapeamento

| BUKRS | Marca | Razão social fiscal | CNPJ raiz | Endereço fiscal |
|---|---|---|---|---|
| AP01 | Apex Holding | Apex Group Participações S.A. | 11.111.111/0001-11 | São Paulo - SP |
| AP02 | Apex Mercado | Apex Mercado Varejo Ltda. | 22.222.222/0001-22 | São Paulo - SP |
| AP03 | Apex Tech | Apex Tech Comércio de Eletrônicos Ltda. | 33.333.333/0001-33 | São Paulo - SP |
| AP04 | Apex Moda | Apex Moda Confecções Ltda. | 44.444.444/0001-44 | São Paulo - SP |
| AP05 | Apex Casa | Apex Casa Móveis e Decor Ltda. | 55.555.555/0001-55 | São Paulo - SP |
| AP06 | Apex Logística | Apex Logística Transportes Ltda. | 66.666.666/0001-66 | Cajamar - SP |

Todas as marcas compartilham a mesma instância SAP FI (single-stack). A segregação contábil é feita por BUKRS. Cada BUKRS tem plano de contas independente embora alinhado (todos derivam do plano de contas mestre Apex `APEX_COA`).

### 22.8 Anexo VII — FAQ frequente para novos analistas

**Q1: Por que o SAP FI está no on-prem e o Magento na cloud?**
R: Decisão histórica (2018) baseada em latência crítica para integração com TOTVS (também on-prem) + restrições de licenciamento SAP. Plano de migração para SAP S/4HANA Cloud está no roadmap Q4-2027.

**Q2: Por que usar RabbitMQ E Service Bus se ambos são message brokers?**
R: Service Bus é o broker corporativo Azure-native, usado para comunicação entre componentes na cloud. RabbitMQ é específico para o segmento on-prem (TOTVS ↔ SAP) onde latência e topologia local importam. ADR-04 documenta a decisão.

**Q3: Por que o callback de NF-e é uma fila separada (`sap.fi.nfe.callback`)?**
R: Para desacoplar timing. NF-e pode demorar minutos para retornar da SEFAZ; não queremos manter o channel principal aberto esperando. O callback é processado independentemente quando chega.

**Q4: Como sei se um pedido está realmente travado vs apenas lento?**
R: Pedidos lentos têm spans recentes (último update <5 min) no Application Insights. Pedidos travados não têm update >15 min. A query Q03 da biblioteca KQL (Página 14.7) lista travados.

**Q5: O que fazer se Marina e Bruno estão indisponíveis?**
R: Pulamos para Lia (Head Atendimento) que coordena com terceirizado `apex-soc-vendor`. Em DR severo, escalamos para fornecedores SAP/TOTVS via canal P1.

**Q6: Posso modificar payloads em DLQ manualmente?**
R: NUNCA. Modificar payload em DLQ pode causar inconsistência fiscal/contábil grave. Sempre cancele a operação original e crie nova via fluxo padrão.

**Q7: O que é "messageType" no header?**
R: Discriminador de tipo de mensagem no payload. Valores possíveis: `pedido.criar`, `pedido.cancelar`, `nfe.autorizar`, `nfe.callback`, `estoque.atualizar`, `pagamento.confirmar`. Usado em filtros de subscription do Service Bus.

**Q8: Onde acompanho tickets HelpSphere relevantes para integração?**
R: HelpSphere filtro `tag:integracao OR tag:nfe-rejeitada OR tag:erp-sync`. Marina e Diego têm essa view como dashboard padrão.

### 22.9 Anexo VIII — Padrões de naming convention

Para manter consistência em logs, métricas e recursos, seguimos convenções rigorosas.

**Nomes de recursos Azure:**
- Resource Groups: `rg-apex-{componente}-{ambiente}-{regiao}` (ex: `rg-apex-magento-prod-eastus2`).
- Service Bus namespace: `sb-apex-{ambiente}-{regiao}` (ex: `sb-apex-prod-eastus2`).
- Key Vault: `kv-apex-{ambiente}-{regiao}` (ex: `kv-apex-prod-eastus2`).
- Storage Account: `stapex{componente}{ambiente}{regiao}` (ex: `stapexlogprodeastus2`, sem hifens, max 24 chars).

**Nomes de filas RabbitMQ:**
- Padrão: `{origem}.{destino}.{tipo}` (ex: `totvs.sap.posting`).
- DLQ: `{nome}.dlq`.
- Sempre lowercase, separação por ponto.

**Nomes de subscriptions Service Bus:**
- Padrão: `apex-{marca}-{tipo}-sub` (ex: `apex-mercado-pedidos-sub`).

**Nomes de jobs Kubernetes:**
- Padrão: `{servico}-{funcao}-{periodicidade}` (ex: `frota-token-refresh-hourly`).

**Nomes de queries KQL salvas:**
- Padrão: `Q{numero}-{descricao-curta}` (ex: `Q03-payload-large-orders`).

Naming inconsistente é flagueado em code review e geralmente bloqueia merge.

### 22.10 Anexo IX — Encerramento e validação do runbook

Este runbook é vivo e mantido. Marina é responsável pela validação trimestral (revisar páginas, verificar acuracidade técnica, atualizar comandos depreciados). Bruno é responsável pela arquitetura (garantir que decisões arquiteturais estão refletidas).

**Validação trimestral checklist:**

- [ ] Versões do stack estão atuais.
- [ ] Comandos shell/SQL/SAP funcionam (smoke test em staging).
- [ ] URLs de dashboards e portais estão válidas.
- [ ] Contatos de fornecedores estão corretos.
- [ ] Histórico de incidentes está atualizado.
- [ ] Procedimentos P9/P11/P13 refletem realidade operacional.
- [ ] Janelas de manutenção e período de freeze estão alinhados com calendário.
- [ ] Cross-references com outros PDFs estão coerentes.

Próxima revisão: Q3-2026 (julho a setembro 2026). Marina agendará revisão coletiva com Diego + Bruno na primeira semana de julho.

**Indicadores de qualidade do runbook:**

- Diego consegue resolver 80% dos tickets Tier 1 consultando apenas este documento.
- MTTR p95 abaixo de 90 minutos (alvo revisado para Q2).
- Onboarding de novo Tier 2 em <2 semanas.
- Aderência ao checklist semanal >95%.

Este runbook é classificado como **documento crítico** da Apex — perda ou desatualização tem impacto operacional direto. Backup é feito automaticamente para o Git enterprise + SharePoint corporativo + cópia offline na sede.

### 22.11 Anexo X — Termos e acrônimos adicionais

Complementar ao glossário do Anexo III, termos técnicos específicos que aparecem neste runbook:

- **ABAP:** Advanced Business Application Programming — linguagem de programação proprietária SAP.
- **ABL:** Advanced Business Language — usada pelo Progress OpenEdge (não confundir com Protheus que usa ADVPL).
- **ADVPL:** Advanced Programming Language — linguagem proprietária TOTVS Protheus.
- **ALE:** Application Link Enabling — framework SAP de integração via IDocs.
- **BKPF:** Buchhaltungsbeleg Kopf — tabela header de documentos contábeis SAP (Accounting Document Header).
- **BSEG:** Buchhaltungsbeleg Segment — tabela items de documentos contábeis SAP.
- **CCT:** Convenção Coletiva de Trabalho.
- **CDC:** Código de Defesa do Consumidor.
- **CNAB:** Centro Nacional de Automação Bancária (formato de arquivo bancário).
- **CST:** Código de Situação Tributária.
- **DARF:** Documento de Arrecadação de Receitas Federais.
- **DLQ:** Dead Letter Queue.
- **ECF:** Escrituração Contábil Fiscal.
- **eSocial:** Sistema de Escrituração Digital das Obrigações Fiscais, Previdenciárias e Trabalhistas.
- **GMV:** Gross Merchandise Value — valor bruto de mercadorias vendidas.
- **HPA:** Horizontal Pod Autoscaler (Kubernetes).
- **ICMS-ST:** ICMS por Substituição Tributária.
- **IRRF:** Imposto de Renda Retido na Fonte.
- **JCo:** Java Connector (SAP — biblioteca para conectividade Java-SAP).
- **JWT:** JSON Web Token.
- **LGPD:** Lei Geral de Proteção de Dados.
- **MDR:** Merchant Discount Rate (taxa cobrada por adquirente sobre cartão).
- **MEI:** Microempreendedor Individual.
- **MM:** Materials Management (módulo SAP).
- **NSG:** Network Security Group (Azure).
- **PCI-DSS:** Payment Card Industry Data Security Standard.
- **PSP:** Payment Service Provider (no contexto PIX).
- **PVA-SPED:** Programa Validador e Assinador SPED.
- **RBAC:** Role-Based Access Control.
- **RDS:** Relational Database Service (não usado pelo Apex; menção comparativa).
- **SAP_ALL:** profile de autorização SAP com acesso total (uso emergencial apenas).
- **SCAN:** Sistema de Contingência do Ambiente Nacional.
- **SD:** Sales and Distribution (módulo SAP).
- **SLO:** Service Level Objective.
- **SOAP:** Simple Object Access Protocol (protocolo do webservice SEFAZ).
- **SP18:** Support Package 18 (SAP).
- **SPED:** Sistema Público de Escrituração Digital.
- **SPRO:** transação SAP de customizing.
- **TMS:** Transportation Management System.
- **WMS:** Warehouse Management System.
- **WSCONFIG:** arquivo de configuração TOTVS Protheus AppServer.

### 22.12 Anexo XI — Posicionamento estratégico deste runbook

Este runbook não é apenas documentação operacional — é também um ativo estratégico da empresa. Justificativas:

**1. Redução de bus factor:** sem este documento, o conhecimento da integração ficaria concentrado em Marina e Bruno. A documentação reduz risco de descontinuidade operacional em caso de afastamento prolongado de uma dessas pessoas.

**2. Onboarding acelerado:** novos contratados Tier 2 entregam valor produtivo em 2 semanas (vs 8 semanas pré-runbook). Investimento de capital humano com retorno claro.

**3. Vantagem em auditoria:** KPMG menciona explicitamente a qualidade da documentação operacional como ponto positivo nos relatórios anuais. Apex tem rating de qualidade documental "excelente" desde 2025.

**4. Base de conhecimento para automação:** o procedimento P9 está sendo automatizado via Azure OpenAI + função custom no HelpSphere (Q4-2026). Sem este runbook estruturado, a automação seria impossível.

**5. Continuidade do negócio:** em cenário de DR severo onde Bruno e Marina estão indisponíveis simultaneamente, este runbook permite que Lia + terceirizado conduzam operação básica até retorno do time interno.

A política Apex é que **todo runbook crítico tem versão para o N+1** — alguém que nunca operou o sistema pode seguir o documento e executar o procedimento básico. Marina é responsável por validar esse "teste do estranho" trimestralmente, idealmente pedindo para um analista externo (ex: estagiário ou novo contratado) ler e executar uma simulação.

---

*Este é o conteúdo completo do runbook RBK-FIN-001 versão 3.4 vigente Q2-2026. Total: 22 páginas, ~25.000 palavras de conteúdo operacional production-grade.*

*Para feedback sobre clareza, completude ou erros técnicos: `#apex-runbooks-feedback` no Slack ou e-mail `marina.oliveira@apex.local`.*

---

*Fim do documento RBK-FIN-001. Última atualização: 2026-05-11 por Marina (Tier 2 Integração). Próxima revisão programada: Q3-2026 conforme política de revisão trimestral.*
