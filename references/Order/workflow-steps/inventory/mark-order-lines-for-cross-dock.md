# Mark Order Lines for Cross Dock

Source: https://docs.omnium.no/docs/Order/workflow-steps/inventory/mark-order-lines-for-cross-dock

> Configure cross-docking and same-delivery consolidation for multi-warehouse orders.

## Overview

The **Mark Order Lines for Cross Dock** step handles complex cross-docking scenarios where orders need items from multiple warehouses consolidated for same-delivery shipping. This is a customer-specific step with specialized logic for warehouse routing.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `MarkOrderLinesForCrossStock` |
| **Group** | Shipments |
| **Applicable Statuses** | New |
| **Hidden** | Yes |

## Configuration Properties

| Property | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `warehousesForSameDelivery` | String | Yes | \- | Comma-separated warehouse codes eligible for consolidation (e.g., "DC01,FS") |

## Behavior

### What It Does

1.  Validates shipments exist and `warehousesForSameDelivery` is configured
2.  Checks for signed books (skips if found)
3.  Checks for specific publication status requirements
4.  Analyzes inventory across configured warehouses (e.g., DC01 and FS)
5.  For items available in multiple warehouses, prefers DC01 if sufficient inventory
6.  Sets properties on order lines:
    *   `SameDelivery` = "true" for consolidated items
    *   `SapLineCode` = "ZLTN" for DC01 items, "ZMTB" for FS items
7.  Creates separate shipments for different warehouses
8.  Handles special cases for Mammut items and Retthjem orders

### Prerequisites

*   `warehousesForSameDelivery` must be configured
*   Inventory data available for configured warehouses
*   Specific product properties for publication status

### Side Effects

*   Order lines tagged with `SameDelivery` and `SapLineCode` properties
*   May create new shipments for warehouse splits
*   Updates order in repository
*   Assigns warehouse codes to shipments

## Business Cases

### When to Use

*   **Multi-warehouse fulfillment**: Consolidate from multiple sources
*   **Same-delivery routing**: Ensure items ship together
*   **Cross-dock operations**: Route items through consolidation point
*   **Warehouse preference**: Prefer primary warehouse when available

### Example Scenarios

**Scenario 1: DC01 and FS Split** Order has items in both DC01 and FS warehouses. Step creates separate shipments, tags items appropriately for same-delivery consolidation.

**Scenario 2: DC01 Preference** Item available in both warehouses with sufficient DC01 stock. Step routes to DC01 as preferred.

**Scenario 3: Retthjem Order** Order without warehouse assignment. Step analyzes inventory and creates appropriate shipment splits based on availability.

**Scenario 4: Signed Books** Order contains signed books. Step skips processing as signed items have special handling requirements.

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| No shipments | Success with message | Yes |
| warehousesForSameDelivery missing | Error | No |
| Property empty | Error | No |
| Processing successful | Success | Yes |
| Exception | Error | No |

## Related Steps

*   [Allocate to Warehouse](../allocation/allocate-to-warehouse.md) - Standard allocation
*   [Try Split Order to Warehouse](../allocation/try-split-order-to-warehouse.md) - Splits orders across warehouses
