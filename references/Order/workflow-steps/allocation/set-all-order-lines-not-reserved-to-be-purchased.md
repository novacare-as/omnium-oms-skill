# Set All Order Lines Not Reserved to Be Purchased

Source: https://docs.omnium.no/docs/Order/workflow-steps/allocation/set-all-order-lines-not-reserved-to-be-purchased

> Mark order lines with insufficient inventory reservation for purchase order creation.

## Overview

The **Set All Order Lines Not Reserved to Be Purchased** step identifies order lines where the reserved inventory quantity is less than the ordered quantity and marks them for purchase order creation. This enables drop-ship or cross-dock fulfillment workflows.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `SetAllOrderLinesNotReservedToBePurchased` |
| **Group** | Reallocate |
| **Applicable Statuses** | New |

## Configuration Properties

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `Prefix` | string | No | Prefix for purchase order reference |
| `Character` | string | No | Separator character |
| `MinLength` | string | No | Minimum length for reference number |

## Behavior

### What It Does

1.  Iterates through all line items in the order
2.  Skips virtual products (they don't require inventory)
3.  For each line where `ReservedInventoryQuantity < Quantity`:
    *   Sets `CreatePurchaseOrder = true` on the line item
4.  Returns the count of lines marked for purchase

### Prerequisites

*   Order must have line items
*   Inventory reservation should have already been attempted

### Side Effects

*   Sets `CreatePurchaseOrder = true` on affected line items
*   Does not actually create purchase orders (that's a separate step)

## Business Cases

### When to Use

*   **Drop-ship orders**: When items should be ordered from suppliers for direct delivery
*   **Cross-dock fulfillment**: Mark items that need to be ordered to fulfill the customer order
*   **Backorder handling**: Identify which items need to be procured

### Example Scenarios

**Scenario 1: Partial Stock** An order for 5 units has only 2 reserved. The remaining 3 are marked for purchase order creation.

**Scenario 2: Out of Stock** An order for an item with zero inventory - the entire quantity is marked for purchase.

**Scenario 3: Virtual Products Excluded** Gift cards and digital products are skipped since they don't require physical inventory.

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| No line items | Success (no action) | Yes |
| All items reserved | Success (no changes) | Yes |
| Some items marked | Success with count message | Yes |

## Related Steps

*   [Try Reallocate to Purchase Order](try-reallocate-to-purchase-order.md) - Allocates marked lines to existing purchase orders
*   [Create Purchase Order from Order](../purchase-orders/create-purchase-order-from-order.md) - Creates purchase orders for marked lines
*   [Remove Order Lines to Be Purchased](remove-order-lines-to-be-purchased.md) - Unmarks lines when they are shipped, picked up or canceled
