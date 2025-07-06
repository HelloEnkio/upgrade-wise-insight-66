import { useState } from 'react';
import { mockModels, type ModelOption } from '@/data/mockModels';
import { areProductsComparable, generateIncompatibleExplanation, getProductCategory } from '@/utils/productCategories';
import { generateComparisonSpecs, generateTechnicalSpecs, generateReasons } from '@/utils/comparisonUtils';
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
  const [queueVisible, setQueueVisible] = useState(false);

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
        setQueueVisible(true);
        
        const realData = await queueService.addToQueue<ComparisonData>(
          'comparison',
          { currentDevice, newDevice },
          'high'
        );
        
        // Cache the real data
        cacheService.set('COMPARISON', realData, [cacheKey], 'api');
        
        setQueueVisible(false);
        setIsLoading(false);
        return realData;
        
      } catch (error) {
        console.warn('Failed to get real data, falling back to mock data:', error);
        setQueueVisible(false);
      }

      // Fallback to mock data
      console.log('Using mock data');
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate delay
      
      const category = getProductCategory(currentDevice);
      const specs = generateComparisonSpecs(category);
      const technicalSpecs = generateTechnicalSpecs(category);
      const reasons = generateReasons(category);
      
      const mockResult: ComparisonData = {
        currentDevice,
        newDevice,
        recommendation: Math.random() > 0.3 ? 'upgrade' : 'keep',
        score: Math.floor(Math.random() * 30) + 70,
        reasons,
        specs,
        technicalSpecs
      };

      // Cache mock data with shorter expiration
      cacheService.set('COMPARISON', mockResult, [cacheKey], 'mock');
      
      setIsLoading(false);
      return mockResult;
      
    } catch (error) {
      console.error('Analysis failed:', error);
      setIsLoading(false);
      throw error;
    }
  };

  return {
    isLoading,
    queueVisible,
    getModelOptions,
    simulateAnalysis
  };
};
