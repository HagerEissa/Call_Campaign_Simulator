import { ICampaign, CampaignConfig, CallHandler, IClock, CampaignStatus, CampaignState } from './interfaces';
import { DateTime } from 'luxon';
export class Campaign implements ICampaign {
  private config: CampaignConfig;
  private callHandler: CallHandler;
  private clock: IClock;

  private state: CampaignState = 'idle';
  private activeCalls: number = 0;
  private totalProcessed: number = 0;
  private totalFailed: number = 0;
  private pendingRetries: number = 0; 
  private dailyMinutesUsed: number = 0;

  private queue: { phone: string, retries: number }[] = [];

  constructor(config: CampaignConfig, callHandler: CallHandler, clock: IClock) {
    this.config = config;
    this.callHandler = callHandler;
    this.clock = clock;


  this.queue = config.customerList.map(phone => ({ phone, retries: 0 }));
  }
  private checkCompletion() {
    if (this.state === 'completed') return;
    if (
        this.queue.length === 0 &&
        this.pendingRetries === 0 &&
        this.activeCalls === 0
    ) {
        this.state = 'completed';
        console.log('Campaign completed — All numbers processed');
    }
}

  private runNext() {
    if (this.state === 'completed') return;
    if (this.state !== 'running') return;

    // const now = new Date(this.clock.now());
    const zone = this.config.timezone || 'UTC';
    const now = DateTime.fromMillis(this.clock.now(), { zone });

    const [startHour, startMinute] = this.config.startTime.split(':').map(Number);
    const [endHour, endMinute] = this.config.endTime.split(':').map(Number);
    // const startTime = new Date(now);
    // startTime.setHours(startHour!, startMinute, 0, 0);
    // const endTime = new Date(now);
    // endTime.setHours(endHour!, endMinute, 0, 0);
    const startTime = now.set({
        hour: startHour!,
        minute: startMinute,
        second: 0,
        millisecond: 0
    });

    const endTime = now.set({
        hour: endHour!,
        minute: endMinute,
        second: 0,
        millisecond: 0
    });

    if (now < startTime || now >= endTime) {
      console.log('Current time is outside campaign hours, waiting...');
      this.clock.setTimeout(() => {
    this.runNext();
  }, 60000);

      return;
    }
const estimatedMinutes = 1; // أو worst case

if (this.dailyMinutesUsed + estimatedMinutes > this.config.maxDailyMinutes) {
      console.log('Daily limit reached, stopping new calls');
      const nextMidnight = now.plus({ days: 1 }).startOf('day');
      const delay = nextMidnight.toMillis() - now.toMillis();

      this.clock.setTimeout(() => {
        this.dailyMinutesUsed = 0;
        this.runNext();
    }, delay); 

      return;
    }

    while (this.activeCalls < this.config.maxConcurrentCalls && this.queue.length > 0) {
      const next = this.queue.shift();
      if (!next) break; 

      this.activeCalls++;
      this.callHandler(next.phone)
        .then(result => {
          const durationMinutes = result.durationMs / 60000;
          this.dailyMinutesUsed += durationMinutes;

          if (result.answered) this.totalProcessed++;
          else if (next.retries < this.config.maxRetries) {
            next.retries++;
            this.pendingRetries++;
            this.clock.setTimeout(() => {
            //   this.queue.push(next);
            this.queue.unshift(next);
              this.pendingRetries--;
              this.runNext();
            }, this.config.retryDelayMs);
          } else this.totalFailed++;
        })
        .finally(() => {
          this.activeCalls--;
          this.checkCompletion();
          this.runNext();
        });
    }
  }
  
  start(): void {
    this.state = 'running';
    console.log('Campaign started');
      console.log('Initial queue:', this.queue);
      this.runNext();
  }

  pause(): void {
    if (this.state === 'completed') return;
    this.state = 'paused';
    console.log('Campaign paused');
  }

  resume(): void {
    if (this.state === 'completed') {
    console.log('Cannot resume, campaign already completed');
    return;
  }

  if (this.state === 'paused') {
    this.state = 'running';
    console.log('Campaign resumed');
    this.runNext();
  }
  }

  getStatus(): CampaignStatus {
    return {
      state: this.state,
      totalProcessed: this.totalProcessed,
      totalFailed: this.totalFailed,
      activeCalls: this.activeCalls,
      pendingRetries: this.pendingRetries,
      dailyMinutesUsed: this.dailyMinutesUsed,
    };
  }
}