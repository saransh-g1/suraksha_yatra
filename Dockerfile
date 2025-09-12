# Root Dockerfile to deploy trip_chat_service on Railway

FROM python:3.11-slim
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1
WORKDIR /app

# Install build deps only if needed by libs
RUN apt-get update && apt-get install -y --no-install-recommends build-essential \
  && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY trip_chat_service/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy service code
COPY trip_chat_service/ .

# Runtime
ENV PORT=8000
EXPOSE 8000
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}"]
