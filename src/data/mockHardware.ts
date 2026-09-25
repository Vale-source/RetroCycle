import { HardwareListing, User, Review } from '../types/marketplace';

export const MOCK_USERS: User[] = [
  {
    id: 'user-seller-1',
    name: 'Carlos Mendoza',
    email: 'carlos.retrotech@email.com',
    role: 'vendedor',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    city: 'Mendoza (Capital)',
    country: 'Argentina',
    coordinates: { lat: -32.8895, lng: -68.8458 },
    rating: 4.9,
    reviewCount: 38,
    completedDeals: 44,
    eWasteDivertedKg: 165.4,
    isVerified: true,
    memberSince: 'Marzo 2023',
    badge: 'Restaurador Retro Certificado',
    bio: 'Coleccionista de microinformática de los 90s y técnico aficionado en cambio de condensadores electrolíticos.'
  },
  {
    id: 'user-buyer-1',
    name: 'Elena Ramos',
    email: 'elena.gamer90s@email.com',
    role: 'comprador',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    city: 'Godoy Cruz',
    country: 'Argentina',
    coordinates: { lat: -32.9250, lng: -68.8400 },
    rating: 4.8,
    reviewCount: 14,
    completedDeals: 16,
    eWasteDivertedKg: 42.0,
    isVerified: true,
    memberSince: 'Noviembre 2023',
    badge: 'Comprador Confiable',
    bio: 'Armando una estación MS-DOS y Windows 98 SE para preservación de videojuegos clásicos y demoscene.'
  },
  {
    id: 'user-recycler-1',
    name: 'EcoCircuito Reciclaje Tecnológico',
    email: 'contacto@ecocircuito.org',
    role: 'reciclador',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    city: 'Guaymallén',
    country: 'Argentina',
    coordinates: { lat: -32.8980, lng: -68.8100 },
    rating: 5.0,
    reviewCount: 92,
    completedDeals: 128,
    eWasteDivertedKg: 1420.5,
    isVerified: true,
    memberSince: 'Enero 2022',
    badge: 'Gestor RAEE Autorizado (WEEE)',
    bio: 'Planta de acopio y desensamble de chatarra electrónica en Gran Mendoza. Separamos metales preciosos (oro, cobre) y gestionamos residuos peligrosos según normativa ambiental.'
  }
];

export const CATEGORIES_META = [
  { id: 'placas_madre', name: 'Placas Madre', icon: 'Cpu' },
  { id: 'tarjetas_graficas', name: 'Tarjetas Gráficas (GPU)', icon: 'MonitorPlay' },
  { id: 'procesadores_cpu', name: 'Procesadores (CPU)', icon: 'Microchip' },
  { id: 'memorias_ram', name: 'Memorias RAM', icon: 'Layers' },
  { id: 'monitores_crt_lcd', name: 'Monitores CRT / LCD Vintage', icon: 'Tv' },
  { id: 'discos_almacenamiento', name: 'Almacenamiento (IDE / SCSI)', icon: 'HardDrive' },
  { id: 'laptops_completas', name: 'Laptops Clásicas', icon: 'Laptop' },
  { id: 'fuentes_poder', name: 'Fuentes de Poder (AT / ATX antiguo)', icon: 'Zap' },
  { id: 'perifericos_vintage', name: 'Periféricos Retro', icon: 'Keyboard' },
  { id: 'lotes_reciclaje', name: 'Lotes para Reciclaje / Scrap', icon: 'Recycle' }
];

export const MOCK_LISTINGS: HardwareListing[] = [
  {
    id: 'hw-001',
    title: 'Tarjeta Gráfica 3dfx Voodoo3 3000 AGP 16MB',
    category: 'tarjetas_graficas',
    condition: 'funcionando',
    modality: 'venta_fija',
    price: 85,
    currency: 'USD',
    allowOffers: true,
    description: 'Aceleradora 3D legendaria para Glide y DirectX 6. Disipador de calor pasivo original de cobre intacto. Probada extensamente con Unreal Tournament y Quake II en Windows 98. Salida VGA cristalina.',
    brand: '3dfx Interactive',
    model: 'Voodoo3 3000 AGP',
    yearEstimated: 1999,
    weightKg: 0.38,
    images: [
      'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80'
    ],
    specs: {
      'Interfaz': 'AGP 2x/4x',
      'Memoria VRAM': '16 MB SDRAM 166 MHz',
      'Fillrate': '333 Megapixels/segundo',
      'Salidas de Vídeo': 'VGA (DB-15) análogo',
      'Drivers recomendados': 'Voodoo3 Driver Kit 1.07'
    },
    testedNotes: '100% testeada con 3DMark 99 MAX durante 2 horas. Temperaturas normales.',
    status: 'disponible',
    sellerId: 'user-seller-1',
    seller: MOCK_USERS[0],
    location: {
      city: 'Mendoza (Capital)',
      neighborhood: 'Microcentro (Plaza Independencia)',
      coordinates: { lat: -32.8895, lng: -68.8458 }
    },
    createdAt: '2026-09-20T14:30:00Z',
    views: 142,
    favoriteCount: 19
  },
  {
    id: 'hw-002',
    title: 'Placa Madre Asus P3B-F Slot 1 Intel 440BX',
    category: 'placas_madre',
    condition: 'funcionando',
    modality: 'negociable',
    price: 70,
    currency: 'USD',
    allowOffers: true,
    description: 'La reina de las placas para Pentium II / Pentium III. Chipset Intel 440BX con 6 ranuras PCI, 1 AGP y 1 ISA. Condensadores electrolíticos revisados con medidor ESR y pila CR2032 nueva colocada.',
    brand: 'ASUS',
    model: 'P3B-F Rev 1.04',
    yearEstimated: 1999,
    weightKg: 0.85,
    images: [
      'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80'
    ],
    specs: {
      'Socket': 'Slot 1 (SECC / SECC2)',
      'Chipset': 'Intel 82440BX AGPset',
      'Slots de Memoria': '4x DIMM SDRAM (Hasta 1GB)',
      'Puertos': '1x AGP, 6x PCI, 1x ISA, 2x IDE Ultra DMA/33',
      'Form Factor': 'ATX estándar'
    },
    testedNotes: 'Postea y bootea MS-DOS 6.22 sin errores de paridad.',
    status: 'disponible',
    sellerId: 'user-seller-1',
    seller: MOCK_USERS[0],
    location: {
      city: 'Godoy Cruz',
      neighborhood: 'Plaza Godoy Cruz / San Martín Sur',
      coordinates: { lat: -32.9250, lng: -68.8400 }
    },
    createdAt: '2026-09-18T10:15:00Z',
    views: 204,
    favoriteCount: 26
  },
  {
    id: 'hw-003',
    title: 'Lote de 18 Placas Madre y GPUs Avereadas para Reciclaje / Extracción',
    category: 'lotes_reciclaje',
    condition: 'para_reciclaje',
    modality: 'donacion',
    price: 0,
    currency: 'USD',
    allowOffers: false,
    description: 'Lote de chatarra electrónica limpia proveniente de taller cerrado. Contiene 10 tarjetas madre socket 370/462/478 con pistas dañadas y 8 tarjetas gráficas con artefactos severos. Ideal para gestores de reciclaje RAEE, extracción pirometalúrgica de oro en contactos o práctica de desoldado.',
    brand: 'Varios (Gigabyte, MSI, ECS)',
    model: 'Lote Mixto E-Waste',
    yearEstimated: 2002,
    weightKg: 14.2,
    images: [
      'https://images.unsplash.com/photo-1603732551681-2e91159b9dc2?w=800&auto=format&fit=crop&q=80'
    ],
    specs: {
      'Peso Total': '14.2 Kilogramos certificados',
      'Contenido': '10 Motherboards ATX + 8 GPUs AGP/PCI-e',
      'Materiales': 'FR4, cobre, contactos chapados en oro, aluminio',
      'Destino previsto': 'Reciclaje ecológico o recuperación de metales'
    },
    testedNotes: 'Artículos NO funcionales. Se donan para evitar vertedero.',
    status: 'disponible',
    sellerId: 'user-seller-1',
    seller: MOCK_USERS[0],
    location: {
      city: 'Guaymallén',
      neighborhood: 'Zona Industrial / San José',
      coordinates: { lat: -32.8980, lng: -68.8100 }
    },
    createdAt: '2026-09-21T08:00:00Z',
    views: 89,
    favoriteCount: 11
  },
  {
    id: 'hw-004',
    title: 'Monitor CRT Sony Trinitron Multiscan 200ES 17 Pulgadas',
    category: 'monitores_crt_lcd',
    condition: 'funcionando',
    modality: 'intercambio',
    price: 0,
    currency: 'USD',
    allowOffers: true,
    tradePreferences: 'Intercambio por tarjeta de sonido Sound Blaster AWE32 / AWE64 Gold ISA o placa socket 7',
    description: 'Tubo de apertura de rejilla Sony FD Trinitron con geometría impecable. Soporta 1280x1024 a 60Hz y 1024x768 a 85Hz. Colores vivos con negros profundos insuperables por LCD. No realizo envíos por peso y fragilidad; entrega en mano.',
    brand: 'Sony',
    model: 'Multiscan 200ES',
    yearEstimated: 1998,
    weightKg: 19.5,
    images: [
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80'
    ],
    specs: {
      'Tamaño Pantalla': '17 pulgadas visible (16.0" real)',
      'Tecnología Tubo': 'Trinitron Aperture Grille (0.25mm pitch)',
      'Resolución Máxima': '1280 x 1024 a 65 Hz',
      'Conector': 'VGA D-Sub 15 pines integrado',
      'Consumo': '115 Watts'
    },
    testedNotes: 'Sin quemaduras de fósforo. Foco y convergencia ajustados.',
    status: 'disponible',
    sellerId: 'user-seller-1',
    seller: MOCK_USERS[0],
    location: {
      city: 'Mendoza (Capital)',
      neighborhood: 'Quinta Sección / Parque Gral. San Martín',
      coordinates: { lat: -32.8870, lng: -68.8630 }
    },
    createdAt: '2026-09-19T18:40:00Z',
    views: 310,
    favoriteCount: 45
  },
  {
    id: 'hw-005',
    title: 'Kit 4x 128MB SDRAM PC133 CL3 Kingston ValueRAM',
    category: 'memorias_ram',
    condition: 'funcionando',
    modality: 'venta_fija',
    price: 24,
    currency: 'USD',
    allowOffers: true,
    description: 'Total de 512MB repartidos en 4 módulos coincidentes de 16 chips (baja densidad compatible con chipsets Intel 440BX y VIA Apollo Pro). Contactos limpios con alcohol isopropílico.',
    brand: 'Kingston',
    model: 'KVR133X64C3/128',
    yearEstimated: 2001,
    weightKg: 0.12,
    images: [
      'https://images.unsplash.com/photo-1541029071515-84cc54f84dc5?w=800&auto=format&fit=crop&q=80'
    ],
    specs: {
      'Tipo de Memoria': 'SDRAM DIMM 168 pines',
      'Capacidad por módulo': '128 MB (Total kit 512 MB)',
      'Velocidad': 'PC133 (133 MHz)',
      'Latencia CAS': 'CL3',
      'Voltaje': '3.3V'
    },
    testedNotes: 'Testeadas con MemTest86 v4.37 durante 4 pasadas completas con 0 errores.',
    status: 'disponible',
    sellerId: 'user-seller-1',
    seller: MOCK_USERS[0],
    location: {
      city: 'Godoy Cruz',
      neighborhood: 'Las Tortugas / Trapiche',
      coordinates: { lat: -32.9420, lng: -68.8350 }
    },
    createdAt: '2026-09-21T11:20:00Z',
    views: 75,
    favoriteCount: 8
  },
  {
    id: 'hw-006',
    title: 'Laptop IBM ThinkPad 600X (Pentium III 500MHz) - Para Piezas',
    category: 'laptops_completas',
    condition: 'para_piezas',
    modality: 'negociable',
    price: 35,
    currency: 'USD',
    allowOffers: true,
    description: 'Chasis de aleación de titanio y magnesio. La pantalla LCD TFT de 13.3" y el famoso teclado mecánico tipo tijera están en excelente condición física. La placa no enciende (sospecho corto en circuito de carga DC-IN). Incluye caddy de disco duro y unidad UltraBay CD-ROM.',
    brand: 'IBM',
    model: 'ThinkPad 600X (Tipo 2645)',
    yearEstimated: 2000,
    weightKg: 2.7,
    images: [
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80'
    ],
    specs: {
      'CPU': 'Intel Mobile Pentium III 500 MHz',
      'Pantalla': '13.3" XGA TFT (1024x768)',
      'RAM instalada': '64 MB soldada + slot SO-DIMM libre',
      'Estado': 'No enciende, sin cargador ni disco duro IDE',
      'Ideal para': 'Recuperación de teclado, bisagras, caddy o carcasa'
    },
    testedNotes: 'Sin sulfatación en pines de batería. Placa madre no da POST.',
    status: 'disponible',
    sellerId: 'user-seller-1',
    seller: MOCK_USERS[0],
    location: {
      city: 'Las Heras',
      neighborhood: 'El Challao / Panamericana',
      coordinates: { lat: -32.8550, lng: -68.8450 }
    },
    createdAt: '2026-09-17T09:00:00Z',
    views: 240,
    favoriteCount: 33
  },
  {
    id: 'hw-007',
    title: 'Disco Duro Quantum Fireball lct15 20.4GB IDE ATA-66',
    category: 'discos_almacenamiento',
    condition: 'funcionando',
    modality: 'venta_fija',
    price: 18,
    currency: 'USD',
    allowOffers: false,
    description: 'Disco duro mecánico clásico de 3.5 pulgadas. Sonido retro característico de cabezales paso a paso. Formateado en FAT32 sin sectores defectuosos (S.M.A.R.T. limpio).',
    brand: 'Quantum',
    model: 'Fireball lct15 (LB20A011)',
    yearEstimated: 2000,
    weightKg: 0.55,
    images: [
      'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800&auto=format&fit=crop&q=80'
    ],
    specs: {
      'Capacidad': '20.4 GB',
      'Interfaz': 'Ultra ATA/66 (IDE 40 pines)',
      'Velocidad de rotación': '4500 RPM',
      'Buffer Cache': '512 KB',
      'Factor de forma': '3.5 pulgadas'
    },
    testedNotes: 'Comprobado con MHDD y Scandisk. 0 sectores reasignados.',
    status: 'disponible',
    sellerId: 'user-seller-1',
    seller: MOCK_USERS[0],
    location: {
      city: 'Mendoza (Capital)',
      neighborhood: 'Barrio Cívico / Casa de Gobierno',
      coordinates: { lat: -32.8985, lng: -68.8475 }
    },
    createdAt: '2026-09-19T12:00:00Z',
    views: 112,
    favoriteCount: 14
  },
  {
    id: 'hw-008',
    title: 'Procesador Intel Pentium III 800MHz Coppermine Slot 1 (133MHz FSB)',
    category: 'procesadores_cpu',
    condition: 'funcionando',
    modality: 'negociable',
    price: 45,
    currency: 'USD',
    allowOffers: true,
    description: 'CPU en cartucho SECC2 con disipador y ventilador original Intel. Núcleo Coppermine de 0.18 micras con 256KB de caché L2 a velocidad completa de reloj.',
    brand: 'Intel',
    model: 'Pentium III 800/256/133/1.65V (SL4CD)',
    yearEstimated: 2000,
    weightKg: 0.22,
    images: [
      'https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=800&auto=format&fit=crop&q=80'
    ],
    specs: {
      'Frecuencia Base': '800 MHz',
      'Front Side Bus': '133 MHz',
      'Caché L2': '256 KB Advanced Transfer Cache',
      'Empaquetado': 'Slot 1 SECC2',
      'Voltaje Vcore': '1.65 V'
    },
    testedNotes: 'Estable en Prime95 durante 1 hora bajo Windows 2000.',
    status: 'disponible',
    sellerId: 'user-seller-1',
    seller: MOCK_USERS[0],
    location: {
      city: 'Luján de Cuyo',
      neighborhood: 'Chacras de Coria',
      coordinates: { lat: -33.0030, lng: -68.8780 }
    },
    createdAt: '2026-09-21T16:30:00Z',
    views: 94,
    favoriteCount: 12
  }
];

export const MOCK_REVIEWS: Review[] = [
  {
    id: 'rev-01',
    fromUserId: 'user-buyer-1',
    fromUserName: 'Elena Ramos',
    fromUserAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    toUserId: 'user-seller-1',
    rating: 5,
    comment: 'Compré la Voodoo3 para mi rig retro. Venía empacada en bolsa antiestática con burbuja protectora y arrancó a la primera en Glide. Excelente trato y conocimientos técnicos.',
    listingTitle: 'Tarjeta Gráfica 3dfx Voodoo3 3000 AGP',
    date: 'Hace 4 días',
    roleContext: 'Comprador verificado'
  },
  {
    id: 'rev-02',
    fromUserId: 'user-recycler-1',
    fromUserName: 'EcoCircuito Reciclaje Tecnológico',
    fromUserAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    toUserId: 'user-seller-1',
    rating: 5,
    comment: 'Nos donó un lote de 20 kg de fuentes averiadas y placas sin salvamento. Desoldamos y canalizamos los metales a refinería autorizada. Un usuario ejemplar con la ecología.',
    listingTitle: 'Lote de Fuentes y Chatarra Electrónica',
    date: 'Hace 2 semanas',
    roleContext: 'Gestor RAEE'
  }
];
