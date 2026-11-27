# Try Reallocate Entire Order to Specific Warehouse

Source: https://docs.omnium.no/docs/Order/workflow-steps/allocation/try-reallocate-entire-order-to-specific-warehouse

> Attempt to move an entire order to a specific warehouse if it has all items in stock.

## Overview

The **Try Reallocate Entire Order to Specific Warehouse** step attempts to reallocate an entire order to a named warehouse, but only if that warehouse has all required items in stock. Unlike the generic reallocation, this targets a specific warehouse.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `TryReallocateEntireOrderToSpecificWarehouse` |
| **Group** | Reallocate |
| **Applicable Statuses** | New |

## Configuration Properties

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `warehouseCode` | string | Yes | The target warehouse code |
| `storeRoles` | string | No | Filter by store role |

## Behavior

### What It Does

1.  Validates this is running at order level (not shipment level)
2.  Retrieves the target `warehouseCode` from configuration
3.  Checks if the specified warehouse has all items in stock
4.  If available, reallocates all shipments to that warehouse

### Prerequisites

*   Must run at order level (shipment parameter must be null)
*   `warehouseCode` property must be configured
*   Target warehouse must have all order items in stock

### Side Effects

*   Changes warehouse assignment on all shipments if successful
*   Keeps the order whole (no splitting)
*   Does nothing if inventory is insufficient

## Business Cases

### When to Use

*   **Preferred warehouse**: Try to fulfill from a specific location before falling back to others
*   **Promotion routing**: Route orders to a warehouse running a special promotion
*   **Capacity balancing**: Redirect orders to underutilized warehouses

### Example Scenarios

**Scenario 1: New Warehouse Ramp-Up** Configure `warehouseCode = "NEW-DC"` to attempt routing orders to a new distribution center that needs order volume.

**Scenario 2: Priority Fulfillment** Configure `warehouseCode = "FAST-SHIP"` to try routing to a warehouse with faster shipping before using others.

**Scenario 3: Inventory Check** Use this before splitting steps - if the preferred warehouse has everything, use it; otherwise proceed to splitting logic.

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| Running at shipment level | Error | Depends on StopOnError |
| Missing `warehouseCode` | Error | Depends on StopOnError |
| Order reallocated | Success | Yes |
| Warehouse lacks inventory | Success (no change) | Yes |
| Exception | Error | Depends on StopOnError |

## Related Steps

*   [Try Reallocate Entire Order](try-reallocate-entire-order.md) - Searches all warehouses, not specific
*   [Allocate to Warehouse](allocate-to-warehouse.md) - Forces warehouse without inventory check
*   [Try Split Order to Warehouse](try-split-order-to-warehouse.md) - Splits available items to the warehouse
