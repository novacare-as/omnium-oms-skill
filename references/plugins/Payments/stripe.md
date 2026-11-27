# Stripe

Source: https://docs.omnium.no/docs/plugins/Payments/stripe

> Configure Stripe payment provider with Omnium for online payments.

## Stripe Integration with Omnium

Omnium supports **Stripe** for payment processing using the PaymentIntent API with the following features:

*   **Capture** authorized payments
*   **Cancel** payments / void authorization
*   **Credit/Refund** payments
*   **Get Details** - Retrieve comprehensive payment information

* * *

## Setup Instructions

### Configuration Path

1.  Navigate to: `Configuration > Settings > Payment > Payment Types > "..." > Add`

2.  Fill out the required fields as outlined below.

* * *

## Required Fields

| **Field** | **Description** | **Value** |
| --- | --- | --- |
| **Unique Payment Name** | The unique identifier for the Stripe payment method. | `Stripe` |
| **Payment Service** | The name of the payment service used for this configuration. | `Stripe` |
| **Provider Name** | Specifies which provider to use. | `Stripe` |
| **Display Name** | The name shown in the Omnium interface. | `Stripe` or your preferred name |
| **API Token** | Your Stripe Secret API Key. | `sk_live_...` or `sk_test_...` |
| **Client ID** | Your Stripe Account/Client identifier. | Your Account ID from Stripe |

* * *

## Environment Configuration

Stripe automatically determines the environment based on your API key:

| **API Key Prefix** | **Environment** |
| --- | --- |
| `sk_test_` | Test/Sandbox |
| `sk_live_` | Production |

No separate Base URL configuration is required.

* * *

## Additional Configuration

| **Setting** | **Description** | **Default** |
| --- | --- | --- |
| **Display in Cart** | Show Stripe as a payment option in the cart interface. | `false` |
| **Get Details From Provider** | Enable fetching real-time payment details from Stripe. | `false` |
| **Valid On Markets** | Restrict to specific markets. Leave empty for all. | All markets |
| **Valid For Stores** | Restrict to specific stores. Leave empty for all. | All stores |

* * *

## Supported Operations

| **Operation** | **Supported** | **Notes** |
| --- | --- | --- |
| Capture | Yes | Capture PaymentIntent |
| Partial Capture | Yes | Capture portion of authorized amount |
| Cancel | Yes | Cancel PaymentIntent |
| Refund | Yes | Full or partial refunds |
| Partial Refund | Yes | Refund portion of captured amount |
| Get Details | Yes | Complete payment history |
| Authorization | No | Created externally (Stripe.js/Elements) |
| In-Store Registration | No | Not supported |

* * *

## Payment Flow

Stripe integration handles the **post-authorization** workflow:

1.  **PaymentIntent Created** - Customer completes payment via Stripe.js or Stripe Elements
2.  **Order Received** - Omnium receives order with PaymentIntent ID as transaction reference
3.  **Capture** - When order is ready for fulfillment
4.  **Refund** - Through returns workflow if needed

Payment authorization is typically created through your e-commerce platform using Stripe.js or Stripe Elements, then the PaymentIntent ID is passed to Omnium for capture and refund operations.

* * *

## Get Payment Details

When **Get Details From Provider** is enabled, you can retrieve comprehensive payment information:

*   **Status** - Current PaymentIntent status
*   **Order Amount** - Total authorized amount
*   **Captured Amount** - Amount received/captured
*   **Remaining Authorization** - Amount still available to capture
*   **Currency** - Payment currency
*   **Charges** - List of charges with capture and refund details
*   **Creation Date** - When payment was created
*   **Expiration** - Authorization expiration (approximately 7 days)

* * *

## Amount Handling

Stripe uses **minor units** (cents) for all amounts:

| **Currency** | **Example Amount** | **Stripe Value** |
| --- | --- | --- |
| USD | 100.50 | 10050 |
| EUR | 250.00 | 25000 |
| SEK | 99.99 | 9999 |

Omnium handles the conversion automatically.

* * *

## Error Handling

Stripe errors are displayed on the order in the **Errors** section.

### Common Errors

| **Error** | **Possible Cause** | **Solution** |
| --- | --- | --- |
| Authentication failed | Invalid API Token | Verify Secret Key in Stripe Dashboard |
| Capture failed | PaymentIntent already captured or cancelled | Check payment status before capture |
| Refund failed | Amount exceeds captured amount | Verify captured amount before refunding |
| Cancel failed | Payment already captured | Use refund instead of cancel |

* * *

## Troubleshooting

### Payment Not Capturing

1.  Verify the PaymentIntent ID is correct
2.  Check that the payment wasn't already captured
3.  Ensure the capture amount doesn't exceed the authorized amount
4.  Verify API credentials are valid

### Refund Not Processing

1.  Verify the payment was successfully captured first
2.  Check that the refund amount doesn't exceed the captured amount
3.  Review the error message in the order's Errors section

* * *

## Configuration Reference

### Payment Service

`Stripe`

### API Library

Stripe.net SDK (automatically handles API communication)

### Supported Currencies

All currencies supported by Stripe
