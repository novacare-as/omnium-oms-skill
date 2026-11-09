# Set Warehouse Based on Zip

Source: https://docs.omnium.no/docs/Order/workflow-steps/allocation/set-warehouse-based-on-zip

> Assign the default warehouse based on the delivery address zip code.

## Overview

The **Set Warehouse Based on Zip** step assigns warehouses to shipments based on the delivery zip code. It uses warehouse zip code range configurations to determine which warehouse should fulfill orders for each geographic area.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `SetWarehouseBasedOnZip` |
| **Group** | Reallocate |
| **Applicable Statuses** | New |

## Configuration Properties

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `ignoreZipCodeRange` | boolean | No | If true, ignores warehouse zip code range restrictions |
| `storeRoles` | string | No | Filter eligible warehouses by role |

## Behavior

### What It Does

1.  Validates that the order has shipments
2.  Looks up the delivery address zip code using configuration options
3.  Finds the warehouse configured to serve that zip code range
4.  Sets the warehouse on applicable shipments

### Prerequisites

*   Order must have shipments
*   Warehouses must have zip code ranges configured
*   Order must have a valid delivery address with zip code

### Side Effects

*   Updates `WarehouseCode` on shipments
*   Does not check inventory availability (use reallocation steps for that)

## Business Cases

### When to Use

*   **Regional fulfillment**: Route orders to regional warehouses based on delivery location
*   **Initial allocation**: Set the starting warehouse for new orders
*   **Simple distribution**: When you have clear geographic warehouse territories

### Example Scenarios

**Scenario 1: Regional Warehouses** Warehouse "EAST" serves zip codes 00000-49999, "WEST" serves 50000-99999. Orders are routed accordingly.

**Scenario 2: Store Roles** Configure `storeRoles = "fulfillment"` to only consider warehouses with fulfillment capability, excluding retail-only stores.

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| No shipments | Warning | Yes |
| Warehouse changed | Success | Yes |
| No change needed | Success | Yes |
| Exception | Error (logged) | Depends on StopOnError |

## Related Steps

*   [Allocate to Warehouse](allocate-to-warehouse.md) - Forces a specific warehouse regardless of zip
*   [Reallocate Entire Order Based on Zip Code](reallocate-entire-order-based-on-zip-code.md) - Zip-based with inventory validation
