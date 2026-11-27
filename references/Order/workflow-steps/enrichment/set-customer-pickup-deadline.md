# Set Customer Pickup Deadline

Source: https://docs.omnium.no/docs/Order/workflow-steps/enrichment/set-customer-pickup-deadline

> Calculate and set a customer pickup deadline based on a configured number of working days and store opening hours.

## Overview

The **Set Customer Pickup Deadline** step calculates a deadline by which the customer must collect their order from the store. It counts a configured number of working days forward from the current date, respecting the store's regular and special opening hours.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `SetCustomerPickupDeadline` |
| **Group** | Enrich |
| **Applicable Statuses** | New, InProgress, Confirmed |

## Configuration Properties

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `WorkingDays` | int | Yes | Number of store working days from the current date to set as the deadline |

## Behavior

### What It Does

1.  Reads the `WorkingDays` property from the workflow step configuration. Returns an error if the value is missing or not a positive integer.
2.  Loads the store assigned to the order. Returns a warning and skips if no store is found.
3.  Counts forward `WorkingDays` working days using the store's configured opening hours, skipping closed days and special-closed dates.
4.  Applies the store's **Customer pickup deadline offset** if configured. The offset is subtracted from the store's closing time on the target day — for example, a 1-hour offset on a store closing at 21:00 results in a deadline of 20:00.
5.  Sets `customerPickupDeadline` on the order.

### Customer pickup deadline offset

Each store can have an optional offset configured under **Stores → Edit Store → Opening Hours → Click and collect deadlines → Customer pickup deadline offset**. The offset is subtracted from the store's closing time on the target day. If no offset is set, the deadline is the store's closing time on the N-th working day.

The same offset is also used for the customer pickup deadline in the click and collect settings when that deadline is set in working days. See [Click and collect](../../order-click-and-collect.md).

### Prerequisites

*   The order must have a `storeId` referencing a configured store.
*   The store must have at least one open day configured in its opening hours.
*   The `WorkingDays` property must be set on the workflow step.

### Side Effects

*   Sets `customerPickupDeadline` on the order.
*   If the deadline cannot be calculated (store has no open days), a warning is returned and `customerPickupDeadline` is not set.

## Business Cases

### When to Use

*   **Click & Collect**: Set a deadline after which uncollected orders are automatically cancelled by the [Cancel Orders with Expired Pickup Deadline](../../../configuration/scheduled-tasks/orders/cancel-orders-with-expired-pickup-deadline.md) scheduled task.
*   **Pickup slot enforcement**: Give customers a clear window to collect before inventory is released.

### Example Scenarios

**Weekend skipping**

*   Order placed Friday, store open Mon–Fri, `WorkingDays = 2`
*   Saturday and Sunday are skipped
*   Deadline set to Tuesday at store closing time

**Customer pickup deadline offset**

*   Store closes at 21:00, offset configured to 1 hour
*   Deadline set to 20:00 on the target day

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| `WorkingDays` missing or invalid | Error | Yes |
| Store not found | Warning | Yes |
| Store has no open days | Warning | Yes |
| Deadline set successfully | Success | Yes |

## Related

*   [Cancel Orders with Expired Pickup Deadline](../../../configuration/scheduled-tasks/orders/cancel-orders-with-expired-pickup-deadline.md) — Cancel orders past their deadline
