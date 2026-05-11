---
title: FAQ — Pedidos e Devoluções (Q2-2026)
subtitle: Política consolidada · uso interno HelpSphere · Apex Group
version: v4 · revisão semestral 2026-Q2 · próxima revisão 2026-Q4
classification: Confidencial — uso interno
approvers: Lia (Head Atendimento) · Bruno (CTO) · Carla (CFO)
---

# FAQ — Pedidos e Devoluções (Q2-2026)

**Apex Group · Política consolidada para B2C e B2B**

---

## Página 1 — Introdução e escopo

Este documento consolida a política de pedidos e devoluções aplicável às cinco marcas seed do Apex Group: Apex Mercado (supermercado), Apex Tech (eletrônicos e linha branca), Apex Moda (fashion sazonal), Apex Casa (móveis e decoração) e Apex Logística (operação B2B intra-grupo). O conteúdo é referência operacional para Diego e demais atendentes Tier 1 do HelpSphere e para os supervisores de Tier 2.

A política cobre tanto operações B2C — consumidor final que compra em loja física, e-commerce ou app — quanto operações B2B com lojistas, multimarcas, franquias e clientes corporativos pessoa jurídica. Casos de reembolso financeiro a lojista por avaria ou outras questões puramente financeiras estão documentados em `politica_reembolso_lojista.pdf`, que deve ser consultado em conjunto com este FAQ quando o ticket envolver valores acima de R$ 5.000 ou clientes com contrato corporativo ativo.

### 1.1 Princípios norteadores

A Apex Group adota quatro princípios não-negociáveis na operação de pedidos e devoluções. O primeiro é a conformidade integral com o Código de Defesa do Consumidor (Lei 8.078/1990) em todas as transações B2C, sem exceção. O segundo é a aplicação subsidiária do Código Civil e dos contratos comerciais firmados para todas as operações B2B, observando que o CDC não se aplica a relações entre pessoas jurídicas com finalidade de revenda ou insumo.

O terceiro princípio é a política comercial flexível: a empresa, sempre que possível e dentro dos parâmetros de alçada documentados na seção 1.3, concede tratamento mais generoso que o exigido por lei. Essa concessão é registrada formalmente no HelpSphere com o motivo `cortesia_comercial` e nome do autorizador, para fins de auditoria e construção de base histórica de decisões.

O quarto princípio é a meta institucional de resolução em primeiro contato (FCR — First Contact Resolution): 78% dos tickets devem ser resolvidos sem escalação para Tier 2 ou superior. O indicador é monitorado por Marina (Tier 2) com revisão mensal e desdobrado por categoria, marca e turno.

### 1.2 Escopo

O documento aplica-se aos seguintes contextos:

- Vendas em loja física, e-commerce, app Apex+ e marketplaces integrados via plataforma própria de marketplace ApexLink
- Pedidos B2B faturados sob CNPJ, com ou sem contrato corporativo
- Devoluções por arrependimento, defeito, divergência de pedido, avaria de transporte ou erro operacional do CD-Cajamar
- Acionamentos de garantia legal e garantia estendida Apex

O documento NÃO cobre:

- Reembolso financeiro a lojista por questões puramente fiscais ou contábeis (ver `politica_reembolso_lojista.pdf`)
- Procedimentos técnicos de NFC-e e NF-e (ver `runbook_sap_fi_integracao.pdf`)
- Acidentes em loja, danos físicos ao cliente ou questões de segurança (procedimento separado em manual de operação de loja)

### 1.3 Cadeia de decisão e alçadas

A alçada de aprovação para exceções segue a tabela abaixo. Faixas são por valor total da exceção concedida (não pelo valor do produto). Diego atua autonomamente até R$ 500. Acima disso, Marina (Tier 2) assume. Para valores significativos, Lia (Head de Atendimento) é envolvida.

| Faixa de exceção | Aprovador | Prazo de resposta |
|---|---|---|
| Até R$ 500 | Diego (Tier 1) | Imediato |
| R$ 501 – R$ 5.000 | Marina (Tier 2) | Até 2h úteis |
| R$ 5.001 – R$ 50.000 | Lia (Head Atendimento) | Até 4h úteis |
| Acima de R$ 50.000 | Lia + Carla (CFO) | Até 24h úteis |

Para casos envolvendo mídia, imprensa ou exposição pública do cliente (rede social com alcance relevante), a escalação direta para Lia é mandatória, independentemente do valor. A Comunicação Corporativa é envolvida em paralelo.

### 1.4 Princípio da boa-fé e padrão de conduta

Toda interação com o cliente — em qualquer canal, por qualquer Tier — segue o princípio institucional da boa-fé objetiva. Isso significa, na prática:

- A Apex não exige do cliente provas excessivas para iniciar análise. Foto, descrição clara e cupom fiscal são suficientes para abrir o procedimento. Provas adicionais são solicitadas apenas se o caso evoluir para análise técnica ou jurídica.
- Em caso de divergência entre o que o cliente declara e o que o sistema registra, a versão do cliente é considerada válida até prova em contrário. A presunção de boa-fé inverte o ônus probatório de forma deliberada — é mais barato para a empresa absorver uma fraude pontual que erodir relação com 99% de clientes legítimos.
- O atendimento nunca recusa contato. Se Diego não tem alçada ou não tem informação suficiente para resolver, ele escala — não devolve o cliente para "aguardar resposta indefinida".
- O cliente nunca é "remetido" para outro setor sem que Diego garanta a transição. A regra de cobertura é: o atendente que recebe o ticket é responsável pela resolução final, mesmo que delegada — não há "passar bola".

Esse padrão de conduta é monitorado por Marina via auditoria de chamados (amostragem de 5% dos tickets/mês) e revisado em reunião semanal com os Tier 1.

---

## Página 2 — Marco regulatório e glossário operacional

### 2.1 CDC — Código de Defesa do Consumidor (Lei 8.078/1990)

A operação de devolução e troca no varejo brasileiro é regida pelo CDC, e Diego deve dominar pelo menos seis artigos centrais. A tabela abaixo é referência rápida — para casos atípicos, Marina mantém roteiro de consulta jurídica trimestral com o departamento jurídico da holding.

| Artigo | Conteúdo | Aplicação prática no varejo |
|---|---|---|
| Art. 18 | Responsabilidade por vício de qualidade ou quantidade | Prazo de 30 dias para reparo · após esse prazo, opção do consumidor por troca, devolução do valor ou abatimento proporcional |
| Art. 26 | Prazos decadenciais para reclamação | 30 dias para produto não-durável (alimento, perfumaria) · 90 dias para produto durável (eletrônico, móvel) |
| Art. 30 | Princípio da vinculação da oferta | Anúncio publicado obriga o fornecedor a cumprir, salvo erro material evidente |
| Art. 35 | Recusa em cumprir oferta — opções do consumidor | Exigir cumprimento · aceitar produto equivalente · rescindir com restituição |
| Art. 49 | Direito de arrependimento em compra fora do estabelecimento | 7 dias corridos do recebimento · aplicável a e-commerce, app, telefone |
| Art. 50 | Garantia contratual soma-se à garantia legal | Não substitui a garantia legal mínima (90 dias para duráveis) |

O Art. 18, §1º estabelece que o fornecedor tem 30 dias para sanar o vício. Não saneado, o consumidor pode exigir: (a) substituição do produto por outro da mesma espécie, em perfeitas condições de uso; (b) restituição imediata da quantia paga, monetariamente atualizada; (c) abatimento proporcional do preço. A escolha é do consumidor, e a Apex respeita integralmente.

O Art. 49 é frequentemente confundido com "direito de troca" amplo. Não é. O direito de arrependimento se aplica APENAS a compras fora do estabelecimento (e-commerce, app, telefone). Compras presenciais em loja física não estão sujeitas ao Art. 49 — qualquer flexibilidade nesses casos é política comercial da empresa, não obrigação legal.

### 2.2 Glossário operacional

**FCR (First Contact Resolution).** Métrica institucional. Meta: 78% dos tickets de devolução resolvidos sem escalação. Calculada mensalmente por categoria, marca e turno. Marina é a responsável pelo acompanhamento e ações corretivas quando o indicador cai abaixo de 70% por dois meses consecutivos.

**CDC art. 49.** Janela legal de 7 dias corridos, contados do recebimento da mercadoria, para que o consumidor desista da compra fora do estabelecimento sem necessidade de justificar. O ônus de provar o recebimento é do fornecedor — por isso, Apex utiliza assinatura digital + foto na entrega.

**Política comercial flexível.** Concessão de devolução, troca ou benefício além do exigido por lei. Sempre registrada como `motivo=cortesia_comercial` no HelpSphere, com nome do autorizador e justificativa de uma linha. A base histórica é revisada trimestralmente por Marina e Lia para identificar padrões de uso indevido ou oportunidades de mudança de política.

**Garantia estendida Apex.** Contrato adicional pago pelo cliente, vinculado ao CPF e ao número de série do produto. Cobertura adicional além da garantia de fábrica. Detalhes na seção 8.

**Doca reversa.** Operação de recebimento de mercadoria devolvida no CD-Cajamar. Lote logístico separado do recebimento de fornecedor para evitar confusão entre estoque novo e mercadoria de retorno. Conferência rigorosa com SLA de 48h úteis.

**Romaneio.** Documento de conferência que acompanha a separação de pedido. Em devolução B2B, é a base para auditoria de divergências entre o que foi pedido, o que foi separado e o que efetivamente chegou na loja do lojista.

### 2.3 Notas sobre interpretação do CDC no varejo Apex

A interpretação do CDC pela Apex é sempre pró-consumidor em casos de dúvida, conforme princípio do art. 47 (interpretação mais favorável ao consumidor). Diego não deve, em hipótese alguma, recusar uma devolução com base em interpretação restritiva do CDC quando a interpretação ampliativa for igualmente válida — esse padrão de conduta protege a marca de litígios e mantém o NPS elevado.

Pontos de interpretação consolidados pelo Jurídico Apex em conjunto com Lia:

- O prazo de 7 dias do art. 49 conta do recebimento, não da compra. Em caso de dúvida sobre a data de recebimento, vale o que estiver registrado no rastreamento da transportadora.
- "Fora do estabelecimento comercial" inclui qualquer canal em que o cliente não tenha podido inspecionar fisicamente o produto antes da compra — abrange e-commerce, app, telefone, televenda e WhatsApp como canal de venda.
- O direito de arrependimento NÃO depende de defeito. O consumidor pode simplesmente desistir, sem justificativa, e a Apex deve aceitar. Tentativa de exigir justificativa configura prática abusiva.
- "Vício oculto" (defeito que só se manifesta com uso) tem prazo iniciado a partir da manifestação, não da compra (CDC art. 26, §3º). Em produtos duráveis, isso pode estender significativamente o prazo de reclamação.

### 2.4 Documentação obrigatória de toda devolução

Diego registra cinco campos obrigatórios em qualquer abertura de chamado de devolução. A ausência de qualquer um deles bloqueia a continuidade do fluxo:

1. Número do pedido (e-commerce) ou número do cupom fiscal (loja física)
2. CPF/CNPJ do solicitante — confirmado contra cadastro no momento da abertura
3. Motivo da devolução, selecionado da lista controlada (Apêndice A, página 12)
4. Foto ou descrição da avaria, quando aplicável (anexada via app ou WhatsApp)
5. Comprovante de retirada, quando o produto já foi entregue (transportadora ou loja)

Caso o cliente não tenha algum desses dados disponíveis no momento da ligação, Diego abre o chamado em status `aguardando_documentacao` e envia ao cliente uma orientação por e-mail ou WhatsApp com a lista do que falta. SLA de retomada: 24h úteis após documentação completa.

---

## Página 3 — Política por marca: Apex Mercado e Apex Tech

### 3.1 Apex Mercado (supermercado · alta rotatividade · perecíveis)

A operação da Apex Mercado tem características próprias: produtos perecíveis com janela curta de validade, alto volume de pequenas transações e tolerância sanitária regulada pela ANVISA. A política de devolução reflete essas peculiaridades.

**B2C — consumidor final em loja física**

Para produtos perecíveis (hortifruti, açougue, padaria, peixaria), a troca é permitida apenas no dia da compra, mediante apresentação do cupom fiscal. Após esse prazo, o produto perdeu integridade sanitária e a empresa não pode aceitar retorno por questões regulatórias da ANVISA.

Para produtos secos (mercearia, bebidas, higiene pessoal), o prazo de troca por defeito é de 7 dias corridos. Vícios manifestos como embalagem violada de fábrica, produto fora do prazo de validade no momento da venda ou divergência entre rótulo e conteúdo são acolhidos sem questionamento. Não há devolução por desistência em compras presenciais — o Art. 49 do CDC não se aplica.

Para produtos congelados (cold chain), a troca é permitida no mesmo dia. Caso o cliente apresente evidência de quebra de cadeia de frio (foto de embalagem inflada, sinal claro de descongelamento), a troca é aceita até 24h após a compra. A loja registra ocorrência no sistema de qualidade interna para auditoria do ponto de entrega.

**B2B — restaurantes, padarias, food service**

Pedido faturado e entregue tem 24h para conferência e devolução por divergência. Após 24h, considera-se aceite tácito do pedido, e somente troca por defeito (Art. 18 CDC) é viável. Mesmo em B2B, o vício de qualidade ou quantidade é responsabilidade do fornecedor — embora o CDC não se aplique stricto sensu, o Código Civil prevê garantia similar para vícios redibitórios.

Para hortifruti em pedidos B2B, há tolerância contratual de 8% de quebra natural (perda em transporte por delicadeza do produto). Essa margem não gera crédito ou estorno. Acima desse percentual, configura defeito de qualidade e abre direito a troca ou abatimento proporcional.

### 3.2 Apex Tech (eletrônicos + linha branca)

A Apex Tech é a marca com maior volume de devoluções por arrependimento (CDC art. 49), em parte por operar majoritariamente em canais digitais (e-commerce, app, marketplace), em parte pela complexidade técnica dos produtos que muitas vezes não atendem à expectativa do cliente.

**B2C — e-commerce e app**

O direito de arrependimento é integral: 7 dias corridos do recebimento, sem necessidade de justificativa. Para que a devolução seja aceita, o produto deve retornar lacrado, sem uso, com nota fiscal e todos os acessórios originais (manuais, cabos, controles remotos, mídias de instalação, brindes promocionais). O frete reverso é de responsabilidade integral da Apex, conforme jurisprudência consolidada — o consumidor que desiste não pode arcar com o custo de devolver.

Caso o produto retorne com sinais de uso (lacre rompido, marcas de manuseio prolongado, acessórios faltando), Marina avalia caso-a-caso. Pode haver: aceitação integral (cortesia para clientes com bom histórico), aceitação parcial (estorno proporcional, retendo o valor do dano causado) ou recusa formalizada (com devolução do produto ao cliente).

A garantia de fábrica é variável por categoria: smartphones têm 12 meses · linha branca (geladeira, lava-roupas, fogão) tem 12 a 24 meses dependendo do fabricante · pequenos eletros (liquidificador, sanduicheira) têm 90 dias. A garantia estendida Apex pode ser contratada no checkout ou em até 30 dias após a compra (ver página 8 deste documento).

**B2B — empresas com CNPJ**

O pedido faturado tem 7 dias para devolução por divergência ou avaria identificada no recebimento. Produto aberto sem defeito não tem direito de devolução — o Art. 49 do CDC não se aplica a operações B2B porque o cliente PJ presume-se conhecedor da operação que contratou.

A garantia de produto B2B segue o fornecedor original. Se o cliente PJ adquiriu lote de notebooks Lenovo via Apex Tech, a garantia é Lenovo direta, intermediada pela Apex como canal autorizado. Em caso de defeito, o produto é encaminhado para assistência Lenovo, e a Apex acompanha o ticket até resolução. Em casos de assistência demorada (>30 dias), Marina pode autorizar substituição temporária por unidade similar do estoque Apex para evitar prejuízo operacional ao cliente PJ.

---

## Página 4 — Política por marca: Apex Moda, Apex Casa e Apex Logística

### 4.1 Apex Moda (fashion · sazonal · multimarcas)

A Apex Moda opera com janelas curtas de coleção, alta rotatividade de SKUs e elevado volume de devoluções por questão de tamanho e modelagem — questões mais frequentes em moda que em outras categorias. A política é desenhada para acomodar esse padrão.

**B2C — loja física e e-commerce**

No e-commerce, vale o CDC art. 49: 7 dias corridos do recebimento para troca ou devolução, sem justificativa. Na loja física, a Apex Moda concede 30 dias para troca por questão de tamanho, modelagem ou desistência — política comercial mais flexível que o CDC, pois não há vício, mas a empresa entende que provador de loja nem sempre reflete uso real.

Peças íntimas, maiôs e biquínis exigem lacre higiênico intacto para qualquer troca. Cada peça vem com etiqueta higiênica adesiva colada ao forro interno. Se o lacre estiver rompido, a troca é recusada, ainda que dentro do prazo CDC — não por discricionariedade da Apex, mas por questão sanitária estabelecida pelo Procon em diversos estados e validada pela ANVISA.

Coleções em liquidação com desconto superior a 40% sobre o preço original podem ser trocadas apenas por outro produto da mesma faixa de desconto. A regra é informada no momento da venda e impressa no cupom fiscal. Diferença de preço entre o produto devolvido e o produto desejado é paga pelo cliente em dinheiro (sem estorno) ou via vale-troca.

**B2B — multimarcas e franquias**

Pedido de coleção segue política sell-in: a janela de devolução por defeito é de 15 dias após o recebimento, contado pela data do romaneio assinado. Defeito inclui erro de modelagem do fornecedor (tamanho declarado vs tamanho real), divergência entre romaneio e mercadoria efetivamente entregue, e avaria de transporte.

Troca por encalhe (produto que não vendeu) NÃO é autorizada — risco assumido pelo lojista no momento da compra. Exceções pontuais por NPS de longo prazo ou parceria estratégica passam por aprovação de Lia diretamente.

### 4.2 Apex Casa (móveis + decoração · logística pesada)

A Apex Casa lida com produtos de alto valor agregado, montagem complexa e logística diferenciada. A política reflete a especificidade da categoria.

**B2C — loja física e e-commerce**

Móveis montados pelo próprio cliente: 7 dias após a entrega (CDC art. 49). O produto deve ser devolvido não-montado ou retornar nas mesmas condições em que foi entregue. Em caso de montagem parcial seguida de desistência, a Apex Casa avalia se a desmontagem causa dano irreversível — em caso positivo, o estorno é parcial.

Móveis montados pela equipe Apex (serviço de montagem contratado): 7 dias para reclamação por defeito de fábrica. Desistência após montagem profissional não é aceita, salvo defeito identificado. O cliente assinou ordem de serviço aceitando o produto montado, o que caracteriza aceite formal.

Sofás retráteis, camas box, guarda-roupas modulados e cozinhas planejadas: prazo de defeito estendido para 15 dias por se tratar de bens de alto valor e complexidade técnica. Defeitos no mecanismo retrátil, no estofamento ou no acabamento podem se manifestar apenas após uso inicial — daí o prazo mais generoso.

**B2B — escritórios corporativos**

Pedido sob medida (BTO — Build to Order, móvel planejado conforme planta do cliente) não tem direito de devolução por desistência. O CDC art. 49 expressamente exclui produtos personalizados. Caso o pedido apresente defeito de fabricação, a garantia padrão de 12 meses se aplica, com extensão contratual de 24 meses disponível (ver página 8 deste documento).

### 4.3 Apex Logística (operação B2B intra-grupo)

A Apex Logística não vende produtos físicos — presta serviços de transporte intra-grupo para as outras quatro marcas e para alguns clientes B2B externos selecionados. A política de "devolução" se traduz em ressarcimento por avaria, demurrage ou divergência de serviço.

Não há devolução em sentido estrito (serviço prestado não retorna). Em caso de carga avariada no transporte, o ressarcimento é processado via seguro de carga, conforme apólice vigente. O fluxo financeiro está documentado em `politica_reembolso_lojista.pdf` seção 5.

Excesso de demurrage gerado por agendamento errado (Apex Logística agendou doca em horário não disponível pelo recebedor): o estorno proporcional é analisado por Marina e aprovado conforme alçada padrão. Demurrage por culpa do transportador (atraso na coleta) é coberto pelo seguro contratual da operação.

---

## Página 5 — Fluxo de devolução B2C em 7 passos

### 5.1 Procedimento padrão

O fluxo de devolução B2C é padronizado em 7 passos para garantir consistência operacional e auditabilidade. Diego segue esses passos em qualquer abertura, independentemente da marca.

**Passo 1 — Abertura do chamado.** Cliente abre solicitação via app Apex+, site oficial, WhatsApp Business ou comparecimento físico em loja. Diego registra no HelpSphere selecionando o motivo da lista controlada (ver Apêndice A na página 12). O número do protocolo é informado imediatamente ao cliente, junto com SLA esperado de retorno.

**Passo 2 — Validação de prazo.** Diego confere a data da compra (cupom fiscal ou pedido) contra o prazo legal aplicável (CDC art. 49 para e-commerce/app, 30 dias para defeito não-durável, 90 dias para defeito durável) e contra o prazo comercial Apex, que varia por marca conforme detalhado nas páginas 3 e 4 deste documento.

Caso o prazo legal tenha expirado mas o prazo comercial Apex ainda esteja vigente, Diego informa ao cliente que a devolução prossegue pela política da empresa, não pelo CDC — distinção importante para evitar mal-entendidos em interação futura.

**Passo 3 — Validação de condições.** Diego confere as condições da devolução: produto deve estar lacrado (em caso de arrependimento), com acessórios completos, com nota fiscal disponível ou recuperável via CPF do cliente. Foto do produto e da embalagem é solicitada quando aplicável — especialmente para produtos eletrônicos e móveis.

Em caso de divergência significativa (cliente alega lacre íntegro mas foto mostra rompido, por exemplo), a escalação para Marina é imediata, sem encerrar o atendimento. Marina decide se aceita, recusa ou aceita parcialmente.

**Passo 4 — Geração da etiqueta de retorno.** O sistema gera código de postagem dos Correios (PAC para produtos até 30kg) ou agenda coleta com transportadora parceira (para produtos acima de 30kg, móveis, eletrodomésticos grandes). O custo do frete reverso é integralmente arcado pela Apex em todos os casos legítimos de devolução — tanto por arrependimento (CDC art. 49) quanto por defeito (CDC art. 18, §1º).

A etiqueta é enviada ao cliente por e-mail e via app, com instrução clara de embalagem (manter caixa original quando possível, proteger com plástico-bolha extra para eletrônicos). SLA de geração da etiqueta: 4h úteis após a abertura do chamado.

**Passo 5 — Recebimento em doca reversa.** A mercadoria chega ao CD-Cajamar na doca reversa, operacionalmente separada da doca de recebimento de fornecedor. O conferente registra a chegada no WMS, verifica integridade da embalagem secundária e dá entrada do retorno. SLA institucional: 48h úteis entre o recebimento físico e a conferência detalhada.

**Passo 6 — Análise final.** A conferência detalhada compara o produto recebido com o que foi declarado pelo cliente na abertura. Se há divergência (produto com avaria não declarada, acessórios faltando, sinais de uso evidentes em devolução por arrependimento), Marina é acionada para análise.

Marina decide entre: estorno integral (caso aceite o produto como recebido), estorno parcial proporcional ao dano identificado, recusa formal com devolução do produto ao cliente, ou aceitação por cortesia comercial (para clientes com excelente histórico, mesmo que tecnicamente fora dos critérios). A decisão é registrada com justificativa de uma linha no HelpSphere.

**Passo 7 — Estorno financeiro.** Aprovado o retorno, o estorno é efetuado conforme a forma original de pagamento. Cartão de crédito: estorno em até 2 faturas (regra da adquirente Cielo, fora do controle direto da Apex). Boleto ou PIX: depósito em conta indicada pelo cliente em até 5 dias úteis. Vale-presente Apex: crédito imediato no saldo do app, disponível para uso na próxima compra.

O cliente é notificado de cada etapa via WhatsApp e e-mail. Encerramento do ticket apenas após confirmação do estorno na conta do cliente — se o cliente questiona não ter recebido o crédito, Marina aciona o financeiro para rastreamento e provê retorno em 4h úteis.

### 5.2 SLA institucional B2C — quadro consolidado

| Etapa | SLA esperado | Responsável |
|---|---|---|
| Abertura → Geração da etiqueta | 4h úteis | Diego |
| Postagem cliente → Chegada CD | 5 a 10 dias (variável por região) | Transportadora |
| Chegada CD → Conferência detalhada | 48h úteis | Operação CD |
| Conferência → Aprovação ou escalação | 24h úteis | Marina |
| Aprovação → Estorno financeiro | 5 dias úteis (cartão até 2 faturas) | Financeiro |
| Estorno → Confirmação ao cliente | Imediato após confirmação bancária | Diego/sistema |

Casos que excedem qualquer SLA acima de 30% são automaticamente sinalizados no dashboard de Marina, que define ação corretiva caso-a-caso.

### 5.3 Exceções ao fluxo padrão

Cinco situações justificam desvio do fluxo padrão de 7 passos. Diego identifica essas situações no momento da abertura e seleciona o subfluxo correspondente no HelpSphere.

**Devolução em loja física no mesmo dia da compra.** O cliente pode realizar a devolução diretamente no caixa da loja, sem necessidade de etiqueta de retorno ou agendamento de coleta. O cupom fiscal original é apresentado, e a operação é finalizada com estorno imediato no cartão (em caso de débito) ou estorno em até 48h (em caso de crédito). Esse subfluxo aplica-se a Apex Moda, Apex Tech (produtos de bancada, não eletrodomésticos grandes) e Apex Mercado (não-perecíveis).

**Devolução com troca imediata em loja.** Variante do anterior. Cliente devolve e leva outro produto no mesmo atendimento. A operação é registrada como troca direta, com geração de NF de devolução e nova NF de venda no mesmo cupom. Diferença de preço é paga pelo cliente em dinheiro ou cartão. Aplicável apenas em loja física.

**Devolução de produto agendado para retirada (clique e retire).** Cliente comprou online e optou por retirar em loja, mas desistiu antes da retirada. O subfluxo é simplificado: cancelamento direto, sem necessidade de logística reversa (produto nem saiu para o cliente). Estorno em até 2 faturas (cartão) ou 5 dias úteis (PIX/boleto). Diego marca o pedido como `cancelar_antes_retirada` para evitar movimentação desnecessária da mercadoria.

**Devolução por defeito grave que demande perícia.** Em casos onde o defeito alegado pelo cliente é grave (incêndio em eletrodoméstico, falha que causou dano a outro bem do cliente, problema de segurança), o ticket é escalado diretamente para o Jurídico antes da decisão de devolução. Não é desvio operacional — é proteção institucional para apuração técnica isenta antes de aceitar ou recusar.

**Devolução vinculada a chargeback de cartão.** Quando o cliente abre chargeback junto à adquirente Cielo (em paralelo ou em substituição ao chamado Apex), o ticket entra em fluxo especial conduzido pelo Financeiro. Diego registra o chamado normalmente, mas a resolução depende do desfecho do chargeback — que pode levar 30 a 90 dias. O cliente é mantido informado em intervalos quinzenais.

---

## Página 6 — Fluxo de devolução B2B

### 6.1 Diferenças estruturais B2C vs B2B

A operação B2B segue lógica distinta da B2C. O cliente pessoa jurídica é presumido conhecedor do que comprou — não há "direito de arrependimento" análogo ao CDC art. 49. As bases legais e operacionais são outras. A tabela abaixo consolida as principais diferenças que Diego e Marina precisam ter em mente.

| Aspecto | B2C (consumidor final) | B2B (cliente PJ) |
|---|---|---|
| Base legal principal | CDC (Lei 8.078/1990) | Código Civil + contrato firmado |
| Direito de arrependimento (Art. 49) | Sim — 7 dias corridos | Não se aplica |
| Devolução por defeito | Sim — Art. 18 CDC | Sim — contratual + vício redibitório CC |
| Custo do frete reverso | Sempre Apex | Negociado em contrato (defeito = Apex; divergência = a definir) |
| Aprovador padrão de chamado | Diego (Tier 1) | Marina (Tier 2) |
| Comunicação preferencial | App, WhatsApp pessoal | Portal B2B, e-mail comercial |
| Tempo médio de resolução | 5-7 dias | 7-12 dias |

A escalação direta para Marina em casos B2B reflete o valor médio do ticket: pedidos B2B raramente são inferiores a R$ 5.000, e o impacto operacional de uma devolução mal conduzida é proporcional. Diego acompanha o ticket, mas a decisão formal cabe a Marina.

### 6.2 Procedimento — pedido B2B com divergência

**Passo 1 — Conferência no recebimento.** O lojista (no caso de franquias e multimarcas Apex Moda, escritórios Apex Casa, restaurantes Apex Mercado B2B, ou empresas Apex Tech) confere o romaneio contra a carga em até 24h após a chegada. Divergência identificada nesse prazo gera ticket com prioridade `Medium` e abertura formal no portal B2B.

Divergência identificada APÓS 24h tem viabilidade reduzida — considera-se aceite tácito do pedido, exceto em casos de defeito oculto que só se manifesta com manuseio (vício redibitório).

**Passo 2 — Abertura formal.** O lojista envia foto + lista detalhada da divergência via portal B2B ou WhatsApp comercial dedicado. Marina recebe o ticket diretamente. O sistema vincula automaticamente o pedido B2B original e o romaneio assinado na entrega.

**Passo 3 — Análise de causa.** Marina aciona o CD-Cajamar para verificar o romaneio original arquivado e o registro de conferência feito na separação. Em caso confirmado de erro de separação (cenário recorrente como o TKT-7 — coleção inverno feminino com 30% de peças trocadas), reposição expressa é autorizada sem necessidade de análise adicional.

Em caso de divergência atribuível à transportadora (extravio em rota, avaria por manuseio inadequado), o seguro de carga é acionado em paralelo. O lojista não é prejudicado pela investigação de responsabilidade — Apex Logística absorve o custo inicial e processa o ressarcimento posteriormente.

**Passo 4 — Reposição expressa.** A mercadoria correta é separada com prioridade e despachada via cross-docking (operação que pula a etapa de armazenagem padrão e vai direto para a doca de saída). SLA da reposição expressa: 48h úteis entre a aprovação da exceção e a saída do CD.

A mercadoria incorreta retorna ao CD na próxima coleta de rota regular, sem ônus para o lojista. Não há cobrança de frete adicional.

**Passo 5 — Faturamento corrigido.** O Financeiro emite nota fiscal de devolução simbólica (CFOP 1.202 — entrada de mercadoria devolvida) e nova nota fiscal de venda (CFOP 5.102 — saída de mercadoria) com os itens corretos. O crédito do lojista no Apex permanece intacto, e o ciclo financeiro não é interrompido. Operacionalmente, o fluxo de NF-e está documentado em `runbook_sap_fi_integracao.pdf`.

### 6.3 Casos especiais B2B

**Coleção com erro de modelagem do fornecedor (TKT-2 âncora).** Quando o erro vem do fornecedor original (modelagem real divergente da ficha técnica), a Apex absorve o custo em primeira instância — frente ao lojista, somos responsáveis solidariamente (CDC art. 18, princípio também aplicado por boa prática contratual em B2B). Posteriormente, Compras aplica chargeback contra o fornecedor.

**Erro de separação no CD (TKT-7 âncora).** Além da reposição expressa, o lojista recebe crédito de 2% sobre o valor do pedido como compensação operacional pela operação extra que precisou conduzir. O valor é creditado em conta corrente comercial e pode ser usado em pedidos futuros.

**Pedido com embalagem secundária inadequada.** Análise caso-a-caso por Marina. Se a embalagem inadequada gerou avaria nas peças internas, configura-se defeito de transporte e o seguro de carga absorve. Se a embalagem está apenas esteticamente comprometida mas o produto interno está OK, troca da embalagem com cortesia mediante envio de nova caixa pelo CD.

### 6.4 Devolução B2B em pedidos com financiamento ou leasing

Pedidos B2B podem ser estruturados com financiamento (BNDES, FINAME, linhas próprias dos bancos) ou leasing operacional. Nesse cenário, a devolução envolve não apenas Apex e o cliente, mas também a instituição financeira contratada. O fluxo é mais complexo:

1. Lojista solicita devolução conforme regra padrão B2B
2. Marina aciona o time Financeiro Corporativo para verificar status do contrato de financiamento — se já houve liberação de recursos ao Apex, o cancelamento envolve estorno do banco
3. Em caso de pedido em fase de proposta (sem liberação), o cancelamento é simples — Apex emite cancelamento da operação, e o banco não desembolsa
4. Em caso de pedido já liberado e financiado, o cancelamento envolve devolução de recursos ao banco, com prazos contratuais específicos (geralmente 10 a 20 dias úteis)
5. O lojista recebe orientação detalhada por escrito de cada etapa, com timeline e responsáveis nominais (Marina + Financeiro Corporativo + gestor de relacionamento bancário)

Em pedidos de leasing operacional, a devolução é ainda mais sensível porque o bem está sob propriedade jurídica da arrendadora (banco), não do lojista. A Apex coordena com a arrendadora para reposição ou substituição do bem, e o lojista permanece adimplente com o leasing durante o processo.

### 6.5 Contrato corporativo e SLA diferenciado

Clientes B2B com contrato corporativo ativo (faturamento anual ≥ R$ 500.000) têm SLA diferenciado que prevalece sobre o SLA padrão deste FAQ. Marina mantém matriz de SLA por cliente, consultável no HelpSphere em campo `sla_contratual`. Os principais clientes com SLA diferenciado têm tratamento prioritário:

- Tempo de resposta inicial reduzido de 2h para 30 minutos
- Reposição expressa habilitada como padrão (não exige aprovação caso-a-caso)
- Gestor de conta nomeado (não passa pelo Tier 1 padrão)
- Reuniões mensais de business review com Lia

Diego identifica clientes com SLA diferenciado pelo flag `cliente_premium=true` no cadastro do HelpSphere e segue o roteiro específico vinculado ao flag.

---

## Página 7 — Exceções CDC e política comercial flexível

### 7.1 Quando o CDC não obriga, mas a Apex concede

A Apex Group adota política comercial flexível como diferencial competitivo. Em casos fora do prazo legal de 7 dias (CDC art. 49), a empresa pode conceder devolução por desistência mediante avaliação caso-a-caso. Essa avaliação não é discricionária — segue critérios documentados e observados por Marina e Lia.

Os quatro critérios principais são:

**Tempo desde a compra.** Até 15 dias após o vencimento do prazo legal (total de 22 dias do recebimento), a aprovação tende a ser concedida com mais facilidade. Acima desse marco, a análise é mais rigorosa e geralmente requer aprovação direta de Lia.

**Histórico do cliente.** Clientes com NPS positivo nos últimos 12 meses (média ≥ 8 nas pesquisas de satisfação) recebem tratamento prioritário. O sistema HelpSphere exibe automaticamente o NPS médio do cliente ao abrir o ticket, e Diego utiliza esse dado como input da decisão (ou da escalação a Marina).

**Estado do produto.** Produto não usado, lacrado, com acessórios completos e nota fiscal disponível é critério facilitador. Produto com sinais leves de manuseio (lacre rompido mas sem uso evidente) ainda é viável, com análise de Marina. Produto com uso prolongado evidente raramente é aceito fora do prazo legal.

**Custo de oportunidade.** Produto com alta rotatividade no canal de venda (revende rápido após retorno a estoque) facilita aprovação porque o prejuízo financeiro da operação de retorno é minimizado. Produto de baixa rotatividade ou descontinuado torna a aprovação menos viável.

### 7.2 TKT-1 — caso âncora (geladeira fora do prazo CDC)

**Cenário:** Cliente comprou geladeira Brastemp BRM69 na Apex Tech em 12/03 e abriu chamado em 25/03 (13 dias após a compra, portanto 6 dias após o vencimento do prazo CDC art. 49). Solicitou devolução por desistência alegando que o tamanho da geladeira não cabia confortavelmente na cozinha após receber.

**Análise estruturada (Diego):**

1. CDC art. 49 não obriga — prazo de 7 dias expirou em 19/03
2. Produto consta como não usado, lacrado, com nota fiscal e acessórios completos
3. Cliente Apex Tech ativo há 4 anos, com 11 compras anteriores e NPS médio 9,2
4. Geladeira Brastemp BRM69 tem alta liquidez no e-commerce — estoque baixo na região São Paulo, fila de pedidos em aberto

**Decisão (Marina, Tier 2):** Devolução aprovada como `cortesia_comercial`, com registro de autorização e justificativa. Produto retorna ao estoque para revenda. Cliente recebe estorno integral do valor pago (R$ 3.247) em até 2 faturas do cartão de crédito utilizado na compra original.

**Comunicação ao cliente:** Diego entra em contato via WhatsApp informando a aprovação, agenda coleta para o dia seguinte pela transportadora parceira (geladeira > 30kg não usa Correios) e confirma o início do processo de estorno.

**Lição operacional aplicada:** Sempre que o valor do produto for superior a R$ 2.000 E o cliente tiver NPS ≥ 8, Diego deve escalar diretamente para Marina sem aguardar uma negativa preliminar. Esse fluxo direto reduz fricção, melhora o NPS na resolução e elimina ciclos desnecessários de mensagens.

### 7.3 TKT-10 — caso âncora (cancelamento após 28h)

**Cenário:** Cliente Apex Tech comprou Smart TV 65" parcelada em 12x via cartão Itaú pelo app. Solicitou cancelamento da compra 28h após a transação, alegando que não havia notado o detalhamento do parcelamento e que o impacto mensal era maior do que o orçamento permitia.

**Análise (Diego):**

1. CDC art. 49 obriga — a solicitação foi feita dentro do prazo de 7 dias corridos do recebimento (no caso, dentro do prazo da compra ainda)
2. Política interna prevê cancelamento simples até 24h após a compra, sem necessidade de escalação — após 24h, o caso requer Marina
3. Status do pedido: a TV ainda não havia saído do CD-Cajamar — não houve frete contratado, custo logístico zero

**Decisão (Marina):** Cancelamento aprovado integralmente. A operação financeira foi conduzida pelo cartão de crédito (Itaú), com estorno do parcelamento e cancelamento da compra junto à Cielo. Cliente foi comunicado em menos de 1h após a abertura do chamado, agradeceu pela resolução rápida e manteve relacionamento positivo com a marca.

**Reforço operacional após o caso:** Diego e os demais Tier 1 da equipe Apex Tech receberam treinamento adicional: pedidos cancelados antes da saída do CD entram em fila prioritária. O sistema marca o pedido com flag `cancelar_antes_expedicao` no WMS, e o operador de expedição não procede com a separação. Isso evita custo de frete ida-e-volta desnecessário e melhora o NPS na resolução.

### 7.4 Quando a Apex nega a exceção

Nem todo caso fora do prazo CDC é aprovado. Há quatro padrões em que a negativa é o resultado padrão, documentados como base de decisão para que Diego saiba quando NÃO escalar (a negativa é própria do Tier 1):

- Produto usado com sinais evidentes de manuseio prolongado — desgaste, marcas, riscos, alterações de configuração
- Pedido com indícios de fraude — revenda profissional, padrão de uso repetido de devolução em múltiplas compras
- Cliente com histórico de mais de 5 devoluções nos últimos 12 meses (sinal de abuso da política comercial)
- Mercadoria sob medida ou personalizada — o CDC art. 49 expressamente exclui produtos BTO, e a política comercial Apex respeita esse limite

A negativa é sempre formalizada por escrito, com a justificativa específica, via e-mail ou WhatsApp. O cliente recebe orientação sobre como recorrer (escalação a Marina via portal de relacionamento) caso entenda que a negativa foi indevida.

---

## Página 8 — Garantias estendidas (Apex Tech + Apex Casa)

### 8.1 Estrutura do produto Apex Garantia

A Apex oferece garantia estendida própria, comercializada sob a marca "Apex Garantia", aplicável às marcas Apex Tech (eletrônicos e linha branca) e Apex Casa (móveis modulados e estofados). A oferta é regulada pela SUSEP e processada por seguradora parceira (contrato confidencial), com cobertura adicional ao prazo de fábrica.

| Categoria | Cobertura adicional | Valor (% sobre produto) | Prazo total combinado |
|---|---|---|---|
| Linha branca (geladeira, lava-roupas, fogão, lava-louça) | 24 meses além da fábrica | 8,5% | Até 36 meses |
| Smart TVs e monitores | 12 meses além da fábrica | 6,2% | Até 24 meses |
| Smartphones e tablets | 12 meses além da fábrica | 9,8% | Até 24 meses |
| Sofás retráteis e camas box | 24 meses além da fábrica | 7,3% | Até 36 meses |
| Móveis modulados (cozinha, dormitório) | 24 meses além da fábrica | 6,5% | Até 36 meses |

O percentual sobre o valor do produto reflete a sinistralidade média de cada categoria, calibrada anualmente pela atuária da seguradora. Smartphones têm o maior percentual (9,8%) por terem maior incidência de defeitos de tela e bateria, eventos mais frequentes que defeitos de linha branca.

### 8.2 O que está incluído

A cobertura inclui quatro elementos principais:

- Reparo técnico em assistência autorizada, com rede credenciada em todas as capitais brasileiras e em 47 cidades regionais. Para produtos acima de R$ 1.500, há atendimento em domicílio sem custo adicional ao cliente.
- Substituição da peça defeituosa por componente original do fabricante, com garantia da peça nova
- Mão de obra do técnico autorizado, sem custo
- Coleta e devolução pós-reparo quando necessário (apenas produtos até 25kg em embalagem original — eletrodomésticos grandes são atendidos em domicílio)

### 8.3 O que NÃO está incluído

A cobertura é técnica, não estética. Não estão cobertos:

- Dano por uso inadequado — queda, contato com líquido, oxidação, dano elétrico por instabilidade de rede sem estabilizador
- Dano por instalação fora do padrão técnico recomendado — uso de tomada inadequada, voltagem incorreta, ambiente úmido sem proteção
- Reparo de itens estéticos — riscos, manchas, desgaste natural do tecido, descoloração por exposição solar
- Peças de consumo regular — filtros, baterias removíveis, lâmpadas internas, controle remoto perdido

Em caso de sinistro, a assistência autorizada emite laudo técnico identificando a causa. Se a causa for excludente, o cliente é notificado e pode optar por: (a) reparo pago pelo próprio cliente em assistência autorizada, ou (b) declinar e receber o produto de volta sem reparo.

### 8.4 TKT-4 — caso âncora (extensão de garantia em sofá retrátil)

**Cenário:** Cliente Apex Casa comprou sofá retrátil em 09/2025, com garantia de fábrica de 1 ano. Em 04/2026 (7 meses após a compra), solicitou contratação de extensão de garantia adicional de 2 anos, com dúvidas específicas sobre valor, cobertura do mecanismo retrátil e prazo de carência.

**Análise (Diego):**

1. Verificou contrato base: garantia de fábrica vigente até 08/2026 (sem sobreposição com a extensão a contratar)
2. Confirmou produto elegível para Apex Garantia categoria "Sofás retráteis e camas box" — cobertura adicional 24 meses
3. Cotou o valor: 7,3% sobre R$ 3.847 (preço original do sofá no momento da compra) = **R$ 280,83**, parcelável em 6x sem juros
4. Confirmou que a cobertura inclui o mecanismo retrátil (acionamento elétrico ou manual, dependendo do modelo — para o modelo deste cliente, retrátil manual com sistema de molas)
5. Carência padrão de 60 dias após a contratação · não há carência para defeitos manifestados ANTES da contratação (estes são cobertos pela garantia de fábrica vigente, não pela extensão)

**Comunicação ao cliente:** Diego envia proposta formal via app + termo digital para assinatura eletrônica. O termo detalha cobertura, exclusões, carência e procedimento em caso de sinistro. Cliente fecha a contratação em 24h, e o contrato é vinculado ao CPF e ao número de série do sofá no sistema.

### 8.5 Carência e ressalvas legais

A carência padrão é de 60 dias corridos a contar da data de assinatura do termo. Isso significa que defeitos manifestados nos primeiros 60 dias não acionam a garantia estendida — caem sob garantia de fábrica vigente ou são considerados defeitos preexistentes, conforme análise técnica.

Defeitos preexistentes (presentes no produto antes da contratação) não são cobertos pela extensão. O cliente declara ciência desse ponto no termo digital, e a Apex pode solicitar laudo técnico independente em caso de litígio.

O cancelamento da garantia estendida segue o CDC art. 49: 7 dias corridos da contratação, com restituição integral. Após o prazo de 7 dias, o cancelamento ainda é possível, com restituição proporcional ao período não utilizado, descontando taxa administrativa de R$ 89 (fixa, prevista no termo digital).

### 8.6 Acionamento da garantia estendida — procedimento

O cliente aciona a garantia estendida por três canais: WhatsApp do programa Apex Garantia (número dedicado), app Apex+ (menu "Minha Garantia") ou pelo SAC tradicional. O fluxo de acionamento é distinto do fluxo de devolução padrão e segue 5 passos:

**Passo 1 — Identificação do contrato.** Diego (ou o atendente especializado do programa) consulta o número de série do produto + CPF do cliente para localizar o contrato de garantia estendida ativo. Em caso de contrato vencido ou inexistente, o cliente é orientado conforme a garantia legal aplicável.

**Passo 2 — Triagem do problema.** O atendente coleta descrição detalhada do defeito, fotos ou vídeo quando aplicável, e tenta solução de primeira linha (reset, atualização de firmware, orientação técnica básica). Aproximadamente 35% dos acionamentos são resolvidos nessa etapa sem necessidade de visita técnica — o que melhora o NPS e reduz o custo operacional.

**Passo 3 — Agendamento de visita ou coleta.** Para defeitos que demandam intervenção física, o agendamento é feito com a rede credenciada de assistência. Para produtos ≥ R$ 1.500, há atendimento em domicílio. Para produtos menores, coleta + reparo em centro técnico + devolução, sem custo ao cliente.

**Passo 4 — Reparo ou substituição.** A assistência autorizada conduz o diagnóstico técnico. Em casos de defeito coberto, reparo é executado com peças originais e cobertura integral. Em casos onde o reparo é inviável (peça descontinuada, custo de reparo > 60% do valor do produto novo), há substituição por unidade equivalente.

**Passo 5 — Devolução ao cliente e encerramento.** Produto reparado é devolvido ao cliente, e o ticket é encerrado mediante confirmação de funcionamento normal por 24h. O contrato de garantia estendida permanece ativo pelo período restante.

### 8.7 Reembolso integral em casos extremos

Em casos onde o produto é considerado perda total (defeito grave irreparável, descontinuação total da linha sem substituto compatível, dano em transporte durante coleta para reparo), a Apex Garantia oferece reembolso integral do valor original pago pelo produto, atualizado pelo IPCA. O cliente recebe o valor em até 10 dias úteis na conta indicada e tem direito a manter o produto defeituoso (sem custo adicional) ou descartá-lo conforme orientação técnica.

Essa cláusula de "ressarcimento integral em caso de perda total" é considerada diferencial competitivo da Apex Garantia frente a programas concorrentes do mercado — a maioria dos programas oferece apenas substituição por produto similar ou reembolso depreciado. A política Apex paga valor cheio atualizado.

### 8.8 Transferência da garantia estendida

A garantia estendida é transferível por uma única vez durante o prazo de vigência. O cenário típico é venda do produto pelo cliente original a um segundo proprietário. A transferência exige:

- Solicitação formal via app ou WhatsApp do programa
- Identificação do segundo proprietário (CPF, nome completo, endereço)
- Foto da nota fiscal de venda entre os dois proprietários (ou termo de transferência simples assinado pelas duas partes)
- Pagamento de taxa administrativa de R$ 47 (cobre a atualização contratual e validação)

Após a transferência, o novo proprietário passa a ser o titular da garantia para todos os efeitos, e o contrato segue até o final do prazo originalmente contratado. Não há renovação automática — após o vencimento, o cliente pode contratar nova extensão (sujeita à elegibilidade do produto, que pode estar descontinuado ou fora de cobertura no momento da renovação).

---

## Página 9 — Troca por defeito vs troca por desistência

### 9.1 Distinção operacional fundamental

A confusão mais frequente em chamados de devolução é entre dois conceitos legalmente distintos: troca por desistência (CDC art. 49) e troca por defeito (CDC art. 18). Diego precisa ter clareza absoluta dessa distinção, porque o tratamento operacional é diferente em vários aspectos.

| Característica | Troca por desistência (Art. 49) | Troca por defeito (Art. 18) |
|---|---|---|
| Onde se aplica | Compras fora do estabelecimento (e-commerce, app, telefone) | Qualquer canal, qualquer produto |
| Prazo legal | 7 dias corridos do recebimento | 30 dias (não-durável) ou 90 dias (durável) |
| Motivo necessário | Nenhum — direito potestativo | Vício de qualidade ou quantidade |
| Quem arca com frete reverso | Fornecedor (Apex) | Fornecedor (Apex) — Art. 18, §1º |
| Estado do produto exigido | Não usado, lacrado, com acessórios | Pode estar em uso (defeito não é culpa do consumidor) |
| Prazo de reparo | Não aplicável | 30 dias para reparo · após, troca ou devolução do valor |

A distinção é crítica porque um cliente pode invocar Art. 18 (defeito) para tentar contornar a impossibilidade do Art. 49 (compra presencial fora do prazo de 30 dias da política comercial Apex Moda, por exemplo). Diego deve identificar a real natureza da reclamação — se há defeito comprovável, opera por Art. 18; se não há defeito, a desistência segue regras próprias.

### 9.2 Fluxograma de decisão aplicado por Diego

```
Cliente solicita troca → produto tem defeito comprovado?

  SIM → Aplica CDC Art. 18
    → Qualquer canal de compra, qualquer prazo dentro de 30/90 dias da decadência
    → 30 dias para reparo pela assistência
    → Não resolveu o defeito? → cliente escolhe: troca · devolução · abatimento

  NÃO → Compra foi presencial (loja física)?

    SIM → Aplica política comercial Apex (varia por marca)
      → Apex Moda: 30 dias para troca por tamanho/desistência
      → Apex Tech: 7 dias para troca (excepcional, política comercial)
      → Outras marcas: ver páginas 3-4

    NÃO (e-commerce, app, telefone) → Aplica CDC Art. 49
      → 7 dias corridos do recebimento
      → Fora do prazo? → escalação Marina (política comercial flexível)
```

### 9.3 Casos limítrofes recorrentes

**Cliente alega defeito após usar 25 dias o produto.** A primeira ação de Diego é solicitar laudo técnico de assistência autorizada. Se o laudo confirma defeito de fábrica, opera pelo Art. 18 e inicia processo de reparo (30 dias para sanar). Se o laudo aponta mau uso (queda, líquido, oxidação por descuido), a recusa é formalizada com base no parecer técnico anexado ao ticket. O cliente recebe cópia do laudo se solicitar.

**Cliente comprou em loja física e quer trocar online.** Aplica-se a política da loja física, e o canal de troca pode ser qualquer um (loja, app, transportadora). O Art. 49 NÃO se aplica porque a compra foi presencial — esse ponto é frequentemente questionado pelo cliente e Diego deve explicar com clareza, sem rispidez. O direito existe, mas decorre da política comercial Apex, não do CDC.

**Cliente troca produto por outro de valor menor.** A Apex emite vale-troca com saldo positivo correspondente à diferença, válido por 12 meses a partir da emissão. Não há restituição em dinheiro nesse cenário — a política comercial é explicitada no termo de compra e no cupom fiscal. O cliente pode usar o vale-troca em qualquer marca Apex Group, em loja física ou em canal digital.

**Cliente alega defeito no produto presenteado.** A garantia segue o CPF de quem foi presenteado (não o do comprador original), e o presenteado pode acionar a garantia diretamente com a Apex sem necessidade de envolvimento do comprador. Esse fluxo é especialmente relevante na época de Natal e Dia dos Pais, com pico operacional documentado pelo time de Lia.

**Cliente exige troca em loja diferente da compra.** A política Apex Group é loja-agnóstica: qualquer loja da mesma marca atende a troca, independentemente de onde a compra original foi realizada. A operadora de caixa identifica o cupom original via CPF do cliente e processa a troca conforme política vigente. Para trocas entre marcas diferentes (cliente comprou na Apex Tech e quer trocar em loja Apex Casa), a operação não é viável — cada marca opera com gestão de estoque e categoria distinta.

**Cliente alega ter recebido produto descontinuado em troca de outro descontinuado.** Caso raro mas recorrente em coleções de moda. A política é: se o produto entregue na troca apresenta defeito ou divergência, Marina avalia caso-a-caso. Pode haver vale-presente integral pelo valor original, escolha de outro produto disponível em estoque ou estorno em dinheiro como exceção comercial.

**Cliente solicita troca de produto comprado em promoção relâmpago.** Promoções relâmpago (descontos > 40% por janelas curtas) seguem a política de liquidação descrita na seção 4.1 para Apex Moda e regras análogas para Apex Tech (eletrônicos com 50% off só trocam por mesma faixa de desconto). A regra é informada no checkout e impressa no cupom fiscal e no e-mail de confirmação.

### 9.4 Documentação obrigatória de defeito

Para abertura de chamado por Art. 18, Diego solicita cinco informações ao cliente:

1. Cupom fiscal ou número do pedido
2. Foto ou vídeo do defeito quando o problema for observável (item visual)
3. Descrição detalhada do problema com sintomas e condições — Diego transcreve no campo `descricao_defeito` do HelpSphere
4. Endereço completo para coleta, se a logística reversa for via transportadora
5. Janela de disponibilidade do cliente: turno manhã (08h-12h), turno tarde (12h-18h) ou comercial (08h-18h)

Após o registro, Diego confirma número do protocolo, SLA esperado de coleta (até 5 dias úteis) e SLA esperado de retorno (30 dias para reparo, conforme Art. 18, §1º).

---

## Página 10 — Erros de etiquetagem, modelagem e responsabilidade do fornecedor

### 10.1 Cenário TKT-2 — camisa polo M com modelagem reduzida

**Descrição completa:** Pedido #ML-7821 originado em marketplace externo, integrado com a plataforma própria Apex Moda via ApexLink. Cliente comprou camisa polo masculina tamanho M da coleção verão 2026. Ao receber a peça, identificou que a etiqueta declarava tamanho M mas a modelagem efetiva correspondia ao tamanho P. Solicitou troca por outro tamanho ou estorno integral.

**Análise estruturada (Diego):**

A primeira ação foi identificar o item no sistema e localizar o lote de produção: fornecedor terceiro da coleção verão 2026 (lote LT-2026-V-0847). A segunda ação foi consultar o histórico de chamados similares — verificação interna apontou 23 outros chamados similares na semana, todos referentes ao mesmo lote. O padrão é claro: erro sistêmico do fornecedor, não caso isolado.

A terceira ação foi confirmação técnica via comparação entre ficha técnica enviada pelo fornecedor e mostruário recebido pelo time de Compras. A divergência foi documentada: ficha técnica declarava medidas padrão de tamanho M (largura do tronco 52cm), mas a peça efetiva tinha 49cm — mais próximo de P (47cm) que de M.

**Conclusão operacional:** o cliente não arca com nenhum custo. Trata-se de erro do fornecedor, e a responsabilidade Apex é solidária (CDC art. 18 — toda a cadeia responde frente ao consumidor). O ressarcimento contra o fornecedor é tratado posteriormente, em fluxo separado entre Compras e Financeiro, sem afetar o tempo de resposta ao cliente.

### 10.2 Procedimento aplicado ao TKT-2

1. Troca expressa autorizada por Diego (alçada até R$ 500 — preço da peça era R$ 187)
2. Camisa em tamanho efetivamente compatível com a expectativa do cliente foi enviada via PAC Mini, com custo arcado pela Apex
3. Peça incorreta retorna ao CD-Cajamar pela doca reversa, com etiqueta de identificação do chamado
4. Lote LT-2026-V-0847 foi marcado em quarentena no WMS — todas as peças remanescentes do lote ficaram bloqueadas para venda enquanto Compras conduz a auditoria
5. Compras acionou o fornecedor para débito (chargeback) e refaturamento do lote correto, com prazo contratual de 5 dias úteis para resposta

### 10.3 Cadeia de responsabilidade no varejo Apex

A tabela abaixo resume quem responde em cada cenário típico. Diego usa essa tabela como referência rápida para encaminhar adequadamente o chamado e evitar conflito interno.

| Responsável | Quando | Cobertura |
|---|---|---|
| Apex (primeira instância) | Sempre frente ao consumidor — CDC art. 18 é solidário | 100% do prejuízo direto do cliente |
| Fornecedor original | Quando o vício é de fabricação ou rotulagem | Chargeback contra o fornecedor + crédito em conta corrente comercial |
| Transportadora | Avaria identificada no transporte (caso TKT-22) | Seguro de carga acionado · NF de avaria emitida |
| CD-Cajamar | Erro de separação (caso TKT-7) | Custo absorvido pela operação · KPI de acurácia monitorado por Marina |
| Cliente (raro) | Mau uso comprovado por laudo técnico | Cliente arca com reparo, sem direito a estorno |

### 10.4 Compras + Qualidade — workflow de quarentena de lote

Quando três ou mais chamados do mesmo lote ou SKU são abertos em até 7 dias com motivo idêntico, o sistema dispara alerta automático para o time de Compras via e-mail (`compras@apex.local`). A sequência de tratamento é padronizada:

1. Compras revisa amostra do lote no CD-Cajamar — pega 10% das unidades remanescentes para inspeção
2. Confirma se o erro é sistêmico do fornecedor (presente em ≥ 50% da amostra) ou pontual (presente em < 10% da amostra)
3. Em caso sistêmico, o lote inteiro entra em quarentena no WMS — não está disponível para venda nem para reposição de loja
4. Comunicação formal ao fornecedor com prazo contratual de 5 dias úteis para posicionamento
5. Decisão final em conjunto com Lia: (a) aceite de chargeback + refaturamento do lote com itens corretos, ou (b) troca do lote inteiro + crédito comercial por danos operacionais à Apex

Essa medida tem dois efeitos: evita a propagação de chamados de cliente (paralelos, custosos, com risco de NPS negativo) e protege a marca afetada de erosão reputacional, especialmente em redes sociais. Marina monitora o tempo médio entre o disparo do alerta e a quarentena efetiva — meta institucional: 4h úteis.

---

## Página 11 — Casos especiais: avarias, peças trocadas e erro de preço

### 11.1 TKT-7 — peças trocadas na separação (Apex Moda)

**Cenário completo:** A loja Iguatemi da Apex Moda recebeu a caixa C-1247 da coleção inverno feminino, identificando que 30% das peças não correspondiam ao romaneio assinado na separação. As blusas vieram em tamanho P quando o pedido especificava M e G. A próxima campanha da loja Iguatemi começava em 5 dias, e a falta dessas peças comprometeria a montagem da vitrine.

**Análise estruturada (Marina, com apoio do CD-Cajamar):**

A causa foi identificada via revisão do romaneio original e cruzamento com o registro de conferência feito durante a separação no turno da tarde do dia 14/04. O conferente daquele turno apresentou histórico de erro de 2,3% nas últimas 4 semanas — acima da meta institucional de 0,8% para conferência de pedido B2B.

A coleção inverno feminino tem janela curta de venda (8 semanas no máximo). O atraso da campanha de uma loja-âncora como a Iguatemi (uma das 5 lojas Apex Moda de maior faturamento no estado) impactaria GMV estimado em R$ 38.470 no fim de semana da inauguração. O lojista da franquia é parceiro com 8 anos de relacionamento e histórico positivo.

**Decisão de Marina:**

1. Reposição expressa autorizada — separação prioritária no CD com conferência dupla supervisionada, e cross-docking em 48h
2. As peças incorretas (tamanhos P) retornam ao CD-Cajamar na coleta da próxima rota regular de Apex Logística (3 dias depois)
3. Crédito comercial de 2% sobre o valor do pedido (R$ 38.470, gerando crédito de R$ 769) lançado em conta corrente comercial da loja Iguatemi como compensação operacional
4. CD-Cajamar conduziu treinamento de turno com o conferente envolvido + reforço de conferência dupla obrigatória por 30 dias em todos os pedidos B2B do turno da tarde
5. Lia recebe relatório semanal de acurácia de separação por turno até estabilização do indicador abaixo de 1%

**SLA atendido:** A próxima campanha da loja Iguatemi inaugurou com a coleção correta em 4 dias úteis após a abertura do ticket — 1 dia dentro do prazo crítico estabelecido pelo lojista.

### 11.2 TKT-22 — Smart TVs avariadas no recebimento (Apex Tech)

**Cenário completo:** Lote de 24 Smart TVs Samsung QLED 75" recebido pelo CD-Cajamar. A paletização estava correta, mas 3 unidades apresentavam a tampa de proteção de canto amassada — aparente avaria de transporte. A embalagem secundária ainda estava íntegra, sugerindo que a tela interna pudesse estar preservada, mas não havia como ter certeza sem teste funcional.

**Análise integrada (Marina + Comercial + TI):**

O Comercial pediu que TI rastreasse o histórico de manuseio do palete via tag RFID. O rastreio identificou que o palete sofreu impacto na transferência entre a doca de recebimento e a doca de embarque interno no timestamp 11/04 às 09h47. A empilhadeira identificada foi a #EMP-04, operada por motorista terceirizado durante um turno de cobertura (operador titular em férias).

A embalagem secundária íntegra é boa notícia operacional — significa que o impacto absorvido pelas camadas externas pode ter preservado as telas. Para ter certeza, foi necessária conferência funcional unidade-a-unidade por técnico Apex Tech autorizado antes de liberar as 3 unidades para venda.

**Decisão de Marina:**

1. As 3 unidades vão para conferência funcional · custo R$ 95 por unidade (R$ 285 total)
2. Caso as telas estejam aprovadas no teste, voltam ao estoque com etiqueta de inspeção `INSP-OK` — vendáveis em condição normal
3. Caso reprovadas, é emitida nota fiscal de avaria, o seguro de carga é acionado e o fornecedor original (Samsung Brasil) é notificado para reposição contratual

**Aprendizado institucional:** rastreio RFID de palete é mandatório em produtos eletrônicos de alto valor unitário. Bruno (CTO) aprovou em Q3-2026 o roadmap de implementação de RFID em 100% dos paletes com valor superior a R$ 50.000, com prazo de rollout até Q1-2027. A medida deve reduzir em 60% o tempo de identificação de responsabilidade em casos análogos.

### 11.3 TKT-19 — impressora térmica de etiquetas desalinhada (Apex Casa)

**Cenário completo:** A impressora térmica Zebra ZD230 do CD-Cajamar passou a imprimir etiquetas com offset de 3mm para a direita. O ajuste manual do sensor de gap não resolveu, sugerindo problema mecânico mais profundo. Etiquetas desalinhadas estavam sendo descartadas, com custo médio de R$ 0,08 por etiqueta — desprezível como custo direto, mas o fluxo operacional estava atrapalhado.

**Conexão crítica com este FAQ:** etiquetas desalinhadas geram leitura errada nos scanners de saída na conferência de expedição. Isso pode causar três problemas em cascata, todos com impacto em devolução:

- Erro de baixa de estoque no WMS — o SKU lido pelo scanner não bate com o SKU efetivo, gerando divergência de inventário
- NF-e com item incorreto — o cliente recebe um produto diferente do que está faturado na nota, configurando divergência de pedido (motivo `divergencia_pedido` na lista controlada)
- Aumento de chamados de devolução por divergência — efeito direto do anterior, com impacto em SLA e em NPS

**Procedimento aplicado:**

1. Operação suspendeu uso da ZD230 até a calibração técnica completa pelo fornecedor autorizado
2. As etiquetas com `INSP-OK` foram impressas em impressora reserva (modelo equivalente, capacidade de 80% da titular)
3. Pedidos do dia foram conferidos em dupla — scanner + visual por conferente — overhead operacional temporário aceitável dada a criticidade
4. Manutenção técnica realizada em 48h: rolete de tração substituído (peça desgastada após 2 anos de uso intensivo) e calibração de sensor refeita

O caso foi documentado como aprendizado: impressoras críticas devem ter manutenção preventiva agendada a cada 18 meses, antes do desgaste manifestar como falha operacional.

### 11.4 Erro de preço — CDC art. 30 (referência TKT-6)

**Cenário:** Notebook Lenovo IdeaPad foi anunciado por R$ 199 no site da Apex Tech às 14h por erro de cadastro no CMS (vírgula deslocada no campo de preço). O erro foi identificado às 15h30 — 90 minutos no ar. Nesse intervalo, 47 pedidos foram efetivados. O preço correto era R$ 1.999.

**Análise jurídica + comercial integrada:**

O CDC art. 30 estabelece que a oferta veiculada é vinculante, ou seja, obriga o fornecedor a cumprir nos termos anunciados. No entanto, a jurisprudência brasileira (STJ — REsp 1.794.991/SE e outros) é consolidada no sentido de que erro material evidente não constitui oferta válida. A diferença de 10x entre R$ 199 e R$ 1.999 caracteriza esse erro evidente — não há interpretação razoável em que o cliente acredite genuinamente que um notebook custaria R$ 199.

A posição institucional da Apex, no entanto, é mais generosa: política comercial flexível concede honra parcial para mitigar dano de imagem e evitar agregação de ações judiciais individuais, que somariam custo maior que o prejuízo direto da operação.

**Decisão (Lia + Carla, CFO):**

1. Os 47 pedidos efetivados serão honrados — o produto é entregue pelo valor pago, e a perda absorvida pelo grupo é de aproximadamente R$ 84.600 (47 unidades × R$ 1.800 de diferença unitária)
2. Comunicação formal pública: anúncio retirado imediatamente · loja online suspendeu cadastro de qualquer SKU com desvio de preço superior a 50% para revisão manual obrigatória durante 72h
3. Treinamento obrigatório do time de CMS · checklist de aprovação dupla implementado para todos os preços abaixo de R$ 500
4. Política institucional definida para casos futuros: erros até 1x o valor (faixa R$ 100-200 sobre preço R$ 200-400) seguem o mesmo critério de honra. Acima dessa faixa, análise caso-a-caso é feita por Lia, ponderando: número de pedidos efetivados, exposição em redes sociais, jurisprudência específica

**Justificativa institucional registrada:** o custo de honrar 47 pedidos (R$ 84.600) é inferior ao custo reputacional acumulado de ações judiciais agregadas + dano de imagem em redes sociais, que Carla estimou em R$ 230.000 em mídia espontânea negativa caso a empresa cancelasse os pedidos. A decisão de honrar é, portanto, financeiramente sólida — não apenas eticamente justificada.

---

## Página 12 — Anexos, escalação e footer

### 12.1 Apêndice A — Lista controlada de motivos de devolução

Diego sempre seleciona um motivo da lista abaixo ao registrar uma devolução no HelpSphere v2.2.0. O campo `motivo_devolucao` é obrigatório, e a lista é fechada (sem campo livre) exceto pela opção `outros`, que exige descrição complementar.

| Código | Descrição operacional |
|---|---|
| `arrep_cdc_49` | Arrependimento dentro do prazo CDC art. 49 (7 dias corridos do recebimento) |
| `arrep_fora_prazo` | Arrependimento fora do prazo legal — análise por política comercial Apex |
| `defeito_fabrica` | Vício de qualidade ou quantidade — CDC art. 18 — qualquer canal de compra |
| `defeito_transporte` | Avaria durante o transporte (transportadora ou rota interna) |
| `divergencia_pedido` | Item recebido diferente do pedido (NF correta, mas mercadoria errada) |
| `modelagem_incorreta` | Tamanho ou modelagem divergente da ficha técnica do fornecedor (Apex Moda) |
| `peca_trocada_cd` | Erro de separação no CD-Cajamar (B2B principalmente) |
| `erro_preco_cms` | Erro de cadastro de preço — CDC art. 30 |
| `garantia_estendida` | Acionamento de garantia estendida Apex |
| `cortesia_comercial` | Devolução concedida fora dos casos acima — registrar autorizador obrigatoriamente |
| `outros` | Casos não enquadrados — descrição obrigatória em campo livre |

O preenchimento correto desse campo é auditado mensalmente por Marina. Padrões anômalos (excesso de `cortesia_comercial` em um único Tier 1, por exemplo) disparam revisão de caso.

### 12.2 Apêndice B — Modelos de comunicação ao cliente

A comunicação segue padrão institucional para preservar a marca e evitar ambiguidades. Diego adapta o conteúdo entre colchetes, mas mantém a estrutura.

**Modelo 1 — Aprovação de devolução:**

> Olá, [nome]. Seu pedido **[número]** foi aprovado para devolução. Vamos gerar a etiqueta de retorno em até 4h úteis e enviar pelo canal de sua preferência (e-mail e WhatsApp). O estorno será efetuado em até 5 dias úteis após a chegada do produto ao nosso centro de distribuição. Em caso de pagamento por cartão de crédito, o estorno aparece em até 2 faturas, conforme regra da adquirente. Em caso de pagamento por PIX ou boleto, o depósito é feito em conta indicada por você. Equipe Apex.

**Modelo 2 — Negativa fundamentada:**

> Olá, [nome]. Após análise do seu pedido **[número]**, identificamos que a solicitação não se enquadra nos critérios de devolução vigentes ([motivo específico, redigido em uma frase clara]). Caso você queira maior orientação sobre o motivo da negativa ou queira recorrer da decisão, ficamos à disposição pelo canal de relacionamento — basta responder a esta mensagem. Equipe Apex.

**Modelo 3 — Solicitação de documentação complementar:**

> Olá, [nome]. Para dar seguimento à sua solicitação de devolução do pedido **[número]**, precisamos de algumas informações: [lista específica do que falta — foto, NF, descrição detalhada do defeito, endereço de coleta]. Você pode enviar pelo aplicativo ou aqui pelo WhatsApp. Após o recebimento, prosseguiremos em até 24h úteis. Equipe Apex.

### 12.3 Apêndice C — Escalação Tier 2 (Marina) e Head (Lia)

A escalação obedece à tabela abaixo. Diego nunca deve "segurar" um caso que excede sua alçada — a escalação rápida é parte da política institucional e melhora o NPS final do atendimento.

| Cenário | Quem chamar | Canal preferencial | SLA esperado |
|---|---|---|---|
| Devolução R$ 501 – R$ 5.000 fora prazo CDC | Marina | HelpSphere com menção `@Marina` | 2h úteis |
| Devolução acima de R$ 5.000 | Lia (cópia Marina) | HelpSphere com menção `@Lia` | 4h úteis |
| Casos com mídia ou imprensa envolvida | Lia + Comunicação Corporativa | E-mail direto + escalação imediata | 4h úteis |
| Erros de preço (CDC art. 30) com volume > 10 pedidos | Lia + Carla (CFO) | Reunião dedicada agendada em até 4h | 24h úteis |
| Suspeita de fraude (padrão repetido de devoluções) | Marina + Jurídico | E-mail direto + flag no HelpSphere | 8h úteis |
| Devolução B2B com cliente VIP (faturamento anual > R$ 50.000) | Lia diretamente | Telefone celular institucional | 30 minutos |

A escalação por telefone para Lia é reservada para casos verdadeiramente críticos — cliente VIP, mídia, valor acima de R$ 50.000 ou risco de exposição pública. Para esses casos, o número direto está cadastrado no HelpSphere, mas apenas Marina e os outros Tier 2 têm acesso.

Em casos noturnos ou fora de horário comercial, o canal de plantão é o WhatsApp institucional do Tier 2, com cobertura 24/7 via escala rotativa. Lia é acionada por SMS apenas em casos de fraude em curso, vazamento de dados ou exposição pública iminente. A política de plantão é descrita em detalhe no `faq_horario_atendimento.pdf`, seção 4.3.

### 12.4 Cross-references com outros PDFs

Este FAQ não cobre todos os aspectos da relação com cliente. Para temas conexos, consultar:

- `manual_operacao_loja_v3.pdf` — procedimentos operacionais de loja, recebimento de retorno em loja física, processo de doca reversa do ponto de vista do operador
- `politica_reembolso_lojista.pdf` — reembolso financeiro a lojista B2B, fluxo contábil de NF de devolução, tratamento de avaria de transporte do ponto de vista financeiro
- `runbook_sap_fi_integracao.pdf` — emissão de NF de devolução simbólica (CFOP 1.202) e refaturamento (CFOP 5.102) no ERP TOTVS integrado com SAP FI
- `faq_horario_atendimento.pdf` — janelas operacionais para abertura de chamado, SLAs por canal, escalações para urgência fora de horário

### 12.5 Indicadores institucionais monitorados

A operação de pedidos e devoluções é monitorada por sete indicadores principais, revisados semanalmente por Marina e mensalmente por Lia. O dashboard de acompanhamento é compartilhado com Bruno (CTO) e Carla (CFO) trimestralmente.

| Indicador | Meta institucional | Frequência de revisão |
|---|---|---|
| FCR (First Contact Resolution) | ≥ 78% | Mensal por marca/turno |
| Tempo médio de resolução B2C | ≤ 5 dias úteis | Mensal por marca |
| Tempo médio de resolução B2B | ≤ 10 dias úteis | Mensal por categoria |
| Taxa de cortesia comercial | ≤ 4% dos chamados | Mensal por Tier 1 |
| NPS pós-devolução | ≥ 7,5 | Mensal por marca |
| Taxa de reincidência (cliente devolve novamente em 90 dias) | ≤ 3% | Trimestral |
| Custo médio de devolução por chamado | ≤ R$ 87 | Mensal por marca |

Desvios sustentados (≥ 2 meses consecutivos fora da meta) disparam plano de ação corretiva conduzido por Marina. Em caso de desvio crítico (≥ 15% abaixo da meta), Lia conduz revisão estrutural com participação de Bruno e Carla.

### 12.6 Footer

**Versão:** Q2-2026 · revisão semestral
**Próxima revisão programada:** Q4-2026
**Classificação:** Documento confidencial — uso interno Apex Group
**Aprovado por:** Lia (Head de Atendimento) · Bruno (CTO) · Carla (CFO)
**Dúvidas sobre interpretação ou casos não contemplados:** `politica-comercial@apex.local`

Em caso de divergência entre este FAQ e jurisprudência superveniente ou alteração legislativa (alteração do CDC, decisão vinculante do STJ), prevalece a interpretação mais favorável ao cliente, conforme princípio do CDC. Atualização extraordinária é processada por Lia com apoio do Jurídico.

---

*Apex Group · FAQ Pedidos e Devoluções · v4 · Q2-2026*
