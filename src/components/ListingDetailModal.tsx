import React, { useState } from 'react';
import { HardwareListing, User } from '../types/marketplace';
import { 
  X, 
  MapPin, 
  Star, 
  ShieldCheck, 
  Cpu, 
  Repeat, 
  Gift, 
  DollarSign, 
  Leaf, 
  AlertCircle,
  MessageSquare,
  CheckCircle2,
  Calendar,
  Layers,
  Scale
} from 'lucide-react';
import { calculateEcologicalImpact } from '../utils/ecoCalculator';
import { calculateDistanceKm } from '../utils/distance';

interface ListingDetailModalProps {
  listing: HardwareListing;
  currentUser: User;
  onClose: () => void;
  onSubmitOffer: (
    listing: HardwareListing, 
    offerType: 'compra_precio' | 'contraoferta' | 'propuesta_trueque' | 'solicitud_donacion',
    amount?: number,
    tradeItem?: string,
    message?: string
  ) => void;
  onOpenChat: (listing: HardwareListing) => void;
  onViewSellerProfile: (seller: User) => void;
}

export const ListingDetailModal: React.FC<ListingDetailModalProps> = ({
  listing,
  currentUser,
  onClose,
  onSubmitOffer,
  onOpenChat,
  onViewSellerProfile
}) => {
  const [activeTab, setActiveTab] = useState<'info' | 'transaccion'>('info');
  const [transactionType, setTransactionType] = useState<'compra' | 'oferta' | 'trueque' | 'donacion'>(
    listing.modality === 'donacion' 
      ? 'donacion' 
      : listing.modality === 'intercambio' 
      ? 'trueque' 
      : 'compra'
  );
  const [offerAmount, setOfferAmount] = useState<number>(listing.price > 0 ? Math.round(listing.price * 0.9) : 0);
  const [tradeOfferText, setTradeOfferText] = useState('');
  const [proposalNote, setProposalNote] = useState('');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  // Environmental breakdown for this hardware item
  const ecoImpact = calculateEcologicalImpact(listing.weightKg, listing.category);

  const distanceKm = currentUser.coordinates
    ? calculateDistanceKm(
        currentUser.coordinates.lat,
        currentUser.coordinates.lng,
        listing.location.coordinates.lat,
        listing.location.coordinates.lng
      )
    : null;

  const handleSendTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    let type: 'compra_precio' | 'contraoferta' | 'propuesta_trueque' | 'solicitud_donacion' = 'compra_precio';
    let amount = listing.price;

    if (transactionType === 'oferta') {
      type = 'contraoferta';
      amount = offerAmount;
    } else if (transactionType === 'trueque') {
      type = 'propuesta_trueque';
    } else if (transactionType === 'donacion') {
      type = 'solicitud_donacion';
      amount = 0;
    }

    onSubmitOffer(
      listing,
      type,
      amount,
      tradeOfferText,
      proposalNote || `Hola ${listing.seller.name}, tengo interés en tu publicación de ${listing.title}.`
    );

    setSubmittedSuccess(true);
    setTimeout(() => {
      setSubmittedSuccess(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl my-8 relative flex flex-col max-h-[90vh]">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider text-emerald-400 font-semibold font-mono">
              {listing.category.replace('_', ' ')}
            </span>
            <span aria-hidden="true" className="text-neutral-600">·</span>
            <span className="text-xs text-neutral-400">{listing.location.city}</span>
            {distanceKm !== null && (
              <>
                <span aria-hidden="true" className="text-neutral-600">·</span>
                <span className="text-xs text-neutral-300 font-mono">{distanceKm} km de ti</span>
              </>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Main Title & Price banner */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white font-display leading-tight">
                {listing.title}
              </h2>
              <div className="flex items-center gap-3 mt-2 text-xs text-neutral-400">
                <span>Marca: <strong className="text-neutral-200">{listing.brand}</strong></span>
                <span aria-hidden="true">·</span>
                <span>Modelo: <strong className="text-neutral-200">{listing.model}</strong></span>
                {listing.yearEstimated && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span>Año: <strong className="text-neutral-200">{listing.yearEstimated}</strong></span>
                  </>
                )}
              </div>
            </div>

            {/* Price Box */}
            <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 shrink-0 text-right">
              {listing.modality === 'donacion' ? (
                <div className="text-emerald-400 font-bold text-xl flex items-center justify-end gap-1.5">
                  <Gift className="w-5 h-5" />
                  <span>Donación ($0)</span>
                </div>
              ) : listing.modality === 'intercambio' ? (
                <div className="text-amber-400 font-bold text-lg flex items-center justify-end gap-1.5">
                  <Repeat className="w-5 h-5" />
                  <span>Trueque / Swap</span>
                </div>
              ) : (
                <div>
                  <div className="text-2xl font-bold font-mono tabular-nums text-white">
                    ${listing.price.toFixed(2)} <span className="text-xs text-neutral-400 font-sans">{listing.currency}</span>
                  </div>
                  {listing.modality === 'negociable' && (
                    <span className="text-xs text-blue-400">Abierto a ofertas</span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Condition and Status Pill-free alert */}
          <div className="p-3 rounded-xl bg-neutral-950/60 border border-neutral-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${
                listing.condition === 'funcionando' ? 'bg-emerald-400' :
                listing.condition === 'para_piezas' ? 'bg-amber-400' : 'bg-purple-400'
              }`} />
              <span className="font-semibold text-neutral-200">
                Estado: {listing.condition === 'funcionando' ? 'Completamente Operativo' :
                         listing.condition === 'para_piezas' ? 'Para Piezas / Reparación' : 'Para Reciclaje / Scrap de Metales'}
              </span>
            </div>
            <span className="text-neutral-400">
              Peso estimado: <strong className="text-neutral-200 font-mono">{listing.weightKg} kg</strong>
            </span>
          </div>

          {/* Environmental Impact Banner (RAEE / WEEE) */}
          <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-900/40 space-y-2">
            <div className="flex items-center justify-between text-xs text-emerald-400 font-semibold">
              <div className="flex items-center gap-1.5">
                <Leaf className="w-4 h-4" />
                <span>Impacto Ecológico al Rescatar Este Componente</span>
              </div>
              <span className="font-mono text-emerald-300">WEEE / RAEE Verificado</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1 text-xs">
              <div className="bg-neutral-950/70 p-2 rounded-lg border border-neutral-800/80">
                <p className="text-neutral-400">CO2 Evitado</p>
                <p className="font-mono tabular-nums font-bold text-white text-sm mt-0.5">{ecoImpact.co2SavedKg} kg</p>
              </div>
              <div className="bg-neutral-950/70 p-2 rounded-lg border border-neutral-800/80">
                <p className="text-neutral-400">Cobre Recuperable</p>
                <p className="font-mono tabular-nums font-bold text-amber-300 text-sm mt-0.5">{ecoImpact.copperGrams} g</p>
              </div>
              <div className="bg-neutral-950/70 p-2 rounded-lg border border-neutral-800/80">
                <p className="text-neutral-400">Oro en Contactos</p>
                <p className="font-mono tabular-nums font-bold text-yellow-400 text-sm mt-0.5">{ecoImpact.goldMilligrams} mg</p>
              </div>
              <div className="bg-neutral-950/70 p-2 rounded-lg border border-neutral-800/80">
                <p className="text-neutral-400">Tóxicos Evitados</p>
                <p className="font-mono tabular-nums font-bold text-emerald-400 text-sm mt-0.5">{ecoImpact.hazardousMetalsDivertedGrams} g</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h4 className="text-xs uppercase tracking-wider font-semibold text-neutral-400">Descripción del Vendedor</h4>
            <p className="text-sm text-neutral-300 leading-relaxed whitespace-pre-line bg-neutral-950/40 p-4 rounded-xl border border-neutral-800/80">
              {listing.description}
            </p>
          </div>

          {/* Technical Specs Table */}
          {Object.keys(listing.specs).length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs uppercase tracking-wider font-semibold text-neutral-400">Ficha Técnica & Arquitectura</h4>
              <div className="border border-neutral-800 rounded-xl overflow-hidden text-xs">
                <table className="w-full text-left">
                  <tbody>
                    {Object.entries(listing.specs).map(([specKey, specVal], idx) => (
                      <tr 
                        key={specKey} 
                        className={idx % 2 === 0 ? 'bg-neutral-900/60' : 'bg-neutral-950/60'}
                      >
                        <td className="py-2 px-3.5 font-medium text-neutral-400 border-b border-neutral-800/60 w-1/3">
                          {specKey}
                        </td>
                        <td className="py-2 px-3.5 text-neutral-200 font-mono border-b border-neutral-800/60">
                          {String(specVal)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Testing Notes if present */}
          {listing.testedNotes && (
            <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-xs space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Protocolo de Prueba Realizado</span>
              </div>
              <p className="text-neutral-400">{listing.testedNotes}</p>
            </div>
          )}

          {/* Seller Profile Card & Reputation */}
          <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-neutral-800 shrink-0">
                <img 
                  src={listing.seller.avatar} 
                  alt={listing.seller.name} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-white">{listing.seller.name}</span>
                  {listing.seller.isVerified && (
                    <span title="Identidad Verificada">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-neutral-400 mt-0.5">
                  <span className="capitalize">{listing.seller.role}</span>
                  <span aria-hidden="true">·</span>
                  <div className="flex items-center gap-1 text-amber-400">
                    <Star className="w-3 h-3 fill-amber-400" />
                    <span className="font-mono">{listing.seller.rating.toFixed(1)}</span>
                  </div>
                  <span aria-hidden="true">·</span>
                  <span>{listing.seller.completedDeals} transacciones</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onViewSellerProfile(listing.seller)}
              className="px-3 py-1.5 text-xs font-semibold text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors"
            >
              Ver Perfil
            </button>
          </div>

          {/* Interactive Offer / Transaction Module */}
          <div className="pt-2 border-t border-neutral-800 space-y-4">
            <h4 className="text-xs uppercase tracking-wider font-semibold text-neutral-400">
              Iniciar Transacción o Negociación
            </h4>

            {submittedSuccess ? (
              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-600/50 text-center space-y-1 text-emerald-400">
                <CheckCircle2 className="w-6 h-6 mx-auto mb-1" />
                <p className="font-semibold text-sm">¡Propuesta enviada al vendedor!</p>
                <p className="text-xs text-emerald-300">Revisa la bandeja de mensajes para continuar la conversación.</p>
              </div>
            ) : (
              <form onSubmit={handleSendTransaction} className="space-y-3">
                {/* Transaction Mode Radio Selector */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {listing.price > 0 && (
                    <button
                      type="button"
                      onClick={() => setTransactionType('compra')}
                      className={`p-2.5 text-xs font-medium rounded-lg border text-left transition-colors ${
                        transactionType === 'compra'
                          ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                          : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-neutral-200'
                      }`}
                    >
                      <p className="font-semibold">Comprar Directo</p>
                      <p className="text-[11px] font-mono">${listing.price} USD</p>
                    </button>
                  )}

                  {listing.allowOffers && (
                    <button
                      type="button"
                      onClick={() => setTransactionType('oferta')}
                      className={`p-2.5 text-xs font-medium rounded-lg border text-left transition-colors ${
                        transactionType === 'oferta'
                          ? 'bg-blue-500/10 border-blue-500 text-blue-400'
                          : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-neutral-200'
                      }`}
                    >
                      <p className="font-semibold">Hacer Contraoferta</p>
                      <p className="text-[11px]">Negociar precio</p>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setTransactionType('trueque')}
                    className={`p-2.5 text-xs font-medium rounded-lg border text-left transition-colors ${
                      transactionType === 'trueque'
                        ? 'bg-amber-500/10 border-amber-500 text-amber-400'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    <p className="font-semibold">Proponer Trueque</p>
                    <p className="text-[11px]">Intercambiar pieza</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTransactionType('donacion')}
                    className={`p-2.5 text-xs font-medium rounded-lg border text-left transition-colors ${
                      transactionType === 'donacion'
                        ? 'bg-purple-500/10 border-purple-500 text-purple-400'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    <p className="font-semibold">Reciclaje / Donación</p>
                    <p className="text-[11px]">Gratis ($0)</p>
                  </button>
                </div>

                {/* Conditional inputs */}
                {transactionType === 'oferta' && (
                  <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 space-y-2">
                    <label className="text-xs text-neutral-300 font-medium">Monto propuesto (USD):</label>
                    <input
                      type="number"
                      min="1"
                      max={listing.price * 2}
                      value={offerAmount}
                      onChange={(e) => setOfferAmount(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-sm text-white font-mono"
                    />
                  </div>
                )}

                {transactionType === 'trueque' && (
                  <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 space-y-2">
                    <label className="text-xs text-neutral-300 font-medium">Pieza o hardware que ofreces a cambio:</label>
                    <input
                      type="text"
                      placeholder="Ej: Tarjeta Sound Blaster Live! PCI + Memoria 128MB PC100"
                      value={tradeOfferText}
                      onChange={(e) => setTradeOfferText(e.target.value)}
                      required
                      className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-sm text-white"
                    />
                  </div>
                )}

                {/* Message to seller */}
                <div className="space-y-1">
                  <label className="text-xs text-neutral-400">Mensaje para {listing.seller.name}:</label>
                  <textarea
                    rows={2}
                    placeholder="Escribe detalles de entrega, dudas técnicas o disponibilidad de retiro..."
                    value={proposalNote}
                    onChange={(e) => setProposalNote(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Submit & Contact Buttons */}
                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 px-4 text-xs font-semibold rounded-xl bg-emerald-400 hover:bg-emerald-300 text-neutral-950 transition-colors shadow-sm text-center"
                  >
                    {transactionType === 'compra'
                      ? `Confirmar Intención de Compra ($${listing.price} USD)`
                      : transactionType === 'oferta'
                      ? `Enviar Contraoferta ($${offerAmount} USD)`
                      : transactionType === 'trueque'
                      ? 'Enviar Propuesta de Intercambio'
                      : 'Solicitar Donación para Reciclaje'}
                  </button>

                  <button
                    type="button"
                    onClick={() => onOpenChat(listing)}
                    className="py-2.5 px-4 text-xs font-semibold rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition-colors flex items-center gap-1.5"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Solo Chatear</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
