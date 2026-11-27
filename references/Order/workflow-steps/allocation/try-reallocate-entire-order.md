# Try Reallocate Entire Order

Source: https://docs.omnium.no/docs/Order/workflow-steps/allocation/try-reallocate-entire-order

> Attempt to move an entire order to any warehouse that has all items in stock.

## Overview

The **Try Reallocate Entire Order** step searches for a warehouse that can fulfill the entire order without splitting. If found, all shipments are reallocated to that warehouse. This is useful when you want to avoid split shipments while still finding available inventory.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `TryReallocateEntireOrder` |
| **Group** | Reallocate |
| **Applicable Statuses** | New |

## Configuration Properties

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `storeRoles` | string | No | Filter eligible warehouses by role |

## Behavior

### What It Does

1.  Checks if running at order level (not shipment level)
2.  Parses `storeRoles` filter if configured
3.  Searches all eligible warehouses for one with complete inventory
4.  If found, reallocates all shipments to that warehouse

### Prerequisites

*   Must run at order level (shipment parameter must be null)
*   At least one warehouse must have all order items in stock

### Side Effects

*   Changes warehouse assignment on all shipments
*   Keeps the order whole (no splitting)

## Business Cases

### When to Use

*   **Avoid split shipments**: When customer experience or cost considerations favor single-warehouse fulfillment
*   **Order consolidation**: Prefer sending from one location even if it's not the closest
*   **Inventory optimization**: Balance inventory across warehouses by routing entire orders

### Example Scenarios

**Scenario 1: Single Shipment Preference** Current warehouse is out of one item. Instead of splitting, find another warehouse with everything in stock.

**Scenario 2: Store Role Filter** Configure `storeRoles = "distribution-center"` to only consider DCs, not retail stores, for full-order fulfillment.

**Scenario 3: Shipment-Level Skip** When a shipment is provided (shipment-level workflow), this step returns success without action since it cannot reallocate partial orders.

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| Running at shipment level | Success (not applicable) | Yes |
| Order reallocated | Success | Yes |
| No suitable warehouse found | Success (no change) | Yes |
| Exception | Error | Depends on StopOnError |

## Related Steps

*   [Try Reallocate Entire Order to Specific Warehouse](try-reallocate-entire-order-to-specific-warehouse.md) - Same but to a named warehouse
*   [Reallocate Entire Order Based on Zip Code](reallocate-entire-order-based-on-zip-code.md) - Prioritizes warehouses by delivery proximity
*   [Try Reallocate to Other Warehouse](try-reallocate-to-other-warehouse.md) - Allows splitting
