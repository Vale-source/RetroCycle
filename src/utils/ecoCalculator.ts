// Ecological Impact Calculation Utility
// Grounded in WEEE (Waste from Electrical and Electronic Equipment) and EPA life-cycle data

export interface ImpactBreakdown {
  co2SavedKg: number;
  copperGrams: number;
  goldMilligrams: number;
  hazardousMetalsDivertedGrams: number;
  treesEquivalent: number;
}

export function calculateEcologicalImpact(weightKg: number, category?: string): ImpactBreakdown {
  // Category multiplier for precious metal density
  let multiplier = 1.0;
  if (category === 'tarjetas_graficas' || category === 'placas_madre' || category === 'procesadores_cpu') {
    multiplier = 1.6; // High precious metal / copper density in chips and PCBs
  } else if (category === 'memorias_ram') {
    multiplier = 2.2; // Gold-plated edge connectors
  } else if (category === 'lotes_reciclaje') {
    multiplier = 1.8;
  } else if (category === 'monitores_crt_lcd') {
    multiplier = 0.8; // Heavy glass and plastics, high lead containment value
  }

  // 1 kg of hardware reuse/recycling saves approx 1.45 kg of CO2 equivalent emissions
  const co2SavedKg = Number((weightKg * 1.45 * multiplier).toFixed(2));
  // Average copper recovery: ~120 grams per kg of electronics
  const copperGrams = Math.round(weightKg * 120 * multiplier);
  // Average gold recovery: ~250 mg per kg of vintage computing PCBs/CPUs
  const goldMilligrams = Math.round(weightKg * 250 * multiplier);
  // Toxic / heavy metals kept out of landfill (Lead, Brominated Flame Retardants, Cadmium): ~35g/kg
  const hazardousMetalsDivertedGrams = Math.round(weightKg * 35);
  // 1 tree absorbs ~22 kg CO2 per year
  const treesEquivalent = Number((co2SavedKg / 22).toFixed(1));

  return {
    co2SavedKg,
    copperGrams,
    goldMilligrams,
    hazardousMetalsDivertedGrams,
    treesEquivalent,
  };
}
