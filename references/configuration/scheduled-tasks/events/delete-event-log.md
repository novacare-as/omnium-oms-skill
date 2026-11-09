# Delete Event Logs

Source: https://docs.omnium.no/docs/configuration/scheduled-tasks/events/delete-event-log

> Remove event log entries older than the configured retention period

## Overview

This task deletes event log entries that are older than configured retention thresholds. It supports separate retention periods for general events and order-related events, allowing longer retention for order audit trails while keeping general logs lean.

## Identifier

| Property | Value |
| --- | --- |
| **Implementation Type** | `DeleteEventLogScheduledTask` |
| **Group** | Events |
| **Type** | Delta |

* * *

## When to Use

Enable this task when you need:

*   Compliance with data retention policies
*   Maintenance of event log performance
*   Reduction of storage costs
*   Separate retention periods for order and non-order events

* * *

## Configuration Properties

This task requires configuration in tenant settings:

| Setting | Location | Description |
| --- | --- | --- |
| `eventLogPreservationDays` | `advancedSettings.eventLogPreservationDays` | Days to retain general event logs (minimum 7) |
| `eventLogOrderPreservationDays` | `advancedSettings.eventLogOrderPreservationDays` | Days to retain order-related event logs (minimum 7) |

Both settings are required and must have values of 7 or greater. The task will fail if either setting is missing or below the minimum.

* * *

## Behavior

### What It Does

1.  Reads retention thresholds from tenant settings
2.  Validates that both thresholds are configured and at least 7 days
3.  Calculates cutoff dates for general and order events
4.  Deletes events older than their respective cutoff dates
5.  Reports the number of events deleted

### Prerequisites

*   Both `eventLogPreservationDays` and `eventLogOrderPreservationDays` must be configured
*   Values must be 7 or greater
*   Event log search service must be operational

### Side Effects

*   Permanently removes event log entries
*   Reduces event log index size
*   Historical event data beyond retention period will not be available

### Validation Rules

The task enforces minimum retention periods:

*   General events: minimum 7 days
*   Order events: minimum 7 days

This ensures a reasonable audit trail is always maintained.

* * *

## Example Configuration

First, ensure tenant settings include the retention thresholds:

```json
{
    "advancedSettings": {
        "eventLogPreservationDays": 90,
        "eventLogOrderPreservationDays": 365
    }
}
```

Then configure the scheduled task:

```json
{
    "ImplementationType": "DeleteEventLogScheduledTask",
    "Schedule": "0 3 * * 0",
    "IsDisabled": false
}
```

* * *

## Recommended Schedule

Run weekly during off-peak hours (`0 3 * * 0` - 3 AM Sunday). Event log deletion can be a heavy operation, especially for tenants with high event volumes.

* * *

## Related Tasks

This task works independently to maintain event log hygiene across the system.
