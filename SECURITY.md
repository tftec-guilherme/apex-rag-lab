# Security Policy

> `version-anchor: Q2-2026`

## Reporting a Vulnerability

This repository is part of an educational project (TFTEC Pós-Graduação Avançada de Cloud com Azure · Disciplina 06).

If you find a security vulnerability:

1. **Não abra um issue público** com detalhes do exploit
2. Envie email pra **prof Guilherme Campos** (Coordenador da Disciplina) — disponível via TFTEC
3. Inclua: tipo do problema, paths afetados, repro steps, impacto potencial

Espere resposta em até 5 dias úteis.

---

## Scope

- Conteúdo educativo é fictício (Apex Group é uma empresa fictícia — holding varejista BR)
- Snippets/configs Azure são exemplos pedagógicos — alunos devem ajustar pra produção real
- 8 PDFs `sample-kb/` contêm dados sintéticos sem informação confidencial real
- Nenhum credential, key ou secret deve ser commitado neste repo (verificado via `git secrets`-like no CI)

---

## Responsible Use

Lab Azure pode gerar custos reais (~R$ 50/mês se deixado ligado). Sempre rode o capítulo `docs/10-cleanup.md` ao terminar a sessão.

Recursos provisionados pelos alunos:
- Storage Account (~R$ 0,01/mês)
- Document Intelligence (free tier inicial)
- AI Search Basic (~R$ 7/dia)
- OpenAI deployments (~R$ 0,30/dia se idle)
- Resource Group inteiro deletável via 1 click

---

## Out of scope

- Vulnerabilidades em dependências do template upstream Microsoft (`azure-search-openai-demo` que inspira o `apex-helpsphere`) — reportar diretamente ao [MSRC](https://msrc.microsoft.com/create-report)
- Vulnerabilidades em Azure Services (Storage, Search, Doc Intelligence, OpenAI) — reportar ao Microsoft

---

## Versioning

Política de segurança versiona junto com `CHANGELOG.md`. Mudanças significativas (`MAJOR.MINOR`) são anunciadas em `CHANGELOG.md` e no commit message.
