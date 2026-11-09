# Cost Price List Date Validator

Source: https://docs.omnium.no/docs/PurchaseOrders/validation/purchase-order-validators/cost-price-list-date-validator

> Blocks a purchase order when its requested delivery date falls outside the validity period of the cost price list used for the order.

## Overview

The **Cost Price List Date Validator** makes sure that the requested delivery date of a purchase order falls inside the validity period of the cost price list the order is priced from. Cost price lists are often agreed with a supplier for a limited season or campaign period; ordering for delivery outside that period means the agreed cost prices no longer apply.

Unlike the amount validators, this validator produces a blocking **error** — the validation result fails, and the error is attached to the purchase order.

## Identifier

| Property | Value |
| --- | --- |
| **Connector ID** | `costPriceListDateValidator` |
| **Validation Type** | Date |
| **Validation Scope** | Order |

## Behavior

1.  Skips validation when the purchase order has no `CostPriceListId`, or when the referenced price list no longer exists. Any existing error from a previous run is removed
2.  Determines which validity period applies:
    *   **Store cost price period** (`StoreCostPriceValidFrom` / `StoreCostPriceValidTo`) when the price list has store cost prices enabled and the order's market or the store's store group is covered by the list's store cost price scope
    *   **Standard cost price period** (`CostPriceValidFrom` / `CostPriceValidTo`) in all other cases
3.  Skips validation when neither a from-date nor a to-date is set on the applicable period. Any existing error is removed
4.  Compares the purchase order's `RequestedDeliveryDate` against the period. An open-ended period is allowed: only the date that is set is enforced
5.  Adds a blocking **error** to the purchase order when the requested delivery date is outside the period, or when no requested delivery date is set at all
6.  Removes the error when the date is inside the period

Purchase orders frequently have no market of their own. When that is the case, the market used to decide whether the store cost price period applies is resolved from the order's store, preferring a market the price list actually scopes store cost prices to.

## Error messages

| Condition | Severity | Error Key | Translation Key |
| --- | --- | --- | --- |
| Requested delivery date is outside the validity period | Error | `RequestedDeliveryDateOutsideCostPriceList` | `RequestedDeliveryDateOutsideCostPriceListMessage` |
| Requested delivery date is missing | Error | `RequestedDeliveryDateOutsideCostPriceList` | `RequestedDeliveryDateMissingForCostPriceListMessage` |

Both messages state the validity period as `yyyy-MM-dd` dates. An open-ended period is rendered as `≥ 2026-01-01` or `≤ 2026-12-31`.

## Configuration

No additional connector properties are required. The validity dates are configured on the cost price list itself.

```json
{
  "name": "costPriceListDateValidator",
  "implementations": ["IPurchaseOrderValidator"]
}
```

## Related

*   [Price list](../../../Prices/PriceLists.md) — creating price lists and setting cost prices
*   [Purchase Order Configuration](../../purchase-order-config.md) — tenant settings that control purchase order behavior
*   [Purchase Order Validation](../../validation.md) — how validation runs and how errors are attached
