# snippets/test_vision_ocr.sh — extracted from docs/00-guia-completo.md (Lab Intermediário D06)
# Wave 4 architecture · version-anchor: Q2-2026
# Companion: https://github.com/tftec-guilherme/apex-rag-lab

VISION_KEY="<sua-key>"

curl -X POST "https://vis-helpsphere-rag.cognitiveservices.azure.com/computervision/imageanalysis:analyze?api-version=2024-02-01&features=read&language=pt" \
  -H "Ocp-Apim-Subscription-Key: $VISION_KEY" \
  -H "Content-Type: application/octet-stream" \
  --data-binary @sample-screenshot.png
