# Set Shipment or Order Ready for Pickup

Source: https://docs.omnium.no/docs/Order/workflow-steps/inventory/set-shipment-or-order-ready-for-pickup

> Prepare click-and-collect orders by setting warehouse and pickup deadline.

## Overview

The **Set Shipment or Order Ready for Pickup** step prepares click-and-collect orders by setting the customer pickup deadline, updating warehouse assignments, and marking order lines as reserved. It handles the transition when items arrive at the pickup location.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `SetShipmentOrOrderReadyForPickup` |
| **Group** | Inventory |
| **Applicable Statuses** | ReadyForPickup |
| **Hidden** | Yes |

## Configuration Properties

| Property | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `tagFilter` | String | No | \- | Comma-separated tags to filter which orders get special date handling |
| `saleStartDate` | DateTime | No | \- | Override sale start date for deadline calculation |

## Behavior

### What It Does

1.  Calculates customer pickup deadline based on click-and-collect configuration
2.  If no shipments are in Transit or Open status, sets order-level deadline
3.  For shipment-level execution:
    *   Gets pickup warehouse code from shipment
    *   Updates shipment warehouse assignment to the pickup location
    *   Marks affected order lines as reserved
    *   Clears the `PickUpWarehouseCode` after processing
4.  For order-level execution, processes all shipments
5.  Applies tag filter and sale start date for deadline calculation

### Prerequisites

*   Order should be in ReadyForPickup status
*   Click-and-collect service configured for deadline calculation
*   Shipments should have `PickUpWarehouseCode` set if warehouse transfer needed

### Side Effects

*   Sets `CustomerPickupDeadline` on order
*   Updates shipment warehouse assignments
*   Marks order lines `ReservedInventory = true`
*   Sets `ReservedInventoryQuantity` on order lines
*   Clears `PickUpWarehouseCode` after processing

## Business Cases

### When to Use

*   **Click-and-collect**: When items arrive at pickup store
*   **Store transfer**: When items transferred to pickup location
*   **Pickup notification**: Triggers deadline for customer pickup

### Example Scenarios

**Scenario 1: Standard Click-and-Collect** Customer ordered for store pickup. Items arrive at store. Step sets pickup deadline and marks ready.

**Scenario 2: Warehouse Transfer** Items shipped from central warehouse to store. `PickUpWarehouseCode` set to destination store. Step updates warehouse and sets deadline.

**Scenario 3: With Tag Filter** `tagFilter=PRESALE,VIP`. Only orders with these tags use the `saleStartDate` for deadline calculation.

**Scenario 4: Multiple Shipments** Order has multiple shipments at order level. Step processes each shipment that has a pickup warehouse code.

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| No shipments | Success with message | Yes |
| Processing successful | Success | Yes |
| Exception during processing | Error | No |

## Related Steps

*   [Complete Shipment](../shipments/complete-shipment.md) - Final completion step
*   [Increase Reserved Inventory](increase-reserved-inventory.md) - Standard reservation
