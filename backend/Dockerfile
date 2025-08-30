FROM python:3.11-slim

# Set workdir inside container
WORKDIR /app

# Install system deps (for psycopg2 / Postgres)
RUN apt-get update && apt-get install -y \
    gcc libpq-dev && \
    rm -rf /var/lib/apt/lists/*

# Copy requirement files first for caching
COPY requirements.txt .

# Install python deps
RUN pip install --no-cache-dir -r requirements.txt

# Copy the backend source code
COPY . .

# Set PYTHONPATH so "backend" package is found
ENV PYTHONPATH=/app

# Run FastAPI with uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
