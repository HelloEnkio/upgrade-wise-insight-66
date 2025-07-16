import { describe, it, expect } from 'vitest';
import { getProductCategory, areProductsComparable, generateIncompatibleExplanation, normalizeCategory } from './productCategories';

describe('getProductCategory', () => {
  it('detects electronics category', () => {
    expect(getProductCategory('MacBook Pro')).toBe('electronics');
  });

  it('detects vehicles category', () => {
    expect(getProductCategory('Voiture neuve')).toBe('vehicles');
  });

  it('detects lighting category', () => {
    expect(getProductCategory('ampoule LED')).toBe('lighting');
  });

  it('detects smartphone brands as electronics', () => {
    expect(getProductCategory('Xiaomi 12')).toBe('electronics');
  });

  it('returns null for unknown product', () => {
    expect(getProductCategory('some random item')).toBeNull();
  });
});

describe('areProductsComparable', () => {
  it('returns true for products in the same category', () => {
    expect(areProductsComparable('MacBook Pro', 'iPhone 15')).toBe(true);
  });

  it('returns false for products in different categories', () => {
    expect(areProductsComparable('MacBook Pro', 'Honda car')).toBe(false);
  });

  it('returns true if categories are unknown', () => {
    expect(areProductsComparable('foo', 'bar')).toBe(true);
  });
});

describe('generateIncompatibleExplanation', () => {
  it('mentions categories in the explanation', () => {
    const message = generateIncompatibleExplanation('MacBook Pro', 'Toyota car');
    expect(message).toContain('MacBook Pro');
    expect(message).toContain('Toyota car');
    expect(message).toContain('electronics');
    expect(message).toContain('vehicles');
  });
});

describe('normalizeCategory', () => {
  it('maps plural categories to singular form', () => {
    expect(normalizeCategory('vehicles')).toBe('vehicle');
  });

  it('keeps unknown categories unchanged', () => {
    expect(normalizeCategory('lighting')).toBe('lighting');
  });
});
