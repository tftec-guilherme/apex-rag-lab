# snippets/eval_rag.py — extracted from docs/00-guia-completo.md (Lab Intermediário D06)
# Wave 4 architecture · version-anchor: Q2-2026
# Companion: https://github.com/tftec-guilherme/apex-rag-lab

# eval_rag.py
import os, json, time, requests

FUNC_URL = os.environ.get("FUNC_URL", "https://func-helpsphere-rag-{rand}.azurewebsites.net")
FUNC_KEY = os.environ["FUNC_KEY"]

if "{rand}" in FUNC_URL:
    raise RuntimeError(
        "FUNC_URL ainda contem placeholder '{rand}' — defina a env var FUNC_URL com o nome real do Function App "
        "(ex: export FUNC_URL='https://func-helpsphere-rag-abc123.azurewebsites.net')"
    )


def evaluate_query(query: str, expected_sources: list[str], idx: int = 0) -> dict:
    # ticket_id 'eval-batch-{idx}' isola telemetria de eval real do Function App.
    # function_app.py usa ticket_id apenas como echo/telemetria — qualquer string serve.
    start = time.time()
    response = requests.post(
        f"{FUNC_URL}/api/tickets/eval-batch-{idx}/suggest",
        headers={"x-functions-key": FUNC_KEY, "Content-Type": "application/json"},
        json={"description": query, "attachment_urls": []},
    )
    elapsed_ms = (time.time() - start) * 1000
    data = response.json()

    citations = data.get("citations", [])
    citation_sources = set(c["source"] for c in citations[:5])

    # precision@5: % das top-5 que estão em expected
    overlap = citation_sources.intersection(set(expected_sources))
    precision_at_5 = len(overlap) / 5.0 if citations else 0

    return {
        "query": query,
        "precision_at_5": precision_at_5,
        "latency_ms": elapsed_ms,
        "tokens": data.get("metadata", {}).get("total_tokens", 0),
        "citations": list(citation_sources),
    }

def main():
    with open("eval_dataset.jsonl") as f:
        dataset = [json.loads(l) for l in f]

    results = []
    for idx, item in enumerate(dataset):
        r = evaluate_query(item["query"], item["expected_sources"], idx=idx)
        print(f"  P@5={r['precision_at_5']:.2f}  latency={r['latency_ms']:.0f}ms  tokens={r['tokens']}")
        results.append(r)

    avg_precision = sum(r["precision_at_5"] for r in results) / len(results)
    p95_latency = sorted(r["latency_ms"] for r in results)[int(0.95 * len(results))]
    avg_tokens = sum(r["tokens"] for r in results) / len(results)
    avg_cost_brl = avg_tokens * (0.20 / 1_000_000) * 5  # estimativa rough

    print(f"\n=== RESULTADOS ===")
    print(f"Precision@5 médio: {avg_precision:.3f}")
    print(f"Latency p95:       {p95_latency:.0f}ms")
    print(f"Tokens médio:      {avg_tokens:.0f}")
    print(f"Custo médio:       R$ {avg_cost_brl:.4f}/consulta")

    with open("eval_results.json", "w") as f:
        json.dump({
            "summary": {
                "precision_at_5": avg_precision,
                "p95_latency_ms": p95_latency,
                "avg_tokens": avg_tokens,
                "avg_cost_brl": avg_cost_brl,
            },
            "details": results,
        }, f, indent=2, ensure_ascii=False)

if __name__ == "__main__":
    main()
