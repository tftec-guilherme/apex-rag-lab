---
title: "Política de Reembolso a Lojistas — B2B Intra-Grupo + Fornecedores PJ"
subtitle: "Documento normativo · uso interno HelpSphere + Financeiro"
author: "Apex Group · Diretoria Financeira"
date: "Q2-2026"
keywords: [reembolso, B2B, alçadas, SPED, NF-e, CFOP, retenção, IRRF, INSS, MEI, PIS, COFINS, ISS]
version: "v4.2"
documento: "POL-FIN-007"
revisao_proxima: "Q4-2026"
---

# Política de Reembolso a Lojistas — B2B Intra-Grupo + Fornecedores PJ

**Documento normativo `POL-FIN-007` · versão v4.2 · vigência Q2-2026**

**Aprovação:** Carla (CFO Apex Group) · revisão semestral · próxima revisão programada Q4-2026

---

## Página 1 — Escopo e alçadas decisórias

### 1.1 Escopo de aplicação

Esta política normatiza o tratamento de solicitações de reembolso originadas em três frentes operacionais do Apex Group:

**Reembolsos B2B intra-grupo.** Operações em que uma marca da holding paga ou cobra de outra. Caso âncora recorrente: Apex Mercado contestou em fevereiro a fatura emitida pela Apex Logística por duplicidade de cobrança de frete na rota CD-Cajamar → Loja-Pinheiros, com mesmo veículo e mesma data registrados em duas linhas de fatura. Esse cenário, e variantes, é o tipo mais comum dentro do fluxo intra-grupo e responde por aproximadamente 55% do volume operacional consolidado.

**Reembolsos a fornecedores PJ externos.** Cobranças indevidas, duplicidades, devoluções fiscais de mercadoria, glosas em compras de insumo. Inclui parceiros bancários (Cielo, Banco do Brasil), distribuidores (Multilaser, Tok&Stok, Brastemp), prestadores de serviço PJ (consultorias, transportadoras terceirizadas) e prestadores MEI.

**Reembolsos fiscais.** DARFs retificadoras de IRRF, créditos de PIS/COFINS apurados a maior em SPED Contribuições, ICMS-ST restituível, ISS retido indevidamente, multas administrativas (ANTT, vigilância sanitária estadual).

**Fora do escopo deste documento:**

- Reembolso ao consumidor final (B2C) — tratado em `faq_pedidos_devolucao.pdf`
- Reembolso de despesas com folha de pagamento — tratado nas políticas RH-002 e RH-003
- Reembolso de despesas de viagem corporativa — tratado na política RH-005 (incluindo limites de hotel, refeição, deslocamento urbano)
- Reembolso de benefícios saúde — tratado em RH-008 (plano corporativo Unimed + Bradesco Saúde)

### 1.2 Alçadas decisórias

A matriz de alçadas é o instrumento operacional mais importante deste documento. Define quem aprova reembolso de cada faixa, o aprovador secundário (registrando ciência) e o prazo máximo de decisão.

| Faixa de valor | Aprovador primário | Aprovador secundário | SLA decisão |
|---|---|---|---|
| R$ 0 – R$ 5.000 | Diego (Tier 1) | — | 1 dia útil |
| R$ 5.001 – R$ 50.000 | Marina (Tier 2) | Diego (registro) | 2 dias úteis |
| R$ 50.001 – R$ 250.000 | Lia (Head Atendimento) | Marina | 3 dias úteis |
| R$ 250.001 – R$ 1.000.000 | Carla (CFO) | Lia | 5 dias úteis |
| Acima de R$ 1.000.000 | Comitê Diretoria | Carla + Bruno (CTO) | 10 dias úteis |

A leitura correta dessa tabela: Diego, atendente Tier 1 do HelpSphere, decide casos de até R$ 5.000 com autonomia total. Marina, supervisora Tier 2, recebe escalações da faixa R$ 5.001 a R$ 50.000 e tem Diego como aprovador secundário, registrando ciência e mantendo a trilha de auditoria. A faixa de R$ 50.001 a R$ 250.000 é responsabilidade de Lia, Head de Atendimento, que aprova com Marina registrando ciência. Acima de R$ 250.000 a aprovação sobe para Carla, CFO. Reembolsos acima de R$ 1 milhão exigem reunião extraordinária do Comitê de Diretoria, convocada por Carla com participação obrigatória de Bruno (CTO) para análise de risco sistêmico ou impacto contábil em múltiplos exercícios.

### 1.3 Princípios não-negociáveis

Três princípios sustentam toda a operação descrita neste documento. Ferir qualquer um deles invalida o reembolso e gera apuração de conformidade.

**Rastreabilidade total.** Todo reembolso, independentemente do valor, gera um ticket no HelpSphere classificado como `category=Financeiro` e recebe um ID interno no formato `REEMB-AAAAMM-NNNN`, atribuído automaticamente pelo sistema no momento da abertura. Não existe reembolso "informal", "off-system" ou "ajuste de caixa rápido". Todas as comunicações, decisões, anexos e comprovantes ficam vinculados ao mesmo ticket por 5 anos (retenção legal fiscal + LGPD).

**Dupla validação contábil.** Antes da aprovação financeira, três áreas validam em sequência: Tesouraria confirma saldo disponível e identifica o lançamento original; Contábil valida o CFOP da operação de devolução e a consistência do CST com a operação original; Fiscal valida a aplicação correta de retenções de IRRF, INSS, PIS, COFINS e CSLL, conforme regime tributário do fornecedor. Cada validação fica registrada no ticket com o nome do responsável e timestamp.

**Inviolabilidade da alçada.** Diego nunca aprova reembolso acima de R$ 5.000, sem exceção. Pressão do solicitante, urgência declarada ou solicitação informal por canal paralelo (WhatsApp, telefone direto a executivo) não justifica violação da alçada. Em caso de pressão, Diego escala imediatamente para Marina e registra a tentativa no campo de observações do ticket. Episódios reincidentes do mesmo solicitante são reportados a Lia para revisão de relacionamento comercial.

---

## Página 2 — Fluxo de reembolso B2B e SLAs por tier

### 2.1 Fluxo padronizado de 5 passos

O fluxo abaixo aplica-se a aproximadamente 90% das solicitações. Casos especiais (perícia criminal, contestação judicial, decisão arbitral) seguem fluxos específicos descritos nas Páginas 4 e 5.

```
[1] Abertura → [2] Triagem → [3] Validação → [4] Aprovação → [5] Liquidação
```

**Passo 1 — Abertura (D+0).** O solicitante (lojista intra-grupo, fornecedor PJ externo, área fiscal interna) abre o ticket por uma de duas vias: portal HelpSphere com login corporativo ou e-mail oficial `reembolso@apex.com.br`, que cria ticket automaticamente. Diego recebe o ticket na fila de Tier 1, cria o registro com `category=Financeiro` e exige a documentação mínima: NF-e original em XML + DANFE em PDF, comprovante do pagamento original (PIX com ID end-to-end, TED com número de referência, ou boleto com linha digitável), e descrição textual do problema com no mínimo 200 caracteres. O sistema gera automaticamente o ID interno `REEMB-AAAAMM-NNNN` no momento da gravação.

**Passo 2 — Triagem (D+0 a D+1).** Diego classifica o caso conforme os 4 tipos canônicos descritos na seção 2.3 e aplica a alçada da tabela 1.2. Casos até R$ 5.000 ficam com Diego para tratamento direto; acima disso, escalação automática para Marina, que recebe notificação por e-mail interno e WhatsApp Business corporativo. Na triagem, Diego também verifica se há caso similar registrado nos últimos 90 dias — se houver, anexa cross-reference para facilitar a análise comparativa.

**Passo 3 — Validação documental + contábil (D+1 a D+3).** A área Financeiro entra no ticket e executa a tripla validação. Tesouraria confere a NF original contra o sistema de faturamento e o extrato bancário do período. Contábil confere o CFOP da operação original e valida o CFOP proposto para devolução: 5202 para devolução de venda interestadual, 5410 para devolução de venda no mesmo estado, 5910 para devolução com substituição tributária, 1202 para devolução de compra interestadual, 1410 para devolução de compra no mesmo estado, 1910 para devolução de compra com substituição. Fiscal valida se a operação exige emissão de NF-e de devolução (sempre que a NF original já foi transmitida e autorizada há mais de 24 horas), retenções aplicáveis e impacto em SPED Fiscal/Contribuições do período.

**Passo 4 — Aprovação (D+3 a D+5).** O aprovador correspondente à alçada aplica a decisão e registra no campo `resolution` do ticket. As três decisões possíveis são **APROVADO**, **APROVADO COM RESSALVA** e **REJEITADO**. Ressalvas comuns: necessidade de emissão de NF-e de devolução antes da liquidação, retenção tributária prévia (ex: IRRF de 1,5% para serviço PJ), ou glosa parcial (aprovar 70% do valor solicitado por divergência documental). A decisão é assinada digitalmente no documento `REEMB-AAAAMM-NNNN.pdf` gerado pelo sistema, usando o certificado A3 do aprovador.

**Passo 5 — Liquidação (D+5 a D+10).** Tesouraria executa o pagamento via PIX para valores até R$ 100.000 ou TED bancário para valores acima desse limite. O comprovante é anexado ao ticket; o status é alterado para `Resolved`; e o lançamento contábil de estorno é gerado automaticamente no ERP TOTVS Protheus com o CFOP de entrada de devolução correspondente.

### 2.2 SLAs consolidados por tier de valor

Os prazos contam dias úteis e somam os 5 passos do fluxo. São SLAs externos (compromisso com solicitante); internamente, cada passo tem prazo intermediário monitorado pelo BI Financeiro.

| Faixa | Triagem | Validação | Aprovação | Liquidação | Total D+ |
|---|---|---|---|---|---|
| R$ 0 – R$ 5.000 | D+0 | D+1 | D+1 | D+3 | **3 dias úteis** |
| R$ 5.001 – R$ 50.000 | D+0 | D+2 | D+3 | D+5 | **5 dias úteis** |
| R$ 50.001 – R$ 250.000 | D+0 | D+3 | D+5 | D+8 | **8 dias úteis** |
| R$ 250.001 – R$ 1.000.000 | D+1 | D+5 | D+8 | D+12 | **12 dias úteis** |
| Acima R$ 1M | D+2 | D+7 | D+15 | D+25 | **25 dias úteis** |

Atrasos no SLA são monitorados no painel `BI-FIN-Reembolsos` com refresh diário às 06h00. Ticket que ultrapassa o prazo total recebe flag amarela; ultrapassa em mais de 50%, flag vermelha com escalação automática para o nível seguinte (Diego → Marina; Marina → Lia; Lia → Carla).

### 2.3 Os 4 tipos canônicos de reembolso

Toda solicitação cai em um dos quatro tipos abaixo. A triagem correta no Passo 2 determina o fluxo aplicável e a documentação exigida.

**Tipo A — Cobrança duplicada.** Mesmo valor cobrado duas vezes, pelo mesmo prestador, pela mesma operação. Casos típicos: TKT-5 (frete intra-grupo Apex Logística), TKT-42 (Multilaser cobra 2x NF de cabos HDMI), TKT-50 (ANTT cobra 2x mesma multa de excesso de peso). Documentação mínima: 2 boletos/2 cobranças + comprovante do pagamento da 1ª.

**Tipo B — Divergência de valor.** Valor cobrado difere do contratado. Casos típicos: TKT-41 (Cielo aplicou MDR 2,12% em transação que contrato estabelece 1,89%). Documentação mínima: contrato vigente + extrato detalhado + cálculo da divergência.

**Tipo C — DARF/SPED retificador.** Erro na apuração de tributo gera necessidade de retransmissão. Casos típicos: TKT-43 (DARF IRRF gerada com base errada de R$ 38.470), TKT-48 (SPED Contribuições rejeitado em registro M210 por R$ 12.300). Documentação mínima: arquivo original transmitido + log do PVA + planilha de retificação.

**Tipo D — Ressarcimento por glosa fiscal.** Pagamento já efetuado mas há direito a restituição por retenção indevida, isenção não aplicada, ou erro de enquadramento tributário. Casos típicos: TKT-44 (boleto sem retorno do BB), TKT-46 (consultoria MEI com retenções incorretas a aplicar). Documentação mínima: comprovante de retenção emitido + comprovante de regime tributário do fornecedor.

---

## Página 3 — Casos comuns: duplicidade de frete e divergência de fatura

### 3.1 Caso âncora — TKT-5: cobrança duplicada de frete B2B intra-grupo

**Contexto.** Em 14/02 a Apex Logística faturou serviço de transporte CD-Cajamar → Loja-Pinheiros para a Apex Mercado, valor R$ 1.247. A fatura consolidada de fevereiro chegou em 28/02 com duas linhas idênticas no mesmo dia, mesma rota, mesmo veículo placa PLK-2D47, totalizando R$ 2.494 cobrados. A área de Contas a Pagar da Apex Mercado abriu ticket no HelpSphere com `category=Financeiro` em 03/03.

**Triagem.** Diego classificou como Tipo A (duplicidade). Valor R$ 1.247 está na faixa de alçada própria (até R$ 5.000), portanto sem escalação para Marina. Anexou ao ticket o relatório `BI-LOG-Romaneio-Fev2026` que mostra o veículo PLK-2D47 com apenas uma rota CD-Cajamar → Loja-Pinheiros registrada no dia 14/02.

**Validação.** Tesouraria confirmou que a Apex Mercado ainda não havia liquidado a fatura (pagamento programado para 10/03). Contábil identificou no log do sistema de faturamento da Apex Logística que houve rerun parcial do batch noturno de 14/02 às 03h12, após queda do banco às 02h47, e que o batch reprocessou o registro do veículo PLK-2D47 gerando linha duplicada. O sistema de faturamento não tinha constraint de unicidade na tabela `tbl_itens_fatura_log`.

**Aprovação.** Diego aprovou o estorno de R$ 1.247 e marcou o ticket como `Resolved` em 04/03 (D+1 da abertura), dentro do SLA de 3 dias úteis da alçada. Decisão: emitir fatura retificadora com o valor correto de R$ 1.247 e validação cruzada do romaneio antes da próxima liquidação.

**Ação corretiva sistêmica.** O CTO Bruno foi acionado para incluir constraint de unicidade no batch de faturamento da Apex Logística. A regra implementada cobre `unique(cd_origem, cd_destino, data, placa, valor)` na tabela de itens, com fallback de log estruturado em caso de violação. A correção foi feita em 11/03 e está em monitoramento desde então — em Q1-2026 nenhum caso semelhante foi reaberto.

### 3.2 Caso anexo — TKT-42: Multilaser cobra 2x a mesma NF

**Diferenças vs TKT-5.** Cobrança externa (fornecedor terceiro, não intra-grupo). Valor R$ 18.420 está na faixa Marina (R$ 5.001-R$ 50.000). Envolve scorecard de fornecedor mantido pelo Vendor Manager.

**Procedimento.**

1. Marina recebeu o ticket em 02/05 com cópia do comprovante PIX original (12/04, ID end-to-end `E18236120202504121400ABC123XYZ`)
2. Tesouraria confirmou que a fatura #45821 foi liquidada em 12/04 às 14h05, batch consolidado mensal de fornecedores de eletrônicos
3. Carta formal foi enviada à Multilaser via e-mail oficial + AR (Aviso de Recebimento) anexando o comprovante PIX, com prazo de 5 dias úteis para Multilaser confirmar a remoção da cobrança duplicada
4. Vendor Manager registrou ocorrência no scorecard da Multilaser com pontuação `-5 pontos`. O scorecard agrega ocorrências dos últimos 12 meses; acúmulo de mais de 3 ocorrências de cobrança indevida no período aciona revisão contratual obrigatória pelo time de Suprimentos

**Resultado.** Multilaser confirmou em 06/05 (D+4) a remoção da cobrança duplicada e emitiu carta de retratação formal. Sem estorno necessário, pois a Apex Tech não havia pagado a 2ª cobrança. Ticket `Resolved` em 06/05.

### 3.3 Caso anexo — TKT-41: divergência Cielo (MDR efetivo vs contratual)

**Contexto.** A conciliação automática Cielo do mês de abril identificou diferença de R$ 2.847,30 entre o relatório da adquirente e o ERP da Apex Mercado. As 14 transações divergentes eram todas de cartão de crédito parcelado. A análise inicial apontou MDR efetivo de 2,12% nas transações, enquanto o contrato Apex × Cielo, cláusula 4.3, estabelece 1,89% para parcelado de 2x a 6x.

**Por que Marina e não Diego.** Embora o valor R$ 2.847 esteja na alçada Diego, divergências contratuais com adquirentes acima de R$ 1.500 escalam automaticamente para Marina (regra do parágrafo 1.2.4, "Exceções de escalação"). O motivo é que a análise envolve interpretação contratual, e Marina tem acesso direto à versão atualizada dos contratos no repositório `DOC-CONTRATOS-FIN`.

**Procedimento.**

1. Marina solicitou à Cielo, via portal corporativo, o extrato detalhado de MDR aplicado nas 14 transações divergentes (relatório `BX-MDR-DET-04-2026`)
2. Análise mostrou que **9 das 14 transações** eram parceladas de 2x a 6x — divergência confirmada (MDR aplicado 2,12% vs contratual 1,89%, diferença R$ 1.843,20 a maior)
3. As **5 transações restantes** eram parceladas de 7x a 12x, faixa em que o MDR contratual é justamente 2,12% — sem divergência, R$ 1.004,10 cobrados corretamente
4. Cielo emitiu, em 08/05, carta de crédito no valor de R$ 1.843,20, compensável nas próximas 3 faturas mensais (junho, julho, agosto 2026)
5. Apex Mercado abriu ticket interno com Suprimentos para revisão da parametrização do gateway de pagamento, garantindo que cada transação aplique a alíquota MDR correta com base no número de parcelas no momento da autorização

**Nota operacional.** Casos como o TKT-41 são recorrentes e geralmente envolvem erros de parametrização no gateway da adquirente após upgrades de versão. A política Apex prevê auditoria trimestral cruzada entre conciliação Cielo, contrato vigente e parametrização do gateway. A próxima auditoria está agendada para 15/07/2026.

### 3.4 Padrão de documentação mínima exigida

Toda solicitação dos Tipos A ou B deve trazer no momento da abertura:

1. NF-e original em XML + DANFE em PDF (chave de acesso de 44 dígitos)
2. Comprovante de pagamento original — PIX com ID end-to-end de 32 caracteres, ou TED com número de referência bancária + agência/conta de débito, ou boleto com linha digitável + comprovante de quitação
3. Extrato bancário do período em PDF assinado digitalmente (formato OFX também aceito quando origem permite)
4. Descrição em texto livre — mínimo 200 caracteres explicando o que está sendo contestado, com referências cruzadas a NF/fatura/lote
5. CFOP da operação original + CFOP proposto para devolução

Solicitações sem esse mínimo são **devolvidas pelo Diego em D+0** com mensagem padronizada do template `TPL-FIN-DEVOLVER-DOC`, listando os itens faltantes. Não há aprovação de reembolso com documentação incompleta, nem mesmo aprovação condicionada à entrega posterior. O ticket fica em status `Open — pending documentation` por até 30 dias; após esse prazo, é arquivado como `Cancelled — docs not provided` e exige reabertura.

---

## Página 4 — Reembolsos fiscais: SPED, NF-e cancelada, créditos PIS/COFINS

### 4.1 SPED Fiscal — geração com inconsistência

Geração mensal de SPED Fiscal é uma das maiores fontes de incidentes operacionais no Apex Group. O PVA-SPED (Programa Validador e Assinador da Receita) frequentemente rejeita arquivos com registros inconsistentes — D100 (transporte), D500 (comunicação), C100 (NF-e de saída) são os mais críticos.

As três categorias mais comuns de inconsistência observadas em Q1-2026:

**CFOP inválido para natureza da operação.** Exemplo recorrente: o ERP marcou CFOP 5102 (venda de mercadoria adquirida ou recebida de terceiros) em operação de devolução, quando o correto seria 5202 para devolução interestadual de venda ou 5910 quando há substituição tributária envolvida. Esse erro foi a causa-raiz do incidente TKT-14 (referência operacional Apex Casa, setembro/2026), em que o sistema retornou "Erro: registro D100 com inconsistência de CFOP".

**CST × CFOP incompatíveis.** Exemplo: CST 020 (tributada com substituição tributária retida anteriormente) usado com CFOP 5910 (devolução com ST), gerando dupla aplicação de ST no validador. A regra correta exige CST 060 (substituição tributária retida) em CFOP de devolução com ST.

**NF-e referenciada inválida.** Quando uma NF-e foi cancelada após autorização SEFAZ e o ERP ainda mantém referência ativa em outra NF (campo `refNFe`), o PVA-SPED rejeita o lote inteiro.

**Procedimento padronizado de correção:**

1. A área Fiscal abre ticket no HelpSphere com `category=Financeiro`, anexando a cópia do arquivo SPED (.txt), o log completo do PVA com a lista de registros rejeitados, e a planilha de comparação `SPED-VS-ERP` gerada pelo BI Contábil
2. A área Contábil identifica a origem do erro no ERP TOTVS Protheus (módulo Fiscal, tela `MATA080` para NF-e ou `MATA160` para operação intra-grupo) e aplica a correção na origem
3. Se a correção exige reabertura de período fiscal já encerrado no ERP: alçada Lia (Head Atendimento) aprova a reabertura, em conjunto com Bruno (CTO), que autoriza a modificação direta no banco do ERP via procedure controlada
4. Re-geração do SPED corrigido e re-transmissão via PVA antes do prazo legal — dia 25 do mês subsequente para SPED Fiscal, dia 10 para SPED Contribuições

**Reembolsos associados.** Quando a correção do SPED resulta em recálculo de DARF de IPI ou ICMS-ST, há dois caminhos possíveis: se valor pago a maior, gera DARF retificadora com pedido de restituição (90 dias para análise da Receita); se valor pago a menor, complementação via DARF avulsa antes do vencimento original com multa de mora e juros Selic do período.

### 4.2 NF-e cancelada — reembolso ao cliente PJ

A legislação fiscal estabelece **janela de 24 horas após autorização SEFAZ** para cancelamento simples de NF-e (NT 2020.006). Após esse prazo, o cancelamento direto não é mais possível, e o ajuste deve ser feito por NF-e de devolução com referência à NF original.

**Procedimento.**

1. A Fiscal emite NF-e de devolução com o CFOP correspondente: 1202 (devolução interestadual de compra), 1410 (mesmo estado), 1910 (com substituição tributária), conforme a natureza da operação original. O campo `refNFe` da nova NF aponta para a chave de acesso de 44 dígitos da NF original
2. A Contábil estorna o lançamento de receita da venda original, junto com os tributos correspondentes: PIS (0,65% no cumulativo, 1,65% no não cumulativo), COFINS (3% cumulativo, 7,6% não cumulativo), ICMS conforme a alíquota interestadual aplicável (7% para destinatário Sul/Sudeste exceto ES, 12% para os demais)
3. A Tesouraria, depois da autorização SEFAZ da NF-e de devolução, liquida o valor ao cliente PJ via PIX (até R$ 100.000) ou TED bancário (acima desse valor)

Prazo médio do ciclo completo: 5-7 dias úteis. O ticket no HelpSphere mantém status `In Progress` durante todo o ciclo e só é movido para `Resolved` após a confirmação do crédito no extrato bancário do cliente.

### 4.3 SPED Contribuições — registro M210 inconsistente (TKT-48 âncora)

**Contexto resolvido (TKT-48).** Em 12/04, o PVA-SPED Contribuições rejeitou o arquivo de março/2026 com erro de inconsistência em **registro M210** (apuração PIS não cumulativo), apontando diferença de R$ 12.300 a maior na base de cálculo de créditos.

**Causa-raiz.** A parametrização de CFOP de devolução no ERP TOTVS marcava direito a crédito de PIS/COFINS em operação com fornecedor optante do Simples Nacional, quando a legislação não permite crédito sobre operação com fornecedor Simples (Lei 10.637/2002, art. 3º, §2º, II; Lei 10.833/2003, art. 3º, §2º, II). O cadastro de fornecedor no ERP não estava sendo validado pelo job mensal de apuração.

**Procedimento de correção aplicado em Q2-2026:**

1. A Fiscal identificou as NFs de fornecedores Simples com crédito indevidamente apurado, executando query cruzada CFOP de devolução × regime tributário do fornecedor (script `SQL-FIS-007` mantido pelo BI Contábil)
2. O ERP foi ajustado para validar o campo `regime_tributario_fornecedor` antes de marcar o crédito PIS/COFINS, com filtro de exclusão automática quando o fornecedor é optante do Simples Nacional (regimes 1 — MEI, 2 — ME, 3 — EPP)
3. Aplicou-se ajuste retroativo no registro M210 — exclusão dos créditos indevidos de R$ 12.300, gerando registro complementar M610 (ajuste de débitos/créditos) no mesmo período de apuração
4. Transmissão do SPED Contribuições corrigido em 24/04, dentro do prazo legal (25/04)

**Impacto financeiro.** O valor de R$ 12.300 não foi reembolsado a ninguém externo — foi correção de apuração interna. A Apex Moda apurou créditos a menor do que pensava ter, mas dentro da legalidade. Não há multa por isso, desde que a transmissão corrigida ocorra antes do prazo legal.

### 4.4 Créditos PIS/COFINS em compra de insumo

Apex Mercado e Apex Casa adquirem mercadoria para revenda com direito a crédito de **PIS (1,65%) e COFINS (7,6%)** no regime não cumulativo (Lei 10.637/2002 e Lei 10.833/2003), aplicado sobre o valor da operação de aquisição.

Reembolso aplicável quando o fornecedor cancela operação e mercadoria é devolvida — estorno proporcional dos créditos apurados, da mesma forma que o estorno do CFOP de devolução já trata. O procedimento simplificado:

1. A Fiscal identifica a operação no SPED Contribuições original (registro C170 ou C190)
2. Lança estorno em registro M610 (ajuste de débitos) ou M810 (ajuste de créditos), conforme natureza
3. Não há necessidade de DARF retificador se o ajuste ocorre dentro do mesmo período de apuração mensal

Casos com ajuste fora do mês de apuração original exigem retransmissão completa do SPED do período afetado e potencial DARF retificadora — fluxo descrito na seção 4.1.

---

## Página 5 — Exceções por marca

Cada marca Apex tem particularidades operacionais que geram exceções específicas à política geral. Esta página consolida as 5 marcas em produção e seus tratamentos diferenciados.

### 5.1 Apex Mercado — perecíveis e descarte ANVISA

**Cenário típico.** Carga de hortifruti recebida fora da temperatura legal — exemplo TKT-21 análogo, em que caminhão refrigerado #PLK-2D47 chegou ao CD Cajamar com produtos registrando 14°C no datalogger, sendo que o limite ANVISA para verduras folhosas é 8°C. O valor da carga era R$ 47.300.

**Regra aplicada.** Descarte obrigatório da carga inteira (proibido revender produto fora do regime de temperatura legal) + responsabilização integral da transportadora. Não há reembolso ao fornecedor da mercadoria — Apex Mercado retém o valor da carga + cobra demurrage pelo tempo de doca ocupada (R$ 380/h conforme política de doca) + ressarcimento do custo de descarte ambiental, que em Cajamar tem custo médio de R$ 0,42/kg paga à empresa contratada de tratamento de resíduos orgânicos.

**Alçada.** Marina é o aprovador padrão dessa faixa (R$ 5k a R$ 50k cobre uma carga típica de hortifruti). Cargas acima de R$ 50.000 — frequente em commodities como tomate fora de safra ou batata em alta sazonal — escalam para Lia.

**Cross-reference.** `manual_operacao_loja_v3.pdf` seção 4.7 detalha o procedimento de recebimento de perecíveis, incluindo a leitura do datalogger e o protocolo de notificação à Vigilância Sanitária local quando descarte ultrapassa 500kg de produto.

### 5.2 Apex Tech — eletrônicos com lacre violado ou fora de garantia

**Cenário típico.** Lote de smartphones premium com lacres internos violados — exemplo TKT-27 análogo, em que 60 unidades iPhone 15 Pro (valor total R$ 480.000) chegaram com caixas externas íntegras mas todos os lacres internos de fábrica violados. Suspeita de receptação ou troca por unidades adulteradas.

**Regra aplicada.** Bloqueio imediato da mercadoria no CD, sem registro no estoque comercial. Perícia técnica + comunicação à Polícia Federal por suspeita de receptação (art. 180 Código Penal). O reembolso ao distribuidor fica **suspenso** até conclusão da perícia, com o valor da operação em escrow em conta vinculada Bradesco Custódia.

**Alçada.** Lia obrigatoriamente, sem exceção, mesmo se o valor for menor que R$ 250.000. O motivo é o envolvimento compulsório das áreas de Compliance e Jurídico em qualquer caso com suspeita de irregularidade penal.

**Janela típica.** 60 a 90 dias para conclusão da perícia. Em casos extremos (envolvimento de múltiplos distribuidores na cadeia), o processo pode estender-se para 180 dias.

### 5.3 Apex Moda — sazonalidade e devolução de coleção

**Cenário típico.** Coleção entregue trocada — exemplo TKT-23 análogo, em que 8 pedidos da campanha Outubro Rosa tiveram a blusa rosa premium (R$ 240) substituída por blusa rosa básica (R$ 90 unidade), por confusão em códigos de barras parecidos terminados em 4747 vs 4774.

**Regra específica.** Devoluções de coleção sazonal têm prazo restrito — até **30 dias após a data oficial de fim de campanha** registrada no calendário comercial Apex. Após esse prazo, a peça não tem mais mercado e o lojista assume o estoque parado como saldo de coleção.

**Tabela de reembolso parcial por janela:**

| Devolução em até | % reembolso |
|---|---|
| 7 dias da entrega | 100% |
| 15 dias | 70% |
| 30 dias | 40% |
| Após 30 dias | 0% |

**Alçada.** Marina aprova até R$ 50.000. Lotes de coleção inteira (R$ 50.000+) escalam para Lia, particularmente em casos de campanhas estratégicas como Outubro Rosa, Black Friday e Natal.

### 5.4 Apex Casa — frete e montagem de móveis pesados

**Cenário típico.** Cliente PJ contesta cobrança de frete em entrega corporativa — exemplo TKT-44 análogo, em que boleto Banco do Brasil #99841 no valor de R$ 47.300 venceu em 20/04 sem retorno de liquidação até 30/04. Cliente afirma ter pago via PIX no dia.

**Regra específica.** O frete de móveis pesados (Apex Casa, especialmente categoria sofás, racks corporativos, mesas de reunião grandes) é cobrado em **2 componentes contábeis distintos** na fatura: entrega no endereço (60% do total) e montagem (40% do total). A contestação parcial é possível por componente — cliente pode contestar apenas a parcela de montagem se a entrega foi correta mas a montagem deficiente.

**Reembolso máximo.** 100% do componente contestado, desde que: montagem não foi executada de fato (cliente recusou recebimento), ou foi executada com defeito documentado (laudo técnico do próprio montador da Apex Casa, formulário `FORM-MONT-005`).

**Alçada.** Marina (R$ 47.300 está abaixo do limite de R$ 50.000); acima desse valor, Lia. Casos extremos (cliente corporativo de >R$ 500k anuais) podem ser tratados em alçada Lia mesmo abaixo do limite, a critério da equipe comercial.

### 5.5 Apex Logística — multas de trânsito e ANTT

**Cenário típico.** ANTT cobra multa em duplicidade — exemplo TKT-50 âncora, em que duas cobranças idênticas (R$ 1.870 cada) foram emitidas para o auto AIT-2026-014782, mesmo veículo, mesma data, mesmo local, mesmo valor.

**Procedimento dedicado.**

1. Defesa administrativa via portal ANTT em até **30 dias** (prazo legal de defesa)
2. Documentação a anexar: auto de infração completo + comprovante de pagamento da multa correta (uma das duas, geralmente a primeira emitida) + extrato da conta vinculada ANTT
3. Resolução típica: 60 a 90 dias até decisão administrativa da ANTT
4. Em caso de decisão favorável, a multa duplicada é cancelada no sistema da ANTT e o valor pago a maior fica como crédito em conta para futuras multas (não há restituição em dinheiro)

**Reembolso interno motorista × Apex Logística.** Se o motorista terceirizado pagou pessoalmente a multa duplicada (situação que ocorre quando o motorista não reporta a tempo para a área administrativa), o reembolso ao motorista ocorre **após** a decisão favorável da ANTT, refletindo na próxima medição mensal do contrato.

**Alçada.** Diego (R$ 1.870 está abaixo de R$ 5.000); volume mensal acima de 10 multas em duplicidade no mesmo trimestre escala automaticamente para Marina, que revisa o processo da terceirizada de transporte e pode acionar cláusula contratual de multa.

---

## Página 6 — Tabela consolidada: alçadas R$ × prazo × tipo de caso

### 6.1 Matriz consolidada

A matriz abaixo consolida valor de reembolso × tipo canônico × aprovador × prazo SLA. É a referência operacional mais consultada por Diego e Marina durante a triagem.

| Valor R$ | Tipo A (duplicidade) | Tipo B (divergência) | Tipo C (DARF/SPED) | Tipo D (glosa fiscal) |
|---|---|---|---|---|
| **0 – 5.000** | Diego · 3d | Diego · 3d | Marina · 5d (sempre) | Diego · 3d |
| **5.001 – 50.000** | Marina · 5d | Marina · 5d | Marina · 7d | Marina · 5d |
| **50.001 – 250.000** | Lia · 8d | Lia · 8d | Lia · 10d | Lia · 8d |
| **250.001 – 1.000.000** | Carla · 12d | Carla · 12d | Carla · 15d | Carla · 12d |
| **Acima de 1M** | Comitê · 25d | Comitê · 25d | Comitê · 25d | Comitê · 25d |

**Regra especial Tipo C (DARF/SPED retificador).** Mesmo que o valor envolvido seja baixo (R$ 500 de DARF de IRRF, por exemplo), a aprovação obrigatoriamente sobe para Marina porque o caso envolve retransmissão fiscal e potencial multa por atraso. Diego, no Tier 1, não tem autonomia para retificações fiscais — registra o caso, encaminha para Marina e fica como aprovador secundário (ciência).

### 6.2 Volumetria histórica Q1-2026

Os dados abaixo refletem a operação consolidada do trimestre Q1-2026 e servem como benchmark de capacidade operacional do time financeiro do Apex Group.

| Tipo de caso | Volume mensal médio | Valor médio | Valor total mensal |
|---|---|---|---|
| Tipo A — Duplicidade | 47 casos | R$ 3.840 | R$ 180.480 |
| Tipo B — Divergência | 23 casos | R$ 8.720 | R$ 200.560 |
| Tipo C — DARF/SPED | 4 casos | R$ 18.300 | R$ 73.200 |
| Tipo D — Glosa fiscal | 11 casos | R$ 12.400 | R$ 136.400 |
| **Total** | **85 casos** | **R$ 7.000 médio** | **R$ 590.640** |

Fonte: relatório `REL-FIN-Q1-2026` consolidado em 05/04/2026, com fechamento contábil já validado pela auditoria interna.

A distribuição mostra que duplicidades (Tipo A) representam mais da metade do volume operacional, mas com ticket médio menor; divergências (Tipo B) têm ticket médio mais alto e exigem mais profundidade analítica. Os casos fiscais (Tipos C e D) são minoritários em volume, mas concentram complexidade e exigem participação de Fiscal além de Financeiro.

### 6.3 Indicadores de SLA

Os indicadores abaixo são monitorados pelo painel `BI-FIN-SLA` com refresh diário às 06h00 e são parte do balanced scorecard trimestral do Financeiro.

- **SLA atendido — Diego:** alvo 95% / atual Q1: 97,2%
- **SLA atendido — Marina:** alvo 90% / atual Q1: 92,4%
- **SLA atendido — Lia:** alvo 85% / atual Q1: 88,7%
- **Casos escalados para Carla (>R$ 250k):** alvo 100% SLA / atual Q1: 100% (4 casos no trimestre, todos dentro do prazo)
- **Re-abertura de ticket `Resolved`** (reembolso questionado posteriormente): alvo <2% / atual Q1: 1,3%

### 6.4 Exceções à matriz

Três condições alteram temporariamente a aplicação da matriz consolidada:

**Pico Black Friday — 3ª semana de novembro.** Volume operacional triplica e o SLA é oficialmente dobrado em todas as faixas: Diego de 3d para 6d, Marina de 5d para 10d, Lia de 8d para 16d. O comunicado oficial sai em 01/11 de cada ano via e-mail corporativo + banner no HelpSphere para clientes lojistas. O time financeiro também recebe reforço temporário (2 analistas adicionais alocados de Suprimentos) para reduzir o impacto.

**Final de exercício fiscal — 20/12 a 05/01.** Reembolsos do Tipo C (DARF/SPED retificador) com valor acima de R$ 50.000 são **congelados** nesse período. O motivo é evitar lançamentos contábeis em períodos cruzados, com risco de afetar a apuração anual de IRPJ/CSLL. Casos urgentes podem ser tratados com aprovação direta de Bruno (CTO) — geralmente exige reabertura emergencial do ERP.

**Reembolso a fornecedor PJ Simples Nacional — Marina sempre.** Independentemente do valor (mesmo R$ 200), reembolsos a fornecedores PJ Simples Nacional escalam para Marina porque envolvem análise específica do anexo do Simples ao qual o fornecedor está enquadrado: Anexo III (serviços em geral), Anexo IV (vigilância, limpeza, locação de mão-de-obra), Anexo V (serviços intelectuais). Cada anexo tem regras distintas de retenção que afetam o cálculo do valor líquido.

---

## Página 7 — Tributos e retenções PJ

### 7.1 Quadro consolidado de retenções aplicáveis

A contratação de serviço por PJ no Brasil envolve potencialmente 4 tipos de retenção tributária, dependendo do regime do fornecedor e da natureza do serviço. A matriz abaixo é a referência operacional para a área Fiscal do Apex Group.

| Tipo de fornecedor | IRRF | INSS | PIS/COFINS/CSLL | ISS |
|---|---|---|---|---|
| **MEI** (Microempreendedor Individual) | Isento (até R$ 81k/ano de faturamento) | 11% se serviço enquadrado no anexo II Lei 8.212 (cessão MO) | Isento | Conforme município (2-5%) |
| **ME Simples Nacional (anexo III)** | Isento | Isento | Isento | Recolhido pelo próprio fornecedor |
| **EPP Simples (anexo IV)** | 1,5% serviços | Isento | Isento | Recolhido pelo próprio fornecedor |
| **PJ Lucro Presumido** | 1,5% serviços + 1% locação | 11% se cessão de mão-de-obra | 4,65% (CSLL 1% + COFINS 3% + PIS 0,65%) | Conforme município |
| **PJ Lucro Real** | 1,5% serviços | 11% se cessão MO | 4,65% (CSLL 1% + COFINS 3% + PIS 0,65%) | Conforme município |

### 7.2 Caso TKT-46 — consultoria TI por MEI (R$ 12.500)

**Contexto.** Apex Mercado contratou consultoria de TI de um MEI (CNPJ 12.345.678/0001-90) para integração de sistemas, no valor de R$ 12.500. A área Fiscal precisou orientar Diego sobre quais retenções aplicar antes do pagamento.

**Análise aplicada:**

- **IRRF:** MEI sob regime de fatura está **isento de IRRF** até o limite de faturamento anual de R$ 81.000. O fornecedor apresentou declaração de faturamento ano-corrente (Q1-2026) abaixo desse limite, comprovado pelo extrato do Portal do Empreendedor. Sem retenção de IRRF
- **INSS:** O serviço é de natureza intelectual — consultoria de TI com entrega de produto específico (projeto fechado de integração, não cessão de mão-de-obra contínua dentro da Apex). Portanto **isento de retenção INSS 11%** (Lei 8.212, art. 31, §3º, que limita a retenção à cessão de mão-de-obra)
- **PIS/COFINS/CSLL:** MEI é integralmente isento dessas contribuições no regime simplificado (Lei Complementar 123/2006)
- **ISS:** 5% retido na fonte, conforme alíquota São Paulo capital para o código de serviço 0107 (suporte técnico em informática). O ISS retido é recolhido pela Apex Mercado via DAMSP (Documento de Arrecadação Municipal de São Paulo) com vencimento dia 10 do mês subsequente

**Cálculo final.** Valor bruto R$ 12.500 menos ISS retido R$ 625 (5%) = **R$ 11.875 líquido** a pagar ao MEI via PIX. O ISS retido (R$ 625) é recolhido pela Apex via DAMSP até 10/06.

**Documentação obrigatória anexada ao ticket:**

1. NF-e emitida pelo MEI (modelo 55 caso emissão de NF-e, ou NFS-e modelo municipal de São Paulo)
2. Declaração formal de não-cessão de mão-de-obra, assinada pelo MEI, descrevendo o escopo do serviço como projeto fechado
3. Comprovante de opção pelo Simples Nacional (extrato do Portal Simples atualizado)
4. Cópia do CCM (Cadastro de Contribuintes Mobiliários) do MEI no município de prestação de serviço

### 7.3 Erro comum: reter INSS de MEI prestador de serviço intelectual

**Anti-padrão observado.** Diego, atendente Tier 1, recebe a NF do MEI por consultoria de TI e reflexivamente aplica retenção de 11% de INSS, por analogia com prestadores de serviço de limpeza/vigilância que efetivamente cedem mão-de-obra. O erro custou em média R$ 1.375 por NF nos casos retroativos identificados em Q1-2026.

**Comportamento correto.** A retenção de 11% de INSS só se aplica a **cessão de mão-de-obra** conforme definido na Lei 8.212, art. 31, §3º. Cessão MO caracteriza-se pela colocação à disposição da contratante, em suas dependências ou em local por ela determinado, de pessoa(s) que realizem serviço(s) de forma contínua, sob comando da contratante. Consultoria intelectual com entregável definido não é cessão.

**Critério prático de diferenciação:**

- **Cessão MO** — a pessoa física do MEI trabalha dentro da Apex em jornada fixa, com supervisão direta da área que contratou (exemplo: motorista MEI que faz rota Apex Logística diária com horário e veículo determinados pela Apex). **Retém 11% INSS**
- **Não cessão** — MEI presta serviço por entrega definida (consultoria, projeto fechado, parecer técnico, treinamento). Trabalha de onde quiser, com horário próprio, e responde por resultado final ao contratante. **NÃO retém INSS**

**Quando errar.** Se a retenção indevida foi aplicada, há dois caminhos: solicitar restituição via GPS (Guia da Previdência Social) retificadora junto à Receita, processo que demora entre 60 e 90 dias para a Receita analisar; ou compensar com retenções de competência futura, caso a Apex tenha relacionamento contínuo com o mesmo MEI. A escolha entre as duas depende da urgência do MEI e do volume de retenções futuras previstas.

### 7.4 IRRF — quadro detalhado por código DARF

A retenção de IRRF tem códigos DARF específicos por natureza do serviço. A tabela abaixo é a referência operacional usada pela área Fiscal:

| Natureza do serviço | Código DARF | Alíquota | Base de cálculo |
|---|---|---|---|
| Serviços profissionais PJ (consultoria, advocacia, contabilidade) | 1708 | 1,5% | Valor bruto da NF |
| Locação de bens móveis (equipamentos, veículos) | 3208 | 1,5% | Valor do aluguel mensal |
| Comissões e corretagens | 8045 | 1,5% | Valor da comissão paga |
| Serviços de limpeza, vigilância, segurança | 1708 | 1% (somado a INSS retido) | Valor bruto |

**Prazo de recolhimento.** A DARF de IRRF retido na fonte deve ser quitada até o **último dia útil do segundo decêndio do mês subsequente** à retenção, conforme Decreto 9.580/18. Atraso gera multa de mora (0,33% ao dia, limitada a 20%) + juros Selic do período.

### 7.5 Reembolso de retenção indevida — caminhos operacionais

Quando um fornecedor PJ identifica retenção indevida no comprovante de pagamento (exemplo recorrente: Apex reteve IRRF de MEI isento, ou reteve INSS sobre serviço intelectual), o caminho operacional é abertura de ticket Tipo D no HelpSphere com alçada mínima Marina.

**Caminho 1 — Comprovante retificador (preferido).** A Apex emite **comprovante de retenção retificador** (formulário 1018 da Receita Federal). O MEI ou PJ usa esse comprovante para abater do imposto devido no exercício anual, conciliando o saldo no ajuste anual da Pessoa Jurídica (ou na Declaração de Ajuste Anual da Pessoa Física, no caso de MEI titular). Esse caminho é o padrão Apex Group por dois motivos: não exige nova movimentação de caixa e tem zero risco contábil.

**Caminho 2 — Restituição direta com DARF retificadora.** Apex restitui o valor diretamente ao MEI ou PJ via PIX/TED, e simultaneamente estorna o recolhimento original via DARF retificadora junto à Receita. Esse processo é mais complexo (30-45 dias) e exige aprovação Lia (Head Atendimento) em qualquer valor, dado o risco contábil de duplo lançamento se mal-executado.

**Padrão decisório.** Sempre Caminho 1, exceto quando o MEI tem urgência de caixa documentada (declaração formal de necessidade financeira anexada ao ticket) — nesse caso, Caminho 2 com aprovação Lia.

---

## Página 8 — Anexos: modelo, contatos, controle

### 8.1 Modelo de solicitação padrão `FORM-FIN-007`

```
========================================================
SOLICITAÇÃO DE REEMBOLSO — POL-FIN-007 v4.2
========================================================
ID Interno:                   REEMB-AAAAMM-NNNN (sistema)
Data abertura:                DD/MM/AAAA HH:MM
Solicitante:                  [Nome + CPF/CNPJ + e-mail]
Marca Apex envolvida:         [ ] Mercado [ ] Tech [ ] Moda [ ] Casa [ ] Logística
Tipo do caso (Página 2.3):    [ ] A Duplicidade [ ] B Divergência [ ] C DARF/SPED [ ] D Glosa
Valor solicitado (R$):        R$ ____________,__
Faixa de alçada (1.2):        [ ] 0-5k [ ] 5k-50k [ ] 50k-250k [ ] 250k-1M [ ] >1M
NF-e original (chave 44 dig): ________________________________________
Comprovante pagto original:   [PIX endtoend / TED ref / Boleto]
CFOP original / CFOP devol.:  ____ / ____
CST original / CST devol.:    ___ / ___
Descrição do problema:        (mínimo 200 caracteres)
________________________________________________________
________________________________________________________
Anexos obrigatórios:
  [ ] NF-e XML + DANFE
  [ ] Comprovante de pagamento original
  [ ] Extrato bancário do período
  [ ] (Tipo C) Log do PVA-SPED com erro
  [ ] (Tipo D) Comprovante de retenção
========================================================
Aprovador primário (preench. sistema): _____________
Aprovador secundário:                  _____________
Status: [ ] Open [ ] In Validation [ ] Approved [ ] Rejected [ ] Liquidated
Decisão:                               _______________________________
Data liquidação:                       __/__/____  via [PIX / TED]
Comprovante (anexar):                  ____________________________
========================================================
```

O formulário é gerado automaticamente pelo HelpSphere ao abrir ticket com `category=Financeiro`, mas pode ser baixado em formato PDF preenchível no portal interno `intranet.apex/financeiro/formularios`.

### 8.2 Contatos de escalação

| Nível | Quem | Canal primário | Canal urgência | Horário |
|---|---|---|---|---|
| Tier 1 | Diego (Atendente) | HelpSphere ticket | WhatsApp Business +55 11 4000-7700 ramal 1 | Seg-Sex 08h-20h · Sáb 09h-14h |
| Tier 2 | Marina (Supervisora) | Escalação automática HelpSphere | Telefone direto interno x4471 | Seg-Sex 09h-19h |
| Head | Lia (Head Atendimento) | E-mail `lia.head@apex.com.br` | WhatsApp executivo (apenas faixa R$ 250k+) | Seg-Sex 09h-18h |
| CFO | Carla (CFO) | E-mail `carla.cfo@apex.com.br` com cópia para Lia | Reunião agendada via secretária | Seg-Sex 10h-17h |
| Comitê | Carla + Bruno (CTO) + Diretoria | Reunião extraordinária | — | Por convocação formal |

**Regras de uso do canal de urgência.** O canal WhatsApp executivo de Lia só pode ser acionado para casos na faixa R$ 250.000+ e em horário comercial. Uso indevido (urgências infundadas, casos abaixo da faixa) gera comunicado formal de Recursos Humanos sobre conduta esperada de atendentes Tier 1 e Tier 2.

### 8.3 Conformidade, auditoria e LGPD

**Retenção documental.** Todos os dossiês `REEMB-AAAAMM-NNNN.pdf` ficam armazenados por **5 anos** no repositório `DOC-FIN-REEMB-AAAA`, organizados por ano de abertura. O prazo de 5 anos atende cumulativamente à exigência fiscal (Decreto 70.235/72 art. 195, sobre retenção de documentos fiscais) e à exigência LGPD (Lei 13.709/18 art. 16, sobre exclusão de dados pessoais após esgotamento da finalidade).

**Auditoria interna.** Amostragem aleatória de **5% dos casos liquidados por mês** (aproximadamente 4 casos do volume mensal de 85), com revisão completa de documentação, alçada aplicada e cumprimento de SLA. Os resultados consolidam-se em relatório trimestral apresentado a Carla pela Head de Auditoria Interna.

**Auditoria externa.** Anual, executada pela auditoria contratada (firma KPMG no exercício corrente), com foco em casos acima de R$ 250.000 (faixa alçada Carla) e em casos do Tipo C (DARF/SPED retificador) por seu impacto fiscal.

**LGPD.** Dados pessoais de fornecedores PJ — CPF do sócio responsável legal, e-mail corporativo, telefone — são tratados conforme `politica_dados_lgpd.pdf` seção 5.2. Base legal: **execução de contrato** (Lei 13.709/18 art. 7º, V) combinada com **cumprimento de obrigação legal fiscal** (art. 7º, II). Dados sensíveis (saúde, biometria) não são coletados nesse fluxo. O direito de acesso, retificação e exclusão é exercido pelos titulares via canal `dpo@apex.com.br` com SLA de 15 dias.

### 8.4 Cross-references

A política de reembolso interage com outros documentos normativos do Apex Group. As referências cruzadas mais relevantes:

- `manual_operacao_loja_v3.pdf` — procedimentos de recebimento de mercadoria (seção 4.7 para perecíveis, 5.2 para eletrônicos), procedimento de devolução B2C, política de doca
- `faq_pedidos_devolucao.pdf` — devoluções no canal B2C (consumidor final), aplicação do CDC, prazos de arrependimento
- `runbook_sap_fi_integracao.pdf` — integração ERP/contábil, parametrização CFOP no TOTVS, geração de NF-e, integração com SAP FI quando aplicável
- `politica_dados_lgpd.pdf` — tratamento de dados pessoais de fornecedores e clientes, exercício de direitos do titular, base legal
- `faq_horario_atendimento.pdf` — janelas operacionais do HelpSphere para abertura e escalação de tickets, exceções em feriados

### 8.5 Histórico de versões

| Versão | Data | Mudança principal | Aprovador |
|---|---|---|---|
| v1.0 | Q2-2024 | Criação do documento | Carla (CFO) |
| v2.0 | Q4-2024 | Inclusão da alçada Lia (R$ 50k-250k) | Carla + Lia |
| v3.0 | Q2-2025 | Inclusão do fluxo SPED Contribuições + LGPD | Carla + Bruno |
| v4.0 | Q4-2025 | Revisão completa pós-incidentes Black Friday | Comitê Diretoria |
| **v4.2** | **Q2-2026** | **Inclusão da tabela de retenções PJ Simples + MEI (Página 7) + matriz consolidada (Página 6)** | **Carla + Lia + Bruno** |

A versão v4.1, intermediária entre v4.0 e v4.2, foi numerada mas não publicada (consolidada com a v4.2 antes da aprovação final da Diretoria).

### 8.6 Cláusula de prevalência da legislação

Em caso de divergência entre os termos desta política e a legislação fiscal, trabalhista ou societária vigente, **prevalece a legislação**. A área Fiscal, em conjunto com Marina (Tier 2), é responsável por comunicar imediatamente qualquer atualização normativa à Diretoria Financeira para revisão extraordinária do documento. Não há tolerância a aplicar política contrária à lei sob argumento de "tradição operacional".

---

**Documento confidencial — uso interno Apex Group**

**Código documento:** `POL-FIN-007 v4.2` · **Aprovação:** Carla (CFO) em Q2-2026 · **Próxima revisão programada:** Q4-2026

**Distribuição:** HelpSphere Tier 1 + Tier 2, Financeiro, Contábil, Fiscal, Tesouraria, Compliance, Vendor Management
