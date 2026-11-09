# PayPal

Source: https://docs.omnium.no/docs/plugins/Payments/paypal

> Configure PayPal payment provider with Omnium for online payments.

## PayPal Integration with Omnium

Omnium supports **PayPal** for payment processing with the following features:

*   **Authorize** payments via PayPal checkout
*   **Capture** payments (full or partial)
*   **Cancel** payments / void authorization
*   **Credit/Refund** payments with multi-capture support

* * *

## Setup Instructions

### Configuration Path

1.  Navigate to: `Configuration > Settings > Payment > Payment Types > "..." > Add`

2.  Fill out the required fields as outlined below.

* * *

## Required Fields

| **Field** | **Description** | **Value** |
| --- | --- | --- |
| **Unique Payment Name** | The unique identifier for the PayPal payment method. | `PayPal` |
| **Payment Service** | The name of the payment service used for this configuration. | `PayPal` |
| **Provider Name** | Specifies which provider to use. | `PayPal` |
| **Display Name** | The name shown in the Omnium interface. | `PayPal` or your preferred name |
| **Client ID** | Your PayPal OAuth 2.0 Client ID. | Your Client ID from PayPal Developer Portal |
| **API Token** | Your PayPal API Secret/Token. | Your Secret from PayPal Developer Portal |
| **Base URL** | Environment selector. | `sandbox` or `production` |
| **Vue Template** | The template for payment method integration. | `paypal-payment` |

* * *

## Environment Configuration

| **Base URL Value** | **Environment** | **Description** |
| --- | --- | --- |
| `sandbox` | Sandbox/Test | For development and testing |
| `production` | Live | For production transactions |

* * *

## Additional Configuration

| **Setting** | **Description** | **Default** |
| --- | --- | --- |
| **Display in Cart** | Show PayPal as a payment option in the cart interface. | `false` |
| **Authorization Time In Days** | Default authorization expiration time in days. | \- |
| **Valid On Markets** | Restrict to specific markets. Leave empty for all. | All markets |
| **Valid For Stores** | Restrict to specific stores. Leave empty for all. | All stores |

* * *

## Supported Operations

| **Operation** | **Supported** | **Notes** |
| --- | --- | --- |
| Authorize | Yes | Via PayPal checkout button |
| Capture | Yes | Full or partial capture |
| Partial Capture | Yes | Multiple captures supported |
| Cancel | Yes | Void authorization |
| Refund | Yes | With multi-capture tracking |
| Partial Refund | Yes | Distributed across captures |
| Get Details | No | Not implemented |

* * *

## Special Features

### Multi-Capture Refund Support

PayPal integration includes sophisticated handling for refunds across multiple partial captures:

**How it works:**

1.  When an order has multiple partial captures, the system tracks each capture separately
2.  Refunds are distributed across captures based on available credit per capture
3.  The system tracks how much has been credited from each capture

**Example:**

*   Order total: $100
*   Capture 1: $50 (first shipment)
*   Capture 2: $50 (second shipment)
*   Customer requests $60 refund
*   System refunds: $50 from Capture 1, $10 from Capture 2

**Tracking:**

*   Each capture's credited amount is tracked in payment properties
*   Partial refund success is reported when full amount cannot be credited

### Final Capture Flag

When capturing the full remaining authorized amount, the system automatically sets the "final capture" flag, which:

*   Releases any remaining authorization
*   Signals to PayPal that no more captures will be made

* * *

## Payment Flow

1.  **Customer Checkout** - PayPal button displayed in checkout
2.  **Authorization** - Customer authorizes payment in PayPal
3.  **Order Created** - Authorization ID and Payment ID stored
4.  **Capture** - When order is ready for fulfillment
5.  **Refund** - Through returns workflow if needed

* * *

## Amount Handling

PayPal requires amounts formatted as decimal strings with two decimal places:

| **Internal Amount** | **PayPal Format** |
| --- | --- |
| 100.50 | "100.50" |
| 250.00 | "250.00" |
| 99.99 | "99.99" |

Omnium handles the formatting automatically.

* * *

## Error Handling

PayPal errors are displayed on the order in the **Errors** section.

### Common Errors

| **Error** | **Possible Cause** | **Solution** |
| --- | --- | --- |
| Authentication failed | Invalid Client ID or API Token | Verify credentials in PayPal Developer Portal |
| Capture failed | Authorization expired or invalid | Check authorization status |
| Void failed | Payment already captured | Use refund instead of cancel |
| Partial refund failed | Insufficient captured amount | Verify capture amounts before refunding |

### Partial Refund Warning

If the full refund amount cannot be credited across all captures, the system returns a partial success with message:

> "Failed to credit complete amount. Only credited: \[amount\]"

* * *

## Checkout Integration

PayPal checkout uses the PayPal Checkout button with authorization intent:

1.  PayPal button rendered in checkout page
2.  Customer clicks and authorizes in PayPal popup
3.  Authorization ID returned to Omnium
4.  Order created with payment reference

* * *

## Configuration Reference

### Payment Service

`PayPal`

### Environment Values

*   `sandbox` - Test environment
*   `production` - Live environment

### API Library

PayPal SDK v2.0 (BraintreeHttp)

### Supported Currencies

All currencies supported by PayPal
