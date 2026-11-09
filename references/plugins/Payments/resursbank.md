# Resursbank

Source: https://docs.omnium.no/docs/plugins/Payments/resursbank

> Configure Resursbank payment provider with Omnium for consumer financing and payment solutions.

## Resursbank Integration with Omnium

Omnium supports **Resursbank** for payment processing with the following features:

*   **Create Payment** with customer financing options
*   **Capture** payments (with amount limits)
*   **Release** authorizations
*   **Refund** payments
*   **Fetch Payment Methods** dynamically
*   **Get Details** - Retrieve comprehensive payment information
*   **Callback/Webhook** handling for payment status updates

* * *

## Setup Instructions

### Configuration Path

1.  Navigate to: `Configuration > Settings > Payment > Payment Types > "..." > Add`

2.  Fill out the required fields as outlined below.

* * *

## Required Fields

| **Field** | **Description** | **Value** |
| --- | --- | --- |
| **Unique Payment Name** | The unique identifier for the Resursbank payment method. | `ResursBank` |
| **Payment Service** | The name of the payment service used for this configuration. | `ResursBank` |
| **Provider Name** | Specifies which provider to use. | `ResursBank` |
| **Display Name** | The name shown in checkout. | `Resursbank` or your preferred name |
| **Client ID** | Your Resursbank client identifier for authentication. | Provided by Resursbank |
| **API Token** | Your Resursbank API secret for authentication. | Provided by Resursbank |
| **Base URL** | The Resursbank API endpoint URL. | See [Base URL Options](resursbank.md#base-url-options) |
| **Merchant ID** | Your store identifier in Resursbank (must be a valid GUID). | Your Store ID from Resursbank |
| **Vue Template** | The template for payment method integration. | `resursBank-payment` |

* * *

## Base URL Options

| **Environment** | **Base URL** |
| --- | --- |
| Test/Integration | `https://merchant-api.integration.resurs.com` |
| Production | `https://merchant-api.resurs.com` |

* * *

## Additional Configuration

| **Setting** | **Description** | **Default** |
| --- | --- | --- |
| **Display in Cart** | Show Resursbank as a payment option in the cart interface. | `true` |
| **Get Details From Provider** | Enable fetching real-time payment details from Resursbank. | `true` |
| **Authorization Time In Days** | Default authorization validity period. | 25 days |
| **Valid On Markets** | Restrict to specific markets. Leave empty for all. | All markets |
| **Valid For Stores** | Restrict to specific stores. Leave empty for all. | All stores |

* * *

## Supported Operations

| **Operation** | **Supported** | **Notes** |
| --- | --- | --- |
| Create Payment | Yes | With payment method selection |
| Capture | Yes | Amount limit of 50,000 per capture |
| Cancel | Yes | Only if not fully captured |
| Release Remaining Auth | Yes | Via cancel operation |
| Refund | Yes | Requires order lines |
| Fetch Payment Methods | Yes | Dynamic payment method list |
| Update Reference | Yes | Update order reference in Resursbank |
| Check Status | Yes | Payment status retrieval |
| Get Details | Yes | Complete payment history |

* * *

## Important Limits

### Capture Amount Limit

Resursbank enforces a **50,000 unit limit** per capture operation. Attempting to capture amounts over 50,000 will fail with a validation error.

This limit applies to the capture amount in the smallest currency unit (e.g., cents/ore).

* * *

## Fetch Payment Methods

Resursbank allows you to fetch available payment methods dynamically based on your merchant configuration. This is useful for:

*   Displaying available financing options to customers
*   Validating payment method availability before checkout
*   Showing maximum purchase limits for each method

Each payment method includes:

*   **ID** - Unique identifier (required for authorization)
*   **Name** - Display name
*   **Type** - Payment method type
*   **Max Purchase Limit** - Maximum allowed amount

* * *

## Get Payment Details

When **Get Details From Provider** is enabled, you can retrieve comprehensive payment information including:

*   **Order Information** - Amount, status, creation date
*   **Capture History** - All captures with timestamps and amounts
*   **Refund History** - All refunds with timestamps and amounts
*   **Order Lines** - Item-level details for each action
*   **Remaining Authorization** - Uncaptured authorized amount

* * *

## Validation Requirements

### Authorization Requirements

*   **Order Lines** - Cannot be null or empty
*   **Payment Method ID** - Must be provided (from Fetch Payment Methods)

### Capture Requirements

*   **Transaction ID** - Required
*   **Order Lines** - Cannot be null or empty
*   **Amount** - Must be greater than 0
*   **Amount Limit** - Cannot exceed 50,000

### Refund Requirements

*   **Transaction ID** - Required
*   **Order Lines** - Cannot be null or empty (item-level tracking)

If all order lines sum to zero, capture succeeds with zero amount without calling the API.

* * *

## Callback/Webhook Integration

Resursbank sends callbacks to notify Omnium of payment status changes:

### Callback Statuses

| **Resursbank Status** | **Omnium Status** | **Notes** |
| --- | --- | --- |
| AUTHORIZED | Processed | Payment authorized successfully |
| CAPTURED | Approved | Rare - capture handled by Omnium |
| FROZEN | Pending | Payment under review |
| REJECTED | Failed | Payment rejected |

Callbacks automatically transition awaiting authorizations to completed authorizations.

* * *

## Multiple Store Configuration

To use different merchant IDs for different markets or stores:

1.  Create multiple payment configurations
2.  Set different display names for each
3.  Assign each configuration to specific stores
4.  Each configuration uses its own Merchant ID

* * *

## Error Handling

Resursbank errors are displayed on the order in the **Errors** section.

### Common Errors

| **Error** | **Possible Cause** | **Solution** |
| --- | --- | --- |
| Authentication failed | Invalid Client ID or API Token | Verify credentials with Resursbank |
| Amount over 50,000 | Capture amount exceeds limit | Split into multiple captures |
| Invalid Merchant ID | Merchant ID not a valid GUID | Verify Merchant ID format |
| Order lines required | Missing order lines on operation | Ensure order lines are populated |
| Payment method required | Missing payment method ID on authorization | Select payment method from available options |

* * *

## Authorization Time

By default, Resursbank authorizations are valid for **25 days**. This can be configured via the **Authorization Time In Days** setting.

The authorization time is converted to minutes when sent to Resursbank and determines how long the payment reservation remains valid before automatic expiration.

* * *

## Payment Flow

1.  **Fetch Payment Methods** - Get available financing options
2.  **Customer selects method** - Payment method ID captured
3.  **Create Payment** - Authorization created with selected method
4.  **Callback received** - Payment status updated
5.  **Capture** - When order is ready for fulfillment
6.  **Refund** - Through returns workflow if needed

* * *

## Configuration Reference

### Payment Service

`ResursBank`

### Merchant ID Format

Must be a valid GUID (e.g., `12345678-1234-1234-1234-123456789012`)

### API Authentication

OAuth2 authentication using Client ID and API Token.
