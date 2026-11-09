# NGenius

Source: https://docs.omnium.no/docs/plugins/Payments/ngenius

> Configure NGenius (Network International) payment provider with Omnium.

## NGenius Integration with Omnium

Omnium supports **NGenius** (Network International) for payment processing with the following features:

*   **Authorize** payments with hosted payment page
*   **Capture** payments
*   **Cancel** payments
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
| **Unique Payment Name** | The unique identifier for the NGenius payment method. | `NGenius` |
| **Payment Service** | The name of the payment service used for this configuration. | `NGenius` |
| **Provider Name** | Specifies which provider to use. | `NGenius` |
| **Display Name** | The name shown in the Omnium interface. | `NGenius` or your preferred name |
| **Merchant ID** | Your NGenius Outlet/Merchant ID. | Your Outlet ID from NGenius |
| **API Token** | Your NGenius API Key (Base64 encoded). | Your API Key from NGenius |
| **Base URL** | NGenius API endpoint URL. | Your NGenius API URL |

* * *

## Supported Operations

| **Operation** | **Supported** | **Notes** |
| --- | --- | --- |
| Authorize | Yes | Returns hosted payment page URL |
| Capture | Yes | Using stored PaymentId |
| Cancel | Yes | Cancel authorized payment |
| Refund | Yes | Using capture ID URL |
| Get Details | Yes | Retrieve payment status |

* * *

## Special Features

### Hosted Payment Page

NGenius provides a hosted payment page (HPP) for secure card entry. The authorization operation returns a redirect URL for the customer.

### Token Caching

Authentication tokens are cached for 3 minutes to improve performance.

### Payment ID Tracking

PaymentId and CaptureIdUrl are stored in transaction properties for subsequent operations.

* * *

## Error Handling

NGenius errors are displayed on the order in the **Errors** section.

* * *

## Configuration Reference

### Payment Service

`NGenius`
