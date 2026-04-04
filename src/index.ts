import { Campaign } from './campaign';
import { IClock, CallHandler, CampaignConfig } from './interfaces';

const clock: IClock = {
  now: () => Date.now(),
  setTimeout: (callback, delay) => setTimeout(callback, delay) as unknown as number,
  clearTimeout: (id) => clearTimeout(id),
};

const callHandler: CallHandler = async (phoneNumber: string) => {
  console.log(`Calling ${phoneNumber}...`);
  return new Promise((resolve) => {
    setTimeout(() => {
        const answered = Math.random() > 0.3; // 70% فرصة يرد الرقم
      console.log(`Finished call to ${phoneNumber} — Answered: ${answered}`);
      resolve({ answered, durationMs: 1000 }); 

    }, 1000);
  });
};

const config: CampaignConfig = {
  customerList: ['+201234567890', '+201112223334', '+201155667788','+201155667777','+201155667766','+201155667755','+201155667744','+201155667733','+201155667722','+201155667711'],
  startTime: '09:00',
  endTime: '21:00',
  maxConcurrentCalls: 2,
  maxDailyMinutes: 120,
  maxRetries: 2,
  retryDelayMs: 2000,
};

const campaign = new Campaign(config, callHandler, clock);

campaign.start();

const statusInterval = setInterval(() => {
  console.log("Campaign Status:", campaign.getStatus());
}, 1000);

setTimeout(() => {
  console.log("Pausing campaign...");
  campaign.pause();
}, 5000);

setTimeout(() => {
  console.log("Resuming campaign...");
  campaign.resume();
}, 10000);


setTimeout(() => {
  clearInterval(statusInterval);
  console.log("Stopping status display");
}, 20000);