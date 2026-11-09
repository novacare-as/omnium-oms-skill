# Purchase Order Zero Quantity Validator

Source: https://docs.omnium.no/docs/PurchaseOrders/validation/purchase-order-validators/purchase-order-zero-quantity-validator

> Validates that no line items on the purchase order have a quantity of zero.

## Overview

The **Purchase Order Zero Quantity Validator** checks that all line items on a purchase order have a quantity greater than zero. Any line item with a quantity of exactly `0` is flagged as an **error** on both the line item and the order, blocking the order from being saved in an invalid state.

## Identifier

| Property | Value |
| --- | --- |
| **Connector ID** | `zeroQuantityValidator` |
| **Validation Type** | ZeroQuantity |
| **Validation Scope** | Order and line item |

## Behavior

1.  If the purchase order has no line items, validation is skipped
2.  Iterates over all line items
3.  If a line item has `Quantity == 0`, an **error** is added to both the line item and the order
4.  If a line item has a quantity greater than zero, any existing zero-quantity error is removed from that line item
5.  If no zero-quantity lines were found, the zero-quantity error is removed from the order as well

## Error messages

| Condition | Severity | Translation Key |
| --- | --- | --- |
| Line item quantity is zero | Error | `ZeroQuantityErrorMessage` |

## Configuration

No additional configuration is required. The validator is registered automatically.

```json
{
  "name": "zeroQuantityValidator",
  "implementations": ["IPurchaseOrderValidator"]
}
```
