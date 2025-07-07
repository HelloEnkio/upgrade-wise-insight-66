import { useState } from 'react';
import { useGeminiData } from '@/hooks/useGeminiData';
import { geminiService } from '@/services/geminiService';

interface ModelOption {
  id: string;
  name: string;
  year: string;
  specs: string[];
  price?: string;
}

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

export const useComparisonForm = () => {
  const [currentProduct, setCurrentProduct] = useState('');
  const [newProduct, setNewProduct] = useState('');
  const [showCurrentSelector, setShowCurrentSelector] = useState(false);
  const [showNewSelector, setShowNewSelector] = useState(false);
  const [currentModels, setCurrentModels] = useState<ModelOption[]>([]);
  const [newModels, setNewModels] = useState<ModelOption[]>([]);
  const [selectedCurrent, setSelectedCurrent] = useState<ModelOption | null>(null);
  const [selectedNew, setSelectedNew] = useState<ModelOption | null>(null);
  const [comparisonResult, setComparisonResult] = useState<ComparisonData | IncompatibleComparison | null>(null);
  const [showQueueStatus, setShowQueueStatus] = useState(false);
  const [showProductNotFound, setShowProductNotFound] = useState(false);
  const [showQueue, setShowQueue] = useState(false);
  const [showPreciseSpecs, setShowPreciseSpecs] = useState(false);
  const [notFoundProduct, setNotFoundProduct] = useState('');
  const [preciseDevice, setPreciseDevice] = useState('');
  
  const { isLoading, getModelOptions, simulateAnalysis } = useGeminiData();

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

    if (currentProduct.toLowerCase() === 'precise' || newProduct.toLowerCase() === 'precise') {
      console.log('Opening precise specs dialog');
      setPreciseDevice(currentProduct.toLowerCase() === 'precise' ? currentProduct : newProduct);
      setShowPreciseSpecs(true);
      return;
    }
    
    if (currentProduct.trim() && newProduct.trim()) {
      console.log('Comparing:', currentProduct, 'vs', newProduct);
      
      // Check first if quota isn't exceeded
      if (geminiService.isQuotaExceeded()) {
        setShowQueueStatus(true);
        return;
      }
      
      // Check if we need to ask for model details
      const currentOptions = getModelOptions(currentProduct);
      const newOptions = getModelOptions(newProduct);
      
      if (currentOptions && currentOptions.length > 1) {
        setCurrentModels(currentOptions);
        setShowCurrentSelector(true);
        return;
      }
      
      if (newOptions && newOptions.length > 1) {
        setNewModels(newOptions);
        setShowNewSelector(true);
        return;
      }
      
      // Proceed directly to comparison
      const result = await simulateAnalysis(currentProduct, newProduct);
      setComparisonResult(result);
    }
  };

  const handlePreciseSpecsSubmit = async (specs: any) => {
    console.log('Precise specs submitted:', specs);
    
    // Create a detailed device description from specs
    const detailedDevice = `Custom Device (${specs.processor}, ${specs.ram}, ${specs.storage})`;
    const otherDevice = preciseDevice === currentProduct ? newProduct : currentProduct;
    
    // Simulate analysis with precise specs
    const result = await simulateAnalysis(
      preciseDevice === currentProduct ? detailedDevice : otherDevice,
      preciseDevice === currentProduct ? otherDevice : detailedDevice
    );
    setComparisonResult(result);
  };

  const handleCurrentModelSelect = (model: ModelOption) => {
    setSelectedCurrent(model);
    setCurrentProduct(model.name + ' ' + model.year);
    setShowCurrentSelector(false);
    
    // Check now the new product
    const newOptions = getModelOptions(newProduct);
    if (newOptions && newOptions.length > 1) {
      setNewModels(newOptions);
      setShowNewSelector(true);
    } else {
      // Proceed to comparison
      simulateAnalysis(model.name + ' ' + model.year, newProduct)
        .then(result => setComparisonResult(result));
    }
  };

  const handleNewModelSelect = async (model: ModelOption) => {
    setSelectedNew(model);
    setNewProduct(model.name + ' ' + model.year);
    setShowNewSelector(false);
    
    const currentDeviceName = selectedCurrent ? 
      selectedCurrent.name + ' ' + selectedCurrent.year : 
      currentProduct;
    
    const result = await simulateAnalysis(currentDeviceName, model.name + ' ' + model.year);
    setComparisonResult(result);
  };

  const resetForm = () => {
    setCurrentProduct('');
    setNewProduct('');
    setShowCurrentSelector(false);
    setShowNewSelector(false);
    setCurrentModels([]);
    setNewModels([]);
    setSelectedCurrent(null);
    setSelectedNew(null);
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
    showCurrentSelector,
    showNewSelector,
    currentModels,
    newModels,
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
    handleCurrentModelSelect,
    handleNewModelSelect,
    resetForm
  };
};
