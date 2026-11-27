# Reduce Inventory Only On Reserved Order Lines

Source: https://docs.omnium.no/docs/Order/workflow-steps/inventory/reduce-inventory-only-on-reserved-order-lines

> Reduce inventory and conditionally reduce reserved inventory based on line item reservation status.

## Overview

The **Reduce Inventory Only On Reserved Order Lines** step reduces actual inventory for all shipped items, but only reduces reserved inventory for line items that were actually reserved. This is useful when some items bypass the reservation process.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `ReduceInventoryOnlyOnReservedOrderLines` |
| **Group** | Shipments |
| **Applicable Statuses** | Ship, ReadyForPickup, Completed |

## Configuration Properties

This step has no configurable properties.

## Behavior

### What It Does

1.  Identifies shipments with `Released` status
2.  Generates internal references for tracking (OrderId + ShipmentId + LineItemId)
3.  Checks existing inventory transactions to prevent duplicate reductions
4.  For each non-virtual product line item:
    *   Checks if `ReservedInventoryQuantity > 0` to determine if item was reserved
    *   Calculates quantity (quantity minus canceled quantity)
    *   If reserved: Calls `ReduceInventoryAndReservedInventory()`
    *   If not reserved: Calls `ReduceInventory()` only
    *   Updates line item cost from inventory
    *   Applies currency conversion if needed
5.  Returns warning if inventory was already reduced

### Prerequisites

*   Shipments must be in `Released` status
*   Line items must not be virtual products
*   Line items have `ReservedInventoryQuantity` set during reservation

### Side Effects

*   Actual inventory always decreases
*   Reserved inventory only decreases for reserved items
*   Creates inventory transaction record
*   Updates line item `Cost` and `CostTotal` fields

## Business Cases

### When to Use

*   **Mixed reservation workflows**: Some items reserved, others not
*   **Dropship/transfer orders**: Items received without prior reservation
*   **Manual order entry**: When reservation was skipped
*   **POS orders**: Often bypass reservation

### Example Scenarios

**Scenario 1: Mixed Order** Order has 5 items: 3 were reserved, 2 were added later without reservation. Step reduces inventory for all 5, but only reduces reserved inventory for the 3 reserved items.

**Scenario 2: POS Integration** POS order imported directly. Items were never reserved. Step reduces inventory without touching reserved counts.

**Scenario 3: Backorder Fulfillment** Items arrived from purchase order and added to order without reservation. Step handles them correctly.

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| Inventory already reduced | Warning | Yes |
| Reduction successful | Success | Yes |
| No released shipments | Success (no action) | Yes |

## Related Steps

*   [Reduce Inventory and Reserved Inventory](reduce-inventory-and-reserved-inventory.md) - Always reduces both
*   [Reduce Inventory](reduce-inventory.md) - Only reduces actual inventory
