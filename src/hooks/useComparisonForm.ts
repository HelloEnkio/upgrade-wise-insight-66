import { useState, useEffect } from 'react';
import { useMockData } from '@/hooks/useMockData';
import { logDevError } from '@/lib/devLogger';
import { geminiService } from '@/services/geminiService';
import { useToast } from '@/hooks/use-toast';
import { GeminiParseError, GeminiTokenLimitError } from '@/utils/geminiErrors';
import { needsPreciseSpecs } from '@/utils/specCheck';
import { useComparisonResult } from '@/contexts/ComparisonResultContext';

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
  const [category, setCategory] = useState<string>('computer');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { setHasResult, resetResult } = useComparisonResult();

  const { toast } = useToast();

  const { isLoading, simulateAnalysis } = useMockData();

  useEffect(() => {
    setHasResult(comparisonResult !== null);
  }, [comparisonResult, setHasResult]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);

    console.log('Form submitted with:', { currentProduct, newProduct });
    
    // Check for special mock triggers
    if (currentProduct.toLowerCase() === 'error' || newProduct.toLowerCase() === 'error') {
      setNotFoundProduct(currentProduct.toLowerCase() === 'error' ? currentProduct : newProduct);
      setShowProductNotFound(true);
      setIsSubmitting(false);
      return;
    }
    
    if (currentProduct.toLowerCase() === 'queue' || newProduct.toLowerCase() === 'queue') {
      setShowQueue(true);
      setIsSubmitting(false);
      return;
    }

    
    if (currentProduct.trim() && newProduct.trim()) {
      console.log('Comparing:', currentProduct, 'vs', newProduct);
      
      // Check first if quota isn't exceeded
      if (geminiService.isQuotaExceeded()) {
        setShowQueueStatus(true);
        setIsSubmitting(false);
        return;
      }
      

      
      // Proceed directly to comparison
      try {
        const compatibility = await geminiService.checkComparability(
          currentProduct,
          newProduct
        );
        if (compatibility.category1 === compatibility.category2) {
          setCategory(compatibility.category1);
        }

        if (!compatibility.comparable) {
          setComparisonResult({
            isIncompatible: true,
            currentDevice: currentProduct,
            newDevice: newProduct,
            explanation: `I cannot compare "${currentProduct}" and "${newProduct}" because they belong to different categories (${compatibility.category1} vs ${compatibility.category2}).`
          });
          setIsSubmitting(false);
          return;
        }

        const completeness = await geminiService.checkDetailCompleteness(
          currentProduct,
          newProduct
        );

        if (!completeness.current.complete || !completeness.new.complete) {
          await handleSkipPreciseSpecs();
          return;
        }

        const result = await simulateAnalysis(currentProduct, newProduct);
        if (!('isIncompatible' in result) && needsPreciseSpecs(result)) {
          setPendingComparison(result);
          await handleSkipPreciseSpecs();
          return;
        }
        setComparisonResult(result);
        setIsSubmitting(false);
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
        setIsSubmitting(false);
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

  const fetchCommonSpecsSummary = async (product: string): Promise<string> => {
    try {
      const specs = await geminiService.getProductSpecs(product);
      if (specs && typeof specs === 'object') {
        const { model, year, processor, ram, storage } = specs as any;
        const summary = [model, year, processor, ram, storage]
          .filter(Boolean)
          .join(', ');
        return summary ? `${product} (${summary})` : product;
      }
    } catch (error) {
      console.error('Failed to fetch specs for', product, error);
      logDevError('Failed to fetch specs', error);
    }
    return product;
  };

  const handleSkipPreciseSpecs = async () => {
    setIsSubmitting(true);
    try {
      if (pendingComparison) {
        setComparisonResult(pendingComparison);
        setPendingComparison(null);
      } else {
        const [currentSummary, newSummary] = await Promise.all([
          fetchCommonSpecsSummary(currentProduct),
          fetchCommonSpecsSummary(newProduct)
        ]);
        const result = await simulateAnalysis(currentSummary, newSummary);
        setComparisonResult(result);
      }
    } catch (error) {
      console.error('Fallback comparison failed:', error);
      logDevError('Fallback comparison failed', error);
      if (error instanceof GeminiTokenLimitError) {
        toast({
          title: 'Response Too Long',
          description: 'The AI response exceeded the token limit.',
          variant: 'destructive'
        });
      } else {
        toast({
          title: 'Analysis Error',
          description: 'Unable to analyze these products. Please try again later.',
          variant: 'destructive'
        });
      }
    } finally {
      setShowPreciseSpecs(false);
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setCurrentProduct('');
    setNewProduct('');
    setComparisonResult(null);
    resetResult();
    setShowQueueStatus(false);
    setShowProductNotFound(false);
    setShowQueue(false);
    setShowPreciseSpecs(false);
    setNotFoundProduct('');
    setPreciseDevice('');
    setCategory('computer');
    setIsSubmitting(false);
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
    category,
    isLoading,
    isSubmitting,
    
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
