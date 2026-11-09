# Process Notifications

Source: https://docs.omnium.no/docs/configuration/scheduled-tasks/notifications/notification

> Retrieve and send pending notification messages

## Overview

This task processes pending notifications and enqueues them for delivery. It serves as the primary mechanism for sending notifications that have been scheduled or queued by other system processes, such as order confirmations, shipping updates, or marketing messages.

## Identifier

| Property | Value |
| --- | --- |
| **Implementation Type** | `NotificationScheduledTask` |
| **Group** | Notifications |
| **Type** | Delta |

* * *

## When to Use

Enable this task when you need:

*   Processing of queued email notifications
*   Delivery of order status notifications
*   Sending of scheduled marketing messages
*   Multi-channel notification delivery (email, SMS, etc.)

* * *

## Configuration Properties

This task has no directly configurable properties. Notification settings are configured through the notification service and individual notification templates.

* * *

## Behavior

### What It Does

1.  Retrieves all pending notification messages from the queue
2.  Processes and enqueues each message for delivery
3.  Logs the number of notifications processed
4.  Creates a notification log entry for tracking

### Prerequisites

*   Notification service must be configured
*   Email/SMS providers must be set up (depending on notification channels)
*   Notification templates must be defined

### Side Effects

*   Sends notifications to recipients (email, SMS, etc.)
*   Creates notification log entries
*   Clears processed messages from the pending queue

### Error Handling

*   If the task is cancelled, it reports a warning with the cancellation message
*   Errors during processing are logged and stored in the notification log
*   Individual notification failures do not stop the processing of other notifications

* * *

## Example Configuration

```json
{
    "ImplementationType": "NotificationScheduledTask",
    "Schedule": "*/5 * * * *",
    "IsDisabled": false
}
```

* * *

## Recommended Schedule

Run every 5 minutes (`*/5 * * * *`) to ensure timely delivery of notifications. For time-critical notifications, consider running more frequently. For high-volume environments, balance frequency with system load.

* * *

## Notification Logging

The task creates log entries in the NotificationLog repository, tracking:

*   Notification name
*   Message details
*   Number of messages processed
*   Completion timestamp

This provides an audit trail for notification delivery.

* * *

## Related Tasks

This task is the primary notification delivery mechanism and works in conjunction with notification triggers throughout the system.
