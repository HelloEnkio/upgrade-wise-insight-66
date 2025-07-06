
interface SpecValue {
  value: string;
  technical: string;
}

export const mockTechnicalSpecs: { [key: string]: { [key: string]: SpecValue } } = {
  'macbook air m1': {
    processor: { value: 'M1', technical: 'Apple M1 (8-core CPU, 7-core GPU)' },
    memory: { value: '8GB', technical: '8GB LPDDR4X-4266 unified memory' },
    storage: { value: '256GB', technical: '256GB PCIe-based SSD' },
    display: { value: '13.3"', technical: '13.3" LED-backlit IPS, P3 color gamut' },
    battery: { value: '15h', technical: '49.9Wh lithium-polymer battery' },
    connectivity: { value: 'Wi-Fi 6', technical: '802.11ax Wi-Fi 6, Bluetooth 5.0' }
  },
  'macbook air m3': {
    processor: { value: 'M3', technical: 'Apple M3 (8-core CPU, 10-core GPU)' },
    memory: { value: '8GB', technical: '8GB LPDDR5-6400 unified memory' },
    storage: { value: '256GB', technical: '256GB PCIe Gen4 SSD' },
    display: { value: '13.6"', technical: '13.6" Liquid Retina, P3 wide color, True Tone' },
    battery: { value: '18h', technical: '52.6Wh lithium-polymer battery' },
    connectivity: { value: 'Wi-Fi 6E', technical: '802.11ax Wi-Fi 6E, Bluetooth 5.3' }
  }
};

export const mockSpecsByCategory: { [key: string]: { [key: string]: { [key: string]: SpecValue } } } = {
  vehicles: {
    'renault clio': {
      engine: { value: '1.0L', technical: '1.0L TCe 90 turbo essence' },
      power: { value: '90ch', technical: '90 chevaux, 160 Nm de couple' },
      consumption: { value: '5.2L/100km', technical: 'Cycle mixte WLTP' },
      transmission: { value: 'Manuelle', technical: 'Boîte manuelle 5 rapports' },
      safety: { value: '5 étoiles', technical: 'Euro NCAP 2019' }
    },
    'peugeot 208': {
      engine: { value: '1.2L', technical: '1.2L PureTech 100 turbo essence' },
      power: { value: '100ch', technical: '100 chevaux, 205 Nm de couple' },
      consumption: { value: '4.9L/100km', technical: 'Cycle mixte WLTP' },
      transmission: { value: 'Automatique', technical: 'Boîte automatique EAT8' },
      safety: { value: '4 étoiles', technical: 'Euro NCAP 2019' }
    }
  },
  lighting: {
    'ampoule led philips': {
      power: { value: '9W', technical: '9W LED équivalent 60W incandescent' },
      brightness: { value: '806 lm', technical: '806 lumens, 2700K blanc chaud' },
      lifespan: { value: '15000h', technical: '15 000 heures de durée de vie' },
      efficiency: { value: 'A++', technical: 'Classe énergétique A++' },
      features: { value: 'Dimmable', technical: 'Compatible variateur, culot E27' }
    },
    'ampoule halogène': {
      power: { value: '60W', technical: '60W halogène traditionnelle' },
      brightness: { value: '630 lm', technical: '630 lumens, 2700K blanc chaud' },
      lifespan: { value: '2000h', technical: '2 000 heures de durée de vie' },
      efficiency: { value: 'D', technical: 'Classe énergétique D' },
      features: { value: 'Standard', technical: 'Culot E27, non dimmable' }
    }
  }
};
