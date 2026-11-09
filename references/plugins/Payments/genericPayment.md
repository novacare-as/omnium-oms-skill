# Generic Payment

Source: https://docs.omnium.no/docs/plugins/Payments/genericPayment

> Configure Generic Payment provider for custom webhook-based payment integrations.

## Generic Payment Integration with Omnium

Omnium supports **Generic Payment** for custom payment integrations that forward payment operations to external HTTP endpoints. This provider is ideal for integrating with payment systems that have custom APIs.

### Supported Features

*   **Direct Capture** payments
*   **Cancel** payments
*   **Credit/Refund** payments
*   **In-Store Registration** (basic)

* * *

## Setup Instructions

### Configuration Path

1.  Navigate to: `Configuration > Settings > Payment > Payment Types > "..." > Add`

2.  Fill out the required fields as outlined below.

* * *

## Required Fields

| **Field** | **Description** | **Value** |
| --- | --- | --- |
| **Unique Payment Name** | The unique identifier for the payment method. | Your unique name |
| **Payment Service** | The name of the payment service used for this configuration. | `GenericPayment` |
| **Provider Name** | Specifies which provider to use. | `GenericPayment` |
| **Display Name** | The name shown in the Omnium interface. | Your preferred display name |
| **Base URL** | Base URL for your webhook endpoints. | Your API base URL |

* * *

## Webhook Configuration (Properties)

Configure webhook endpoints as properties:

| **Property** | **Description** |
| --- | --- |
| `CaptureUrl` | Endpoint for capture operations |
| `CreditUrl` | Endpoint for refund operations |
| `SendEntireOrderToProvider` | Send full order data (true) or minimal (false) |

* * *

## Supported Operations

| **Operation** | **Supported** | **Notes** |
| --- | --- | --- |
| Direct Capture | Yes | Forwards to CaptureUrl endpoint |
| Cancel | Yes | Forwards to configured endpoint |
| Refund | Yes | Forwards to CreditUrl endpoint |
| In-Store Registration | Yes | Returns order number as transaction ID |

* * *

## Webhook Request Format

### Minimal Payload (Default)

When `SendEntireOrderToProvider` is false or not set:

```json
{
  "OrderNumber": "ORD-12345",
  "Amount": 500.00,
  "CurrencyCode": "NOK",
  "TransactionId": "ORD-12345",
  "PaymentMethodName": "CustomPayment",
  "MarketId": "NOR",
  "Properties": {}
}
```

### Full Order Payload

When `SendEntireOrderToProvider` is true, the complete order object is sent.

### Response Requirements

| **HTTP Status** | **Result** |
| --- | --- |
| 200-299 | Success |
| Other | Failure (response body = error message) |

* * *

## Transaction ID Generation

Transaction IDs are automatically generated:

| **Payment** | **Transaction ID** |
| --- | --- |
| First | `{OrderId}` |
| Second | `{OrderId}-1` |
| Third | `{OrderId}-2` |

* * *

## Error Handling

Generic Payment errors are displayed on the order in the **Errors** section.

Errors include:

*   HTTP status code
*   Response body content
*   Exception details if applicable

* * *

## Related Providers

### Webhook Payment Provider

For more advanced webhook integration with per-operation control:

**Provider Name:** `WebhookPayment`

Additional features:

*   Per-transaction-type webhook URLs
*   Empty transaction support (skip webhook for specific operations)
*   Custom HTTP headers

**Additional Properties:**

| **Property** | **Description** |
| --- | --- |
| `{TransactionType}Url` | URL for specific operation |
| `{TransactionType}IsEmpty` | Skip webhook for this operation (true/false) |
| Custom Headers | Add with `KeyGroup = "Header"` |

**Example Header Configuration:**

```
KeyGroup: Header
Key: Authorization
Value: Bearer your-token
```

### Empty Payment Provider

For payments that require no external processing:

**Provider Name:** `EmptyPayment`

*   All operations return immediate success
*   Generates random GUIDs for transaction IDs
*   Useful for testing or manual payment recording

Switching on **Is empty payment** on any payment type has the same effect, whatever its Provider Name. See [Empty payment types](../Payments.md#empty-payment-types).

* * *

## Configuration Reference

### Payment Service

`GenericPayment` or `WebhookPayment`

### Webhook Format

HTTP POST with JSON payload
