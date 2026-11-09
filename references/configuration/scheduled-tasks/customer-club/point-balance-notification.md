# Point Balance Notification

Source: https://docs.omnium.no/docs/configuration/scheduled-tasks/customer-club/point-balance-notification

> Notify customer club members when their point balance reaches a threshold

## Overview

This task sends notifications to members whose point balance exceeds a configured threshold. It helps encourage redemption and keeps members engaged with their accumulated rewards.

## Identifier

| Property | Value |
| --- | --- |
| **Implementation Type** | `CustomerClubPointBalanceNotificationScheduledTask` |
| **Group** | Customer Club |
| **Type** | Delta |

* * *

## When to Use

Enable this task when you want to:

*   Remind members about their available points
*   Encourage point redemption
*   Re-engage members with high balances
*   Drive loyalty program participation

* * *

## Configuration Properties

### Required Settings

| Setting | Location | Description |
| --- | --- | --- |
| `PointBalanceThreshold` | `CustomerClubSettings.PointBalanceEmailSettings` | Minimum points to trigger notification (must be > 0) |
| `MinimumDaysBetweenNotification` | `CustomerClubSettings.PointBalanceEmailSettings` | Days between notifications to same member (must be > 0) |

* * *

## Behavior

### What It Does

1.  Finds members with point balance above the threshold
2.  Filters to members who haven't received this notification recently
3.  Sends point balance notification email
4.  Marks members to skip future notifications until threshold is crossed again

### Notification Throttling

The `MinimumDaysBetweenNotification` setting prevents spamming members. Once notified, a member won't receive another balance notification until:

*   The configured number of days has passed, AND
*   Their balance still exceeds the threshold

### Prerequisites

*   Customer Club must be active
*   `PointBalanceThreshold` must be configured and > 0
*   `MinimumDaysBetweenNotification` must be configured and > 0
*   Point balance notification template must exist

### Side Effects

*   Sends email notifications
*   Updates member notification tracking

* * *

## Example Configuration

```json
{
    "ImplementationType": "CustomerClubPointBalanceNotificationScheduledTask",
    "Schedule": "0 10 * * 1",
    "IsDisabled": false
}
```

* * *

## Recommended Schedule

Run weekly (`0 10 * * 1` - Monday at 10:00 AM) to remind members about their points at the start of the week.

* * *

## Related Tasks

*   [Birthday Points](birthday-points.md) - Awards points
*   [Expire Soon Notification](expire-soon-notification.md) - Expiration warnings
