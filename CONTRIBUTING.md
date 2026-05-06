# Contributing — apex-rag-lab

> Convenções de contribuição pro Lab Intermediário D06.
>
> `version-anchor: Q2-2026`

---

## Convenção de commits (Conventional Commits)

Conventional Commits + referência a Decisões `#N` quando aplicável:

| Prefixo | Quando usar |
|---|---|
| `feat:` | Nova funcionalidade (capítulo novo, snippet novo, screenshot novo) |
| `fix:` | Correção de bug (typo, link quebrado, snippet inválido) |
| `docs:` | Apenas docs (README, DECISION-LOG, CHANGES, PARA-O-ALUNO, CHANGELOG) |
| `chore:` | Manutenção (deps, configs, CI) |
| `refactor:` | Reorganizar sem alterar conteúdo (mover arquivo, renomear) |
| `test:` | Adicionar/ajustar smoke tests |

### Exemplos

```
feat(docs): adicionar capítulo 03 (Storage Account)
fix(snippets): corrigir skillset.json — campo defaultLanguageCode pt-Latn
docs(decisions): cravar Decisão #2 (Doc Intelligence prebuilt-layout)
chore(ci): adicionar workflow lint-docs.yml
test(snippets): smoke validate JSON syntax
```

### Body do commit (opcional mas recomendado pra mudanças não-triviais)

```
feat(docs): adicionar capítulo 03 (Storage Account)

- Resource Group: rg-apex-rag-lab-{aluno}
- Storage tier: Standard LRS
- Container: documents (private access)
- Upload manual via Portal: arrastar 8 PDFs

Refs: Decisão #3 (Storage tier), CHANGES.md v1.0.0
```

---

## PR workflow

1. **Forka** o repo: `tftec-guilherme/apex-rag-lab` → `SEU_USUARIO/apex-rag-lab`
2. **Branch**: `feature/{escopo}` (ex: `feature/cap-03-storage`, `fix/snippet-skillset`)
3. **Commit** + push pra seu fork
4. **Abrir PR** pra `main` deste repo com:
   - Título seguindo Conventional Commits
   - Descrição com:
     - O que mudou (resumo 2-3 linhas)
     - Referência a Decisões/CHANGES quando aplicável
     - Screenshots se mudou conteúdo visual
     - Custo estimado se mudou steps de provisão
5. **Aguardar review** (mínimo 1 reviewer + status checks verdes)
6. **Squash and merge** preferido pra histórico linear

---

## Branch protection

`main` é protegida (configurado por @devops):
- Required PR review (mínimo 1)
- Required status checks: `lint-docs`, `snippets-test` (quando workflows existirem em v1.1.0)
- No direct push to main
- No force push to main

---

## Anti-padrões editoriais (pra contribuições de conteúdo)

Evite:
- ❌ "É importante destacar que…"
- ❌ "No mundo dinâmico do varejo de hoje…"
- ❌ "Em última análise…"
- ❌ Listas com 3+ bullets dizendo a mesma coisa
- ❌ Marcas reais (Magalu, Americanas, Casas Bahia) — use sempre marcas Apex fictícias
- ❌ Datas absolutas que envelhecem ("em janeiro de 2026...") — use `Q2-2026` ou "trimestre vigente"
- ❌ Nomes de pessoas reais — use sempre personas v5 (Diego, Marina, Lia, Bruno, Carla)
- ❌ Screenshots com dados pessoais ou IDs sensíveis (mask antes de commitar)

---

## Suporte

- **Issues:** https://github.com/tftec-guilherme/apex-rag-lab/issues
- **Discussions:** abrir issue com label `discussion` se quiser tirar dúvida geral
- **Prof Guilherme Campos** — disponível via TFTEC
