# Aera Invoice

Source: https://docs.omnium.no/docs/plugins/Payments/aeraInvoice

> Configure Aera Invoice payment provider with Omnium for invoice-based B2B and B2C payments.

## Aera Invoice Integration with Omnium

Omnium supports **Aera Invoice** for invoice-based payment processing. This provider is separate from the main [Aera](aera.md) provider and handles invoice-specific operations.

### Supported Features

*   **Invoice activation** (full and partial)
*   **Credit/Refund** with item-level detail
*   **Invoice adjustments**
*   **Authorization cancellation**
*   **Status checking**

* * *

## Setup Instructions

### Configuration Path

1.  Navigate to: `Configuration > Settings > Payment > Payment Types > "..." > Add`

2.  Fill out the required fields as outlined below.

* * *

## Required Fields

| **Field** | **Description** | **Value** |
| --- | --- | --- |
| **Unique Payment Name** | The unique identifier for the Aera Invoice payment method. | `AeraInvoice` |
| **Payment Service** | The name of the payment service used for this configuration. | `AeraInvoice` |
| **Provider Name** | Specifies which provider to use. | `AeraInvoice` |
| **Display Name** | The name shown in the Omnium interface. | `Aera Invoice` or your preferred name |
| **API Token** | Your Aera API authentication token. | Your API Token from Aera |
| **Merchant ID** | Your Aera Merchant ID. | Your Merchant ID from Aera |
| **Base URL** | Aera API endpoint URL. | See [Base URL Options](aeraInvoice.md#base-url-options) |

* * *

## Base URL Options

| **Environment** | **Base URL** |
| --- | --- |
| Staging/Test | `https://api-staging.aerahost.com` |
| Production | `https://api.aerahost.com` |

* * *

## Additional Configuration

### Properties

| **Property** | **Type** | **Description** |
| --- | --- | --- |
| **Username** | String | Your Aera OAuth2 username |
| **Password** | String | Your Aera OAuth2 password |

### Store-Level Merchant ID

The Merchant ID can be configured at the store level using the `AeraMerchantId` property on stores. This is useful for multi-merchant setups.

**Priority Order**:

1.  Merchant ID in payment settings (if set)
2.  `AeraMerchantId` store property (fallback)

* * *

## Supported Operations

| **Operation** | **Supported** | **Notes** |
| --- | --- | --- |
| Capture (Activate) | Yes | Full and partial invoice activation |
| Cancel | Yes | Cancel invoice authorization |
| Release Remaining Auth | Yes | Cancel remaining uncaptured amount |
| Refund (Credit) | Yes | Item-level credit or adjustment |
| Check Status | Yes | Retrieve invoice status |

* * *

## Special Features

### Transaction Reference Types

Aera Invoice supports two types of transaction references. The provider automatically detects which type is being used:

| **Reference Format** | **Type** | **Usage** |
| --- | --- | --- |
| GUID format | Payment Reference | References from Aera payment system |
| Other formats | Transaction ID | Standard transaction identifiers |

When adding payments via API, GUIDs are treated as payment references while other formats are treated as transaction IDs.

### Item ID Mapping

For accurate refund processing, the provider needs to match items with the original invoice. Item IDs are determined in this priority order:

1.  **EAN** (if available)
2.  **First GTIN** from product GTINs array (if available)
3.  **LineItemId** (fallback)

For returns to work correctly, the same ItemId must be sent to Aera as was used when creating the invoice.

### Credit vs. Adjustment

The provider uses two different refund mechanisms depending on the scenario:

**Credit (Item-Level)**:

*   Used when return items are provided
*   Sends original item prices and return quantities
*   Aera calculates refund based on returned items
*   Requires valid item IDs (EAN/GTIN/LineItemId)

**Adjustment**:

*   Used when item details are not available
*   Supports fixed amount adjustments
*   Allows optional comment field
*   Can handle negative amounts

### Partial Activation

When capturing less than the full authorized amount:

*   Line items are recalculated to reflect the partial amount
*   Shipping can be included as a line item
*   Total of items must equal the capture amount

### B2B and B2C Support

Aera Invoice supports both customer types:

*   **B2B**: Business-to-business invoicing
*   **B2C**: Consumer invoicing

The customer type is determined from the order's customer type property.

* * *

## Invoice Status Values

| **Status** | **Description** |
| --- | --- |
| PENDING\_CHECK | Invoice pending verification |
| ACCEPTED | Invoice accepted |
| ACTIVATED | Invoice activated (captured) |
| CANCELED | Invoice cancelled |
| DELIVERED | Invoice delivered to customer |
| EXPIRED | Invoice authorization expired |
| DECLINED | Invoice declined |
| PARTIALLY\_PAID | Partial payment received |
| FULLY\_PAID | Full payment received |
| IN\_DEBT | Invoice in debt collection |
| NOT\_PAID | Invoice not paid |

* * *

## Adding Payments via API

Payments can be added to orders using the API endpoint:

```
POST /api/Orders/{orderId}/AddPayments
```

**Requirements**:

*   Status must be `Processed`
*   Payment method name must match the configured setting
*   Transaction ID format determines reference type (GUID = payment reference)

* * *

## Relationship to Main Aera Provider

| **Feature** | **Aera** | **Aera Invoice** |
| --- | --- | --- |
| Payment Flow | Card-based sessions | Invoice-based |
| Session Management | Yes | No |
| Authorization | Supported | Not supported |
| Capture | Supported | Supported (activation) |
| Item-Level Refunds | Transaction-based | Full item detail |
| Get Payment Details | Supported | Not supported |
| Import Payments | Supported | Not supported |

* * *

## Error Handling

Aera Invoice errors are displayed on the order in the **Errors** section.

### Common Error Scenarios

| **Scenario** | **Error** |
| --- | --- |
| Missing Merchant ID | Check payment settings or store AeraMerchantId |
| Invalid Transaction ID | Verify transaction ID is not null/empty |
| Amount mismatch | Ensure item totals equal capture amount |
| No items to credit | Provide return items for credit operation |
| No remaining authorization | Cannot release when remaining amount is 0 |

* * *

## Configuration Reference

### Payment Service

`AeraInvoice`

### Vue Template

`aera-payment`

### Related Provider

[Aera](aera.md) (card-based payments)
