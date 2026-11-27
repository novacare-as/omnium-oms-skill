# Try Reallocate by Category ID

Source: https://docs.omnium.no/docs/Order/workflow-steps/allocation/try-reallocate-by-category-id

> Reallocate orders to a different warehouse based on whether they contain products from a specific category.

## Overview

The **Try Reallocate by Category ID** step reallocates orders to a specified warehouse if they contain (or don't contain, based on configuration) products from a given category. This enables category-specific fulfillment routing, such as routing hazardous materials or refrigerated items to specialized facilities.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `TryReallocateByCategoryId` |
| **Group** | Reallocate |
| **Applicable Statuses** | New |

## Configuration Properties

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `categoryId` | string | Yes | The product category ID to match |
| `warehouseCode` | string | No | Target warehouse for matching orders |
| `reallocateIfMissing` | boolean | No | If true, reallocate orders that do NOT contain the category |

## Behavior

### What It Does

1.  Validates that `categoryId` is configured
2.  Checks if order contains products from the specified category
3.  If `reallocateIfMissing` is true, inverts the logic (reallocates orders without the category)
4.  Reallocates matching orders to the specified warehouse

### Prerequisites

*   `categoryId` property must be configured
*   Products must have category assignments

### Side Effects

*   Changes warehouse assignment for matching orders
*   Does not validate inventory at destination warehouse

## Business Cases

### When to Use

*   **Hazardous materials**: Route orders with hazmat items to certified facilities
*   **Temperature-controlled**: Route refrigerated items to warehouses with cold storage
*   **Fragile items**: Route glass or electronics to facilities with special handling
*   **Exclusion routing**: Route orders WITHOUT certain categories to standard warehouses

### Example Scenarios

**Scenario 1: Hazmat Routing** Configure `categoryId = "hazmat"`, `warehouseCode = "HAZ-CERTIFIED"` to route all orders containing hazardous materials to the certified facility.

**Scenario 2: Exclusion Routing** Configure `categoryId = "fragile"`, `warehouseCode = "STANDARD"`, `reallocateIfMissing = true` to route orders WITHOUT fragile items to standard handling.

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| Missing `categoryId` | Error | Depends on StopOnError |
| Order reallocated | Success | Yes |
| No reallocation needed | Success | Yes |
| Exception | Error | Depends on StopOnError |

## Related Steps

*   [Try Reallocate by Product ID](try-reallocate-by-product-id.md) - Route based on specific products
*   [Try Reallocate by Store Category ID](try-reallocate-by-store-category-id.md) - Route based on store categories
