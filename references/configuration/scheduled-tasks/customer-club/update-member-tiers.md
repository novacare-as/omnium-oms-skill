# Update Member Tiers

Source: https://docs.omnium.no/docs/configuration/scheduled-tasks/customer-club/update-member-tiers

> Give customer club members a tier from what they bought for in the qualifying period, and keep the tiers up to date

## Overview

This task gives each customer club member a tier, such as Silver or Gold, from what the member bought for in the qualifying period. It updates the members whose tier can have changed since the last run.

For how tiers work and how to set them up, see [Member tiers](../../../Customer/customer-club.md#member-tiers).

## Identifier

| Property | Value |
| --- | --- |
| **Implementation Type** | `CustomerClubTierScheduledTask` |
| **Group** | Customer Club |
| **Type** | Delta |

* * *

## When to Use

Schedule this task when you turn on **Enable tiers** in the customer club settings. Without it, no member gets a tier.

* * *

## Configuration Properties

### Required Settings

| Setting | Location | Description |
| --- | --- | --- |
| `IsEnabled` | `CustomerClubSettings` | The customer club must be on |
| `CustomerClubTierSettings.IsEnabled` | `CustomerClubSettings` | **Enable tiers** on the **Tiers** tab |
| `CustomerClubTierSettings.Programs` | `CustomerClubSettings` | At least 1 program with tiers |

* * *

## Behavior

### What It Does

Each run updates the tier of:

1.  Members with orders that changed since the last run
2.  Members whose membership changed since the last run
3.  Members with orders that left the qualifying period since the last run

The first run updates every member. So does the first run after a change to the programs, the tiers, or the market groups the programs use. A change to only the **Bonus %** of a tier does not.

A member loses their tier when they no longer reach the lowest tier, when no program covers their market, or when the membership has ended.

### Prerequisites

*   The customer club is on
*   **Enable tiers** is on, with at least 1 program

When the customer club or tiers are off, or there is no program, the run ends with a warning and changes nothing. The first run after tiers are turned back on updates every member.

### Side Effects

*   Updates the tier on customer club members
*   Removes the tier from members that no longer qualify

The run result says whether it was a full run, and how many members were checked, got a new or updated tier, or lost their tier.

* * *

## Example Configuration

```json
{
    "ImplementationType": "CustomerClubTierScheduledTask",
    "Schedule": "0 * * * *",
    "IsDisabled": false
}
```

* * *

## Recommended Schedule

Run every hour (`0 * * * *`), so a member gets a new tier soon after a purchase.

* * *

## Related Tasks

*   [Birthday Points](birthday-points.md) - Award birthday points
*   [Delete Expired Points](delete-expired-points.md) - Clean up expired points
