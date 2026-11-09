# Delete Expired Points

Source: https://docs.omnium.no/docs/configuration/scheduled-tasks/customer-club/delete-expired-points

> Remove expired loyalty points from member accounts and create transaction records

## Overview

This task removes expired loyalty points from customer club member accounts. It processes members with expired points in batches, creates cancellation transactions for audit purposes, and updates member balances.

## Identifier

| Property | Value |
| --- | --- |
| **Implementation Type** | `CustomerClubDeleteExpiredPointsTask` |
| **Group** | Customer Club |
| **Type** | Full |

* * *

## When to Use

Enable this task when you have:

*   Point expiration policies in place
*   Time-limited promotional points
*   FIFO (First In, First Out) point expiration
*   Compliance requirements for point lifecycle management

* * *

## Configuration Properties

This task has no configurable properties. Point expiration dates are managed on individual point records.

* * *

## Behavior

### What It Does

1.  Searches for members with expired points (pagination with 1000 members per page)
2.  For each member with expired points:
    *   Calculates total points to remove
    *   Creates a cancellation transaction record (type: Cancelled, status: Expired)
    *   Updates the member's point balance
3.  Updates both the customer club member and private customer records
4.  Reports the total number of members processed

### Transaction Audit Trail

Each point expiration creates a transaction record containing:

*   The amount of points removed
*   Transaction type (Cancelled)
*   Point status (Expired)
*   Previous balance snapshot

### Prerequisites

*   Points must have expiration dates set
*   Customer Club must be active

### Side Effects

*   Removes points from member balances
*   Creates transaction records for audit
*   Updates private customer bonus point balances

* * *

## Example Configuration

```json
{
    "ImplementationType": "CustomerClubDeleteExpiredPointsTask",
    "Schedule": "0 1 * * *",
    "IsDisabled": false
}
```

* * *

## Recommended Schedule

Run daily during off-peak hours (`0 1 * * *` - 1:00 AM) to ensure expired points are removed promptly while minimizing system impact.

* * *

## Related Tasks

*   [Expire Soon Notification](expire-soon-notification.md) - Warn members before expiration
*   [Birthday Points](birthday-points.md) - Award new points
