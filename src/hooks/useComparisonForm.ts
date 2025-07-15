import { useState } from 'react';
import { useMockData } from '@/hooks/useMockData';
import { logDevError } from '@/lib/devLogger';
import { geminiService } from '@/services/geminiService';
import { useToast } from '@/hooks/use-toast';
import { GeminiParseError, GeminiTokenLimitError } from '@/utils/geminiErrors';
import { needsPreciseSpecs } from '@/utils/specCheck';

interface ComparisonData {
  currentDevice: string;
  newDevice: string;
  recommendation: 'upgrade' | 'keep' | 'maybe';
  score: number;
  takeHome: string;
  connoisseurSpecs: {
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

export const useComparisonForm = () => {
  const [currentProduct, setCurrentProduct] = useState('');
  const [newProduct, setNewProduct] = useState('');
  const [comparisonResult, setComparisonResult] = useState<ComparisonData | IncompatibleComparison | null>(null);
  const [showQueueStatus, setShowQueueStatus] = useState(false);
  const [showProductNotFound, setShowProductNotFound] = useState(false);
  const [showQueue, setShowQueue] = useState(false);
  const [showPreciseSpecs, setShowPreciseSpecs] = useState(false);
  const [notFoundProduct, setNotFoundProduct] = useState('');
  const [preciseDevice, setPreciseDevice] = useState('');
  const [pendingComparison, setPendingComparison] = useState<ComparisonData | null>(null);

  const { toast } = useToast();
  
  const { isLoading, simulateAnalysis } = useMockData();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Form submitted with:', { currentProduct, newProduct });
    
    // Check for special mock triggers
    if (currentProduct.toLowerCase() === 'error' || newProduct.toLowerCase() === 'error') {
      setNotFoundProduct(currentProduct.toLowerCase() === 'error' ? currentProduct : newProduct);
      setShowProductNotFound(true);
      return;
    }
    
    if (currentProduct.toLowerCase() === 'queue' || newProduct.toLowerCase() === 'queue') {
      setShowQueue(true);
      return;
    }

    
    if (currentProduct.trim() && newProduct.trim()) {
      console.log('Comparing:', currentProduct, 'vs', newProduct);
      
      // Check first if quota isn't exceeded
      if (geminiService.isQuotaExceeded()) {
        setShowQueueStatus(true);
        return;
      }
      

      
      // Proceed directly to comparison
      try {
        const compatibility = await geminiService.checkComparability(
          currentProduct,
          newProduct
        );

        if (!compatibility.comparable) {
          setComparisonResult({
            isIncompatible: true,
            currentDevice: currentProduct,
            newDevice: newProduct,
            explanation: `I cannot compare "${currentProduct}" and "${newProduct}" because they belong to different categories (${compatibility.category1} vs ${compatibility.category2}).`
          });
          return;
        }

        const completeness = await geminiService.checkDetailCompleteness(
          currentProduct,
          newProduct
        );

        if (!completeness.current.complete || !completeness.new.complete) {
          const deviceInfo = !completeness.current.complete && !completeness.new.complete
            ? `${currentProduct} and ${newProduct}`
            : !completeness.current.complete
              ? currentProduct
              : newProduct;
          setPreciseDevice(deviceInfo);
          setShowPreciseSpecs(true);
          return;
        }

        const result = await simulateAnalysis(currentProduct, newProduct);
        if (!('isIncompatible' in result) && needsPreciseSpecs(result)) {
          setPendingComparison(result);
          setPreciseDevice(currentProduct);
          setShowPreciseSpecs(true);
          return;
        }
        setComparisonResult(result);
      } catch (error) {
        console.error('Comparison failed:', error);
        logDevError('Comparison failed', error);
        if (error instanceof GeminiTokenLimitError) {
          toast({
            title: 'Response Too Long',
            description: 'The AI response exceeded the token limit.',
            variant: 'destructive'
          });
        } else if (error instanceof GeminiParseError) {
          toast({
            title: 'AI Error',
            description: 'The AI returned an unexpected response.',
            variant: 'destructive'
          });
        } else {
          toast({
            title: 'Analysis Error',
            description: 'Unable to analyze these products. Please try again later.',
            variant: 'destructive'
          });
        }
      }
    }
  };

  const handlePreciseSpecsSubmit = async (specs: any[]) => {
    console.log('Precise specs submitted:', specs);

    const [currentSpecs, newSpecs] = specs;
    const detailedCurrent = currentSpecs
      ? `Custom Device (${currentSpecs.processor}, ${currentSpecs.ram}, ${currentSpecs.storage})`
      : currentProduct;
    const detailedNew = newSpecs
      ? `Custom Device (${newSpecs.processor}, ${newSpecs.ram}, ${newSpecs.storage})`
      : newProduct;
    
    // Simulate analysis with precise specs
    try {
      const result = await simulateAnalysis(
        detailedCurrent,
        detailedNew
      );
      if (!('isIncompatible' in result) && needsPreciseSpecs(result)) {
        setPreciseDevice(preciseDevice);
        setShowPreciseSpecs(true);
        return;
      }
      setPendingComparison(null);
      setComparisonResult(result);
    } catch (error) {
      console.error('Precise analysis failed:', error);
      logDevError('Precise analysis failed', error);
      if (error instanceof GeminiTokenLimitError) {
        toast({
          title: 'Response Too Long',
          description: 'The AI response exceeded the token limit.',
          variant: 'destructive'
        });
      } else if (error instanceof GeminiParseError) {
        toast({
          title: 'AI Error',
          description: 'The AI returned an unexpected response.',
          variant: 'destructive'
        });
      } else {
        toast({
          title: 'Analysis Error',
          description: 'Unable to analyze these products. Please try again later.',
          variant: 'destructive'
        });
      }
    }
  };

  const handleSkipPreciseSpecs = () => {
    if (pendingComparison) {
      setComparisonResult(pendingComparison);
      setPendingComparison(null);
    }
    setShowPreciseSpecs(false);
  };

  const resetForm = () => {
    setCurrentProduct('');
    setNewProduct('');
    setComparisonResult(null);
    setShowQueueStatus(false);
    setShowProductNotFound(false);
    setShowQueue(false);
    setShowPreciseSpecs(false);
    setNotFoundProduct('');
    setPreciseDevice('');
  };

  return {
    // State
    currentProduct,
    setCurrentProduct,
    newProduct,
    setNewProduct,
    comparisonResult,
    showQueueStatus,
    showProductNotFound,
    showQueue,
    showPreciseSpecs,
    notFoundProduct,
    preciseDevice,
    isLoading,
    
    // State setters
    setShowProductNotFound,
    setShowQueue,
    setShowPreciseSpecs,
    
    // Handlers
    handleSubmit,
    handlePreciseSpecsSubmit,
    handleSkipPreciseSpecs,
    resetForm
  };
};
