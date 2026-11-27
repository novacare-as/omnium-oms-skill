# Credit Return

Source: https://docs.omnium.no/docs/Order/Returns/return-workflow-steps/payment/credit-return

> Process refunds by crediting payment amounts back to the customer's original payment method.

## Overview

The **Credit Return** step processes refunds for returned items by crediting the payment amount back to the customer through their original payment method. This step calculates the refund amount based on returned items and any applicable return charges, then submits the refund request to the payment provider.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `CreditReturn` |
| **Group** | Payments |

## Configuration Properties

This step has no configurable properties. The refund amount is calculated automatically based on the return order totals.

## Behavior

### What It Does

1.  Retrieves payment information from the original order
2.  Calculates credit amount based on returned items minus any return charges
3.  Orders payments by `CreditPriority` if multiple payments exist
4.  Submits refund request to payment provider
5.  Creates credit payment transaction records
6.  Updates order payment totals

### Prerequisites

*   Return must be linked to an order with captured payments
*   Payment provider must support refunds
*   Refund amount must be greater than zero

### Side Effects

*   Creates credit/refund payment transactions
*   Updates order's credited payment totals
*   May trigger webhooks from payment provider

## Business Cases

### When to Use

*   Processing customer refunds upon return completion
*   Automated refund processing in return workflows
*   Partial refunds for partial returns

### Example Scenarios

**Full Return** Customer returns entire order for $150. The step credits $150 (minus any return charges) to the original payment method.

**Partial Return** Customer returns 2 of 3 items worth $80. The step credits $80 to the customer.

**Return with Fee** Customer returns items worth $100 with a $15 return fee. The step credits $85 ($100 - $15).

**Multi-Payment Order** Order paid with $50 gift card and $100 credit card. For a $75 credit, the step processes refunds in priority order (or creation order if no priority set).

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| No payments on order | Warning | Yes |
| No captured amount | Warning | Yes |
| Refund amount is zero | Success (no action) | Yes |
| Refund successful | Success | Yes |
| Payment provider error | Error | Depends on StopOnError |
| Network/timeout error | Error | Depends on StopOnError |

## Related Steps

*   [Create Credit Note](create-credit-note.md) - Generate credit documentation
*   [Export Payments](export-payments.md) - Sync to external payment systems
