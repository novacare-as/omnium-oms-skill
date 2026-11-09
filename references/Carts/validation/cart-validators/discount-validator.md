# Discount Validator

Source: https://docs.omnium.no/docs/Carts/validation/cart-validators/discount-validator

> Validates that discounts on the cart are correctly configured.

## Overview

The **Discount Validator** checks that all discounts applied to the cart have a consistent configuration. Specifically, it flags any discount that has a `RewardType` of `None` but still has a discount value greater than zero, which indicates a misconfiguration.

## Identifier

| Property | Value |
| --- | --- |
| **Connector ID** | `discountValidator` |
| **Validation Type** | Discount |

## Behavior

1.  Iterates through all discounts on the cart's order form
2.  For each discount, checks if the `RewardType` is `None` and the `DiscountValue` is greater than zero
3.  If any such discount is found, returns a validation error

## Error messages

| Condition | Message | Error Code |
| --- | --- | --- |
| Discount has value but reward type is None | "Discount has value, but discount reward type is 'None'" | `InvalidDiscount` |

## Configuration

No additional properties required.

```json
{
  "name": "discountValidator",
  "implementations": ["IValidator"],
  "disableStandardErrorPolicy": false
}
```
