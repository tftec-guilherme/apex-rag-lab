# snippets/index_to_search.py — extracted from docs/00-guia-completo.md (Lab Intermediário D06)
# Wave 4 architecture · version-anchor: Q2-2026
# Companion: https://github.com/tftec-guilherme/apex-rag-lab

# index_to_search.py
"""
Lê chunks JSON de processed/, gera embeddings via Azure OpenAI,
e indexa no Azure AI Search.
"""
import os, json
from azure.storage.blob import BlobServiceClient
from azure.core.credentials import AzureKeyCredential
from azure.search.documents import SearchClient
from openai import AzureOpenAI

# Config
STORAGE_CONN = os.environ["STORAGE_CONNECTION_STRING"]
SEARCH_ENDPOINT = os.environ["SEARCH_ENDPOINT"]
SEARCH_ADMIN_KEY = os.environ["SEARCH_ADMIN_KEY"]
AOAI_ENDPOINT = os.environ["AOAI_ENDPOINT"]
AOAI_KEY = os.environ["AOAI_API_KEY"]

INDEX_NAME = "helpsphere-kb"

# Clients
blob_service = BlobServiceClient.from_connection_string(STORAGE_CONN)
search_client = SearchClient(
    endpoint=SEARCH_ENDPOINT,
    index_name=INDEX_NAME,
    credential=AzureKeyCredential(SEARCH_ADMIN_KEY)
)
aoai = AzureOpenAI(
    api_key=AOAI_KEY,
    api_version="2024-10-21",
    azure_endpoint=AOAI_ENDPOINT,
)

# text-embedding-3-large aceita no máximo 8192 tokens por input. Chunks gerados
# pelo Document Intelligence (prebuilt-layout, 6000 chars overlap 200) podem
# ultrapassar quando o PDF tem páginas densas. Truncamos a ~28000 chars (~7000
# tokens com margem de segurança) antes de chamar o endpoint para evitar
# BadRequest 400. Em produção, usar tiktoken para contagem exata de tokens.
MAX_EMBED_CHARS = 28000

def embed_batch(texts: list[str]) -> list[list[float]]:
    """Gera embeddings em batch (Azure OpenAI suporta até 16 inputs).
    Trunca cada texto a MAX_EMBED_CHARS (~7000 tokens) — text-embedding-3-large
    aceita max 8192 tokens; chunks grandes do DI podem ultrapassar."""
    truncated = [t[:MAX_EMBED_CHARS] for t in texts]
    response = aoai.embeddings.create(
        input=truncated,
        model="text-embedding-3-large"
    )
    return [item.embedding for item in response.data]

def main():
    container = blob_service.get_container_client("processed")
    json_blobs = [b.name for b in container.list_blobs() if b.name.endswith(".chunks.json")]
    print(f"[i] {len(json_blobs)} arquivos de chunks encontrados")

    docs_to_index = []

    for blob_name in json_blobs:
        print(f"[+] Processando {blob_name}...")
        blob = container.get_blob_client(blob_name)
        chunks = json.loads(blob.download_blob().readall())

        # Gerar embeddings em batches de 16
        batch_size = 16
        for i in range(0, len(chunks), batch_size):
            batch = chunks[i:i+batch_size]
            texts = [c["content"] for c in batch]
            embeddings = embed_batch(texts)

            for chunk, emb in zip(batch, embeddings):
                docs_to_index.append({
                    "id": chunk["id"],
                    "content": chunk["content"],
                    "source": chunk["source"],
                    "category": chunk["category"],
                    "page_count": chunk["page_count"],
                    "chunk_index": chunk["chunk_index"],
                    "content_vector": emb,
                })

        print(f"    {len(chunks)} chunks embedados")

    # Upload em batches para Search
    print(f"\n[+] Uploading {len(docs_to_index)} docs para Search...")
    batch_size = 50
    for i in range(0, len(docs_to_index), batch_size):
        batch = docs_to_index[i:i+batch_size]
        result = search_client.upload_documents(documents=batch)
        success = sum(1 for r in result if r.succeeded)
        print(f"    Batch {i//batch_size + 1}: {success}/{len(batch)} indexados")

    print(f"\n[+] Total indexado: {len(docs_to_index)} chunks")

if __name__ == "__main__":
    main()
