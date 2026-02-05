@echo off
echo ==========================================
echo   OpenHouse ICC Chatbot - Setup Script
echo ==========================================
echo.

echo [1/3] Verificando que Ollama este instalado...
where ollama >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo ERROR: Ollama no esta instalado.
    echo Por favor descarga e instala Ollama desde: https://ollama.ai
    pause
    exit /b 1
)
echo OK - Ollama encontrado

echo.
echo [2/3] Descargando modelo llama3.1:8b...
ollama pull llama3.1:8b
if %ERRORLEVEL% neq 0 (
    echo ERROR: No se pudo descargar el modelo.
    pause
    exit /b 1
)
echo OK - Modelo descargado

echo.
echo [3/3] Verificando Docker...
where docker >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo ERROR: Docker no esta instalado.
    echo Por favor descarga e instala Docker Desktop desde: https://docker.com
    pause
    exit /b 1
)
echo OK - Docker encontrado

echo.
echo ==========================================
echo   Setup completado exitosamente!
echo ==========================================
echo.
echo Para iniciar el chatbot:
echo   1. Abre una terminal y ejecuta: ollama serve
echo   2. En otra terminal ejecuta: docker compose up --build
echo   3. Abre http://localhost:8000 en tu navegador
echo.
pause
