# Reduce Inventory

Source: https://docs.omnium.no/docs/Order/workflow-steps/inventory/reduce-inventory

> Decrease actual inventory levels when an order is shipped or picked.

## Overview

The **Reduce Inventory** step decreases the actual inventory count for shipped order lines. It processes only released shipments and tracks inventory transactions to prevent duplicate reductions.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `ReduceInventory` |
| **Group** | Shipments |
| **Applicable Statuses** | Ship, ReadyForPickup, Completed |

## Configuration Properties

This step has no configurable properties.

## Behavior

### What It Does

1.  Identifies shipments with `Released` status
2.  If running at shipment level, only processes the current shipment
3.  Generates internal references for tracking (OrderId + ShipmentId + LineItemId)
4.  Checks existing inventory transactions to prevent duplicate reductions
5.  For each non-virtual product line item:
    *   Calculates quantity (quantity minus canceled quantity)
    *   Decreases inventory at the specified warehouse and virtual warehouse
    *   Updates line item cost from inventory if available
    *   Converts cost to order currency if different from default
6.  Returns warning if inventory was already reduced

### Prerequisites

*   Shipments must be in `Released` status
*   Line items must not be virtual products
*   Inventory transaction tracking prevents duplicates

### Side Effects

*   Actual inventory count decreases
*   Creates inventory transaction record
*   Updates line item `Cost` and `CostTotal` fields
*   Currency conversion applied if needed

## Business Cases

### When to Use

*   **Order fulfillment**: When goods physically leave the warehouse
*   **Ship status transition**: Standard step when moving to Ship status
*   **ReadyForPickup**: When click-and-collect items are prepared

### Example Scenarios

**Scenario 1: Standard Shipment** Order with 5 items ships. Step reduces inventory for all 5 items in the warehouse and updates costs.

**Scenario 2: Partial Shipment** Order has 2 shipments, first ships. Running at shipment level reduces inventory only for that shipment's items.

**Scenario 3: Already Processed** Workflow runs twice accidentally. Step detects existing inventory transaction and returns warning without duplicating.

**Scenario 4: Cost Update** Inventory item has cost recorded. Step retrieves cost, converts from USD to EUR (order currency), updates line item.

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| Inventory already reduced | Warning | Yes |
| Reduction successful | Success | Yes |
| No released shipments | Success (no action) | Yes |

## Related Steps

*   [Reduce Inventory and Reserved Inventory](reduce-inventory-and-reserved-inventory.md) - Reduces both in one step
*   [Reduce Inventory Only On Reserved Order Lines](reduce-inventory-only-on-reserved-order-lines.md) - Conditional reduction
