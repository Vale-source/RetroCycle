export type HardwareCategory =
  | 'placas_madre'
  | 'memorias_ram'
  | 'tarjetas_graficas'
  | 'discos_almacenamiento'
  | 'fuentes_poder'
  | 'monitores_crt_lcd'
  | 'laptops_completas'
  | 'procesadores_cpu'
  | 'perifericos_vintage'
  | 'lotes_reciclaje';

export type HardwareCondition =
  | 'funcionando'      // 100% operativo verificado
  | 'para_piezas'      // Averiado o incompleto, útil para repuestos
  | 'para_reciclaje';  // Scrap electrónico para extracción de metales

export type TransactionModality =
  | 'venta_fija'       // Venta con precio establecido
  | 'negociable'       // Abierto a ofertas
  | 'intercambio'      // Trueque / Swap por otro componente
  | 'donacion';        // Gratis para reciclador o estudiante ($0)

export type UserRole = 'vendedor' | 'comprador' | 'reciclador';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  city: string;
  country: string;
  coordinates: { lat: number; lng: number };
  rating: number;
  reviewCount: number;
  completedDeals: number;
  eWasteDivertedKg: number;
  isVerified: boolean;
  memberSince: string;
  badge?: string;
  bio: string;
}

export interface HardwareListing {
  id: string;
  title: string;
  category: HardwareCategory;
  condition: HardwareCondition;
  modality: TransactionModality;
  price: number; // 0 if donacion or intercambio
  currency: string;
  allowOffers: boolean;
  tradePreferences?: string;
  description: string;
  brand: string;
  model: string;
  yearEstimated: number;
  weightKg: number;
  images: string[];
  specs: Record<string, string>;
  testedNotes?: string;
  status: 'disponible' | 'en_negociacion' | 'reservado' | 'vendido' | 'reciclado';
  sellerId: string;
  seller: User;
  location: {
    city: string;
    neighborhood: string;
    coordinates: { lat: number; lng: number };
  };
  createdAt: string;
  views: number;
  favoriteCount: number;
}

export interface Offer {
  id: string;
  listingId: string;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  offerType: 'compra_precio' | 'contraoferta' | 'propuesta_trueque' | 'solicitud_donacion';
  proposedAmount?: number;
  proposedTradeItem?: string;
  message: string;
  status: 'pendiente' | 'aceptada' | 'rechazada' | 'contraofertada';
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  threadId: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  isOfferNotification?: boolean;
  offerDetails?: {
    type: string;
    amount?: number;
    status: string;
  };
}

export interface ChatThread {
  id: string;
  listingId: string;
  listingTitle: string;
  listingPrice: number;
  listingImage: string;
  listingModality: TransactionModality;
  buyerId: string;
  sellerId: string;
  otherUser: User;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: ChatMessage[];
}

export interface Review {
  id: string;
  fromUserId: string;
  fromUserName: string;
  fromUserAvatar: string;
  toUserId: string;
  rating: number;
  comment: string;
  listingTitle: string;
  date: string;
  roleContext: string;
}

export interface EcoStats {
  totalHardwareDivertedKg: number;
  totalCO2AvoidedKg: number;
  totalCopperReclaimedKg: number;
  totalGoldGramsReclaimed: number;
  activeListingsCount: number;
  verifiedRecyclersCount: number;
}
