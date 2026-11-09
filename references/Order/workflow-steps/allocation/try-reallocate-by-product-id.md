# Try Reallocate by Product ID

Source: https://docs.omnium.no/docs/Order/workflow-steps/allocation/try-reallocate-by-product-id

> Reallocate orders containing specific products to a designated warehouse.

## Overview

The **Try Reallocate by Product ID** step reallocates orders to a specified warehouse if they contain specific products. This enables product-specific fulfillment routing, useful for items that require special handling or are only stocked at certain locations.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `TryReallocateByProductId` |
| **Group** | Reallocate |
| **Applicable Statuses** | New |

## Configuration Properties

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `productIds` | string | Yes | Comma-separated list of product IDs to match |
| `warehouseTo` | string | Yes | Target warehouse for matching orders |
| `warehouseFrom` | string | No | Only reallocate from these warehouses (comma-separated) |

## Behavior

### What It Does

1.  Validates that `productIds` and `warehouseTo` are configured
2.  Parses the comma-separated product ID list
3.  Optionally filters by source warehouse (`warehouseFrom`)
4.  Checks if order contains any of the specified products
5.  Reallocates matching orders to the target warehouse

### Prerequisites

*   `productIds` property must be configured
*   `warehouseTo` property must be configured
*   Orders must contain the specified products

### Side Effects

*   Changes warehouse assignment for matching orders
*   Only affects orders from specified source warehouses if `warehouseFrom` is set

## Business Cases

### When to Use

*   **Exclusive distribution**: Route specific brands or products to designated fulfillment centers
*   **Promotional items**: Route orders with promotional products to a specific facility
*   **Restricted items**: Route controlled substances or age-restricted products to authorized locations
*   **Source-specific routing**: Only reallocate from certain warehouses (e.g., overflow from main warehouse)

### Example Scenarios

**Scenario 1: Brand-Specific Warehouse** Configure `productIds = "BRAND-001,BRAND-002,BRAND-003"`, `warehouseTo = "BRAND-DC"` to route all orders containing these brand products.

**Scenario 2: Overflow Management** Configure `productIds = "PROMO-ITEM"`, `warehouseFrom = "MAIN"`, `warehouseTo = "SECONDARY"` to move promotional item orders from the overwhelmed main warehouse.

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| Missing `productIds` | Error | Depends on StopOnError |
| Missing `warehouseTo` | Error | Depends on StopOnError |
| Order reallocated | Success | Yes |
| No reallocation needed | Success | Yes |
| Exception | Error | Depends on StopOnError |

## Related Steps

*   [Try Reallocate by Category ID](try-reallocate-by-category-id.md) - Route based on product categories
*   [Try Reallocate Entire Order to Specific Warehouse](try-reallocate-entire-order-to-specific-warehouse.md) - Route all orders to a warehouse
