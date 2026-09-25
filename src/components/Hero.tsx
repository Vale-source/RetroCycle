import React from 'react';
import { Search, Sparkles, ShieldCheck, ArrowRight, RefreshCw } from 'lucide-react';
import { HardwareCategory } from '../types/marketplace';
import { CATEGORIES_META } from '../data/mockHardware';

interface HeroProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  totalKgDiverted: number;
  totalActiveListings: number;
}

export const Hero: React.FC<HeroProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  totalKgDiverted,
  totalActiveListings
}) => {
  return (
    <section className="relative pt-8 pb-10 border-b border-neutral-800 bg-gradient-to-b from-neutral-900/50 to-neutral-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Heading, Search & Stats */}
          <div className="lg:col-span-8 space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-medium text-emerald-400 uppercase tracking-wider">
                <span>Mercado Circular de Computación</span>
                <span aria-hidden="true">·</span>
                <span>Hardware Vintage & Reciclaje RAEE</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white font-display text-balance leading-tight">
                Dale una segunda vida al hardware clásico y recicla con impacto.
              </h1>
              <p className="text-sm sm:text-base text-neutral-400 max-w-2xl leading-relaxed">
                Conectamos entusiastas del retrocomputing con personas que desean vender, intercambiar o donar piezas electrónicas. Rescatamos placas, GPUs y periféricos antiguos mientras evitamos el vertedero.
              </p>
            </div>

            {/* Quick Search Bar */}
            <div className="relative max-w-xl">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Buscar componente, chipset o marca (ej. Voodoo 3dfx, Asus Slot 1, Trinitron CRT, RAM PC133)..."
                className="w-full pl-11 pr-24 py-3 bg-neutral-900/90 border border-neutral-700 rounded-xl text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute inset-y-0 right-2 px-2 text-xs text-neutral-400 hover:text-white my-auto h-7"
                >
                  Limpiar
                </button>
              )}
            </div>

            {/* Quantitative Proof Metrics - Zero-Pill format */}
            <div className="flex flex-wrap items-center gap-6 pt-2 text-xs text-neutral-400">
              <div className="flex items-center gap-2">
                <span className="font-mono tabular-nums text-base font-bold text-emerald-400">
                  {totalKgDiverted.toLocaleString('es-ES', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} kg
                </span>
                <span>de e-waste salvado del vertedero</span>
              </div>
              <span aria-hidden="true" className="text-neutral-700">·</span>
              <div className="flex items-center gap-2">
                <span className="font-mono tabular-nums text-base font-bold text-white">
                  {totalActiveListings}
                </span>
                <span>componentes activos listados</span>
              </div>
              <span aria-hidden="true" className="text-neutral-700">·</span>
              <div className="flex items-center gap-1 text-emerald-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Gestión de Recicladores Certificados</span>
              </div>
            </div>
          </div>

          {/* Right Column: Mini Highlight / Value Box */}
          <div className="lg:col-span-4 bg-neutral-900/60 border border-neutral-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider font-semibold text-neutral-400">
                4 Modalidades de Operación
              </span>
              <RefreshCw className="w-4 h-4 text-emerald-400" />
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-2.5 rounded-lg bg-neutral-950/70 border border-neutral-800/80 flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                <div>
                  <p className="font-semibold text-neutral-200">Venta con Precio Fijo</p>
                  <p className="text-neutral-400">Transacciones directas para componentes testeados y garantizados.</p>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-neutral-950/70 border border-neutral-800/80 flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                <div>
                  <p className="font-semibold text-neutral-200">Ofertas y Contraofertas</p>
                  <p className="text-neutral-400">Negocia precios justos directamente en el chat integrado.</p>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-neutral-950/70 border border-neutral-800/80 flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                <div>
                  <p className="font-semibold text-neutral-200">Intercambio Directo (Trueque)</p>
                  <p className="text-neutral-400">Canjea piezas que no utilizas por componentes que tu proyecto necesita.</p>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-neutral-950/70 border border-neutral-800/80 flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-purple-400 mt-1.5 shrink-0" />
                <div>
                  <p className="font-semibold text-neutral-200">Donación Gratuita ($0)</p>
                  <p className="text-neutral-400">Canaliza placas dañadas a recicladores RAEE certificados.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Horizontal Category Quick-Selector Buttons */}
        <div className="mt-8 pt-6 border-t border-neutral-800/80">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => onSelectCategory('')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                selectedCategory === ''
                  ? 'bg-emerald-400 text-neutral-950 font-semibold'
                  : 'bg-neutral-900 text-neutral-300 hover:text-white hover:bg-neutral-800'
              }`}
            >
              Todas las Categorías
            </button>
            {CATEGORIES_META.map((cat) => (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-emerald-400 text-neutral-950 font-semibold'
                    : 'bg-neutral-900 text-neutral-300 hover:text-white hover:bg-neutral-800'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
