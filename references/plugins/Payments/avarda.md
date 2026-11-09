# Avarda

Source: https://docs.omnium.no/docs/plugins/Payments/avarda

> Configure Avarda payment provider with Omnium for flexible payment options.

## Avarda Integration with Omnium

Omnium supports **Avarda** for payment processing with the following features:

*   **Capture** payments with order line validation
*   **Cancel** payments
*   **Credit/Refund** payments with order line details
*   **Release Remaining Authorization**
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
| **Unique Payment Name** | The unique identifier for the Avarda payment method. | `Avarda` |
| **Payment Service** | The name of the payment service used for this configuration. | `Avarda` |
| **Provider Name** | Specifies which provider to use. | `Avarda` |
| **Display Name** | The name shown in the Omnium interface. | `Avarda` or your preferred name |
| **Merchant ID** | Your Avarda Client ID. | Your Client ID from Avarda |
| **API Token** | Your Avarda Client Secret. | Your Client Secret from Avarda |
| **Base URL** | Avarda API endpoint URL. | Your Avarda API URL |

* * *

## Supported Operations

| **Operation** | **Supported** | **Notes** |
| --- | --- | --- |
| Capture | Yes | With order line validation |
| Cancel | Yes | Cancel authorized payment |
| Release Remaining Auth | Yes | Release uncaptured portion |
| Refund | Yes | With order line and shipment details |
| Get Details | Yes | Retrieve payment status |

* * *

## Special Features

### Order Line Validation

Avarda validates that capture amounts match order line totals, ensuring accurate payment processing.

### Zero-Amount Captures

Supports scenarios with 100% discounts where the capture amount is zero.

### Token Caching

Authentication tokens are cached until they expire (refreshed shortly before expiration) to improve performance.

* * *

## Error Handling

Avarda errors are displayed on the order in the **Errors** section.

* * *

## Configuration Reference

### Payment Service

`Avarda`
