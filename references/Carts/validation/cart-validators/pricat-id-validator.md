# Pricat ID Validator

Source: https://docs.omnium.no/docs/Carts/validation/cart-validators/pricat-id-validator

> Validates Pricat ID consistency for pre-order carts.

## Overview

The **Pricat ID Validator** ensures that pre-order carts have a valid Pricat ID and that the products in the cart share consistent Pricat IDs. This validator only runs for carts with the `PreOrder` order type and is skipped for all other order types.

## Identifier

| Property | Value |
| --- | --- |
| **Connector ID** | `priCatIdValidator` |
| **Validation Type** | General |

## Behavior

1.  Only runs for carts where `OrderType` is `PreOrder`; all other order types pass automatically
2.  Checks if the cart has a `PricatId` property:
    *   If missing, adds a blank `PricatId` property to the cart and returns a warning
3.  Looks up all products in the cart and collects their `PricatId` properties
4.  Groups the Pricat IDs by frequency to find the most common one
5.  Validates consistency:
    *   If all products share the same Pricat ID(s) but the cart's Pricat ID doesn't match, returns an error listing the valid options
    *   If products have different Pricat IDs (not all matching), returns a warning indicating the mismatch
6.  If the cart's Pricat ID matches the products, validation passes

## Error messages

| Condition | Type | Message | Error Code |
| --- | --- | --- | --- |
| Cart missing Pricat ID property | Warning | "Pricat ID is missing" | `PricatIdMissing` |
| Cart Pricat ID doesn't match products | Error | Lists possible valid Pricat IDs | `PricatIdMismatch` |
| Products have inconsistent Pricat IDs | Warning | Indicates mismatch count | `PricatIdPartialMismatch` |

## Configuration

No additional properties required.

```json
{
  "name": "priCatIdValidator",
  "implementations": ["IValidator"],
  "disableStandardErrorPolicy": false
}
```
