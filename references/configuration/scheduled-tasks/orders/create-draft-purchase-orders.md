# Create Draft Purchase Orders

Source: https://docs.omnium.no/docs/configuration/scheduled-tasks/orders/create-draft-purchase-orders

> Automatically create and refresh one draft purchase order per supplier from the current reorder suggestions

## Overview

This task maintains one draft purchase order per supplier, built from the current reorder suggestions. Instead of creating purchase orders manually from the reorder suggestion list, purchasers watch the draft order values build up in the purchase order list and place the order with the supplier when the value makes it worthwhile. Each run keeps the drafts in step with the suggestions: quantities follow the current need, newly suggested products are added, and drafts with nothing left to order are removed.

## Identifier

| Property | Value |
| --- | --- |
| **Implementation Type** | `CreateDraftPurchaseOrdersScheduledTask` |
| **Group** | Orders |
| **Type** | Delta |

* * *

## When to Use

Enable this task when you need:

*   Replenishment purchasing driven by reorder suggestions, without creating the purchase orders by hand
*   A standing, up-to-date order proposal per supplier
*   To decide when to order from a supplier based on the accumulated draft value

* * *

## Configuration Properties

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `PurchaseOrderDraftStatus` | string | No | The purchase order status drafts are created with, and the only status the task operates on. The status must exist among the tenant's configured purchase order statuses; the task logs a warning when it does not. Default: `Draft`. |
| `SupplierIds` | string | No | Comma-separated list of supplier ids to limit the task to. Leave empty to include every supplier with reorder suggestions. |
| `WarehouseCodes` | string | No | Comma-separated list of warehouse codes to take suggestions from. Leave empty to include all warehouses. |

* * *

## Behavior

### What It Does

1.  Finds all suppliers that have reorder suggestions, plus suppliers that already have a draft maintained by the task
2.  Creates a draft purchase order for a supplier that has suggestions worth ordering but no draft yet
3.  Rebuilds each existing draft from scratch: the suggestions the draft holds are released, its lines are cleared, and the current suggestions are added again, one line per SKU and warehouse
4.  Deletes a draft when its supplier no longer has anything to order
5.  Links every added suggestion to the draft that carries it, so the same suggestion is not added to a second purchase order

A single run picks up at most 500 suppliers with suggestions. Suppliers that already have a maintained draft are always revisited.

### Ownership and takeover

A draft belongs to the task for as long as it stays in the configured draft status. To take an order over, change its status (for example to `New`) — from that point the task leaves the order alone and its lines and quantities are yours. Moving an order back into the draft status hands it back to the task, and the next run rebuilds it. The task re-reads each draft just before rebuilding it, so a takeover that happens while a run is in progress wins over the task.

The task only maintains drafts it created itself. They carry the purchase order property `MaintainedByScheduledTask`; a purchase order you create manually and leave in the draft status is never touched.

Changes made directly on a draft are overwritten on the next run: quantities are reset to the suggested values, removed lines come back, and adjusted quantities on the linked reorder suggestions are reset. Take the order over by changing its status before editing it.

### Prerequisites

*   Reorder suggestions must be calculated and kept up to date by the reorder suggestion tasks
*   The draft status (default `Draft`) must exist among the tenant's purchase order statuses
*   Products need a supplier, and either a configured minimum quantity or sales history, for a reorder suggestion to be calculated

### Side Effects

*   Creates, updates, and deletes purchase orders in the draft status
*   Links reorder suggestions to the draft that carries them, and releases them when the draft is rebuilt or deleted
*   The task saves drafts without exporting them to connected systems. The order is exported the next time it is saved outside the task, for example when a purchaser changes its status or edits it

* * *

## Example Configuration

```json
{
    "ImplementationType": "CreateDraftPurchaseOrdersScheduledTask",
    "Schedule": "0 6 * * *",
    "IsDisabled": false,
    "Properties": [
        {
            "Key": "PurchaseOrderDraftStatus",
            "Value": "Draft"
        },
        {
            "Key": "SupplierIds",
            "Value": "SUP-100,SUP-200"
        }
    ]
}
```

* * *

## Recommended Schedule

Run once per day outside business hours, after the reorder suggestion tasks have refreshed the suggestions, so the drafts are built from the latest numbers. With the full suggestion recalculation scheduled at 04:00, `0 6 * * *` leaves it room to finish first.

* * *

## Related Tasks

*   [Analytics Reorder Suggestions](../analytics/analytics-reorder-suggestions.md) - Calculate the reorder suggestions the drafts are built from
*   [Analytics Reorder Suggestions Delta](../analytics/analytics-reorder-suggestions-delta.md) - Keep suggestions updated as inventory changes
*   [Supplier Reorder Suggestions](../inventory/supplier-reorder-suggestions.md) - Roll suggestion totals up on the suppliers
*   [Allocate Order to Purchase Order](allocate-order-to-purchase-order.md) - Allocate customer orders to incoming purchase orders
