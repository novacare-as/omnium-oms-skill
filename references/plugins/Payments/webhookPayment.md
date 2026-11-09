# Webhook payment

Source: https://docs.omnium.no/docs/plugins/Payments/webhookPayment

> Create a custom payment provider

## Overview

If Omnium does not provide the integration needed, you can use a Webhook payment provider. Following features is supported

*   **Capture**
*   **Refunds**
*   **Authorization**
*   **Cancellation/Void**

* * *

## Configuration Steps

1.  Navigate to: **`Configuration > Settings > Orders > Payment > Payment Types > Add New > WebhookPayment`**

* * *

## Required Settings

| **Field** | **Value** |
| --- | --- |
| **Payment Setting Name** | Customizable |
| **Payment Method Name** | Customizable |
| **Provider Name** | `WebhookPayment` |
| **Display Name** | Customizable |
| **Base URL** | Your webhook base url. The base url(or transactions url's) should contain a guide or be ip restriced. |

### Properties for transaction url's

Webhook payment needs some properties in the property list, to be able to do capture, credit etc. Add the following:

| **Key** | **Value** |
| --- | --- |
| **CaptureUrl** | Your endpoint for Capture |
| **CreditUrl** | Your endpoint for Credit |
| **VoidUrl** | Your endpoint for Cancellation/Void |
| **AuthorizationUrl** | Optional endpoint if the webhook provier should support adding payment from Omnium GUI |

Omnium will call this endpoints with the following request model:

```json
{
"OrderNumber": "105388",
"Amount": 400,
"CurrencyCode": "NOK",
"TransactionId": "105388",
"PaymentMethodName": "WebhookPayment",
"MarketId": "NOR",
"CustomerNumber": "3453234234234"
}
```

If payment is success, we expect to get statuscode 200 returned from the webhook. If not, we will read the content as an error message.

### Custom headers and authentication

Omnium support adding custom headers to webhook payment provider requests. This is done by adding a custom property to the payment settings with `KeyGroup` = **"Header"**. Here `Key` will be the key of the header and `Value` the header value. Adding authorzation headers is a common use case for this feature.

Example:

| **KeyGroup** | **Key** | **Value** |
| --- | --- | --- |
| Header | Authentication | Bearer \* \* \* |
