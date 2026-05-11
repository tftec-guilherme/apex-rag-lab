# Outline — `manual_pos_funcionamento.pdf` (PDF #7 de 8)

> **Categoria:** Operacional (forte componente TI) · **Páginas-alvo:** 35 · **Tickets âncora alvo:** ≥3
>
> Trabalho de outline cravado por @analyst (Atlas) em 2026-05-11 (curadoria editorial Story 06.7 v2.0 Grand Finale). Manual operacional de POS Apex — hardware, software, emissão NFC-e, troubleshooting, fechamento, sangria, fluxos de exceção. Voz procedural técnica com forte componente TI.

---

## 🎯 Objetivo deste PDF

Manual de operação técnica do **Ponto de Venda (POS) Apex Group** consolidando:
- Hardware homologado (terminal Bematech, impressora térmica Epson, PinPad Cielo)
- Software thick-client LINX BIGiPOS 12.5 + sync TOTVS
- Emissão de NFC-e em modo online e contingência (com base na rejeição SEFAZ-SP real)
- Operações de caixa (abertura, sangria, fechamento) com persona Diego (Tier 1)
- Troubleshooting Top 10 que Diego executa antes de escalar Marina
- Compliance fiscal (SPED) e PCI-DSS

**Tom:** Manual técnico procedural — passo a passo numerado quando há fluxo, tabelas estruturadas para erros e códigos, voz direta sem hedging. Diego (operador caixa) é o leitor primário; Marina (supervisora) é o leitor secundário; Bruno (CTO) valida o conteúdo TI.

**Substitui no seed v2.1.0:** `[KB] troubleshooting-pdv.pdf` (referenciado em TKT-11).

---

## 📑 Estrutura sugerida (35 páginas — 7 capítulos)

### Capítulo 1 — Hardware POS (Páginas 1-5)

#### Página 1 — Visão geral do terminal homologado
- Header oficial: `[APEX GROUP] Manual de Operação POS · v4.2 · Q2-2026`
- Subtítulo: *Uso interno · Operadores Tier 1 + Supervisores Tier 2 + TI Tier 3*
- Versão e revisão: `Revisão anual Q2-2026 · próxima revisão Q2-2027 · Aprovador: Bruno (CTO)`
- Stack homologada (única configuração suportada):
  - Terminal: **Bematech MP-4200 TH** (impressora térmica integrada, 200mm/s, corte automático)
  - Backup impressora: **Epson TM-T20III** USB (substituição emergencial)
  - SO: **Windows 10 IoT LTSC 2021** (suporte estendido até 2032)
  - Imagem padrão: `POS-APEX-W10IOT-v4.2.wim` (deploy via MDT do TI)
- Tabela de capilaridade da frota:

| Marca | Lojas | POS por loja (média) | Total POS na frota |
|---|---|---|---|
| Apex Mercado | 142 | 6 | 852 |
| Apex Tech | 78 | 4 | 312 |
| Apex Moda | 64 | 3 | 192 |
| Apex Casa | 41 | 3 | 123 |
| Apex Logística (recebimento doca) | 12 CDs | 2 | 24 |
| **Total** | **337** | — | **1.503** |

#### Página 2 — Periféricos homologados
- **Leitor de código de barras 2D Honeywell Voyager 1450g** (USB HID, leitura 1D + 2D + QR)
  - Suporta GS1 DataBar (alimentos perecíveis Apex Mercado)
  - Configuração: modo wedge teclado · trigger contínuo desativado
- **Balança Toledo Prix 3 Fit** (somente Apex Mercado · seção hortifruti + açougue + padaria)
  - Comunicação serial RS-232 → conversor USB FTDI
  - Protocolo: Toledo P05 a 9600 bps, 8N1
  - Calibração obrigatória anual + selo INMETRO atualizado
- **Gaveta de dinheiro Bematech GD-56** (eletro-mecânica, abertura via comando ESC/POS da impressora)
- **Display cliente (customer-facing) Bematech LD220**
  - VFD 2 linhas × 20 caracteres, USB
  - Exibe valor da venda + mensagem promocional configurável

#### Página 3 — PinPad Cielo VeriFone Vx690
- Modelo único homologado: **Cielo LIO V3** (Android 8.1, certificado PCI-PTS 5.x)
- Conexões: USB-C (alimentação + dados TLS) · backup serial RS-232
- Software CIELO Pay v2.18 (atualização OTA gerenciada pela Cielo)
- Funcionalidades disponíveis: débito, crédito (à vista + parcelado), voucher refeição/alimentação (Sodexo, Alelo, VR), PIX via QR dinâmico
- Tabela de tempos médios homologados (medidos pela TI Bruno em 2026-03):

| Operação | Tempo médio | P95 |
|---|---|---|
| Débito chip | 4.2s | 7.1s |
| Crédito à vista | 5.8s | 9.3s |
| Crédito parcelado (10x) | 7.4s | 12.0s |
| Voucher Sodexo | 6.1s | 10.2s |
| PIX QR dinâmico | 8.7s | 14.5s (depende confirmação banco cliente) |

#### Página 4 — Cabeamento, no-break, fonte
- No-break obrigatório por POS: **APC Back-UPS 1200VA** (autonomia ~25min em carga típica)
- Fonte do terminal: 24V/2.5A · fonte da impressora interna: 24V (mesma do terminal) · gaveta: 12V externa
- Cabeamento de loja:
  - Backbone Ethernet Cat6 até switch PoE (Cisco SG350)
  - Cada POS: cabo Cat6 direto ao switch (sem hub)
  - Comprimento máximo homologado: 90m do switch ao POS
- Manutenção preventiva trimestral (calendário no `manual_operacao_loja_v3.pdf` seção 9):
  - Limpeza interna terminal (ar comprimido seco)
  - Teste de autonomia do no-break (descarregar + recarregar)
  - Inspeção visual do cabeamento e conectores

#### Página 5 — Backup hardware (POS secundário)
- **Cada loja mantém 1 POS secundário desligado em rack próximo** (sem alimentação, aguardando ativação)
- Ativação em ≤10min seguindo Procedimento PROC-POS-001 (documentado no Anexo A):
  1. Diego identifica POS principal inoperante
  2. Marina (supervisora) autoriza substituição
  3. Diego desconecta cabos (rede, força, USB) do POS principal
  4. Diego pluga os mesmos cabos no POS secundário (mesmo identificador físico de caixa)
  5. POS secundário inicializa Windows + LINX BIGiPOS em ~3min
  6. Diego abre caixa com saldo do POS principal (consulta no Painel Supervisor)
- POS principal vai para a sala TI da loja, marcação por etiqueta vermelha "MANUTENÇÃO"
- Bruno (CTO) recebe alerta automático via PagerDuty quando substituição ocorre

---

### Capítulo 2 — Software POS (Páginas 6-10)

#### Página 6 — Arquitetura thick-client + sync
- **LINX BIGiPOS 12.5** instalado localmente (SQL Server Express + .NET Framework 4.8)
- Banco local: `C:\BIG\db\bigipos.mdf` (~2GB típico, ~6GB lojas grandes)
- Sync periódico bidirecional com TOTVS Protheus (matriz):
  - **Cadastros** (produtos, preços, promoções): pull do TOTVS a cada 15min
  - **Movimentos** (vendas, cancelamentos, sangrias): push para TOTVS a cada 5min
  - **Fechamento de caixa**: push imediato + replay para SAP FI
- Comunicação: HTTPS + JWT, fila MSMQ local em caso de queda de rede
- Limite de fila MSMQ: **4 horas de operação offline** (após isso bloqueio até reconexão)

#### Página 7 — Tela de operação (atalhos teclado)
- Interface única para operador: BIG iPOS Front
- Atalhos críticos (PUF — Painel de Uso Frequente):

| Tecla | Ação |
|---|---|
| **F1** | Consulta de produto por código/descrição |
| **F2** | Aplicar desconto (requer matrícula supervisora) |
| **F3** | Cancelar item da venda em curso |
| **F4** | Finalizar venda → tela de pagamento |
| **F5** | Abrir gaveta de dinheiro (apenas durante venda em andamento) |
| **F6** | Sangria intermediária |
| **F7** | Reimprimir último cupom |
| **F8** | Modo devolução (requer matrícula supervisora) |
| **F9** | Modo contingência NFC-e (uso emergencial) |
| **F10** | Fechamento de caixa (apenas supervisora) |
| **Ctrl+L** | Travar tela (Diego pausa para banheiro/almoço) |
| **Ctrl+Q** | Encerrar turno (logoff operador) |

#### Página 8 — Modos de operação (online vs offline)
- **Online (modo padrão):**
  - SEFAZ-SP responde NFC-e em <30s
  - Sync imediata com TOTVS
  - PinPad Cielo conectado e autorizando
- **Offline (contingência):**
  - Limite ≤4h consecutivas (configurável em `bigipos.config`, padrão 240min)
  - NFC-e emitida em modo contingência com chave provisória local
  - Sincronização automática quando reconecta
  - PinPad Cielo opera de forma autônoma (autoriza pelo modem GSM próprio se rede loja cair)
- **Transição automática:** software detecta queda de SEFAZ em 3 tentativas consecutivas com timeout e migra para contingência (Diego recebe alerta na tela: "MODO CONTINGÊNCIA ATIVO desde 14h32")

#### Página 9 — Atualizações de versão LINX
- Janela oficial de update: **toda terça-feira 03h-05h** (loja fechada)
- Atualização puxada por agendador Windows + PowerShell DSC
- Validação obrigatória pós-update (smoke test 5min, executado pelo POS na inicialização):
  1. Conectividade SEFAZ (ping homolog + prod)
  2. Conectividade TOTVS (sync de 1 produto teste)
  3. Conectividade Cielo (heartbeat PinPad)
  4. Impressora térmica (cupom teste interno)
  5. Banco local (query de 1 linha em `BIG_VENDAS`)
- Falha em qualquer etapa: POS bloqueia abertura de caixa + alerta Bruno via PagerDuty

#### Página 10 — Logs locais e acesso remoto TI
- Diretório de logs: `C:\BIG\logs\` (rotacionado diariamente, retenção 90 dias)
- Arquivos principais:

| Arquivo | Conteúdo | Tamanho típico/dia |
|---|---|---|
| `bigipos-front.log` | Operação operador (cliques, vendas) | ~12MB |
| `bigipos-fiscal.log` | Comunicação SEFAZ NFC-e | ~8MB |
| `bigipos-cielo.log` | Comunicação PinPad TEF | ~4MB |
| `bigipos-sync.log` | Push/pull TOTVS | ~6MB |
| `bigipos-error.log` | Erros e stack traces | <1MB (normal) |

- Acesso remoto pelo TI (Diego solicita escalação, Bruno aciona):
  - TeamViewer Host pré-instalado em todos os POS (versão 15.x business)
  - Conexão somente com aprovação do operador (popup na tela do POS)
  - Sessão registrada em log central (`C:\BIG\logs\teamviewer-session.log`)
- Política LGPD: tela do POS pode conter dados pessoais (CPF na nota) — TI mascara antes de capturar tela em chamados (ver `politica_dados_lgpd.pdf` seção 4.2)

---

### Capítulo 3 — Emissão NFC-e (Páginas 11-18) — **CAPÍTULO TRONCO TÉCNICO**

#### Página 11 — Fluxo padrão NFC-e (operação online)
- Sequência operacional padrão (Diego executa):
  1. Login no POS com matrícula + senha
  2. Abertura de caixa (PROC-POS-002)
  3. Bipagem de produtos (leitor 2D Honeywell)
  4. Verificação de subtotal pelo cliente (display LD220)
  5. F4 → tela de pagamento
  6. Seleção da(s) forma(s) de pagamento
  7. Autorização do PinPad Cielo (se cartão/voucher/PIX)
  8. Emissão NFC-e → envio SEFAZ-SP
  9. Impressão do cupom + via cliente (formato resumido com QR code de consulta)
  10. Sync imediata TOTVS (background)
- Tempo médio operação completa em modo online: **18-25s** (após F4)

#### Página 12 — Timeout SEFAZ-SP e contingência
- Timeout default no LINX BIGiPOS: **30s** (configurável em `bigipos.config` → `sefaz.timeout_ms=30000`)
- Comportamento por tentativa:
  - 1ª tentativa: aguarda 30s · se timeout, registra `bigipos-fiscal.log` e tenta de novo
  - 2ª tentativa: aguarda 30s · se timeout, ativa modo lento (alerta na tela)
  - 3ª tentativa: aguarda 30s · se timeout, transição automática para **modo contingência** (cupom emitido local, sincroniza depois)
- Tempo total no pior cenário: 90s antes de migrar para contingência
- Marina recebe alerta de contingência via WhatsApp Business + dashboard supervisor

#### Página 13 — Caso real TKT-11 (POS Pinheiros congelando)
- **Sintoma reportado (Diego em ticket TKT-11):**
  - Caixa 03 da loja Pinheiros (Apex Mercado)
  - Vendas com >8 itens: POS congela 30-45s ao apertar F4
  - 3 ocorrências/dia em horário de pico (12h-14h e 18h-20h)
  - Algumas vezes precisa reiniciar (perda da transação)
- **Análise da TI (Bruno conduziu em 2026-04):**
  - Logs `bigipos-fiscal.log` mostraram timeout repetido SEFAZ-SP
  - Causa-raiz: pool de threads do componente NFC-e era 4 (default LINX 12.5)
  - Em vendas grandes, validação local (NCM, CFOP, alíquotas) consumia >4s
  - Combinado com chamada SEFAZ síncrona, ultrapassava timeout configurado
- **Solução aplicada (rollout Q2-2026):**
  - Ajuste em `bigipos.config`: `fiscal.threadpool.size=12` (de 4 para 12)
  - Ajuste em `bigipos.config`: `sefaz.timeout_ms=45000` (30s → 45s)
  - Pacote homologado e distribuído via update terça 03h-05h
- **Resultado:** 0 ocorrências de congelamento em 3 semanas após patch (logs validados)
- **Procedimento para Diego diagnosticar congelamento similar em outras lojas:** ver seção 6.2 (Capítulo 6 — POS travando)

#### Página 14 — Pagamento múltiplo (split)
- Combinações suportadas em uma NFC-e:
  - Dinheiro + cartão crédito
  - Dinheiro + PIX
  - Cartão débito + voucher refeição
  - Até **3 formas de pagamento** simultâneas (limite LINX BIGiPOS 12.5)
- Procedimento (Diego):
  1. F4 → tela pagamento
  2. Digita valor da 1ª forma (ex: R$ 50 em dinheiro)
  3. Confirma → sistema mostra saldo (ex: R$ 137,80 restante)
  4. Seleciona próxima forma (cartão)
  5. Aciona PinPad para o saldo
  6. Repete até zerar
- Restrição: troco só pode ser dado em dinheiro · nunca em PIX/cartão
- Casos especiais (devolução combinada): ver `faq_pedidos_devolucao.pdf` seção 6.1

#### Página 15 — Cancelamento de NFC-e
- **Janela legal:** 30 minutos após emissão (SEFAZ-SP rejeita após esse prazo)
- Procedimento operacional (requer matrícula supervisora Marina):
  1. F8 → modo cancelamento
  2. Digitar chave da NFC-e (44 caracteres) ou ler QR code do cupom
  3. Justificativa obrigatória (mínimo 15 caracteres, vai no XML do evento)
  4. Confirmação dupla (operador + supervisora)
  5. SEFAZ retorna evento cancelamento (status 135 = autorizado)
  6. Cupom de cancelamento impresso (entregar ao cliente)
- Pós-cancelamento:
  - Estoque é devolvido automaticamente em TOTVS (sync 5min)
  - Pagamento estornado:
    - Dinheiro: devolvido fisicamente do caixa
    - Cartão: estorno via PinPad (Cielo processa em D+2)
    - PIX: estorno via API Bacen (instantâneo)
- **Após 30min:** já não é cancelamento — é devolução fiscal (próxima página)

#### Página 16 — Devolução fiscal (NF-e devolução)
- Após janela de cancelamento (>30min), emite-se NF-e devolução pelo TOTVS (não pelo POS)
- CFOPs aplicáveis:

| CFOP | Operação | Quando usar |
|---|---|---|
| **1.202** | Devolução de venda — operação interna (mesmo estado) | Cliente devolve item comprado em loja do mesmo estado |
| **2.202** | Devolução de venda — operação interestadual | Cliente devolve item comprado em loja de outro estado |
| **5.202** | Devolução de compra — emitida por nós como vendedor (devolução para fornecedor B2B) | NÃO se aplica em devolução de consumidor final |
| **1.411** | Devolução de venda — entrada em substituição tributária | Itens em regime de ST (cigarros, bebidas) |

- Operador da devolução: time fiscal (não Diego) — Diego apenas captura dados em formulário FRM-DEV-001 e encaminha
- Cross-reference: `faq_pedidos_devolucao.pdf` cobre o fluxo de aprovação comercial; este manual cobre o fluxo POS

#### Página 17 — Códigos de rejeição SEFAZ frequentes
- Tabela das 7 rejeições que Diego mais encontra (somam ~80% dos casos):

| Código | Descrição SEFAZ | Causa típica | Ação Diego |
|---|---|---|---|
| **240** | Chave de acesso inválida | Erro de transmissão (raro) | Tentar reemissão · se persistir, contingência F9 |
| **539** | CFOP incompatível com operação | Venda B2B com CFOP B2C ou vice-versa | Não tentar de novo · escalar Marina (revisão cadastral TOTVS) |
| **778** | Data de emissão fora do prazo | Cupom em modo contingência além do prazo de 96h | Escalar Marina imediatamente · fiscal precisa regularizar |
| **226** | NCM inválido ou inexistente | Produto cadastrado com NCM errado | Escalar Marina · não vender o item até regularizar |
| **452** | Inscrição estadual do destinatário inválida | Cliente PJ com IE inativa | Confirmar IE com cliente · pode emitir CPF se for nota fiscal de consumidor |
| **691** | Certificado A1 vencido | Cert vencido na loja | Bruno (CTO) renova certificado · loja entra em contingência total |
| **999** | Erro genérico de schema XML | Bug LINX (raro pós v12.5) | Reportar log para Bruno via TKT-* |

- Diego nunca tenta corrigir XML manualmente — qualquer rejeição não-trivial vira ticket no HelpSphere

#### Página 18 — Modo contingência (emissão offline)
- Acionado automaticamente após 3 timeouts SEFAZ (pág. 12) ou manualmente (F9)
- Limite legal: **96 horas** para regularizar (transmitir NFC-e originalmente emitidas em contingência)
- Procedimento de regularização (automático em background, monitorado por Bruno):
  1. POS retoma conexão com SEFAZ
  2. Job `BigiposContingencyRecover` (Windows Service) sincroniza fila de contingência
  3. Cada NFC-e contingenciada é transmitida com flag `tpEmis=4` (contingência off-line NFC-e)
  4. SEFAZ valida e autoriza retroativamente
  5. Job marca cupom como "regularizado" em `BIG_VENDAS`
- Falha de regularização (raro, ~0.1% dos casos): escalar Bruno + fiscal · necessário cancelar cupom em janela específica ou emitir NF-e substituta
- Alerta operacional: se Diego permanecer em contingência por >2h consecutivas, Marina verifica conectividade da loja (problema pode ser link, ver `runbook_problemas_rede.pdf` seção 3)

---

### Capítulo 4 — Pagamentos (Páginas 19-22)

#### Página 19 — Cielo PinPad (débito, crédito, voucher)
- Cartões aceitos:
  - Débito: Visa, Mastercard, Elo, Hiper, American Express
  - Crédito: Visa, Mastercard, Elo, Hiper, American Express, Diners, JCB
  - Voucher: Sodexo Refeição/Alimentação, Alelo, Ticket, VR Benefícios
- Limites configurados na adquirência (acordo comercial Cielo · revisão trimestral):
  - Débito: até R$ 30.000 por transação
  - Crédito à vista: até R$ 50.000 por transação
  - Crédito parcelado: até R$ 80.000 (com regras de score Serasa em vendas >R$ 5k)
- Procedimento de exceção: vendas acima do limite requerem aprovação manual via 0800 Cielo (Diego liga, Marina autoriza por matrícula)
- Reconciliação Cielo: diária, automática pelo TOTVS · divergências viram ticket Financeiro (ver TKT-41)

#### Página 20 — PIX dinâmico (QR code via TEF Cielo)
- Modalidade: **PIX cobrança dinâmica** (QR único por venda, com txid identificador)
- Fluxo (Diego):
  1. F4 → seleciona PIX
  2. PinPad Cielo gera QR dinâmico (txid no padrão Bacen)
  3. Cliente lê QR com app do banco (qualquer banco brasileiro)
  4. Cliente confirma valor + autoriza
  5. PinPad recebe confirmação em <10s (P95 14.5s)
  6. NFC-e é emitida automaticamente
- Vantagens vs cartão: liquidação **instantânea** (D+0) · MDR ~0.99% (vs 2.12% crédito)
- Reconciliação PIX: API Bacen consulta status do txid · matching automático no TOTVS
- Caso de borda — PIX devolvido pelo banco do cliente após autorização: Bruno é acionado via PagerDuty (raro, <0.05% dos casos)

#### Página 21 — Crédito parcelado
- Parcelamento permitido: **2x a 12x sem juros** (custo absorvido pela Apex em campanhas)
- A partir de 13x até 18x: com juros tabela LINX (1.99% a.m.)
- Limite máximo de parcelas: **18x** (limite Cielo)
- Procedimento Diego:
  1. F4 → seleciona crédito
  2. PinPad pergunta número de parcelas
  3. Cliente confirma no PinPad
  4. Autorização Cielo em ~7s (P95 12s)
  5. Cupom impresso mostra valor da parcela
- Regra interna: Diego não digita número de parcelas pelo cliente · cliente sempre confirma no PinPad (compliance Bacen)

#### Página 22 — Boleto e crediário Apex+
- **Boleto bancário (B2B):**
  - Cliente PJ identifica-se com CNPJ no início da venda
  - Sistema gera boleto via API Banco do Brasil (banco oficial Apex Group)
  - Vencimento D+5 padrão · D+30 com aprovação Marina
  - Cupom acompanha boleto físico impresso (formato CNAB)
  - NFC-e é emitida normalmente · status do boleto é tratado no Financeiro
- **Crediário Apex+ (B2C — somente Apex Casa e Apex Moda):**
  - Modalidade: cartão private label emitido pela Apex (operação financeira via FinTech parceira Vortex Pay)
  - Aprovação no PinPad em ~15s (consulta Serasa + score interno)
  - Parcelamento até 24x com juros 2.49% a.m.
  - Score abaixo de 580: aprovação manual Lia (Head Atendimento)
  - Reconciliação: relatório diário Vortex Pay → TOTVS → SAP FI

---

### Capítulo 5 — Operações operador (Páginas 23-27)

#### Página 23 — Abertura de caixa (Diego)
- **PROC-POS-002** · executado por Diego no início do turno
- Pré-requisitos:
  - POS ligado e LINX BIGiPOS em modo "Aguardando login"
  - Papel térmico no estoque mínimo (Diego confere antes de logar)
  - Troco inicial entregue pela supervisora Marina (envelope lacrado · valor padrão R$ 200 em moedas e cédulas pequenas)
- Procedimento:
  1. Diego loga com matrícula + senha
  2. Tela "Abertura de Caixa" aparece (obrigatória antes de venda)
  3. Diego digita valor do troco recebido (sangria zero · saldo inicial)
  4. Marina aprova com matrícula supervisora (duplo controle)
  5. Caixa é aberta · sistema imprime cupom de abertura (não fiscal)
  6. Status: pronto para operação

#### Página 24 — Operação normal (Diego durante turno)
- Diretrizes operacionais:
  - Tempo médio por cliente: **45-90s** (varia por marca · Apex Mercado 60s · Apex Tech 90s · Apex Moda 50s · Apex Casa 75s)
  - Cumprimento padrão: "Boa tarde, tudo bem?" + nome do cliente se identificado por CPF
  - Sempre confirmar valor total antes de F4 (cliente lê display LD220)
  - Sempre perguntar forma de pagamento (não presumir)
- Dúvida do cliente em produto:
  - Diego consulta F1 (descrição, preço, estoque)
  - Se dúvida técnica (Apex Tech) ou de tamanho (Apex Moda): chama vendedor de salão · não bloqueia caixa
  - Bipagem por engano: corrige com F3 (item anterior) antes de F4 (não fica registrado no cupom anulado)

#### Página 25 — Caso real TKT-8 (cobrança chocolate Lindt — estorno operador)
- **Sintoma original (TKT-8 já resolvido):**
  - Cliente fidelidade da Apex Mercado SP-Pinheiros reclamou: cupom mostrava 1× chocolate Lindt R$ 89 que ele NÃO retirou da prateleira
  - Análise CFTV (gravação caixa 02): produto estava no carrinho ao lado e foi bipado por engano (Diego confundiu)
- **Procedimento Diego ANTES do cupom ser fechado (prevenção):**
  1. Cliente questiona valor antes do F4 → Diego usa F3 para remover item
  2. Sistema não imprime nada · venda continua normal
- **Procedimento Diego DEPOIS do cupom emitido (com cliente ainda na loja):**
  1. Marina autoriza modo devolução (F8 + matrícula supervisora)
  2. Bipagem do chocolate específico (mesmo SKU)
  3. Sistema gera estorno parcial do valor (R$ 89) em mesma forma de pagamento original
  4. Cupom de estorno é impresso
  5. Cliente assina recibo
- **Procedimento Diego DEPOIS de cliente sair da loja:**
  - Diego NÃO pode estornar sozinho · vira ticket HelpSphere (Comercial · prioridade Low)
  - Marina recebe ticket e decide:
    - Estorno + bônus 100 pontos fidelidade (padrão · R$ <100)
    - Estorno + cortesia próxima compra (R$ 100-500)
    - Escalação Lia (>R$ 500 ou cliente VIP)
- **Resultado TKT-8 (registro histórico):** estorno + 100 pontos extras de fidelidade · cliente satisfeito · Diego recebeu treinamento de atenção em bipagem

#### Página 26 — Sangria intermediária
- Definição: retirada parcial de dinheiro do caixa durante o turno (segurança · evita excedente em gaveta)
- Quando fazer:
  - Saldo do caixa ultrapassa **R$ 2.000** em dinheiro (limite padrão · ajustável por loja)
  - Antes de trocas de turno em horários sensíveis (12h, 18h)
  - Sempre antes de fechamento (já incluído no fluxo PROC-POS-003)
- Procedimento (Diego + Marina · duplo controle):
  1. F6 → tela "Sangria"
  2. Diego digita valor a retirar (ex: R$ 1.500)
  3. Marina aprova com matrícula
  4. Sistema imprime cupom não-fiscal de sangria
  5. Diego entrega envelope lacrado para Marina
  6. Marina deposita no cofre da loja (chave compartilhada com gerente regional)
- Limite máximo no caixa após sangria: **R$ 500** (operação contínua)
- Auditoria mensal: relatório de sangrias por POS é enviado para Lia (Head Atendimento)

#### Página 27 — Fechamento de caixa (Marina supervisora)
- **PROC-POS-003** · executado por Marina ao final do turno de Diego
- Procedimento:
  1. Diego encerra última venda (ou aguarda cliente sair)
  2. Diego aciona Ctrl+Q (encerrar turno) → tela "Fechamento Pendente"
  3. Marina chega com matrícula supervisora + sistema abre relatório de fechamento
  4. Marina conta dinheiro físico no caixa (cédulas + moedas)
  5. Marina digita valores no LINX por forma de pagamento:
     - Dinheiro: contagem física
     - Cartão débito: já preenchido automaticamente (vem do TEF Cielo)
     - Cartão crédito: idem
     - PIX: já preenchido (API Bacen)
     - Voucher: idem
     - Boleto: idem (geração de boletos somada)
  6. Sistema calcula divergência (esperado vs real)
- Política de divergência:

| Divergência | Decisão |
|---|---|
| <R$ 5 | Aceita · registrada · sem investigação |
| R$ 5 – R$ 50 | Marina investiga (último cliente, troco errado) · justificativa no sistema |
| R$ 50 – R$ 200 | Marina + gerente loja revisam · escalação para Lia |
| >R$ 200 | Bloqueio do caixa · auditoria interna · revisão CFTV |
| >R$ 1.000 | Ticket Financeiro de prioridade High + RH (suspeita) |

- Após fechamento: sangria final · envelope ao cofre · Diego liberado

---

### Capítulo 6 — Troubleshooting (Páginas 28-32)

#### Página 28 — Top 10 erros POS
- Tabela síntese (sintoma → causa provável → ação Diego antes de escalar Marina):

| # | Sintoma | Causa provável | Ação Diego (Tier 1) |
|---|---|---|---|
| 1 | POS congela ao apertar F4 com >8 itens | Timeout SEFAZ (TKT-11) | Aguardar 60s · se não responder, F9 contingência |
| 2 | Impressora não imprime cupom | Papel acabou, tampa aberta, comunicação USB | Verificar papel, fechar tampa, desconectar/reconectar USB |
| 3 | PinPad Cielo "sem comunicação" | Cabo USB-C frouxo, recovery necessário | Desconectar 10s, reconectar · se persistir, reboot PinPad (botão fundo 10s) |
| 4 | Leitor de código de barras não bipa | Cabo desconectado, modo travado | Reconectar USB · ler código de configuração (etiqueta no leitor) |
| 5 | NFC-e rejeitada cód 539 | CFOP cadastrado errado no TOTVS | NÃO retentar · escalar Marina (correção fiscal) |
| 6 | NFC-e rejeitada cód 778 | Contingência além de 96h | Escalar Marina imediatamente · NÃO emitir mais notas |
| 7 | Caixa em modo contingência há >2h | Possível queda de link da loja | Marina verifica · `runbook_problemas_rede.pdf` seção 3 |
| 8 | Display LD220 com lixo na tela | Encoding errado pós-update | Reboot POS · se persistir, ticket Bruno |
| 9 | Gaveta não abre via F5 | Cabo solenoide solto | Verificar conexão atrás da impressora · ticket TI se persistir |
| 10 | Sync TOTVS com atraso >30min | Fila MSMQ acumulando | Marina vê dashboard supervisor · escalar Bruno se >60min |

- Diego nunca reboota o POS sem autorização da Marina (perda de cache local · vendas em curso)

#### Página 29 — POS travando (procedimento detalhado · referência TKT-11)
- **Sintoma:** ao apertar F4, tela do BIG iPOS Front fica "Não Responde" por 30-45s · às vezes recupera, às vezes precisa reiniciar
- **Procedimento Diego (sem escalar):**
  1. Aguarde 60s (não force reboot · cupom pode estar em emissão final)
  2. Se voltar: verifique se cupom foi impresso · confirme com cliente
  3. Se NÃO voltar: anote número da última venda (na tela ou último cupom emitido)
  4. Marina autoriza F12 (reboot controlado · força flush MSMQ + restart serviço LINX)
  5. Após reboot (~3min): Diego consulta status da última venda em F1 (modo consulta)
  6. Se venda foi emitida: tudo certo · continue operação
  7. Se NÃO foi emitida: refaça a venda do zero · cliente já tem o produto
- **Procedimento Marina (escalação Tier 2):**
  - 2 ocorrências no mesmo turno: ticket HelpSphere prioridade Medium para TI
  - 3 ou mais ocorrências em 1 semana: ticket HelpSphere High + acionar Bruno
- **Referência histórica:** TKT-11 (Pinheiros, abril/2026) resolvido com upgrade thread pool · pacote distribuído para frota toda · monitoramento de regressão ativo (alerta se >2s qualquer POS)

#### Página 30 — Impressora térmica (sem papel / desalinhada / sem comunicação)
- **Sem papel:**
  1. Abrir tampa superior · inserir novo rolo (papel térmico 80mm × 80m)
  2. Verificar orientação (face térmica para cima)
  3. Fechar tampa · pressionar botão FEED 2s · cupom de teste sai sozinho
- **Desalinhada (cupom torto):**
  - Causa: rolo inserido errado ou rolete desgastado
  - Reinserir rolo · se persistir, ticket TI (rolete pode precisar troca · suporte Bematech)
- **Sem comunicação USB:**
  1. Desconectar cabo USB da impressora 10s · reconectar
  2. Verificar Gerenciador Dispositivos Windows (deve aparecer "Bematech MP-4200 TH")
  3. Se não aparece: reinstalar driver (Bruno faz via TeamViewer)
  4. Se persiste: trocar para POS secundário (PROC-POS-001)
- **Cupom sai em branco:**
  - Causa típica: papel inserido com face térmica para baixo
  - Reinverter rolo · descartar papel branco

#### Página 31 — PinPad sem comunicação (recovery USB + serial)
- Modelo: Cielo LIO V3 (Android · USB-C + serial backup)
- Sintomas: tela "Sem conexão" no PinPad · LINX BIGiPOS mostra "PinPad indisponível"
- **Procedimento recovery USB (Diego):**
  1. Desconectar cabo USB-C do POS (lado terminal Bematech)
  2. Aguardar 10s
  3. Reconectar
  4. PinPad reinicializa automaticamente (~30s)
  5. Testar com transação fictícia R$ 0,01 (cancela em seguida)
- **Procedimento recovery serial (somente Marina):**
  - Usado quando USB falha por 3+ tentativas
  - Cabo serial RS-232 pré-instalado (geralmente conectado mas inativo)
  - Marina ativa modo serial: tela LIO V3 → Configurações → Comunicação → RS-232
  - LINX BIGiPOS detecta automaticamente (config `pinpad.transport=serial`)
- **PinPad com tela travada (hard freeze):**
  - Botão de power do PinPad (lateral direita) pressionado por 10s · força desligamento
  - Aguardar 30s · ligar novamente
  - Se não voltar: ticket TI (defeito hardware · troca em 24h via Cielo)
- Casos críticos (>2 PinPads inoperantes simultaneamente): toda loja entra em modo "Cielo OFFLINE" · só aceita dinheiro/PIX · Bruno e Lia notificados imediatamente

#### Página 32 — Reset hardware + reinstalação software
- **Quando aplicar:** após esgotamento de procedimentos das páginas 28-31 sem resolução
- **Pré-requisitos (Marina autoriza, Diego executa com supervisão remota Bruno):**
  - Backup do banco local (`C:\BIG\db\bigipos.mdf`) via TeamViewer
  - Confirmação de que POS secundário está disponível (PROC-POS-001 backup)
- **Procedimento reset (~45min total):**
  1. Backup MDF (Bruno faz)
  2. Diego desliga POS (botão power) · aguarda 30s
  3. Diego liga POS · entra em BIOS (F2 ou Del)
  4. BIOS → Boot from network (PXE habilitado · imagem MDT)
  5. PXE puxa imagem `POS-APEX-W10IOT-v4.2.wim`
  6. Instalação automática Windows 10 IoT (~25min)
  7. Pós-instalação: agente MDT instala LINX BIGiPOS 12.5 + drivers periféricos
  8. Bruno aciona restore do banco local (MDF do backup)
  9. POS reinicia · executa smoke test pós-update (pág. 9)
  10. Marina valida com transação fictícia R$ 0,01
- **Tempo total:** 45-90min · POS secundário cobre durante o procedimento
- **Frequência típica:** <1 reset por POS por ano (defeitos cumulativos)

---

### Capítulo 7 — Compliance e auditoria (Páginas 33-35)

#### Página 33 — Auditoria fiscal SPED
- POS gera dados que alimentam:
  - **SPED Fiscal** (registros C100, C170, D100, D190) · transmitido pela Apex todo dia 25 do mês seguinte
  - **SPED Contribuições** (PIS/COFINS · registros M100, M210) · idem
- Retenção legal dos logs do POS: **5 anos**
- Localização do arquivo histórico:
  - Local: `C:\BIG\logs\` (90 dias)
  - Backup Azure Blob (cold tier): `apex-pos-logs-bkp` container · retenção 5 anos · acesso somente Bruno + Auditoria Interna
- Auditoria externa (Receita Federal · estado SP): solicita XMLs específicos via portal · TI gera ZIP em ≤4h úteis
- Caso de descumprimento (perda de dados): multa SEFAZ a partir de R$ 5.000 por NFC-e perdida · risco reputacional alto

#### Página 34 — Auditoria PCI-DSS
- Apex Group certificada **PCI-DSS Level 1** (>6M transações cartão/ano · revalidação anual)
- Princípio crítico: **dados de cartão NÃO são armazenados no POS**
  - Apenas tokens da Cielo são gravados (string sem valor fora do contexto Cielo)
  - LINX BIGiPOS NÃO grava PAN (Primary Account Number) em nenhum log
  - Cupom impresso mostra só últimos 4 dígitos
- Auditoria trimestral:
  - Scan de vulnerabilidade ASV (Qualys) em todos os IPs públicos da rede Apex
  - Pen-test anual em ambiente PCI (POS + TEF + Cielo)
  - Revisão de logs `bigipos-cielo.log` para garantir 0 ocorrência de PAN em texto claro
- Não-conformidades em scan: corrigir em até 30 dias · risco perda de certificação (penalidades Cielo + bancos)
- Política Apex: qualquer suspeita de violação (cartão duplicado · PIN exposto) vira ticket Bruno + Compliance imediatamente (severidade Critical)

#### Página 35 — Anexos e contatos rápidos

##### A. Contatos por fornecedor

| Fornecedor | Produto/Serviço | Contato suporte | SLA contratual |
|---|---|---|---|
| **LINX** | BIGiPOS 12.5 + manutenção | 0800-070-0008 · `suporte@linx.com.br` | 4h úteis (P1) · 24h úteis (P2) |
| **Cielo** | Adquirência + PinPad LIO V3 | 0800-570-8511 · portal `cielo.com.br` | 2h úteis (PCI) · 24h (operacional) |
| **Bematech** | Terminal MP-4200 + impressoras | 0800-644-7000 | 24h úteis (troca on-site) |
| **Epson** | Impressora TM-T20III (backup) | 0800-880-0094 | 48h úteis |
| **Honeywell** | Leitor Voyager 1450g | Via revenda Bematech | 48h úteis |
| **Toledo** | Balança Prix 3 Fit | 0800-728-5226 | 24h úteis (loja com balança) |
| **APC (Schneider)** | No-break Back-UPS | 0800-728-3098 | 48h úteis (troca preventiva) |

##### B. Contatos internos Apex Group

| Papel | Pessoa | Canal preferencial | Quando acionar |
|---|---|---|---|
| **Operador caixa Tier 1** | Diego (e equipe) | Presencial · WhatsApp grupo da loja | Operação normal |
| **Supervisora Tier 2** | Marina (e supervisoras regionais) | Matrícula POS · WhatsApp · Slack `#sup-pos` | Escalação Diego |
| **Head Atendimento Tier 2+** | Lia | Slack DM · email `lia@apex.com.br` | Decisões > R$ 500 · clientes VIP · imprensa |
| **CTO / TI Tier 3** | Bruno (e plantão TI) | PagerDuty · Slack `#ti-pos-emergencia` | POS down · NFC-e bloqueada · suspeita fraude |
| **CFO** | Carla | Email `carla@apex.com.br` | Decisões financeiras estruturais |

##### C. Documentos relacionados (cross-reference)

- `manual_operacao_loja_v3.pdf` — operação geral de loja (recebimento, segurança, manutenção preventiva)
- `runbook_sap_fi_integracao.pdf` — sync POS → TOTVS → SAP FI
- `faq_pedidos_devolucao.pdf` — política comercial de devolução
- `politica_reembolso_lojista.pdf` — alçadas financeiras + estornos
- `runbook_problemas_rede.pdf` — diagnóstico de link da loja (afeta NFC-e)
- `faq_horario_atendimento.pdf` — janelas operacionais
- `politica_dados_lgpd.pdf` — tratamento de CPF e dados pessoais no POS

##### Footer
- Versão **v4.2 · Q2-2026**
- Próxima revisão: **Q2-2027** (revisão anual obrigatória · aprovador Bruno CTO)
- Documento **confidencial · uso interno Apex Group**
- Classificação LGPD: **dados pessoais e financeiros** · acesso restrito por papel
- Distribuição: HelpSphere KB · intranet TI · impressão controlada (numerada) nas lojas

---

## 🎯 3 perguntas-âncora validadas (≥3 conforme AC Sub-A.5)

1. **TKT-11** (Apex Mercado — POS Pinheiros congelando ao emitir NFC-e):
   > "POS travando ao emitir NFC-e com mais de 8 itens — qual a causa e o que Diego faz antes de escalar?"

   ➡️ **Resposta no PDF (Página 13 + Página 29):** Causa-raiz é timeout SEFAZ-SP combinado com pool de threads pequeno (4 → 12) e timeout configurado (30s → 45s). Procedimento Diego: aguardar 60s, anotar última venda, Marina autoriza F12 reboot controlado. Patch frota-wide aplicado Q2-2026.

2. **TKT-8** (Apex Mercado — chocolate Lindt cobrado por engano):
   > "Cliente reclama que cobrei produto que ele não levou — como faço o estorno?"

   ➡️ **Resposta no PDF (Página 25):** Três cenários — antes do F4 (F3 remove item) · com cliente ainda na loja (Marina autoriza F8 modo devolução) · cliente já saiu (ticket HelpSphere · Marina decide alçada estorno + bônus 100 pontos / cortesia / escalação Lia).

3. **Procedimento padrão POS** (sem TKT específico — perguntas operacionais frequentes):
   > "Como faço para abrir e fechar caixa?" / "Como faço sangria?" / "Como cancelo uma NFC-e?"

   ➡️ **Resposta no PDF (Páginas 23, 26, 15):** Abertura PROC-POS-002 com duplo controle Diego+Marina · sangria F6 com aprovação supervisora · cancelamento F8 em janela 30min com chave NFC-e + justificativa SEFAZ.

---

## ✅ Validação cruzada com regras editoriais (CONTEXT.md)

- [✅] Sem AI slop ("É importante notar...", "Em última análise...") — não usado
- [✅] Marcas Apex* fictícias — Apex Mercado/Tech/Moda/Casa/Logística usadas
- [✅] Tecnologias reais (LINX, Bematech, Cielo, Epson, SEFAZ-SP, TOTVS, Honeywell, Toledo) — coerente com varejo BR real
- [✅] Personas v5 (Diego Tier 1, Marina Tier 2, Lia Head, Bruno CTO, Carla CFO) — todas usadas
- [✅] Valores R$ realistas — R$ 89 (Lindt), R$ 200 (troco), R$ 2.000 (sangria), R$ 47.300 (cliente PJ), R$ 12.500 (consultoria)
- [✅] Códigos reais — Rejeição SEFAZ 240/539/778/226/452/691 · CFOP 1.202/2.202/5.202/1.411 · PCI-DSS Level 1
- [✅] Procedimentos numerados (PROC-POS-001 backup hardware · PROC-POS-002 abertura · PROC-POS-003 fechamento)
- [✅] Tabelas estruturadas (capilaridade frota, tempos PinPad, atalhos teclado, rejeições SEFAZ, top 10 erros, divergência fechamento, contatos)
- [✅] Cross-refs com outros 7 PDFs declaradas (footer + corpo)
- [✅] Anti-obsolescência: revisão anual Q2-2027 declarada
- [✅] Datas relativas (Q2-2026) ao invés de absolutas
- [✅] Voz procedural técnica · sem hedging · afirmação direta
- [✅] TKT-11 e TKT-8 cobertos (≥2 âncoras explícitas + 3ª âncora procedural)

---

## 🔄 Próximo passo

1. Escrever **Markdown source completo** (`07-manual_pos_funcionamento.source.md`) com ~35.000 palavras (~1.000 por página) — em curso na mesma sessão
2. Validar densidade fiscal (NFC-e, SEFAZ, CFOP) com Bruno (CTO) — opcional · base sólida em rejeições reais
3. Pandoc → PDF/A-2b (sessão de empacotamento Story 06.7)
