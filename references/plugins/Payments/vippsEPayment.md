# Vipps ePayment

Source: https://docs.omnium.no/docs/plugins/Payments/vippsEPayment

> Configure Vipps ePayment provider with Omnium for Norwegian mobile payments.

## Vipps ePayment Integration with Omnium

Omnium supports **Vipps ePayment** (the newer Vipps API) for payment processing with the following features:

*   **In-store payment initiation**
*   **Capture** payments
*   **Cancel** payments
*   **Credit/Refund** payments
*   **Status checking** and authorization updates
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
| **Unique Payment Name** | The unique identifier for the Vipps ePayment method. | `VippsEPayment` |
| **Payment Service** | The name of the payment service used for this configuration. | `VippsEPayment` |
| **Provider Name** | Specifies which provider to use. | `VippsEPayment` |
| **Display Name** | The name shown in the Omnium interface. | `Vipps` or your preferred name |
| **Client ID** | Your Vipps Client ID for OAuth authentication. | Your Client ID from Vipps |
| **API Token** | Your Vipps Client Secret. | Your Client Secret from Vipps |
| **Merchant ID** | Your Vipps Merchant Serial Number. | Your MSN from Vipps |
| **Subscription Key** | Your Vipps API Subscription Key. | Your Subscription Key from Vipps |
| **Base URL** | Vipps API endpoint URL. | See [Base URL Options](vippsEPayment.md#base-url-options) |
| **Fallback URL** | URL for payment failure/cancel scenarios. | Your fallback URL |

* * *

## Base URL Options

| **Environment** | **Base URL** |
| --- | --- |
| Test | `https://apitest.vipps.no` |
| Production | `https://api.vipps.no` |

* * *

## Supported Operations

| **Operation** | **Supported** | **Notes** |
| --- | --- | --- |
| In-Store Registration | Yes | Creates payment in Vipps |
| Capture | Yes | Capture authorized payment |
| Cancel | Yes | Cancel payment |
| Refund | Yes | With negative amount validation |
| Check Status | Yes | Update authorization status |
| Get Details | Yes | Retrieve payment information |

* * *

## Special Features

### Multi-Tenant Support

Callback URLs include tenant ID for proper routing in multi-tenant environments.

### Multiple Payment Attempts

Supports tracking multiple payment attempts on the same order with distinct transaction IDs.

### Bearer Token Authentication

Uses OAuth access token for API authentication.

* * *

## Difference from Vipps (Legacy)

This provider uses the newer Vipps ePayment API. For the legacy Vipps integration, see [Vipps](vipps.md).

* * *

## Error Handling

Vipps errors are displayed on the order in the **Errors** section.

* * *

## Configuration Reference

### Payment Service

`VippsEPayment`

### Default Currency

NOK (Norwegian Krone)
