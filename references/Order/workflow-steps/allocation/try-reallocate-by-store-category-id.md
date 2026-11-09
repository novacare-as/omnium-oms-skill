# Try Reallocate by Store Category ID

Source: https://docs.omnium.no/docs/Order/workflow-steps/allocation/try-reallocate-by-store-category-id

> Reallocate orders based on store-level product category availability.

## Overview

The **Try Reallocate by Store Category ID** step reallocates orders when both the order and the assigned store contain products from a given category. This enables store-specific category routing, ensuring that specialized products are handled by stores with the appropriate capabilities.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `TryReallocateByStoreCategoryId` |
| **Group** | Reallocate |
| **Applicable Statuses** | New |

## Configuration Properties

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `categoryId` | string | Yes | The store product category ID to match |

## Behavior

### What It Does

1.  Validates that `categoryId` is configured
2.  Checks if the order contains products from the specified category
3.  Checks if the store is configured to handle that category
4.  Reallocates to an appropriate store if the current one cannot handle the category

### Prerequisites

*   `categoryId` property must be configured
*   Stores must have category handling capabilities defined
*   Products must have category assignments

### Side Effects

*   May change warehouse/store assignment
*   Considers store capabilities in the routing decision

## Business Cases

### When to Use

*   **Store specialization**: Route specialized products to stores that can handle them
*   **Service requirements**: Route items requiring assembly or installation to capable stores
*   **Certification requirements**: Route products requiring certified handlers to qualifying stores

### Example Scenarios

**Scenario 1: Appliance Installation** Configure `categoryId = "large-appliances"` to route orders with appliances to stores that offer installation services.

**Scenario 2: Pharmacy Items** Configure `categoryId = "pharmacy"` to route pharmaceutical orders only to stores with licensed pharmacists.

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| Missing `categoryId` | Error | Depends on StopOnError |
| Order reallocated | Success | Yes |
| No reallocation needed | Success | Yes |
| Exception | Error | Depends on StopOnError |

## Related Steps

*   [Try Reallocate by Category ID](try-reallocate-by-category-id.md) - Route based on product category only
*   [Try Reallocate Entire Order](try-reallocate-entire-order.md) - Route without category consideration
