---
title: "Manual de Operação de Loja Apex Group · v3"
subtitle: "Procedimentos operacionais consolidados — recebimento, estocagem, exposição, picking, expedição, atendimento, performance"
version: "v3 · Q2-2026 · próxima revisão Q2-2027"
classification: "Confidencial — uso interno Apex Group"
audience: "Gerentes de loja · Supervisores · Coordenadores CD · Auditoria interna · HelpSphere Tier 1/2/3"
---

# Manual de Operação de Loja Apex Group — v3

**Documento mestre operacional** da holding Apex Group. Aplica-se às 340 lojas físicas distribuídas entre as 12 marcas declaradas, ao CD-Cajamar (matriz logística) e aos 6 CDs regionais. Substitui integralmente a versão v2 (Q2-2025).

Aprovação executiva: **Lia** (Head de Atendimento), **Bruno** (CTO) e **Carla** (CFO). Curadoria editorial Q2-2026. Revisão técnica em curso pelos coordenadores de CD-Cajamar e gerentes regionais.

---

## CAPÍTULO 1 — Visão geral operacional

### 1.1 Apex Group operacional

A holding Apex Group opera 12 marcas declaradas no mercado brasileiro, das quais 5 compõem o conjunto seed operacional principal: **Apex Mercado** (supermercado e perecíveis), **Apex Tech** (eletrônicos e linha branca), **Apex Moda** (fashion sazonal), **Apex Casa** (móveis e decoração) e **Apex Logística** (operação B2B intra-grupo). As 7 marcas restantes — ApexFashion, ApexHogar, ApexBabe, ApexFood, ApexSports, ApexBeauty e ApexFarma — operam dentro do mesmo arcabouço descrito neste manual, com extensões verticais documentadas em manuais complementares de cada marca.

O parque de lojas físicas conta com **340 unidades**, distribuídas geograficamente entre 14 estados brasileiros, com forte concentração no eixo Sudeste (62% das unidades) e no Sul (18%). O quadro de colaboradores soma **8.000 pessoas**, das quais 6.300 alocadas em lojas físicas, 1.100 em centros de distribuição e 600 em suporte corporativo. O faturamento Q1-2026 anualizado projeta R$ 4.8B, com a operação física respondendo por 71% e o e-commerce + marketplaces pelos 29% restantes.

A espinha logística é o **CD-Cajamar**, com 47.000 m² de área coberta, 12 docas operacionais (8 secas, 2 refrigeradas, 2 congeladas) e capacidade de processar 18.000 paletes por mês em ritmo nominal. O CD-Cajamar suporta as 4 marcas B2C principais (Apex Mercado, Apex Tech, Apex Moda, Apex Casa), enquanto a Apex Logística mantém uma estrutura própria de cross-docking adjacente. Os 6 CDs regionais (Curitiba, Porto Alegre, Recife, Salvador, Belo Horizonte e Goiânia) operam como hubs de fracionamento, recebendo cargas consolidadas do CD-Cajamar e redistribuindo para as lojas de bairro e clientes B2B regionais.

A capacidade nominal de processamento se distribui por turno: turno A (06h-14h) processa cerca de 7.200 paletes/mês, turno B (14h-22h) processa 8.400 paletes/mês, turno C (operação noturna 22h-06h) processa 2.400 paletes/mês com equipe reduzida para serviços de reposição interna, separação de pedidos B2B madrugadeiros e manutenção de equipamentos. Picos sazonais (Black Friday, Natal, datas comerciais de Apex Moda) podem elevar o volume agregado para 24.000-26.000 paletes/mês, sustentado por turno extra contratado em regime de horas extras controladas pela CCT do varejo paulista.

A estrutura de operação contempla quatro perfis técnicos distintos dentro do CD-Cajamar: operador de doca (manuseia entrada/saída de cargas em equipamento manual ou paleteira elétrica), operador de empilhadeira (acessa reserve em níveis 03-08, certificação NR-11 obrigatória), conferente (executa contagem cega ou com romaneio em fluxos críticos) e coordenador de turno (decisão operacional em alçada até R$ 100.000 conforme tabela do capítulo 2). O quadro total no CD-Cajamar soma 287 colaboradores diretos + 94 terceirizados especializados (limpeza zona G, manutenção predial, segurança patrimonial).

A relação entre o CD-Cajamar e os CDs regionais segue o modelo *hub-and-spoke*: 78% do volume das marcas B2C passa pelo CD-Cajamar antes de ser fracionado regionalmente, e 22% é encaminhado diretamente da fábrica do fornecedor para o CD regional quando o destino geográfico é mais próximo (drop-shipping homologado). O fluxo direto fornecedor→CD regional só é autorizado para fornecedores classe A (volume >R$ 12M/ano com Apex Group) com aderência a SLAs contratuais auditados trimestralmente.

Este manual está marcado como `versão v3 · Q2-2026`, com revisão anual prevista para Q2-2027. Alterações de procedimento entre revisões anuais são distribuídas via comunicado operacional numerado (COP-AAAA-NN) e consolidadas na próxima versão major.

### 1.2 Estrutura organizacional típica de loja

Toda loja Apex Group, independentemente da marca, observa a estrutura organizacional descrita na tabela abaixo. Variações de tamanho e responsabilidade são absorvidas pelo porte da unidade — anchor stores de shopping (45 a 65 colaboradores), lojas de rua de centro urbano (18 a 28) e lojas de bairro (8 a 14) — mas a hierarquia formal e as alçadas decisórias permanecem idênticas.

| Papel | Responsabilidade primária | Alçada decisória (R$) | Reporta a |
|---|---|---|---|
| Gerente de loja | P&L da unidade · agenda comercial · pessoas | R$ 5.000 | Gerente regional |
| Supervisor de turno | Operação do turno · atendimento · caixa · escala | R$ 1.500 | Gerente de loja |
| Líder de setor | Execução técnica · planograma · ruptura · perdas | Autoridade técnica (sem alçada R$) | Supervisor de turno |
| Atendente · vendedor · repositor · fiscal de prevenção | Execução operacional na linha de frente | Sem alçada formal | Líder de setor |

A alçada decisória de cada papel se aplica a decisões financeiras imediatas tomadas em piso de loja — devolução por arrependimento, cortesia comercial, ajuste de preço, reembolso de despesa do cliente. Decisões acima da alçada do gerente de loja são escaladas formalmente via HelpSphere para **Marina** (Tier 2 corporativo · alçada R$ 25.000), e acima dessa para **Lia** (Head de Atendimento · alçada R$ 100.000). Decisões financeiras acima de R$ 100.000 envolvem **Carla** (CFO), e decisões estruturais de infraestrutura tecnológica envolvem **Bruno** (CTO).

O fiscal de prevenção de perdas opera sem uniforme, com cobertura aleatória de loja, e responde funcionalmente ao supervisor da loja, mas hierarquicamente à área corporativa de Prevenção de Perdas. Esta dupla linha existe propositadamente para garantir independência investigativa em casos de furto interno. O fiscal de prevenção tem autoridade para abordar suspeitos em flagrante delito (com discrição), acionar a Polícia Militar quando necessário e registrar boletim de ocorrência em nome da loja, sempre seguindo protocolo de privacidade do CFTV LGPD-compliant (referência cruzada `politica_dados_lgpd.pdf` seção 6.2).

A escala-base de uma loja de bairro típica (8 a 14 colaboradores) opera com turnos sobrepostos para garantir cobertura entre 08h e 22h em dias úteis. Turno matinal (07h-15h) cobre abertura, reposição matinal e fluxo de almoço; turno vespertino (12h-20h) cobre o pico do final do expediente comercial; turno noturno (15h-23h) cobre fechamento e ronda final. Em sábados, a escala é geralmente de 09h-19h sem turno noturno, e em domingos (quando a loja abre) opera turno único 11h-19h. A loja anchor de shopping segue calendário do empreendimento, tipicamente 10h-22h sete dias por semana, com 3 turnos sobrepostos e equipe maior.

Substituições e ausências são geridas pelo supervisor de turno via app interno Apex+Pessoas, que integra ao eSocial em tempo real os eventos de afastamento (S-2230), retorno (S-2231) e mudança de função (S-2206). Substituições não-comunicadas configuram falta injustificada e disparam advertência conforme política interna de RH em alinhamento à CLT.

### 1.2.1 Quadro de papéis estendido (lojas de grande porte)

Em lojas anchor de shopping (45 a 65 colaboradores), a estrutura organizacional é ampliada com papéis adicionais que reforçam categorias específicas:

| Papel adicional | Função | Lojas com este papel |
|---|---|---|
| Coordenador de vitrines | Implementação de planograma e visual merchandising | Apex Moda anchor · Apex Casa anchor |
| Atendente VIP (linha Premium) | Atendimento dedicado a clientes Apex+ Premium | Anchors |
| Especialista de produto | Conhecimento técnico aprofundado (linha branca, eletrônica, móveis) | Apex Tech · Apex Casa |
| Caixa supervisor | Coordenação de 4-6 caixas em operação simultânea | Anchors de alto volume |
| Fiscal de prevenção sênior | Cobertura permanente (vs rota rotativa) | Anchors com volume >R$ 8M/mês |
| Personal shopper | Atendimento sob agendamento · clientes corporativos | Apex Moda · Apex Casa anchors específicas |
| Repositor turno noturno | Reposição madrugadeira sem perturbar fluxo diurno | Apex Mercado 24/7 |
| Operador de caixa Apex+ | Caixa exclusivo para clientes Apex+ Premium (linha rápida) | Anchors de alto fluxo |

Cada papel adicional tem perfil de competência específico e treinamento direcionado de 16h a 40h adicionais no onboarding. Anchors recebem auditoria adicional do gerente regional bimensalmente, dada a complexidade operacional.

### 1.2.2 Organograma do CD-Cajamar

| Nível | Papel | Headcount típico | Alçada |
|---|---|---|---|
| 1 | Diretor de Operações Logísticas | 1 | R$ 1.000.000 |
| 2 | Coordenador-Geral CD-Cajamar | 1 | R$ 300.000 |
| 3 | Coordenador de Turno (A, B, C) | 3 | R$ 100.000 |
| 4 | Supervisor de Doca | 4 (1 por turno + 1 plantão) | R$ 25.000 |
| 4 | Supervisor de Estocagem | 3 (1 por turno) | R$ 25.000 |
| 4 | Supervisor de Expedição | 3 (1 por turno) | R$ 25.000 |
| 4 | Líder de Manutenção | 2 (1 turno + 1 plantão) | R$ 15.000 |
| 5 | Operador Sênior (4-eyes principle) | 12 | R$ 5.000 |
| 5 | Operador (doca + estocagem + expedição) | 240 | R$ 1.000 |
| 5 | Conferente especializado | 24 (cold chain + crítico) | R$ 1.000 |
| 5 | Brigadista | 36 (12 por turno) | — |
| 6 | Operador de empilhadeira (NR-11) | 48 | — |
| — | Terceirizados (limpeza, segurança, manutenção predial) | 94 | — |

Total CD-Cajamar: 287 diretos + 94 terceirizados = 381 colaboradores. Operação 24/6 (Seg-Sáb) + plantão emergencial domingos.

### 1.3 KPIs operacionais consolidados

Toda loja Apex Group é avaliada mensalmente contra um conjunto fixo de seis KPIs operacionais primários, descritos na tabela a seguir. Métricas adicionais são acompanhadas em painel secundário, mas as decisões executivas mensais consideram este conjunto reduzido.

| KPI | Meta | Frequência | Responsável | Cálculo |
|---|---|---|---|---|
| NPS loja física | ≥ 72 | Mensal | Gerente | Pesquisa pós-compra em PDV · escala 0-10 |
| Conversão pisada→checkout | ≥ 18% | Semanal | Supervisor | Contagem de portaria ÷ transações com NFC-e |
| Ticket médio | Varia por marca | Diário | Supervisor | Faturamento ÷ transações |
| Ruptura de gôndola | ≤ 2.5% | Diário | Líder | SKUs em ruptura ÷ SKUs ativos · ronda 14h e 19h |
| Perda operacional | ≤ 0.8% do faturamento mensal | Mensal | Gerente | Quebra + furto + erro de baixa · sobre receita bruta |
| Aderência ao planograma | ≥ 95% | Quinzenal | Líder | Auditoria visual + foto-auditoria corporativa |

NPS abaixo de 65 dispara plano de ação automático em 30 dias, com acompanhamento semanal do gerente regional. Perda operacional acima de 1.2% em dois meses consecutivos aciona auditoria forense corporativa coordenada por Prevenção de Perdas — referência cruzada com `politica_reembolso_lojista.pdf` (seção 4, alçadas financeiras de cortesia) e com o capítulo 8 deste manual (auditoria interna trimestral).

O ticket médio varia por marca: Apex Mercado opera tipicamente R$ 92 (B2C) e R$ 4.180 (B2B), Apex Tech R$ 1.470 (B2C) e R$ 8.940 (B2B), Apex Moda R$ 248 (B2C — pouco B2B), Apex Casa R$ 1.870 (B2C) e R$ 47.300 (B2B em escritórios corporativos). Os valores médios de ticket são revisados trimestralmente e podem ser ajustados após mudanças de mix de portfólio.

NPS pós-venda — diferenciado do NPS de loja física — é acompanhado para devoluções, montagens, visitas técnicas e atendimento. Esse indicador é cruzado com `faq_pedidos_devolucao.pdf` (seção 2, fluxo padrão de pós-venda) e atualizado mensalmente no painel da gerência regional.

A apuração de **ruptura de gôndola** combina três fontes: contagem manual diária (líder percorre corredor a corredor antes da abertura, identificando SKUs com prateleira vazia ou abaixo de 50% da capacidade), foto-auditoria via app (líder fotografa SKUs críticos da semana e sistema interno aplica visão computacional sobre as imagens) e cruzamento com vendas perdidas (sistema detecta tentativas de compra de SKUs sem estoque via pesquisa no PDV e em quiosques interativos). O cálculo final = (SKUs em ruptura ÷ SKUs ativos do mix) × 100. O denominador é "SKUs ativos do mix", não o total cadastrado — SKUs sazonais fora de estação ou descontinuados são automaticamente excluídos.

A **perda operacional** consolida quatro categorias contábeis: (1) quebra documentada (NF de quebra emitida com CFOP 5927 — vidros quebrados, produtos avariados em manuseio, alimentos vencidos); (2) furto interno identificado (apurado por Prevenção de Perdas após investigação); (3) furto externo identificado (apurado por CFTV ou flagrante); (4) perda não-identificada (diferença entre estoque contábil e físico após inventário cíclico, não atribuída às categorias 1-3). A categoria (4) é tipicamente a maior em valor absoluto e fonte da discussão analítica mensal — quando supera 0.4% do faturamento, dispara auditoria forense detalhada (referência cruzada com seção 8.2 deste manual).

O painel mensal de KPIs é distribuído como PDF assinado eletronicamente pelo gerente regional + planilha Excel com drill-down por dia/SKU/colaborador. Acesso ao painel granular (com dados individuais de colaboradores) requer crachá funcional + autenticação MFA, e o acesso é logado para fins de LGPD (referência `politica_dados_lgpd.pdf` seção 6.3 — dados de colaboradores tratados como categoria sensível).

---

### 1.3.1 KPIs secundários (acompanhamento mensal)

Além dos 10 KPIs primários listados na seção 1.3, o painel mensal inclui métricas secundárias:

| KPI | Meta | Frequência | Função |
|---|---|---|---|
| Taxa de abandono no PDV | ≤ 1.5% | Diária | Conversão final · qualidade do checkout |
| Taxa de uso de Apex+ | ≥ 62% | Semanal | Engajamento programa fidelidade |
| Ticket médio em PDV vs online | Relação 1:1.4 | Mensal | Mix entre canais |
| % devolução em loja | ≤ 4% | Mensal | Qualidade da venda + atendimento |
| % devolução com troca (vs estorno) | ≥ 68% | Mensal | Conversão de devolução em nova venda |
| Tempo médio de atendimento Tier 1 | ≤ 4 minutos | Diária | Eficiência do Diego |
| Tempo médio de fila no PDV (pico) | ≤ 8 minutos | Diária | Capacidade operacional |
| % de SKUs em promoção ativa | 8% a 14% | Quinzenal | Equilíbrio entre desconto e margem |
| Velocidade média de reposição matinal | ≤ 180 min | Diária | Eficiência operacional |
| Taxa de retorno do cliente (frequência) | ≥ 2.1 visitas/mês (Apex+) | Mensal | Fidelização |

### 1.3.2 Dashboard executivo Apex+ Painel

O Apex+ Painel é o sistema interno de visualização executiva, acessível via web e aplicativo, com 4 níveis de granularidade:

1. **Nível corporativo (CEO + Lia + Bruno + Carla):** consolidado das 12 marcas + 340 lojas + 7 CDs
2. **Nível marca (diretores e gerentes regionais):** consolidado por marca (5 painéis principais)
3. **Nível região (gerentes regionais):** consolidado por região geográfica (8 regiões)
4. **Nível loja (gerentes de loja):** dados granulares da própria unidade + comparativos vs peers

O painel atualiza em near-real-time (latência típica 90 segundos do dado original ao painel) para vendas, transações e operação do PDV. Métricas de inventário, perdas e auditoria são atualizadas em ciclo D+1 (após processamento overnight). KPIs financeiros (margem, receita líquida, custo operacional) são atualizados em ciclo M+5 (após fechamento contábil).

Drill-down completo permite ao gerente da loja chegar até o nível de transação individual (NFC-e específica, operador específico, SKU específico) em casos de investigação. Para fins de LGPD, dados sensíveis de cliente (CPF, endereço) são mascarados por padrão e o acesso requer justificativa registrada — cross-ref `politica_dados_lgpd.pdf` seção 6.

---

## CAPÍTULO 2 — Recebimento de mercadorias

### 2.1 Doca CD-Cajamar — janelas e cutoff

A doca do CD-Cajamar opera **segunda a sábado, das 06h às 22h**. Domingo e feriados nacionais somente recebem cargas em regime de emergência, mediante prévio agendamento aprovado pelo coordenador do CD com no mínimo 48h de antecedência. Cargas emergenciais de domingo incidem em sobretaxa contratual de 80% sobre o frete original.

A grade de janelas de doca foi desenhada em 8 blocos de 2h, conforme tabela:

| Janela | Capacidade simultânea | Observações |
|---|---|---|
| 06h-08h | 12 docas (8 secas, 2 ref, 2 cong) | Janela preferencial perecíveis |
| 08h-10h | 12 docas | Janela mais disputada · agendamento D-3 |
| 10h-12h | 12 docas | Janela com folga típica |
| 12h-14h | 10 docas | Pausa de almoço escalonada da operação |
| 14h-16h | 12 docas | Segunda janela perecíveis |
| 16h-18h | 12 docas | Última janela com cobertura total |
| 18h-20h | 10 docas | Turno reduzido (apenas 2 docas refrigeradas) |
| 20h-22h | 6 docas | Operação noturna com equipe parcial |

O **cutoff para remarcação sem custo é D-1 às 18h** — fornecedor que necessita alterar janela após esse horário paga taxa administrativa de R$ 280 por remarcação e pode perder a janela preferencial se não houver vaga equivalente. Cancelamento total no mesmo dia caracteriza no-show e incide em cobrança contratual de R$ 1.870 (cláusula 12.4 do contrato master de fornecedor).

O caso de referência **TKT-24** (Apex Casa, caminhão de móveis com agendamento 08h chegando às 12h) ilustra o fluxo de tratamento de atraso: o caminhão perdeu a janela 08h-10h, foi realocado para a primeira vaga disponível dentro do dia (12h-14h), e a operação subsequente do CD-Cajamar entrou em cascata de atraso. Custo estimado de hora-parada para operações em cascata: R$ 380. Cláusula contratual de demurrage incide a partir da segunda hora de atraso conforme detalhado na seção seguinte.

O agendamento de janela é executado pelo fornecedor via portal Apex+Fornecedor (web e mobile), com confirmação automática até D-2. Em caso de indisponibilidade da janela preferencial, o sistema sugere janelas alternativas dentro de uma faixa de ±4h. O sistema também antecipa risco de cascata: se uma janela já tem 3 cargas grandes (>20 paletes) confirmadas, a próxima carga grande recebe sinalização de "janela saturada — recomenda-se realocação", com a decisão final do fornecedor sobre aceitar ou reagendar.

Cargas que chegam ANTES da janela agendada são tratadas com priorização dinâmica: se houver doca livre dentro da faixa de até 90 minutos antes do horário previsto, a carga é desembarcada imediatamente (sem custo); se a faixa de antecipação for maior que 90 minutos, a carga aguarda em pátio de espera externo (capacidade 18 carretas), sem cobrança até o horário agendado. O pátio de espera tem banheiros, máquinas de café e WiFi gratuito para os motoristas — política Apex Group de boas condições de operação ANTT (lei do caminhoneiro), com revisão trimestral em conjunto com sindicato de transportadores.

### 2.2 Política de demurrage

A política de demurrage padrão Apex Group está descrita no anexo I do contrato master de fornecedor (versão Q1-2026) e prevê tolerância de 2 horas sobre o horário agendado. A partir da terceira hora começa a cobrança escalonada de R$ 380 por hora, que reflete o custo médio interno de hora-parada de doca (mão-de-obra + ocupação de espaço + impacto em cascata em janelas subsequentes).

| Faixa de atraso | Cobrança | Decisão de desembarque | Observação |
|---|---|---|---|
| 0h a 2h | Sem cobrança | Desembarque normal | Tolerância contratual |
| 2h a 4h | R$ 380/h | Desembarque normal | Cobrança em fatura mensal |
| 4h a 6h | R$ 380/h | Prioridade da doca cai | Outros pontuais passam à frente |
| Acima de 6h | R$ 380/h + recusa formal | Carga volta ao fornecedor | Sobretaxa de R$ 1.870 fixos |

A decisão de desembarcar carga atrasada em mais de 6h fica a critério do coordenador de CD-Cajamar e pondera natureza da carga (perecível com risco de cold chain rompido recebe recusa imediata), criticidade comercial do SKU (cargas para campanhas com data fixa podem receber exceção mediante aprovação de Marina) e relacionamento com o fornecedor (fornecedores classificados como "estratégicos" no painel de Vendor Management recebem tolerância adicional de 2h em até 2 ocorrências/ano).

Em **TKT-24**, com 4 horas de atraso, a cobrança de demurrage aplicável é de R$ 760 (2h × R$ 380), repassada ao fornecedor Tok&Stok via desconto em fatura. A operação subsequente do CD foi parcialmente prejudicada porque a doca destinada à Apex Casa às 08h ficou vazia até as 12h, mas pôde ser realocada para uma carga emergencial de Apex Tech que estava em fila externa. O coordenador do CD registrou o evento no relatório semanal de eficiência de doca.

A política de exceção a demurrage prevê suspensão da cobrança quando o atraso é justificado por evento extraordinário documentado: (a) acidente envolvendo o veículo, com BOletim de Ocorrência anexado; (b) bloqueio de rodovia oficial (informação ANTT ou DER); (c) operação policial federal/estadual com retenção do veículo; (d) falha mecânica grave com chamado de assistência registrado. Atrasos por congestionamento previsível em horário de pico ou por planejamento ruim do motorista NÃO são exceção. O coordenador do CD decide sobre a aplicação da exceção em até 24h após o evento, mediante apresentação dos documentos pelo fornecedor.

Fornecedores com mais de 3 ocorrências de demurrage em 12 meses entram em "regime de observação" da área de Vendor Management, com auditoria detalhada de operação logística e plano de ação obrigatório. Mais de 6 ocorrências em 12 meses configura advertência formal contratual; mais de 10 ocorrências pode levar à rescisão do contrato master ou à classificação "vendor restrito" (apenas operações com supervisão especial).

### 2.3 Cold chain — limites ANVISA

A Apex Group opera cadeia fria em conformidade com Resolução ANVISA RDC 216/2004 (e atualizações) e com normas internas mais restritivas em alguns itens. A tabela abaixo consolida os limites operacionais aplicáveis ao recebimento de mercadorias perecíveis.

| Tipo de produto | Limite legal | Tolerância Apex | Ação se excedido |
|---|---|---|---|
| Hortifruti folhoso (alface, rúcula, espinafre) | 8°C | 8°C (sem tolerância) | Recusa imediata + CAT no transportador |
| Hortifruti não-folhoso (tomate, cenoura, batata) | 12°C | 12°C | Recusa imediata |
| Laticínios refrigerados | 5°C | 5°C | Recusa imediata |
| Carnes resfriadas | 4°C | 4°C | Recusa imediata |
| Congelados | −18°C | −15°C pontual (registrado) | Avaliação técnica · acima de −15°C, recusa |
| Vacinas/imunobiológicos (Apex Farma) | 2°C a 8°C | Sem tolerância | Recusa imediata + comunicado ANVISA |

Todo caminhão refrigerado que adentra o CD-Cajamar deve transmitir o histórico do datalogger de bordo no momento do check-in. O datalogger registra temperatura interna do baú a cada 15 minutos durante o trânsito; valores acima do limite por mais de 30 minutos contínuos caracterizam violação de cold chain.

O caso **TKT-21** (caminhão refrigerado #PLK-2D47 com hortifruti folhoso registrando 14°C contra limite de 8°C) ilustra o procedimento de exceção. Carga de R$ 47.300 não pode ser aceita fiscalmente sob risco de responsabilização sanitária da Apex Group. As alternativas são:

1. **Recusa formal:** carga volta ao fornecedor; CAT (Comunicação de Acidente de Transporte) é emitida ao transportador; vigilância sanitária local pode ser notificada conforme natureza do produto. Custo da carga absorvido pelo fornecedor/transportadora conforme contrato.
2. **Recebimento para descarte controlado:** carga descarregada exclusivamente para destruição imediata sob supervisão da vigilância sanitária; NF de quebra emitida; comunicado interno à categoria comercial. Esta alternativa só se aplica quando há risco de contaminação cruzada se a carga voltar para o caminhão.

Em **TKT-21**, a decisão tomada foi a alternativa 1 (recusa formal), com CAT emitida ao transportador, vigilância sanitária notificada formalmente, e reposição expressa negociada com fornecedor alternativo para evitar ruptura nas lojas Apex Mercado de São Paulo capital.

Cargas de congelados com tolerância pontual de −15°C devem ter o evento documentado em formulário CT-FRIO (anexo III do procedimento de doca), incluindo foto do display do datalogger, duração da janela de exceção e SKU afetado.

A inspeção da cadeia fria não se limita ao registro do datalogger — inclui também inspeção visual do baú do caminhão (estanqueidade, isolamento térmico, motor de refrigeração operando), do estado físico da carga (presença de cristais de gelo no congelado indicando descongelamento parcial e re-congelamento, água no fundo da caixa de hortifruti indicando perda de temperatura prolongada) e da documentação fiscal de origem (verificação que a temperatura de embarque na origem foi conforme exigência). A inspeção é realizada por conferente especializado em cold chain, com certificação de 16h em "Boas Práticas no Transporte e Recebimento de Perecíveis" emitida pela Apex+Educação ou parceiro homologado (SENAI, SESC, instituições estaduais de vigilância sanitária).

A frota refrigerada própria Apex Logística (12 carretas) e os transportadores terceirizados homologados (28 empresas em rede ativa) seguem procedimento de check-in operacional duplo: temperatura registrada no momento da entrada no pátio do CD-Cajamar (medição com termômetro infravermelho de superfície calibrado) e temperatura registrada no momento da abertura do baú na doca (medição com termômetro de penetração em produto-piloto representativo). Divergência entre os dois pontos superior a 2°C dispara investigação operacional do veículo (possível falha no motor de refrigeração detectada apenas na abertura).

Validação dos datalogger é feita anualmente em laboratório acreditado pelo Inmetro, com certificado de calibração arquivado por 5 anos. Datalogger fora de validade de calibração é equiparado a "sem datalogger" para fins de aceitação da carga, e a carga é avaliada apenas por inspeção visual + medição manual no momento do recebimento.

### 2.4 Conferência cega vs com romaneio

Toda mercadoria recebida no CD-Cajamar passa por uma das duas modalidades de conferência: cega (padrão) ou com romaneio (exceção controlada).

**Conferência cega.** O operador de doca não tem acesso ao romaneio durante a contagem. O sistema WMS apresenta apenas o SKU e o slot de coleta na tela do RF-gun; o operador realiza a contagem física e digita o número no terminal. O sistema compara internamente com o esperado e bloqueia divergências acima da tolerância (0 unidades para lotes críticos, ±1 para lotes com mais de 20 SKUs). Esta modalidade é padrão para Apex Mercado e Apex Tech porque elimina viés cognitivo do operador (tendência inconsciente de "encontrar" o número esperado).

**Conferência com romaneio.** O operador vê a quantidade esperada na tela e realiza contagem comparativa. Utilizada exclusivamente para cargas críticas, cargas com lacre violado (procedimento de auditoria) ou cargas devolvidas onde a integridade do romaneio é a fonte primária de verdade. A conferência com romaneio é registrada no WMS com tag específica para fins de auditoria.

O procedimento numerado da conferência cega padrão é:

1. Operador de doca aciona a recepção da carga no WMS via RF-gun (leitura do código de barras do palete).
2. Sistema apresenta SKUs e slots para conferência, sem quantidades esperadas.
3. Operador conta unidades fisicamente e digita o número.
4. Em caso de divergência negativa (faltou), sistema solicita recontagem.
5. Após segunda contagem com divergência, sistema bloqueia o palete e aciona supervisor de doca.
6. Supervisor faz tercerização da contagem (4-eyes principle) e libera ou rejeita o palete.
7. Aprovação libera o palete para endereçamento no WMS.
8. Rejeição segue procedimento da seção 2.6 deste capítulo.

O tempo médio de conferência cega de palete padrão (até 80 unidades por palete) é de 6 minutos. Paletes com mais de 80 unidades ou com SKUs múltiplos (mix-pallet) tem tempo médio de 14 minutos. O operador segue uma sequência cognitiva padronizada (varredura visual da carga, identificação dos SKUs por embalagem, contagem em blocos de 10 unidades, agregação final), com pausas obrigatórias de 2 minutos a cada 3 paletes consecutivos para prevenir fadiga cognitiva. KPI individual do operador inclui a taxa de divergência média mensal — abaixo de 0.3% caracteriza desempenho excelente, entre 0.3% e 0.8% normal, e acima de 0.8% dispara monitoramento de 30 dias com auditoria 100% das conferências do operador.

Em cargas críticas (linha branca >R$ 5.000 unitário, eletrônicos sensíveis, produtos cosméticos importados), o procedimento adicional inclui foto individual do produto (com o número de série visível) antes do endereçamento. As fotos ficam vinculadas ao SSCC do palete e ao SKU específico no WMS, criando trilha de evidência para futuras disputas (defeito de fábrica, garantia, suspeita de troca). Operadores que cobrem categoria crítica recebem treinamento adicional de 4h em "Procedimento de Conferência de Cargas Críticas" no onboarding.

### 2.5 Auditoria de avaria

Todo palete recebido no CD-Cajamar passa por inspeção visual de embalagem antes da liberação para conferência de conteúdo. A inspeção classifica a integridade da embalagem em quatro níveis, conforme tabela.

| Avaria observada | Ação imediata | Evidência | Decisão final |
|---|---|---|---|
| Embalagem externa íntegra · interna íntegra | Aceita normal | Sem registro especial | Liberação WMS |
| Embalagem externa danificada · interna íntegra | Aceita com NF de avaria | Foto da embalagem externa | Liberação WMS · anotação |
| Embalagem externa danificada · interna comprometida | Rejeição parcial das SKUs | Foto interna + foto externa | Devolução parcial · CFOP 5202/6202 |
| Embalagem com sinais de violação (lacre rompido) | Rejeição imediata | Foto + termo de ocorrência | Acionar Prevenção de Perdas · F.O. se justificável |

O caso **TKT-22** (3 Smart TVs Samsung QLED 75" com tampa de palete amassada) exemplifica a faixa intermediária. As 21 unidades restantes do palete (24 total) foram aceitas normalmente, com embalagem secundária íntegra. As 3 unidades com avaria externa receberam tratamento de "aceita com NF de avaria" — embalagem interna individual de cada TV manteve-se íntegra, e a operação comercial decidiu pelo recebimento com monitoramento da integridade da tela nos primeiros 30 dias da garantia. O rastreio RFID do palete foi solicitado pelo time comercial para entender se o manuseio ocorreu na origem (transportadora Samsung) ou no trânsito.

Em casos de lacre rompido, o palete é congelado fisicamente em zona de segregação (zona Q do CD-Cajamar) e o coordenador de doca aciona imediatamente o líder de Prevenção de Perdas. Auditoria detalhada é conduzida em até 24h, com decisão de aceitar, rejeitar parcialmente ou rejeitar integralmente, dependendo do que for encontrado no exame interno.

O caso **TKT-27** (lote LX-789, 60 unidades iPhone 15 Pro com caixas externas íntegras mas todos os lacres internos violados, valor R$ 480k) é exemplo crítico que escalou para Polícia Federal e auditoria forense, dado o risco de receptação ou substituição por unidades adulteradas.

Quando a auditoria detecta SKUs com avaria recorrente do mesmo fornecedor (>2% das cargas em 3 meses consecutivos), o fornecedor entra em revisão obrigatória conduzida pelo time de Vendor Management + área de Operações. A revisão pode resultar em: (a) plano corretivo do fornecedor com acompanhamento mensal por 6 meses; (b) renegociação contratual com cláusula específica de SLA de embalagem; (c) descredenciamento e busca de fornecedor alternativo. Custos de avaria sistêmica são repassados ao fornecedor via cláusula contratual padrão de "ajuste de fatura por divergência operacional" (anexo VII do contrato master).

A documentação fotográfica da avaria é mantida em sistema interno (Apex+Imagens) com retenção de 5 anos, atendendo prazo decadencial fiscal (5 anos CTN art. 173). O acesso às imagens é restrito por crachá funcional e auditado conforme LGPD — referência cruzada com `politica_dados_lgpd.pdf` seção 6.2.

### 2.6 Rejeição parcial vs total

A decisão de rejeitar carga (parcial ou totalmente) tem alçada graduada conforme o valor financeiro envolvido. A tabela abaixo é a referência operacional:

| Alçada | Valor da rejeição | Procedimento mínimo |
|---|---|---|
| Operador de doca | Até R$ 5.000 | Registro no WMS · liberação automática |
| Supervisor de doca | R$ 5.001 a R$ 25.000 | Formulário CT-REJ + foto · aprovação no WMS |
| Coordenador CD-Cajamar | R$ 25.001 a R$ 100.000 | Formulário + foto + ata + e-mail comercial responsável |
| Diretor de operações | Acima de R$ 100.000 | Escalação imediata · Lia + jurídico · ata formal |

A NF de devolução é emitida com CFOP **5202** (devolução de compra dentro do estado) ou **6202** (interestadual). Quando a rejeição é parcial — apenas algumas SKUs do palete são devolvidas — emite-se NF de devolução parcial com referência cruzada à NF de compra original, e o restante da carga segue para endereçamento normal.

Procedimento numerado da rejeição parcial:

1. Operador identifica SKUs com problema (avaria, divergência, lacre).
2. Sistema WMS isola fisicamente esses SKUs em zona de segregação.
3. Operador (ou supervisor, conforme alçada) registra o motivo da rejeição.
4. Sistema gera NF de devolução parcial com CFOP correspondente.
5. SKUs rejeitados são reposicionados no caminhão do transportador.
6. Romaneio digital é atualizado e assinado pelo motorista.
7. Carga restante segue para conferência cega normal.
8. Coordenador comercial é notificado por e-mail no encerramento do turno.

### 2.7 Carga divergente (peças trocadas)

Cargas divergentes são casos em que os SKUs presentes na carga não correspondem ao romaneio acordado. A divergência mais comum é a troca por SKUs similares (mesma família de produto, atributos diferentes), tipicamente causada por erro na separação do CD origem.

O caso **TKT-7** (loja Iguatemi recebeu caixa C-1247 com 30% das peças da coleção inverno feminina não correspondendo ao romaneio — vieram blusas tamanho P quando o pedido era M e G) ilustra o cenário típico. Procedimento numerado:

1. **Congelar a caixa fisicamente** — peças NÃO são expostas. Caixa fica em estoque com tag de bloqueio.
2. **Registrar foto SKU × romaneio** — cada peça divergente é fotografada com a etiqueta visível e comparada com a linha correspondente do romaneio.
3. **Abrir chamado HelpSphere categoria Operacional** — descrição inclui número da caixa, fornecedor de origem (CD-Cajamar ou regional), SKUs esperados, SKUs recebidos, valor estimado da divergência.
4. **Negociar cross-docking expresso com origem** — Marina (Tier 2 corporativo) coordena reposição expressa quando a divergência impede campanha comercial dentro de prazo crítico (próxima campanha começa em ≤7 dias).
5. **Auditar separação no CD origem** — Prevenção de Perdas conduz auditoria retroativa do operador de separação responsável; treinamento mandatório para a turma da tarde se a causa-raiz for procedimental.

O KPI de divergência por carga é ≤0.5%. Cargas com divergência acima disso disparam alerta automático no painel do coordenador de CD. Acima de 1% em duas ocorrências mensais, o operador de separação envolvido entra em programa de monitoramento de qualidade por 30 dias com auditoria 100% (vs amostra padrão de 10%).

Referência cruzada com `faq_pedidos_devolucao.pdf` (seção 4.2 — divergência de pedido como motivo de devolução B2B).

A causa-raiz mais comum de cargas divergentes é a confusão visual entre SKUs do mesmo fornecedor com atributos similares — tipicamente cores próximas, tamanhos adjacentes, ou variações de coleção. A solução estrutural envolve três camadas: (1) Layout do CD origem com separação física entre SKUs visualmente similares (mínimo 2 corredores de distância no slot de picking); (2) Etiquetagem reforçada com código de cor adicional impresso na caixa interna (ex: cor verde para tamanho M, azul para G); (3) Conferência cega de saída no CD origem, com captura RFID dupla (fonte + destino) registrada em cadeia de custódia.

Quando a divergência atinge gravidade comercial (campanha em risco, lojista B2B com prazo crítico), a reposição expressa via cross-docking inverso é acionada: o CD-Cajamar separa imediatamente o lote correto e despacha em D+0 via transportadora premium (Loggi, Mottu Cargo, Tegma) com SLA de 24h para entrega na loja afetada. Custo dessa operação fica entre R$ 1.870 (rota intra-SP) e R$ 4.200 (rota interestadual), absorvido pelo CD origem como ônus operacional. Caso a causa-raiz seja procedimental (erro humano no operador de separação), o custo é refletido no KPI individual do operador.

### 2.8 Romaneio digital + RFID + tag de palete

O stack tecnológico de identificação de carga no CD-Cajamar é:

- **WMS Manhattan Associates Active WM 2024.1** — sistema central de gestão de armazém, com módulos de recebimento, endereçamento, picking, packing, expedição, inventário cíclico e reverse fulfillment. Upgrade da versão 2023.2 para 2024.1 ocorreu em Q1-2026 (postmortem do upgrade em **TKT-30**, com lentidão temporária resolvida via hotfix Manhattan).
- **RFID UHF Zebra FX9600** — leitores fixos em túnel de doca, capazes de ler até 200 tags simultaneamente em um palete. Frequência operacional 902-928 MHz (banda brasileira regulada pela Anatel).
- **Etiqueta de palete:** padrão **GS1-128 com SSCC** (Serial Shipping Container Code), código de barras escaneado em entrada e saída. Backup em Code 128 para fornecedores que ainda não adotaram GS1.

A tag RFID é obrigatória para:

| Categoria | Critério | Marca |
|---|---|---|
| Linha branca | Itens >R$ 800 unitário | Apex Tech |
| Perecíveis cold chain | Hortifruti, laticínios, congelados, carnes | Apex Mercado |
| Móveis e decor pesado | Itens >R$ 1.500 unitário | Apex Casa |
| Eletrônicos sensíveis | Smartphones, notebooks, tablets, smartwatches | Apex Tech |

A leitura no túnel de doca ocorre em ~1 segundo por palete. O KPI mensal de taxa de leitura RFID é ≥99,4% — abaixo disso, equipe de TI investiga ruído eletromagnético no túnel, posicionamento de antenas e estado físico das tags. Cross-ref `runbook_problemas_rede.pdf` (seção 3 — ruído eletromagnético em zona de leitura).

A etiqueta SSCC é gerada pelo fornecedor antes do embarque e enviada antecipadamente ao Apex Group via EDI (XML padrão GS1 EANCOM). No recebimento, o WMS compara o SSCC físico com o SSCC esperado, validando a integridade da identificação do palete antes mesmo da conferência de conteúdo.

Fornecedores que ainda não adotaram GS1-128 e EDI EANCOM (cerca de 12% do volume Apex Group, tipicamente pequenos fornecedores regionais) operam em regime de "etiquetagem assistida": o palete chega com Code 128 padrão Apex Group, e o operador de doca aplica manualmente a etiqueta SSCC + RFID no momento do recebimento. Esse fluxo é menos eficiente (adiciona 3-5 minutos por palete) e está sendo descontinuado progressivamente — o plano corporativo prevê 100% dos fornecedores em GS1-128 até Q4-2027, com migração suportada pelo programa Apex+Fornecedor Digital.

Quando há discrepância entre SSCC físico e SSCC esperado no recebimento (ex: caminhão trouxe palete com SSCC desconhecido, ou esperava um SSCC que não chegou), o WMS gera alerta crítico no painel do coordenador. As ações imediatas são: (a) congelar o palete fisicamente em zona Q; (b) consultar o fornecedor via Apex+Fornecedor para reconciliação; (c) inspecionar visualmente o conteúdo do palete contra romaneio papel (quando disponível) para verificar se a divergência é apenas na etiquetagem ou se há erro de carregamento na origem; (d) reportar à área de Operações se a discrepância persistir após 24h.

O ROI da migração para RFID + GS1-128 foi de 28 meses (cálculo de 2023 ao early 2025), com economia anual estimada de R$ 4.2M em redução de tempo de conferência, redução de erros operacionais e melhoria de rastreabilidade — base para expansão da exigência para a totalidade dos fornecedores classe A e B nos próximos contratos a renovar.

---

### 2.9 Procedimento de exceção — fornecedor de SKU em ruptura

Cenário comum: a loja está em ruptura iminente de SKU de alta rotação, e o pedido regular ao fornecedor estaria com prazo de entrega normal de 5-7 dias úteis. Procedimento de exceção:

1. Gerente da loja registra a ruptura iminente no sistema com alerta de prioridade alta.
2. Categórico do CD-Cajamar avalia disponibilidade em estoque CD-Cajamar e CDs regionais.
3. Se houver estoque, dispara cross-docking expresso conforme seção 6.1 deste manual.
4. Se não houver estoque, categórico aciona fornecedor com pedido emergencial.
5. Fornecedor confirma disponibilidade e prazo de entrega (típico: 24-48h para fornecedores classe A com estoque).
6. Categórico negocia condições: pode incluir frete expresso (R$ 800 a R$ 2.400 conforme volume), ou divisão de carga (caminhão dedicado vs consolidado), ou substituição de SKU (oferta alternativa de SKU similar com preço equivalente).
7. Aprovação financeira pela área de Operações + gerência regional.
8. Pedido emergencial é registrado no SAP MM com flag "emergencial" e prazo de entrega comprometido.
9. Recebimento prioritário no CD-Cajamar (janela alocada imediatamente, sem cobrança de demurrage).
10. Cross-docking direto fornecedor → loja, sem passagem por estocagem intermediária.
11. Loja recebe e repõe imediatamente, com comunicação ao cliente que reservou o SKU (se aplicável).
12. Pós-mortem: análise da causa da ruptura para ajuste do estoque-mínimo e revisão do replenishment automático.

Custo médio de operação de exceção: R$ 1.200 a R$ 4.700, dependendo do volume e da distância. Esses casos são monitorados pelo gerente regional, e mais de 3 ocorrências/mês na mesma loja disparam revisão estrutural do replenishment (parametrização do WMS, lead time do fornecedor, demanda real vs projetada).

### 2.10 Procedimento de carga sazonal (Black Friday, Natal)

Em datas comerciais de alto volume, a operação do CD-Cajamar passa por adaptações estruturais:

| Aspecto | Operação normal | Operação sazonal |
|---|---|---|
| Janelas de doca | 8 janelas de 2h (06h-22h) | 11 janelas de 2h (04h-02h) |
| Capacidade simultânea | 12 docas | 16 docas (uso de docas auxiliares externas) |
| Equipe operacional | 287 diretos | 387 (incl. 100 temporários CLT-Sazonal) |
| Turno C (noturno) | Equipe reduzida | Equipe normal (operação 24/6) |
| Estocagem temporária | Reserve padrão | Reserve + área de overflow externa |
| Tempo médio de processamento | 12 min/palete | 18 min/palete (devido ao volume) |
| Operação cross-docking | 35% volume | 65% volume (mais expressas) |

A operação sazonal começa 14 dias antes da data principal (Black Friday: meados de novembro; Natal: início de dezembro). O quadro de temporários CLT-Sazonal é contratado pelo RH Apex Group com 30 dias de antecedência, treinado em 8h específicas de operação CD, e desligado ao final do período (sem direito a estabilidade).

Em **2025 Black Friday**, o CD-Cajamar processou 38.000 paletes no mês de novembro (vs 22.000 média mensal), sem ocorrências críticas. Postmortem da operação 2025 destacou: (a) eficiência de cross-docking expresso em 92% das ocorrências; (b) tempo médio de doca em 14 min/palete (melhor que projetado); (c) zero ocorrência de acidente de trabalho; (d) custo operacional total de R$ 3.8M (R$ 100/palete) — alinhado ao planejamento.

### 2.11 Recebimento de devolução de cliente B2C via transportadora

Quando o cliente B2C envia devolução via transportadora (Loggi, Mercado Livre Logística, Correios), o procedimento de recebimento difere do recebimento de fornecedor:

1. Transportadora entrega caixa(s) na doca de devolução (zona DEV no CD-Cajamar).
2. Operador identifica o cliente pelo código de rastreio do pedido (vinculado ao app Apex+).
3. Operador abre a caixa e fotografa o conteúdo (preservação de evidência).
4. Conferente especializado em reverse executa triagem (cf. seção 7.1 e 7.2).
5. NF de entrada é emitida com CFOP 1202/2202 (devolução de venda).
6. Estorno é processado para o cliente (Cielo ou PIX) em até 7 dias úteis (CDC art. 49).
7. SKU é encaminhado para o destino correspondente (revenda, outlet, oficina, descarte).

Em casos onde o conteúdo da caixa diverge do pedido original (ex: cliente envia produto diferente, ou caixa vazia, ou produto adulterado/violado), o procedimento de fraude é acionado:

1. Operador isola fisicamente a caixa em zona DEV-FRAUD.
2. Análise documental (NF original, comprovante de pagamento, histórico do cliente).
3. Análise de CFTV do momento do despacho original (se possível identificar a embalagem).
4. Análise comportamental do cliente (histórico de devoluções, tickets HelpSphere).
5. Decisão final: aceitar a devolução com cautela, recusar a devolução com fundamentação documentada, ou escalar para investigação jurídica em casos graves.
6. Comunicação ao cliente com clareza e cordialidade, respeitando o devido processo CDC.

Tipos de fraude mais comuns identificados: (a) envio de produto diferente alegando defeito; (b) envio de caixa vazia ou com objeto sem valor; (c) reenvio do mesmo produto múltiplas vezes para múltiplos pedidos (esquema). A taxa de fraude em devoluções é monitorada mensalmente — meta ≤0.3% das devoluções totais. Em 2025, taxa apurada de 0.18% (dentro da meta).

---

## CAPÍTULO 3 — Estocagem

### 3.1 Endereçamento WMS — picking face

O modelo de endereçamento do CD-Cajamar segue a notação **[ZONA]-[CORREDOR]-[NÍVEL]-[POSIÇÃO]**. Exemplo concreto: endereço **A-12-03-04** corresponde à zona seca A, corredor 12, nível 03 (terceira altura, ainda dentro do alcance ergonômico de 1.30m a 1.70m) e posição 04 (quarta vaga horizontal contando a partir da extremidade do corredor).

**Picking face** é o conceito de uma face única de coleta por SKU, posicionada em altura ergonômica para evitar lesão de operadores e maximizar velocidade de picking. Picking face fica nos níveis 01 (até 70cm) e 02 (70cm a 1.30m), com 1 SKU por endereço — preserva o "padrão de gôndola" de estoque que reflete o que será apresentado em loja.

O WMS aciona automaticamente reposição da picking face quando o estoque atinge ≤20% da capacidade volumétrica do endereço. A reposição vem dos níveis superiores (reserve, seção 3.2) e é executada por empilhadeira elétrica em horário de baixa demanda (12h-13h e 22h-06h).

Zonas operacionais do CD-Cajamar:

| Zona | Tipo | Corredores | Volume |
|---|---|---|---|
| A | Seca alta rotação | 01-30 | 14.000 m³ |
| B | Seca média rotação | 31-50 | 8.000 m³ |
| Z | Slow-moving | 60-72 | 3.500 m³ |
| R | Refrigerada (5°C) | 73-78 | 2.200 m³ |
| C | Congelada (−18°C) | 80-84 | 1.800 m³ |
| G | Químicos/inflamáveis | 88-96 | 1.400 m³ |
| Q | Quarentena/segregação | 97-99 | 800 m³ |

### 3.2 Reserve + slow-moving

**Reserve** corresponde aos níveis 03 (1.30m-1.70m), 04 (1.70m-2.50m), 05 (2.50m-3.50m), 06 (3.50m-5.00m), 07 (5.00m-7.00m) e 08 (7.00m-9.50m). Apenas empilhadeiras elétricas e retrátil acessam reserve — operadores manuais nunca operam acima do nível 02.

O WMS escolhe automaticamente o palete a ser transferido para picking face conforme regra **FIFO** geral, ou **FEFO** quando o SKU é perecível (cf. seção 3.3). Em cargas paletizadas mistas (vários SKUs no mesmo palete), o operador é direcionado à posição específica do SKU dentro do palete via display do RF-gun.

**Slow-moving** é a zona Z (corredores 60-72) onde SKUs com giro inferior a 0.8 unidades por mês são posicionados. SKUs slow-moving recebem revisão trimestral pela área comercial:

| Giro mensal | Classificação | Frequência inventário cíclico | Ação comercial |
|---|---|---|---|
| > 4 | A (alto giro) | Semanal | Reposição agressiva · vitrine principal |
| 1.5 a 4 | B (médio giro) | Quinzenal | Reposição padrão |
| 0.8 a 1.5 | C (baixo giro) | Mensal | Monitoramento · marketing pontual |
| < 0.8 | D (slow-moving) | Trimestral | Avaliação trimestral · descontinuação possível |

SKUs em D por três trimestres consecutivos entram em fila de descontinuação. Liquidação progressiva em outlet (cf. capítulo 7) com desconto escalonado: -30% no primeiro trimestre, -50% no segundo, -70% no terceiro. Após o terceiro trimestre, o saldo restante é encaminhado para doação institucional (parceiros Apex+Cidadania) ou destruição controlada, conforme natureza do SKU.

A doação institucional segue protocolo de NF de saída com CFOP 5910 (remessa em bonificação, doação ou brinde) e valor de R$ 0,01 simbólico para fins de baixa contábil. As entidades parceiras são selecionadas por critério de impacto social documentado (cadastro junto ao CNAS e ao MROSC) e capacidade logística (capacidade de receber, armazenar e distribuir o saldo recebido). Os principais parceiros nacionais são Mesa Brasil SESC, Banco de Alimentos, Pastoral da Criança e Instituto Akatu. Doações regionais usam parceiros locais (igrejas, abrigos, ONGs sociais) homologados pela área de Apex+Cidadania.

A destruição controlada de SKUs sem aproveitamento (perecíveis vencidos, eletrônicos com defeito irrecuperável, têxteis manchados) é realizada por empresa especializada licenciada pelo CETESB ou órgão estadual equivalente. A operação gera certificado de destruição assinado eletronicamente, arquivado por 5 anos. SKUs eletrônicos vão para descarte com rastreabilidade de componentes (reciclagem de placas, baterias, materiais ferrosos e plásticos) — Apex Group é signatária da política de logística reversa de eletroeletrônicos (Lei 12.305/2010 — PNRS).

O custo médio anual de descarte controlado é de R$ 380.000, e o custo médio anual de doação institucional (logística + administração) é de R$ 240.000 — números que justificam a operação de outlet como saída comercial preferencial, sempre que viável.

### 3.3 FIFO/FEFO para perecíveis

**FIFO** (First In, First Out) é o padrão geral. **FEFO** (First Expired, First Out) é obrigatório para todas as categorias com data de validade impressa: perecíveis Apex Mercado e medicamentos Apex Farma. Procedimento numerado FEFO:

1. Conferência de entrada registra data de validade de cada palete no WMS (campo `expiry_date`).
2. WMS prioriza palete com menor `expiry_date` para reposição da picking face, ignorando ordem de chegada.
3. Operador valida visualmente a data de validade na etiqueta antes da reposição.
4. Em caso de divergência entre WMS e etiqueta, prevalece a etiqueta; ajuste manual é registrado.
5. Etiqueta interna do palete (gerada pelo WMS) inclui código de cor: verde (validade >90 dias), amarelo (30-90 dias), laranja (7-30 dias), vermelho (<7 dias).
6. Palete com etiqueta vermelha é direcionado para vitrine de oferta com desconto promocional (-30% a -50% conforme política comercial).

Política de retirada antecipada:

| Validade restante | Destino | Desconto |
|---|---|---|
| > 30 dias | Picking face / venda regular | Sem desconto |
| 7 a 30 dias | Vitrine de oferta · sinalização "validade próxima" | -20% a -30% |
| 3 a 7 dias | Vitrine "última chance" · destaque adicional | -40% a -50% |
| < 3 dias | Descarte controlado · NF de quebra (CFOP 5927) | — |

A NF de quebra com CFOP 5927 (perda involuntária) é emitida com valor de custo, e o lançamento contábil correspondente é despesa operacional. SPED Fiscal exige rastreabilidade desses lançamentos — cross-ref `politica_reembolso_lojista.pdf` (seção 7, tratamento fiscal de quebras).

O monitoramento de validade é executado pelo WMS de forma contínua, com varreduras automáticas diárias às 06h e 18h. SKUs com validade próxima (faixa amarela ou laranja) recebem alerta no painel do líder de setor, que decide se aplica desconto promocional, transfere para outlet (quando não-perecível) ou encaminha para descarte controlado. Decisões de desconto até -30% ficam na alçada do líder; entre -30% e -50%, no supervisor; acima de -50%, no gerente da loja.

Auditorias específicas de validade são conduzidas semanalmente pelo líder em SKUs categoria A (alto giro), quinzenalmente em B (médio), mensalmente em C (baixo) e a cada 90 dias em D (slow-moving). O líder fotografa SKUs em faixa amarela ou laranja como evidência da rotina FEFO e mantém o registro no app interno por 12 meses (atendendo eventual auditoria ANVISA, cf. seção 8.3).

Para Apex Farma especificamente, o WMS aplica regra de retirada antecipada mais restritiva: medicamentos não podem ser vendidos com menos de 30 dias de validade restante (política interna, mais rígida que a ANVISA), e medicamentos controlados (Portaria 344/98) seguem fluxo específico de retirada antecipada com balanço escriturado eletrônico do estoque ao SNGPC (Sistema Nacional de Gerenciamento de Produtos Controlados). Operação fora desse protocolo configura infração sanitária com risco de interdição da unidade.

### 3.4 Segregação de produtos químicos e inflamáveis

A zona G (corredores 88-96 do CD-Cajamar) atende às exigências NR-20 para armazenamento de produtos químicos e inflamáveis. Características construtivas:

- Piso impermeável com inclinação de 2% em direção a ralo de contenção (capacidade de retenção de 200% do maior volume armazenado).
- Ventilação cruzada com exaustores de explosão classe Ex II 2G T3.
- Iluminação com luminárias antifaísca (classe Ex II 2G).
- Sistema de detecção de gases (LEL e oxigênio) com alarme audiovisual.
- Extintores classe B (líquidos inflamáveis) + classe C (elétricos) a cada 8m linear.
- Chuveiro de emergência + lava-olhos em cada extremidade do corredor.

SKUs típicos da zona G e seus NCMs:

| SKU | NCM | Categoria |
|---|---|---|
| Acetona 1L | 2914.11.00 | Solvente |
| Tinner 5L | 3814.00.00 | Solvente |
| Álcool gel 70% (frascos) | 2207.10.10 | Antisséptico |
| Aerossóis (desodorante, inseticida) | 3303.00.20 / 3808.91.00 | Cosmético / pesticida |
| Velas de parafina | 3406.00.00 | Iluminação |
| Líquido de isqueiro | 3814.00.00 | Combustível leve |

Distância mínima de 5m de qualquer fonte de ignição (caldeira, painel elétrico, motor de empilhadeira a combustão). Operadores que atuam na zona G recebem treinamento NR-20 obrigatório de 16h na admissão + 4h de reciclagem anual. Registro do treinamento é mantido em pasta digital com PDF assinado eletronicamente e arquivamento de 5 anos (eSocial S-2220).

Em caso de derramamento ou vazamento, procedimento de emergência aciona Brigada de Incêndio interna em 5 minutos. A Brigada conta com 12 brigadistas treinados por turno no CD-Cajamar, distribuídos para garantir cobertura em qualquer ponto da operação em até 90 segundos.

Procedimento padrão de contenção de derramamento (P1-P7):

1. Brigadista localiza fonte do vazamento e isola visualmente a área (cones, fita zebrada).
2. Avalia a natureza do produto consultando FISPQ (Ficha de Informações de Segurança de Produtos Químicos) — base de FISPQ acessível via tablet do brigadista.
3. Aplica absorvente apropriado conforme FISPQ: vermiculita para solventes, areia para óleos, kit de neutralização para ácidos/bases.
4. Recolhe material absorvedor em recipiente com tampa identificado conforme natureza do resíduo (sólido contaminado classe IIA ou IIB pela ABNT NBR 10004).
5. Aciona empresa licenciada de transporte de resíduos perigosos (parceria com Veolia ou Suatrans).
6. Documenta o evento em formulário CT-DERRAM (anexo IV do procedimento de emergência), incluindo foto antes/depois e ata da Brigada.
7. Reporta ao DSST (Departamento de Segurança e Saúde do Trabalho) em até 24h, e à CETESB quando volume vazado exceder 5 litros de produto classe II.

Treinamento de brigadistas é de 24h iniciais + 8h reciclagem anual, com simulações práticas trimestrais (incêndio, vazamento, evacuação). Os brigadistas recebem adicional salarial de 10% conforme NR-23 e contrato coletivo, com seguros adicionais de vida e invalidez.

### 3.5 Inventário cíclico vs geral

**Inventário cíclico** é o procedimento contínuo de contagem rotativa por classificação de giro (cf. tabela 3.2). Inventário cíclico é realizado por equipe interna do CD-Cajamar (5 contadores em rodízio), sem interromper a operação.

**Inventário geral** é o procedimento anual obrigatório de contagem completa de todos os SKUs, com contagem dupla cega. Realizado tipicamente em janeiro (encerramento do ano fiscal anterior) durante um sábado e domingo bloqueados para a operação. Equipe ampliada para 25 contadores + 5 supervisores. Tempo médio de execução: 18 horas. Custo médio anual: R$ 280.000 (mão-de-obra + horas extras + auditoria externa).

O caso **TKT-26** (inventário rotativo do estoque seco apontou divergência de 2,3% em R$ 18.700) ilustra a tabela de ação:

| Divergência | Ação | Responsável |
|---|---|---|
| 0% a 1% | Tolerância · ajuste contábil silencioso | Coordenador CD |
| 1% a 2% | Alerta · análise por SKU · revisão procedimento | Supervisor de inventário |
| 2% a 3% | Alerta · auditoria detalhada · suspeita quebra/furto/erro | Coordenador CD · Prevenção de Perdas |
| > 3% | Auditoria forense · investigação interna · ata formal | Gerência de operações · Lia (Tier 3) |

Em **TKT-26**, a concentração da divergência em itens premium (azeite, vinhos, queijos) sugere uma combinação de quebra de embalagem (queda durante transferência interna), furto interno (operadores ou terceirizados de limpeza) e erro de baixa em sistema (NF de quebra não lançada para itens danificados). A auditoria detalhada combinou:

1. Recontagem 100% dos SKUs premium da zona seca.
2. Análise de CFTV das últimas 4 semanas (zona seca tem 6 câmeras com retenção de 30 dias).
3. Cruzamento com NFs de quebra emitidas no período.
4. Entrevista individual com os 8 operadores que tiveram acesso direto aos SKUs envolvidos.
5. Relatório consolidado para Prevenção de Perdas + Marina (Tier 2).

Conclusão típica: ~40% da divergência foi quebra/erro de baixa não documentado (corrigido via ajuste contábil e treinamento); ~60% permaneceu inexplicada e foi categorizada como "perda operacional".

Após o inventário geral anual, o coordenador do CD-Cajamar publica um relatório executivo consolidado (no portal interno) com: (a) valor total da divergência por zona; (b) valor por categoria de SKU; (c) comparativo histórico dos últimos 5 anos; (d) plano de ação 12 meses com 5-8 iniciativas prioritárias. Esse relatório é apresentado em reunião executiva com Lia, Bruno e Carla no final de janeiro/fevereiro, com aprovação dos investimentos requeridos no plano de ação.

Investimentos típicos para mitigação de perda incluem: cobertura adicional de CFTV em zonas críticas (R$ 1.200 a R$ 3.500 por câmera adicional instalada), instalação de leitor RFID em portas internas de transferência (R$ 28.000 por leitor), reforço de Prevenção de Perdas (contratação de fiscais adicionais, R$ 8.400/mês por fiscal CLT), treinamento intensivo para operadores em conferência (custo absorvido pelo programa Apex+Educação) e revisão de processos com consultoria especializada (custo médio R$ 280.000/projeto). O retorno desses investimentos é mensurado em meses, tendo a redução percentual de divergência como KPI direto.

---

### 3.6 Transferência entre lojas

Transferências de estoque entre lojas da rede são operações comuns para balanceamento de inventário, cobertura de ruptura emergencial em uma loja vizinha ou reposição expressa entre lojas de mesma marca. Procedimento:

1. Origem (loja A) cria solicitação de transferência no Apex+Logística, indicando SKU(s), quantidade e justificativa.
2. Destino (loja B) confirma a solicitação.
3. Gerente regional aprova (se for entre regiões diferentes) ou supervisor de área aprova (entre lojas da mesma região).
4. Sistema gera NF de transferência (CFOP 5151 dentro do estado / 6151 interestadual) entre as lojas (matriz contábil é a holding, mas as lojas têm CNPJs distintos).
5. SKU é embalado e identificado conforme padrão Apex (etiqueta de palete com SSCC dedicado para transferência interna).
6. Transporte via frota Apex Logística ou parceiro homologado, com rastreio em tempo real.
7. Recebimento na loja B com conferência cega normal.
8. Estoque é atualizado nos sistemas das duas lojas simultaneamente.

A operação de transferência interna em larga escala foi automatizada no WMS Manhattan 2024.1, com sugestão automática de transferências baseada em IA (machine learning). O sistema identifica desequilíbrios de estoque entre lojas peer e sugere transferências antes mesmo da ruptura. Aceitação humana é obrigatória — o sistema apenas sugere, o gerente decide.

### 3.7 Estoque em consignação

Alguns SKUs específicos são operados em regime de consignação — o fornecedor mantém propriedade do estoque até a venda efetiva ao consumidor final. Modalidade aplicada em:

- Linha de cosméticos premium (Apex Beauty) — fornecedores L'Oréal, Estée Lauder, Granado
- Linha de relógios premium (Apex Tech) — fornecedores Citizen, Casio, Mondaine
- Acessórios fashion sazonais (Apex Moda) — fornecedores Tommy Hilfiger, Lacoste para coleções específicas
- Brinquedos sazonais (Natal) — vários fornecedores

O regime de consignação tem operação fiscal específica:

- Entrada com CFOP 5917 (recebimento em consignação mercantil)
- Venda efetiva ao consumidor: cupom NFC-e normal + NF do fornecedor para a Apex (compra do estoque consignado), com CFOP 5102 retroativo
- Devolução ao fornecedor de saldo não-vendido: CFOP 5918 (devolução de mercadoria recebida em consignação)

A operação requer parametrização específica no SAP MM + Linx Big, e o time fiscal acompanha mensalmente para evitar erros que disparariam rejeição em SPED Fiscal.

### 3.8 Gestão de estoque por categoria — particularidades

Cada categoria tem particularidades de gestão de estoque que influenciam a operação:

| Categoria | Particularidade | Política específica |
|---|---|---|
| Perecíveis (Apex Mercado) | Validade curta | FEFO obrigatório · descarte controlado |
| Linha branca (Apex Tech) | Volume grande, alto valor | Endereçamento dedicado · RFID obrigatório · segurança reforçada |
| Eletrônicos pequenos (Apex Tech) | Alto valor, pequeno volume | Lacre RFID · gôndola com vidro · vendor expert sob demanda |
| Fashion sazonal (Apex Moda) | Estoque com obsolescência rápida | Liquidação ao final da estação · outlet · markdown progressivo |
| Móveis (Apex Casa) | Volume gigante, manuseio especial | Endereçamento dedicado · time de manuseio especializado |
| Cosméticos (Apex Beauty) | Sensibilidade térmica | Temperatura controlada · ventilação · validade |
| Medicamentos (Apex Farma) | Regulação SNGPC + ANVISA | Balanço escriturado · responsável técnico farmacêutico |

A área de Estoque Apex Group emite relatório quinzenal por categoria, com gauge de saudade do estoque (giro, validade, divergência, ruptura) e plano de ação para categorias com indicador vermelho.

---

## CAPÍTULO 4 — Exposição e PDV físico

### 4.1 Layout planograma por categoria

O **planograma** é o documento técnico que define posicionamento, quantidade e adjacência de cada SKU na gôndola, vitrine ou exposição. Cada marca Apex Group tem regime de planograma específico:

| Marca | Frequência de revisão | Responsável | Tipo |
|---|---|---|---|
| Apex Mercado | Quinzenal | Categórico de Cajamar | Master corporativo |
| Apex Tech | Mensal | Categórico + fornecedor (Samsung, LG, Apple) | Negociado |
| Apex Moda | Sazonal · 4 coleções/ano + 2 campanhas especiais | Categórico de coleção | Sazonal |
| Apex Casa | Temático · vitrines a cada 21 dias | Visual merchandiser regional | Temático |
| Apex Logística | Não aplicável (B2B operação) | — | — |

O KPI de **aderência ao planograma** é ≥95% e é apurado por dois mecanismos: auditoria visual quinzenal pelo supervisor de loja (com checklist por categoria) e foto-auditoria corporativa mensal (loja envia fotos via app interno; categórico valida amostra de 10% das fotos contra planograma esperado).

Lojas com aderência abaixo de 90% recebem visita técnica do categórico em até 14 dias para reorganização guiada. Lojas com aderência abaixo de 85% por dois meses consecutivos disparam plano de ação 60 dias com acompanhamento semanal.

O planograma é distribuído em três formatos: PDF visual (impresso em A3 e pendurado em sala administrativa da loja), arquivo digital (aberto no tablet do líder de setor para consulta in loco) e dados estruturados (CSV/JSON consumidos pelo sistema de auditoria foto-automática). O líder de setor consulta o planograma diariamente antes da reposição matinal, e o supervisor faz auditoria visual quinzenal usando o checklist eletrônico.

Mudanças não-autorizadas no planograma (ex: gerente decide localmente mover SKUs para gerar espaço para promoção pontual) são detectadas pela foto-auditoria automática e geram comunicado de alerta para o categórico. Mudanças autorizadas (sazonalidade local, promoção corporativa, retirada de SKU descontinuado) seguem fluxo formal de comunicação operacional (COP-AAAA-NN) com prazo mínimo de 48h de antecedência. Em casos excepcionais (queda emergencial de fornecedor, ruptura imediata de SKU principal), o supervisor decide localmente e comunica retroativamente ao categórico em até 4h.

A foto-auditoria mensal opera com 18 lojas amostradas aleatoriamente por marca por mês. A amostragem é estratificada para garantir representatividade por região, porte e mix de SKU. As fotos são enviadas pelo líder via app Apex+Reposição até as 14h do dia agendado, e o categórico revisa em até 5 dias úteis, com feedback consolidado.

### 4.2 Reposição

A reposição matinal das gôndolas é o procedimento operacional mais crítico do dia, pois define a disponibilidade comercial nas primeiras horas de venda. Janela operacional: **06h às 09h** para Apex Mercado (antes da abertura ao público às 09h), **08h às 09h30** para Apex Tech (antes da abertura ao público das galerias às 10h), **07h às 09h** para Apex Moda e Apex Casa.

O stack de reposição é:

- **Impressora térmica Zebra ZD230** posicionada em cada ponta de gôndola (1 ZD230 a cada 4 corredores).
- **RF-gun Zebra TC52** para cada repositor (1 RF-gun por colaborador da escala matinal).
- **Aplicativo Apex Reposição** rodando em terminal Android dedicado.

O caso **TKT-19** (impressora ZD230 do CD com offset de 3mm para a direita) gerou impacto operacional limitado, porque o offset permaneceu dentro do limite legível do leitor de código de barras (EAN-13 com tolerância padrão de leitura ≤5mm) — etiquetas foram aceitas pelo PDV. Procedimento de paliativo enquanto o técnico Zebra não chegou:

1. Validar visualmente o offset em cada etiqueta (≤1mm horizontal · ≤0.5mm vertical é tolerância Apex; acima disso, descarte).
2. Etiquetas descartadas custam R$ 0,08 cada — perda operacional desprezível (~R$ 12/dia).
3. Sensor de gap (que detecta a marca preta entre etiquetas) foi recalibrado manualmente — sem efeito; suspeita de rolete de tração desgastado.
4. Contrato Zebra Brasil garante troca de equipamento em até 4h em SLA premium.
5. Fallback: etiquetas-A impressas em laser comum (modelo de PDF compartilhado interno).

Procedimento numerado da reposição matinal (P1-P12):

1. Repositor acessa o app Apex Reposição com badge funcional + senha.
2. App apresenta lista de ruptura do dia anterior (gerada pelo sistema de inventário automático).
3. Repositor imprime etiquetas no ZD230 do setor (lote de até 80 etiquetas por impressão).
4. Validação visual de offset e cores (≤1mm horizontal · ≤0.5mm vertical · cores 100% legíveis).
5. Reposição por zona, começando alto-giro (zona A1) e seguindo para A2, B, etc.
6. RF-gun bipa SKU antes de colocar fisicamente na prateleira (confirma vinculação SKU × endereço).
7. Confirmar aderência ao planograma (foto comparativa via app, quando aplicável).
8. Lançar perdas/quebras encontradas durante a reposição via app (NF de quebra com CFOP 5927).
9. Auditar primeira venda do SKU reposto — sistema monitora primeiros 30 minutos para detectar PLU errado.
10. Encerrar lista de reposição no sistema (botão "concluir ronda").
11. Sinalizar gôndola crítica para o supervisor (SKUs em ruptura recorrente entram em alerta).
12. Encerrar ronda matinal · entregar relatório do app para o líder de setor.

KPI de **ruptura de gôndola** é ≤2.5%. Ronda diária 14h e 19h re-audita SKUs em ruptura e dispara reposição emergencial quando necessário. Ruptura acima de 5% em SKU de alta rotação dispara investigação imediata: pode ser problema de pedido (falha no replenishment), problema de WMS (palete não localizado), problema de loja (espaço errado no planograma) ou problema de comercial (campanha não prevista).

Ruptura emergencial (SKU de alta rotação em ruptura por mais de 4h) dispara fluxo de reposição rápida: o sistema notifica automaticamente o líder de setor, que decide entre cobertura via estoque interno da loja (quando há reserva em backroom), cobertura via loja peer (transferência entre lojas da mesma região, autorizada pelo gerente regional) ou cobertura via CD regional (com cross-docking expresso quando o SKU está disponível). Tempo médio de cobertura: 4h via estoque interno, 24-48h via loja peer, 24h via CD regional expresso.

O sistema mantém histórico de ruptura por SKU/loja/data, permitindo análise de tendência e identificação de SKUs problemáticos sistematicamente. SKUs com ruptura crônica (>5 ocorrências/mês de duração >4h) entram em revisão de replenishment: aumento de estoque-mínimo, revisão de lead time com fornecedor, avaliação de fornecedor alternativo. O categórico do CD-Cajamar é o responsável pela revisão, com decisão final do gerente comercial da marca.

Reposição de produtos sensíveis (ex: laticínios em refrigerador da loja Apex Mercado) segue protocolo adicional: o repositor mede temperatura do refrigerador antes da reposição, verifica integridade do produto (validade, embalagem), faz o aprovisionamento sem deixar o refrigerador aberto por mais de 60 segundos contínuos (para evitar quebra de cadeia fria). Esse protocolo é particularmente relevante após reportes intermitentes de elevação de temperatura em refrigeradores antigos de algumas lojas da rede.

### 4.3 Etiquetagem de preços

A etiqueta de preço padrão Apex tem layout fixo:

```
[CÓDIGO DE BARRAS EAN-13]
[PLU 6 dígitos]
[DESCRIÇÃO ABREVIADA ≤28 caracteres]
[PREÇO GRANDE em fonte sans-serif 18pt]
[PREÇO PROMOCIONAL riscado em 12pt, quando aplicável]
[QR CODE FIDELIDADE — opcional]
```

O caso **TKT-23** (8 pedidos da campanha Outubro Rosa com SKU trocado — blusa rosa premium R$ 240 substituída por blusa rosa básica) revelou um problema sistêmico: SKUs com EANs terminando em **4747** e **4774** são visualmente parecidos sob iluminação de loja, especialmente quando o operador trabalha sob ritmo de campanha.

A política corretiva implementada após **TKT-23** é o **4-eyes principle em campanhas**. Toda subida de preço para o sistema de PDV durante campanhas (Outubro Rosa, Black Friday, Natal, Dia das Mães, Dia dos Pais) requer duas leituras independentes do SKU antes da confirmação:

1. Operador A bipa o SKU físico com o RF-gun.
2. Sistema confirma SKU e exibe preço/descrição na tela do RF-gun.
3. Operador A confirma.
4. Operador B (outro colaborador, em sessão separada) bipa o mesmo SKU físico.
5. Sistema verifica que é o mesmo SKU e exibe novamente.
6. Operador B confirma.
7. Sistema libera o preço para o PDV.

Quando há 2+ SKUs com dígitos-base parecidos (CHECK match), o sistema dispara um alerta adicional pedindo verificação dobrada — comparação lado a lado das duas etiquetas físicas.

A auditoria PROCON aplica visita aleatória uma vez por loja por trimestre. O fiscal seleciona 50 SKUs aleatórios da gôndola e compara o preço da etiqueta com o preço cobrado no PDV. Divergências caracterizam infração CDC art. 30 (vinculação à oferta), e a loja deve honrar o preço de gôndola. Reincidência configura multa progressiva (R$ 2.000 a R$ 50.000 conforme CDC art. 56) e dano reputacional. A política interna Apex prevê monitoramento mensal antifraude: 30 SKUs aleatórios por loja, auditoria interna conduzida pelo supervisor.

A subida de preço em massa (revisão semanal ou quinzenal de tabela) segue calendário fixo: domingo às 23h o sistema central propaga a nova tabela para todas as lojas, com efetividade na abertura de segunda-feira. Em horário comercial, qualquer alteração de preço requer aprovação dupla (operador + supervisor) e gera log de auditoria com timestamp, usuário, SKU, preço anterior, preço novo. Logs são retidos por 5 anos e disponibilizados em caso de auditoria interna ou fiscalização externa.

Campanhas promocionais relâmpago (24-48h, geralmente associadas a redes sociais ou aplicativo) são parametrizadas no sistema com janela de validade automática: o preço promocional é ativado no horário inicial e desativado no horário final, sem necessidade de intervenção manual. A política interna proíbe campanhas relâmpago sem prazo de validade explícito, justamente para evitar a confusão entre preço da campanha e preço normal após o término — situação que poderia configurar dano ao consumidor.

Em ofertas com restrição de quantidade ("limite 2 unidades por cliente"), o PDV implementa a regra automaticamente baseada no CPF informado ou na vinculação do meio de pagamento. Tentativa de burlar a regra (ex: cliente entra na fila duas vezes em sequência) é detectada pelo CFTV + Prevenção de Perdas, e o supervisor decide caso a caso entre alertar o cliente publicamente, recusar a venda adicional ou ignorar (quando a quantidade adicional é pequena e o impacto comercial é baixo).

### 4.4 Política antifurto

O stack de prevenção de perdas físicas opera em camadas:

**Camada 1 — EAS (Eletronic Article Surveillance).** Etiqueta acústico-magnética em SKUs sensíveis: vinhos premium (Apex Mercado), perfumaria importada (Apex Beauty), eletroportáteis pequenos (Apex Tech), bolsas e cintos premium (Apex Moda). Antena na saída da loja dispara alarme audiovisual em <1s.

**Camada 2 — Lacre RFID alta valor.** Itens >R$ 800 unitário recebem lacre com chip RFID na entrada da loja. Saída sem desativação no PDV dispara alarme silencioso vinculado ao operador de prevenção em tempo real.

**Camada 3 — CFTV 24/7.** Cobertura mínima de 6 câmeras por loja média (1 entrada, 1 caixas, 1 vitrine, 1 corredor crítico, 2 estoque). Retenção LGPD-compliant de 30 dias em SSD criptografado. Apenas Bruno (CTO) e operadores autorizados por crachá funcional acessam imagens. Cross-ref `politica_dados_lgpd.pdf` (seção 6.2 — CFTV e retenção LGPD).

**Camada 4 — Fiscal de prevenção em loja.** Colaborador sem uniforme, identificado apenas por crachá interno. Cobertura aleatória (não-anunciada) calculada pela área corporativa de Prevenção de Perdas. Tipicamente 1 fiscal por loja anchor + 1 fiscal cobrindo 3 lojas de bairro em rota rotativa.

O caso **TKT-27** (lote LX-789 de 60 iPhone 15 Pro com lacres internos violados, valor R$ 480k) ativou o protocolo crítico de violação:

1. **Congelar o lote fisicamente** em zona Q (quarentena) com restrição de acesso por crachá.
2. **Auditoria visual de 100% das unidades** com foto de cada caixa interna + comparação com padrão de fábrica.
3. **Acionar Polícia Federal** (carga importada com indício de adulteração) + jurídico Apex Group.
4. **Registrar incidente no sistema interno** (módulo Incidentes do WMS) com classificação "crítico/criminal".
5. **Comunicado ao distribuidor autorizado** com BOleta de Ocorrência + foto do lacre violado.
6. **Risk assessment** conduzido por Bruno (CTO) sobre integridade da cadeia logística desse distribuidor — em casos com 2+ ocorrências em 12 meses, o distribuidor é descredenciado.

KPI de perda operacional ≤0.8% do faturamento mensal — valores acima escalam para Marina (Tier 2) e, se sistêmicos, para Bruno (sobre integridade do CFTV) e Lia (sobre alçada financeira de write-off).

Estatísticas históricas Apex Group apontam decomposição típica da perda operacional como: 38% quebra documentada (cf. capítulo 3), 22% furto externo identificado, 18% furto interno apurado, 22% perda não-identificada (a categoria mais sensível, alvo prioritário de investimento em redução).

Programas específicos de redução de perda incluem: campanhas educativas internas trimestrais (foco em colaboradores como agentes de prevenção), recompensa simbólica para detecção em flagrante (R$ 200 em cupom Apex+ por flagrante confirmado pela investigação), revisão periódica de pontos cegos no CFTV (auditoria semestral conduzida por consultoria especializada), e melhoria de iluminação em corredores críticos (zonas com iluminação insuficiente são mais propensas a furto).

Casos de flagrante de furto em piso de loja seguem protocolo estrito: o fiscal de prevenção identifica o suspeito de forma discreta, acompanha o trajeto até a saída, aborda APÓS a passagem pela linha das antenas EAS (configurando consumação do ato), e conduz o suspeito a uma sala administrativa privada. Polícia Militar é acionada via 190 e a vítima do crime (Apex Group) registra BO em delegacia próxima. O cliente NÃO é exposto publicamente em hipótese alguma — exposição configura constrangimento ilegal e dano moral, com risco jurídico maior que o do prejuízo material original.

### 4.5 Limpeza diária

A operação de limpeza segue cronograma fixo por marca:

| Marca | Janela manhã | Ronda meio-dia | Fechamento |
|---|---|---|---|
| Apex Mercado | 05h-07h | 11h-14h (ronda contínua) | 22h-23h30 |
| Apex Tech | 09h-09h30 | 14h-14h30 | Após 22h |
| Apex Casa | 08h-09h | 14h-14h30 | Após 20h |
| Apex Moda | 09h-10h | 15h-15h30 | Após 22h |

Checklist diário em 14 itens, distribuídos em três turnos:

1. Banheiros (2x/dia mínimo, mais quando NPS de banheiro <80 na pesquisa do cliente)
2. Espelhos e vidros (manhã)
3. Piso (manhã + meio-dia + fechamento)
4. Vitrines externas (manhã)
5. Provadores (Apex Moda específico — manhã + ronda meio-dia)
6. Caixa e gôndolas de check-out (manhã + fechamento)
7. Gôndolas principais (manhã + ronda meio-dia)
8. Ar condicionado e filtros (semanal, com fornecedor externo Carrier ou equivalente)
9. Iluminação (verificar lâmpadas queimadas — semanal)
10. Sinalização interna (verificação visual, manhã)
11. Saída de emergência (verificação diária — desobstrução, iluminação)
12. Estoque (organização visual, manhã)
13. Refrigeradores e congeladores (Apex Mercado — diário, com verificação de temperatura)
14. Provadores e fitting rooms (Apex Moda — desinfecção 2x/dia)

Insumos médios mensais por loja (valores médios para loja de bairro):

| Item | Custo médio |
|---|---|
| Pano descartável (caixa 500un) | R$ 380 |
| Álcool 70% (galão 5L) | R$ 240 |
| Saco de lixo preto (pacote 100un) | R$ 180 |
| Papel higiênico (caixa 64rl) | R$ 420 |
| Sabonete líquido (galão 5L) | R$ 110 |
| Detergente neutro (galão 5L) | R$ 90 |

Contratos de limpeza terceirizada (varia por região, fornecedor Apex+Clean ou equivalente) cobrem mão-de-obra + insumos. Insumos premium (panos de microfibra para vitrines, álcool isopropílico para eletrônicos) são fornecidos diretamente pelo setor de Facilities Apex Group.

A equipe de limpeza terceirizada é treinada em protocolo Apex Group (8h iniciais + 2h reciclagem anual), com ênfase em: (a) uso correto de EPI (luvas, óculos de proteção, máscaras conforme insumo); (b) descarte adequado de resíduos (sólidos, líquidos contaminados, embalagens); (c) sequência correta de limpeza (do mais limpo para o mais sujo, evitando contaminação cruzada); (d) não-interferência com atendimento de clientes (operação discreta, sem ruído excessivo, sem isolamento de áreas em horário comercial).

Em lojas Apex Mercado com fresh, a limpeza de equipamentos refrigerados (balcões frios, refrigeradores, freezers) segue regulamento específico ANVISA: limpeza diária superficial + limpeza profunda semanal (com produto sanitizante específico para alimentos, classe ANVISA), registrada em planilha física + foto via app. Auditorias ANVISA podem solicitar essa documentação.

A qualidade da limpeza é monitorada pelo supervisor de loja via inspeção visual quinzenal, com checklist de 14 itens. NPS de banheiro (item específico da pesquisa pós-compra) é monitorado mensalmente, e quando cai abaixo de 75 dispara revisão imediata do plano de limpeza (frequência, insumos, equipe terceirizada). Reclamações pontuais de cliente via app ou SAC entram em fluxo de tratamento similar.

---

### 4.6 Vitrines externas e fachada

A vitrine externa é o primeiro ponto de contato visual com o cliente potencial. Padrões Apex Group:

| Marca | Frequência de troca | Tema |
|---|---|---|
| Apex Mercado | Mensal | Promocional · sazonal · datas comerciais |
| Apex Tech | Bimestral | Lançamentos tecnológicos · campanhas fornecedor |
| Apex Moda | Quinzenal | Coleção atual · tendências da estação |
| Apex Casa | Trimestral | Decoração temática · ambientes prontos |
| Apex Beauty | Mensal | Tendências de cuidados · lançamentos |

A vitrine é executada pelo coordenador de vitrines (em anchors) ou por equipe rotativa do supervisor (em lojas menores), seguindo briefing visual enviado pelo Apex+ Visual Merchandising. Material POP (preço, sinalização, banners) é fornecido centralmente. Iluminação da vitrine é monitorada por sensor — se uma lâmpada queima, alerta é gerado para o supervisor.

NPS de vitrine (subitem da pesquisa pós-compra: "A vitrine te chamou a atenção?") é monitorado mensalmente e quando cai abaixo de 70 dispara revisão do briefing visual. NPS de fachada (subitem: "A entrada da loja parece convidativa?") é monitorado também e considera limpeza, sinalização, iluminação e ausência de obstrução.

### 4.7 Sinalização interna e wayfinding

A sinalização interna segue padrão Apex+ com 4 níveis hierárquicos:

1. **Sinalização macro** (departamentos, categorias) — placas pendentes com nomenclatura padrão
2. **Sinalização micro** (gôndolas, subcategorias) — etiquetas em cabeça de gôndola
3. **Sinalização tática** (promoções, ofertas) — banners volumetricamente posicionados
4. **Sinalização orientacional** (caixas, banheiros, saídas de emergência, escadas) — placas com pictograma + texto

A nomenclatura é uniforme em toda a rede (não há "açúcar" em uma loja e "doçuras" em outra), facilitando o cliente que frequenta múltiplas lojas. Acessibilidade é prioritária: placas de saída de emergência incluem braille e contraste suficiente para baixa visão (norma ABNT NBR 9050).

Wayfinding (orientação no espaço) é avaliado periodicamente pelo Apex+UX (área corporativa), com pesquisas observacionais em lojas piloto. Mudanças sistêmicas em wayfinding são distribuídas via COP e implementadas em até 90 dias.

### 4.8 Operações especiais (sampling, demonstração, ativação)

Em determinadas categorias, operações especiais são executadas para gerar engajamento:

- **Sampling** (Apex Mercado e Apex Beauty): degustação ou amostra grátis de produto, em ponto fixo da loja. Cargo de promotor é geralmente terceirizado (agência de promoção), com supervisão Apex.
- **Demonstração** (Apex Tech): demonstração técnica de produto eletrônico complexo (TV nova, robô aspirador, multiprocessador). Cargo geralmente exercido por especialista de produto (interno) ou consultor fornecedor.
- **Ativação** (Apex Moda e Apex Casa): evento temático em loja, com decoração especial, presença de influenciador ou personalidade, sorteio ou brinde. Tipicamente acontece em sábados de campanha sazonal.

Operações especiais requerem aprovação prévia do gerente regional e seguem checklist de execução (briefing, treinamento, agenda, mensuração de resultados). KPIs específicos: aumento de venda durante operação (vs sábado regular), aumento de cadastros Apex+, NPS específico do evento.

---

## CAPÍTULO 5 — Atendimento ao cliente

### 5.1 Saudação padrão + tom Apex

O cliente que entra em uma loja Apex Group deve ser saudado dentro dos primeiros **8 segundos**. O roteiro padrão é deliberadamente curto e não-invasivo:

> "Bem-vindo à Apex [Marca]. Posso ajudar a achar algo específico ou prefere olhar com calma?"

Variações aceitáveis (mesmo conteúdo, dicção natural do colaborador):

- "Oi, bom dia! Tem algo específico ou prefere olhar com calma primeiro?"
- "Bem-vindo. Está procurando alguma coisa? Se preferir, pode olhar tranquilamente."

**Anti-padrões** explicitamente proibidos:

- NÃO seguir o cliente pela loja após a saudação. Cliente perambula livremente; colaborador permanece visível mas não-intrusivo.
- NÃO repetir a abordagem a cada gôndola. Uma abordagem inicial é suficiente — o cliente sabe que o colaborador está disponível.
- NÃO usar diminutivos automáticos ("vou pegar uma aguinha pra você"). Cordialidade não confunde com familiaridade excessiva.
- NÃO fazer perguntas qualificadoras intrusivas no primeiro contato ("você está procurando para si ou presente?", "qual é o seu orçamento?"). Essas perguntas vêm depois, em contexto.

**Tom Apex Group:** cordialidade + competência + assertividade. Sem servilismo (cliente é parceiro, não rei), sem familiaridade excessiva (relação profissional cordial), com confiança técnica (colaborador conhece o produto e diz "não sei, vou verificar" sem hesitar).

Treinamento de saudação faz parte do módulo Atendimento Apex no onboarding (4h iniciais), com reciclagem anual de 2h. O role-play é gravado em vídeo para autoanálise do colaborador + feedback do supervisor.

A pesquisa pós-compra (envio automático via SMS ou e-mail em até 24h após a venda) inclui pergunta específica sobre o atendimento: "De 0 a 10, quão provável você indicaria nossa loja para um amigo?". A escala NPS clássica converte respostas em promotores (9-10), neutros (7-8) e detratores (0-6). NPS de loja física = % promotores - % detratores. A meta de NPS ≥72 corresponde a cerca de 80% promotores, 16% neutros e 4% detratores em loja saudável.

Quando uma loja apresenta NPS abaixo de 65 por dois meses consecutivos, o gerente regional conduz visita técnica de diagnóstico em até 14 dias, com análise: (a) qualidade do atendimento (observação direta + revisão de gravações de CFTV); (b) treinamento da equipe (auditoria de registros e role-play presencial); (c) condições físicas da loja (limpeza, sinalização, layout); (d) mix de SKU em relação à demanda local; (e) capacidade de cobertura de escala (faltas, rotatividade). O resultado é um plano de ação 90 dias com 5-8 iniciativas priorizadas.

A frase-âncora corporativa Apex Group é: "*estar disponível sem ser invasivo*". Esse princípio guia toda a interação física e digital: cliente percebe a presença do colaborador como recurso opcional, não como pressão de venda.

### 5.2 Operação POS NFC-e

O stack de PDV padrão Apex Group em loja física B2C é:

| Componente | Modelo | Função |
|---|---|---|
| Terminal | Linx Big Retail | Software de PDV |
| Impressora térmica | Bematech MP-4200 TH | Cupom NFC-e + comprovante adquirência |
| Leitor de código de barras | Honeywell MS9540 VoyagerCG | Leitura EAN-13/Code 128 |
| Pinpad adquirência | Cielo LIO V3 | Captura de cartão + PIX |
| Gaveta de dinheiro | Hisar HS-410 | Compartimento físico |
| UPS | APC SmartUPS 1500VA | Backup elétrico para fechamento sem perda de NFC-e |

Fluxo padrão de venda em PDV:

1. Operador bipa o(s) SKU(s) com o leitor Honeywell.
2. Sistema verifica preço, estoque e exibe na tela.
3. Operador pergunta sobre programa fidelidade (CPF ou telefone Apex+).
4. Operador solicita forma de pagamento.
5. Operador confirma valor com o cliente.
6. Pinpad Cielo captura o cartão (ou cliente escolhe PIX, mostra QR Code).
7. Adquirência processa em <3s · resposta retorna ao PDV.
8. PDV emite NFC-e e transmite para SEFAZ-SP.
9. SEFAZ retorna autorização em <3s (cenário ideal).
10. Bematech imprime cupom NFC-e + comprovante adquirência.
11. Operador entrega o cupom ao cliente.
12. PDV encerra a transação e atualiza estoque em tempo real (sincronização com WMS via API REST).

O caso **TKT-11** (PDV da loja Pinheiros travando ao emitir NFC-e em vendas com >8 itens, 3 ocorrências/dia em horário de pico) é referência operacional comum. A causa-raiz é timeout na chamada SEFAZ-SP — quando a NFC-e tem mais de 8 SKUs distintos, o payload XML cresce e o timeout padrão de 10s pode ser insuficiente. Procedimento de contingência:

1. Sistema detecta timeout (>10s sem resposta SEFAZ).
2. PDV gera NFC-e em **contingência offline** com chave provisória.
3. Cupom impresso normalmente (cliente leva embora).
4. PDV armazena XML em fila local.
5. Worker em segundo plano retransmite a cada 60s até SEFAZ confirmar.
6. Confirmação retroativa atualiza o lançamento no SAP FI.

Cross-ref `manual_pos_funcionamento.pdf` (manual completo POS — operação detalhada, casos de erro, troubleshooting NFC-e) e `runbook_sap_fi_integracao.pdf` (integração POS → SAP FI → SEFAZ).

Procedimento de abertura de caixa (P1-P10):

1. Operador identifica-se no terminal Linx Big com badge funcional + senha + biometria digital.
2. Sistema confirma escala (operador escalado para o turno e a posição correta).
3. Operador insere fundo de caixa físico (R$ 50 padrão · pode variar conforme volume esperado da loja).
4. Sistema sincroniza tabela de preço atualizada do mestre central.
5. Sistema verifica conexão SEFAZ-SP (ping de saúde, latência <500ms ideal).
6. Sistema valida estado do pinpad Cielo LIO (conectado, com bateria >40%, certificado válido).
7. Sistema valida impressora Bematech (papel suficiente, sem erro mecânico, fonte conectada).
8. Operador imprime cupom de teste (formato CCe — Comprovante de Cancelamento Eletrônico) para validar impressão.
9. Sistema libera o caixa para operação · status "aberto" registrado no servidor central.
10. Operador inicia primeira venda · timestamp registra início do turno.

Procedimento de fechamento de caixa (P1-P9):

1. Supervisor encerra escala do operador no sistema · status "fechado" registrado.
2. Sistema gera relatório consolidado do turno (total de vendas, número de transações, ticket médio, formas de pagamento).
3. Operador conta dinheiro físico da gaveta + cheques (raros).
4. Sistema compara dinheiro contado vs dinheiro esperado (vendas em dinheiro - troco - sangria).
5. Divergência tolerada: ±R$ 5,00. Divergência maior dispara recontagem + investigação.
6. Vendas em cartão (crédito, débito) são reconciliadas automaticamente com extrato Cielo do dia (D+1 confirma cada transação).
7. Vendas em PIX são reconciliadas com extrato bancário (instantâneo no Bacen, D+0 no relatório).
8. Fundo de caixa de R$ 50 é restituído à tesouraria interna ou repassado ao próximo turno.
9. Sangria diária ou final do dia: dinheiro acima do fundo + cheques são depositados em cofre interno (cofre de boca de leão padrão Brink's), com retirada por transportadora de valores conforme escala da loja.

Cancelamento de NFC-e dentro de 30 minutos da emissão (limite SEFAZ-SP para CCe) é simples: operador acessa "Cancelar Cupom" no Linx Big, insere senha de supervisor (autorização obrigatória), seleciona motivo, e o sistema emite CC-e automaticamente. Cancelamento após 30 minutos exige procedimento de devolução com NF de entrada (CFOP 1202/2202) e segue fluxo da seção 5.3 deste manual.

### 5.3 Fluxo de devolução em loja

Toda devolução em loja segue tabela de motivo × alçada × decisão:

| Motivo | Prazo | Decisão | Alçada |
|---|---|---|---|
| Defeito de fabricação (visível, óbvio) | 0-90 dias CDC | Troca imediata | Diego (Tier 1) |
| Defeito de fabricação (oculto, requer laudo) | 0-90 dias CDC | Troca após laudo técnico | Marina (Tier 2) |
| Arrependimento CDC art. 49 (compra online retirada loja) | 7 dias | Estorno integral | Diego (Tier 1) |
| Tamanho/medida errado (fashion) | 30 dias | Troca ou estorno | Diego (Tier 1) |
| Solicitação fora do prazo CDC (cortesia comercial) | — | Caso-a-caso · cortesia até R$ 5.000 | Marina (Tier 2) |
| Solicitação fora do prazo CDC (alto valor) | — | Caso-a-caso · acima de R$ 5.000 | Lia (Head Atendimento) |
| Suspeita de fraude/uso indevido | — | Indeferimento + investigação | Marina (Tier 2) · escalação Bruno se sistêmico |

Procedimento numerado da devolução B2C em loja (P1-P9):

1. Cliente apresenta produto + cupom NFC-e (ou pesquisa pelo CPF Apex+ quando cupom perdido).
2. Operador identifica motivo da devolução (questionário do app interno).
3. Operador valida prazo CDC (cálculo automático pelo sistema).
4. Operador inspeciona produto fisicamente (foto via app se for defeito).
5. Sistema sugere ação conforme tabela acima (troca, estorno, laudo).
6. Operador confirma a ação e abre o processo no sistema.
7. Emissão de NF de devolução (CFOP 1202 dentro do estado · 2202 interestadual).
8. Estorno via Cielo (cartão original) ou PIX (conta indicada pelo cliente) executado em até 7 dias úteis (CDC art. 49 §1º).
9. Sistema atualiza estoque (reverse-tag, cf. seção 7.3) e gera relatório consolidado para o gerente.

Cross-ref `faq_pedidos_devolucao.pdf` (políticas comerciais completas de devolução) e `politica_reembolso_lojista.pdf` (alçadas financeiras + cortesia comercial).

### 5.4 Programa fidelidade Apex+

O programa Apex+ é unificado entre as marcas (cliente do Apex Mercado acumula no Apex Tech, etc) e tem três tiers:

| Tier | Critério anual | Benefício |
|---|---|---|
| Apex Basic | Default (cadastro gratuito) | 1 ponto por R$ 1 gasto · 1 ponto = R$ 0,05 (~5% cashback) |
| Apex Plus | ≥ R$ 12.000/ano | +30% pontos · campanhas exclusivas |
| Apex Premium | ≥ R$ 40.000/ano | +50% pontos · linha VIP · frete grátis ilimitado |

Cupons da semana são enviados via push (app Apex+) e SMS toda quinta-feira às 11h. Cliente Apex Premium recebe ofertas adicionais (exclusivas) na terça-feira.

A política completa do programa fidelidade está documentada no portal interno do Apex Marketing e não compõe este manual de operação (escopo separado). Operadores recebem treinamento básico de uso do programa no onboarding (1h específica).

### 5.5 Reclamações in loco

Toda reclamação registrada em piso de loja segue tabela de natureza × resolução:

| Natureza | Resolução 1ª linha | Escalação |
|---|---|---|
| Erro de preço (gôndola vs PDV) | Honrar preço de gôndola (CDC art. 30) | Diego decide até R$ 200 · acima Marina |
| Produto sem etiqueta | Consultar PLU no terminal · cobrar valor confirmado | Diego (ou gerente se contestação cliente) |
| Atendimento ruim (queixa cliente) | Desculpa formal + cupom Apex+ 200 pts (R$ 10) | Marina decide acima de cupom |
| Suspeita de produto adulterado | NÃO vender · isolar SKU · escalar Prevenção | Marina + Prevenção de Perdas |
| Filas longas no PDV | Abrir caixa adicional · prioridade idoso/gestante | Supervisor de turno |
| Banheiro sujo / sinalização incorreta | Acionar limpeza imediata + comunicar líder | Supervisor de turno |
| Acessibilidade comprometida (rampa/elevador) | Solução temporária + acionar Facilities | Supervisor + gerente |
| Solicitação de gerente sem motivo claro | Atender pessoalmente · escutar sem interromper | Gerente |

A **política de não-confrontação** é regra inegociável Apex Group: nunca alegar publicamente "cliente errado" ou levantar voz com cliente em piso de loja. A frase-âncora é: "vamos verificar e voltamos com a resposta". Toda investigação posterior é conduzida em ambiente privado (sala administrativa) com acesso a CFTV quando relevante.

Reclamações registradas formalmente (carta, e-mail, PROCON, Reclame Aqui, mídia social pública) seguem fluxo dedicado pela área de Comunicação Corp + Lia (Head Atendimento). SLA de resposta:

- Reclame Aqui: <24h
- E-mail SAC: <24h úteis
- Carta formal: <72h úteis
- PROCON: conforme prazo legal (geralmente 10 dias úteis)
- Mídia social pública: <4h (acionar Comunicação Corp imediatamente)

Reclamações registradas em PROCON específicamente seguem fluxo de tratamento jurídico-comercial coordenado por Lia + jurídico Apex Group. O prazo legal de resposta é tipicamente 10 dias úteis, mas a política interna prevê resposta em 5 dias úteis (margem de segurança operacional). O response inclui obrigatoriamente: (a) confirmação dos fatos relatados; (b) contextualização da política comercial aplicada; (c) decisão fundamentada (atendimento ao pleito, atendimento parcial, ou recusa justificada); (d) documentação anexada (NF-e, registros do CFTV se aplicável, contrato comercial). Reincidência de reclamações similares na mesma loja em 12 meses indica problema sistêmico e dispara revisão de procedimento + treinamento adicional.

Indicadores monitorados mensalmente pelo time de Comunicação Corp incluem: Reputation Score Reclame Aqui (meta ≥7.5 em todas as marcas Apex Group), índice de respostas em prazo (meta ≥98%), índice de resolução em primeira interação (meta ≥75%) e Net Sentiment em redes sociais (meta positivo, com benchmark contra concorrentes de mesma vertical).

Crises de imagem (mídia social viral, matéria negativa em mídia tradicional, exposição em programa de TV) seguem playbook de Comunicação Corp coordenado por Lia: ativação imediata da brigada de crise (Lia + Bruno + jurídico + Comunicação), análise dos fatos em até 1h, posicionamento oficial publicado em até 4h, monitoramento contínuo das menções, e debriefing executivo em 24h com Carla e CEO. Lições aprendidas alimentam atualizações neste manual e em treinamentos internos.

---

### 5.6 Atendimento ao cliente VIP (Apex+ Premium)

Clientes Apex+ Premium (≥R$ 40.000/ano em compras) recebem tratamento diferenciado, descrito em playbook interno:

| Aspecto | Cliente Apex Basic | Cliente Apex+ Premium |
|---|---|---|
| Atendimento padrão | Por ordem de chegada | Atendente VIP dedicado (anchors) |
| Linha de caixa | Compartilhada | Linha rápida exclusiva |
| Comunicação proativa | Push 1x/semana | Push personalizado + e-mail mensal |
| Acesso a campanhas | Junto com público geral | 48h de antecedência |
| Alçada de cortesia | R$ 200 (Diego) | R$ 800 (atendente VIP) |
| Resolução de problemas | SLA padrão | SLA dobrado (resposta em 30 min vs 2h) |
| Pré-venda de produtos premium | Bloqueio para Basic em casos críticos | Reserva prioritária via app |
| Eventos corporativos | Não convidado | Convite a eventos da marca (lançamento, fashion show, degustação) |

O playbook VIP é treinado em curso de 12h no onboarding do atendente VIP, com acompanhamento mensal de NPS específico do segmento (meta ≥85, mais alta que o NPS geral de ≥72).

### 5.7 Atendimento ao cliente em situação especial

Determinadas categorias de cliente requerem cuidado adicional:

- **Idosos** (lei do idoso, prioridade): atendimento prioritário em todas as filas; cadeira de espera disponível; oferta de assistência sem prejuízo de autonomia
- **Pessoas com deficiência** (PCD): atendimento prioritário; acessibilidade física garantida (rampa, elevador, banheiro adaptado); atendimento em Libras quando colaborador qualificado presente
- **Gestantes** (3º trimestre visível): atendimento prioritário em filas; cadeira disponível; oferta de assistência para transportar produtos pesados
- **Crianças desacompanhadas**: protocolo de acolhimento + tentativa de contato com responsável + acionamento de autoridade competente em casos limites (Estatuto da Criança e Adolescente)
- **Pessoas em situação de vulnerabilidade**: respeito, cordialidade, oferta de auxílio sem julgamento; supervisor é envolvido em decisões com impacto reputacional

Treinamento específico em diversidade e inclusão (4h obrigatórias no onboarding) cobre essas categorias, com role-play e estudos de caso. Reciclagem anual de 2h.

### 5.8 Atendimento B2B em loja física

Cliente B2B (lojista, restaurante, hotel, escritório) que entra em loja física tem fluxo de atendimento diferenciado:

1. Identificação do cliente como B2B (CNPJ informado ou cadastro Apex+ B2B).
2. Direcionamento a balcão B2B (em anchors) ou atendente especializado (em lojas menores).
3. Discussão da necessidade técnica + escala do pedido.
4. Cotação personalizada com tabela B2B (preços diferenciados).
5. Negociação de condição de pagamento (boleto 30/60/90, PIX antecipado com desconto, cartão corporativo).
6. Fechamento do pedido com NF-e B2B (CFOP 5102 ou 5403 conforme regime ST).
7. Programação de entrega ou retirada na loja (B2B grande tipicamente entrega).
8. Comunicação pós-venda com gerente de conta B2B para acompanhamento.

Anchors específicas têm "Balcão B2B" físico permanente; outras lojas usam o mesmo balcão de atendimento regular com fluxo dedicado em horários específicos (manhãs ou inicio de tarde, tipicamente).

---

## CAPÍTULO 6 — Expedição B2B

### 6.1 Picking B2B com lista do CD

Pedidos B2B (lojistas terceiros, restaurantes, hotéis, escritórios, contratos corporativos) tipicamente têm ticket médio acima de R$ 5.000 e exigem nível de serviço diferenciado. O WMS prioriza pedidos B2B sobre B2C em janelas de cross-docking expresso.

A lista de picking B2B é gerada pelo WMS ordenada por endereço de coleta (otimização de rota dentro do CD). Operador recebe a lista no RF-gun e percorre o CD coletando os SKUs em sequência. Tempo médio de picking para pedido B2B típico (8-15 SKUs): 12 minutos.

O caso **TKT-28** (loja Iguatemi vendeu 67% da coleção masculina inverno em 4 dias, contra expectativa de 3 semanas, e solicitou reposição expressa via cross-docking) é exemplo típico de gatilho de cross-docking expresso. Procedimento:

1. **WMS prioriza o pedido** com flag "expresso" (visualmente destacado em vermelho no painel do CD).
2. **Operador A faz picking** seguindo lista otimizada.
3. **Operador B confere** a carga separada (4-eyes principle obrigatório em expresso).
4. **Coordenador autoriza expedição** (assinatura digital no app do coordenador).
5. **Carga sai mesmo dia** se solicitação foi recebida antes das 14h · D+1 se após 14h.

Custo do cross-docking expresso é absorvido pela loja solicitante a partir do contrato interno de SLA — tipicamente +R$ 240 a +R$ 1.870 conforme distância e janela exigida (cf. tabela 6.5).

O cross-docking expresso é gerenciado por sistema dedicado (módulo Manhattan Active Yard Management 2024) integrado ao WMS principal. O painel do coordenador do CD-Cajamar apresenta a fila de pedidos expressos por horário previsto de saída, com alertas visuais para janelas críticas (próximas de saturação). O coordenador tem autoridade para realocar operadores entre frentes de trabalho conforme demanda, podendo paralizar temporariamente atividades de menor prioridade (inventário cíclico, reorganização de slow-moving) para liberar mão-de-obra para expedição B2B expressa.

Em situações de pico de demanda (campanhas comerciais, datas sazonais, eventos imprevistos), o cross-docking expresso pode acionar turno extra contratado em regime de horas extras (CCT do varejo paulista permite até 2h extras/dia com 50% de adicional). Decisão de acionar turno extra é da gerência do CD-Cajamar, com aprovação retroativa do gerente regional de operações em até 24h. O custo médio de turno extra completo (10 operadores + 2 supervisores por 4h) é R$ 8.400 e é debitado da unidade comercial solicitante.

A operação de cross-docking expresso requer rastreabilidade total no WMS: cada SKU é registrado em três pontos (entrada do palete no CD, separação na lista de picking expressa, saída na conferência cega de saída). Em caso de divergência detectada após a expedição (loja recebe e identifica erro), o WMS permite rastrear retroativamente onde a divergência ocorreu, atribuindo responsabilidade ao operador específico para fins de KPI individual e treinamento corretivo.

### 6.2 Conferência cega de saída

A conferência cega de saída espelha a conferência cega de entrada (cf. seção 2.4). Operador de saída NÃO vê quantidade esperada — faz contagem sealed-input independente, e sistema valida.

Tolerância de divergência:

- Pedidos B2C (ticket médio R$ 92 a R$ 1.870): ±1 unidade quando pedido tem ≥20 SKUs.
- Pedidos B2B regulares (≥R$ 5.000): zero divergência tolerável.
- Pedidos B2B críticos (linha branca, eletrônicos >R$ 5.000 unitário): zero divergência + foto de cada palete antes do lacre.

O caso **TKT-7** é referência cruzada — a divergência detectada na entrada (loja Iguatemi recebeu peças trocadas) tem origem na saída do CD-Cajamar. A conferência cega de saída deveria ter detectado, mas o operador de saída desse caso usou contagem visual (não-sealed) por pressa, configurando desvio de procedimento. Auditoria interna determinou treinamento 100% da turma da tarde + monitoramento por 30 dias daquele operador.

A documentação fotográfica de saída é obrigatória para cargas críticas (>R$ 50.000) e cargas para clientes B2B classificados como estratégicos (top 20 lojistas terceiros + todos os contratos corporativos ativos >R$ 500k/ano). A foto inclui: visão geral do palete formado e lacrado, foto da etiqueta SSCC visível, foto do romaneio digital impresso (quando aplicável). As fotos são vinculadas ao número do romaneio no WMS e arquivadas por 12 meses (atendendo prazo decadencial de reclamação comercial em CDC).

Em casos de divergência reportada pelo cliente após o recebimento, a auditoria do CD-Cajamar começa pela conferência das fotos de saída e do log de conferência cega: se as fotos comprovam a saída correta, a divergência possivelmente ocorreu em trânsito (responsabilidade do transportador) ou no recebimento (responsabilidade do cliente). Se as fotos confirmam a divergência (palete saiu errado), a responsabilidade é Apex Group e a reposição expressa é acionada conforme procedimento da seção 6.1.

O coordenador do CD-Cajamar revisa semanalmente um relatório de KPIs por operador de saída, com foco em três métricas: taxa de divergência (meta ≤0.3%), tempo médio de conferência (meta ≤7 minutos/palete), aderência ao procedimento sealed-input (meta 100%). Operadores com performance abaixo da meta entram em programa de monitoramento com auditoria 100% das suas conferências por 30 dias.

### 6.3 Documentação fiscal

Toda expedição B2B inclui o conjunto documental:

| Documento | Função | Quando |
|---|---|---|
| NF-e | Fato gerador fiscal · ICMS, PIS, COFINS | Sempre |
| DANFE | Documento auxiliar · acompanha a carga | Sempre |
| ROMANEIO digital | Rastreio operacional · assinado no app motorista | Sempre |
| MDF-e | Manifesto eletrônico de documentos fiscais | Transporte próprio Apex Logística |
| CT-e | Conhecimento de transporte · transportador terceirizado | Transporte terceirizado |

CFOPs comuns aplicáveis:

- **5102** — Venda de mercadoria adquirida ou recebida de terceiros (dentro do estado)
- **6102** — Venda de mercadoria adquirida ou recebida de terceiros (interestadual)
- **5403** — Venda de mercadoria sujeita ao regime de substituição tributária
- **5405** — Venda em consignação
- **5910** — Remessa em bonificação, doação ou brinde
- **5917** — Remessa em consignação mercantil ou industrial
- **5927** — Lançamento efetuado a título de baixa de estoque (quebra)

Tempo de processamento NF-e ≤3 segundos (SEFAZ-SP em regime normal). Em caso de queda SEFAZ ou contingência (cenário **TKT-11**), o sistema emite NF-e local com chave provisória e retransmite automaticamente após restauração do serviço.

Cross-ref `runbook_sap_fi_integracao.pdf` (seção 2 — integração SAP FI → SEFAZ; seção 3 — tratamento de rejeições e contingência) e `politica_reembolso_lojista.pdf` (seção 7 — tratamento fiscal e SPED).

### 6.4 Carga consolidada vs fracionada

**Carga consolidada:** 1 caminhão = 1 destino. Tipicamente pedidos B2B grandes (≥10 paletes), com saída direta do CD-Cajamar. Veículo retorna vazio (ou com logística reversa). Custo unitário de frete menor, SLA mais ágil.

**Carga fracionada:** 1 caminhão = N destinos. Pedidos menores são consolidados em rota regional via CD intermediário. Cross-docking nos CDs regionais redistribui para entrega final. SLA maior, custo unitário menor para o solicitante.

| Porte | Tipo de carga | SLA típico | Custo unitário |
|---|---|---|---|
| Anchor shopping (1 destino · ≥15 paletes) | Consolidada | D+1 | R$ 380/palete |
| Loja de rua centro (1 destino · 5-14 paletes) | Consolidada | D+1 SP · D+2 interior · D+3 outras UFs | R$ 480/palete |
| Loja de bairro (5-10 paletes) | Fracionada via CD regional | D+2 a D+4 | R$ 580/palete |
| Lojistas terceiros B2B (1-30 paletes) | Fracionada | D+1 a D+5 conforme contrato | R$ 480 a R$ 920/palete |

### 6.5 SLA de entrega por região

| Região | SLA padrão | SLA expresso | Custo expresso adicional |
|---|---|---|---|
| Grande SP (anel viário Mário Covas) | D+1 | D0 (mesmo dia) | R$ 240 |
| Interior SP | D+2 | D+1 | R$ 420 |
| Demais Sudeste (RJ, MG, ES) | D+3 | D+2 | R$ 680 |
| Sul (RS, SC, PR) | D+4 | D+2 | R$ 980 |
| Centro-Oeste + Bahia | D+5 | D+3 | R$ 1.240 |
| Norte + Nordeste (exceto BA) | D+7 | D+5 | R$ 1.870 |

**Política de quebra de SLA:** quando a entrega real ultrapassa o prazo prometido em mais de 1 dia útil, o cliente recebe automaticamente cupom Apex+ de R$ 100 por dia de atraso, creditado na conta fidelidade em até 48h após a entrega efetiva. Quebras sistêmicas (>5% das entregas de uma rota em um mês) disparam revisão da rota com o transportador.

A apuração de SLA é executada por sistema interno (Apex+SLA) que consome eventos de rastreamento de cada transportador via API e calcula automaticamente o tempo decorrido entre saída do CD e entrega confirmada (com assinatura digital do destinatário no app do motorista). Eventos de rastreamento incluem: saída do CD, chegada em CD regional intermediário (se aplicável), saída do CD regional, em rota, tentativa de entrega, entrega confirmada, devolução por endereço errado.

Em casos de tentativa de entrega frustrada (cliente ausente, endereço incorreto, recusa do destinatário), o SLA é pausado até a próxima tentativa. O transportador tem 3 tentativas em dias consecutivos antes de devolver a carga ao CD origem. Após a terceira tentativa frustrada, o cliente recebe comunicação automatizada via app/email com opções: agendar nova tentativa, retirar em loja física ou em CD regional, ou cancelar e estornar.

Transportadores parceiros são auditados trimestralmente pela área de Vendor Management Logística. KPIs avaliados: tempo médio de trânsito vs SLA contratado, percentual de entregas no prazo, percentual de avarias em trânsito, NPS do cliente em relação à entrega. Transportadores com performance abaixo de meta entram em plano de ação 60 dias com acompanhamento mensal. Transportadores com performance crítica por 2 trimestres consecutivos podem ser substituídos.

Cobertura geográfica nacional Apex Group: 100% dos municípios da Grande SP, 98% dos municípios do interior SP, 95% dos municípios do Sudeste, 88% do Sul, 76% do Centro-Oeste e Bahia, 64% do Norte e Nordeste (exceto BA). Coberturas inferiores a 100% indicam municípios sem cobertura de transportador parceiro — nesses casos, o cliente pode optar por retirar em ponto comercial mais próximo ou aguardar entrega via transportador alternativo (com SLA estendido).

---

### 6.6 Contratos corporativos (mobiliário, equipamentos)

Pedidos B2B de alto valor (>R$ 100.000) tipicamente vêm de contratos corporativos: empresas mobiliando novos escritórios, hotéis renovando quartos, redes de restaurantes adquirindo equipamentos.

Operação especializada para contratos:

1. Pré-venda: gerente de contas B2B + arquiteto/designer interno conduzem visita técnica ao cliente.
2. Proposta: especificação técnica + cronograma + condições comerciais. Aprovação em até 7 dias úteis.
3. Confirmação: cliente assina contrato + paga sinal (tipicamente 30%).
4. Produção: pedidos a fornecedores são feitos com prazo estendido (até 90 dias para itens sob encomenda).
5. Recebimento e armazenagem no CD-Cajamar com tag de projeto.
6. Entrega coordenada: gerente de contas + operação logística + cliente alinham janela.
7. Montagem (Apex Casa): equipe de montagem agendada com cliente.
8. Aceitação: cliente confirma recebimento + montagem + funcionalidade.
9. Pagamento final: saldo de 70% pago em até 30 dias após aceitação.
10. Pós-venda: gerente de contas mantém relacionamento + identifica oportunidades futuras.

Exemplo de cenário: empresa de tecnologia abrindo 5 unidades em SP (Berrini, Faria Lima, Vila Olímpia, Pinheiros, Itaim) pediu orçamento single-source com mesas, cadeiras ergonômicas, salas de reunião + decoração. Total estimado R$ 2.4M. Comercial B2B + arquiteto interno montam proposta em 7 dias úteis com lista detalhada de SKUs, opções de variação, e cronograma de instalação por unidade.

### 6.7 Programa de fornecedor preferencial Apex+

Lojistas B2B com volume contínuo (>R$ 500.000/ano) podem ser convidados ao programa "Apex+ Fornecedor Preferencial", que oferece:

- Tabela de preços com desconto de 5% a 12% sobre B2B padrão (negociado por volume)
- Crédito rotativo de até R$ 200.000 com aprovação Cardif Brasil
- Gerente de contas dedicado
- SLA expresso (D+1 SP, D+2 Sul/Sudeste, D+3 demais regiões)
- Acesso prioritário a produtos em ruptura (alocação preferencial)
- Catálogo personalizado on-line
- Reuniões trimestrais de revisão comercial

Critérios para ingresso: volume mínimo, regularidade de pagamento (sem atrasos >30 dias nos últimos 12 meses), compliance fiscal (CND válida, regularidade tributária), porte (CNPJ ativo há ≥3 anos), score Apex+ Risco (modelo interno de credito).

Em **2025**, 187 lojistas B2B estavam no programa, representando 42% do faturamento B2B total Apex Group. Programa cresce 18% ao ano em número de participantes.

---

## CAPÍTULO 7 — Logística reversa

### 7.1 Recebimento de devolução

A logística reversa recebe SKUs de quatro origens distintas, com tratamento diferenciado:

| Origem | Estado típico | Ação |
|---|---|---|
| Cliente final B2C em loja | Variado | Triagem imediata pelo Diego · OK→revenda · avaria→seção 7.2 |
| Cliente final B2C via transportadora | Variado · embalagem do cliente | Conferência cega no CD-Cajamar · regra igual à acima |
| Lojista B2B · troca de coleção | Geralmente OK | Conferência com romaneio · revenda como outlet |
| Lojista B2B · divergência de pedido (TKT-7) | Variado | Conferência com romaneio · ajuste de NF |

Procedimento numerado da devolução B2C em loja (P1-P9):

1. Cliente apresenta produto + comprovante (cupom NFC-e, app Apex+ ou CPF).
2. Operador identifica o motivo (questionário do app).
3. Sistema valida prazo CDC (cálculo automático).
4. Inspeção física: foto via app se houver defeito ou avaria.
5. Sistema sugere a ação conforme tabela seção 5.3.
6. Operador confirma e abre o processo.
7. Emissão de NF de devolução (CFOP 1202 dentro do estado · 2202 interestadual).
8. Estorno via Cielo (cartão original) ou PIX (CDC art. 49 §1º · até 7 dias úteis).
9. Sistema atualiza estoque com tag reverse-tag (cf. seção 7.3).

Cross-ref `faq_pedidos_devolucao.pdf` (políticas comerciais detalhadas) e `politica_reembolso_lojista.pdf` (alçadas financeiras de cortesia).

### 7.2 Triagem para vitrine de outlet vs descarte

A rede outlet Apex compreende 6 lojas paralelas (Vila Olímpia, Pinheiros, Tatuapé, Mooca, Penha e Vila Mariana), além de outlets sazonais em shoppings periféricos. Outlets recebem:

- SKUs devolvidos com pequena avaria estética (arranhão, amassado, embalagem rasgada).
- Fim de coleção Apex Moda (ao final de cada coleção, saldos vão para outlet).
- Amostras de fornecedor cedidas para teste.
- SKUs de outlet recebidos via reverse-tag.

Tabela estado × destino × preço:

| Estado | Destino | Preço |
|---|---|---|
| Defeito estético leve (arranhão menor) | Outlet | -40% sobre tabela |
| Defeito estético médio (amassado visível) | Outlet | -55% sobre tabela |
| Defeito funcional reversível (necessita reparo simples) | Oficina interna · depois outlet | -40% sobre tabela após reparo |
| Defeito funcional irreversível (peça queimada, irrecuperável) | Descarte controlado | NF de quebra (CFOP 5927) |

Membros Apex+ Premium têm acesso prioritário a peças exclusivas do outlet (notificação push 48h antes do público geral). Esse benefício compõe o pacote de fidelidade premium (cf. seção 5.4).

Outlets operam com margem reduzida (-3 a -5 pontos sobre margem padrão Apex Group), mas geram tráfego significativo de oportunidade e fidelização. KPI de NPS outlet ≥75 (acima do NPS loja física padrão de ≥72), porque a expectativa do cliente de outlet é diferente.

A operação de outlet tem particularidades operacionais importantes: (a) reposição é diária e não-padronizada (depende do fluxo de devoluções e descontinuações da semana, sem planograma fixo); (b) etiquetagem é manual em 30% dos SKUs (não há etiqueta EAN-13 padrão para peças únicas remanescentes); (c) políticas de devolução são MAIS rígidas que loja regular (peças de outlet têm devolução em 7 dias úteis apenas via troca, sem estorno em dinheiro — política comunicada na etiqueta de cada peça).

A relação entre o outlet e o cliente Apex+ Premium tem natureza promocional: o cliente premium recebe notificação push 48h antes do público geral sobre novas peças disponíveis em outlet. Esse benefício gera engajamento (clientes premium frequentam outlets de Apex+ com taxa 3,4x maior que cliente Apex Basic) e fidelização (taxa de churn de Premium em -32% comparado ao Basic, no histórico Q1-2024 a Q1-2026).

A oficina interna de reparo opera no CD-Cajamar com equipe de 8 técnicos especializados em 4 categorias: eletrônicos pequenos (smartphones, smartwatches), eletrônicos linha branca (TVs, monitors), móveis e estofados (com ajudante de marcenaria), pequenos eletroportáteis. A oficina recebe peças com defeito funcional reversível e devolve aptas para revenda em outlet em prazo médio de 7 a 14 dias. Custo médio de reparo absorvido como despesa operacional: R$ 280/peça eletrônica pequena, R$ 480/peça linha branca, R$ 380/peça moveleira.

### 7.3 Reverse fulfillment integrado com CD

O WMS Manhattan suporta SKUs com **reverse-tag** — códigos de barras diferenciados (prefixo `R-`) que marcam a entrada do SKU em logística reversa. Reverse-tag é obrigatória para:

| Categoria | Marca |
|---|---|
| Linha branca | Apex Tech |
| Móveis | Apex Casa |
| Eletrônicos >R$ 800 | Apex Tech |
| Smartphones e tablets | Apex Tech |

Quando o reverse-tag entra no CD-Cajamar:

1. Conferência cega registra a quantidade.
2. Inspeção visual classifica o estado (cf. tabela 7.2).
3. WMS decide destino: revenda, outlet, oficina, descarte.
4. Tempo médio do recebimento à decisão: D+2 a D+5.

KPI de **reverse fulfillment rate** (percentual de devoluções processadas dentro do SLA de 5 dias úteis): meta ≥92%. Apurado mensalmente pelo coordenador do CD-Cajamar.

Procedimento numerado do reverse fulfillment (P1-P10):

1. Devolução chega no CD-Cajamar (loja, transportadora ou cliente direto).
2. Operador identifica reverse-tag no SKU (prefixo R-) e registra entrada no WMS.
3. Conferente especializado em reverse executa inspeção visual completa (estado externo + funcional quando aplicável).
4. Classificação em uma das 4 categorias (revenda, outlet, oficina, descarte) conforme tabela 7.2.
5. SKU é direcionado para zona correspondente do CD (zona padrão para revenda, zona R-OUT para outlet, zona OFICINA, zona DESCARTE).
6. Para SKUs encaminhados à oficina, é gerada ordem de serviço com prazo de reparo previsto.
7. Para SKUs encaminhados para descarte, NF de quebra (CFOP 5927) é emitida no mesmo dia.
8. Sistema atualiza estoque com tag de origem (reverse-tag → estoque revenda, ou outlet, etc).
9. Relatório semanal de reverse fulfillment é enviado ao gerente comercial e ao coordenador.
10. Métricas (lead time, taxa de revenda vs descarte, perda financeira) são consolidadas mensalmente.

A eficiência operacional do reverse fulfillment é medida pela "taxa de aproveitamento" — percentual do valor de SKUs devolvidos que retorna ao estoque comercial (vs descarte). Meta Apex Group: ≥72%. Apex Mercado tipicamente atinge 45-55% (perecíveis têm menor aproveitamento), Apex Tech atinge 75-85% (eletrônicos com defeito têm reparo viável), Apex Moda atinge 78-88% (fashion com avaria estética vai para outlet), Apex Casa atinge 65-75% (móveis com avaria são mais difíceis de reparar).

O custo médio do reverse fulfillment Apex Group em 2025 foi de R$ 18M, equivalente a 0.38% do faturamento total. Esse custo é considerado investimento em experiência do cliente — políticas de devolução mais permissivas geram NPS maior e LTV (Lifetime Value) significativamente maior.

### 7.4 Garantia técnica + chamado de assistência

A garantia legal CDC é de 90 dias para bens de consumo e 30 dias para serviços (art. 26 CDC). A garantia de fábrica varia por categoria:

| Categoria | Garantia fábrica padrão |
|---|---|
| Eletrodomésticos linha branca | 12 meses |
| Eletrônicos pessoais (TV, notebook, celular) | 12 meses |
| Móveis estofados | 24 meses (cobertura mecanismo · 12 meses tecido) |
| Pequenos eletroportáteis (batedeira, secador) | 6 meses |
| Peças e acessórios genéricos | 6 meses |

A **garantia estendida Apex** (produto financeiro gerenciado pela Cardif Brasil, parceria Apex Group) é contratável no momento da compra ou em até 30 dias após. Cobre 1, 2 ou 3 anos adicionais conforme escolha, com cobertura de defeitos mecânicos e elétricos não-causados por uso indevido. Carência de 90 dias para aciamento. Cross-ref `faq_pedidos_devolucao.pdf` (seção 5 — garantia estendida políticas detalhadas).

Procedimento numerado da abertura de chamado de assistência (P1-P7):

1. Cliente abre chamado via app Apex+ (recomendado), 0800 (operador) ou e-mail SAC.
2. Sistema valida o produto (NF-e original + número de série).
3. Sistema confirma vigência da garantia (legal, fábrica ou estendida).
4. Técnico autorizado da marca (rede própria ou terceirizada) recebe ordem de serviço.
5. Visita técnica agendada conforme tabela `faq_horario_atendimento.pdf` seção 3.2 (visitas Apex Tech 4h janelas).
6. Laudo técnico emitido em até 7 dias úteis após visita.
7. Decisão: reparo (custo dentro da garantia), troca (defeito irreparável), recusa (uso indevido) ou escalação para Marina (casos especiais).

---

### 7.5 Logística reversa de embalagem e resíduos (PNRS)

Apex Group é signatária do Termo de Compromisso PNRS (Política Nacional de Resíduos Sólidos, Lei 12.305/2010) com responsabilidade compartilhada de recuperação de embalagens. Procedimento:

- **Pilhas e baterias**: ponto de coleta em todas as lojas, com tambor identificado; coleta semanal por empresa licenciada (Suzaquim ou equivalente)
- **Lâmpadas (fluorescentes, LED)**: ponto de coleta em lojas Apex Mercado e Apex Tech selecionadas; coleta mensal
- **Eletroeletrônicos** (em desuso): programa "Apex+ Recicla" com pontos de coleta em anchors; cliente leva item antigo + recebe cupom Apex+ 500 pontos (R$ 25)
- **Embalagens primárias** (sacolas, embalagens dos produtos): coleta seletiva interna + parceria com cooperativas de catadores
- **Eletrodomésticos linha branca** (descarte): programa "Apex+ Troca" — cliente compra novo eletrodoméstico, Apex retira antigo, encaminha para reciclador licenciado (sucateamento)

KPI de reciclagem Apex Group em 2025: 47% das embalagens recuperadas/recicladas (meta nacional PNRS: 22% em 2030, Apex está adiantada). 78% dos eletroeletrônicos doados/trocados foram encaminhados para reciclagem rastreada.

### 7.6 Recall de produto

Procedimento de recall quando fornecedor identifica defeito crítico em produto já vendido:

1. Fornecedor notifica Apex Group sobre o recall (motivo, lote afetado, risco, ação corretiva).
2. Apex Group identifica clientes que compraram o SKU/lote afetado (via histórico de NF-e e CPF Apex+).
3. Comunicação proativa: e-mail + SMS + push para clientes identificados; anúncio em sites e app; comunicado em loja com cartaz visível.
4. Cliente leva produto à loja ou solicita coleta domiciliar (Apex absorve custo).
5. Loja recebe o produto e emite NF de devolução com referência ao recall.
6. Cliente recebe: substituição do produto (preferencial) ou estorno integral (alternativa).
7. SKU recolhido é devolvido ao fornecedor com NF de devolução de recall.
8. Acompanhamento mensal do progresso do recall até atingir 100% dos clientes identificados ou prazo de 12 meses (o que ocorrer primeiro).

Casos históricos de recall conduzidos: liquidificador Apex marca própria (problema na pá, 2024, 4.700 unidades recolhidas em 8 meses); carrinho de bebê marca terceira (problema na trava, 2025, 1.200 unidades recolhidas em 6 meses). Em ambos os casos, 100% dos clientes identificados foram contatados e o produto foi recolhido sem custo adicional.

### 7.7 Garantia de fábrica — tratamento operacional

Quando cliente aciona garantia de fábrica, o procedimento varia conforme acordo com o fornecedor:

| Modelo | Operação | Exemplos |
|---|---|---|
| **Garantia direta** | Cliente leva produto à assistência técnica do fornecedor | Samsung, LG, Apple (assistências próprias) |
| **Garantia retorno** | Cliente leva à loja Apex; Apex envia ao fornecedor; fornecedor retorna | Eletrodomésticos linha branca de marcas menores |
| **Garantia balcão** | Apex tem técnico interno autorizado a reparar/substituir | Eletroportáteis pequenos, alguns smartphones |
| **Garantia troca** | Apex substitui imediatamente; gerencia troca com fornecedor | Itens de menor valor |

O fluxo "garantia balcão" e "garantia troca" são preferidos para experiência do cliente (resolução imediata). O fluxo "garantia direta" gera maior fricção mas é padrão da indústria para itens complexos.

A Apex Group mantém SLA com fornecedores classe A: prazo de resolução de garantia ≤21 dias úteis. Fornecedores que ultrapassam SLA repetidamente são penalizados via desconto em fatura futura (cláusula contratual padrão de SLA de pós-venda).

---

## CAPÍTULO 8 — Performance e auditoria

### 8.1 KPIs operacionais por loja (mensal)

Todo dia 5 do mês seguinte, o painel consolidado mensal é entregue ao gerente de loja. Composição:

- **NPS loja física** (meta ≥72)
- **Ticket médio** (varia por marca)
- **Conversão pisada→checkout** (meta ≥18%)
- **Ruptura de gôndola média mensal** (meta ≤2.5%)
- **Perda operacional** (meta ≤0.8% do faturamento)
- **Aderência ao planograma** (meta ≥95%)
- **Giro médio do estoque** (varia por marca; Apex Mercado ≥18 giros/ano · Apex Moda ≥6 · Apex Casa ≥4 · Apex Tech ≥8)
- **NPS pós-venda** (meta ≥70)
- **Cobertura de escala** (% de turnos preenchidos pela escala planejada · meta ≥98%)
- **Banco de horas saldo** (meta saldo positivo ≤60h por colaborador, conforme CCT varejo SP)

Comparativos automáticos:

- Vs loja peer (mesmo porte, mesma região, mesma marca)
- Vs mês anterior (variação percentual)
- Vs meta corporativa (gap absoluto + percentual)

A reunião mensal de operação ocorre em dia 10 (ou primeiro dia útil seguinte), 2h fixas. Participantes: gerente de loja, supervisores de turno, líder de Prevenção de Perdas (quando perda >1%). Output: plano de ação 30 dias com 3-5 itens priorizados.

A pauta padrão da reunião mensal segue ordem fixa: (1) Revisão dos KPIs do mês anterior vs meta e vs mês anterior (15 min); (2) Análise de variâncias significativas, com discussão da causa-raiz (30 min); (3) Apresentação do plano de ação do mês anterior e status de execução (20 min); (4) Definição do plano de ação do mês corrente (40 min); (5) Comunicações corporativas, anúncios, treinamentos (15 min). Total: 2h. Ata é gerada automaticamente via app interno e arquivada por 5 anos.

Reuniões trimestrais com o gerente regional incluem revisão consolidada de 3 meses, comparativo entre lojas peer, identificação de melhores práticas para replicação na rede e discussão estratégica de iniciativas regionais (campanhas, contratações, investimentos). Reuniões anuais com Lia (Head Atendimento) e o gerente regional revisam performance anual completa da loja, definem metas para o ano seguinte e ajustam estrutura organizacional se necessário.

Performance excepcional (top 10% das lojas em NPS + ticket médio + perda combinados) gera reconhecimento corporativo: bônus financeiro para o gerente (R$ 8.400 a R$ 18.700 conforme posição no ranking), bônus para a equipe (cesta de Natal ampliada, viagem-prêmio para liderança), exposição em comunicação interna (newsletter mensal Apex+Pessoas), oportunidade de visita técnica a outra loja peer para troca de conhecimento.

### 8.2 Auditoria interna trimestral

A auditoria interna trimestral aplica um checklist de **80 itens** distribuídos em 8 blocos de 10:

1. **Documentação** (alvarás municipais, AVCB, ANVISA quando aplicável, contratos com fornecedores chave)
2. **Recebimento e doca** (cf. capítulo 2 deste manual)
3. **Estocagem** (cf. capítulo 3)
4. **Exposição e PDV** (cf. capítulo 4)
5. **Atendimento e devolução** (cf. capítulo 5)
6. **Operação POS e fiscal** (PDV, NFC-e, fechamento de caixa)
7. **RH e jornada** (escala, banco de horas, eSocial — cross-ref `politica_dados_lgpd.pdf` para LGPD em dados de colaborador)
8. **Limpeza e EPI** (cronograma de limpeza + uso de EPI nas categorias aplicáveis)

Critério de aprovação: ≥72/80 pontos (90% de conformidade). Reprovação dispara plano de ação 30 dias com reauditoria. Reprovação em duas auditorias consecutivas escala para Marina (Tier 2) e pode resultar em substituição do gerente da loja.

O auditor responsável é rotativo entre lojas — nunca audita a própria unidade. Auditores são supervisores de outras lojas treinados no checklist (16h de treinamento inicial + atualizações trimestrais). Auditoria leva tipicamente 1 dia útil em loja de bairro e 2 dias úteis em anchor.

Cada item do checklist tem critério objetivo de avaliação (sim/não/parcial), com peso definido conforme criticidade. Itens críticos (segurança, fiscal, sanitário em lojas com fresh) têm peso 2; itens importantes (atendimento, prevenção de perdas) têm peso 1.5; demais itens têm peso 1. A pontuação final é a soma dos pesos dos itens conformes vs total possível.

Os 80 itens são versionados anualmente — itens novos podem ser adicionados quando há mudança regulatória ou política corporativa, e itens podem ser retirados quando se tornam obsoletos. Mudanças de checklist são comunicadas aos auditores e gerentes via COP (Comunicação Operacional) em dezembro, com efetividade no primeiro trimestre do ano seguinte.

Exemplo de itens do bloco "Operação POS e fiscal":

1. Cupom NFC-e impresso em todas as vendas, sem exceção (peso 2)
2. CCe (cancelamento) só executado mediante autorização de supervisor (peso 1.5)
3. Reconciliação Cielo do mês anterior fechada sem divergência (peso 2)
4. Estoque do sistema vs estoque físico em sample de 20 SKUs (peso 1.5)
5. Treinamento POS atualizado para todos os caixas escalados (peso 1)
6. Contingência off-line testada nos últimos 30 dias (peso 1.5)
7. Fundo de caixa físico bate com sistema, em todos os caixas (peso 1)
8. Sangria diária registrada corretamente (peso 1)
9. Cofre de boca-de-leão lacrado e auditado pela transportadora de valores (peso 2)
10. Documentação fiscal (DARFs, GIA, SPED) arquivada e acessível (peso 1.5)

O resultado consolidado da auditoria é apresentado ao gerente da loja em reunião de até 1h imediatamente após o encerramento, com plano de ação para itens não-conformes assinado pelo gerente. Itens críticos não-conformes (peso 2 com pontuação zero) podem disparar auditoria de retorno em 14 dias úteis.

### 8.3 Auditoria externa ANVISA (lojas com fresh)

Aplicável a:

- Apex Mercado (todas as unidades com fresh)
- Apex Farma (todas as unidades — drogarias)
- Apex Beauty (subset com fresh — cosméticos com manipulação local)
- ApexFood (todas — restaurantes em food courts)

Frequência: 1 visita/ano por unidade, com possibilidade de visitas adicionais sem aviso prévio quando há denúncia ou alerta epidemiológico regional. Classificação de risco da unidade (alto, médio, baixo) influencia a frequência — unidades de alto risco podem receber visitas trimestrais.

Pontos críticos avaliados:

- **Cold chain** (cf. seção 2.3 — limites de temperatura por categoria, datalogger, registro)
- **Validade de produtos** (rotina FEFO, descarte de produtos vencidos com NF de quebra)
- **Higienização de equipamentos** (refrigeradores, balcões frios, fatiadores, balanças)
- **Controle de pragas** (contrato com empresa licenciada — Rentokil ou equivalente — vistorias mensais documentadas)
- **Capacitação de manipuladores** (curso "Boas Práticas em Manipulação de Alimentos" de 8h, com renovação a cada 24 meses)
- **Documentação sanitária** (alvará sanitário em validade, autorização especial quando aplicável)

Em caso de notificação ANVISA com TAC (Termo de Ajustamento de Conduta), o prazo de regularização varia entre 30 e 90 dias dependendo da gravidade. Não-cumprimento configura multa e, em casos graves, interdição da unidade.

A área de Compliance Apex Group mantém calendário consolidado de auditorias regulatórias para todas as unidades, com antecipação de pelo menos 60 dias de visitas previstas. Programas internos de "auditoria simulada" são executados trimestralmente em amostra de 12 unidades — auditor interno simula procedimento ANVISA real, identifica gaps e dispara ações corretivas antes da visita oficial.

Documentação obrigatória mantida em cada loja com fresh:

- Alvará sanitário (validade conforme estado/município)
- Manual de Boas Práticas em Manipulação de Alimentos atualizado
- Registros diários de temperatura de equipamentos refrigerados (com responsável identificado)
- Registros de limpeza e desinfecção (com produto utilizado e validade)
- Comprovantes de capacitação dos manipuladores (curso 8h dentro da validade)
- Contrato de controle de pragas vigente + atas das vistorias
- Plano de Gerenciamento de Resíduos (quando aplicável conforme PGRSS)
- Atestados de saúde dos manipuladores (quando aplicável)

Em lojas Apex Mercado, a temperatura de refrigeradores é registrada eletronicamente a cada 30 minutos via sensores conectados ao WMS. Em caso de elevação de temperatura acima do limite (5°C para refrigeradores, -18°C para freezers), alerta é gerado imediatamente para o líder de setor, que toma ação corretiva (verificar fechamento de porta, acionar manutenção, transferir produtos para outro equipamento se necessário).

O parceiro Rentokil (controle de pragas) realiza vistorias mensais em todas as lojas Apex Mercado, com relatório fotográfico das armadilhas, identificação de espécies e plano de ação quando há indício de infestação. Vistorias adicionais são executadas em casos de chamado emergencial (avistamento de praga por colaborador ou cliente).

### 8.4 Auditoria externa Receita Federal SPED

Apex Group transmite mensalmente:

| Documento SPED | Vencimento |
|---|---|
| SPED Fiscal (EFD-ICMS/IPI) | Dia 25 do mês seguinte |
| SPED Contribuições (EFD-PIS/COFINS) | Dia 25 do mês seguinte |
| EFD-Reinf (retenções federais) | Dia 15 do mês seguinte |
| ECD (Escrituração Contábil Digital) | Anual · até último dia útil de maio do ano seguinte |
| eSocial (folha e eventos trabalhistas) | Eventos com prazos próprios — folha mensal até dia 7 |

Em caso de fiscalização presencial da Receita Federal, a gerência financeira corporativa coordena a resposta. A loja apenas fornece a documentação solicitada (NFs, romaneios, cupons, cartões-ponto) — não responde diretamente ao fiscal. Cross-ref `politica_reembolso_lojista.pdf` (seção 7 — tratamento de tributos, SPED, retenções).

A área de Tributário Apex Group mantém calendário de transmissões fiscais e responsabilidade clara: gerência financeira corporativa (Carla CFO + equipe) é responsável pela transmissão de todos os SPED federais; cada loja é responsável apenas por garantir que NFs, cupons e demais documentos fiscais estejam corretamente lançados em sistema (Linx Big para B2C, módulo de comércio do SAP ERP para B2B).

Discrepâncias detectadas durante validação SPED disparam ajuste retroativo conforme procedimento padrão: o sistema gera notificação ao gerente da loja e ao gerente comercial responsável; ajuste é executado em até 5 dias úteis; transmissão SPED é retransmitida no prazo legal. Reincidência de discrepâncias na mesma loja em 3 meses consecutivos dispara revisão de procedimento + treinamento adicional.

Em casos de fiscalização presencial (operação Receita Federal, Posto Fiscal Estadual, fiscalização sanitária, fiscalização trabalhista), o gerente da loja segue protocolo: (a) acolhe o fiscal cordialmente, oferece água e local privativo; (b) identifica-se com crachá funcional; (c) solicita identificação funcional do fiscal e registra os dados (nome, matrícula, órgão); (d) aciona imediatamente a gerência regional e o jurídico Apex Group via canal de emergência; (e) coopera plenamente com solicitações de documentos, sem responder a perguntas além das tecnicamente necessárias (deixa o jurídico mediar); (f) registra todos os documentos solicitados/entregues em ata.

Treinamento de gerentes em "Resposta a Fiscalização" tem 8h de duração no onboarding gerencial e reciclagem anual de 2h, com role-play de situações comuns. O objetivo é preparar a liderança da loja para receber fiscalização sem improviso, mantendo a relação cooperativa e tecnicamente defensável.

### 8.5 Treinamento obrigatório

Onboarding (40h nos primeiros 7 dias úteis):

| Módulo | Carga | Categoria |
|---|---|---|
| Cultura Apex | 4h | Todos |
| Operação POS | 8h | Operadores de caixa |
| Cold chain | 4h | Apex Mercado · Apex Farma · Apex Beauty fresh |
| LGPD básico | 4h | Todos (cross-ref `politica_dados_lgpd.pdf` seção 8) |
| Atendimento Apex | 4h | Todos com contato com cliente |
| Prevenção de perdas | 4h | Todos |
| Saúde e segurança | 4h | Todos · 16h adicionais para zona G (NR-20) |
| Avaliação prática supervisionada | 8h | Todos |

Reciclagem anual (16h):

| Módulo | Carga | Categoria |
|---|---|---|
| Atualizações de procedimento | 4h | Todos |
| LGPD reciclagem | 2h | Todos |
| Cold chain reciclagem | 2h | Apex Mercado · Apex Farma · Apex Beauty fresh |
| NR-20 reciclagem | 4h | Zona G CD-Cajamar |
| Cultura Apex | 2h | Todos |
| Avaliação | 2h | Todos |

Treinamento é registrado em sistema interno com PDF assinado eletronicamente do certificado, integrado ao eSocial S-2220 (monitoramento de saúde do trabalhador) e S-2230 (afastamentos quando aplicável).

A área de Apex+Educação opera plataforma de e-learning integrada (Apex+Aprende), com cursos modulares e avaliação automatizada. Os cursos obrigatórios geram certificado digital com QR Code de validação, e o sistema impede que colaborador inicie turno sem o treinamento mínimo concluído. Reciclagens são programadas automaticamente com 30 dias de antecedência, e colaboradores recebem lembretes por e-mail e push.

Para funções operacionais críticas (operadores de empilhadeira NR-11, manipuladores de alimentos, brigadistas NR-23, operadores de zona G NR-20), os certificados são obrigatórios para a manutenção da função, e a expiração configura impedimento de exercício até a renovação. O sistema bloqueia automaticamente o acesso à função expirada e notifica o supervisor e o RH para reagendamento imediato do curso.

Estatísticas de treinamento Apex Group 2025: 8.000 colaboradores diretos receberam em média 24h de treinamento; 94% de aderência aos cursos obrigatórios no primeiro semestre; 87% de aprovação na avaliação prática supervisionada do onboarding; investimento total em educação corporativa de R$ 4.8M (R$ 600/colaborador/ano em média).

Programas adicionais de desenvolvimento (não-obrigatórios) incluem: bolsas de graduação (parceria com Anhanguera, Estácio e Unicsul — desconto de 50% a 80%), pós-graduação para liderança (parceria com FGV, Insper, ESPM — desconto de 30%), cursos de inglês on-line (Wizard Corporativo), MBAs internos em Gestão Varejista (turma anual de 30 vagas para gerentes selecionados).

### 8.6 Saúde ocupacional

Médico do trabalho terceirizado opera segunda a sexta das 08h às 12h, com capacidade de 4 exames por dia (parceria Apex+Med, cobertura nacional). Cross-ref `faq_horario_atendimento.pdf` seção 3.4.

O caso **TKT-40** (12 motoristas com exames periódicos vencendo em 30 dias) ilustra o típico procedimento de planejamento: a área de RH-Folha mantém calendário automatizado de vencimentos e dispara alerta 45 dias antes. Lista é enviada ao parceiro de medicina ocupacional, que aloca slots conforme capacidade.

Exames periódicos obrigatórios:

| Função | Exames | Periodicidade |
|---|---|---|
| Admissional | Clínico, audiometria, hemograma | Antes do início |
| Periódico (geral) | Clínico, audiometria | Anual |
| Demissional | Clínico | No desligamento |
| Retorno ao trabalho | Clínico (compatível com afastamento) | Após afastamento >15 dias |
| Mudança de função | Clínico (compatível com nova função) | Na mudança |
| Motoristas | Toxicológico + audiometria + clínico (Lei 13.103/2015 · Lei do Caminhoneiro) | Conforme ANTT |
| Operadores de empilhadeira | Clínico + ortopédico | Anual |
| Repositores manuseando >25kg/dia | Clínico + ortopédico | Anual |

CIPA (Comissão Interna de Prevenção de Acidentes) é eleita anualmente em cada loja com mais de 50 colaboradores, com reuniões mensais documentadas. Ata enviada ao eSocial S-2240. CIPA conduz inspeções de segurança e elabora o Mapa de Riscos atualizado anualmente.

O Mapa de Riscos identifica os perigos por área (físicos, químicos, biológicos, ergonômicos, de acidente), com a representação visual padronizada (círculos coloridos por categoria, tamanho proporcional à gravidade). O mapa é afixado em local visível em cada loja e atualizado anualmente após inspeção da CIPA.

Programas Apex Saúde (benefícios e prevenção) operacionais:

- Plano de saúde Sulamerica (cobertura ambulatorial + hospitalar + dental) — coparticipação simbólica de R$ 12/mês para colaborador
- Vale-medicamentos R$ 80/mês com farmácia conveniada (rede Drogarias Pacheco + Apex Farma)
- Plano odontológico Uniodonto (sem coparticipação)
- Auxílio-creche para colaboradoras com filhos até 6 anos (R$ 480/mês)
- Auxílio-funeral para casos de luto em primeiro grau (R$ 4.700)
- Programa Apex+Mind (apoio psicológico on-line gratuito) — atendimento via app
- Ginástica laboral 3x/semana em horário de turno (loja anchor) ou semanal (loja de bairro)
- Vacinação anual contra gripe (campanha março/abril, gratuita para colaboradores)

Acidentes de trabalho são reportados imediatamente ao supervisor (em até 1h após ocorrência), com emissão de CAT no eSocial em até 24h úteis (eSocial S-2210). Casos de acidente grave (afastamento >15 dias, hospitalização) acionam protocolo adicional com comunicação à área corporativa de SST + apoio psicossocial ao acidentado e à equipe.

Estatísticas anuais 2025: 47 acidentes registrados (CAT emitidos), dos quais 38 leves (corte, contusão, queda sem sequelas), 7 médios (entorse, lombalgia, queimadura), 2 graves (fratura). Taxa de acidentes Apex Group: 5.9 acidentes/mil colaboradores/ano, abaixo da média do setor varejista (8.2). Programa de redução de acidentes meta: -20% YoY.

---

## CAPÍTULO 9 — Anexos e referências

### 9.1 Tabela de feriados nacionais 2026

Operação de lojas físicas e centros de distribuição Apex Group no calendário 2026:

| Feriado | Data | Lojas físicas | Canais digitais | CD-Cajamar / Logística |
|---|---|---|---|---|
| Confraternização Universal | 01/01/2026 | Fechado · reabre 02/01 | 24/7 | NÃO opera |
| Carnaval (terça) | 17/02/2026 | Reduzido (12h-20h) | 24/7 | Operação reduzida |
| Sexta-Santa | 03/04/2026 | Reduzido (10h-18h) | 24/7 | NÃO opera |
| Tiradentes | 21/04/2026 | Normal | 24/7 | Operação normal |
| Trabalho | 01/05/2026 | Reduzido (10h-18h) | 24/7 | NÃO opera |
| Corpus Christi | 04/06/2026 | Reduzido | 24/7 | Operação reduzida |
| Independência | 07/09/2026 | Normal | 24/7 | Operação reduzida |
| Aparecida | 12/10/2026 | Reduzido | 24/7 | NÃO opera |
| Finados | 02/11/2026 | Reduzido | 24/7 | NÃO opera |
| Proclamação da República | 15/11/2026 | Normal | 24/7 | Operação normal |
| Consciência Negra (SP) | 20/11/2026 | Normal · feriado estadual em SP | 24/7 | Operação normal |
| Natal | 25/12/2026 | NÃO opera · reabre 26/12 | 24/7 | NÃO opera |

Feriados regionais (impacto loja-a-loja):

- **Aniversário de São Paulo** (25/01): lojas SP capital reduzem 50%
- **São Jorge** (23/04, RJ): lojas RJ reduzem 30%
- **Independência da Bahia** (02/07, BA): lojas Salvador fechadas

Cross-ref `faq_horario_atendimento.pdf` seção 4 (calendário detalhado + feriados regionais).

### 9.2 Contatos de escalação

| Cenário | Quem chamar | SLA esperado | Reporta a |
|---|---|---|---|
| Operacional rotina | Diego (Tier 1 HelpSphere) | Tempo de fila normal | Marina |
| Operacional exceção · alçada >R$ 5.000 | Marina (Tier 2 corporativo) | <2h retorno | Lia |
| Operacional crítico · impacto >R$ 50.000 ou loja inteira indisponível | Lia (Head Atendimento) | <30min retorno | CEO |
| Infra/TI estrutural · integração crítica · CFTV | Bruno (CTO) | 2h | CEO |
| Aprovação financeira >R$ 100.000 · contratos de fornecedor | Carla (CFO) | 4h | CEO |
| Mídia/imprensa solicita posicionamento | Lia + Comunicação Corporativa | <4h | CEO |
| Vigilância sanitária notifica TAC | Lia + jurídico | 24h | CEO |
| Polícia Federal · auditoria forense | Bruno + Lia + jurídico | Imediato | CEO |

Cross-ref `faq_horario_atendimento.pdf` seção 4.3 (contatos rápidos).

### 9.3 Glossário operacional Apex

| Termo | Definição |
|---|---|
| Anchor store | Loja principal em shopping (>2.000 m², geralmente entrada) |
| CAT | Comunicação de Acidente de Transporte (envio formal à transportadora) |
| CD-Cajamar | Centro de distribuição matriz da Apex Group · 47.000 m² · 12 docas |
| Cold chain | Cadeia fria · controle de temperatura em alimentos e fármacos |
| Cross-docking | Operação em que carga entra e sai do CD sem estocagem prolongada |
| Datalogger | Equipamento de registro contínuo de temperatura em transporte refrigerado |
| Demurrage | Cobrança por atraso na liberação da doca · padrão R$ 380/h após 2h |
| EAS | Electronic Article Surveillance · etiqueta acústico-magnética antifurto |
| FEFO | First Expired, First Out · padrão obrigatório perecíveis e fármacos |
| FIFO | First In, First Out · padrão geral de movimentação |
| GS1-128 | Padrão de código de barras com prefixo identificador GS1 |
| NFC-e | Nota Fiscal de Consumidor Eletrônica (varejo B2C) |
| NF-e | Nota Fiscal Eletrônica (varejo B2B + atacado) |
| Palete fechado | Palete com filme stretch + tampa de proteção · pronto para embarque |
| Picking face | Face única de coleta de SKU em altura ergonômica (0.70m a 1.30m) |
| Planograma | Documento técnico de posicionamento de SKUs em gôndola |
| PLU | Price Look-Up · código numérico de 6 dígitos usado no PDV |
| Reverse-tag | Etiqueta de identificação de SKU em logística reversa (prefixo R-) |
| RFID | Radio-Frequency Identification · tag eletrônica de rastreio sem contato |
| Romaneio | Lista descritiva da carga · digital com assinatura no app do motorista |
| SAC | Serviço de Atendimento ao Consumidor (canal de relacionamento) |
| SAP FI | Módulo Financial Accounting do SAP ERP · integrado ao SEFAZ |
| Sealed-input | Entrada de dado "selada" · operador digita sem ver esperado |
| SEFAZ | Secretaria da Fazenda Estadual (autoridade fiscal NF-e) |
| Slow-moving | SKU com giro <0.8/mês · zona Z do CD-Cajamar |
| SSCC | Serial Shipping Container Code · identificador único de palete GS1 |
| TAC | Termo de Ajustamento de Conduta (vigilância sanitária ou ambiental) |
| Tier 1 / 2 / 3 | Níveis de escalonamento HelpSphere (Diego/Marina/Lia) |
| WMS | Warehouse Management System (Manhattan Associates Active WM 2024.1) |
| ZD230 | Impressora térmica Zebra ZD230 · padrão de etiquetagem em loja |

### 9.4 Cross-references com outros PDFs do sample-kb

| Documento | Seções relevantes | Tópico |
|---|---|---|
| `faq_pedidos_devolucao.pdf` | §4, §5 | Políticas comerciais de devolução · garantia |
| `runbook_sap_fi_integracao.pdf` | §2, §3 | Integração POS → SAP FI → SEFAZ · contingência NFC-e |
| `manual_pos_funcionamento.pdf` | Documento completo | Operação detalhada PDV · troubleshooting NFC-e |
| `runbook_problemas_rede.pdf` | §3, §4 | RFID ruído eletromagnético · timeout SEFAZ |
| `politica_reembolso_lojista.pdf` | §3, §4, §7 | Alçadas financeiras · SPED · retenções |
| `faq_horario_atendimento.pdf` | §1, §3, §4 | Horários e calendário operacional · feriados · escalações |
| `politica_dados_lgpd.pdf` | §6.2, §8 | CFTV LGPD-compliant · treinamento básico LGPD |

### 9.5 Footer + versão

**Versão:** v3 · Q2-2026 · próxima revisão Q2-2027

**Classificação:** Documento confidencial · uso interno Apex Group · proibida reprodução externa

**Aprovação executiva:** Lia (Head de Atendimento), Bruno (CTO), Carla (CFO) — assinaturas eletrônicas em arquivo no portal interno.

**Distribuição autorizada:**

- Gerentes de loja (340 unidades)
- Supervisores de turno
- Coordenadores e líderes do CD-Cajamar e CDs regionais (7 unidades)
- Auditoria interna
- HelpSphere Tier 1 (Diego), Tier 2 (Marina), Tier 3 (Lia)

**Histórico de versões:**

- **v1 — Q2-2024.** Primeira versão consolidada. 28 páginas. Aprovação Bruno + Lia.
- **v2 — Q2-2025.** Inclusão dos capítulos 6 (Expedição B2B), 7 (Logística reversa) e 8 (Performance e auditoria). 38 páginas. Aprovação Bruno + Lia + Carla.
- **v3 — Q2-2026 (este).** Inclusão do capítulo 5 (Atendimento ao cliente — antes pulverizado entre capítulos), expansão do capítulo 2 (recebimento) com cold chain detalhado e RFID + GS1-128, revisão completa de KPIs operacionais e checklist de auditoria interna. 47 páginas.

**Próxima major revisão:** v4 · Q2-2027. Planejada para incorporar:

- Rollout do WMS Manhattan 2025.1 (módulo de visão computacional em auditoria de doca).
- Módulo de planograma dinâmico (machine learning para sugestão de posicionamento por loja).
- Integração de KPIs em real-time com Apex IA (programa interno de IA aplicada gerenciado por Carla).
- Atualização do calendário de feriados 2027.
- Revisão de tabela de SLA expresso conforme expansão da rede de CDs regionais.

**Contato editorial:** alterações entre revisões anuais são distribuídas via comunicado operacional numerado (COP-AAAA-NN) pelo canal interno `operacao.apexgroup`. Sugestões de revisão podem ser encaminhadas para o time editorial via HelpSphere categoria "Documentação".

---

*Fim do documento · Manual de Operação de Loja Apex Group v3 · Q2-2026*
