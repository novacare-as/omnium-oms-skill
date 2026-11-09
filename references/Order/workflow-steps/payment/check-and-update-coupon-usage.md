# Check and Update Coupon Usage

Source: https://docs.omnium.no/docs/Order/workflow-steps/payment/check-and-update-coupon-usage

> Marks single-use promotion coupons as used in Omnium's internal tracking.

## Overview

The **Check and Update Coupon Usage** step checks promotions for single-use coupons (`CanOnlyBeUsedOnce`) and marks them as used.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `CheckAndUpdateCouponUsage` |
| **Group** | Payments |
| **Applicable Statuses** | New |

## Configuration Properties

This step has no configurable properties.

## Behavior

### What It Does

1.  Iterates through discounts on the order form and shipments
2.  Looks up each discount's promotion and finds matching coupons in `AdditionalCoupons`
3.  If a single-use coupon (`CanOnlyBeUsedOnce`) has not been used, marks it as `Used = true`
4.  **Validates** that single-use coupons haven't already been used — if so, adds an error to the order

### Prerequisites

*   Order must have coupon codes applied (`OrderForm.CouponCodes`)
*   Promotions with `AdditionalCoupons` must exist for the applied discount codes

### Side Effects

*   Marks single-use coupons as used on the promotion
*   Adds an order error if a single-use coupon was already used
*   This step is invisible (doesn't show in workflow history)

## Business Cases

### When to Use

*   **Single-use coupons**: Ensure a coupon marked `CanOnlyBeUsedOnce` cannot be reused
*   **Campaign tracking**: Track which coupons have been redeemed

### Example Scenarios

**Scenario 1: Single-Use Coupon** Order uses coupon "WELCOME10" which has `CanOnlyBeUsedOnce = true`. The step marks it as `Used = true` on the promotion, preventing future orders from using it.

**Scenario 2: Already Used** A single-use coupon "WELCOME10" has already been marked as used. The step adds an error to the order indicating the coupon was used multiple times.

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| Update successful | Success (invisible) | Yes |
| Update failed | Error | Yes (doesn't cancel) |

## Related Steps

*   [Check Personal Discount Coupons](check-personal-discount-coupons.md) - Validates personal coupons
*   [Try Redeem Personal Discount Coupons](try-redeem-personal-discount-coupons.md) - Redeems personal coupons
