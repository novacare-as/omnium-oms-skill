# Margins Validator

Source: https://docs.omnium.no/docs/Carts/validation/cart-validators/margins-validator

> Validates that no line items in the cart are sold below cost price.

## Overview

The **Margins Validator** checks that the effective price per unit for each line item is not lower than the product's cost price. If a line item is being sold at a loss, the validator returns an error for that line, preventing the cart from becoming an order until the pricing is corrected.

## Identifier

| Property | Value |
| --- | --- |
| **Connector ID** | `marginsValidator` |
| **Validation Type** | Price |
| **Validation Scope** | LineItem |

## Behavior

1.  For each line item, calculates the effective price per unit: `ExtendedPrice / Quantity`
2.  Compares the result against the line item's `Cost`
3.  If the price per unit is lower than the cost, the line item is flagged
4.  Returns one validation error per affected line item, including the SKU code
5.  If no line items have negative margins, validation passes

## Error messages

| Condition | Translation Key | Error Code |
| --- | --- | --- |
| Price per unit is below cost | `MarginsValidationError` | `MarginBelowCost` |

## Configuration

No additional properties required.

```json
{
  "name": "marginsValidator",
  "implementations": ["IValidator"],
  "disableStandardErrorPolicy": false
}
```
