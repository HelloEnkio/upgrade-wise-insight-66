
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Settings,
  Cpu,
  HardDrive,
  Monitor,
  Battery,
  Car
} from 'lucide-react';

interface FieldDef {
  key: string;
  label: string;
  placeholder?: string;
  icon?: React.ReactNode;
  textarea?: boolean;
}

const FIELD_SETS: Record<string, FieldDef[]> = {
  computer: [
    {
      key: 'processor',
      label: 'Processor',
      placeholder: 'e.g., Apple M3, Intel Core i7-13700H',
      icon: <Cpu className="h-4 w-4 text-blue-600" />
    },
    {
      key: 'ram',
      label: 'RAM',
      placeholder: 'e.g., 16GB LPDDR5, 32GB DDR4',
      icon: <HardDrive className="h-4 w-4 text-green-600" />
    },
    {
      key: 'storage',
      label: 'Storage',
      placeholder: 'e.g., 512GB SSD, 1TB NVMe',
      icon: <HardDrive className="h-4 w-4 text-purple-600" />
    },
    {
      key: 'display',
      label: 'Display',
      placeholder: 'e.g., 13.6" Liquid Retina, 15.6" OLED 4K',
      icon: <Monitor className="h-4 w-4 text-orange-600" />
    },
    {
      key: 'battery',
      label: 'Battery Life',
      placeholder: 'e.g., 18 hours, 5000mAh',
      icon: <Battery className="h-4 w-4 text-red-600" />
    },
    {
      key: 'additionalSpecs',
      label: 'Additional Specifications',
      placeholder: 'Any other important specs (GPU, ports, weight, etc.)',
      textarea: true
    }
  ],
  vehicle: [
    {
      key: 'fuelType',
      label: 'Fuel Type',
      placeholder: 'e.g., Gasoline, Electric',
      icon: <Car className="h-4 w-4 text-blue-600" />
    },
    {
      key: 'modelYear',
      label: 'Model Year',
      placeholder: 'e.g., 2024'
    },
    {
      key: 'transmission',
      label: 'Transmission',
      placeholder: 'e.g., Automatic'
    },
    {
      key: 'additionalSpecs',
      label: 'Additional Specifications',
      placeholder: 'Any other important specs (trim, mileage, etc.)',
      textarea: true
    }
  ]
};

interface PreciseSpecsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (specs: PreciseSpecs[]) => void;
  onSkip: () => void;
  isPaidUser?: boolean;
  device?: string;
  category?: string;
}

type PreciseSpecs = Record<string, string>;

const buildEmptySpecs = (category: string): PreciseSpecs => {
  const fields = FIELD_SETS[category] || FIELD_SETS.computer;
  return fields.reduce<PreciseSpecs>((acc, f) => {
    acc[f.key] = '';
    return acc;
  }, {} as PreciseSpecs);
};

const PreciseSpecsDialog = ({
  isOpen,
  onClose,
  onSubmit,
  onSkip,
  isPaidUser = false,
  device,
  category = 'computer'
}: PreciseSpecsDialogProps) => {
  const emptySpecs = buildEmptySpecs(category);
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
        className="sm:max-w-lg max-h-[80vh] overflow-y-auto overflow-x-hidden"
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
          <div className="flex justify-end">
            <Button
              type="button"
              variant="secondary"
              className="font-bold"
              onClick={onSkip}
            >
              Whatever, just compare the most common configuration.
            </Button>
          </div>
          {specsList.map((specs, idx) => (
            <div
              key={idx}
              className="space-y-4 border-b pb-4 last:border-none last:pb-0"
            >
              <h3 className="font-semibold">Device {idx + 1}</h3>
              {FIELD_SETS[category]?.map((field) => (
                <div key={field.key} className="space-y-2">
                  <Label
                    htmlFor={`${field.key}-${idx}`}
                    className="flex items-center space-x-2"
                  >
                    {field.icon}
                    <span>{field.label}</span>
                  </Label>
                  {field.textarea ? (
                    <Textarea
                      id={`${field.key}-${idx}`}
                      placeholder={field.placeholder}
                      value={specs[field.key] || ''}
                      onChange={(e) =>
                        handleInputChange(idx, field.key as keyof PreciseSpecs, e.target.value)
                      }
                      rows={3}
                    />
                  ) : (
                    <Input
                      id={`${field.key}-${idx}`}
                      placeholder={field.placeholder}
                      value={specs[field.key] || ''}
                      onChange={(e) =>
                        handleInputChange(idx, field.key as keyof PreciseSpecs, e.target.value)
                      }
                    />
                  )}
                </div>
              ))}
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
