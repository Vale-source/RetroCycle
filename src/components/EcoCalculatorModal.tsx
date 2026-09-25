import React, { useState } from 'react';
import { X, Leaf, Cpu, TreeDeciduous, Zap, ShieldCheck, Scale, Award } from 'lucide-react';
import { calculateEcologicalImpact } from '../utils/ecoCalculator';

interface EcoCalculatorModalProps {
  onClose: () => void;
}

export const EcoCalculatorModal: React.FC<EcoCalculatorModalProps> = ({ onClose }) => {
  const [motherboardWeight, setMotherboardWeight] = useState<number>(4);
  const [ramCount, setRamCount] = useState<number>(10);
  const [gpuCount, setGpuCount] = useState<number>(3);
  const [crtCount, setCrtCount] = useState<number>(1);
  const [hddCount, setHddCount] = useState<number>(5);

  // Compute total simulated weight in kg
  const totalWeightKg = Number(
    (
      motherboardWeight +
      ramCount * 0.03 +
      gpuCount * 0.4 +
      crtCount * 18 +
      hddCount * 0.55
    ).toFixed(2)
  );

  const impact = calculateEcologicalImpact(totalWeightKg);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Leaf className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-display">Calculadora de Impacto Ambiental & Huella RAEE</h2>
              <p className="text-xs text-neutral-400">Descubre cuánto CO2 y metales preciosos salvas al reutilizar o reciclar hardware.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Sliders for hardware count */}
          <div className="space-y-4 bg-neutral-950 p-5 rounded-xl border border-neutral-800">
            <h3 className="text-xs uppercase tracking-wider font-semibold text-neutral-400">
              Simula el inventario de hardware a reciclar o transferir:
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {/* Motherboards */}
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-neutral-300">Placas Madre (kg de circuitos):</span>
                  <span className="font-mono text-emerald-400 font-bold">{motherboardWeight} kg</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="25"
                  step="1"
                  value={motherboardWeight}
                  onChange={(e) => setMotherboardWeight(Number(e.target.value))}
                  className="w-full accent-emerald-400 cursor-pointer"
                />
              </div>

              {/* RAM Modules */}
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-neutral-300">Módulos de Memoria RAM (Contactos de oro):</span>
                  <span className="font-mono text-yellow-400 font-bold">{ramCount} un.</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  step="2"
                  value={ramCount}
                  onChange={(e) => setRamCount(Number(e.target.value))}
                  className="w-full accent-yellow-400 cursor-pointer"
                />
              </div>

              {/* GPUs */}
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-neutral-300">Tarjetas Gráficas (Disipadores cobre/aluminio):</span>
                  <span className="font-mono text-sky-400 font-bold">{gpuCount} un.</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="15"
                  step="1"
                  value={gpuCount}
                  onChange={(e) => setGpuCount(Number(e.target.value))}
                  className="w-full accent-sky-400 cursor-pointer"
                />
              </div>

              {/* Hard Drives */}
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-neutral-300">Discos Duros IDE / SCSI (Imanes neodimio & aluminio):</span>
                  <span className="font-mono text-purple-400 font-bold">{hddCount} un.</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="20"
                  step="1"
                  value={hddCount}
                  onChange={(e) => setHddCount(Number(e.target.value))}
                  className="w-full accent-purple-400 cursor-pointer"
                />
              </div>

              {/* CRT Monitors */}
              <div className="space-y-1.5 sm:col-span-2">
                <div className="flex justify-between">
                  <span className="text-neutral-300">Monitores CRT / Televisores Vintage (Vidrio plomado evitado):</span>
                  <span className="font-mono text-amber-400 font-bold">{crtCount} un.</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="1"
                  value={crtCount}
                  onChange={(e) => setCrtCount(Number(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Results Display */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs uppercase tracking-wider font-semibold text-neutral-400">
                Beneficios de Economía Circular Obtenidos
              </h3>
              <span className="text-xs font-mono text-neutral-400">
                Peso total gestionado: <strong className="text-white">{totalWeightKg} kg</strong>
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-800/40 text-left">
                <Leaf className="w-5 h-5 text-emerald-400 mb-2" />
                <p className="text-[11px] text-neutral-400 uppercase tracking-wider">CO2 Ahorrado</p>
                <p className="text-xl font-bold font-mono text-white mt-1">{impact.co2SavedKg} kg</p>
                <p className="text-[10px] text-neutral-500 mt-1">Equivalente a {impact.treesEquivalent} árboles en 1 año</p>
              </div>

              <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-800/40 text-left">
                <Zap className="w-5 h-5 text-amber-400 mb-2" />
                <p className="text-[11px] text-neutral-400 uppercase tracking-wider">Cobre Puro Reclamado</p>
                <p className="text-xl font-bold font-mono text-amber-300 mt-1">{impact.copperGrams} g</p>
                <p className="text-[10px] text-neutral-500 mt-1">Evita minería extractiva primaria</p>
              </div>

              <div className="p-4 rounded-xl bg-yellow-950/30 border border-yellow-800/40 text-left">
                <Award className="w-5 h-5 text-yellow-400 mb-2" />
                <p className="text-[11px] text-neutral-400 uppercase tracking-wider">Oro Recuperable</p>
                <p className="text-xl font-bold font-mono text-yellow-300 mt-1">{impact.goldMilligrams} mg</p>
                <p className="text-[10px] text-neutral-500 mt-1">Extraíble en refinería autorizada</p>
              </div>

              <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-800/40 text-left">
                <ShieldCheck className="w-5 h-5 text-purple-400 mb-2" />
                <p className="text-[11px] text-neutral-400 uppercase tracking-wider">Tóxicos Neutralizados</p>
                <p className="text-xl font-bold font-mono text-purple-300 mt-1">{impact.hazardousMetalsDivertedGrams} g</p>
                <p className="text-[10px] text-neutral-500 mt-1">Plomo, bromo y cadmio aislados</p>
              </div>
            </div>
          </div>

          {/* Educational Note */}
          <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-400 space-y-1 leading-relaxed">
            <p className="font-semibold text-neutral-200">¿Por qué es vital rescatar hardware de los años 90 y 2000?</p>
            <p>
              Las placas base y procesadores antiguos tienen hasta 10 veces más concentración de oro y metales preciosos por tonelada que el mineral virgen extraído en mina. Al reacondicionar o reciclar estos componentes en RetroCycle evitamos emisiones masivas de gases de efecto invernadero y preservamos piezas de valor histórico.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
