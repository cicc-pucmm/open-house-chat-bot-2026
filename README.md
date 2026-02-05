# 🎓 OpenHouse ICC Chatbot

<div align="center">

![PUCMM](https://img.shields.io/badge/PUCMM-Open%20House%202026-blue?style=for-the-badge)
![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Ollama](https://img.shields.io/badge/Ollama-LLM-black?style=for-the-badge)

**Asistente virtual inteligente para el Open House de Ingeniería en Ciencias de la Computación**

*Pontificia Universidad Católica Madre y Maestra • Santiago, República Dominicana*

[Características](#-características) •
[Instalación](#-instalación) •
[Uso](#-uso) •
[Configuración](#%EF%B8%8F-configuración)

</div>

---

## 📋 Descripción

Chatbot interactivo diseñado para asistir a los visitantes del Open House de la carrera de Ingeniería en Ciencias de la Computación (ICC) de la PUCMM. Proporciona información en tiempo real sobre la carrera, pensum, perfil del egresado y más.

### 🎯 Evento
- **Fechas:** Miércoles 11 y Jueves 12 de Febrero de 2026
- **Horario:** 8:00 AM - 12:00 PM
- **Ubicación:** Campus PUCMM Santiago

---

## ✨ Características

- 🤖 **IA Conversacional** — Respuestas naturales powered by Llama 3.1
- ⚡ **Streaming en tiempo real** — Respuestas que aparecen palabra por palabra
- 🎨 **Interfaz moderna** — Diseño con glassmorphism y animaciones fluidas
- 🌓 **Tema claro/oscuro** — Toggle suave entre temas
- 📱 **Responsive** — Adaptado para desktop, tablet y móvil
- 🖱️ **Efectos interactivos** — Spotlight, parallax y ripple effects
- 🚀 **Fácil despliegue** — Contenedor Docker listo para producción

---

## 🏗️ Arquitectura

```
┌─────────────┐         ┌─────────────────┐         ┌─────────────┐
│   Browser   │  HTTP   │    FastAPI      │  HTTP   │   Ollama    │
│  (Frontend) │ ◄─────► │   (Docker)      │ ◄─────► │   (Host)    │
│   :8000     │   SSE   │    :8000        │         │   :11434    │
└─────────────┘         └─────────────────┘         └─────────────┘
```

| Componente | Tecnología | Descripción |
|------------|------------|-------------|
| **Frontend** | HTML + TailwindCSS + JS | Interfaz de usuario moderna |
| **Backend** | FastAPI + Uvicorn | API con streaming SSE |
| **LLM** | Ollama + Llama 3.1:8b | Modelo de lenguaje local |
| **Contenedor** | Docker + Docker Compose | Despliegue simplificado |

---

## 📦 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

| Software | Versión Mínima | Descarga |
|----------|----------------|----------|
| **Docker Desktop** | 4.0+ | [docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop) |
| **Ollama** | 0.1+ | [ollama.ai](https://ollama.ai) |

### Verificar instalación

```bash
# Verificar Docker
docker --version

# Verificar Ollama
ollama --version
```

---

## 🚀 Instalación

### macOS (Principal)

#### 1. Instalar Homebrew (si no lo tienes)
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

#### 2. Instalar dependencias
```bash
# Instalar Docker Desktop
brew install --cask docker

# Instalar Ollama
brew install ollama
```

#### 3. Descargar el modelo de IA
```bash
ollama pull llama3.1:8b
```

#### 4. Clonar y ejecutar
```bash
# Clonar el repositorio
git clone <repository-url>
cd OpenHouseV2

# Iniciar Ollama (en una terminal)
ollama serve

# Iniciar el chatbot (en otra terminal)
docker compose up --build
```

#### 5. Abrir en el navegador
```
http://localhost:8000
```

---

### 🐧 Linux (Ubuntu/Debian)

#### 1. Instalar Docker
```bash
# Actualizar paquetes
sudo apt update

# Instalar dependencias
sudo apt install -y ca-certificates curl gnupg

# Agregar clave GPG de Docker
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

# Agregar repositorio
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Instalar Docker
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Agregar usuario al grupo docker (evita usar sudo)
sudo usermod -aG docker $USER
newgrp docker
```

#### 2. Instalar Ollama
```bash
curl -fsSL https://ollama.ai/install.sh | sh
```

#### 3. Descargar el modelo y ejecutar
```bash
# Descargar modelo
ollama pull llama3.1:8b

# Iniciar Ollama (en una terminal)
ollama serve

# Navegar al proyecto e iniciar (en otra terminal)
cd OpenHouseV2
docker compose up --build
```

#### 4. Abrir en el navegador
```
http://localhost:8000
```

---

### 🪟 Windows

#### 1. Instalar Docker Desktop
1. Descargar desde [docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop)
2. Ejecutar el instalador
3. Reiniciar el sistema cuando se solicite
4. Abrir Docker Desktop y esperar a que inicie

#### 2. Instalar Ollama
1. Descargar desde [ollama.ai](https://ollama.ai)
2. Ejecutar el instalador
3. Seguir las instrucciones en pantalla

#### 3. Descargar el modelo (PowerShell o CMD)
```powershell
ollama pull llama3.1:8b
```

#### 4. Ejecutar el proyecto

**Terminal 1 — Iniciar Ollama:**
```powershell
ollama serve
```

**Terminal 2 — Iniciar el chatbot:**
```powershell
cd OpenHouseV2
docker compose up --build
```

#### 5. Abrir en el navegador
```
http://localhost:8000
```

---

## 🎮 Uso

### Inicio Rápido

Una vez instalado, el flujo de uso es simple:

```bash
# Terminal 1: Iniciar Ollama
ollama serve

# Terminal 2: Iniciar Chatbot
cd OpenHouseV2
docker compose up
```

Luego abre **http://localhost:8000** en tu navegador.

### Comandos Útiles

| Comando | Descripción |
|---------|-------------|
| `docker compose up` | Iniciar el chatbot |
| `docker compose up --build` | Reconstruir e iniciar |
| `docker compose down` | Detener el chatbot |
| `docker compose logs -f` | Ver logs en tiempo real |
| `docker compose restart` | Reiniciar el servicio |
| `ollama list` | Ver modelos instalados |
| `ollama ps` | Ver modelos en ejecución |

### Detener el Proyecto

```bash
# Detener el chatbot
docker compose down

# Detener Ollama (Ctrl+C en su terminal o)
pkill ollama
```

---

## ⚙️ Configuración

### Variables de Entorno

El archivo `docker-compose.yml` contiene las configuraciones principales:

```yaml
environment:
  - OLLAMA_URL=http://host.docker.internal:11434
  - OLLAMA_MODEL=llama3.1:8b
```

| Variable | Descripción | Valor por Defecto |
|----------|-------------|-------------------|
| `OLLAMA_URL` | URL del servidor Ollama | `http://host.docker.internal:11434` |
| `OLLAMA_MODEL` | Modelo de IA a utilizar | `llama3.1:8b` |

### Cambiar el Modelo

Para usar un modelo diferente:

```bash
# Descargar nuevo modelo
ollama pull llama3.2:3b

# Editar docker-compose.yml
# Cambiar OLLAMA_MODEL=llama3.2:3b

# Reiniciar
docker compose down && docker compose up
```

### Personalizar el System Prompt

El comportamiento del chatbot se define en:
```
backend/prompts/system_prompt.txt
```

Después de modificarlo, reinicia el contenedor:
```bash
docker compose restart
```

---

## 📁 Estructura del Proyecto

```
OpenHouseV2/
├── 📄 README.md
├── 📄 docker-compose.yml
├── 📄 .env.example
├── 📄 .gitignore
│
├── 📁 backend/
│   ├── 📄 Dockerfile
│   ├── 📄 requirements.txt
│   ├── 📄 main.py              # Servidor FastAPI
│   ├── 📄 config.py            # Configuración
│   └── 📁 prompts/
│       └── 📄 system_prompt.txt # Personalidad del bot
│
├── 📁 frontend/
│   ├── 📄 index.html           # Página principal
│   ├── 📁 css/
│   │   └── 📄 styles.css       # Estilos y temas
│   ├── 📁 js/
│   │   ├── 📄 chat.js          # Lógica del chat
│   │   ├── 📄 theme.js         # Toggle de temas
│   │   └── 📄 mouse-effects.js # Efectos visuales
│   └── 📁 assets/
│       ├── 🖼️ pucmm.png
│       └── 🖼️ logo_cicc.png
│
└── 📁 scripts/
    ├── 📄 setup.bat            # Setup Windows
    └── 📄 setup.sh             # Setup Unix
```

---

## 🔧 Solución de Problemas

### El chatbot no responde

1. **Verificar que Ollama esté corriendo:**
   ```bash
   curl http://localhost:11434/api/tags
   ```

2. **Verificar que el modelo esté descargado:**
   ```bash
   ollama list
   ```

3. **Reiniciar los servicios:**
   ```bash
   # Reiniciar Ollama
   pkill ollama && ollama serve

   # Reiniciar Docker
   docker compose down && docker compose up --build
   ```

### Error de conexión en Docker

En **Linux**, puede que necesites usar la IP del host en lugar de `host.docker.internal`:

```bash
# Obtener IP del host
ip route | grep docker0 | awk '{print $9}'

# Editar docker-compose.yml con esa IP
# OLLAMA_URL=http://172.17.0.1:11434
```

### Puerto 8000 en uso

```bash
# Encontrar el proceso
lsof -i :8000  # macOS/Linux
netstat -ano | findstr :8000  # Windows

# Cambiar puerto en docker-compose.yml
ports:
  - "8080:8000"  # Usar puerto 8080
```

### Modelo muy lento

Prueba con un modelo más pequeño:
```bash
ollama pull llama3.2:3b
# Actualizar OLLAMA_MODEL en docker-compose.yml
```

### Errores de memoria

Si el modelo consume mucha RAM:
```bash
# Usar un modelo más ligero
ollama pull llama3.2:1b

# O aumentar memoria de Docker Desktop:
# Settings → Resources → Memory → 8GB+
```

---

## 🎨 Personalización

### Cambiar colores del tema

Edita `frontend/css/styles.css` y busca las secciones:
- `/* ============ DARK THEME ============ */`
- `/* ============ LIGHT THEME ============ */`

### Modificar efectos del mouse

Edita `frontend/js/mouse-effects.js`:
```javascript
const CONFIG = {
    spotlight: {
        enabled: true,      // Activar/desactivar
        size: 400,          // Tamaño del spotlight
        opacity: 0.08       // Opacidad
    },
    parallax: {
        enabled: true,
        intensity: 0.02     // Intensidad del efecto
    }
};
```

### Agregar más sugerencias

Edita `frontend/index.html` y busca la sección `<!-- Suggestions -->`.

---

## 📝 Licencia

Este proyecto fue desarrollado para el Open House 2026 de la PUCMM.

---

<div align="center">

**Desarrollado con ❤️ para PUCMM**

*Ingeniería en Ciencias de la Computación*

</div>
