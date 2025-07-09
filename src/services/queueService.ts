
import { logDevError } from '@/lib/devLogger';

interface QueuedRequest {
  id: string;
  priority: 'high' | 'normal' | 'low';
  type: 'comparison' | 'specs' | 'cache-update' | 'multi-comparison';
  data: any;
  resolve: (value: any) => void;
  reject: (error: any) => void;
  timestamp: number;
}

class QueueService {
  private queue: QueuedRequest[] = [];
  private processing = false;
  private requestCount = 0;
  private lastResetTime = Date.now();
  private readonly MAX_REQUESTS_PER_MINUTE = 15;
  private readonly MINUTE_IN_MS = 60 * 1000;

  async addToQueue<T>(
    type: QueuedRequest['type'],
    data: any,
    priority: QueuedRequest['priority'] = 'normal'
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      const request: QueuedRequest = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        priority,
        type,
        data,
        resolve,
        reject,
        timestamp: Date.now()
      };

      // Insert based on priority
      if (priority === 'high') {
        this.queue.unshift(request);
      } else {
        this.queue.push(request);
      }

      this.processQueue();
    });
  }

  private async processQueue() {
    if (this.processing || this.queue.length === 0) return;

    this.processing = true;

    while (this.queue.length > 0) {
      // Check if we need to reset the counter
      const now = Date.now();
      if (now - this.lastResetTime >= this.MINUTE_IN_MS) {
        this.requestCount = 0;
        this.lastResetTime = now;
      }

      // If we've hit the rate limit, wait
      if (this.requestCount >= this.MAX_REQUESTS_PER_MINUTE) {
        const waitTime = this.MINUTE_IN_MS - (now - this.lastResetTime);
        console.log(`Rate limit reached. Waiting ${Math.ceil(waitTime / 1000)} seconds...`);
        await this.sleep(waitTime);
        this.requestCount = 0;
        this.lastResetTime = Date.now();
      }

      const request = this.queue.shift()!;
      
      try {
        // Use backend service instead of Gemini directly
        const { backendService } = await import('./backendService');
        const result = await backendService.processRequest(request.type, request.data);
        this.requestCount++;
        request.resolve(result);
      } catch (error) {
        console.error('Queue processing error:', error);
        logDevError('Queue processing error', error);
        request.reject(error);
      }

      // Small delay between requests
      await this.sleep(1000);
    }

    this.processing = false;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  getQueueStatus() {
    const now = Date.now();
    const timeUntilReset = this.MINUTE_IN_MS - (now - this.lastResetTime);
    
    return {
      queueLength: this.queue.length,
      position: this.queue.length > 0 ? 1 : 0,
      requestsRemaining: this.MAX_REQUESTS_PER_MINUTE - this.requestCount,
      timeUntilReset: Math.max(0, timeUntilReset),
      estimatedWaitTime: this.calculateEstimatedWaitTime()
    };
  }

  private calculateEstimatedWaitTime(): number {
    if (this.queue.length === 0) return 0;
    
    const requestsRemaining = this.MAX_REQUESTS_PER_MINUTE - this.requestCount;
    const now = Date.now();
    const timeUntilReset = this.MINUTE_IN_MS - (now - this.lastResetTime);
    
    if (this.queue.length <= requestsRemaining) {
      // Can process all requests in current window
      return this.queue.length * 1000; // 1 second per request
    } else {
      // Need to wait for next window
      const requestsInCurrentWindow = requestsRemaining;
      const requestsInNextWindow = this.queue.length - requestsInCurrentWindow;
      
      return timeUntilReset + (requestsInNextWindow * 1000);
    }
  }
}

export const queueService = new QueueService();

