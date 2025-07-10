
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
  onSubmit: (specs: PreciseSpecs) => void;
}

interface PreciseSpecs {
  processor: string;
  ram: string;
  storage: string;
  display: string;
  battery: string;
  additionalSpecs: string;
}

const PreciseSpecsDialog = ({ isOpen, onClose, onSubmit }: PreciseSpecsDialogProps) => {
  const [specs, setSpecs] = useState<PreciseSpecs>({
    processor: '',
    ram: '',
    storage: '',
    display: '',
    battery: '',
    additionalSpecs: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(specs);
    onClose();
  };

  const handleInputChange = (field: keyof PreciseSpecs, value: string) => {
    setSpecs(prev => ({ ...prev, [field]: value }));
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
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="processor" className="flex items-center space-x-2">
                <Cpu className="h-4 w-4 text-blue-600" />
                <span>Processor</span>
              </Label>
              <Input
                id="processor"
                placeholder="e.g., Apple M3, Intel Core i7-13700H"
                value={specs.processor}
                onChange={(e) => handleInputChange('processor', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ram" className="flex items-center space-x-2">
                <HardDrive className="h-4 w-4 text-green-600" />
                <span>RAM</span>
              </Label>
              <Input
                id="ram"
                placeholder="e.g., 16GB LPDDR5, 32GB DDR4"
                value={specs.ram}
                onChange={(e) => handleInputChange('ram', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="storage" className="flex items-center space-x-2">
                <HardDrive className="h-4 w-4 text-purple-600" />
                <span>Storage</span>
              </Label>
              <Input
                id="storage"
                placeholder="e.g., 512GB SSD, 1TB NVMe"
                value={specs.storage}
                onChange={(e) => handleInputChange('storage', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="display" className="flex items-center space-x-2">
                <Monitor className="h-4 w-4 text-orange-600" />
                <span>Display</span>
              </Label>
              <Input
                id="display"
                placeholder="e.g., 13.6&quot; Liquid Retina, 15.6&quot; OLED 4K"
                value={specs.display}
                onChange={(e) => handleInputChange('display', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="battery" className="flex items-center space-x-2">
                <Battery className="h-4 w-4 text-red-600" />
                <span>Battery Life</span>
              </Label>
              <Input
                id="battery"
                placeholder="e.g., 18 hours, 5000mAh"
                value={specs.battery}
                onChange={(e) => handleInputChange('battery', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="additionalSpecs">Additional Specifications</Label>
              <Textarea
                id="additionalSpecs"
                placeholder="Any other important specs (GPU, ports, weight, etc.)"
                value={specs.additionalSpecs}
                onChange={(e) => handleInputChange('additionalSpecs', e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Tip:</strong> The more precise you are with specifications, the more accurate our comparison will be!
            </p>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Analyze with Precise Specs
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PreciseSpecsDialog;
