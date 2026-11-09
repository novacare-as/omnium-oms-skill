# Atome

Source: https://docs.omnium.no/docs/plugins/Payments/atome

> Configure Atome payment provider with Omnium for buy-now-pay-later payments in Asia-Pacific.

## Atome Integration with Omnium

Omnium supports **Atome** for buy-now-pay-later payment processing in Asia-Pacific markets. This provider handles post-authorization operations for payments initiated through Atome.

### Supported Features

*   **Capture** payments
*   **Cancel** processing payments
*   **Credit/Refund** payments
*   **Get Details** - Retrieve payment information

* * *

## Setup Instructions

### Configuration Path

1.  Navigate to: `Configuration > Settings > Payment > Payment Types > "..." > Add`

2.  Fill out the required fields as outlined below.

* * *

## Required Fields

| **Field** | **Description** | **Value** |
| --- | --- | --- |
| **Unique Payment Name** | The unique identifier for the Atome payment method. | `Atome` |
| **Payment Service** | The name of the payment service used for this configuration. | `Atome` |
| **Provider Name** | Specifies which provider to use. | `Atome` |
| **Display Name** | The name shown in the Omnium interface. | `Atome` or your preferred name |
| **Client ID** | Your Atome Client ID for authentication. | Your Client ID from Atome |
| **API Token** | Your Atome API Secret for authentication. | Your API Secret from Atome |
| **Base URL** | Atome API endpoint URL. | Your Atome API URL |

* * *

## Supported Operations

| **Operation** | **Supported** | **Notes** |
| --- | --- | --- |
| Capture | Yes | Only for payments in PAID status |
| Cancel | Yes | Only for payments in PROCESSING status |
| Refund | Yes | Only for payments in PAID status |
| Get Details | Yes | Full payment history with captures and refunds |

* * *

## Special Features

### Payment Status Workflow

Atome payments follow a specific status flow:

| **Status** | **Description** | **Allowed Operations** |
| --- | --- | --- |
| PROCESSING | Customer completing payment | Cancel |
| PAID | Payment completed | Capture, Refund |

### Supported Currencies

Atome supports the following currencies (amounts in minor units):

*   SGD (Singapore Dollar)
*   HKD (Hong Kong Dollar)
*   MYR (Malaysian Ringgit)
*   THB (Thai Baht)
*   PHP (Philippine Peso)

### Amount Handling

All amounts are converted to minor units before sending to Atome:

*   Cent-based currencies: Amount × 100
*   Responses are converted back to decimal format

### Refund Tracking

Each refund is assigned a unique ID using the pattern:

```json
{OrderId}_{Timestamp}
```

This ensures unique tracking across all refund operations.

### Payment Details

When retrieving payment details, the following information is available:

*   Original order amount
*   Current refundable amount
*   Captured amount
*   Refunded amount
*   Payment status
*   Currency code
*   List of capture transactions
*   List of refund transactions with timestamps

* * *

## Error Handling

Atome errors are displayed on the order in the **Errors** section.

### Common Error Scenarios

| **Scenario** | **Resolution** |
| --- | --- |
| Payment still processing | Wait for customer to complete payment in Atome |
| Invalid status for operation | Check payment status before attempting operation |
| Payment not found | Verify transaction ID is correct |

* * *

## Limitations

The following operations are not supported by Atome:

*   Initial payment registration (handled by Atome checkout)
*   Authorization (payments come pre-authorized from Atome)
*   In-store payments
*   Status polling (use Get Details instead)

* * *

## Configuration Reference

### Payment Service

`Atome`

### Authentication

HTTP Basic Authentication using Client ID and API Token
