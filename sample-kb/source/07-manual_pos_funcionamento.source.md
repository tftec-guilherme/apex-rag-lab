---
title: "Manual de Operação POS — Apex Group"
subtitle: "v4.2 · Q2-2026 · Uso interno"
classification: "Confidencial · Uso interno Apex Group"
version: "v4.2"
revision-period: "Q2-2026"
next-revision: "Q2-2027"
approver: "Bruno (CTO)"
audience: "Operadores Tier 1 · Supervisores Tier 2 · TI Tier 3"
---

# Manual de Operação POS — Apex Group

**Versão v4.2 · Q2-2026 · próxima revisão Q2-2027 · aprovador Bruno (CTO)**

Documento técnico de operação dos terminais de Ponto de Venda (POS) homologados pela holding Apex Group para uso em todas as 337 lojas físicas e centros de distribuição. Cobre hardware homologado, software LINX BIGiPOS 12.5, emissão de NFC-e em modo online e contingência, operações de caixa (abertura, sangria, fechamento), troubleshooting Tier 1, compliance fiscal (SPED) e PCI-DSS.

Este manual substitui o `troubleshooting-pdv.pdf` legado citado no ticket TKT-11 e consolida em um único documento procedural técnico tudo que Diego (operador caixa Tier 1) precisa para executar a operação sem escalação desnecessária, e tudo que Marina (supervisora Tier 2) precisa para decidir nos pontos de escalação descritos.

---

# Capítulo 1 — Hardware POS

## 1.1 Visão geral do terminal homologado (Página 1)

A frota de POS do Apex Group é padronizada em uma única configuração de hardware homologada, mantida pela equipe de Engenharia de Sistemas sob responsabilidade do CTO Bruno. Não existem variações regionais nem por marca: um POS de uma loja Apex Mercado em Pinheiros tem exatamente a mesma stack de hardware e software de um POS de uma loja Apex Casa em Salvador. Essa decisão arquitetural reduz superfície de suporte, simplifica peças sobressalentes e permite que Diego (operador caixa) seja transferido entre marcas sem novo treinamento operacional.

A stack homologada Q2-2026 é composta por:

- **Terminal Bematech MP-4200 TH** — terminal POS profissional com impressora térmica integrada de 200mm/s e corte automático. Processador Intel Atom, 4GB RAM, SSD 64GB. Suporta Windows 10 IoT LTSC.
- **Impressora backup Epson TM-T20III** — usada em substituição emergencial quando a impressora integrada do MP-4200 apresenta defeito e o POS secundário (página 5) já está alocado em outro caixa. Conexão USB padrão, driver ESC/POS nativo.
- **Sistema operacional Windows 10 IoT LTSC 2021** — versão de longa duração com suporte estendido até 2032 conforme contrato Microsoft. Configurado sem login automático, sem hibernação, sem atualizações automáticas (gerenciadas pelo MDT do TI).
- **Imagem padrão** `POS-APEX-W10IOT-v4.2.wim` — imagem WIM consolidada pelo TI contendo Windows 10 IoT, LINX BIGiPOS 12.5, drivers de periféricos homologados e agente TeamViewer Host. Distribuída via PXE boot quando há reinstalação (procedimento detalhado no Capítulo 6).

A frota total mantida em produção em Q2-2026 distribui-se entre as cinco marcas conforme tabela abaixo. Esses números são revisados trimestralmente pelo time de Operações em reunião com Lia (Head de Atendimento):

| Marca | Lojas físicas | POS por loja (média) | Total POS na frota |
|---|---|---|---|
| Apex Mercado | 142 | 6 | 852 |
| Apex Tech | 78 | 4 | 312 |
| Apex Moda | 64 | 3 | 192 |
| Apex Casa | 41 | 3 | 123 |
| Apex Logística (recebimento doca) | 12 CDs | 2 | 24 |
| **Total** | **337** | — | **1.503** |

A média de 6 POS por loja em Apex Mercado reflete a alta rotatividade do varejo alimentar — uma loja média em horário de pico opera 4 a 5 caixas simultaneamente, deixando 1 ou 2 POS como reserva quente e o sétimo (em algumas lojas) como POS secundário formalmente desligado para substituição emergencial. Em Apex Tech, Apex Moda e Apex Casa a média cai para 3-4 POS por loja porque o ticket médio é maior (R$ 850-3.200 vs R$ 87 em Apex Mercado) e o tempo por atendimento é mais longo, distribuindo melhor a carga ao longo do dia.

Apex Logística mantém 2 POS por CD apenas para emissão de notas de transferência entre lojas e emissão de comprovantes de recebimento. Não há venda direta a consumidor nos CDs.

A homologação de novo hardware (substituição da stack atual) só ocorre por decisão formal do CTO Bruno em reunião de Arquitetura Corporativa, com revisão anual no Q3 e implementação faseada (piloto → 5 lojas → 50 lojas → frota completa). A próxima janela de avaliação é Q3-2026 (avaliação Bematech MP-5200 com Linux embarcado, ainda em estudo).

**Critérios de homologação de novo hardware (referência para futuras avaliações):**

- **Compatibilidade total com LINX BIGiPOS 12.5** (e versões futuras 13.x) — sem necessidade de adaptação de driver
- **Certificação fiscal SEFAZ-SP** para emissão de NFC-e modelo 65
- **Performance mínima:** emissão NFC-e <8s em P99 (carga padrão Apex Mercado · 10 itens · forma pagamento crédito)
- **MTBF (Mean Time Between Failures) ≥ 50.000 horas** documentado em fichas técnicas
- **Suporte do fornecedor** com SLA 24h úteis para troca on-site
- **Custo total de propriedade (TCO)** competitivo em janela de 5 anos
- **Conformidade PCI-DSS** validada para interação com PinPad
- **Disponibilidade de peças** garantida por contrato durante toda a vida útil

Hardware fora desses critérios é rejeitado independente de preço ou recomendação comercial. A Engenharia de Sistemas mantém matriz de comparação atualizada anualmente.

**Ciclo de vida da stack atual (Bematech MP-4200 TH):**

- Homologação inicial: Q3-2021
- Início do deploy frota: Q4-2021
- Frota completa atingida: Q2-2022 (~6 meses de rollout)
- Avaliação de descontinuação: Q3-2026 (MP-5200 candidato)
- Fim de vida planejado: Q4-2028 (ciclo de 7 anos · padrão Apex)
- Suporte de peças garantido pela Bematech: até Q4-2029 (1 ano após EoL)

## 1.2 Periféricos homologados (Página 2)

Os periféricos conectados ao terminal Bematech MP-4200 também seguem homologação estrita. Substituição por modelos alternativos só com autorização do TI (Bruno) e ajuste de drivers na imagem padrão.

**Leitor de código de barras 2D Honeywell Voyager 1450g** — modelo principal homologado em todas as marcas. Suporta leitura de códigos 1D (EAN-13, EAN-8, Code-128, Code-39, ITF-14) e 2D (QR Code, Data Matrix, PDF417, Aztec). A leitura 2D é crítica para Apex Mercado, que utiliza códigos GS1 DataBar em produtos perecíveis (frutas, legumes, padaria) carregando informação de peso, lote e validade. Conexão USB HID com modo wedge teclado (não precisa driver). O trigger contínuo (modo automático) fica desativado por padrão para evitar leituras acidentais quando o leitor está apoiado no balcão; Diego precisa apertar o gatilho para cada bipagem.

**Balança Toledo Prix 3 Fit** — utilizada exclusivamente em lojas Apex Mercado, em três seções: hortifruti (frutas, legumes, folhosos), açougue (carnes pesadas pelo cliente em retirada) e padaria (pães frescos vendidos por peso). Conexão serial RS-232 através de conversor USB FTDI homologado (Bematech BU-1000), porque o terminal MP-4200 não tem porta serial nativa. Protocolo Toledo P05 configurado a 9600 bps, 8N1 (8 bits de dados, sem paridade, 1 stop bit). A balança requer calibração anual obrigatória feita por técnico Toledo credenciado, com selo INMETRO atualizado e fixado visivelmente. Diego nunca calibra ou ajusta a balança — qualquer suspeita de erro de peso vira ticket HelpSphere imediato (categoria Operacional, prioridade Medium).

**Gaveta de dinheiro Bematech GD-56** — gaveta eletro-mecânica com 8 compartimentos de cédulas e 5 compartimentos de moedas. Abertura via comando ESC/POS enviado pela impressora térmica integrada (sem cabo direto ao terminal). Em condições normais, a gaveta abre automaticamente ao final de cada venda em dinheiro (após cliente confirmar pagamento) e Diego pode abri-la manualmente via F5 durante venda em andamento. Não há abertura por chave física na frente da gaveta — a fechadura traseira é usada apenas pela supervisora Marina em casos de manutenção ou inventário do caixa.

**Display cliente customer-facing Bematech LD220** — display VFD (Vacuum Fluorescent Display) de 2 linhas × 20 caracteres, conectado por USB. Exibe automaticamente o valor da venda em curso (item bipado + total parcial) e uma mensagem promocional configurável na linha de baixo. A mensagem é puxada do TOTVS via sync e atualizada diariamente — em Apex Mercado tipicamente é "Cliente fidelidade Apex+ paga menos" ou banners de campanhas vigentes (Dia das Mães, Black Friday).

Periféricos NÃO homologados (proibidos em produção): leitores Bluetooth (latência variável), impressoras não-ESC/POS (incompatíveis com LINX), webcams (privacidade cliente), pinpads não-Cielo (perda de compliance PCI consolidado). Qualquer periférico fora da lista bloqueia o cupom de abertura de caixa porque o smoke test pós-boot detecta dispositivo desconhecido na porta USB.

**Configuração específica do leitor Honeywell Voyager 1450g** (relevante quando Diego precisa redefinir após manutenção):

- Modo wedge teclado · sem driver Windows necessário
- Trigger por gatilho (não contínuo · evita leituras acidentais)
- Suffix CR (Carriage Return) ao final de cada leitura
- Beep alto ativado · LED vermelho ao apontar
- Idioma do firmware: PT-BR
- Configuração restaurada via leitura de "Reset to Factory Defaults" + "Apex Configuration v4.2" (códigos QR impressos em ficha plastificada que fica em cada loja)

**Especificações da balança Toledo Prix 3 Fit** (Apex Mercado):

- Capacidade: 15 kg
- Divisão (incremento mínimo): 5 g
- Precisão: ±5 g em condições normais
- Display digital LCD na frente · visível pelo cliente
- Tara automática (zeragem entre pesagens)
- Selo INMETRO trocado anualmente (técnico Toledo credenciado)
- Comunicação: serial RS-232 → conversor USB FTDI homologado Bematech
- Velocidade: 9600 bps · 8N1
- Protocolo: Toledo P05 (texto ASCII · peso em gramas + checksum)
- Tempo entre pesagem e envio ao LINX: <500ms (P95 800ms)

A balança envia automaticamente o peso ao LINX quando estabiliza · sem necessidade de Diego pressionar botão. Em caso de instabilidade prolongada (>3s · cliente movendo o produto), Diego pede para o cliente colocar o produto firmemente · sistema descarta leituras com flutuação >20g.

## 1.3 PinPad Cielo VeriFone Vx690 (Página 3)

O PinPad é o componente mais sensível do ponto de vista regulatório (PCI-DSS Level 1) e operacional (sem PinPad funcionando, a loja só aceita dinheiro). O Apex Group homologa um único modelo em produção Q2-2026: **Cielo LIO V3**, baseado em Android 8.1 com certificação PCI-PTS 5.x. O modelo anterior (Vx690) ainda existe em algumas lojas como backup, mas está em descontinuação programada até Q4-2026.

**Conexões:**
- **USB-C** (padrão de produção) — fornece alimentação ao PinPad e canal de dados criptografado TLS 1.3 com o terminal. Cabo proprietário Cielo de 1.8m, blindado.
- **Serial RS-232** (backup) — utilizado em recovery manual quando USB falha. Permanece sempre conectado em paralelo mas inativo (config padrão `pinpad.transport=usb`). Marina pode ativar serial em ~2min seguindo o procedimento da página 31.

**Software CIELO Pay v2.18** — software embarcado no LIO V3, atualizado over-the-air (OTA) pela Cielo mediante autorização do Apex Group (janela mensal, terças-feiras 03h-05h, mesma janela do LINX). A versão deve ser informada pelo Bruno ao auditor PCI a cada ciclo de revalidação anual; versões fora de suporte (>12 meses) bloqueiam venda automaticamente até update.

**Funcionalidades habilitadas em Q2-2026:**
- Débito (todas as bandeiras: Visa, Mastercard, Elo, Hiper, American Express, Discover, JCB, Diners)
- Crédito à vista (mesmas bandeiras)
- Crédito parcelado (2x até 18x, com regras detalhadas no Capítulo 4)
- Voucher refeição/alimentação (Sodexo Refeição/Alimentação, Alelo Refeição/Alimentação, Ticket, VR Benefícios)
- PIX dinâmico via QR code (todas as bandeiras Bacen — qualquer banco brasileiro)
- Contactless NFC (cartões físicos + carteiras digitais Apple Pay, Google Pay, Samsung Pay)

**Tempos médios homologados** (medidos pela equipe TI em estudo de Q1-2026 com 12 lojas piloto e 50.000 transações):

| Operação | Tempo médio | P95 |
|---|---|---|
| Débito chip + senha | 4.2s | 7.1s |
| Débito contactless | 2.8s | 4.5s |
| Crédito à vista chip | 5.8s | 9.3s |
| Crédito à vista contactless | 3.5s | 6.0s |
| Crédito parcelado 10x | 7.4s | 12.0s |
| Voucher Sodexo Refeição | 6.1s | 10.2s |
| PIX QR dinâmico | 8.7s | 14.5s (depende confirmação banco cliente) |

Tempos significativamente acima desses valores (P95+50%) viram alerta no dashboard Bruno e podem indicar problema de rede da loja (link saturado, latência alta com gateway Cielo). Diego não monitora esses tempos diretamente — quem monitora é o time TI via Application Insights.

A tela do PinPad mostra mensagens padrão em português para o cliente: "INSIRA O CARTÃO", "DIGITE A SENHA", "AGUARDE...", "APROVADO" ou "NEGADO". Em caso de "NEGADO", o motivo aparece em código (51 = saldo insuficiente, 05 = bloqueio do cartão, 14 = cartão inválido) — Diego nunca interpreta esses códigos sozinho; orientação é "tente outro cartão ou outra forma de pagamento" para o cliente, sem expor o código.

**Códigos de retorno PinPad mais frequentes** (referência interna para Diego não interpretar mas reconhecer):

| Código | Significado interno | Mensagem ao cliente (Diego) |
|---|---|---|
| 00 | Aprovado | "Pagamento aprovado, obrigado" |
| 01 | Consulte emissor | "O banco solicita confirmação · tente novamente ou outro cartão" |
| 04 | Reter cartão (suspeita fraude) | NÃO entregar de volta ao cliente · escalar Marina imediatamente |
| 05 | Bloqueio do emissor | "Pagamento não aprovado · tente outro cartão" |
| 14 | Cartão inválido | "Cartão não reconhecido · tente outro" |
| 41 | Cartão extraviado | NÃO entregar de volta · escalar Marina |
| 43 | Cartão roubado | NÃO entregar de volta · escalar Marina |
| 51 | Saldo insuficiente | "Limite insuficiente · outro cartão ou forma" |
| 54 | Cartão vencido | "Cartão vencido · outro cartão" |
| 55 | Senha incorreta | "Senha incorreta · tentar de novo" (limite 3 tentativas) |
| 57 | Transação não permitida ao portador | "Operação não permitida · contate banco" |
| 61 | Limite de saque excedido | "Limite diário atingido · outro cartão" |
| 65 | Limite de transações excedido | "Limite de uso atingido · outro cartão" |
| 91 | Emissor indisponível | "Conexão com banco lenta · tentar de novo em 1min" |
| 96 | Erro do sistema | "Problema técnico · tentar de novo em 1min" |

Os códigos 04, 41 e 43 são situações críticas — Marina é acionada imediatamente · o cartão é retido no caixa (envelope lacrado) e a Cielo é notificada via 0800 dedicado para procedimento de retenção legal. Em hipótese alguma Diego informa ao cliente que o cartão foi marcado como suspeito (orientação Cielo: dizer apenas "Houve um problema técnico · vou verificar com a supervisora").

## 1.4 Cabeamento, no-break, fonte (Página 4)

A infraestrutura elétrica e de rede de cada POS é padronizada para garantir autonomia mínima em caso de queda de energia e isolamento elétrico contra surtos. A homologação foi definida em conjunto com a área de Engenharia Predial em 2025 e revisada anualmente.

**No-break obrigatório por POS:**
- Modelo: APC Back-UPS 1200VA (BR1200BI-BR)
- Carga típica do POS Apex (terminal + impressora + PinPad + display + leitor + balança opcional): ~380VA
- Autonomia real medida em campo: 22-28 minutos (dependendo do uso de impressora)
- Tomadas: 6 tomadas com proteção contra surtos + 2 tomadas só com filtro
- Conexão USB ao terminal para alerta de bateria baixa (LINX BIGiPOS detecta e mostra aviso na tela quando bateria <30%)

A autonomia de 22-28 minutos é dimensionada para cobrir o tempo médio de reação do gerador da loja (5-10min em lojas com gerador) ou o tempo necessário para Marina decidir fechamento controlado das vendas em curso (3-8min) e aguardar gravação completa em banco local (3-5min). Em lojas sem gerador (grande parte das lojas de bairro Apex Mercado), o no-break é a única proteção e Marina tem prioridade máxima para finalizar vendas e fechar caixa em <20min após queda de energia.

**Procedimento de queda de energia (referência rápida):**

1. **Energia cai** — toda a loja escurece (exceto iluminação de emergência) · POS continua via no-break · pelo menos 22min de autonomia
2. **Marina avalia em 2min:** queda local da loja · queda do bairro · queda regional?
3. **Comunicação aos clientes** (1 min): "Houve queda de energia · estamos finalizando atendimentos · novos clientes aguardar"
4. **Fechamento controlado das vendas em curso** (5-10min): cada caixa finaliza o cliente atual
5. **Sangria final e fechamento de caixa** (5min por POS): Marina executa PROC-POS-003 em todos os POS abertos
6. **Backup local do banco** (3min): sistema grava últimos eventos antes de desligar
7. **POS desliga graciosamente** quando bateria atinge 10% (LINX BIGiPOS força shutdown limpo · proteção contra corrupção do banco)
8. **Loja fica em estado offline** até energia voltar
9. **Religação:** POS volta em boot normal · executa smoke test pós-update · vendas retomadas em ~5min após energia restaurar

**Política Apex para queda de energia >2h consecutivas:**
- Loja é fechada formalmente (sem aceitar novos clientes mesmo se POS ainda tem bateria)
- Marina informa gerente regional · Lia (Head Atendimento) acompanha pelo dashboard
- Estoque perecível (Apex Mercado) entra em protocolo de quarentena (CFTV cobre o estoque · revisão por nutricionista interno antes de devolver à prateleira após reenergização)
- Documentação obrigatória para auditoria · pode haver perda de receita comunicada à Carla (CFO)

**Fontes de alimentação:**
- Terminal MP-4200: fonte externa 24V/2.5A (entrada no chassi traseiro)
- Impressora integrada: alimentada pelo próprio terminal (mesma fonte 24V)
- Gaveta GD-56: fonte externa 12V/2A (cabo curto ao terminal)
- PinPad LIO V3: alimentado via USB-C do terminal (sem fonte própria)
- Balança Toledo (quando aplicável): fonte 12V/1A própria

**Cabeamento Ethernet da loja:**
- Backbone Cat6 puxado do rack principal da loja até cada caixa
- Switch PoE local Cisco SG350-28 (28 portas) em rack próximo ao balcão
- Cada POS: 1 cabo Cat6 direto ao switch (proibido uso de hub ou conexão wireless)
- Comprimento máximo homologado entre switch e POS: 90 metros (limite do padrão Ethernet)
- Velocidade negociada: 1Gbps full-duplex (qualquer caixa abaixo disso vira ticket TI prioridade Low)

**Manutenção preventiva trimestral** (executada por técnico Bematech credenciado ou pelo time TI da regional):

1. Limpeza interna do terminal com ar comprimido seco (cooler, slots de memória, conectores)
2. Limpeza da impressora térmica (rolo de borracha, sensor de papel, lâmina de corte) com isopropílico 70%
3. Teste de autonomia do no-break: descarregar até 20% com carga real, recarregar até 100%, validar relatório de auto-teste
4. Inspeção visual do cabeamento (rasgos, conectores frouxos, hot-spots no rack)
5. Verificação da fonte 24V (multímetro: 23.5-24.5V em vazio, 22.0-24.0V em carga)
6. Substituição preventiva do papel térmico de teste (estoque mínimo de 5 rolos por POS)

Toda manutenção é registrada em `manual_operacao_loja_v3.pdf` seção 9 (calendário de manutenção preventiva) e gera um ticket HelpSphere de fechamento ao final, anexando relatório do técnico + fotos do estado antes/depois. O custo médio de manutenção preventiva trimestral por POS é R$ 180-250 (mão de obra + insumos).

## 1.5 Backup hardware — POS secundário (Página 5)

Toda loja Apex mantém pelo menos **1 POS secundário desligado em rack próximo aos caixas operacionais**, sem alimentação ativa mas pronto para ser ativado em ≤10 minutos. Lojas Apex Mercado com 6+ caixas operacionais mantêm 2 POS secundários. Apex Logística mantém 1 POS secundário em CDs grandes (Cajamar, regional Recife).

O POS secundário é fisicamente idêntico ao POS principal (mesma Bematech MP-4200 TH, mesma imagem WIM, mesmo número de série de hardware registrado no inventário TI). A diferença é apenas operacional: ele não está ligado e seus periféricos (impressora interna funciona, mas leitor, balança, PinPad e gaveta vêm do POS principal substituído).

**Procedimento PROC-POS-001 — Substituição de POS em ≤10 minutos:**

1. **Diego identifica POS principal inoperante.** Causas comuns: tela travada não recuperável após reboot autorizado (página 29), impressora térmica com defeito mecânico que impede emissão (lâmina de corte travada), PinPad inoperante após esgotamento de recovery (página 31), suspeita de falha de hardware (cheiro de queimado, ruído anormal de cooler).

2. **Marina (supervisora) autoriza a substituição** com matrícula supervisora no Painel Supervisor. Sem essa autorização, Diego não pode iniciar o procedimento — proteção contra trocas indevidas que podem deixar a loja com 0 backups.

3. **Diego desconecta os cabos do POS principal:**
   - Cabo de rede (Cat6 → switch PoE)
   - Cabo de força (no-break)
   - Cabo USB do leitor de código de barras
   - Cabo USB da gaveta
   - Cabo serial/USB da balança (quando aplicável — Apex Mercado)
   - Cabo USB-C do PinPad LIO V3
   - Cabo USB do display LD220
   - Etiqueta o POS principal com adesivo vermelho "MANUTENÇÃO" (estoque de etiquetas atrás de cada caixa)

4. **Diego pluga os mesmos cabos no POS secundário** (mantendo as posições físicas dos conectores — cada conector tem etiqueta colorida correspondente à porta do POS secundário). O número de identificação físico do caixa (placa "Caixa 03" acima do POS) NÃO muda — apenas o terminal por trás muda.

5. **POS secundário inicializa Windows 10 IoT** + LINX BIGiPOS 12.5 em aproximadamente 3 minutos. A imagem WIM padrão garante boot consistente. Durante o boot, o smoke test pós-update (página 9) é executado automaticamente — se qualquer teste falhar, Diego escala Marina e ela aciona Bruno (CTO) para validação remota.

6. **Diego abre caixa com o saldo do POS principal.** O LINX consulta o backend TOTVS e recupera o saldo do caixa que estava sendo operado no POS principal (matrícula Diego + ID do caixa físico). Marina valida com matrícula supervisora.

7. **POS substituído continua operação normal** — o cliente cuja venda foi interrompida pelo defeito tem o cupom refeito do zero (consulta F1 para verificar se a venda foi efetivamente registrada no banco local antes do defeito).

**O POS principal vai para a sala TI da loja**, com etiqueta vermelha "MANUTENÇÃO" preenchida com:
- Data e hora da substituição
- Matrícula da Diego que substituiu
- Matrícula da Marina que autorizou
- Descrição do sintoma observado (1-2 linhas)
- Número do ticket HelpSphere aberto

**Bruno (CTO) recebe alerta automático via PagerDuty** quando uma substituição PROC-POS-001 é registrada no sistema. O TI tem 24h úteis para diagnosticar o POS retirado, abrir RMA com fornecedor (Bematech) ou aplicar reparo local. O POS retirado retorna ao status "ativo como secundário" só após validação completa.

Lojas que ficam com 0 POS secundário (porque o secundário virou principal e o principal foi para manutenção) entram em alerta amarelo no dashboard de Operações até Bematech entregar a substituição (SLA 24h úteis para troca on-site). Durante esse período, qualquer falha em qualquer POS da loja escala diretamente para Marina + Bruno.

**Política especial para lojas em Black Friday e Natal:**

Nas duas semanas anteriores à Black Friday e nas três semanas anteriores ao Natal (períodos de pico operacional), o Apex Group aplica regras adicionais:

- **POS secundários adicionais alocados:** lojas Apex Tech e Apex Casa recebem +1 POS secundário (total de 2 secundários) por loja durante o período
- **Manutenção preventiva intensiva** na semana anterior (checklist de 23 itens · obrigatório para cada POS)
- **TI de plantão estendido:** Bruno aloca 2 engenheiros adicionais de plantão (turno noturno coberto)
- **Bematech em standby:** contrato especial Bematech para entrega de POS em 4h úteis (em vez de 24h)
- **Estoque de papel térmico ampliado:** dobro do estoque normal (proteção contra falta em pico)
- **PinPad de reserva:** 1 PinPad LIO V3 extra por loja (configurado e testado · pronto para uso)

A política especial é coordenada por Lia (Head Atendimento) em conjunto com Bruno (CTO) e a equipe comercial. O custo adicional (~R$ 280.000 por temporada de Black Friday) é absorvido pelo aumento de receita esperado e tem ROI positivo histórico.

**Pós-Black Friday:** auditoria de 100% das ocorrências PROC-POS-001 do período · ajuste do estoque de POS secundários para o ano seguinte · revisão de políticas conforme aprendizado.

---

# Capítulo 2 — Software POS

## 2.1 Arquitetura thick-client + sync TOTVS (Página 6)

O Apex Group operou historicamente com POS thin-client (toda a lógica no servidor central) entre 2015 e 2021, mas migrou para arquitetura thick-client em 2022 após postmortem de uma queda total de SEFAZ-SP que deixou 340 lojas sem emitir NFC-e por 6 horas. A decisão arquitetural foi tomada pelo Bruno (CTO) e validada com a Diretoria: cada POS opera com banco local SQL Server Express, lógica fiscal completa no cliente, e sincronização periódica com TOTVS Protheus na matriz.

O resultado: queda de SEFAZ não para a operação. Queda de TOTVS não para a operação. Queda de internet da loja não para a operação por até 4 horas (limite legal de contingência NFC-e regulamentado pela SEFAZ).

**Componentes da stack software:**
- **LINX BIGiPOS 12.5** — aplicação principal (frontend operador + lógica fiscal + integração TEF)
- **SQL Server 2019 Express** — banco local (`C:\BIG\db\bigipos.mdf`), persistência de cadastros, vendas e logs
- **.NET Framework 4.8** — runtime obrigatório do LINX (Windows 10 IoT já vem com ele)
- **MSMQ (Microsoft Message Queue)** — fila local de mensagens para sync com TOTVS
- **TEF Cielo SiTef** — driver de TEF integrado ao LINX, comunica com PinPad LIO V3

**Banco local SQL Server Express:**
- Caminho: `C:\BIG\db\bigipos.mdf` + `bigipos.ldf` (log)
- Tamanho típico em loja Apex Tech ou Apex Casa: ~2GB (volume de vendas baixo, ticket alto)
- Tamanho típico em loja Apex Mercado movimentada: ~6GB (alta rotatividade de transações)
- Crescimento controlado: tabelas de auditoria são truncadas mensalmente após sync confirmado com TOTVS
- Backup local diário em `C:\BIG\db\backup\` (retenção 30 dias)
- Backup central para Azure Blob via job noturno (retenção 5 anos — compliance SPED)

**Sync periódica com TOTVS Protheus (matriz):**
- **Pull do TOTVS para POS** (cadastros · a cada 15min):
  - Produtos (SKU, descrição, NCM, CFOP, alíquotas)
  - Preços (preço regular + preço promocional + janela de vigência)
  - Promoções (combos, descontos por quantidade, leve N pague M)
  - Clientes fidelidade (Apex+) — somente dados básicos, nunca dados de cartão
  - Bloqueios fiscais (produtos com problema cadastral marcados como "não vender")
- **Push do POS para TOTVS** (movimentos · a cada 5min):
  - Vendas finalizadas (com NFC-e autorizada ou em contingência)
  - Cancelamentos
  - Sangrias intermediárias
  - Devoluções e estornos
  - Eventos operacionais (abertura caixa, fechamento caixa, login, logoff)
- **Push imediato** (sem espera dos 5min):
  - Fechamento de caixa (replay para SAP FI no mesmo instante)
  - Falha de hardware (alerta Bruno via PagerDuty)
  - Substituição PROC-POS-001 (alerta supervisão + TI)

**Comunicação POS ↔ TOTVS:**
- Protocolo: HTTPS REST + JWT autenticado por POS (token rotaciona a cada 7 dias)
- Endpoint TOTVS: `https://totvs-api.apex.com.br/v3/pos/{loja_id}/{pos_id}`
- Fila MSMQ local: garante entrega exatamente uma vez (idempotência via hash da mensagem)
- Limite da fila MSMQ: **4 horas de operação offline** acumulada (~50.000 mensagens para Apex Mercado movimentada)
- Pós-limite: POS bloqueia novas vendas até reconectar e drenar a fila (proteção contra perda de dados)

A relação entre LINX BIGiPOS e TOTVS é validada periodicamente pelo time de Integrações em conjunto com Bruno. O contrato técnico (formato de mensagens, semântica de eventos) está documentado no `runbook_sap_fi_integracao.pdf` (seção 3 — Fluxo POS → TOTVS → SAP FI).

**Estrutura do banco local SQL Server Express (referência técnica):**

As tabelas principais do banco `bigipos.mdf` que Diego e Marina ocasionalmente encontram em logs ou em conversas com Bruno:

| Tabela | Conteúdo | Volume típico (Apex Mercado · 30 dias) |
|---|---|---|
| `BIG_VENDAS` | Cabeçalho de cada venda (NFC-e) com chave SEFAZ, total, status | ~85.000 registros |
| `BIG_VENDAS_ITENS` | Itens individuais de cada venda | ~620.000 registros |
| `BIG_PAGAMENTOS` | Formas de pagamento por venda (split de pagamento) | ~95.000 registros |
| `BIG_CAIXAS` | Aberturas e fechamentos de caixa | ~720 registros (caixas × turnos) |
| `BIG_SANGRIAS` | Sangrias intermediárias | ~120 registros |
| `BIG_USERS` | Operadores autorizados (Diego, Marina, etc) | ~25 registros por loja |
| `BIG_PRODUTOS_CACHE` | Cache local de produtos sincronizados do TOTVS | ~12.000 SKUs |
| `BIG_CONTINGENCY` | NFC-e em modo contingência pendentes de regularização | <50 registros (operação saudável) |
| `BIG_HEALTH` | Heartbeats de smoke test | rotaciona diariamente |
| `BIG_AUDIT` | Eventos de auditoria (descontos, cancelamentos, alterações de configuração) | ~3.500 registros |
| `BIG_SYNC_QUEUE` | Espelho da fila MSMQ (para troubleshooting) | <5.000 (operação saudável) |

**Procedimento de manutenção do banco local (executado pela TI · automatizado):**

- **Diariamente às 02h:** backup completo do MDF para `C:\BIG\db\backup\YYYY-MM-DD.bak`
- **Diariamente às 02h30:** upload do backup mais recente para Azure Blob (`apex-pos-logs-bkp` container · tier Cool)
- **Diariamente às 03h:** truncamento de tabelas de auditoria com >30 dias (`BIG_AUDIT`, `BIG_HEALTH`)
- **Semanalmente (domingo 04h):** REINDEX completo das tabelas maiores (`BIG_VENDAS`, `BIG_VENDAS_ITENS`)
- **Mensalmente (1º dia útil 05h):** SHRINK do banco se crescimento excedeu 20% do baseline (raro · ajuste de capacidade)

Diego e Marina não executam essas operações — são automáticas e gerenciadas pelo agente MDT da Apex. Falhas viram alerta para Bruno via PagerDuty.

## 2.2 Tela de operação e atalhos de teclado (Página 7)

A interface do operador é a tela `BIG iPOS Front` — uma única tela de operação que cobre todos os fluxos (venda, devolução, sangria, consulta, fechamento). O LINX BIGiPOS foi escolhido em parte pela maturidade dessa interface, otimizada para uso intensivo com teclado físico (Diego não usa mouse durante venda — só teclado e leitor).

O treinamento padrão de Diego cobre os atalhos PUF (Painel de Uso Frequente) nas primeiras 2 horas de onboarding. Após uma semana, Diego executa todos os atalhos sem precisar olhar para a tela — a operação de uma venda padrão dura 45-60s em Apex Mercado e 75-90s em Apex Casa, e o teclado é a única forma de operar com essa velocidade.

| Tecla | Ação | Quem pode usar |
|---|---|---|
| **F1** | Consulta de produto por código/descrição | Diego (sempre) |
| **F2** | Aplicar desconto | Requer matrícula supervisora Marina |
| **F3** | Cancelar item da venda em curso (último item) | Diego (sempre) |
| **F4** | Finalizar venda → tela de pagamento | Diego (sempre) |
| **F5** | Abrir gaveta de dinheiro (durante venda em andamento) | Diego (sempre) |
| **F6** | Sangria intermediária | Diego inicia + Marina aprova |
| **F7** | Reimprimir último cupom | Diego (sempre) |
| **F8** | Modo devolução | Requer matrícula supervisora Marina |
| **F9** | Modo contingência NFC-e (uso emergencial) | Diego inicia + Marina notificada |
| **F10** | Fechamento de caixa | Somente supervisora Marina |
| **F11** | Bloqueio temporário de tela | Diego (sempre) |
| **F12** | Reboot controlado | Somente Marina (após autorização Bruno em casos críticos) |
| **Ctrl+L** | Travar tela (pausa para banheiro/almoço) | Diego (sempre) |
| **Ctrl+Q** | Encerrar turno (logoff operador) | Diego (sempre) |
| **Ctrl+F1** | Consulta avançada (vendas anteriores) | Diego (sempre, somente leitura) |
| **Ctrl+F5** | Imprime relatório X (parcial do turno, não fecha caixa) | Diego (sempre) |

**Detalhes operacionais relevantes:**

**F2 — Desconto** sempre exige matrícula supervisora porque desconto manual é vetor frequente de fraude. O sistema registra: matrícula Marina, percentual aplicado, justificativa (campo obrigatório, mínimo 10 caracteres), e o evento alimenta o relatório mensal de descontos auditado por Lia. Descontos acima de 15% disparam alerta imediato no dashboard supervisor; descontos acima de 25% requerem aprovação de Lia em tempo real (Marina chama por Slack).

**F3 — Cancelar item** remove o último item bipado da venda em curso. Diego pode usar quantas vezes precisar antes de F4 (finalização). Depois do F4, F3 não funciona — o procedimento muda para F8 (modo devolução, requer Marina). Importante: F3 não registra "cancelamento" no relatório fiscal, porque a venda nem foi finalizada — é apenas remoção do carrinho interno.

**F5 — Abrir gaveta durante venda** existe para casos em que Diego precisa dar troco em valor parcial (cliente paga R$ 50 em dinheiro + R$ 137 em cartão e quer o troco antes de finalizar o cartão). Diego abre a gaveta, conta o troco, fecha. O sistema audita aberturas de gaveta fora de fluxo normal — mais de 3 aberturas F5 em uma venda gera flag no dashboard supervisor.

**F11 — Bloqueio temporário** é diferente de Ctrl+L. F11 mantém a venda em curso suspensa (cliente saiu do caixa para pegar um item que esqueceu) — outro caixa não pode atender enquanto a sessão estiver bloqueada. Ctrl+L apenas trava a tela para que Diego saia 5min — qualquer operador pode destravar com sua matrícula e a sessão de Diego é encerrada automaticamente.

**Layout da tela operacional BIG iPOS Front (descrição visual):**

A tela de operação é dividida em 4 quadrantes principais:

- **Quadrante superior esquerdo (40% da tela):** lista de itens da venda em curso — código, descrição, quantidade, preço unitário, subtotal por item. Lista rolável quando há >12 itens visíveis. O último item bipado fica destacado em azul claro.
- **Quadrante superior direito (25% da tela):** informações de identificação — nome do operador (Diego), número do caixa, número da venda em curso (sequencial), status (Aguardando · Vendendo · Pagamento), hora atual.
- **Quadrante inferior esquerdo (40% da tela):** totalização — subtotal · desconto aplicado (se houver) · total a pagar · forma de pagamento selecionada. Em modo de pagamento, expande para mostrar valores parciais por forma.
- **Quadrante inferior direito (25% da tela):** atalhos do PUF (Painel de Uso Frequente) com lembretes dos F1-F12 mais relevantes para o estado atual. Em modo venda: F1, F3, F4, F5. Em modo pagamento: F4, F8 (não disponível), F12.

A barra superior fixa mostra: status da conexão SEFAZ (verde · amarelo · vermelho), status da conexão TOTVS (idem), status do PinPad (idem), nível de bateria no-break (porcentagem · ícone), e a hora atual em formato HH:MM:SS.

A barra inferior fixa mostra: mensagens do sistema (alertas, dicas) e o nome do POS na rede para fins de troubleshooting (`POS-LJ142-C03` por exemplo).

Diego não precisa memorizar essa estrutura — após 1 semana de uso, a navegação visual é automática. Mas em onboarding, é útil para acelerar o aprendizado.

## 2.3 Modos de operação online vs offline (Página 8)

O LINX BIGiPOS 12.5 opera em dois modos distintos: **online** (modo padrão) e **contingência offline** (acionado automaticamente em falha de SEFAZ ou manualmente via F9). A transição entre modos é feita pelo software sem intervenção do operador, mas Diego e Marina precisam entender as implicações operacionais de cada modo.

**Modo online (padrão):**
- SEFAZ-SP responde NFC-e em <30s na média (P95 8.5s, P99 18s)
- Sync imediata com TOTVS (push a cada 5min)
- PinPad Cielo conectado e autorizando em tempo real
- Display LD220 mostra o valor real da venda
- Cupom emitido com chave NFC-e definitiva
- Cliente recebe NFC-e por e-mail (se informou e-mail) ou apenas a via impressa

**Modo contingência offline:**
- Acionamento automático: 3 timeouts SEFAZ-SP consecutivos (90s total de tentativas)
- Acionamento manual: F9 (Diego inicia, Marina é notificada)
- Limite legal: **4 horas consecutivas** (configurável em `bigipos.config`, padrão 240min)
- NFC-e emitida com chave provisória local (formato `tpEmis=4` no XML — contingência off-line)
- Sincronização automática quando rede + SEFAZ-SP voltam
- PinPad Cielo opera de forma autônoma se rede da loja cair: o modem GSM 4G interno do LIO V3 mantém conexão direta com gateway Cielo (independente da rede Apex)

**Transição automática para contingência:**

Quando o LINX BIGiPOS detecta 3 timeouts SEFAZ consecutivos em qualquer POS da loja, o software:

1. Marca o POS local em estado de contingência
2. Exibe banner amarelo na tela do operador: "MODO CONTINGÊNCIA ATIVO desde 14h32 — vendas continuam normalmente"
3. Envia notificação para Marina via WhatsApp Business + Slack do supervisor
4. Marca alerta no dashboard supervisor (todos os POS da loja em status amarelo)
5. Inicia job de reconexão (tenta SEFAZ a cada 60s)

Diego continua vendendo normalmente. A diferença para o cliente é zero — o cupom impresso é idêntico, com QR code de consulta apontando para um endereço temporário (pré-SEFAZ). Quando a sincronização ocorrer (geralmente em <30min após restabelecimento), o QR code original passa a apontar para o endereço definitivo SEFAZ.

**Retorno automático para modo online:**

O job de reconexão monitora a SEFAZ-SP. Quando 3 pings consecutivos retornam OK em <5s, o sistema:

1. Drena a fila de NFC-e contingenciadas (transmite todas com flag `tpEmis=4`)
2. Aguarda SEFAZ autorizar cada uma (autorização retroativa)
3. Atualiza o QR code de cada cupom no banco local
4. Restaura o status do POS para "online" (banner amarelo desaparece)
5. Notifica Marina via dashboard ("Loja em modo online novamente")

A regularização demora tipicamente 5-20 minutos dependendo do volume de NFC-e na fila. Durante esse período, novas vendas já são feitas em modo online normal — a fila de contingência é processada em paralelo (thread dedicada).

## 2.4 Atualizações de versão LINX (Página 9)

A janela oficial de atualização do LINX BIGiPOS é **toda terça-feira, das 03h às 05h** (horário Brasília). Nesse horário todas as lojas estão fechadas (a loja Apex Mercado de Pinheiros que abre mais cedo só começa às 07h) e o tráfego SEFAZ está no mínimo histórico, então uma atualização que requeira novo certificado A1 ou novo cadastro de série tem janela tranquila.

A atualização é puxada por agendador Windows (Task Scheduler) que executa um script PowerShell DSC (Desired State Configuration). O script:

1. Verifica em um endpoint TI central se há nova versão disponível para o POS
2. Compara com a versão atual instalada (registry `HKLM\SOFTWARE\LINX\BIGiPOS\Version`)
3. Se há nova versão, baixa o pacote MSI assinado digitalmente pela Apex (cert interno)
4. Valida a assinatura (proteção contra MSI adulterado em man-in-the-middle)
5. Para o serviço LINX (graceful shutdown — aguarda transações em curso terminarem)
6. Executa o MSI em modo silent (parâmetros padronizados)
7. Aguarda instalação concluir (~3-8min)
8. Reinicia o serviço LINX
9. Executa o smoke test pós-update obrigatório (próximo bloco)

**Smoke test pós-update obrigatório (5min, executado pelo POS na inicialização):**

1. **Conectividade SEFAZ** — ping homolog SEFAZ-SP (`https://homolog.nfce.fazenda.sp.gov.br/ws/...`) + ping produção SEFAZ-SP. Ambos devem responder em <2s.
2. **Conectividade TOTVS** — sync de 1 produto teste predefinido (SKU `APEX-SMOKE-TEST-001`, sempre presente em TOTVS). Pull deve retornar em <5s.
3. **Conectividade Cielo** — heartbeat PinPad (transação de R$ 0,01 que cancela automaticamente). Deve concluir em <15s.
4. **Impressora térmica** — cupom de teste interno (cabeçalho "SMOKE TEST" + timestamp + número do POS). Deve imprimir em <3s.
5. **Banco local** — query simples em `BIG_VENDAS` (SELECT TOP 1) + INSERT/DELETE em `BIG_HEALTH`. Deve concluir em <2s.

**Falha em qualquer etapa do smoke test:**
- POS NÃO abre caixa (botão Login fica desabilitado)
- Tela exibe: "POS em validação pós-update — aguardar TI"
- PagerDuty alerta Bruno (CTO) com o ticket pré-aberto contendo o log do smoke test
- POS secundário é acionado (Marina executa PROC-POS-001)
- Bruno tem 2h úteis para diagnosticar e liberar o POS principal

**Falha não-bloqueante (warning):**
- TOTVS sync lento (>10s mas <30s) — gera ticket prioridade Low, POS abre caixa
- Cielo heartbeat lento (>15s mas <30s) — gera ticket prioridade Low, POS abre caixa
- Impressora lenta (>3s mas <10s) — gera ticket prioridade Low, POS abre caixa

Atualizações de versão major (12.x → 13.x, planejada para 2027) seguem processo diferente: piloto em 5 lojas durante 30 dias, validação pelo time de Operações + TI, rollout faseado em 4 ondas (5 → 50 → 200 → 1.503). O calendário de rollout é coordenado entre Bruno (CTO) e Lia (Head de Atendimento) para evitar impacto em datas comerciais críticas (Black Friday, Natal, Dia das Mães, Dia dos Pais).

## 2.5 Logs locais e acesso remoto do TI (Página 10)

A operação do POS gera logs extensivos que servem tanto para troubleshooting do dia a dia (Diego escala ticket, Bruno olha log) quanto para auditoria fiscal (Receita Federal pode solicitar XMLs específicos). O diretório raiz dos logs é `C:\BIG\logs\` com rotação diária e retenção local de 90 dias. Após 90 dias, os logs são comprimidos e enviados ao Azure Blob com retenção total de 5 anos (compliance SPED — ver Capítulo 7).

**Arquivos principais de log e seus volumes típicos diários:**

| Arquivo | Conteúdo | Tamanho típico/dia (Apex Mercado movimentada) |
|---|---|---|
| `bigipos-front.log` | Operação do operador — cliques, vendas iniciadas, vendas finalizadas, atalhos de teclado, logins, logoffs | ~12MB |
| `bigipos-fiscal.log` | Comunicação com SEFAZ-SP — request XML, response XML, códigos de rejeição, timeouts, retries | ~8MB |
| `bigipos-cielo.log` | Comunicação com PinPad Cielo — tipo de transação, valor, tempo de resposta, autorização/negação, tokens | ~4MB |
| `bigipos-sync.log` | Push/pull TOTVS — cadastros baixados, movimentos enviados, falhas de fila, retries MSMQ | ~6MB |
| `bigipos-error.log` | Erros e stack traces — exceptions .NET, falhas de driver de periférico | <1MB (operação saudável) |
| `bigipos-cont.log` | Eventos de contingência — entradas, saídas, drenagem da fila, regularização | <100KB (operação saudável) |
| `windows-event.log` | Eventos sistema operacional Windows (capturados via Event Viewer + scheduled export) | ~2MB |
| `teamviewer-session.log` | Sessões TeamViewer Host iniciadas (auditoria de acesso TI ao POS) | <50KB |

**Política de não-mistura de PII:** os logs do POS NUNCA contêm:
- PAN completo de cartão (Primary Account Number — só os 4 últimos dígitos, formato `*\*\*\*-1234`)
- Senha de cartão (NUNCA — proibido pelo PCI-DSS)
- CPF do cliente em texto claro nos logs operacionais (`bigipos-front.log` mascara como `***.***.***-XX` mostrando só dois dígitos finais)
- CPF do cliente em `bigipos-fiscal.log` aparece em texto claro porque o XML da NFC-e exige (compliance SEFAZ) — mas esse log tem acesso restrito (somente Bruno + Auditoria)

**Acesso remoto do TI:**

Quando Diego escala um chamado de POS e Bruno precisa investigar diretamente, o procedimento de acesso é:

1. **Bruno solicita conexão remota** via Slack ou ticket HelpSphere (precisa registrar motivo)
2. **TeamViewer Host pré-instalado** em todos os POS (versão 15.x business com licença Apex)
3. **Popup na tela do POS** pergunta a Diego (ou Marina): "TI Apex solicita conexão remota — Aceitar / Recusar"
4. **Diego ou Marina aceita** (vendas em curso são informadas — Bruno pode esperar)
5. **Sessão TeamViewer iniciada** com gravação obrigatória (vídeo + áudio se houver chamada)
6. **Bruno faz a investigação** com acesso somente leitura aos logs ou, se necessário, escrita em arquivos de configuração (mas nunca modifica vendas em curso)
7. **Sessão registrada** em `teamviewer-session.log` (timestamp início, timestamp fim, ID Bruno, motivo, ticket HelpSphere relacionado)

**Política LGPD — captura de tela:** durante sessões TeamViewer, Bruno NÃO pode capturar tela do POS se houver dados pessoais visíveis (CPF, nome do cliente, telefone). Procedimento: Bruno pede a Diego/Marina para fechar a venda ou esperar limpeza da tela antes de capturar. Captura indevida é violação LGPD (ver `politica_dados_lgpd.pdf` seção 4.2) e gera processo interno de revisão.

**Coleta de log para ticket:** quando Diego escala um chamado complexo, o procedimento padrão é coletar:
- Últimos 200MB de `bigipos-front.log` (~últimas 16h de operação)
- Últimos 200MB de `bigipos-fiscal.log` (se o problema é fiscal)
- Tudo de `bigipos-error.log` (geralmente <50MB)
- Screenshot da tela do POS no momento do problema (se possível, antes de qualquer reboot)

O ZIP resultante (tipicamente 100-300MB) é anexado ao ticket HelpSphere via upload SFTP automatizado. Bruno acessa pelo painel do HelpSphere.

**Formato estruturado dos logs (referência para troubleshooting):**

Os logs do LINX BIGiPOS 12.5 são em formato JSON estruturado (não texto livre). Cada linha é um evento JSON completo. Exemplos:

`bigipos-front.log` (evento de venda finalizada):
```json
{"ts":"2026-05-11T14:32:18.327Z","lvl":"INFO","ev":"venda.finalizada",
 "pos":"POS-LJ142-C03","op":"diego.almeida","cx":"03","venda_id":47832,
 "itens":12,"total":187.80,"forma_pgto":"debito","tempo_ms":18432,
 "nfce_chave":"35260512345678000190650010000478321234567890"}
```

`bigipos-fiscal.log` (evento de timeout SEFAZ):
```json
{"ts":"2026-05-11T14:31:48.001Z","lvl":"WARN","ev":"sefaz.timeout",
 "pos":"POS-LJ142-C03","tentativa":2,"timeout_ms":30000,
 "chave_provisoria":"PROV-20260511-143147-0001",
 "endpoint":"https://nfce.fazenda.sp.gov.br/ws/NFeAutorizacao/..."}
```

`bigipos-cielo.log` (evento de transação cartão):
```json
{"ts":"2026-05-11T14:32:08.156Z","lvl":"INFO","ev":"cielo.transacao",
 "pos":"POS-LJ142-C03","tid":"CIELO-20260511-9387234521",
 "valor":187.80,"tipo":"debito","bandeira":"visa","ult4":"1234",
 "tempo_ms":4287,"status":"aprovado","nsu":"00193847"}
```

`bigipos-error.log` (exemplo de exception .NET):
```json
{"ts":"2026-05-11T14:33:42.881Z","lvl":"ERROR","ev":"exception",
 "pos":"POS-LJ142-C03","exception_type":"System.Net.WebException",
 "message":"The operation has timed out","stack":"at System.Net...",
 "context":{"venda_id":47833,"endpoint":"sefaz"}}
```

Esse formato permite que o time TI faça queries estruturadas (jq, Splunk, Application Insights) em volumes grandes de logs. Diego e Marina não precisam interpretar JSON — eles encaminham os logs ao ticket e Bruno faz a análise.

---

# Capítulo 3 — Emissão NFC-e

## 3.1 Fluxo padrão NFC-e em modo online (Página 11)

A NFC-e (Nota Fiscal de Consumidor eletrônica, modelo 65) é o documento fiscal padrão emitido pelo POS em todas as vendas a consumidor final pessoa física. A NF-e modelo 55 (consumidor pessoa jurídica) também pode ser emitida, mas requer fluxo específico (informar CNPJ no início da venda — coberto no Capítulo 4 sobre boletos B2B).

A sequência operacional padrão executada por Diego em uma venda Apex Mercado típica (carrinho com 6-12 itens, pagamento em débito):

**Pré-venda:**
1. Login no POS com matrícula + senha (a senha é rotacionada a cada 60 dias por política de TI)
2. Abertura de caixa (PROC-POS-002 — detalhado no Capítulo 5)

**Durante a venda:**
3. Bipagem de produtos com o leitor 2D Honeywell — cada item aparece na tela com descrição, preço unitário, quantidade (se for produto pesado em balança, o valor entra com 3 decimais de quilograma)
4. Verificação visual contínua: o display LD220 mostra ao cliente o subtotal atualizado a cada bipagem
5. Diego confirma com o cliente "É isso mesmo?" antes de finalizar
6. **F4** → tela de pagamento abre

**Tela de pagamento:**
7. Diego seleciona a(s) forma(s) de pagamento (split é permitido — Capítulo 4)
8. Se PIX/cartão/voucher: aciona PinPad LIO V3 (transação processada em paralelo à conversa com cliente)
9. Cliente insere cartão/escaneia QR/digita senha
10. PinPad retorna autorização → LINX confirma forma de pagamento processada

**Emissão NFC-e:**
11. LINX monta o XML da NFC-e (cabeçalho, itens, totais, pagamentos, identificação do cliente se informada)
12. Assina o XML com certificado A1 da loja (cert tem validade anual — gerenciamento centralizado pelo Bruno)
13. Envia para SEFAZ-SP via webservice `https://nfce.fazenda.sp.gov.br/ws/NFeAutorizacao/...`
14. SEFAZ valida e retorna autorização em <30s (média 4-8s em operação saudável)
15. LINX recebe a chave de acesso definitiva (44 caracteres) + protocolo de autorização

**Pós-emissão:**
16. Cupom é impresso na impressora térmica integrada (formato "cupom resumido" com QR code de consulta)
17. Cupom é cortado automaticamente (lâmina interna da MP-4200)
18. Se cliente informou e-mail: NFC-e é enviada por e-mail em <2min (job dedicado, fora do fluxo crítico)
19. Sync imediata com TOTVS em background (push para fila MSMQ → drenagem em <5min)
20. Tela retorna ao estado "Aguardando próximo cliente"

**Tempo médio total de operação completa em modo online (após F4):** 18-25s (medido em estudo Q1-2026 com 100.000 transações Apex Mercado). Em vendas com PIX, esse tempo sobe para 25-35s pela latência da confirmação Bacen. Em vendas com crédito parcelado >10x, sobe para 28-40s pela consulta de score Serasa.

**Métricas operacionais do fluxo NFC-e (Q1-2026):**

| Métrica | Apex Mercado | Apex Tech | Apex Moda | Apex Casa |
|---|---|---|---|---|
| Vendas/dia/POS | 380-540 | 65-110 | 110-180 | 45-85 |
| Tempo médio por venda | 60s | 90s | 50s | 75s |
| % vendas com fidelidade identificada (CPF) | 62% | 38% | 28% | 45% |
| % vendas com pagamento split | 8% | 12% | 4% | 18% |
| % vendas com NFC-e modelo 65 (B2C) | 97% | 89% | 96% | 84% |
| % vendas com NF-e modelo 55 (B2B) | 3% | 11% | 4% | 16% |
| Ticket médio | R$ 87 | R$ 1.847 | R$ 235 | R$ 1.620 |
| % vendas com promoção aplicada | 35% | 22% | 48% | 28% |
| % vendas com desconto manual (F2 supervisora) | 1.2% | 0.4% | 3.5% | 2.1% |

O **% de vendas com desconto manual** é um indicador relevante porque desconto manual é vetor de fraude. Apex Moda tem o maior índice (3.5%) por particularidades do varejo (negociação direta com cliente em coleções de fim de estação) · monitoramento Lia mensal.

**Operação especial — venda com nota brindes (festas / aniversários · Apex Casa e Apex Moda):**

Algumas vendas têm itens incluídos como brinde (não pagos pelo cliente · marketing):

1. Diego bipa os itens normalmente
2. Marina autoriza F2 (desconto · matrícula supervisora) com 100% no item brinde
3. Sistema mostra o item com preço zerado · cliente vê no display
4. NFC-e é emitida com o item brinde como CFOP 5.910 (operação não tributada · doação)
5. Cupom mostra "BRINDE - R$ 0,00" para o item

Esse fluxo é configurado em campanhas comerciais específicas (cadastrado no TOTVS com flag "brinde"). Não há discricionariedade de Marina — só pode ser brinde se o sistema autorizar.

**Pagamento em moeda estrangeira (NÃO aceito):**

O Apex Group não aceita moeda estrangeira (dólar, euro, peso argentino, etc) em nenhuma loja. A política existe por:
- Complexidade de câmbio (taxa diária pré-acordada com banco)
- Risco de moeda falsificada
- Não há demanda significativa (lojas em ponto turístico têm taxa de turismo via TEF Cielo)

Diego é treinado para recusar com mensagem padrão: "Não aceitamos moeda estrangeira · trocamos pelo PIX, débito ou crédito que pode ser estrangeiro (Cielo aceita Mastercard internacional, Visa internacional · taxa de IOF aplicada pelo banco emissor)."

Diego não monitora esses tempos individualmente — o que ele percebe é a fluidez geral. Quando o tempo sobe consistentemente acima da média típica da loja, é sinal de problema (rede, SEFAZ lenta, problema de Cielo) e Marina deve ser notificada para investigar via dashboard supervisor.

**Estrutura completa do XML da NFC-e gerado pelo LINX (referência para troubleshooting):**

Cada NFC-e emitida gera um XML com aproximadamente 80-120 nós dependendo do número de itens e formas de pagamento. Os blocos principais que Diego e Marina ocasionalmente precisam reconhecer:

- **`<ide>` (identificação):** UF emitente (35 = SP), código numérico aleatório, modelo (65 = NFC-e), série, número da nota, data/hora, tipo de operação (1 = saída), tipo de emissão (1 = normal · 4 = contingência off-line NFC-e)
- **`<emit>` (emitente):** CNPJ Apex Group, razão social, inscrição estadual da loja, regime tributário (3 = regime normal)
- **`<dest>` (destinatário):** CPF/CNPJ do consumidor (se informado · obrigatório para vendas >R$ 1.000), nome, indicação de IE (9 = não contribuinte para B2C)
- **`<det>` (itens · 1 nó por item):** código do produto, EAN, descrição, NCM, CFOP, unidade, quantidade, valor unitário, valor total do item, alíquotas (ICMS, PIS, COFINS, IPI quando aplicável)
- **`<total>`:** soma de todos os valores · ICMS total · PIS total · COFINS total · valor da NFC-e
- **`<transp>`:** modalidade de transporte (0 = por conta do emitente em B2C · 9 = sem ocorrência de transporte)
- **`<pag>` (pagamento · 1 nó por forma):** tipo de pagamento (01 = dinheiro · 02 = cheque raro · 03 = cartão crédito · 04 = cartão débito · 15 = boleto · 16 = depósito · 17 = PIX · 19 = vale alimentação · 20 = vale refeição), valor, dados do cartão (bandeira · NSU · TID quando cartão)
- **`<infAdic>`:** informações adicionais (mensagem ao consumidor · campanhas)
- **`<Signature>`:** assinatura digital do certificado A1 da loja

**Estrutura completa de um certificado A1 da Apex (referência):**

- **Tipo:** A1 (arquivo .pfx · senha protegida) · vida útil 1 ano
- **Emissor:** Serpro, Certisign, Soluti, AC Safeweb (certificadoras homologadas ICP-Brasil)
- **Subject:** CN=APEX MERCADO PINHEIROS LTDA · CNPJ=12345678000190 (CNPJ da loja específica)
- **OU (Organizational Unit):** 35200500000000 (8 dígitos do código SEFAZ da loja)
- **Validade:** 365 dias a partir da emissão
- **Algoritmo:** RSA 4096 bits (padrão atual · mais forte)
- **Uso:** assinatura digital + autenticação SSL · não-repúdio
- **Armazenamento no POS:** `C:\Apex\Certs\A1-LOJA-XYZ.pfx` (protegido por ACL · só usuário do serviço LINX acessa)

**Renovação anual do certificado A1:**

A renovação é feita 30-60 dias antes do vencimento por uma empresa contratada (Certisign · Soluti) com SLA específico Apex:

1. Bruno solicita renovação no portal da certificadora 60 dias antes
2. Certificadora envia arquivo .pfx + senha por canal seguro (SFTP autenticado)
3. Bruno valida o cert em ambiente de testes (smoke test SEFAZ homolog)
4. Bruno faz deploy via TeamViewer (uma vez por POS · ~3min por POS)
5. Smoke test pós-deploy valida
6. Certificado antigo é arquivado em Azure Blob (retenção 7 anos · evidência para auditoria fiscal)

Custo de renovação: ~R$ 280 por certificado · 1.503 certificados na frota = R$ 421.000/ano (linha de custo TI).

**Validação do certificado em produção:**

A cada inicialização do LINX BIGiPOS:
- Verificação da validade (dias restantes)
- Verificação da revogação (consulta OCSP da certificadora)
- Verificação da força (bits · algoritmo)

Se algum check falha:
- Cert expirado: bloqueio total · POS não emite NFC-e
- Cert revogado: bloqueio + alerta CRITICAL · investigação imediata
- Cert fraco (deprecated): warning · agendar atualização preventiva

**Códigos de tipo de pagamento (`tPag`) usados em produção Apex:**

| Código | Forma de pagamento |
|---|---|
| 01 | Dinheiro |
| 03 | Cartão de crédito |
| 04 | Cartão de débito |
| 15 | Boleto bancário |
| 17 | PIX |
| 19 | Vale alimentação |
| 20 | Vale refeição |
| 99 | Outros (raro · usado para crediário Apex+) |

O XML completo da NFC-e tem aproximadamente 4-8KB · é assinado e enviado para SEFAZ via webservice SOAP. A resposta SEFAZ (autorização ou rejeição) também é em XML e é armazenada junto à NFC-e original em `BIG_VENDAS`.

## 3.2 Timeout SEFAZ-SP e início de contingência (Página 12)

O timeout padrão de comunicação do LINX BIGiPOS com SEFAZ-SP é **30 segundos** por tentativa. Esse valor é configurável em `C:\BIG\config\bigipos.config` na chave `sefaz.timeout_ms=30000`. A configuração foi ajustada no caso TKT-11 para 45s em todas as lojas (página 13), mas o valor padrão histórico é 30s.

**Comportamento padrão por tentativa quando SEFAZ não responde:**

**1ª tentativa:**
- LINX aguarda até 30s pela resposta
- Se timeout: registra no `bigipos-fiscal.log` (formato JSON estruturado com timestamp, chave provisória, tempo decorrido)
- Tela do operador mostra "Aguardando SEFAZ..." (sem alarme)
- Faz nova tentativa imediatamente

**2ª tentativa:**
- LINX aguarda até 30s
- Se timeout: registra log + exibe alerta amarelo discreto na tela ("Comunicação lenta com SEFAZ")
- Faz nova tentativa imediatamente

**3ª tentativa:**
- LINX aguarda até 30s
- Se timeout: registra log + executa **transição automática para modo contingência**
- Tela exibe banner permanente: "MODO CONTINGÊNCIA ATIVO desde 14h32 — vendas continuam normalmente"
- Notifica Marina (WhatsApp Business + Slack #sup-pos)
- Marca dashboard supervisor (amarelo)
- Inicia job de reconexão (tenta SEFAZ a cada 60s)

**Tempo total no pior cenário (3 timeouts sequenciais):** 90s antes de migrar para contingência. Diego percebe isso como uma venda "demorada" — o cliente espera ~90s antes de ver o cupom sair. A partir da contingência, novas vendas voltam a ter tempo normal (cupom emitido localmente, sem chamar SEFAZ).

**Operação durante contingência:**

A venda em curso quando ocorreu o 3º timeout pode ter sido autorizada por SEFAZ no último momento (race condition). O LINX trata esse caso:

- Se SEFAZ responder dentro dos 30s da 3ª tentativa mesmo após disparar contingência: a venda é emitida em modo online (chave SEFAZ definitiva)
- Se SEFAZ não responder: a venda é emitida em contingência (chave provisória local, `tpEmis=4` no XML)

Diego não precisa fazer nada diferente — o sistema decide automaticamente. O cupom impresso é visualmente idêntico, mudando apenas:
- O QR code aponta para endereço temporário (será atualizado após regularização)
- Pequena marcação "CONT" no canto superior direito (legível mas discreta)

**Alerta para Marina** (WhatsApp Business + Slack):
```
[POS Apex] Loja Pinheiros — POS Caixa 03 entrou em modo CONTINGÊNCIA às 14h32.
Causa: 3 timeouts SEFAZ-SP consecutivos.
Operação continua normalmente. Job de reconexão ativo.
Status SEFAZ-SP atual: investigação em andamento (status.fazenda.sp.gov.br).
```

Marina decide se escala para Bruno (CTO) imediatamente ou aguarda. A regra interna é: **se contingência durar >2h consecutivas**, Marina escala obrigatoriamente porque pode ser problema do link da loja (não SEFAZ) — ver `runbook_problemas_rede.pdf` seção 3.

## 3.3 Caso real TKT-11 — POS Pinheiros congelando (Página 13)

O ticket TKT-11 (Apex Mercado · loja Pinheiros) é o caso mais didático de troubleshooting NFC-e que o time TI documentou em Q2-2026. Vale a pena conhecer em detalhe porque a solução foi aplicada na frota toda como medida preventiva, e o procedimento descrito na página 29 deriva diretamente desse caso.

**Sintoma reportado por Diego (transcrição parafraseada do ticket):**

> Caixa 03 da loja Pinheiros — quando emito NFC-e em vendas com mais de 8 itens, o aplicativo do PDV congela por 30 a 45 segundos e às vezes precisa reiniciar. Aconteceu 3 vezes ontem em horário de pico (12h-13h almoço, depois 18h-19h). Loja perdeu pelo menos 2 transações (cliente desistiu e foi embora). Outros caixas da loja não apresentaram o problema.

**Análise da TI (Bruno conduziu, com apoio de Tier 3 LINX):**

O processo de investigação foi documentado em postmortem interno e seguiu três etapas:

**Etapa 1 — Coleta de evidências:**
- Logs `bigipos-fiscal.log` do Caixa 03 dos últimos 30 dias
- Logs do servidor LINX local
- Comparação com Caixa 01, 02, 04, 05, 06 da mesma loja (controle)
- Métricas de SEFAZ-SP no painel `status.fazenda.sp.gov.br` durante as 3 ocorrências
- Captura de tela TeamViewer no momento do próximo congelamento

**Etapa 2 — Hipóteses descartadas:**
- Problema de hardware Caixa 03: descartado (todos os smoke tests passavam)
- Problema de rede Caixa 03: descartado (ping/traceroute normais, sem packet loss)
- Problema de SEFAZ-SP: descartado parcialmente (SEFAZ estava lenta mas dentro do SLA)
- Problema de cliente específico: descartado (vendas com vários CPFs/CNPJs)

**Etapa 3 — Causa-raiz identificada:**

Análise detalhada dos logs `bigipos-fiscal.log` no Caixa 03 mostrou um padrão consistente:

- Em vendas com 8 ou mais itens, o LINX BIGiPOS executa **validação local pré-SEFAZ** (NCM, CFOP, alíquotas, base de cálculo ICMS, base de cálculo PIS/COFINS, regras CST por item)
- Essa validação local é executada em paralelo por componente de NFC-e usando pool de threads
- O **pool de threads do componente NFC-e era 4** (default LINX 12.5 sem ajuste)
- Em vendas com 12+ itens, os 4 threads ficavam ocupados validando os primeiros 4 itens; itens 5-12 ficavam em fila
- A validação por item demorava ~600ms em média (acesso ao banco local para resolver NCM, CFOP, alíquota por UF)
- Total para validar 12 itens com 4 threads: ~1.8s (3 batches de 4 itens × 600ms)
- Mais o tempo de envio SEFAZ: 4-8s na média, mas com pico de 12s em momentos de congestão
- **Total combinado em pico: 14-15s**, ultrapassando o timeout configurado de 30s nos casos extremos

Por que somente Caixa 03? Caixa 03 era o caixa mais usado em horário de pico (posicionamento físico — entrada principal da loja), então atendia preferencialmente as vendas grandes (carrinho cheio). Outros caixas atendiam vendas menores (cliente entrando rapidamente) e não chegavam ao limite.

**Solução aplicada (rollout Q2-2026):**

Bruno definiu três ajustes simultâneos:

1. **Aumentar pool de threads NFC-e:** `fiscal.threadpool.size=12` (de 4 para 12). Validação de 12 itens passa de 1.8s para ~600ms.
2. **Aumentar timeout SEFAZ:** `sefaz.timeout_ms=45000` (de 30s para 45s). Buffer de segurança em horário de pico.
3. **Pré-validação cache:** ativar cache local de NCM/CFOP/alíquotas (warm cache em memória). Reduz consulta ao banco local de 600ms para 80ms por item.

**Implementação:**
- Pacote homologado em ambiente piloto (5 lojas Apex Mercado) por 3 dias
- Rollout faseado: 50 lojas (semana 1), 200 lojas (semana 2), todas (semana 3)
- Distribuído via update terça 03h-05h padrão
- Smoke test pós-update validou as 3 mudanças (config dump após upgrade)

**Resultado medido:**
- **0 ocorrências de congelamento >5s em 3 semanas após patch** (vs 3-5/dia antes em Caixa 03 Pinheiros)
- Tempo médio de emissão NFC-e: 4.8s → 3.1s (queda de 35%)
- P99 de emissão NFC-e: 28s → 8.2s
- TKT-11 fechado como Resolved em 2026-04-18

**Lições para o procedimento Diego (página 29):**

Diego nunca diagnostica causa-raiz como essa — isso é trabalho de Bruno. Mas Diego DEVE escalar corretamente para Marina, que escala para Bruno com os dados certos:
- Número do POS e número do caixa
- Hora exata da ocorrência
- Quantidade de itens da venda problemática
- Forma de pagamento
- Tela travou ou apenas demorou? (diferença importante para o diagnóstico)

Esses 5 dados em um ticket bem preenchido reduzem o tempo de diagnóstico de horas para minutos. O treinamento de Diego cobre esse ponto explicitamente.

## 3.4 Pagamento múltiplo (split de formas de pagamento) (Página 14)

O LINX BIGiPOS 12.5 permite combinar até **3 formas de pagamento simultâneas** em uma mesma NFC-e. Esse é um limite técnico do LINX (não da legislação SEFAZ, que permite até 5). A decisão de manter em 3 foi do Bruno (CTO) para simplificar a operação de Diego — vendas com 4+ formas de pagamento são raras (<0.1% das vendas) e tipicamente envolvem fraude potencial (fragmentação de pagamento para evitar detecção de limite Serasa).

**Combinações suportadas e testadas em produção:**

- Dinheiro + cartão de crédito (mais comum em Apex Casa — cliente paga sinal em dinheiro)
- Dinheiro + cartão de débito
- Dinheiro + PIX (raro mas suportado)
- Dinheiro + voucher refeição (comum em Apex Mercado — almoço de cliente PJ)
- Cartão de débito + cartão de crédito (cliente esgotou limite de débito)
- Cartão de crédito (à vista) + cartão de crédito (parcelado) — divisão em dois cartões diferentes
- Cartão de débito + voucher refeição
- Voucher refeição + voucher alimentação (cliente PJ corporativo)
- PIX + cartão de crédito
- Dinheiro + cartão de crédito + PIX (combo de 3)

**Procedimento operacional (Diego):**

1. Após bipagem completa, F4 → tela de pagamento
2. Sistema mostra valor total da venda (ex: R$ 187,80)
3. Diego digita valor da 1ª forma de pagamento (ex: R$ 50,00 em dinheiro)
4. Confirma → sistema mostra saldo restante (R$ 137,80)
5. Cliente entrega R$ 50 em dinheiro · Diego confere · cliente vê valor no display LD220
6. Diego seleciona próxima forma (ex: cartão de crédito)
7. PinPad LIO V3 é acionado para o saldo (R$ 137,80)
8. Cliente insere cartão + senha · autorização Cielo em ~5-7s
9. Sistema mostra: pagamento total = R$ 187,80 (R$ 50 dinheiro + R$ 137,80 crédito)
10. Confirma → NFC-e é emitida normalmente
11. Cupom impresso mostra ambas as formas de pagamento + saldo zerado

**Restrições importantes:**

- **Troco só pode ser dado em dinheiro.** Se cliente paga R$ 200 em dinheiro em uma venda de R$ 187,80, o troco R$ 12,20 sai do caixa em dinheiro. Não há "troco" em cartão ou PIX — qualquer valor pago a maior em cartão/PIX é estornado para o próprio cartão/conta.
- **Voucher refeição/alimentação tem regras restritivas:** só pode ser usado em produtos elegíveis (alimentos perecíveis, frutas, legumes, carnes, pães, leite, queijos). Produtos não-elegíveis (produtos de limpeza, eletrônicos, vestuário) são automaticamente segregados pelo LINX em uma NFC-e separada (split fiscal). Diego não precisa fazer nada — o sistema decide.
- **Dois cartões da mesma bandeira/banco:** permitido tecnicamente, mas Cielo cobra MDR cheio em ambos. Diego deve avisar o cliente da fragmentação se identificar essa situação.
- **PIX como primeira forma + cartão depois:** funciona, mas Diego deve aguardar a confirmação do PIX antes de iniciar o cartão (lógica do PinPad). Tempo médio: ~25s para combo PIX + cartão.

**Casos especiais documentados:**

- **Voucher refeição/alimentação corporativo (Apex Tech):** algumas empresas dão voucher + parte do salário em conta. Cliente paga parte com voucher, parte com cartão de débito. Suportado normalmente.
- **Devolução combinada:** se o cliente pagou com 2 formas e quer devolver 1 item, o estorno volta proporcionalmente para as 2 formas (regra LINX configurável — atualmente em modo `proporcional` no Apex Group). Ver `faq_pedidos_devolucao.pdf` seção 6.1 para detalhes do fluxo comercial.

## 3.5 Cancelamento de NFC-e (Página 15)

A SEFAZ permite cancelamento de NFC-e dentro de uma janela legal de **30 minutos após emissão**. Após esse prazo, a operação não é mais "cancelamento" — é "devolução" (próxima seção, página 16). A janela é contada a partir do momento em que a SEFAZ retornou autorização para o LINX BIGiPOS (timestamp `dhRecbto` no XML de retorno).

**Procedimento operacional — cancelamento dentro de 30 minutos:**

O cancelamento sempre requer matrícula supervisora Marina. Diego nunca cancela sozinho — isso é proteção contra cancelamentos indevidos que podem mascarar furto interno (Diego "vendia" para si, cancelava depois).

1. **Diego identifica a necessidade de cancelamento** — cliente desistiu, produto danificado descoberto após bipagem, valor cobrado errado e cliente quer cancelar tudo
2. **Diego aciona F8** → modo cancelamento (não devolução · F8 funciona para ambos, sistema pergunta qual)
3. **Sistema solicita identificação do cupom:**
   - Opção A: digitar a chave da NFC-e (44 caracteres) lendo do cupom físico
   - Opção B: ler o QR code do cupom com o leitor 2D Honeywell
   - Opção C: digitar o número sequencial da venda no banco local (raramente usado)
4. **Sistema mostra os detalhes da NFC-e** — produtos, valores, forma de pagamento, status atual (autorizada, dentro do prazo)
5. **Sistema solicita justificativa** — campo obrigatório, mínimo 15 caracteres, vai no XML do evento de cancelamento enviado à SEFAZ. Justificativas frequentes:
   - "Cliente desistiu da compra após emissão"
   - "Produto danificado identificado após cupom"
   - "Cobrança em duplicidade no cupom"
   - "Erro de operador na bipagem"
6. **Confirmação dupla:**
   - Diego confirma com matrícula + senha
   - Marina confirma com matrícula supervisora + senha
7. **LINX envia evento de cancelamento à SEFAZ** — comunicação assíncrona, retorna em <10s
8. **SEFAZ retorna status:**
   - **135** = "Cancelamento autorizado" — sucesso
   - **136** = "Cancelamento registrado" — sucesso, mas com restrição (ex: nota já consultada por cliente)
   - **218** = "NFC-e já cancelada" — duplicidade, sucesso operacional
   - **220** = "Prazo de cancelamento expirado" — falha, virou devolução (página 16)
9. **Cupom de cancelamento é impresso** (não-fiscal, com QR code apontando para evento SEFAZ)
10. **Diego entrega cupom de cancelamento ao cliente** + faz a operação de estorno do pagamento (próximo bloco)

**Pós-cancelamento — estorno de pagamento:**

- **Dinheiro:** Diego devolve o valor da gaveta (F5 abre gaveta · Diego conta · entrega · pede confirmação ao cliente)
- **Cartão de crédito:** estorno via PinPad Cielo (Diego aciona modo "Cancelamento de Transação" no PinPad · cliente insere cartão · estorno processa em D+2)
- **Cartão de débito:** estorno via PinPad (D+1 na conta do cliente)
- **PIX:** estorno automático via API Bacen (instantâneo · cliente vê o valor de volta em <1min)
- **Voucher refeição/alimentação:** estorno via PinPad (D+0 a D+3 dependendo da bandeira)
- **Combinação:** estorno proporcional em cada forma (D+0 a D+3)

**Pós-cancelamento — efeitos sistêmicos:**

- **Estoque** é devolvido automaticamente em TOTVS (sync 5min · itens voltam para o estoque vendável)
- **Programa de fidelidade Apex+** revoga os pontos atribuídos (consistência em <15min)
- **Relatório de cancelamentos** alimenta dashboard supervisor + relatório mensal de Lia
- **Auditoria interna** revisa cancelamentos >R$ 1.000 ou padrões anômalos (>3 cancelamentos por turno de Diego = flag)

**Casos de borda:**

- **NFC-e já consultada pelo cliente** (status 136): cancelamento ainda autoriza, mas Marina deve documentar que o cliente foi avisado
- **NFC-e em contingência** (pendente de regularização SEFAZ): cancelamento aguarda regularização · sistema enfileira o evento
- **NFC-e do dia anterior** (>30min mas <24h): a janela está perdida · operação vira devolução fiscal (página 16)

**Treinamento Diego — boas práticas que evitam cancelamentos:**

A melhor forma de reduzir cancelamentos é evitar emiti-los desnecessariamente. Treinamento padrão:

1. **Sempre confirme com o cliente** o valor total antes de F4 (cliente lê display LD220)
2. **Não bipe itens duvidosos** sem visão clara (carrinho do lado pode ter produto similar)
3. **Pergunte forma de pagamento** antes de F4 (não presuma · cliente pode mudar de ideia)
4. **Identifique cliente fidelidade** no início (pergunte CPF/Apex+ antes de começar a bipar)
5. **Ofereça check de itens** se cliente parece preocupado (alguns clientes verificam tudo cuidadosamente)
6. **Aplique promoções automaticamente** (sistema faz · não há ação manual necessária)
7. **Em vendas complexas** (>15 itens · split de pagamento · cliente B2B): consulte Marina preventivamente
- **NFC-e estornada por Cielo** (chargeback): a NFC-e em si não é cancelada — vira ticket Financeiro para conciliação

**Justificativas padronizadas para cancelamento (lista controlada):**

Para evitar texto livre que pode mascarar fraude, o LINX BIGiPOS oferece lista predefinida de justificativas que Diego/Marina escolhem:

- **001** — Cliente desistiu da compra após emissão
- **002** — Produto danificado identificado após cupom
- **003** — Cobrança em duplicidade no cupom
- **004** — Erro de operador na bipagem (item indevido)
- **005** — Valor incorreto identificado (promoção não aplicada)
- **006** — Cliente esqueceu de informar fidelidade (vai gerar novo cupom)
- **007** — Forma de pagamento diferente da escolhida pelo cliente
- **008** — Outros (campo texto livre obrigatório · justificativa detalhada)

A justificativa "008 - Outros" requer pelo menos 30 caracteres e é flagada para auditoria mensal. Usos frequentes de "008" indicam que pode haver padrão novo (ainda não catalogado) que merece criar nova justificativa fixa.

**Limites operacionais para cancelamento (referência por papel):**

- **Diego (operador):** NÃO pode cancelar NFC-e sozinho · sempre requer Marina
- **Marina (supervisora regional):** pode cancelar até R$ 5.000 sem aprovação adicional
- **Gerente regional:** pode cancelar até R$ 20.000
- **Lia (Head Atendimento):** pode cancelar qualquer valor
- **Carla (CFO):** pode cancelar e fazer ajuste fiscal manual (raríssimo · só em casos de erro sistêmico)

Cancelamentos acima da alçada disparam fluxo de aprovação no HelpSphere · pode demorar de minutos a horas dependendo da disponibilidade.

**Reincidência de cancelamentos (padrão suspeito):**

O dashboard de Lia monitora padrões anômalos:
- Operador com >5 cancelamentos em 1 turno
- Loja com >50 cancelamentos em 1 dia
- Cliente fidelidade com >3 cancelamentos no mês (suspeita de uso indevido para fidelidade)
- Cancelamentos com mesmo SKU repetidamente (suspeita de fraude operador-cliente)

Esses padrões são revistos semanalmente pela Lia e podem gerar coaching, treinamento ou investigação formal.

## 3.6 Devolução fiscal — NF-e devolução (Página 16)

Após a janela de 30 minutos para cancelamento de NFC-e, qualquer operação de retorno de produto entra como **devolução fiscal** — emissão de uma nova nota (modelo NF-e ou NFC-e, dependendo do caso) com CFOP de devolução, que entra no estoque como entrada e cria o crédito tributário para o Apex Group.

A devolução fiscal NÃO é operada diretamente pelo POS. Diego apenas captura os dados do cliente em um formulário (FRM-DEV-001) e encaminha para o time fiscal da matriz, que emite a NF-e de devolução pelo TOTVS em até 48h úteis.

**CFOPs de devolução aplicáveis ao varejo Apex:**

| CFOP | Operação | Quando usar |
|---|---|---|
| **1.202** | Devolução de venda — operação interna (mesmo estado de SP) | Cliente devolve item comprado em loja Apex do estado de SP (sede também é SP) |
| **2.202** | Devolução de venda — operação interestadual | Cliente devolve item comprado em loja Apex de outro estado (ex: cliente comprou em Salvador BA, devolve em SP) |
| **5.202** | Devolução de compra — NÃO se aplica ao consumidor | Usado APENAS quando devolvemos produto ao fornecedor (B2B), nunca em devolução de consumidor final |
| **1.411** | Devolução de venda — entrada em substituição tributária | Itens em regime de ST (cigarros, bebidas alcoólicas, combustíveis) |
| **2.411** | Devolução de venda — entrada interestadual em ST | Mesma regra do 1.411 mas interestadual |
| **1.203** | Devolução de venda — produção própria | Apex Casa em alguns casos (móveis fabricados) — raro |

A escolha do CFOP é feita automaticamente pelo TOTVS com base em: estado da loja de origem, estado da loja de devolução, regime tributário do produto (ST ou normal), e tipo de operação original (venda B2C vs B2B). Diego não precisa decidir CFOP — apenas preenche FRM-DEV-001 com:

- Chave da NFC-e original (44 caracteres)
- Motivo da devolução (dropdown com opções padronizadas: defeito, arrependimento, troca por outro produto, etc.)
- Estado físico do produto (íntegro, parcialmente danificado, totalmente danificado)
- Forma de devolução do valor (mesma forma de pagamento original / crédito loja / outra forma)
- Identificação do cliente (CPF/CNPJ + nome)

**Limites operacionais para Diego (sem escalar Marina):**

- Devolução até **R$ 500** com produto íntegro e dentro de 7 dias (CDC arrependimento): Diego aceita e preenche FRM-DEV-001
- Devolução **R$ 500 a R$ 2.000**: Marina valida o produto + autoriza preenchimento
- Devolução **>R$ 2.000** ou produto danificado: escalação para Lia (Head Atendimento) que decide

**Cross-references:**

- Política comercial de devolução (prazos, condições, garantia de fábrica): `faq_pedidos_devolucao.pdf`
- Alçadas financeiras de estorno e reembolso: `politica_reembolso_lojista.pdf`
- Estoque de produto devolvido (re-entrada, descarte, retorno fornecedor): `manual_operacao_loja_v3.pdf` seção 4

**Formulário FRM-DEV-001 — campos obrigatórios:**

O formulário utilizado por Diego para iniciar uma devolução fiscal contém:

**Seção 1 — Dados da NFC-e original:**
- Chave de acesso (44 caracteres · pode ler QR code)
- Data e hora da emissão
- Valor total
- Loja emitente
- Caixa emitente
- Operador original

**Seção 2 — Dados do cliente:**
- CPF/CNPJ
- Nome completo
- Telefone de contato
- E-mail (opcional · para envio da NF-e de devolução)
- Endereço completo (obrigatório se devolução for B2C com entrega de produto novo)

**Seção 3 — Itens a devolver:**
- SKU (código do produto)
- Descrição
- Quantidade a devolver
- Valor unitário (do cupom original)
- Motivo específico do item (dropdown):
  - 001 - Defeito de fabricação
  - 002 - Não corresponde à descrição
  - 003 - Tamanho/modelo inadequado (Apex Moda · Apex Casa)
  - 004 - Avaria de transporte (apenas se já saiu para entrega)
  - 005 - Cliente desistiu (CDC 7 dias)
  - 006 - Outros (texto livre obrigatório)

**Seção 4 — Estado físico do produto:**
- Íntegro (embalagem original · revendável)
- Parcialmente danificado (avaliação técnica necessária)
- Totalmente danificado (descarte ou retorno fornecedor)

**Seção 5 — Forma de devolução do valor:**
- Mesma forma original (estorno automático em D+1 a D+30)
- Crédito loja (válido 6 meses · usável em qualquer loja Apex)
- Outra forma (cliente requisita · Marina aprova caso a caso)

**Seção 6 — Assinaturas:**
- Cliente (assinatura física · validação RG/CPF)
- Diego (matrícula + assinatura)
- Marina (se valor >R$ 500)

O formulário é digitalizado pelo Diego com scanner físico do balcão (ou foto via app interno se loja não tem scanner) e enviado por SFTP ao TOTVS fiscal. O time fiscal emite NF-e de devolução em até 48h úteis.

**Pendências comuns no FRM-DEV-001:**
- Falta de assinatura do cliente (devolve para a loja)
- CPF do cliente diferente do cupom (situação suspeita · investigação)
- Estado do produto inconsistente com motivo (ex: motivo "defeito de fabricação" mas estado "íntegro" sem fotos)
- Valor a estornar diferente do valor original (operação de troca, requer fluxo específico)

Em todos os casos, o time fiscal devolve para a loja para correção · prazo de 24h.

## 3.7 Códigos de rejeição SEFAZ frequentes (Página 17)

A SEFAZ-SP rejeita NFC-e por dezenas de motivos diferentes, codificados em uma tabela de ~700 códigos. Diego encontra na prática apenas 7-8 códigos com frequência. Esta tabela cobre os 7 mais comuns que somam ~80% das rejeições observadas no Apex Group em Q1-2026.

| Código | Descrição SEFAZ | Causa típica | Ação Diego (Tier 1) |
|---|---|---|---|
| **240** | Chave de acesso inválida | Erro de transmissão de bits (raro, geralmente rede instável) | Tentar reemissão imediata · se persistir 2x, acionar F9 contingência |
| **539** | CFOP incompatível com a operação | Venda B2B com CFOP B2C ou vice-versa · produto cadastrado com CFOP errado | NÃO tentar de novo · escalar Marina (correção cadastral TOTVS) |
| **778** | Data de emissão fora do prazo | Cupom em modo contingência além do prazo de 96h | Escalar Marina imediatamente · NÃO emitir mais notas até regularizar |
| **226** | NCM inválido ou inexistente | Produto cadastrado com NCM errado (ex: NCM revogado em revisão tributária) | Escalar Marina · não vender o item até cadastro ser corrigido |
| **452** | Inscrição estadual do destinatário inválida | Cliente PJ com IE inativa ou IE desatualizada | Confirmar IE com cliente · se cliente não souber, pode emitir como CPF (consumidor final) |
| **691** | Certificado A1 vencido | Cert A1 da loja venceu (raro pois há monitoramento) | Bruno (CTO) renova certificado · loja entra em contingência total temporária |
| **999** | Erro genérico de schema XML | Bug do LINX BIGiPOS (raro pós v12.5) | Reportar log para Bruno via ticket HelpSphere · usar POS secundário se persistir |

**Rejeições menos comuns mas importantes:**

- **204** — Duplicidade de NF-e: indica que a NFC-e já foi emitida com a mesma chave (race condition, raro). Diego não emite de novo — consulta status no painel SEFAZ.
- **301** — Uso denegado por irregularidade fiscal do emitente: situação crítica, indica que o Apex tem pendência fiscal. Marina escala Bruno + Carla (CFO) imediatamente.
- **656** — Consumo indevido: Apex ultrapassou o limite de consultas SEFAZ no minuto (rate limit). LINX aguarda 60s e tenta de novo automaticamente.

**Princípio operacional crítico:** Diego NUNCA tenta corrigir XML manualmente ou alterar dados do produto na hora. Qualquer rejeição não-trivial (todas exceto 240 transiente) vira ticket HelpSphere com:

- Código da rejeição
- Descrição completa do erro retornada pela SEFAZ
- Chave provisória da NFC-e
- Item específico que causou a rejeição (quando aplicável)
- Hora exata da tentativa
- Forma de pagamento do cliente (informação para fechamento)

Esse ticket vai para o time fiscal (categoria Financeiro · prioridade Medium · TI consultado quando o erro indica bug software). O ticket TKT-3 do seed `apex-helpsphere` (rejeição 539 em NF-e B2B) é exemplo histórico desse fluxo — resolvido em 4h após cadastro de CFOP correto no TOTVS.

**Caso real TKT-3 (detalhamento):**

> Restaurante cliente PJ (CNPJ 12.345.678/0001-90) fez pedido B2B de R$ 18.430 em hortifruti + bebidas. NFe emitida mas SEFAZ-SP retornou rejeição 539. Pedido travado na expedição há 4h. Cliente cobra entrega para almoço de amanhã.

**Análise do caso:**

1. O cliente é restaurante (PJ · CNPJ válido · IE ativa)
2. O Apex Mercado emitiu NF-e modelo 55 (não NFC-e modelo 65 · porque o destino é PJ)
3. O CFOP usado foi 5.102 (venda de mercadoria adquirida ou produzida pelo estabelecimento)
4. CFOP 5.102 NÃO é compatível com venda a restaurante (deve ser 6.108 ou similar para venda B2B intra-estadual)
5. Rejeição 539 disparou imediatamente

**Resolução:**

1. Time fiscal identificou o erro: produto tinha CFOP cadastrado errado para vendas B2B
2. Marina autorizou correção emergencial no cadastro TOTVS
3. NF-e foi reemitida com CFOP correto 6.108
4. SEFAZ autorizou em <30s
5. Pedido foi liberado para expedição
6. Cliente recebeu entrega no horário acordado

**Lição organizacional:**

A causa-raiz era falha de cadastro em massa após upgrade TOTVS. Time fiscal implementou:
- Validação preventiva (script noturno que cruza CFOP-CST por SKU e identifica inconsistências)
- Treinamento de equipe cadastro
- Auditoria mensal de CFOP por categoria de produto

**Padrão TKT-3 like (Bruno usa em diagnósticos):**

Quando uma rejeição 539 acontece em vendas B2B grandes, o procedimento padrão é:
1. Identificar o CFOP usado (no log `bigipos-fiscal.log`)
2. Identificar o tipo de cliente (B2B ou B2C)
3. Validar a compatibilidade no manual fiscal Apex
4. Se incompatível: ticket fiscal · time corrige cadastro · reemite

Esse tipo de problema é mais comum em mudanças de versão TOTVS (cadastros podem ser sobrescritos) · monitoramento ativo pós-update.

**Tabela de CFOPs mais usados no varejo Apex (referência fiscal rápida):**

| CFOP | Operação | Quando usar | Marca típica |
|---|---|---|---|
| **5.102** | Venda de mercadoria adquirida (B2C SP) | Venda consumidor final em SP | Todas |
| **6.108** | Venda de mercadoria adquirida (interestadual B2C) | Cliente de outro estado | Todas |
| **5.405** | Venda de mercadoria com ST (B2C SP) | Cigarros, bebidas, combustíveis | Apex Mercado |
| **5.949** | Outra saída · não especificada | Brindes, doações operacionais | Apex Casa (raro) |
| **5.910** | Brinde ou doação | Mercadoria distribuída como brinde | Marketing |
| **5.401** | Venda B2B comercial | Vendas a restaurantes, hotéis | Apex Mercado, Apex Logística |
| **5.403** | Venda B2B com ST | Bebidas alcoólicas para revenda | Apex Mercado |
| **1.202** | Devolução de venda (entrada · SP) | Cliente devolve no mesmo estado | Todas |
| **2.202** | Devolução de venda (entrada · interestadual) | Cliente devolve de outro estado | Todas |
| **1.411** | Devolução com ST (entrada · SP) | Devolução cigarros, bebidas | Apex Mercado |
| **1.910** | Entrada de brinde devolvido | Cliente devolve brinde (raríssimo) | Marketing |
| **5.910** | Saída de brinde | Distribuição de brindes em campanhas | Marketing |

**Treinamento fiscal para operadores (anual obrigatório):**

- 4 horas presencial em janeiro de cada ano
- Conteúdo: NFC-e × NF-e diferenças, CFOP por tipo de cliente, rejeições mais comuns, procedimento de contingência, política Apex
- Avaliação final · 75% para aprovação
- Sem aprovação: novo treinamento em 30 dias · 2 reprovações = comunicação ao RH

**Atualização de cadastros fiscais (procedimento mensal):**

Mensalmente, o time fiscal revisa:
- Novos produtos cadastrados (validação NCM + CST + CFOP)
- Mudanças regulatórias (Receita Federal · SEFAZ-SP)
- Produtos vencidos cadastralmente (NCM revogado · descontinuado)
- Promoções com regras tributárias específicas (ICMS de campanha)
- Substituição tributária (ST) por produto e UF

Mudanças são propagadas para POS via sync TOTVS na próxima janela (terça 03h-05h) · validação automática no smoke test pós-update.

**Auditoria fiscal completa (anual · outubro-novembro):**

- 100% das NFC-e do ano são amostradas (~30 milhões de notas em todo o Apex Group)
- Time fiscal externo (auditoria contratada) revisa:
  - Compatibilidade NCM × CST × CFOP
  - Bases de cálculo de ICMS / PIS / COFINS
  - Aplicação correta de ST
  - Regularização de contingências
- Resultado: relatório formal · base para correção pré-fechamento do ano
- 0 multas SPED desde 2022 (correção interna sempre antes de Receita identificar)

## 3.8 Modo contingência detalhado (emissão offline) (Página 18)

O modo contingência é o mecanismo legal previsto pela SEFAZ que permite ao varejo continuar operando quando a SEFAZ-SP está indisponível. O Apex Group aciona contingência em duas situações:

1. **Automaticamente** após 3 timeouts SEFAZ consecutivos (página 12)
2. **Manualmente** via F9 (Diego inicia, Marina é notificada automaticamente)

A emissão em contingência segue todas as regras fiscais normais, com uma diferença: a chave de acesso é gerada localmente pelo LINX (com `tpEmis=4` no XML — "contingência off-line NFC-e") e a SEFAZ valida retroativamente quando a comunicação voltar.

**Limite legal de contingência: 96 horas (4 dias)** para regularizar (transmitir as NFC-e originalmente emitidas em contingência). Após 96h, qualquer NFC-e contingenciada não regularizada vira passivo fiscal — o Apex deve emitir NF-e substituta manualmente ou justificar perda do documento.

Operacionalmente, o Apex Group tem o limite de **4 horas consecutivas em contingência** (configurável em `bigipos.config`, padrão 240min). Esse limite é mais restritivo que o legal de 96h por escolha do Apex: 4h de contingência é tempo suficiente para resolver qualquer problema operacional (link, SEFAZ, certificado); além disso indica falha sistêmica que precisa ser investigada antes de continuar.

**Procedimento de regularização (automático, em background, monitorado por Bruno):**

A regularização é totalmente automática — Diego e Marina não precisam fazer nada. O que acontece nos bastidores:

1. **POS retoma conexão com SEFAZ** (3 pings OK em <5s consecutivos)
2. **Job `BigiposContingencyRecover` (Windows Service)** detecta a reconexão
3. **O job lê a fila de contingência** do banco local (tabela `BIG_CONTINGENCY`)
4. **Para cada NFC-e contingenciada:**
   a. Monta o XML com flag `tpEmis=4` (contingência off-line NFC-e)
   b. Inclui o XML original assinado + protocolo de evento "transmissão pós-contingência"
   c. Envia para SEFAZ-SP via webservice padrão
   d. Aguarda autorização SEFAZ (timeout 60s · maior que o online porque pode haver acúmulo)
   e. SEFAZ valida e autoriza retroativamente (status 100 = autorizado)
   f. Atualiza o registro local: chave provisória → chave SEFAZ definitiva
   g. Atualiza o QR code do cupom (endpoint definitivo)
   h. Marca o cupom como "regularizado" em `BIG_VENDAS`
5. **Processo continua até esgotar a fila** (ou até 100 NFC-e por minuto · proteção contra DoS de SEFAZ)

**Tempo típico de regularização:** 5-20 minutos para drenar uma fila de contingência de 1h-2h (volume Apex Mercado movimentada). Durante esse tempo, novas vendas já são feitas em modo online (a fila é processada em thread separada).

**Monitoramento da regularização (Bruno via dashboard):**
- Total de NFC-e na fila de contingência (por POS, por loja, por marca)
- Taxa de drenagem (notas regularizadas por minuto)
- NFC-e com falha de regularização (raras — <0.1%)
- Tempo total acumulado de contingência da loja (alerta se >2h sem reconexão)

**Falha de regularização (raro · ~0.1% dos casos):**

Ocasionalmente uma NFC-e contingenciada não consegue regularizar — causas típicas:
- Cliente PJ inseriu CNPJ com erro de digitação em contingência (SEFAZ rejeita o destinatário)
- Produto vendido foi removido do cadastro nas 4h entre venda e regularização
- Erro de schema introduzido por bug pontual do LINX (extremamente raro)

Bruno é notificado por PagerDuty. O time fiscal trabalha caso a caso:
- Cancelar o cupom em janela específica (autorização SEFAZ por motivo "regularização impossível")
- Emitir NF-e substituta com referência ao cupom original
- Justificar perda do documento se necessário (registro em livro fiscal manual)

**Alerta operacional preventivo (Diego e Marina):**

Se Diego perceber que está em contingência por >30min e não recebeu notificação de retorno, ele avisa Marina informalmente (mesmo que o alerta automático já tenha disparado). Marina valida:

- Conectividade do link da loja (ping de teste rápido)
- Status SEFAZ-SP em `status.fazenda.sp.gov.br`
- Status da rede Apex em `status.apex.com.br` (página interna)

Se a contingência durar >2h, é obrigatório escalar Bruno via Slack `#ti-pos-emergencia` — pode ser problema de link da loja (não SEFAZ). Diagnóstico de rede detalhado: ver `runbook_problemas_rede.pdf` seção 3.

**Métricas históricas de contingência (Q1-2026 · referência operacional):**

| Métrica | Valor médio Apex Group | Loja outlier típica |
|---|---|---|
| Frequência de contingência por loja | 0.8 ocorrências/mês | Pinheiros teve 4/mês (rede saturada · resolvido) |
| Duração média de contingência | 18 minutos | Apex Mercado SP-Tatuapé: 2h12min (problema link) |
| % de NFC-e regularizadas com sucesso | 99.93% | — |
| % de NFC-e que não regularizam (manual) | 0.07% | Aproximadamente 1 a cada 1.500 NFC-e contingenciadas |
| Tempo médio de regularização da fila | 8 minutos | Black Friday 2025: 47 minutos em algumas lojas |
| Volume típico de fila contingência | 25 NFC-e (P50) · 120 NFC-e (P95) | Picos em datas comerciais |

**Plano de ação por duração de contingência:**

- **0-30min:** operação normal · alerta interno · sem ação especial
- **30min-2h:** Marina verifica conectividade · TOTVS sync · status SEFAZ-SP via painel público
- **2h-4h:** escalação obrigatória para Bruno · diagnóstico de rede · possível acionamento Vivo/Claro (operadoras de link)
- **>4h (limite operacional Apex):** loja pausa operação · cartazes na entrada · clientes orientados a outras lojas próximas · Lia notifica imprensa local se aplicável (raro)

A meta do Apex Group é manter contingência <1% do tempo operacional total — atingida em todos os meses de 2025 (taxa real: ~0.3%).

---

# Capítulo 4 — Pagamentos

## 4.1 Cielo PinPad — débito, crédito e voucher (Página 19)

A Cielo é a única adquirente homologada no Apex Group. A relação foi estabelecida em 2018 e renovada em 2024 com contrato de 5 anos. A escolha histórica considerou: capilaridade nacional, MDR competitivo, suporte 24/7, integração TEF nativa com LINX, e robustez do PinPad LIO V3 (vide Capítulo 1).

**Bandeiras aceitas em produção Q2-2026:**

- **Débito** (todas): Visa, Mastercard, Elo, Hiper, American Express, Discover
- **Crédito** (todas): Visa, Mastercard, Elo, Hiper, American Express, Discover, JCB, Diners
- **Voucher refeição:** Sodexo Refeição, Alelo Refeição, Ticket Refeição, VR Benefícios Refeição
- **Voucher alimentação:** Sodexo Alimentação, Alelo Alimentação, Ticket Alimentação, VR Benefícios Alimentação
- **Carteiras digitais (contactless NFC):** Apple Pay, Google Pay, Samsung Pay, Mercado Pago QR

**Limites de transação configurados na adquirência (acordo comercial Cielo · revisão trimestral pela Carla CFO):**

- Débito: até **R$ 30.000** por transação
- Crédito à vista: até **R$ 50.000** por transação
- Crédito parcelado: até **R$ 80.000** (com regras de score Serasa para vendas >R$ 5.000)
- Voucher refeição: até **R$ 500** por transação (limite Bacen)
- Voucher alimentação: até **R$ 1.000** por transação (limite Bacen)

**MDR (Merchant Discount Rate) negociado em Q2-2026:**

| Modalidade | MDR Apex Mercado | MDR Apex Tech/Moda/Casa |
|---|---|---|
| Débito | 0.89% | 1.05% |
| Crédito à vista | 1.99% | 2.12% |
| Crédito parcelado 2-6x | 2.12% | 2.35% |
| Crédito parcelado 7-12x | 2.45% | 2.68% |
| Crédito parcelado 13-18x | 2.78% | 3.05% |
| Voucher refeição | 5.00% | 5.00% (Bacen-regulado) |
| Voucher alimentação | 5.00% | 5.00% |
| PIX dinâmico | 0.49% | 0.49% (Bacen-regulado, mais baixo) |
| Contactless NFC | mesmo MDR do débito/crédito subjacente | mesmo |

Apex Mercado tem MDR mais baixo por volume (~R$ 1.2B/ano de transações). A revisão trimestral do MDR é conduzida pela Carla com benchmarking de outras adquirentes (Rede, Stone) — a Cielo costuma reajustar para manter competitividade.

**Procedimento de exceção — vendas acima do limite:**

Vendas acima do limite (ex: cliente B2B comprando R$ 75.000 em débito, que excede R$ 30.000) requerem:

1. Diego identifica que o valor excede o limite
2. Marina autoriza a tentativa de exceção com matrícula supervisora
3. Diego pluga o PinPad em modo "Aprovação Especial" (atalho no PinPad)
4. Cliente liga para o 0800 da Cielo (4004-2233) e fornece dados da transação
5. Cielo autoriza por código de operação único (válido por 5 min)
6. Diego digita o código no PinPad
7. Transação processa normalmente

Esse fluxo é raro (~30 ocorrências/mês no grupo todo) e demora 5-10min adicionais. Em vendas B2B grandes, geralmente é mais prático usar boleto (próxima seção, página 22).

**Reconciliação diária Cielo:**

A reconciliação é totalmente automatizada pelo TOTVS:

- 06h: TOTVS faz pull do extrato Cielo do dia anterior via API
- 07h: Cruza com vendas do POS (Cielo TID ↔ Apex venda ID)
- 08h: Gera relatório de reconciliação para Carla (CFO)
- Divergências são abertas como tickets Financeiro (ver TKT-41 no seed `apex-helpsphere` — diferença R$ 2.847 em conciliação Cielo abril/2026)

## 4.2 PIX dinâmico via QR code (Página 20)

O PIX é a forma de pagamento que mais cresceu no Apex Group em 2025: passou de 8% das vendas em janeiro/2025 para 28% em dezembro/2025. Em Apex Mercado, o PIX representa 35% das vendas (alta penetração no público B). A modalidade utilizada é **PIX cobrança dinâmica** — QR code único por venda, com identificador `txid` no padrão Bacen.

**Fluxo operacional (Diego):**

1. F4 → tela de pagamento abre
2. Diego seleciona "PIX" como forma de pagamento
3. PinPad LIO V3 gera o QR code dinâmico em ~1s (chamada API Cielo PIX → API Bacen)
4. PinPad exibe o QR code grande na tela frontal (visível para o cliente)
5. Cliente abre o app do banco dele (qualquer banco brasileiro · compatível com PIX)
6. Cliente lê o QR code com a câmera do celular
7. App do banco mostra os dados: destinatário (Apex Mercado SA), valor (R$ 187,80), txid (identificador)
8. Cliente confirma com biometria ou senha do app
9. Banco do cliente processa o débito + envia para o banco da Apex via SPI Bacen
10. SPI confirma o crédito no banco da Apex em <2s
11. Cielo recebe a confirmação e notifica o PinPad LIO V3
12. PinPad mostra "APROVADO" + LINX BIGiPOS recebe a confirmação
13. NFC-e é emitida automaticamente
14. Cupom impresso mostra "PIX" como forma de pagamento + os 4 últimos dígitos do txid

**Tempo total típico:** 8-15s (do F4 ao cupom impresso). O P95 é 14.5s — depende fortemente da confirmação do banco do cliente (alguns bancos digitais são mais lentos que outros).

**Vantagens do PIX vs cartão:**
- **Liquidação D+0** (dinheiro disponível imediatamente, vs D+2 do crédito ou D+30 do parcelado)
- **MDR mais baixo** (0.49% vs 2.12% do crédito à vista) — economia de 1.63% em cada venda
- **Sem risco de chargeback** (PIX não tem mecânica de disputa pós-pagamento, exceto em casos de fraude comprovada)
- **Cliente pode usar qualquer banco** (universal · não depende de bandeira aceita pela Cielo)

**Reconciliação PIX:**

A reconciliação PIX é feita pelo TOTVS via consulta direta à API do Bacen (PIX Recebimentos):

- 06h: TOTVS consulta o extrato PIX do dia anterior na API Bacen
- 06h30: Cruza cada `txid` recebido com vendas do POS
- 07h: Matching automático para 99%+ dos casos
- 07h30: Relatório de divergências para Carla (~1% dos casos · cliente pagou valor errado, txid de PIX manual sem venda associada, etc.)

**Caso de borda — PIX devolvido pelo banco do cliente após autorização:**

Extremamente raro (<0.05% dos casos), mas pode ocorrer quando:
- Cliente paga com PIX, recebe o cupom, vai embora
- O banco do cliente identifica fraude interna posteriormente (ex: conta hackeada)
- O banco do cliente retorna o PIX em até 30 dias via SPI Bacen
- O dinheiro sai da conta da Apex automaticamente
- Bruno é notificado via PagerDuty
- TOTVS cria ticket Financeiro com a venda associada
- O time Jurídico avalia se há recurso (raramente compensa pelo valor médio)

**Suporte PIX 24/7:** se há problema com PIX (QR code não gera, cliente confirma mas Apex não recebe, etc.), o suporte é Cielo PIX (0800 dedicado · disponível 24/7).

**Adoção do PIX no Apex Group (timeline histórica):**

| Período | % PIX nas vendas (Apex Group) | Observações |
|---|---|---|
| Q1-2021 | 0.5% | Lançamento Bacen · adoção inicial |
| Q4-2021 | 2.8% | Primeiro Dia das Mães com PIX |
| Q2-2022 | 6.5% | Black Friday 2022 com PIX em destaque |
| Q4-2022 | 9.2% | Apex Mercado lidera adoção |
| Q2-2023 | 14.7% | Apex Tech começa adoção forte |
| Q4-2023 | 18.5% | Black Friday 2023 |
| Q2-2024 | 22.3% | Crescimento sustentado |
| Q4-2024 | 25.8% | — |
| Q2-2025 | 28.4% | — |
| Q4-2025 | 31.2% | — |
| Q1-2026 | 32.8% | Apex Mercado >40% PIX em algumas lojas |

O PIX é a forma de pagamento de crescimento mais rápido na história do varejo brasileiro · projeção Apex para Q4-2026 é 35%.

**Variantes do PIX em produção Apex:**

- **PIX cobrança dinâmica** (padrão · QR único por venda · txid identificador)
- **PIX cobrança estática** (QR fixo da loja · cliente digita valor · raro · usado em quiosques pequenos)
- **PIX Pagamento** (cliente envia PIX direto · raro · só para casos especiais B2B)
- **PIX Saque** (PIX em ATM · não aplicável a POS)
- **PIX Troco** (cliente paga PIX + recebe troco em dinheiro · aceito em todas as lojas Apex desde 2024)

A maior parte das vendas usa PIX cobrança dinâmica (~95% dos casos).

## 4.3 Crédito parcelado (Página 21)

O parcelamento em crédito é uma demanda forte no varejo brasileiro, especialmente em Apex Tech (eletrônicos com ticket alto) e Apex Casa (móveis). O Apex Group opera com a tabela padrão Cielo + ajustes comerciais negociados pela Lia (Head Atendimento) e Carla (CFO).

**Parcelamento permitido em Q2-2026:**

- **2x a 12x sem juros para o cliente** (juros absorvidos pelo Apex em campanhas vigentes)
- **13x a 18x com juros tabela LINX** (1.99% a.m. sobre o saldo devedor)
- **Limite máximo de parcelas: 18x** (limite operacional Cielo no LINX 12.5)

A faixa "sem juros para o cliente" varia por marca e por campanha:

| Marca | Sem juros padrão Q2-2026 | Sem juros em campanha (ex: Dia das Mães) |
|---|---|---|
| Apex Mercado | até 6x | até 10x (raro · só carnes nobres e vinhos) |
| Apex Tech | até 12x | até 18x sem juros (Black Friday) |
| Apex Moda | até 10x | até 12x sem juros (coleções de inverno) |
| Apex Casa | até 12x | até 18x sem juros (móveis acima de R$ 5.000) |
| Apex Logística | N/A (B2B com boleto) | N/A |

**Procedimento operacional (Diego):**

1. F4 → tela de pagamento
2. Diego seleciona "Cartão de crédito parcelado"
3. PinPad LIO V3 ativa modo parcelamento
4. PinPad pergunta o número de parcelas (1 a 18)
5. **Cliente digita o número no PinPad** (Diego NÃO digita pelo cliente · compliance Bacen)
6. PinPad mostra o valor de cada parcela (com juros se aplicável)
7. Cliente confirma com OK
8. Cliente insere o cartão de crédito
9. Cliente digita senha
10. Cielo consulta limite + autoriza em 5-7s
11. Em vendas acima de R$ 5.000: Cielo faz consulta complementar Serasa antes de autorizar (mais 2-3s)
12. Aprovação → LINX emite NFC-e + cupom mostra parcelas
13. Cliente recebe cupom + via cliente

**Regra crítica Bacen — número de parcelas pelo próprio cliente:**

O cliente sempre confirma o número de parcelas digitando no PinPad. Diego NUNCA toca no PinPad nem digita o número de parcelas pelo cliente. Essa regra existe por dois motivos:

1. **Compliance Bacen** — o cliente deve ter ciência inequívoca do parcelamento contratado
2. **Proteção contra fraude** — operadores poderiam parcelar em mais vezes do que o cliente pediu, aumentando MDR (o que não muda o que o cliente paga, mas piora o resultado financeiro do Apex)

Se o cliente não consegue operar o PinPad (idoso com dificuldade, deficiência visual), Marina vai até o caixa e ajuda — sempre com matrícula supervisora registrada no LINX.

**Cancelamento de venda parcelada:**

Se o cliente quer cancelar uma venda parcelada dentro da janela de 30min (página 15), o estorno volta para o cartão em parcela única no extrato do mês seguinte (Cielo processa em D+2 mas pode aparecer na fatura em 30-60 dias dependendo do banco do cliente).

Após 30min, o cancelamento vira devolução fiscal e o estorno é processado também em D+2 mas com regras de devolução de parcelas (banco do cliente desconta as parcelas futuras do cartão automaticamente).

**TKT-10 do seed `apex-helpsphere`** ilustra um caso clássico: cliente comprou Smart TV 65" parcelada em 12x via cartão Itaú, pediu cancelamento após 28h alegando que não viu o boleto/parcelamento. Decisão: como CDC garante 7 dias para arrependimento em compras online, o cancelamento foi processado por exceção (escalação para Marina + Lia · análise comercial).

**Parcelamento em campanhas comerciais — exemplos práticos Q2-2026:**

Algumas campanhas vigentes em Q2-2026 que afetam o parcelamento na operação POS:

- **Apex Tech · "Volta às Aulas"** (até 31/03/2026): notebooks até R$ 8.000 em 18x sem juros (taxa absorvida pelo Apex em ~3.2% no caixa)
- **Apex Casa · "Lar de Verão"** (até 30/04/2026): móveis acima de R$ 5.000 em 24x com juros reduzidos (1.49% a.m. em vez de 2.49%)
- **Apex Moda · "Renovação de Inverno"** (até 31/05/2026): peças acima de R$ 300 em 12x sem juros em cartões Itaú, Bradesco e Santander (campanha co-marcada com bancos)
- **Apex Mercado · "Vinhos Premium"** (Q2-2026 todo): vinhos acima de R$ 200 em até 10x sem juros (raro · alta margem permite)

Diego não memoriza as campanhas — o LINX BIGiPOS recebe via sync TOTVS e aplica automaticamente quando o produto + cartão correspondem à regra. O sistema mostra mensagem "CAMPANHA ATIVA · 18x sem juros" ao cliente · Diego apenas confirma.

**Limites de aprovação Serasa e antifraude:**

Em vendas acima de R$ 5.000, a Cielo executa consulta complementar antes de autorizar:

- **Score Serasa do cliente** (consulta automática · 100ms)
- **Histórico do cartão** na Cielo (uso recente · velocidade de transações)
- **Geolocalização do PinPad** (cidade + estado · comparação com perfil do cliente)
- **Padrão de gasto** do cliente (compara com histórico do cartão · alerta se ultrapassa significativamente)

Resultado:
- **Aprovação automática:** score alto + perfil compatível
- **Aprovação com validação adicional:** score médio · cliente recebe SMS do banco para confirmar a transação · espera ~2-5min na loja
- **Negação automática:** score baixo · padrão atípico · cliente é orientado a outra forma de pagamento (sem expor o motivo)

A negação automática Cielo é diferente de negação por saldo. O cartão fica "marcado" para reanálise pelo banco emissor · cliente recebe ligação do banco depois. Diego nunca explica esses detalhes ao cliente.

**Política de chargeback (estorno solicitado pelo cliente ao banco · após D+30):**

Eventualmente, um cliente questiona uma compra com seu banco emissor mesmo após o cartão ter sido autorizado e a NFC-e emitida. O banco abre disputa formal:

1. Apex Group recebe notificação Cielo (3-5 dias após cliente reclamar ao banco)
2. Tesouraria do Apex tem **7 dias úteis** para apresentar evidências
3. Evidências aceitas: cupom assinado pelo cliente (físico ou digital · raro em NFC-e), gravação CFTV mostrando o cliente no caixa, transcript de chat com cliente (se SAC envolvido), comprovante de entrega (Apex Casa · Apex Tech)
4. Cielo julga · pode aceitar (Apex perde o valor) ou rejeitar (cliente perde a disputa)
5. Taxa de sucesso histórica Apex: ~68% (média varejo BR é 55%)

Chargebacks aumentam o MDR do Apex se a taxa anual ultrapassa 1.5% do volume · monitoramento contínuo pela Cielo. O Apex mantém histórico de 0.4% em 2025 (saudável).

## 4.4 Boleto e crediário Apex+ (Página 22)

**Boleto bancário (B2B — somente cliente PJ):**

O boleto é a forma preferencial de pagamento B2B no Apex Group. Cliente PJ identifica-se no início da venda informando o CNPJ — o LINX BIGiPOS busca o cadastro no TOTVS e mostra:

- Razão social
- Inscrição estadual (validada SEFAZ no momento da consulta)
- Limite de crédito B2B aprovado (R$ 5.000 padrão · até R$ 500.000 para clientes recorrentes)
- Histórico recente (últimas 3 vendas com boleto · status de pagamento)

**Procedimento (Diego):**

1. Cliente PJ chega ao caixa
2. Diego pergunta "Pagamento à vista ou prazo?"
3. Se prazo: Diego pede CNPJ
4. LINX consulta TOTVS + valida cadastro (~3s)
5. Sistema mostra limite disponível e valida que a venda cabe
6. Diego confirma com o cliente o prazo de vencimento (padrão D+5 · D+30 com aprovação Marina)
7. Diego seleciona "Boleto" no F4
8. LINX gera o boleto via API Banco do Brasil (banco oficial Apex Group)
9. NFC-e é emitida com o boleto como forma de pagamento (`tPag=15` no XML)
10. Cupom + boleto são impressos juntos
11. Cliente leva o boleto físico

**Compensação do boleto:**
- Vencimento D+5 (padrão) ou D+30 (com aprovação Marina + aprovação de crédito Carla)
- Pagamento no banco do cliente → Banco do Brasil recebe → arquivo CNAB diário
- TOTVS importa CNAB às 06h do dia seguinte
- Conciliação automática (boleto pago → status atualizado)
- Boleto vencido por >5 dias → cobrança automatizada (e-mail + SMS) + bloqueio de novos pedidos

**Crediário Apex+ (B2C — somente Apex Casa e Apex Moda):**

O crediário Apex+ é o cartão private label do Apex Group, emitido em parceria com a FinTech Vortex Pay (operação financeira). Disponível em Apex Casa e Apex Moda — não em Apex Mercado (margens baixas não justificam o custo de operação financeira) nem em Apex Tech (cartões de crédito tradicionais já dominam essa base).

**Modalidade:**
- Cartão chip + senha (físico) emitido na hora pela Vortex Pay
- Limite inicial: R$ 1.500 (com possibilidade de aumento após 3 meses de uso saudável)
- Parcelamento: até **24x com juros 2.49% a.m.** (mais alto que cartão de crédito tradicional, pois é crediário)
- Sem anuidade no primeiro ano
- Anuidade R$ 89/ano a partir do 2º ano (isentável com R$ 1.500 de gasto anual)

**Procedimento de venda com Apex+:**

1. Cliente apresenta o cartão Apex+ no PinPad LIO V3
2. PinPad ativa modo "crediário Apex+"
3. PinPad consulta o saldo Vortex Pay (real-time API) em ~3s
4. Mostra parcelas disponíveis (2x a 24x · valor de cada parcela com juros visíveis)
5. Cliente seleciona número de parcelas
6. Cliente digita senha de 4 dígitos
7. Vortex Pay autoriza em ~5s (se score interno passa) ou nega
8. Em vendas >R$ 1.000 ou cliente com score baixo (<580): Vortex Pay solicita validação adicional Serasa (mais 5-8s)
9. Aprovação → LINX emite NFC-e + cupom

**Critérios de aprovação Apex+:**
- Score interno Vortex Pay >700 → aprovação automática
- Score 580-700 → aprovação automática se valor <R$ 3.000
- Score <580 ou valor >R$ 5.000 → análise manual em 30min (cliente pode aguardar na loja ou voltar)
- Análise manual >R$ 5.000 → aprovação por Lia (Head Atendimento) que decide com base em histórico

**Reconciliação Apex+:**
- Relatório diário Vortex Pay → TOTVS → SAP FI (mesmo fluxo que cartão)
- Inadimplência alta em Apex+ (15-20% típico para crediário) é absorvida em parte pelo MDR mais alto que o Apex cobra (~5% efetivo)
- Cobrança terceirizada para Vortex Pay (Apex não cobra cliente diretamente)

**Análise comparativa formas de pagamento (referência decisória para o Apex Group):**

A tabela abaixo consolida o "custo total" de cada forma de pagamento do ponto de vista da Apex (considerando MDR + custo de capital + risco). Atualizada trimestralmente pela Carla (CFO).

| Forma | MDR efetivo | Liquidação | Risco fraude | Risco chargeback | Custo total efetivo |
|---|---|---|---|---|---|
| Dinheiro | 0% | D+0 | Médio (roubo/furto) | 0% | ~0.3% (custo manuseio + sangria + cofre) |
| PIX | 0.49% | D+0 | Baixo | Quase 0% | 0.49% |
| Débito | 0.89-1.05% | D+1 | Muito baixo | Baixo | ~1.0% |
| Crédito à vista | 1.99-2.12% | D+30 | Baixo | Médio | ~2.5% (com custo de capital) |
| Crédito parcelado 6x | 2.12-2.35% | D+30 | Baixo | Médio | ~3.0% |
| Crédito parcelado 12x | 2.45-2.68% | D+30 | Baixo | Médio | ~3.5% |
| Voucher refeição | 5.00% | D+15 | Muito baixo | Baixo | ~5.2% |
| Boleto (B2B) | 0.5-1.5% (banco) | D+5 a D+30 | Médio (inadimplência) | Não aplicável | ~3-5% (com inadimplência ~5%) |
| Crediário Apex+ | 5% MDR + risco inadimplência | D+30 | Alto (Apex absorve) | Médio | ~12-18% (com inadimplência) |

A estratégia comercial do Apex orienta a equipe de marketing a incentivar PIX (custo mais baixo + liquidação imediata). Em Apex Mercado, a comunicação visual nas lojas destaca PIX como forma preferencial.

**Política de aceitação de cheque (NÃO aceito):**

Desde Q1-2024, o Apex Group **não aceita cheques** em nenhuma loja. A decisão foi tomada por Carla (CFO) com base em:
- Alta taxa de cheques devolvidos (~12% em 2023)
- Custo operacional de cobrança (terceirizada · ~R$ 80 por cheque devolvido)
- Substituição efetiva pelo PIX (>95% dos casos)

Diego é treinado para recusar cheque com mensagem padrão: "Senhor, o Apex Group descontinuou a aceitação de cheques · aceitamos dinheiro, débito, crédito, PIX e voucher refeição/alimentação. Posso ajudá-lo com outra forma de pagamento?"

Em casos de cliente insistente (raros), Marina é acionada e a mensagem é reforçada formalmente. Não há exceções nem aprovações para aceitar cheque · política firme em toda a frota.

**Reconciliação financeira diária (visão consolidada):**

A reconciliação completa do dia anterior é feita até as 09h da manhã pelo time financeiro · todos os fluxos abaixo são automatizados:

1. **04h00:** Sync final do POS para TOTVS (todas as vendas do dia anterior)
2. **05h00:** Sync TOTVS para SAP FI (lançamento contábil consolidado)
3. **05h30:** TOTVS consulta API Bacen para extrato PIX
4. **06h00:** TOTVS consulta API Cielo para extrato de cartões
5. **06h30:** Matching automático venda × pagamento (POS × adquirente)
6. **07h00:** Matching boletos (CNAB Banco do Brasil)
7. **07h30:** Geração de relatório consolidado por loja + por marca
8. **08h00:** Análise de divergências (taxa esperada <0.5%)
9. **08h30:** Tickets Financeiro abertos para divergências relevantes (>R$ 100)
10. **09h00:** Dashboard executivo atualizado · Carla, Lia, Bruno têm visibilidade

**Tipos de divergência mais comuns:**

| Tipo | Frequência | Investigação |
|---|---|---|
| PIX recebido sem identificação | ~3/dia | API Bacen + planilha pedidos abertos |
| Cartão débito Cielo divergência centavos | ~5/dia | MDR cents · tolerável |
| Cartão crédito MDR diferente | ~1/semana | Contrato Cielo · pode ser revisão de tabela |
| Boleto pago mas não retorno banco | ~2/semana | Banco do Brasil cobranças |
| Sangria divergente do esperado | ~1/dia | Caixa investiga · CFTV |

**Indicadores de saúde financeira do POS:**

- Taxa de reconciliação automática: 99.4% (target >99%)
- Tempo médio de matching automático: <2s por transação
- % de transações com divergência: 0.6% (target <1%)
- Tempo médio de resolução de divergência: 18h úteis
- Volume diário total Apex Group: ~R$ 18M (média dia útil 2026-Q1)

---

# Capítulo 5 — Operações do operador

## 5.1 Abertura de caixa (Diego) — PROC-POS-002 (Página 23)

A abertura de caixa é o primeiro procedimento operacional do turno de Diego. Ela formaliza o início da operação do caixa, registra o saldo inicial (troco) e habilita o POS a aceitar vendas. Sem abertura formal, o POS não emite NFC-e — proteção contra operação não-autorizada.

**Pré-requisitos antes de iniciar PROC-POS-002:**

- POS ligado e LINX BIGiPOS em modo "Aguardando login"
- Smoke test pós-update (se houve update na madrugada) já validado com sucesso (página 9)
- Papel térmico no estoque mínimo (Diego confere visualmente antes de logar — mínimo 2 rolos completos + 1 rolo parcialmente usado em uso)
- Troco inicial entregue pela supervisora Marina em envelope lacrado:
  - Valor padrão R$ 200 em moedas (R$ 50) e cédulas pequenas (R$ 5, R$ 10, R$ 20, R$ 50)
  - Envelope numerado e assinado por Marina + Diego ao receber (registro de cadeia de custódia)
- PinPad LIO V3 ligado, com tela inicial "Aguardando transação"
- Leitor 2D Honeywell funcional (teste rápido lendo um produto qualquer · sem registrar venda)

**Procedimento:**

1. **Diego faz login** com matrícula + senha no LINX BIGiPOS
2. **Tela "Abertura de Caixa"** aparece automaticamente (obrigatória antes de qualquer venda)
3. **Diego digita o valor do troco recebido** (R$ 200,00 padrão)
4. **Sistema solicita confirmação supervisora** — Marina chega ao caixa com matrícula supervisora
5. **Marina valida o valor com matrícula + senha** (duplo controle · proteção contra valor incorreto)
6. **Caixa é aberta** — status mudado para "Caixa Aberto" em `BIG_CAIXAS`
7. **Sistema imprime cupom de abertura** (não-fiscal · formato:
   ```
   ============================
       APEX MERCADO - LOJA 142
       Pinheiros - SP
       Caixa 03
       Operador: Diego A.
       Supervisor: Marina B.
       Data/Hora: 11/05/2026 08:32:14
   ============================
       ABERTURA DE CAIXA
       Saldo inicial: R$ 200,00
   ============================
   ```
8. **POS fica em modo "Aguardando primeira venda"** — display LD220 mostra "Bem-vindo à Apex Mercado · Caixa aberto"

**Variações por situação:**

- **Primeiro caixa do dia:** Marina supervisiona o procedimento integralmente, valida o troco fisicamente, confere a senha do cofre antes de retirar o troco
- **Substituição de operador no mesmo POS:** o operador anterior fecha caixa (PROC-POS-003) antes do novo operador abrir · não pode haver "passagem direta"
- **Reabertura após pausa longa (almoço >2h):** se o operador fechou Ctrl+L por mais de 2h, sistema solicita nova matrícula supervisora para reabrir (proteção contra esquecimento de fechamento)

**Saldo inicial diferente de R$ 200 (exceções):**

- Lojas Apex Tech com público VIP (Itaim, Faria Lima): saldo inicial R$ 500 (mais troco para cheques e cartões em valor alto · raro)
- Lojas Apex Mercado em bairros populares: saldo inicial R$ 300 (mais moedas e cédulas pequenas)
- Apex Logística (recebimento doca): saldo inicial R$ 0 (não há venda em dinheiro)

Esses valores são definidos pela gerência regional em consenso com Lia (Head Atendimento) e atualizados em política trimestral.

**Senha do operador e política de rotação:**

- Senha tem entre 8 e 32 caracteres · letras maiúsculas, minúsculas, números, caracteres especiais
- Rotação obrigatória a cada 60 dias (compliance PCI-DSS · Lia + Carla aprovaram)
- Histórico de senhas: não pode reutilizar as últimas 12 senhas
- 5 tentativas erradas em sequência: bloqueio por 30min · 10 erradas = bloqueio total (somente Bruno desbloqueia via TI)
- Senha NUNCA compartilhada (mesmo entre Diego e Marina · cada operador tem a sua)
- Mudança de senha: tela específica no LINX BIGiPOS após login (acessível só pelo próprio usuário)

**Cadastro de novo operador (procedimento RH + TI):**

Quando uma nova operadora ou operador é contratado para uma loja:

1. RH cria o cadastro no eSocial + sistema folha (Senior) com CPF + nome + papel
2. TI (Bruno) recebe notificação automática (ticket interno)
3. TI cria matrícula POS no LINX BIGiPOS (sync TOTVS · disponível na loja em 24h)
4. Marina realiza onboarding operacional na loja (4 horas · treinamento PUF + PROC-POS-001/002/003)
5. Nova operadora opera o POS com supervisão Marina nas primeiras 8 horas
6. Após 8h sem incidentes: operação autônoma liberada (logoff supervisora)
7. Após 30 dias: avaliação de desempenho (tempo médio · taxa de divergência fechamento · feedback cliente)

**Tabela de tempos médios de onboarding observados** (referência RH):

| Métrica | Operador novato (semana 1) | Operador maduro (mês 1+) |
|---|---|---|
| Tempo médio por venda | 90-150s | 45-75s |
| Taxa de erro de bipagem | ~2.5% das vendas | <0.3% das vendas |
| Divergência média no fechamento | R$ 8-15 | <R$ 3 |
| Chamadas para Marina por turno | 6-10 | 0-2 |
| Confiança operacional (autoavaliação 1-10) | 5-6 | 9-10 |

A curva de aprendizado tipica é 30-45 dias para atingir desempenho de operador maduro · varia por marca (Apex Tech é mais lento por dúvidas técnicas constantes · Apex Mercado é mais rápido por padronização).

**Sistema de turnos e jornada de trabalho (CCT do varejo SP-2026):**

A operação do POS é organizada em turnos definidos por CCT (Convenção Coletiva de Trabalho) do varejo de São Paulo · atualizada anualmente em maio. Em 2026, as principais regras:

- **Jornada de trabalho:** 44h/semana (8h/dia · 4h sábado)
- **Banco de horas:** saldo positivo máximo 60h · compensação em 60 dias
- **Hora-extra:** 50% acréscimo após 44h/semana
- **DSR (Descanso Semanal Remunerado):** garantido 1 dia por semana (preferencialmente domingo)
- **Insalubridade:** não aplicável a operadores POS (ambiente seguro)
- **Periculosidade:** aplicável apenas em operação noturna isolada (raro · pequena adicional)

**Turnos padrão por marca:**

| Marca | Turno 1 | Turno 2 | Turno 3 |
|---|---|---|---|
| Apex Mercado (24h em algumas lojas) | 06h-14h | 14h-22h | 22h-06h (só lojas 24h) |
| Apex Tech | 09h-13h + 14h-18h | 14h-22h | Não há |
| Apex Moda | 10h-14h + 15h-22h | 14h-22h | Não há |
| Apex Casa | 09h-13h + 14h-18h | 14h-22h | Não há |
| Apex Logística (CDs) | 06h-14h | 14h-22h | 22h-06h |

Diego trabalha o Turno 1 de Apex Mercado (06h-14h · com 1h de almoço inserida) · turno padrão de 8h com benefícios CCT.

**Benefícios CCT do varejo SP-2026:**

- Vale-refeição R$ 28,50/dia (compensação por almoço · varia por marca)
- Vale-transporte (passe livre para todos os colaboradores · descontado 6%)
- Plano de saúde Bradesco Saúde Top Nacional (custo R$ 285/mês · 80% subsidiado pelo Apex)
- Plano odontológico (custo R$ 35/mês · 100% subsidiado)
- Seguro de vida em grupo
- Programa de participação nos lucros (PLR · anual · variável)

Esses benefícios são padronizados em toda a frota Apex · revisão em consenso com sindicato do comércio.

**Política de uniforme:**

- Camiseta padrão Apex (cor da marca · ex: vermelho Apex Mercado · azul Apex Tech)
- Crachá funcional visível
- Sapatos fechados (segurança · norma NR-32)
- Cabelo preso ou contido (higiene · Apex Mercado em padaria + açougue)
- Maquiagem discreta
- Sem joias chamativas em operação caixa
- Esmalte neutro
- Calçado: tênis ou sapato fechado (sapatos abertos proibidos por NR)

Marina é responsável por validar o uniforme no início do turno · Diego sem uniforme é orientado a retornar para casa (raríssimo).

**Política de redes sociais (operação POS):**

- Diego NÃO pode fotografar ou filmar dentro do caixa (proteção CFTV + LGPD)
- Diego NÃO pode mencionar nome de clientes nas redes
- Diego NÃO pode reclamar do Apex publicamente (cláusula contratual)
- Compartilhar promoções autorizado · feedback positivo autorizado
- Violação grave: processo disciplinar (suspensão · até demissão por justa causa em casos extremos)

Lia (Head Atendimento) coordena programa de embaixadores · operadores podem se candidatar a ser "embaixadores Apex" e receber benefícios extras para divulgação aprovada.

## 5.2 Operação normal durante o turno (Página 24)

Após PROC-POS-002, Diego entra em modo de operação normal: bipagem de produtos, atendimento de clientes em fila, dúvidas pontuais, ocasionais escalações para Marina. O turno padrão é de 6 horas em Apex Mercado e 8 horas em Apex Tech/Moda/Casa (variação por CCT).

**Diretrizes operacionais durante o turno:**

**Tempo médio por cliente:**
- Apex Mercado: 45-90s (varia por tamanho do carrinho · média 60s)
- Apex Tech: 75-120s (tempo maior pela dúvida técnica frequente · média 90s)
- Apex Moda: 40-70s (carrinhos pequenos · média 50s)
- Apex Casa: 60-100s (cliente decide na hora · média 75s)
- Apex Logística (CDs): 120-300s (notas grandes, pagamento boleto, conferência)

**Cumprimento padrão Apex:**
- "Boa tarde, tudo bem?" + olhar nos olhos do cliente (treinamento de hospitalidade)
- Se cliente é fidelidade identificado: chamar pelo nome ("Boa tarde, Sr. Marcelo")
- Sempre confirmar valor total antes de F4 ("São R$ 187,80, confirma?")
- Sempre perguntar forma de pagamento (NÃO presumir · cliente pode mudar)
- Sempre agradecer ao final ("Obrigada, Sr. Marcelo · volte sempre")

**Dúvidas do cliente sobre produto:**
- Dúvida de preço/estoque: Diego consulta F1 (modo consulta de produto · não interrompe venda em curso)
- Dúvida técnica (Apex Tech) ou de tamanho (Apex Moda): Diego chama vendedor de salão usando o interfone do balcão · não bloqueia o caixa
- Dúvida sobre garantia: Diego informa que está no cupom + cliente recebe folder informativo · detalhes em `faq_pedidos_devolucao.pdf`
- Dúvida sobre prazo de entrega (Apex Casa): vendedor de salão é chamado · Diego não compromete prazo

**Erro de bipagem por engano (antes de F4):**
- Diego identifica o item errado na tela (parte de baixo · lista de itens da venda em curso)
- Usa F3 para remover o último item (ou navega para um item específico com setas)
- Confirmação: tela retorna ao subtotal anterior
- Item removido não aparece em nenhum cupom · não vai para o relatório fiscal

**Cliente quer mudar de ideia (antes de F4):**
- Diego pode cancelar a venda inteira sem emitir nada
- Procedimento: ESC (tecla escape) → sistema pergunta "Cancelar venda em curso?" → confirma
- Carrinho zera · estoque não é alterado · NFC-e não é emitida
- Cliente sai sem cupom

**Falha de comunicação durante venda:**
- Se SEFAZ não responde após F4: transição automática para contingência (página 12) · venda continua
- Se PinPad não responde: Diego tenta recovery USB (página 31) ou pede pagamento em dinheiro alternativo
- Se rede da loja cai completa: PinPad usa modem 4G interno + LINX entra em contingência total · operação continua

**Fim de fila (cliente esperando >5min):**
- Diego sinaliza para Marina (sem interromper venda em curso)
- Marina decide: abre outro caixa (chamando outro operador) ou auxilia com pacotamento para acelerar a fila
- Tempo máximo aceitável de fila: 10min (define-se na política operacional `manual_operacao_loja_v3.pdf`)

**Pausa para banheiro / almoço:**
- Pausa rápida (<10min): Diego usa Ctrl+L (trava tela) · cliente em curso é informado · outro caixa atende se possível
- Almoço (>30min): Diego encerra turno com Ctrl+Q · outro operador abre caixa próprio (PROC-POS-002) no mesmo POS · Diego volta após almoço com novo PROC-POS-002

**Hierarquia de atendimento ao cliente — escalonamento:**

| Situação | Quem decide | Tempo médio |
|---|---|---|
| Venda normal | Diego sozinho | 45-90s |
| Dúvida de preço / promoção | Diego (via F1 · consulta sistema) | 30s adicional |
| Dúvida técnica produto (Apex Tech) | Diego chama vendedor de salão | 2-5min |
| Dúvida tamanho (Apex Moda) | Diego chama vendedor de salão | 2-5min |
| Aplicar desconto (até 10%) | Marina autoriza com matrícula | 1-2min |
| Aplicar desconto (10-25%) | Marina + gerente regional | 5-15min (pode esperar dia seguinte) |
| Aplicar desconto (>25%) | Lia (Head Atendimento) | 15-60min (pode pedir cliente voltar) |
| Cliente quer falar com gerente | Marina assume · escala se necessário | Imediato |
| Cliente VIP com problema | Marina escala diretamente Lia | <15min |
| Imprensa / mídia perguntando | NÃO Diego · escalar Marina · Marina escala Lia | <30min |

**Casos especiais frequentes em Apex Mercado:**

- **Cliente com cupom amassado/desbotado** (cliente quer trocar produto · cupom ilegível): Marina valida no sistema (consulta NFC-e pelos últimos dígitos do cartão + data + valor) · imprime "2ª via do cupom" (não-fiscal · serve para troca)
- **Cliente quer pagar com R$ 200 em compra de R$ 5** (Diego tem troco?): Diego verifica saldo do caixa · se >R$ 195 disponível, OK · se não, oferece pagar em outra forma ou aguardar troco do próximo cliente
- **Cliente alega que o produto custava menos na prateleira** (preço diferente do bipado): Marina valida via app interno do gerente · se prateleira está errada (preço antigo), aplica o preço cobrado · se cliente confundiu, explica a diferença

**Casos especiais frequentes em Apex Tech:**

- **Cliente quer comprar 5 notebooks** (volume alto · pode ser revenda): Marina valida CNPJ se PJ · verifica política comercial (vendas >5 unidades de eletrônico requerem aprovação especial em alguns casos)
- **Cliente quer garantia estendida** (oferecida pelo Apex · não obrigatória): Diego apresenta opções no balcão · cliente decide na hora ou recusa
- **Cliente quer parcelar fora da regra** (24x quando o máximo é 18x): Marina explica · oferece alternativa (boleto B2B ou crediário Apex+)

**Casos especiais frequentes em Apex Moda:**

- **Cliente quer trocar tamanho** (em até 30 dias com cupom): Diego inicia FRM-DEV-001 · cliente sai com produto novo (estoque diferente · NF-e com troca) · documentado em `faq_pedidos_devolucao.pdf`
- **Cliente quer descontar coleção antiga** (saldão): aplicado automaticamente via promoção cadastrada
- **Cliente quer experimentar antes (prova)** (sem comprar): Marina autoriza · sala de provas · sem cobrança até decisão

**Casos especiais frequentes em Apex Casa:**

- **Cliente quer entrega + montagem** (móvel maior): Diego registra pedido + agendamento · venda emite NFC-e · cliente paga · agenda confirmada · ver `faq_horario_atendimento.pdf` seção 3.1
- **Cliente quer parcelar móvel R$ 8.000 em 30x**: limite Cielo 18x · Diego oferece crediário Apex+ (24x) · cliente decide

## 5.3 Caso real TKT-8 — chocolate Lindt cobrado por engano (Página 25)

O ticket TKT-8 (Apex Mercado · cliente fidelidade · loja Pinheiros) é o caso didático de estorno operacional mais citado no treinamento de Diego. Mostra três cenários distintos de como resolver uma cobrança indevida — antes do cupom, com cliente ainda na loja, e cliente já fora.

**Sintoma original (TKT-8 já resolvido em 2026-04-12):**

> Cliente fidelidade da Apex Mercado SP-Pinheiros reclamou pelo SAC online: o cupom mostrava 1× chocolate Lindt R$ 89,00 que ele NÃO retirou da prateleira. A reclamação chegou 2 horas após a compra (cliente já em casa).
>
> Análise CFTV (gravação caixa 02): produto estava no carrinho ao lado e foi bipado por engano pelo Diego (operador confundiu). O cliente do carrinho ao lado tinha um chocolate Lindt entre vários outros itens · Diego puxou o leitor sem ver, capturou o código do Lindt do outro carrinho.

**Cenário A — Diego identifica o erro ANTES do cupom ser fechado:**

Se Diego (ou o próprio cliente) percebe a cobrança errada antes de F4 (finalização):

1. **Diego identifica o item na tela** (lista de itens da venda em curso)
2. **F3 remove o item específico** (Diego seleciona o Lindt com setas + F3)
3. **Sistema atualiza subtotal** (R$ 187,80 → R$ 98,80 · 89 de diferença)
4. **Cliente vê no display LD220** o subtotal atualizado
5. **Cliente confirma** "É isso mesmo"
6. **Diego prossegue normalmente** (F4 → pagamento → emissão)

**Nenhum cupom é emitido com o erro · o item não aparece em nenhum relatório · sem registro fiscal.** Este é o cenário ideal e o foco do treinamento de Diego.

**Cenário B — Cliente identifica o erro DEPOIS do cupom emitido, ainda na loja:**

Se o cliente percebe a cobrança errada após receber o cupom mas antes de sair da loja:

1. **Diego pede para o cliente aguardar 30 segundos** (compostura tranquila · não deixar cliente irritado)
2. **Diego chama Marina via interfone** (Diego não pode estornar sozinho)
3. **Marina chega ao caixa** com matrícula supervisora
4. **Marina valida o cupom físico** + ouve a versão do cliente
5. **Marina autoriza modo devolução** (F8 + matrícula supervisora · página 16)
6. **Diego bipa o item específico** (chocolate Lindt SKU 7891234567890)
7. **Sistema gera estorno parcial** do valor (R$ 89,00) na mesma forma de pagamento original
8. **Estorno é processado:**
   - Se foi dinheiro: Diego abre gaveta (F5) e entrega R$ 89,00 ao cliente
   - Se foi cartão: estorno via PinPad LIO V3 (D+2 na conta)
   - Se foi PIX: estorno via API Bacen (instantâneo)
9. **Cupom de estorno é impresso** (formato:
   ```
   ============================
       ESTORNO PARCIAL
       NF-e original chave: ...
       Item estornado: Chocolate Lindt 100g
       Valor estornado: R$ 89,00
       Forma de pagamento: Dinheiro
       Saldo NF-e original: R$ 98,80
   ============================
   ```
10. **Cliente assina o cupom de estorno** (recibo formal)
11. **Marina anota no caderno de ocorrências do caixa** (controle adicional)

Essa operação é registrada e auditada · o estorno aparece no fechamento de caixa (página 27) como uma "saída" e Marina justifica.

**Cenário C — Cliente identifica o erro DEPOIS de sair da loja (caso TKT-8):**

Este é o cenário do TKT-8 — o cliente percebeu o erro 2 horas após a compra, em casa, ao revisar o cupom. Diego não pode resolver sozinho · vira ticket HelpSphere:

1. **Cliente abre ticket pelo SAC online** ou liga 0800 ou WhatsApp Business
2. **Ticket é categorizado como Comercial · prioridade Low · tenant Apex Mercado**
3. **Marina recebe o ticket** no painel HelpSphere (ela é a Tier 2 responsável)
4. **Marina inicia investigação:**
   - Consulta CFTV do caixa 02 no horário da venda (5min de vídeo)
   - Confirma que o produto estava no carrinho ao lado · Diego bipou por engano
   - Confirma que o cliente é fidelidade (saldo de pontos · histórico de compras)
5. **Marina decide alçada do estorno + benefício:**

| Valor do estorno | Decisão padrão |
|---|---|
| <R$ 100 (caso TKT-8) | Estorno + bônus 100 pontos fidelidade (cortesia) |
| R$ 100-500 | Estorno + cortesia próxima compra (R$ 20 voucher) |
| R$ 500-2.000 | Estorno + voucher R$ 50 + escalação para Lia se cliente VIP |
| >R$ 2.000 | Escalação obrigatória para Lia · cliente recebe contato direto |

6. **Marina processa o estorno** pelo TOTVS (emite NF-e devolução · CFOP 1.202 · cliente recebe valor pela mesma forma original)
7. **Marina contata o cliente** por WhatsApp/e-mail confirmando o estorno + bônus
8. **Ticket é fechado como Resolved**

**Resultado registrado em TKT-8:** estorno R$ 89,00 (forma original: dinheiro · cliente recebeu de volta via PIX a pedido dele) + 100 pontos extras de fidelidade · cliente satisfeito.

**Lição operacional para Diego:** treinamento adicional de atenção em bipagem foi aplicado · sistema de coaching com Marina (turno seguinte ao incidente) · revisão das gravações CFTV semanal com a equipe.

**Programa de coaching para operadores (RH + Operações):**

Quando Diego (ou qualquer operador) tem incidente operacional, o programa de coaching segue:

1. **Sessão 1 — Acolhimento (Marina, mesmo dia):**
   - Conversa de 10min sem culpabilização
   - "O que aconteceu? Você se sentiu confiante?"
   - "Algo no procedimento estava confuso?"
   - Foco em entender, não punir
   - Documentação interna (não vai para RH se for primeira ocorrência leve)

2. **Sessão 2 — Treinamento prático (RH + Marina, semana seguinte):**
   - Sessão prática no POS (simulação de venda similar)
   - Revisão dos atalhos de teclado relevantes
   - Diego executa procedimento corretamente em pelo menos 3 simulações

3. **Sessão 3 — Acompanhamento (Marina, 30 dias depois):**
   - Verificação de turnos sem incidentes similares
   - Feedback adicional se necessário
   - Reconhecimento se desempenho está OK

**Política de tolerância para erros:**

- **Erro leve** (sem prejuízo financeiro · cliente OK): coaching + treinamento sem registro formal
- **Erro médio** (prejuízo até R$ 500 · cliente irritado): registro interno · 2 ocorrências em 6 meses = treinamento intensivo
- **Erro grave** (prejuízo >R$ 500 · cliente revoltado · imprensa): processo disciplinar · suspensão preventiva · investigação completa
- **Fraude comprovada**: demissão por justa causa + ação penal (raríssimo · <2 casos por ano)

**KPIs do operador (revisados mensalmente por Marina):**

- Tempo médio por venda (média loja vs operador)
- Taxa de divergência no fechamento (R$ vs total movimentado)
- Número de incidentes (tickets ou observações)
- Feedback de clientes (NPS interno · pesquisa pós-compra · raro mas valioso)
- Pontualidade
- Apresentação pessoal (uniforme · higiene)

Diego como operador mediano em 2026-Q1:
- Tempo médio: 58s (média loja 60s · ligeiramente acima)
- Divergência média: R$ 2,80 (saudável)
- 1 incidente menor (TKT-8 já citado)
- NPS interno: 8.4 (positivo)

**Reconhecimento de bons operadores:**

O Apex Group tem programa "Operador do Mês" em cada loja:
- Critério principal: zero incidentes no mês + tempo médio melhor que média da loja + feedback positivo
- Recompensa: prêmio R$ 200 (Pix) + dia adicional de descanso pago + reconhecimento na reunião regional
- Diego ganhou em fevereiro/2025 e novembro/2025

## 5.4 Sangria intermediária (Página 26)

A sangria intermediária é a retirada parcial de dinheiro do caixa durante o turno. O objetivo é dois: **segurança** (evitar excedente em gaveta · risco de roubo) e **logística financeira** (consolidar troco no cofre da loja para próximo turno).

**Quando fazer sangria:**

- Saldo do caixa em dinheiro ultrapassa **R$ 2.000** (limite padrão · ajustável por loja em política regional)
- Antes de troca de turno em horários sensíveis (12h, 18h · operadores diferentes assumindo)
- Sempre antes do fechamento de caixa (já incluído no fluxo PROC-POS-003)
- Solicitação ad-hoc de Marina (ex: a loja está movimentada e o saldo cresce rápido)

**Procedimento operacional (Diego + Marina · duplo controle):**

1. **Diego identifica a necessidade** (ele vê na tela "Saldo dinheiro: R$ 2.347,80")
2. **Diego sinaliza para Marina** via interfone
3. **Marina chega ao caixa** com matrícula supervisora
4. **Diego aciona F6** → tela "Sangria"
5. **Sistema mostra saldo atual de dinheiro** (R$ 2.347,80)
6. **Diego digita o valor a retirar** (ex: R$ 1.500,00 · deixando R$ 847,80 no caixa)
7. **Marina aprova com matrícula + senha**
8. **Sistema imprime cupom não-fiscal de sangria:**
   ```
   ============================
       SANGRIA INTERMEDIÁRIA
       Caixa 03 · Operador: Diego A.
       Supervisor: Marina B.
       Data/Hora: 11/05/2026 14:32:14
       Valor da sangria: R$ 1.500,00
       Saldo após sangria: R$ 847,80
   ============================
   ```
9. **Diego conta fisicamente R$ 1.500,00** (cédulas separadas · não usa moedas em sangria)
10. **Diego coloca o dinheiro em envelope plástico transparente lacrado** com o cupom de sangria por dentro
11. **Diego entrega o envelope para Marina** · Marina assina o recibo do envelope no caderno de ocorrências
12. **Marina deposita o envelope no cofre da loja** (chave compartilhada com gerente regional · acesso registrado)
13. **POS retoma operação normal** · próxima venda em ~30s

**Limite máximo no caixa após sangria: R$ 500,00** (operação contínua · garante que mesmo entre sangrias o risco financeiro é baixo).

**Política de transparência:**

- **Câmera CFTV** sempre cobre o procedimento de sangria (ângulo + áudio se a loja tiver)
- **Cofre da loja** tem registro eletrônico de aberturas (Marina ou gerente regional · matrícula + horário)
- **Auditoria mensal** revisa os relatórios de sangria por POS — alertas para:
  - Sangrias acima do limite (saldo deixado em caixa > R$ 500)
  - Sangrias muito frequentes (>5/dia em um único caixa indica volume anômalo)
  - Sangrias com diferença na contagem (>R$ 1 de erro em conferência cofre)

**Auditoria por Lia (Head Atendimento) — relatório mensal:**

Todo final de mês, Lia recebe um relatório consolidado:
- Total de sangrias por loja
- Sangria média por turno
- Sangrias com discrepância (raras)
- Padrões anormais (ex: loja com sangrias 3x maiores que loja similar — investigação)

Padrões anormais viram tickets RH (categoria Operacional · prioridade Medium) e podem desencadear investigação interna.

**Auditoria mensal de sangrias (procedimento Lia · Head Atendimento):**

No primeiro dia útil de cada mês, Lia recebe um relatório consolidado de todas as sangrias do mês anterior:

| Indicador | Apex Mercado | Apex Tech | Apex Moda | Apex Casa |
|---|---|---|---|---|
| Total de sangrias no mês | 4.250 | 380 | 320 | 280 |
| Valor médio por sangria | R$ 1.480 | R$ 920 | R$ 680 | R$ 1.250 |
| Total movimentado em sangrias | R$ 6.29M | R$ 0.35M | R$ 0.22M | R$ 0.35M |
| Discrepâncias detectadas (R$ >5 erro) | 12 | 1 | 1 | 0 |
| % de discrepância | 0.28% | 0.26% | 0.31% | 0% |

Padrões a serem investigados:

- **Loja com discrepância >0.5%:** auditoria pontual na loja (gerente regional vai presencial)
- **Operador com discrepância em >3 sangrias no mês:** coaching obrigatório · escalação RH se persistir
- **Sangria sem cupom (raríssimo · indica fraude):** suspensão imediata · investigação penal possível

Esses casos extremos são raros (média 1-2 por trimestre em todo o Apex Group) mas as auditorias são rigorosas como dissuasão.

**Cofre da loja — políticas de acesso:**

Cada loja Apex tem um cofre interno (modelo padronizado · marca Sentry Safe Industrial · capacidade 80L). Políticas:

- **Chave do cofre** está com Marina (supervisora · turno em curso) + gerente regional (Lia ou subordinada)
- **Abertura do cofre** SEMPRE com 2 pessoas (Marina + outra pessoa autorizada · senha + chave física)
- **Câmera CFTV** cobre o cofre 24/7 (gravação salva 90 dias)
- **Conteúdo padrão:**
  - Envelopes de sangria recebidos no turno
  - Troco inicial dos próximos turnos (~R$ 600-1.000)
  - Cofre menor interno com documentos confidenciais (raro · backup de cert A1 da loja)
- **Retirada para depósito bancário** (semanal · Banco do Brasil chega na loja):
  - Marina + transportadora de valores (Brink's) conferem o valor
  - Envelope lacrado e selado é entregue
  - Recibo dual signed (Marina + condutor Brink's)
  - Confirmação de depósito chega via SMS em 24h

A movimentação de cofre acima de R$ 50.000 em um dia é monitorada centralmente · alerta dispara para Lia + Carla.

**Procedimento de transferência de valores para o banco (Brink's):**

- Frequência: 2x por semana em lojas grandes (Apex Mercado SP-Pinheiros) · semanalmente em lojas menores
- Brink's chega entre 14h e 17h (janela negociada)
- Marina + condutor Brink's executam:
  1. Marina assina o "Recibo de Retirada de Valores"
  2. Condutor confere lacre do envelope (lacre identificado · número único)
  3. Marina e condutor contam (no caso de moedas) ou validam contagem prévia (cédulas)
  4. Recibo é dual signed (Marina + condutor)
  5. Envelope é colocado em mala-forte do veículo blindado
  6. Brink's transporta até Banco do Brasil (banco oficial Apex)
- Confirmação de depósito chega via SMS para Marina + e-mail para Carla em até 24h
- Em caso de descrepância detectada no banco: ticket Financeiro · investigação com participação Brink's

**Segurança patrimonial:**

- Cada loja tem alarme conectado à central monitoramento (Prevent · empresa terceirizada)
- 4 a 8 câmeras CFTV por loja (entrada · saída · caixas · cofre · estoque)
- Botão de pânico no caixa (acionável discretamente por Diego em caso de assalto)
- Guarda armado em lojas selecionadas (Apex Mercado de bairros com histórico de roubo)
- Acesso ao cofre restrito (chave + senha + CFTV + autenticação biométrica em lojas premium)
- Treinamento anual obrigatório em segurança (Diego e Marina)

## 5.5 Fechamento de caixa (Marina) — PROC-POS-003 (Página 27)

O fechamento de caixa é o procedimento que encerra o turno de Diego no POS. É **operado por Marina** (supervisora) — Diego não fecha o próprio caixa por compliance (segregação de funções financeiras). O fechamento sincroniza dados com o TOTVS, calcula divergências entre o esperado e o real, e libera o POS para o próximo turno (ou para desligamento do POS no caso do último turno do dia).

**Procedimento PROC-POS-003:**

1. **Diego encerra última venda** (ou aguarda cliente atual sair da fila)
2. **Diego aciona Ctrl+Q** (encerrar turno) → tela "Fechamento Pendente · aguardando supervisora"
3. **Marina chega ao caixa** com matrícula supervisora
4. **Marina aciona F10** (fechamento de caixa)
5. **Sistema abre relatório de fechamento** com seções:
   - Saldo inicial (troco PROC-POS-002 · R$ 200,00)
   - Vendas em dinheiro (consolidado do turno · ex: R$ 4.847,80)
   - Sangrias intermediárias (subtotal · ex: R$ 3.000,00 em 2 sangrias)
   - Estornos em dinheiro (raros · ex: R$ 89,00 do caso TKT-8)
   - **Saldo dinheiro esperado em caixa:** R$ 200 + R$ 4.847,80 − R$ 3.000,00 − R$ 89,00 = R$ 1.958,80
   - Vendas em cartão débito (consolidado · ex: R$ 8.234,50)
   - Vendas em cartão crédito (consolidado · ex: R$ 12.847,30)
   - Vendas em PIX (consolidado · ex: R$ 6.483,90)
   - Vendas em voucher (consolidado)
   - Vendas em boleto (consolidado · raro em B2C)
   - Total geral do turno
6. **Marina conta o dinheiro físico no caixa** (cédulas + moedas separadamente · vai por denominação)
7. **Marina digita os valores no LINX** por forma de pagamento:
   - Dinheiro: contagem física manual (Marina digita)
   - Cartão débito: já preenchido automaticamente pelo TEF Cielo (Marina só confirma)
   - Cartão crédito: idem (Marina confirma)
   - PIX: já preenchido pela API Bacen (Marina confirma)
   - Voucher: idem
   - Boleto: idem (geração de boletos somada)
8. **Sistema calcula divergência:**
   - Esperado em dinheiro: R$ 1.958,80
   - Contado fisicamente: R$ 1.955,30
   - **Divergência: −R$ 3,50** (a menor)
9. **Política de divergência define ação:**

| Divergência | Decisão |
|---|---|
| <R$ 5,00 (a maior ou a menor) | **Aceita** · registrada · sem investigação |
| R$ 5,00 a R$ 50,00 | Marina investiga (último cliente · troco errado · operador distraído) · justificativa obrigatória no sistema |
| R$ 50,00 a R$ 200,00 | Marina + gerente da loja revisam · escalação para Lia (Head Atendimento) |
| R$ 200,00 a R$ 1.000,00 | Bloqueio do caixa · auditoria interna · revisão CFTV obrigatória |
| >R$ 1.000,00 | Ticket Financeiro de prioridade High + RH (suspeita) · suspensão do operador até investigação |

10. **Cupom de fechamento é impresso** com todos os valores + divergência + assinatura de ambos
11. **Marina e Diego assinam** o cupom físico
12. **Sangria final** (Marina pega o saldo de dinheiro restante e leva ao cofre)
13. **Envelope final ao cofre** (mesmo procedimento da sangria intermediária · página 26)
14. **POS sincroniza fechamento com TOTVS** (push imediato · alimenta SAP FI imediatamente · página 6)
15. **Diego é liberado** (turno encerrado · marcação no eSocial via cartão de ponto)

**Cenários especiais:**

- **Divergência >R$ 1.000 (caso raro):** o operador (Diego) é suspenso preventivamente · Marina abre ticket RH + Financeiro · investigação completa em até 48h · gravação CFTV é o primeiro recurso · após investigação Diego volta ao trabalho (suspensão preventiva paga) ou enfrenta processo disciplinar formal
- **Caixa fechado parcialmente** (Marina precisa sair no meio do procedimento): possível salvar o estado intermediário · operação retomada por outra supervisora ou gerente · raro
- **POS sem comunicação com TOTVS no fechamento:** fechamento é feito offline · sincroniza quando reconecta · cupom impresso normalmente

**Auditoria contínua:** divergências (qualquer valor) entram no dashboard de Lia em tempo real. Padrões emergentes (ex: um operador específico com divergências consistentes > R$ 5 em 5 turnos seguidos) viram alerta automatizado para coaching.

**Relatório X (parcial do turno) — uso operacional:**

Durante o turno, Diego pode imprimir um "Relatório X" (Ctrl+F5) sem afetar o saldo do caixa. O Relatório X mostra:

- Vendas finalizadas no turno até o momento
- Total por forma de pagamento (parcial)
- Saldo esperado em dinheiro
- Número de transações
- Tempo médio por transação
- Forma de pagamento mais usada
- Última venda emitida

Diego usa o Relatório X para:

- Conferir saldo antes de uma sangria (validar se atingiu o limite R$ 2.000)
- Verificar progresso no turno (comparar com média histórica)
- Documentar o turno se houver troca antes do fechamento

O Relatório X é **não-fiscal** · não substitui o cupom de fechamento PROC-POS-003. Pode ser impresso quantas vezes Diego quiser sem afetar nada.

**Relatório Z (fechamento definitivo) — referência fiscal:**

O Relatório Z é o cupom emitido pelo F10 (fechamento de caixa) e tem efeito **fiscal definitivo**:

- Marca o caixa como fechado em `BIG_CAIXAS`
- Sincroniza com TOTVS + SAP FI
- Alimenta SPED Fiscal (próximo mês)
- Não pode ser cancelado nem refeito (após emitido)

Por isso, a contagem antes do Z é crítica. Qualquer divergência identificada **após** o Z é tratada como ajuste fiscal (registro de "diferença de fechamento" com justificativa supervisora · auditoria mensal).

**Procedimentos de exceção no fechamento:**

- **POS sem TOTVS** (queda de comunicação durante fechamento): fechamento é feito offline · LINX armazena em fila e sincroniza ao reconectar · Marina aguarda confirmação do sync antes de assinar o cupom Z
- **POS com SEFAZ em contingência**: fechamento OK · NFC-e contingenciadas continuam na fila de regularização · Marina aguarda regularização completa antes de Z final (operação fica "aberta" no relatório de SP até regularizar)
- **Divergência inexplicável** (>R$ 50): Marina suspende o fechamento · investigação imediata (CFTV · entrevista Diego · revisão de últimas vendas) · pode demorar 1-2h
- **Discrepância em cartão Cielo** (raro): Marina valida com o relatório Cielo direto (não confia no TEF · pode haver bug de sync) · ticket Financeiro abre automaticamente

---

# Capítulo 6 — Troubleshooting

## 6.1 Top 10 erros POS — referência rápida (Página 28)

Esta tabela consolida os 10 erros mais frequentes que Diego encontra no dia a dia, com sintoma observado, causa provável e a ação que Diego pode executar antes de escalar Marina (Tier 1). Esta é a primeira página que Diego consulta — está fixada em formato impresso atrás de cada caixa, formato A5 plastificado.

| # | Sintoma observado | Causa provável | Ação Diego (Tier 1) |
|---|---|---|---|
| **1** | POS congela ao apertar F4 com >8 itens | Timeout SEFAZ (caso TKT-11 · pool de threads pequeno) | Aguardar 60s · se não responder, F9 contingência manual |
| **2** | Impressora não imprime cupom | Papel acabou · tampa aberta · comunicação USB | Verificar papel · fechar tampa · desconectar/reconectar USB 10s |
| **3** | PinPad Cielo mostra "Sem comunicação" | Cabo USB-C frouxo · recovery necessário (Capítulo 6.4) | Desconectar 10s · reconectar · se persistir, reboot PinPad |
| **4** | Leitor de código de barras não bipa | Cabo desconectado · modo travado · sujeira na ótica | Reconectar USB · limpar visor com flanela seca · ler código de configuração (etiqueta no leitor) |
| **5** | NFC-e rejeitada com código 539 | CFOP cadastrado errado no TOTVS | **NÃO retentar** · escalar Marina (correção fiscal pelo time de cadastro) |
| **6** | NFC-e rejeitada com código 778 | Contingência além de 96h (cupom não regularizado a tempo) | Escalar Marina **imediatamente** · NÃO emitir mais notas até regularização |
| **7** | Caixa em modo contingência há >2h | Possível queda de link da loja (não SEFAZ) | Marina verifica · diagnóstico de rede em `runbook_problemas_rede.pdf` seção 3 |
| **8** | Display LD220 com lixo na tela (caracteres aleatórios) | Encoding errado pós-update ou cabo USB problema | Reboot POS · se persistir, ticket HelpSphere para Bruno |
| **9** | Gaveta de dinheiro não abre via F5 | Cabo solenoide solto ou impressora sem ESC/POS para gaveta | Verificar conexão atrás da impressora · ticket TI se persistir |
| **10** | Sync TOTVS com atraso >30min | Fila MSMQ acumulando · problema de comunicação | Marina vê dashboard supervisor · escalar Bruno se >60min |

**Regras de ouro de troubleshooting Diego (Tier 1):**

- **NUNCA rebootar o POS sem autorização da Marina.** Pode haver venda em curso · pode haver cupom em emissão final · pode haver perda de cache MSMQ.
- **NUNCA tentar editar arquivos de configuração** (`bigipos.config`, registry Windows, drivers).
- **SEMPRE registrar a hora exata** do problema (não "uns 15min atrás", mas "14:32:18").
- **SEMPRE registrar o que estava fazendo** quando ocorreu (vendendo · em pagamento · emitindo · fechando caixa).
- **NUNCA fechar a tela de erro sem fotografar/anotar a mensagem completa.**

**Escalação correta:**

- Tier 1 (Diego resolveu sozinho): registro no caderno de ocorrências do caixa · sem ticket HelpSphere
- Tier 2 (Marina resolveu): ticket HelpSphere informativo (categoria conforme problema · prioridade Low)
- Tier 3 (Bruno/TI necessário): ticket HelpSphere prioridade Medium ou High dependendo do impacto (POS único = Medium · loja inteira = High · marca inteira = Critical)

**Tempo médio de resolução por tipo de problema (referência operacional):**

| Tipo de problema | Tier 1 (Diego) | Tier 2 (Marina) | Tier 3 (Bruno/TI) | Total típico |
|---|---|---|---|---|
| Papel acabou | 30s | — | — | 30s |
| Impressora desalinhada (leve) | 1min | — | — | 1min |
| PinPad sem comunicação (USB) | 1min | — | — | 1min |
| Recovery PinPad (serial) | — | 3min | — | 3min |
| Substituição PinPad (Cielo) | — | 5min | 24h Cielo | 24h |
| POS congelando F4 | 1min aguardar | 5min reboot | 30min análise log | 30min |
| Substituição POS (PROC-POS-001) | — | 10min | 24h Bematech | 24h |
| Rejeição SEFAZ 539 | — | 10min ticket | 4h time fiscal | 4h |
| Rejeição SEFAZ 778 | — | 15min ticket | 8h time fiscal | 8h |
| Reset hardware completo | — | 5min preparar | 60min Bruno | 60min |
| Loja inteira sem rede | — | — | 2-4h depende causa | 2-4h |

**Histórico de incidentes por mês (média Q1-2026 · Apex Group total):**

- Problemas resolvidos pelo Tier 1 (Diego sozinho): ~2.400/mês
- Problemas resolvidos pelo Tier 2 (Marina): ~480/mês
- Problemas escalados ao Tier 3 (Bruno/TI): ~85/mês
- Problemas críticos (P1 · loja inteira ou marca inteira): ~3-5/mês

Os problemas críticos têm postmortem obrigatório · publicado em `runbook_problemas_rede.pdf` (apendix) quando relacionados a rede ou em `runbook_sap_fi_integracao.pdf` quando relacionados a integração TOTVS/SAP.

## 6.2 POS travando — procedimento detalhado (TKT-11) (Página 29)

Este procedimento expandido cobre o sintoma número 1 da Top 10 — POS travando ao apertar F4. Foi escrito com base no caso TKT-11 e validado pelo Bruno antes da publicação. O procedimento é o mesmo para todas as marcas Apex.

**Sintoma característico:**
- Ao apertar F4 (finalizar venda), a tela do BIG iPOS Front fica "Não Responde" (texto cinza claro · sem cursor piscando)
- Tempo típico: 30 a 45 segundos antes de recuperar (ou nunca recuperar)
- Às vezes recupera sozinha · às vezes precisa reiniciar o POS
- Padrão observado: vendas com 8+ itens são mais propensas (especialmente em Apex Mercado movimentada)

**Procedimento Diego (sem escalar imediatamente):**

1. **Aguarde 60 segundos.** Não force reboot · o cupom pode estar em emissão final pelo backend. Olhe para a impressora — se houver atividade (papel saindo), aguarde mais 30s.

2. **Se a tela voltar dentro dos 60s:**
   - Verifique se o cupom foi impresso (físico)
   - Confirme com o cliente "Tudo certo · pode pegar o cupom"
   - Anote no caderno de ocorrências do caixa: "POS Caixa 03 travou 47s · 12 itens · pagamento débito · cupom OK"
   - Continue operação normal

3. **Se a tela NÃO voltar dentro dos 60s:**
   - NÃO aperte teclas aleatórias · NÃO desligue o POS na tomada
   - Olhe para a tela e identifique a última informação visível (último item bipado · total parcial)
   - Anote o número da última venda visível
   - Chame Marina no interfone

4. **Marina chega e avalia:**
   - Pergunta a Diego: hora exata · número de itens · forma de pagamento · cliente identificado por CPF?
   - Verifica se o POS está realmente travado ou se está lento (cursor mexe na tela?)
   - Olha o display LD220 do cliente (pode mostrar mensagem de erro)

5. **Marina autoriza F12 (reboot controlado):**
   - F12 não é um reboot duro · é um restart graceful do serviço LINX
   - Procedimento: Marina pressiona F12 + digita matrícula supervisora + confirma
   - Sistema executa flush da fila MSMQ (drena push pendente para TOTVS)
   - Sistema fecha conexão com SEFAZ-SP (cancela tentativa em curso)
   - Sistema reinicia o serviço LINX BIGiPOS (~3min total)
   - Durante o reboot, o cliente aguarda (Marina explica e pede paciência)

6. **Após reboot (~3min):**
   - LINX BIGiPOS volta com tela "Aguardando login"
   - Diego loga com matrícula + senha
   - **Importante:** Diego NÃO precisa abrir caixa de novo · o sistema mantém o estado de caixa aberto
   - Diego consulta status da última venda em F1 (modo consulta · busca por número da venda anotado)

7. **Diego verifica o status da venda problemática:**
   - **Se a venda foi emitida** (status "Autorizada SEFAZ"): cliente já recebeu o cupom · operação está OK · Diego confirma com o cliente
   - **Se a venda NÃO foi emitida** (status "Pendente" ou "Cancelada"): Diego pede ao cliente para refazer a venda do zero · estoque já foi restaurado · cliente já tem o produto

8. **Continuação normal:**
   - Marina abre ticket HelpSphere (categoria TI · prioridade Medium)
   - Inclui no ticket: hora · número POS · número itens · forma pagamento · resolução (refez ou não)
   - Diego continua operação

**Procedimento Marina (escalação Tier 2):**

- **1 ocorrência isolada no turno:** ticket HelpSphere prioridade Low · informativo
- **2 ocorrências no mesmo turno (mesmo POS):** ticket HelpSphere prioridade Medium · TI investiga
- **3 ocorrências em 1 semana (mesmo POS ou loja inteira):** ticket HelpSphere prioridade High + acionar Bruno via Slack `#ti-pos-emergencia`

**Procedimento Bruno (Tier 3 · TI):**

- Acessa os POS afetados via TeamViewer (com autorização da operação)
- Extrai logs `bigipos-fiscal.log` + `bigipos-front.log` dos últimos 7 dias
- Identifica padrão (horário · número de itens · forma de pagamento)
- Aplica o patch TKT-11 se necessário (ajuste pool de threads + timeout · página 13) ou diagnostica nova causa-raiz
- Comunica resolução para Marina e Diego (Slack + ticket)

**Referência histórica:** TKT-11 (Pinheiros · abril/2026) foi resolvido com upgrade thread pool 4→12 + timeout 30s→45s · pacote distribuído para frota toda · monitoramento de regressão ativo via Application Insights (alerta automático se qualquer POS tiver tempo de emissão NFC-e > 8s consistentemente).

**Padrões de log que indicam o problema do TKT-11 (referência diagnóstica para Bruno):**

Em `bigipos-fiscal.log`, o padrão característico do TKT-11 era:

```json
{"ts":"2026-04-10T12:34:18.001Z","lvl":"WARN","ev":"sefaz.timeout","tentativa":1,"venda_id":47823,"itens_count":12}
{"ts":"2026-04-10T12:34:48.023Z","lvl":"WARN","ev":"sefaz.timeout","tentativa":2,"venda_id":47823,"itens_count":12}
{"ts":"2026-04-10T12:35:18.041Z","lvl":"WARN","ev":"sefaz.timeout","tentativa":3,"venda_id":47823,"itens_count":12}
{"ts":"2026-04-10T12:35:18.124Z","lvl":"ERROR","ev":"sefaz.contingency_activated","venda_id":47823,"reason":"3_timeouts_consecutive"}
```

Após o patch:

```json
{"ts":"2026-04-25T12:34:18.001Z","lvl":"INFO","ev":"sefaz.request","venda_id":52017,"itens_count":12}
{"ts":"2026-04-25T12:34:22.341Z","lvl":"INFO","ev":"sefaz.response","venda_id":52017,"status":"autorizada","tempo_ms":4340}
```

A diferença é clara: antes, 3 timeouts seguidos com itens_count >8 indicavam o problema. Após o patch, vendas com 12 itens são autorizadas em <5s consistentemente.

**Query SQL para diagnosticar TKT-11 like em qualquer loja (Bruno usa quando suspeita do mesmo padrão):**

```sql
SELECT
  POS,
  COUNT(*) AS Total_Timeouts,
  AVG(itens_count) AS Itens_Medio,
  MIN(itens_count) AS Itens_Min,
  MAX(itens_count) AS Itens_Max
FROM BIG_LOG_FISCAL
WHERE ev = 'sefaz.timeout'
  AND ts >= DATEADD(DAY, -7, GETUTCDATE())
GROUP BY POS
HAVING COUNT(*) > 5
ORDER BY Total_Timeouts DESC;
```

Esse query identifica POS com mais de 5 timeouts SEFAZ na última semana · padrão típico de problema sistêmico. Bruno executa periodicamente como parte do health check semanal.

**Outros padrões de log que Bruno reconhece em troubleshooting:**

**Padrão A — Falha em sincronização TOTVS (problema MSMQ):**
```json
{"ts":"...","lvl":"WARN","ev":"sync.msmq_queue_growing","queue_size":3847,"limit":50000}
{"ts":"...","lvl":"WARN","ev":"sync.msmq_queue_growing","queue_size":5102,"limit":50000}
{"ts":"...","lvl":"ERROR","ev":"sync.totvs_unreachable","retries":3,"endpoint":"..."}
```
Indica: queda do endpoint TOTVS · fila MSMQ crescendo · ação: Bruno valida endpoint · pode ser problema de rede ou TOTVS Edge.

**Padrão B — Certificado A1 próximo do vencimento:**
```json
{"ts":"...","lvl":"INFO","ev":"cert.expiration_check","days_remaining":35,"action":"none"}
{"ts":"...","lvl":"WARN","ev":"cert.expiration_check","days_remaining":15,"action":"alert"}
{"ts":"...","lvl":"ERROR","ev":"cert.expiration_check","days_remaining":2,"action":"renewal_required"}
```
Indica: cert A1 da loja vence em 2 dias · ação imediata: Bruno renova via emissora · sem renovação, rejeição 691 a partir do dia 0.

**Padrão C — Anomalia de desconto (suspeita de fraude):**
```json
{"ts":"...","lvl":"INFO","ev":"discount.applied","op":"diego.almeida","percent":15.0,"value":25.50,"sup":"marina.borges"}
{"ts":"...","lvl":"INFO","ev":"discount.applied","op":"diego.almeida","percent":18.0,"value":42.30,"sup":"marina.borges"}
{"ts":"...","lvl":"INFO","ev":"discount.applied","op":"diego.almeida","percent":22.0,"value":67.80,"sup":"marina.borges"}
{"ts":"...","lvl":"WARN","ev":"discount.high_frequency","op":"diego.almeida","count_last_hour":12,"baseline":2}
```
Indica: operador aplicou 12 descontos em 1 hora · baseline da loja é 2/hora · pode ser legítimo (campanha) ou suspeito · Marina + Lia revisam padrão.

**Padrão D — Hardware com sinais de defeito iminente:**
```json
{"ts":"...","lvl":"WARN","ev":"hw.printer.paper_jam","count_today":3,"baseline":0}
{"ts":"...","lvl":"WARN","ev":"hw.printer.cut_error","count_today":2,"baseline":0}
{"ts":"...","lvl":"ERROR","ev":"hw.printer.cut_blade_dull","msg":"corte_irregular_detectado"}
```
Indica: impressora térmica com lâmina de corte gasta · ticket TI prioridade Medium · agendar manutenção Bematech.

**Padrão E — Suspeita de tentativa de violação PCI:**
```json
{"ts":"...","lvl":"ERROR","ev":"pci.suspect_data_dump","method":"file_read","file":"C:\\BIG\\db\\bigipos.mdf","user":"unknown"}
{"ts":"...","lvl":"CRITICAL","ev":"pci.suspect_data_dump","method":"network_capture","traffic":"large_outbound","destination":"suspicious_ip"}
```
Indica: tentativa de extração de dados · ação CRITICAL · Bruno notificado via PagerDuty + Compliance + Jurídico · POS isolado fisicamente · investigação PCI imediata.

**Procedimento de health check semanal (Bruno):**

Todo domingo às 22h (baixa demanda), Bruno executa health check automatizado da frota:

1. Query timeouts SEFAZ por POS (>5 = investigação)
2. Query certificados A1 com <60 dias para vencer (programar renovação)
3. Query erros de sync MSMQ (>10/dia = investigação)
4. Query incidentes de hardware (impressora · PinPad · leitor)
5. Query padrões de descontos anormais (>20% das vendas com desconto)
6. Query tempo médio de emissão NFC-e (>6s = atenção · >8s = ação)

Relatório consolidado é enviado a Lia (Head Atendimento) e Carla (CFO) toda segunda-feira de manhã.

## 6.3 Impressora térmica — papel, alinhamento, comunicação (Página 30)

A impressora térmica integrada ao Bematech MP-4200 (200mm/s · 80mm de largura) é o componente que mais consome insumos no POS (rolos de papel térmico 80m). Falhas são frequentes mas geralmente simples de resolver. Esta seção cobre os três sintomas mais comuns.

**Sintoma 3.1 — Sem papel:**

Quando o papel acaba, a impressora para de imprimir e o LINX BIGiPOS mostra alerta na tela do operador: "Papel da impressora térmica acabou — substitua e pressione FEED".

Procedimento Diego:

1. Abre a tampa superior da impressora (botão verde · sem ferramenta · ~2s)
2. Remove o tubo de papelão do rolo anterior (vazio)
3. Verifica o estoque de papel térmico (cada POS deve ter mínimo 2 rolos fechados)
4. Pega um rolo novo (papel térmico 80mm × 80m · qualidade homologada Apex)
5. Insere o rolo na compartimento, garantindo que **a face térmica esteja para cima** (face térmica é a brilhante · face não-térmica é fosca)
6. Puxa ~5cm de papel para fora da tampa
7. Fecha a tampa (com clique audível)
8. Pressiona o botão FEED por 2 segundos (botão pequeno preto na parte frontal da impressora)
9. Impressora avança ~10cm de papel e imprime um cupom de teste interno (data + número POS)
10. Diego confere que o cupom saiu legível · se sim, continua operação normal

**Erros comuns:**
- Papel inserido com face térmica para baixo → cupom sai em branco · Diego inverte o rolo
- Tampa não fechou completamente → impressora não imprime · Diego pressiona com força até clique
- Papel emperrado no mecanismo → Diego desliga POS na tomada · remove papel · religa · refaz procedimento

**Sintoma 3.2 — Desalinhada (cupom torto):**

O cupom sai impresso mas com offset de 3-5mm para um lado (esquerda ou direita) ou com inclinação. Causas comuns:

- Rolo inserido errado (não está centrado no compartimento)
- Rolete de tração desgastado (após >12 meses de uso intenso)
- Sensor de gap sujo ou descalibrado

Procedimento Diego:

1. Abre a tampa · remove o rolo · reinsere garantindo que está centralizado
2. Fecha a tampa · pressiona FEED 2s · verifica cupom de teste
3. Se persistir desalinhamento de 3-5mm:
   - **Pequeno desalinhamento (1-2mm):** aceitável temporariamente · ticket HelpSphere prioridade Low (TI agenda manutenção preventiva)
   - **Grande desalinhamento (>3mm):** o cupom pode ser ilegível em parte · Marina decide:
     - Usar POS secundário enquanto este é reparado (PROC-POS-001)
     - Ticket HelpSphere prioridade Medium · Bematech credenciado vem fazer manutenção (24h úteis)

Manutenção preventiva da impressora (substituição do rolete de tração) é feita a cada 18 meses pelo técnico Bematech.

**Sintoma 3.3 — Sem comunicação USB:**

A impressora não imprime nada e o LINX BIGiPOS mostra alerta: "Impressora térmica não responde". Procedimento Diego:

1. Desconecta o cabo USB da impressora **do lado da impressora** (não do terminal Bematech) por 10s
2. Reconecta firmemente
3. Espera 5s para o Windows reconhecer
4. Aciona F7 (reimprimir último cupom) para testar
5. Se cupom sai: problema resolvido · continue
6. Se cupom não sai:
   - Diego abre o Gerenciador de Dispositivos do Windows (Ctrl+Shift+Esc → Gerenciador de Tarefas · ou via menu Iniciar)
   - Verifica se "Bematech MP-4200 TH" aparece em "Impressoras" ou "Dispositivos USB"
   - Se não aparece: ticket HelpSphere prioridade Medium · Bruno faz acesso remoto · reinstala driver via TeamViewer
   - Se persistir após reinstalação de driver: trocar para POS secundário (PROC-POS-001)

**Sintoma 3.4 — Cupom sai em branco:**

A impressora avança papel mas o cupom sai totalmente branco (sem nenhuma impressão visível).

Causa típica: rolo de papel térmico foi inserido com a face térmica para baixo. O calor da cabeça térmica não consegue ativar o papel se a face errada está em contato.

Procedimento Diego: 

1. Abre a tampa · remove o rolo
2. Inverte o rolo (gira 180° em torno do eixo horizontal)
3. Reinsere garantindo que a face brilhante (térmica) está para cima
4. Fecha tampa · pressiona FEED · cupom de teste deve sair com texto agora

Se o cupom continuar em branco mesmo com a face correta: o papel térmico pode estar com defeito de fábrica (perdeu sensibilidade) ou vencido (papel térmico tem validade de 5-7 anos). Diego usa outro rolo do estoque.

**Especificações do papel térmico homologado Apex Group:**

Apenas papel térmico que atenda aos seguintes critérios pode ser usado em produção:

- **Largura:** 80mm (±0.1mm)
- **Comprimento do rolo:** 80m (±2m)
- **Gramatura:** 55 g/m²
- **Sensibilidade térmica:** ativação a 90°C-100°C
- **Validade da impressão:** mínimo 5 anos em condições normais
- **Camada de proteção:** anti-UV (papel não amarela em vitrine)
- **Marcas homologadas:** Maxprint, Térmica Brasil, Pacific Paper (revisão anual)

Papel não-homologado pode causar:
- Cupom desbotado (validade <1 ano · problema fiscal · cupom precisa ser legível por 5 anos)
- Cabeça térmica danificada (sensibilidade errada · superaquecimento)
- Atolamento na impressora (gramatura errada · cilindro desliza)

Compra de papel é centralizada pelo time de Operações · fornecedor homologado · entrega quinzenal nas lojas. Cada loja mantém estoque mínimo de 100 rolos (Apex Mercado) ou 50 rolos (outras marcas) · alerta automático quando atinge mínimo de 20 rolos.

**Custo do papel térmico:** R$ 4,20 por rolo · ~R$ 16.000/mês para Apex Group total (4.000 rolos consumidos/mês na frota).

**Limpeza da impressora térmica (procedimento técnico):**

A cada 3 meses (manutenção preventiva), o técnico Bematech credenciado executa:

1. Desligar o POS · aguardar 30min para a cabeça térmica esfriar completamente
2. Abrir tampa · remover rolo de papel
3. Limpar a cabeça térmica com bastonete de algodão umedecido em isopropílico 70% (movimentos suaves · sem pressão)
4. Limpar o rolete de borracha com pano úmido (sem álcool · pode ressecar a borracha)
5. Limpar o sensor de gap (acima do rolete · com bastonete seco)
6. Limpar a lâmina de corte com isopropílico (movimentos para fora do mecanismo)
7. Aguardar 10min para secagem completa
8. Reinstalar papel · imprimir 5 cupons de teste · validar legibilidade e alinhamento
9. Documentar a manutenção (log Bematech · contrato Apex)

Diego e Marina **não fazem limpeza interna** da impressora · apenas troca de papel e abertura/fechamento da tampa. Limpeza inadequada (ex: pano molhado em cabeça térmica quente) pode danificar a impressora · custo de troca R$ 1.200 (mecanismo completo).

## 6.4 PinPad sem comunicação — recovery USB e serial (Página 31)

O PinPad Cielo LIO V3 é o componente mais crítico do POS após a impressora — sem PinPad, a loja só aceita dinheiro/PIX e perde ~80% das vendas em Apex Tech/Casa (público que paga predominantemente com cartão).

**Sintomas característicos:**

- Tela do PinPad LIO V3 mostra "Sem conexão · verifique cabo USB"
- LINX BIGiPOS mostra erro "PinPad indisponível" ao tentar processar pagamento
- LED de status do PinPad piscando vermelho (anormal · LED normal é verde fixo durante operação)

**Procedimento recovery USB (Diego, primeira tentativa):**

Esse é o procedimento básico que Diego executa antes de escalar Marina · resolve ~70% dos casos.

1. **Diego identifica o problema** (cliente já no caixa aguardando · vai pagar com cartão)
2. **Diego comunica ao cliente**: "Vou reiniciar o leitor de cartão · 30 segundos"
3. **Diego desconecta o cabo USB-C** do lado do POS Bematech (não do PinPad)
4. **Aguarda 10 segundos** (importante · não pular para reset elétrico completo)
5. **Reconecta o cabo USB-C firmemente** no POS Bematech
6. **PinPad LIO V3 reinicializa automaticamente** em ~30s (boot Android + login Cielo Pay)
7. **Tela do PinPad volta ao estado "Aguardando transação"**
8. **Diego testa com transação fictícia de R$ 0,01** (Diego aciona modo de teste · PinPad faz transação · cancela automaticamente após autorização)
9. **Se sucesso:** Diego retoma o atendimento do cliente normal
10. **Se falha:** Diego escala Marina

**Procedimento recovery serial (Marina, segunda tentativa):**

Usado quando o recovery USB falha após 3 tentativas. O cabo serial RS-232 está pré-conectado no PinPad e no POS · só precisa ser ativado.

1. **Marina chega ao caixa** com matrícula supervisora
2. **Marina valida que o cabo serial está fisicamente conectado** (cabo cinza · conector DB-9 no PinPad · conector RS-232 → USB adaptado no POS)
3. **Marina ativa modo serial no PinPad:**
   - Pressiona o botão "MENU" do PinPad
   - Navega: Configurações → Comunicação → Tipo de Conexão → RS-232
   - Confirma com OK
4. **PinPad reinicializa em modo serial** (~30s)
5. **LINX BIGiPOS detecta automaticamente** a mudança via config `pinpad.transport=serial` (Bruno pré-configurou todos os POS)
6. **Marina testa com transação fictícia R$ 0,01**
7. **Se sucesso:** operação continua em modo serial · Marina abre ticket HelpSphere para Bruno (Medium) · TI agenda manutenção do USB

**Procedimento PinPad com tela travada (hard freeze):**

Em casos extremos, o PinPad não responde a nada · tela congelada com uma mensagem ou tela preta.

1. **Marina identifica que está em hard freeze** (tela sem mudar há >60s · botões não respondem)
2. **Marina pressiona o botão de power do PinPad** (lateral direita do dispositivo) por 10 segundos
3. **PinPad desliga forçadamente**
4. **Marina aguarda 30 segundos** (drena capacitores · garante reset completo)
5. **Marina pressiona o botão de power novamente** por 2s para ligar
6. **PinPad boot completo** em ~45s (Android + Cielo Pay)
7. **Testa com transação fictícia R$ 0,01**
8. **Se voltar:** operação normal · ticket informativo prioridade Low
9. **Se não voltar (boot loop · tela congelada novamente):** ticket HelpSphere prioridade High · acionar Cielo no 0800-570-8511

**Procedimento Cielo (Tier 3 · suporte externo):**

A Cielo tem SLA de 24h úteis para troca on-site do PinPad com defeito. Marina liga no 0800-570-8511 (linha dedicada ao Apex Group · numeração especial):

1. Informa o terminal id do PinPad (8 caracteres · está na etiqueta abaixo do PinPad)
2. Descreve o sintoma (hard freeze após recovery USB e serial)
3. Cielo abre chamado · agenda visita técnica
4. Em ~4-24h, técnico Cielo chega à loja
5. Substitui o PinPad LIO V3 por outro novo (mesma série de hardware)
6. Faz a configuração inicial (associação com o POS · download das chaves PCI · validação de transação)
7. Operação normal restabelecida

Enquanto aguarda Cielo, a loja:
- Continua aceitando dinheiro e PIX normalmente
- NÃO aceita cartões (débito · crédito · voucher)
- Marina comunica à equipe e à clientela na entrada da loja
- Bruno e Lia são notificados (impacto operacional · pode requerer ação especial em Black Friday por exemplo)

**Indicadores LED do PinPad LIO V3 (referência diagnóstica rápida):**

A barra de status na parte superior do PinPad mostra LEDs coloridos com significados específicos:

| LED | Cor | Estado | Significado |
|---|---|---|---|
| Status | Verde fixo | Saudável · pronto para transação | Operação normal |
| Status | Verde piscando | Processando transação | Aguardar conclusão · não desconectar |
| Status | Amarelo fixo | Sem comunicação USB com POS | Recovery USB (página 31) |
| Status | Amarelo piscando | Tentando reconectar | Aguardar 30s · se persistir, recovery |
| Status | Vermelho fixo | Erro crítico · PinPad inoperante | Recovery serial ou substituição |
| Status | Vermelho piscando rápido | Bateria interna baixa (raro · só em backup mode) | Conectar imediatamente em USB |
| Bandeira | Azul | Modo configuração | Marina ou Bruno em manutenção · não usar |
| Bandeira | Apagado | Operação normal | Nenhuma ação |

**Botões físicos do PinPad LIO V3:**

- **Botão power** (lateral direita): pressionar 2s para ligar · 10s para forçar desligamento
- **Botão menu** (centro frontal): acessa configurações (proteção senha supervisora · não acessível a Diego)
- **Botão volume** (lateral esquerda): ajusta volume dos beeps · útil em loja barulhenta
- **Cancel (X vermelho)**: cancela operação em andamento
- **Limpar (CLR amarelo)**: apaga última entrada digitada
- **Confirmar (verde)**: confirma operação

**Manutenção preventiva do PinPad (Cielo · semestral):**

- Limpeza externa com pano seco (cliente toca constantemente · acumula sujeira)
- Verificação do cabo USB-C (desgaste por uso intenso)
- Verificação do leitor de chip (slot frontal · pode acumular poeira)
- Verificação do leitor contactless NFC (antena interna · sensibilidade)
- Atualização firmware Cielo (OTA · não requer presença técnica)
- Validação do contrato de manutenção Cielo (renovação anual)

Diego não toca em manutenção do PinPad · só limpa externamente entre clientes com pano descartável (procedimento de higiene padrão pós-pandemia · permanece em uso).

**Casos críticos — >2 PinPads inoperantes simultaneamente:**

Quando 2 ou mais PinPads de uma loja ficam inoperantes ao mesmo tempo:
- Tipicamente indica problema sistêmico (queda do gateway Cielo · queda da rede da loja afetando todos)
- Marina escala IMEDIATAMENTE para Bruno via Slack `#ti-pos-emergencia`
- Bruno verifica status Cielo (`status.cielo.com.br`) + status rede Apex (`status.apex.com.br`)
- Lia é notificada (impacto na receita do dia)
- Loja entra em modo "Cielo OFFLINE" formalmente · cartazes na entrada · comunicação WhatsApp aos clientes fidelidade

**Diagnóstico avançado do PinPad LIO V3 (Bruno · uso técnico):**

Quando recovery USB e serial não resolvem, Bruno pode acessar o PinPad em modo técnico via:

1. Conexão direta com cabo USB-C ao laptop do TI (não ao POS)
2. Software Cielo Diagnostics (instalado em laptops do plantão TI)
3. Inicialização do PinPad em modo administrador (procedimento Cielo · senha técnica conhecida apenas por Bruno e equipe TI sênior)
4. Diagnóstico completo:
   - Bateria interna (saúde da célula · troca preventiva se <70%)
   - Memória interna (espaço disponível · limpeza se >95%)
   - Versão do firmware (atualização OTA se desatualizado)
   - Status de certificado PCI (validade · renovação se <60 dias)
   - Conectividade Cielo (ping endpoint · análise de latência)
   - Histórico de transações (últimas 50 · padrões de erro)
   - Logs internos do sistema operacional Android

Se o diagnóstico indica defeito de hardware, Bruno abre RMA Cielo · troca on-site em 24h SLA. Esse diagnóstico técnico só é executado em casos críticos · não rotina. Diego e Marina nunca executam.

**Histórico de incidentes PinPad (Q1-2026 · referência):**

- Total de incidentes PinPad reportados: 247 (em 1.503 PinPads · taxa de incidência de 16%)
- Resolvidos por recovery USB (Diego sozinho): 173 (70%)
- Resolvidos por recovery serial (Marina): 47 (19%)
- Resolvidos por troca Cielo (RMA): 22 (9%)
- Não resolvidos · escalação Cielo Tier 3: 5 (2%) — investigação técnica profunda

**MTBF dos componentes do POS:**

| Componente | MTBF (horas) | Frequência observada de falha (anual) |
|---|---|---|
| Terminal Bematech MP-4200 TH | 58.000 | ~3% da frota |
| Impressora térmica integrada | 24.000 | ~12% (uso intenso de papel) |
| Lâmina de corte da impressora | 18 meses | ~25% requer troca anual |
| PinPad Cielo LIO V3 | 36.000 | ~8% |
| Leitor Honeywell Voyager 1450g | 72.000 | ~2% |
| Display LD220 | 48.000 | ~3% |
| Gaveta GD-56 | 100.000 | ~1% (mecanismo robusto) |
| Balança Toledo Prix 3 Fit | 38.000 | ~4% |
| No-break APC BR1200BI-BR | 30.000 (bateria 3 anos) | bateria trocada anualmente |

Bematech, Cielo, Honeywell e demais fornecedores trabalham com contratos de troca preventiva alinhados com o MTBF · planejamento de manutenção é proativo.

**Custos de manutenção POS — referência anual Apex Group:**

| Categoria | Custo anual (R$ · frota total 1.503 POS) |
|---|---|
| Manutenção preventiva trimestral Bematech | 750.000 |
| Manutenção preventiva semestral Cielo | 280.000 |
| Substituição reativa de PinPads (troca on-site) | 95.000 |
| Substituição reativa de impressoras | 145.000 |
| Substituição reativa de leitores | 38.000 |
| Substituição reativa de baterias no-break | 270.000 |
| Papel térmico (consumível) | 192.000 |
| Certificados A1 (renovação anual) | 421.000 |
| Licenças LINX BIGiPOS (anual) | 1.250.000 |
| Licenças Windows 10 IoT (anual) | 458.000 |
| Suporte LINX (contrato 24/7) | 380.000 |
| Suporte Cielo (contrato premium) | 220.000 |
| Manutenção rede + switches PoE | 184.000 |
| **Total operacional anual** | **~R$ 4.683.000** |

**Custo por POS por ano:** ~R$ 3.115 · ~R$ 260/mês · razoável dado o volume de transações.

**Análise de ROI vs alternativas:**

- Substituição completa da frota (POS Linux a R$ 4.500 por unidade): R$ 6.7M (capex único)
- Migração para SaaS (POS-as-a-Service): R$ 6.5M/ano (opex contínuo · não escalável bem)
- Manutenção da stack atual: R$ 4.7M/ano (decisão atual · mais barata)

A revisão do TCO é feita anualmente · próxima em Q3-2026 com avaliação Bematech MP-5200.

## 6.5 Reset hardware + reinstalação software (Página 32)

Este é o procedimento de último recurso · executado somente após esgotamento de todos os procedimentos das páginas 28-31. Significa que o POS principal está em estado irrecuperável e precisa ser reimaginado do zero. Não é executado com cliente no caixa — sempre durante baixa demanda ou após substituição via PROC-POS-001.

**Pré-requisitos antes de iniciar:**

- **Confirmação de que POS secundário está disponível** (PROC-POS-001 já executado · operação contínua garantida)
- **Marina autoriza formalmente** o reset com matrícula supervisora
- **Bruno (CTO) supervisão remota** (TeamViewer ativo · Bruno conectado durante todo o procedimento)
- **Backup do banco local** (Bruno faz via TeamViewer antes do reset · garantia contra perda de transações pendentes)

**Procedimento reset hardware + reinstalação software (~45 minutos total):**

1. **Bruno executa backup MDF** via TeamViewer:
   - SQL Server Express → backup database to bak
   - Copia bak para Azure Blob (backup secundário)
   - Confirma integridade do backup (restore teste em ambiente Bruno)

2. **Diego desliga o POS pelo botão de power** (botão grande verde frontal) · aguarda 30s

3. **Diego liga o POS** · entra em BIOS pressionando F2 ou Del durante o boot (logo Bematech aparece por 5s · tempo curto)

4. **Diego navega no BIOS:**
   - Boot → Boot Sequence → Network (PXE)
   - Salva e sai (F10)

5. **POS faz boot pela rede (PXE)** via servidor MDT do Apex:
   - Em ~1min, tela MDT aparece
   - Imagem `POS-APEX-W10IOT-v4.2.wim` é selecionada automaticamente
   - Diego confirma o reset (selecionando "Reset Full" no menu MDT)

6. **Instalação automática Windows 10 IoT** (~25 minutos):
   - Partição do disco SSD é apagada (reset total)
   - Windows 10 IoT LTSC 2021 é instalado
   - Drivers básicos são aplicados
   - Reboot automático

7. **Pós-instalação Windows · agente MDT continua:**
   - Instala LINX BIGiPOS 12.5
   - Instala drivers Bematech (terminal · impressora)
   - Instala drivers Honeywell (leitor)
   - Instala drivers Toledo (balança · se Apex Mercado)
   - Instala SiTef (Cielo TEF)
   - Configura TeamViewer Host
   - Aplica políticas de segurança do Apex (defender · firewall · etc)

8. **Bruno aciona restore do banco local** (após LINX instalado):
   - Copia bak do Azure Blob
   - Executa restore database from bak
   - Valida que tabelas críticas (BIG_VENDAS · BIG_CAIXAS · BIG_USERS) têm os registros esperados

9. **POS reinicia** · executa smoke test pós-update (página 9):
   - SEFAZ ping
   - TOTVS sync teste
   - Cielo heartbeat
   - Impressora teste
   - Banco query teste

10. **Marina valida com transação fictícia R$ 0,01:**
    - Bipa um produto qualquer (estoque é restaurado depois)
    - F4 pagamento dinheiro
    - Confirma emissão NFC-e teste
    - Verifica cupom impresso (cabeçalho · QR code · sequência fiscal)
    - Cancela a transação (modo cancelamento · janela <30min)

**Tempo total típico do procedimento:** 45-90 minutos.

**Frequência típica:** menos de 1 reset por POS por ano (baixa por design · imagem WIM é estável · hardware Bematech é robusto). Resets mais comuns ocorrem após:
- Falha de SSD (disco interno · raro mas acontece)
- Corrupção do Windows (raríssimo · imagem é hardened)
- Infecção por malware (improvável · POS não tem internet aberta · só endpoints Apex/Cielo/SEFAZ)
- Atualização major (12.x → 13.x · planejada para 2027)

Após reset bem-sucedido, o POS retorna ao status "ativo principal" e o POS secundário (que estava operando temporariamente) volta para o rack como reserva.

**Checklist pós-reset (validação Bruno + Marina):**

Antes de o POS retornar à operação produtiva, Bruno e Marina executam um checklist conjunto:

- [ ] Boot completo do Windows 10 IoT sem erros (Event Viewer limpo)
- [ ] LINX BIGiPOS 12.5 instalado e iniciado (versão correta validada em `bigipos.exe -version`)
- [ ] Versão do banco local restaurada (query test em `BIG_VENDAS`)
- [ ] Smoke test pós-update passou em todos os 5 testes (página 9)
- [ ] Periféricos detectados:
  - [ ] Impressora térmica Bematech MP-4200 TH
  - [ ] Leitor Honeywell Voyager 1450g
  - [ ] Display LD220
  - [ ] Gaveta GD-56 (abertura via F5)
  - [ ] Balança Toledo Prix 3 Fit (Apex Mercado)
  - [ ] PinPad LIO V3
- [ ] Conectividade SEFAZ-SP (envio + recebimento NFC-e teste)
- [ ] Conectividade TOTVS (sync 1 produto teste)
- [ ] Conectividade Cielo (transação R$ 0,01 + cancela)
- [ ] Conectividade Azure Blob (backup log teste)
- [ ] Certificado A1 da loja válido (`certificate.expiration_date` > 30 dias futuro)
- [ ] TeamViewer Host ativo e autenticado
- [ ] Política de senha aplicada (Group Policy)
- [ ] Firewall Windows configurado (apenas endpoints Apex permitidos)
- [ ] Defender atualizado (definições <24h)

Apenas com todos os itens checados, Marina autoriza Diego a fazer login e retomar operação produtiva.

**Documentação pós-reset (Bruno preenche relatório):**

- Data e hora do reset
- POS afetado (ID hardware + ID lógico)
- Motivo do reset (causa-raiz documentada)
- Tempo total do procedimento
- Resultado dos testes pós-reset
- Lições aprendidas (se algo no procedimento pode ser melhorado)
- Aprovação Marina + Bruno

Esse relatório alimenta o postmortem trimestral de Bruno · entradas vão para o programa de melhoria contínua da TI.

**Backup do banco local — política e procedimento:**

A política de backup do banco local SQL Server Express segue padrão Apex:

- **Backup completo diário** às 02h00 (rotina automatizada)
- **Backup incremental** a cada 4 horas (proteção contra perda mínima)
- **Upload diário** para Azure Blob Storage (`apex-pos-logs-bkp` container)
- **Retenção local:** 30 dias em `C:\BIG\db\backup\`
- **Retenção Azure:** 5 anos (compliance fiscal SPED)
- **Validação semanal:** restore teste em ambiente isolado (Bruno faz aleatoriamente)
- **RTO (Recovery Time Objective):** 60min para restaurar último backup
- **RPO (Recovery Point Objective):** 4 horas (pior caso · perda máxima de 4h de dados)

Procedimento de restore (emergência):

1. Bruno acessa o POS via TeamViewer (autorização Marina)
2. Para o serviço LINX BIGiPOS (`net stop bigipos`)
3. Restore do backup mais recente do banco
4. Inicia LINX BIGiPOS (`net start bigipos`)
5. Smoke test pós-restore (página 9)
6. POS retorna à operação

**Procedimento de restore de logs (compliance SPED):**

Quando a Receita solicita logs específicos · Bruno restaura da camada de archive:

1. Identifica o período solicitado (data início + data fim)
2. Identifica as lojas relevantes (geralmente uma loja específica)
3. Move dados do Azure Blob Archive para Hot tier (operação demora 1-15h dependendo do volume)
4. Faz download dos logs
5. Filtra por critério do auditor
6. Gera ZIP para envio
7. Tempo total: ≤4h úteis (SLA Apex)

---

# Capítulo 7 — Compliance e auditoria

## 7.1 Auditoria fiscal SPED (Página 33)

O POS é a fonte primária de dados fiscais do Apex Group · todas as NFC-e emitidas geram registros que alimentam diretamente o SPED (Sistema Público de Escrituração Digital) da Receita Federal. A compliance SPED é não-negociável e auditada continuamente pelo time fiscal · qualquer falha de captura ou perda de dados gera passivo fiscal real (multa + risco reputacional).

**Estrutura SPED gerada a partir do POS:**

O POS alimenta dois principais SPED:

**SPED Fiscal (ICMS-IPI):**
- **Bloco C (notas fiscais saída):** registros C100 (cabeçalho NFC-e/NF-e) · C170 (itens) · C190 (resumo por CFOP/CST)
- **Bloco D (transporte · raro no POS):** apenas se houver entrega vinculada · normal para Apex Casa
- **Bloco H (inventário):** geralmente complementado pelo TOTVS, não pelo POS
- **Transmissão:** todo dia 25 do mês seguinte ao da operação
- **Validador:** PVA-SPED Receita Federal antes de transmitir (validação obrigatória)

**SPED Contribuições (PIS/COFINS):**
- **Bloco A (serviços · raro no POS):**
- **Bloco C (mercadorias · idem SPED Fiscal):**
- **Bloco M (apuração mensal):** registros M100/M210 com créditos e débitos
- **Transmissão:** todo dia 25 do mês seguinte
- **Validador:** PVA-SPED Receita Federal

**Retenção legal dos dados:**

Por exigência legal · os dados do POS são retidos por **5 anos completos** (no Brasil · prazo prescricional fiscal). A retenção é estruturada em duas camadas:

- **Local (POS):** `C:\BIG\logs\` mantém logs operacionais por 90 dias (rotação diária)
- **Cloud (Azure Blob):** backup central por 5 anos · acesso restrito (somente Bruno · time fiscal · Auditoria Interna)

**Backup Azure detalhes:**

- Container: `apex-pos-logs-bkp` (storage account dedicado · região Brazil South · resiliência LRS)
- Tier: Cool nos primeiros 6 meses · Cold após 6 meses · Archive após 18 meses (otimização de custo)
- Custo estimado: R$ 0,03 / GB / mês em Cool · R$ 0,015 / GB / mês em Archive
- Volume total Apex Group: ~120 TB acumulados em 5 anos
- Acesso: SAS tokens com validade restrita (1h padrão · revisão por requisição)

**Procedimentos de auditoria:**

**Auditoria interna (Apex):**
- Trimestral · conduzida pelo time de Auditoria Interna
- Amostragem aleatória de 1.000 NFC-e por trimestre (representatividade estatística)
- Verificação: integridade do XML · presença de logs · alinhamento entre LINX BIGiPOS e TOTVS
- Resultado: relatório para Carla (CFO) + Bruno (CTO)

**Auditoria externa (Receita Federal):**
- Solicitação ad-hoc (Receita escolhe quando)
- Tipicamente solicitação de XMLs de período específico (ex: "todas as NFC-e do mês de fevereiro/2026")
- TI tem **4 horas úteis para gerar ZIP** com os XMLs solicitados (compliance contratual)
- Procedimento Bruno: query no Azure Blob → download · compactação · upload ao portal Receita

**Caso de descumprimento (perda de dados):**

- **Perda por POS específico** (raro): multa Receita a partir de R$ 5.000 por NFC-e perdida · risco reputacional alto
- **Perda em massa** (catastrófico · ainda nunca ocorreu): multa potencial em centenas de milhares R$ · investigação Receita · escândalo público
- **Mitigação:** redundância de backup (POS local + Azure Blob + replicação Brazil South → Brazil Southeast)
- **Plano de contingência:** Bruno tem protocolo formal de "perda total de log" — documentado em `runbook_sap_fi_integracao.pdf` seção 7

**Histórico Apex Group em compliance SPED:**
- 0 multas SPED desde 2022 (após migração para arquitetura thick-client + backup Azure)
- 100% transmissão dentro do prazo nos últimos 36 meses
- Auditoria Receita Federal em 2024 retornou "Sem ressalvas" (relatório formal)

**Calendário fiscal anual do Apex Group (referência operacional):**

O POS alimenta diversos compromissos fiscais ao longo do ano:

| Mês | Compromisso fiscal | Dependência POS |
|---|---|---|
| Mensal (dia 25) | SPED Fiscal (ICMS-IPI) | Direta · todas as NFC-e do mês anterior |
| Mensal (dia 25) | SPED Contribuições (PIS/COFINS) | Direta · todas as NFC-e do mês anterior |
| Mensal (dia 20) | DARF de IRRF (folha) | Indireta (não POS · folha Senior) |
| Mensal (dia 7) | DAS Simples Nacional (não aplicável Apex · lucro presumido) | — |
| Anual (janeiro) | DEFIS (Declaração Anual SP) | Indireta · agregação anual |
| Anual (março-abril) | DCTF (Declaração de Débitos · federal) | Indireta · agregação |
| Anual (junho) | DIRPF dos empregados (folha) | Direta · folha Senior |
| Anual (julho) | DIRF (Declaração do IRRF) | Indireta |
| Anual (outubro-novembro) | Auditoria interna fiscal completa | Direta · revisão amostral |
| Trimestral | DCTFWeb (PIS/COFINS · novo desde 2025) | Direta |

A equipe fiscal interna (3 contadores · liderados por Anna · subordinada a Carla) monitora todos os compromissos · POS é fonte primária para os relacionados a operação varejista.

**Sistema de alertas fiscais:**
- Faltam 5 dias para transmissão SPED Fiscal · alerta amarelo
- Faltam 2 dias · alerta vermelho · ação obrigatória
- Vencimento expirado · escalação imediata para Carla (CFO) · contato com Receita
- Inconsistência detectada no PVA-SPED (ex: registro D100 com CFOP inválido) · ticket Fiscal · resolução em 24h

**Caso histórico TKT-14 (referência):**

O ticket TKT-14 do seed `apex-helpsphere` ilustra um caso clássico de SPED fiscal: contabilidade tentou gerar SPED Fiscal de setembro/2026 mas o PVA-SPED da Receita rejeitou com erro no registro D100 (CFOP inconsistente). Prazo legal: dia 25/10 (4 dias úteis restantes). Resolução: correção da parametrização em TOTVS + regeração do arquivo + transmissão dentro do prazo. Ticket fechado como Resolved com lição: validação preventiva de CFOP em fechamento mensal.

## 7.2 Auditoria PCI-DSS (Página 34)

O Apex Group é certificado **PCI-DSS Level 1** desde 2020 · revalidação anual obrigatória conduzida por QSA (Qualified Security Assessor) credenciado. Level 1 é o nível mais exigente do PCI · aplicável a comerciantes com >6 milhões de transações cartão/ano. O Apex processa ~22 milhões de transações cartão/ano nas 5 marcas · facilmente acima do limite.

**Princípio crítico — dados de cartão NÃO são armazenados no POS:**

A arquitetura do POS Apex é construída para garantir que nenhum dado sensível de cartão jamais seja persistido. Concretamente:

- **PAN (Primary Account Number · número completo do cartão):** NUNCA armazenado · LINX BIGiPOS recebe apenas tokens da Cielo
- **Track 2 (faixa magnética):** NUNCA tocado · PinPad LIO V3 envia direto para Cielo via TLS · LINX BIGiPOS não recebe
- **CVV (código verificador):** NUNCA tocado · idem
- **Senha do cartão (PIN):** NUNCA toca em nada da rede Apex · PinPad criptografa localmente e envia para Cielo

O LINX BIGiPOS recebe da Cielo apenas:
- **Token** (string ofuscada · sem valor fora do contexto Cielo)
- **Últimos 4 dígitos do cartão** (para impressão no cupom · ex: `*\*\*\*-1234`)
- **Bandeira** (Visa · Mastercard · etc · útil para reconciliação)
- **Valor autorizado**
- **Número de autorização Cielo** (NSU)
- **TID** (Transaction ID Cielo · usado em reconciliação e estornos)

Cupom impresso mostra somente os 4 últimos dígitos · nunca o PAN completo · nunca CVV · nunca a faixa magnética.

**Auditoria trimestral PCI-DSS:**

A revalidação anual é precedida por auditorias trimestrais internas + scan ASV:

**Scan de vulnerabilidade ASV (Approved Scanning Vendor):**
- Conduzido pela Qualys (fornecedor homologado pelo PCI Council)
- Frequência: trimestral
- Escopo: todos os IPs públicos da rede Apex (especialmente endpoints Cielo + TOTVS Edge)
- Falha encontrada: deve ser corrigida em até 30 dias (compliance)
- Falha crítica não corrigida: risco de perda de certificação PCI-DSS

**Pen-test anual em ambiente PCI:**
- Conduzido por empresa terceira (não a mesma do scan)
- Escopo: POS + TEF Cielo + comunicação com Cielo Gateway
- Inclui testes de engenharia social (phishing em operadores)
- Relatório: para Bruno (CTO) + Carla (CFO) + QSA

**Revisão de logs `bigipos-cielo.log`:**
- Conduzida pelo time de Compliance Apex (não pelo time TI · separação de responsabilidades)
- Trimestral
- Objetivo: garantir que **NENHUM PAN aparece em texto claro em qualquer log**
- Falha encontrada: incidente PCI · gestão de crise · comunicação a Cielo e ao Banco Central

**Não-conformidades em scan ASV:**
- 0 não-conformidades críticas em 2025 e 2026-Q1
- 3 não-conformidades médias em 2025 (todas corrigidas dentro de 15 dias)
- 12 não-conformidades baixas em 2025 (todas corrigidas em 30 dias)

**Política Apex — suspeita de violação cartão:**

Qualquer suspeita de violação é tratada como severidade **Critical**:

- Cartão duplicado em transação (mesmo PAN aparecendo em duas vendas próximas)
- PIN exposto em qualquer log (mesmo que mascarado)
- Tentativa de extração de dados via TeamViewer
- Hardware comprometido (PinPad alterado · com dispositivo skimming)

Procedimento:
1. Marina ou Diego identifica
2. Diego informa Marina imediatamente (sem documentar em sistemas inseguros)
3. Marina aciona Bruno via Slack `#ti-pos-emergencia` (linha 24/7)
4. Bruno avalia: se confirmar, abre incidente PCI · notifica Cielo (que notifica o Banco Central)
5. POS afetado é isolado fisicamente · Cielo PinPad é trocado preventivamente
6. Lia + Carla são notificados (gestão de crise)
7. Time Jurídico avalia comunicação ao público (LGPD · vazamento de dados)
8. Auditoria interna investiga a fundo (3-7 dias)
9. Relatório formal · ações corretivas · revisão por QSA

**Histórico Apex Group em compliance PCI:**
- Certificação PCI-DSS Level 1 mantida desde 2020 sem interrupção
- 0 incidentes confirmados de violação de dados de cartão
- 1 falso positivo investigado em 2024 (resolvido como erro de configuração ASV)

**Os 12 requisitos PCI-DSS aplicados ao Apex Group (resumo · aplicação ao POS):**

1. **Instalar e manter firewall** — switch Cisco SG350-28 de cada loja tem ACL restritivo · só conexões Cielo / SEFAZ / TOTVS são permitidas dos POS
2. **Não usar credenciais padrão** — Windows 10 IoT customizado (senha admin única por POS · gerada cripto-randomicamente)
3. **Proteger dados armazenados** — dados de cartão NUNCA armazenados · só tokens Cielo (sem valor fora do contexto)
4. **Criptografar transmissão em rede aberta** — TLS 1.3 mandatório entre PinPad ↔ Cielo · entre LINX BIGiPOS ↔ TOTVS
5. **Antivírus atualizado** — Microsoft Defender com definições <24h · scan diário às 03h (mesma janela de update)
6. **Sistemas seguros** — patches Windows + LINX aplicados em até 30 dias após release · CVE críticos em até 7 dias
7. **Restringir acesso aos dados** — controle de acesso baseado em papel (RBAC) · Diego não acessa logs Cielo · Marina acessa só relatórios não-sensíveis
8. **Identificar e autenticar usuários** — matrícula + senha (com rotação 60 dias) · supervisora exige duplo fator em algumas operações
9. **Restringir acesso físico** — POS fisicamente fixado ao balcão · cofre da loja sob CFTV · acesso à sala TI restrito
10. **Monitorar e auditar acessos** — todos os eventos em log estruturado · acesso TeamViewer registrado · auditoria mensal
11. **Testar regularmente** — scan ASV trimestral · pen-test anual · revisão de configurações semestral
12. **Política de segurança** — este manual + outros documentos AFIM (LGPD · operação · etc) cumpre o requisito 12

**Tempo de retenção de logs PCI:**

Logs com informações sensíveis para PCI (transações cartão · acessos · alertas) são retidos:
- **3 meses** acessíveis online (Azure Log Analytics + Application Insights)
- **1 ano** acessíveis em consulta padrão (Azure Blob Hot tier)
- **5 anos** retidos em archive (Azure Blob Archive tier)

Após 5 anos · logs são purgados (compliance LGPD · não manter dados além do necessário).

**Procedimento em caso de fraude detectada pelo cliente (exemplo prático):**

Cliente do programa fidelidade Apex+ liga no SAC: "Tive uma compra de R$ 8.470 no meu cartão de uma loja Apex Casa que não fiz. Foi clonagem?"

Fluxo de investigação:

1. **SAC abre ticket Comercial** (categoria suspeita de fraude · prioridade High)
2. **Atendente solicita confirmações:** data e hora aproximadas · forma de pagamento (cartão) · últimos 4 dígitos do cartão
3. **Ticket é encaminhado para Marina** (supervisora da loja envolvida)
4. **Marina consulta CFTV** do horário · identifica se houve cliente naquele caixa naquele horário
5. **Se CFTV mostra cliente diferente** (visualmente diferente do perfil do cliente · ex: cliente é mulher mas o vídeo mostra homem):
   - Marina escala para Bruno (CTO) + Compliance
   - Bruno extrai logs `bigipos-cielo.log` para analisar a transação (tipo · NSU · tempo)
   - Bruno coopera com Cielo na investigação (Cielo abre disputa com banco emissor)
   - Cliente é orientado a registrar BO online + abrir disputa com o banco
   - Apex bloqueia o cartão para futuras compras (lista negra interna)
6. **Resolução:**
   - Se confirmada fraude: Cliente recebe estorno via banco emissor (Cielo paga o lojista nesse caso por contrato)
   - Se inconclusivo: Apex absorve possível prejuízo (raro · poucos casos por ano)

Esse fluxo é detalhado em `politica_dados_lgpd.pdf` (tratamento de dados em casos de fraude) e em `politica_reembolso_lojista.pdf` (alçada para casos de chargeback).

**Programa de bug bounty Apex (responsible disclosure):**

O Apex Group mantém programa de divulgação responsável de vulnerabilidades:

- Endpoint público: `security.apex.com.br/responsible-disclosure`
- Pesquisadores podem reportar bugs em escopo definido
- Premiação por severidade (CVSS):
  - Crítico (9.0+): R$ 25.000 - R$ 100.000
  - Alto (7.0-8.9): R$ 10.000 - R$ 25.000
  - Médio (4.0-6.9): R$ 2.000 - R$ 10.000
  - Baixo (<4.0): reconhecimento público (sem prêmio monetário)
- Avaliação interna por Bruno + Compliance em até 30 dias
- 0 vulnerabilidades críticas reportadas em 2025 (programa em andamento)

**Treinamento anual de segurança (operadores):**

- 8 horas de treinamento obrigatório anual
- Tópicos: phishing · engenharia social · senhas seguras · uso adequado do TeamViewer · proteção CFTV · LGPD
- Avaliação final (>80% para aprovação)
- Sem aprovação: novo treinamento em 30 dias
- 2 reprovações consecutivas: encaminhamento para revisão RH

**Reconhecimento PCI-DSS — relatório anual de conformidade:**

Anualmente, o QSA emite "Report on Compliance" (ROC) que confirma:
- Implementação correta dos 12 requisitos PCI-DSS
- Resultados dos scans ASV trimestrais
- Resultado do pen-test anual
- Revisão de logs (amostragem)
- Treinamento de equipe (evidência)

O ROC é enviado a:
- Cielo (adquirente principal)
- Banco emissores parceiros (raríssimo)
- Reguladores (apenas quando solicitado · raro)

A perda de certificação PCI-DSS é evento catastrófico que pode custar:
- Multa Cielo: R$ 50.000 - R$ 500.000 (escalável conforme tamanho do varejo)
- Aumento de MDR: 1-2 pontos percentuais (R$ 30M+/ano de impacto no Apex Group)
- Suspensão de aceitação de cartões (raríssimo · apenas em violação crítica não corrigida)
- Risco reputacional alto

Por isso, conformidade PCI é prioridade absoluta na governance do Apex Group.

## 7.3 Anexos e contatos rápidos (Página 35)

### Anexo A — Contatos por fornecedor de hardware/software

| Fornecedor | Produto / Serviço | Contato suporte | SLA contratual Apex Group |
|---|---|---|---|
| **LINX** | BIGiPOS 12.5 + manutenção fiscal | 0800-070-0008 · `suporte@linx.com.br` · portal Linx Service | 4h úteis (P1 · crítico) · 24h úteis (P2 · normal) · 72h (P3 · baixo) |
| **Cielo** | Adquirência + PinPad LIO V3 | 0800-570-8511 (linha dedicada Apex) · portal `cielo.com.br` | 2h úteis (PCI · violação) · 24h (operacional · troca PinPad) |
| **Bematech** | Terminal MP-4200 + impressoras integradas | 0800-644-7000 | 24h úteis (troca on-site) · 48h (peças menores) |
| **Epson** | Impressora TM-T20III (backup) | 0800-880-0094 | 48h úteis |
| **Honeywell** | Leitor Voyager 1450g | Via revenda Bematech | 48h úteis |
| **Toledo** | Balança Prix 3 Fit (Apex Mercado) | 0800-728-5226 | 24h úteis (loja com balança · operação crítica) |
| **APC (Schneider)** | No-break Back-UPS BR1200BI-BR | 0800-728-3098 | 48h úteis (troca preventiva · revisão anual) |
| **Microsoft** | Windows 10 IoT LTSC 2021 | Via Partner enterprise · contato Bruno | 4h úteis (P1) · 24h (P2) |
| **TOTVS** | Protheus + integração POS | Portal TOTVS · gerente de conta dedicado | 4h úteis (P1) · 24h (P2) |
| **Senior Sistemas** | Folha de pagamento + eSocial | Portal Senior | 24h úteis |

### Anexo B — Contatos internos Apex Group

| Papel | Pessoa | Canal preferencial | Quando acionar |
|---|---|---|---|
| **Operador caixa Tier 1** | Diego Almeida (e equipe operadora) | Presencial · WhatsApp grupo da loja · interfone | Operação normal · escalações via Marina |
| **Supervisora Tier 2 (regional Apex)** | Marina Borges (e supervisoras regionais) | Matrícula POS · WhatsApp · Slack `#sup-pos` | Escalação Diego · decisões operacionais · sangrias |
| **Head de Atendimento Tier 2+** | Lia Fernandes | Slack DM · email `lia@apex.com.br` | Decisões > R$ 500 · clientes VIP · imprensa · denúncias |
| **CTO / TI Tier 3** | Bruno Carvalho (e plantão TI) | PagerDuty · Slack `#ti-pos-emergencia` | POS down · NFC-e bloqueada · suspeita fraude PCI · violação rede |
| **CFO** | Carla Diniz | Email `carla@apex.com.br` · Slack DM | Decisões financeiras estruturais · auditoria PCI · grandes contratos |

**Plantão 24/7 do TI:**
- Bruno tem rotina de plantão · sempre 1 engenheiro sênior disponível por PagerDuty
- Tempo de resposta: <15min (madrugada) · <5min (horário comercial)
- Escalation chain: Engenheiro sênior → Bruno → Sub-CTO (em casos catastróficos)

### Anexo C — Documentos relacionados (cross-reference)

Este manual integra a base de conhecimento corporativa do Apex Group. Documentos relacionados:

- **`manual_operacao_loja_v3.pdf`** — operação geral de loja (recebimento de mercadoria · segurança patrimonial · manutenção preventiva trimestral · gestão de equipe)
- **`runbook_sap_fi_integracao.pdf`** — sync POS → TOTVS → SAP FI (arquitetura técnica completa · troubleshooting de sincronização)
- **`faq_pedidos_devolucao.pdf`** — política comercial de devolução (prazos · condições · garantia · alçadas comerciais)
- **`politica_reembolso_lojista.pdf`** — alçadas financeiras + estornos (limites por nível operacional · políticas de exceção)
- **`runbook_problemas_rede.pdf`** — diagnóstico de link da loja (afeta NFC-e · TOTVS · PinPad)
- **`faq_horario_atendimento.pdf`** — janelas operacionais (horários · feriados · SLA por canal)
- **`politica_dados_lgpd.pdf`** — tratamento de CPF e dados pessoais no POS (princípios LGPD aplicados ao varejo)

### Anexo D — Glossário de siglas usadas neste manual

- **CFOP:** Código Fiscal de Operações e Prestações (3 dígitos + ponto · ex: 5.102)
- **CFTV:** Circuito Fechado de Televisão (gravações de segurança)
- **CDC:** Código de Defesa do Consumidor (Lei 8.078/1990)
- **CST:** Código de Situação Tributária
- **GS1 DataBar:** padrão de código de barras 2D para perecíveis (peso · validade · lote)
- **MDR:** Merchant Discount Rate (taxa cobrada pela adquirente em cada transação cartão)
- **MDT:** Microsoft Deployment Toolkit (usado para deploy de imagem WIM no PXE)
- **MSMQ:** Microsoft Message Queue (fila local para sync com TOTVS)
- **NCM:** Nomenclatura Comum do Mercosul (classificação fiscal de produtos · 8 dígitos)
- **NFC-e:** Nota Fiscal de Consumidor eletrônica (modelo 65 · consumidor final pessoa física)
- **NF-e:** Nota Fiscal eletrônica (modelo 55 · consumidor pessoa jurídica)
- **PAN:** Primary Account Number (número completo do cartão · NUNCA armazenado)
- **PCI-DSS:** Payment Card Industry Data Security Standard
- **PIX:** Pagamento Instantâneo do Banco Central (sistema oficial Bacen)
- **POS:** Point of Sale (Ponto de Venda · terminal de caixa)
- **PXE:** Preboot Execution Environment (boot pela rede para deploy de imagem)
- **QSA:** Qualified Security Assessor (auditor PCI credenciado)
- **SAS:** Shared Access Signature (token Azure de acesso limitado)
- **SEFAZ-SP:** Secretaria da Fazenda do Estado de São Paulo
- **SLA:** Service Level Agreement (acordo de nível de serviço)
- **SPED:** Sistema Público de Escrituração Digital (Receita Federal)
- **TEF:** Transferência Eletrônica de Fundos (módulo Cielo no LINX)
- **TID:** Transaction ID (identificador único de transação Cielo)
- **TLS:** Transport Layer Security (protocolo criptografado de rede)
- **TOTVS Protheus:** ERP da TOTVS · sistema corporativo Apex
- **WIM:** Windows Imaging Format (formato de imagem do Windows para deploy)

---

### Footer

**Versão v4.2 · Q2-2026 · próxima revisão Q2-2027** (revisão anual obrigatória · aprovador Bruno CTO)

**Documento confidencial · uso interno Apex Group.** Reprodução proibida sem autorização expressa. Distribuição: HelpSphere KB · intranet TI · impressão controlada (numerada) nas lojas.

**Classificação LGPD:** este documento contém referências a dados pessoais (CPF · nome · cartão de crédito mascarado) e dados financeiros sensíveis. Acesso restrito por papel: Operadores Tier 1 (acesso parcial · capítulos 1, 2, 4, 5, 6) · Supervisores Tier 2 (acesso completo) · TI Tier 3 (acesso completo) · Auditoria Interna (acesso completo).

**Distribuição física:** 5 cópias impressas por loja (numeradas · 1 cópia na sala TI da loja · 4 cópias junto aos POS · controle de retorno em mudança de versão).

**Próximos marcos de revisão:**
- Q3-2026: avaliação Bematech MP-5200 (substituição planejada · Linux embarcado)
- Q4-2026: descontinuação completa do PinPad Vx690 legado · 100% LIO V3
- Q1-2027: piloto LINX BIGiPOS 13.0 (renovação major)
- Q2-2027: revisão anual deste manual · publicação v5.0

**Referência de auditoria:** este manual cumpre os requisitos de documentação operacional do PCI-DSS Level 1 (item 12.1 — Política de Segurança da Informação) e do programa de Compliance Apex Group (capítulo 4 — Manuais Operacionais).

---

### Anexo E — Procedimentos de emergência consolidados (Quick Reference Card)

Este anexo consolida em formato fast-reference as ações que Diego e Marina executam em cada cenário emergencial. Está disponível também em formato impresso plastificado A4 atrás de cada caixa.

**Cenário 1 — Queda total de energia:**
- Diego: comunica cliente · finaliza venda em curso (no-break tem 22-28min de autonomia)
- Marina: confirma se é loja, bairro ou regional · executa fechamento controlado em <20min
- Bruno: notificado via PagerDuty automaticamente
- Lia: notificada se duração >2h
- Cofre: deslocamento para próxima loja se necessário (transportadora Brink's)

**Cenário 2 — Queda de SEFAZ-SP:**
- Sistema: transição automática para contingência após 3 timeouts (90s)
- Diego: continua vendendo normalmente · cupom mostra "CONT" canto superior direito
- Marina: monitora status no dashboard supervisor
- Bruno: notificado se contingência >2h
- Cliente: nenhuma diferença operacional visível

**Cenário 3 — Queda total de internet:**
- LINX BIGiPOS opera em contingência total · PinPad usa modem GSM 4G interno (independente)
- Diego: continua vendendo · aceita dinheiro · PIX (via QR Cielo direto) · cartão (via 4G Cielo)
- Marina: ticket prioridade High no momento da detecção · `runbook_problemas_rede.pdf` seção 3
- Bruno: notificado via PagerDuty
- Diego: pode operar 4h em modo contingência total · após isso requer regularização

**Cenário 4 — POS principal apresenta defeito grave:**
- Diego: identifica · não tenta reboot
- Marina: autoriza PROC-POS-001 (substituição em ≤10min) com matrícula
- Diego: desliga POS principal · pluga cabos no secundário · POS secundário inicializa
- Operação: contínua sem perda de receita
- TI: Bematech aciona troca on-site (24h SLA)

**Cenário 5 — PinPad fora do ar (não recupera):**
- Diego: tenta recovery USB (3x)
- Marina: tenta recovery serial (1x)
- Marina: se ambos falham, aciona Cielo 0800-570-8511 (linha dedicada Apex)
- Cielo: SLA 24h para troca on-site
- Loja: aceita dinheiro + PIX apenas durante espera (cartões NÃO)
- Lia: notificada (impacto operacional)

**Cenário 6 — Suspeita de cartão clonado/fraude:**
- Diego: observa qualquer indício (cliente nervoso · cartão sem chip · venda atípica)
- Marina: chamada se suspeita
- Marina: autoriza encerramento da venda preventivamente
- Cliente: orientado a tentar outro pagamento (PIX · dinheiro)
- Cartão suspeito: NÃO entregue de volta · envelope lacrado · Cielo 0800
- Bruno: notificado se cartão retido

**Cenário 7 — Cliente alega ter sido lesado (descobre depois):**
- Atendente SAC: abre ticket · prioridade conforme valor
- Marina: investiga via CFTV
- Bruno: análise de logs se necessário
- Decisão estorno conforme alçada (Marina até R$ 5k · gerente regional até R$ 20k · Lia >R$ 20k)
- Comunicação: cliente recebe resposta em até 48h (saudável)

**Cenário 8 — Auditoria fiscal SPED chega solicitação Receita:**
- Time Fiscal: recebe solicitação formal (e-mail RFB · papel oficial)
- Carla: notificada imediatamente
- Bruno: gera ZIP com XMLs solicitados em ≤4h úteis
- Lia: avalia se há impacto reputacional (geralmente não)
- Comunicação: time fiscal responde via portal Receita

**Cenário 9 — Roubo na loja (ocorrência criminal):**
- Diego: NÃO reage · prioridade é segurança pessoal
- Marina: aciona Polícia (190) após ladrões saírem
- Marina: aciona TI emergencial (Bruno) para preservação de logs CFTV
- Carla: notificada (perda financeira)
- Lia: notificada (gestão de crise · comunicação interna)
- Loja: pode permanecer fechada para perícia (4-12h)

**Cenário 10 — Black Friday · Pico de operação:**
- Política especial ativa: POS secundários extras · Bematech standby · estoque papel térmico ampliado
- Marina: monitoramento contínuo do dashboard supervisor
- Bruno: 2 engenheiros de plantão TI adicional
- Cielo: standby para troca PinPad emergencial em 4h (em vez de 24h)
- Lia: comando central no dashboard executivo
- Pós-Black Friday: postmortem obrigatório

---

### Anexo F — Indicadores operacionais (KPIs) Apex Group

Indicadores que Lia (Head Atendimento) acompanha em tempo real no dashboard executivo:

**KPIs operacionais:**
- Total de POS ativos vs total da frota (target: 100% · alerta se <99.5%)
- Total de POS em contingência (target: 0% · alerta se >1%)
- Tempo médio de emissão NFC-e (target: <5s · alerta se >8s)
- Taxa de rejeição SEFAZ (target: <0.5% · alerta se >1%)
- Taxa de timeout SEFAZ (target: <0.1% · alerta se >0.3%)

**KPIs financeiros:**
- Vendas/dia/POS (média + tendência)
- Mix de formas de pagamento (PIX/débito/crédito/dinheiro)
- MDR efetivo médio (target: <2.0%)
- Taxa de chargeback (target: <1.0%)
- Inadimplência crediário Apex+ (target: <18%)

**KPIs de suporte:**
- Tickets HelpSphere abertos do POS por dia (média · tendência)
- Tickets resolvidos em <SLA (target: 95%)
- Tempo médio de resolução por categoria
- Tickets escalados a Tier 3 (Bruno) por semana
- Recorrências de mesma issue (alerta para sistemicidade)

**KPIs de qualidade:**
- NPS interno operadores (target: >8.0)
- NPS clientes pós-compra (target: >75)
- Divergências fechamento >R$ 5 (target: <0.5% turnos)
- Cancelamentos por motivo de erro operacional (target: <0.3%)

**Frequência de revisão:**
- Tempo real: dashboard executivo Lia
- Diário: relatório consolidado por marca
- Semanal: comitê Operações (Lia + Bruno + Carla)
- Mensal: reunião executiva (Diretoria)
- Trimestral: revisão estratégica · ajustes de política

**Benchmarking externo (referência setorial Apex Group · Q1-2026):**

Indicadores comparativos com mercado varejista brasileiro (fontes: SBVC · IBEVAR · pesquisas internas):

| Indicador | Apex Group | Mercado BR (média) | Posição |
|---|---|---|---|
| Tempo médio de emissão NFC-e | 4.8s | 6.2s | Melhor (22% mais rápido) |
| Taxa de rejeição SEFAZ | 0.32% | 0.85% | Melhor (60% menos rejeição) |
| Disponibilidade do POS (uptime) | 99.94% | 99.5% | Melhor |
| Taxa de chargeback | 0.4% | 0.8% | Melhor (50% menos) |
| MDR efetivo médio | 1.92% | 2.35% | Melhor (negociação contratual Cielo) |
| Adoção PIX | 32.8% | 28.5% | Acima da média |
| Tempo médio resolução ticket POS | 4h | 12h | Melhor |

Esses números são revisados anualmente pela equipe de Inteligência de Mercado · alimentam o relatório anual ao Conselho.

**Programa de melhoria contínua POS (PMC-POS):**

A iniciativa PMC-POS, liderada por Bruno em conjunto com Lia, identifica e executa melhorias trimestrais. Em Q1-2026:

- **Iniciativa 1:** otimização thread pool NFC-e (TKT-11) — concluída · ganho de 35% em tempo de emissão
- **Iniciativa 2:** ampliação cache local de produtos (de 8.000 para 12.000 SKUs) — concluída · redução de 18% em sync TOTVS
- **Iniciativa 3:** modernização interface BIG iPOS Front (UI/UX) — em planejamento (Q2-2026)
- **Iniciativa 4:** integração contactless móvel (Pix por aproximação · tap-to-pay) — em estudo

Cada iniciativa tem KPIs definidos · resultado medido antes/depois · postmortem documentado.

**Próximas evoluções planejadas (roadmap 2026-2028):**

- **2026-Q3:** avaliação Bematech MP-5200 (substituição da MP-4200)
- **2026-Q4:** descontinuação completa Vx690 · 100% LIO V3
- **2027-Q1:** piloto LINX BIGiPOS 13.0 (5 lojas)
- **2027-Q2:** rollout LINX 13.0 frota completa
- **2027-Q4:** migração SAP S/4 HANA (afeta integração POS → SAP FI)
- **2028-Q1:** avaliação POS Linux (substituição Windows 10 IoT)
- **2028-Q3:** PCI-DSS v4.0 compliance (versão revisada)

Cada marco do roadmap tem orçamento e equipe alocada · revisão semestral pela Diretoria.

---

### Anexo G — Atualizações e changelog deste manual

| Versão | Data | Mudanças principais |
|---|---|---|
| v1.0 | 2022-Q1 | Versão inicial · pós-migração thick-client |
| v2.0 | 2023-Q1 | Adição capítulo PIX · atualização Cielo LIO V3 (substitui Vx690 maior parte) |
| v2.5 | 2023-Q4 | Atualização códigos SEFAZ rejeição · novo procedimento contingência |
| v3.0 | 2024-Q1 | Adição programa crediário Apex+ · revisão completa capítulo pagamentos |
| v3.5 | 2025-Q1 | Atualização PCI-DSS Level 1 · descontinuação aceitação cheque |
| v4.0 | 2026-Q1 | Adição postmortem TKT-11 (POS congelando) · revisão MDR negociado Q2-2026 |
| **v4.2** | **2026-Q2** | **(atual) · refinamento procedimentos PROC-POS-001/002/003 · expansão troubleshooting · atualização contatos** |
| v4.3 | 2026-Q3 (planejado) | Avaliação Bematech MP-5200 · piloto 5 lojas · resultados parciais |
| v5.0 | 2027-Q2 (planejado) | Próxima revisão major · possível migração LINX 13.x |

**Mecanismo de distribuição deste manual:**

A nova versão do manual é distribuída por três canais redundantes:

1. **HelpSphere KB** (acesso digital · sempre a versão mais recente) — acesso por Diego, Marina, Bruno via sistema
2. **Intranet TI** (PDF baixável · sempre a última versão) — backup digital com pesquisa full-text
3. **Impressão controlada nas lojas** (5 cópias por loja · numeradas · controle de devolução)

A impressão controlada usa a Reprografia Centralizada do Apex (terceirizada · Acrobat Solutions) · cada cópia tem número único e código QR no rodapé que leva à versão digital mais recente.

**Política de versão obsoleta:**

Cópias de versões anteriores devem ser destruídas (não apenas guardadas) por:
- Risco de operadores consultarem informação desatualizada
- Compliance LGPD (versões antigas podem ter informação que não pertence mais ao documento)
- Auditoria PCI-DSS (versão única em produção · sem ambiguidade)

A destruição é confirmada por Marina mediante checklist · auditoria interna confere semestralmente.

**Sugestões de melhoria do manual (canal aberto):**

Qualquer leitor pode propor melhorias via:
- E-mail `manual-pos-feedback@apex.com.br`
- Ticket HelpSphere categoria "Documentação"
- Mensagem direta para Marina ou Bruno

Sugestões são consolidadas trimestralmente e podem virar mudanças na próxima revisão.

**Estatística de leitores deste manual:**

- ~5.500 leitores únicos cadastrados (operadores · supervisores · TI · auditoria)
- 38.000 acessos digitais por mês (média 2026-Q1)
- Páginas mais lidas: Capítulo 3 (NFC-e) > Capítulo 6 (Troubleshooting) > Capítulo 5 (Operações)
- Tempo médio de leitura por sessão: 12 minutos
- 92% dos operadores reportam o manual como "útil ou muito útil"

---

**[FIM DO DOCUMENTO]**
