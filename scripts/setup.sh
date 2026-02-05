#!/bin/bash

echo "=========================================="
echo "  OpenHouse ICC Chatbot - Setup Script"
echo "=========================================="
echo

echo "[1/3] Verificando que Ollama este instalado..."
if ! command -v ollama &> /dev/null; then
    echo "ERROR: Ollama no esta instalado."
    echo "Por favor descarga e instala Ollama desde: https://ollama.ai"
    exit 1
fi
echo "OK - Ollama encontrado"

echo
echo "[2/3] Descargando modelo llama3.1:8b..."
ollama pull llama3.1:8b
if [ $? -ne 0 ]; then
    echo "ERROR: No se pudo descargar el modelo."
    exit 1
fi
echo "OK - Modelo descargado"

echo
echo "[3/3] Verificando Docker..."
if ! command -v docker &> /dev/null; then
    echo "ERROR: Docker no esta instalado."
    echo "Por favor descarga e instala Docker Desktop desde: https://docker.com"
    exit 1
fi
echo "OK - Docker encontrado"

echo
echo "=========================================="
echo "  Setup completado exitosamente!"
echo "=========================================="
echo
echo "Para iniciar el chatbot:"
echo "  1. Abre una terminal y ejecuta: ollama serve"
echo "  2. En otra terminal ejecuta: docker compose up --build"
echo "  3. Abre http://localhost:8000 en tu navegador"
echo
