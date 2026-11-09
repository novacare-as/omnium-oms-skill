# Verify Completely Paid

Source: https://docs.omnium.no/docs/Order/workflow-steps/validation/verify-completely-paid

> Verify that an order has been 100% paid before proceeding.

## Overview

The **Verify Completely Paid** step verifies that the order has been completely paid with no remaining balance. This ensures orders don't progress until payment is fully confirmed.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `VerifyCompletelyPaid` |
| **Group** | Payments |
| **Applicable Statuses** | New, InProgress, Completed, Ship, ReadyForPickup |

## Configuration Properties

| Property | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `StopOnError` | Boolean | No | false | Cancel workflow if payment is incomplete |

## Behavior

### What It Does

1.  Calculates remaining payment amount based on active payments
2.  Rounds the remaining amount for comparison
3.  If remaining payment is greater than zero:
    *   Returns error status
    *   Optionally cancels workflow based on `StopOnError` setting
4.  If remaining payment is zero or less:
    *   Returns success

### Prerequisites

*   Order must have payment information

### Side Effects

*   No modifications to order
*   May cancel workflow if configured

## Business Cases

### When to Use

*   **Pre-fulfillment check**: Ensure payment before shipping
*   **Status transitions**: Gate workflow progression on payment status
*   **B2B orders**: Verify payment terms are met

### Example Scenarios

**Scenario 1: Fully Paid** Order total is $100, payments total $100. Verification passes.

**Scenario 2: Partial Payment** Order total is $100, payments total $80. Returns error with "Order not completely paid".

**Scenario 3: Overpayment** Order total is $100, payments total $105. Verification passes (remaining is zero or negative).

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| Fully paid | Success | Yes |
| Remaining balance positive | Error | Based on StopOnError |
| Remaining balance zero or negative | Success | Yes |

## Related Steps

*   [Verify Capture Is Completed](verify-capture-is-completed.md) - Verify payment capture
*   [Capture Payments](../payment/capture-payments.md) - Capture authorized payments
