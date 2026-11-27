# Svea Checkout

Source: https://docs.omnium.no/docs/plugins/Payments/sveaCheckout

> Configure Svea Checkout payment provider with Omnium for flexible payment options.

## Svea Checkout Integration with Omnium

Omnium supports **Svea Checkout** for comprehensive payment processing with the following features:

*   **Create Checkout** orders with embedded iframe
*   **Capture** payments (full or partial with multi-delivery support)
*   **Cancel** payments
*   **Credit/Refund** payments with multiple strategies
*   **Update Authorization** (order line synchronization)
*   **Extend Authorization** time
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
| **Unique Payment Name** | The unique identifier for the Svea payment method. | `SveaCheckout` |
| **Payment Service** | The name of the payment service used for this configuration. | `SveaCheckout` |
| **Provider Name** | Specifies which provider to use. | `SveaCheckout` |
| **Display Name** | The name shown in the Omnium interface. | `Svea Checkout` or your preferred name |
| **Merchant ID** | Your Svea Merchant/Customer ID. | Your Merchant ID from Svea |
| **API Token** | Your Svea API authentication token. | Your API Token from Svea |
| **Base URL** | Svea API endpoint for order management. | See [Base URL Options](sveaCheckout.md#base-url-options) |
| **Authorization Base URL** | Svea API endpoint for authorization operations. | See [Base URL Options](sveaCheckout.md#base-url-options) |
| **Fallback URL** | Base URL for callback handling. | Your domain URL |

* * *

## Base URL Options

| **Environment** | **Base URL** | **Authorization Base URL** |
| --- | --- | --- |
| Test | `https://paymentadminapi.svea.com` | `https://checkoutapi.svea.com` |
| Production | `https://paymentadminapi.svea.com` | `https://checkoutapi.svea.com` |

* * *

## Additional Configuration

| **Setting** | **Description** | **Default** |
| --- | --- | --- |
| **Display in Cart** | Show Svea as a payment option in the cart interface. | `false` |
| **Get Details From Provider** | Enable fetching real-time payment details from Svea. | `false` |
| **Enable Update Authorization Amount** | Allow updating order lines to sync with Svea. | `false` |
| **Enable Extend Authorization Time** | Allow extending authorization expiration. | `false` |
| **Authorization Time In Days** | Days to extend authorization (default: 30). | `30` |
| **Terms URL** | Link to your terms and conditions. | \- |

* * *

## Supported Operations

| **Operation** | **Supported** | **Notes** |
| --- | --- | --- |
| Create Checkout | Yes | Returns HTML iframe snippet |
| Capture (Deliver) | Yes | Full or partial delivery |
| Partial Capture | Yes | Multi-delivery support |
| Cancel | Yes | Cancel authorized order |
| Refund | Yes | Multiple credit strategies |
| Partial Refund | Yes | With order line tracking |
| Update Authorization | Yes | Sync order lines with Svea |
| Extend Authorization | Yes | Extend expiration by configured days |
| Check Status | Yes | Verify payment completion |
| Get Details | Yes | Complete payment information |

* * *

## Special Features

### Multi-Delivery Support

Svea Checkout supports capturing orders across multiple deliveries (shipments):

*   Each delivery is tracked independently
*   Partial quantities can be captured per delivery
*   Each delivery maintains its own credit/refund capability

### Order Line Synchronization

When **Enable Update Authorization Amount** is enabled, you can sync order lines between Omnium and Svea:

*   Updates item quantities and prices
*   Adds or removes items
*   Updates shipping costs

If order lines don't match between Omnium and Svea during capture, an error is returned. Use the "Update" action to synchronize before capturing.

### Credit Strategies

Svea Checkout supports multiple refund strategies (applied in priority order):

#### 1\. Credit by Amount

*   Simple amount-based refund
*   Available when delivery has `CanCreditAmount` action

#### 2\. Cancel Amount

*   Cancels portion of order amount
*   Available when order has `CanCancelAmount` action

#### 3\. Credit Order Lines

*   Refund specific items with quantities
*   Supports partial quantities
*   Includes automatic fee handling for rounding differences

#### 4\. Credit Compensation (Fallback)

*   Creates compensation line item
*   Used when other strategies unavailable
*   Available when delivery has `CanCreditNewRow` action

### Fee Handling

When refund amounts don't match order line totals exactly, the system automatically creates adjustment fees to handle differences. This ensures accurate refund amounts while maintaining line-item tracking.

* * *

## Quantity Handling

Svea uses centesimal quantities (multiplied by 100):

| **Actual Quantity** | **Svea Value** |
| --- | --- |
| 1 | 100 |
| 2.5 | 250 |
| 0.5 | 50 |

Omnium handles the conversion automatically.

* * *

## Shipping Line Recognition

The system recognizes various shipping line article numbers:

*   `Shipping` / `Frakt` (standard)
*   `local_pickup:7` (local pickup)
*   `porter_buddy:6` (porter delivery)
*   `flat_rate:2`, `flat_rate:3`, `flat_rate:4` (flat rate variants)

* * *

## Error Handling

Svea errors are displayed on the order in the **Errors** section.

### Common Errors

| **Error** | **Possible Cause** | **Solution** |
| --- | --- | --- |
| Could not get market from order | Missing market configuration | Verify market settings |
| Could not get siteUrl | Missing tenant URL setting | Configure site URL in tenant settings |
| Capture amount larger than Svea total | Amount exceeds available authorization | Verify authorized amount |
| Diff between order lines | Order lines out of sync | Use Update Authorization to sync |
| No delivery to credit | No captured deliveries available | Verify capture status before refunding |
| OrderLine could not be credited | Item not available for credit | Check item status in Svea |

* * *

## Payment Flow

### Checkout Flow

1.  **Create Checkout** - HTML iframe snippet generated
2.  **Customer Completes Payment** - Authorization obtained
3.  **Callback Received** - Payment status confirmed
4.  **Capture (Deliver)** - When ready for fulfillment
5.  **Refund** - Through returns workflow if needed

### Status Transitions

*   **AwaitingAuthorization** - Waiting for customer to complete
*   **Processed** - Authorization confirmed
*   **Delivered** - Captured/delivered

* * *

## Callback Configuration

Svea uses callbacks for payment status updates. The following endpoints are configured automatically:

*   **Validation Callback** - Validates checkout before completion
*   **Push Notification** - Receives payment status updates

Callbacks include tenant ID for multi-tenant routing.

* * *

## Configuration Reference

### Payment Service

`SveaCheckout`

### Related Provider

*   **Svea InStore** (`SveaInStore`) - For in-store/POS payments (extends Svea Checkout)

### API Authentication

SHA512 hash-based token with Merchant ID and API Token
