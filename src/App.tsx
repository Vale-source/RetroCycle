import React, { useState, useMemo } from 'react';
import { HardwareListing, User, ChatThread, ChatMessage, Offer, HardwareCategory, HardwareCondition, TransactionModality } from './types/marketplace';
import { MOCK_USERS, MOCK_LISTINGS, CATEGORIES_META } from './data/mockHardware';
import { calculateDistanceKm } from './utils/distance';

import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ListingCard } from './components/ListingCard';
import { ListingDetailModal } from './components/ListingDetailModal';
import { PublishModal } from './components/PublishModal';
import { MessagingDrawer } from './components/MessagingDrawer';
import { MapLocatorModal } from './components/MapLocatorModal';
import { EcoCalculatorModal } from './components/EcoCalculatorModal';
import { UserProfileModal } from './components/UserProfileModal';
import { HowItWorksModal } from './components/HowItWorksModal';

import { 
  SlidersHorizontal, 
  RotateCcw, 
  CheckCircle2, 
  Layers, 
  Repeat, 
  Gift, 
  DollarSign, 
  ArrowUpDown,
  Filter,
  Cpu,
  Leaf,
  ShieldCheck,
  HeartHandshake,
  MapPin
} from 'lucide-react';

export default function App() {
  // --- STATE ---
  const [allUsers] = useState<User[]>(MOCK_USERS);
  const [currentUser, setCurrentUser] = useState<User>(MOCK_USERS[1]); // Elena Ramos (comprador) by default
  const [listings, setListings] = useState<HardwareListing[]>(MOCK_LISTINGS);

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedCondition, setSelectedCondition] = useState<string>('todas');
  const [selectedModality, setSelectedModality] = useState<string>('todas');
  const [maxDistanceKm, setMaxDistanceKm] = useState<number>(100);
  const [sortBy, setSortBy] = useState<'recientes' | 'precio_asc' | 'precio_desc' | 'peso_kg' | 'cercania'>('recientes');

  // Modals & Drawers
  const [selectedListingDetail, setSelectedListingDetail] = useState<HardwareListing | null>(null);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [isMessagesDrawerOpen, setIsMessagesDrawerOpen] = useState(false);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [isEcoModalOpen, setIsEcoModalOpen] = useState(false);
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);
  const [selectedProfileUser, setSelectedProfileUser] = useState<User | null>(null);
  const [activeThreadId, setActiveThreadId] = useState<string | null>('th-01');

  // Chat Threads State
  const [threads, setThreads] = useState<ChatThread[]>([
    {
      id: 'th-01',
      listingId: 'hw-001',
      listingTitle: 'Tarjeta Gráfica 3dfx Voodoo3 3000 AGP 16MB',
      listingPrice: 85,
      listingImage: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&auto=format&fit=crop&q=80',
      listingModality: 'venta_fija',
      buyerId: 'user-buyer-1',
      sellerId: 'user-seller-1',
      otherUser: MOCK_USERS[0],
      lastMessage: '¿Aceptas $75 con entrega en Plaza Independencia?',
      lastMessageTime: '18:42',
      unreadCount: 1,
      messages: [
        {
          id: 'msg-01',
          threadId: 'th-01',
          senderId: 'user-buyer-1',
          senderName: 'Elena Ramos',
          text: 'Hola Carlos, ¿aún tienes la Voodoo3? Tengo una placa Asus Slot 1 y me interesa probarla en Windows 98.',
          timestamp: '18:30'
        },
        {
          id: 'msg-02',
          threadId: 'th-01',
          senderId: 'user-seller-1',
          senderName: 'Carlos Mendoza',
          text: 'Hola Elena, sí, está disponible y testeada en Glide con 3DMark 99. La entrego con bolsa antiestática.',
          timestamp: '18:35'
        },
        {
          id: 'msg-03',
          threadId: 'th-01',
          senderId: 'user-buyer-1',
          senderName: 'Elena Ramos',
          text: 'Propuesta de contraoferta: $75 USD por la pieza con entrega en Plaza Independencia (Mendoza Centro).',
          timestamp: '18:42',
          isOfferNotification: true,
          offerDetails: {
            type: 'contraoferta',
            amount: 75,
            status: 'pendiente'
          }
        }
      ]
    }
  ]);

  // Offers State
  const [offers, setOffers] = useState<Offer[]>([]);

  // Total unread messages across threads
  const totalUnread = useMemo(() => {
    return threads.reduce((acc, t) => acc + t.unreadCount, 0);
  }, [threads]);

  // Overall e-waste diverted calculation
  const totalEwasteDiverted = useMemo(() => {
    return listings.reduce((acc, l) => acc + l.weightKg, 0) + 4820; // Community historic base
  }, [listings]);

  // --- FILTER & SORT LOGIC ---
  const filteredListings = useMemo(() => {
    let result = [...listings];

    // 1. Text Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        l =>
          l.title.toLowerCase().includes(q) ||
          l.description.toLowerCase().includes(q) ||
          l.brand.toLowerCase().includes(q) ||
          l.model.toLowerCase().includes(q) ||
          Object.values(l.specs).some(v => String(v).toLowerCase().includes(q))
      );
    }

    // 2. Category
    if (selectedCategory) {
      result = result.filter(l => l.category === selectedCategory);
    }

    // 3. Condition
    if (selectedCondition !== 'todas') {
      result = result.filter(l => l.condition === selectedCondition);
    }

    // 4. Modality
    if (selectedModality !== 'todas') {
      result = result.filter(l => l.modality === selectedModality);
    }

    // 5. Distance
    if (currentUser.coordinates) {
      result = result.filter(l => {
        const d = calculateDistanceKm(
          currentUser.coordinates.lat,
          currentUser.coordinates.lng,
          l.location.coordinates.lat,
          l.location.coordinates.lng
        );
        return d <= maxDistanceKm;
      });
    }

    // 6. Sorting
    result.sort((a, b) => {
      if (sortBy === 'precio_asc') return a.price - b.price;
      if (sortBy === 'precio_desc') return b.price - a.price;
      if (sortBy === 'peso_kg') return b.weightKg - a.weightKg;
      if (sortBy === 'cercania' && currentUser.coordinates) {
        const dA = calculateDistanceKm(currentUser.coordinates.lat, currentUser.coordinates.lng, a.location.coordinates.lat, a.location.coordinates.lng);
        const dB = calculateDistanceKm(currentUser.coordinates.lat, currentUser.coordinates.lng, b.location.coordinates.lat, b.location.coordinates.lng);
        return dA - dB;
      }
      // default: recientes
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return result;
  }, [listings, searchQuery, selectedCategory, selectedCondition, selectedModality, maxDistanceKm, sortBy, currentUser]);

  // Reset all filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedCondition('todas');
    setSelectedModality('todas');
    setMaxDistanceKm(100);
    setSortBy('recientes');
  };

  // --- ACTIONS ---
  const handlePublishSuccess = (newListing: HardwareListing) => {
    setListings([newListing, ...listings]);
    setSelectedListingDetail(newListing);
  };

  const handleCreateOffer = (
    listing: HardwareListing,
    offerType: 'compra_precio' | 'contraoferta' | 'propuesta_trueque' | 'solicitud_donacion',
    amount?: number,
    tradeItem?: string,
    message?: string
  ) => {
    const newOffer: Offer = {
      id: `off-${Date.now()}`,
      listingId: listing.id,
      buyerId: currentUser.id,
      buyerName: currentUser.name,
      sellerId: listing.sellerId,
      offerType,
      proposedAmount: amount,
      proposedTradeItem: tradeItem,
      message: message || '',
      status: 'pendiente',
      createdAt: new Date().toISOString()
    };
    setOffers([newOffer, ...offers]);

    // Send or update chat thread
    let thread = threads.find(t => t.listingId === listing.id && t.buyerId === currentUser.id);
    const offerMsgText =
      offerType === 'contraoferta'
        ? `Propuesta de contraoferta: $${amount} USD. ${message}`
        : offerType === 'propuesta_trueque'
        ? `Propuesta de trueque: Ofrezco [${tradeItem}]. ${message}`
        : offerType === 'solicitud_donacion'
        ? `Solicitud de donación para reciclaje/estudio ($0). ${message}`
        : `Intención de compra confirmada a precio lista ($${amount} USD). ${message}`;

    const newChatMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      threadId: thread?.id || `th-${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      text: offerMsgText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isOfferNotification: true,
      offerDetails: {
        type: offerType,
        amount,
        status: 'pendiente'
      }
    };

    if (thread) {
      setThreads(threads.map(t => {
        if (t.id === thread!.id) {
          return {
            ...t,
            lastMessage: offerMsgText,
            lastMessageTime: newChatMessage.timestamp,
            messages: [...t.messages, newChatMessage]
          };
        }
        return t;
      }));
    } else {
      const newThread: ChatThread = {
        id: newChatMessage.threadId,
        listingId: listing.id,
        listingTitle: listing.title,
        listingPrice: listing.price,
        listingImage: listing.images[0] || '',
        listingModality: listing.modality,
        buyerId: currentUser.id,
        sellerId: listing.sellerId,
        otherUser: listing.seller,
        lastMessage: offerMsgText,
        lastMessageTime: newChatMessage.timestamp,
        unreadCount: 0,
        messages: [newChatMessage]
      };
      setThreads([newThread, ...threads]);
      setActiveThreadId(newThread.id);
    }
  };

  const handleSendMessage = (threadId: string, text: string) => {
    const thread = threads.find(t => t.id === threadId);
    if (!thread) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      threadId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setThreads(threads.map(t => {
      if (t.id === threadId) {
        return {
          ...t,
          lastMessage: text,
          lastMessageTime: newMsg.timestamp,
          messages: [...t.messages, newMsg]
        };
      }
      return t;
    }));

    // Simulate realistic automated response from the other user after 1.5 seconds if test user
    if (thread.otherUser.id !== currentUser.id) {
      setTimeout(() => {
        const replies = [
          '¡Hola! Sí, la pieza está lista para entrega y probada.',
          'De acuerdo, podemos coordinar la entrega en un punto público seguro.',
          'Perfecto, si traes tu equipo podemos encenderlo y testear la señal de vídeo.',
          'Recibido. Me parece una propuesta adecuada.'
        ];
        const randomReply = replies[Math.floor(Math.random() * replies.length)];
        const autoReply: ChatMessage = {
          id: `msg-rep-${Date.now()}`,
          threadId,
          senderId: thread.otherUser.id,
          senderName: thread.otherUser.name,
          text: randomReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setThreads(prev => prev.map(t => {
          if (t.id === threadId) {
            return {
              ...t,
              lastMessage: randomReply,
              lastMessageTime: autoReply.timestamp,
              messages: [...t.messages, autoReply]
            };
          }
          return t;
        }));
      }, 1400);
    }
  };

  const handleAcceptOfferInChat = (threadId: string) => {
    setThreads(threads.map(t => {
      if (t.id === threadId) {
        const updatedMsgs = t.messages.map(m => {
          if (m.isOfferNotification && m.offerDetails?.status === 'pendiente') {
            return {
              ...m,
              offerDetails: {
                ...m.offerDetails,
                status: 'aceptada'
              }
            };
          }
          return m;
        });
        return {
          ...t,
          messages: [
            ...updatedMsgs,
            {
              id: `msg-acc-${Date.now()}`,
              threadId,
              senderId: currentUser.id,
              senderName: currentUser.name,
              text: '¡Oferta aceptada! Procedamos a coordinar punto de encuentro y prueba.',
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          ]
        };
      }
      return t;
    }));
  };

  const handleRejectOfferInChat = (threadId: string) => {
    setThreads(threads.map(t => {
      if (t.id === threadId) {
        return {
          ...t,
          messages: [
            ...t.messages,
            {
              id: `msg-rej-${Date.now()}`,
              threadId,
              senderId: currentUser.id,
              senderName: currentUser.name,
              text: 'Agradezco la oferta pero el monto o propuesta no es suficiente en este momento.',
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          ]
        };
      }
      return t;
    }));
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col selection:bg-emerald-500 selection:text-neutral-950">
      {/* 1. Strict Top Bar Contract */}
      <Navbar
        currentUser={currentUser}
        allUsers={allUsers}
        onSelectUser={(u) => setCurrentUser(u)}
        onOpenPublish={() => setIsPublishModalOpen(true)}
        onOpenMessages={() => setIsMessagesDrawerOpen(true)}
        onOpenMap={() => setIsMapModalOpen(true)}
        onOpenEco={() => setIsEcoModalOpen(true)}
        onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
        unreadCount={totalUnread}
        activeSection="catalog"
        onNavigateSection={() => {}}
      />

      {/* 2. Hero Section */}
      <Hero
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        totalKgDiverted={totalEwasteDiverted}
        totalActiveListings={listings.length}
      />

      {/* 3. Main Marketplace Section */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Interactive Filter Toolbar */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Condition Segmented Control */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 bg-neutral-900 border border-neutral-800 rounded-xl">
              <span className="text-[11px] font-semibold text-neutral-400 px-2 py-1 uppercase tracking-wider hidden sm:inline">
                Estado:
              </span>
              {[
                { id: 'todas', label: 'Todos' },
                { id: 'funcionando', label: 'Funcionando 100%' },
                { id: 'para_piezas', label: 'Para Piezas' },
                { id: 'para_reciclaje', label: 'Para Reciclaje' }
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCondition(c.id)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                    selectedCondition === c.id
                      ? 'bg-neutral-800 text-emerald-400 font-semibold shadow-sm'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            {/* Modality Segmented Control */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 bg-neutral-900 border border-neutral-800 rounded-xl">
              <span className="text-[11px] font-semibold text-neutral-400 px-2 py-1 uppercase tracking-wider hidden sm:inline">
                Modalidad:
              </span>
              {[
                { id: 'todas', label: 'Todas' },
                { id: 'venta_fija', label: 'Precio Fijo' },
                { id: 'negociable', label: 'Negociable' },
                { id: 'intercambio', label: 'Trueque' },
                { id: 'donacion', label: 'Donación $0' }
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setSelectedModality(m.id)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                    selectedModality === m.id
                      ? 'bg-neutral-800 text-emerald-400 font-semibold shadow-sm'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Secondary Filter Bar: Distance & Sort */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-neutral-900 text-xs">
            {/* Distance Slider & Location */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-neutral-400">Radio de Cercanía:</span>
              <input
                type="range"
                min="5"
                max="200"
                step="5"
                value={maxDistanceKm}
                onChange={(e) => setMaxDistanceKm(Number(e.target.value))}
                className="w-28 sm:w-36 accent-emerald-400 cursor-pointer"
              />
              <span className="font-mono text-emerald-400 font-bold">≤ {maxDistanceKm} km</span>

              <button
                onClick={() => setIsMapModalOpen(true)}
                className="flex items-center gap-1 text-[11px] text-neutral-300 hover:text-emerald-400 bg-neutral-900 border border-neutral-800 hover:border-emerald-500/40 px-2 py-1 rounded-lg transition-colors"
                title="Ajustar ubicación o activar GPS en Google Maps"
              >
                <MapPin className="w-3 h-3 text-emerald-400" />
                <span className="truncate max-w-[130px] font-medium">{currentUser.city || 'Mendoza (Capital)'}</span>
              </button>
            </div>

            {/* Sorting and Reset */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-neutral-400">
                <ArrowUpDown className="w-3.5 h-3.5" />
                <span>Ordenar:</span>
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-neutral-900 border border-neutral-800 text-xs text-neutral-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-emerald-500"
              >
                <option value="recientes">Más recientes</option>
                <option value="precio_asc">Menor precio</option>
                <option value="precio_desc">Mayor precio</option>
                <option value="peso_kg">Mayor peso e-waste</option>
                <option value="cercania">Más cercanos a mí</option>
              </select>

              {(searchQuery || selectedCategory || selectedCondition !== 'todas' || selectedModality !== 'todas' || maxDistanceKm !== 100) && (
                <button
                  onClick={handleResetFilters}
                  className="flex items-center gap-1 text-neutral-400 hover:text-white transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restablecer</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Results Counter - Zero Pill standard format */}
        <div className="flex items-center justify-between mb-6 text-xs text-neutral-400">
          <div className="flex items-center gap-2">
            <span className="font-mono text-white font-bold">{filteredListings.length}</span>
            <span>componente(s) disponibles para transacción</span>
            {selectedCategory && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-emerald-400 capitalize">
                  {CATEGORIES_META.find(c => c.id === selectedCategory)?.name || selectedCategory}
                </span>
              </>
            )}
          </div>

          <button
            onClick={() => setIsMapModalOpen(true)}
            className="text-xs text-neutral-300 hover:text-emerald-400 transition-colors flex items-center gap-1"
          >
            <span>Ver mapa de ubicación</span>
          </button>
        </div>

        {/* Listings Grid: 3-column desktop / 2-column tablet */}
        {filteredListings.length === 0 ? (
          <div className="py-16 text-center space-y-3 bg-neutral-900/40 border border-neutral-800 rounded-2xl p-8">
            <Cpu className="w-12 h-12 text-neutral-600 mx-auto" />
            <h3 className="text-base font-semibold text-white">No se encontraron componentes con los filtros seleccionados</h3>
            <p className="text-xs text-neutral-400 max-w-md mx-auto">
              Prueba cambiando la categoría, ampliando el radio de kilómetros o restableciendo los filtros de búsqueda.
            </p>
            <button
              onClick={handleResetFilters}
              className="mt-2 px-4 py-2 text-xs font-semibold rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white transition-colors"
            >
              Restablecer Filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((listing) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                userLocation={currentUser.coordinates}
                onViewDetails={(l) => setSelectedListingDetail(l)}
                onContactSeller={(l) => {
                  handleCreateOffer(l, 'compra_precio', l.price, undefined, 'Hola, me interesa tu componente.');
                  setIsMessagesDrawerOpen(true);
                }}
                onMakeOffer={(l) => setSelectedListingDetail(l)}
              />
            ))}
          </div>
        )}
      </main>

      {/* 4. Footer with Responsible Recycling Trust & Links */}
      <footer className="mt-16 border-t border-neutral-800 bg-neutral-950 py-10 text-xs text-neutral-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-2 md:col-span-2">
              <div className="flex items-center gap-2 text-white font-semibold text-sm">
                <Cpu className="w-4 h-4 text-emerald-400" />
                <span className="font-display">RetroCycle Marketplace</span>
              </div>
              <p className="text-neutral-400 max-w-sm leading-relaxed">
                Plataforma dedicada a la preservación del patrimonio informático y la gestión responsable de residuos de aparatos eléctricos y electrónicos (RAEE).
              </p>
            </div>

            <div className="space-y-2">
              <p className="font-semibold text-neutral-200">Herramientas & Normativa</p>
              <ul className="space-y-1.5 text-neutral-400">
                <li><button onClick={() => setIsEcoModalOpen(true)} className="hover:text-emerald-400 transition-colors">Calculadora de Huella RAEE</button></li>
                <li><button onClick={() => setIsMapModalOpen(true)} className="hover:text-emerald-400 transition-colors">Puntos Limpios & Centros WEEE</button></li>
                <li><button onClick={() => setIsHowItWorksOpen(true)} className="hover:text-emerald-400 transition-colors">Guía de Seguridad y Pruebas</button></li>
              </ul>
            </div>

            <div className="space-y-2">
              <p className="font-semibold text-neutral-200">Comunidad & Ayuda</p>
              <ul className="space-y-1.5 text-neutral-400">
                <li><button onClick={() => setIsHowItWorksOpen(true)} className="hover:text-emerald-400 transition-colors">Cómo Funciona RetroCycle</button></li>
                <li><button onClick={() => setIsPublishModalOpen(true)} className="hover:text-emerald-400 transition-colors">Publicar Hardware o Chatarra</button></li>
                <li><button onClick={() => setIsHowItWorksOpen(true)} className="hover:text-emerald-400 transition-colors">Donaciones a Recicladores RAEE</button></li>
              </ul>
            </div>
          </div>

          <div className="pt-6 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-500">
            <p>© 2026 RetroCycle. Plataforma comunitaria para economía circular y preservación de hardware clásico.</p>
            <div className="flex items-center gap-4">
              <span>Economía Circular de Hardware</span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-500 font-medium">Compromiso Cero Vertedero</span>
            </div>
          </div>
        </div>
      </footer>

      {/* --- MODALS & DRAWERS --- */}
      {selectedListingDetail && (
        <ListingDetailModal
          listing={selectedListingDetail}
          currentUser={currentUser}
          onClose={() => setSelectedListingDetail(null)}
          onSubmitOffer={handleCreateOffer}
          onOpenChat={(l) => {
            setSelectedListingDetail(null);
            setIsMessagesDrawerOpen(true);
          }}
          onViewSellerProfile={(seller) => {
            setSelectedListingDetail(null);
            setSelectedProfileUser(seller);
          }}
        />
      )}

      {isPublishModalOpen && (
        <PublishModal
          currentUser={currentUser}
          onClose={() => setIsPublishModalOpen(false)}
          onPublishSuccess={handlePublishSuccess}
        />
      )}

      {isMessagesDrawerOpen && (
        <MessagingDrawer
          threads={threads}
          activeThreadId={activeThreadId}
          onSelectThread={(id) => setActiveThreadId(id)}
          onSendMessage={handleSendMessage}
          onAcceptOffer={handleAcceptOfferInChat}
          onRejectOffer={handleRejectOfferInChat}
          currentUser={currentUser}
          onClose={() => setIsMessagesDrawerOpen(false)}
        />
      )}

      {isMapModalOpen && (
        <MapLocatorModal
          listings={listings}
          currentUser={currentUser}
          onClose={() => setIsMapModalOpen(false)}
          onSelectListing={(l) => setSelectedListingDetail(l)}
          onUpdateLocation={(coords, cityName) => {
            setCurrentUser(prev => ({
              ...prev,
              city: cityName || prev.city,
              coordinates: coords
            }));
          }}
        />
      )}

      {isEcoModalOpen && (
        <EcoCalculatorModal onClose={() => setIsEcoModalOpen(false)} />
      )}

      {isHowItWorksOpen && (
        <HowItWorksModal
          onClose={() => setIsHowItWorksOpen(false)}
          onOpenPublish={() => setIsPublishModalOpen(true)}
        />
      )}

      {selectedProfileUser && (
        <UserProfileModal
          user={selectedProfileUser}
          onClose={() => setSelectedProfileUser(null)}
          onContactUser={(u) => {
            setSelectedProfileUser(null);
            setIsMessagesDrawerOpen(true);
          }}
        />
      )}
    </div>
  );
}
