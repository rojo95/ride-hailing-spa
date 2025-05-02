# ride-hailing-spa

Aplicación web monolítica tipo SPA para la administración de vehículos en una empresa de transporte tipo ride hailing. Incluye autenticación de administradores, gestión de vehículos y recuperación de contraseña con preguntas secretas.

---

## Tecnologías

-   **Frontend**: Vue 3 + TypeScript + Vuetify
-   **Backend**: Node.js + Express + MongoDB (Mongoose)
-   **Autenticación**: JWT
-   **Recuperación de contraseña**: Preguntas secretas
-   **Contenedores**: Docker + Docker Compose

---

## Requisitos

### Docker

-   Docker
-   Docker Compose

### Sin Docker

-   Node.js 20+
-   Yarn o npm
-   MongoDB

---

## Instalación y ejecución

### 1. Clona el repositorio e ingresa en el

```bash
git clone https://github.com/tu-usuario/ride-hailing-spa.git
cd ride-hailing-spa
```

### Docker

#### 2. Construye y levanta los contenedores

```bash
docker-compose up --build
```

Esto levantará tres servicios:

-   frontend: SPA en Vue 3 (puerto 5173)
-   backend: API en Node.js/Express (puerto 5000)
-   mongodb: Base de datos MongoDB (puerto 27017)

### Iniciar de forma local (sin Docker)

#### 2. Asegúrate de tener MongoDB ejecutándose en tu máquina local

-   URL recomendada: mongodb://localhost:27017/ride-hailing

#### 3. Configura las variables de entorno

Ver las variables de entorno recomendadas más abajo.

#### 4. Instala dependencias y ejecuta

##### Backend

```bash
cd backend
yarn install    # o npm install
yarn dev        # o npm run dev
```

##### Frontend

```bash
cd frontend
yarn install    # o npm install
yarn dev        # o npm run dev
```

### Accede a la app

-   Frontend: http://localhost:5173
-   Backend (API): http://localhost:5000

---

## Variables de entorno

### Backend (./backend/.env)

```env
PORT=5000
MONGO_URI=mongodb://mongodb:27017/ride-hailing
JWT_SECRET=clave-super-secreta
JWT_EXPIRES_IN=1d
SECURITY_QUESTIONS=¿Nombre de tu primera mascota?,¿Ciudad natal?,¿Comida favorita?
```

### Frontend (./frontend/.env)

```env
VITE_API_URL=http://localhost:5000
```

---

## Funcionalidades principales

-   Inicio de sesión de administradores
-   Registro y listado de vehículos
-   Edición y eliminación de vehículos
-   Recuperación de contraseña mediante preguntas secretas

---

## Estructura del proyecto

```
ride-hailing-spa/
│
├── backend/        # API REST con Express y MongoDB
│   ├── src/
│   └── Dockerfile
│
├── frontend/       # SPA con Vue 3 y Vuetify
│   ├── src/
│   └── Dockerfile
│
├── docker-compose.yml
└── README.md
```

---

## Comandos útiles

-   Reconstruir servicios sin usar la cache:

```bash
docker-compose build --no-cache
```

-   Levantar los contenedores (sin reconstruir):

```bash
docker-compose up
```

-   Detener los contenedores:

```bash
docker-compose down
```

-   Detener y eliminar contenedores:

```bash
docker-compose down -v
```

-   Detener contenedores, eliminar volúmenes y contenedores huérfanos:

```bash
docker-compose down --volumes --remove-orphans
```

---

## Notas

-   Asegúrate de que el puerto 27017 no esté ocupado por otra instancia local de MongoDB.
-   Esta app está pensada para ser usada por administradores internos, no usuarios finales.

---

# Autor

Desarrollado por Johan Román.
