# Remove Authorization Expires

Source: https://docs.omnium.no/docs/Order/workflow-steps/payment/remove-authorization-expires

> Clear payment authorization expiration dates after capture.

## Overview

The **Remove Authorization Expires** step clears authorization expiration dates from payments. This should be done after capture when the expiration is no longer relevant.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `RemoveAuthorizationExpires` |
| **Group** | Payments |
| **Applicable Statuses** | Ship, PickedUp, Completed |

## Configuration Properties

This step has no configurable properties.

## Behavior

### What It Does

1.  Validates order has payments
2.  Clears expiration dates from payment records
3.  Removes expiration dates from payment records

### Prerequisites

*   Order must have at least one payment

### Side Effects

*   Clears authorization expiration dates from payments
*   Removes orders from "expiring soon" views
*   This step is invisible (doesn't show in workflow history)

## Business Cases

### When to Use

*   **Post-capture cleanup**: Remove irrelevant expiration after payment is captured
*   **Dashboard accuracy**: Keep expiration views showing only relevant orders

### Example Scenarios

**Scenario 1: After Capture** Order captured and shipped. Step removes the authorization expiration date since capture has completed.

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| No payments | Warning | Yes |
| Successful | Success (invisible) | Yes |

## Related Steps

*   [Set Authorization Expires](set-authorization-expires.md) - Sets the expiration this step removes
*   [Capture Payments](capture-payments.md) - Should be done before this step
