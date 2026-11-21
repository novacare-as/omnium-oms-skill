# Extend Payment Authorization

Source: https://docs.omnium.no/docs/configuration/scheduled-tasks/orders/extend-payment-authorization

> Automatically extend payment authorizations that are about to expire so you can still capture the payment

## Overview

This task finds orders with a payment authorization (reservation) that expires within the next five days and asks the payment provider to extend it. Use it when orders stay open longer than the provider keeps an authorization - for example backorders, pre-orders or products made to order - so the payment can still be captured when the goods ship.

## Identifier

| Property | Value |
| --- | --- |
| **Implementation Type** | `ExtendPaymentAuthOrderScheduledTask` |
| **Group** | Orders |
| **Type** | Delta |

* * *

## When to Use

Enable this task when you need:

*   Expiring authorizations extended without opening each order in the Omnium UI
*   Payments on long-running orders kept capturable until delivery
*   A payment provider that supports extending authorizations (see [Supported payment providers](extend-payment-authorization.md#supported-payment-providers))

* * *

## Configuration Properties

This task has no configurable properties. The five-day window is fixed, and the task applies to all payment methods. Which payments it finds depends on the authorization expiry date stored on each payment (`authorizationExpires` on the order's payments). These payment type settings affect the task:

| Setting | Location | Description |
| --- | --- | --- |
| `AuthorizationTimeInDays` | Payment type in Tenant Settings | **Authorization time in days**. The [Set Authorization Expires](../../../Order/workflow-steps/payment/set-authorization-expires.md) workflow step uses it to set the expiry date. Svea uses it as the length of the extension (30 days when not set). |
| `EnableExtendAuthorizationTime` | Payment type in Tenant Settings | **Enable extended authorization time**. Controls only the extend action in the Omnium UI. The task does not check this setting. |

The task tries every payment that has an expiry date in the window, whether or not **Enable extended authorization time** is switched on for its payment type. Payment providers that do not support extending either skip the payment or add an error to the order - see [Supported payment providers](extend-payment-authorization.md#supported-payment-providers).

* * *

## Behavior

### Which payments the task extends

The task extends a payment when all of these apply:

1.  Its authorization expiry date has not passed yet and is before midnight (UTC) five days from today
2.  The payment is still active in Omnium - for example, it is not voided and not all of its transactions failed
3.  Part of the authorized amount is not captured yet
4.  The order has no earlier extension error for the same payment method (see [Retry after an error](extend-payment-authorization.md#retry-after-an-error))

Every run checks all orders with an expiry date in the window. The task does not limit itself to orders changed since the last run.

### What It Does

1.  Searches for orders with a payment whose authorization expires within the window
2.  For each payment that qualifies, asks the payment provider to extend the authorization
3.  When the provider extends the authorization:
    *   Adds an authorization transaction to the payment with the comment "Extended authorization time"
    *   When the provider returns a new expiry date, clears the expiry dates on the order's existing authorization transactions and stores the new date on the new transaction
    *   Adds an event log entry: "Extended authorization time for transaction `<transactionId>`"
4.  When the extension fails, adds an error to the order (see [Error Handling](extend-payment-authorization.md#error-handling))
5.  Saves the updated orders in batches

The run result reports the number of extended authorizations and the number of errors.

### Supported payment providers

| Provider | How the authorization is extended |
| --- | --- |
| [Kustom Checkout and Kustom Payment Link](../../../plugins/Payments/klarnav3.md) | Extended at Kustom. Omnium reads the new expiry date back from Kustom. |
| [Svea Checkout](../../../plugins/Payments/sveaCheckout.md) and [Svea InStore](../../../plugins/Payments/sveaInstore.md) | Omnium sets the new expiry date to the time of the run plus **Authorization time in days** (30 days when not set) and sends it to Svea. |
| [Walley](../../../plugins/Payments/Walley.md) | Extended at Walley. Omnium reads the new expiry date back from Walley. |
| [Adyen](../../../plugins/Payments/adyen.md) | Omnium sends Adyen an authorization amount update for the authorized amount. Adyen returns no new expiry date, so the expiry date stored on the payment does not change. |

**Adyen payments are extended on every run.** Because the expiry date stored on an Adyen payment does not change, the payment stays in the five-day window and each run extends it again until the original expiry date passes. Omnium records every Adyen extension as an authorization of the full authorized amount, so the authorized amount Omnium shows for the payment grows with each extension. Check the authorized and remaining amounts on Adyen orders before you enable this task for a tenant that uses Adyen.

Other payment providers do not support extending an authorization:

*   **Skipped without changes:** Authorize.Net, Bonus Points, NGenius, PayEx, PayPal, Vipps (Legacy), Vipps ePayment, Webhook payment, B2B account balance, cash, payment terminals, gift cards, and [empty payment types](../../../plugins/Payments.md#empty-payment-types)
*   **Order error "not implemented":** Aera, Aera Invoice, Atome, Avarda, Dintero, Generic Payment, Netaxept, Nets Easy, Qliro, Resursbank, Shopify Payments, Stripe, Toss, Zaver, and vouchers

### Prerequisites

*   Payments must have an authorization expiry date. Some providers set it when the payment is authorized; otherwise use the [Set Authorization Expires](../../../Order/workflow-steps/payment/set-authorization-expires.md) workflow step with **Authorization time in days** on the payment type
*   The payment type must be configured with valid provider credentials

### Side Effects

*   Adds authorization transactions to extended payments
*   Replaces the authorization expiry date on the order when the provider returns a new one
*   Adds event log entries for extended authorizations
*   Adds order errors for failed or unsupported extensions
*   Adds a failed authorization transaction when the provider rejects the extension

* * *

## Error Handling

| Condition | Result |
| --- | --- |
| The provider extends the authorization | Transaction and event log entry added, order saved |
| The provider does not support extending and returns no result | Payment skipped, order not changed |
| The provider does not implement extending | Order error with the message "Extended authorization time not implemented for: `<PaymentMethodName>`" |
| The provider rejects the extension, or the call fails | Order error with the message "Extended authorization time failed." and the provider's error in the details |

The order error has the key `PaymentExtendAuthError<PaymentMethodName>`, where `<PaymentMethodName>` is the payment's **Payment Service** (`paymentMethodName`), for example `PaymentExtendAuthErrorWalley`. Its severity is `error`. When the provider rejects the extension, Omnium also records a failed authorization transaction with the provider's error message on the payment, and the provider may add its own error to the order.

### Retry after an error

While the order has a `PaymentExtendAuthError<PaymentMethodName>` error, the task skips that payment method on the order. An error marked as solved still counts. Remove the error from the order to have the next run try again, as long as the authorization has not expired yet.

* * *

## Example Configuration

```json
{
    "ImplementationType": "ExtendPaymentAuthOrderScheduledTask",
    "Schedule": "0 2 * * *",
    "IsDisabled": false
}
```

* * *

## Recommended Schedule

Run once a day (`0 2 * * *`). An authorization enters the five-day window several days before it expires, so a daily run reaches it in time. After a failed extension, the task does not try that payment method on the order again until you remove the error.

* * *

## Related Tasks

*   [Set Authorization Expires](../../../Order/workflow-steps/payment/set-authorization-expires.md) - Set the authorization expiry date that this task reads
*   [Remove Authorization Expires](../../../Order/workflow-steps/payment/remove-authorization-expires.md) - Clear the expiry date after capture
*   [Payment Settlements](payment-settlements.md) - Retrieve settlement data from payment providers
*   [Payments](../../../plugins/Payments.md) - Payment provider configuration
