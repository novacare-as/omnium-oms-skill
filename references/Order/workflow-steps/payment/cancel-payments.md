# Cancel Payments

Source: https://docs.omnium.no/docs/Order/workflow-steps/payment/cancel-payments

> Cancel or void all active payments on an order, or credit captured payments.

## Overview

The **Cancel Payments** step voids authorized payments that haven't been captured, or credits payments that have already been captured. It handles the full reversal of payment when orders are cancelled.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `CancelPayments` |
| **Group** | Payments |
| **Applicable Statuses** | OrderCanceled |

## Configuration Properties

This step has no configurable properties.

## Behavior

### What It Does

1.  Checks if order has active payments
2.  For each active payment:
    *   If **not captured**: Voids/cancels the authorization
    *   If **captured**: Credits the captured amount (if payment method supports credit on cancel)
3.  Validates the order or all shipments are in cancelled status before voiding
4.  Records void or credit transactions on the order

### Prerequisites

*   Order must have active payments
*   Order or all shipments must be in cancelled status

### Side Effects

*   Creates void or credit payment transactions
*   Updates payment status

## Business Cases

### When to Use

*   **Order cancellation**: Release held funds when customer cancels
*   **Failed fulfillment**: Return payment when order cannot be fulfilled
*   **Fraud prevention**: Cancel payment on suspected fraudulent orders

### Example Scenarios

**Scenario 1: Authorization Void** Order cancelled before capture. The $100 authorization is voided, releasing the hold on the customer's card.

**Scenario 2: Post-Capture Credit** Order cancelled after capture. If the payment method supports `CanCreditOnCancel`, the $100 is credited back.

**Scenario 3: Partial Cancellation** Only some shipments cancelled - step won't void payment since not all shipments are cancelled.

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| No active payments | Warning | Yes |
| Not all shipments cancelled (for void) | Warning | Yes |
| Payment provider void fails | Warning | Yes |
| Payment provider credit fails | Warning | Yes |
| No payment provider configured | Warning | Yes |
| Exception during processing | Error | Depends on StopOnError |

## Related Steps

*   [Capture Payments](capture-payments.md) - The capture this step may credit
*   [Credit Cancelled Order Lines](credit-cancelled-order-lines.md) - Credits specific cancelled lines
