# Delete Historical Opening Hours

Source: https://docs.omnium.no/docs/configuration/scheduled-tasks/stores/delete-historical-opening-hours

> Remove additional opening hours entries that are past their date

## Overview

This task removes historical additional opening hours from stores. Additional opening hours are typically used for holidays, special events, or temporary schedule changes. Once these dates have passed by a configured threshold, the entries are removed to keep store data clean and efficient.

## Identifier

| Property | Value |
| --- | --- |
| **Implementation Type** | `DeleteHistoricalAdditionalOpeningHoursScheduledTask` |
| **Group** | Stores |
| **Type** | Delta |

* * *

## When to Use

Enable this task when you need:

*   Cleanup of old holiday opening hours
*   Removal of past special event schedules
*   Maintenance of store data efficiency
*   Prevention of data accumulation from temporary schedule changes

* * *

## Configuration Properties

This task requires configuration in tenant settings:

| Setting | Location | Description |
| --- | --- | --- |
| `deleteAdditionalOpeningHoursThreshold` | `storeSettings.deleteAdditionalOpeningHoursThreshold` | Number of days after which historical opening hours are deleted |

If this setting is not configured or is set to 0 or less, the task will complete successfully without processing any stores.

* * *

## Behavior

### What It Does

1.  Reads the `deleteAdditionalOpeningHoursThreshold` from tenant settings
2.  Calculates the cutoff date (current date minus threshold days)
3.  Queries for stores that have additional opening hours
4.  For each store, removes opening hours entries older than the cutoff date
5.  Updates stores that had entries removed
6.  Reports the number of stores updated

### Prerequisites

*   `storeSettings.deleteAdditionalOpeningHoursThreshold` must be configured with a positive value
*   Store search service must be operational
*   Store service must be operational

### Side Effects

*   Removes additional opening hours entries from store records
*   Historical opening hours data will no longer be available
*   Does not affect regular weekly opening hours

* * *

## Example Configuration

First, ensure tenant settings include the threshold:

```json
{
    "storeSettings": {
        "deleteAdditionalOpeningHoursThreshold": 30
    }
}
```

Then configure the scheduled task:

```json
{
    "ImplementationType": "DeleteHistoricalAdditionalOpeningHoursScheduledTask",
    "Schedule": "0 3 * * 0",
    "IsDisabled": false
}
```

* * *

## Recommended Schedule

Run weekly during off-peak hours (`0 3 * * 0` - 3 AM Sunday). Additional opening hours accumulate slowly, so weekly cleanup is sufficient for most scenarios.

* * *

## Related Tasks

This task works independently to maintain store data hygiene.
