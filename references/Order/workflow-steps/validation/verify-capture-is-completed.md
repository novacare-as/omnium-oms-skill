# Verify Capture Is Completed

Source: https://docs.omnium.no/docs/Order/workflow-steps/validation/verify-capture-is-completed

> Verify that payment captures have been successfully completed for all active payments.

## Overview

The **Verify Capture Is Completed** step verifies that payment captures have been completed successfully for all active payments on the order. This ensures funds have actually been captured before order completion.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `VerifyCaptureIsCompleted` |
| **Group** | Payments |
| **Applicable Statuses** | Completed |

## Configuration Properties

| Property | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `StopOnError` | Boolean | No | false | Cancel workflow if capture verification fails |
| `ErrorStatus` | String | No | \- | Status to set on order if verification fails |

## Behavior

### What It Does

1.  Skips verification in test mode
2.  Creates order view model to get active payments
3.  If no active payments, returns warning
4.  For each active payment:
    *   Builds payment verification model
    *   Checks the capture status with the payment provider
5.  If verification fails and `StopOnError` is true:
    *   Sets order status to `ErrorStatus` (if configured)
    *   Cancels workflow
6.  Returns success if all captures verified

### Prerequisites

*   Order should have active payments
*   Capture operations should have been attempted

### Side Effects

*   May change order status to error status
*   May cancel workflow

## Business Cases

### When to Use

*   **Completion verification**: Ensure captures succeeded before completing
*   **Financial reconciliation**: Verify funds captured before shipping
*   **Error recovery**: Detect failed captures for retry

### Example Scenarios

**Scenario 1: All Captures Verified** All active payments have successful captures. Verification passes.

**Scenario 2: No Active Payments** Order has no active payments. Returns warning status.

**Scenario 3: Capture Failed** One payment capture failed. With `StopOnError=true`, sets error status and cancels workflow.

**Scenario 4: Test Mode** Running in test mode. Verification skipped with success.

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| Test mode | Success (skipped) | Yes |
| No active payments | Warning | Yes |
| All captures verified | Success | Yes |
| Capture failed (StopOnError=false) | Continues | Yes |
| Capture failed (StopOnError=true) | Error | No |

## Related Steps

*   [Verify Completely Paid](verify-completely-paid.md) - Verify payment amount
*   [Capture Payments](../payment/capture-payments.md) - Capture authorized payments
