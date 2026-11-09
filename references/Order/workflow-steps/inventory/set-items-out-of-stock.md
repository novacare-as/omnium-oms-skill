# Set Items Out of Stock

Source: https://docs.omnium.no/docs/Order/workflow-steps/inventory/set-items-out-of-stock

> Zero out inventory for all products in the order.

## Overview

The **Set Items Out of Stock** step sets the inventory count to zero for all products in the order. This is a drastic action typically used for specific business scenarios where items should no longer be available.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `SetItemsOutOfStock` |
| **Group** | Inventory |
| **Applicable Statuses** | (All statuses) |

## Configuration Properties

This step has no configurable properties.

## Behavior

### What It Does

1.  Iterates through all non-virtual product line items
2.  For each item, creates an inventory record with:
    *   `Inventory = 0`
    *   `WarehouseCode = order.StoreId`
    *   `Variant = lineItem.Code`
3.  Updates inventory records to set all quantities to zero
4.  Does not update reserved inventory counts

### Prerequisites

*   Order must have line items

### Side Effects

*   Inventory set to 0 for all order products in the order's store
*   Products become unavailable for new orders
*   Does not affect other warehouses
*   Does not affect reserved inventory

## Business Cases

### When to Use

*   **Last item sold**: Mark items out of stock when last unit ships
*   **Discontinuation**: Remove availability for discontinued items
*   **Recall handling**: Quickly remove recalled items from availability
*   **Manual override**: Force out-of-stock status

### Example Scenarios

**Scenario 1: Limited Edition** Limited edition product sells last unit. Step sets inventory to 0 so no more orders can be placed.

**Scenario 2: Product Recall** Product must be recalled. Step zeros inventory to prevent new sales.

**Scenario 3: Store-Specific** Uses order's StoreId as warehouse code. Only affects that specific store/warehouse.

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| Update successful | Success | Yes |
| No line items | Success (no action) | Yes |

## Related Steps

*   [Change Status If Out of Stock](change-status-if-out-of-stock.md) - Check stock and change order status
*   [Calculate and Update Product Inventory](calculate-and-update-product-inventory.md) - Update product availability
