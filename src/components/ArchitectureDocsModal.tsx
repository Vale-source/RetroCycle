import React, { useState } from 'react';
import { X, FileCode2, Database, Server, Laptop, Copy, Check, Terminal, ExternalLink } from 'lucide-react';

interface ArchitectureDocsModalProps {
  onClose: () => void;
}

export const ArchitectureDocsModal: React.FC<ArchitectureDocsModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'justificacion' | 'schema' | 'backend' | 'docker' | 'api'>('justificacion');
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const schemaSqlSample = `-- EXTRACTO DEL ESQUEMA POSTGRESQL (schema.sql)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "earthdistance";

CREATE TYPE user_role_enum AS ENUM ('vendedor', 'comprador', 'reciclador');
CREATE TYPE hardware_category_enum AS ENUM (
    'placas_madre', 'memorias_ram', 'tarjetas_graficas', 
    'discos_almacenamiento', 'fuentes_poder', 'monitores_crt_lcd', 
    'laptops_completas', 'procesadores_cpu', 'perifericos_vintage', 'lotes_reciclaje'
);
CREATE TYPE hardware_condition_enum AS ENUM ('funcionando', 'para_piezas', 'para_reciclaje');
CREATE TYPE transaction_modality_enum AS ENUM ('venta_fija', 'negociable', 'intercambio', 'donacion');

CREATE TABLE listings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    seller_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    category hardware_category_enum NOT NULL,
    condition hardware_condition_enum NOT NULL,
    modality transaction_modality_enum NOT NULL,
    price NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (price >= 0),
    weight_kg NUMERIC(6, 2) NOT NULL CHECK (weight_kg > 0),
    specs JSONB NOT NULL DEFAULT '{}'::jsonb,
    search_vector tsvector GENERATED ALWAYS AS (
        to_tsvector('spanish', coalesce(title, '') || ' ' || coalesce(description, ''))
    ) STORED,
    CONSTRAINT check_donation_zero_price CHECK (
        (modality = 'donacion' AND price = 0) OR (modality != 'donacion')
    )
);

CREATE INDEX idx_listings_search ON listings USING gin(search_vector);
CREATE INDEX idx_listings_specs ON listings USING gin(specs);
CREATE INDEX idx_listings_geo ON listings USING gist (ll_to_earth(latitude, longitude));`;

  const dockerComposeSample = `# docker-compose.yml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    container_name: retrocycle_postgres
    environment:
      POSTGRES_USER: retro_user
      POSTGRES_PASSWORD: retro_secret_password_2026
      POSTGRES_DB: retrocycle_db
    ports:
      - "5432:5432"
    volumes:
      - ./schema.sql:/docker-entrypoint-initdb.d/01_init.sql

  backend:
    build: ./backend
    container_name: retrocycle_api
    ports:
      - "8000:8000"
    environment:
      DATABASE_URL: postgresql://retro_user:retro_secret_password_2026@postgres:5432/retrocycle_db
    depends_on:
      - postgres

  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    ports:
      - "3000:3000"`;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950">
          <div className="flex items-center gap-2">
            <FileCode2 className="w-5 h-5 text-amber-400" />
            <div>
              <h2 className="text-base font-bold text-white font-display">Arquitectura, Justificación & Entregables</h2>
              <p className="text-xs text-neutral-400">Documentación de ingeniería, diseño de base de datos y despliegue local.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-neutral-800 bg-neutral-950/60 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveTab('justificacion')}
            className={`pb-2.5 px-2 font-semibold transition-colors border-b-2 whitespace-nowrap ${
              activeTab === 'justificacion'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            Justificación del Stack
          </button>
          <button
            onClick={() => setActiveTab('schema')}
            className={`pb-2.5 px-2 font-semibold transition-colors border-b-2 whitespace-nowrap ${
              activeTab === 'schema'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            Base de Datos (PostgreSQL)
          </button>
          <button
            onClick={() => setActiveTab('backend')}
            className={`pb-2.5 px-2 font-semibold transition-colors border-b-2 whitespace-nowrap ${
              activeTab === 'backend'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            Código Backend (FastAPI)
          </button>
          <button
            onClick={() => setActiveTab('docker')}
            className={`pb-2.5 px-2 font-semibold transition-colors border-b-2 whitespace-nowrap ${
              activeTab === 'docker'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            Setup Local & Docker
          </button>
          <button
            onClick={() => setActiveTab('api')}
            className={`pb-2.5 px-2 font-semibold transition-colors border-b-2 whitespace-nowrap ${
              activeTab === 'api'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            Especificación REST API
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {activeTab === 'justificacion' && (
            <div className="space-y-6 text-xs text-neutral-300">
              {/* FastAPI vs Flask */}
              <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3">
                <div className="flex items-center gap-2 text-sm font-bold text-white font-display">
                  <Server className="w-4 h-4 text-emerald-400" />
                  <span>Backend: FastAPI vs Flask (Elección: FastAPI)</span>
                </div>
                <p className="leading-relaxed">
                  Para RetroCycle se eligió <strong>FastAPI</strong> sobre Flask debido a 4 pilares fundamentales:
                </p>
                <ol className="list-decimal list-inside space-y-2 text-neutral-400">
                  <li>
                    <strong className="text-neutral-200">Asincronía Nativa (`async/await`):</strong> El marketplace integra mensajería y negociación en tiempo real. FastAPI corre sobre Starlette/ASGI, permitiendo manejar cientos de WebSockets simultáneos en un solo worker sin recurrir a Celery o servidores de eventos externos requeridos por Flask (WSGI).
                  </li>
                  <li>
                    <strong className="text-neutral-200">Validación Estricta con Pydantic v2:</strong> El hardware informático cuenta con propiedades altamente heterogéneas (chipset, sockets, pines, frecuencias, peso para e-waste). Pydantic valida automáticamente los tipos y rangos de datos en el payload, sanitizando y blindando la API ante inyecciones.
                  </li>
                  <li>
                    <strong className="text-neutral-200">Documentación OpenAPI / Swagger Automática:</strong> El backend expone en tiempo real la especificación OpenAPI en <code className="text-emerald-400">/docs</code>, facilitando la integración Frontend-Backend sin desfases en los contratos de datos.
                  </li>
                  <li>
                    <strong className="text-neutral-200">Rendimiento:</strong> FastAPI ofrece un throughput de ~25.000 req/seg frente a ~7.000 de Flask estándar, esencial para búsquedas multifiltro y geodésicas concurrentes.
                  </li>
                </ol>
              </div>

              {/* React vs Next.js */}
              <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3">
                <div className="flex items-center gap-2 text-sm font-bold text-white font-display">
                  <Laptop className="w-4 h-4 text-sky-400" />
                  <span>Frontend: React vs Next.js (Elección: React SPA con Vite)</span>
                </div>
                <p className="leading-relaxed">
                  Se seleccionó <strong>React SPA (Vite)</strong> por sobre Next.js considerando:
                </p>
                <ol className="list-decimal list-inside space-y-2 text-neutral-400">
                  <li>
                    <strong className="text-neutral-200">Filtrado Multifaceta de Latencia Cero:</strong> En un marketplace técnico los usuarios combinan 4 a 6 filtros simultáneos (estado físico, categoría, precio, radio de cercanía en km). El estado en el cliente procesa las mutaciones en &lt;16ms sin re-renderizados de servidor ni round-trips innecesarios.
                  </li>
                  <li>
                    <strong className="text-neutral-200">Persistencia de Conexiones WebSocket:</strong> Al navegar entre categorías y detalle de publicaciones, el hilo de mensajería y las notificaciones de contraoferta permanecen conectadas sin los reinicios de ciclo de vida típicos de las rutas RSC de Next.js.
                  </li>
                  <li>
                    <strong className="text-neutral-200">Desacoplamiento Operativo:</strong> Permite compilar un bundle estático distribuido vía CDN/Nginx a costo mínimo, manteniendo el backend en Python FastAPI como un microservicio independiente.
                  </li>
                </ol>
              </div>

              {/* PostgreSQL */}
              <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3">
                <div className="flex items-center gap-2 text-sm font-bold text-white font-display">
                  <Database className="w-4 h-4 text-purple-400" />
                  <span>Base de Datos: PostgreSQL 16 (Relacional)</span>
                </div>
                <p className="leading-relaxed">
                  Cumple con el estándar ACID para ofertas económicas y transferencias de hardware. Utiliza tipos ENUM nativos, columnas JSONB indexadas con GIN para fichas técnicas, y vector de búsqueda de texto completo con <code className="text-purple-400">to_tsvector('spanish', ...)</code>.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'schema' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-neutral-400">
                  Archivo <code className="text-emerald-400 font-mono">schema.sql</code> en la raíz del proyecto.
                </p>
                <button
                  onClick={() => copyToClipboard(schemaSqlSample)}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 flex items-center gap-1.5 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copiado' : 'Copiar DDL'}</span>
                </button>
              </div>
              <pre className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 text-[11px] font-mono text-emerald-300 overflow-x-auto max-h-96">
                {schemaSqlSample}
              </pre>
            </div>
          )}

          {activeTab === 'backend' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-neutral-400">
                  Estructura modular en <code className="text-emerald-400 font-mono">backend/</code> con FastAPI y SQLAlchemy.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800">
                  <p className="font-semibold text-white font-mono">backend/main.py</p>
                  <p className="text-neutral-400 text-[11px] mt-1">
                    Punto de entrada FastAPI con middleware CORS, router de publicaciones y ConnectionManager para WebSockets de mensajería.
                  </p>
                </div>
                <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800">
                  <p className="font-semibold text-white font-mono">backend/models.py</p>
                  <p className="text-neutral-400 text-[11px] mt-1">
                    Entidades ORM SQLAlchemy 2.0 para User, Listing, Offer, ChatMessage y Review con relaciones y cascadas.
                  </p>
                </div>
                <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800">
                  <p className="font-semibold text-white font-mono">backend/schemas.py</p>
                  <p className="text-neutral-400 text-[11px] mt-1">
                    Esquemas de validación estricta con Pydantic v2 (regex de categorías, validación de donación $0, etc.).
                  </p>
                </div>
                <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800">
                  <p className="font-semibold text-white font-mono">backend/auth.py</p>
                  <p className="text-neutral-400 text-[11px] mt-1">
                    Autenticación JWT con expiración configurable y hash seguro de contraseñas con bcrypt (passlib).
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'docker' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-neutral-400">
                  Despliegue con un solo comando: <code className="text-white font-mono bg-neutral-950 px-2 py-0.5 rounded border border-neutral-800">docker-compose up --build</code>
                </p>
                <button
                  onClick={() => copyToClipboard(dockerComposeSample)}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 flex items-center gap-1.5 transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar Docker Compose</span>
                </button>
              </div>
              <pre className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 text-[11px] font-mono text-neutral-300 overflow-x-auto max-h-96">
                {dockerComposeSample}
              </pre>
            </div>
          )}

          {activeTab === 'api' && (
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 font-mono font-bold text-[10px]">GET</span>
                  <span className="font-mono text-white">/api/v1/listings</span>
                </div>
                <p className="text-neutral-400 text-[11px]">
                  Búsqueda y listado con filtros: <code className="text-neutral-300">q</code>, <code className="text-neutral-300">category</code>, <code className="text-neutral-300">condition</code>, <code className="text-neutral-300">modality</code>, <code className="text-neutral-300">max_price</code>.
                </p>
              </div>

              <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono font-bold text-[10px]">POST</span>
                  <span className="font-mono text-white">/api/v1/listings</span>
                </div>
                <p className="text-neutral-400 text-[11px]">
                  Crea anuncio con especificaciones técnicas, modalidad y peso en kg para e-waste. Requiere Bearer JWT.
                </p>
              </div>

              <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono font-bold text-[10px]">POST</span>
                  <span className="font-mono text-white">/api/v1/offers</span>
                </div>
                <p className="text-neutral-400 text-[11px]">
                  Registra oferta económica, contraoferta, propuesta de intercambio o solicitud de donación para reciclaje.
                </p>
              </div>

              <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-400 font-mono font-bold text-[10px]">WS</span>
                  <span className="font-mono text-white">/ws/chat/{'{thread_id}'}</span>
                </div>
                <p className="text-neutral-400 text-[11px]">
                  Conexión WebSocket bidireccional en tiempo real para intercambio de mensajes instantáneos entre comprador y vendedor.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
