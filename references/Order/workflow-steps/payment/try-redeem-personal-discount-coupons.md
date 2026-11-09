# Try Redeem Personal Discount Coupons

Source: https://docs.omnium.no/docs/Order/workflow-steps/payment/try-redeem-personal-discount-coupons

> Redeem personal discount coupons with internal and external coupon providers.

## Overview

The **Try Redeem Personal Discount Coupons** step marks personal discount coupons as redeemed/used. This should be called after validation and when the order is confirmed to proceed.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `TryRedeemPersonalDiscountCoupons` |
| **Group** | Payments |
| **Applicable Statuses** | New, InProgress, Completed, OrderCanceled, Ship, Returned, ReadyForPickup |

## Configuration Properties

This step uses the workflow step's `Connector` property to determine which external promotion provider to use.

## Behavior

### What It Does

1.  Redeems personal discount coupons with the configured connector
2.  Marks coupons as used in Omnium and external systems
3.  Prevents the coupon from being used again

### Prerequisites

*   Order must have personal discount coupons applied
*   Coupons should be validated first

### Side Effects

*   Marks coupons as redeemed in Omnium
*   Marks coupons as redeemed in external promotion provider
*   This step is invisible (doesn't show in workflow history)

## Business Cases

### When to Use

*   **After validation**: Redeem coupons once order is confirmed
*   **Prevent reuse**: Ensure single-use coupons can't be used again
*   **External sync**: Update external loyalty systems

### Example Scenarios

**Scenario 1: Successful Redemption** Personal coupon validated and order confirmed. Step redeems the coupon.

**Scenario 2: External System** Connector set to "Voyado". Step marks coupon used in Voyado system.

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| Redemption successful | Success (invisible) | Yes |
| Redemption failed | Error | Yes (doesn't cancel) |

## Related Steps

*   [Check Personal Discount Coupons](check-personal-discount-coupons.md) - Validates before redemption
*   [Check and Update Coupon Usage](check-and-update-coupon-usage.md) - Updates generic coupon usage
