# Cancel Orders with Expired Pickup Deadline

Source: https://docs.omnium.no/docs/configuration/scheduled-tasks/orders/cancel-orders-with-expired-pickup-deadline

> Automatically cancel orders where the customer pickup deadline has passed.

## Overview

This task searches for orders whose `customerPickupDeadline` has passed and cancels them. It is intended for non-Click-and-Collect order types that use the [Set Customer Pickup Deadline](../../../Order/workflow-steps/enrichment/set-customer-pickup-deadline.md) workflow step to set a deadline. Click and Collect orders are excluded automatically — those are handled by the separate [Cancel Expired Click and Collect](cancel-expired-click-collect.md) task.

## Identifier

| Property | Value |
| --- | --- |
| **Implementation Type** | `CancelOrdersWithExpiredPickupDeadlineScheduledTask` |
| **Group** | Orders |
| **Type** | Delta |

* * *

## When to Use

Enable this task when you need:

*   Automatic cancellation of store-pickup orders not collected within the configured deadline
*   Enforcement of pickup windows for non-C&C order types
*   Automated inventory release from uncollected orders

* * *

## Configuration Properties

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `CancelStatus` | string | No | Status to set on cancelled orders. Defaults to `OrderCanceled` if omitted. |
| `OrderStatuses` | string | No | Comma-separated list of order statuses to include in the search. If omitted, all statuses are included. |

Click and Collect orders are always excluded from this task regardless of the `OrderStatuses` configuration. Use [Cancel Expired Click and Collect](cancel-expired-click-collect.md) for those.

* * *

## Behavior

### What It Does

1.  Reads `CancelStatus` and `OrderStatuses` from the task's configured properties.
2.  Loads all non-Click-and-Collect order types configured for the tenant.
3.  Searches for orders of those types where `customerPickupDeadline` is in the past, optionally filtered to the specified `OrderStatuses`.
4.  For each expired order: sets the cancel status, recalculates reserved inventory for all SKUs on the order, sends a cancel line notification if configured, and runs the cancellation workflow.

### Prerequisites

*   Orders must have `customerPickupDeadline` set, typically by the [Set Customer Pickup Deadline](../../../Order/workflow-steps/enrichment/set-customer-pickup-deadline.md) workflow step.

### Side Effects

*   Sets orders to `CancelStatus` if configured, otherwise `OrderCanceled`.
*   Releases reserved inventory for all order line products on each cancelled order.
*   Sends a `Canceled Order Lines` notification if one is configured.
*   Runs the cancellation workflow, which may trigger additional configured actions.

* * *

## Example Configuration

```json
{
    "ImplementationType": "CancelOrdersWithExpiredPickupDeadlineScheduledTask",
    "Schedule": "*/30 * * * *",
    "IsDisabled": false,
    "Properties": [
        { "Key": "CancelStatus", "Value": "NotCollected" },
        { "Key": "OrderStatuses", "Value": "ReadyForPickup,InProgress" }
    ]
}
```

* * *

## Recommended Schedule

Run every 30 minutes (`*/30 * * * *`) to cancel expired orders promptly. Adjust based on how tight your pickup windows are.

* * *

## Related Tasks

*   [Cancel Expired Click and Collect](cancel-expired-click-collect.md) — Handles expiration for Click and Collect orders

## Related Steps

*   [Set Customer Pickup Deadline](../../../Order/workflow-steps/enrichment/set-customer-pickup-deadline.md) — Sets the `customerPickupDeadline` this task reads
