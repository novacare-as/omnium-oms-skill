# Authorize.Net

Source: https://docs.omnium.no/docs/plugins/Payments/authorizeNet

> Configure Authorize.Net payment provider with Omnium for card payments.

## Authorize.Net Integration with Omnium

Omnium supports **Authorize.Net** for payment processing with the following features:

*   **Authorize** payments (authorization only)
*   **Direct Capture** (authorize and capture in one step)
*   **Capture** previously authorized payments
*   **Cancel** payments / void transactions
*   **Credit/Refund** payments

* * *

## Setup Instructions

### Configuration Path

1.  Navigate to: `Configuration > Settings > Payment > Payment Types > "..." > Add`

2.  Fill out the required fields as outlined below.

* * *

## Required Fields

| **Field** | **Description** | **Value** |
| --- | --- | --- |
| **Unique Payment Name** | The unique identifier for the Authorize.Net payment method. | `AuthorizeNet` |
| **Payment Service** | The name of the payment service used for this configuration. | `AuthorizeNet` |
| **Provider Name** | Specifies which provider to use. | `AuthorizeNet` |
| **Display Name** | The name shown in the Omnium interface. | `Authorize.Net` or your preferred name |
| **Merchant ID** | Your Authorize.Net API Login ID. | Your Login ID from Authorize.Net |
| **API Token** | Your Authorize.Net Transaction Key. | Your Transaction Key from Authorize.Net |
| **Base URL** | Environment selector. | `production` or any other value for sandbox |

* * *

## Environment Configuration

| **Base URL Value** | **Environment** |
| --- | --- |
| `production` | Production |
| Any other value | Sandbox/Test |

* * *

## Supported Operations

| **Operation** | **Supported** | **Notes** |
| --- | --- | --- |
| Authorize | Yes | Authorization only (no capture) |
| Direct Capture | Yes | Authorize + capture in one step |
| Prior Auth Capture | Yes | Capture previously authorized amount |
| Cancel | Yes | Void transaction |
| Refund | Yes | With order line details |

* * *

## Special Features

### Direct Capture

Authorize.Net supports direct capture mode, which authorizes and captures in a single transaction. This is useful for immediate payment processing.

### Customer Profiles

Optionally supports customer profile-based payments for returning customers.

### Tax and Shipping

Supports separate tax and shipping amounts for partial capture scenarios.

* * *

## Error Handling

Authorize.Net errors are displayed on the order in the **Errors** section.

* * *

## Configuration Reference

### Payment Service

`AuthorizeNet`
