
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

interface IncompatibleComparisonProps {
  currentDevice: string;
  newDevice: string;
  explanation: string;
  onReset: () => void;
}

const IncompatibleComparison = ({ 
  currentDevice, 
  newDevice, 
  explanation, 
  onReset 
}: IncompatibleComparisonProps) => {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-slide-up">
      <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200 shadow-lg">
        <CardContent className="p-8 text-center">
          <div className="flex items-center justify-center mb-6">
            <AlertTriangle className="h-16 w-16 text-yellow-600" />
          </div>
          <h2 className="text-3xl font-bold mb-4 text-yellow-800">
            Comparison Not Possible
          </h2>
          <div className="bg-white/70 rounded-xl p-6 mb-6">
            <p className="text-lg text-gray-700 leading-relaxed">
              {explanation}
            </p>
          </div>
          <div className="text-sm text-yellow-700 mb-8">
            <strong>Attempted comparison:</strong> {currentDevice} vs {newDevice}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/80 backdrop-blur-sm border-tech-gray-200 shadow-card">
        <CardContent className="p-8">
          <h3 className="text-xl font-bold text-tech-dark mb-4">Valid comparison suggestions:</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-tech-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-tech-electric mb-2">Electronics</h4>
              <ul className="text-sm text-tech-gray-600 space-y-1">
                <li>• iPhone 13 vs iPhone 15</li>
                <li>• MacBook Air M1 vs M3</li>
                <li>• Samsung S22 vs S23</li>
              </ul>
            </div>
            <div className="bg-tech-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-tech-electric mb-2">Vehicles</h4>
              <ul className="text-sm text-tech-gray-600 space-y-1">
                <li>• Renault Clio vs Peugeot 208</li>
                <li>• Mountain bike vs Road bike</li>
                <li>• Tesla Model 3 vs BMW i4</li>
              </ul>
            </div>
            <div className="bg-tech-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-tech-electric mb-2">Lighting</h4>
              <ul className="text-sm text-tech-gray-600 space-y-1">
                <li>• LED bulb vs Halogen</li>
                <li>• Philips Hue vs IKEA Trådfri</li>
                <li>• Fluorescent vs LED</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-center">
        <button
          onClick={onReset}
          className="px-8 py-3 bg-gradient-to-r from-tech-electric to-tech-neon text-white font-semibold rounded-xl hover:shadow-electric transition-all duration-300"
        >
          Try a New Comparison
        </button>
      </div>
    </div>
  );
};

export default IncompatibleComparison;
