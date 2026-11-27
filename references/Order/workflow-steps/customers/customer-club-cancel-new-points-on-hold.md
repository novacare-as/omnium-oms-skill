# Customer Club Cancel New Points On Hold

Source: https://docs.omnium.no/docs/Order/workflow-steps/customers/customer-club-cancel-new-points-on-hold

> Cancel loyalty points that were placed on hold when an order is cancelled.

## Overview

The **Customer Club Cancel New Points On Hold** step cancels loyalty points that were previously placed on hold when an order is cancelled. This ensures customers don't receive points for orders that weren't fulfilled.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `CustomerClubCancelNewPointsOnHold` |
| **Group** | Customers |
| **Applicable Statuses** | OrderCanceled |

## Configuration Properties

This step has no configurable properties.

## Behavior

### What It Does

1.  Skips execution in test mode
2.  Identifies any points that were on hold for the cancelled order
3.  Removes those on-hold points from the customer's account
4.  Updates customer's point records
5.  Returns result invisibly (no UI notification)

### Prerequisites

*   Points must have been previously placed on hold for the order

### Side Effects

*   On-hold points for the order are cancelled/removed
*   Customer club member record updated

## Business Cases

### When to Use

*   **Order cancellation**: Clean up held points when orders are cancelled
*   **Fraud prevention**: Prevent point accumulation from cancelled orders
*   **Accurate balances**: Maintain correct point totals for customers

### Example Scenarios

**Scenario 1: Points Cancelled** Order with 100 points on hold is cancelled. 100 on-hold points removed.

**Scenario 2: No Points On Hold** Order had no points on hold. No action taken.

**Scenario 3: Partial Cancellation** Order line cancelled but order continues. May need separate handling.

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| Test mode | Success (skipped) | Yes |
| Points cancelled | Success | Yes |
| No points on hold | Success | Yes |

## Related Steps

*   [Customer Club Calculate New Points On Hold](customer-club-calculate-new-points-on-hold.md) - Calculate initial points
*   [Customer Club Move From On Hold To Earned Points](customer-club-move-from-on-hold-to-earned-points.md) - Move points to earned (for completed orders)
