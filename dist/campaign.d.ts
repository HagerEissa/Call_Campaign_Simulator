import { ICampaign, CampaignConfig, CallHandler, IClock, CampaignStatus } from './interfaces';
export declare class Campaign implements ICampaign {
    private config;
    private callHandler;
    private clock;
    private state;
    private activeCalls;
    private totalProcessed;
    private totalFailed;
    private pendingRetries;
    private dailyMinutesUsed;
    private queue;
    constructor(config: CampaignConfig, callHandler: CallHandler, clock: IClock);
    private checkCompletion;
    private runNext;
    start(): void;
    pause(): void;
    resume(): void;
    getStatus(): CampaignStatus;
}
//# sourceMappingURL=campaign.d.ts.map