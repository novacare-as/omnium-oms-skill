# Allocate to Warehouse

Source: https://docs.omnium.no/docs/Order/workflow-steps/allocation/allocate-to-warehouse

> Assign all order shipments to a specific warehouse using a configured warehouse code.

## Overview

The **Allocate to Warehouse** step assigns all shipments in an order to a specific warehouse defined in the workflow step configuration. This is useful when you want to force orders to be fulfilled from a particular location regardless of inventory distribution.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `AllocateToWarehouse` |
| **Group** | Reallocate |
| **Applicable Statuses** | New |

## Configuration Properties

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `WarehouseCode` | string | Yes | The warehouse code to assign to all shipments |
| `SkipForManualOrder` | boolean | No | Skip this step for orders created manually (orders with a CartId) |
| `SkipForShipment` | string | No | Comma-separated list of shipping method names to skip |

## Behavior

### What It Does

1.  Checks if the step is available for the order's market
2.  Checks if the shipping method should be skipped (via `SkipForShipment`)
3.  Checks if manual orders should be skipped (via `SkipForManualOrder`)
4.  Retrieves the target warehouse code from configuration
5.  Assigns the configured warehouse to all shipments in the order

### Prerequisites

*   Order must have at least one shipment
*   The `WarehouseCode` property must be configured

### Side Effects

*   Updates `WarehouseCode` on all shipments in the order
*   Does not validate inventory availability at the target warehouse

## Business Cases

### When to Use

*   **Centralized fulfillment**: Route all orders to a central distribution center
*   **Market-specific warehouses**: Use market restrictions to route orders from specific markets to designated warehouses
*   **Special handling**: Route certain shipping methods to specific facilities

### Example Scenarios

**Scenario 1: Central Warehouse** Configure with `WarehouseCode = "CENTRAL"` to route all standard orders to your central warehouse.

**Scenario 2: Store Pickup Exception** Configure with `SkipForShipment = "ClickAndCollect,StorePickup"` to allow store pickup orders to retain their store assignment while routing other orders centrally.

**Scenario 3: Skip Manual Orders** Configure with `SkipForManualOrder = true` when store staff manually create orders that should ship from their location rather than being reallocated.

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| Market not available | Warning | Yes |
| Shipping method in skip list | Success (skipped) | Yes |
| Manual order with skip enabled | Success (skipped) | Yes |
| Missing `WarehouseCode` property | Error | Depends on StopOnError |
| No shipments on order | No action taken | Yes |

## Related Steps

*   [Set Warehouse Based on Zip](set-warehouse-based-on-zip.md) - Assigns warehouse based on delivery location
*   [Try Reallocate Entire Order to Specific Warehouse](try-reallocate-entire-order-to-specific-warehouse.md) - Similar but checks inventory availability first
