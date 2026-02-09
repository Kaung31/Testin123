// Pure Electric Parts & Warranty Database
// Source: Official Pure Electric Documentation

export const warrantyData = [
  {
    sku: 'PSPUR0029-0001',
    description: 'Left Hand Brake Lever and Bell (for indicator)',
    category: 'Brake System',
    included: 'E1 error, brake light doesn\'t function when the lever is pulled (and the light & MCU have been confirmed as functioning)',
    excluded: 'Any part of the brake is damaged, missing or broken',
    terms: 'Warrantable for 1 year',
    relatedErrors: ['E1']
  },
  {
    sku: 'PSPUR0030-0001',
    description: 'Indicator Switch and grub screws',
    category: 'Electrical',
    included: 'The indicator switch is considered nonfunctional. It fails to activate the corresponding turn signals when engaged, does not return to its neutral position after use, activates the incorrect signal, or responds intermittently',
    excluded: 'Cable damage and cosmetic damage (arrows rubbed off)',
    terms: 'Warrantable for 1 year',
    relatedErrors: []
  },
  {
    sku: 'PSPUR0031-0001',
    description: 'Throttle (plastic core)',
    category: 'Controls',
    included: 'E2 error or unresponsive/delayed response',
    excluded: 'If the throttle has been put under an extensive amount of pressure causing it to snap, spin or seize. Crash damage is also not covered',
    terms: 'Warrantable for 1 year',
    relatedErrors: ['E2']
  },
  {
    sku: 'PSPUR0031-0002',
    description: 'Throttle (metal core)',
    category: 'Controls',
    included: 'E2 error or unresponsive/delayed response',
    excluded: 'If the throttle has been put under an extensive amount of pressure causing it to snap, spin or seize. Crash damage is also not covered',
    terms: 'Warrantable for 1 year',
    relatedErrors: ['E2']
  },
  {
    sku: 'PSPUR0034-0001',
    description: 'VCU Display',
    category: 'Electronics',
    included: 'E3 error or non functional (if VCU display cable and MCU are both functional)',
    excluded: 'Any cosmetic damage such as scratches, dents and residue on display. Any cut or crushed cables under display',
    terms: 'Warrantable for 1 year',
    relatedErrors: ['E3']
  },
  {
    sku: 'PSPUR0037-0001',
    description: 'Front light assembly',
    category: 'Lighting',
    included: 'The front light fails to illuminate when activated',
    excluded: 'Damaged, components missing or broken cable/plug',
    terms: 'Warrantable for 1 year',
    relatedErrors: []
  },
  {
    sku: 'PSPUR0050-0001',
    description: 'Tyre (front/rear)',
    category: 'Wheels',
    included: 'N/A',
    excluded: 'Wear and tear / Punctures',
    terms: 'Non-warrantable item',
    relatedErrors: []
  },
  {
    sku: 'PSPUR0071-0001',
    description: '36v 7.5Ah 30km Battery and foam',
    category: 'Battery',
    included: 'E4, E5, E6 and E13 errors. Failure of the battery, non functional or not holding charge',
    excluded: 'Any case where a non genuine charger or the wrong charger has been used, any battery with damage to the battery casing, damage to the connectors or cables, water ingress into the battery',
    terms: 'Warrantable for 1 year',
    relatedErrors: ['E4', 'E5', 'E13']
  },
  {
    sku: 'PSPUR0078-0001',
    description: '500w Motor and Tyre',
    category: 'Motor',
    included: 'E7 and E10 errors or if non functional (Failure of the drive unit, motor wiring, wheel axel & wheel bearing)',
    excluded: 'Cuts or damage to the cabling/connectors, extended use of the motor with underinflated tyres, non genuine tyres, solid tyres, stripped threads',
    terms: 'Warrantable for 1 year',
    relatedErrors: ['E7']
  },
  {
    sku: 'PSPUR0068-0001',
    description: 'Pure Air Pro and Pro+ MCU Kit (B&C) 2022 OS',
    category: 'Electronics',
    included: 'Non functional or E3 and E9 errors (if VCU display and VCU display cable are proven to be functional)',
    excluded: 'Cuts or damage to cables or connectors, interfering with or straining of cables, any modifications to any part of the system',
    terms: 'Warrantable for 1 year',
    relatedErrors: ['E3']
  },
  {
    sku: 'PSPUR0076-0002',
    description: 'Coiled VCU Display Cable (non waterproof connector)',
    category: 'Cables',
    included: 'E3 error or non functional (if VCU display and MCU have both been deemed functional)',
    excluded: 'Cuts or damage to cables or connectors, interfering with or straining of cables through assembly',
    terms: 'Warrantable for 1 year',
    relatedErrors: ['E3']
  },
  {
    sku: 'PSPUR0074-0001',
    description: '36v Charge Port Assembly',
    category: 'Charging',
    included: 'The charge port assembly fails to establish or maintain a secure charging connection',
    excluded: 'Cuts or damage to cables or connectors, use of non-standard charging equipment',
    terms: 'Warrantable for 1 year',
    relatedErrors: []
  },
  {
    sku: 'PSPUR0177-0001',
    description: '500w Motor and Tyre',
    category: 'Motor',
    included: 'E7 and E10 errors or if non functional',
    excluded: 'Cuts or damage to the cabling/connectors, failure where the wheel has not been fitted, bolts not torqued to the correct specification',
    terms: 'Warrantable for 1 year',
    relatedErrors: ['E7']
  },
  {
    sku: 'PSPUR0179-0001',
    description: '36v Motor Controller - Advance',
    category: 'Electronics',
    included: 'Non functional or E3 and E9 errors (if VCU display and VCU display cable are proven to be functional)',
    excluded: 'Cuts or damage to cables or connectors, any modifications to any part of the system',
    terms: 'Warrantable for 1 year',
    relatedErrors: ['E3']
  },
  {
    sku: 'PSPUR0180-0001',
    description: '40km 36v 9.5Ah Battery',
    category: 'Battery',
    included: 'E4, E5, E6 and E13 errors. Failure of the battery, non functional or not holding charge',
    excluded: 'Non genuine charger used, damage to battery casing, water ingress',
    terms: 'Warrantable for 1 year',
    relatedErrors: ['E4', 'E5', 'E13']
  },
  {
    sku: 'PSPUR0181-0001',
    description: '50km 36v 12.0Ah Battery',
    category: 'Battery',
    included: 'E4, E5, E6 and E13 errors. Failure of the battery, non functional or not holding charge',
    excluded: 'Non genuine charger used, damage to battery casing, water ingress',
    terms: 'Warrantable for 1 year',
    relatedErrors: ['E4', 'E5', 'E13']
  },
  {
    sku: 'PSPUR0236-0001',
    description: '36v Motor Controller - Flex',
    category: 'Electronics',
    included: 'Non functional or E3 and E9 errors',
    excluded: 'Cuts or damage to cables, any modifications',
    terms: 'Warrantable for 1 year',
    relatedErrors: ['E3']
  },
  {
    sku: 'PSPUR0254-0001',
    description: 'Pure Advance VCU MCU CABLE 2022 OS',
    category: 'Cables',
    included: 'E3 error or non functional (if VCU display and MCU have both been deemed functional)',
    excluded: 'Cuts or damage to cables or connectors',
    terms: 'Warrantable for 1 year',
    relatedErrors: ['E3']
  },
  {
    sku: 'PSPUR0271-0002',
    description: 'Coiled VCU Display Cable (waterproof connector)',
    category: 'Cables',
    included: 'E3 error or non functional (if VCU display and MCU have both been deemed functional)',
    excluded: 'Cuts or damage to cables or connectors',
    terms: 'Warrantable for 1 year',
    relatedErrors: ['E3']
  },
  {
    sku: 'PSPUR0277-0001',
    description: '36v 30km motor controller',
    category: 'Electronics',
    included: 'Non functional or E3 and E9 errors',
    excluded: 'Cuts or damage to cables, any modifications',
    terms: 'Warrantable for 1 year',
    relatedErrors: ['E3']
  },
  {
    sku: 'PSPUR0326-0001',
    description: 'Throttle',
    category: 'Controls',
    included: 'E2 error or unresponsive/delayed response',
    excluded: 'Extensive pressure causing it to snap, spin or seize. Crash damage not covered',
    terms: 'Warrantable for 1 year',
    relatedErrors: ['E2']
  },
  {
    sku: 'PSPUR0327-0001',
    description: 'Left and Brake Lever with Bell',
    category: 'Brake System',
    included: 'E1 error, brake light doesn\'t function when the lever is pulled',
    excluded: 'Any part of the brake is damaged, missing or broken',
    terms: 'Warrantable for 1 year',
    relatedErrors: ['E1']
  },
  {
    sku: 'PSPUR0328-0001',
    description: '500w Motor and Tyre',
    category: 'Motor',
    included: 'E7 and E10 errors or if non functional',
    excluded: 'Cuts or damage to cabling, underinflated tyres, non genuine tyres',
    terms: 'Warrantable for 1 year',
    relatedErrors: ['E7']
  },
  {
    sku: 'PSPUR0364-0001',
    description: '30km 36v 7.5Ah Battery and foam',
    category: 'Battery',
    included: 'E4, E5, E6 and E13 errors. Battery failure or not holding charge',
    excluded: 'Non genuine charger, damage to casing, water ingress',
    terms: 'Warrantable for 1 year',
    relatedErrors: ['E4', 'E5', 'E13']
  },
  {
    sku: 'PSPUR0365-0001',
    description: '40km 36v 10Ah Battery and foam',
    category: 'Battery',
    included: 'E4, E5, E6 and E13 errors. Battery failure or not holding charge',
    excluded: 'Non genuine charger, damage to casing, water ingress',
    terms: 'Warrantable for 1 year',
    relatedErrors: ['E4', 'E5', 'E13']
  },
  {
    sku: 'PSPUR0409-0001',
    description: '50km 36v 12Ah Battery',
    category: 'Battery',
    included: 'E4, E5, E6 and E13 errors',
    excluded: 'Non genuine charger, water ingress',
    terms: 'Warrantable for 1 year',
    relatedErrors: ['E4', 'E5', 'E13']
  },
  {
    sku: 'PSPUR0415-0001',
    description: '350w Rear Wheel Motor assembly with Tyre',
    category: 'Motor',
    included: 'E7 and E10 errors or if non functional',
    excluded: 'Damage to cabling, underinflated tyres, non genuine parts',
    terms: 'Warrantable for 1 year',
    relatedErrors: ['E7']
  },
  {
    sku: 'PSPUR0416-0001',
    description: '500w Motor and Tyre',
    category: 'Motor',
    included: 'E7 and E10 errors or if non functional',
    excluded: 'Damage to cabling, underinflated tyres, non genuine parts',
    terms: 'Warrantable for 1 year',
    relatedErrors: ['E7']
  },
  {
    sku: 'PSPUR0436-0001',
    description: 'Left Hand Brake Lever (for no indicator)',
    category: 'Brake System',
    included: 'E1 error, brake light doesn\'t function',
    excluded: 'Any part damaged, missing or broken',
    terms: 'Warrantable for 1 year',
    relatedErrors: ['E1']
  },
  {
    sku: 'PSPUR0445-0001',
    description: '350w Rear Wheel and Knobbly Tyre',
    category: 'Motor',
    included: 'E7 and E10 errors or if non functional',
    excluded: 'Damage to cabling, underinflated tyres',
    terms: 'Warrantable for 1 year',
    relatedErrors: ['E7']
  }
];

// Helper functions
export function findPartBySKU(sku: string) {
  return warrantyData.find(part => part.sku.toLowerCase() === sku.toLowerCase());
}

export function findPartsByErrorCode(errorCode: string) {
  return warrantyData.filter(part => part.relatedErrors.includes(errorCode));
}

export function getWarrantableParts() {
  return warrantyData.filter(part => part.terms.includes('Warrantable for 1 year'));
}

export function getNonWarrantableParts() {
  return warrantyData.filter(part => part.terms.includes('Non-warrantable'));
}

export function findPartsByCategory(category: string) {
  return warrantyData.filter(part => part.category === category);
}

// THE FIXED FUNCTION IS HERE
export function getCategories() {
  const categories = new Set(warrantyData.map(part => part.category));
  return Array.from(categories).sort();
}
