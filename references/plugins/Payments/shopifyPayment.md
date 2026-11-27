# Shopify Payments

Source: https://docs.omnium.no/docs/plugins/Payments/shopifyPayment

> Configure Shopify payment provider with Omnium for Shopify store payment processing.

## Shopify Payments Integration with Omnium

Omnium supports **Shopify Payments** for processing payment operations on orders imported from Shopify stores.

### Supported Features

*   **Capture** payments
*   **Cancel** (void) payments
*   **Credit/Refund** payments (full and partial)

* * *

## Setup Instructions

### Configuration Path

1.  Navigate to: `Configuration > Settings > Payment > Payment Types > "..." > Add`

2.  Fill out the required fields as outlined below.

* * *

## Required Fields

| **Field** | **Description** | **Value** |
| --- | --- | --- |
| **Unique Payment Name** | The unique identifier for the Shopify payment method. | `Shopify` |
| **Payment Service** | The name of the payment service used for this configuration. | `Shopify` |
| **Provider Name** | Specifies which provider to use. | `Shopify` |
| **Display Name** | The name shown in the Omnium interface. | `Shopify Payments` or your preferred name |
| **Client ID** | Your Shopify store identifier. | Your Shopify store ID |
| **API Token** | Your Shopify API access token. | Your API access token from Shopify |
| **Base URL** | Shopify Admin API endpoint URL. | `https://{shop}.myshopify.com/admin/api/` |

* * *

## Supported Operations

| **Operation** | **Supported** | **Notes** |
| --- | --- | --- |
| Capture | Yes | Captures authorized Shopify payment |
| Cancel (Void) | Yes | Voids authorized payment |
| Refund | Yes | Full and partial refunds with comments |

* * *

## Special Features

### Multi-Gateway Support

Shopify Payments integrates with various payment gateways. The provider automatically detects:

*   **Shopify Payments** (standard gateway)
*   **Klarna** (detected by gateway name containing "klarna")
*   **Other third-party gateways**

### Partial Authorization Release

When partially capturing an order:

*   Capture the required amount
*   Remaining authorization can be voided
*   Amount-based void operations supported

### Refund Comments

Refunds can include optional comments/reasons:

*   Passed to Shopify as refund reason
*   Visible in Shopify admin

### Rate Limiting

The provider implements Shopify's rate limiting:

*   Uses LeakyBucket execution policy
*   Prevents API throttling
*   Automatic retry on rate limit errors

* * *

## Webhook Integration

Shopify orders can be synchronized via webhooks:

### Order Payment Webhook

**Endpoint:** `/api/shopifyorders/{tenantId}/OrderPayment`

**Trigger:** When payment is registered on a Shopify order

**Behavior:**

*   Associates payment with existing Omnium order
*   Returns 424 if order not yet imported

### Webhook Authentication

All webhooks are authenticated using:

*   Webhook signature validation
*   Signature stored in connector settings

* * *

## Payment Transaction Types

| **Type** | **Description** |
| --- | --- |
| authorization | Pre-authorization hold |
| capture | Capture authorized amount |
| sale | Direct sale (combined auth + capture) |
| void | Cancel authorization |
| refund | Refund captured amount |

* * *

## Error Handling

Shopify errors are displayed on the order in the **Errors** section.

Errors are automatically:

*   Added on failed operations
*   Removed on successful operations

* * *

## Limitations

The following operations are not supported:

*   Direct payment authorization (handled by Shopify checkout)
*   Pre-authorization workflow
*   Status checking
*   Authorization extension
*   In-store/POS payment registration

Initial payment authorization is handled through Shopify's checkout. Omnium processes post-checkout operations like capture and refund.

* * *

## Setup Requirements

### Omnium Configuration

1.  Create payment settings entry
2.  Set provider name to `Shopify`
3.  Provide Shopify API credentials

### Shopify Store Configuration

1.  Configure webhook endpoints for order sync
2.  Set webhook signing secret in connector settings
3.  Grant API access token appropriate permissions

* * *

## Configuration Reference

### Payment Service

`Shopify`

### API Library

ShopifySharp

### Caching

*   Payment service instances cached for 30 minutes
*   Reduces API overhead for repeated operations
