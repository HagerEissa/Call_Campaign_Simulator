# Call Campaign Simulator

## Overview

This project simulates a call campaign system using Node.js and TypeScript. It processes a list of phone numbers while respecting scheduling constraints, concurrency limits, retry logic, and daily usage caps.

---

## Features

* Sequential call processing
* Concurrent call handling
* Retry mechanism with delay
* Working hours enforcement
* Daily call duration limit
* Pause and resume functionality
* Timezone-aware scheduling (Bonus)

---

## Installation

```bash
npm install
```

---

## Run in Development

```bash
npm run dev
```

---

## Build Project

```bash
npm run build
```

---

## Run Production Version

```bash
npm start
```

---

## Configuration Example

```ts
const config = {
  customerList: ['+201234567890'],
  startTime: '09:00',
  endTime: '21:00',
  maxConcurrentCalls: 2,
  maxDailyMinutes: 120,
  maxRetries: 2,
  retryDelayMs: 2000,
  timezone: 'Africa/Cairo'
};
```

---

## Assumptions

* Each call duration is provided by the CallHandler
* Estimated duration is used to avoid exceeding daily limits
* Retry calls are prioritized over new calls
* Daily limits reset at midnight based on campaign timezone

---

## Technologies Used

* Node.js
* TypeScript
* Luxon (for timezone handling)

---
