# Null Price Validator

Source: https://docs.omnium.no/docs/Carts/validation/cart-validators/null-price-validator

> Ensures all line items in the cart have a non-zero price.

## Overview

The **Null Price Validator** checks that all line items in the cart have a `PlacedPrice` greater than zero. Line items with a price of zero typically indicate missing price data, which should be resolved before the cart can become an order.

## Identifier

| Property | Value |
| --- | --- |
| **Connector ID** | `nullPriceValidator` |
| **Validation Type** | Price |

## Behavior

1.  Finds all line items where `PlacedPrice` equals zero
2.  If no zero-priced items exist, validation passes
3.  Returns one validation error per line item with a zero price, including the SKU code in the message

## Error messages

| Condition | Translation Key | Error Code |
| --- | --- | --- |
| Line item has zero price | `NullPriceValidationError` | `PriceMissing` |

## Configuration

No additional properties required.

```json
{
  "name": "nullPriceValidator",
  "implementations": ["IValidator"],
  "disableStandardErrorPolicy": false
}
```
