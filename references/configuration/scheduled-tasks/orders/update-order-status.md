# Update Order Status

Source: https://docs.omnium.no/docs/configuration/scheduled-tasks/orders/update-order-status

> Process scheduled status transitions for orders

## Overview

This task processes orders that have a scheduled status change pending. Orders can be configured with a future status and a date/time when that status should take effect. This task monitors for such orders and executes the status transition when the scheduled time arrives, enabling delayed order processing and subscription order activation.

## Identifier

| Property | Value |
| --- | --- |
| **Implementation Type** | `UpdateOrderStatusScheduledTask` |
| **Group** | Orders |
| **Type** | Delta |

* * *

## When to Use

Enable this task when you need:

*   Scheduled order status transitions (e.g., activate pre-orders on release date)
*   Subscription order processing with delayed activation
*   Timed status changes for promotional orders
*   Automated order progression at specific times

* * *

## Configuration Properties

This task has no configurable properties.

* * *

## Behavior

### What It Does

1.  Queries for orders with a pending status update (where the scheduled update date has passed)
2.  For each order with a scheduled status change:
    *   Reads the target status from the order
    *   Updates the order status to the target value
    *   Clears the scheduling fields
    *   Runs the workflow for the new status
3.  For subscription-related orders:
    *   If the order was in "Pending" status and has an associated subscription
    *   Creates the next pending order for the subscription (if active and recurring)

### Subscription Integration

When processing subscription orders:

*   Identifies orders linked to a subscription ID
*   Only processes when transitioning from "Pending" status
*   For active subscriptions with a configured interval, creates the next pending order
*   This enables automatic recurring order creation

### Prerequisites

*   Orders must have a scheduled update date and target status configured
*   The target status must exist in the order type configuration
*   For subscriptions, the subscription must be active with a valid interval

### Side Effects

*   Updates order status to the scheduled value
*   Clears scheduling fields from the order
*   Triggers workflow actions for the new status
*   May create new pending orders for active subscriptions
*   Creates event log entries for status changes

* * *

## Example Configuration

```json
{
    "ImplementationType": "UpdateOrderStatusScheduledTask",
    "Schedule": "*/5 * * * *",
    "IsDisabled": false
}
```

* * *

## Recommended Schedule

Run every 5 minutes (`*/5 * * * *`) to process scheduled status changes promptly. Adjust based on timing precision requirements.

* * *

## Related Tasks

*   [Order Automation](order-automation.md) - Condition-based status automation
*   [Update Overdue Orders](update-overdue-orders.md) - Mark delayed orders
*   [Cancel Expired Orders](cancel-expired-orders.md) - Handle expired orders
