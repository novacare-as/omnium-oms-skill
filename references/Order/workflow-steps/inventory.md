# Inventory Workflow Steps

Source: https://docs.omnium.no/docs/Order/workflow-steps/inventory

> Workflow steps for managing inventory reservations, reductions, and calculations.

## Overview

Inventory workflow steps manage stock levels throughout the order lifecycle. They handle reservation of inventory when orders are placed, reduction when orders are fulfilled, and recalculation when inventory counts need to be synchronized.

## Available Steps

| Step | Key | Description |
| --- | --- | --- |
| [Increase Reserved Inventory](inventory/increase-reserved-inventory.md) | `IncreaseReservedInventory` | Reserve inventory for new orders |
| [Reduce Reserved Inventory](inventory/reduce-reserved-inventory.md) | `ReduceReservedInventory` | Release reserved inventory on cancellation |
| [Reduce Inventory](inventory/reduce-inventory.md) | `ReduceInventory` | Decrease actual inventory when shipping |
| [Reduce Inventory and Reserved Inventory](inventory/reduce-inventory-and-reserved-inventory.md) | `ReduceInventoryAndReservedInventory` | Decrease both inventory and reserved in one step |
| [Reduce Inventory Only On Reserved Order Lines](inventory/reduce-inventory-only-on-reserved-order-lines.md) | `ReduceInventoryOnlyOnReservedOrderLines` | Conditionally reduce reserved inventory based on line status |
| [Recalculate Reserved Inventory](inventory/recalculate-reserved-inventory.md) | `RecalculateReservedInventory` | Recalculate reserved quantities from open orders |
| [Calculate ATP](inventory/calculate-atp.md) | `CalculateAtp` | Calculate Available-to-Promise values |
| [Calculate and Update Product Inventory](inventory/calculate-and-update-product-inventory.md) | `CalculateAndUpdateProductInventory` | Update product inventory status |
| [Set All Order Lines To Reserved](inventory/set-all-order-lines-to-reserved.md) | `SetAllOrderLinesToReserved` | Force all order lines to reserved status |
| [Set Items Out of Stock](inventory/set-items-out-of-stock.md) | `SetItemsOutOfStock` | Zero out inventory for order products |
| [Change Status If Out of Stock](inventory/change-status-if-out-of-stock.md) | `ChangeStatusIfOutOfStock` | Trigger status change when inventory unavailable |
| [Change Status If Unreserved](inventory/change-status-if-unreserved.md) | `ChangeStatusIfUnreserved` | Split unreserved order lines into a new shipment and change status |
| [Set Shipment or Order Ready for Pickup](inventory/set-shipment-or-order-ready-for-pickup.md) | `SetShipmentOrOrderReadyForPickup` | Prepare click-and-collect orders |
| [Mark Order Lines for Cross Dock](inventory/mark-order-lines-for-cross-dock.md) | `MarkOrderLinesForCrossStock` | Configure cross-docking for multi-warehouse fulfillment |
| [Check POS Order for Return and Increase Inventory](inventory/check-pos-order-for-return-and-increase-inventory.md) | `CheckPosOrderForReturnAndIncreaseInventory` | Restore inventory for POS returns |

## Common Patterns

### New Order Flow

1.  **Increase Reserved Inventory** - Reserve stock when order is placed
2.  Allocation and processing steps
3.  **Reduce Inventory and Reserved Inventory** - When order ships

### Cancellation Flow

1.  **Reduce Reserved Inventory** - Release reserved stock back to available

### Inventory Synchronization

1.  **Recalculate Reserved Inventory** - Rebuild reserved counts from order data
2.  **Calculate ATP** - Update available-to-promise for products
