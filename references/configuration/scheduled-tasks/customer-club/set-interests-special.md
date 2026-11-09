# Set Interests Special

Source: https://docs.omnium.no/docs/configuration/scheduled-tasks/customer-club/set-interests-special

> Automatically assign special interests to new customer club members based on their registration store

## Overview

This task automatically assigns predefined interests to new customer club members based on which store they registered at. This enables store-specific marketing segmentation and personalized communications.

## Identifier

| Property | Value |
| --- | --- |
| **Implementation Type** | `CustomerClubSetInterestsSpecialScheduledTask` |
| **Group** | Customer Club |
| **Type** | Delta |
| **Manual** | Yes (requires explicit configuration) |

* * *

## When to Use

Enable this task when you need:

*   Store-based member segmentation
*   Automatic interest tagging for new members
*   Region or brand-specific marketing lists
*   Personalized communication targeting

* * *

## Configuration Properties

### Required Settings

| Setting | Location | Description |
| --- | --- | --- |
| `IsEnabled` | `CustomerClubSettings` | Must be `true` |
| `StoresAndSpecialInterests` | `CustomerClubSettings.Properties` | Mapping of stores to interests |

### Configuration Format

The `StoresAndSpecialInterests` property uses a pipe-separated format:

```
StoreId1:Interest1,Interest2|StoreId2:Interest3,Interest4
```

**Example:**

```
21:EuroNo,ShoeGall|22:EuroNo,ShoeGall|51:Premium
```

This assigns:

*   Store 21 members get interests "EuroNo" and "ShoeGall"
*   Store 22 members get interests "EuroNo" and "ShoeGall"
*   Store 51 members get interest "Premium"

* * *

## Behavior

### What It Does

1.  Parses the store-to-interests mapping from configuration
2.  Finds new members (registered since last run) from configured stores
3.  For each matching member:
    *   Checks if interests are already assigned
    *   Adds missing interests to the member's interest list
4.  Updates member records with new interests

### Interest Assignment

*   Interests are additive (won't remove existing interests)
*   Only adds interests that aren't already present
*   Processes members from configured stores only

### Prerequisites

*   Customer Club must be enabled
*   `StoresAndSpecialInterests` must be properly formatted in Properties

### Side Effects

*   Updates member interest lists
*   Does not remove existing interests

* * *

## Example Configuration

```json
{
    "ImplementationType": "CustomerClubSetInterestsSpecialScheduledTask",
    "Schedule": "0 4 * * *",
    "IsDisabled": false
}
```

* * *

## Recommended Schedule

Run daily during off-peak hours (`0 4 * * *` - 4:00 AM) to process new registrations from the previous day.

* * *

## Related Tasks

*   [Newsletter](newsletter.md) - Uses interests for segmentation
