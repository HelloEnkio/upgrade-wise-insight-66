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
import { extractReasonCategory } from '@/utils/reasons';

interface ComparisonData {
  currentDevice: string;
  newDevice: string;
  recommendation: 'upgrade' | 'keep' | 'maybe';
  score: number;
  reasons?: string[];
  takeHome: string;
  connoisseurSpecs: {
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
            specs={data.connoisseurSpecs}
          />
        ) : (
          <>
            <Card className="bg-white/80 backdrop-blur-sm border border-tech-gray-200 shadow-soft">
              <CardContent className="p-8">
                <h3 className="text-xl font-bold text-tech-dark mb-6">Take Home Summary</h3>
                <p className="text-tech-gray-700 whitespace-pre-line">{data.takeHome}</p>
              </CardContent>
            </Card>
            {data.connoisseurSpecs && data.connoisseurSpecs.length > 0 && (
              <Card className="bg-white/80 backdrop-blur-sm border border-tech-gray-200 shadow-soft">
                <CardContent className="p-8">
                  <h3 className="text-xl font-bold text-tech-dark mb-6">Quick Spec Comparison</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="font-bold text-tech-dark">Component</TableHead>
                        <TableHead className="font-bold text-tech-dark text-center">{data.currentDevice}</TableHead>
                        <TableHead className="font-bold text-tech-dark text-center">Impact</TableHead>
                        <TableHead className="font-bold text-tech-dark text-center">{data.newDevice}</TableHead>
                        <TableHead className="font-bold text-tech-dark text-center">Why Better?</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.connoisseurSpecs.map((spec, index) => (
                        <TableRow key={index} className="hover:bg-tech-gray-50/50">
                          <TableHead scope="row" className="font-semibold text-tech-dark">
                            <div>
                              {spec.category}
                              {spec.subcategory && (
                                <div className="text-sm text-tech-gray-600 font-normal">{spec.subcategory}</div>
                              )}
                            </div>
                          </TableHead>
                          <TableCell className="text-center text-tech-gray-700">{spec.current.value}</TableCell>
                          <TableCell className="text-center">{getImprovementIcon(spec.improvement)}</TableCell>
                          <TableCell className="text-center font-semibold text-tech-dark">{spec.new.value}</TableCell>
                          <TableCell className="text-center">
                            <span className="text-xs text-tech-gray-600 font-medium">
                              {getBriefExplanation(spec.category, spec.improvement)}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
            {data.reasons && data.reasons.length > 0 && (
              <Card className="bg-white/80 backdrop-blur-sm border border-tech-gray-200 shadow-soft">
                <CardContent className="p-8">
                  <h3 className="text-xl font-bold text-tech-dark mb-6">Key Reasons</h3>
                  <Table>
                    <TableBody>
                      {data.reasons.map((reason, index) => {
                        const { title, description } = extractReasonCategory(reason);
                        return (
                          <TableRow key={index}>
                            <TableHead scope="row" className="w-40 font-semibold text-tech-dark">
                              {title || `Reason ${index + 1}`}
                            </TableHead>
                            <TableCell className="text-tech-gray-700">{description}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
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
