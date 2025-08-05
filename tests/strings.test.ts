import { describe, it, expect } from 'vitest';
import { formatDeviceName } from '../src/utils/strings';

describe('formatDeviceName', () => {
  it('trims whitespace and title-cases the name', () => {
    expect(formatDeviceName(' messy   name ')).toBe('Messy Name');
  });
});
