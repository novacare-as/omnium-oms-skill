# Nets Easy

Source: https://docs.omnium.no/docs/plugins/Payments/netsEasy

> Configure Nets Easy (Nexi) payment provider with Omnium for online payments.

## Nets Easy Integration with Omnium

Omnium supports **Nets Easy** (formerly DIBS, now part of Nexi) for payment processing with the following features:

*   **Authorize** payments via hosted payment page
*   **Capture** payments (full or partial)
*   **Cancel** payments / release authorization
*   **Credit/Refund** payments with tax-aware handling
*   **Update Merchant Reference** after order creation
*   **Get Details** - Retrieve payment information from Nets Easy

* * *

## Setup Instructions

### Configuration Path

1.  Navigate to: `Configuration > Settings > Payment > Payment Types > "..." > Add`

2.  Fill out the required fields as outlined below.

* * *

## Required Fields

| **Field** | **Description** | **Value** |
| --- | --- | --- |
| **Unique Payment Name** | The unique identifier for the Nets Easy payment method. | `NetsEasy` |
| **Payment Service** | The name of the payment service used for this configuration. | `NetsEasy` |
| **Provider Name** | Specifies which provider to use. | `NetsEasy` |
| **Display Name** | The name shown in checkout. | `Nets Easy` or your preferred name |
| **Terms URL** | URL to your terms and conditions (required by Nets Easy). | `https://yourdomain.com/terms` |
| **API Token** | Your Nets Easy secret key (Client Secret). | Your secret key from Nets Easy portal |
| **Return URL** | URL to redirect customers after payment completion. | `https://yourdomain.com/payment/success` |
| **Base URL** | The Nets Easy API endpoint URL. | See [Base URL Options](netsEasy.md#base-url-options) |
| **Vue Template** | The template for payment method integration. | `netsEasy-payment` |

* * *

## Base URL Options

| **Environment** | **Base URL** |
| --- | --- |
| Test/Sandbox | `https://test.api.dibspayment.eu` |
| Production | `https://api.dibspayment.eu` |

* * *

## Additional Configuration

| **Setting** | **Description** | **Default** |
| --- | --- | --- |
| **Display in Cart** | Show Nets Easy as a payment option in the cart interface. | `false` |
| **Get Details From Provider** | Enable fetching real-time payment details from Nets Easy. | `false` |
| **Valid On Markets** | Restrict to specific markets. Leave empty for all. | All markets |
| **Valid For Stores** | Restrict to specific stores. Leave empty for all. | All stores |

* * *

## Supported Operations

| **Operation** | **Supported** | **Notes** |
| --- | --- | --- |
| Authorize | Yes | Creates hosted payment page |
| Capture | Yes | Full or partial capture with order lines |
| Cancel | Yes | Cancel/release authorization |
| Release Remaining Auth | Yes | Release uncaptured portion |
| Refund | Yes | Tax-aware refunds with automatic rounding correction |
| Partial Refund | Yes | Item-level refund support |
| Update Merchant Reference | Yes | Update order reference in Nets Easy |
| Get Details | Yes | Retrieve payment state and history |

* * *

## Order Lines Requirement

Nets Easy requires order lines for most operations:

*   **Authorization** - Order lines required
*   **Capture** - Order lines required (validated against capture amount)
*   **Refund** - Order lines required for item-level tracking

If order lines are missing or empty, the operation will fail with a validation error.

* * *

## Special Features

### Tax-Aware Refund Handling

When processing refunds, Omnium automatically handles tax calculations:

1.  **Prorated Distribution** - Refund amount is distributed proportionally across return items based on their extended price
2.  **Tax Recalculation** - For each credited line item, tax amounts are recalculated based on the tax rate
3.  **Automatic Rounding Correction** - Small discrepancies (less than 1 currency unit) between the sum of distributed amounts and the total refund are automatically adjusted

This ensures accurate tax reporting even for partial refunds.

### Update Merchant Reference

After an order is created, you can update the merchant reference (order number) in Nets Easy. This is useful when the order number changes during processing, such as when converting from a cart to an order.

### Webhook Events

Nets Easy sends webhook notifications for payment events. The following events are registered:

*   Payment reservation created
*   Payment reservation failed
*   Payment charge created
*   Payment charge failed
*   Payment refund completed
*   Payment refund failed

* * *

## Client-Hosted Authorization (Webhook Registration)

When an ecommerce provider calls Nets Easy's **Create Payment** endpoint themselves (instead of using Omnium's authorize/pay-by-link flow), they own the `notifications.webhooks` array on the request. Unless they register Omnium's webhooks there, **Omnium cannot monitor failed charges or refunds** on the payment.

This matters because Nets Easy **only accepts webhook URLs at create-payment time** — they cannot be attached later when Omnium performs the charge or refund. So when Omnium captures or refunds a payment that was created client-side, it has no way to register its own callbacks. The provider must include Omnium's charge and refund webhooks in their original Create Payment call.

If these webhooks are not registered at create time, Omnium will **not** receive charge/refund confirmations and the payment state on the order will not update.

### Webhooks to register

Add the following entries to the `notifications.webhooks` array in your Create Payment request. Only the **charge** and **refund** events are required — reservation/authorization is handled client-side.

| Nets Easy Event | URL path suffix |
| --- | --- |
| `payment.charge.created.v2` | `/chargeCreated` |
| `payment.charge.failed.v2` | `/chargeFailed` |
| `payment.refund.failed` | `/refundFailed` |

Each URL follows this pattern:

```json
{omniumApiBaseUrl}/api/NetsEasyPayment/{tenantId}/{orderReference}/{suffix}
```

| Placeholder | Value |
| --- | --- |
| `{omniumApiBaseUrl}` | Environment API host (see below) |
| `{tenantId}` | Your Omnium tenant id (case-sensitive) |
| `{orderReference}` | Same value used as the Nets Easy `order.reference` / Omnium order |

### API Base URL by environment

| Environment | Base URL |
| --- | --- |
| Production | `https://api.omnium.no` |
| Test | `https://apitest.omnium.no` |
| Dev | `https://apidev.omnium.no` |

### Authorization header

Each webhook must include an `authorization` value. Nets Easy sends this value back as the `Authorization` header on every webhook call, and Omnium uses it to validate the request.

The webhook secret is **not** published here. Contact **Omnium Support** to obtain the value to use for the `authorization` field.

### Example

```
"notifications": {
  "webHooks": [
    {
      "eventName": "payment.charge.created.v2",
      "url": "https://api.omnium.no/api/NetsEasyPayment/myTenant/100012345/chargeCreated",
      "authorization": "<your-webhook-secret>"
    },
    {
      "eventName": "payment.charge.failed.v2",
      "url": "https://api.omnium.no/api/NetsEasyPayment/myTenant/100012345/chargeFailed",
      "authorization": "<your-webhook-secret>"
    },
    {
      "eventName": "payment.refund.failed",
      "url": "https://api.omnium.no/api/NetsEasyPayment/myTenant/100012345/refundFailed",
      "authorization": "<your-webhook-secret>"
    }
  ]
}
```

### Notes

*   `{orderReference}` must match the `order.reference` you send to Nets Easy. For charge/refund events Omnium can also recover the order via the Nets Easy `paymentId` if the reference does not resolve, but you should still set it correctly.
*   Nets Easy dedupes webhooks by event name. If you also register your own `payment.charge.created.v2` for your side, you can only point that event at one URL — coordinate so Omnium still receives the events it needs.

* * *

## Amount Handling

Nets Easy uses **integer amounts** (minor units/cents):

| **Currency** | **Example Amount** | **Nets Easy Value** |
| --- | --- | --- |
| NOK | 100.50 | 10050 |
| SEK | 250.00 | 25000 |
| EUR | 99.99 | 9999 |

Omnium handles the conversion automatically.

* * *

## Capture Behavior

When capturing a payment:

*   Order lines are validated against the capture amount
*   The sum of order line amounts must match the capture amount
*   A Charge ID is returned and stored for refund operations
*   Partial captures are supported

* * *

## Refund Behavior

When processing refunds:

1.  Return items are mapped to Nets Easy order lines
2.  Tax amounts are calculated separately for each line
3.  Shipment costs can be refunded as a separate line item
4.  Rounding discrepancies are automatically corrected

### Refund Limitations

The refund amount cannot exceed the captured amount. Partial refunds are supported with item-level granularity.

* * *

## Error Handling

Nets Easy errors are displayed on the order in the **Errors** section.

### Common Errors

| **Error** | **Possible Cause** | **Solution** |
| --- | --- | --- |
| Authentication failed | Invalid API Token (Client Secret) | Verify secret key in Nets Easy portal |
| Order lines required | Missing order lines on operation | Ensure order lines are populated |
| Amount mismatch | Order lines sum doesn't match amount | Verify order line calculations |
| Payment not found | Invalid transaction ID | Check transaction ID and environment |

* * *

## Limitations

*   **Release Remaining Authorization**: Nets Easy does not support releasing remaining authorizations independently from a charge. You'll need to capture or cancel the full amount in these cases.

* * *

## Payment Flow

1.  **Customer initiates payment** - Hosted payment page URL is generated
2.  **Customer completes payment** - Redirected to Return URL
3.  **Webhook notification** - Omnium receives payment status update
4.  **Order processing** - Capture when ready for fulfillment
5.  **Returns** - Refund through returns workflow

* * *

## Configuration Reference

### Payment Service

`NetsEasy`

### Supported Currencies

All currencies supported by Nets Easy (NOK, SEK, DKK, EUR, etc.)

### API Authentication

Bearer token authentication using the API Token (Client Secret).
