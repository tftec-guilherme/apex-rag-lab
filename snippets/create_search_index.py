# snippets/create_search_index.py — extracted from docs/00-guia-completo.md (Lab Intermediário D06)
# Wave 4 architecture · version-anchor: Q2-2026
# Companion: https://github.com/tftec-guilherme/apex-rag-lab

# create_search_index.py
"""
Cria index 'helpsphere-kb' com:
- BM25 fields: content, source, category
- Vector field: content_vector (3072 dim, HNSW)
- Semantic configuration ativada
"""
import os
from azure.core.credentials import AzureKeyCredential
from azure.search.documents.indexes import SearchIndexClient
from azure.search.documents.indexes.models import (
    SearchIndex, SearchField, SearchFieldDataType,
    VectorSearch, VectorSearchAlgorithmConfiguration,
    HnswAlgorithmConfiguration, VectorSearchProfile,
    SemanticConfiguration, SemanticPrioritizedFields,
    SemanticField, SemanticSearch
)

SEARCH_ENDPOINT = os.environ["SEARCH_ENDPOINT"]
SEARCH_ADMIN_KEY = os.environ["SEARCH_ADMIN_KEY"]

client = SearchIndexClient(
    endpoint=SEARCH_ENDPOINT,
    credential=AzureKeyCredential(SEARCH_ADMIN_KEY)
)

INDEX_NAME = "helpsphere-kb"

fields = [
    SearchField(
        name="id",
        type=SearchFieldDataType.String,
        key=True,
        filterable=True,
    ),
    SearchField(
        name="content",
        type=SearchFieldDataType.String,
        searchable=True,
        analyzer_name="pt-BR.microsoft",  # analyzer pt-BR
    ),
    SearchField(
        name="source",
        type=SearchFieldDataType.String,
        filterable=True,
        facetable=True,
    ),
    SearchField(
        name="category",
        type=SearchFieldDataType.String,
        filterable=True,
        facetable=True,
    ),
    SearchField(
        name="page_count",
        type=SearchFieldDataType.Int32,
        filterable=True,
    ),
    SearchField(
        name="chunk_index",
        type=SearchFieldDataType.Int32,
        filterable=True,
    ),
    SearchField(
        name="content_vector",
        type=SearchFieldDataType.Collection(SearchFieldDataType.Single),
        searchable=True,
        vector_search_dimensions=3072,
        vector_search_profile_name="hnsw-profile",
    ),
]

vector_search = VectorSearch(
    algorithms=[
        HnswAlgorithmConfiguration(
            name="hnsw-config",
            parameters={"m": 4, "efConstruction": 400, "metric": "cosine"}
        )
    ],
    profiles=[
        VectorSearchProfile(
            name="hnsw-profile",
            algorithm_configuration_name="hnsw-config"
        )
    ]
)

semantic_config = SemanticConfiguration(
    name="default-semantic",
    prioritized_fields=SemanticPrioritizedFields(
        title_field=SemanticField(field_name="source"),
        content_fields=[SemanticField(field_name="content")],
        keywords_fields=[SemanticField(field_name="category")]
    )
)

semantic_search = SemanticSearch(configurations=[semantic_config])

index = SearchIndex(
    name=INDEX_NAME,
    fields=fields,
    vector_search=vector_search,
    semantic_search=semantic_search,
)

# Drop se existe
try:
    client.delete_index(INDEX_NAME)
    print(f"[i] Index existente '{INDEX_NAME}' deletado")
except:
    pass

client.create_index(index)
print(f"[+] Index '{INDEX_NAME}' criado com vector + semantic ranker")
