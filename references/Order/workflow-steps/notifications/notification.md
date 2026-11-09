# Notification

Source: https://docs.omnium.no/docs/Order/workflow-steps/notifications/notification

> Send email and SMS notifications to customers based on order status.

## Overview

The **Notification** step sends email and/or SMS notifications to customers based on configured notification templates. This is the primary mechanism for customer communication during order processing.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `Notification` |
| **Group** | Notifications |
| **Applicable Statuses** | New, InProgress, Completed, ReadyForPickup, OrderCanceled |

## Configuration Properties

This step uses notification templates configured in the system. The templates determine:

*   Which notifications to send based on order status
*   Email and/or SMS content
*   Recipient selection

## Behavior

### What It Does

1.  Skips execution in test mode
2.  Clears any pending notification IDs on the order
3.  Processes notification templates:
    *   Determines applicable notification templates based on order status
    *   Generates email and/or SMS messages
    *   Enqueues messages for delivery
4.  Returns result:
    *   Success if any messages sent
    *   Success if no messages sent but pending notifications were added
    *   Warning if no messages sent and no pending notifications added

### Prerequisites

*   Notification templates must be configured
*   Customer must have email/phone for respective notification types

### Side Effects

*   Clears `PendingNotificationIds` on order
*   Email and/or SMS messages enqueued for delivery
*   No direct order modifications

## Send After

When a notification template has a `Send After` value configured, the notification is stored as pending on the order and fired later by the notification scheduler instead of being sent immediately.

Every time this step runs it clears all pending notifications on the order before re-evaluating, so a status change that triggers the step will cancel any previously scheduled notifications.

> **Required:** Pending notifications are not sent by this workflow step — they are picked up and delivered by the [Process Notifications](../../../configuration/scheduled-tasks/notifications/notification.md) scheduled task. This task must be configured and running for any `Send After` notification to be delivered.

### Send After Types

| Type | Default behaviour | With `Adjust for Store Opening Hours` |
| --- | --- | --- |
| `H` | N hours from now | Counted within store opening hours; carries to next open day if it falls outside |
| `M` | N minutes from now | Counted within store opening hours; carries to next open day if it falls outside |
| `D` | N calendar days from now | N working days from now, scheduled at the store's opening time on the target day |

`Adjust for Store Opening Hours` is only available on the Generic Order Notification type and requires the order to have a store with opening hours configured.

### Send before opening, stop before closing

A store can send these notifications earlier or stop them earlier than its opening hours. Set the two fields in the **Edit Store** view under **Opening Hours → Notifications**:

| Field | Effect |
| --- | --- |
| **Send notifications before opening** | Moves the first opening of the day earlier by this time |
| **Stop notifications before closing** | Moves the last closing of the day earlier by this time |

Both fields are entered as hours and minutes. An empty field, or `00:00`, keeps the normal opening hours.

> A store open 10:00–19:00 sets **Send notifications before opening** to `00:15` and **Stop notifications before closing** to `00:30`. Notifications with `Adjust for Store Opening Hours` are sent between **09:45** and **18:30**. A notification triggered at 18:45 is sent at 09:45 on the next open day.

* * *

## Business Cases

### When to Use

*   **Order confirmation**: Send confirmation after order placement
*   **Shipping notification**: Notify customer when order ships
*   **Ready for pickup**: Alert customer for Click & Collect orders
*   **Cancellation notice**: Inform customer of order cancellation

### Example Scenarios

**Scenario 1: Email and SMS Sent** Order status triggers notification. Both email and SMS templates match. Both messages enqueued. Returns success with "2 emails and 1 SMS sent".

**Scenario 2: No Matching Templates** Order status has no configured notification templates. Returns warning with "No messages sent".

**Scenario 3: Email Only** Customer has email but no phone number. Only email notification sent.

**Scenario 4: Test Mode** Running in test mode. Notifications skipped, success returned.

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| Test mode | Success (skipped) | Yes |
| Messages sent | Success | Yes |
| No messages sent, pending notifications added | Success | Yes |
| No messages sent, no pending notifications | Warning | Yes |
| Exception during send | Warning | Yes |

## Related Steps

*   [Export Order](../export/export-order.md) - Export order data
*   [Webhook Workflow Step](../export/webhook-workflow-step.md) - External integrations
*   [Process Notifications](../../../configuration/scheduled-tasks/notifications/notification.md) - Scheduled task required for delivering pending (Send After) notifications
