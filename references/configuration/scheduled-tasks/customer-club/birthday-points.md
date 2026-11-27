# Birthday Points

Source: https://docs.omnium.no/docs/configuration/scheduled-tasks/customer-club/birthday-points

> Award birthday bonus points to customer club members and send notifications

## Overview

This task awards birthday bonus points to customer club members on their birthday. It creates point transactions, updates member balances, and sends birthday notification emails.

## Identifier

| Property | Value |
| --- | --- |
| **Implementation Type** | `CustomerClubBirthdayScheduledTask` |
| **Group** | Customer Club |
| **Type** | Delta |

* * *

## When to Use

Enable this task when you want to:

*   Automatically reward members on their birthday
*   Send birthday greetings with point bonus
*   Increase member engagement and loyalty
*   Create positive touchpoints with customers

* * *

## Configuration Properties

### Required Settings

| Setting | Location | Description |
| --- | --- | --- |
| `BirthdaySettings.BirthdayPointAmount` | `CustomerClubSettings` | Number of points to award (must be > 0) |

### Optional Settings

| Setting | Location | Description |
| --- | --- | --- |
| `UseStatsCustomerQueues` | `CustomerSettings` | Whether to queue customer for stats update |

* * *

## Behavior

### What It Does

1.  Finds all private customers who have a birthday today
2.  Matches customers to their customer club memberships
3.  Creates birthday point transactions for eligible members
4.  Updates member point balances
5.  Sends birthday notification emails (if email is available)
6.  Queues customers for statistics processing (if enabled)

### Birthday Detection

The task identifies birthdays by matching the day and month of the customer's birth date with today's date, regardless of year.

### Prerequisites

*   Customer Club settings must be configured
*   `BirthdaySettings.BirthdayPointAmount` must be greater than 0
*   Members must have their birth date recorded
*   Birthday notification template must exist

### Side Effects

*   Creates point transactions
*   Updates member point balances
*   Sends email notifications
*   Updates private customer records
*   May queue customers for stats processing

* * *

## Example Configuration

```json
{
    "ImplementationType": "CustomerClubBirthdayScheduledTask",
    "Schedule": "0 6 * * *",
    "IsDisabled": false
}
```

* * *

## Recommended Schedule

Run once daily early in the morning (`0 6 * * *` - 6:00 AM) so birthday emails arrive at the start of the member's special day.

* * *

## Related Tasks

*   [Point Balance Notification](point-balance-notification.md) - Notify about point balances
*   [Delete Expired Points](delete-expired-points.md) - Clean up expired points
