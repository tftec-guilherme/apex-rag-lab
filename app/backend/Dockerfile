FROM python:3.13-bookworm

# Install MS ODBC Driver 18 for SQL Server (necessário para aioodbc/pyodbc)
# HelpSphere — Story 06.5a Sessão 2.3
RUN apt-get update \
    && apt-get install -y --no-install-recommends curl gnupg ca-certificates \
    && curl -fsSL https://packages.microsoft.com/keys/microsoft.asc \
       | gpg --dearmor -o /usr/share/keyrings/microsoft-prod.gpg \
    && curl -fsSL https://packages.microsoft.com/config/debian/12/prod.list \
       | tee /etc/apt/sources.list.d/mssql-release.list \
    && apt-get update \
    && ACCEPT_EULA=Y apt-get install -y --no-install-recommends msodbcsql18 unixodbc-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# HelpSphere — Story 06.26: pós-migração, ./static/ vai estar vazia (ou inexistente)
# porque o frontend Vite agora vive em App Service separado (service `frontend` em
# azure.yaml). Mantemos o COPY ./ /app por simplicidade — diff mínimo vs upstream
# Azure-Samples/azure-search-openai-demo, evita merge conflicts. Cleanup completo
# (remover refs a static/ no app Python) virá quando upstream também migrar.
COPY ./ /app

RUN python -m pip install -r requirements.txt

RUN python -m pip install gunicorn

CMD ["python3", "-m", "gunicorn", "-b", "0.0.0.0:8000", "main:app"]
