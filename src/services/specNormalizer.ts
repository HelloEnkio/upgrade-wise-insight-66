export interface RawSpecItem {
  category: string;
  subcategory?: string;
  currentValue?: string;
  currentTechnical?: string;
  newValue?: string;
  newTechnical?: string;
  improvement?: 'better' | 'worse' | 'same';
  score?: number;
  details?: string;
  // allow unknown extra fields
  [key: string]: any;
}

export interface NormalizedSpecItem {
  category: string;
  subcategory?: string;
  current: { value: string; technical: string };
  new: { value: string; technical: string };
  improvement: 'better' | 'worse' | 'same';
  score: number;
  details: string;
}

export function normalizeConnoisseurSpecs(specs: RawSpecItem[] | undefined): NormalizedSpecItem[] {
  if (!Array.isArray(specs)) return [];
  return specs.map((item) => {
    const current = {
      value: item.current?.value ?? item.currentValue ?? '',
      technical: item.current?.technical ?? item.currentTechnical ?? ''
    };
    const newData = {
      value: item.new?.value ?? item.newValue ?? '',
      technical: item.new?.technical ?? item.newTechnical ?? ''
    };
    return {
      category: item.category,
      subcategory: item.subcategory,
      current,
      new: newData,
      improvement: item.improvement ?? 'same',
      score: item.score ?? 0,
      details: item.details ?? ''
    };
  });
}
