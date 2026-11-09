# Check Personal Discount Coupons

Source: https://docs.omnium.no/docs/Order/workflow-steps/payment/check-personal-discount-coupons

> Validate personal discount coupons with internal and external coupon providers.

## Overview

The **Check Personal Discount Coupons** step validates that any personal discount coupons used on the order are valid and available for the customer. It checks both Omnium's internal validation and external promotion providers.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `CheckPersonalDiscountCoupons` |
| **Group** | Payments |
| **Applicable Statuses** | New, InProgress, Completed, OrderCanceled, Ship, Returned, ReadyForPickup |

## Configuration Properties

This step uses the workflow step's `Connector` property to determine which external promotion provider to use.

## Behavior

### What It Does

1.  Validates personal discount coupons with the configured connector
2.  Validates coupon eligibility for the customer
3.  Removes or adds order error based on validation result

### Prerequisites

*   Order must have personal discount coupons applied
*   Promotion provider connector must be configured (if using external validation)

### Side Effects

*   Adds error "Invalid discount coupon" if validation fails
*   Removes error if validation passes
*   This step is invisible (doesn't show in workflow history)

## Business Cases

### When to Use

*   **Coupon validation**: Ensure coupons are still valid at order processing time
*   **External systems**: Validate against external loyalty/promotion systems
*   **Fraud prevention**: Catch invalid or already-used personal coupons

### Example Scenarios

**Scenario 1: Valid Coupon** Customer has a valid 10% personal coupon. Validation passes, error removed.

**Scenario 2: Invalid Coupon** Coupon was already used or expired. Validation fails, error added to order.

**Scenario 3: External Validation** Connector set to "Voyado". Step validates coupon with Voyado API.

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| Valid coupon | Success (invisible) | Yes |
| Invalid coupon | Error | Depends on StopOnError |
| Invalid coupon + StopOnError | Error | No |
| External provider failure | Error | Depends on StopOnError |

## Related Steps

*   [Try Redeem Personal Discount Coupons](try-redeem-personal-discount-coupons.md) - Redeems validated coupons
*   [Check and Update Coupon Usage](check-and-update-coupon-usage.md) - Updates generic coupon usage
