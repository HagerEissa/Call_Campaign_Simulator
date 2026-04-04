"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const campaign_1 = require("./campaign");
const clock = {
    now: () => Date.now(),
    setTimeout: (callback, delay) => setTimeout(callback, delay),
    clearTimeout: (id) => clearTimeout(id),
};
const callHandler = async (phoneNumber) => {
    console.log(`Calling ${phoneNumber}...`);
    return new Promise((resolve) => {
        setTimeout(() => {
            const answered = Math.random() > 0.3; // 70% فرصة يرد الرقم
            console.log(`Finished call to ${phoneNumber} — Answered: ${answered}`);
            resolve({ answered, durationMs: 1000 }); // مدة المكالمة 1 ثانية
        }, 1000);
    });
};
const config = {
    customerList: ['+201234567890', '+201112223334', '+201155667788'],
    startTime: '09:00',
    endTime: '21:00',
    maxConcurrentCalls: 2,
    maxDailyMinutes: 120,
    maxRetries: 2,
    retryDelayMs: 2000,
};
const campaign = new campaign_1.Campaign(config, callHandler, clock);
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
//# sourceMappingURL=index.js.map