# Inactive Customer Validator

Source: https://docs.omnium.no/docs/Carts/validation/cart-validators/inactive-customer-validator

> Prevents checkout for inactive customers.

## Overview

The **Inactive Customer Validator** checks whether the customer associated with the cart is marked as inactive. Both business and private customers are checked. If the customer is inactive, the validator blocks the cart from proceeding to order creation.

## Identifier

| Property | Value |
| --- | --- |
| **Connector ID** | `inactiveCustomerValidator` |
| **Validation Type** | General |

## Behavior

1.  Checks if the cart has a `CustomerId` set
2.  If a customer ID is present, looks up the customer (a business customer first, falling back to a private customer)
3.  If the customer's `IsInactive` flag is `true`, returns a validation error
4.  If no customer is set or the customer is active, validation passes

## Error messages

| Condition | Translation Key | Error Code |
| --- | --- | --- |
| Customer is inactive | `InactiveCustomerValidatorErrorMessage` | `CustomerInactive` |

## Configuration

No additional properties required.

```json
{
  "name": "inactiveCustomerValidator",
  "implementations": ["IValidator"],
  "disableStandardErrorPolicy": false
}
```
