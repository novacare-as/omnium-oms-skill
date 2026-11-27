# Customer Club Move From On Hold To Earned Points

Source: https://docs.omnium.no/docs/Order/workflow-steps/customers/customer-club-move-from-on-hold-to-earned-points

> Move loyalty points from on-hold status to earned status when order completes.

## Overview

The **Customer Club Move From On Hold To Earned Points** step moves previously calculated loyalty points from "on hold" to "earned" status when an order is completed. This finalizes the point award for the customer.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `CustomerClubMoveFromOnHoldToEarnedPoints` |
| **Group** | Customers |
| **Applicable Statuses** | Ship, ReadyForPickup, Completed |

## Configuration Properties

This step has no configurable properties.

## Behavior

### What It Does

1.  Skips execution in test mode
2.  Retrieves points that are currently on hold for the order
3.  Moves points from on-hold to earned for the order
4.  Updates customer's available point balance
5.  Returns result invisibly (no UI notification)

### Prerequisites

*   Points must have been previously placed on hold
*   Customer must be a club member

### Side Effects

*   Points moved from on-hold to earned status
*   Customer's available points balance updated

## Business Cases

### When to Use

*   **Order completion**: Finalize points when order ships or is picked up
*   **Loyalty fulfillment**: Make points available for redemption
*   **Shipment-level points**: Award points per shipment completion

### Example Scenarios

**Scenario 1: Points Moved** 100 points on hold for order. Order ships. 100 points moved to earned.

**Scenario 2: Partial Shipment** Order has multiple shipments. Points moved when each shipment completes.

**Scenario 3: No Points On Hold** Order has no points on hold (non-member or points already moved). No action taken.

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| Test mode | Success (skipped) | Yes |
| Points moved | Success | Yes |
| No points on hold | Success | Yes |

## Related Steps

*   [Customer Club Calculate New Points On Hold](customer-club-calculate-new-points-on-hold.md) - Calculate initial points
*   [Customer Club Calculate Points On Hold And Move To Earned](customer-club-calculate-points-on-hold-and-move-to-earned.md) - Combined calculation and move
