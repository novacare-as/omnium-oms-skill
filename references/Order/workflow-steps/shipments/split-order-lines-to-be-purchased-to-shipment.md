# Split Order Lines to Be Purchased to Shipment

Source: https://docs.omnium.no/docs/Order/workflow-steps/shipments/split-order-lines-to-be-purchased-to-shipment

> Split order lines that are waiting for purchase orders into a separate shipment.

## Overview

The **Split Order Lines to Be Purchased to Shipment** step separates order lines that are awaiting purchase orders (backorder items) into their own shipment. This enables shipping available items while waiting for backorder fulfillment.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `SplitOrderLinesToBePurchasedToShipment` |
| **Group** | Shipments |
| **Applicable Statuses** | New |

## Configuration Properties

| Property | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `SplitToStatus` | String | No | \- | Order status for the new shipment |
| `ConsolidateWithInStockOrderLines` | Boolean | No | `true` | Include in-stock items with PO items |

## Behavior

### What It Does

1.  Identifies order lines with:
    *   `ReservedInventory = true`
    *   `IsAwaitingPurchaseOrder = true`
    *   `ReservedInventoryPurchaseOrderId` is set
2.  If `ConsolidateWithInStockOrderLines` is true, also includes reserved items without PO
3.  Reallocates accessories to stay with main items
4.  If all items qualify, just updates shipment status
5.  Otherwise creates new shipment for qualifying items

### Prerequisites

*   Order lines must have PO allocation information
*   Some items should be awaiting purchase orders

### Side Effects

*   New shipment created for backorder items
*   Accessories move with their main items
*   New shipment gets specified status

## Business Cases

### When to Use

*   **Backorder separation**: Ship available items, hold backorders
*   **PO fulfillment**: Group items by purchase order
*   **Partial shipping**: Enable partial fulfillment

### Example Scenarios

**Scenario 1: Mixed Order** Order has 3 in-stock items and 2 backorder items. Step creates new shipment for the 2 backorder items.

**Scenario 2: All Backorder** All items are awaiting PO. Step updates all shipment statuses to `SplitToStatus` without creating new shipment.

**Scenario 3: Consolidate with In-Stock** `ConsolidateWithInStockOrderLines=true`. Both PO items and reserved in-stock items go to new shipment.

**Scenario 4: Accessories** Backorder item has accessory. Accessory automatically moves with the main item.

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| No items to split | Success (no action) | Yes |
| Split successful | Success | Yes |

## Related Steps

*   [Try Reallocate to Purchase Order](../allocation/try-reallocate-to-purchase-order.md) - Allocate to PO first
*   [Split All Line Items](split-all-line-items.md) - Split all items
