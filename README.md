# TaskFlow

> Aplicación CRUD de gestión de tareas desarrollada con Angular 20 y Python GraphQL

## Stack Tecnológico

**Frontend:** Angular 20 (standalone components) + TailwindCSS + Apollo GraphQL
**Backend:** Python + Starlette + Ariadne + Uvicorn
**Base de datos:** MongoDB
**Infraestructura:** Docker Compose

---

## Ejecución Rápida

```bash
# Clonar el repositorio
git clone <repository-url>
cd TimeFor

# Levantar todos los servicios
docker-compose up --build

# Acceder a la aplicación
# Frontend: http://localhost
# Backend GraphQL: http://localhost:8000/graphql
```

**Detener:**
```bash
docker-compose down
```

---

## Desarrollo Local (Opcional)

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm start
# Abre http://localhost:4200
```

**Requisitos:** Docker, o Node.js 20+ y Python 3.11+ para desarrollo local.

---

## Descripción del Proyecto

TaskFlow es una aplicación TODO-list completa que permite gestionar tareas con CRUD total. El desarrollo se abordó priorizando:

**1. Arquitectura Limpia:** Separación clara entre capas (presentación, lógica, datos) tanto en frontend como backend.

**2. Código Reutilizable:** Componentes standalone en Angular y Repository Pattern en Python para evitar duplicación.

**3. Experiencia de Usuario:** Diseño original con glassmorphism, animaciones suaves y feedback visual en cada interacción.

**4. Facilidad de Despliegue:** Containerización completa con Docker Compose para ejecutar toda la infraestructura con un solo comando.

### Funcionalidades

✅ **CRUD completo** de tareas (Crear, Listar, Editar, Eliminar)
✅ **Estados:** Pendiente, En progreso, Completada
✅ **Prioridades:** Baja, Media, Alta, Urgente
✅ **Filtros** por estado
✅ **Estadísticas** en tiempo real
✅ **Diseño moderno** con glassmorphism y animaciones

---

## Estructura del Proyecto

```
TimeFor/
├── backend/              # API GraphQL Python
│   ├── app/
│   │   ├── main.py      # Aplicación Starlette
│   │   ├── schema.graphql
│   │   ├── resolvers.py
│   │   └── database.py  # MongoDB con Motor
│   └── Dockerfile
│
├── frontend/            # SPA Angular 20
│   ├── src/app/
│   │   ├── components/  # Standalone components
│   │   ├── services/    # GraphQL service
│   │   └── models/      # TypeScript interfaces
│   └── Dockerfile
│
└── docker-compose.yml   # Orquestación completa
```

---

## Decisiones de Arquitectura

### Backend
- **Starlette + Ariadne:** Framework ligero con GraphQL schema-first
- **Motor (MongoDB async):** Driver asíncrono para máximo rendimiento
- **Repository Pattern:** Separa lógica de negocio del acceso a datos

### Frontend
- **Standalone Components:** Angular 20 sin NgModules (más ligero y modular)
- **Apollo Client:** Gestión de estado GraphQL con cache automático
- **TailwindCSS:** Sistema de diseño personalizado sin frameworks de componentes

### Infraestructura
- **Docker Compose:** Desarrollo y producción unificados
- **Health checks:** Garantiza orden de inicio (MongoDB → Backend → Frontend)
- **Multi-stage builds:** Frontend optimizado con Nginx

---

## Desafíos y Soluciones

### 1. Sincronización UI-Backend
**Desafío:** Mantener la UI actualizada después de cada operación CRUD.
**Solución:** Uso de `refetchQueries` en Apollo Client para actualizar automáticamente la lista tras cada mutación.

### 2. Código Limpio Sin Redundancias
**Desafío:** Evitar duplicación de código manteniendo escalabilidad.
**Solución:**
- Backend: Repository Pattern para abstraer operaciones de BD
- Frontend: Componentes reutilizables con inputs/outputs claros
- GraphQL: Fragments para reutilizar definiciones de campos

### 3. Diseño Original
**Desafío:** Crear interfaz atractiva sin PrimeNG/Angular Material.
**Solución:** Sistema de diseño custom con TailwindCSS:
- Glassmorphism (`backdrop-blur`, transparencias)
- Paleta de colores personalizada
- Animaciones CSS (`@keyframes` custom)
- Componentes visuales desde cero

### 4. Containerización con Dependencias
**Desafío:** Orquestar servicios que dependen entre sí.
**Solución:**
- Health checks en MongoDB antes de iniciar backend
- `depends_on` con condiciones en docker-compose
- Volúmenes persistentes para datos

---

## Schema GraphQL

```graphql
type Query {
  tasks(status: TaskStatus): [Task!]!
  task(id: ID!): Task
}

type Mutation {
  createTask(input: CreateTaskInput!): Task!
  updateTask(id: ID!, input: UpdateTaskInput!): Task!
  deleteTask(id: ID!): Boolean!
}
```

---

## Testing Manual

Abre http://localhost:8000/graphql y prueba:

```graphql
# Crear tarea
mutation {
  createTask(input: {
    title: "Mi primera tarea"
    description: "Probar TaskFlow"
    priority: MEDIUM
  }) {
    id
    title
    status
  }
}

# Listar tareas
query {
  tasks {
    id
    title
    status
    priority
  }
}
```

---

## Documentación Adicional

Para una guía paso a paso detallada, consulta [SETUP.md](SETUP.md)

---

## Características Técnicas

- ✅ TypeScript strict mode
- ✅ Código asíncrono (async/await)
- ✅ Manejo de errores centralizado
- ✅ Validación de datos (frontend y backend)
- ✅ CORS configurado
- ✅ Hot reload en desarrollo

---

**Desarrollado para la prueba técnica de TimeFor**
