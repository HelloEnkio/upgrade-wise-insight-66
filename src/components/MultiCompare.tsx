
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Plus, CreditCard, Zap } from 'lucide-react';
import MultiCompareResults from './MultiCompareResults';

interface MultiCompareProps {
  onClose: () => void;
}

const MultiCompare = ({ onClose }: MultiCompareProps) => {
  const [products, setProducts] = useState<string[]>(['', '']);
  const [selectedPlan, setSelectedPlan] = useState<'basic' | 'premium' | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const addProduct = () => {
    const maxProducts = selectedPlan === 'basic' ? 5 : selectedPlan === 'premium' ? 15 : 5;
    if (products.length < maxProducts) {
      setProducts([...products, '']);
    }
  };

  const removeProduct = (index: number) => {
    if (products.length > 2) {
      setProducts(products.filter((_, i) => i !== index));
    }
  };

  const updateProduct = (index: number, value: string) => {
    const newProducts = [...products];
    newProducts[index] = value;
    setProducts(newProducts);
  };

  const handlePayAndAnalyze = async () => {
    if (!selectedPlan) return;
    
    setIsProcessing(true);
    // Simulation du paiement et de l'analyse
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessing(false);
    setShowResults(true);
  };

  const validProducts = products.filter(p => p.trim().length > 0);
  const canAnalyze = validProducts.length >= 2 && selectedPlan;

  if (showResults) {
    return (
      <MultiCompareResults 
        products={validProducts}
        plan={selectedPlan!}
        onClose={onClose}
        onBackToForm={() => setShowResults(false)}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
        <CardContent className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-tech-dark">Multi-Product Comparison</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-tech-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Products Input */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-tech-dark mb-4">Products to Compare</h3>
            <div className="space-y-3">
              {products.map((product, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={product}
                      onChange={(e) => updateProduct(index, e.target.value)}
                      placeholder={`Product ${index + 1}`}
                      className="w-full px-4 py-3 border border-tech-gray-200 rounded-lg focus:ring-2 focus:ring-tech-electric focus:border-transparent"
                    />
                  </div>
                  {products.length > 2 && (
                    <button
                      onClick={() => removeProduct(index)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            
            {products.length < (selectedPlan === 'basic' ? 5 : selectedPlan === 'premium' ? 15 : 5) && (
              <button
                onClick={addProduct}
                disabled={!selectedPlan}
                className="mt-3 inline-flex items-center px-4 py-2 text-sm font-medium text-tech-electric hover:text-tech-electric-dark disabled:text-tech-gray-400 disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </button>
            )}
          </div>

          {/* Pricing Plans */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-tech-dark mb-4">Choose Your Plan</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <Card 
                className={`cursor-pointer transition-all duration-300 ${
                  selectedPlan === 'basic' 
                    ? 'ring-2 ring-tech-electric border-tech-electric' 
                    : 'border-tech-gray-200 hover:border-tech-electric/50'
                }`}
                onClick={() => setSelectedPlan('basic')}
              >
                <CardContent className="p-6 text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-4">
                    <CreditCard className="w-6 h-6 text-blue-600" />
                  </div>
                  <h4 className="text-xl font-bold text-tech-dark mb-2">Basic Plan</h4>
                  <p className="text-3xl font-bold text-tech-electric mb-2">$2</p>
                  <p className="text-tech-gray-600 mb-4">Compare up to 5 products</p>
                  <ul className="text-sm text-tech-gray-600 space-y-1">
                    <li>• Detailed comparison table</li>
                    <li>• Connoisseur mode</li>
                    <li>• Skip queue</li>
                  </ul>
                </CardContent>
              </Card>

              <Card 
                className={`cursor-pointer transition-all duration-300 ${
                  selectedPlan === 'premium' 
                    ? 'ring-2 ring-tech-electric border-tech-electric' 
                    : 'border-tech-gray-200 hover:border-tech-electric/50'
                }`}
                onClick={() => setSelectedPlan('premium')}
              >
                <CardContent className="p-6 text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mx-auto mb-4">
                    <Zap className="w-6 h-6 text-green-600" />
                  </div>
                  <h4 className="text-xl font-bold text-tech-dark mb-2">Premium Plan</h4>
                  <p className="text-3xl font-bold text-tech-electric mb-2">$5</p>
                  <p className="text-tech-gray-600 mb-4">Compare up to 15 products</p>
                  <ul className="text-sm text-tech-gray-600 space-y-1">
                    <li>• Everything in Basic</li>
                    <li>• Advanced analytics</li>
                    <li>• Export results</li>
                    <li>• Priority support</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex justify-center">
            <Button
              onClick={handlePayAndAnalyze}
              disabled={!canAnalyze || isProcessing}
              className="px-8 py-3 text-lg font-semibold bg-gradient-to-r from-tech-electric to-tech-neon hover:shadow-electric disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <>Processing...</>
              ) : (
                <>
                  <CreditCard className="w-5 h-5 mr-2" />
                  Pay & Analyze ({validProducts.length} products)
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MultiCompare;
