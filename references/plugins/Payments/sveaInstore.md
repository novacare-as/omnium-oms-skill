# Svea InStore

Source: https://docs.omnium.no/docs/plugins/Payments/sveaInstore

> Configure Svea InStore payment provider with Omnium for POS and in-store payments.

## Svea InStore Integration with Omnium

Omnium supports **Svea InStore** for point-of-sale and in-store payment processing. This provider extends Svea Checkout with additional in-store capabilities.

### Supported Features

*   **In-store payment registration** with embedded UI
*   **Payment status checking**
*   **Payment cancellation**
*   **Direct capture support** for Swish and Trustly

* * *

## Setup Instructions

### Configuration Path

1.  Navigate to: `Configuration > Settings > Payment > Payment Types > "..." > Add`

2.  Fill out the required fields as outlined below.

* * *

## Required Fields

| **Field** | **Description** | **Value** |
| --- | --- | --- |
| **Unique Payment Name** | The unique identifier for the Svea InStore payment method. | `SveaInStore` |
| **Payment Service** | The name of the payment service used for this configuration. | `SveaInStore` |
| **Provider Name** | Specifies which provider to use. | `SveaInStore` |
| **Display Name** | The name shown in the Omnium interface. | `Svea InStore` or your preferred name |
| **Merchant ID** | Your Svea Merchant ID (used as username for Basic auth). | Your Merchant ID from Svea |
| **API Token** | Your Svea API Token (used as password for Basic auth). | Your API Token from Svea |
| **Base URL** | Svea API endpoint URL. | See Svea Checkout documentation |

* * *

## Supported Operations

| **Operation** | **Supported** | **Notes** |
| --- | --- | --- |
| In-Store Registration | Yes | Creates order and returns embedded UI URL |
| Check Status | Yes | Verify payment completion |
| Cancel | Yes | Cancel payment |
| Capture | Yes | Via Svea Checkout (inherited) |
| Refund | Yes | Via Svea Checkout (inherited) |

* * *

## Special Features

### B2B Support

Svea InStore supports B2B customers with organization/tax ID for business purchases.

### Payment Method Support

Supports multiple payment types including:

*   Card payments
*   Swish (direct capture)
*   Trustly (direct capture with delay handling)

### Embedded UI

Returns an `InstoreUiUri` for embedding the payment interface in your POS system.

* * *

## Relationship to Svea Checkout

Svea InStore extends Svea Checkout, inheriting its capture, refund, and credit capabilities. See [Svea Checkout](sveaCheckout.md) for detailed operation documentation.

* * *

## Configuration Reference

### Payment Service

`SveaInStore`

### Related Provider

Svea Checkout (`SveaCheckout`)
