interface QueueStatus {
  queueLength: number;
  position: number;
  requestsRemaining: number;
  timeUntilReset: number;
  estimatedWaitTime: number;
}

class QueueService {
  async addToQueue<T>(
    type: 'comparison' | 'specs' | 'cache-update',
    data: any,
    priority: 'high' | 'normal' | 'low' = 'normal'
  ): Promise<T> {
    const response = await fetch('/api/queue', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ type, data, priority })
    });

    if (!response.ok) {
      throw new Error('Queue request failed');
    }

    return response.json();
  }

  async getQueueStatus(): Promise<QueueStatus> {
    const response = await fetch('/api/queue/status');
    if (!response.ok) {
      throw new Error('Failed to fetch queue status');
    }
    return response.json();
  }
}

export const queueService = new QueueService();
