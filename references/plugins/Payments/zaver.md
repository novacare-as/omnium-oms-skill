# Zaver

Source: https://docs.omnium.no/docs/plugins/Payments/zaver

> Configure Zaver payment provider with Omnium for flexible payment options including installments and pay-later.

## Zaver Integration with Omnium

Omnium supports **Zaver** for payment processing with the following features:

*   **In-store payment link creation**
*   **Full and partial capture**
*   **Refunds** with auto-approval option
*   **Authorization release/cancellation**
*   **Payment status polling**
*   **Get Details** - Retrieve payment history

* * *

## Setup Instructions

### Configuration Path

1.  Navigate to: `Configuration > Settings > Payment > Payment Types > "..." > Add`

2.  Fill out the required fields as outlined below.

* * *

## Required Fields

| **Field** | **Description** | **Value** |
| --- | --- | --- |
| **Unique Payment Name** | The unique identifier for the Zaver payment method. | `Zaver` |
| **Payment Service** | The name of the payment service used for this configuration. | `Zaver` |
| **Provider Name** | Specifies which provider to use. | `Zaver` |
| **Display Name** | The name shown in the Omnium interface. | `Zaver` or your preferred name |
| **API Token** | Your Zaver Bearer authentication token. | Your API Token from Zaver |
| **Base URL** | Zaver API endpoint URL. | See [Base URL Options](zaver.md#base-url-options) |

* * *

## Base URL Options

| **Environment** | **Base URL** |
| --- | --- |
| Test | `https://api.test.zaver.com/` |
| Production | `https://api.zaver.com/` |

* * *

## Additional Configuration

| **Property** | **Type** | **Description** |
| --- | --- | --- |
| **HideInstallment** | Boolean | Hide installment payment options from customers |
| **HidePayLater** | Boolean | Hide pay-later payment options from customers |
| **OfferPaymentMethods** | String | Comma-separated list of allowed methods (empty = all allowed) |

**Example OfferPaymentMethods values:**

*   `BANK_TRANSFER` - Bank/SEPA transfer only
*   `SWISH,VIPPS` - Swedish and Norwegian instant payments
*   `INSTALLMENTS,PAY_LATER` - Financing options only

Enable **Get details from provider** to retrieve detailed payment information including captures, refunds, and line items.

* * *

## Supported Operations

| **Operation** | **Supported** | **Notes** |
| --- | --- | --- |
| In-Store Registration | Yes | Creates payment link for customer |
| Capture | Yes | Full and partial capture supported |
| Cancel | Yes | Cancel authorized payment |
| Release Remaining Auth | Yes | Release uncaptured portion |
| Refund | Yes | Fixed-amount refunds with auto-approval |
| Check Status | Yes | Poll payment completion status |
| Get Details | Yes | Full payment history with line items |

* * *

## Payment Methods

Zaver supports multiple payment methods that can be controlled via configuration:

### Consumer Payment Methods

| **Method** | **Description** | **Direct Capture** |
| --- | --- | --- |
| SWISH | Swedish instant payment | Yes |
| VIPPS | Norwegian instant payment | Yes |
| BANK\_TRANSFER | Bank/SEPA transfer | No |
| PAY\_LATER | Buy now, pay later | No |
| INSTALLMENTS | Flexible installment plans | No |

### B2B Payment Methods

| **Method** | **Description** |
| --- | --- |
| B2B\_PAY\_LATER | Business pay later |
| B2B\_INSTALLMENTS | Business installment plans |
| B2B\_R2P | Business request to pay |

* * *

## Special Features

### Payment Link Creation

Zaver uses payment links for in-store payments:

1.  Staff enters amount and customer contact (email/mobile)
2.  Payment link is generated and sent to customer
3.  Customer completes payment via their preferred method
4.  Callback notifies Omnium of payment status

### Direct Capture

Certain payment methods (SWISH, VIPPS) automatically capture upon completion. When this occurs:

*   Authorization payment is created
*   Capture payment is created simultaneously
*   No manual capture step required

### Partial Capture

When capturing less than the authorized amount:

*   Line items are recalculated for accuracy
*   Remaining authorization can be released separately
*   Each capture maintains full line item details

### Refund Workflow

Zaver refunds support auto-approval:

*   **Auto-approval enabled**: Refund processes immediately
*   **Auto-approval disabled**: Refund requires merchant approval in Zaver portal

Refunds use fixed-amount processing with tax calculated from order line items.

### Duplicate Payment Handling

When multiple payment attempts are made on the same order, the title is automatically incremented:

*   First attempt: `ORDER-123`
*   Second attempt: `ORDER-123-1`

### Authorization Expiration

Authorization validity period is tracked via the `ValidUntil` timestamp from Zaver. This is stored on the payment for monitoring.

* * *

## Supported Markets & Currencies

### Markets

| **Market** | **Country** | **Language** |
| --- | --- | --- |
| SE | Sweden | sv-SE |
| DK | Denmark | da-DK |
| NO | Norway | nb-NO |
| FI | Finland | fi-FI |
| DE | Germany | de-DE |
| AT | Austria | de-DE |
| GB | United Kingdom | en-GB |

### Currencies

SEK, DKK, EUR, GBP, NOK

* * *

## Payment Status Values

| **Status** | **Description** | **Action Required** |
| --- | --- | --- |
| CREATED | Payment link generated | Wait |
| PENDING\_CONFIRMATION | Customer completing payment | Wait |
| PENDING\_MERCHANT\_CAPTURE | Authorized, awaiting capture | Capture |
| SETTLED | Auto-captured (direct capture methods) | None |
| CANCELLED | Payment cancelled | None |
| ERROR | Payment failed | Retry/investigate |

* * *

## Line Item Handling

### Order Lines

Line items are mapped with:

*   Product name and description
*   SKU/code as merchant reference
*   Unit price and total amount
*   Tax rate and tax amount
*   Quantity and unit type

### Shipping

Each shipment is included as a line item with:

*   Shipping label as name
*   Shipping total as amount
*   Calculated tax rate

### Filtering

*   Only items with quantity > 0 are sent
*   Zero-quantity items are excluded

* * *

## Error Handling

Zaver errors are displayed on the order in the **Errors** section.

### Common Error Codes

| **Error** | **Description** |
| --- | --- |
| VALIDATION\_ERROR | Invalid request data |
| PAYMENT\_NOT\_FOUND | Referenced payment doesn't exist |
| PAYMENT\_ILLEGAL\_STATE | Payment not in correct state for operation |
| AMOUNT\_EXCEEDS\_REFUNDABLE\_AMOUNT | Refund amount larger than available |
| INSUFFICIENT\_FUNDS\_SWISH | Swish payment failed due to funds |

* * *

## Configuration Reference

### Payment Service

`Zaver`

### Vue Template

`zaver-payment`
