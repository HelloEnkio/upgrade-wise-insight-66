
export interface ModelOption {
  id: string;
  name: string;
  year: string;
  specs: string[];
  price?: string;
}

export const mockModels: { [key: string]: ModelOption[] } = {
  'macbook air': [
    {
      id: 'mba-m1-2020',
      name: 'MacBook Air',
      year: '2020',
      specs: ['Apple M1 Chip', '8GB RAM', '256GB SSD', '13.3" Display'],
      price: '$999'
    },
    {
      id: 'mba-m2-2022',
      name: 'MacBook Air',
      year: '2022',
      specs: ['Apple M2 Chip', '8GB RAM', '256GB SSD', '13.6" Display'],
      price: '$1199'
    },
    {
      id: 'mba-m3-2024',
      name: 'MacBook Air',
      year: '2024',
      specs: ['Apple M3 Chip', '8GB RAM', '256GB SSD', '13.6" Display'],
      price: '$1299'
    }
  ],
  'iphone': [
    {
      id: 'iphone-13',
      name: 'iPhone 13',
      year: '2021',
      specs: ['A15 Bionic Chip', '6.1" Super Retina XDR display', '128GB Storage'],
      price: '$799'
    },
    {
      id: 'iphone-14',
      name: 'iPhone 14',
      year: '2022',
      specs: ['A15 Bionic Chip', '6.1" Super Retina XDR display', '128GB Storage'],
      price: '$799'
    },
    {
      id: 'iphone-15',
      name: 'iPhone 15',
      year: '2023',
      specs: ['A16 Bionic Chip', '6.1" Super Retina XDR display', '128GB Storage'],
      price: '$829'
    }
  ],
  'samsung galaxy s': [
    {
      id: 'samsung-s21',
      name: 'Samsung Galaxy S21',
      year: '2021',
      specs: ['Snapdragon 888', '8GB RAM', '128GB Storage', '6.2" Dynamic AMOLED 2X'],
      price: '$799'
    },
    {
      id: 'samsung-s22',
      name: 'Samsung Galaxy S22',
      year: '2022',
      specs: ['Snapdragon 8 Gen 1', '8GB RAM', '128GB Storage', '6.1" Dynamic AMOLED 2X'],
      price: '$799'
    },
    {
      id: 'samsung-s23',
      name: 'Samsung Galaxy S23',
      year: '2023',
      specs: ['Snapdragon 8 Gen 2', '8GB RAM', '128GB Storage', '6.1" Dynamic AMOLED 2X'],
      price: '$829'
    }
  ]
};
