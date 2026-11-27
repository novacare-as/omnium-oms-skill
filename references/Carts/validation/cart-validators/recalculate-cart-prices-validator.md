# Recalculate Cart Prices Validator

Source: https://docs.omnium.no/docs/Carts/validation/cart-validators/recalculate-cart-prices-validator

> Recalculates line item prices using current product pricing and promotions.

## Overview

The **Recalculate Cart Prices Validator** refreshes the prices on all line items in the cart based on the current product pricing and active promotions. This ensures that the cart reflects up-to-date prices, even if pricing has changed since the items were added.

This validator only runs on carts, not on confirmed orders.

## Identifier

| Property | Value |
| --- | --- |
| **Connector ID** | `recalculateCartPricesValidator` |

## Behavior

1.  Skips validation entirely for confirmed `Order` entities (only runs on carts)
2.  By default (`ValidateAlways` enabled), recalculates on every validation. When `ValidateAlways` is set to `false`, recalculates at most once every 5 minutes per cart to avoid excessive processing
3.  For each line item:
    *   Skips line items with a `ManualDiscount` property set to `true`
    *   Resets the line item's discount amount
    *   Enriches the line item with the current default price
    *   Recalculates the line item's derived price fields
4.  If any prices changed, marks the cart entity as updated
5.  Always returns a successful validation (this validator updates data rather than blocking)

## Configuration

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `ValidateAlways` | bool | `true` | When `true`, skips the 5-minute interval check and recalculates on every validation. When `false`, respects the interval. |

### Example

```json
{
  "name": "recalculateCartPricesValidator",
  "implementations": ["IValidator"],
  "properties": [
    { "key": "ValidateAlways", "value": "false" }
  ],
  "disableStandardErrorPolicy": false
}
```
