# Create Payment Remaining

Source: https://docs.omnium.no/docs/Order/workflow-steps/payment/create-payment-remaining

> Create an additional payment for any remaining unpaid amount on the order.

## Overview

The **Create Payment Remaining** step creates a new payment for any remaining amount not covered by existing authorizations. This is useful for in-store scenarios where the order total increases or additional payment is needed.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `AddRemainingPayment` |
| **Group** | Payments |
| **Applicable Statuses** | New |

## Configuration Properties

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `PaymentProviders` | string | No | Semicolon-separated list of payment methods this step is enabled for |

## Behavior

### What It Does

1.  Checks if order has active payments
2.  Calculates remaining amount to authorize (`RemainingAmountToAut`)
3.  Checks if payment method is in the enabled list (if configured)
4.  Creates a new in-store payment registration for the remaining amount
5.  Adds the payment in `AwaitingAuthorization` status

### Prerequisites

*   Order must have active payments
*   Remaining amount to authorize must be greater than zero
*   Payment method must be in `PaymentProviders` list (if configured)

### Side Effects

*   Adds new payment in `AwaitingAuthorization` status
*   Uses the same payment method as the largest existing payment

## Business Cases

### When to Use

*   **Price adjustments**: When order total increases after initial authorization
*   **Partial payment**: When first payment only covered part of the order
*   **Upselling**: When items are added to order in-store

### Example Scenarios

**Scenario 1: Order Total Increase** Order authorized for $100. Item added, new total $120. Step creates $20 awaiting authorization payment.

**Scenario 2: Payment Method Filter** Configure `PaymentProviders = "Klarna;Vipps"`. Step only runs for orders with these payment methods.

**Scenario 3: No Remaining Amount** Order is fully authorized. Step returns warning with no action.

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| No active payments | Warning | Yes |
| No remaining amount | Warning | Yes |
| Payment method not in enabled list | Warning | Yes |
| Payment registration successful | Success | Yes |
| Payment registration failed | Error | Depends on StopOnError |

## Related Steps

*   [Authorize Payment](authorize-payment.md) - Authorizes the created payment
*   [Capture Payments](capture-payments.md) - Captures all authorized payments
