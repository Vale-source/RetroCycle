import React from 'react';
import { HardwareListing } from '../types/marketplace';
import { Cpu, MapPin, Star, MessageSquare, Repeat, Gift, DollarSign, CheckCircle2, AlertTriangle, Trash2 } from 'lucide-react';
import { calculateDistanceKm } from '../utils/distance';

interface ListingCardProps {
  listing: HardwareListing;
  userLocation?: { lat: number; lng: number };
  onViewDetails: (listing: HardwareListing) => void;
  onContactSeller: (listing: HardwareListing) => void;
  onMakeOffer: (listing: HardwareListing) => void;
}

export const ListingCard: React.FC<ListingCardProps> = ({
  listing,
  userLocation,
  onViewDetails,
  onContactSeller,
  onMakeOffer
}) => {
  const [imgError, setImgError] = React.useState(false);

  // Calculate distance if coordinates are present
  const distanceKm = userLocation
    ? calculateDistanceKm(
        userLocation.lat,
        userLocation.lng,
        listing.location.coordinates.lat,
        listing.location.coordinates.lng
      )
    : null;

  // Condition label and color indicator
  const conditionConfig = {
    funcionando: {
      label: 'Funcionando 100%',
      textColor: 'text-emerald-400',
      dotColor: 'bg-emerald-400',
      icon: CheckCircle2,
    },
    para_piezas: {
      label: 'Para piezas / Reparación',
      textColor: 'text-amber-400',
      dotColor: 'bg-amber-400',
      icon: AlertTriangle,
    },
    para_reciclaje: {
      label: 'Para reciclaje / Scrap',
      textColor: 'text-purple-400',
      dotColor: 'bg-purple-400',
      icon: Trash2,
    },
  }[listing.condition];

  // Modality presentation
  const modalityConfig = {
    venta_fija: {
      label: 'Precio Fijo',
      icon: DollarSign,
      color: 'text-neutral-300',
    },
    negociable: {
      label: 'Negociable',
      icon: DollarSign,
      color: 'text-blue-400',
    },
    intercambio: {
      label: 'Trueque / Swap',
      icon: Repeat,
      color: 'text-amber-400',
    },
    donacion: {
      label: 'Donación $0',
      icon: Gift,
      color: 'text-emerald-400',
    },
  }[listing.modality];

  return (
    <div className="group bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded-xl overflow-hidden flex flex-col transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/40">
      {/* Image Container with Resilient Fallback */}
      <div 
        onClick={() => onViewDetails(listing)}
        className="relative aspect-[4/3] bg-neutral-950 overflow-hidden cursor-pointer flex items-center justify-center"
      >
        {!imgError && listing.images.length > 0 ? (
          <img
            src={listing.images[0]}
            alt={listing.title}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-neutral-900 to-neutral-950 text-neutral-500">
            <Cpu className="w-10 h-10 mb-2 text-neutral-600" />
            <span className="text-xs font-mono uppercase tracking-wider text-neutral-500">
              {listing.brand}
            </span>
          </div>
        )}

        {/* Condition subtle text banner */}
        <div className="absolute top-2.5 left-2.5 px-2 py-1 rounded bg-neutral-950/80 backdrop-blur-sm border border-neutral-800 text-[11px] font-medium flex items-center gap-1.5">
          <span className={`w-1.5 h-1.5 rounded-full ${conditionConfig.dotColor}`} />
          <span className={conditionConfig.textColor}>{conditionConfig.label}</span>
        </div>

        {/* Distance Indicator */}
        {distanceKm !== null && (
          <div className="absolute top-2.5 right-2.5 px-2 py-1 rounded bg-neutral-950/80 backdrop-blur-sm border border-neutral-800 text-[11px] font-mono text-neutral-300 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-neutral-400" />
            <span>{distanceKm} km</span>
          </div>
        )}
      </div>

      {/* Card Content Area */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Unboxed Metadata Header (Zero-Pill Rule) */}
          <div className="flex items-center gap-1.5 text-[11px] text-neutral-400 uppercase tracking-wider mb-1.5">
            <span className="font-semibold text-neutral-300">{listing.brand}</span>
            <span aria-hidden="true">·</span>
            <span>{listing.yearEstimated || 'Clásico'}</span>
            <span aria-hidden="true">·</span>
            <span>{listing.location.city}</span>
          </div>

          {/* Title */}
          <h3 
            onClick={() => onViewDetails(listing)}
            className="text-sm font-semibold text-neutral-100 hover:text-emerald-400 transition-colors line-clamp-2 cursor-pointer leading-snug"
          >
            {listing.title}
          </h3>

          {/* Short Specs Preview (Key specs) */}
          <div className="mt-2 text-xs text-neutral-400 space-y-0.5">
            {Object.entries(listing.specs).slice(0, 2).map(([key, val]) => (
              <p key={key} className="truncate">
                <span className="text-neutral-500">{key}:</span> {String(val)}
              </p>
            ))}
          </div>
        </div>

        {/* Footer of Card: Price / Modality and Action CTA */}
        <div className="pt-3 border-t border-neutral-800/80">
          <div className="flex items-center justify-between mb-3">
            {/* Price or Modality text */}
            <div>
              {listing.modality === 'donacion' ? (
                <div className="flex items-center gap-1 text-emerald-400 font-semibold text-sm">
                  <Gift className="w-3.5 h-3.5" />
                  <span>Donación ($0)</span>
                </div>
              ) : listing.modality === 'intercambio' ? (
                <div className="flex items-center gap-1 text-amber-400 font-semibold text-sm">
                  <Repeat className="w-3.5 h-3.5" />
                  <span>Trueque / Swap</span>
                </div>
              ) : (
                <div className="flex items-baseline gap-1">
                  <span className="text-base font-bold font-mono tabular-nums text-white">
                    ${listing.price.toFixed(2)}
                  </span>
                  <span className="text-[10px] text-neutral-400">{listing.currency}</span>
                  {listing.modality === 'negociable' && (
                    <span className="text-[10px] text-blue-400 ml-1">(negociable)</span>
                  )}
                </div>
              )}
            </div>

            {/* Seller micro info */}
            <div className="flex items-center gap-1 text-[11px] text-neutral-400">
              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
              <span className="font-mono tabular-nums">{listing.seller.rating.toFixed(1)}</span>
              <span className="text-neutral-500">({listing.seller.reviewCount})</span>
            </div>
          </div>

          {/* Action Button Strip */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onMakeOffer(listing)}
              className="py-1.5 px-3 text-xs font-semibold rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition-colors text-center truncate"
            >
              {listing.modality === 'donacion'
                ? 'Solicitar'
                : listing.modality === 'intercambio'
                ? 'Proponer Swap'
                : 'Hacer Oferta'}
            </button>
            <button
              onClick={() => onContactSeller(listing)}
              className="py-1.5 px-3 text-xs font-semibold rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-colors flex items-center justify-center gap-1"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Mensaje</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
