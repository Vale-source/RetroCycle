import React, { useState } from 'react';
import { HardwareListing, HardwareCategory, HardwareCondition, TransactionModality, User } from '../types/marketplace';
import { CATEGORIES_META } from '../data/mockHardware';
import { X, Upload, Plus, Trash2, CheckCircle2, AlertCircle, Leaf } from 'lucide-react';
import { calculateEcologicalImpact } from '../utils/ecoCalculator';

interface PublishModalProps {
  currentUser: User;
  onClose: () => void;
  onPublishSuccess: (newListing: HardwareListing) => void;
}

export const PublishModal: React.FC<PublishModalProps> = ({
  currentUser,
  onClose,
  onPublishSuccess
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<HardwareCategory>('tarjetas_graficas');
  const [condition, setCondition] = useState<HardwareCondition>('funcionando');
  const [modality, setModality] = useState<TransactionModality>('venta_fija');
  const [price, setPrice] = useState<number>(30);
  const [allowOffers, setAllowOffers] = useState(true);
  const [tradePreferences, setTradePreferences] = useState('');
  const [description, setDescription] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [yearEstimated, setYearEstimated] = useState<number>(2000);
  const [weightKg, setWeightKg] = useState<number>(0.8);
  const [testedNotes, setTestedNotes] = useState('');
  const [city, setCity] = useState(currentUser.city || 'Mendoza (Capital)');
  const [neighborhood, setNeighborhood] = useState('Centro');
  const [imageUrl, setImageUrl] = useState('');
  const [specsList, setSpecsList] = useState<{ key: string; val: string }[]>([
    { key: 'Interfaz / Bus', val: 'AGP / PCI / ISA' },
    { key: 'Memoria / Capacidad', val: '128 MB' }
  ]);

  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Suggested preset images for vintage computing
  const PRESET_PHOTOS = [
    { label: 'Tarjeta Gráfica GPU Retro', url: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&auto=format&fit=crop&q=80' },
    { label: 'Placa Madre Vintage', url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80' },
    { label: 'Lote Reciclaje Electrónico', url: 'https://images.unsplash.com/photo-1603732551681-2e91159b9dc2?w=800&auto=format&fit=crop&q=80' },
    { label: 'Monitor CRT / Torre Retro', url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80' }
  ];

  const handleAddSpec = () => {
    setSpecsList([...specsList, { key: '', val: '' }]);
  };

  const handleRemoveSpec = (idx: number) => {
    setSpecsList(specsList.filter((_, i) => i !== idx));
  };

  const handleSpecChange = (idx: number, field: 'key' | 'val', value: string) => {
    const updated = [...specsList];
    updated[idx][field] = value;
    setSpecsList(updated);
  };

  const validateForm = (): boolean => {
    const errs: string[] = [];
    if (!title.trim() || title.length < 5) {
      errs.push('El título debe tener al menos 5 caracteres descriptivos.');
    }
    if (!brand.trim()) {
      errs.push('Debes especificar la marca o fabricante.');
    }
    if (!model.trim()) {
      errs.push('Debes especificar el modelo del hardware.');
    }
    if (description.length < 15) {
      errs.push('La descripción debe contener al menos 15 caracteres.');
    }
    if (modality === 'donacion' && price !== 0) {
      errs.push('Para modalidad de donación, el precio debe ser 0 USD.');
    }
    if (modality !== 'donacion' && modality !== 'intercambio' && price <= 0) {
      errs.push('El precio debe ser un número positivo.');
    }
    if (weightKg <= 0) {
      errs.push('El peso debe ser mayor a 0 kg para calcular el impacto ambiental.');
    }
    setErrors(errs);
    return errs.length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    const specsObj: Record<string, string> = {};
    specsList.forEach(s => {
      if (s.key.trim() && s.val.trim()) {
        specsObj[s.key.trim()] = s.val.trim();
      }
    });

    const newListing: HardwareListing = {
      id: `hw-${Date.now()}`,
      title: title.trim(),
      category,
      condition,
      modality,
      price: modality === 'donacion' || modality === 'intercambio' ? 0 : price,
      currency: 'USD',
      allowOffers,
      tradePreferences: modality === 'intercambio' ? tradePreferences : undefined,
      description: description.trim(),
      brand: brand.trim(),
      model: model.trim(),
      yearEstimated,
      weightKg,
      images: [imageUrl || PRESET_PHOTOS[0].url],
      specs: specsObj,
      testedNotes: testedNotes.trim() || undefined,
      status: 'disponible',
      sellerId: currentUser.id,
      seller: currentUser,
      location: {
        city: city.trim(),
        neighborhood: neighborhood.trim(),
        coordinates: currentUser.coordinates || { lat: -32.8895, lng: -68.8458 }
      },
      createdAt: new Date().toISOString(),
      views: 1,
      favoriteCount: 0
    };

    setTimeout(() => {
      onPublishSuccess(newListing);
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  const impactPreview = calculateEcologicalImpact(weightKg, category);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl my-6 flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950">
          <div>
            <h2 className="text-lg font-bold text-white font-display">Publicar Hardware o Chatarra Electrónica</h2>
            <p className="text-xs text-neutral-400">Pone a disposición tus componentes para venta, intercambio o reciclaje responsable.</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6">
          {errors.length > 0 && (
            <div className="p-4 rounded-xl bg-red-950/40 border border-red-800/60 text-xs text-red-300 space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-red-400">
                <AlertCircle className="w-4 h-4" />
                <span>Revisa los siguientes campos:</span>
              </div>
              <ul className="list-disc list-inside space-y-0.5">
                {errors.map((err, i) => <li key={i}>{err}</li>)}
              </ul>
            </div>
          )}

          {/* Section 1: Category, Condition & Modality */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-300">Categoría de Componente</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as HardwareCategory)}
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-neutral-200 focus:outline-none focus:border-emerald-500"
              >
                {CATEGORIES_META.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-300">Estado Físico / Funcional</label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value as HardwareCondition)}
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-neutral-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="funcionando">Funcionando al 100%</option>
                <option value="para_piezas">Para piezas / Reparación</option>
                <option value="para_reciclaje">Para reciclaje / Scrap metálico</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-300">Modalidad de Transacción</label>
              <select
                value={modality}
                onChange={(e) => {
                  const val = e.target.value as TransactionModality;
                  setModality(val);
                  if (val === 'donacion' || val === 'intercambio') {
                    setPrice(0);
                  }
                }}
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-neutral-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="venta_fija">Venta con Precio Fijo</option>
                <option value="negociable">Precio Negociable / Ofertas</option>
                <option value="intercambio">Intercambio Directo (Trueque)</option>
                <option value="donacion">Donación Gratuita ($0)</option>
              </select>
            </div>
          </div>

          {/* Section 2: Title, Brand, Model & Year */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-300">Título de la Publicación</label>
              <input
                type="text"
                placeholder="Ej. Tarjeta Gráfica 3dfx Voodoo2 12MB PCI"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-300">Marca / Fabricante</label>
                <input
                  type="text"
                  placeholder="Ej. 3dfx, Asus, IBM, Sony"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-300">Modelo Exacto</label>
                <input
                  type="text"
                  placeholder="Ej. Voodoo2 CT6670"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-300">Año de Fabricación Estimado</label>
                <input
                  type="number"
                  min="1975"
                  max="2015"
                  value={yearEstimated}
                  onChange={(e) => setYearEstimated(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white font-mono"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Pricing & Modality details */}
          <div className="p-4 bg-neutral-950 rounded-xl border border-neutral-800 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              <div>
                <label className="text-xs font-semibold text-neutral-300">Precio (USD)</label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  disabled={modality === 'donacion' || modality === 'intercambio'}
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-sm font-mono text-white disabled:opacity-50"
                />
                {modality === 'donacion' && (
                  <p className="text-[11px] text-emerald-400 mt-1">Donación gratuita fijada en $0 USD</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-neutral-300">Peso Estimado (kg)</label>
                <input
                  type="number"
                  step="0.05"
                  min="0.05"
                  value={weightKg}
                  onChange={(e) => setWeightKg(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-sm font-mono text-white"
                />
                <p className="text-[11px] text-neutral-400">Usado para computar el desvío de e-waste de vertederos.</p>
              </div>
            </div>

            {modality === 'intercambio' && (
              <div className="space-y-1.5 pt-2 border-t border-neutral-800">
                <label className="text-xs font-semibold text-amber-400">¿Qué componentes buscas a cambio?</label>
                <input
                  type="text"
                  placeholder="Ej. Busco tarjeta Sound Blaster 16 ISA o CPU Pentium Pro"
                  value={tradePreferences}
                  onChange={(e) => setTradePreferences(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white"
                />
              </div>
            )}

            {/* Environmental Impact Preview */}
            <div className="pt-2 border-t border-neutral-800 flex items-center justify-between text-xs text-emerald-400">
              <div className="flex items-center gap-1.5">
                <Leaf className="w-3.5 h-3.5" />
                <span>Impacto ambiental estimado al rescatar esta pieza:</span>
              </div>
              <span className="font-mono font-semibold">
                +{impactPreview.co2SavedKg} kg CO2 evitado · {impactPreview.copperGrams}g cobre
              </span>
            </div>
          </div>

          {/* Section 4: Description & Testing Protocol */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-300">Descripción detallada</label>
              <textarea
                rows={3}
                placeholder="Indica historia de la pieza, cómo fue almacenada, conectores disponibles y observaciones de conservación..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-300">Notas de Testeo o Diagnóstico</label>
              <input
                type="text"
                placeholder="Ej. Testeada en Windows 98 con MemTest y 3DMark 99 sin cuelgues ni artefactos"
                value={testedNotes}
                onChange={(e) => setTestedNotes(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white"
              />
            </div>
          </div>

          {/* Section 5: Technical Specs key-value editor */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-neutral-300">Especificaciones Técnicas (Opcional)</label>
              <button
                type="button"
                onClick={handleAddSpec}
                className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Agregar atributo</span>
              </button>
            </div>

            <div className="space-y-2">
              {specsList.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Atributo (ej: Socket)"
                    value={item.key}
                    onChange={(e) => handleSpecChange(idx, 'key', e.target.value)}
                    className="w-1/2 px-3 py-1.5 bg-neutral-950 border border-neutral-800 rounded-lg text-xs text-white"
                  />
                  <input
                    type="text"
                    placeholder="Valor (ej: Socket 7)"
                    value={item.val}
                    onChange={(e) => handleSpecChange(idx, 'val', e.target.value)}
                    className="w-1/2 px-3 py-1.5 bg-neutral-950 border border-neutral-800 rounded-lg text-xs text-white"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveSpec(idx)}
                    className="p-1.5 text-neutral-500 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Section 6: Image Selection */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-neutral-300">Fotografía del Hardware</label>
            <p className="text-[11px] text-neutral-400">Selecciona una imagen de muestra para tu categoría o ingresa URL:</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {PRESET_PHOTOS.map((p, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setImageUrl(p.url)}
                  className={`p-2 rounded-xl border text-left text-[11px] transition-colors overflow-hidden flex flex-col gap-1.5 ${
                    imageUrl === p.url
                      ? 'border-emerald-500 bg-emerald-950/20 text-emerald-400'
                      : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:border-neutral-700'
                  }`}
                >
                  <div className="aspect-[4/3] rounded-lg overflow-hidden bg-neutral-800">
                    <img src={p.url} alt={p.label} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <span className="truncate">{p.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Location */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-300">Ciudad</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-300">Barrio / Zona</label>
              <input
                type="text"
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-neutral-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-neutral-400 hover:text-white rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 text-xs font-semibold text-neutral-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-colors shadow-sm flex items-center gap-1.5 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Publicando...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Publicar en el Marketplace</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
