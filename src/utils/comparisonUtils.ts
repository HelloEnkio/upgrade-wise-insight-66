
import { getProductCategory } from './productCategories';

interface ComparisonSpec {
  category: string;
  current: string;
  new: string;
  improvement: 'better' | 'worse' | 'same';
}

interface TechnicalSpec {
  category: string;
  subcategory?: string;
  current: {
    value: string;
    technical: string;
  };
  new: {
    value: string;
    technical: string;
  };
  improvement: 'better' | 'worse' | 'same';
  score: number;
  details: string;
}

export const generateComparisonSpecs = (category: string | null): ComparisonSpec[] => {
  if (category === 'vehicles') {
    return [
      { category: 'Engine', current: '1.0L', new: '1.2L', improvement: 'better' },
      { category: 'Power', current: '90hp', new: '100hp', improvement: 'better' },
      { category: 'Fuel Consumption', current: '5.2L/100km', new: '4.9L/100km', improvement: 'better' },
      { category: 'Transmission', current: 'Manual', new: 'Automatic', improvement: 'better' },
      { category: 'Safety Rating', current: '5 stars', new: '4 stars', improvement: 'worse' }
    ];
  } else if (category === 'lighting') {
    return [
      { category: 'Power', current: '60W', new: '9W', improvement: 'better' },
      { category: 'Brightness', current: '630 lm', new: '806 lm', improvement: 'better' },
      { category: 'Lifespan', current: '2000h', new: '15000h', improvement: 'better' },
      { category: 'Efficiency', current: 'Class D', new: 'Class A++', improvement: 'better' }
    ];
  } else {
    // Default electronics comparison
    return [
      { category: 'Processor', current: 'M1 Chip', new: 'M3 Chip', improvement: 'better' },
      { category: 'Memory', current: '8GB', new: '8GB', improvement: 'same' },
      { category: 'Storage', current: '256GB', new: '256GB', improvement: 'same' },
      { category: 'Display', current: '13.3"', new: '13.6"', improvement: 'better' },
      { category: 'Battery Life', current: '15 hours', new: '18 hours', improvement: 'better' }
    ];
  }
};

export const generateTechnicalSpecs = (category: string | null): TechnicalSpec[] => {
  if (category === 'vehicles') {
    return [
      {
        category: 'Engine',
        current: { value: '1.0L', technical: '1.0L TCe 90 turbo gasoline' },
        new: { value: '1.2L', technical: '1.2L PureTech 100 turbo gasoline' },
        improvement: 'better',
        score: 80,
        details: 'More modern engine with better torque and performance.'
      },
      {
        category: 'Power',
        current: { value: '90hp', technical: '90 horsepower @ 5500 RPM' },
        new: { value: '100hp', technical: '100 horsepower @ 5750 RPM' },
        improvement: 'better',
        score: 75,
        details: '11% increase in power output for better acceleration.'
      },
      {
        category: 'Fuel Consumption',
        current: { value: '5.2L/100km', technical: 'Combined cycle WLTP' },
        new: { value: '4.9L/100km', technical: 'Combined cycle WLTP' },
        improvement: 'better',
        score: 85,
        details: '6% improvement in fuel efficiency saves money and reduces emissions.'
      },
      {
        category: 'Transmission',
        current: { value: 'Manual', technical: '5-speed manual transmission' },
        new: { value: 'Automatic', technical: '6-speed automatic transmission' },
        improvement: 'better',
        score: 70,
        details: 'Automatic transmission provides better comfort and convenience.'
      },
      {
        category: 'Safety Rating',
        current: { value: '5 stars', technical: 'Euro NCAP 5-star rating' },
        new: { value: '4 stars', technical: 'Euro NCAP 4-star rating' },
        improvement: 'worse',
        score: 40,
        details: 'Lower safety rating due to updated, more stringent testing criteria.'
      }
    ];
  } else if (category === 'lighting') {
    return [
      {
        category: 'Energy Efficiency',
        current: { value: '60W', technical: '60W traditional halogen' },
        new: { value: '9W', technical: '9W LED equivalent to 60W' },
        improvement: 'better',
        score: 95,
        details: 'Ultra-efficient LED technology with 85% energy savings.'
      },
      {
        category: 'Brightness',
        current: { value: '630 lm', technical: '630 lumens light output' },
        new: { value: '806 lm', technical: '806 lumens light output' },
        improvement: 'better',
        score: 80,
        details: '28% brighter for better illumination while using less energy.'
      },
      {
        category: 'Lifespan',
        current: { value: '2000h', technical: '2000 hours average lifespan' },
        new: { value: '15000h', technical: '15000 hours LED lifespan' },
        improvement: 'better',
        score: 90,
        details: '7.5x longer lifespan means fewer replacements and lower maintenance.'
      },
      {
        category: 'Color Temperature',
        current: { value: '2700K', technical: '2700K warm white' },
        new: { value: '2700K', technical: '2700K warm white' },
        improvement: 'same',
        score: 60,
        details: 'Same comfortable warm white color temperature.'
      }
    ];
  } else {
    return [
      {
        category: 'Processor',
        current: { value: 'M1', technical: 'Apple M1 (8-core CPU, 7-core GPU)' },
        new: { value: 'M3', technical: 'Apple M3 (8-core CPU, 10-core GPU)' },
        improvement: 'better',
        score: 85,
        details: 'M3 chip built on 3nm vs 5nm for M1, offering 15% better CPU performance.'
      },
      {
        category: 'Memory',
        current: { value: '8GB', technical: '8GB unified memory' },
        new: { value: '8GB', technical: '8GB unified memory' },
        improvement: 'same',
        score: 60,
        details: 'Same memory configuration, adequate for most tasks.'
      },
      {
        category: 'Storage',
        current: { value: '256GB', technical: '256GB SSD storage' },
        new: { value: '256GB', technical: '256GB SSD storage' },
        improvement: 'same',
        score: 60,
        details: 'Same storage capacity, but newer model may have faster SSD speeds.'
      },
      {
        category: 'Display',
        current: { value: '13.3"', technical: '13.3" Retina display, 2560x1600' },
        new: { value: '13.6"', technical: '13.6" Liquid Retina display, 2560x1664' },
        improvement: 'better',
        score: 75,
        details: 'Slightly larger display with better color accuracy and brightness.'
      },
      {
        category: 'Battery Life',
        current: { value: '15 hours', technical: '15 hours web browsing' },
        new: { value: '18 hours', technical: '18 hours web browsing' },
        improvement: 'better',
        score: 80,
        details: 'Improved energy efficiency provides 20% longer battery life.'
      }
    ];
  }
};

export const generateReasons = (category: string | null): string[] => {
  if (category === 'vehicles') {
    return [
      'More powerful engine for better performance',
      'Reduced fuel consumption thanks to new technologies',
      'Automatic transmission for increased comfort',
      'However, slightly lower safety rating'
    ];
  } else if (category === 'lighting') {
    return [
      '85% lower electricity consumption',
      'Higher brightness for better lighting',
      '7 times longer lifespan',
      'Much better energy efficiency'
    ];
  } else {
    return [
      'Better energy efficiency for extended battery life',
      'Improved display technology for better image quality',
      'Optimized thermal management for consistent performance'
    ];
  }
};
