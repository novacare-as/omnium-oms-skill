# Try Reallocate Orders

Source: https://docs.omnium.no/docs/configuration/scheduled-tasks/orders/try-reallocate-orders

> Process orders that have passed their reallocation deadline

## Overview

This task handles orders that have exceeded their reallocation deadline. When an order cannot be fulfilled within the expected timeframe, this task triggers a cancellation workflow that attempts to reallocate the inventory to other waiting orders before final cancellation.

## Identifier

| Property | Value |
| --- | --- |
| **Implementation Type** | `TryReallocateOrdersScheduledTask` |
| **Group** | Orders |
| **Type** | Delta |

* * *

## When to Use

Enable this task when you need:

*   Automatic handling of orders that cannot be fulfilled on time
*   Inventory reallocation from stale orders to newer orders
*   Enforcement of fulfillment time limits
*   Automated cancellation with reallocation attempts

* * *

## Configuration Properties

This task has no configurable properties. Reallocation deadlines are set on individual shipments.

### Order Type Requirements

For this task to function, the order type must have:

*   A status configured as a "cancelled" status
*   The cancelled status must have an active workflow step for reallocation attempts

* * *

## Behavior

### What It Does

1.  Queries for orders with shipments past their reallocation deadline
2.  For each order, evaluates the current state:
    *   If all items are already delivered or cancelled, clears the deadline and continues
    *   If no cancelled status with reallocation workflow exists, logs a warning
3.  For orders where all shipments have expired deadlines:
    *   Transitions the entire order to the cancelled status
    *   Runs the cancellation workflow (which includes reallocation logic)
4.  For orders with mixed shipment states:
    *   Processes only the expired shipments
    *   Transitions each expired shipment to the cancelled status
    *   Runs shipment-level workflow
5.  Reports the number of orders processed and reallocated

### Deadline Evaluation

*   Reallocation deadlines are set at the shipment level
*   A shipment is considered expired when its deadline is in the past
*   Shipments with all items delivered or cancelled are automatically cleared

### Workflow Integration

The task relies on a cancellation workflow step that:

1.  Releases reserved inventory from the cancelled order
2.  Attempts to allocate the released inventory to waiting orders
3.  Completes the cancellation process

### Prerequisites

*   Reallocation deadlines must be set on order shipments
*   Order types must have a cancelled status configured
*   The cancelled status must have an active reallocation workflow step

### Side Effects

*   Transitions order/shipment status to cancelled
*   Triggers cancellation workflow (releases inventory, attempts reallocation)
*   Clears reallocation deadlines from processed shipments
*   May cause inventory to be reallocated to other orders
*   Creates event log entries for status changes

* * *

## Example Configuration

```json
{
    "ImplementationType": "TryReallocateOrdersScheduledTask",
    "Schedule": "*/30 * * * *",
    "IsDisabled": false
}
```

* * *

## Recommended Schedule

Run every 30 minutes (`*/30 * * * *`) to promptly handle expired deadlines while allowing time for fulfillment attempts.

* * *

## Related Tasks

*   [Try Reserve Order Lines](try-reserve-order-lines.md) - Reserve inventory using FIFO logic
*   [Allocate Order to Purchase Order](allocate-order-to-purchase-order.md) - Allocate to incoming stock
*   [Cancel Expired Orders](cancel-expired-orders.md) - Standard expiration handling
