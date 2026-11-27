# Try Split Order to Warehouse

Source: https://docs.omnium.no/docs/Order/workflow-steps/allocation/try-split-order-to-warehouse

> Split available items to a specific warehouse while leaving unavailable items for other routing.

## Overview

The **Try Split Order to Warehouse** step creates a new shipment for items that are available at a specified warehouse, leaving items without inventory for subsequent allocation logic. This is useful for prioritizing a specific warehouse without blocking unavailable items.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `TrySplitOrderToWarehouse` |
| **Group** | Reallocate |
| **Applicable Statuses** | New |

## Configuration Properties

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `warehouseCode` | string | Yes | Target warehouse to split available items to |

## Behavior

### What It Does

1.  Retrieves the target `warehouseCode` from configuration
2.  Checks which order lines have inventory at the target warehouse
3.  Creates a new shipment for items with available inventory
4.  Leaves remaining items on the original shipment for further processing

### Prerequisites

*   `warehouseCode` property must be configured
*   Target warehouse must have at least some items in stock

### Side Effects

*   Creates new shipment for items routed to target warehouse
*   Moves line items between shipments
*   Does not affect items without inventory at target

## Business Cases

### When to Use

*   **Priority warehouse**: Route available items to a preferred location first
*   **Partial fulfillment**: Get some items shipped immediately from a specific location
*   **Regional routing**: Split items available at a regional DC before fallback logic

### Example Scenarios

**Scenario 1: Fast Shipping Option** Configure `warehouseCode = "EXPRESS-DC"` to split items available at the express DC for faster delivery, while other items go through normal routing.

**Scenario 2: Local Inventory Priority** Use before general reallocation to first extract items available at a preferred local warehouse.

**Scenario 3: No Available Items** If no items are available at the target warehouse, the step succeeds without changes and subsequent steps handle the order.

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| Missing `warehouseCode` | Error | Depends on StopOnError |
| Items split successfully | Success | Yes |
| No items available | Success (no change) | Yes |
| Exception | Error | Depends on StopOnError |

## Related Steps

*   [Try Reallocate Entire Order to Specific Warehouse](try-reallocate-entire-order-to-specific-warehouse.md) - Moves entire order if all items available
*   [Try Split Unreserved Order Lines](try-split-unreserved-order-lines.md) - More flexible splitting options
