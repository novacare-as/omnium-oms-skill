# Try Allocate Order to Current Warehouses

Source: https://docs.omnium.no/docs/Order/workflow-steps/allocation/try-allocate-order-to-current-warehouses

> Lock shipments to their current warehouses if those warehouses have all required items in stock.

## Overview

The **Try Allocate Order to Current Warehouses** step validates that the currently assigned warehouses can fulfill their respective shipments. If a warehouse has all required items in stock, the shipment is locked to that warehouse. This is useful when orders arrive with pre-assigned warehouses that need validation.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `TryAllocateOrderToCurrentWarehouses` |
| **Group** | Reallocate |
| **Applicable Statuses** | New |

## Configuration Properties

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `storeRoles` | string | No | Filter warehouses by role |

## Behavior

### What It Does

1.  Iterates through all shipments in the order
2.  For each shipment, determines the target warehouse (uses `VirtualWarehouseCode` if set, otherwise `WarehouseCode`)
3.  Validates that the target warehouse has all required items in stock
4.  If successful, marks the shipment as `IsReallocated = true`
5.  Tracks complete success, partial success, or failure across all shipments

### Prerequisites

*   Order must have shipments with warehouse assignments
*   Warehouses must be configured in the system

### Side Effects

*   Sets `IsReallocated = true` on successfully validated shipments
*   Does not change warehouse assignments (validates current assignment)

## Business Cases

### When to Use

*   **Pre-allocated orders**: Validate orders that arrive with warehouse assignments from external systems
*   **Click-and-collect**: Confirm the selected store has items in stock
*   **Marketplace orders**: Validate seller-assigned warehouses before processing

### Example Scenarios

**Scenario 1: Complete Success** All 3 shipments validate successfully - each warehouse has the required items. All marked as reallocated.

**Scenario 2: Partial Success** 2 of 3 shipments validate, 1 warehouse is out of stock. The 2 successful shipments are locked.

**Scenario 3: Virtual Warehouse** A shipment has `VirtualWarehouseCode = "DROPSHIP"` set - the validation checks the dropship supplier's inventory.

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| All shipments allocated | Success | Yes |
| Some shipments allocated | Success (partial) | Yes |
| No shipments allocated | Error | Depends on StopOnError |
| Exception during allocation | Error | Depends on StopOnError |

## Related Steps

*   [Try Reallocate Entire Order](try-reallocate-entire-order.md) - Finds a new warehouse if current one is insufficient
*   [Try Reallocate to Other Warehouse](try-reallocate-to-other-warehouse.md) - Reallocates out-of-stock items
