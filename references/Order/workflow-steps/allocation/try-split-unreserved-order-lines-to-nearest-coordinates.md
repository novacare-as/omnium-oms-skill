# Try Split Unreserved Order Lines to Nearest Coordinates

Source: https://docs.omnium.no/docs/Order/workflow-steps/allocation/try-split-unreserved-order-lines-to-nearest-coordinates

> Split unreserved order lines to the nearest warehouse based on geographic coordinates.

## Overview

The **Try Split Unreserved Order Lines to Nearest Coordinates** step handles unreserved order lines by finding the nearest warehouse with available inventory based on geographic coordinates (latitude/longitude). This provides more accurate proximity than zip code-based methods.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `TrySplitUnreservedOrderLinesToNearestCoordinates` |
| **Group** | Reallocate |
| **Applicable Statuses** | New |

## Configuration Properties

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `storeRoles` | string | No | Filter eligible warehouses by role |

## Behavior

### What It Does

1.  Identifies order lines without inventory reservation at current warehouse
2.  Uses delivery address coordinates to calculate distances to warehouses
3.  For each unreserved line, finds the closest warehouse with stock by coordinate distance
4.  Creates shipments as needed and recalculates prices
5.  Validates all shipments have warehouse assignments

### Package Handling

Package and bundle groups are kept whole by default: the group only moves to a warehouse that can supply every component. Set `preventPackageSplit: false` on the package product to allow its components to split across warehouses - components linked with `shipTogetherWithComponentId` are still always allocated to the same warehouse. See [Component Model Reference](../../../Product/product-components/component-model.md).

### Prerequisites

*   Order delivery address must have valid coordinates
*   Warehouses must have coordinates configured
*   At least one warehouse must have stock for each unreserved item

### Side Effects

*   Creates new shipments for reallocated lines
*   Updates line item warehouse assignments
*   Recalculates order prices
*   Adds error to order if any items remain unallocated

## Business Cases

### When to Use

*   **Accurate distance calculation**: When zip codes don't reflect true distances
*   **Dense store networks**: In urban areas with many nearby options
*   **Cross-border routing**: When geographic proximity crosses postal boundaries

### Example Scenarios

**Scenario 1: Urban Delivery** Customer in downtown area has 5 stores within 10km. Coordinate-based routing picks the truly closest one for each item.

**Scenario 2: Border Regions** A customer near a country border might be geographically closer to a warehouse across the border than one in the same postal region.

**Scenario 3: Store Roles** Configure `storeRoles = "fulfillment"` to only route to locations with fulfillment capability.

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| All items allocated | Success | Yes |
| Some items unallocated | Warning (adds order error) | Yes |
| No items to split | Success | Yes |
| Exception | Error | Depends on StopOnError |

## Related Steps

*   [Try Split Unreserved to Closest Zip](try-split-unreserved-order-lines-to-closest-zip.md) - Uses zip codes instead
*   [Try Reallocate on Cancel Using Geo Location](try-reallocate-on-cancel-using-geo-location.md) - Coordinate-based reallocation on cancel
