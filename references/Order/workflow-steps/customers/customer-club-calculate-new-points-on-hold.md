# Customer Club Calculate New Points On Hold

Source: https://docs.omnium.no/docs/Order/workflow-steps/customers/customer-club-calculate-new-points-on-hold

> Calculate loyalty points for a new order and place them on hold.

## Overview

The **Customer Club Calculate New Points On Hold** step calculates loyalty points earned from a new order and places them in an "on hold" status. Points remain on hold until the order is completed.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `CustomerClubCalculateNewPointsOnHold` |
| **Group** | Customers |
| **Applicable Statuses** | New |

## Configuration Properties

This step has no configurable properties.

## Behavior

### What It Does

1.  Skips execution in test mode
2.  Calculates points to be placed on hold based on order total and configured earning rules
3.  Places calculated points in "on hold" status for the customer
4.  Returns result invisibly (no UI notification)

### Prerequisites

*   Customer must be a club member
*   Loyalty program must be configured with point earning rules

### Side Effects

*   Points calculated and placed on hold for customer
*   Customer club member record updated

## Business Cases

### When to Use

*   **Loyalty programs**: Award points when orders are placed
*   **Point reservation**: Hold points until order completion
*   **Fraud prevention**: Prevent point redemption on cancelled orders

### Example Scenarios

**Scenario 1: Points Calculated** Order total $100, earning rate 1 point per $1. 100 points placed on hold.

**Scenario 2: Non-Member** Customer is not a club member. No points calculated.

**Scenario 3: Test Mode** Running in test mode. Point calculation skipped, success returned.

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| Test mode | Success (skipped) | Yes |
| Points calculated | Success | Yes |
| Non-member | Success (no points) | Yes |

## Related Steps

*   [Customer Club Move From On Hold To Earned Points](customer-club-move-from-on-hold-to-earned-points.md) - Move points to earned
*   [Customer Club Cancel New Points On Hold](customer-club-cancel-new-points-on-hold.md) - Cancel held points
