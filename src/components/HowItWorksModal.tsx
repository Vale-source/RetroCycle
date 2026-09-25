import React from 'react';
import { X, HelpCircle, ShieldCheck, Repeat, Gift, DollarSign, CheckCircle2, Leaf, MapPin, MessageSquare } from 'lucide-react';

interface HowItWorksModalProps {
  onClose: () => void;
  onOpenPublish: () => void;
}

export const HowItWorksModal: React.FC<HowItWorksModalProps> = ({ onClose, onOpenPublish }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-display">Cómo Funciona RetroCycle</h2>
              <p className="text-xs text-neutral-400">Guía para compradores, vendedores y donantes de hardware retro.</p>
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
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-neutral-300 leading-relaxed">
          {/* 4 Transaction Modes */}
          <div className="space-y-3">
            <h3 className="text-xs uppercase tracking-wider font-semibold text-emerald-400">
              1. Las 4 Modalidades de Operación
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1.5">
                <div className="flex items-center gap-2 text-white font-semibold">
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                  <span>Venta con Precio Fijo</span>
                </div>
                <p className="text-neutral-400 text-[11px]">
                  El vendedor establece un precio directo. Ideal para piezas vintage verificadas y testeadas en bancos de prueba.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1.5">
                <div className="flex items-center gap-2 text-white font-semibold">
                  <MessageSquare className="w-4 h-4 text-blue-400" />
                  <span>Ofertas & Contraofertas</span>
                </div>
                <p className="text-neutral-400 text-[11px]">
                  Puedes negociar el valor directamente con el vendedor a través del chat integrado antes de pactar la entrega.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1.5">
                <div className="flex items-center gap-2 text-white font-semibold">
                  <Repeat className="w-4 h-4 text-amber-400" />
                  <span>Intercambio Directo (Trueque)</span>
                </div>
                <p className="text-neutral-400 text-[11px]">
                  Ofrece componentes de tu colección que ya no uses (memorias, procesadores, tarjetas) a cambio del hardware publicado.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1.5">
                <div className="flex items-center gap-2 text-white font-semibold">
                  <Gift className="w-4 h-4 text-purple-400" />
                  <span>Donación para Reciclaje ($0)</span>
                </div>
                <p className="text-neutral-400 text-[11px]">
                  Piezas dañadas o chatarra para que recicladores RAEE certificados recuperen oro, cobre y neutralicen toxinas.
                </p>
              </div>
            </div>
          </div>

          {/* Safety & Testing Tips */}
          <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3">
            <div className="flex items-center gap-2 text-white font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>2. Consejos para Tratos Seguros y Pruebas</span>
            </div>
            <ul className="space-y-2 text-neutral-400 text-[11px]">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Puntos de encuentro públicos:</strong> Coordina siempre la entrega en lugares con iluminación y afluencia, o estaciones de transporte céntricas.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Fuentes de alimentación de época:</strong> Nunca utilices fuentes viejas no recapadas para probar hardware sensible; pueden sobrevoltar placas y módulos RAM.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Bolsas antiestáticas (ESD):</strong> Transporta placas madre y memorias en bolsas antiestáticas para evitar descargas que quemen los chips.</span>
              </li>
            </ul>
          </div>

          {/* Community & Environmental Impact */}
          <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-900/40 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold">
              <Leaf className="w-4 h-4" />
              <span>3. Impacto Ecológico Comunitario</span>
            </div>
            <p className="text-neutral-300 text-[11px]">
              Cada kilogramo de tecnología vintage que rescatas en lugar de desechar ahorra más de 20 kg de CO2 en fabricación y minería primaria, además de mantener el plomo, cadmio y fósforo fuera de los vertederos.
            </p>
          </div>

          {/* CTA */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-neutral-400 hover:text-white transition-colors text-xs font-semibold"
            >
              Cerrar
            </button>
            <button
              onClick={() => {
                onClose();
                onOpenPublish();
              }}
              className="px-4 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-neutral-950 font-semibold transition-colors text-xs"
            >
              Publicar un Componente
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
