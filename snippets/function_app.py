# snippets/function_app.py — extracted from docs/00-guia-completo.md (Lab Intermediário D06)
# Wave 4 architecture · version-anchor: Q2-2026
# Companion: https://github.com/tftec-guilherme/apex-rag-lab

"""
Endpoint /api/tickets/{ticket_id}/suggest

Recebe ticket data, opcionalmente faz Vision OCR de anexos imagem,
opcionalmente faz Translator se idioma != pt-BR, executa RAG
hybrid search, gera resposta via gpt-4.1-mini, retorna JSON.
"""
import os, json, time, logging
import azure.functions as func
from azure.core.credentials import AzureKeyCredential
from azure.search.documents import SearchClient
from azure.search.documents.models import VectorizableTextQuery, QueryType
from openai import AzureOpenAI
import requests

app = func.FunctionApp()

# Init clients
search_client = SearchClient(
    endpoint=os.environ["SEARCH_ENDPOINT"],
    index_name=os.environ["SEARCH_INDEX"],
    credential=AzureKeyCredential(os.environ["SEARCH_ADMIN_KEY"]),
)

aoai = AzureOpenAI(
    api_key=os.environ["AOAI_API_KEY"],
    api_version="2024-10-21",
    azure_endpoint=os.environ["AOAI_ENDPOINT"],
)

def detect_and_translate(text: str, target_lang: str = "pt") -> tuple[str, str]:
    """Returns (translated_text, original_language)."""
    detect_url = f"{os.environ['TRANSLATOR_ENDPOINT']}/detect?api-version=3.0"
    headers = {
        "Ocp-Apim-Subscription-Key": os.environ["TRANSLATOR_KEY"],
        "Ocp-Apim-Subscription-Region": os.environ["TRANSLATOR_REGION"],
        "Content-Type": "application/json",
    }
    r = requests.post(detect_url, headers=headers, json=[{"Text": text}])
    detected = r.json()[0]["language"]

    if detected == target_lang:
        return text, detected

    trans_url = f"{os.environ['TRANSLATOR_ENDPOINT']}/translate?api-version=3.0&from={detected}&to={target_lang}"
    r = requests.post(trans_url, headers=headers, json=[{"Text": text}])
    translated = r.json()[0]["translations"][0]["text"]
    return translated, detected

def vision_ocr(image_url: str) -> str:
    """OCR via Azure AI Vision."""
    url = f"{os.environ['VISION_ENDPOINT']}computervision/imageanalysis:analyze?api-version=2024-02-01&features=read&language=pt"
    headers = {
        "Ocp-Apim-Subscription-Key": os.environ["VISION_KEY"],
        "Content-Type": "application/json",
    }
    r = requests.post(url, headers=headers, json={"url": image_url})
    if r.status_code != 200:
        return ""

    blocks = r.json().get("readResult", {}).get("blocks", [])
    text = "\n".join(line["text"] for block in blocks for line in block.get("lines", []))
    return text

def embed_query(text: str) -> list[float]:
    response = aoai.embeddings.create(
        input=[text],
        model=os.environ["EMBEDDING_DEPLOYMENT"]
    )
    return response.data[0].embedding

def hybrid_search(query: str, top: int = 5) -> list[dict]:
    """Hybrid search com vector + BM25 + semantic ranker."""
    query_vector = embed_query(query)

    results = search_client.search(
        search_text=query,
        vector_queries=[
            VectorizableTextQuery(
                text=query,
                k_nearest_neighbors=20,
                fields="content_vector",
            )
        ],
        query_type=QueryType.SEMANTIC,
        semantic_configuration_name="default-semantic",
        top=top,
        select=["id", "content", "source", "category", "chunk_index"],
    )

    chunks = []
    for r in results:
        chunks.append({
            "id": r["id"],
            "content": r["content"],
            "source": r["source"],
            "category": r["category"],
            "chunk_index": r["chunk_index"],
            "score": r["@search.score"],
            "rerank_score": r.get("@search.reranker_score", 0),
        })
    return chunks

def build_prompt(query: str, chunks: list[dict]) -> str:
    """Constrói augmented prompt com chunks recuperados."""
    chunks_text = "\n\n".join(
        f"[{i+1}] Fonte: {c['source']}, chunk {c['chunk_index']}\n\"{c['content']}\""
        for i, c in enumerate(chunks)
    )
    return f"""DOCUMENTS:
{chunks_text}

USER QUESTION:
{query}"""

SYSTEM_PROMPT = """Você é o assistente do tier 1 do HelpSphere da Apex Group.
Responda em pt-BR (a menos que o usuário escreva em outro idioma).
Use APENAS o conteúdo dos documentos abaixo. Se a resposta não estiver
nos documentos, diga "Não encontrei essa informação na base de conhecimento.
Sugiro escalar para tier 2."
Sempre cite a fonte: [Fonte X, chunk Y]."""

@app.route(route="tickets/{ticket_id}/suggest", methods=["POST"])
def suggest(req: func.HttpRequest) -> func.HttpResponse:
    start_time = time.time()

    try:
        ticket_id = req.route_params.get("ticket_id")
        body = req.get_json()

        # Inputs do ticket
        description = body.get("description", "")
        attachment_urls = body.get("attachment_urls", [])

        # === Pré-processamento ===

        # OCR de anexos imagem
        ocr_texts = []
        for url in attachment_urls:
            if url.lower().endswith((".png", ".jpg", ".jpeg", ".gif")):
                ocr_text = vision_ocr(url)
                if ocr_text:
                    ocr_texts.append(ocr_text)

        # Concatenar description + OCR
        combined_input = description
        if ocr_texts:
            combined_input += "\n\n[Texto extraído de screenshots]\n" + "\n---\n".join(ocr_texts)

        # Detect + translate se necessário
        translated_input, original_lang = detect_and_translate(combined_input, target_lang="pt")

        # === RAG ===

        chunks = hybrid_search(translated_input, top=5)

        # Calcular confidence baseado em retrieval
        avg_rerank_score = sum(c["rerank_score"] for c in chunks) / len(chunks) if chunks else 0
        retrieval_confidence = min(avg_rerank_score / 4.0, 1.0)  # rerank scores tipicamente 0-4

        # === Geração ===

        user_prompt = build_prompt(translated_input, chunks)
        chat_response = aoai.chat.completions.create(
            model=os.environ["CHAT_DEPLOYMENT"],
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_prompt},
            ],
            temperature=0.1,
            max_tokens=600,
        )
        answer_pt = chat_response.choices[0].message.content
        usage = chat_response.usage

        # Translate back se idioma original != pt
        final_answer = answer_pt
        if original_lang != "pt":
            final_answer, _ = detect_and_translate(answer_pt, target_lang=original_lang)

        # === Resposta ===

        elapsed_ms = int((time.time() - start_time) * 1000)
        response = {
            "ticket_id": ticket_id,
            "suggested_response": final_answer,
            "language": original_lang,
            "citations": [
                {"source": c["source"], "chunk_index": c["chunk_index"], "score": c["rerank_score"]}
                for c in chunks
            ],
            "confidence": round(retrieval_confidence, 2),
            "metadata": {
                "latency_ms": elapsed_ms,
                "prompt_tokens": usage.prompt_tokens,
                "completion_tokens": usage.completion_tokens,
                "total_tokens": usage.total_tokens,
                "ocr_used": len(ocr_texts) > 0,
                "translation_used": original_lang != "pt",
            }
        }

        # Telemetry
        logging.info(json.dumps({
            "event": "suggestion_generated",
            "ticket_id": ticket_id,
            "confidence": retrieval_confidence,
            "latency_ms": elapsed_ms,
            "prompt_tokens": usage.prompt_tokens,
            "completion_tokens": usage.completion_tokens,
        }))

        return func.HttpResponse(
            body=json.dumps(response, ensure_ascii=False),
            status_code=200,
            mimetype="application/json",
        )

    except Exception as e:
        logging.error(f"Error: {e}", exc_info=True)
        return func.HttpResponse(
            body=json.dumps({"error": str(e)}),
            status_code=500,
            mimetype="application/json",
        )
