# Create Replacement Subscription Orders

Source: https://docs.omnium.no/docs/Order/workflow-steps/subscriptions/create-replacement-subscription-orders

> Automatically create replacement orders when subscription orders are cancelled.

## Overview

The **Create Replacement Subscription Orders** step automatically creates replacement pending orders when a subscription's pending order is cancelled. This ensures active subscriptions continue to generate orders.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `CreateReplacementSubscriptionOrders` |
| **Group** | Subscriptions |
| **Applicable Statuses** | OrderCanceled, OrderCanceledByCustomer, OrderCanceledByStore |

## Configuration Properties

This step has no configurable properties.

## Behavior

### What It Does

1.  Returns warning if order is null
2.  Skips execution in test mode
3.  Checks if the cancelled order belongs to an active subscription
4.  Creates a replacement pending order if needed
5.  If replacement created, returns success
6.  If no replacement needed (not a subscription order or subscription inactive), returns warning

### Prerequisites

*   Order must be associated with an active subscription
*   Subscription must be configured to create replacement orders

### Side Effects

*   New pending order created for the subscription
*   Subscription continues its delivery schedule

## Business Cases

### When to Use

*   **Subscription continuity**: Ensure cancelled orders don't break subscription cycle
*   **Inventory issues**: Automatically reschedule when orders cancelled due to stock
*   **Customer service**: Allow order cancellation without ending subscription

### Example Scenarios

**Scenario 1: Replacement Created** Subscription order cancelled due to inventory issue. New pending order created for next delivery window.

**Scenario 2: No Replacement Needed** Cancelled order is not part of an active subscription. No replacement created.

**Scenario 3: Subscription Inactive** Order was for a subscription that has been cancelled. No replacement created.

**Scenario 4: Test Mode** Running in test mode. Replacement creation skipped, success returned.

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| Test mode | Success (skipped) | Yes |
| Replacement created | Success | Yes |
| No replacement needed | Warning | Yes |
| Order is null | Warning | Yes |
| Exception | Warning | Yes |

## Related Steps

*   [Create Subscriptions](create-subscriptions.md) - Create initial subscriptions
