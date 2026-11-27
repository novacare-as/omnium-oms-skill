# Increase Reserved Inventory

Source: https://docs.omnium.no/docs/Order/workflow-steps/inventory/increase-reserved-inventory

> Reserve inventory for order lines when an order is placed.

## Overview

The **Increase Reserved Inventory** step reserves inventory quantities for all order lines in an order. This ensures stock is held for the order and won't be allocated to other orders while processing.

**Idempotent:** This step is safe to run multiple times on the same order. Each reservation is written with a deterministic transaction reference of the form `Reservation_{orderId}_{shipmentId}_{lineItemId}`. On subsequent runs, the step looks up existing transactions with that reference and only reserves the _delta_ between the line's reservable quantity and what has already been reserved. If the line is already fully reserved, it is skipped.

**Configuration note:** If the tenant setting `IsInventoryReservationTriggeredOnOrderCreation` is enabled, reservations are already created automatically when a cart is converted to an order. Configuring this step on the first order status is still safe — the idempotency guard prevents duplicate reservations — but is generally redundant.

See [Inventory Configuration - Reservation Processing](../../../Inventory/inventory-config.md#reservation-processing) for details.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `IncreaseReservedInventory` |
| **Group** | Inventory |
| **Applicable Statuses** | New, Returned, PartiallyReturned |

## Configuration Properties

| Property | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `DontAllowPartialReservations` | Boolean | No | `false` | When `true`, skips reservation for any line item where available inventory is less than the quantity to reserve. The availability check evaluates both the physical warehouse and the virtual warehouse (if specified) and uses the smaller of the two. Prevents partial holds when full stock is unavailable. |

## Behavior

### What It Does

1.  Identifies all shipments that are not yet completed
2.  Loads all existing inventory transactions for the order so prior reservations can be reconciled
3.  For each shipment, checks if the warehouse is virtual (skips virtual warehouses)
4.  For each non-virtual product line item that is not awaiting purchase order:
    *   Calculates reservable quantity (quantity minus canceled quantity)
    *   Looks up existing transactions for the reservation reference `Reservation_{orderId}_{shipmentId}_{lineItemId}`
    *   If none exist, reserves the full reservable quantity
    *   If prior reservations exist, reserves only the delta (reservable minus already reserved); skips the line if it is already fully reserved
    *   If `DontAllowPartialReservations` is enabled, skips the line when available inventory is below the quantity to reserve
    *   Increases reserved inventory at the specified warehouse and virtual warehouse, tagged with the deterministic transaction reference
5.  Skips shipment-level execution if the order has multiple shipments

### Prerequisites

*   Order must have shipments with line items
*   Warehouse must not be marked as virtual (`IsVirtual` property)
*   Line items must not be virtual products
*   Line items must not be awaiting purchase order

### Side Effects

*   Reserved inventory count increases in the inventory system
*   Stock becomes unavailable for other orders
*   Works with virtual warehouse codes for sub-inventory tracking

## Business Cases

### When to Use

*   **New order processing**: Reserve stock immediately when order is received
*   **Order restoration**: After a return or partial return to re-reserve stock
*   **Manual reservation**: When manually triggering inventory hold

### Example Scenarios

**Scenario 1: Standard Order** New order with 3 items placed. Step reserves inventory for all 3 items in the assigned warehouse.

**Scenario 2: Multi-Shipment Order** Order has 2 shipments (split order). Running at shipment level skips to avoid partial reservation issues.

**Scenario 3: Virtual Warehouse** Order allocated to a virtual/dropship warehouse. Step skips as virtual warehouses don't track reserved inventory.

**Scenario 4: Purchase Order Items** Some items are awaiting a purchase order (backorder). Those items are skipped as they'll be reserved when the PO arrives.

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| No shipments awaiting inventory | Warning | Yes |
| Reservation successful | Success | Yes |
| Line already fully reserved | Success (line skipped) | Yes |
| Virtual warehouse | Success (skipped) | Yes |
| Multi-shipment at shipment level | Success (skipped with message) | Yes |

## Related Steps

*   [Reduce Reserved Inventory](reduce-reserved-inventory.md) - Releases reserved inventory
*   [Reduce Inventory and Reserved Inventory](reduce-inventory-and-reserved-inventory.md) - Reduces both on shipment
