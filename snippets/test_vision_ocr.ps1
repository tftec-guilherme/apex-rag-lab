# snippets/test_vision_ocr.ps1 — versao PowerShell de test_vision_ocr.sh (Lab Intermediario D06)
# Wave 4 architecture · version-anchor: Q2-2026
# Companion: https://github.com/tftec-guilherme/apex-rag-lab
# Use: defina $env:VISION_KEY antes de rodar; sample-screenshot.png deve estar no diretorio atual.

$VisionKey = $env:VISION_KEY
if ([string]::IsNullOrEmpty($VisionKey)) {
    Write-Error "Defina `$env:VISION_KEY antes de rodar (Get-AzCognitiveServicesAccountKey ou portal)."
    exit 1
}

$Uri = "https://vis-helpsphere-rag.cognitiveservices.azure.com/computervision/imageanalysis:analyze?api-version=2024-02-01&features=read&language=pt"

Invoke-RestMethod `
    -Uri $Uri `
    -Method Post `
    -Headers @{
        "Ocp-Apim-Subscription-Key" = $VisionKey
        "Content-Type"              = "application/octet-stream"
    } `
    -InFile "sample-screenshot.png"
