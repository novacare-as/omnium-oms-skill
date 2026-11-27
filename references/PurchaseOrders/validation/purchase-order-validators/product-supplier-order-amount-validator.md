# Product Supplier Order Amount Validator

Source: https://docs.omnium.no/docs/PurchaseOrders/validation/purchase-order-validators/product-supplier-order-amount-validator

> Warns when the line items belonging to a secondary supplier fall outside that supplier's minimum or maximum order amount.

## Overview

The **Product Supplier Order Amount Validator** checks order amount limits for the _other_ suppliers represented on a purchase order. A purchase order has one supplier of its own, but individual line items can carry their own `SupplierId` — for example when products are sourced from several suppliers and later split into separate orders. This validator groups those line items by supplier and compares each group's total against that supplier's minimum and maximum order amount.

Violations are reported as **warnings**, so the purchase order can still be saved and processed. Each warning references the supplier it applies to, which lets the UI show the problem next to the relevant supplier group.

The purchase order's own supplier is handled by the [Purchase Order Amount Validator](purchase-order-amount-validator.md); this validator deliberately skips it to avoid duplicate warnings.

## Identifier

| Property | Value |
| --- | --- |
| **Connector ID** | `productSupplierOrderAmountValidator` |
| **Validation Type** | Amount |
| **Validation Scope** | Order, grouped per line item supplier |

## Behavior

1.  Removes any existing `ProductSupplierOrderAmountOutOfRange` errors from the purchase order, so the result always reflects the current line items
2.  Skips validation when the purchase order has no line items
3.  Groups line items by `SupplierId`, ignoring lines that have no supplier and lines whose supplier is the purchase order's own supplier
4.  For each supplier group, looks up the supplier and skips it when the supplier cannot be found or when neither `MinimumOrderAmount` nor `MaximumOrderAmount` is set
5.  If the supplier has a `PreferredCurrency` and it differs from the order currency, converts the limits to the order currency before comparing. The order currency is the purchase order's `BillingCurrency`, falling back to the first currency found on the group's line items. When either currency is missing, the limits are compared as they are
6.  Sums `ExtendedPrice` across the group's line items to get the supplier total
7.  If the supplier total is below the minimum, adds a **warning** referencing that supplier
8.  Otherwise, if the supplier total is above the maximum, adds a **warning** referencing that supplier

## Error messages

| Condition | Severity | Error Key | Translation Key |
| --- | --- | --- | --- |
| Supplier group total below the minimum order amount | Warning | `ProductSupplierOrderAmountOutOfRange` | `SupplierOrderAmountBelowMinimum` |
| Supplier group total above the maximum order amount | Warning | `ProductSupplierOrderAmountOutOfRange` | `SupplierOrderAmountAboveMaximum` |

Both messages include the supplier name, the limit that was breached, and the currency the limit was compared in.

## Configuration

No additional connector properties are required. The limits are configured per supplier through `MinimumOrderAmount`, `MaximumOrderAmount`, and `PreferredCurrency`.

```json
{
  "name": "productSupplierOrderAmountValidator",
  "implementations": ["IPurchaseOrderValidator"]
}
```

## Related

*   [Purchase Order Amount Validator](purchase-order-amount-validator.md) — the equivalent check for the purchase order's own supplier
*   [Supplier Configuration](../../Suppliers/supplier-config.md) — supplier setup in Omnium
*   [Purchase Order Validation](../../validation.md) — how validation runs and how errors are attached
