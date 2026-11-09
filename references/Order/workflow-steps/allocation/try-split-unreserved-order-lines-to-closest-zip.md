# Try Split Unreserved Order Lines to Closest Zip

Source: https://docs.omnium.no/docs/Order/workflow-steps/allocation/try-split-unreserved-order-lines-to-closest-zip

> Split unreserved order lines to the nearest warehouse based on zip code proximity.

## Overview

The **Try Split Unreserved Order Lines to Closest Zip** step handles unreserved order lines by finding the nearest warehouse with available inventory based on zip code proximity. It creates separate shipments as needed and ensures all lines are allocated.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `TrySplitUnreservedOrderLinesToClosestZip` |
| **Group** | Reallocate |
| **Applicable Statuses** | New |

## Configuration Properties

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `storeRoles` | string | No | Filter eligible warehouses by role |

## Behavior

### What It Does

1.  Identifies order lines without inventory reservation at current warehouse
2.  For each unreserved line, finds the closest warehouse by zip code with stock
3.  Creates shipments as needed to route lines to available warehouses
4.  Recalculates order prices after splitting
5.  Validates all shipments have warehouse assignments

### Package Handling

Package and bundle groups are kept whole by default: the group only moves to a warehouse that can supply every component. Set `preventPackageSplit: false` on the package product to allow its components to split across warehouses - components linked with `shipTogetherWithComponentId` are still always allocated to the same warehouse. See [Component Model Reference](../../../Product/product-components/component-model.md).

### Prerequisites

*   Warehouses must have zip code ranges configured
*   Order must have delivery address with zip code
*   At least one warehouse must have stock for each unreserved item

### Side Effects

*   Creates new shipments for reallocated lines
*   Updates line item warehouse assignments
*   Recalculates order prices
*   Adds error to order if any items remain unallocated

## Business Cases

### When to Use

*   **Network-wide fulfillment**: Find stock anywhere in the network, preferring closer locations
*   **Customer experience**: Minimize delivery time by routing to nearest available warehouse
*   **Split order acceptance**: Accept orders even when no single location has everything

### Example Scenarios

**Scenario 1: Distributed Inventory** An order for 3 items: A is at the local warehouse, B is only at a regional DC, C is only at the central warehouse. Each routes to its respective location by proximity.

**Scenario 2: Store Roles Filter** Configure `storeRoles = "warehouse,distribution-center"` to exclude retail stores from consideration.

**Scenario 3: Allocation Failure** If any item cannot be allocated, the step returns a warning and adds an error to the order for operator attention.

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| All items allocated | Success | Yes |
| Some items unallocated | Warning (adds order error) | Yes |
| No items to split | Success | Yes |
| Exception | Error | Depends on StopOnError |

## Related Steps

*   [Try Split Unreserved to Nearest Coordinates](try-split-unreserved-order-lines-to-nearest-coordinates.md) - Uses GPS coordinates instead
*   [Try Split Unreserved Order Lines](try-split-unreserved-order-lines.md) - More configuration options
*   [Reallocate Entire Order Based on Zip Code](reallocate-entire-order-based-on-zip-code.md) - Zip-based but doesn't split
