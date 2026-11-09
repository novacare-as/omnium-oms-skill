# Aera

Source: https://docs.omnium.no/docs/plugins/Payments/aera

> Configure Aera payment provider with Omnium for card and invoice payments.

## Aera Integration with Omnium

Omnium supports **Aera** payment processing with two distinct payment methods:

*   **Aera** - Card payment processing
*   **Aera Invoice** - Invoice-based payments (separate configuration)

### Supported Features

*   **Authorize** payments via in-store app integration
*   **Capture** payments (with automatic fallback if authorization expires)
*   **Cancel** payments / release authorization
*   **Credit/Refund** payments with item-level granularity
*   **Get Details** - Retrieve comprehensive payment information
*   **Import Payments** - Sync payment history from Aera

* * *

## Setup Instructions

### Configuration Path

1.  Navigate to: `Configuration > Settings > Payment > Payment Types > "..." > Add`

2.  Fill out the required fields as outlined below.

* * *

## Required Fields

| **Field** | **Description** | **Value** |
| --- | --- | --- |
| **Unique Payment Name** | The unique identifier for the Aera payment method. | `Aera` |
| **Payment Service** | The name of the payment service used for this configuration. | `Aera` |
| **Provider Name** | Specifies which provider to use for processing the payment. | `Aera` |
| **Display Name** | The name shown in the Omnium interface. | `Aera` or your preferred name |
| **Base URL** | The Aera API endpoint URL. | See [Base URL Options](aera.md#base-url-options) |
| **API Token** | Your Aera authentication token. | Your API Token from Aera |
| **Vue Template** | The template for payment method integration. | `aera-payment` |

### Authentication Properties

Add these as custom properties in the payment configuration:

| **Property** | **Description** |
| --- | --- |
| **Username** | Your Aera OAuth2 username |
| **Password** | Your Aera OAuth2 password |

* * *

## Base URL Options

| **Environment** | **Base URL** |
| --- | --- |
| Test/Staging | `https://api-staging.aerahost.com` |
| Production | `https://api.aerahost.com` |

* * *

## Merchant ID Configuration

Aera supports flexible merchant ID configuration with two options:

### Option 1: Global Merchant ID

Set the **Merchant ID** field in the payment configuration. This will be used for all stores.

### Option 2: Store-Level Merchant ID

Add a property named `AeraMerchantId` to individual stores. This allows different stores to use different Aera merchant accounts.

**Configuration Priority:**

1.  If `Merchant ID` is set in payment settings, it is used for all stores
2.  If `Merchant ID` is empty, the system looks for the `AeraMerchantId` property on the store
3.  If neither is configured, an error is thrown

Store-level merchant IDs are only checked when the global Merchant ID is not set in the payment configuration.

* * *

## Additional Configuration

| **Setting** | **Description** | **Default** |
| --- | --- | --- |
| **Display in Cart** | Show Aera as a payment option in the cart interface. | `true` |
| **Get Details From Provider** | Enable fetching real-time payment details from Aera. | `true` |
| **Valid On Markets** | Restrict to specific markets. Leave empty for all. | All markets |
| **Valid For Stores** | Restrict to specific stores. Leave empty for all. | All stores |

* * *

## Supported Operations

| **Operation** | **Aera (Card)** | **Aera Invoice** | **Notes** |
| --- | --- | --- | --- |
| Authorize | Yes | No | In-store app-based authorization |
| Capture | Yes | Yes | Full capture with auto-fallback |
| Partial Capture | No | Yes | Invoice supports partial activation |
| Cancel | Yes | Yes | Full authorization cancellation |
| Release Remaining Auth | Yes | Yes | Release partial authorization |
| Refund | Yes | Yes | Full or partial with item-level detail |
| Get Details | Yes | No | Comprehensive payment breakdown |
| Import Payments | Yes | No | Sync payment history |
| In-Store Registration | Yes | No | Creates payment session with app URL |
| Check Status | Yes | Yes | Payment status retrieval |

* * *

## Special Features

### Automatic Capture Fallback

When capturing a payment, if the authorization has expired, Aera automatically attempts a **Collect** transaction instead. This provides resilience for orders with longer fulfillment times.

**Flow:**

1.  Capture is attempted against the authorization
2.  If authorization has expired, system automatically tries Collect
3.  If Collect also fails, the operation returns an error

This behavior is automatic and requires no configuration.

### Get Payment Details

When **Get Details From Provider** is enabled, you can retrieve comprehensive payment information including:

*   Authorization details (amount, code, expiration)
*   Capture history (multiple captures tracked individually)
*   Refund history (individual refund transactions)
*   Cancellation tracking
*   Masked card number (last 4 digits)
*   Payment scheme and card type

### Import Payment History

Aera supports importing complete payment history for reconciliation purposes. This creates payment records for all transactions:

| **Aera Transaction Type** | **Omnium Transaction Type** |
| --- | --- |
| CardAuthorize | Authorization |
| Capture | Capture |
| Void | Release Remaining Authorization |
| Refund | Credit |

* * *

## Adding Payments via API

Payments can be added to orders programmatically using the endpoint:

```
POST /api/Orders/{orderId}/AddPayments
```

**Important:** Set the payment status to `Processed` and match the payment method name with your configuration.

**Transaction ID Handling:**

*   If the Transaction ID is a GUID format, it's treated as a **payment reference** from Aera
*   Other formats are treated as **transaction IDs**

* * *

## Aera Invoice

Aera Invoice is a separate payment method for invoice-based payments. It requires its own configuration.

### Invoice Configuration

| **Field** | **Value** |
| --- | --- |
| **Payment Service** | `AeraInvoice` |
| **Provider Name** | `Aera` |
| **Vue Template** | `aera-payment` |

### Invoice-Specific Operations

*   **Activate Invoice** - Full invoice activation (capture)
*   **Partially Activate Invoice** - Capture specific items
*   **Credit Invoice** - Return specific items
*   **Adjust Invoice** - General credits without item-level detail

In-store payment registration is not supported for Aera Invoice.

* * *

## Error Handling

Aera errors are displayed on the order in the **Errors** section. All operations use idempotency keys to prevent duplicate processing.

### Common Issues

| **Issue** | **Possible Cause** | **Solution** |
| --- | --- | --- |
| Authentication failed | Invalid credentials | Verify Username, Password, and API Token |
| Merchant ID not found | Missing configuration | Set Merchant ID in settings or on store |
| Capture failed after retry | Authorization expired and Collect also failed | Contact Aera support |
| Invalid payment reference | Wrong format in API call | Use GUID for payment reference, other for transaction ID |

* * *

## Configuration Reference

### Payment Service Values

*   Aera Card: `Aera`
*   Aera Invoice: `AeraInvoice`

### Store Property

*   `AeraMerchantId` - Store-level merchant ID override

### API Authentication

OAuth2 Password Grant flow using configured Username and Password credentials.
