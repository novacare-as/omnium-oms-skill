# Try Release Remaining Auth

Source: https://docs.omnium.no/docs/Order/workflow-steps/payment/try-release-remaining-auth

> Release any remaining authorization amount after partial capture.

## Overview

The **Try Release Remaining Auth** step attempts to release unused authorization amounts back to the customer. This is useful when the captured amount is less than the authorized amount (due to cancellations, discounts, or partial shipments).

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `TryReleaseRemainingAuth` |
| **Group** | Payments |
| **Applicable Statuses** | Completed, ReadyForPickup, Ship |

## Configuration Properties

This step has no configurable properties.

## Behavior

### What It Does

1.  Checks if order has active payments
2.  For each active payment, calls `TryReleaseRemainingAuth` on the payment service
3.  The payment provider releases any unused authorization amount

### Prerequisites

*   Order must have active payments
*   Payment provider must support releasing remaining authorization

### Side Effects

*   Releases held funds on customer's payment method
*   This step is invisible (doesn't show in workflow history)

## Business Cases

### When to Use

*   **Partial capture**: After capturing less than authorized
*   **Order completion**: Clean up authorization holds at order completion
*   **Cancellation after partial shipment**: Release remaining auth after partial fulfillment

### Example Scenarios

**Scenario 1: Partial Order** Order authorized for $150. One item ($50) cancelled before shipping. Capture is $100. Step releases the remaining $50 authorization.

**Scenario 2: Full Capture** Order authorized and captured for full amount. Step has no remaining auth to release but completes successfully.

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| No active payments | Success (invisible) | Yes |
| Release successful | Success (invisible) | Yes |
| Release not supported by provider | Success (invisible) | Yes |

## Related Steps

*   [Capture Payments](capture-payments.md) - Captures the authorization amount
*   [Cancel Payments](cancel-payments.md) - Voids entire authorization
