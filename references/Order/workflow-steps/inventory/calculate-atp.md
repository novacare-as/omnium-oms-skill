# Calculate ATP

Source: https://docs.omnium.no/docs/Order/workflow-steps/inventory/calculate-atp

> Calculate Available-to-Promise (ATP) values for products in the order.

## Overview

The **Calculate ATP** step recalculates Available-to-Promise values for products linked to purchase orders. ATP represents the quantity of inventory that can be promised to customers, considering incoming purchase orders and expected delivery dates.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `CalculateAtp` |
| **Group** | Inventory |
| **Applicable Statuses** | New, OrderCanceled |

## Configuration Properties

| Property | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `SkipProductUpdate` | Boolean | No | `false` | Skip updating product records with new ATP values |

## Behavior

### What It Does

1.  Identifies SKUs from order lines that have `ReservedInventoryPurchaseOrderLineId` set
2.  Recalculates the ATP index for the affected SKUs
3.  If `SkipProductUpdate` is false and SKUs exist:
    *   Waits 1 second for index to update
    *   Updates products with new ATP values and triggers export if configured
4.  Returns success or error based on calculation result

### Prerequisites

*   Order lines must have purchase order line ID references
*   ATP service must be configured
*   Product export typically configured for ATP updates

### Side Effects

*   ATP index is recalculated for affected SKUs
*   Product records updated with new ATP values
*   May trigger product export to external systems

## Business Cases

### When to Use

*   **Purchase order allocation**: When orders are linked to incoming POs
*   **Order cancellation**: Recalculate ATP when PO-linked orders cancel
*   **Backorder management**: Update availability promises

### Example Scenarios

**Scenario 1: New Order with PO** Customer orders item not in stock but on incoming PO. Order line links to PO. Step calculates ATP to reflect the promised delivery.

**Scenario 2: Order Cancellation** Order with PO allocation is canceled. Step recalculates ATP to release the promised quantity back to available.

**Scenario 3: Skip Product Update** High-volume processing where product updates should be batched. Configure `SkipProductUpdate=true` to only update the index.

**Scenario 4: No PO Items** Order has only in-stock items without PO links. Step finds no qualifying SKUs and completes successfully without action.

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| No PO-linked items | Success (no action) | Yes |
| ATP calculation successful | Success | Yes |
| Calculation failed | Error | Depends on StopOnError |

## Related Steps

*   [Calculate and Update Product Inventory](calculate-and-update-product-inventory.md) - Updates inventory status on products
*   [Recalculate Reserved Inventory](recalculate-reserved-inventory.md) - Recalculates reservations
