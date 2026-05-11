#!/usr/bin/env bash
# Build all 8 Apex sample-kb PDFs from source.md via pandoc + Edge headless
# Usage: bash build-pdfs.sh

set -euo pipefail

EDGE="/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"
CSS="$(pwd)/pdf-style.css"
SRC_DIR="$(pwd)/source"
OUT_DIR="$(pwd)"
TMP_DIR="/tmp/apex-pdf-build"

mkdir -p "$TMP_DIR"

declare -A TITLES=(
  ["01-faq_horario_atendimento"]="FAQ Horários de Atendimento — Apex Group · Q2-2026"
  ["02-politica_reembolso_lojista"]="Política de Reembolso a Lojistas — Apex Group · Q2-2026"
  ["03-faq_pedidos_devolucao"]="FAQ Pedidos e Devoluções — Apex Group · Q2-2026"
  ["04-politica_dados_lgpd"]="Política de Proteção de Dados (LGPD) — Apex Group · Q2-2026"
  ["05-runbook_sap_fi_integracao"]="Runbook SAP FI · Integração — Apex Group · Q2-2026"
  ["06-manual_operacao_loja_v3"]="Manual de Operação de Loja v3 — Apex Group · Q2-2026"
  ["07-manual_pos_funcionamento"]="Manual POS — Funcionamento e Troubleshooting — Apex Group · Q2-2026"
  ["08-runbook_problemas_rede"]="Runbook Problemas de Rede — Apex Group · Q2-2026"
)

# Generate PDFs in order
for key in "01-faq_horario_atendimento" \
           "02-politica_reembolso_lojista" \
           "03-faq_pedidos_devolucao" \
           "04-politica_dados_lgpd" \
           "05-runbook_sap_fi_integracao" \
           "06-manual_operacao_loja_v3" \
           "07-manual_pos_funcionamento" \
           "08-runbook_problemas_rede"; do
  src="$SRC_DIR/${key}.source.md"
  html="$TMP_DIR/${key}.html"
  # Strip leading "NN-" prefix from output PDF name
  pdf_name="$(echo "$key" | sed 's/^[0-9]*-//')"
  pdf="$OUT_DIR/${pdf_name}.pdf"
  title="${TITLES[$key]}"

  if [[ ! -f "$src" ]]; then
    echo "[SKIP] $src not found"
    continue
  fi

  echo "[BUILD] $key ..."
  pandoc "$src" \
    -s \
    --embed-resources \
    --metadata title="$title" \
    -c "$CSS" \
    -o "$html"

  html_uri="$(cygpath -m "$html")"
  pdf_uri="$(cygpath -m "$pdf")"

  "$EDGE" --headless --disable-gpu --no-pdf-header-footer \
    --print-to-pdf="$pdf_uri" "file:///$html_uri" 2>/dev/null

  size="$(du -h "$pdf" 2>/dev/null | cut -f1 || echo '?')"
  echo "    -> $pdf ($size)"
done

echo ""
echo "=== Final PDFs ==="
ls -lh "$OUT_DIR"/*.pdf | awk '{print $5, $NF}'
