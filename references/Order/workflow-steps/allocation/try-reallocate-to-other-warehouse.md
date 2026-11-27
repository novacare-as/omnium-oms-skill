# Try Reallocate to Other Warehouse

Source: https://docs.omnium.no/docs/Order/workflow-steps/allocation/try-reallocate-to-other-warehouse

> Reallocate out-of-stock items to another warehouse with sufficient inventory.

## Overview

The **Try Reallocate to Other Warehouse** step finds alternative warehouses for items that are out of stock at the currently assigned location. Unlike "entire order" reallocation steps, this one can reallocate individual items while keeping in-stock items at the original warehouse.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `TryReallocateToOtherWarehouse` |
| **Group** | Reallocate |
| **Applicable Statuses** | New |

## Configuration Properties

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `storeRoles` | string | No | Filter eligible warehouses by role |
| `includedWarehouseIds` | string | No | Comma-separated list of warehouse IDs to consider for reallocation. Only these warehouses will be used |
| `excludedWarehouseIds` | string | No | Comma-separated list of warehouse IDs to exclude from reallocation |
| `SkipForShipment` | string | No | Comma-separated list of shipment identifiers to skip during reallocation |

## Behavior

### What It Does

1.  Retrieves all available warehouses (or store-specific warehouses if `IsOrderReallocationBasedOnOrderStore` is enabled)
2.  Filters warehouses by `storeRoles` if configured
3.  Filters warehouses by `includedWarehouseIds` and `excludedWarehouseIds` if configured
4.  Skips shipments listed in `SkipForShipment`
5.  Identifies items without sufficient inventory at current warehouse
6.  Finds alternative warehouses with available stock
7.  Reallocates specific items to warehouses with inventory
8.  Can work at order level or shipment level

### Prerequisites

*   Alternative warehouses must have stock for out-of-stock items
*   Warehouses must match any configured role filters

### Side Effects

*   May create new shipments for reallocated items
*   Changes warehouse assignment for specific line items
*   Does not affect items already in stock at current warehouse

## Business Cases

### When to Use

*   **Partial availability**: When some items are in stock locally, others aren't
*   **Network optimization**: Distribute fulfillment across available inventory
*   **Backorder prevention**: Find stock elsewhere rather than backordering

### Example Scenarios

**Scenario 1: Split Fulfillment** Order has 3 items: 2 in stock at Warehouse A, 1 out of stock. The OOS item is reallocated to Warehouse B where it's available.

**Scenario 2: Store Roles** Configure `storeRoles = "fulfillment"` to only consider fulfillment-capable locations, excluding display-only stores.

**Scenario 3: Shipment Level** When running on a specific shipment, only that shipment's items are considered for reallocation.

**Scenario 4: Warehouse Filtering** Configure `includedWarehouseIds = "WH001,WH002"` to only consider specific warehouses, or use `excludedWarehouseIds = "WH003"` to exclude certain warehouses from reallocation (e.g., a warehouse with slow processing times).

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| Successful reallocation | Success | Yes |
| No reallocation needed | Success | Yes |
| Exception | Error | Depends on StopOnError |

## Related Steps

*   [Try Reallocate Entire Order](try-reallocate-entire-order.md) - Keeps order whole, doesn't split
*   [Try Split Unreserved Order Lines](try-split-unreserved-order-lines.md) - More configuration options for splitting
