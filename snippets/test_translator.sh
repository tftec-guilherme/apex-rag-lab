# snippets/test_translator.sh — extracted from docs/00-guia-completo.md (Lab Intermediário D06)
# Wave 4 architecture · version-anchor: Q2-2026
# Companion: https://github.com/tftec-guilherme/apex-rag-lab

# Detect language
curl -X POST "https://api.cognitive.microsofttranslator.com/detect?api-version=3.0" \
  -H "Ocp-Apim-Subscription-Key: $TRANSLATOR_KEY" \
  -H "Ocp-Apim-Subscription-Region: eastus2" \
  -H "Content-Type: application/json" \
  -d '[{"Text":"Hola, no puedo acceder al sistema POS de la tienda."}]'

# Translate es -> pt
curl -X POST "https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&from=es&to=pt" \
  -H "Ocp-Apim-Subscription-Key: $TRANSLATOR_KEY" \
  -H "Ocp-Apim-Subscription-Region: eastus2" \
  -H "Content-Type: application/json" \
  -d '[{"Text":"Hola, no puedo acceder al sistema POS de la tienda."}]'
