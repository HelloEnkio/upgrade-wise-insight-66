
import React from 'react';
import { Button } from '@/components/ui/button';
import { geminiService } from '@/services/geminiService';
import { useComparisonForm } from '@/hooks/useComparisonForm';
import ComparisonResult from './ComparisonResult';
import IncompatibleComparison from './IncompatibleComparison';
import QueueStatus from './QueueStatus';
import ComparisonFormInputs from './ComparisonFormInputs';
import ComparisonDialogs from './ComparisonDialogs';

const ComparisonForm = () => {
  const {
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
    setShowProductNotFound,
    setShowQueue,
    setShowPreciseSpecs,
    handleSubmit,
    handlePreciseSpecsSubmit,
    handleSkipPreciseSpecs,
    resetForm
  } = useComparisonForm();

  // Show queue status if quota is exceeded
  if (showQueueStatus || geminiService.isQuotaExceeded()) {
    return (
      <div className="w-full max-w-2xl mx-auto animate-slide-up space-y-6">
        <QueueStatus isVisible={true} />
        <div className="text-center">
          <Button
            onClick={resetForm}
            variant="outline"
            className="border-tech-gray-300 text-tech-gray-600 hover:border-tech-electric hover:text-tech-electric"
          >
            ← Back
          </Button>
        </div>
      </div>
    );
  }

  // Show comparison result
  if (comparisonResult) {
    if ('isIncompatible' in comparisonResult) {
      return (
        <IncompatibleComparison
          currentDevice={comparisonResult.currentDevice}
          newDevice={comparisonResult.newDevice}
          explanation={comparisonResult.explanation}
          onReset={resetForm}
        />
      );
    }
    return <ComparisonResult data={comparisonResult} onReset={resetForm} />;
  }



  // Main form
  return (
    <>
      <ComparisonFormInputs
        currentProduct={currentProduct}
        setCurrentProduct={setCurrentProduct}
        newProduct={newProduct}
        setNewProduct={setNewProduct}
        isLoading={isLoading}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
      />

      <ComparisonDialogs
        showProductNotFound={showProductNotFound}
        setShowProductNotFound={setShowProductNotFound}
        notFoundProduct={notFoundProduct}
        showQueue={showQueue}
        setShowQueue={setShowQueue}
        showPreciseSpecs={showPreciseSpecs}
        setShowPreciseSpecs={setShowPreciseSpecs}
        onPreciseSpecsSubmit={handlePreciseSpecsSubmit}
        onSkipPreciseSpecs={handleSkipPreciseSpecs}
        isPaidUser={false}
        preciseDevice={preciseDevice}
        category={category}
      />
    </>
  );
};

export default ComparisonForm;
