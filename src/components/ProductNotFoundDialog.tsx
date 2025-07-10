
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Search, Lightbulb } from 'lucide-react';

interface ProductNotFoundDialogProps {
  isOpen: boolean;
  onClose: () => void;
  searchTerm: string;
}

const ProductNotFoundDialog = ({ isOpen, onClose, searchTerm }: ProductNotFoundDialogProps) => {
  const suggestions = [
    "Try including the model year (e.g., iPhone 15 2023)",
    "Add brand name (e.g., Samsung Galaxy S23)",
    "Include specific model (e.g., MacBook Air M3)",
    "Check spelling and try again",
    "Use common product names (e.g., iPad Pro instead of tablet)"
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md" aria-describedby="product-not-found-desc">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Search className="h-5 w-5 text-red-500" />
            <span>Product Not Found</span>
          </DialogTitle>
        </DialogHeader>
        <DialogDescription id="product-not-found-desc">
          This dialog shows search tips when no matching product is found.
        </DialogDescription>

        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            We couldn't find "<span className="font-semibold">{searchTerm}</span>" in our database.
          </p>
          
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Lightbulb className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-semibold text-blue-900">Suggestions:</span>
            </div>
            <ul className="text-xs text-blue-800 space-y-1">
              {suggestions.map((suggestion, index) => (
                <li key={index}>• {suggestion}</li>
              ))}
            </ul>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={onClose}>
              Try Again
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductNotFoundDialog;
