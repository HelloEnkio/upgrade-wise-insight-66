import { useState } from 'react';
import { queueService } from '@/services/queueService';
import { cacheService } from '@/services/cacheService';
import { areProductsComparable, generateIncompatibleExplanation } from '@/utils/productCategories';

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

export const useGeminiData = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [queueVisible, setQueueVisible] = useState(false);

  const getModelOptions = () => undefined;

  const simulateAnalysis = async (
    currentDevice: string,
    newDevice: string
  ): Promise<ComparisonData | IncompatibleComparison> => {
    setIsLoading(true);

    try {
      if (!areProductsComparable(currentDevice, newDevice)) {
        setIsLoading(false);
        return {
          isIncompatible: true,
          currentDevice,
          newDevice,
          explanation: generateIncompatibleExplanation(currentDevice, newDevice)
        };
      }

      const cacheKey = `${currentDevice}|${newDevice}`;
      const cachedResult = cacheService.get('COMPARISON', cacheKey);

      if (cachedResult && !cachedResult._expired) {
        setIsLoading(false);
        return cachedResult;
      }

      setQueueVisible(true);
      const realData = await queueService.addToQueue<ComparisonData>(
        'comparison',
        { currentDevice, newDevice },
        'high'
      );

      cacheService.set('COMPARISON', realData, [cacheKey], 'api');

      setQueueVisible(false);
      setIsLoading(false);
      return realData;
    } catch (error) {
      setQueueVisible(false);
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

