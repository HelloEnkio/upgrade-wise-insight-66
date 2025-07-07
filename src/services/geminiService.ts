class GeminiServiceClass {
  private usage = {
    used: 0,
    remaining: 0,
    limit: 0,
    percentage: 0
  };

  private async updateUsage() {
    try {
      const res = await fetch('/api/usage');
      if (res.ok) {
        const data = await res.json();
        this.usage = {
          ...data,
          percentage: Math.round((data.used / data.limit) * 100)
        };
      }
    } catch (error) {
      console.error('Failed to fetch usage stats:', error);
    }
  }

  async getDailyUsage() {
    await this.updateUsage();
    return this.usage;
  }

  async isQuotaExceeded(): Promise<boolean> {
    await this.updateUsage();
    return this.usage.used >= this.usage.limit;
  }
}

export const geminiService = new GeminiServiceClass();
