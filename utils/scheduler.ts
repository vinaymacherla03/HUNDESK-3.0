
type Task<T> = () => Promise<T>;

export class RequestScheduler {
  private queue: { task: Task<any>; resolve: (value: any) => void; reject: (reason?: any) => void; retries: number }[] = [];
  private isProcessing = false;
  private lastRequestTime = 0;
  private minDelay = 1500; // 1.5 seconds between calls to ensure we stay within safe rate limits

  add<T>(task: Task<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push({ task, resolve, reject, retries: 0 });
      this.process();
    });
  }

  private async process() {
    if (this.isProcessing || this.queue.length === 0) return;

    this.isProcessing = true;
    
    // 1. Rate Limiting
    const now = Date.now();
    const timeSinceLast = now - this.lastRequestTime;
    if (timeSinceLast < this.minDelay) {
      await new Promise(r => setTimeout(r, this.minDelay - timeSinceLast));
    }

    const item = this.queue.shift();
    if (!item) {
        this.isProcessing = false;
        return;
    }

    try {
      // 2. Execute Task
      const result = await item.task();
      this.lastRequestTime = Date.now();
      item.resolve(result);
    } catch (error: any) {
      const msg = error.message || '';
      // 3. Smart Error Handling & Retries
      const isRateLimit = msg.includes('429') || msg.includes('quota') || msg.includes('Resource has been exhausted');
      const isServerOverload = msg.includes('503') || msg.includes('500') || msg.includes('overloaded');

      if ((isRateLimit || isServerOverload) && item.retries < 3) {
        console.warn(`[Scheduler] Request failed (${msg}). Retrying in ${Math.pow(2, item.retries + 1)}s...`);
        
        // Exponential Backoff
        const backoff = Math.pow(2, item.retries + 1) * 1000;
        await new Promise(r => setTimeout(r, backoff));
        
        // Re-queue at the front
        this.queue.unshift({ ...item, retries: item.retries + 1 });
      } else {
        console.error("[Scheduler] Request failed permanently:", error);
        item.reject(error);
      }
    } finally {
      this.isProcessing = false;
      // Continue processing queue
      if (this.queue.length > 0) {
          this.process();
      }
    }
  }
}

export const scheduler = new RequestScheduler();
