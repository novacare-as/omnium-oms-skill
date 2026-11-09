# Verify Order Payment Method

Source: https://docs.omnium.no/docs/Order/workflow-steps/payment/verify-order-payment-method

> Validate that the order's payment method is allowed for processing.

## Overview

The **Verify Order Payment Method** step validates that all payment methods on an order are valid and allowed. This can be used to block orders with unexpected or unsupported payment methods.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `VerifyOrderPaymentMethod` |
| **Group** | Payments |
| **Applicable Statuses** | All |

## Configuration Properties

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `validPaymentMethods` | string | No | Comma-separated list of allowed payment methods. If not set, uses tenant's configured payment types. |

## Behavior

### What It Does

1.  Checks if order has payments
2.  Retrieves valid payment methods from configuration or tenant settings
3.  Validates all order payments use allowed methods
4.  Returns error if any payment uses an invalid method

### Prerequisites

*   Order must have at least one payment

### Side Effects

*   None - validation only

## Business Cases

### When to Use

*   **Payment method restrictions**: Ensure only supported methods are used
*   **Market-specific payments**: Validate methods are valid for the order's market
*   **Workflow gates**: Block orders with unexpected payment methods

### Example Scenarios

**Scenario 1: Valid Payment** Configure `validPaymentMethods "Klarna,Vipps,Card"`. Order with "Klarna" payment passes validation.

**Scenario 2: Invalid Payment** Configure `validPaymentMethods "Klarna,Vipps"`. Order with "PayPal" payment fails with error.

**Scenario 3: Tenant Default** No configuration. Uses all payment methods configured in tenant's `PaymentTypes` settings.

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| No payments on order | Error | Depends on StopOnError |
| All payments valid | Success | Yes |
| Invalid payment method found | Error | Depends on StopOnError |
| No valid methods configured | Success | Yes |

## Related Steps

*   [Add Payment Type Tag](add-payment-type-tag.md) - Tags order with payment method
