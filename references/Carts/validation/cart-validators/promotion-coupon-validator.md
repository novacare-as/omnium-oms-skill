# Promotion Coupon Validator

Source: https://docs.omnium.no/docs/Carts/validation/cart-validators/promotion-coupon-validator

> Validates promotion coupon codes and removes invalid ones from the cart.

## Overview

The **Promotion Coupon Validator** checks that all coupon codes applied to the cart are still valid. Invalid coupon codes are automatically removed from the cart, and a validation error is returned to notify the user.

## Identifier

| Property | Value |
| --- | --- |
| **Connector ID** | `promotionCouponValidator` |
| **Validation Type** | Discount |

## Behavior

1.  Skips validation entirely for replacement orders (carts tagged with the replacement order tag)
2.  If the cart has no coupon codes, validation passes
3.  Validates each coupon code against the promotion coupon service
4.  Collects all invalid coupon codes
5.  If any invalid codes are found:
    *   Removes them from the cart
    *   Marks the cart entity as updated
    *   Returns a validation error

## Error messages

| Condition | Translation Key | Error Code |
| --- | --- | --- |
| Invalid coupon codes found | `CouponCodeValidatorErrorMessage` | `InvalidCouponCode` |

## Configuration

No additional properties required.

```json
{
  "name": "promotionCouponValidator",
  "implementations": ["IValidator"],
  "disableStandardErrorPolicy": false
}
```
