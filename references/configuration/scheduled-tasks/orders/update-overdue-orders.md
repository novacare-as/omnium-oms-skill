# Update Overdue Orders

Source: https://docs.omnium.no/docs/configuration/scheduled-tasks/orders/update-overdue-orders

> Mark orders as delayed when they pass their expected delivery date

## Overview

This task identifies orders that have exceeded their expected delivery date and updates their status to a delayed status. This provides visibility into fulfillment issues and enables workflow actions for delayed order handling.

## Identifier

| Property | Value |
| --- | --- |
| **Implementation Type** | `UpdateOverdueOrdersScheduledTask` |
| **Group** | Orders |
| **Type** | Delta |

* * *

## When to Use

Enable this task when you need:

*   Automatic flagging of orders past their delivery date
*   Visibility into fulfillment delays
*   Triggering of delayed order workflows (notifications, escalations)
*   KPI tracking for on-time delivery

* * *

## Configuration Properties

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `OrderStatus` | string | No | The status to set for overdue orders. Defaults to "Delayed". |
| `ThresholdDays` | int | No | Number of days past expected delivery before marking as delayed. Default: `0` (same day). |
| `StatusFilter` | string | No | Comma-separated list of statuses to include in the search. If not set, searches all non-completed orders. |

* * *

## Behavior

### What It Does

1.  Reads configuration properties for the delayed status, threshold days, and status filter
2.  Queries for orders where:
    *   The expected delivery date plus threshold days has passed
    *   The order is not already in the delayed status
    *   The order matches the status filter (if configured)
3.  For each overdue order:
    *   Updates the status to the configured delayed status
    *   Runs the workflow for the delayed status
4.  Reports the number of orders updated

### Threshold Calculation

*   If `ThresholdDays` is 0: Orders become overdue on the expected delivery date
*   If `ThresholdDays` is 3: Orders become overdue 3 days after the expected delivery date
*   This allows for grace periods before flagging orders as delayed

### Prerequisites

*   Orders must have an expected delivery date set
*   The delayed status must exist in the order type configuration
*   Orders must not already be in a completed or cancelled state

### Side Effects

*   Updates order status to the delayed status
*   Triggers workflow actions (may send notifications, create tasks, etc.)
*   Creates event log entries for status changes

* * *

## Example Configuration

```json
{
    "ImplementationType": "UpdateOverdueOrdersScheduledTask",
    "Schedule": "0 6 * * *",
    "IsDisabled": false,
    "Properties": [
        {
            "Key": "OrderStatus",
            "Value": "Delayed"
        },
        {
            "Key": "ThresholdDays",
            "Value": "2"
        },
        {
            "Key": "StatusFilter",
            "Value": "InProgress,Shipped"
        }
    ]
}
```

* * *

## Recommended Schedule

Run daily in the morning (`0 6 * * *`) to identify overdue orders at the start of the business day. This timing allows staff to address delays during working hours.

* * *

## Related Tasks

*   [Order Automation](order-automation.md) - Condition-based status automation
*   [Update Order Status](update-order-status.md) - Scheduled status transitions
*   [Cancel Expired Orders](cancel-expired-orders.md) - Handle expired orders
