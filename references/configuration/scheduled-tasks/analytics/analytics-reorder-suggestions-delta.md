# Analytics Reorder Suggestions Delta

Source: https://docs.omnium.no/docs/configuration/scheduled-tasks/analytics/analytics-reorder-suggestions-delta

> Update reorder suggestions based on recent inventory changes

## Overview

This task incrementally updates product reorder suggestions based on inventory changes since the last run. Unlike the full reorder suggestions task, this only processes products with changed inventory, making it efficient for frequent execution.

## Identifier

| Property | Value |
| --- | --- |
| **Implementation Type** | `AnalyticsReorderSuggestionsDeltaScheduledTask` |
| **Group** | Analytics |
| **Type** | Delta |

* * *

## When to Use

Enable this task when you need:

*   Near real-time reorder suggestion updates
*   Quick response to inventory changes
*   Efficient incremental suggestion updates
*   Complement to daily full recalculation

* * *

## Configuration Properties

This task has no configurable properties.

* * *

## Behavior

### What It Does

1.  Identifies products with inventory changes since the last run
2.  Reads the inventory transactions of the sales period for the changed SKUs of each changed warehouse, to update the [time in stock](analytics-reorder-suggestions.md#time-in-stock)
3.  Recalculates reorder suggestions only for affected products
4.  Updates the suggestions index with new calculations
5.  Reports the count of updated suggestions

### Prerequisites

*   The full reorder suggestions task should run periodically to establish baseline data
*   Inventory tracking must be active

### Side Effects

*   Updates existing reorder suggestions for products with inventory changes
*   More efficient than full recalculation but may miss some edge cases

* * *

## Example Configuration

```json
{
    "ImplementationType": "AnalyticsReorderSuggestionsDeltaScheduledTask",
    "Schedule": "*/30 * * * *",
    "IsDisabled": false
}
```

* * *

## Recommended Schedule

Run every 30 minutes (`*/30 * * * *`) to keep reorder suggestions current with inventory movements. Combine with a daily full recalculation for best results.

* * *

## Related Tasks

*   [Analytics Reorder Suggestions](analytics-reorder-suggestions.md) - Full recalculation
*   [Analytics Inventory](analytics-inventory.md) - Inventory analytics
