# Sales Limitation Validator

Source: https://docs.omnium.no/docs/Carts/validation/cart-validators/sales-limitation-validator

> Enforces product sales restrictions based on customer and market rules.

## Overview

The **Sales Limitation Validator** checks whether any products in the cart are restricted from being sold to the current customer based on configured sales limitation rules. Sales limitations can restrict which products a specific customer or market group is allowed to purchase.

## Identifier

| Property | Value |
| --- | --- |
| **Connector ID** | `salesLimitationValidator` |
| **Validation Type** | Customer |

## Behavior

1.  If the cart has no line items, validation passes
2.  Determines the market group from the cart's market
3.  Queries the sales limitation service for restrictions matching the customer, SKUs, and market group
4.  If any products are restricted, returns a validation error for each restricted SKU
5.  If no restrictions apply, validation passes

## Error messages

| Condition | Translation Key | Error Code |
| --- | --- | --- |
| Product is restricted for this customer | `SalesLimitationIsNotForSaleForCustomer` | `SalesLimitationExceeded` |

## Configuration

No additional properties required.

```json
{
  "name": "salesLimitationValidator",
  "implementations": ["IValidator"],
  "disableStandardErrorPolicy": false
}
```
