# Try Reserve Order Lines

Source: https://docs.omnium.no/docs/configuration/scheduled-tasks/orders/try-reserve-order-lines

> Reserve inventory for unreserved order lines using FIFO logic

## Overview

This task processes all non-delivered orders and attempts to reserve inventory for unreserved order lines. It uses FIFO (First In, First Out) logic to prioritize older orders, ensuring that available inventory is allocated to the oldest waiting orders first. This enables fair inventory distribution when stock becomes available.

## Identifier

| Property | Value |
| --- | --- |
| **Implementation Type** | `TryReserveOrderlinesScheduledTask` |
| **Group** | Orders |
| **Type** | Delta |

* * *

## When to Use

Enable this task when you need:

*   FIFO-based inventory reservation across orders
*   Automatic reservation when stock becomes available
*   Fair distribution of limited inventory to waiting orders
*   Recovery from reservation failures or partial reservations

* * *

## Configuration Properties

This task has no configurable properties.

* * *

## Behavior

### What It Does

1.  Retrieves all orders in non-delivered statuses, sorted by creation date (oldest first)
    *   Skips orders in a status with `IsExcludedFromReservedInventory: true` in the order type config. These orders do not reserve inventory, so they do not take stock from the orders that do
2.  Calculates effective reserved inventory based on current order line reservations
3.  For each order and shipment:
    *   Identifies unreserved line items (excluding those reserved on purchase orders)
    *   Excludes package, bundle, and virtual products
    *   Checks available inventory in the shipment's warehouse
    *   Attempts to reserve inventory for each unreserved line
4.  When reservation is successful:
    *   Updates the line item's reserved quantity
    *   Increases the calculated reserved inventory count
    *   Clears any "create purchase order" flag on the line
5.  Updates shipment totals after reservation changes
6.  Saves all modified orders in a batch operation
7.  Creates event log entries for updated orders

### FIFO Processing

The task processes orders in creation date order (oldest first), meaning:

*   If only 5 units are available and 3 orders each need 5 units
*   The oldest order gets the 5 units reserved
*   Newer orders remain unreserved until more stock arrives

### Inventory Calculation

The task maintains a calculated inventory state during processing:

*   Starts with actual inventory minus currently reserved quantities
*   As reservations are made, the calculated available inventory decreases
*   This prevents over-reservation during a single task run

### Limitations

This task processes a maximum of 10,000 open (non-delivered, non-cancelled) orders per run. If your order volume exceeds this limit, contact support.

### Prerequisites

*   Orders must exist with unreserved line items
*   Inventory records must exist for the products
*   Warehouse configuration must be in place

### Side Effects

*   Updates order line reservation quantities
*   Modifies calculated inventory during processing
*   Updates shipment totals and status flags
*   Clears "create purchase order" flags on reserved lines
*   Creates event log entries for each updated order
*   Updates order modification timestamps

* * *

## Example Configuration

```json
{
    "ImplementationType": "TryReserveOrderlinesScheduledTask",
    "Schedule": "*/15 * * * *",
    "IsDisabled": false
}
```

* * *

## Recommended Schedule

Run every 15 minutes (`*/15 * * * *`) to promptly reserve inventory as it becomes available. More frequent execution may be appropriate for high-volume environments.

* * *

## Related Tasks

*   [Allocate Order to Purchase Order](allocate-order-to-purchase-order.md) - Allocate to incoming purchase orders
*   [Order Automation](order-automation.md) - Progress orders based on reservation status
*   [Try Reallocate Orders](try-reallocate-orders.md) - Handle reallocation deadlines
