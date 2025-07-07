import { useState } from 'react';
import { mockModels, type ModelOption } from '@/data/mockModels';
import { areProductsComparable, generateIncompatibleExplanation } from '@/utils/productCategories';
import { queueService } from '@/services/queueService';
import { cacheService } from '@/services/cacheService';

interface ComparisonData {
  currentDevice: string;
  newDevice: string;
  recommendation: 'upgrade' | 'keep' | 'maybe';
  score: number;
  reasons: string[];
  specs: {
    category: string;
    current: string;
    new: string;
    improvement: 'better' | 'worse' | 'same';
  }[];
  technicalSpecs: {
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
  }[];
}

interface IncompatibleComparison {
  isIncompatible: true;
  currentDevice: string;
  newDevice: string;
  explanation: string;
}

export const useMockData = () => {
  const [isLoading, setIsLoading] = useState(false);

  const getModelOptions = (device: string): ModelOption[] | undefined => {
    const searchTerm = device.toLowerCase();
    for (const key in mockModels) {
      if (searchTerm.includes(key)) {
        return mockModels[key];
      }
    }
    return undefined;
  };

  const simulateAnalysis = async (
    currentDevice: string, 
    newDevice: string
  ): Promise<ComparisonData | IncompatibleComparison> => {
    setIsLoading(true);
    
    try {
      // Check if products are comparable
      if (!areProductsComparable(currentDevice, newDevice)) {
        return {
          isIncompatible: true,
          currentDevice,
          newDevice,
          explanation: generateIncompatibleExplanation(currentDevice, newDevice)
        };
      }

      // Check cache first
      const cacheKey = `${currentDevice}|${newDevice}`;
      const cachedResult = cacheService.get('COMPARISON', cacheKey);
      
      if (cachedResult && !cachedResult._expired) {
        console.log('Using cached comparison data');
        setIsLoading(false);
        return cachedResult;
      }

      // Try to get real data via backend
      try {
        console.log('Requesting real data via backend...');

        const realData = await queueService.addToQueue<ComparisonData>(
          'comparison',
          { currentDevice, newDevice },
          'high'
        );

        // Cache the real data
        cacheService.set('COMPARISON', realData, [cacheKey], 'api');

        setIsLoading(false);
        return realData;

      } catch (error) {
        console.error('Failed to get real data:', error);
        setIsLoading(false);
        throw error;
      }
      
    } catch (error) {
      console.error('Analysis failed:', error);
      setIsLoading(false);
      throw error;
    }
  };

  return {
    isLoading,
    getModelOptions,
    simulateAnalysis
  };
};
