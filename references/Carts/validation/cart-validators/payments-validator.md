# Payments Validator

Source: https://docs.omnium.no/docs/Carts/validation/cart-validators/payments-validator

> Validates that payment amounts on the cart match the order total.

## Overview

The **Payments Validator** ensures that the cart has valid payments and that the total amount paid matches the order total exactly. It checks for missing payments, underpayment, and overpayment.

## Identifier

| Property | Value |
| --- | --- |
| **Connector ID** | `paymentsValidator` |
| **Validation Type** | Payment |

## Behavior

1.  If no payments exist on the cart, returns a "No payments selected" error
2.  If any payment has a `StaticPaymentType` property, validation passes (static payment types are handled separately)
3.  Filters to active payments only
4.  If no active payments remain, returns a "No payments selected" error
5.  Calculates the total paid amount:
    *   Uses `AuthorizedAmount - CreditedAmount` for each payment
    *   Falls back to `InvoicedAmount` if the authorized amount minus credits is zero or negative
6.  Compares total paid to the order total:
    *   If total paid is less than the order total, returns a "Not enough payments" error
    *   If total paid is greater than the order total, returns a "Too much paid" error
    *   If they match exactly, validation passes

## Error messages

| Condition | Translation Key | Error Code |
| --- | --- | --- |
| No payments on cart | `NoPaymentsSelected` | `NoPaymentSelected` |
| No active payments | `NoPaymentsSelected` | `NoPaymentSelected` |
| Total paid is less than order total | `NotEnoughPayments` | `InsufficientPayment` |
| Total paid exceeds order total | `TooMuchPaid` | `PaymentExceedsTotal` |

## Configuration

No additional properties required.

```json
{
  "name": "paymentsValidator",
  "implementations": ["IValidator"],
  "disableStandardErrorPolicy": false
}
```
