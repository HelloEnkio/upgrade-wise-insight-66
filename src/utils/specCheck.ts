export const MIN_SPEC_COUNT = 3;

export interface SpecData {
  specs?: unknown[];
  technicalSpecs?: unknown[];
}

export function needsPreciseSpecs(data: SpecData, min: number = MIN_SPEC_COUNT): boolean {
  const specCount = data.specs?.length ?? 0;
  const techCount = data.technicalSpecs?.length ?? 0;
  return specCount < min || techCount < min;
}
