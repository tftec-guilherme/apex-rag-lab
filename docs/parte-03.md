# Parte 3 — Azure AI Vision (OCR de screenshots) (30min)

> Cria o Azure AI Vision, atribui RBAC e testa OCR em uma imagem de exemplo. O Vision será chamado pela Function App quando o ticket trazer screenshot anexado.

📘 **Conteúdo completo:** [`00-guia-completo.md` — seção "Parte 3"](./00-guia-completo.md#parte-3--azure-ai-vision-ocr-de-screenshots--30min)

## Passos

1. **Criar** Azure AI Vision `vision-helpsphere-rag`
2. **Anotar credenciais** (`VISION_ENDPOINT`, `VISION_KEY`)
3. **Atribuir RBAC** do Managed Identity
4. **Testar OCR** com imagem de exemplo ([`snippets/test_vision_ocr.sh`](../snippets/test_vision_ocr.sh))

## Pré-requisitos

- ✅ Partes 1 + 2 completas

## Cenário pedagógico

Atendente tier 1 abre ticket: "POS travou, segue print". Imagem com tela de erro. RAG sem Vision não consegue ler o screenshot. Com Vision (OCR), o texto da imagem entra no prompt do gpt-4.1-mini.

## ✅ Checkpoint Parte 3

- [ ] Vision service ativo
- [ ] `VISION_ENDPOINT` e `VISION_KEY` anotados
- [ ] Smoke test OCR retornou texto reconhecível em uma imagem teste

➡️ **Próximo:** [Parte 4 — AI Translator](./parte-04.md)
