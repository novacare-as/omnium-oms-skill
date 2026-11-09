# Recalculate Reserved Inventory

Source: https://docs.omnium.no/docs/Order/workflow-steps/inventory/recalculate-reserved-inventory

> Recalculate reserved inventory counts for products in the order.

## Overview

The **Recalculate Reserved Inventory** step triggers a full recalculation of reserved inventory for all SKUs in the order. This ensures reserved inventory counts are accurate by recalculating from all open orders.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `RecalculateReservedInventory` |
| **Group** | Shipments |

## Configuration Properties

This step has no configurable properties.

## Recommended Settings

Set `RunAfterOrderIsSaved` to `true`. This step fetches orders directly from the database rather than using the order passed by the workflow engine, so it must run after the order is persisted to see the latest state.

## Behavior

### What It Does

1.  Checks if all order lines are virtual products (skips if so)
2.  Collects SKU codes from all non-virtual product line items
3.  Recalculates reserved inventory quantities for the SKU list by checking all open orders
4.  The service recalculates reserved quantities by checking all orders in statuses that are not delivered, canceled, or excluded from reserved inventory

**Order type config required:** Recalculation determines which orders to skip by reading the order type config. Only orders in statuses marked with `IsDeliveredStatus: true`, `IsCanceledStatus: true`, or `IsExcludedFromReservedInventory: true` are excluded. If an order has a status that does not appear in its order type config at all, it will be counted as having reserved inventory — even if the status name semantically implies completion. See the [order status model](../../order-config.md#order-status-model).

### Prerequisites

*   Order must have non-virtual product line items
*   Inventory service must be configured

### Side Effects

*   Reserved inventory counts are recalculated from order data
*   May adjust reserved counts up or down based on actual orders
*   Affects all warehouses where the SKUs exist

## Business Cases

### When to Use

*   **Inventory correction**: When reserved counts have drifted from reality
*   **After bulk operations**: Following imports or bulk updates
*   **Order modifications**: After significant changes to order quantities
*   **System recovery**: After data issues or migrations

### Example Scenarios

**Scenario 1: Data Correction** Reserved inventory counts are incorrect due to a previous bug. Running this step recalculates correct values from current order data.

**Scenario 2: Return Processing** Order is returned. Step recalculates reserved inventory to reflect the changed order state.

**Scenario 3: Order Completion** Order marked complete. Step recalculates to ensure reserved counts exclude this now-completed order.

**Scenario 4: All Virtual Products** Order contains only digital/virtual products. Step returns success immediately without processing.

**Scenario 5: Order Handed Over to the ERP** The ERP reserves the items itself and sends inventory with that reservation already deducted. The order moves to a status with `IsExcludedFromReservedInventory: true`. Running this step on that status releases the order's reservation in Omnium, so the items are not reserved twice. Run it also on the statuses the order can move to from there, so the reservation is restored if the order returns to a status that reserves inventory.

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| All virtual products | Success (no action) | Yes |
| No order lines | Warning | Yes |
| Recalculation successful | Success | Yes |

## Related Steps

*   [Increase Reserved Inventory](increase-reserved-inventory.md) - Incremental reservation
*   [Reduce Reserved Inventory](reduce-reserved-inventory.md) - Incremental release
