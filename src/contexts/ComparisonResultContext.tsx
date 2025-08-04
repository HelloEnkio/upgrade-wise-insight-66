import React, { createContext, useContext, useState } from 'react';

interface ComparisonResultContextValue {
  hasResult: boolean;
  setHasResult: (value: boolean) => void;
  resetResult: () => void;
}

const ComparisonResultContext = createContext<ComparisonResultContextValue>({
  hasResult: false,
  setHasResult: () => {},
  resetResult: () => {},
});

interface ProviderProps {
  children: React.ReactNode;
  initialHasResult?: boolean;
}

export const ComparisonResultProvider = ({ children, initialHasResult = false }: ProviderProps) => {
  const [hasResult, setHasResult] = useState(initialHasResult);
  const resetResult = () => setHasResult(false);
  return (
    <ComparisonResultContext.Provider value={{ hasResult, setHasResult, resetResult }}>
      {children}
    </ComparisonResultContext.Provider>
  );
};

export const useComparisonResult = () => useContext(ComparisonResultContext);

export default ComparisonResultContext;
