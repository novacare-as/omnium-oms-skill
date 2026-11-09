# Toss

Source: https://docs.omnium.no/docs/plugins/Payments/toss

> Configure Toss payment provider with Omnium for Korean payment processing.

## Toss Integration with Omnium

Omnium supports **Toss** for payment processing in the Korean market. This provider handles post-payment operations including refunds and capture verification.

### Supported Features

*   **Capture verification** - Verify payment completion status
*   **Cancel** payments
*   **Credit/Refund** payments (full and partial)

* * *

## Setup Instructions

### Configuration Path

1.  Navigate to: `Configuration > Settings > Payment > Payment Types > "..." > Add`

2.  Fill out the required fields as outlined below.

* * *

## Required Fields

| **Field** | **Description** | **Value** |
| --- | --- | --- |
| **Unique Payment Name** | The unique identifier for the Toss payment method. | `Toss` |
| **Payment Service** | The name of the payment service used for this configuration. | `Toss` |
| **Provider Name** | Specifies which provider to use. | `Toss` |
| **Display Name** | The name shown in the Omnium interface. | `Toss` or your preferred name |
| **API Token** | Your Toss API Key. | Your API Key from Toss |
| **Base URL** | Toss API endpoint URL. | `https://api.tosspayments.com` |

* * *

## Supported Operations

| **Operation** | **Supported** | **Notes** |
| --- | --- | --- |
| Capture Verification | Yes | Verifies payment status is "DONE" |
| Cancel | Yes | Refunds full payment amount |
| Refund | Yes | Partial and full refunds supported |

* * *

## Special Features

### Capture Verification

The provider can verify if a payment has been successfully captured by checking the payment status:

| **Status** | **Meaning** |
| --- | --- |
| DONE | Payment successfully completed |
| Other | Payment not yet finalized |

### Refund Processing

Refunds are processed with:

*   **Cancel Amount**: The amount to refund
*   **Cancel Reason**: Reason for the refund (defaults to "Return" if not specified)

### Order Cancellation

When cancelling an order, the provider:

1.  Retrieves the original payment amount from the order
2.  Processes a full refund with reason "Order canceled"

* * *

## Error Handling

Toss errors are displayed on the order in the **Errors** section.

### Common Scenarios

| **Scenario** | **Resolution** |
| --- | --- |
| Payment amount not found | Verify order has associated payment |
| Invalid payment status | Check payment has completed before refunding |
| API communication error | Check API credentials and connectivity |

* * *

## Limitations

The following operations are not supported:

*   Initial payment registration (handled by Toss checkout)
*   Payment authorization
*   Direct capture
*   In-store payments
*   Status polling
*   Get payment details

Toss is designed for post-payment operations. Initial payment creation is handled through the Toss checkout flow on your storefront.

* * *

## Configuration Reference

### Payment Service

`Toss`

### Authentication

HTTP Basic Authentication using API Token

### Market

South Korea (KRW)
