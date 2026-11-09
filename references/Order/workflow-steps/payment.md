# Payment Workflow Steps

Source: https://docs.omnium.no/docs/Order/workflow-steps/payment

> Workflow steps for payment processing, authorization, capture, refunds, and financial operations in Omnium OMS.

Payment workflow steps handle all financial operations in the order lifecycle, including payment authorization, capture, cancellation, refunds, and integration with payment providers.

## Overview

These steps manage:

*   **Payment capture** - Collecting funds when orders ship
*   **Authorization management** - Setting and clearing authorization expiration
*   **Refunds and credits** - Handling cancellations and returns
*   **Gift cards** - Creating and reserving gift cards
*   **Coupons** - Validating and redeeming discount coupons
*   **Invoicing** - Creating invoices for orders

## Available Steps

### Core Payment Operations

| Step | Key | Description |
| --- | --- | --- |
| [Capture Payments](payment/capture-payments.md) | `CapturePayments` | Capture payment for shipped orders |
| [Cancel Payments](payment/cancel-payments.md) | `CancelPayments` | Cancel or void active payments |
| [Authorize Payment](payment/authorize-payment.md) | `AuthorizePayment` | Authorize payment with provider |
| [Credit Cancelled Order Lines](payment/credit-cancelled-order-lines.md) | `CreditCancelledOrderLines` | Refund captured amounts for cancelled lines |
| [Create Payment Remaining](payment/create-payment-remaining.md) | `AddRemainingPayment` | Create payment for remaining amount |
| [Try Release Remaining Auth](payment/try-release-remaining-auth.md) | `TryReleaseRemainingAuth` | Release unused authorization amounts |

### Authorization Management

| Step | Key | Description |
| --- | --- | --- |
| [Set Authorization Expires](payment/set-authorization-expires.md) | `SetAuthorizationExpires` | Calculate and set payment expiration dates |
| [Remove Authorization Expires](payment/remove-authorization-expires.md) | `RemoveAuthorizationExpires` | Clear expiration after capture |

### Payment Validation & Enrichment

| Step | Key | Description |
| --- | --- | --- |
| [Verify Order Payment Method](payment/verify-order-payment-method.md) | `VerifyOrderPaymentMethod` | Validate payment method is allowed |
| [Add Payment Type Tag](payment/add-payment-type-tag.md) | `AddPaymentTypeTagToOrder` | Tag order with payment method name |
| [Add Payment Merchant ID](payment/add-payment-merchant-id.md) | `AddPaymentMerchantIdToOrder` | Add merchant ID to payment properties |
| [Add Shipment Info to Payment Provider](payment/add-shipment-info-to-payment-provider.md) | `AddShipmentInfoToPaymentProvider` | Send tracking info to payment provider |

### Coupons & Discounts

| Step | Key | Description |
| --- | --- | --- |
| [Check Personal Discount Coupons](payment/check-personal-discount-coupons.md) | `CheckPersonalDiscountCoupons` | Validate personal discount coupons |
| [Try Redeem Personal Discount Coupons](payment/try-redeem-personal-discount-coupons.md) | `TryRedeemPersonalDiscountCoupons` | Redeem validated coupons |
| [Check and Update Coupon Usage](payment/check-and-update-coupon-usage.md) | `CheckAndUpdateCouponUsage` | Update coupon usage with provider |

### Gift Cards

| Step | Key | Description |
| --- | --- | --- |
| [Create and Send Gift Cards](payment/create-and-send-gift-cards.md) | `CreateAndSendGiftCards` | Create and deliver purchased gift cards |
| [Reserve Gift Cards](payment/reserve-gift-cards.md) | `ReserveGiftCards` | Reserve gift cards for order |

### Invoicing

| Step | Key | Description |
| --- | --- | --- |
| [Create Invoice](payment/create-invoice.md) | `CreateInvoice` | Generate invoice for order/shipment |
| [Create Receipts](payment/create-receipts.md) | `CreateReceipts` | Issue the paid receipts for an order |

### Replacement Orders

| Step | Key | Description |
| --- | --- | --- |
| [Transfer Replacement Order Payment](payment/transfer-replacement-order-payment.md) | `TransferReplacementOrderPayment` | Transfer payment from original to replacement order |

## Payment Flow

A typical payment flow through workflow steps:

1.  **New Order**: `SetAuthorizationExpires` → `VerifyOrderPaymentMethod` → `CheckPersonalDiscountCoupons`
2.  **Ship/Complete**: `CapturePayments` → `RemoveAuthorizationExpires` → `TryReleaseRemainingAuth` → `AddShipmentInfoToPaymentProvider`
3.  **Cancel**: `CancelPayments` or `CreditCancelledOrderLines`

## Multi-Payment Support

Omnium supports multiple payments per order with:

*   **Capture Priority** - Control which payment is captured first
*   **Credit Priority** - Control which payment is credited first
*   Partial capture across multiple payment methods

## Common Configuration

Many payment steps use tenant-level payment configuration from `TenantSettings.PaymentConfiguration`:

*   `AllowCompleteOrderWithoutPayment` - Allow orders with no payment
*   `PaymentTypes` - Configured payment methods and their settings
