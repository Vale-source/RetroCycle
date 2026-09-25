# RetroCycle — Marketplace de Hardware Vintage y Reciclaje Electrónico

RetroCycle es una plataforma web completa de grado de producción diseñada para conectar a entusiastas, coleccionistas, técnicos de reparación y centros de reciclaje (RAEE/WEEE). Su objetivo es rescatar hardware informático clásico, prolongar la vida útil de componentes retro y asegurar la disposición ecológica o recuperación de metales en piezas dañadas.

---

## 1. Justificación del Stack Tecnológico

### Backend: ¿Por qué FastAPI sobre Flask?

| Criterio | FastAPI (Elegido) | Flask | Justificación en RetroCycle |
| :--- | :--- | :--- | :--- |
| **Concurrencia & Asincronía** | Asíncrono nativo (`async/await` sobre ASGI / Starlette) | Síncrono por defecto (WSGI) | Crucial para la **mensajería en tiempo real mediante WebSockets** entre compradores y vendedores sin requerir servidores de tareas externas (Celery) para el MVP. |
| **Validación de Datos** | Pydantic v2 estricto en tiempo de compilación | Manual o mediante plugins (`Marshmallow`) | Las especificaciones de hardware vintage son complejas (chipsets, voltajes, pines, peso de e-waste). Pydantic valida y sanitiza automáticamente cada payload evitando inyecciones y tipos corruptos. |
| **Documentación de API** | OpenAPI 3.1 / Swagger UI automático en `/docs` | Manual (Flasgger / Swagger UI externos) | Facilita la sincronización del contrato de datos entre Frontend y Backend en tiempo real. |
| **Rendimiento** | Benchmark top-tier en Python (~25k req/seg) | ~7k req/seg | Soporta búsquedas intensivas con múltiples filtros y cálculos geodésicos sin cuellos de botella. |

### Frontend: ¿Por qué React sobre Next.js?

| Criterio | React SPA (Elegido) | Next.js (SSR / RSC) | Justificación en RetroCycle |
| :--- | :--- | :--- | :--- |
| **Interactividad y Filtros** | Estado en memoria con filtrado cliente instantáneo | Re-renderizado por servidor o hidratación | Los usuarios en un marketplace de hardware aplican 4-6 filtros simultáneos (categoría, estado físico, precio, radio de cercanía en km). React proporciona respuesta instantánea (<16ms) sin parpadeo. |
| **Mensajería & Sockets** | Conexión WebSocket persistente sin pérdida de estado | Desconexiones en navegación y complejidad en RSC | Mantiene el hilo de chat y las contraofertas activas en un drawer lateral mientras el usuario continúa navegando el catálogo. |
| **Despliegue & Costos** | Build estático servido desde CDN / Edge | Requiere servidor Node.js permanente | Arquitectura desacoplada: el frontend estático escala a costo mínimo y se comunica vía REST/WS con la API FastAPI. |

### Base de Datos: PostgreSQL 16 (Relacional)

- **Integridad Referencial Estricta:** Claves foráneas con borrado en cascada controlado entre `users`, `listings`, `offers`, `chat_threads`, `messages` y `reviews`.
- **Enums Nativos:** Tipado estricto a nivel motor para `hardware_category_enum`, `hardware_condition_enum`, `transaction_modality_enum` y `offer_status_enum`.
- **JSONB Indexado:** Almacenamiento de especificaciones técnicas variables por tipo de componente (ej: bus AGP vs PCI-e, latencias CAS en RAM, voltajes de CPU) con índices GIN (`idx_listings_specs`).
- **Búsqueda de Texto Completo (Full-Text Search):** Vector `tsvector` generado automáticamente en español sobre título, descripción, fabricante y modelo (`to_tsvector('spanish', ...)`).
- **Cálculo Geodésico:** Extensión `earthdistance` y `cube` para cálculo de distancia en kilómetros desde las coordenadas del usuario.

---

## 2. Instrucciones de Configuración y Ejecución Local

### Opción A: Despliegue Rápido con Docker Compose (Recomendada)

Requisitos previos: Docker 24+ y Docker Compose.

1. **Clonar el repositorio:**
   ```bash
   git clone <repo-url>
   cd retrocycle
   ```

2. **Iniciar todos los servicios (PostgreSQL + FastAPI + React):**
   ```bash
   docker-compose up --build
   ```

3. **Acceder a los servicios:**
   - Frontend Web: [http://localhost:3000](http://localhost:3000)
   - Backend API REST: [http://localhost:8000](http://localhost:8000)
   - Documentación Interactiva Swagger: [http://localhost:8000/docs](http://localhost:8000/docs)
   - Base de Datos PostgreSQL: `localhost:5432` (Usuario: `retro_user`, DB: `retrocycle_db`)

---

### Opción B: Ejecución Manual en Entorno Local

#### Paso 1: Configurar PostgreSQL
1. Instala PostgreSQL 14+ y crea la base de datos:
   ```sql
   CREATE DATABASE retrocycle_db;
   CREATE USER retro_user WITH PASSWORD 'retro_secret_password_2026';
   GRANT ALL PRIVILEGES ON DATABASE retrocycle_db TO retro_user;
   ```
2. Ejecuta el esquema DDL y datos de prueba:
   ```bash
   psql -U retro_user -d retrocycle_db -f schema.sql
   ```

#### Paso 2: Configurar y Ejecutar el Backend (FastAPI)
1. Navega a la carpeta del backend:
   ```bash
   cd backend
   ```
2. Crea y activa el entorno virtual de Python:
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # En Windows: venv\Scripts\activate
   ```
3. Instala dependencias:
   ```bash
   pip install -r requirements.txt
   ```
4. Crea tu archivo de variables de entorno `.env`:
   ```ini
   DATABASE_URL=postgresql://retro_user:retro_secret_password_2026@localhost:5432/retrocycle_db
   SECRET_KEY=tu_clave_secreta_jwt_de_produccion_2026
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=1440
   ```
5. Inicia el servidor de desarrollo Uvicorn:
   ```bash
   uvicorn main:app --reload --port 8000
   ```

#### Paso 3: Configurar y Ejecutar el Frontend (React)
1. En la raíz del proyecto:
   ```bash
   npm install
   npm run dev
   ```
2. Abre tu navegador en `http://localhost:3000`.

---

## 3. Pruebas Automatizadas (Testing)

### Ejecutar Tests del Backend (Pytest):
```bash
cd backend
pytest -v test_api.py
```

### Ejecutar Tests de Integración en el Frontend:
La aplicación cuenta con una consola de pruebas automatizadas en tiempo real accesible desde la barra superior ("Verificar Tests"). Ejecuta 7 suites con verificación de:
1. Autenticación y control de acceso basado en roles (RBAC).
2. Validación de esquemas de publicación y regla de negocio de donación ($0).
3. Motor de búsqueda difusa y filtros por estado físico.
4. Máquina de estados de ofertas y contraofertas.
5. Cálculo geodésico de distancias en mapa (Fórmula de Haversine).
6. Fórmulas de impacto ecológico (ahorro de CO2 y recuperación de oro/cobre).
7. Sanitización anti-XSS en el hilo de chat.

---

## 4. Guía Básica de Usuario

1. **Explorar Hardware:** Usa el buscador para encontrar componentes por nombre, socket (ej: *Slot 1, Socket 7*) o marca (*3dfx, Asus, Sony*). Filtra por estado (*Funcionando, Para Piezas, Para Reciclaje*) y modalidad (*Venta, Ofertas, Trueque, Donación*).
2. **Hacer una Oferta o Trueque:** Abre el detalle de cualquier componente y selecciona si deseas comprar a precio fijo, proponer una contraoferta económica, ofrecer un trueque con otro componente o solicitar lote de donación para reciclaje.
3. **Mensajería Integrada:** Comunícate con el vendedor mediante el chat en vivo para coordinar pruebas de funcionamiento o punto de entrega seguro.
4. **Calculadora Eco:** Observa en tiempo real los kilogramos de chatarra electrónica salvados del vertedero, el CO2 evitado y los gramos de metales preciosos (oro y cobre) recuperados.
5. **Cambio de Perfil:** En la esquina superior derecha puedes cambiar de rol instantáneamente (*Vendedor, Comprador, Reciclador RAEE*) para probar la experiencia de usuario de cada uno.
