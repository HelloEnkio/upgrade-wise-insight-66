
interface CacheEntry {
  data: any;
  timestamp: number;
  expiresAt: number;
  source: 'api' | 'mock';
}

class CacheServiceClass {
  private cache = new Map<string, CacheEntry>();
  private readonly CACHE_KEYS = {
    SPECS: 'specs',
    COMPARISON: 'comparison'
  };

  // Cache durations in milliseconds
  private readonly CACHE_DURATIONS = {
    SPECS: 7 * 24 * 60 * 60 * 1000, // 7 days for specs
    COMPARISON: 24 * 60 * 60 * 1000, // 24 hours for comparisons
    PRICE: 1 * 60 * 60 * 1000 // 1 hour for prices
  };

  constructor() {
    this.loadFromLocalStorage();
  }

  private generateKey(type: string, ...params: string[]): string {
    return `${type}:${params.join('|').toLowerCase()}`;
  }

  set(type: string, data: any, params: string[], source: 'api' | 'mock' = 'api'): void {
    const key = this.generateKey(type, ...params);
    const duration = this.CACHE_DURATIONS[type as keyof typeof this.CACHE_DURATIONS] || this.CACHE_DURATIONS.SPECS;
    
    const entry: CacheEntry = {
      data,
      timestamp: Date.now(),
      expiresAt: Date.now() + duration,
      source
    };

    this.cache.set(key, entry);
    this.saveToLocalStorage();
  }

  get(type: string, ...params: string[]): any | null {
    const key = this.generateKey(type, ...params);
    const entry = this.cache.get(key);

    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      this.saveToLocalStorage();
      return null;
    }

    return {
      ...entry.data,
      _cached: true,
      _cacheAge: Date.now() - entry.timestamp,
      _source: entry.source
    };
  }

  isExpired(type: string, ...params: string[]): boolean {
    const key = this.generateKey(type, ...params);
    const entry = this.cache.get(key);
    
    if (!entry) return true;
    return Date.now() > entry.expiresAt;
  }

  invalidate(type: string, ...params: string[]): void {
    const key = this.generateKey(type, ...params);
    this.cache.delete(key);
    this.saveToLocalStorage();
  }

  clear(): void {
    this.cache.clear();
    localStorage.removeItem('gemini-cache');
  }

  getStats() {
    const entries = Array.from(this.cache.values());
    const now = Date.now();
    
    return {
      totalEntries: entries.length,
      apiEntries: entries.filter(e => e.source === 'api').length,
      mockEntries: entries.filter(e => e.source === 'mock').length,
      expiredEntries: entries.filter(e => now > e.expiresAt).length,
      averageAge: entries.length > 0 ? 
        entries.reduce((sum, e) => sum + (now - e.timestamp), 0) / entries.length : 0
    };
  }

  private saveToLocalStorage(): void {
    try {
      const cacheData = Array.from(this.cache.entries());
      localStorage.setItem('gemini-cache', JSON.stringify(cacheData));
    } catch (error) {
      console.warn('Failed to save cache to localStorage:', error);
    }
  }

  private loadFromLocalStorage(): void {
    try {
      const cached = localStorage.getItem('gemini-cache');
      if (cached) {
        const cacheData = JSON.parse(cached);
        this.cache = new Map(cacheData);
        
        // Clean expired entries
        const now = Date.now();
        for (const [key, entry] of this.cache.entries()) {
          if (now > entry.expiresAt) {
            this.cache.delete(key);
          }
        }
      }
    } catch (error) {
      console.warn('Failed to load cache from localStorage:', error);
      this.cache.clear();
    }
  }
}

export const cacheService = new CacheServiceClass();
