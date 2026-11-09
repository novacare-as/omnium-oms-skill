# Purchase Order Amount Validator

Source: https://docs.omnium.no/docs/PurchaseOrders/validation/purchase-order-validators/purchase-order-amount-validator

> Validates that the purchase order total is within the supplier's minimum and maximum order amount limits.

## Overview

The **Purchase Order Amount Validator** checks that the total value of the purchase order falls within the supplier's configured order amount limits. Both a minimum and maximum limit are supported. Violations are reported as **warnings**, so orders can still be saved and processed — the warning serves as an advisory notice to the buyer.

## Identifier

| Property | Value |
| --- | --- |
| **Connector ID** | `purchaseOrderAmountValidator` |
| **Validation Type** | Amount |
| **Validation Scope** | Order |

## Behavior

1.  If no supplier is set on the purchase order, validation is skipped
2.  Looks up the supplier and checks whether `MinimumOrderAmount` or `MaximumOrderAmount` is configured
3.  If neither limit is set, validation is skipped
4.  If the order currency differs from the supplier's preferred currency, the limit values are converted to the order currency before comparison
5.  If the order total is below the minimum, adds a **warning** to the order
6.  If the order total is above the maximum, adds a **warning** to the order
7.  If both checks pass, any existing amount error is removed

## Error messages

| Condition | Severity | Translation Key |
| --- | --- | --- |
| Total below minimum order amount | Warning | `OrderAmountBelowMinimum` |
| Total above maximum order amount | Warning | `OrderAmountAboveMaximum` |

## Configuration

No additional properties required. Minimum and maximum order amounts are configured on the supplier, not the validator connector.

```json
{
  "name": "purchaseOrderAmountValidator",
  "implementations": ["IPurchaseOrderValidator"]
}
```

## Related

Supplier order amount limits are configured in [Supplier Configuration](../../Suppliers/supplier-config.md). When the order currency and the supplier's preferred currency differ, the limits are converted to the order currency before they are compared.

Line items belonging to a different supplier than the purchase order itself are checked by the [Product Supplier Order Amount Validator](product-supplier-order-amount-validator.md).
