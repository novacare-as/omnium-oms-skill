# Add Payment Merchant ID

Source: https://docs.omnium.no/docs/Order/workflow-steps/payment/add-payment-merchant-id

> Add the merchant ID from payment provider configuration to payment properties.

## Overview

The **Add Payment Merchant ID** step adds the configured merchant ID to each payment's properties. This is useful for reporting and reconciliation when multiple merchant accounts are in use.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `AddPaymentMerchantIdToOrder` |
| **Group** | Payments |
| **Applicable Statuses** | All |

## Configuration Properties

This step has no configurable properties. Merchant IDs come from tenant payment configuration.

## Behavior

### What It Does

1.  Checks if order has payments
2.  Retrieves payment types configuration from tenant settings
3.  For each payment, finds the matching payment type config (by method name and market)
4.  Adds the `MerchantId` property to the payment

### Prerequisites

*   Order must have at least one payment
*   Payment types must be configured with merchant IDs in tenant settings

### Side Effects

*   Adds `MerchantId` property to payment records

## Business Cases

### When to Use

*   **Multi-merchant setup**: When different markets or payment methods use different merchant accounts
*   **Financial reconciliation**: Track which merchant account processed each payment
*   **Reporting**: Include merchant ID in payment reports

### Example Scenarios

**Scenario 1: Market-Specific Merchant** Payment type "Klarna" has merchant "M001" for Norway, "M002" for Sweden. Step adds the appropriate merchant ID based on order market.

**Scenario 2: Default Merchant** Payment type "Card" has no market restrictions. Uses the default merchant ID for all markets.

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| No payments | Warning | Yes |
| Merchant ID added | Success | Yes |
| No matching payment type config | Success (no ID added) | Yes |

## Related Steps

*   [Add Payment Type Tag](add-payment-type-tag.md) - Tags order with payment method
*   [Verify Order Payment Method](verify-order-payment-method.md) - Validates payment methods
