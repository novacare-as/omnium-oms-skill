# Credit Limit Validator

Source: https://docs.omnium.no/docs/Carts/validation/cart-validators/credit-limit-validator

> Validates that the customer has sufficient credit to cover credit-based payments in the cart.

## Overview

The **Credit Limit Validator** checks whether the customer has enough available credit to cover payments that require credit. It supports three levels of validation: credit denied, insufficient remaining credit, and exceeded credit limit. Stores can optionally be configured to show a warning instead of blocking the order when credit is insufficient.

## Identifier

| Property | Value |
| --- | --- |
| **Connector ID** | `creditLimitValidator` |
| **Validation Type** | Payment |

## Behavior

1.  Looks up the customer associated with the cart
2.  Identifies payments that have `RequiresCredit` enabled in the payment configuration
3.  Calculates the total credit demand from all credit-based payments
4.  Checks three conditions in order:
    *   **Credit denied**: If the customer's `IsCreditDenied` flag is set, returns an error
    *   **Insufficient remaining credit**: If `CreditRemaining` is less than the total credit demand, returns an error (or a warning if the store has `OnlyWarnOnCreditLimit` enabled)
    *   **Exceeded credit limit**: If `CreditLimit` is less than the total credit demand, returns an error
5.  If no credit-based payments exist or the customer has sufficient credit, validation passes

### Store-level override

If the store has the property `OnlyWarnOnCreditLimit` set to `"true"`, insufficient credit will produce a **warning** instead of an error, allowing the order to proceed.

## Error messages

| Condition | Translation Key | Error Code |
| --- | --- | --- |
| Customer credit is denied | `CreditIsDenied` | `CreditDenied` |
| Insufficient remaining credit | `NotEnoughCredit` | `InsufficientCredit` |
| Exceeds credit limit | `ExceedsCreditLimit` | `CreditLimitExceeded` |

## Configuration

No additional properties required.

```json
{
  "name": "creditLimitValidator",
  "implementations": ["IValidator"],
  "disableStandardErrorPolicy": false
}
```
