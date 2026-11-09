# Allocate Order to Purchase Order

Source: https://docs.omnium.no/docs/configuration/scheduled-tasks/orders/allocate-order-to-purchase-order

> Automatically allocate unreserved order lines to incoming purchase orders

## Overview

This task processes orders with unreserved order lines and attempts to allocate them to available purchase orders. When a purchase order arrives with expected inventory, this task links waiting customer orders to that incoming stock, enabling fulfillment from supplier shipments.

## Identifier

| Property | Value |
| --- | --- |
| **Implementation Type** | `AllocateOrderToPurchaseOrderScheduledTask` |
| **Group** | Orders |
| **Type** | Delta |

* * *

## When to Use

Enable this task when you need:

*   Automatic allocation of backorders to incoming purchase orders
*   Drop-ship or pre-order fulfillment workflows
*   Split shipment handling where some items ship from incoming stock
*   Coordination between customer orders and supplier deliveries

* * *

## Configuration Properties

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `OrderStatus` | string | No | Comma-separated list of order statuses to process. Defaults to all non-delivered, non-cancelled statuses. |
| `OrderType` | string | No | Comma-separated list of order types to process. Leave empty for all types. |
| `SplitToSeparateShipments` | bool | No | When `true`, creates separate shipments for items allocated to different purchase orders. Default: `false`. |
| `AllowPastRequestedDeliveryDate` | bool | No | When `true`, allocates to purchase orders even if the delivery date has passed. Default: `false`. |
| `OnlyAllocateIsAwaitingPurchaseOrder` | bool | No | When `true`, only allocates lines explicitly marked as awaiting a purchase order. Default: `false`. |
| `EnableLineSplitting` | bool | No | When `true`, enables FIFO-first greedy allocation across multiple purchase orders. Order lines are split so that the earliest-arriving POs are consumed first. When `false` (default), a single purchase order must have sufficient quantity to cover the full line — no splitting occurs. |

* * *

## Behavior

### What It Does

1.  Searches for orders with line items that are marked for purchase order fulfillment but not yet reserved
2.  Filters orders by configured status and order type criteria
3.  Processes eligible orders sorted by creation date, oldest first (FIFO)
4.  For each eligible order, attempts to match unreserved lines to available purchase order ATP
5.  When a match is found, links the order line to the purchase order line
6.  Updates the order with allocation information
7.  Triggers recalculation of available-to-promise (ATP) quantities for affected products

### FIFO and soft-locking

The task processes orders oldest-first within a single run. When an order line cannot be fully covered, the task soft-locks the available ATP for that order — preventing later orders in the same run from claiming those slots. This applies regardless of whether `EnableLineSplitting` is enabled. No partial reservation is ever made; it is all or nothing per order line.

When `EnableLineSplitting` is `false` (default), a single purchase order must have enough ATP to cover the full order line quantity. When `EnableLineSplitting` is `true`, the task takes from the earliest-arriving purchase orders first and splits the order line across multiple POs if needed to achieve full coverage.

### Inventory reservation

This task only allocates order lines to purchase orders. It does not reserve inventory from existing warehouse stock. Inventory reservation must be handled separately — either through dedicated workflow steps or the [Try Reserve Order Lines](try-reserve-order-lines.md) scheduled task.

### Prerequisites

*   Purchase orders must exist in the system with available lines
*   Order lines must be flagged for purchase order fulfillment
*   Order status must match configured criteria (or be non-delivered/non-cancelled by default)

### Side Effects

*   Updates order line reservation information
*   Creates event log entries for allocation actions
*   Recalculates ATP index for allocated product SKUs
*   May create additional shipments when split shipment option is enabled

* * *

## Example Configuration

```json
{
    "ImplementationType": "AllocateOrderToPurchaseOrderScheduledTask",
    "Schedule": "*/15 * * * *",
    "IsDisabled": false,
    "Properties": [
        {
            "Key": "OrderStatus",
            "Value": "AwaitingStock,BackOrder"
        },
        {
            "Key": "SplitToSeparateShipments",
            "Value": "true"
        },
        {
            "Key": "EnableLineSplitting",
            "Value": "true"
        }
    ]
}
```

* * *

## Recommended Schedule

Run every 15 minutes (`*/15 * * * *`) to promptly allocate orders when purchase orders are received. Increase frequency during high-volume periods or when rapid fulfillment is required.

* * *

## Related Tasks

*   [Try Reserve Order Lines](try-reserve-order-lines.md) - Reserve from existing warehouse stock
*   [Try Reallocate Orders](try-reallocate-orders.md) - Handle reallocation deadline expiration
*   [Order Automation](order-automation.md) - Automate status transitions based on allocation state
