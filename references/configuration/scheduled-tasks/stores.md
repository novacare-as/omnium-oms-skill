# Store Scheduled Tasks

Source: https://docs.omnium.no/docs/configuration/scheduled-tasks/stores

> Background jobs for store data maintenance and cleanup

The Store scheduled tasks handle maintenance of store-related data, including cleanup of historical information that is no longer needed.

## Available Tasks

| Task | Description | Type |
| --- | --- | --- |
| [Delete Historical Opening Hours](stores/delete-historical-opening-hours.md) | Remove additional opening hours entries that are past their date | Delta |

* * *

## Overview

Store tasks help maintain clean and efficient store data:

1.  **Data Cleanup** - Remove historical entries that are no longer relevant

* * *

## Common Use Cases

### Opening Hours Maintenance

Use Delete Historical Opening Hours to remove old additional opening hours entries (holidays, special events) that have passed, keeping store data clean and queries efficient.

* * *

## Configuration Requirements

Store cleanup tasks require configuration in tenant settings:

*   `storeSettings.deleteAdditionalOpeningHoursThreshold` - Days after which historical opening hours are deleted

* * *

## Recommended Schedules

| Task Type | Recommended Schedule | Reason |
| --- | --- | --- |
| Cleanup tasks | `0 3 * * 0` (weekly at 3 AM Sunday) | Low-impact maintenance during off-peak |
