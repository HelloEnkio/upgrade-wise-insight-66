import { useQuery, useQueryClient } from '@tanstack/react-query';
import { backendService } from '@/services/backendService';
import { useEffect } from 'react';

export const useComparison = (currentProduct, newProduct, preciseSpecs) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (preciseSpecs) {
      queryClient.invalidateQueries(['comparison', currentProduct, newProduct]);
    }
  }, [preciseSpecs, currentProduct, newProduct, queryClient]);

  return useQuery(
    ['comparison', currentProduct, newProduct, preciseSpecs],
    () => backendService.getProductComparison(currentProduct, newProduct),
    {
      enabled: Boolean(currentProduct && newProduct)
    }
  );
};
