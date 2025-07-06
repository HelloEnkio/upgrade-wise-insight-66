
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Loader2 } from 'lucide-react';

interface ComparisonFormInputsProps {
  currentProduct: string;
  setCurrentProduct: (value: string) => void;
  newProduct: string;
  setNewProduct: (value: string) => void;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

const ComparisonFormInputs = ({
  currentProduct,
  setCurrentProduct,
  newProduct,
  setNewProduct,
  isLoading,
  onSubmit
}: ComparisonFormInputsProps) => {
  return (
    <div className="w-full max-w-2xl mx-auto animate-slide-up space-y-6">
      {/* Free Service Indicator */}
      <div className="text-center">
        <div className="inline-flex items-center space-x-2 text-xs text-tech-gray-500 bg-green-50 px-3 py-1 rounded-full border border-green-200">
          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
          <span className="font-medium text-green-700">Free Comparison Service</span>
        </div>
      </div>
      
      <Card className="bg-white/80 backdrop-blur-sm shadow-electric border-0 overflow-hidden">
        <CardContent className="p-8 md:p-12">
          <form onSubmit={onSubmit} className="space-y-8">
            <div className="space-y-3">
              <Label 
                htmlFor="current-product" 
                className="text-base font-semibold text-tech-gray-700 block"
              >
                Your current device
              </Label>
              <Input
                id="current-product"
                type="text"
                placeholder="e.g. MacBook Air M1"
                value={currentProduct}
                onChange={(e) => setCurrentProduct(e.target.value)}
                className="h-14 text-lg bg-tech-gray-50/50 border-tech-gray-300 focus:border-tech-electric focus:ring-tech-electric/30 focus:shadow-neon transition-all duration-300 rounded-xl"
                required
                disabled={isLoading}
              />
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-tech-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-4 text-tech-electric font-bold">vs</span>
              </div>
            </div>

            <div className="space-y-3">
              <Label 
                htmlFor="new-product" 
                className="text-base font-semibold text-tech-gray-700 block"
              >
                Device you're considering
              </Label>
              <Input
                id="new-product"
                type="text"
                placeholder="e.g. MacBook Air M3"
                value={newProduct}
                onChange={(e) => setNewProduct(e.target.value)}
                className="h-14 text-lg bg-tech-gray-50/50 border-tech-gray-300 focus:border-tech-electric focus:ring-tech-electric/30 focus:shadow-neon transition-all duration-300 rounded-xl"
                required
                disabled={isLoading}
              />
            </div>

            <Button
              type="submit"
              disabled={!currentProduct.trim() || !newProduct.trim() || isLoading}
              className="w-full h-14 text-lg font-semibold bg-gradient-tech hover:shadow-electric text-white transition-all duration-300 rounded-xl group disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                  Compare Now
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComparisonFormInputs;
