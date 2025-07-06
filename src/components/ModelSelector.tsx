
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ModelOption {
  id: string;
  name: string;
  year: string;
  specs: string[];
  price?: string;
}

interface ModelSelectorProps {
  device: string;
  models: ModelOption[];
  onSelect: (model: ModelOption) => void;
  onBack: () => void;
}

const ModelSelector = ({ device, models, onSelect, onBack }: ModelSelectorProps) => {
  return (
    <div className="w-full max-w-4xl mx-auto animate-slide-up">
      <Card className="bg-white/80 backdrop-blur-sm shadow-electric border-0">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-tech-dark mb-4">
              Which {device} model exactly?
            </h2>
            <p className="text-tech-gray-600">
              We found multiple models. Please select the specific one you're interested in:
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-8">
            {models.map((model) => (
              <Card 
                key={model.id}
                className="border-tech-gray-200 hover:border-tech-electric hover:shadow-soft transition-all duration-300 cursor-pointer group"
                onClick={() => onSelect(model)}
              >
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-tech-dark group-hover:text-tech-electric transition-colors">
                      {model.name}
                    </h3>
                    <span className="text-sm bg-tech-electric/10 text-tech-electric px-2 py-1 rounded-full">
                      {model.year}
                    </span>
                  </div>
                  
                  <ul className="space-y-1 mb-4">
                    {model.specs.map((spec, index) => (
                      <li key={index} className="text-sm text-tech-gray-600 flex items-center">
                        <div className="w-1 h-1 bg-tech-electric rounded-full mr-2"></div>
                        {spec}
                      </li>
                    ))}
                  </ul>
                  
                  {model.price && (
                    <div className="text-lg font-bold text-tech-electric">
                      {model.price}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button
              onClick={onBack}
              variant="outline"
              className="border-tech-gray-300 text-tech-gray-600 hover:border-tech-electric hover:text-tech-electric"
            >
              ← Back to Search
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ModelSelector;
