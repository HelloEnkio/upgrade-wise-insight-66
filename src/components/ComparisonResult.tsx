import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { CheckCircle, XCircle, AlertTriangle, ShoppingCart } from 'lucide-react';
import TechnicalView from './TechnicalView';
import MultiCompareButton from './MultiCompareButton';
import MultiCompare from './MultiCompare';

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

interface ComparisonResultProps {
  data: ComparisonData;
  onReset: () => void;
}

const ComparisonResult = ({ data, onReset }: ComparisonResultProps) => {
  const [isConnoisseurView, setIsConnoisseurView] = useState(false);
  const [showMultiCompare, setShowMultiCompare] = useState(false);

  const getRecommendationColor = () => {
    switch (data.recommendation) {
      case 'upgrade': return 'text-green-600';
      case 'keep': return 'text-red-600';
      case 'maybe': return 'text-yellow-600';
    }
  };

  const getRecommendationIcon = () => {
    switch (data.recommendation) {
      case 'upgrade': return <CheckCircle className="h-8 w-8 text-green-600" />;
      case 'keep': return <XCircle className="h-8 w-8 text-red-600" />;
      case 'maybe': return <AlertTriangle className="h-8 w-8 text-yellow-600" />;
    }
  };

  const getRecommendationText = () => {
    switch (data.recommendation) {
      case 'upgrade': return 'Yes, upgrade!';
      case 'keep': return 'Keep your current device';
      case 'maybe': return 'Consider upgrading';
    }
  };

  const getImprovementIcon = (improvement: string) => {
    switch (improvement) {
      case 'better': return (
        <div className="flex items-center justify-center w-6 h-6 bg-green-100 rounded-full mx-auto">
          <span className="text-green-600 font-bold text-sm">&gt;</span>
        </div>
      );
      case 'worse': return (
        <div className="flex items-center justify-center w-6 h-6 bg-red-100 rounded-full mx-auto">
          <span className="text-red-600 font-bold text-sm">&lt;</span>
        </div>
      );
      case 'same': return (
        <div className="flex items-center justify-center w-6 h-6 bg-gray-100 rounded-full mx-auto">
          <span className="text-gray-500 font-bold text-sm">=</span>
        </div>
      );
    }
  };

  const getBriefExplanation = (category: string, improvement: string) => {
    if (improvement === 'same') return 'Identical';
    if (improvement === 'worse') return 'Downgrade';
    
    switch (category.toLowerCase()) {
      case 'processor': return 'Much faster';
      case 'memory': return 'Better speed';
      case 'storage': return 'Faster access';
      case 'display': return 'Better quality';
      case 'battery life': return 'Longer lasting';
      case 'battery': return 'Longer lasting';
      case 'connectivity': return 'Faster connection';
      default: return 'Improved';
    }
  };

  const handleBuyClick = () => {
    // Ici on pourrait ajouter le tracking analytics et rediriger vers le lien d'affiliation
    console.log('Affiliate link clicked for:', data.newDevice);
    // window.open(affiliateLink, '_blank');
  };

  return (
    <>
      <div className="w-full max-w-4xl mx-auto space-y-6 animate-slide-up">
        {/* Header avec le verdict */}
        <Card className="bg-gradient-to-r from-white to-tech-gray-50 border-tech-electric/20 shadow-electric">
          <CardContent className="p-8 text-center">
            <div className="flex items-center justify-center mb-4">
              {getRecommendationIcon()}
            </div>
            <h2 className={`text-3xl font-bold mb-2 ${getRecommendationColor()}`}>
              {getRecommendationText()}
            </h2>
            <div className="flex items-center justify-center space-x-2 text-tech-gray-600 mb-6">
              <span className="font-semibold">Confidence Score:</span>
              <span className="text-2xl font-bold text-tech-electric">{data.score}%</span>
            </div>
            
            {/* Bouton d'achat pour les upgrades */}
            {data.recommendation === 'upgrade' && (
              <div className="mt-6">
                <button
                  onClick={handleBuyClick}
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 group"
                >
                  <ShoppingCart className="mr-3 h-5 w-5 group-hover:animate-bounce" />
                  Buy {data.newDevice} Now
                  <span className="ml-2 text-sm opacity-90">Best Price</span>
                </button>
                <p className="text-xs text-tech-gray-500 mt-2">
                  Affiliate link - We may earn a commission
                </p>
              </div>
            )}
            
            {/* Multi Compare Button */}
            <div className="mt-6 pt-4 border-t border-tech-gray-200">
              <MultiCompareButton 
                onClick={() => setShowMultiCompare(true)}
                className="text-xs"
              />
            </div>
          </CardContent>
        </Card>

        {/* Toggle Switch */}
        <Card className="bg-white/80 backdrop-blur-sm border-tech-gray-200 shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-center space-x-4">
              <Label htmlFor="view-toggle" className="text-tech-gray-600 font-medium">
                Take Home Message
              </Label>
              <Switch
                id="view-toggle"
                checked={isConnoisseurView}
                onCheckedChange={setIsConnoisseurView}
                className="data-[state=checked]:bg-tech-electric"
              />
              <Label htmlFor="view-toggle" className="text-tech-gray-600 font-medium">
                Connoisseur View
              </Label>
            </div>
          </CardContent>
        </Card>

        {/* Conditional View */}
        {isConnoisseurView ? (
          <TechnicalView 
            currentDevice={data.currentDevice}
            newDevice={data.newDevice}
            specs={data.technicalSpecs}
          />
        ) : (
          <>
            {/* Comparaison des spécifications */}
            <Card className="bg-white/80 backdrop-blur-sm border-tech-gray-200 shadow-card">
              <CardContent className="p-8">
                <h3 className="text-xl font-bold text-tech-dark mb-6">Technical Comparison</h3>
                <div className="overflow-x-auto">
                  <Table className="space-y-4">
                    <TableHeader>
                      <TableRow className="bg-tech-gray-100 rounded-xl font-semibold text-tech-dark text-sm">
                        <TableHead scope="col" className="px-4 py-3">Component</TableHead>
                        <TableHead scope="col" className="px-4 py-3 text-center">{data.currentDevice}</TableHead>
                        <TableHead scope="col" className="px-4 py-3 text-center">Impact</TableHead>
                        <TableHead scope="col" className="px-4 py-3 text-center">{data.newDevice}</TableHead>
                        <TableHead scope="col" className="px-4 py-3 text-center">Why Better?</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody className="space-y-4">
                      {data.specs.map((spec, index) => (
                        <React.Fragment key={index}>
                          <TableRow className="bg-tech-gray-50 rounded-xl">
                            <TableCell className="px-4 py-4 font-semibold text-tech-dark">
                              {spec.category}
                            </TableCell>
                            <TableCell className="px-4 py-4 text-center text-tech-gray-600">
                              {spec.current}
                            </TableCell>
                            <TableCell className="px-4 py-4 text-center">
                              {getImprovementIcon(spec.improvement)}
                            </TableCell>
                            <TableCell className="px-4 py-4 text-center font-semibold text-tech-dark">
                              {spec.new}
                            </TableCell>
                            <TableCell className="px-4 py-4 text-center">
                              <span className="text-xs text-tech-gray-600 font-medium">
                                {getBriefExplanation(spec.category, spec.improvement)}
                              </span>
                            </TableCell>
                          </TableRow>
                          {data.reasons[index] && (
                            <TableRow>
                              <TableCell
                                colSpan={5}
                                className="border-t border-tech-gray-200 px-4 pt-2 pb-4 text-tech-gray-700 text-sm"
                              >
                                {data.reasons[index]}
                              </TableCell>
                            </TableRow>
                          )}
                        </React.Fragment>
                      ))}
                      {data.reasons.slice(data.specs.length).map((reason, index) => (
                        <TableRow key={`extra-${index}`}>
                          <TableCell
                            colSpan={5}
                            className="p-4 bg-tech-gray-50 rounded-xl text-tech-gray-700 text-sm"
                          >
                            {reason}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Bouton pour recommencer */}
        <div className="text-center">
          <button
            onClick={onReset}
            className="px-8 py-3 bg-gradient-to-r from-tech-electric to-tech-neon text-white font-semibold rounded-xl hover:shadow-electric transition-all duration-300"
          >
            Compare Other Devices
          </button>
        </div>
      </div>
      
      {/* Multi Compare Modal */}
      {showMultiCompare && (
        <MultiCompare onClose={() => setShowMultiCompare(false)} />
      )}
    </>
  );
};

export default ComparisonResult;
