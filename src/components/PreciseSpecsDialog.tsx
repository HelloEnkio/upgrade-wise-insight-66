
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Settings, Cpu, HardDrive, Monitor, Battery } from 'lucide-react';

interface PreciseSpecsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (specs: PreciseSpecs[]) => void;
  onSkip: () => void;
  isPaidUser?: boolean;
  device?: string;
}

interface PreciseSpecs {
  processor: string;
  ram: string;
  storage: string;
  display: string;
  battery: string;
  additionalSpecs: string;
}

const emptySpecs: PreciseSpecs = {
  processor: '',
  ram: '',
  storage: '',
  display: '',
  battery: '',
  additionalSpecs: ''
};

const PreciseSpecsDialog = ({ isOpen, onClose, onSubmit, onSkip, isPaidUser = false, device }: PreciseSpecsDialogProps) => {
  const [specsList, setSpecsList] = useState<PreciseSpecs[]>([ { ...emptySpecs } ]);

  const addDevice = () => {
    if (!isPaidUser && specsList.length >= 2) return;
    setSpecsList(prev => [...prev, { ...emptySpecs }]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(specsList);
    onClose();
  };

  const handleInputChange = (
    index: number,
    field: keyof PreciseSpecs,
    value: string
  ) => {
    setSpecsList(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-lg max-h-[80vh] overflow-y-auto"
        aria-describedby="precise-specs-desc"
      >
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5 text-blue-500" />
            <span>Specify Precise Specifications</span>
          </DialogTitle>
        </DialogHeader>
        <DialogDescription id="precise-specs-desc">
          Provide detailed hardware specifications for a more accurate comparison.
        </DialogDescription>
        {device && (
          <p className="text-sm text-gray-600 mt-2">
            More details are needed for <span className="font-semibold">{device}</span>.
          </p>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {specsList.map((specs, idx) => (
            <div key={idx} className="space-y-4 border-b pb-4 last:border-none last:pb-0">
              <h3 className="font-semibold">Device {idx + 1}</h3>
              <div className="space-y-2">
                <Label htmlFor={`processor-${idx}`} className="flex items-center space-x-2">
                  <Cpu className="h-4 w-4 text-blue-600" />
                  <span>Processor</span>
                </Label>
                <Input
                  id={`processor-${idx}`}
                  placeholder="e.g., Apple M3, Intel Core i7-13700H"
                  value={specs.processor}
                  onChange={(e) => handleInputChange(idx, 'processor', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`ram-${idx}`} className="flex items-center space-x-2">
                  <HardDrive className="h-4 w-4 text-green-600" />
                  <span>RAM</span>
                </Label>
                <Input
                  id={`ram-${idx}`}
                  placeholder="e.g., 16GB LPDDR5, 32GB DDR4"
                  value={specs.ram}
                  onChange={(e) => handleInputChange(idx, 'ram', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`storage-${idx}`} className="flex items-center space-x-2">
                  <HardDrive className="h-4 w-4 text-purple-600" />
                  <span>Storage</span>
                </Label>
                <Input
                  id={`storage-${idx}`}
                  placeholder="e.g., 512GB SSD, 1TB NVMe"
                  value={specs.storage}
                  onChange={(e) => handleInputChange(idx, 'storage', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`display-${idx}`} className="flex items-center space-x-2">
                  <Monitor className="h-4 w-4 text-orange-600" />
                  <span>Display</span>
                </Label>
                <Input
                  id={`display-${idx}`}
                  placeholder='e.g., 13.6" Liquid Retina, 15.6" OLED 4K'
                  value={specs.display}
                  onChange={(e) => handleInputChange(idx, 'display', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`battery-${idx}`} className="flex items-center space-x-2">
                  <Battery className="h-4 w-4 text-red-600" />
                  <span>Battery Life</span>
                </Label>
                <Input
                  id={`battery-${idx}`}
                  placeholder="e.g., 18 hours, 5000mAh"
                  value={specs.battery}
                  onChange={(e) => handleInputChange(idx, 'battery', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`additional-${idx}`}>Additional Specifications</Label>
                <Textarea
                  id={`additional-${idx}`}
                  placeholder="Any other important specs (GPU, ports, weight, etc.)"
                  value={specs.additionalSpecs}
                  onChange={(e) => handleInputChange(idx, 'additionalSpecs', e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          ))}
          {(isPaidUser || specsList.length < 2) && (
            <Button type="button" variant="outline" onClick={addDevice}>
              Add Another Device
            </Button>
          )}
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Tip:</strong> The more precise you are with specifications, the more accurate our comparison will be!
            </p>
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-end sm:space-x-2 space-y-2 sm:space-y-0">
            <Button type="button" variant="ghost" onClick={onSkip}>
              Whatever, just compare the most common configuration.
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Analyze with Precise Specs</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PreciseSpecsDialog;
