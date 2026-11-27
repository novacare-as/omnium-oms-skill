# Cancel Expired Orders

Source: https://docs.omnium.no/docs/configuration/scheduled-tasks/orders/cancel-expired-orders

> Legacy task that cancels expired click and collect orders by flipping their status

**Legacy task.** This task is superseded by [Cancel Expired Click and Collect](cancel-expired-click-collect.md), which handles the same orders (Click and Collect in `ReadyForPickup` past their `CustomerPickupDeadline`) properly. Unlike that task, this one sets the order status straight to `OrderCanceled` **without going through the order cancellation service**, so it does not cancel line items or release stock/reservations directly. Prefer Cancel Expired Click and Collect for new configurations; this task is kept only for tenants still configured to run it.

## Overview

This task identifies and cancels Click and Collect orders that have passed their pickup deadline. For each match it transitions the order straight to a cancelled status and runs the associated workflow actions.

## Identifier

| Property | Value |
| --- | --- |
| **Implementation Type** | `CancelExpiredOrdersScheduledTask` |
| **Group** | Ratings |
| **Type** | Delta |

* * *

## When to Use

Prefer [Cancel Expired Click and Collect](cancel-expired-click-collect.md) for new setups. Only keep this task enabled if a tenant already relies on it for:

*   Basic cancellation of Click and Collect orders past their pickup deadline
*   Cleanup of stale click and collect orders

* * *

## Configuration Properties

This task has no configurable properties. Expiration thresholds are typically configured in order settings.

* * *

## Behavior

### What It Does

1.  Queries for Click and Collect orders in `ReadyForPickup` whose `CustomerPickupDeadline` has passed
2.  For each match, sets the order status directly to `OrderCanceled` (does not call the order cancellation service)
3.  Runs the order workflow for the new status
4.  Creates an event log entry documenting the cancellation

### Prerequisites

*   Click and collect order configuration must be in place
*   Expiration thresholds must be defined in order settings
*   Workflow steps for the cancelled status should be configured

### Side Effects

*   Changes order status to `OrderCanceled`
*   Runs the order workflow for the new status (any inventory release or notifications depend on what that workflow does, not on this task)
*   Creates event log entries for each cancelled order

Because the status is flipped directly rather than through the order cancellation service, line items are not cancelled and stock/reservations are not released by the task itself. Use [Cancel Expired Click and Collect](cancel-expired-click-collect.md) if you need proper line-item cancellation and stock release.

* * *

## Example Configuration

```json
{
    "ImplementationType": "CancelExpiredOrdersScheduledTask",
    "Schedule": "0 * * * *",
    "IsDisabled": false
}
```

* * *

## Recommended Schedule

Run hourly (`0 * * * *`) to catch expired orders without excessive processing overhead. More frequent execution may be appropriate for time-sensitive scenarios.

* * *

## Related Tasks

*   [Cancel Expired Click and Collect](cancel-expired-click-collect.md) - Detailed click and collect expiration handling
*   [Delete Old Orders](delete-old-orders.md) - Permanent removal of old orders
*   [Update Overdue Orders](update-overdue-orders.md) - Mark orders as delayed
