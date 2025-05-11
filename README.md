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
-   MongoDB 8

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
APP_NAME=ride-hailing-spa
PORT=5000
MONGO_URI=mongodb://mongodb:27017/ride-hailing
JWT_SECRET=clave-super-secreta
JWT_EXPIRES_IN=1d
LOG_LEVEL=debug
```

### Frontend (./frontend/.env)

```env
VITE_API_HOST=http://localhost:5000
VITE_API_BASE_PATH=/api
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
├── backend/                # API REST con Express y MongoDB
│   ├── src/                # Código fuente de la aplicación
│   │   ├── config/         # Configuraciones generales (conexión a la base de datos, etc.)
│   │   ├── controllers/    # Controladores que manejan la lógica de las rutas
│   │   ├── middlewares/    # Middlewares personalizados (autenticación, etc.)
│   │   ├── models/         # Modelos de Mongoose para MongoDB
│   │   ├── routes/         # Definición de rutas Express agrupadas por recurso
│   │   ├── seeders/        # Archivos para poblar la base de datos con datos iniciales
│   │   ├── services/       # Lógica de negocio y conexión entre controladores y modelos
│   │   ├── types/          # Definiciones de tipos y extensiones de interfaces
│   │   ├── utils/          # Funciones utilitarias, logger, type guards, etc.
│   │   ├── validation/     # validaciones para las rutas.
│   │   ├── app.ts          # Configuración principal de Express (middlewares, rutas, etc.)
│   │   └── server.ts       # Punto de entrada del servidor (listen)
│   ├── .dockerignore       # Archivos ignorados por docker
│   ├── .env                # Variables de entorno
│   ├── .gitignore          # Archivos ignorados por Git
│   ├── Dockerfile          # Imagen de Docker
│   ├── package.json        # Dependencias y scripts del proyecto
│   └── tsconfig.json       # Configuración de TypeScript
│
├── frontend/               # SPA con Vue 3 y Vuetify
│   ├── src/                # Código fuente de la aplicación
│   │   ├── components/     # Componentes generales
│   │   │   └── layouts/    # Plantillas
│   │   ├── plugins/        # Plugins de Vue que extienden la funcionalidad de la aplicación
│   │   ├── constants/      # Constantes utilizadas en toda la aplicación (por ejemplo, rutas, mensajes, etc.)
│   │   ├── router/         # Configuración de las rutas de la aplicación (Vue Router)
│   │   ├── stores/         # Almacenes de estado (Pinia) para manejar el estado global de la aplicación
│   │   └── views/          # Configuración de Vite
│   ├── .dockerignore       # Archivos ignorados por docker
│   ├── .env                # Variables de entorno
│   ├── .gitignore          # Archivos ignorados por Git
│   ├── Dockerfile          # Imagen de Docker
│   ├── package.json        # Dependencias y scripts del proyecto
│   ├── tsconfig.json       # Configuración de TypeScript
│   └── vite.config.ts      # Configuración de Vite
│
├── docker-compose.yml      # Orquestación de contenedores
└── README.md               # Documentación del proyecto
```

---

## Comandos útiles

### Scripts

-   **`npm run dev`**: Inicia el backend en modo desarrollo con `nodemon`.
-   **`npm run build`**: Compila el código TypeScript a JavaScript en la carpeta `dist`.
-   **`npm run start`**: Inicia el servidor en producción, ejecutando el archivo `dist/server.js`.
-   **`npm run seed:users`**: Poblar la base de datos con usuarios de prueba.
-   **`npm run seed:brands`**: Poblar la base de datos con marcas de vehículos de prueba.
-   **`npm run seed:models`**: Poblar la base de datos con modelos de vehículos de prueba.
-   **`npm run seed:drivers`**: Poblar la base de datos con conductores de prueba.
-   **`npm run seed:users:reset`**: Restablecer los usuarios en la base de datos.
-   **`npm run seed:brands:reset`**: Restablecer las marcas de vehículos.
-   **`npm run seed:models:reset`**: Restablecer los modelos de vehículos.
-   **`npm run seed:drivers:reset`**: Restablecer los conductores.

### Docker

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
