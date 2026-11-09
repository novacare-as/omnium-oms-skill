# Order Automation

Source: https://docs.omnium.no/docs/configuration/scheduled-tasks/orders/order-automation

> Automatically transition order status based on configurable conditions

## Overview

This task provides a powerful automation engine that evaluates orders against configurable conditions and automatically transitions them to new statuses. It supports conditions based on payment status, inventory reservation status, purchase order allocation, and inventory availability changes, enabling hands-off order processing workflows.

## Identifier

| Property | Value |
| --- | --- |
| **Implementation Type** | `OrderAutomationScheduledTask` |
| **Group** | Orders |
| **Type** | Delta |

* * *

## When to Use

Enable this task when you need:

*   Automatic order status progression based on payment and inventory state
*   Hands-off processing for standard order workflows
*   Back-in-stock notifications and status updates
*   Conditional status transitions based on multiple criteria

* * *

## Configuration Properties

This task is configured through the `OrderAutomationSettings` section in Order Settings. Each automation rule includes:

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `Status` | string | Yes | The current order/shipment status to match |
| `NewStatus` | string | Yes | The status to transition to when conditions are met |
| `Condition` | string | Yes | The condition that must be satisfied (see Conditions below) |
| `OrderType` | string | No | Limit automation to a specific order type |
| `RunWorkflow` | bool | No | When `true`, executes workflow steps after status change. Default: `false` |

### Available Conditions

| Condition | Description |
| --- | --- |
| `FullyReservedFullyPaid` | All items reserved and full payment received |
| `FullyReservedFullyPaidDeliveryDateDue` | All items reserved, full payment received, and requested delivery date is today or earlier (or not set) |
| `FullyReservedNotFullyPaid` | All items reserved but payment pending |
| `PartiallyReservedFullyPaid` | Some items reserved and full payment received |
| `PartiallyReservedNotFullyPaid` | Some items reserved and payment pending |
| `PartiallyOrNotReservedFullyPaid` | Not all items reserved and full payment received |
| `PartiallyOrNotReservedNotFullyPaid` | Not all items reserved and payment pending |
| `FullyReservedWithPurchaseOrder` | All items covered by either warehouse inventory reservation or purchase order allocation, with at least one item allocated to a purchase order |
| `FullyAllocatedToPurchaseOrder` | All items allocated to incoming purchase orders |
| `PartiallyAllocatedToPurchaseOrder` | Some items allocated to purchase orders |
| `BackInStock` | All items in shipment are now available (delta-based) |
| `PartiallyBackInStock` | Some items in shipment are now available (delta-based) |

* * *

## Behavior

### What It Does

1.  Reads automation rules from Order Settings
2.  For each automation rule:
    *   Searches for orders/shipments matching the source status and condition
    *   Evaluates payment status against order totals
    *   Evaluates inventory reservation status at the shipment level
    *   For back-in-stock conditions, checks recent inventory changes
3.  For matching shipments, updates the status to the configured new status
4.  Optionally runs workflow actions associated with the new status
5.  Processes orders in batches for efficiency

### Payment Status Evaluation

*   **Paid**: Remaining payment balance is zero or negative (including overpayment)
*   **NotPaid**: Remaining payment balance is positive
*   **PartiallyPaid**: Has capture/sale payments but still has remaining balance
*   **OverPaid**: Remaining payment balance is negative

### Inventory Status Evaluation

*   **Reserved**: All line items have inventory reserved
*   **PartiallyReserved**: Some but not all line items have inventory reserved
*   **PartiallyOrNotReserved**: At least one line item without reservation

### Back-in-Stock Processing

The back-in-stock conditions use delta processing to efficiently detect inventory changes:

1.  Queries inventory items modified since the last task run
2.  Identifies products that now have available stock
3.  Matches those products to orders in the specified source status
4.  Evaluates if the shipment's inventory requirements can now be fulfilled

### Prerequisites

*   Automation rules must be configured in Order Settings
*   Order statuses referenced in rules must exist for the order type
*   For back-in-stock conditions, store warehouse configuration is required

### Side Effects

*   Updates order/shipment statuses
*   Triggers workflow actions when `RunWorkflow` is enabled
*   Creates event log entries for status changes
*   May send notifications configured in workflow steps

* * *

## Example Configuration

In Order Settings, configure the automation rules:

```json
{
    "OrderSettings": {
        "OrderAutomationSettings": {
            "OrderAutomations": [
                {
                    "Status": "New",
                    "NewStatus": "ReadyForPicking",
                    "Condition": "FullyReservedFullyPaid",
                    "RunWorkflow": true
                },
                {
                    "Status": "New",
                    "NewStatus": "AwaitingPayment",
                    "Condition": "FullyReservedNotFullyPaid",
                    "RunWorkflow": true
                },
                {
                    "Status": "AwaitingStock",
                    "NewStatus": "ReadyForPicking",
                    "Condition": "BackInStock",
                    "RunWorkflow": true
                },
                {
                    "Status": "New",
                    "NewStatus": "AwaitingStock",
                    "Condition": "PartiallyAllocatedToPurchaseOrder",
                    "OrderType": "Standard",
                    "RunWorkflow": false
                }
            ]
        }
    }
}
```

Then configure the scheduled task:

```json
{
    "ImplementationType": "OrderAutomationScheduledTask",
    "Schedule": "*/10 * * * *",
    "IsDisabled": false
}
```

* * *

## Recommended Schedule

Run every 10 minutes (`*/10 * * * *`) for responsive automation. Adjust frequency based on order volume and business requirements.

* * *

## Related Tasks

*   [Try Reserve Order Lines](try-reserve-order-lines.md) - Reserve inventory before automation
*   [Allocate Order to Purchase Order](allocate-order-to-purchase-order.md) - Allocate to purchase orders
*   [Payment Settlements](payment-settlements.md) - Update payment status
*   [Update Order Status](update-order-status.md) - Process scheduled status changes
