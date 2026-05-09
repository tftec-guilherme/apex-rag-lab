# snippets/test_translator.ps1 — versao PowerShell de test_translator.sh (Lab Intermediario D06)
# Wave 4 architecture · version-anchor: Q2-2026
# Companion: https://github.com/tftec-guilherme/apex-rag-lab
# Use: defina $env:TRANSLATOR_KEY antes de rodar.

$TranslatorKey = $env:TRANSLATOR_KEY
if ([string]::IsNullOrEmpty($TranslatorKey)) {
    Write-Error "Defina `$env:TRANSLATOR_KEY antes de rodar."
    exit 1
}

$Region = "eastus2"
$Headers = @{
    "Ocp-Apim-Subscription-Key"    = $TranslatorKey
    "Ocp-Apim-Subscription-Region" = $Region
    "Content-Type"                 = "application/json"
}

$Body = ConvertTo-Json @(@{ Text = "Hola, no puedo acceder al sistema POS de la tienda." }) -Compress

# Detect language
Write-Host "=== Detect language ===" -ForegroundColor Cyan
Invoke-RestMethod `
    -Uri "https://api.cognitive.microsofttranslator.com/detect?api-version=3.0" `
    -Method Post `
    -Headers $Headers `
    -Body $Body

# Translate es -> pt
Write-Host "`n=== Translate es -> pt ===" -ForegroundColor Cyan
Invoke-RestMethod `
    -Uri "https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&from=es&to=pt" `
    -Method Post `
    -Headers $Headers `
    -Body $Body
