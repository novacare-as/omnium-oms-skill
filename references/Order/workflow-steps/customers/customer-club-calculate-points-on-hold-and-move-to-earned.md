# Customer Club Calculate Points On Hold And Move To Earned

Source: https://docs.omnium.no/docs/Order/workflow-steps/customers/customer-club-calculate-points-on-hold-and-move-to-earned

> Calculate loyalty points and immediately move them to earned status in one step.

## Overview

The **Customer Club Calculate Points On Hold And Move To Earned** step combines point calculation and earning into a single operation. It calculates points for an order and immediately moves them to earned status, useful for workflows where points should be awarded at completion without a prior hold.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `CustomerClubCalculatePointsOnHoldAndMoveToEarned` |
| **Group** | Customers |
| **Applicable Statuses** | Completed |

## Configuration Properties

This step has no configurable properties.

## Behavior

### What It Does

1.  Skips execution in test mode
2.  Calculates points based on order/shipment value
3.  Immediately moves points to earned status
4.  Updates customer's available point balance
5.  Returns result invisibly (no UI notification)

### Prerequisites

*   Customer must be a club member
*   Loyalty program must be configured

### Side Effects

*   Points calculated and immediately added to earned balance
*   Customer club member record updated

## Business Cases

### When to Use

*   **Simplified workflows**: When you don't need separate hold/earn phases
*   **Post-completion points**: Award points only at final completion
*   **Legacy compatibility**: Single-step point awarding

### Example Scenarios

**Scenario 1: Points Awarded** Order completes. 100 points calculated and immediately earned.

**Scenario 2: Shipment-Based** Called with shipment context. Points calculated for that shipment only.

**Scenario 3: Non-Member** Customer not a club member. No points awarded.

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| Test mode | Success (skipped) | Yes |
| Points calculated and earned | Success | Yes |
| Non-member | Success (no points) | Yes |

## Related Steps

*   [Customer Club Calculate New Points On Hold](customer-club-calculate-new-points-on-hold.md) - Calculate and hold points separately
*   [Customer Club Move From On Hold To Earned Points](customer-club-move-from-on-hold-to-earned-points.md) - Move held points to earned
