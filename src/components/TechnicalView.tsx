
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface TechnicalSpec {
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
}

interface TechnicalViewProps {
  currentDevice: string;
  newDevice: string;
  specs: TechnicalSpec[];
}

const TechnicalView = ({ currentDevice, newDevice, specs }: TechnicalViewProps) => {
  const getImprovementIcon = (improvement: string) => {
    switch (improvement) {
      case 'better': return (
        <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full mx-auto">
          <span className="text-green-600 font-bold text-lg">&gt;</span>
        </div>
      );
      case 'worse': return (
        <div className="flex items-center justify-center w-8 h-8 bg-red-100 rounded-full mx-auto">
          <span className="text-red-600 font-bold text-lg">&lt;</span>
        </div>
      );
      case 'same': return (
        <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full mx-auto">
          <span className="text-gray-500 font-bold text-lg">=</span>
        </div>
      );
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 font-bold';
    if (score >= 60) return 'text-yellow-600 font-semibold';
    return 'text-red-600 font-semibold';
  };

  if (!specs || specs.length === 0) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-tech-gray-200 shadow-card">
        <CardContent className="p-8">
          <h3 className="text-xl font-bold text-tech-dark mb-6">Detailed Technical Analysis</h3>
          <p className="text-tech-gray-600 text-sm">No technical data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-tech-gray-200 shadow-card">
      <CardContent className="p-8">
        <h3 className="text-xl font-bold text-tech-dark mb-6">Detailed Technical Analysis</h3>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-bold text-tech-dark">Component</TableHead>
                <TableHead className="font-bold text-tech-dark text-center">
                  <div className="text-sm font-semibold text-tech-electric mb-1">{currentDevice}</div>
                  <div className="text-xs text-tech-gray-600 font-normal">Current</div>
                </TableHead>
                <TableHead className="font-bold text-tech-dark text-center">
                  <div className="text-sm font-semibold mb-1">Impact</div>
                  <div className="text-xs text-tech-gray-600 font-normal">Better/Worse/Same</div>
                </TableHead>
                <TableHead className="font-bold text-tech-dark text-center">
                  <div className="text-sm font-semibold text-tech-electric mb-1">{newDevice}</div>
                  <div className="text-xs text-tech-gray-600 font-normal">New</div>
                </TableHead>
                <TableHead className="font-bold text-tech-dark text-center">Score</TableHead>
                <TableHead className="font-bold text-tech-dark">Technical Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {specs.map((spec, index) => (
                <TableRow key={index} className="hover:bg-tech-gray-50/50">
                  <TableCell className="font-semibold text-tech-dark">
                    <div>
                      {spec.category}
                      {spec.subcategory && (
                        <div className="text-sm text-tech-gray-600 font-normal">
                          {spec.subcategory}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="text-tech-gray-700">{spec.current.value}</div>
                    <div className="text-xs text-tech-gray-500 mt-1">{spec.current.technical}</div>
                  </TableCell>
                  <TableCell className="text-center">
                    {getImprovementIcon(spec.improvement)}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="text-tech-dark font-semibold">{spec.new.value}</div>
                    <div className="text-xs text-tech-gray-600 mt-1">{spec.new.technical}</div>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className={getScoreColor(spec.score)}>{spec.score}/100</span>
                  </TableCell>
                  <TableCell className="text-sm text-tech-gray-600 max-w-xs">
                    {spec.details}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default TechnicalView;
