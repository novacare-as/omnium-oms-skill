# Event Scheduled Tasks

Source: https://docs.omnium.no/docs/configuration/scheduled-tasks/events

> Background jobs for event log management and cleanup

The Event scheduled tasks handle maintenance of event log data, removing old entries to maintain system performance and comply with data retention policies.

## Available Tasks

| Task | Description | Type |
| --- | --- | --- |
| [Delete Event Logs](events/delete-event-log.md) | Remove event log entries older than the configured retention period | Delta |

* * *

## Overview

Event tasks help maintain system performance and data compliance:

1.  **Log Cleanup** - Remove historical event logs beyond retention thresholds

* * *

## Common Use Cases

### Data Retention Compliance

Use Delete Event Logs to automatically remove event log entries after a configured period, helping comply with data retention policies.

### Performance Maintenance

Enable this task to keep the event log index lean, ensuring query performance remains optimal.

* * *

## Configuration Requirements

Event log cleanup requires configuration in tenant settings:

*   `advancedSettings.eventLogPreservationDays` - Days to retain general event logs (minimum 7)
*   `advancedSettings.eventLogOrderPreservationDays` - Days to retain order-related event logs (minimum 7)

* * *

## Recommended Schedules

| Task Type | Recommended Schedule | Reason |
| --- | --- | --- |
| Log cleanup | `0 3 * * 0` (weekly at 3 AM Sunday) | Heavy operation, run off-peak |
