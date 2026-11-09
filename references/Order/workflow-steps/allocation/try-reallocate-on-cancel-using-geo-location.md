# Try Reallocate on Cancel Using Geo Location

Source: https://docs.omnium.no/docs/Order/workflow-steps/allocation/try-reallocate-on-cancel-using-geo-location

> Reallocate an order to the nearest warehouse using geographic coordinates when a location cancels.

## Overview

The **Try Reallocate on Cancel Using Geo Location** step handles order reallocation when a fulfillment location cancels, using geographic coordinates (latitude/longitude) to find the nearest alternative warehouse. This provides more accurate proximity calculations than zip code-based methods.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `TryReallocateOnCancelUsingGeoLocation` |
| **Group** | Reallocate |
| **Applicable Statuses** | New |

## Configuration Properties

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `retryLimit` | number | No | Maximum number of reallocation attempts |
| `StoreRoles` | string | No | Filter eligible warehouses by role |
| `PreventPackageSplit` | boolean | No | Keep package and bundle groups whole: the group is only reallocated to a warehouse that can supply every component. A package product's own `preventPackageSplit` setting overrides this default. |

## Behavior

### What It Does

1.  Checks if reallocation should be skipped (`context.SkipReallocation`)
2.  Checks if order is already allocated (`context.OrderIsAllocated`)
3.  Uses coordinate-based distance calculation to find the nearest warehouse with available stock
4.  If successful, logs event and triggers status change back to "New"
5.  Sets `CancelWorkflow = true` to restart order processing

### Package Handling

*   With `PreventPackageSplit` enabled - via the step property or `preventPackageSplit: true` on the package product - a package or bundle group only moves to a warehouse that can supply every component. A warehouse that cannot supply the whole group is skipped.
*   When splitting is allowed, components linked with `shipTogetherWithComponentId` still stay together: linked components are always reallocated to the same warehouse. A linked component that is already reserved on another shipment anchors its partners in place. See [Component Model Reference](../../../Product/product-components/component-model.md).

### Partial Reallocation

When only some lines of a shipment can be reallocated, the reallocated shipment restarts at status "New" while the remaining lines are split into a shipment that keeps its current status, so reallocation is retried for them. When the step runs at order level, only the order status and the reallocated shipments change status - other shipments are not affected.

### Prerequisites

*   Order must have delivery address with valid coordinates
*   Warehouses must have coordinates configured
*   Order must not already be allocated
*   `context.SkipReallocation` must not be set

### Side Effects

*   Changes warehouse assignment
*   Records reallocation event with from/to warehouses
*   Triggers status change to "New" to restart order processing
*   Cancels the current workflow

## Business Cases

### When to Use

*   **Accurate proximity**: When zip code boundaries don't reflect actual distances well
*   **Rural areas**: Where zip codes cover large geographic areas
*   **Cross-border**: When orders near borders might be closer to warehouses in different regions

### Example Scenarios

**Scenario 1: Border Proximity** A customer near the Norwegian-Swedish border has their order cancelled by a Norwegian store. Geo-location routing finds a closer Swedish warehouse.

**Scenario 2: Rural Delivery** In areas with large zip codes, coordinate-based routing finds the truly closest warehouse rather than relying on postal zones.

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| Reallocation skipped | Success | Yes |
| Already allocated | Success | Yes |
| No alternative warehouse | Success (no reallocation) | Yes |
| Successful reallocation | Success (triggers New status) | No (cancels workflow) |

## Related Steps

*   [Try Reallocate on Cancel](try-reallocate-on-cancel.md) - Uses zip code instead of coordinates
*   [Try Split Unreserved to Nearest Coordinates](try-split-unreserved-order-lines-to-nearest-coordinates.md) - Coordinate-based splitting
