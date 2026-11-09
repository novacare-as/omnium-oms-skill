# Capture Payments

Source: https://docs.omnium.no/docs/Order/workflow-steps/payment/capture-payments

> Capture payment amounts from authorized payments when shipments are released.

## Overview

The **Capture Payments** step collects funds from previously authorized payments. It's typically executed when orders ship or are marked ready for pickup. The step handles multi-payment scenarios, capture priority, and partial captures.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `CapturePayments` |
| **Group** | Payments |
| **Applicable Statuses** | Completed, ReadyForPickup, Ship |

## Configuration Properties

This step has no configurable properties. Behavior is controlled by tenant payment settings.

## Behavior

### What It Does

1.  Validates the order has active payments
2.  Checks if capture is already complete (prevents double capture)
3.  Identifies released shipments to capture for
4.  Calculates capture amount based on shipment totals
5.  Orders payments by `CapturePriority` if set
6.  Captures from each payment until the required amount is reached
7.  Records capture transactions on the order

### Prerequisites

*   Order must have active payments with available authorization
*   At least one shipment must be in `Released` status
*   Total authorized amount must cover the capture amount

### Side Effects

*   Creates capture payment transactions
*   Updates payment captured amounts
*   May add order errors if capture fails
*   Removes capture error on success

## Business Cases

### When to Use

*   **Order shipment**: Capture when goods leave the warehouse
*   **Click-and-collect ready**: Capture when order is ready for pickup
*   **Completed orders**: Capture for immediately completed orders

### Example Scenarios

**Scenario 1: Single Payment** Order total $100, one payment with $100 authorized. Capture captures the full $100.

**Scenario 2: Multi-Payment with Priority** Order has Payment A (priority 1, $50 auth) and Payment B (priority 10, $100 auth). For a $75 capture, Payment A is captured first ($50), then Payment B ($25).

**Scenario 3: Partial Shipment** Order splits into two shipments. First shipment ($60) captures $60. Second shipment ($40) captures remaining $40.

**Scenario 4: Zero-Total Order** Order total is $0 (fully discounted). Returns warning with no capture needed.

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| No active payments | Error (cancels workflow) | No |
| No active payments + AllowCompleteWithoutPayment | Warning | Yes |
| Already fully captured | Warning | Yes |
| Shipment already partially captured | Error | No |
| No released shipments | Error | No |
| Insufficient authorization | Error | No |
| Payment provider failure | Error | No |
| No payment service configured | Warning | Yes |

## Related Steps

*   [Authorize Payment](authorize-payment.md) - Creates the authorization this captures
*   [Cancel Payments](cancel-payments.md) - Voids uncaptured authorizations
*   [Try Release Remaining Auth](try-release-remaining-auth.md) - Releases unused auth after partial capture
