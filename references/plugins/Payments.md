# Payments

Source: https://docs.omnium.no/docs/plugins/Payments

> Overview of how payments work in Omnium and the supported payment providers

## Payments in Omnium

Omnium integrates with a wide range of external payment providers to handle both online and in-store transactions.
When a customer completes a purchase, the selected provider (e.g. Vipps, Kustom, Stripe) authorizes the payment.

Omnium then stores the payment details on the cart and, once the cart is placed, on the order.
This allows Omnium to manage post-order operations such as **capture, refund, and cancellation** through the configured provider integration.

* * *

## Supported Payment Providers

Omnium currently supports the following providers:

*   Adyen
*   Aera
*   Aera Invoice
*   Authorize.Net
*   Avarda
*   AwardIt
*   Bonus Points
*   Dintero
*   Kustom Checkout
*   N-Genius
*   Netaxept
*   Nets
*   NetsEasy
*   PayEx
*   PayPal
*   Qliro
*   ResursBank
*   Shopify
*   Stripe
*   Svea
*   Toss
*   Vipps
*   Vipps E-Payment
*   Walley
*   Webhook Payment
*   Zaver
*   Atome

* * *

## Using the Payment API

For detailed information on how to work with payments in the API, including:

*   Adding payments to carts and orders
*   Transaction types and payment lifecycle
*   Multiple payments and split payments
*   Payment API endpoints

See the [Payments section in the Order API documentation](../Order/order-api.md#payments).

* * *

## Configuration

Configure your payment providers in Omnium: _Configuration → Settings → Orders → Payment Providers_

Each provider requires specific credentials and settings. Refer to the provider's documentation for integration details.

* * *

## How Omnium picks the provider

Every payment on an order carries a **Payment Service** name (`paymentMethodName`). When Omnium needs to capture, refund, cancel or otherwise act on that payment, it:

1.  Finds the payment type, among those valid for the order's market and store, whose **Payment Service** or **Provider Name** matches the payment's Payment Service.
2.  If that payment type has **Is empty payment** switched on, uses the empty provider (see below).
3.  Otherwise uses the provider selected in **Provider Name**.
4.  If Provider Name is blank, uses the Payment Service itself as the provider key. That only works when the Payment Service happens to equal a provider key, so always select a Provider Name on a payment type that is not an empty payment.

* * *

## Empty payment types

A payment type with **Is empty payment** switched on records payments in Omnium without ever contacting a payment provider. Use it when another system handles the money - typically the storefront or e-commerce platform captures and refunds directly with the provider - and Omnium only needs the payment on the order for order history, accounting and reporting.

### What happens to each operation

| **Operation** | **Result** |
| --- | --- |
| Register / authorize | Recorded as successful. The transaction ID is kept, or a new GUID is generated. |
| Capture | Recorded as successful. No money moves. |
| Refund (credit) | Recorded as successful. No money moves. |
| Cancel / release remaining authorization | Recorded as successful. |
| Update authorization, extend authorization time, update shipment information | Not supported - nothing is sent. |
| Get payment information | Not available - the action is not offered for these payments. |
| Settlements / payouts | Not imported for this payment type. |

The order workflow still runs as normal: payments move to captured or credited in Omnium, so order status, accounting and reports reflect the payment. The provider is simply never called.

### Which settings are used

*   **Used:** Payment Service (to match the order's payments), Display Name, Logo URL, Valid On Markets, Valid For Stores, priorities, Disable Transactions and the accounting setup for the Payment Service.
*   **Ignored:** Provider Name, Base URL, Merchant ID, API Token and other credentials. A payment type with Is empty payment on does not need them, and an older one may have no Provider Name at all - that is fine.

```json
{
  "name": "Klarna",
  "paymentMethodName": "Klarna",
  "displayName": "Klarna",
  "isEmptyPayment": true
}
```

This configuration records every order payment with the Payment Service `Klarna` without calling Kustom, whatever the payment type's name suggests.

Switching **Is empty payment** off on a payment type that is in use makes Omnium start capturing, refunding and cancelling through the provider for every open order with that Payment Service. If the storefront or another system also handles those operations, the same order can be captured or refunded twice. Before switching it off, select a Provider Name, enter the credentials, and confirm the other system has stopped handling capture and refund.
