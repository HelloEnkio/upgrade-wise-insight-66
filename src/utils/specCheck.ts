export const MIN_SPEC_COUNT = 3;

export interface SpecData {
  connoisseurSpecs?: unknown[];
}

export function needsPreciseSpecs(data: SpecData, min: number = MIN_SPEC_COUNT): boolean {
  const count = data.connoisseurSpecs?.length ?? 0;
  return count < min;
}
