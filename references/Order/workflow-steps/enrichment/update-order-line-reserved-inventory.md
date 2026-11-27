# Update Order Line Reserved Inventory

Source: https://docs.omnium.no/docs/Order/workflow-steps/enrichment/update-order-line-reserved-inventory

> Set reserved inventory status on order lines based on inventory check, with optional property-based forced reservation.

## Overview

The **Update Order Line Reserved Inventory** step updates the reserved inventory flags on order lines based on actual inventory availability. This ensures line item reservation status is accurate.

Order lines can also be reserved regardless of stock by matching them on custom properties — see [Forced reservation by property](update-order-line-reserved-inventory.md#forced-reservation-by-property).

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `UpdateOrderLineReservedInventory` |
| **Group** | Inventory |
| **Applicable Statuses** | New |

## Configuration Properties

| Property | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `IgnoreOrdersToBePurchased` | Boolean | No | `false` | Skip lines awaiting purchase orders |
| `DontAllowPartialReservations` | Boolean | No | `false` | When `true`, skips reservation for any line item where available inventory is less than the quantity to reserve. Prevents partial holds when full stock is unavailable. |
| `ForceReserveOrderLineProperties` | JSON | No | (none) | Key/value list. Lines matching **any** listed property are marked as fully reserved regardless of available inventory. |

### Forced reservation by property

`ForceReserveOrderLineProperties` takes a JSON array of key/value pairs, the same format used by the order line filters on [Try Split Unreserved Order Lines](../allocation/try-split-unreserved-order-lines.md):

```json
[
  { "Key": "PreOrder", "Value": "true" },
  { "Key": "BackOrder", "Value": "true" }
]
```

Matching rules:

*   **Any match is enough.** A line is force-reserved if it matches _at least one_ of the listed pairs, not all of them. Listing several pairs widens the selection.
*   **Both key and value must match.** Comparison is case-insensitive on both. A line carrying `PreOrder = false` does not match `{"Key": "PreOrder", "Value": "true"}`.
*   **An empty `Value` means "property present with an empty value"** — it does not match any value. To target a property regardless of its value, list each expected value as its own pair.

A force-reserved line gets `ReservedInventory = true` and its remaining unreserved quantity (`Quantity - ReservedInventoryQuantity - CanceledQuantity`) added to `ReservedInventoryQuantity`. Lines that do not match are reserved against real inventory exactly as before.

Forced reservation bypasses the inventory check entirely and does not consume available stock. A force-reserved line does not reduce the availability seen by other lines in the same run, so the same physical unit can also be reserved by a normal line. Use it for items that are intentionally not stock-backed, such as pre-orders or made-to-order products.

Forced reservation applies only to lines the step already handles. Lines reserved against a purchase order, package lines, package products and bundle lines are excluded, and `IgnoreOrdersToBePurchased` is evaluated first — a skipped purchase-order line stays skipped even if it matches. Bundle lines continue to derive their reserved status from their components, so a bundle becomes reserved when all of its components are.

## Behavior

### What It Does

1.  Checks inventory availability for each line item
2.  Marks lines matching `ForceReserveOrderLineProperties` as fully reserved without checking inventory
3.  Sets `ReservedInventory` and `ReservedInventoryQuantity` on lines
4.  Can run at shipment level to process specific shipment's lines
5.  Returns result invisibly (doesn't show in workflow history)

### Prerequisites

*   Order must have line items
*   Inventory data must be available, unless `ForceReserveOrderLineProperties` is configured and at least one line matches

### Side Effects

*   Line item `ReservedInventory` flag set
*   Line item `ReservedInventoryQuantity` set
*   Force-reserved lines are marked reserved without any inventory being held
*   Affects downstream fulfillment logic

## Business Cases

### When to Use

*   **Allocation verification**: Verify reservation status
*   **Order modification**: Update after changes
*   **Re-check inventory**: Refresh reservation data
*   **Non-stocked items**: Let pre-order, made-to-order or drop-ship lines proceed without stock

### Example Scenarios

**Scenario 1: Standard Update** Order allocated to warehouse. Step verifies and updates each line's reservation status.

**Scenario 2: Ignore Purchase Orders** Configure `IgnoreOrdersToBePurchased=true`. Lines awaiting PO are skipped.

**Scenario 3: Shipment Level** Running for specific shipment. Only that shipment's lines are updated.

**Scenario 4: Pre-orders Without Stock** Configure `ForceReserveOrderLineProperties = [{"Key": "PreOrder", "Value": "true"}]`. Lines flagged as pre-orders are reserved even though the warehouse has no stock, so the order continues through fulfillment instead of stalling. All other lines still require real inventory.

**Scenario 5: Several Non-stocked Categories** Configure `ForceReserveOrderLineProperties = [{"Key": "PreOrder", "Value": "true"}, {"Key": "MadeToOrder", "Value": "true"}]`. A line carrying either property is force-reserved.

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| Update successful | Success (invisible) | Yes |
| No inventory data | Success (invisible, marks unreserved) | Yes |
| No inventory data, lines matching `ForceReserveOrderLineProperties` | Success (invisible, matching lines marked reserved) | Yes |
| `ForceReserveOrderLineProperties` is not valid JSON | Error logged, step continues using inventory only | Yes |

## Related Steps

*   [Increase Reserved Inventory](../inventory/increase-reserved-inventory.md) - Reserve inventory
*   [Set All Order Lines To Reserved](../inventory/set-all-order-lines-to-reserved.md) - Force reservation on every line, with no inventory check and no property filter
*   [Try Split Unreserved Order Lines](../allocation/try-split-unreserved-order-lines.md) - Uses the same order line property filter format
