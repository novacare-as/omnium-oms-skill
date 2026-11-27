# Reduce Reserved Inventory

Source: https://docs.omnium.no/docs/Order/workflow-steps/inventory/reduce-reserved-inventory

> Release reserved inventory when an order or shipment is canceled.

## Overview

The **Reduce Reserved Inventory** step releases reserved inventory back to available stock. This is typically used when orders or shipments are canceled, allowing the stock to be available for other orders.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `ReduceReservedInventory` |
| **Group** | Shipments |
| **Applicable Statuses** | OrderCanceled |

## Configuration Properties

| Property | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `CancelledOnly` | Boolean | No | `false` | Only reduce if order/shipment is in canceled status |

## Behavior

### What It Does

1.  Checks if `CancelledOnly` property is set (defaults to false)
2.  If `CancelledOnly` is true, verifies the order or shipment is actually canceled
3.  Identifies shipments that are not already in Cancelled status
4.  For each non-virtual product line item:
    *   Reduces reserved inventory by the line quantity
    *   Also reduces for virtual warehouse if applicable
5.  Returns success after processing

### Prerequisites

*   Order must have shipments with line items
*   If `CancelledOnly` is true, order or shipment must be in canceled status
*   Should run before shipment status changes to Cancelled

### Side Effects

*   Reserved inventory decreases in the inventory system
*   Stock becomes available for other orders
*   Affects both physical and virtual warehouse inventory

## Business Cases

### When to Use

*   **Order cancellation**: Release all reserved stock when order is canceled
*   **Shipment cancellation**: Release stock for a specific canceled shipment
*   **Partial cancellation**: Release stock for canceled line items

### Example Scenarios

**Scenario 1: Full Order Cancellation** Customer cancels entire order. Step releases reserved inventory for all shipments, making stock available again.

**Scenario 2: Single Shipment Cancel** Multi-shipment order, one shipment canceled. Running at shipment level releases only that shipment's reserved inventory.

**Scenario 3: With CancelledOnly Check** Workflow step configured with `CancelledOnly=true`. Only reduces inventory if order is in a canceled status, preventing accidental release.

**Scenario 4: Virtual Warehouse** Shipment has a virtual warehouse code. Step reduces reserved inventory for both the physical and virtual warehouse.

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| Order not canceled (when CancelledOnly=true) | Warning | Yes |
| No shipments to process | Success | Yes |
| Reduction successful | Success | Yes |

## Related Steps

*   [Increase Reserved Inventory](increase-reserved-inventory.md) - Reserves inventory
*   [Reduce Inventory](reduce-inventory.md) - Reduces actual inventory
