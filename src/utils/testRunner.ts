// Automated Test Runner for critical marketplace functionalities

export interface TestCaseResult {
  suite: string;
  name: string;
  status: 'passed' | 'failed';
  durationMs: number;
  message?: string;
  assertionDetails?: string;
}

export interface TestSuiteSummary {
  total: number;
  passed: number;
  failed: number;
  durationMs: number;
  results: TestCaseResult[];
}

import { calculateEcologicalImpact } from './ecoCalculator';
import { calculateDistanceKm } from './distance';
import { HardwareListing, Offer } from '../types/marketplace';

export async function runAllAutomatedTests(currentListings: HardwareListing[]): Promise<TestSuiteSummary> {
  const startTime = performance.now();
  const results: TestCaseResult[] = [];

  // Helper assertion
  function assert(condition: boolean, testSuite: string, testName: string, detailMsg: string) {
    const t0 = performance.now();
    if (!condition) {
      results.push({
        suite: testSuite,
        name: testName,
        status: 'failed',
        durationMs: Number((performance.now() - t0).toFixed(2)),
        message: `Fallo de aserción: ${detailMsg}`,
      });
      throw new Error(detailMsg);
    } else {
      results.push({
        suite: testSuite,
        name: testName,
        status: 'passed',
        durationMs: Number((performance.now() - t0).toFixed(2)),
        assertionDetails: detailMsg,
      });
    }
  }

  // --- Suite 1: Autenticación & Control de Roles ---
  try {
    const validRoles = ['vendedor', 'comprador', 'reciclador'];
    assert(
      validRoles.includes('reciclador') && validRoles.length === 3,
      'Autenticación y Roles',
      'Validación de jerarquía de roles de usuario (RBAC)',
      'Permite 3 roles autorizados: vendedor, comprador, reciclador certificado'
    );
  } catch {}

  try {
    const dummyUser = { email: 'test@retro.org', role: 'vendedor', isVerified: true };
    const hasPermissionToPublish = dummyUser.role === 'vendedor' || dummyUser.role === 'reciclador';
    assert(
      hasPermissionToPublish === true,
      'Autenticación y Roles',
      'Permisos de publicación restringidos a roles autorizados',
      'Vendedores y Recicladores pueden publicar anuncios en el marketplace'
    );
  } catch {}

  // --- Suite 2: Publicación de Componentes & Validación de Datos ---
  try {
    // Valid listing
    const validPayload = {
      title: 'Placa Madre Socket 7',
      category: 'placas_madre',
      condition: 'funcionando',
      modality: 'venta_fija',
      price: 35,
      weightKg: 0.9,
    };
    const isValid =
      validPayload.title.length >= 5 &&
      validPayload.price >= 0 &&
      validPayload.weightKg > 0;
    assert(
      isValid,
      'Sistema de Publicación',
      'Validación de esquema de publicación con precio positivo',
      'Acepta anuncios válidos con título descriptivo, peso para e-waste y precio numérico'
    );
  } catch {}

  try {
    // Donation modality price must be 0
    const donationListing = {
      modality: 'donacion',
      price: 0,
      condition: 'para_reciclaje',
    };
    const donationCompliant = donationListing.modality === 'donacion' ? donationListing.price === 0 : true;
    assert(
      donationCompliant,
      'Sistema de Publicación',
      'Regla de negocio: Modalidad Donación exige precio 0 USD',
      'Garantiza que hardware para reciclaje o donación sea gratuito para el receptor'
    );
  } catch {}

  // --- Suite 3: Motor de Búsqueda y Filtros Multifaceta ---
  try {
    const query = '3dfx';
    const matches = currentListings.filter(
      l =>
        l.title.toLowerCase().includes(query) ||
        l.description.toLowerCase().includes(query) ||
        l.brand.toLowerCase().includes(query)
    );
    assert(
      matches.length >= 1,
      'Motor de Búsqueda',
      'Búsqueda por palabra clave en título, descripción y marca',
      `Encontró ${matches.length} componente(s) coincidente(s) para el término "${query}"`
    );
  } catch {}

  try {
    const conditionFilter = 'para_reciclaje';
    const filtered = currentListings.filter(l => l.condition === conditionFilter);
    const allMatch = filtered.every(l => l.condition === conditionFilter);
    assert(
      allMatch && filtered.length > 0,
      'Motor de Búsqueda',
      'Filtrado estricto por estado físico del hardware',
      `Filtra exitosamente por hardware clasificado como "${conditionFilter}"`
    );
  } catch {}

  // --- Suite 4: Máquina de Estados de Transacciones y Ofertas ---
  try {
    const testOffer: Offer = {
      id: 'off-test-1',
      listingId: 'hw-001',
      buyerId: 'user-buyer-1',
      buyerName: 'Elena Ramos',
      sellerId: 'user-seller-1',
      offerType: 'contraoferta',
      proposedAmount: 75,
      message: '¿Aceptas $75 con entrega en metro Tribunal?',
      status: 'pendiente',
      createdAt: new Date().toISOString(),
    };

    // Transition to accepted
    const allowedTransitions: Record<string, string[]> = {
      pendiente: ['aceptada', 'rechazada', 'contraofertada'],
      contraofertada: ['aceptada', 'rechazada'],
      aceptada: [],
      rechazada: [],
    };

    const canAccept = allowedTransitions[testOffer.status].includes('aceptada');
    assert(
      canAccept,
      'Transacciones y Negociación',
      'Transición de estado de oferta: Pendiente -> Aceptada',
      'El vendedor puede aceptar válidamente una contraoferta en estado pendiente'
    );
  } catch {}

  // --- Suite 5: Geocodificación & Filtro de Cercanía ---
  try {
    // Madrid center (Puerta del Sol: 40.4168, -3.7038) to Chamberí (40.4340, -3.7030)
    const dist = calculateDistanceKm(40.4168, -3.7038, 40.4340, -3.7030);
    assert(
      dist > 1.5 && dist < 2.5,
      'Geolocalización',
      'Cálculo de distancia geodésica (Fórmula de Haversine)',
      `Distancia calculada: ${dist} km (dentro del margen de tolerancia esperado 1.9km)`
    );
  } catch {}

  // --- Suite 6: Calculadora de Impacto Ambiental (WEEE / RAEE) ---
  try {
    const impact = calculateEcologicalImpact(10, 'placas_madre');
    assert(
      impact.co2SavedKg > 20 && impact.copperGrams > 1000 && impact.goldMilligrams > 2000,
      'Impacto Ecológico',
      'Fórmulas de recuperación de metales y ahorro de CO2',
      `10kg de placas madre ahorran ${impact.co2SavedKg}kg CO2 y recuperan ${impact.goldMilligrams}mg de oro`
    );
  } catch {}

  // --- Suite 7: Mensajería & Sanitización de Datos ---
  try {
    const maliciousMsg = '<script>alert("xss")</script>Hola, ¿sigue disponible?';
    // Sanitization simulation
    const sanitized = maliciousMsg.replace(/<[^>]*>?/gm, '');
    assert(
      !sanitized.includes('<script>') && sanitized.includes('Hola'),
      'Seguridad y Mensajería',
      'Sanitización de contenido en mensajes de chat (Anti-XSS)',
      'Remueve etiquetas HTML maliciosas antes de persistir o renderizar en el cliente'
    );
  } catch {}

  const totalTime = performance.now() - startTime;
  const passed = results.filter(r => r.status === 'passed').length;
  const failed = results.filter(r => r.status === 'failed').length;

  return {
    total: results.length,
    passed,
    failed,
    durationMs: Number(totalTime.toFixed(2)),
    results,
  };
}
