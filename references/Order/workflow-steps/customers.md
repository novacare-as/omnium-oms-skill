# Customer Steps

Source: https://docs.omnium.no/docs/Order/workflow-steps/customers

> Workflow steps for customer management and loyalty programs.

## Overview

Customer steps manage customer records and loyalty program operations during order processing. They handle customer creation, updates, and loyalty point calculations.

## Available Steps

| Step | Key | Description |
| --- | --- | --- |
| [Get or Create Customer From Order](customers/get-or-create-customer-from-order.md) | `GetOrCreateCustomerFromOrder` | Create or update customer from order |
| [Customer Club Calculate New Points On Hold](customers/customer-club-calculate-new-points-on-hold.md) | `CustomerClubCalculateNewPointsOnHold` | Calculate points and place on hold |
| [Customer Club Move From On Hold To Earned Points](customers/customer-club-move-from-on-hold-to-earned-points.md) | `CustomerClubMoveFromOnHoldToEarnedPoints` | Move held points to earned |
| [Customer Club Calculate Points On Hold And Move To Earned](customers/customer-club-calculate-points-on-hold-and-move-to-earned.md) | `CustomerClubCalculatePointsOnHoldAndMoveToEarned` | Calculate and earn points in one step |
| [Customer Club Cancel New Points On Hold](customers/customer-club-cancel-new-points-on-hold.md) | `CustomerClubCancelNewPointsOnHold` | Cancel held points on order cancellation |
| [Customer Club Calculate And Update Tier For Member](customers/customer-club-calculate-and-update-tier-for-member.md) | `CustomerClubCalculateAndUpateTierForMember` | Update customer loyalty tier |

## Common Use Cases

### Customer Management

Create or update customer records from orders:

```
New Order → GetOrCreateCustomerFromOrder → Continue
```

### Loyalty Points Flow

Standard loyalty point lifecycle:

```
New Order → CustomerClubCalculateNewPointsOnHold
↓
Completed → CustomerClubMoveFromOnHoldToEarnedPoints
```

### Cancellation Handling

Cancel points when orders are cancelled:

```
OrderCanceled → CustomerClubCancelNewPointsOnHold
```

### Tier Management

Update tier status on new orders:

```
New Order → CustomerClubCalculateAndUpateTierForMember
```

## Loyalty Points Lifecycle

The customer club steps support a two-phase point awarding process:

1.  **On Hold**: Points calculated when order is placed but not yet available
2.  **Earned**: Points moved to earned when order completes, available for redemption

This prevents customers from earning and spending points on orders that may be cancelled.

## Configuration

Customer operations can be configured via tenant settings:

*   **B2B/B2C creation**: Enable/disable customer creation by type
*   **Loyalty rules**: Configure point earning rates and tier thresholds
*   **Connector**: Use specific customer service connector
