# Customer Club Calculate And Update Tier For Member

Source: https://docs.omnium.no/docs/Order/workflow-steps/customers/customer-club-calculate-and-update-tier-for-member

> Calculate and update the loyalty tier for a customer club member.

## Overview

The **Customer Club Calculate And Update Tier For Member** step calculates the appropriate loyalty tier for a customer based on their activity and updates their membership level accordingly.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `CustomerClubCalculateAndUpateTierForMember` |
| **Group** | Customers |
| **Applicable Statuses** | New |

## Configuration Properties

This step has no configurable properties.

## Behavior

### What It Does

1.  Skips execution in test mode
2.  Retrieves the customer's club membership and activity history
3.  Evaluates customer's activity against tier thresholds
4.  Updates customer's tier level if qualified for upgrade/downgrade
5.  Returns result invisibly (no UI notification)

### Prerequisites

*   Customer must be a club member
*   Loyalty tiers must be configured with qualification criteria

### Side Effects

*   Customer's tier level may be updated
*   Tier-related benefits may change

## Business Cases

### When to Use

*   **Tier progression**: Upgrade customers when they qualify for higher tiers
*   **New order evaluation**: Check tier status when new orders are placed
*   **Benefit unlocking**: Automatically apply tier benefits to orders

### Example Scenarios

**Scenario 1: Tier Upgrade** Customer's order pushes them over Silver tier threshold. Tier updated to Silver.

**Scenario 2: No Change** Customer activity doesn't qualify for tier change. No update made.

**Scenario 3: Non-Member** Customer is not a club member. No tier calculation performed.

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| Test mode | Success (skipped) | Yes |
| Tier updated | Success | Yes |
| No tier change | Success | Yes |
| Non-member | Success | Yes |

## Related Steps

*   [Customer Club Calculate New Points On Hold](customer-club-calculate-new-points-on-hold.md) - Calculate loyalty points
*   [Get or Create Customer From Order](get-or-create-customer-from-order.md) - Create/update customer records
