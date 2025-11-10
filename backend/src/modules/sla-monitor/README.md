# SLA Monitor Module

This module provides Service Level Agreement (SLA) monitoring functionality for the Dormitory Booking System backend.

## Overview

The SLA Monitor module automatically tracks ticket response and resolution times based on priority levels and creates appropriate events when SLA deadlines approach or are breached.

## Features

- **Automatic SLA Monitoring**: Runs every 5 minutes to check ticket SLA status
- **Priority-based SLAs**:
  - P1: Response within 15 min, Resolution within 4 hours
  - P2: Response within 1 hour, Resolution within 8 hours
  - P3: Response within 4 hours, Resolution within 3 days
  - P4: Response within 24 hours, Resolution within 7 days
- **Event Creation**: Automatically creates SLA_WARNING and SLA_BREACH events
- **Manual Triggers**: API endpoints for manual SLA checks and queue management
- **Queue Statistics**: Monitor BullMQ queue status and job counts

## Components

### SlaMonitorModule
Main module that configures BullMQ queue and registers all components.

### SlaMonitorService
Provides business logic for SLA operations:
- Manual SLA check triggering
- Queue status monitoring
- SLA statistics retrieval
- Job cleanup utilities

### SlaMonitorController
REST API endpoints:
- `POST /sla-monitor/trigger` - Manually trigger SLA check
- `GET /sla-monitor/status` - Get queue status
- `GET /sla-monitor/statistics` - Get SLA statistics
- `DELETE /sla-monitor/jobs` - Clear completed/failed jobs

### SlaMonitorScheduler
Background scheduler that adds SLA check jobs to the queue every 5 minutes.

### SlaMonitorWorker
BullMQ worker that processes SLA checks:
- Identifies tickets approaching SLA deadlines (15 min warning)
- Identifies tickets that have breached SLA deadlines
- Updates ticket warning/breach flags
- Creates appropriate ticket events

## Database Schema

The module works with the following database entities:
- `Ticket`: SLA timestamps and breach flags
- `TicketEvent`: SLA warning and breach events

## Configuration

### Environment Variables
- `REDIS_HOST`: Redis server host (default: localhost)
- `REDIS_PORT`: Redis server port (default: 6379)

### Queue Configuration
- Queue name: `sla-monitor`
- Job type: `tick`
- Schedule: Every 5 minutes
- Warning window: 15 minutes before deadline

## Usage
⏰ Notification Timing:
Automatic Notifications:
SLA Monitor runs every 5 minutes automatically
Warning emails: Sent when tickets are 15 minutes from SLA deadline
Breach emails: Sent when tickets exceed SLA deadline
For Your P1 Test Ticket:
Response SLA: 15 minutes from ticket creation
Resolution SLA: 4 hours from ticket creation
Timeline:

Now → Ticket created with SLA deadlines calculated
~10-13 minutes → ⚠️ Warning email sent to all admin users
15+ minutes → 🚨 Breach email sent to all admin users

### Automatic Monitoring
The scheduler automatically runs SLA checks every 5 minutes when the application starts.

### Manual Testing
```bash
# Trigger immediate SLA check
curl -X POST http://localhost:3000/sla-monitor/trigger

# Check queue status
curl http://localhost:3000/sla-monitor/status

# Get SLA statistics
curl http://localhost:3000/sla-monitor/statistics
```

### Integration
Import the module in your main app module:
```typescript
import { SlaMonitorModule } from './common/sla-monitor';

@Module({
  imports: [
    // ... other modules
    SlaMonitorModule,
  ],
})
export class AppModule {}
```


## Dependencies

- `@nestjs/bull`: BullMQ integration for NestJS
- `bull`: Redis-based job queue
- `@prisma/client`: Database ORM
- `redis`: Redis client (automatically installed with bull)

## Error Handling

The worker includes error handling that logs errors but continues processing other tickets. Failed jobs are tracked in the BullMQ queue for monitoring.

## Future Enhancements

- Email/LINE notifications for SLA warnings and breaches
- SLA reporting and analytics
- Configurable SLA rules per organization
- SLA pause/resume functionality for on-hold tickets