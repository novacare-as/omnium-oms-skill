# Remove Order Lines to Be Purchased

Source: https://docs.omnium.no/docs/Order/workflow-steps/allocation/remove-order-lines-to-be-purchased

> Unmark order lines for purchase order creation when they are shipped, picked up or canceled.

## Overview

The **Remove Order Lines to Be Purchased** step unmarks order lines for purchase order creation. Can be used on order statuses where order is shipped, picked up or canceled, it should no longer show up as a purchase order suggestion or as awaiting a purchase order. This step is the counterpart of [Set All Order Lines Not Reserved to Be Purchased](set-all-order-lines-not-reserved-to-be-purchased.md).

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `RemoveOrderLinesToBePurchased` |
| **Group** | Reallocate |
| **Applicable Statuses** | Ship, PickedUp, OrderCanceled |

## Configuration Properties

This step has no configuration properties.

## Behavior

### What It Does

For each affected order line, the step:

*   Sets `CreatePurchaseOrder = false`
*   Sets `IsAwaitingPurchaseOrder = null`

### Shipment Scope

| Executed | Affected lines |
| --- | --- |
| Per shipment | The line items of the current shipment, and the order-form line items with the same `LineItemId`. Lines on other shipments are left as they are. |
| On the whole order | All order-form line items, and the line items of every shipment. |

### Side Effects

*   Inventory reservation fields (`ReservedInventory`, `ReservedInventoryQuantity`, `ReservedInventoryPurchaseOrderId` and so on) are not changed. Use the `RemoveOrderLineReservations` step to clear those.
*   Existing purchase orders are not changed or canceled.

## Business Cases

### When to Use

*   **Shipped from stock**: A line was marked to be purchased, but was shipped from stock before a purchase order was created.
*   **Picked up in store**: The customer picked up the line, so no purchase order is needed.
*   **Canceled orders**: A canceled line should not create a purchase order.

### Example Scenarios

**Scenario 1: Order shipped in several shipments** An order is split into two shipments, and both shipments' lines are marked to be purchased. When the first shipment moves to `Ship`, the step runs per shipment and unmarks only that shipment's lines. The second shipment is still a purchase order suggestion.

**Scenario 2: Canceled order** A customer cancels an order with lines waiting for a purchase order. When the order moves to `OrderCanceled`, the step unmarks every line, so the lines no longer show up as purchase order suggestions.

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| No line items | Warning | Yes |
| Lines unmarked | Success with count message | Yes |

## Related Steps

*   [Set All Order Lines Not Reserved to Be Purchased](set-all-order-lines-not-reserved-to-be-purchased.md) - Marks unreserved lines for purchase order creation
*   [Try Reallocate to Purchase Order](try-reallocate-to-purchase-order.md) - Allocates marked lines to existing purchase orders
*   [Create Purchase Order from Order](../purchase-orders/create-purchase-order-from-order.md) - Creates purchase orders for marked lines
