# Credit Cancelled Order Lines

Source: https://docs.omnium.no/docs/Order/workflow-steps/payment/credit-cancelled-order-lines

> Refund captured payment amounts for cancelled order lines.

## Overview

The **Credit Cancelled Order Lines** step handles partial refunds when some order lines are cancelled after payment has been captured. It calculates the difference between captured amount and current order total, then credits the excess.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `CreditCancelledOrderLines` |
| **Group** | Payments |
| **Applicable Statuses** | New, Ship, ReadyForPickup, Completed |

## Configuration Properties

This step has no configurable properties.

## Behavior

### What It Does

1.  Checks if order has active payments with captured amounts
2.  Calculates amount to credit:
    *   If order fully cancelled: Credit all captured amount
    *   If partially cancelled: Credit (captured amount - current order total)
3.  Orders payments by `CreditPriority` if set
4.  Credits from each payment until required amount is refunded
5.  Passes cancelled order lines to payment provider for line-item refunds

### Prerequisites

*   Order must have active payments with captured amounts
*   Order must have cancelled lines or be fully cancelled
*   Amount to credit must be greater than zero

### Side Effects

*   Creates credit payment transactions
*   Notifies payment provider of specific cancelled items

## Business Cases

### When to Use

*   **Partial cancellation**: When some items are cancelled after capture
*   **Pre-ship cancellation**: When items are cancelled before shipping but after capture
*   **Click-and-collect partial pickup**: When customer doesn't take all items

### Example Scenarios

**Scenario 1: Partial Line Cancellation** Order captured for $150. Customer cancels $50 item. Step credits $50 (captured $150 - new total $100).

**Scenario 2: Full Cancellation** Order captured for $150, then fully cancelled. Step credits full $150.

**Scenario 3: Multi-Payment Credit** Order has two payments (A captured $100, B captured $50). For $75 credit with default priority, credits from A first.

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| No active payments | Warning | Yes |
| No captured amount | Warning | Yes |
| Nothing to credit | Success | Yes |
| Credit successful | Success | Yes |
| Credit failed + StopOnError | Error | No |
| Credit failed | Error | Yes |

## Related Steps

*   [Cancel Payments](cancel-payments.md) - Full order cancellation payment handling
*   [Capture Payments](capture-payments.md) - Creates the captured amount to credit
