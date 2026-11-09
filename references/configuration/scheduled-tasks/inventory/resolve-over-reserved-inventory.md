# Resolve Over-Reserved Inventory

Source: https://docs.omnium.no/docs/configuration/scheduled-tasks/inventory/resolve-over-reserved-inventory

> Automatically detect and remove inventory reservations that exceed available stock using FIFO order priority

## Overview

This task detects situations where the total reserved inventory across orders exceeds the actual available stock for a given SKU and warehouse. When over-reservation is found, it removes reservations from the newest orders first (FIFO), ensuring that older orders retain their reservations and are fulfilled first.

## Identifier

| Property | Value |
| --- | --- |
| **Implementation Type** | `ResolveOverReservedInventoryScheduledTask` |
| **Group** | Inventory |
| **Type** | Delta |

* * *

## When to Use

Enable this task when you:

*   Have situations where inventory goes negative (e.g. an item is received, reserved, then found damaged or written off)
*   Want automatic correction of over-reservation without manual intervention
*   Need to ensure oldest orders are prioritized when inventory becomes insufficient (FIFO)
*   Experience stale inventory reservation counters that don't reflect the actual state of order lines

* * *

## Configuration Properties

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `EnablePurchaseOrderReduction` | bool | `false` | When `true`, the task cancels over-reserved lines on internal transfers (POs with a source warehouse). When `false`, POs still participate in FIFO priority but their lines are not modified. See task results for changed or skipped POs. |
| `EnableCreatePurchaseOrder` | bool | `false` | When `true`, sets `CreatePurchaseOrder = true` on each order line that loses its reservation. This makes it possible for `AllocateOrderToPurchaseOrderScheduledTask` to fulfill those lines via a purchase orders. |

* * *

## Behavior

### What It Does

1.  Recalculates actual reserved quantities by summing `ReservedInventoryQuantity` from order lines on orders that are not delivered, cancelled, or in a status excluded from reserved inventory — this avoids acting on stale data
2.  Identifies inventory items where actual reserved quantity exceeds available stock (i.e. `reservedQuantity > inventory`)
3.  Builds a deficit map: how many units need to be freed per SKU and warehouse
4.  Scans all non-delivered, non-cancelled orders with reserved inventory, sorted newest first. Orders in a status with `IsExcludedFromReservedInventory: true` in the order type config are skipped, because they are not counted in reserved inventory
5.  For each order line contributing to an over-reservation, reduces `ReservedInventoryQuantity` by the deficit amount and sets `ReservedInventory = false`
6.  Stops removing reservations for a SKU once the deficit is covered
7.  Saves updated orders in batches and reduces the inventory reservation counters accordingly

### FIFO Priority

Orders are processed from newest to oldest. This means the most recently created orders lose their reservation first, while older orders retain theirs. This ensures that customers who ordered earliest are not disadvantaged by later stock shortages.

### Stale Counter Protection

The task does not rely on the raw `ReservedInventory` counter on inventory items, which can become stale (e.g. an order line has `ReservedInventoryQuantity = 0` but the inventory item still shows `ReservedInventory = 1`). Instead, it recalculates the actual reserved quantity from order lines before determining whether over-reservation exists.

### Internal Transfer Purchase Orders

Internal transfer purchase orders whose status has `ReservesSourceWarehouseInventory` set to `true` are included in the FIFO calculation. Their reserved quantity counts toward the deficit, and they are interleaved with orders by creation date — the newest item always loses its reservation first, whether that is an order or a PO.

When `EnablePurchaseOrderReduction` is `false` (the default), POs consume their share of the deficit in FIFO order to protect older orders from being incorrectly de-reserved, but their lines are not modified. The task result lists these as skipped.

When `EnablePurchaseOrderReduction` is `true`, the task also cancels the remaining undelivered quantity on affected PO lines. In the future we might add ReservedInventoryQuantity on PO lines to have the same reservation functionality as for regular orders.

### Virtual Stock Locations

When a shipment uses a Virtual Stock Location (VSL), deficits on the VSL and the physical warehouse are tracked independently. If only the VSL is over-reserved, the newest orders lose their VSL reservation even if the physical warehouse still has sufficient stock.

### Prerequisites

*   Inventory management must be enabled with write access (`InventoryManagement.IsEnabled = true` and `InventoryManagement.IsWriteEnabled = true`). Without write access, the task finds no over-reserved inventory
*   Orders must use warehouse-based inventory reservations

### Side Effects

*   Reduces `ReservedInventoryQuantity` on affected order lines by the deficit amount and sets `ReservedInventory = false` (both on the order form and shipment level)
*   Reduces the `ReservedInventory` counter on the corresponding inventory items
*   Does not change order status or trigger workflow steps

* * *

## Example Configuration

```json
{
    "ImplementationType": "ResolveOverReservedInventoryScheduledTask",
    "Schedule": "*/15 * * * *",
    "IsDisabled": false,
    "Properties": [
        { "Key": "EnablePurchaseOrderReduction", "Value": "false" }
    ]
}
```

* * *

## Recommended Schedule

Start with 15 minutes intervals (`*/15 * * * *`) and adjust if needed.

* * *

## Related Tasks

*   [Overallocated Inventory](overallocated-inventory.md) - Corrects overallocation in Virtual Stock Location scenarios
*   [Try Reserve Order Lines](../orders/try-reserve-order-lines.md) — Re-reserves order lines when inventory becomes available again (the complementary task)
