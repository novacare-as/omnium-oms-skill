# Walley

Source: https://docs.omnium.no/docs/plugins/Payments/Walley

> Configure Walley (formerly Collector) payment provider with Omnium for flexible payment options.

## Walley Integration with Omnium

Omnium supports **Walley** (formerly Collector) for payment processing with the following features:

*   **In-store purchases** with SMS payment link distribution
*   **Capture** payments
*   **Cancel** payments / release authorization
*   **Credit/Refund** payments with detailed validation
*   **Get Details** - Retrieve comprehensive payment information
*   **Authorization tracking** with expiration dates

Walley offers customers flexible payment options including credit services and various payment methods.

* * *

## Setup Instructions

### Configuration Path

1.  Navigate to: `Configuration > Settings > Payment > Payment Types > "..." > Add`

2.  Fill out the required fields as outlined below.

* * *

## Required Fields

| **Field** | **Description** | **Value** |
| --- | --- | --- |
| **Unique Payment Name** | The unique identifier for the Walley payment method. | `Walley` |
| **Payment Service** | The name of the payment service used for this configuration. | `Walley` |
| **Provider Name** | Specifies which provider to use. | `Walley` |
| **Display Name** | The name shown in the Omnium interface. | `Walley` or your preferred name |
| **Client ID** | Your Walley username for authentication. | Your username from Walley |
| **API Token** | Your Walley password for authentication. | Your password from Walley |
| **Base URL** | The Walley API endpoint URL. | See [Base URL Options](Walley.md#base-url-options) |
| **Vue Template** | The template for payment method integration. | `walley-payment` |

* * *

## Base URL Options

| **Environment** | **Base URL** |
| --- | --- |
| Test/UAT | `https://api.uat.walleydev.com/` |
| Production | `https://api.walley.se/` |

* * *

## Merchant ID Configuration

Walley supports flexible merchant ID configuration:

### Option 1: Global Merchant ID

Set the **Merchant ID** field in the payment configuration. This will be used for all stores.

### Option 2: Store-Level Merchant ID

Add a property named `WalleyMerchantId` to individual stores. This allows different stores to use different Walley merchant accounts.

**Configuration Priority:**

1.  System first checks for `WalleyMerchantId` property on the store
2.  Falls back to `Merchant ID` in payment settings if store property not found
3.  Error thrown if neither is configured

Store-level merchant IDs take precedence over the global setting. This only applies to in-store payments where Omnium creates the payment.

* * *

## Custom Profile Configuration

Walley supports custom profiles that can be configured for different stores and markets. When creating a paylink, the system will send the configured profile name to Walley.

Add a property named `WalleyCustomProfile` to stores, markets, or payment settings to configure a custom profile.

**Configuration Priority:**

1.  System first checks for `WalleyCustomProfile` property on the store
2.  Falls back to `WalleyCustomProfile` property on the market
3.  Falls back to `WalleyCustomProfile` property in payment settings
4.  If none found, no profile is sent

* * *

## Additional Configuration

| **Setting** | **Description** | **Default** |
| --- | --- | --- |
| **Display in Cart** | Show Walley as a payment option in the cart interface. | `true` |
| **Get Details From Provider** | Enable fetching real-time payment details from Walley. | `false` |
| **Valid On Markets** | Restrict to specific markets. Leave empty for all. | All markets |
| **Valid For Stores** | Restrict to specific stores. Leave empty for all. | All stores |

* * *

## Supported Operations

| **Operation** | **Supported** | **Notes** |
| --- | --- | --- |
| In-Store Registration | Yes | Creates payment with SMS link distribution |
| Capture | Yes | Full capture |
| Cancel | No | Use Release Remaining Auth instead |
| Release Remaining Auth | Yes | Cancels remaining authorization |
| Refund | Yes | With detailed item-level validation |
| Update Merchant Reference | Yes | Update order reference in Walley |
| Check Status | Yes | Check payment/checkout status |
| Get Details | Yes | Comprehensive payment information |

* * *

## Special Features

### SMS Payment Link Distribution

When creating in-store payments, Walley automatically distributes a payment link via SMS to the customer's mobile phone:

1.  Payment session is created in Walley
2.  SMS containing payment link is sent to customer's mobile number
3.  Customer completes payment on their device
4.  Payment status is updated in Omnium

**Requirement:** The customer's mobile phone number must be provided when creating the payment.

### Authorization Expiration Tracking

Walley returns an authorization expiration date with each payment. This allows you to:

*   Track when authorizations will expire
*   Plan fulfillment timing accordingly
*   Implement expiration warnings if needed

### Get Payment Details

When enabled, you can retrieve comprehensive payment information including:

*   Order details (amount, status, currency, country)
*   Item-level capture status
*   Item-level refund status
*   Remaining authorized amount
*   Payment creation and expiration dates
*   Complete payment breakdown

### Refund Validation

Omnium performs detailed validation when processing refunds:

1.  **Item Matching** - Validates that returned items exist in the Walley order
2.  **Price Comparison** - Compares prices with tolerance for rounding differences
3.  **VAT Verification** - Validates tax rates match
4.  **Status Checking** - Warns if items are already refunded or not yet captured
5.  **Detailed Logging** - Creates comprehensive comparison logs for troubleshooting

This validation helps identify discrepancies before they cause refund failures.

* * *

## Checkout Implementation

If implementing checkout yourself, add the payment object to the cart/order once ready:

1.  Set `Payment.TransactionId` to the Walley **OrderId**
2.  Set `Payment.ReservationId` to the Walley **CheckoutId**

We recommend creating a payment in the Omnium interface and following the object throughout the process. This helps understand how the payment object transforms.

* * *

## Multiple Merchant IDs

For different market/store combinations, you have two options:

### Option A: Separate Payment Configurations

Create separate payment settings with different merchant IDs and display names, then enable them for specific stores/markets.

### Option B: Store-Level Properties

Use a single payment configuration and add `WalleyMerchantId` property to each store that needs a different merchant account.

**Recommended:** For simpler setups, use a single merchant ID across all stores.

* * *

## Error Handling

Walley errors are displayed on the order in the **Errors** section.

### Common Issues

| **Issue** | **Possible Cause** | **Solution** |
| --- | --- | --- |
| Authentication failed | Invalid Client ID or API Token | Verify credentials with Walley |
| Merchant ID not found | Missing configuration | Set Merchant ID in settings or on store |
| SMS distribution failed | Invalid mobile number | Verify customer phone number format |
| Refund validation failed | Item mismatch between OMS and Walley | Check the detailed comparison log |

* * *

## Refund Handling Details

When processing refunds, the system:

1.  Retrieves the current order state from Walley
2.  Compares return items against Walley's order items
3.  Validates prices, quantities, and VAT rates
4.  Logs any mismatches for troubleshooting
5.  Proceeds with refund if validation passes

**Note:** The validation is advisory - refunds will be attempted even if minor mismatches are detected, but detailed logs are created for investigation.

* * *

## Configuration Reference

### Payment Service

`Walley`

### Store Properties

*   `WalleyMerchantId` - Store-level merchant ID override
*   `WalleyCustomProfile` - Custom Walley profile name for paylinks

### Market Property

*   `WalleyCustomProfile` - Custom Walley profile name for paylinks

### Payment Settings Property

*   `WalleyCustomProfile` - Custom Walley profile name for paylinks

### API Authentication

Basic authentication using Client ID (username) and API Token (password).
