import React, { useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { X, ArrowLeft, Download, Star, ExternalLink, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';

interface ProductData {
  name: string;
  scores: Record<string, number>;
  overallScore: number;
  recommendation: string;
  affiliateLink?: string;
}

interface MultiComparisonData {
  categories: string[];
  products: ProductData[];
}

interface MultiCompareResultsProps {
  data: MultiComparisonData;
  plan: 'basic' | 'premium';
  onClose: () => void;
  onBackToForm: () => void;
}

const MultiCompareResults = ({ data, plan, onClose, onBackToForm }: MultiCompareResultsProps) => {
  const [isConnoisseurView, setIsConnoisseurView] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();
  const exportRef = useRef<HTMLDivElement>(null);

  const comparisonData = data;

  const handleExportImage = async () => {
    if (!exportRef.current) return;
    
    setIsExporting(true);
    toast({
      title: "Exporting...",
      description: "Your analysis is being exported as an image.",
    });

    try {
      const canvas = await html2canvas(exportRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
        allowTaint: true
      });

      const link = document.createElement('a');
      link.download = `product-comparison-${Date.now()}.png`;
      link.href = canvas.toDataURL();
      link.click();

      toast({
        title: "Export complete!",
        description: "Your analysis image has been downloaded.",
      });
    } catch (error) {
      console.error('Export failed:', error);
      toast({
        title: "Export failed",
        description: "There was an error exporting your analysis.",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportExcel = () => {
    if (plan !== 'premium') {
      toast({
        title: "Premium Feature",
        description: "Excel export is only available with the Premium plan.",
        variant: "destructive"
      });
      return;
    }

    setIsExporting(true);
    toast({
      title: "Exporting Excel...",
      description: "Your analysis is being exported as an Excel file.",
    });

    try {
      // Create workbook
      const workbook = XLSX.utils.book_new();
      
      // Prepare data for Excel
      const excelData = [];
      
      // Header row
      const headerRow = ['Category', ...comparisonData.products.map(p => p.name)];
      excelData.push(headerRow);
      
      // Overall Score row
      const overallRow = ['Overall Score', ...comparisonData.products.map(p => p.overallScore)];
      excelData.push(overallRow);
      
      // Category rows
      comparisonData.categories.forEach(category => {
        const categoryRow = [category, ...comparisonData.products.map(p => p.scores[category])];
        excelData.push(categoryRow);
      });
      
      // Recommendation row
      const recommendationRow = ['Recommendation', ...comparisonData.products.map(p => p.recommendation)];
      excelData.push(recommendationRow);
      
      // Affiliate Links row
      const affiliateRow = ['Product Link', ...comparisonData.products.map(p => p.affiliateLink)];
      excelData.push(affiliateRow);

      // Create worksheet
      const worksheet = XLSX.utils.aoa_to_sheet(excelData);
      
      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Product Comparison');
      
      // Generate Excel file and trigger download
      XLSX.writeFile(workbook, `product-comparison-${Date.now()}.xlsx`);

      toast({
        title: "Export complete!",
        description: "Your Excel analysis file has been downloaded.",
      });
    } catch (error) {
      console.error('Excel export failed:', error);
      toast({
        title: "Export failed",
        description: "There was an error exporting your Excel file.",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600 bg-green-50';
    if (score >= 70) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getRecommendationColor = (rec: string) => {
    if (rec === 'Best Choice') return 'text-green-600 bg-green-50';
    if (rec === 'Good Value') return 'text-blue-600 bg-blue-50';
    return 'text-gray-600 bg-gray-50';
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-7xl max-h-[95vh] overflow-y-auto bg-white">
        <CardContent className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBackToForm}
                className="p-2 hover:bg-tech-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h2 className="text-2xl font-bold text-tech-dark">Multi-Product Analysis</h2>
                <p className="text-tech-gray-600">{comparisonData.products.length} products compared • {plan} plan</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleExportImage}
                disabled={isExporting}
              >
                <Download className="w-4 h-4 mr-2" />
                {isExporting ? 'Exporting...' : 'Export Image'}
              </Button>
              {plan === 'premium' && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleExportExcel}
                  disabled={isExporting}
                >
                  <Download className="w-4 h-4 mr-2" />
                  {isExporting ? 'Exporting...' : 'Export Excel'}
                </Button>
              )}
              <button
                onClick={onClose}
                className="p-2 hover:bg-tech-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Export Warning */}
          <Alert className="mb-6 border-orange-200 bg-orange-50">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              <strong>Important:</strong> This site does not save your analyses. 
              {plan === 'basic' && " Make sure to export your results as an image to keep them."}
              {plan === 'premium' && " Make sure to export your results as an image or Excel file to keep them."}
            </AlertDescription>
          </Alert>

          <div ref={exportRef}>
            {/* View Toggle */}
            <Card className="bg-white/80 backdrop-blur-sm border-tech-gray-200 shadow-card mb-6">
              <CardContent className="p-4">
                <div className="flex items-center justify-center space-x-4">
                  <Label htmlFor="view-toggle" className="text-tech-gray-600 font-medium">
                    Simple View
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

            {/* Comparison Table */}
            <Card className="bg-white/80 backdrop-blur-sm border-tech-gray-200 shadow-card">
              <CardContent className="p-6">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="font-bold text-tech-dark">Category</TableHead>
                        {comparisonData.products.map((product, index) => (
                          <TableHead key={index} className="text-center font-bold text-tech-dark min-w-[150px]">
                            <div className="flex flex-col items-center space-y-2">
                              <span className="truncate max-w-[120px]">{product.name}</span>
                              <div className={`px-2 py-1 rounded-full text-xs font-medium ${getRecommendationColor(product.recommendation)}`}>
                                {product.recommendation}
                              </div>
                              <a
                                href={product.affiliateLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center text-xs text-tech-electric hover:text-tech-electric-dark hover:underline"
                              >
                                <ExternalLink className="w-3 h-3 mr-1" />
                                View Product
                              </a>
                            </div>
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {/* Overall Score */}
                      <TableRow className="bg-tech-gray-50">
                        <TableCell className="font-semibold text-tech-dark">
                          <div className="flex items-center">
                            <Star className="w-4 h-4 mr-2 text-tech-electric" />
                            Overall Score
                          </div>
                        </TableCell>
                        {comparisonData.products.map((product, index) => (
                          <TableCell key={index} className="text-center">
                            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full font-bold text-lg ${getScoreColor(product.overallScore)}`}>
                              {product.overallScore}
                            </div>
                          </TableCell>
                        ))}
                      </TableRow>
                      
                      {/* Category Scores */}
                      {comparisonData.categories.map((category) => (
                        <TableRow key={category}>
                          <TableCell className="font-medium text-tech-dark">{category}</TableCell>
                          {comparisonData.products.map((product, index) => (
                            <TableCell key={index} className="text-center">
                              {isConnoisseurView ? (
                                <div className="space-y-1">
                                  <div className={`inline-flex items-center justify-center w-10 h-10 rounded-full font-bold ${getScoreColor(product.scores[category])}`}>
                                    {product.scores[category]}
                                  </div>
                                  <div className="text-xs text-tech-gray-500">
                                    {category === 'Performance' && 'CPU/GPU benchmarks'}
                                    {category === 'Price' && 'Value for money'}
                                    {category === 'Battery Life' && 'Hours of usage'}
                                    {category === 'Display' && 'Resolution & quality'}
                                    {category === 'Storage' && 'Capacity & speed'}
                                    {category === 'Camera' && 'Photo & video quality'}
                                  </div>
                                </div>
                              ) : (
                                <div className={`inline-flex items-center justify-center w-10 h-10 rounded-full font-bold ${getScoreColor(product.scores[category])}`}>
                                  {product.scores[category]}
                                </div>
                              )}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Analysis Summary */}
            <Card className="bg-gradient-to-r from-tech-electric/5 to-tech-neon/5 border-tech-electric/20 shadow-electric mt-6">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-tech-dark mb-4">Analysis Summary</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-tech-electric mb-2">Best Overall</h4>
                    <p className="text-tech-gray-700">{comparisonData.products[0].name} offers the best combination of performance and value.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-tech-electric mb-2">Best Value</h4>
                    <p className="text-tech-gray-700">{comparisonData.products[1]?.name || comparisonData.products[0].name} provides excellent features for the price point.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MultiCompareResults;
