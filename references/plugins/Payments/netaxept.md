# Netaxept

Source: https://docs.omnium.no/docs/plugins/Payments/netaxept

> Configure Netaxept (Nets) payment provider with Omnium for card payments in the Nordics.

## Netaxept Integration with Omnium

Omnium supports **Netaxept** (Nets) for card payment processing. This is the legacy Nets integration using XML-based APIs.

For the newer Nets Easy integration, see [Nets Easy](netsEasy.md).

### Supported Features

*   **Register** payment transactions
*   **Authorize** payments
*   **Capture** payments (full and partial)
*   **Cancel** (void) payments
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
| **Unique Payment Name** | The unique identifier for the Netaxept payment method. | `Netaxept` |
| **Payment Service** | The name of the payment service used for this configuration. | `Nets` |
| **Provider Name** | Specifies which provider to use. | `Nets` |
| **Display Name** | The name shown in the Omnium interface. | `Nets` or your preferred name |
| **Merchant ID** | Your Nets Merchant ID (Customer ID). | Your Merchant ID from Nets |
| **API Token** | Your Nets API Token. | Your API Token from Nets |
| **Base URL** | Netaxept API endpoint URL. | See [Base URL Options](netaxept.md#base-url-options) |

* * *

## Base URL Options

| **Environment** | **Base URL** |
| --- | --- |
| Test | `https://test.epayment.nets.eu/Netaxept/` |
| Production | `https://epayment.nets.eu/Netaxept/` |

* * *

## Supported Operations

| **Operation** | **Supported** | **Notes** |
| --- | --- | --- |
| Register | Yes | Creates payment transaction |
| Authorize | Yes | Authorizes registered payment |
| Capture | Yes | Full and partial capture supported |
| Cancel (Annul) | Yes | Void authorized payment |
| Refund (Credit) | Yes | Full and partial refunds supported |

* * *

## Payment Flow

### Standard Payment Flow

1.  **Register**: Create payment transaction with order details
2.  **Redirect**: Customer redirected to Nets payment page
3.  **Authorize**: Payment authorized after customer completes
4.  **Capture**: Capture authorized amount when fulfilling order
5.  **Refund**: Process refunds as needed

### Amount Handling

All amounts are converted to minor units (øre/cents) before sending:

*   `100.00 NOK` → `10000` øre
*   Responses are converted back to decimal format

* * *

## API Operations

### Register

Creates a new payment transaction in Netaxept.

**Parameters sent:**

*   Order number
*   Amount (in minor units)
*   Currency code
*   Redirect URL

**Returns:** Transaction ID for subsequent operations

### Authorize

Authorizes a registered payment after customer completion.

**Success criteria:** Response code equals "ok"

### Capture

Captures an authorized payment amount.

**Supports:**

*   Full capture (no amount specified)
*   Partial capture (specific amount)

### Cancel (Annul)

Cancels/voids an authorized payment before capture.

### Credit

Processes a refund for captured payments.

**Supports:**

*   Full refund (no amount specified)
*   Partial refund (specific amount)

* * *

## Error Handling

Netaxept errors are displayed on the order in the **Errors** section.

### Error Response Structure

Netaxept returns detailed error information including:

*   Error message
*   Error type
*   Response code
*   Response text
*   Transaction ID

### Error Types

| **Type** | **Description** |
| --- | --- |
| AuthenticationException | Invalid credentials |
| ValidationException | Invalid request parameters |
| BBSException | Payment processing error |
| UniqueTransactionIdException | Duplicate transaction ID |
| NotSupportedException | Operation not supported |

* * *

## Limitations

The following operations are not supported:

*   Direct capture (without authorization)
*   Status checking
*   Authorization updates
*   In-store payments
*   Get payment details

* * *

## Configuration Reference

### Payment Service

`Nets`

### API Format

XML-based REST API

### Related Provider

For the newer API, see [Nets Easy](netsEasy.md)
