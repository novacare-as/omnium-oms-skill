# Expire Soon Notification

Source: https://docs.omnium.no/docs/configuration/scheduled-tasks/customer-club/expire-soon-notification

> Notify customer club members about points that will expire soon

## Overview

This task sends notification emails to members who have loyalty points expiring soon. It helps members use their points before expiration and reduces customer service inquiries about lost points.

## Identifier

| Property | Value |
| --- | --- |
| **Implementation Type** | `CustomerClubExpireSoonNotificationScheduledTask` |
| **Group** | Customer Club |
| **Type** | Full |

* * *

## When to Use

Enable this task when you want to:

*   Proactively warn members about expiring points
*   Encourage point redemption before expiration
*   Reduce customer complaints about expired points
*   Improve customer satisfaction and engagement

* * *

## Configuration Properties

This task uses the point validity settings configured in your Customer Club settings. The notification threshold is calculated automatically based on point expiration dates.

* * *

## Behavior

### What It Does

1.  Calculates the notification threshold based on point expiration rules
2.  Finds members with points expiring within the threshold window
3.  Filters to members who haven't already received this notification
4.  Sends expiration warning emails to eligible members
5.  Marks points as "notification sent" to prevent duplicate emails

### Duplicate Prevention

The task tracks which expiring points have already triggered notifications, ensuring members don't receive multiple emails about the same expiring points.

### Prerequisites

*   Customer Club must be active
*   Point expiration must be configured
*   Expire points notification template must exist

### Side Effects

*   Sends email notifications
*   Updates member records with notification status

* * *

## Example Configuration

```json
{
    "ImplementationType": "CustomerClubExpireSoonNotificationScheduledTask",
    "Schedule": "0 8 * * *",
    "IsDisabled": false
}
```

* * *

## Recommended Schedule

Run daily during business hours (`0 8 * * *` - 8:00 AM) when members are likely to see and act on the notification.

* * *

## Related Tasks

*   [Delete Expired Points](delete-expired-points.md) - Removes expired points
*   [Point Balance Notification](point-balance-notification.md) - Balance threshold notifications
