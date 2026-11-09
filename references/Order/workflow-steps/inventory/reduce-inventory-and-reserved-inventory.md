# Reduce Inventory and Reserved Inventory

Source: https://docs.omnium.no/docs/Order/workflow-steps/inventory/reduce-inventory-and-reserved-inventory

> Decrease both actual and reserved inventory when an order ships.

## Overview

The **Reduce Inventory and Reserved Inventory** step decreases both the actual inventory count and the reserved inventory count in a single operation. This is the standard step for order fulfillment when inventory was previously reserved.

Place this step **before** [Complete Shipment](../shipments/complete-shipment.md) in the workflow. Complete Shipment sets shipments to `Shipped`, and this step only processes shipments in `Released` status. If it runs after Complete Shipment, it finds no `Released` shipments and reports success without reducing any inventory.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `ReduceInventoryAndReservedInventory` |
| **Group** | Inventory |
| **Applicable Statuses** | Ship, ReadyForPickup, Completed |

## Configuration Properties

This step has no configurable properties.

## Behavior

### What It Does

1.  Identifies shipments with `Released` status
2.  Generates internal references for tracking (OrderId + ShipmentId + LineItemId)
3.  Checks existing inventory transactions to prevent duplicate reductions
4.  For each non-virtual product line item:
    *   Calculates quantity (quantity minus canceled quantity)
    *   Decreases both actual inventory and reserved inventory at the specified warehouse and virtual warehouse
    *   Updates line item cost from inventory if available
    *   Converts cost to order currency if different from default
5.  Returns warning if inventory was already reduced for the order

### Prerequisites

*   Shipments must be in `Released` status
*   Line items must not be virtual products
*   Inventory transaction tracking prevents duplicates

### Side Effects

*   Actual inventory count decreases
*   Reserved inventory count decreases
*   Creates inventory transaction record
*   Updates line item `Cost` and `CostTotal` fields
*   Currency conversion applied if needed

## Business Cases

### When to Use

*   **Standard order fulfillment**: The most common inventory reduction step
*   **Ship status transition**: When order moves to Ship status after being reserved
*   **Complete order**: When marking orders as completed

### Example Scenarios

**Scenario 1: Standard Order Ship** Order reserved 10 items. When shipped, step reduces both actual inventory and reserved inventory by 10.

**Scenario 2: With Cost Tracking** Items have cost data in inventory. Step updates line item costs during reduction, enabling margin reporting.

**Scenario 3: Virtual Warehouse** Shipment has virtual warehouse code for sub-inventory. Step reduces inventory in both physical and virtual warehouse tracking.

**Scenario 4: Currency Conversion** Inventory cost stored in USD, order is in NOK. Step converts cost at order creation date rate.

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| Inventory already reduced | Warning | Yes |
| Reduction successful | Success | Yes |
| No released shipments | Success (no action) | Yes |

## Related Steps

*   [Reduce Inventory](reduce-inventory.md) - Only reduces actual inventory
*   [Reduce Reserved Inventory](reduce-reserved-inventory.md) - Only reduces reserved inventory
*   [Increase Reserved Inventory](increase-reserved-inventory.md) - Reserves inventory on new orders
