
import React from 'react';
import ProductNotFoundDialog from './ProductNotFoundDialog';
import QueueDialog from './QueueDialog';
import PreciseSpecsDialog from './PreciseSpecsDialog';

interface ComparisonDialogsProps {
  showProductNotFound: boolean;
  setShowProductNotFound: (show: boolean) => void;
  notFoundProduct: string;
  showQueue: boolean;
  setShowQueue: (show: boolean) => void;
  showPreciseSpecs: boolean;
  setShowPreciseSpecs: (show: boolean) => void;
  onPreciseSpecsSubmit: (specs: any) => void;
  onSkipPreciseSpecs: () => void;
  isPaidUser?: boolean;
  preciseDevice: string;
}

const ComparisonDialogs = ({
  showProductNotFound,
  setShowProductNotFound,
  notFoundProduct,
  showQueue,
  setShowQueue,
  showPreciseSpecs,
  setShowPreciseSpecs,
  onPreciseSpecsSubmit,
  onSkipPreciseSpecs,
  isPaidUser,
  preciseDevice
}: ComparisonDialogsProps) => {
  return (
    <>
      <ProductNotFoundDialog
        isOpen={showProductNotFound}
        onClose={() => setShowProductNotFound(false)}
        searchTerm={notFoundProduct}
      />
      
      <QueueDialog
        isOpen={showQueue}
        onClose={() => setShowQueue(false)}
      />

      <PreciseSpecsDialog
        isOpen={showPreciseSpecs}
        onClose={() => setShowPreciseSpecs(false)}
        onSubmit={onPreciseSpecsSubmit}
        onSkip={onSkipPreciseSpecs}
        isPaidUser={isPaidUser}
        device={preciseDevice}
      />
    </>
  );
};

export default ComparisonDialogs;
