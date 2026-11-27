# Authorize Payment

Source: https://docs.omnium.no/docs/Order/workflow-steps/payment/authorize-payment

> Authorize payment amounts with the payment provider for pending authorizations.

## Overview

The **Authorize Payment** step processes pending authorization requests with payment providers. This is used when payments are created in "awaiting authorization" status and need to be authorized before the order can proceed.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `AuthorizePayment` |
| **Group** | Payments |
| **Applicable Statuses** | New |

## Configuration Properties

This step has no configurable properties.

## Behavior

### What It Does

1.  Checks if order has active payments
2.  For each active payment with `AwaitingAuthorization` transaction:
    *   Skips if already has an `Authorization` transaction
    *   Calls payment provider to authorize the amount
3.  Records authorization transaction on success
4.  Updates `RemainingPayment` on the order

### Prerequisites

*   Order must have payments in awaiting authorization status
*   Payment provider must be configured and available

### Side Effects

*   Creates authorization payment transactions
*   Updates order's `RemainingPayment` amount
*   May add order errors on failure

## Business Cases

### When to Use

*   **Deferred authorization**: When checkout creates pending payments that need server-side authorization
*   **In-store payments**: Authorize in-store payment methods after order creation
*   **Payment retries**: Re-authorize after a failed initial attempt

### Example Scenarios

**Scenario 1: In-Store Payment** Customer pays in store, creating an AwaitingAuthorization record. This step authorizes it with the payment provider.

**Scenario 2: Multiple Payments** Order has two payments - one already authorized, one awaiting. Step only processes the awaiting one.

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| No active payments | Warning | Yes |
| No awaiting authorizations | Success | Yes |
| Authorization successful | Success | Yes |
| Authorization failed + StopOnError | Error (adds order error) | No |
| Authorization failed | Warning (adds order error) | Yes |

## Related Steps

*   [Capture Payments](capture-payments.md) - Captures the authorization
*   [Create Payment Remaining](create-payment-remaining.md) - Creates a new payment for remaining amount
