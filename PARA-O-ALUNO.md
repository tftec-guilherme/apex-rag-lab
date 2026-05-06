# PARA-O-ALUNO — apex-rag-lab

> Bem-vindo. Este é o **entrypoint** do Lab Intermediário (RAG production-grade) da Disciplina 06. Vai te guiar pelo Portal Azure passo-a-passo construindo um pipeline RAG sobre 8 PDFs corporativos realistas em pt-BR.
>
> `version-anchor: Q2-2026` · `status: v0.1.0-init`

---

## ⚠️ Status atual

Conteúdo (10 capítulos passo-a-passo + 8 PDFs sample-kb + snippets + screenshots) **ainda em construção**. Veja [CHANGES.md](./CHANGES.md) para roadmap de versões.

Quando v1.0.0 sair, este arquivo terá:
- ✅ Pré-requisitos checklist (1 minuto)
- ✅ Quick Start em 6 passos
- ✅ 8+ surpresas pedagógicas catalogadas (gotchas Portal Azure)
- ✅ Custo estimado real (R$ medido no smoke test)
- ✅ Tempo realista por capítulo

---

## 🔗 Por enquanto, use as referências

### Referência de tom + estrutura
- [PARA-O-ALUNO do `apex-helpsphere`](https://github.com/tftec-guilherme/apex-helpsphere/blob/main/PARA-O-ALUNO.md) — 29 surpresas pedagógicas catalogadas, mesmo padrão de tom

### Conteúdo técnico do Lab Intermediário
- Guia v5 da disciplina: `azure-retail/Disciplina_06_*/01_Aulas/Lab_Intermediario_RAG_HelpSphere_Guia_Portal.md` (acesso via prof se você não é forkador)
- Microsoft Learn — Azure AI Search [skillsets](https://learn.microsoft.com/azure/search/cognitive-search-working-with-skillsets)
- Microsoft Learn — Document Intelligence [`prebuilt-layout`](https://learn.microsoft.com/azure/ai-services/document-intelligence/concept-layout)

### Repo companion (SaaS host)
- [apex-helpsphere](https://github.com/tftec-guilherme/apex-helpsphere) — sistema HelpSphere base que recebe os tickets que o RAG deste lab ajuda a responder

---

## 🎯 Cenário em 3 linhas (preview)

A **Apex Group** (holding varejo brasileira fictícia) já tem um sistema de tickets em produção: o **HelpSphere**. 12 mil tickets/mês, 50 deles em pt-BR seedados no `apex-helpsphere`. Sua missão neste lab: **construir um pipeline RAG production-grade no Portal Azure** que indexa 8 PDFs corporativos e responde dúvidas dos atendentes (Diego, Marina, Lia) sobre operação de loja, integração SAP, política de reembolso, etc.

---

## 📞 Suporte

- **Issues:** https://github.com/tftec-guilherme/apex-rag-lab/issues
- **Prof Guilherme Campos** (Coordenador da Disciplina) — disponível via TFTEC
