# snippets/index_pdfs.py — extracted from docs/00-guia-completo.md (Lab Intermediário D06)
# Wave 4 architecture · version-anchor: Q2-2026
# Companion: https://github.com/tftec-guilherme/apex-rag-lab

# index_pdfs.py
"""
Lê PDFs de Storage Blob, processa com Document Intelligence,
faz chunking layout-aware (512 tokens, overlap 64), e escreve
JSON estruturado em container 'processed/'.
"""
import os, json, hashlib
from azure.storage.blob import BlobServiceClient
from azure.ai.documentintelligence import DocumentIntelligenceClient
from azure.core.credentials import AzureKeyCredential

# Configuração via env vars
STORAGE_CONN = os.environ["STORAGE_CONNECTION_STRING"]
DI_ENDPOINT = os.environ["DI_ENDPOINT"]
DI_KEY = os.environ["DI_KEY"]

# Clients
blob_service = BlobServiceClient.from_connection_string(STORAGE_CONN)
di_client = DocumentIntelligenceClient(
    endpoint=DI_ENDPOINT,
    credential=AzureKeyCredential(DI_KEY)
)

CHUNK_SIZE = 512  # tokens approx (rough: 1 token ≈ 4 chars)
CHUNK_OVERLAP = 64
CHARS_PER_TOKEN = 4

def chunk_text(text: str, source_metadata: dict) -> list[dict]:
    """Recursive chunking respeitando paragraph boundaries."""
    target_chars = CHUNK_SIZE * CHARS_PER_TOKEN
    overlap_chars = CHUNK_OVERLAP * CHARS_PER_TOKEN

    chunks = []
    paragraphs = text.split("\n\n")
    current = ""

    for para in paragraphs:
        if len(current) + len(para) < target_chars:
            current += para + "\n\n"
        else:
            if current:
                chunks.append(current.strip())
            current = para + "\n\n"

    if current:
        chunks.append(current.strip())

    # Aplicar overlap
    overlapped = []
    for i, chunk in enumerate(chunks):
        if i == 0:
            overlapped.append(chunk)
        else:
            prev_tail = chunks[i-1][-overlap_chars:]
            overlapped.append(prev_tail + " " + chunk)

    # Construir objetos com metadata
    return [
        {
            "id": hashlib.md5(f"{source_metadata['source']}_{i}".encode()).hexdigest(),
            "content": c,
            "source": source_metadata["source"],
            "category": source_metadata["category"],
            "page_count": source_metadata["page_count"],
            "chunk_index": i,
        }
        for i, c in enumerate(overlapped)
    ]

def process_pdf(blob_name: str):
    """Processa 1 PDF: download → DI → chunk → upload JSON."""
    print(f"[+] Processing {blob_name}...")

    # Download blob
    blob_client = blob_service.get_blob_client(container="kbai", blob=blob_name)
    pdf_bytes = blob_client.download_blob().readall()

    # Document Intelligence
    poller = di_client.begin_analyze_document(
        "prebuilt-layout",
        body=pdf_bytes,
        content_type="application/pdf"
    )
    result = poller.result()

    # Extrair texto + tabelas como markdown
    full_text = result.content  # Document Intelligence v2024+ retorna markdown
    page_count = len(result.pages)

    # Inferir categoria pelo prefixo do filename
    category = "outros"
    if blob_name.startswith("manual_"): category = "manuais"
    elif blob_name.startswith("runbook_"): category = "runbooks"
    elif blob_name.startswith("faq_"): category = "faq"
    elif blob_name.startswith("politica_"): category = "politicas"

    # Chunking
    chunks = chunk_text(full_text, {
        "source": blob_name,
        "category": category,
        "page_count": page_count,
    })

    # Upload JSON em processed/
    output_name = blob_name.replace(".pdf", ".chunks.json")
    output_blob = blob_service.get_blob_client(container="processed", blob=output_name)
    output_blob.upload_blob(
        json.dumps(chunks, ensure_ascii=False, indent=2).encode("utf-8"),
        overwrite=True
    )

    print(f"    {len(chunks)} chunks gerados → processed/{output_name}")
    return len(chunks)

def main():
    container_client = blob_service.get_container_client("kbai")
    pdfs = [b.name for b in container_client.list_blobs() if b.name.endswith(".pdf")]
    print(f"[i] {len(pdfs)} PDFs encontrados")

    total_chunks = 0
    for pdf in pdfs:
        total_chunks += process_pdf(pdf)

    print(f"\n[+] Total de chunks gerados: {total_chunks}")
    print("[+] Próximo passo: rodar index_to_search.py")

if __name__ == "__main__":
    main()
