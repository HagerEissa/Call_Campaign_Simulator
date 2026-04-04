# Design Document — Call Campaign Simulator

## Architecture Overview

The system is centered around a `Campaign` class that manages the lifecycle of a call campaign.

### Key Components

* **Queue**: Stores phone numbers along with retry count
* **CallHandler**: Simulates calls and returns results
* **IClock**: Abstracts time for scheduling and testing
* **Campaign State**: Controls lifecycle (idle, running, paused, completed)

---

## Core Logic

### 1. Call Processing

* Calls are executed sequentially from a queue
* Concurrency is controlled using `maxConcurrentCalls`
* Active calls are tracked using `activeCalls`

### 2. Retry Mechanism

* Failed calls are retried up to `maxRetries`
* Retries are delayed using `retryDelayMs`
* Retries are prioritized over new calls (using queue.unshift)

### 3. Working Hours

* Calls are only allowed within `startTime` and `endTime`
* Outside working hours, execution is delayed using the clock

### 4. Daily Limit

* Total call duration is tracked per day
* New calls are prevented if they may exceed the limit
* The limit resets at midnight

### 5. Completion

* Campaign completes when:

  * Queue is empty
  * No active calls
  * No pending retries

---

## Time Handling

* All time operations use the injected `IClock`
* Luxon is used for timezone-aware scheduling
* Start and end times are interpreted in the campaign timezone

---

## Edge Cases Handled

* Campaign paused during execution
* Retry scheduling while paused
* Daily limit reached mid-processing
* Calls outside working hours
* Campaign completion with pending retries
* Timezone-based midnight reset

---

## Design Decisions

* Used queue for predictable sequential processing
* Used counters for tracking retries and active calls
* Used Luxon for robust timezone support
* Used dependency injection (IClock, CallHandler) for testability


---
