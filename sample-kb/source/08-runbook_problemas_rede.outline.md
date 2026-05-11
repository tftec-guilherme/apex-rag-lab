# Outline — `runbook_problemas_rede.pdf` (PDF #8 de 8 · GRAND FINALE)

> **Categoria:** TI · rede + infra · **Páginas-alvo:** 18 · **Tickets âncora alvo:** ≥5
>
> Trabalho de outline cravado por @analyst (Atlas) em 2026-05-11 (sessão 4 da curadoria editorial Story 06.7 v2.0). Runbook técnico de troubleshooting denso — voz operacional Tier 1→Tier 3, jargão real Fortinet/Cisco/Azure/IPsec/BGP. Encerra a curadoria dos 8 PDFs canônicos.

---

## 🎯 Objetivo deste PDF

Runbook técnico unificado de **troubleshooting de rede e infraestrutura** + **escalação de incidentes** + **postmortems** da Apex Group, cobrindo:

- **Topologia high-level** — sede SP, CD Cajamar, 340 lojas, parceiros (Cielo, Frota.io, Loggi)
- **LAN de loja** — switches PoE, VLAN segregation, CFTV, PDV, WiFi cliente
- **WAN + VPN** — ExpressRoute Azure, VPN site-to-site IPsec (Loggi, Frota.io), BGP peering
- **Identidade + SSO** — Entra ID, password rotation, Managed Identity vs Service Principal
- **Capacity + performance** — postmortem Black Friday 2025 (App Service B3 saturado)
- **Escalação** — Tier 1 Diego → Tier 2 Marina (Network Engineer) → Tier 3 Bruno (CTO) → fornecedor

**Tom:** runbook técnico operacional — voz direta de quem opera incidente sob pressão. Sem hedging, sem narrativa. Procedimentos numerados, comandos CLI literais, valores R$ reais de impacto.

**Audiência primária:** NOC interno + Tier 2 Network + lideranças que recebem postmortem.

---

## 📑 Estrutura sugerida (18 páginas, 6 capítulos)

### CAP 1 — Visão arquitetural da rede Apex (3 pg)

#### Página 1 — Topologia high-level

##### Header
- Título: **Runbook — Problemas de Rede & Infraestrutura (Q2-2026)**
- Subtítulo: *Versão consolidada · uso interno Apex NOC + Tier 2 Network*
- Versão: `v4 · revisão semestral Q2-2026 · próxima revisão Q4-2026`
- Owner: Bruno (CTO) · Maintainer: Marina (Tier 2 Network Eng)

##### 1.1 Sites + footprint físico
- **Sede SP** (Faria Lima) — 2 andares · ~800 colaboradores · datacenter on-prem residual (legado AD + impressoras)
- **CD Cajamar** — 38.000 m² · operação 24/7 · core Cisco Catalyst 9300
- **CD Regional Recife** — failover parcial · ativo desde Q3-2025
- **340 lojas físicas** distribuídas SP/RJ/MG/BA/PR/RS — branch padrão Fortinet FortiGate 100F
- **Cloud Azure** região **Brazil South** (primary) + **Brazil Southeast** (DR)

##### 1.2 Conectividade entre sites
- ExpressRoute 1 Gbps sede SP↔Azure (peering primário · BGP ASN 65010)
- ExpressRoute 1 Gbps CD Cajamar↔Azure (peering primário · BGP ASN 65011)
- ExpressRoute Recife 200 Mbps (DR · BGP ASN 65012)
- VPN site-to-site IPsec lojas→hub Azure (Virtual WAN) · ~340 túneis ativos
- Backup link 4G/LTE em todas as lojas (failover automático via SD-WAN FortiGate)

##### 1.3 Parceiros conectados
- **Cielo** (adquirência) — extranet via certificado TLS mútuo · sem VPN
- **Frota.io** (roteirizador) — webhook REST + OAuth2 client credentials
- **Loggi** (last-mile) — VPN site-to-site IPsec dedicada (TKT-20 âncora)
- **TOTVS** (ERP cloud) — ExpressRoute peering · BGP ASN 65020
- **Bacen PIX SPI** — circuito dedicado certificado ICP-Brasil

---

#### Página 2 — Stack de tecnologias

##### 2.1 Edge das lojas
| Camada | Equipamento | Quantidade | Versão firmware mínima |
|---|---|---|---|
| Firewall + SD-WAN | Fortinet FortiGate 100F | 340 (1 por loja) | FortiOS 7.4.6 |
| Switch acesso PoE | Fortinet FortiSwitch 124F-POE | 340 (1 por loja) | FortiSwitchOS 7.4.2 |
| Access Point WiFi 6 | Fortinet FortiAP 431F | 1020 (3 por loja) | FortiAP 7.4.3 |
| Câmeras CFTV (IP PoE) | Hikvision DS-2CD2143G2-I | ~4080 (12 por loja média) | Firmware V5.7.21 |
| PDV (POS) | Gertec MP-2100 TH | ~1700 (5 por loja) | — |

##### 2.2 Core sede + CD
| Camada | Equipamento | Local |
|---|---|---|
| Core switch | Cisco Catalyst 9500-48Y4C | Sede SP + CD Cajamar |
| Distribution | Cisco Catalyst 9300-48UXM | Sede SP (×4) + CD (×8) |
| Firewall perimetral | Palo Alto PA-3260 HA pair | Sede SP + CD |
| Load balancer | F5 BIG-IP i2800 | Sede SP (LTM + ASM) |
| ExpressRoute MSEE | Equinix SP4 (provider Embratel) | Edge SP |

##### 2.3 Azure landing zone
- **Hub VNet** (`vnet-hub-brsouth`) — 10.100.0.0/16 — Azure Firewall Premium + ExpressRoute GW
- **Virtual WAN** hub (`vwan-apex-brsouth`) — agrega ~340 túneis de loja
- **DNS** privado interno: `corp.apex.local` (resolução cross-site via Azure Private DNS)
- **Identity** Entra ID tenant `apex.onmicrosoft.com` sincronizado com AD on-prem (Azure AD Connect cloud sync)

---

#### Página 3 — SLAs + ownership matrix

##### 3.1 Tiers de SLA por classe de site
| Tier | Sites | SLA mensal | RTO objetivo | RPO objetivo |
|---|---|---|---|---|
| **Tier 0** | Bacen PIX, gateway pagamentos | **99.99%** | <5 min | 0 (sync) |
| **Tier 1** | Sede SP, ExpressRoute primário | **99.99%** | <15 min | <5 min |
| **Tier 2** | CD Cajamar | **99.95%** | <30 min | <15 min |
| **Tier 3** | CD Regional Recife | **99.9%** | <2 h | <30 min |
| **Tier 4** | Lojas físicas (340) | **99.5%** | <4 h | <1 h |

> SLA de loja Tier 4 considera operação degradada aceitável com link 4G LTE backup (sem PIN pad sem fila vs. queda total).

##### 3.2 Janelas de manutenção padrão
- **Sede + CD:** terças 03h-05h BRT (notificação D-7)
- **Lojas:** quartas 04h-06h BRT (notificação D-3 via push HelpSphere)
- **Emergencial:** qualquer horário com aprovação Bruno (CTO) + comunicado <2h antes

##### 3.3 Matriz de ownership (RACI compacto)
| Domínio | Responsável (R) | Aprovador (A) | Consultado (C) |
|---|---|---|---|
| LAN loja (switch + AP) | Marina (Tier 2) | Bruno | Vendor Fortinet |
| WAN + ExpressRoute | Marina (Tier 2) | Bruno | MS Premier Support |
| VPN parceiros | Marina (Tier 2) | Bruno | Contraparte parceiro |
| Identity (Entra ID) | Bruno (CTO Tier 3) | Bruno | MS Identity Support |
| Apps Azure (App Service, AKS) | Bruno (CTO Tier 3) | Bruno | DevOps interno |
| CFTV + automação | Marina (Tier 2) | Bruno | Vendor Hikvision |

---

### CAP 2 — Troubleshooting LAN de loja (4 pg)

#### Página 4 — Switch PoE falhando

##### 4.1 Cenário âncora — TKT-16 (CFTV hortifruti Vila Mariana)
4 câmeras Hikvision do setor hortifruti da loja Vila Mariana offline há 3 dias. Outras câmeras da mesma loja operacionais. Suspeita inicial: switch PoE local falhando OU cabo rompido em obra recente de gesso.

##### 4.2 Procedimento Tier 1 (Diego) — coleta de evidência
1. Verificar status físico do switch local na loja (LED de porta, ventilação, temperatura)
2. Acessar FortiGate da loja via HelpSphere → "Status do site" → ver disponibilidade FortiSwitch acoplado
3. Coletar log do FortiSwitch: `diagnose switch-controller switch-info port-stats <port-id>`
4. Identificar portas que alimentam câmeras alvo (rotular fisicamente o patch panel)
5. Se LED da porta apagado mas a câmera está conectada: **caso PoE falho** → escalar Tier 2

##### 4.3 Procedimento Tier 2 (Marina) — diagnóstico avançado
1. SSH no FortiGate da loja: `ssh admin@10.<vlan-mgmt>.<store-id>.1`
2. Inspecionar PoE budget vs consumo:
   ```
   diagnose switch poe status
   ```
   Saída esperada: `Power Budget: 370W · Power Consumed: <consumo>W`
3. Se consumo bateu no teto (>95% do budget): switch atingiu limite de classe PoE+ (30W/porta) ou PoE++ (60W/porta)
4. Listar portas afetadas:
   ```
   diagnose switch poe port-status <interface>
   ```
   Verificar estado: `delivering-power`, `searching`, `fault`
5. Se estado `fault`: porta queimou (eletrostática / surto) → trocar para porta livre temporariamente
6. Coletar conexões físicas no patch panel — se cabo rompido (obra de gesso), agendar refazimento

##### 4.4 Critérios de troca emergencial do switch
- ≥30% das portas em estado `fault`
- Power budget bate teto recorrentemente (3 ocorrências em 7 dias)
- Temperatura interna >65°C (sensor `diagnose switch thermal`)
- CPU sustentado >80% por >2h (provável memory leak FortiSwitchOS desatualizado)

##### 4.5 Janela de troca
| Severidade | Janela | Aprovação |
|---|---|---|
| Emergencial (loja down) | Imediata | Marina (Tier 2) |
| Planejada (degradação) | Quarta 04h-06h | Marina + GR loja |
| Refresh tecnológico | Trimestral (sprint NOC) | Bruno (CTO) |

---

#### Página 5 — VLAN segregation

##### 5.1 Modelo padrão de VLANs por loja
| VLAN ID | Nome | Subnet template | Uso | Acesso à internet? | Acesso ao core? |
|---|---|---|---|---|---|
| 10 | `vlan-mgmt` | 10.<store>.10.0/24 | Gestão APs/switches/FortiGate | Não | Sim (gerência) |
| 20 | `vlan-pos` | 10.<store>.20.0/24 | PDV + impressora fiscal + balança | Restrito (Cielo, SEFAZ) | Sim (ERP) |
| 30 | `vlan-cftv` | 10.<store>.30.0/24 | Câmeras IP + NVR local | Não | Sim (NVR central) |
| 40 | `vlan-corp` | 10.<store>.40.0/24 | Notebooks colaboradores | Sim (filtrado) | Sim (corp apps) |
| 50 | `vlan-iot` | 10.<store>.50.0/24 | Sensores (temperatura câmara fria, RFID) | Não | Sim (IoT hub) |
| 100 | `vlan-wifi-cliente` | 172.<store>.0.0/22 | WiFi cliente final | Sim (NAT only) | **Não** (isolado) |

##### 5.2 Regras de firewall padrão (FortiGate policy template)
- `vlan-pos` → Cielo `*.cielo.com.br` (TLS 443) **ALLOW**
- `vlan-pos` → SEFAZ estado da loja (TLS 443) **ALLOW**
- `vlan-pos` → ERP `erp.apex.local` **ALLOW**
- `vlan-pos` → qualquer outro destino **DENY** (zero-trust strict)
- `vlan-wifi-cliente` → Internet via NAT, com filtro UTM (categoria adult/malware **DENY**)
- `vlan-wifi-cliente` → qualquer VLAN interna **DENY** (isolamento total)

##### 5.3 Erros comuns + remediation
| Sintoma | Causa provável | Correção |
|---|---|---|
| Cliente reclama WiFi lento (cliente final) | Saturação canal 2.4GHz · APs sem band steering | Habilitar band steering no SSID + reset clientes |
| PDV não conecta SEFAZ | Policy `vlan-pos`→SEFAZ retorna `Deny`; checar se IP da SEFAZ mudou (raro) | Atualizar object FQDN do FortiGate; pull manual `diagnose firewall fqdn list` |
| CFTV não grava no NVR central | Bloqueio inter-VLAN ou MTU mismatch (cap path MTU) | Validar policy `vlan-cftv`→`vnet-hub` e fragmentação RTSP |
| Notebook corp não acessa ERP via WiFi | AP autenticou em SSID cliente (não corporativo) | Forçar profile EAP-TLS · reemitir cert do device |

---

#### Página 6 — Cabeamento + patch panel

##### 6.1 Padrões de cabeamento Apex
- **Vertical (entre andares):** fibra OM4 LC-LC duplex · 50/125μm · suportando 10G/40G
- **Horizontal (rack→tomada):** Cat6A blindado (S/FTP) · até 100m garantidos para PoE++ 60W
- **Cordões de equipamento:** Cat6A patch cords coloridos por VLAN (azul=pos, vermelho=cftv, verde=corp, amarelo=mgmt)
- **Labeling:** etiqueta dupla face em cada ponta — formato `<rack-id>.<u>-<porta> ↔ <tomada-id>`

##### 6.2 Rotina de teste (mensal por loja, trimestral por CD)
1. Validar continuidade com Fluke MicroScanner ou equivalente (BERT pass/fail)
2. Verificar atenuação por canal (>30dB para fibra OM4 = problema · refazer fusão ou trocar)
3. Atestar PoE delivery medindo tensão na tomada (45-57V DC esperado para 802.3bt)
4. Cross-reference com base de inventário de cabos no FreshService (ativo `CAB-<store>-<id>`)
5. Reprovados: gerar OS para `infraestrutura@apex.com.br` com fotos + diagnóstico

##### 6.3 Padrão de identificação de patch panel
Patch panel é a fonte mais comum de incidente Tier 1 mal escalado. Regras:
1. **NUNCA** remexer cordão sem etiqueta legível — abrir OS antes
2. **NUNCA** reutilizar porta queimada sem trocar conector RJ45 + retesta
3. Após qualquer mudança física, atualizar o diagrama do site no **NetBox** (`netbox.apex.local`)
4. Validar com `show interface status` no FortiSwitch que porta enxergou o link após mudança

##### 6.4 Falhas frequentes documentadas
| Falha | Frequência (24m) | Causa-raiz típica |
|---|---|---|
| Cabo rompido durante obra civil | ~12 ocorrências/ano | Falta de marcação do trajeto + caderno de obra ignorado |
| Conector RJ45 mal crimpado | ~30 ocorrências/ano | Cordão feito em campo sem alicate calibrado |
| Atenuação alta em fibra | ~5 ocorrências/ano | Fusão envelhecida + sujeira no ferrule |
| Aterramento ausente (S/FTP) | ~8 ocorrências/ano | Rack sem barra de equipotencialização instalada |

---

#### Página 7 — Procedimento de troca de switch (janela emergencial vs planejada)

##### 7.1 Decision tree
```
Switch falhou? →
  ├─ Loja inteira down? → EMERGENCIAL (vide 7.2)
  ├─ Setor crítico down (PDV)? → EMERGENCIAL
  ├─ Setor não-crítico down (CFTV apenas)? → PLANEJADA próxima quarta
  └─ Degradação intermitente? → INVESTIGAR antes de trocar
```

##### 7.2 Procedimento emergencial (RTO objetivo <4h)
1. **T+0:** abertura de ticket P1 no HelpSphere (Diego) → escalação imediata Marina
2. **T+10min:** Marina valida diagnóstico via FortiGate Cloud + decide troca
3. **T+15min:** acionar courier de spare (estoque central de spares no CD Cajamar)
4. **T+20min:** comunicar gerente da loja + agendar técnico de campo (parceiro local)
5. **T+2h:** técnico chega na loja com switch novo + transceivers + cabos
6. **T+2h15:** técnico desliga switch antigo, identifica todos os cordões com etiqueta nova
7. **T+2h30:** instalação física do switch novo + power on
8. **T+2h45:** push da config do FortiGate (template `switch-loja-padrao.cfg`) via FortiCloud
9. **T+3h:** validação ponta-a-ponta (CFTV grava, PDV transaciona, WiFi conecta)
10. **T+3h15:** sign-off Marina + atualização NetBox + RMA do switch antigo para Fortinet

##### 7.3 Procedimento planejado (janela quarta 04h-06h)
1. **D-3:** anunciar manutenção via HelpSphere + push para gerente de loja
2. **D-1:** spare empacotado + roteiro do técnico finalizado
3. **D-day 04h:** técnico chega na loja (loja fechada)
4. **04h15-05h45:** troca + config + validação
5. **05h45-06h:** smoke test loja (Diego acompanha via dashboard)
6. **06h:** sign-off + abertura normal da loja

##### 7.4 Estoque mínimo de spares
| Equipamento | Spare mínimo | Localização |
|---|---|---|
| FortiSwitch 124F-POE | 12 unidades | CD Cajamar (cofre TI) |
| FortiGate 100F | 8 unidades | CD Cajamar (cofre TI) |
| FortiAP 431F | 20 unidades | CD Cajamar + 4 hubs regionais (PA, BA, RS, PR) |
| Transceivers SFP+ 10G LR | 30 unidades | CD Cajamar |
| Patch cords Cat6A 3m | 200 unidades | CD Cajamar + lojas (kit emergência 5un/loja) |

---

### CAP 3 — Troubleshooting WAN e VPN (4 pg)

#### Página 8 — VPN site-to-site Loggi (TKT-20 âncora)

##### 8.1 Cenário
VPN IPsec site-to-site entre Apex Logística e Loggi caiu após renovação do certificado X.509 da Loggi em 28/04. Sintoma: IPsec phase-2 falha com erro `no proposal chosen` nos logs do FortiGate. Túnel phase-1 estabelece, mas qualquer tentativa de encapsulamento phase-2 cai.

##### 8.2 Topologia da VPN
- **Lado Apex:** FortiGate 100F do CD Cajamar (IP público `200.<x>.<y>.45`)
- **Lado Loggi:** Cisco ASA 5516-X (IP público `<loggi-public>`)
- **Phase-1:** IKEv2, AES-256-GCM, SHA-384, DH group 19 (ECP-256), lifetime 28800s
- **Phase-2:** ESP, AES-256-GCM, SHA-256, DH group 19 (PFS habilitado), lifetime 3600s
- **Subnets protegidas:** Apex 10.50.0.0/16 ↔ Loggi 172.18.4.0/22

##### 8.3 Procedimento Tier 2 (Marina) — diagnóstico
1. Coletar logs do FortiGate filtrando pelo peer Loggi:
   ```
   diagnose vpn ike log filter dst-addr4 <loggi-public>
   diagnose debug enable
   diagnose vpn ike log-filter src-addr4 200.<x>.<y>.45
   ```
2. Trigger phase-2 manual:
   ```
   diagnose vpn tunnel up <vpn-tunnel-name>
   ```
3. Capturar 30 segundos de log + desabilitar debug (`diagnose debug disable`)
4. Procurar no log a linha de proposal mismatch:
   ```
   responder: parsed SA_INIT response
   responder: incoming proposal: ESP|AES-CBC-256|SHA1|DH14|PFS=Y
   responder: configured proposal: ESP|AES-256-GCM|SHA256|DH19|PFS=Y
   responder: no proposal chosen
   ```
5. **Diagnóstico confirmado:** Loggi enviou SA proposal com **SHA1 + AES-CBC + DH14** após renewal — divergência clara com config nossa SHA256/GCM/DH19

##### 8.4 Causa-raiz histórica + remediation TKT-20
- Loggi renovou o cert na ASA mas usou template legacy que ainda referenciava `crypto map LEGACY` com algoritmos antigos (SHA1/AES-CBC/DH14)
- Solicitamos para Loggi atualizar o `crypto map` para versão nova (`MAP-2025-NEW` já presente na ASA mas não selecionado)
- Fortinet TAC validou que nossa config está correta — não cedemos para SHA1 (compliance NIST SP 800-131A nos proíbe)
- Loggi aplicou o crypto map novo em janela combinada · phase-2 retornou em ~3 min

##### 8.5 Lições aprendidas (capturadas no postmortem)
- Toda renovação de cert de VPN agora requer **validação dupla** (lado Apex confirma config do lado parceiro 24h antes da renewal)
- Adicionar monitor SNMP no FortiGate para alertar quando phase-2 não estabelece em <60s pós phase-1 sucesso
- Documento `vpn-parceiros-config.xlsx` mantido no SharePoint Tier 2 — algoritmos atuais de cada parceiro + data próxima renewal

##### 8.6 Algoritmos aceitos pela política Apex (Q2-2026)
| Categoria | Aceitos | Bloqueados |
|---|---|---|
| Encryption | AES-256-GCM, AES-256-CBC | AES-128-* (legado), 3DES, DES |
| Integrity | SHA-256, SHA-384, SHA-512 | SHA-1, MD5 |
| DH groups | 19 (ECP-256), 20 (ECP-384), 21 (ECP-521), 14 (MODP-2048 mínimo legacy) | 1, 2, 5 (MODP-768/1024/1536) |
| PFS | Obrigatório | Disabled (negar) |

---

#### Página 9 — Renovação de certificado X.509

##### 9.1 CA interna Apex
- **Root CA:** `Apex Root CA 2024` (offline, HSM físico cofre Bruno) — validade 20 anos
- **Issuing CA online:** `Apex Issuing CA 01` (Azure Key Vault Premium + dedicated HSM pool) — validade 10 anos
- **Cadeia de confiança:** distribuída via GPO (sede) + autoenrollment Intune (lojas) + manual em devices não-domain

##### 9.2 Templates de certificado por uso
| Template | Algoritmo | Validade | Renovação automática? |
|---|---|---|---|
| `WebServer-TLS` | RSA-3072 + SHA-256 | 1 ano | Sim (ACME interno) |
| `VPN-IKE-Cert` | ECDSA P-384 + SHA-384 | 2 anos | Não (manual + janela coordenada) |
| `Client-Auth-User` | RSA-2048 + SHA-256 | 6 meses | Sim (autoenrollment Intune) |
| `Device-Auth-Switch` | ECDSA P-256 + SHA-256 | 1 ano | Sim (SCEP via NDES) |

##### 9.3 Procedimento de renovação VPN (manual coordenado)
1. **D-30:** alerta automático do Key Vault em `lifecycle-vault@apex.com.br` (Marina + Bruno)
2. **D-14:** Marina abre ticket de janela com contraparte do parceiro VPN
3. **D-7:** janela confirmada · documento de algoritmos validado (vide 8.6)
4. **D-1:** dry-run em ambiente lab (FortiGate spare + ASA spare) para testar a nova cadeia
5. **D-day janela:**
   - Lado Apex gera CSR ECDSA P-384 no Key Vault
   - Issuing CA emite cert com SANs corretos
   - Cert importado no FortiGate (`config vpn certificate local`)
   - Lado parceiro recebe cert público + valida cadeia
   - Túnel reestabelecido + smoke test
6. **D+1:** validação ponta-a-ponta de tráfego real (não apenas ICMP) + sign-off Marina
7. **D+7:** post-validation — coletar SNMP da semana e validar `phase-2-rekey` ocorre <60s

##### 9.4 Sintomas de cert problemático
| Sintoma | Diagnóstico |
|---|---|
| `peer's certificate is invalid (verify-ca)` | Cadeia do peer não chega no root configurado → revisar bundle |
| `peer's certificate has expired` | Renewal não foi feito · ativar plano emergencial |
| `peer's certificate signature does not match` | Algoritmo de assinatura divergente (SHA1 vs SHA256) → checar template |
| `peer's certificate CN does not match peer ID` | Subject Alt Name inconsistente → recriar com SAN do hostname público |

##### 9.5 Algoritmos depreciados (NÃO usar)
- **SHA-1** em qualquer contexto (NIST SP 800-131A formal deprecation desde 2014)
- **DH group 2** (MODP-1024) — quebrado pelo Logjam attack (2015)
- **RSA-1024** — equivalente a ~80 bits de segurança (NIST exige ≥112 bits)
- **3DES** — meet-in-the-middle attack reduz para 112 bits efetivos

---

#### Página 10 — ExpressRoute Azure (peering, BGP, MD5 auth)

##### 10.1 Topologia ExpressRoute
- **Circuit primário SP:** 1 Gbps · Provider Embratel · localização Equinix SP4 · SKU **Premium** (acesso global Microsoft)
- **Circuit primário Cajamar:** 1 Gbps · Provider Embratel · localização Equinix SP4 · SKU Premium
- **Circuit DR Recife:** 200 Mbps · Provider Algar · localização Equinix RJ2 · SKU Standard
- Peering tipo **Microsoft + Private** habilitados nos 3 circuits
- Redundância: cada circuit tem 2 conexões físicas (primary + secondary) — VLAN tag dedicada para cada peering

##### 10.2 BGP — ASN allocation
| ASN | Lado | Uso |
|---|---|---|
| 12076 | Microsoft | Edge Microsoft Brazil South |
| 65010 | Apex | Sede SP |
| 65011 | Apex | CD Cajamar |
| 65012 | Apex | CD Regional Recife (DR) |
| 65020 | Apex | TOTVS peering (cross-cloud) |

##### 10.3 BGP MD5 authentication
**Obrigatório em todos os peerings ExpressRoute.** Senha MD5 rotacionada anualmente em janela coordenada com Microsoft (CRR ticket).

Comando para verificar autenticação MD5 no edge router Apex (Cisco IOS-XE):
```
show ip bgp neighbors 192.168.255.1 | include MD5
```
Saída esperada:
```
TCP MD5 authentication is enabled.
```

##### 10.4 Troubleshooting BGP comum
| Estado | Significado | Próxima ação |
|---|---|---|
| `Idle` | Peer não responde / config errada | Validar IP, ASN, MD5 dos dois lados |
| `Connect` | TCP 179 ainda não estabelecido | Checar firewall MD5 / routing intermediário |
| `Active` | Tentando handshake mas falhando | Provavelmente MD5 mismatch ou ASN errado |
| `OpenSent` | Negociando parâmetros | Verificar hold time + AS-path checks |
| `Established` | Peer up | Validar advertised + received prefixes |

##### 10.5 Procedimento Tier 2 (Marina) — peering caído
1. SSH no edge router: `ssh netadmin@<edge-router>`
2. `show bgp summary` — identificar peer afetado (state ≠ Established)
3. `show ip bgp neighbors <peer-ip>` — capturar estado detalhado
4. Validar reachability L3: `ping <peer-ip> source <local-loopback>`
5. Se reachability OK: rodar `debug ip bgp <peer-ip>` por 30s (cuidado: caro em CPU)
6. Analisar log — procurar mensagens `Notification: bad MD5 digest` ou `Open Hold Timer expired`
7. Confirmar MD5 com Microsoft via Premier Support (Severity B se circuit primário down)
8. Se MD5 OK: validar prefix-list e route-map (advertised count batendo expected)

##### 10.6 Métricas SLA observadas (últimos 6 meses)
| Circuit | Uptime real | Downtime (h) | Mean ms RTT (Apex→Azure) |
|---|---|---|---|
| SP Primário | 99.997% | 1.3h | 4.2 ms |
| Cajamar Primário | 99.995% | 2.2h | 5.1 ms |
| Recife DR | 99.92% | 8.7h | 18.3 ms |

---

#### Página 11 — Frota.io webhook (TKT-15 âncora)

##### 11.1 Cenário
Desde 17h de ontem o Frota.io (roteirizador third-party) não recebe pedidos novos do TMS interno. Webhook REST do TMS retorna 200 OK ao chamar `POST https://api.frota.io/v1/orders` mas pedidos não aparecem na fila do Frota.io. CD Cajamar precisou rodar roteirização manual emergencial para entregas D+1.

##### 11.2 Topologia da integração
```
TMS Apex (Azure App Service) ─[OAuth2 client credentials]─→ Frota.io (api.frota.io)
                                                              │
                                                              └─→ Frota.io Worker queue
```
- Authentication: **OAuth2 client_credentials grant** com Service Principal `sp-frota-tms-prod`
- Endpoint token: `https://auth.frota.io/oauth/token`
- Scope: `orders:write routes:read`
- Token TTL: 3600s (renovação automática 5min antes da expiração)

##### 11.3 Diagnóstico Tier 2 (Marina)
1. Validar logs do App Service (Log Analytics):
   ```kusto
   AppServiceConsoleLogs
   | where TimeGenerated > ago(24h)
   | where ResultDescription contains "frota.io"
   | order by TimeGenerated desc
   ```
2. Achado: requisições retornam **HTTP 401 Unauthorized** intermitentes desde 17h13 ontem
3. Validar Service Principal no Entra ID — `sp-frota-tms-prod`
4. **Causa-raiz identificada:** secret do SP rotacionado às 17h00 (rotina mensal automática Apex IT). Aplicação TMS lia secret do Key Vault via reference, MAS o cache local do App Service mantinha valor antigo por TTL de 12h
5. Frota.io reportava 200 OK no `POST /orders` porque token de fato chegava, mas tentativa de validação no Frota.io retornava 401 silencioso (Frota.io não propagou erro adequado — bug do lado deles)

##### 11.4 Remediation imediata
1. Restart do App Service para invalidar cache: `az webapp restart --name app-tms-prod --resource-group rg-tms-prod`
2. Validar primeiro pedido em <2 min pós-restart
3. Coletar tokens consumidos no Entra ID Audit Log:
   ```kusto
   AADServicePrincipalSignInLogs
   | where ServicePrincipalName == "sp-frota-tms-prod"
   | where TimeGenerated > ago(2h)
   ```

##### 11.5 Remediation estrutural
1. Migrar autenticação de **Service Principal → Managed Identity** (mesma jornada do TKT-17)
2. Adicionar healthcheck endpoint que valida token a cada 5 min e emite métrica `auth_token_age_seconds`
3. Alertar via Azure Monitor quando `auth_token_age_seconds > 3300` (faltam <5min para expirar)
4. Coordenar com Frota.io que reportem 401 explícito no webhook callback (bug deles)

##### 11.6 Padrão de retry recomendado
Para todas as integrações OAuth2 client_credentials do TMS:
- **Backoff exponencial** com jitter (start 1s, max 30s)
- **3 retries** automáticos em 401/403/500/502/503/504
- **Circuit breaker** após 5 falhas consecutivas — pausa 60s antes de re-tentar
- Logs estruturados com `correlation-id` propagado end-to-end

---

### CAP 4 — Identidade e SSO (3 pg)

#### Página 12 — Entra ID (Azure AD) + sync AD on-prem

##### 12.1 Topologia identity
- **Tenant Entra ID:** `apex.onmicrosoft.com` · domínios federados `apex.com.br`, `apexmercado.com.br`, `apextech.com.br`, etc
- **AD on-prem:** Forest `corp.apex.local` · 4 DCs (2 sede SP, 2 CD Cajamar)
- **Sync engine:** **Azure AD Connect cloud sync** (substituiu Connect Sync v1 em Q3-2025)
- **Sync interval:** 2 minutos (near real-time)
- **Identity master:** **AD on-prem** (source of authority para usuários colaboradores)
- **Cloud-only identities:** Service Principals + Workload Identities (não passam pelo AD on-prem)

##### 12.2 Authentication flow padrão (colaborador)
1. Colaborador acessa `https://portal.apex.com.br/sso`
2. Redirect para `login.microsoftonline.com/<tenant-id>`
3. Entra ID identifica domínio federado → redireciona para AD FS on-prem
4. AD FS valida credencial (Kerberos contra DC) → emite SAML token
5. Browser submete SAML token de volta para Entra ID
6. Entra ID emite OIDC ID token + access token → app recebe e cria sessão

##### 12.3 MFA — obrigatório para 100% dos colaboradores desde Q1-2026
- **Método primário:** Microsoft Authenticator push (com number matching habilitado contra MFA fatigue)
- **Método secundário:** OATH TOTP hardware (Yubikey 5C-NFC para roles privilegiados)
- **Fallback:** SMS apenas para break-glass account · proibido para uso geral

##### 12.4 Conditional Access policies em vigor (Q2-2026)
| Policy | Condição | Ação |
|---|---|---|
| `CA01-MFA-All` | Todos os usuários, todas as apps | Require MFA |
| `CA02-Block-Legacy-Auth` | Legacy auth protocols (IMAP, POP, SMTP basic) | Block |
| `CA03-Block-NoBrazil` | Login outside BR + não-marcado como travel | Block (escalation Bruno) |
| `CA04-Compliant-Device` | Apps M365 + ERP | Require Intune compliance |
| `CA05-PIM-Privileged` | Roles privilegiados (Global Admin, etc) | Require PIM activation + approval |

##### 12.5 Falhas comuns no sync AD↔Entra ID
| Sintoma | Causa | Remediation |
|---|---|---|
| Novo usuário criado no AD não aparece no Entra ID após 2h | Filtro OU sync excluiu | Validar `Get-ADSyncRule` filtros |
| Atributo desatualizado (telefone, cargo) | Conflito por null vs valor | Verificar `MS-DS-ConsistencyGuid` |
| Usuário desabilitado AD continua logando no Azure | Account expired flag não sincronizou | Forçar `Start-ADSyncSyncCycle -PolicyType Delta` |
| Senha não sincroniza | PHS Agent falhou | Reiniciar serviço `Microsoft Azure AD Connect Cloud Sync` no servidor agent |

---

#### Página 13 — TKT-17 âncora (12 funcionários sem reset SSO)

##### 13.1 Cenário (resolvido em Q1-2026)
Política mensal de password rotation do Entra ID notifica colaboradores 7 dias antes do vencimento. Em janeiro/2026, 12 colaboradores da matriz SP não receberam o e-mail de aviso. Quando senha venceu, ficaram bloqueados na manhã seguinte e abriram tickets P1.

##### 13.2 Investigação
1. Coletar Audit Log do Entra ID:
   ```kusto
   AADAuditLogs
   | where TimeGenerated > ago(7d)
   | where OperationName == "Send password expiration notification"
   | where TargetResources has_any (lista-12-usuarios)
   ```
2. Resultado: nenhuma tentativa de envio registrada para os 12 usuários afetados
3. Investigar o app que envia notificações: PowerShell script rodando no Azure Automation com **Service Principal** `sp-password-notify-prod`
4. Audit Log do SP:
   ```kusto
   AADServicePrincipalSignInLogs
   | where ServicePrincipalName == "sp-password-notify-prod"
   | where ResultDescription contains "rate"
   ```
5. **Causa-raiz:** SP atingiu rate-limit do Graph API (`Mail.Send` scope) após renewal de credenciais (rotação tinha ativado roll-over que disparou em massa requests retried)
6. Apenas 188 dos 200 alvos receberam notificação · os 12 azarados foram os últimos da fila

##### 13.3 Remediation imediata
1. Reset manual de senha dos 12 colaboradores pela equipe Identity (Bruno autorizado)
2. Senha temporária comunicada via canal seguro (gerente direto entregou pessoalmente)
3. Force password change at next logon = true
4. Validação: todos os 12 logaram normalmente em até 4h

##### 13.4 Remediation estrutural (entregue em sprint Q1-2026)
- **Migração SP → Managed Identity** para Automation account
  - Eliminação do roll-over de secret (Managed Identity tem renovação transparente)
  - Mantém audit trail completo no Entra ID
- **Throttle interno no script** — máximo 50 envios por minuto (abaixo do rate-limit Graph)
- **Healthcheck do envio** — script reporta métricas (`notifications_sent_total`, `notifications_failed_total`) para Azure Monitor
- **Alert** se `notifications_failed_total > 0` na execução mensal — escalar imediatamente Marina

##### 13.5 Service Principal vs Managed Identity — quando usar cada um
| Cenário | Recomendação |
|---|---|
| Workload rodando em Azure (App Service, Function, AKS, VM, Automation) | **Managed Identity** sempre |
| Workload rodando on-prem ou em outra cloud | Service Principal (com cert ao invés de secret se possível) |
| Integração third-party que precisa de credenciais visíveis | Service Principal com secret rotacionado |
| Pipeline CI/CD GitHub Actions | OIDC federation → Managed Identity equivalente |

---

#### Página 14 — Password rotation policy + break-glass

##### 14.1 Política Apex (Q2-2026)
| Categoria de conta | Validade | MFA? | Reset self-service? |
|---|---|---|---|
| Colaborador padrão | 90 dias | Sim | Sim (SSPR) |
| Privilegiado (admin AD, admin Azure) | 60 dias | Sim + PIM | Sim (com aprovação) |
| Service account on-prem (legado) | 365 dias | Não aplica | Não (manual via Identity team) |
| Service Principal Entra ID | 365 dias (cert) ou 180 dias (secret) | N/A | N/A (automation rotation) |
| **Break-glass** | **NUNCA expira** | **Não** (FIDO2 hardware) | **NUNCA** (manual emergencial) |

##### 14.2 Break-glass accounts
**Princípio:** acessos de último recurso quando todo o tenant Entra ID estiver inoperante.

Apex mantém **2 break-glass accounts**:
- `breakglass-01@apex.onmicrosoft.com`
- `breakglass-02@apex.onmicrosoft.com`

Características obrigatórias (alinhadas com guia Microsoft):
1. **Cloud-only** (não sincronizadas com AD on-prem)
2. **Excluídas de TODAS as Conditional Access policies** (especialmente Block-NoBrazil e Compliant-Device)
3. **MFA via FIDO2 hardware key apenas** — Yubikey custodiada fisicamente em cofre (Bruno + CFO)
4. **Senha gerada com 64+ caracteres** — armazenada em envelope lacrado em cofre (Bruno + CFO mantêm metade cada)
5. **Monitoramento 24/7** — alerta Sentinel para QUALQUER uso (login bem-sucedido ou falho)
6. **Auditoria mensal** — validação que MFA hardware funciona + cofre intacto

##### 14.3 Procedimento de uso de break-glass (emergencial)
1. Bruno (CTO) declara incidente Sev1 + autoriza uso
2. CFO entrega meia senha + Bruno entrega meia senha (controle dual)
3. Login em workstation isolada (não corporativa) com FIDO2 Yubikey
4. Toda ação registrada em log físico + sessão recordada (OBS Studio)
5. Após resolução: reset imediato da senha + nova FIDO2 emitida + sessão arquivada
6. Postmortem mandatório dentro de 5 dias úteis com CISO

##### 14.4 Self-Service Password Reset (SSPR)
- Habilitado para 100% dos colaboradores desde Q4-2024
- 2 métodos de verificação obrigatórios (de 4 possíveis: Authenticator, OATH TOTP, e-mail pessoal validado, SMS)
- SMS desabilitado para roles privilegiados (apenas hardware key)
- Logs SSPR retidos por 365 dias no Sentinel para forensics

---

### CAP 5 — Capacity e performance (2 pg)

#### Página 15 — Postmortem Black Friday 2025 (TKT-18 âncora)

##### 15.1 Sumário executivo
**Incidente:** Site `apexmoda.com.br` (Apex Moda) ficou indisponível durante 47 minutos no pico da Black Friday 2025 (28/11/2025), das 23h13 às 00h00. Aproximadamente **3.200 sessões de checkout** afetadas. GMV perdido estimado em **R$ 1.870.000** (com base em conversion rate médio das 4h anteriores e ticket médio R$ 580 do segmento Apex Moda).

##### 15.2 Timeline detalhada (28/11/2025)
| Hora BRT | Evento | Detector |
|---|---|---|
| 19h00 | Black Friday inicia · tráfego baseline pré-evento ~800 RPS | — |
| 22h45 | Tráfego escala a ~3.500 RPS (4.4x baseline) | Application Insights |
| 23h00 | Auto-scale do App Service (B3 Premium) começa add instâncias | Activity Log |
| 23h08 | App Service atinge **10 instâncias** (teto configurado da SKU) | Activity Log |
| 23h09 | Latência P95 sobe de 280ms para 1200ms | App Insights alert |
| 23h11 | Tráfego cresce para ~5.800 RPS (carga ~17 instâncias) | App Insights |
| 23h13 | Primeiras 5xx começam · taxa erro 8% | Front Door analytics |
| 23h15 | NOC recebe alerta P1 · Diego escala Marina | HelpSphere |
| 23h22 | Bruno acionado (Sev1 declarado) | Slack incident-bridge |
| 23h27 | Diagnóstico: SKU B3 não suporta scale-out adicional · decisão de pivot | War room |
| 23h31 | Scale-up para Premium v3 P2v3 iniciado (60 instâncias capacity) | Az CLI manual |
| 23h44 | Premium v3 P2v3 ativo + 18 instâncias warm | Activity Log |
| 23h52 | Erros 5xx caem para <0.5% | App Insights |
| 00h00 | Operação normal restabelecida · sign-off Bruno | Slack |

##### 15.3 Análise de causa-raiz (5-whys)
1. **Por que o site caiu?** App Service não conseguiu absorver pico de tráfego
2. **Por que não conseguiu?** Plano B3 Premium configurado com max 10 instâncias
3. **Por que estava configurado para max 10?** Configuração padrão do template Bicep do landing zone — nunca foi reavaliada após Black Friday 2024
4. **Por que não foi reavaliada?** Não havia processo formal de capacity review trimestral pré-eventos comerciais
5. **Por que não havia processo?** Programa de capacity planning não havia sido formalizado · responsabilidade implícita do DevOps sem RACI claro

##### 15.4 Impacto financeiro detalhado
| Item | Valor estimado |
|---|---|
| GMV perdido durante 47 min de indisponibilidade | R$ 1.870.000 |
| Custo de aceleração de scale-up (Premium v3 instances 24h post-incident) | R$ 14.300 |
| Esforço de engenharia (war room 4h + postmortem 12h) | R$ 28.000 (custo interno fully-loaded) |
| Reputational damage (NPS Apex Moda caiu 4 pontos no mês) | Não mensurado financeiramente |
| **Total quantificado** | **R$ 1.912.300** |

##### 15.5 Action items + status (Q2-2026)
| AI | Owner | SLA | Status |
|---|---|---|---|
| AI-1: Reconfig App Service Plan apexmoda para Premium v3 P2v3 max 30 + warm pool 5 | Bruno | D+7 | ✅ Done (06/12/2025) |
| AI-2: Capacity planning trimestral formalizado (Q-1 antes de eventos) | Bruno + Carla | Q1-2026 | ✅ Done (programa lançado 15/01/2026) |
| AI-3: Load testing trimestral em sandbox idêntico à prod | DevOps | Q1-2026 | ✅ Done (k6 + JMeter scripts versionados) |
| AI-4: Front Door + CDN aggressive caching para páginas estáticas + APIs read-mostly | DevOps | Q1-2026 | ✅ Done (cache hit ratio subiu de 42% para 78%) |
| AI-5: Alert SLO-based (não infrastructure-based) | DevOps + SRE | Q2-2026 | 🔄 InProgress (50% das services migrated) |
| AI-6: Postmortem template padrão + repositório centralizado | Bruno | Q1-2026 | ✅ Done (Confluence space `Postmortems`) |

---

#### Página 16 — Capacity planning + warm pool

##### 16.1 Programa de capacity planning (lançado Q1-2026)
**Cadência:** trimestral · revisão em **Q-1** (trimestre anterior) ao evento comercial alvo.

**Eventos comerciais críticos do calendário Apex:**
- **Black Friday** (final novembro) — pico esperado 6-8x baseline
- **Natal/Reveillon** (dezembro) — sustentação alta · pico 3-4x
- **Dia das Mães** (maio) — pico 2.5x (especialmente Apex Moda + Apex Casa)
- **Black November** (mês completo) — sustentação 2-3x baseline durante novembro inteiro

##### 16.2 Inputs do capacity review
1. Histórico de RPS, P95 latency, error rate (12 meses)
2. Projeções de marketing (campanhas, descontos, tier de mídia paga)
3. Custo Azure mensal por workload + simulação cost-impact
4. SLO targets por workload (e.g., apexmoda checkout: 99.95% mensal, P95 ≤500ms)

##### 16.3 Outputs do capacity review
1. **Capacity plan** por workload — qual SKU + quantas instâncias min/max + warm pool size
2. **Load test script** atualizado em k6 ou JMeter — simula carga projetada + 30% headroom
3. **Runbook de scale-up emergencial** (se mesmo o plano falhar) — comandos Az CLI prontos
4. **Comunicação** para stakeholders (CFO orçamento + CMO/CCO calendário)

##### 16.4 Warm pool — quando aplicar
**Warm pool = instâncias provisionadas e quentes** que recebem tráfego imediatamente (skip cold start).

| Workload | Warm pool size | Justificativa |
|---|---|---|
| `apexmoda-checkout` (App Service P2v3) | 5 instâncias | Black Friday + Dia das Mães · cold start ~90s inaceitável |
| `apextech-catalog-api` (Function Premium) | 3 instâncias | Variabilidade tráfego catalog browsing |
| `apexlogistica-tms` (App Service P1v3) | 0 (sob demanda) | Tráfego B2B estável · cold start aceitável |
| `apex-internal-bff` (AKS) | 2 pods replica permanente | Latency-sensitive interno |

##### 16.5 Load testing trimestral — workflow
1. **D-21:** Marina + DevOps definem cenários de teste (read-heavy, write-heavy, mixed)
2. **D-14:** scripts k6 versionados em `apex-loadtest` repo · revisão peer
3. **D-7:** spin-up de sandbox idêntico à prod (Bicep `loadtest-sandbox.bicep`)
4. **D-1:** dry-run em 30% da carga alvo · validar instrumentation
5. **D-day:** execução completa · 4h de duração com warm-up → ramp-up → sustained → ramp-down
6. **D+1:** análise de resultados (Grafana dashboards) · identificar bottlenecks
7. **D+7:** relatório executivo para Bruno + Carla · ajustes de capacity plan se necessário

##### 16.6 Métricas-chave monitoradas em produção
| Métrica | Threshold warning | Threshold critical |
|---|---|---|
| CPU instance média | >65% sustentado 10min | >85% sustentado 5min |
| Memory instance média | >70% sustentado 10min | >90% sustentado 5min |
| HTTP 5xx rate | >0.5% por 5min | >2% por 2min |
| P95 latency (checkout endpoint) | >500ms por 5min | >1000ms por 2min |
| Healthcheck failures consecutivos | 2 | 5 |
| Queue depth (Service Bus) | >1000 mensagens | >5000 mensagens |

---

### CAP 6 — Escalação e postmortem (2 pg)

#### Página 17 — Fluxo de escalação Tier 1 → Tier 3 → Vendor

##### 17.1 Tiers de suporte
| Tier | Quem | Responsabilidade | Ferramentas |
|---|---|---|---|
| **Tier 0** | Self-service (chatbot, KB pública) | Resoluções FAQ | HelpSphere bot |
| **Tier 1** | Diego (atendente) | Triagem + procedimentos padrão runbook | HelpSphere portal |
| **Tier 2** | Marina (Network Eng) | Troubleshooting profundo · acesso SSH/console | FortiCloud, Azure Portal, NetBox |
| **Tier 3** | Bruno (CTO) | Decisões estruturais · autoriza vendor escalation | Premier Support, vendor TAM |
| **Vendor** | Fortinet, Cisco, MS, Hikvision | Suporte L3 do produto · RMA | TAC respectivo |

##### 17.2 Critérios de escalação Tier 1 → Tier 2
Diego **DEVE** escalar para Marina quando:
1. Procedimento de runbook executado completamente sem resolver
2. Múltiplas lojas afetadas simultaneamente (≥3)
3. Loja inteira down (qualquer SLA tier)
4. Suspeita de comprometimento de segurança (qualquer indicador IOC)
5. Solicitação requer acesso SSH/console (vedado Tier 1)
6. Cliente VIP (>R$ 50k/ano) reporta indisponibilidade

##### 17.3 Critérios de escalação Tier 2 → Tier 3
Marina **DEVE** escalar para Bruno quando:
1. Incidente classificado como Sev1 (impacto financeiro projetado >R$ 100k OU múltiplos sites Tier 0-2 afetados)
2. Decisão envolve mudança de arquitetura (e.g., reconfigurar peering ExpressRoute)
3. Solicitação requer aprovação financeira (>R$ 10k não-orçado)
4. Vendor escalation precisa de aval contratual (e.g., Premier Support hour burndown)
5. Comunicação externa necessária (mídia, regulador, parceiro estratégico)
6. Suspeita de comprometimento de segurança confirmada

##### 17.4 Critérios de vendor escalation
Bruno autoriza vendor escalation quando:
- Bug confirmado do produto após exaustar troubleshooting interno
- RMA de hardware (DOA, falha em garantia)
- Premier Support ticket Severity A (Microsoft, Cisco) ou equivalente Fortinet TAC
- Pedido de feature request com impacto de negócio mapeado

##### 17.5 SLAs internos de resposta
| Severidade | Time-to-acknowledge | Time-to-resolve objetivo | Quem decide severidade |
|---|---|---|---|
| Sev1 (Critical) | <5 min | <2h | Bruno (CTO) |
| Sev2 (High) | <15 min | <8h | Marina (Tier 2) |
| Sev3 (Medium) | <1h | <24h | Marina (Tier 2) |
| Sev4 (Low) | <4h | <72h | Diego (Tier 1) |

##### 17.6 War room — quando convocar
**Sev1 sempre triggers war room.** Convocação imediata em canal Slack `#incident-bridge` + bridge Teams ativada por Marina ou Bruno.

Composição mínima:
- 1 IC (Incident Commander) — Marina ou Bruno
- 1 Communications Lead — Lia (Head Atendimento, comunica clientes/lojistas)
- 1 Scribe — registra timeline em real-time (apoio Diego ou backup)
- N Subject Matter Experts (variável por natureza)

Frequência de comunicação durante incidente Sev1:
- Update interno (war room): a cada 15 min
- Update stakeholders (Carla CFO, Bruno CTO): a cada 30 min
- Update externo (lojistas, parceiros): a cada 60 min (se aplicável)

---

#### Página 18 — Template de postmortem + governança

##### 18.1 Template padrão (todo Sev1 + Sev2 selecionados)
```markdown
# Postmortem — <título-incidente> · <data>

## 1. Sumário executivo (3-5 linhas)
- O que aconteceu
- Quando começou e quando terminou
- Quantos clientes/lojistas afetados
- Impacto financeiro estimado em R$

## 2. Timeline detalhada
| Hora BRT | Evento | Detector |
|---|---|---|
| ... | ... | ... |

## 3. Análise de causa-raiz (5-whys ou Ishikawa)
1. Por que ...?
2. Por que ...?
...

## 4. Impacto
- Operacional (sistemas afetados, duração)
- Financeiro (R$ perdido, R$ remediation)
- Reputacional (NPS, mídia, redes)
- Regulatório (LGPD, Bacen, ANATEL se aplicável)

## 5. O que funcionou bem
- ...

## 6. O que NÃO funcionou bem
- ...

## 7. Action items + owners + SLA
| AI | Descrição | Owner | SLA | Status |
|---|---|---|---|---|
| AI-1 | ... | ... | ... | ... |

## 8. Lições aprendidas
- ...

## 9. Sign-off
- Incident Commander: <nome>
- CTO: Bruno
- CFO (se aplicável): Carla
- Data publicação: ...
```

##### 18.2 Governança de postmortem
**Princípio:** **blameless postmortem.** Foco em sistemas e processos, não em culpa individual. Histórico:
- Sev1: postmortem **obrigatório** publicado em até 5 dias úteis
- Sev2: postmortem **obrigatório** publicado em até 10 dias úteis
- Sev3-4: postmortem **opcional** (a critério do Tier 2)

##### 18.3 Repositório centralizado
- Localização: Confluence space `Postmortems` (acesso restrito Tier 2+ + lideranças)
- Naming convention: `PM-YYYY-MM-DD-<slug-incidente>.md`
- Tagging obrigatório: `severidade`, `domínio` (network/identity/app/data), `marca afetada`, `impacto-R$`
- Revisão trimestral em comitê (Bruno + Marina + DevOps Lead + 1 representante de cada marca afetada) para identificar **tendências sistêmicas**

##### 18.4 Métricas agregadas de incidente (dashboard Bruno)
- **MTBF** (Mean Time Between Failures) por workload — meta: crescente trimestre a trimestre
- **MTTR** (Mean Time To Resolve) por severidade — meta: decrescente
- **% de action items dentro do SLA** — meta: >85%
- **Taxa de incidentes recorrentes** (mesma causa-raiz em <90 dias) — meta: <5%
- **Custo total de incidentes** trimestral — divulgado em conselho

##### 18.5 Postmortems publicados Q1-Q2 2026
| Data | Incidente | Severidade | Impacto R$ | Status AI |
|---|---|---|---|---|
| 28/11/2025 | Black Friday apexmoda 47min (TKT-18) | Sev1 | R$ 1.870.000 | 6/6 ✅ |
| 14/02/2026 | VPN Loggi phase-2 down 6h (TKT-20) | Sev2 | R$ 47.000 (atrasos last-mile) | 4/5 ✅ |
| 03/03/2026 | TMS↔Frota.io webhook silent fail (TKT-15) | Sev2 | R$ 38.000 (roteirização manual) | 3/3 ✅ |
| 22/03/2026 | Entra ID password notification gap (TKT-17) | Sev3 | R$ 0 quantificado (produtividade) | 4/4 ✅ |
| 09/04/2026 | CFTV Vila Mariana switch PoE (TKT-16) | Sev3 | R$ 0 (compliance interno) | 2/3 🔄 |

##### Footer
- Versão Q2-2026 · próxima revisão Q4-2026
- Documento confidencial — uso interno Apex NOC + Tier 2 Network + lideranças
- Cross-ref: `manual_operacao_loja_v3.pdf` (procedimentos de loja físicos), `runbook_sap_fi_integracao.pdf` (integração ERP), `politica_dados_lgpd.pdf` (governança de dados em incidentes)

---

## 🎯 5 perguntas-âncora validadas (≥5 conforme target)

1. **TKT-15** (Apex Logística — Frota.io webhook):
   > "Por que o Frota.io para de receber pedidos após renovação automática de credenciais? Como mitigar?"

   ➡️ **Resposta no PDF (Página 11):** OAuth2 client_credentials com Service Principal `sp-frota-tms-prod` rotacionou secret às 17h00 da rotina mensal Apex IT. App Service mantinha cache local do secret por TTL 12h. Remediation imediata: restart App Service. Remediation estrutural: migrar SP → Managed Identity + healthcheck token age + retry exponencial 3x com circuit breaker.

2. **TKT-16** (Apex Mercado — CFTV Vila Mariana):
   > "Como diagnosticar 4 câmeras CFTV offline há 3 dias, sendo que outras câmeras da mesma loja funcionam?"

   ➡️ **Resposta no PDF (Página 4):** Procedimento Tier 1 valida LEDs do switch + status FortiGate. Procedimento Tier 2 inspeciona `diagnose switch poe status` para identificar se PoE budget bateu o teto OU portas em `fault` state. Cabo rompido em obra recente também é causa frequente. Spare disponível no CD Cajamar (cofre TI · 12 unidades FortiSwitch 124F-POE).

3. **TKT-17** (Apex Tech — 12 funcionários sem reset SSO):
   > "Por que apenas 12 colaboradores não receberam notificação de password rotation mensal? Como evitar?"

   ➡️ **Resposta no PDF (Página 13):** Service Principal `sp-password-notify-prod` atingiu rate-limit do Graph API após rotação de credenciais (188/200 notificações enviadas, 12 últimos azarados). Remediation estrutural: migração para Managed Identity + throttle interno 50/min + alert em `notifications_failed_total > 0`. Padrão geral: workloads em Azure devem usar Managed Identity, não Service Principal.

4. **TKT-18 / postmortem Black Friday 2025** (Apex Moda — site fora do ar 47 min):
   > "Qual foi a causa do site Apex Moda cair na Black Friday 2025 por 47 minutos? Qual o impacto e como prevenir?"

   ➡️ **Resposta no PDF (Página 15):** App Service Plan B3 Premium configurado max 10 instâncias quando pico exigiu ~17 instâncias. Configuração nunca havia sido revisada após Black Friday 2024. Impacto: R$ 1.870.000 GMV perdido + R$ 42.300 custos diretos. 6 action items entregues, incluindo migração para Premium v3 P2v3 max 30 + warm pool 5 + capacity planning trimestral formalizado + load testing trimestral.

5. **TKT-20** (Apex Logística — VPN site-to-site Loggi):
   > "VPN com Loggi parou após renovação de certificado X.509. Erro `no proposal chosen` no IPsec phase-2. Como diagnosticar e resolver?"

   ➡️ **Resposta no PDF (Página 8):** Loggi aplicou cert novo mas continuou usando crypto map LEGACY (SHA1/AES-CBC/DH14) ao invés do MAP-2025-NEW (SHA256/AES-GCM/DH19). Apex não cedeu para SHA1 (compliance NIST SP 800-131A). Loggi aplicou crypto map novo em janela coordenada. Lição: toda renovação de cert de VPN agora exige validação dupla de config 24h antes da renewal + monitor SNMP para phase-2 não estabelecido em <60s.

---

## ✅ Validação cruzada com regras editoriais (CONTEXT.md)

- [✅] Sem AI slop ("É importante notar...", "No mundo de hoje...") — não usado
- [✅] Marcas Apex* fictícias — Apex Moda, Apex Mercado, Apex Tech, Apex Casa, Apex Logística citadas
- [✅] Vendors reais mantidos — Fortinet, Cisco, Microsoft/Azure, Hikvision, Loggi, Frota.io, Cielo, Equinix, Embratel, Algar
- [✅] Personas v5 — Diego (Tier 1), Marina (Tier 2 Network), Bruno (CTO Tier 3), Lia (Comms Lead war room), Carla (CFO)
- [✅] Valores R$ realistas — R$ 1.870.000 GMV BF · R$ 47.300 carga hortifruti · R$ 38.000 atrasos · R$ 14.300 scale-up
- [✅] Procedimentos numerados — 4.2/4.3/4.4 (PoE), 7.2/7.3 (troca switch), 8.3/8.4 (VPN), 9.3 (cert), 10.5 (BGP), 11.4/11.5 (Frota.io), 13.3/13.4 (Entra ID), 14.3 (break-glass), 17.6 (war room), 18.2 (postmortem)
- [✅] Tabelas estruturadas — >25 tabelas em 18 páginas (densidade alta apropriada para runbook)
- [✅] Cross-refs com outros PDFs — manual_operacao_loja_v3, runbook_sap_fi_integracao, politica_dados_lgpd
- [✅] Anti-obsolescência — revisão semestral declarada (Q4-2026)
- [✅] Datas relativas — Q2-2026 dominante · datas históricas absolutas apenas no postmortem Black Friday 2025 (evento factual com data precisa 28/11/2025)
- [✅] Jargão técnico real — IPsec phase-2, BGP MD5, DH groups, ExpressRoute peering, OAuth2 client_credentials, PoE++ 60W, AES-256-GCM, FIDO2, PIM, SSPR, RACI, MTBF/MTTR

---

## 🔄 Próximo passo (sessão 5)

1. Smoke test Document Intelligence `prebuilt-layout` em **1 PDF aleatório** (recomendo `manual_operacao_loja_v3.pdf` — 47 pgs, mais denso de todos)
2. Validar threshold ≥95% extração textual
3. Setup Pandoc + conversão dos 8 source.md → PDF/A-2b
4. Commit final no `apex-rag-lab`
5. Handoff @dev para bump `apex-helpsphere v2.2.0` (Decisão #24: substituir 11 refs `[KB]` antigas pelos 8 PDFs canônicos)

**Estimativa sessão 5:** ~2h.
