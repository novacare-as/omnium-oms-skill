# PayEx

Source: https://docs.omnium.no/docs/plugins/Payments/payex

> Configure PayEx (Swedbank Pay) with Omnium to process card payments.

## PayEx Integration with Omnium

Omnium supports **PayEx** (Swedbank Pay) for card payment processing, providing the following features:

*   **Capture** authorized payments (full or partial)
*   **Cancel** payments / release authorization
*   **Credit/Refund** payments

This integration handles the post-authorization workflow, allowing you to manage captures and refunds for payments authorized through your e-commerce platform.

* * *

## Setup Instructions

Follow these steps to configure PayEx in Omnium.

### Configuration Path

1.  Navigate to: `Configuration > Settings > Payment > Payment Types > "..." > Add`

2.  Fill out the required fields as outlined below.

* * *

## Required Fields

| **Field** | **Description** | **Value** |
| --- | --- | --- |
| **Unique Payment Name** | The unique identifier for the PayEx payment method. | `PayEx` |
| **Payment Service** | The name of the payment service used for this configuration. | `PayEx` |
| **Provider Name** | Specifies which provider to use for processing the payment. | `PayEx` |
| **Display Name** | The name shown in the Omnium interface. | `PayEx` or your preferred name |
| **Base URL** | The PayEx API endpoint URL. | See [Base URL Options](payex.md#base-url-options) |
| **API Token** | Your PayEx authentication token (Bearer token). | Your API Token from PayEx |
| **Vue Template** | The template for payment method integration. | `payEx-payment` |

* * *

## Base URL Options

Use the appropriate Base URL for your environment:

| **Environment** | **Base URL** |
| --- | --- |
| Test/Sandbox | `https://api.externalintegration.payex.com` |
| Production | `https://api.payex.com` |

* * *

## Additional Configuration

### Display Options

| **Setting** | **Description** | **Default** |
| --- | --- | --- |
| **Display in Cart** | Show this payment option in the cart interface. | `false` |
| **Editable** | Allow editing payment details in the interface. | `false` |
| **Hidden** | Hide this payment method from the interface. | `false` |
| **Read Only** | Make this payment method read-only. | `false` |

### Market & Store Restrictions

| **Setting** | **Description** | **Default** |
| --- | --- | --- |
| **Valid On Markets** | Restrict to specific markets. Leave empty for all. | All markets |
| **Valid For Stores** | Restrict to specific stores. Leave empty for all. | All stores |

### Priority Settings

| **Setting** | **Description** | **Default** |
| --- | --- | --- |
| **Credit Priority** | Priority for refunds when order has multiple payments. Lower = higher priority. | `0` |
| **Capture Priority** | Priority for captures when order has multiple payments. Lower = higher priority. | `0` |

* * *

## Supported Operations

| **Operation** | **Supported** | **Notes** |
| --- | --- | --- |
| Capture | Yes | Full or partial capture |
| Partial Capture | Yes | Capture portion of authorized amount |
| Cancel | Yes | Cancel/void authorization |
| Release Remaining Auth | Yes | Release uncaptured portion of authorization |
| Refund | Yes | Full or partial refunds |
| Partial Refund | Yes | Refund portion of captured amount |
| Get Details | No | Not supported |
| Update Authorization | No | Not supported |
| Extend Authorization | No | Not supported |

* * *

## Payment Flow

PayEx integration in Omnium handles the **post-authorization** workflow:

1.  **Authorization** is obtained through your e-commerce platform (not in Omnium)
2.  Order with PayEx payment arrives in Omnium with authorization reference
3.  **Capture** is performed when order is ready for fulfillment
4.  **Refund** is performed through returns workflow when needed
5.  **Cancel** can release authorization if order is cancelled before capture

* * *

## Amount Handling

PayEx uses **minor units** (cents) for all amounts:

| **Currency** | **Example Amount** | **PayEx Value** |
| --- | --- | --- |
| SEK | 100.50 | 10050 |
| NOK | 250.00 | 25000 |
| EUR | 99.99 | 9999 |

Omnium handles the conversion automatically.

* * *

## Capture Behavior

When capturing a payment:

*   The capture amount can be less than or equal to the authorized amount
*   Partial captures are supported
*   A unique PayEx transaction number is stored on the order for reference
*   The description is limited to 40 characters

* * *

## Refund Behavior

When refunding a payment:

*   The refund amount can be less than or equal to the captured amount
*   Partial refunds are supported
*   Refunds are processed against the original capture
*   An optional comment can be included with the refund

* * *

## Error Handling

PayEx errors are displayed on the order in the **Errors** section. Common error scenarios include:

| **Error** | **Possible Cause** | **Solution** |
| --- | --- | --- |
| Authentication failed | Invalid or expired API Token | Verify API Token in PayEx portal |
| Capture failed | Authorization expired or already captured | Check authorization status |
| Refund failed | Amount exceeds captured amount | Verify captured amount before refunding |
| Cancel failed | Payment already captured | Captured payments must be refunded, not cancelled |

* * *

## Integration Notes

### Description Limits

PayEx enforces a **40-character limit** on descriptions. Longer descriptions are automatically truncated.

### Transaction References

Each operation generates a unique reference ID used for tracking in the PayEx system. These references are useful when contacting PayEx support.

### API Pattern

PayEx uses a RESTful API with dynamic operation URLs. Omnium discovers available operations from each API response, ensuring compatibility with API changes.

* * *

## Troubleshooting

### Payment Not Capturing

1.  Verify the authorization has not expired
2.  Check that the capture amount does not exceed the authorized amount
3.  Ensure the API Token is valid and has capture permissions

### Refund Not Processing

1.  Verify the payment was successfully captured first
2.  Check that the refund amount does not exceed the captured amount
3.  Review the error message in the order's Errors section

### Authorization Release Failed

1.  Verify the payment has not already been captured
2.  If captured, use refund instead of cancel

* * *

## Configuration Reference

### Payment Service

`PayEx`

### Supported Currencies

All currencies supported by PayEx (SEK, NOK, DKK, EUR, etc.)

### API Authentication

Bearer token authentication via the `API Token` configuration field.
