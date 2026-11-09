# Active Products Validator

Source: https://docs.omnium.no/docs/Carts/validation/cart-validators/active-products-validator

> Validates that all products in the cart are active and available for purchase.

## Overview

The **Active Products Validator** checks that every product and variant in the cart has an active status. If any product or variant is inactive, the validator returns an error for each affected SKU, preventing the cart from being converted to an order.

## Identifier

| Property | Value |
| --- | --- |
| **Connector ID** | `activeProductsValidator` |
| **Validation Type** | Product |
| **Validation Scope** | LineItem |

## Behavior

1.  Collects all SKU codes from the cart's line items
2.  Looks up the corresponding products
3.  If no products are found for the given SKUs, returns a "No hits" error
4.  For each product:
    *   If the product is a standalone SKU and is inactive, adds an error
    *   If the product has variants, checks that both the parent product and the matching variant are active
5.  Returns one validation error per inactive SKU

## Error messages

| Condition | Message | Translation Key | Error Code |
| --- | --- | --- | --- |
| No products found for SKUs | "No hits" | `NoHits` | `ProductsNotFound` |
| Product or variant is inactive | "Inactive product: {skuId}" | `InactiveProductValidatorErrorMessage` | `ProductNotActive` |

## Configuration

No additional properties required.

```json
{
  "name": "activeProductsValidator",
  "implementations": ["IValidator"],
  "disableStandardErrorPolicy": false
}
```
