# 🚀 Guía de Instalación Paso a Paso - TaskFlow

Esta guía te llevará paso a paso desde cero hasta tener TaskFlow funcionando completamente en tu máquina.

---

## 📋 Prerrequisitos

### Verificar instalaciones necesarias

#### 1. Docker y Docker Compose

```bash
# Verificar Docker
docker --version
# Debería mostrar: Docker version 24.0.x o superior

# Verificar Docker Compose
docker-compose --version
# Debería mostrar: Docker Compose version 2.20.x o superior
```

**Si no tienes Docker instalado:**
- **macOS**: Descarga [Docker Desktop para Mac](https://www.docker.com/products/docker-desktop/)
- **Windows**: Descarga [Docker Desktop para Windows](https://www.docker.com/products/docker-desktop/)
- **Linux**: Sigue las [instrucciones oficiales](https://docs.docker.com/engine/install/)

#### 2. Git (para clonar el repositorio)

```bash
git --version
# Debería mostrar: git version 2.x.x
```

---

## 🎯 Método 1: Ejecución con Docker Compose (Recomendado)

Este método es el más simple y levanta toda la infraestructura con un solo comando.

### Paso 1: Clonar el repositorio

```bash
# Clona el repositorio
git clone <url-del-repositorio>

# Entra al directorio del proyecto
cd TimeFor
```

### Paso 2: Verificar la estructura del proyecto

```bash
# Lista los archivos principales
ls -la

# Deberías ver:
# - backend/
# - frontend/
# - docker-compose.yml
# - README.md
# - SETUP.md
```

### Paso 3: Construir y levantar los servicios

```bash
# Construir las imágenes y levantar todos los servicios
docker-compose up --build
```

**¿Qué está pasando?**
1. Docker descarga la imagen de MongoDB (primera vez puede tardar)
2. Docker construye la imagen del backend Python
3. Docker construye la imagen del frontend Angular
4. Docker inicia los 3 servicios en orden:
   - MongoDB (puerto 27017)
   - Backend (puerto 8000)
   - Frontend (puerto 80)

### Paso 4: Esperar a que los servicios estén listos

En la terminal verás logs de los 3 servicios. Espera a ver estos mensajes:

```
taskflow-mongodb    | ... MongoDB init process complete ...
taskflow-backend    | ... Uvicorn running on http://0.0.0.0:8000 ...
taskflow-frontend   | ... nginx started ...
```

### Paso 5: Abrir la aplicación

Abre tu navegador y visita:

**🌐 Frontend**: http://localhost

**🔧 Backend GraphQL Playground**: http://localhost:8000/graphql

### Paso 6: Probar la aplicación

1. Haz clic en "Nueva tarea"
2. Rellena el formulario:
   - Título: "Mi primera tarea"
   - Descripción: "Probar TaskFlow"
   - Prioridad: Media
3. Haz clic en "Crear tarea"
4. ¡Deberías ver tu tarea aparecer!

### Paso 7: Detener los servicios

Cuando termines, presiona `Ctrl + C` en la terminal donde corre docker-compose.

Para detener y eliminar los contenedores:

```bash
docker-compose down
```

Para eliminar también los datos de la base de datos:

```bash
docker-compose down -v
```

---

## 🛠 Método 2: Ejecución Local (Desarrollo)

Este método es útil si quieres modificar el código y ver los cambios en tiempo real.

### Requisitos adicionales

- **Node.js 20+**: [Descargar Node.js](https://nodejs.org/)
- **Python 3.11+**: [Descargar Python](https://www.python.org/downloads/)

### Parte A: Levantar MongoDB con Docker

```bash
# Iniciar solo MongoDB
docker run -d \
  --name taskflow-mongodb \
  -p 27017:27017 \
  mongo:7.0

# Verificar que esté corriendo
docker ps | grep taskflow-mongodb
```

### Parte B: Configurar y ejecutar el Backend

#### Paso 1: Navegar al directorio del backend

```bash
cd backend
```

#### Paso 2: Crear entorno virtual de Python

```bash
# Crear entorno virtual
python3 -m venv venv

# Activar entorno virtual
# En macOS/Linux:
source venv/bin/activate

# En Windows PowerShell:
.\venv\Scripts\Activate.ps1

# En Windows CMD:
.\venv\Scripts\activate.bat
```

Deberías ver `(venv)` al inicio de tu línea de comando.

#### Paso 3: Instalar dependencias

```bash
pip install -r requirements.txt
```

Esto instalará:
- starlette
- ariadne
- uvicorn
- motor
- python-dotenv

#### Paso 4: Verificar variables de entorno

```bash
# Copiar el archivo de ejemplo
cp .env.example .env

# El archivo .env ya existe con la configuración correcta
cat .env
```

Deberías ver:
```
MONGODB_URL=mongodb://localhost:27017
MONGODB_DB=taskflow
CORS_ORIGINS=http://localhost:4200
```

#### Paso 5: Iniciar el servidor backend

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Output esperado:**
```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

**🔧 Backend corriendo en**: http://localhost:8000/graphql

Deja esta terminal abierta y abre una nueva para el frontend.

### Parte C: Configurar y ejecutar el Frontend

#### Paso 1: Navegar al directorio del frontend (nueva terminal)

```bash
cd frontend
```

#### Paso 2: Instalar dependencias de Node.js

```bash
npm install
```

Esto instalará todas las dependencias de Angular 19, Apollo, TailwindCSS, etc.

**Nota**: La instalación puede tardar 2-5 minutos dependiendo de tu conexión.

#### Paso 3: Iniciar el servidor de desarrollo

```bash
npm start
```

**Output esperado:**
```
✔ Browser application bundle generation complete.
Initial Chunk Files   | Names         |  Raw Size
main.js              | main          | 523.45 kB |

Application bundle generation complete. [X.XXX seconds]
Watch mode enabled. Watching for file changes...
➜  Local:   http://localhost:4200/
```

**🌐 Frontend corriendo en**: http://localhost:4200

### Parte D: Verificar que todo funciona

#### 1. Probar el Backend (GraphQL Playground)

Abre http://localhost:8000/graphql en tu navegador.

Ejecuta esta query:

```graphql
query {
  tasks {
    id
    title
    status
  }
}
```

Deberías ver una respuesta (aunque esté vacía):
```json
{
  "data": {
    "tasks": []
  }
}
```

#### 2. Crear una tarea desde el Playground

```graphql
mutation {
  createTask(input: {
    title: "Tarea de prueba desde GraphQL"
    description: "Probando la API directamente"
    priority: HIGH
  }) {
    id
    title
    status
    priority
  }
}
```

#### 3. Probar el Frontend

Abre http://localhost:4200 en tu navegador.

Deberías ver:
- La tarea que creaste desde el playground
- Un botón "Nueva tarea" para crear más
- Estadísticas (Pendientes, En progreso, Completadas)

---

## 🧪 Verificación de la Instalación

### Checklist

- [ ] MongoDB está corriendo (puerto 27017)
- [ ] Backend responde en http://localhost:8000/graphql
- [ ] Puedes ejecutar queries GraphQL
- [ ] Frontend se ve en http://localhost:4200 o http://localhost
- [ ] Puedes crear una nueva tarea
- [ ] Puedes cambiar el estado de una tarea
- [ ] Puedes editar una tarea
- [ ] Puedes eliminar una tarea
- [ ] Los filtros funcionan (Todas, Pendientes, En progreso, Completadas)

---

## 🐛 Solución de Problemas Comunes

### Problema: "Cannot connect to MongoDB"

**Solución**:
```bash
# Verificar que MongoDB esté corriendo
docker ps | grep mongo

# Si no está corriendo, iniciarlo
docker start taskflow-mongodb

# O con docker-compose
docker-compose up mongodb
```

### Problema: "Port 8000 is already in use"

**Solución**:
```bash
# Encontrar el proceso usando el puerto
lsof -i :8000

# Matar el proceso (reemplaza PID con el número real)
kill -9 <PID>

# O cambiar el puerto del backend
uvicorn app.main:app --reload --port 8001
```

### Problema: "Port 4200 is already in use"

**Solución**:
```bash
# Matar el proceso de Angular
npx ng serve --port 4201
```

### Problema: Frontend no se conecta al Backend

**Solución**:

1. Verifica que el backend esté corriendo:
```bash
curl http://localhost:8000/graphql
```

2. Verifica las variables de entorno del backend (.env):
```
CORS_ORIGINS=http://localhost:4200
```

3. Verifica la configuración de Apollo en el frontend:
```typescript
// frontend/src/app/graphql.config.ts
uri: 'http://localhost:8000/graphql'
```

### Problema: "Error: Cannot find module"

**Solución**:

Backend:
```bash
cd backend
pip install -r requirements.txt
```

Frontend:
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

---

## 🔄 Comandos Útiles

### Docker Compose

```bash
# Ver logs de todos los servicios
docker-compose logs

# Ver logs de un servicio específico
docker-compose logs backend
docker-compose logs frontend
docker-compose logs mongodb

# Reiniciar un servicio
docker-compose restart backend

# Ver estado de los servicios
docker-compose ps

# Ejecutar comando en un contenedor
docker-compose exec backend bash
docker-compose exec mongodb mongosh
```

### Desarrollo Local

```bash
# Backend: Ver logs en tiempo real con hot reload
uvicorn app.main:app --reload --log-level debug

# Frontend: Compilar para producción
npm run build

# Frontend: Ver el bundle size
npm run build -- --stats-json
```

---

## 📊 Estructura de Puertos

| Servicio | Puerto | URL |
|----------|--------|-----|
| Frontend | 80 (Docker) / 4200 (Local) | http://localhost o http://localhost:4200 |
| Backend | 8000 | http://localhost:8000/graphql |
| MongoDB | 27017 | mongodb://localhost:27017 |

---

## ✅ Siguiente Paso

Una vez que todo esté funcionando, explora la aplicación y prueba todas las funcionalidades CRUD.

**Funcionalidades para probar:**

1. ✏️ Crear tareas con diferentes prioridades
2. 🔄 Cambiar el estado de las tareas
3. ✏️ Editar tareas existentes
4. 🗑️ Eliminar tareas
5. 🔍 Filtrar por estado
6. 📊 Observar las estadísticas actualizándose en tiempo real

---

## 🎓 Recursos Adicionales

- [Documentación de Angular](https://angular.io/docs)
- [Documentación de Starlette](https://www.starlette.io/)
- [Documentación de Ariadne](https://ariadnegraphql.org/)
- [Documentación de TailwindCSS](https://tailwindcss.com/docs)
- [Documentación de Docker Compose](https://docs.docker.com/compose/)

---

¡Felicidades! 🎉 Ya tienes TaskFlow funcionando completamente.
