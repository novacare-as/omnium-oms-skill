# Set Pickup Warehouse Code

Source: https://docs.omnium.no/docs/Order/workflow-steps/shipments/set-pickup-warehouse-code

> Set the pickup warehouse code on shipments for click-and-collect orders.

## Overview

The **Set Pickup Warehouse Code** step sets the pickup warehouse code on shipments. This is used for click-and-collect scenarios where items need to be transferred to a pickup location.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `SetPickupWarehouseCode` |
| **Group** | Shipments |
| **Applicable Statuses** | Completed, ReadyForPickup, Sent, Ship |

## Configuration Properties

| Property | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `pickupWarehouseCode` | String | No | \- | The warehouse code for pickup location |

## Behavior

### What It Does

1.  Gets the `pickupWarehouseCode` from configuration
2.  If running at shipment level, skips (returns empty list)
3.  If running at order level, processes all shipments
4.  Sets `PickUpWarehouseCode` on each shipment

### Prerequisites

*   Order must have shipments

### Side Effects

*   Shipment `PickUpWarehouseCode` property set
*   Enables tracking of pickup destination

## Business Cases

### When to Use

*   **Click-and-collect**: Set store as pickup location
*   **Store transfer**: Track destination for inter-store transfer
*   **Reset pickup**: Clear pickup warehouse by setting blank

### Example Scenarios

**Scenario 1: Set Pickup Store** Customer ordered for store pickup. Configure `pickupWarehouseCode=STORE-123`. Shipment marked for that store.

**Scenario 2: Clear Pickup Code** After pickup completed, clear the code by leaving property empty.

**Scenario 3: No Shipments** Order has no shipments yet. Step returns warning.

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| No shipments | Warning | Yes |
| Code set successfully | Success | Yes |
| Exception | Error | No (cancels workflow) |

## Related Steps

*   [Set Shipment or Order Ready for Pickup](../inventory/set-shipment-or-order-ready-for-pickup.md) - Complete pickup preparation
*   [Complete Shipment](complete-shipment.md) - Finalize shipment
