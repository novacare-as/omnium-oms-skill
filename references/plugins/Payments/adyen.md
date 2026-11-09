# Adyen

Source: https://docs.omnium.no/docs/plugins/Payments/adyen

> Configure Adyen payment provider with Omnium for online and in-store payments.

## Adyen Integration with Omnium

Omnium supports **Adyen** for comprehensive payment processing with the following features:

*   **Payment Links** for online checkout
*   **Capture** payments (full or partial)
*   **Cancel** payments / void authorization
*   **Credit/Refund** payments
*   **Update Authorization** amount
*   **Extend Authorization** time
*   **Split Payments** for multi-warehouse orders
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
| **Unique Payment Name** | The unique identifier for the Adyen payment method. | `Adyen` |
| **Payment Service** | The name of the payment service used for this configuration. | `Adyen` |
| **Provider Name** | Specifies which provider to use. | `Adyen` |
| **Display Name** | The name shown in the Omnium interface. | `Adyen` or your preferred name |
| **Merchant ID** | Your Adyen Merchant Account identifier. | Your Merchant Account from Adyen |
| **API Token** | Your Adyen API Key for authentication. | Your API Key from Adyen |
| **Base URL** | The Adyen API endpoint URL. | See [Base URL Options](adyen.md#base-url-options) |

* * *

## Base URL Options

| **Environment** | **Base URL** |
| --- | --- |
| Test | `https://checkout-test.adyen.com` |
| Production | `https://checkout-live.adyen.com` |

**API Version:** v71 (automatically appended to endpoints)

* * *

## Additional Configuration

### Display Options

| **Setting** | **Description** | **Default** |
| --- | --- | --- |
| **Display in Cart** | Show Adyen as a payment option in the cart interface. | `false` |
| **Enable Update Authorization Amount** | Allow updating authorized amount from the interface. | `false` |
| **Enable Extend Authorization Time** | Allow extending authorization expiration. | `false` |
| **Authorization Time In Days** | Default authorization expiration time in days. | \- |

### Split Payment Configuration

| **Property** | **Description** | **Default** |
| --- | --- | --- |
| **SplitEnabled** | Enable split payments for multi-warehouse orders. | `true` |
| **SplitType** | Split payment type: `BalanceAccount` or `MarketPlace`. | `BalanceAccount` |

### Payment Link Options

| **Property** | **Description** | **Default** |
| --- | --- | --- |
| **PaymentLinkValidInDays** | Number of days payment link remains valid. | \- |

* * *

## Supported Operations

| **Operation** | **Supported** | **Notes** |
| --- | --- | --- |
| Payment Link Creation | Yes | For online checkout flows |
| Capture | Yes | Full or partial capture with split support |
| Partial Capture | Yes | Capture portion of authorized amount |
| Cancel | Yes | Void authorization |
| Refund | Yes | Full or partial refunds |
| Partial Refund | Yes | With line item tracking |
| Update Authorization | Yes | Increase or decrease authorized amount |
| Extend Authorization | Yes | Extend authorization validity |
| Get Details | Yes | Retrieve payment information |

* * *

## Special Features

### Split Payments (Multi-Warehouse)

When **SplitEnabled** is enabled (default), Adyen automatically splits payments across multiple warehouses or stores:

1.  Each warehouse/store shipment is allocated a proportional split
2.  Splits are routed to separate Adyen Balance Accounts
3.  Each split includes amount, description, and reference

**Balance Account Configuration:**

To enable split payments, add the `AdyenBalanceAccountId` external ID to each store:

1.  Navigate to the store configuration
2.  Add an External ID with provider name `AdyenBalanceAccountId`
3.  Set the value to your Adyen Balance Account ID

**Balance Account per Market:**

A store that sells in several markets can use a different Balance Account for each market. Add an External ID with provider name `AdyenBalanceAccountId_{marketId}`, where `{marketId}` is the ID of the market in Omnium (for example `AdyenBalanceAccountId_SE`). Both keys are case-insensitive, so `adyenBalanceAccountId_se` also matches `AdyenBalanceAccountId_SE`.

Omnium selects the Balance Account from the market of the order:

1.  `AdyenBalanceAccountId_{marketId}` for the market of the order, if the store has it
2.  Else `AdyenBalanceAccountId`
3.  If the store has neither, it gets no split

| **Store External IDs** | **Order Market** | **Balance Account Used** |
| --- | --- | --- |
| `AdyenBalanceAccountId` = `BA_DEFAULT`, `AdyenBalanceAccountId_SE` = `BA_SE` | `SE` | `BA_SE` |
| `AdyenBalanceAccountId` = `BA_DEFAULT`, `AdyenBalanceAccountId_SE` = `BA_SE` | `NO` | `BA_DEFAULT` |
| `AdyenBalanceAccountId_SE` = `BA_SE` | `NO` | None (no split) |

The same rule is used for payment links, captures and refunds.

**Split Types:**

*   `BalanceAccount` (default) - Funds routed to Balance Accounts
*   `MarketPlace` - Marketplace split configuration

### In-Store/POS Integration

Adyen supports in-store payment link generation:

*   Payment links sent to customers for completion
*   Supports Sitoo POS integration (receipt ID tracking)
*   Multiple payment attempts tracked with sequence numbers

### Line Item Details

Adyen receives detailed order information:

*   Product details (SKU, description, brand, color, size)
*   Quantity and amounts (with and without tax)
*   Tax rates and amounts
*   Shipping details

* * *

## Amount Handling

Adyen uses **minor units** (cents) for all amounts:

| **Currency** | **Example Amount** | **Adyen Value** |
| --- | --- | --- |
| EUR | 100.50 | 10050 |
| SEK | 250.00 | 25000 |
| USD | 99.99 | 9999 |

Omnium handles the conversion automatically.

* * *

## Error Handling

Adyen errors are displayed on the order in the **Errors** section.

### Common Errors

| **Error** | **Possible Cause** | **Solution** |
| --- | --- | --- |
| Authentication failed | Invalid API Key | Verify API Key in Adyen portal |
| Invalid merchant account | Wrong Merchant ID | Check Merchant Account configuration |
| Capture failed | Authorization expired or invalid | Verify authorization status |
| Split payment failed | Missing Balance Account on store | Configure `AdyenBalanceAccountId` or `AdyenBalanceAccountId_{marketId}` on stores |

* * *

## Payment Flow

### Online Checkout Flow

1.  **Payment Link Created** - Customer receives link for checkout
2.  **Customer Completes Payment** - Authorization obtained
3.  **Order Received** - Omnium receives order with payment reference
4.  **Capture** - When ready for fulfillment
5.  **Refund** - Through returns workflow if needed

### Split Payment Flow

1.  **Authorization** - Full order amount authorized
2.  **Capture** - Split proportionally across warehouses
3.  **Each Split** - Routed to respective Balance Account

* * *

## API Authentication

All API calls include:

*   `X-API-Key` header with your API Token
*   `User-Agent` header identifying Omnium

* * *

## Configuration Reference

### Payment Service

`Adyen`

### Store External ID

*   `AdyenBalanceAccountId` - Balance Account ID for split payments
*   `AdyenBalanceAccountId_{marketId}` - Balance Account ID for split payments on orders in that market. Takes priority over `AdyenBalanceAccountId`

### Supported Currencies

All currencies supported by Adyen
