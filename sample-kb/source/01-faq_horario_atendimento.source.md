# FAQ — Horários de Atendimento (Q2-2026)

**Apex Group · Central HelpSphere B2B**
*Versão consolidada · uso interno HelpSphere · v3 · revisão Q2-2026 · próxima revisão Q2-2027*

---

## Página 1 — Lojas físicas Apex Group

Este documento consolida todos os horários operacionais das cinco marcas seed do Apex Group (Apex Mercado, Apex Tech, Apex Moda, Apex Casa e Apex Logística) para uso direto da equipe HelpSphere durante atendimento Tier 1. Diego (atendente Tier 1) deve consultar esta FAQ sempre que um lojista parceiro questionar disponibilidade de loja, horário de coleta, janela de doca, ou capacidade de agendamento. Quando a pergunta envolver exceção de horário ou compromisso comercial acima da alçada padrão, escalar para Marina (supervisora Tier 2) seguindo as regras da seção 4.3.

A estrutura segue o padrão corporativo Apex Group: cada vertical tem horário próprio, calibrado pela curva real de movimento das 340 lojas físicas e pela operação dos dois Centros de Distribuição (CD-Cajamar como principal e o CD-Regional Sul como secundário). Lojas em shopping seguem o calendário do empreendimento; lojas de rua seguem a Convenção Coletiva do Comércio (CCT-Comércio SP); operações B2B intra-grupo seguem a janela contratual do tomador.

### 1.1 Lojas Apex Mercado, Apex Tech, Apex Moda, Apex Casa

A tabela a seguir consolida o horário-padrão das quatro marcas de varejo. Variações pontuais por loja são geridas pelo gerente regional e comunicadas via HelpSphere no campo `observacao_loja` do cadastro de unidade.

| Tipo de unidade | Segunda a Sexta | Sábado | Domingo / Feriado |
|---|---|---|---|
| Shopping (anchor stores) | 10h às 22h | 10h às 22h | 13h às 21h |
| Loja de rua (centros comerciais) | 09h às 19h | 09h às 14h | Fechado (exceto datas comerciais) |
| Loja de bairro | 08h às 20h | 08h às 18h | 09h às 13h |

Lojas Apex Mercado de formato compacto (até 600m²) seguem o padrão "loja de bairro" mesmo quando localizadas em ruas comerciais, porque o ticket médio (R$ 87,40) e a operação de hortifruti exigem abertura mais cedo. Lojas Apex Casa nunca operam no formato "loja de bairro" — o footprint mínimo da marca é 1.200m² e o horário de domingo é tratado caso a caso pelo gerente regional, considerando a presença de equipe de montagem e a janela de entrega.

### 1.2 Apex Logística — operação B2B intra-grupo

A Apex Logística é a operadora B2B do grupo, responsável pelo transporte rodoviário e pela operação dos CDs. O horário operacional do CD-Cajamar (CNPJ 14.728.391/0001-44, área útil 78.400m²) é:

1. **Recebimento de cargas:** Segunda a Sábado, das 06h às 22h, em janelas de doca de 2 horas (06h-08h, 08h-10h, e assim por diante até 20h-22h).
2. **Cutoff de coleta para distribuição:** **17h**, de Segunda a Sábado. Após esse horário, pedidos entram automaticamente em fila batch noturna e são roteirizados pelo Frota.io na execução das 23h.
3. **Domingo e feriados:** operação apenas para emergências, com agendamento prévio mínimo de 48h e aprovação da supervisão Apex Logística.

O cutoff das 17h foi cravado em contrato com o operador de roteirização Frota.io (TKT-15 como referência operacional — caso em que o webhook do TMS parou de transmitir pedidos após esse horário e exigiu fallback manual para evitar perda de janela de entrega do dia seguinte). Lojistas que dependem de roteirização para entrega no D+1 precisam transmitir o pedido até 17h00m59s; o sistema rejeita silenciosamente pedidos transmitidos a partir de 17h01m e os redireciona para fila do dia seguinte.

### 1.3 Exceções regionais e datas comerciais especiais

Lojas Apex em shopping com extensão contratual de horário operam em janelas estendidas durante Black Friday (última semana de novembro), Natal (de 15 a 24 de dezembro) e queima de estoque pós-Natal (26 a 31 de dezembro), das 09h às 23h. Lojas de rua em datas comerciais especiais (Dia das Mães, Dia dos Pais, Dia dos Namorados) podem abrir aos domingos das 12h às 18h mediante autorização do gerente regional e consulta ao sindicato local do comércio. Diego deve sempre confirmar a abertura específica no calendário comercial trimestral publicado em `comercial.apex/calendario` antes de informar o lojista, porque alguns shoppings em capitais do Norte e Nordeste seguem feriados estaduais e municipais distintos.

---

## Página 2 — Canais digitais 24/7

A plataforma digital do Apex Group opera em regime contínuo, com SLA de disponibilidade contratual de 99,9% por trimestre civil. A operação digital cobre quatro vetores: e-commerce, app mobile, meios de pagamento e atendimento omnichannel. Toda a stack digital roda em Azure region Brazil South com failover para East US, e a janela de manutenção programada é semanal e fixa (ver seção 2.1). Bruno (CTO) é o responsável final pela disponibilidade dessa stack; Carla (CFO) aprova investimentos de capacidade trimestralmente.

### 2.1 E-commerce e app mobile

Os quatro domínios principais — `apexmercado.com.br`, `apextech.com.br`, `apexmoda.com.br` e `apexcasa.com.br` — operam 24 horas por dia, 7 dias por semana, inclusive feriados nacionais e regionais. O app Apex+ (disponível para iOS e Android) atende as mesmas marcas em interface unificada, com funcionalidades de pedido, rastreio, segunda via de NF-e, programa de fidelidade Apex Mais e atendimento via chat integrado.

A janela de manutenção programada da plataforma digital ocorre **toda terça-feira das 03h às 05h** (horário de Brasília), com notificação prévia de 48h via banner no site, push notification no app e e-mail para clientes B2B cadastrados. Durante essa janela, o usuário visualiza página de manutenção customizada e a operação de checkout fica desabilitada; pedidos em carrinho são preservados em sessão. Janelas de manutenção emergencial fora desse padrão exigem aprovação de Bruno (CTO) e comunicação ao mercado com no mínimo 4 horas de antecedência.

### 2.2 PIX, adquirência e meios de pagamento

A operação financeira digital obedece à seguinte matriz de disponibilidade:

| Meio de pagamento | Disponibilidade emissão | Disponibilidade liquidação |
|---|---|---|
| PIX (todas as marcas) | 24/7 | Imediata (até 10 segundos) |
| Cartão crédito (adquirência Cielo) | 24/7 | D+30 padrão · D+1 com taxa antecipação |
| Cartão débito (Cielo) | 24/7 | D+1 útil |
| Boleto bancário | 24/7 | D+1 útil após confirmação |
| TED B2B (transferência fornecedor) | Horário bancário Seg-Sex 06h30 às 17h30 | Mesmo dia útil |
| DOC (descontinuado em Q1-2024) | N/A | N/A |

PIX opera em 24/7 verdadeiro, inclusive na madrugada e em feriados nacionais, conforme determinação Bacen (Resolução BCB 1/2020 e suas alterações). Transferências B2B via TED para fornecedores classificados como Pessoa Jurídica seguem o horário bancário tradicional; lojistas que precisam fechar pagamento fora desse horário devem usar PIX B2B (limite Apex Mercado: R$ 2.000.000 por transação após aprovação de Carla).

### 2.3 SAC, chat e canais de relacionamento

O atendimento omnichannel cobre seis canais distintos, cada um com volume, horário e finalidade calibrados pela operação atual:

| Canal | Horário | Volume típico |
|---|---|---|
| Chat WhatsApp Business | Seg-Sáb 08h-22h · Dom 10h-18h | Cerca de 3.000 atendimentos/dia |
| Chat site (operadores humanos) | Seg-Sáb 09h-21h | Cerca de 1.200 atendimentos/dia |
| Chatbot 24/7 (FAQ + status pedido) | 24/7 | Cerca de 8.000 interações/dia |
| Telefone 0800 122 4737 | Seg-Sex 08h-20h · Sáb 09h-14h | Cerca de 400 ligações/dia |
| E-mail SAC (`sac@apex.com.br`) | Resposta em até 24h úteis | Cerca de 600 e-mails/dia |
| Urgências noturnas (fraude, débito) | 24/7 via 0800 emergencial | Menos de 50 casos/mês |

O chatbot 24/7 resolve aproximadamente 71% das interações sem escalonamento; os 29% restantes são roteados para fila humana respeitando o horário do canal de origem. Para urgências noturnas envolvendo suspeita de fraude (clonagem de cartão, débito automático não reconhecido, acesso indevido à conta) o lojista é orientado a usar o 0800 emergencial, que aciona o plantão de risco da Apex Group e abre ticket prioritário no HelpSphere com tag `seguranca-financeira`.

---

## Página 3 — Atendimento B2B e agendamentos

A operação B2B agendada concentra três frentes principais: montagem de móveis (Apex Casa), visita técnica e instalação (Apex Tech) e recebimento de cargas no CD (Apex Mercado e Apex Logística). Cada uma tem janela própria, política de reagendamento e taxa de cancelamento. Diego deve sempre confirmar a disponibilidade real consultando o módulo Schedule do HelpSphere antes de prometer prazo ao lojista; a confirmação final do agendamento é responsabilidade do dispatcher do CD ou do coordenador regional, conforme a frente.

### 3.1 Apex Casa — equipe de montagem

A operação de montagem da Apex Casa opera de Segunda a Sábado, das 08h às 18h, em duas janelas diárias de 4 horas cada (08h-12h e 14h-18h). Aos sábados a equipe opera em escala reduzida (aproximadamente 50% da capacidade média de dias úteis), com previsibilidade menor de chegada e priorização de pedidos com mais de 5 dias de espera.

A equipe **não opera aos domingos** em nenhuma hipótese padrão. O caso TKT-29 (gerente da unidade Apex Casa Tatuapé solicitando equipe emergencial num sábado em que apenas 3 de 8 montadores estavam disponíveis, com 14 clientes confirmados na agenda) consolidou esta política como inegociável: agenda reduzida no sábado é absorvida via reagendamento priorizado para a segunda-feira seguinte, nunca via abertura de domingo.

A política de reagendamento segue a tabela:

1. **Reagendamento com mais de 24h de antecedência:** sem custo para o lojista.
2. **Reagendamento entre 24h e 48h de antecedência:** taxa de 50% sobre o valor da visita (atualmente R$ 250,00 + frete CEP-a-CEP).
3. **Reagendamento com menos de 24h de antecedência ou no mesmo dia:** cobrança integral (R$ 250,00 + frete + eventual taxa do montador parceiro).

Reagendamentos solicitados por motivo de força maior comprovado (laudo médico, ocorrência policial, sinistro residencial) são analisados caso a caso por Marina (supervisora) e podem ter a taxa reduzida ou isenta. Decisões de isenção acima de R$ 1.870 exigem aprovação de Lia (Head de Atendimento) conforme tabela de alçadas da seção 4.3.

### 3.2 Apex Tech — visita técnica (assistência e instalação)

A Apex Tech opera visita técnica de Segunda a Sábado, das 08h às 18h, em três janelas de 4 horas: 08h-12h, 12h-16h e 14h-18h (com sobreposição intencional para absorver atrasos de 30 a 90 minutos). Aos domingos a operação atende apenas urgências cadastradas no HelpSphere com tag `urgencia-tech`, sob custo adicional de 60% sobre o valor padrão da visita.

O tempo estimado de chegada do técnico (janela de 2 horas dentro da janela contratada) é confirmado em D-1 via WhatsApp Business pelo número cadastrado no pedido. Lojistas que solicitam alteração de janela após confirmação D-1 ficam sujeitos à mesma matriz de reagendamento da Apex Casa, com valor base de R$ 180,00 + R$ 47,30 de frete técnico.

### 3.3 Apex Mercado — recebimento de cargas (fornecedor B2B → CD-Cajamar)

O CD-Cajamar opera recebimento de Segunda a Sábado, das 06h às 22h, em janelas de doca de 2 horas. Cada janela comporta até 6 veículos simultâneos (5 docas comuns + 1 doca refrigerada para perecíveis ANVISA classe II). Fornecedores devem agendar a janela com antecedência mínima de 48h através do portal `fornecedor.apexmercado.com.br`.

A política de demurrage cobra **R$ 380,00 por hora** após 2 horas de atraso na chegada do veículo em relação ao horário agendado, conforme contrato CFOP 1949 (operação de cobrança de serviço de armazenagem por demora). A cobrança é lançada automaticamente na conta corrente do fornecedor após validação do dispatcher de plantão e pode ser contestada em até 5 dias úteis com apresentação de laudo de ocorrência (acidente, fechamento de via, embargo policial). Remarcações de janela podem ser solicitadas até D-1 às 18h sem custo; após esse limite a janela é mantida sob risco de demurrage.

### 3.4 Recursos Humanos e medicina ocupacional

O atendimento de Recursos Humanos e medicina ocupacional para colaboradores próprios e terceirizados do Apex Group segue o seguinte horário:

1. **Médico do trabalho terceirizado** (clínica parceira em Cajamar e em Barueri): Segunda a Sexta, das 08h às 12h, com capacidade de 4 exames por dia por unidade. Esta capacidade foi confirmada como gargalo operacional pelo TKT-40 (12 motoristas da equipe própria Apex Logística com exames toxicológicos, audiométricos e clínicos vencendo em 30 dias) — agendamentos coletivos exigem priorização junto à clínica e podem demandar reforço pontual com outra clínica parceira.
2. **RH-Folha** (dúvidas trabalhistas, holerite, FGTS, INSS, eSocial, CCT): Segunda a Sexta, das 09h às 17h, atendimento via HelpSphere fila `RH-Folha`.
3. **Canal de ética anônimo** (Linha Ética Apex, operada por terceiro): 24/7, com SLA de 48h para primeira resposta e tratativa interna pelo comitê de ética em até 15 dias úteis.

---

## Página 4 — Exceções, feriados e contatos rápidos

### 4.1 Calendário 2026 — feriados nacionais

A tabela a seguir consolida o impacto operacional dos feriados nacionais de 2026 nas três frentes principais: lojas físicas, canais digitais e CD/Logística. A coluna "Lojas físicas" indica o horário-padrão das anchor stores em shopping; lojas de rua e de bairro seguem o regime "Reduzido" em todos os feriados marcados como "Reduzido" ou "NÃO opera".

| Feriado | Data | Lojas físicas | Canais digitais | CD/Logística |
|---|---|---|---|---|
| Carnaval (terça) | 17/02/2026 | Reduzido (12h-20h) | 24/7 | Operação reduzida |
| Sexta-Santa | 03/04/2026 | Reduzido (10h-18h) | 24/7 | NÃO opera |
| Tiradentes | 21/04/2026 | Normal | 24/7 | Operação normal |
| Dia do Trabalho | 01/05/2026 | Reduzido (10h-18h) | 24/7 | NÃO opera |
| Independência | 07/09/2026 | Normal | 24/7 | Operação reduzida |
| N. Sra. Aparecida | 12/10/2026 | Reduzido | 24/7 | NÃO opera |
| Finados | 02/11/2026 | Reduzido | 24/7 | NÃO opera |
| Proclamação | 15/11/2026 | Normal | 24/7 | Operação normal |
| Natal | 25/12/2026 | Fechado · reabertura 26/12 | 24/7 | NÃO opera |

> **Nota anti-obsolescência:** este calendário será revisado no primeiro trimestre de 2027 (Q1-2027) pela equipe de Operações Apex, incluindo atualização das datas-base e incorporação de eventuais feriados estaduais novos sancionados pela Assembleia Legislativa de São Paulo. A revisão de feriados regionais de outras UFs segue calendário próprio de cada gerência regional.

### 4.2 Feriados regionais com impacto loja-a-loja

Feriados estaduais e municipais com impacto direto na operação Apex Group:

1. **São Paulo capital — Aniversário da Cidade (25/01):** lojas de rua e bairro operam com 50% da equipe (10h-16h); lojas de shopping seguem horário do empreendimento.
2. **Rio de Janeiro — São Jorge (23/04):** lojas Apex Moda RJ e Apex Tech RJ operam com 70% da equipe; demais marcas operam normal.
3. **Salvador, BA — Independência da Bahia (02/07):** lojas regionais da Bahia fechadas; CD-Regional Sul não atende rota BA neste dia.
4. **Belo Horizonte, MG — Nossa Senhora da Conceição (08/12):** lojas MG operam em horário de shopping (sem abertura de loja de rua de manhã).
5. **Curitiba, PR — Aniversário da Cidade (29/03):** lojas PR operam horário reduzido (10h-18h).

Outras datas regionais devem ser confirmadas com o gerente regional via HelpSphere fila `Operacoes-Regional` antes de prometer entrega ou agendamento ao lojista.

### 4.3 Contatos rápidos para escalações Tier 2

A matriz de escalação a seguir define quem deve ser acionado em cada cenário fora do alcance Tier 1 de Diego. SLA de retorno é cravado em política interna e auditado mensalmente pelo time de Qualidade Apex.

| Cenário | Quem acionar | SLA de retorno |
|---|---|---|
| Loja inteira fora de operação (queda elétrica/sistema crítico) | Marina (supervisora) + plantão TI | Menos de 30 minutos |
| Cliente VIP (faturamento anual acima de R$ 47.300) com problema crítico | Lia (Head Atendimento) diretamente | Menos de 15 minutos |
| Decisão financeira acima da alçada Tier 1 (acima de R$ 1.870) | Marina (supervisora) | Menos de 2 horas |
| Mídia ou imprensa solicitando posicionamento | Lia + Comunicação Corporativa | Menos de 4 horas |
| Suspeita de fraude transacional ou vazamento LGPD | Lia + DPO + Jurídico | Menos de 1 hora |
| Demurrage acima de R$ 4.560 (12h de atraso) | Marina + supervisão Apex Logística | Menos de 3 horas |

Diego nunca deve resolver cenários acima da própria alçada sem registrar a escalação no HelpSphere com o campo `escalacao_tier2` preenchido. Marina valida diariamente a fila de escalações pendentes; Lia revisa semanalmente os casos de alta criticidade e mantém o log para auditoria trimestral de Carla (CFO).

---

**Versão Q2-2026 · Próxima revisão Q2-2027**
*Documento confidencial — uso interno Apex Group · HelpSphere Knowledge Base*
*Cross-references: `manual_operacao_loja_v3.pdf` (procedimentos de loja, recebimento, doca), `politica_reembolso_lojista.pdf` (alçadas financeiras e cobrança de demurrage), `runbook_problemas_rede.pdf` (escalação técnica em queda de sistema).*
